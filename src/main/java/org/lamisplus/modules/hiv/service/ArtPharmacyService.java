package org.lamisplus.modules.hiv.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
import org.lamisplus.modules.hiv.utility.Constants;
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

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
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
	@PersistenceContext
	private EntityManager entityManager;


	public RegisterArtPharmacyDTO registerArtPharmacy(RegisterArtPharmacyDTO dto) throws IOException {
		checkIfSelectRegimenIsAlreadyDispensed(dto);
		Visit visit = handleHIVisitEncounter.processAndCreateVisit(dto.getPersonId(), dto.getVisitDate());
		dto.setVisitId(visit.getId());
		
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
			Person person = getPerson(dto.getPersonId());
			regimens.forEach(regimen -> {
				LocalDate visitDate = dto.getVisitDate();
				if(visitDate != null){
					Long count = artPharmacyRepository.getCountForAnAlreadyDispenseRegimen(person.getUuid(),
							regimen.getRegimenId(),
							visitDate);
					if(count != null)
						throw new RecordExistException(Regimen.class, "name", regimen.getRegimenName() + " is already dispensed on this " +
							"date "+ visitDate);
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
		artPharmacy.setLatitude(dto.getLatitude());
		artPharmacy.setLongitude(dto.getLongitude());
		String sourceSupport = dto.getSource() == null || dto.getSource().isEmpty() ? Constants.WEB_SOURCE : Constants.MOBILE_SOURCE;
		artPharmacy.setSource(sourceSupport);
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


	public CurrentRegimenInfoDTO getCurrentRegimenInfo(String personUuid) throws JsonProcessingException {
		String sqlQuery = "SELECT CAST(row_to_json(t) AS TEXT) AS object " +
				"FROM (" +
				"SELECT * FROM (" +
				"SELECT *, ROW_NUMBER() OVER (PARTITION BY pr1.person_uuid40 ORDER BY pr1.lastPickupDate DESC) AS rnk3 " +
				"FROM (" +
				"SELECT p.person_uuid AS person_uuid40, " +
				"COALESCE(ds_model.display, p.dsd_model_type) AS dsdModel, " +
				"p.visit_date AS lastPickupDate, " +
				"r.description AS currentARTRegimen, " +
				"rt.description AS currentRegimenLine, " +
				"p.next_appointment AS nextPickupDate, " +
				"CAST(p.refill_period / 30.0 AS DECIMAL(10, 1)) AS monthsOfARVRefill " +
				"FROM public.hiv_art_pharmacy p " +
				"INNER JOIN public.hiv_art_pharmacy_regimens pr ON pr.art_pharmacy_id = p.id " +
				"INNER JOIN public.hiv_regimen r ON r.id = pr.regimens_id " +
				"INNER JOIN public.hiv_regimen_type rt ON rt.id = r.regimen_type_id " +
				"LEFT JOIN base_application_codeset ds_model ON ds_model.code = p.dsd_model_type " +
				"WHERE r.regimen_type_id IN (1, 2, 3, 4, 14) " +
				"AND p.archived = 0 " +
				"AND p.visit_date >= '1901-01-01' " +
				"AND p.person_uuid = :personUuid " +
				") AS pr1 " +
				") AS pr2 " +
				"WHERE pr2.rnk3 = 1 " +
				") AS t";

		Query query = entityManager.createNativeQuery(sqlQuery);
		query.setParameter("personUuid", personUuid);
		List<String> results = query.getResultList();
		if (results.isEmpty()) {
			return null;
		}
		String jsonResult = results.get(0);
		ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(jsonResult, CurrentRegimenInfoDTO.class);
	}

}
