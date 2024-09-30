package org.lamisplus.modules.hiv.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.util.Log;
import org.lamisplus.modules.patient.domain.dto.PersonResponseDto;
import org.lamisplus.modules.patient.domain.entity.Encounter;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.domain.entity.Visit;
import org.lamisplus.modules.patient.repository.EncounterRepository;
import org.lamisplus.modules.patient.repository.PersonRepository;
import org.lamisplus.modules.patient.repository.VisitRepository;
import org.lamisplus.modules.patient.service.PersonService;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class HandleHIVVisitEncounter {
	
	private final EncounterRepository encounterRepository;
	
	private final VisitRepository visitRepository;
	
	private final PersonService personService;
	
	
	private final PersonRepository personRepository;
	
	
	public Visit processAndCreateVisit(Long personId, LocalDate visitDate) {
		
		PersonResponseDto personDto = personService.getPersonById(personId);
		
		Optional<Person> personOptional = personRepository.findById(personId);
		
		if (personDto.getVisitId() != null) {
			Optional<Visit> visitOptional = visitRepository.findById(personDto.getVisitId());
			if (visitOptional.isPresent()) {
				log.debug("visit already exist, updating encounter only!!");
				List<Encounter> visitEncounters = encounterRepository.getEncounterByVisit(visitOptional.get());
				List<String> serviceCodes = visitEncounters.stream()
						.map(Encounter::getServiceCode)
						.collect(Collectors.toList());
				if (!serviceCodes.contains("hiv-code")) {
					createHivVisitEncounter(personOptional, visitOptional.get());
				}
				return visitOptional.get();
			}
		} else {
			Visit visit = new Visit();
			personOptional.ifPresent(visit::setPerson);
			personOptional.ifPresent(person -> visit.setFacilityId(person.getFacilityId()));
			visit.setVisitStartDate(visitDate.atTime(0,0));
			visit.setArchived(0);
			visit.setUuid(UUID.randomUUID().toString());
			log.debug("about saving visit, person is available? {}", personOptional.isPresent());
			try {
				Visit currentVisit = visitRepository.save(visit);
				createHivVisitEncounter(personOptional, visit);
				return currentVisit;
			} catch (DataAccessException e) {
				log.error("Failed to save visit and encounter", e);
				throw new RuntimeException("Failed to save visit and encounter", e);
			}
		}
		return null;
	}
	
	private void createHivVisitEncounter(Optional<Person> personOptional, Visit visit) {
		Encounter encounter = new Encounter();
		encounter.setVisit(visit);
		encounter.setArchived(0);
		encounter.setPerson(visit.getPerson());
		encounter.setUuid(UUID.randomUUID().toString());
		LocalDateTime visitStartDate = visit.getVisitStartDate();
		encounter.setEncounterDate(visitStartDate.plusMinutes(2));
		encounter.setServiceCode("hiv-code");
		personOptional.ifPresent(encounter::setPerson);
		encounter.setStatus("PENDING");
		encounter.setFacilityId(visit.getFacilityId());
		encounterRepository.save(encounter);
	}
}
