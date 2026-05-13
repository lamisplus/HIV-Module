package org.lamisplus.modules.hiv.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.hiv.domain.dto.AdherencePreparationDto;
import org.lamisplus.modules.hiv.domain.dto.EnrollmentCycleStatusDto;
import org.lamisplus.modules.hiv.domain.entity.AdherencePreparation;
import org.lamisplus.modules.hiv.domain.entity.Observation;
import org.lamisplus.modules.hiv.domain.entity.PatientTransferIn;
import org.lamisplus.modules.hiv.repositories.AdherencePreparationRepository;
import org.lamisplus.modules.hiv.repositories.InitialClinicalEvaluationRepository;
import org.lamisplus.modules.hiv.repositories.EnrollmentCommencementRepository;
import org.lamisplus.modules.hiv.repositories.PatientTransferInRepository;
import org.lamisplus.modules.hiv.repositories.ObservationRepository;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.domain.entity.Visit;
import org.lamisplus.modules.patient.repository.PersonRepository;
import org.lamisplus.modules.patient.repository.VisitRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Slf4j
@Service
public class AdherencePreparationService {

    private final AdherencePreparationRepository adherencePreparationRepository;
    private final PersonRepository personRepository;
    private final VisitRepository visitRepository;
    private final CurrentUserOrganizationService organizationUtil;
    private final HandleHIVVisitEncounter hivVisitEncounter;
    private final InitialClinicalEvaluationRepository initialClinicalEvaluationRepository;
    private final EnrollmentCommencementRepository enrollmentCommencementRepository;
    private final PatientTransferInRepository patientTransferInRepository;
    private final ObservationRepository observationRepository;


    public AdherencePreparationDto createAdherencePreparation(AdherencePreparationDto dto) {
        log.info("Creating Adherence Preparation record for person ID: {}", dto.getPersonId());
        Person person = getPerson(dto.getPersonId());

        // STEP 1: Check for incomplete enrollment cycle (BLOCK if exists)
        checkForIncompleteEnrollmentCycle(person);

        Visit visit = hivVisitEncounter.processAndCreateVisit(
                dto.getPersonId(),
                dto.getServiceDate()
        );

        // Convert DTO to entity
        AdherencePreparation adherencePreparation = convertDtoToEntity(dto);
        adherencePreparation.setPerson(person);
        adherencePreparation.setVisit(visit);
        adherencePreparation.setUuid(UUID.randomUUID().toString());
        adherencePreparation.setArchived(0);
        adherencePreparation.setFacilityId(organizationUtil.getCurrentUserOrganization());

        // STEP 2: Determine enrollment session UUID based on entry point
        String enrollmentSessionUuid = determineEnrollmentSessionUuid(person);
        adherencePreparation.setEnrollmentSessionUuid(enrollmentSessionUuid);

        adherencePreparation.setAdherenceServices(dto.getAdherenceServices());
        adherencePreparation.setTreatmentSupporterData(dto.getTreatmentSupporterData());

        AdherencePreparation saved = adherencePreparationRepository.save(adherencePreparation);
        log.info("Created Adherence Preparation with enrollment session UUID: {}", saved.getEnrollmentSessionUuid());
        return convertEntityToDto(saved);
    }


    public AdherencePreparationDto updateAdherencePreparation(Long id, AdherencePreparationDto dto) {
        log.info("Updating Adherence Preparation record with ID: {}", id);

        AdherencePreparation existing = getExistingAdherencePreparation(id);

        // Update fields
        existing.setServiceDate(dto.getServiceDate());
        existing.setAdherenceServices(dto.getAdherenceServices());
        existing.setTreatmentSupporterData(dto.getTreatmentSupporterData());

        AdherencePreparation updated = adherencePreparationRepository.save(existing);
        log.info("Adherence Preparation record updated successfully with ID: {}", updated.getId());

        return convertEntityToDto(updated);
    }

    public void archiveAdherencePreparation(Long id) {
        AdherencePreparation adherencePreparation = getExistingAdherencePreparation(id);
        adherencePreparation.setArchived(1);
        adherencePreparationRepository.save(adherencePreparation);
    }

    public AdherencePreparationDto getAdherencePreparationById(Long id) {
        log.info("Fetching Adherence Preparation record with ID: {}", id);
        AdherencePreparation adherencePreparation = getExistingAdherencePreparation(id);
        return convertEntityToDto(adherencePreparation);
    }

