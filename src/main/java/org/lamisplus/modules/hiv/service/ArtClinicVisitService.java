package org.lamisplus.modules.hiv.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.service.ApplicationCodesetService;
import org.lamisplus.modules.hiv.domain.dto.ARTClinicVisitDto;
import org.lamisplus.modules.hiv.domain.dto.ARTClinicalVisitDisplayDto;
import org.lamisplus.modules.hiv.domain.entity.ARTClinical;
import org.lamisplus.modules.hiv.domain.entity.EnrollmentCommencement;
import org.lamisplus.modules.hiv.repositories.ARTClinicalRepository;
import org.lamisplus.modules.hiv.repositories.EnrollmentCommencementRepository;
import org.lamisplus.modules.hiv.repositories.HivEnrollmentRepository;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.domain.entity.Visit;
import org.lamisplus.modules.patient.repository.PersonRepository;
import org.lamisplus.modules.triage.domain.dto.VitalSignDto;
import org.lamisplus.modules.triage.domain.dto.VitalSignRequestDto;
import org.lamisplus.modules.triage.domain.entity.VitalSign;
import org.lamisplus.modules.triage.repository.VitalSignRepository;
import org.lamisplus.modules.triage.service.VitalSignService;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Slf4j
@Service
public class ArtClinicVisitService {

	private final HivEnrollmentRepository hivEnrollmentRepository;

	private final ARTClinicalRepository artClinicalRepository;

	private final VitalSignService vitalSignService;

	private final CurrentUserOrganizationService organizationUtil;
	
	private final VitalSignRepository vitalSignRepository;
	
	private final PersonRepository personRepository;

	private final HIVStatusTrackerService hivStatusTrackerService;

	private final ApplicationCodesetService applicationCodesetService;

	private final HandleHIVVisitEncounter hivVisitEncounter;

	private final EnrollmentCommencementRepository enrollmentCommencementRepository;
	
	public ARTClinicVisitDto createArtClinicVisit(ARTClinicVisitDto artClinicVisitDto) {
		Long personId = artClinicVisitDto.getPersonId();
		Person person = getPerson(personId);

		// Get EnrollmentCommencement by Person instead of by ID
		EnrollmentCommencement enrollmentCommencement = enrollmentCommencementRepository
				.findByPersonAndArchived(person, 0)
				.orElseThrow(() -> new EntityNotFoundException(
						EnrollmentCommencement.class,
						"personId",
						"" + personId));
		Visit visit = hivVisitEncounter.processAndCreateVisit(personId, artClinicVisitDto.getVisitDate());
		VitalSignRequestDto vitalSignDto = artClinicVisitDto.getVitalSignDto();
		String captureDate = artClinicVisitDto.getVisitDate().toString().concat(" 00:00");
		vitalSignDto.setCaptureDate(captureDate);
		if (visit != null) {
			vitalSignDto.setVisitId(visit.getId());
		}
		Optional<VitalSign> vitalSignOptional =
				vitalSignRepository.getVitalSignByVisitAndArchived(visit, 0);
		Long vitalSignId = null;
		if (vitalSignOptional.isPresent()) {
			vitalSignId = vitalSignOptional.get().getId();
			vitalSignService.updateVitalSign(vitalSignId, vitalSignDto);
		} else {
			vitalSignId = vitalSignService.registerVitalSign(vitalSignDto).getId();
		}
		ARTClinical artClinical = convertDtoToART(artClinicVisitDto, vitalSignId, enrollmentCommencement.getId());
		artClinical.setClinicalStageId(artClinicVisitDto.getWhoStagingId());
		artClinical.setUuid(UUID.randomUUID().toString());
		artClinical.setArchived(0);
		artClinical.setEnrollmentCommencement(enrollmentCommencement);
		artClinical.setVisit(visit);
		artClinical.setPerson(enrollmentCommencement.getPerson());
		artClinical.setIsCommencement(false);
		return convertToClinicVisitDto(artClinicalRepository.save(artClinical));
	}
	
	
	public ARTClinicVisitDto updateClinicVisit(Long id, ARTClinicVisitDto artClinicVisitDto) {
		ARTClinical existArtClinical = getExistClinicVisit(id);
		VitalSignRequestDto vitalSignDto = artClinicVisitDto.getVitalSignDto();
		String captureDate = artClinicVisitDto.getVisitDate().toString().concat(" 00:00");
		vitalSignDto.setCaptureDate(captureDate);
		vitalSignService.updateVitalSign(existArtClinical.getVitalSign().getId(), vitalSignDto);
		ARTClinical artClinical = convertDtoToART(artClinicVisitDto, existArtClinical.getVitalSign().getId(), existArtClinical.getEnrollmentCommencement().getId());
		artClinical.setVisit(existArtClinical.getVisit());
		artClinical.setEnrollmentCommencement(existArtClinical.getEnrollmentCommencement());
		artClinical.setArtStatusId(existArtClinical.getArtStatusId());
		artClinical.setPerson(existArtClinical.getPerson());
		artClinical.setId(existArtClinical.getId());
		artClinical.setUuid(existArtClinical.getUuid());
		artClinical.setArchived(0);
		return convertToClinicVisitDto(artClinicalRepository.save(artClinical));
	}
	
	
	public void archivedClinicVisit(Long id, String message) {
		ARTClinical artClinical = getExistClinicVisit(id);
		artClinical.setArchived(1);
		artClinical.setReason(message);
		artClinicalRepository.save(artClinical);
	}
	
