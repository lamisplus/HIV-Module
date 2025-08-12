package org.lamisplus.modules.hiv.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.service.ApplicationCodesetService;
import org.lamisplus.modules.hiv.domain.dto.ARTClinicVisitDto;
import org.lamisplus.modules.hiv.domain.dto.ARTClinicalVisitDisplayDto;
import org.lamisplus.modules.hiv.domain.entity.ARTClinical;
import org.lamisplus.modules.hiv.domain.entity.HivEnrollment;
import org.lamisplus.modules.hiv.repositories.ARTClinicalRepository;
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
	
	public ARTClinicVisitDto createArtClinicVisit(ARTClinicVisitDto artClinicVisitDto) {
		Long hivEnrollmentId = artClinicVisitDto.getHivEnrollmentId();
		HivEnrollment hivEnrollment = hivEnrollmentRepository
				.findById(hivEnrollmentId)
				.orElseThrow(() -> new EntityNotFoundException(HivEnrollment.class, "id", "" + hivEnrollmentId));
		Long personId = artClinicVisitDto.getPersonId();
		if (!Objects.equals(hivEnrollment.getPerson().getId(), personId))
			throw new EntityNotFoundException(Person.class, "personId", "" + personId);
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
		ARTClinical artClinical = convertDtoToART(artClinicVisitDto, vitalSignId);
		artClinical.setClinicalStageId(artClinicVisitDto.getWhoStagingId());
		artClinical.setUuid(UUID.randomUUID().toString());
		artClinical.setArchived(0);
		artClinical.setHivEnrollment(hivEnrollment);
		artClinical.setVisit(visit);
		artClinical.setPerson(hivEnrollment.getPerson());
		artClinical.setIsCommencement(false);
		return convertToClinicVisitDto(artClinicalRepository.save(artClinical));
	}
	
	
	public ARTClinicVisitDto updateClinicVisit(Long id, ARTClinicVisitDto artClinicVisitDto) {
		ARTClinical existArtClinical = getExistClinicVisit(id);
		VitalSignRequestDto vitalSignDto = artClinicVisitDto.getVitalSignDto();
		String captureDate = artClinicVisitDto.getVisitDate().toString().concat(" 00:00");
		vitalSignDto.setCaptureDate(captureDate);
		vitalSignService.updateVitalSign(existArtClinical.getVitalSign().getId(), vitalSignDto);
		ARTClinical artClinical = convertDtoToART(artClinicVisitDto, existArtClinical.getVitalSign().getId());
		artClinical.setVisit(existArtClinical.getVisit());
		artClinical.setHivEnrollment(existArtClinical.getHivEnrollment());
		artClinical.setPerson(existArtClinical.getPerson());
		artClinical.setId(existArtClinical.getId());
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
		return ARTClinicalVisitDisplayDto.builder()
				.id(visit.getId())
				.visitDate(visit.getVisitDate())
				.nextAppointment(visit.getNextAppointment())
				.artStatus(hivStatusTrackerService.getPersonCurrentHIVStatusByPersonId(visit.getPerson().getId()).getStatus())
				.personId(visit.getPerson().getId())
				.hivEnrollmentId(visit.getHivEnrollment().getId())
				.adherenceLevel(visit.getAdherenceLevel())
				.isCommencement(visit.getIsCommencement())
				.adheres(visit.getAdheres())
				.clinicalNote(visit.getClinicalNote())
				.facilityId(visit.getFacilityId())
				.cd4(visit.getCd4())
				.cd4Percentage(visit.getCd4Percentage())
				.adrScreened(visit.getAdrScreened())
				.visitId(visit.getVisit().getId())
				.vitalSignDto(vitalSignService.getVitalSignById(visit.getVitalSign().getId()))
				.tbScreen(visit.getTbScreen())
				.whoStaging(whoStage.toString())
				.opportunisticInfections(visit.getOpportunisticInfections())
				.cryptococcalScreeningStatus(visit.getCryptococcalScreeningStatus())
				.familyPlaning(visit.getFamilyPlaning())
				.hepatitisScreeningResult(visit.getHepatitisScreeningResult())
				.cervicalCancerScreeningStatus(visit.getCervicalCancerScreeningStatus())
				.cervicalCancerTreatmentProvided(visit.getCervicalCancerTreatmentProvided())
				.aRVDrugsRegimen(visit.getARVDrugsRegimen())
				.viralLoadOrder(visit.getViralLoadOrder())
				.levelOfAdherence(visit.getLevelOfAdherence())
				.tbPrevention(visit.getTbPrevention())
				.tbStatus(visit.getTbStatus())
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
	public ARTClinical convertDtoToART(ARTClinicVisitDto artClinicVisitDto, Long vitalSignId) {
		ARTClinical artClinical = new ARTClinical();
		BeanUtils.copyProperties(artClinicVisitDto, artClinical);
		VitalSign vitalSign = getVitalSign(vitalSignId);
		artClinical.setVitalSign(vitalSign);
		artClinical.setFacilityId(organizationUtil.getCurrentUserOrganization());
		artClinical.setArchived(0);
		return artClinical;
	}
	
	private VitalSign getVitalSign(Long vitalSignId) {
		return vitalSignRepository.findById(vitalSignId).orElseThrow(() -> new EntityNotFoundException(VitalSign.class, "id", String.valueOf(vitalSignId)));
		
	}
	
}