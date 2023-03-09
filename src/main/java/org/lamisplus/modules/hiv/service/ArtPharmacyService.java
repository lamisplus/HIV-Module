package org.lamisplus.modules.hiv.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.util.Log;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.IllegalTypeException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.hiv.domain.dto.*;
import org.lamisplus.modules.hiv.domain.entity.ArtPharmacy;
import org.lamisplus.modules.hiv.domain.entity.Regimen;
import org.lamisplus.modules.hiv.repositories.ArtPharmacyRepository;
import org.lamisplus.modules.hiv.repositories.RegimenRepository;
import org.lamisplus.modules.patient.domain.dto.EncounterResponseDto;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.domain.entity.Visit;
import org.lamisplus.modules.patient.repository.PersonRepository;
import org.lamisplus.modules.patient.repository.VisitRepository;
import org.lamisplus.modules.patient.service.EncounterService;
import org.lamisplus.modules.patient.service.VisitService;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ArtPharmacyService {
	private final ArtPharmacyRepository artPharmacyRepository;
	private final PersonRepository personRepository;
	private final RegimenRepository regimenRepository;
	private final CurrentUserOrganizationService organizationUtil;
	private final HandleHIVVisitEncounter handleHIVisitEncounter;
	
	private final HIVStatusTrackerService hIVStatusTrackerService;
	
	private final EncounterService encounterService;
	private final VisitService visitService;
	
	private final VisitRepository visitRepository;
	
	private static final String REGIMEN = "regimens";
	
	public RegisterArtPharmacyDTO registerArtPharmacy(RegisterArtPharmacyDTO dto) throws IOException {
		checkIfSelectRegimenIsAlreadyDispensed(dto);
		Visit visit = handleHIVisitEncounter.processAndCreateVisit(dto.getPersonId(), dto.getVisitDate());
		dto.setVisitId(visit.getId());
//		if (dto.getVisitId() == null)
//			throw new IllegalTypeException(Visit.class, "visit date", "kindly create a clinic visit for this patient");
		
		ArtPharmacy artPharmacy = convertRegisterDtoToEntity(dto);
		artPharmacy.setUuid(UUID.randomUUID().toString());
		artPharmacy.setVisit(visit);
		artPharmacy.setArchived(0);
		ArtPharmacy save = artPharmacyRepository.save(artPharmacy);
		processAndSaveHIVStatus(dto);
		processAndCheckoutHivVisit(dto.getPersonId(), visit);
		return convertEntityToRegisterDto(save);
	}
	
	private void checkIfSelectRegimenIsAlreadyDispensed(RegisterArtPharmacyDTO dto) {
		Set<RegimenRequestDto> regimens = dto.getRegimen();
		if(!regimens.isEmpty()){
			System.out.println("I am in check 1  size " + regimens.size());
			Person person = getPerson(dto.getPersonId());
			regimens.forEach(regimen -> {
				LocalDate visitDate = dto.getVisitDate();
				if(visitDate != null){
					System.out.println("visit date  " + visitDate);
					Long count = artPharmacyRepository.getCountForAnAlreadyDispenseRegimen(person.getUuid(),
							regimen.getRegimenId(),
							visitDate);
					System.out.println("count : " + count );
					if(count != null) throw new RecordExistException(Regimen.class, "name", regimen.getRegimenName() + " is already dispensed on this " +
							"date "+ visitDate);
					System.out.println("I am in check 2");
				}
			});
		}
	}
	
	
	private void processAndCheckoutHivVisit(Long personId, Visit visit) {
		List<EncounterResponseDto> nonHIVEncounters =
				encounterService.getAllEncounterByPerson(personId).stream()
						.filter(e -> e.getStatus().equalsIgnoreCase("PENDING")
								&& !(e.getServiceCode().equalsIgnoreCase("hiv-code")))
						.collect(Collectors.toList());
		//log.info("nonHIVEncounters {}", nonHIVEncounters + " visit: " + visit.getId());
		if (nonHIVEncounters.isEmpty()) {
			visitService.checkOutVisitById(visit.getId());
			LocalDateTime visitStartDate = visit.getVisitStartDate();
			visit.setVisitEndDate(visitStartDate);
			visitRepository.save(visit);
		}
	}
	
	public RegisterArtPharmacyDTO updateArtPharmacy(Long id, RegisterArtPharmacyDTO dto) throws IOException {
		ArtPharmacy existArtPharmacy = getArtPharmacy(id);
		ArtPharmacy artPharmacy = convertRegisterDtoToEntity(dto);
		artPharmacy.setId(existArtPharmacy.getId());
		artPharmacy.setPerson(existArtPharmacy.getPerson());
		artPharmacy.setVisit(existArtPharmacy.getVisit());
		artPharmacy.setArchived(0);
		return convertEntityToRegisterDto(artPharmacyRepository.save(artPharmacy));
	}
	
	
	public RegisterArtPharmacyDTO getPharmacyById(Long id) {
		ArtPharmacy artPharmacy = getArtPharmacy(id);
		return getRegisterArtPharmacyDtoWithName(artPharmacy);
		
	}
	
	
	public String deleteById(Long id) {
		ArtPharmacy artPharmacy = getArtPharmacy(id);
		artPharmacy.setArchived(1);
		artPharmacyRepository.save(artPharmacy);
		return "Successful";
		
	}
	
	
	private ArtPharmacy getArtPharmacy(Long id) {
		return artPharmacyRepository
				.findById(id)
				.orElseThrow(() -> getArtPharmacyEntityNotFoundException(id));
	}
	
	public List<RegisterArtPharmacyDTO> getPharmacyByPersonId(Long personId, int pageNo, int pageSize) {
		Person person = getPerson(personId);
		Pageable paging = PageRequest.of(pageNo, pageSize, Sort.by("visitDate").descending());
		Page<ArtPharmacy> artPharmaciesByPerson = artPharmacyRepository.getArtPharmaciesByPersonAndArchived(person, 0, paging);
		if (artPharmaciesByPerson.hasContent()) {
			return artPharmaciesByPerson.getContent().stream().map(this::getRegisterArtPharmacyDtoWithName).collect(Collectors.toList());
		}
		return new ArrayList<>();
	}
	
	
	public Regimen getCurrentRegimenByPersonId(Long personId) {
		Person person = getPerson(personId);
		Optional<Set<Regimen>> regimen =
				artPharmacyRepository.getArtPharmaciesByPersonAndArchived(person, 0)
						.stream().max(Comparator.comparing(ArtPharmacy::getVisitDate))
						.map(ArtPharmacy::getRegimens);
		if (regimen.isPresent()) {
			Set<Regimen> regimen1 = regimen.get();
			Log.info("regimen: {}", regimen1.size());
			Optional<Regimen> currentRegimen =
					regimen1.stream()
							.filter(regimen3 -> regimen3.getRegimenType().getDescription().contains("ART")
									|| regimen3.getRegimenType().getDescription().contains("Third Line"))
							.findAny();
			return currentRegimen.orElse(null);
		} else throw new IllegalArgumentException("No current regimen found");
	}
	
	
	@Nullable
	private RegisterArtPharmacyDTO getRegisterArtPharmacyDtoWithName(ArtPharmacy artPharmacy) {
		try {
			return convertEntityToRegisterDto(artPharmacy);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	
	private ArtPharmacy  convertRegisterDtoToEntity(RegisterArtPharmacyDTO dto) throws JsonProcessingException {
		ArtPharmacy artPharmacy = new ArtPharmacy();
		BeanUtils.copyProperties(dto, artPharmacy);
		Long personId = dto.getPersonId();
		Set<RegimenRequestDto> regimens = dto.getRegimen();
		Person person = getPerson(personId);
		List<ArtPharmacy> existDrugRefills = artPharmacyRepository.getArtPharmaciesByVisitAndPerson(artPharmacy.getVisit(), person);
		if (!existDrugRefills.isEmpty() && dto.getId() == null) {
			throw new IllegalTypeException(ArtPharmacy.class, "visitId", "Regimen is already dispensed for this encounter " + dto.getVisitId());
		}
		Set<Regimen> regimenList = regimens.stream()
				.map(regimenId -> regimenRepository.findById(regimenId.getRegimenId()).orElse(null))
				.collect(Collectors.toSet());
		Optional<RegimenRequestDto> isoniazid = regimens.stream()
				.filter(regimen -> regimen.getRegimenName().contains("Ison"))
				.findFirst();
		artPharmacy.setPerson(person);
		processAndSetIpt(dto.getIptType(), isoniazid, dto.getVisitDate(), artPharmacy);
		artPharmacy.setRegimens(regimenList);
		artPharmacy.setFacilityId(organizationUtil.getCurrentUserOrganization());
		return artPharmacy;
	}
	private void processAndSetIpt(
			String iptType,
			Optional<RegimenRequestDto> isoniazid,
			LocalDate visitDate,
	      ArtPharmacy artPharmacy){
		if(iptType != null && isoniazid.isPresent()) {
			ObjectMapper mapper = new ObjectMapper();
			RegimenRequestDto regimenRequestDto = isoniazid.get();
			IptDto iptDto = IptDto.builder()
					.drugName(regimenRequestDto.getRegimenName())
					.type(iptType)
					.build();
			Integer duration = regimenRequestDto.getDispense();
			if(iptType.contains("INITIATION") &&  duration >= 168) {
				LocalDate  dateCompleted = visitDate.plusDays(168);
				iptDto.setDateCompleted(dateCompleted.toString());
			}
			if(iptType.contains("REFILL")){
				LocalDate  dateCompleted = visitDate.plusDays(duration);
				iptDto.setDateCompleted(dateCompleted.toString());
				Optional<ArtPharmacy> initialIptPharmacy =
						artPharmacyRepository.getInitialIPTWithoutCompletionDate(artPharmacy.getPerson().getUuid());
				if(initialIptPharmacy.isPresent()) {
					ArtPharmacy artPharmacy1 = initialIptPharmacy.get();
					JsonNode ipt = artPharmacy1.getIpt();
					((ObjectNode) ipt).put("dateCompleted", dateCompleted.toString());
					artPharmacy1.setIpt(ipt);
					artPharmacyRepository.save(artPharmacy1);
					
					
				}
				
			}
			JsonNode iptNode = mapper.valueToTree(iptDto);
			artPharmacy.setIpt(iptNode);
		}
	}
	private Person getPerson(Long personId) {
		return personRepository.findById(personId).orElseThrow(() -> getPersonEntityNotFoundException(personId));
	}
	
	private RegisterArtPharmacyDTO convertEntityToRegisterDto(ArtPharmacy entity) throws IOException {
		RegisterArtPharmacyDTO dto = new RegisterArtPharmacyDTO();
		BeanUtils.copyProperties(entity, dto);
		//log.info(" dto 1st:  {}", dto);
		dto.setPersonId(entity.getPerson().getId());
		return dto;
	}
	
	
	private void processAndSetDispenseRegimenInExtra(RegisterArtPharmacyDTO dto, ArtPharmacy artPharmacy) {
		ObjectMapper objectMapper = new ObjectMapper();
		Set<RegimenRequestDto> regimen = dto.getRegimen();
		// find a way to remove duplicates
		ArrayNode regimens = objectMapper.valueToTree(regimen);
		JsonNode extra = dto.getExtra();
		((ObjectNode) extra).set(REGIMEN, regimens);
		artPharmacy.setExtra(extra);
	}
	
	
	@NotNull
	private EntityNotFoundException getArtPharmacyEntityNotFoundException(Long id) {
		return new EntityNotFoundException(ArtPharmacy.class, "id ", "" + id);
	}
	
	@NotNull
	private EntityNotFoundException getPersonEntityNotFoundException(Long personId) {
		return new EntityNotFoundException(Person.class, "id ", "" + personId);
	}
	
	private void processAndSaveHIVStatus(RegisterArtPharmacyDTO dto) {
		HIVStatusTrackerDto statusTracker = new HIVStatusTrackerDto();
		statusTracker.setHivStatus("ART Start");
		statusTracker.setStatusDate(dto.getVisitDate());
		statusTracker.setVisitId(dto.getVisitId());
		statusTracker.setPersonId(dto.getPersonId());
		hIVStatusTrackerService.registerHIVStatusTracker(statusTracker);
	}
	
	public List<PharmacyReport> getReport(Long facilityId){
		return  artPharmacyRepository.getArtPharmacyReport(facilityId);
	}
	
	
}
