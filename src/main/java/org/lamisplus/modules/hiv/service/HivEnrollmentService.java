package org.lamisplus.modules.hiv.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.util.Log;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.entities.ApplicationCodeSet;
import org.lamisplus.modules.base.domain.repositories.ApplicationCodesetRepository;
import org.lamisplus.modules.hiv.domain.dto.HivEnrollmentDto;
import org.lamisplus.modules.hiv.domain.dto.HivPatientDto;
import org.lamisplus.modules.hiv.domain.entity.HivEnrollment;
import org.lamisplus.modules.hiv.repositories.HivEnrollmentRepository;
import org.lamisplus.modules.patient.domain.dto.PersonResponseDto;
import org.lamisplus.modules.patient.domain.entity.Encounter;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.domain.entity.Visit;
import org.lamisplus.modules.patient.repository.EncounterRepository;
import org.lamisplus.modules.patient.repository.PersonRepository;
import org.lamisplus.modules.patient.repository.VisitRepository;
import org.lamisplus.modules.patient.service.PersonService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Slf4j
public class HivEnrollmentService {

    private final PersonService personService;
    private final HivEnrollmentRepository hivEnrollmentRepository;

    private final ApplicationCodesetRepository applicationCodesetRepository;

    private final PersonRepository personRepository;

    private final CurrentUserOrganizationService currentUserOrganizationService;

    private  final EncounterRepository encounterRepository;

    private  final VisitRepository visitRepository;





    public HivPatientDto createHivEnrollment(HivEnrollmentDto hivEnrollmentDto) {
        final Long personId = hivEnrollmentDto.getPersonId ();
        Person person = getPerson (personId);
        if (hivEnrollmentRepository.getHivEnrollmentByPersonAndArchived (person, 0).isPresent ())
            throw new RecordExistException (HivEnrollment.class, "person", String.valueOf (person.getId ()));
        HivEnrollment hivEnrollment = convertToEntity (hivEnrollmentDto);
        hivEnrollment.setPerson (person);
        Visit visit = processAndCreateVisit (personId);
        if(visit != null){
        hivEnrollment.setVisit (visit);
        }
        hivEnrollment.setUuid (UUID.randomUUID ().toString ());
        return convertHivEnrollmentToHivPatientDto (hivEnrollmentRepository.save (hivEnrollment));
    }


    public HivPatientDto updateHivEnrollment(Long id, HivEnrollmentDto hivEnrollmentDto) {
        HivEnrollment existHivEnrollment = getExistEnrollmentById (id);
        HivEnrollment hivEnrollment = convertToEntity (hivEnrollmentDto);
        hivEnrollment.setId (existHivEnrollment.getId ());
        return convertHivEnrollmentToHivPatientDto (hivEnrollmentRepository.save (hivEnrollment));
    }


    public List<HivPatientDto> getAll() {
        return hivEnrollmentRepository.getHivEnrollmentByArchived (0)
                .stream ()
                .map (this::convertHivEnrollmentToHivPatientDto)
                .collect (Collectors.toList ());

    }

    public HivPatientDto getHivEnrollmentById(Long id) {
        return convertHivEnrollmentToHivPatientDto (getExistEnrollmentById (id));
    }


    public void deleteHivEnrollment(Long id) {
        HivEnrollment hivEnrollment = getExistEnrollmentById (id);
        hivEnrollment.setArchived (1);
        hivEnrollmentRepository.save (hivEnrollment);
    }


    private HivEnrollment getExistEnrollmentById(Long id) {
        return hivEnrollmentRepository
                .findById (id)
                .orElseThrow (() -> new EntityNotFoundException (HivEnrollment.class, "id", "" + id));
    }

    private HivEnrollment convertToEntity(HivEnrollmentDto dto) {
        HivEnrollment hivEnrollment = new HivEnrollment ();
        BeanUtils.copyProperties (dto, hivEnrollment);
        log.info ("entity converted {} ", hivEnrollment);
        hivEnrollment.setFacilityId (currentUserOrganizationService.getCurrentUserOrganization ());
        return hivEnrollment;
    }

