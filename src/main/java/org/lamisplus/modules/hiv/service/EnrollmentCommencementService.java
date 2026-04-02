package org.lamisplus.modules.hiv.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.hiv.domain.dto.enrollmentcommencement.CommencementDto;
import org.lamisplus.modules.hiv.domain.dto.enrollmentcommencement.EnrollmentCommencementRequestDto;
import org.lamisplus.modules.hiv.domain.dto.enrollmentcommencement.RegistrationDto;
import org.lamisplus.modules.hiv.domain.dto.enrollmentcommencement.TbPreventiveTherapyDto;
import org.lamisplus.modules.hiv.domain.entity.EnrollmentCommencement;
import org.lamisplus.modules.hiv.repositories.EnrollmentCommencementRepository;
import org.lamisplus.modules.hiv.utility.Constants;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.domain.entity.Visit;
import org.lamisplus.modules.patient.repository.PersonRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EnrollmentCommencementService {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private final EnrollmentCommencementRepository repository;
    private final PersonRepository personRepository;
    private final HandleHIVVisitEncounter hivVisitEncounter;
    private final CurrentUserOrganizationService currentUserOrganizationService;
    private final HIVStatusTrackerService hivStatusTrackerService;
    private final InitialClinicalEvaluationService initialClinicalEvaluationService;

    private static final String ART_START_STATUS = "ART Start";

    public EnrollmentCommencement create(EnrollmentCommencementRequestDto request) {
        Person person = resolvePerson(request.getPersonId());

        // Validate that Initial Clinical Evaluation exists before enrollment
        if (!initialClinicalEvaluationService.hasExistingICE(person.getId())) {
            log.error("Attempted enrollment for person {} without Initial Clinical Evaluation", person.getId());
            throw new IllegalStateException(
                    "Initial Clinical Evaluation must be completed before enrollment. " +
                    "Please complete the ICE form first for this patient.");
        }

        if (repository.existsByPersonAndArchived(person, 0)) {
            throw new RecordExistException(
                    EnrollmentCommencement.class, "person", String.valueOf(person.getId()));
        }

        validateRequiredFields(request, person);
        EnrollmentCommencement entity = buildEntity(request, person);
        EnrollmentCommencement saved = repository.save(entity);
        // Update HIV Status to ART Start after enrollment commencement
        hivStatusTrackerService.autoUpdateHIVStatus(person, entity.getVisit(), ART_START_STATUS, entity.getDateArtStarted());
        return saved;
    }

    public EnrollmentCommencement update(Long id, EnrollmentCommencementRequestDto request) {
        EnrollmentCommencement existing = getById(id);
        Person person = existing.getPerson();
        validateRequiredFields(request, person);
        EnrollmentCommencement updated = buildEntity(request, person);
        updated.setId(existing.getId());
        updated.setUuid(existing.getUuid());
        updated.setPerson(person);
        updated.setVisit(existing.getVisit());
        updated.setArchived(0);
        return repository.save(updated);
    }

    public EnrollmentCommencement getById(Long id) {
        return repository.findByIdAndArchived(id, 0)
                .orElseThrow(() -> new EntityNotFoundException(
                        EnrollmentCommencement.class, "id", String.valueOf(id)));
    }

    public EnrollmentCommencement getByPersonId(Long personId) {
        Person person = resolvePerson(personId);
        return repository.findByPersonAndArchived(person, 0)
                .orElseThrow(() -> new EntityNotFoundException(
                        EnrollmentCommencement.class, "personId", String.valueOf(personId)));
    }

    public void delete(Long id) {
        EnrollmentCommencement entity = getById(id);
        entity.setArchived(1);
        repository.save(entity);
    }


    public boolean hasExistingRecord(Long personId) {
        Person person = resolvePerson(personId);
        return repository.existsByPersonAndArchived(person, 0);
    }

    public boolean uniqueIdExists(Long personId, String uniqueId) {
        if (uniqueId == null || uniqueId.trim().isEmpty()) {
            return false;
        }

        if (personId != null) {
            // When updating, exclude the current person's record
            try {
                Person person = resolvePerson(personId);
                return repository.findByUniqueIdAndArchivedAndPersonNot(uniqueId.trim(), 0, person).isPresent();
            } catch (Exception e) {
                log.warn("Person with ID {} not found during unique ID check", personId);
                // If person not found, check without exclusion
                return repository.findByUniqueIdAndArchived(uniqueId.trim(), 0).isPresent();
            }
        }

        // When creating new record
        return repository.findByUniqueIdAndArchived(uniqueId.trim(), 0).isPresent();
    }


    private void validateRequiredFields(EnrollmentCommencementRequestDto request, Person person) {
        RegistrationDto reg = request.getData().getRegistration();
        CommencementDto com = request.getData().getCommencement();

        if (isNullOrEmpty(reg.getDateEnrolledInHivCare())) {
            throw new IllegalArgumentException("date_enrolled_in_hiv_care is required");
        }

        if (isNullOrEmpty(reg.getDateConfirmedHivTest())) {
            throw new IllegalArgumentException("date_confirmed_hiv_test is required");
        }
        LocalDate dateEnrolled = parseDate(reg.getDateEnrolledInHivCare());
        LocalDate dateConfirmed = parseDate(reg.getDateConfirmedHivTest());
        if (dateConfirmed != null && dateEnrolled != null && dateConfirmed.isAfter(dateEnrolled)) {
            throw new IllegalArgumentException(
                "date_confirmed_hiv_test cannot be after date_enrolled_in_hiv_care");
        }

        if (isNullOrEmpty(reg.getHivTestLocation())) {
            throw new IllegalArgumentException("hiv_test_location is required");
        }

        if (reg.getModeOfHivTest() == null) {
            throw new IllegalArgumentException("mode_of_hiv_test is required");
        }

        if (reg.getCareEntryPoint() == null) {
            throw new IllegalArgumentException("care_entry_point is required");
        }

        if (reg.getPriorArt() == null) {
            throw new IllegalArgumentException("prior_art is required");
        }

        if (isNullOrEmpty(com.getDateArtStarted())) {
            throw new IllegalArgumentException("date_art_started is required");
        }

        LocalDate dateArtStarted = parseDate(com.getDateArtStarted());
        if (dateArtStarted != null && dateEnrolled != null && dateArtStarted.isBefore(dateEnrolled)) {
            throw new IllegalArgumentException(
                "date_art_started cannot be before date_enrolled_in_hiv_care");
        }
        //  Mother's Unique ID — Required if patient age < 18 months (infant)
        if (person.getDateOfBirth() != null) {
            long ageInMonths = ChronoUnit.MONTHS.between(person.getDateOfBirth(), LocalDate.now());
            if (ageInMonths < 18 && isNullOrEmpty(reg.getMotherUniqueId())) {
                throw new IllegalArgumentException(
                    "mother_unique_id is required for infants (age < 18 months)");
            }
        }

        //  KP Typology — Required if is_kp = "Yes"
        if ("Yes".equalsIgnoreCase(reg.getIsKp()) && reg.getKpTypology() == null) {
            throw new IllegalArgumentException(
                "kp_typology is required when is_kp = 'Yes'");
        }


        if (!isNullOrEmpty(reg.getDateTransferredIn()) &&
            isNullOrEmpty(reg.getFacilityTransferredFrom())) {
            throw new IllegalArgumentException(
                "facility_transferred_from is required when date_transferred_in is provided");
        }

        // Date transferred in must not be after date enrolled in HIV care
        if (!isNullOrEmpty(reg.getDateTransferredIn())) {
            LocalDate dateTransferred = parseDate(reg.getDateTransferredIn());
            if (dateTransferred != null && dateEnrolled != null && dateTransferred.isAfter(dateEnrolled)) {
                throw new IllegalArgumentException(
                    "date_transferred_in cannot be after date_enrolled_in_hiv_care");
            }
        }

        TbPreventiveTherapyDto tpt = com.getTbPreventiveTherapy();
        if (tpt != null) {
            // TPT start date must not be before date enrolled in HIV care
            if (!isNullOrEmpty(tpt.getStartDate())) {
                LocalDate tptStartDate = parseDate(tpt.getStartDate());
                if (tptStartDate != null && dateEnrolled != null && tptStartDate.isBefore(dateEnrolled)) {
                    throw new IllegalArgumentException(
                        "tpt_start_date cannot be before date_enrolled_in_hiv_care");
                }
            }

            // TPT completion date must not be before TPT start date
            if (!isNullOrEmpty(tpt.getCompletionDate()) && !isNullOrEmpty(tpt.getStartDate())) {
                LocalDate tptCompletionDate = parseDate(tpt.getCompletionDate());
                LocalDate tptStartDate = parseDate(tpt.getStartDate());
                if (tptCompletionDate != null && tptStartDate != null && tptCompletionDate.isBefore(tptStartDate)) {
                    throw new IllegalArgumentException(
                        "tpt_completion_date cannot be before tpt_start_date");
                }
            }
        }
    }


    private boolean isNullOrEmpty(String value) {
        return value == null || value.trim().isEmpty();
    }

    private EnrollmentCommencement buildEntity(EnrollmentCommencementRequestDto request, Person person) {
        RegistrationDto reg = request.getData().getRegistration();
        CommencementDto com = request.getData().getCommencement();
        LocalDate artStartDate = parseDate(com.getDateArtStarted());
        LocalDate visitDate = parseDate(request.getDateOfObservation());
        Visit visit = hivVisitEncounter.processAndCreateVisit(person.getId(), artStartDate);
        EnrollmentCommencement entity = new EnrollmentCommencement();
        entity.setUuid(UUID.randomUUID().toString());
        entity.setPerson(person);
        entity.setVisit(visit);
        entity.setVisitDate(visitDate != null ? visitDate : artStartDate); // Use dateOfObservation or fallback to artStartDate
        entity.setIsCommencement(Boolean.TRUE);
        entity.setArchived(0);
        entity.setFacilityId(currentUserOrganizationService.getCurrentUserOrganization());
        entity.setSource(Constants.WEB_SOURCE);
        // ── Registration fields ───────────────────────────────────────────────
        entity.setUniqueId(reg.getUniqueId());
        entity.setDateEnrolledInHivCare(parseDate(reg.getDateEnrolledInHivCare()));
        entity.setDateConfirmedHivTest(parseDate(reg.getDateConfirmedHivTest()));
        entity.setHivTestLocation(reg.getHivTestLocation());
        entity.setModeOfHivTestId(reg.getModeOfHivTest());
        entity.setCareEntryPointId(reg.getCareEntryPoint());
        entity.setCareEntryPointOther(reg.getCareEntryPointOther());
        entity.setMotherUniqueId(reg.getMotherUniqueId());
        entity.setPriorArtId(reg.getPriorArt());
        entity.setIsKp("Yes".equalsIgnoreCase(reg.getIsKp()));
        entity.setKpTypologyId(reg.getKpTypology());
        entity.setDateTransferredIn(parseDate(reg.getDateTransferredIn()));
        entity.setFacilityTransferredFrom(reg.getFacilityTransferredFrom());

        // ── Commencement fields ───────────────────────────────────────────────
        entity.setClinicalStageId(com.getClinicalStageAtArtStart());
        entity.setCd4AtArtStart(parseLong(com.getCd4AtArtStart()));
        entity.setCd4Percentage(parseDouble(com.getCd4Percentage()));
        entity.setCd4LfId(com.getCd4Lf());
        entity.setDateAdherenceCounselingCompleted(parseDate(com.getDateAdherenceCounselingCompleted()));
        entity.setDateArtStarted(artStartDate);
        entity.setRegimenLineId(com.getRegimenLineId());
        entity.setRegimenId(com.getFirstArtRegimen());
        entity.setWeightKg(parseDouble(com.getWeightKg()));
        entity.setHeightCm(parseDouble(com.getHeightCm()));
        entity.setBmi(parseDouble(com.getBmi()));
        entity.setMuac(parseDouble(com.getMuac()));
        entity.setMuacIndication(com.getMuacIndication());
        entity.setIsPregnant("Yes".equalsIgnoreCase(com.getIsPregnant()));
        entity.setPregnancyStatus(com.getPregnancyStatus());

        // ── TPT ───────────────────────────────────────────────────────────────
        TbPreventiveTherapyDto tpt = com.getTbPreventiveTherapy();
        if (tpt != null) {
            entity.setTptMedication(tpt.getMedication());
            entity.setTptDose(tpt.getDose());
            entity.setTptStartDate(parseDate(tpt.getStartDate()));
            entity.setTptCompleted(tpt.getTptCompleted());
            entity.setTptCompletionDate(parseDate(tpt.getCompletionDate()));
        }

        return entity;
    }

    private Person resolvePerson(Long personId) {
        return personRepository.findById(personId)
                .orElseThrow(() -> new EntityNotFoundException(
                        Person.class, "id", String.valueOf(personId)));
    }

    private LocalDate parseDate(String raw) {
        if (raw == null || raw.trim().isEmpty()) return null;
        try {
            return LocalDate.parse(raw, DATE_FMT);
        } catch (Exception e) {
            log.warn("Could not parse date '{}': {}", raw, e.getMessage());
            return null;
        }
    }

    private Long parseLong(String raw) {
        if (raw == null || raw.trim().isEmpty()) return null;
        try {
            return Long.parseLong(raw);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Double parseDouble(String raw) {
        if (raw == null || raw.trim().isEmpty()) return null;
        try {
            return Double.parseDouble(raw);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