    public List<AdherencePreparationDto> getAllAdherencePreparationByPersonId(Long personId, int pageNo, int pageSize) {
        Person person = getPerson(personId);
        Pageable paging = PageRequest.of(pageNo, pageSize, Sort.by("serviceDate").descending());
        Page<AdherencePreparation> records = adherencePreparationRepository.findAllByPersonAndArchived(person, 0, paging);

        if (records.hasContent()) {
            return records.getContent().stream()
                    .map(this::convertEntityToDto)
                    .collect(Collectors.toList());
        }
        return Collections.emptyList();
    }

    public List<AdherencePreparationDto> getAllAdherencePreparation() {
        log.info("Fetching all Adherence Preparation records");
        return adherencePreparationRepository.findByArchived(0).stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get the latest enrollment session UUID for a person
     * This is used by ICE and EnrollmentCommencement forms to link to the same enrollment cycle
     */
    public String getLatestEnrollmentSessionUuidByPersonId(Long personId) {
        log.info("Fetching latest enrollment session UUID for person ID: {}", personId);
        Person person = getPerson(personId);
        Pageable paging = PageRequest.of(0, 1, Sort.by("serviceDate").descending());
        Page<AdherencePreparation> records = adherencePreparationRepository.findAllByPersonAndArchived(person, 0, paging);

        if (records.hasContent()) {
            String sessionUuid = records.getContent().get(0).getEnrollmentSessionUuid();
            log.info("Found enrollment session UUID: {} for person ID: {}", sessionUuid, personId);
            return sessionUuid;
        }

        log.warn("No active Adherence Preparation record found for person ID: {}", personId);
        return null;
    }


    @NotNull
    private AdherencePreparation convertDtoToEntity(AdherencePreparationDto dto) {
        AdherencePreparation entity = new AdherencePreparation();
        BeanUtils.copyProperties(dto, entity);
        entity.setAdherenceServices(dto.getAdherenceServices());
        entity.setTreatmentSupporterData(dto.getTreatmentSupporterData());
        return entity;
    }

    @NotNull
    private AdherencePreparationDto convertEntityToDto(AdherencePreparation entity) {
        AdherencePreparationDto dto = new AdherencePreparationDto();
        BeanUtils.copyProperties(entity, dto);
        dto.setPersonId(entity.getPerson().getId());
        dto.setVisitId(entity.getVisit().getUuid());
        dto.setAdherenceServices(entity.getAdherenceServices());
        dto.setTreatmentSupporterData(entity.getTreatmentSupporterData());
        dto.setEnrollmentSessionUuid(entity.getEnrollmentSessionUuid());
        return dto;
    }

    private Person getPerson(Long personId) {
        return personRepository.findById(personId)
                .orElseThrow(() -> new EntityNotFoundException(Person.class, "id", String.valueOf(personId)));
    }

    private Visit getVisit(String visitUuid) {
        return visitRepository.findByUuid(visitUuid)
                .orElseThrow(() -> new EntityNotFoundException(Visit.class, "uuid", visitUuid));
    }

    private AdherencePreparation getExistingAdherencePreparation(Long id) {
        return adherencePreparationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(AdherencePreparation.class, "id", String.valueOf(id)));
    }

    /**
     * Check if person has incomplete enrollment cycle
     * Throws exception if there's an AdherencePrep without corresponding ICE or EnrollmentCommencement
     */
    private void checkForIncompleteEnrollmentCycle(Person person) {
        // Get the most recent AdherencePrep
        Pageable pageable = PageRequest.of(0, 1, Sort.by("serviceDate").descending());
        Page<AdherencePreparation> recentAdherencePreps = adherencePreparationRepository
                .findAllByPersonAndArchived(person, 0, pageable);

        if (!recentAdherencePreps.hasContent()) {
            return; // No previous AdherencePrep, OK to proceed
        }

        AdherencePreparation recentAdherencePrep = recentAdherencePreps.getContent().get(0);
        String sessionUuid = recentAdherencePrep.getEnrollmentSessionUuid();

        if (sessionUuid == null) {
            // Old record without session UUID - these records won't document initial enrollment cycle,
            // but can undergo subsequent enrollment cycles (Part 2: Returning Client - Transfer Out/In)
            log.info("Found AdherencePrep without session UUID for person ID: {}. Allowing new enrollment cycle.", person.getId());
            return;
        }

        // Check if ICE exists for this session
        boolean hasICE = initialClinicalEvaluationRepository
                .existsByEnrollmentSessionUuidAndArchived(sessionUuid, 0);

        // Check if EnrollmentCommencement exists for this session
        boolean hasEnrollment = enrollmentCommencementRepository
                .existsByEnrollmentSessionUuidAndArchived(sessionUuid, 0);

        if (!hasICE || !hasEnrollment) {
            log.error("Incomplete enrollment cycle found for person ID: {} with session UUID: {}", person.getId(), sessionUuid);
            throw new IllegalStateException(
                "This patient has an incomplete enrollment cycle. " +
                "Please complete the current enrollment process (ICE and Enrollment & Commencement forms) before starting a new one."
            );
        }

        log.info("Previous enrollment cycle is complete for person ID: {}. Allowing new enrollment.", person.getId());
    }