    private HivEnrollmentDto convertToDto(HivEnrollment entity) {
        HivEnrollmentDto hivEnrollmentDto = new HivEnrollmentDto ();
        BeanUtils.copyProperties (entity, hivEnrollmentDto);
        hivEnrollmentDto.setPersonId (entity.getPerson ().getId ());
        log.info ("dto converted {} ", hivEnrollmentDto);
        return hivEnrollmentDto;
    }


    private HivPatientDto convertHivEnrollmentToHivPatientDto(HivEnrollment entity) {
        Person person = entity.getPerson ();
        PersonResponseDto bioData = personService.getPersonById (person.getId ());
        HivEnrollmentDto hivEnrollmentDto = convertToDto (entity);
        HivPatientDto hivPatientDto = new HivPatientDto ();
        BeanUtils.copyProperties (bioData, hivPatientDto);
        hivPatientDto.setEnrolled (true);

        Long statusAtRegistrationId = entity.getStatusAtRegistrationId ();
        Optional<ApplicationCodeSet> status = applicationCodesetRepository.findById (statusAtRegistrationId);
        if (status.isPresent ()) {
            hivPatientDto.setCurrentStatus (status.get ().getDisplay ());
        }
        hivPatientDto.setEnrollment (hivEnrollmentDto);
        return hivPatientDto;
    }





    public Optional<HivEnrollmentDto> getHivEnrollmentByPersonIdAndArchived(Long personId) {
        Person person = getPerson (personId);
        Optional<HivEnrollment> hivEnrollment = hivEnrollmentRepository.getHivEnrollmentByPersonAndArchived (person, 0);
        if (hivEnrollment.isPresent ()) {
            return Optional.of (convertToDto (hivEnrollment.get ()));
        }
        return Optional.empty ();
    }

    public Person getPerson(Long personId) {
        return personRepository.findById (personId)
                .orElseThrow (() -> new EntityNotFoundException (Person.class, "id", String.valueOf (personId)));
    }

    public Visit processAndCreateVisit(Long personId) {
        Log.info ("person id in creating visit {}", personId);
        PersonResponseDto personDto = personService.getPersonById (personId);
        Optional<Person> personOptional = personRepository.findById (personId);
        if (personDto.getVisitId () != null) {
            Optional<Visit> visitOptional = visitRepository.findById (personDto.getVisitId ());
            if (visitOptional.isPresent ()) {
                List<Encounter> visitEncounters = encounterRepository.getEncounterByVisit (visitOptional.get ());
                List<String> serviceCodes = visitEncounters.stream ()
                        .map (Encounter::getServiceCode)
                        .collect (Collectors.toList ());
                if (!serviceCodes.contains ("hiv-code")) {
                    createHivVisitEncounter (personOptional, visitOptional.get ());
                }
                return visitOptional.get ();
            }
        } else {
            Visit visit = new Visit ();
            personOptional.ifPresent (visit::setPerson);
            visit.setFacilityId (currentUserOrganizationService.getCurrentUserOrganization ());
            visit.setVisitStartDate (LocalDateTime.now ());
            visit.setArchived (0);
            visit.setUuid (UUID.randomUUID ().toString ());
            Visit currentVisit = visitRepository.save (visit);
            createHivVisitEncounter (personOptional, visit);
            return currentVisit;
        }
        return null;
    }

    private void createHivVisitEncounter(Optional<Person> personOptional, Visit visit) {
        Log.info ("creating Encounter visit Id {}", visit.getId ());
        Encounter encounter = new Encounter ();
        encounter.setVisit (visit);
        encounter.setArchived (0);
        encounter.setPerson (visit.getPerson ());
        encounter.setUuid (UUID.randomUUID ().toString ());
        encounter.setEncounterDate (visit.getVisitStartDate ());
        encounter.setServiceCode ("hiv-code");
        personOptional.ifPresent (encounter::setPerson);
        encounter.setStatus ("PENDING");
        encounter.setFacilityId (currentUserOrganizationService.getCurrentUserOrganization ());
        encounterRepository.save (encounter);
    }
}

