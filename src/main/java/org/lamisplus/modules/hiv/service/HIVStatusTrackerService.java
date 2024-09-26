package org.lamisplus.modules.hiv.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.service.ApplicationCodesetService;
import org.lamisplus.modules.hiv.domain.dto.HIVStatusTrackerDto;
import org.lamisplus.modules.hiv.domain.dto.StatusDto;
import org.lamisplus.modules.hiv.domain.entity.ArtPharmacy;
import org.lamisplus.modules.hiv.domain.entity.HIVStatusTracker;
import org.lamisplus.modules.hiv.domain.entity.HivEnrollment;
import org.lamisplus.modules.hiv.repositories.ArtPharmacyRepository;
import org.lamisplus.modules.hiv.repositories.HIVStatusTrackerRepository;
import org.lamisplus.modules.hiv.repositories.HivEnrollmentRepository;
import org.lamisplus.modules.patient.controller.exception.NoRecordFoundException;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.domain.entity.Visit;
import org.lamisplus.modules.patient.repository.PersonRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class HIVStatusTrackerService {

    public static final LocalDate INVALID_DATE = LocalDate.of(1970, 01, 01);
    public static final String NOT_ENROLLED = "Not Enrolled";
    public static final String HIV_NEGATIVE = "HIV_NEGATIVE";
    public static final String HIV_PLUS_NON_ART = "HIV+ NON ART";
    public static final String IIT = "IIT";
    public static final int TWENTY_NINE_DAYS = 29;
    public static final String ACTIVE_ON_TREATMENT = "Active on Treatment";
    public static final String ART_TRANSFER_OUT = "ART Transfer Out";
    public static final String ART_TRANSFER_IN = "ART Transfer In";

    private final HIVStatusTrackerRepository hivStatusTrackerRepository;


    private final CurrentUserOrganizationService organizationUtil;

    private final PersonRepository personRepository;

    private final ArtPharmacyRepository artPharmacyRepository;

    private final HivEnrollmentRepository hivEnrollmentRepository;

    private final HandleHIVVisitEncounter hivVisitEncounter;


    private final ApplicationCodesetService applicationCodesetService;


//    public HIVStatusTrackerDto registerHIVStatusTracker(HIVStatusTrackerDto hivStatusTrackerDto) {
//        System.out.println("------------------------------I got to registerHIVStatusTracker method---------------------");
//        Long personId = hivStatusTrackerDto.getPersonId();
//        Person existPerson = getPerson(personId);
//        HIVStatusTracker hivStatusTracker = convertDtoToEntity(hivStatusTrackerDto);
//        Visit visit = hivVisitEncounter.processAndCreateVisit(personId, hivStatusTrackerDto.getStatusDate());
//        hivStatusTracker.setVisit(visit);
//        hivStatusTracker.setArchived(0);
//        hivStatusTracker.setUuid(UUID.randomUUID().toString());
//        hivStatusTracker.setAuto(false);
//        hivStatusTracker.setPerson(existPerson);
//        log.info("Creating ART Status Starts here");
//        HIVStatusTracker statusTracker = hivStatusTrackerRepository.save(hivStatusTracker);
//        log.info("This is Status Tracker " + statusTracker);
//        return  null;
//    }

    public HIVStatusTrackerDto registerHIVStatusTracker(HIVStatusTrackerDto hivStatusTrackerDto) {
        if (hivStatusTrackerDto != null) {
            System.out.println("------------------------------I got to registerHIVStatusTracker method---------------------");
            Long personId = hivStatusTrackerDto.getPersonId();
            Person existPerson = getPerson(personId);
            HIVStatusTracker hivStatusTracker = convertDtoToEntity(hivStatusTrackerDto);
            Visit visit = hivVisitEncounter.processAndCreateVisit(personId, hivStatusTrackerDto.getStatusDate());
            hivStatusTracker.setVisit(visit);
            hivStatusTracker.setArchived(0);
            hivStatusTracker.setUuid(UUID.randomUUID().toString());
            hivStatusTracker.setAuto(false);
            hivStatusTracker.setPerson(existPerson);
//            log.info("Creating ART Status Starts here");
            HIVStatusTracker statusTracker = hivStatusTrackerRepository.save(hivStatusTracker);
//            log.info("This is Status Tracker " + statusTracker);
            return convertEntityToDto(statusTracker); // Convert the entity to DTO and return
        } else {
            return new HIVStatusTrackerDto();
        }
    }


    public HIVStatusTrackerDto updateHIVStatusTracker(Long id, HIVStatusTrackerDto hivStatusTrackerDto) {
        HIVStatusTracker existingHivStatusTracker = getExistingHivStatusTracker(id);
        HIVStatusTracker hivStatusTracker = convertDtoToEntity(hivStatusTrackerDto);
        hivStatusTracker.setId(id);
        hivStatusTracker.setArchived(0);
        hivStatusTracker.setUuid(existingHivStatusTracker.getUuid());
        hivStatusTracker.setCreatedBy(existingHivStatusTracker.getCreatedBy());
        hivStatusTracker.setCreatedDate(existingHivStatusTracker.getCreatedDate());
        hivStatusTracker.setAuto(false);
        return convertEntityToDto(hivStatusTrackerRepository.save(hivStatusTracker));
    }


    public HIVStatusTrackerDto getHIVStatusTrackerById(Long id) {
        return convertEntityToDto(getExistingHivStatusTracker(id));
    }

    public StatusDto getPersonCurrentHIVStatusByPersonId(Long personId) {
        Person person = getPerson(personId);
        Comparator<HIVStatusTracker> personStatusDateComparator = Comparator.comparing(HIVStatusTracker::getStatusDate);
        Optional<HIVStatusTracker> currentStatus = hivStatusTrackerRepository.findAllByPersonAndArchived(person, 0)
                .stream()
                .max(personStatusDateComparator);
        List<ArtPharmacy> pharmacyRefills = artPharmacyRepository.getArtPharmaciesByPersonAndArchived(person, 0);
        StatusDto statusDto = new StatusDto(HIV_PLUS_NON_ART, null);
        if (!pharmacyRefills.isEmpty()) {
            return currentStatus.map(this::calculatePatientCurrentStatus)
                    .orElse(statusDto);
        }

        HivEnrollment hivEnrollment = hivEnrollmentRepository.getHivEnrollmentByPersonAndArchived(person, 0)
                .orElseThrow(() -> new EntityNotFoundException(HivEnrollment.class, "person id", String.valueOf(person.getId())));
        LocalDate dateOfRegistration = hivEnrollment.getDateOfRegistration();
        Long statusAtRegistrationId = hivEnrollment.getStatusAtRegistrationId();
        String statusAtRegistration = applicationCodesetService.getApplicationCodeset(statusAtRegistrationId).getDisplay();
        return new StatusDto(statusAtRegistration, dateOfRegistration);

    }

    public StatusDto getPersonCurrentHIVStatusByPersonId(Long personId, LocalDate startDate, LocalDate endDate) {
        Person person = getPerson(personId);
        Comparator<HIVStatusTracker> personStatusDateComparator = Comparator.comparing(HIVStatusTracker::getStatusDate);
        Optional<HIVStatusTracker> currentStatus = hivStatusTrackerRepository.findAllByPersonAndArchived(person, 0)
                .stream()
                .filter(status ->
                        status.getStatusDate().isAfter(startDate.minusDays(1))
                                && status.getStatusDate().isBefore(endDate.plusDays(1)))
                .max(personStatusDateComparator);
        List<ArtPharmacy> pharmacyRefills = artPharmacyRepository.getArtPharmaciesByPersonAndArchived(person, 0);
        StatusDto statusDto = new StatusDto(HIV_PLUS_NON_ART, null);
        if (!pharmacyRefills.isEmpty()) {
            return currentStatus.map(this::calculatePatientCurrentStatus)
                    .orElse(statusDto);
        }

        HivEnrollment hivEnrollment = hivEnrollmentRepository.getHivEnrollmentByPersonAndArchived(person, 0)
                .orElseThrow(() -> new EntityNotFoundException(HivEnrollment.class, "person id", String.valueOf(person.getId())));
        LocalDate dateOfRegistration = hivEnrollment.getDateOfRegistration();
        Long statusAtRegistrationId = hivEnrollment.getStatusAtRegistrationId();
        String statusAtRegistration = applicationCodesetService.getApplicationCodeset(statusAtRegistrationId).getDisplay();
        return new StatusDto(statusAtRegistration, dateOfRegistration);


    }


    private StatusDto calculatePatientCurrentStatus(HIVStatusTracker statusTracker) {
        if (statusTracker.getStatusDate() == null) statusTracker.setStatusDate(INVALID_DATE);
        AtomicReference<LocalDate> statusDate = new AtomicReference<>(statusTracker.getStatusDate());
        Comparator<ArtPharmacy> refilledComparator = Comparator.comparing(ArtPharmacy::getNextAppointment);
        //log.info("status tracker {}", statusTracker);
		/*Optional<ArtPharmacy> artPharmacy =
				artPharmacyRepository
						.getArtPharmaciesByPersonAndArchived(statusTracker.getPerson(),0)
						.stream()
						.max(refilledComparator);*/
        Optional<ArtPharmacy> artPharmacy = artPharmacyRepository
                .getOneArtPharmaciesByPersonAndArchived(statusTracker.getPerson().getUuid(), 0);

        artPharmacy.ifPresent(p -> statusDate.set(p.getNextAppointment()));
       System.out.println("+++++++++statusTracker.getHivStatus++++++==:"+ statusTracker.getHivStatus());
        List<String> staticStatus = Arrays.asList("Stopped Treatment", "Died (Confirmed)", "ART Transfer Out", "HIV_NEGATIVE", "ART Transfer In" );
        if (staticStatus.contains(statusTracker.getHivStatus())) {
            if (statusTracker.getHivStatus().equalsIgnoreCase(HIV_NEGATIVE)) {
                return new StatusDto(NOT_ENROLLED, statusTracker.getStatusDate());
            }
            return new StatusDto(statusTracker.getHivStatus(), statusTracker.getStatusDate());
        } else {
            LocalDate dateStatus;
            if (statusDate.get() == null) {
                dateStatus = INVALID_DATE;
            } else {
                dateStatus = statusDate.get();
            }
            if (statusDate.get() != null && dateStatus != null && dateStatus.isBefore(LocalDate.now())) {
                long days = ChronoUnit.DAYS.between(dateStatus, LocalDate.now());
                if (statusTracker.getHivStatus().equalsIgnoreCase(ART_TRANSFER_IN)) {
                    return new StatusDto(ART_TRANSFER_IN, statusTracker.getStatusDate());
                }
                if (days >= 29) {
                    return new StatusDto(IIT, dateStatus.plusDays(TWENTY_NINE_DAYS));
                }
                return new StatusDto(ACTIVE_ON_TREATMENT, dateStatus);
            }
        }
        return new StatusDto(ACTIVE_ON_TREATMENT, statusDate.get());
    }


    public List<HIVStatusTrackerDto> getPersonHIVStatusByPersonId(Long personId) {
        Person person = getPerson(personId);
        return hivStatusTrackerRepository.findAllByPersonAndArchived(person, 0)
                .stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());


    }

    public List<HIVStatusTrackerDto> getAllHIVStatusTracker() {
        return hivStatusTrackerRepository.findAll()
                .stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());
    }

    public void archivedHIVStatusTracker(Long id) {
        HIVStatusTracker existingHivStatusTracker = getExistingHivStatusTracker(id);
        existingHivStatusTracker.setArchived(1);
        hivStatusTrackerRepository.save(existingHivStatusTracker);
    }


    private HIVStatusTracker getExistingHivStatusTracker(Long id) {
        return hivStatusTrackerRepository.findById(id)
                .orElseThrow(() -> new NoRecordFoundException("Status find for this id " + id));
    }

    public HIVStatusTracker convertDtoToEntity(HIVStatusTrackerDto hivStatusTrackerDto) {
        Person person = getPerson(hivStatusTrackerDto.getPersonId());
        HIVStatusTracker hivStatusTracker = new HIVStatusTracker();
        BeanUtils.copyProperties(hivStatusTrackerDto, hivStatusTracker);
        String hivStatus = hivStatusTracker.getHivStatus();
        if (hivStatus.contains("Death")) {
            hivStatus = "Died (Confirmed)";
        }
        if (hivStatus.contains("Treatment Stop")) {
            hivStatus = "Stopped Treatment";
        }
        if (hivStatus.contains("Self-transfer to another facility")) {
            hivStatus = "ART Transfer Out";
        }
        hivStatusTracker.setHivStatus(hivStatus);
        hivStatusTracker.setPerson(person);
        hivStatusTracker.setFacilityId(organizationUtil.getCurrentUserOrganization());
        return hivStatusTracker;
    }

    public HIVStatusTrackerDto convertEntityToDto(HIVStatusTracker hivStatusTracker) {
        HIVStatusTrackerDto hivStatusTrackerDto = new HIVStatusTrackerDto();
        BeanUtils.copyProperties(hivStatusTracker, hivStatusTrackerDto);
        hivStatusTrackerDto.setPersonId(hivStatusTracker.getPerson().getId());
        return hivStatusTrackerDto;

    }


    public HIVStatusTracker findDistinctFirstByPersonAndStatusDate(Person person, LocalDate visitDate) {
        return hivStatusTrackerRepository.findDistinctFirstByPersonAndStatusDate(person, visitDate);
    }

    private Person getPerson(Long personId) {
        return personRepository.findById(personId).orElseThrow(() -> new EntityNotFoundException(Person.class, "id", String.valueOf(personId)));

    }


    public void  activateTransferOutStatus(String personId) {
        HIVStatusTracker hivStatusTracker = hivStatusTrackerRepository
                .getStopStatus(personId).orElseThrow(() -> new NoRecordFoundException("No stop status found for this person"));
        hivStatusTracker.setHivStatus("ART Start");
        hivStatusTracker.setStatusDate(LocalDate.now());
        hivStatusTracker.setId(null);
        hivStatusTracker.setUuid(UUID.randomUUID().toString());
        hivStatusTracker.setReasonForInterruption("Self-returned _to_care");
         hivStatusTrackerRepository.save(hivStatusTracker);
    }
}