    /**
     * Determine enrollment session UUID based on entry point:
     * - Part 2: Get from recent Transfer IN Observation (Returning Client)
     * - Part 1B: Get from recent PatientTransferIn (Transfer-IN New Patient)
     * - Part 1A: Create NEW session (Positive HTS New Patient)
     */
    private String determineEnrollmentSessionUuid(Person person) {
        // STEP 1: Try to get session from recent Transfer IN Observation (Part 2 - Returning Client)
        String sessionUuid = getSessionFromRecentTransferInObservation(person);
        if (sessionUuid != null) {
            log.info("Part 2 (Returning Client): Using enrollment session UUID from Transfer IN Observation: {}", sessionUuid);
            return sessionUuid;
        }

        // STEP 2: Try to get session from recent PatientTransferIn (Part 1B - Transfer-IN New Patient)
        sessionUuid = getSessionFromRecentPatientTransferIn(person);
        if (sessionUuid != null) {
            log.info("Part 1B (Transfer-IN New Patient): Using enrollment session UUID from PatientTransferIn: {}", sessionUuid);
            return sessionUuid;
        }

        // STEP 3: Create NEW session (Part 1A - Positive HTS New Patient)
        sessionUuid = UUID.randomUUID().toString();
        log.info("Part 1A (Positive HTS New Patient): Created NEW enrollment session UUID: {}", sessionUuid);
        return sessionUuid;
    }

    /**
     * Get enrollment session UUID from most recent Transfer IN Observation (Part 2)
     * Type = "ART Transfer In"
     *
     * Only returns session UUID if:
     * 1. There's a Transfer IN observation
     * 2. AND it's newer than the last completed enrollment (indicating Part 2 returning client)
     */
    private String getSessionFromRecentTransferInObservation(Person person) {
        // Get the most recent Transfer IN observation
        Observation recentTransferIn = observationRepository.getAllByPersonAndArchived(person, 0).stream()
                .filter(obs -> "ART Transfer In".equalsIgnoreCase(obs.getType()))
                .max((o1, o2) -> o1.getDateOfObservation().compareTo(o2.getDateOfObservation()))
                .orElse(null);

        if (recentTransferIn == null) {
            return null;  // No Transfer IN found
        }

        // Check if this Transfer IN is newer than the last Enrollment Commencement
        // This indicates it's a Part 2 returning client starting a new enrollment cycle
        boolean hasNewerEnrollment = enrollmentCommencementRepository
                .findAllByPersonAndArchivedOrderByDateArtStartedDesc(person, 0).stream()
                .anyMatch(enrollment -> enrollment.getDateArtStarted().isAfter(recentTransferIn.getDateOfObservation()));

        if (hasNewerEnrollment) {
            // There's an enrollment AFTER this Transfer IN, so this is not an active Part 2 cycle
            return null;
        }

        // This is an active Part 2 returning client with Transfer IN
        return recentTransferIn.getEnrollmentSessionUuid();
    }

    /**
     * Get enrollment session UUID from most recent PatientTransferIn (Part 1B)
     */
    private String getSessionFromRecentPatientTransferIn(Person person) {
        return patientTransferInRepository.findAllByPersonIdOrderByReceivedDateDesc(person.getId()).stream()
                .filter(transferIn -> transferIn.getArchived() == 0)
                .findFirst()
                .map(PatientTransferIn::getEnrollmentSessionUuid)
                .orElse(null);
    }

