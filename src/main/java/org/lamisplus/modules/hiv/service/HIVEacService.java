package org.lamisplus.modules.hiv.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.module.ModuleService;
import org.lamisplus.modules.hiv.domain.dto.EACPharmacyDisplayDto;
import org.lamisplus.modules.hiv.domain.dto.EACStopDto;
import org.lamisplus.modules.hiv.domain.dto.HIVEacDto;
import org.lamisplus.modules.hiv.domain.dto.LabEacInfo;
import org.lamisplus.modules.hiv.domain.entity.HIVEac;
import org.lamisplus.modules.hiv.domain.entity.HIVEacSession;
import org.lamisplus.modules.hiv.repositories.HIVEacRepository;
import org.lamisplus.modules.hiv.repositories.HIVEacSessionRepository;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.domain.entity.Visit;
import org.lamisplus.modules.patient.repository.PersonRepository;
import org.springframework.stereotype.Service;
import reactor.util.UUIDUtils;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class HIVEacService {
	
	private final HIVEacRepository hivEacRepository;
	
	private final PersonRepository personRepository;
	
	private final HandleHIVVisitEncounter handleHIVisitEncounter;
	
	
	private final ModuleService moduleService;
	
	private final HIVEacSessionRepository hivEacSessionRepository;

	public List<HIVEacDto> getPatientEAcs(Long patientId) {
		Person person = personRepository.findById(patientId)
				.orElseThrow(() -> new EntityNotFoundException(Person.class, "id", String.valueOf(patientId)));

		if (moduleService.exist("Lab")) {
			List<LabEacInfo> patientAllEacs = hivEacRepository.getPatientAllEacs(patientId);
			List<LocalDate> existingDates = hivEacRepository
					.getAllByPersonAndArchived(person, 0) // Assuming you have a method to fetch by person and archived
					.stream()
					.map(HIVEac::getDateOfLastViralLoad)
					.collect(Collectors.toList());
			// Filter out LabEacInfo objects with duplicate resultDate
			patientAllEacs.stream()
					.filter(labEacInfo -> !existingDates.contains(labEacInfo.getResultDate().toLocalDate()))
					.map(labEacInfo -> HIVEacDto.builder()
							.labNumber(labEacInfo.getLabNumber())
							.dateOfLastViralLoad(labEacInfo.getResultDate().toLocalDate())
							.testGroup(labEacInfo.getTestGroup())
							.testName(labEacInfo.getTestName())
							.lastViralLoad(Double.valueOf(labEacInfo.getResult()))
							.testResultId(labEacInfo.getTestResultId())
							.status("NOT COMMENCED")
							.personId(patientId).build()
					)
					.map(this::mapDtoEntity)
					.map(hivEacRepository::save)
					.collect(Collectors.toList());
		}

		return hivEacRepository.getAllByPersonAndArchived(person, 0)
				.stream().map(this::mapEntityDto)
				.collect(Collectors.toList());
	}
	
	public EACPharmacyDisplayDto getPatientOpenEAc(Long patientId) {
		Person person = personRepository.findById(patientId)
				.orElseThrow(() -> new EntityNotFoundException(Person.class, "id", String.valueOf(patientId)));
		Optional<HIVEac> openEAC = hivEacRepository.getAllByPersonAndArchived(person, 0)
				.stream()
				.filter(e -> !e.getStatus().equalsIgnoreCase("NOT COMMENCED")
						&& !e.getStatus().equalsIgnoreCase("STOPPED")
						&& !e.getStatus().equalsIgnoreCase("COMPLETED"))
				.findFirst();
		if (openEAC.isPresent()) {
			HIVEac eac = openEAC.get();
			Double viralLoad = eac.getLastViralLoad();
			LocalDate dateOfLastViralLoad = eac.getDateOfLastViralLoad();
			List<HIVEacSession> sessions = hivEacSessionRepository.getHIVEacSesByEac(eac);
			Optional<HIVEacSession> currentSession = sessions.stream()
					.filter(Objects::nonNull)
					.sorted(Comparator.comparing(HIVEacSession::getEacSessionDate).reversed())
					.findFirst();
			if (currentSession.isPresent()) {
				return new EACPharmacyDisplayDto(
						viralLoad,
						dateOfLastViralLoad,
						currentSession.get().getStatus(),
						currentSession.get().getFollowUpDate()
				);
			}
			
		}
		return new EACPharmacyDisplayDto(0.0, LocalDate.now(),"Default",LocalDate.now());
		
		
	}
	
	public HIVEacDto stopEac(Long id, EACStopDto data) {
		HIVEac exists = hivEacRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException(HIVEac.class, "id", String.valueOf(id)));
		exists.setReasonToStopEac(data.getReason());
		exists.setStatus("STOPPED");
		hivEacRepository.save(exists);
		return mapEntityDto(exists);
		
	}
	
	
	private HIVEac mapDtoEntity(HIVEacDto dto) {
		HIVEac hIVEac = new HIVEac();
		Long personId = dto.getPersonId();
		Person person = getPerson(personId);
		Visit visit = handleHIVisitEncounter.processAndCreateVisit(personId, dto.getDateOfLastViralLoad());
		hIVEac.setVisit(visit);
		hIVEac.setPerson(person);
		hIVEac.setLastViralLoad(dto.getLastViralLoad());
		hIVEac.setDateOfLastViralLoad(dto.getDateOfLastViralLoad());
		hIVEac.setUuid(UUIDUtils.random().toString());
		hIVEac.setStatus(dto.getStatus());
		hIVEac.setArchived(dto.getArchived());
		hIVEac.setTestResultId(dto.getTestResultId());
		hIVEac.setTestGroup(dto.getTestGroup());
		hIVEac.setTestName(dto.getTestName());
		hIVEac.setLabNumber(dto.getLabNumber());
		hIVEac.setArchived(0);
		hIVEac.setFacilityId(person.getFacilityId());
		return hIVEac;
		
	}
	
	
	private HIVEacDto mapEntityDto(HIVEac entity) {
		HIVEacDto hIVEacDto = new HIVEacDto();
		hIVEacDto.setId(entity.getId());
		hIVEacDto.setVisitId(entity.getVisit().getId());
		hIVEacDto.setPersonId(entity.getPerson().getId());
		hIVEacDto.setLastViralLoad(entity.getLastViralLoad());
		hIVEacDto.setDateOfLastViralLoad(entity.getDateOfLastViralLoad());
		hIVEacDto.setUuid(entity.getUuid());
		hIVEacDto.setStatus(entity.getStatus());
		hIVEacDto.setArchived(entity.getArchived());
		hIVEacDto.setTestResultId(entity.getTestResultId());
		hIVEacDto.setTestGroup(entity.getTestGroup());
		hIVEacDto.setTestName(entity.getTestName());
		hIVEacDto.setLabNumber(entity.getLabNumber());
		hIVEacDto.setReasonStopped(entity.getReasonToStopEac());
		return hIVEacDto;
		
	}
	
	private Person getPerson(Long personId) {
		return personRepository.findById(personId).orElseThrow(() -> new EntityNotFoundException(Person.class, "id", String.valueOf(personId)));
	}
	
	
	public void deleteEac(Long id) {
		HIVEac hivEac = hivEacRepository
				.findById(id)
				.orElseThrow(() -> new EntityNotFoundException(HIVEac.class, "id", String.valueOf(id)));
		hivEac.setArchived(1);
		hivEacRepository.save(hivEac);
	}
}