	public ARTClinicVisitDto getArtClinicVisitById(Long id) {
		return convertToClinicVisitDto(getExistClinicVisit(id));
	}
	
	public List<ARTClinicVisitDto> getAllArtClinicVisit() {
		return artClinicalRepository
				.findByArchivedAndIsCommencementIsFalse(0)
				.stream()
				.map(this::convertToClinicVisitDto)
				.collect(Collectors.toList());
	}
	
	public List<ARTClinicalVisitDisplayDto> getAllArtClinicVisitByPersonId(Long personId, int pageNo, int pageSize) {
		Person person = getPerson(personId);
		Pageable paging = PageRequest.of(pageNo, pageSize, Sort.by("visitDate").descending());
		Page<ARTClinical> clinicVisits = artClinicalRepository.findAllByPersonAndArchived(person, 0, paging);
		if (clinicVisits.hasContent()) {
			return clinicVisits.getContent().stream().map(this::getArtClinicalVisitDisplayDto).collect(Collectors.toList());
		}
		return new ArrayList<>();
	}
	
	
	private ARTClinicalVisitDisplayDto getArtClinicalVisitDisplayDto(ARTClinical visit) {
		Long whoStagingId = visit.getWhoStagingId();
		StringBuilder whoStage = new StringBuilder();
		if(whoStagingId != null) {
			String who = applicationCodesetService.getApplicationCodeset(whoStagingId).getDisplay();
			whoStage.append(who);
		}

		// Get functional status display value
		Long functionalStatusId = visit.getFunctionalStatusId();
		String functionalStatus = "";
		if(functionalStatusId != null) {
			functionalStatus = applicationCodesetService.getApplicationCodeset(functionalStatusId).getDisplay();
		}

		return ARTClinicalVisitDisplayDto.builder()
				.id(visit.getId())
				.visitDate(visit.getVisitDate())
				.nextAppointment(visit.getNextAppointment())
				.artStatus(hivStatusTrackerService.getPersonCurrentHIVStatusByPersonId(visit.getPerson().getId()).getStatus())
				.personId(visit.getPerson().getId())
				.hivEnrollmentId(visit.getEnrollmentCommencement().getId())
				.adherenceLevel(visit.getAdherenceLevel())
//				.isCommencement(visit.getEnrollmentCommencement().getIsCommencement())
				.isCommencement(visit.getEnrollmentCommencement().getIsCommencement())
				.adheres(visit.getAdheres())
				.clinicalNote(visit.getClinicalNote())
				.facilityId(visit.getFacilityId())
				.functionalStatusId(visit.getFunctionalStatusId())
				.functionalStatus(functionalStatus)
				.cd4(visit.getCd4())
				.cd4Percentage(visit.getCd4Percentage())
				.adrScreened(visit.getAdrScreened())
				.visitId(visit.getVisit() != null ? visit.getVisit().getId() : null)
				.vitalSignDto(vitalSignService.getVitalSignById(visit.getVitalSign().getId()))
				.tbScreen(visit.getTbScreen())
				.whoStaging(whoStage.toString())
				.clinicalStageId(visit.getClinicalStageId())
				.opportunisticInfections(visit.getOpportunisticInfections())
				.cryptococcalScreeningStatus(visit.getCryptococcalScreeningStatus())
				.familyPlaning(visit.getFamilyPlaning())
				.onFamilyPlaning(visit.getOnFamilyPlaning())
				.pregnancyStatus(visit.getPregnancyStatus())
				.hepatitisScreeningResult(visit.getHepatitisScreeningResult())
				.cervicalCancerScreeningStatus(visit.getCervicalCancerScreeningStatus())
				.cervicalCancerTreatmentProvided(visit.getCervicalCancerTreatmentProvided())
				.aRVDrugsRegimen(visit.getARVDrugsRegimen())
				.viralLoadOrder(visit.getViralLoadOrder())
				.levelOfAdherence(visit.getLevelOfAdherence())
				.tbPrevention(visit.getTbPrevention())
				.tbStatus(visit.getTbStatus())
				// Care Card Follow-Up specific fields
				.durationOnArtMonths(visit.getDurationOnArtMonths())
				.clinicianName(visit.getClinicianName())
				.bmiMuac(visit.getBmiMuac())
				.paediatricDisclosure(visit.getPaediatricDisclosure())
				.whoStageCriteria(visit.getWhoStageCriteria())
				.notedSideEffect(visit.getNotedSideEffect())
				.dsdStatus(visit.getDsdStatus())
				.dsdModel(visit.getDsdModel())
				.dateDevolved(visit.getDateDevolved())
				.cotrimoxazoleDose(visit.getCotrimoxazoleDose())
				.tptData(visit.getTptData())
				.otherDrugs(visit.getOtherDrugs())
				.cd4Ordered(visit.getCd4Ordered())
				.cd4Data(visit.getCd4Data())
				.viralLoadOrdered(visit.getViralLoadOrdered())
				.eac(visit.getEac())
				.rbs(visit.getRbs())
				.otherTestsDone(visit.getOtherTestsDone())
				.typeOfAppointment(visit.getTypeOfAppointment())
				.healthInsuranceCoverage(visit.getHealthInsuranceCoverage())
				.build();
	}
	
	
	private Person getPerson(Long personId) {
		return personRepository.findById(personId).orElseThrow(() -> new EntityNotFoundException(Person.class, "id", String.valueOf(personId)));
	}