    /**
     * Check if patient is currently in Transfer OUT status
     * Returns true if there's a Transfer OUT observation that's newer than the last enrollment
     * AND there's no Transfer IN after the Transfer OUT
     */
    private boolean isPatientInTransferOutStatus(Person person) {
        // Get the most recent Transfer OUT observation
        Observation recentTransferOut = observationRepository.getAllByPersonAndArchived(person, 0).stream()
                .filter(obs -> "ART Transfer Out".equalsIgnoreCase(obs.getType()))
                .max((o1, o2) -> o1.getDateOfObservation().compareTo(o2.getDateOfObservation()))
                .orElse(null);

        if (recentTransferOut == null) {
            return false;  // No Transfer OUT found
        }

        // Check if there's a Transfer IN that's newer than this Transfer OUT
        boolean hasNewerTransferIn = observationRepository.getAllByPersonAndArchived(person, 0).stream()
                .filter(obs -> "ART Transfer In".equalsIgnoreCase(obs.getType()))
                .anyMatch(obs -> obs.getDateOfObservation().isAfter(recentTransferOut.getDateOfObservation()));

        if (hasNewerTransferIn) {
            return false;  // Patient has already been transferred back in
        }

        // Check if there's an enrollment that's newer than this Transfer OUT
        // This would mean the Transfer OUT is from a previous cycle
        boolean hasNewerEnrollment = enrollmentCommencementRepository
                .findAllByPersonAndArchivedOrderByDateArtStartedDesc(person, 0).stream()
                .anyMatch(enrollment -> enrollment.getDateArtStarted().isAfter(recentTransferOut.getDateOfObservation()));

        if (hasNewerEnrollment) {
            return false;  // Enrollment is after Transfer OUT, so Transfer OUT is from old cycle
        }

        // Patient is in Transfer OUT status - transferred out and not yet transferred back in
        return true;
    }

    /**
     * Get enrollment cycle status for a person
     * This is used by the frontend to determine which menu items to show
     *
     * @param personId The person ID to check enrollment status for
     * @return EnrollmentCycleStatusDto containing current enrollment cycle information
     */
    public EnrollmentCycleStatusDto getEnrollmentCycleStatus(Long personId) {
        log.info("Checking enrollment cycle status for person ID: {}", personId);
        Person person = getPerson(personId);

        // STEP 0: Check if patient is in Transfer OUT status
        // If there's a Transfer OUT observation newer than the last enrollment,
        // and no Transfer IN yet, then enrollment cycle is interrupted
        boolean isInTransferOut = isPatientInTransferOutStatus(person);
        if (isInTransferOut) {
            log.info("Patient is in Transfer OUT status. Enrollment cycle is interrupted until Transfer IN.");
            return EnrollmentCycleStatusDto.builder()
                    .currentEnrollmentSessionUuid(null)
                    .hasAdherencePreparation(false)
                    .hasInitialClinicalEvaluation(false)
                    .hasEnrollmentCommencement(false)
                    .isEnrollmentCycleComplete(false)
                    .nextRequiredForm("TransferIN")  // Special state indicating they need to transfer back in
                    .entryPoint("TransferredOut")
                    .build();
        }

        // STEP 1: Check if this is Part 2 (Returning Client) with active Transfer IN
        String activeTransferInSessionUuid = getSessionFromRecentTransferInObservation(person);
        if (activeTransferInSessionUuid != null) {
            log.info("Part 2 (Returning Client): Found active Transfer IN with session UUID: {}", activeTransferInSessionUuid);

            // Check if AdherencePreparation exists for THIS Transfer IN session
            boolean hasAdherenceForThisSession = adherencePreparationRepository
                    .findAllByPersonAndArchived(person, 0, PageRequest.of(0, 100)).stream()
                    .anyMatch(prep -> activeTransferInSessionUuid.equals(prep.getEnrollmentSessionUuid()));

            if (!hasAdherenceForThisSession) {
                log.info("No AdherencePreparation for Transfer IN session {}. Returning client needs to start new enrollment cycle.", activeTransferInSessionUuid);
                return EnrollmentCycleStatusDto.builder()
                        .currentEnrollmentSessionUuid(activeTransferInSessionUuid)
                        .hasAdherencePreparation(false)
                        .hasInitialClinicalEvaluation(false)
                        .hasEnrollmentCommencement(false)
                        .isEnrollmentCycleComplete(false)
                        .nextRequiredForm("AdherencePreparation")
                        .entryPoint("Part2_ReturningClient")
                        .build();
            }

            // AdherencePrep exists for this session, check ICE and Enrollment
            boolean hasICE = initialClinicalEvaluationRepository
                    .existsByEnrollmentSessionUuidAndArchived(activeTransferInSessionUuid, 0);
            boolean hasEnrollment = enrollmentCommencementRepository
                    .existsByEnrollmentSessionUuidAndArchived(activeTransferInSessionUuid, 0);

            String nextForm = !hasICE ? "ICE" : !hasEnrollment ? "Enrollment" : "Complete";

            log.info("Part 2 status: hasAdherence=true, hasICE={}, hasEnrollment={}, nextForm={}", hasICE, hasEnrollment, nextForm);

            return EnrollmentCycleStatusDto.builder()
                    .currentEnrollmentSessionUuid(activeTransferInSessionUuid)
                    .hasAdherencePreparation(true)
                    .hasInitialClinicalEvaluation(hasICE)
                    .hasEnrollmentCommencement(hasEnrollment)
                    .isEnrollmentCycleComplete(hasICE && hasEnrollment)
                    .nextRequiredForm(nextForm)
                    .entryPoint("Part2_ReturningClient")
                    .build();
        }

        // STEP 2: Not Part 2, check for most recent AdherencePreparation (Part 1A or 1B)
        Pageable pageable = PageRequest.of(0, 1, Sort.by("serviceDate").descending());
        Page<AdherencePreparation> recentAdherencePreps = adherencePreparationRepository
                .findAllByPersonAndArchived(person, 0, pageable);

        // If no AdherencePreparation exists, enrollment hasn't started
        if (!recentAdherencePreps.hasContent()) {
            log.info("No AdherencePreparation found for person ID: {}. Enrollment not started.", personId);
            return EnrollmentCycleStatusDto.builder()
                    .currentEnrollmentSessionUuid(null)
                    .hasAdherencePreparation(false)
                    .hasInitialClinicalEvaluation(false)
                    .hasEnrollmentCommencement(false)
                    .isEnrollmentCycleComplete(false)
                    .nextRequiredForm("AdherencePreparation")
                    .entryPoint("Unknown")
                    .build();
        }

        AdherencePreparation recentAdherencePrep = recentAdherencePreps.getContent().get(0);
        String sessionUuid = recentAdherencePrep.getEnrollmentSessionUuid();

        // If session UUID is null (old record), consider it complete
        if (sessionUuid == null) {
            log.info("AdherencePreparation exists but has no session UUID (old record) for person ID: {}", personId);
            return EnrollmentCycleStatusDto.builder()
                    .currentEnrollmentSessionUuid(null)
                    .hasAdherencePreparation(true)
                    .hasInitialClinicalEvaluation(true)
                    .hasEnrollmentCommencement(true)
                    .isEnrollmentCycleComplete(true)
                    .nextRequiredForm("Complete")
                    .entryPoint("Unknown")
                    .build();
        }

        // Check if ICE exists for this session
        boolean hasICE = initialClinicalEvaluationRepository
                .existsByEnrollmentSessionUuidAndArchived(sessionUuid, 0);

        // Check if EnrollmentCommencement exists for this session
        boolean hasEnrollment = enrollmentCommencementRepository
                .existsByEnrollmentSessionUuidAndArchived(sessionUuid, 0);

        // Determine if cycle is complete
        boolean isComplete = hasICE && hasEnrollment;

        // Determine next required form
        String nextForm;
        if (!hasICE) {
            nextForm = "ICE";
        } else if (!hasEnrollment) {
            nextForm = "Enrollment";
        } else {
            nextForm = "Complete";
        }

        // Determine entry point
        String entryPoint = determineEntryPoint(person, sessionUuid);

        log.info("Enrollment status for person ID {}: Session={}, hasICE={}, hasEnrollment={}, nextForm={}, entryPoint={}",
                personId, sessionUuid, hasICE, hasEnrollment, nextForm, entryPoint);

        return EnrollmentCycleStatusDto.builder()
                .currentEnrollmentSessionUuid(sessionUuid)
                .hasAdherencePreparation(true)
                .hasInitialClinicalEvaluation(hasICE)
                .hasEnrollmentCommencement(hasEnrollment)
                .isEnrollmentCycleComplete(isComplete)
                .nextRequiredForm(nextForm)
                .entryPoint(entryPoint)
                .build();
    }

    /**
     * Determine the entry point for the current enrollment cycle
     */
    private String determineEntryPoint(Person person, String sessionUuid) {
        // Check if session UUID came from Transfer IN Observation (Part 2)
        boolean isFromTransferInObs = observationRepository.getAllByPersonAndArchived(person, 0).stream()
                .filter(obs -> "ART Transfer In".equalsIgnoreCase(obs.getType()))
                .anyMatch(obs -> sessionUuid.equals(obs.getEnrollmentSessionUuid()));

        if (isFromTransferInObs) {
            return "Part2_ReturningClient";
        }

        // Check if session UUID came from PatientTransferIn (Part 1B)
        boolean isFromPatientTransferIn = patientTransferInRepository
                .findAllByPersonIdOrderByReceivedDateDesc(person.getId()).stream()
                .filter(transferIn -> transferIn.getArchived() == 0)
                .anyMatch(transferIn -> sessionUuid.equals(transferIn.getEnrollmentSessionUuid()));

        if (isFromPatientTransferIn) {
            return "Part1B_TransferIn";
        }

        // Otherwise, it's Part 1A (Positive HTS)
        return "Part1A_PositiveHTS";
    }
}