	private ARTClinical getExistClinicVisit(Long id) {
		return artClinicalRepository
				.findById(id)
				.orElseThrow(() -> new EntityNotFoundException(ARTClinical.class, "id", "" + id));
	}

	@NotNull
	public ARTClinicVisitDto convertToClinicVisitDto(ARTClinical artClinical) {
		VitalSignDto vitalSignDto = vitalSignService.getVitalSignById(artClinical.getVitalSign().getId());
		VitalSignRequestDto requestDto = new VitalSignRequestDto();
		BeanUtils.copyProperties(vitalSignDto, requestDto);
		ARTClinicVisitDto artClinicVisitDto = new ARTClinicVisitDto();
		BeanUtils.copyProperties(artClinical, artClinicVisitDto);
		artClinicVisitDto.setVitalSignDto(requestDto);
		return artClinicVisitDto;
	}
	@NotNull
	public ARTClinical convertDtoToART(ARTClinicVisitDto artClinicVisitDto, Long vitalSignId, Long enrollmentCommmenceId) {
		ARTClinical artClinical = new ARTClinical();
		BeanUtils.copyProperties(artClinicVisitDto, artClinical);
		artClinical.setArtStatusId(enrollmentCommmenceId);
		VitalSign vitalSign = getVitalSign(vitalSignId);
		artClinical.setVitalSign(vitalSign);
		artClinical.setFacilityId(organizationUtil.getCurrentUserOrganization());
		artClinical.setArchived(0);

		// Explicitly set JSONB fields to ensure they are copied
		artClinical.setARVDrugsRegimen(artClinicVisitDto.getARVDrugsRegimen());
		artClinical.setViralLoadOrder(artClinicVisitDto.getViralLoadOrder());
		artClinical.setWhoStageCriteria(artClinicVisitDto.getWhoStageCriteria());
		artClinical.setOpportunisticInfections(artClinicVisitDto.getOpportunisticInfections());
		artClinical.setAdheres(artClinicVisitDto.getAdheres());
		artClinical.setWho(artClinicVisitDto.getWho());
		artClinical.setTbScreen(artClinicVisitDto.getTbScreen());
		artClinical.setAdverseDrugReactions(artClinicVisitDto.getAdverseDrugReactions());
		artClinical.setTptData(artClinicVisitDto.getTptData());
		artClinical.setOtherTestsDone(artClinicVisitDto.getOtherTestsDone());
		artClinical.setCd4Data(artClinicVisitDto.getCd4Data());

		return artClinical;
	}
	
	private VitalSign getVitalSign(Long vitalSignId) {
		return vitalSignRepository.findById(vitalSignId).orElseThrow(() -> new EntityNotFoundException(VitalSign.class, "id", String.valueOf(vitalSignId)));
		
	}
	
}