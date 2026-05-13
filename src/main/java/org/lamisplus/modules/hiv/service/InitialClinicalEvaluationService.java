package org.lamisplus.modules.hiv.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.hiv.domain.dto.initialclinicalevaluation.*;
import org.lamisplus.modules.hiv.domain.entity.InitialClinicalEvaluation;
import org.lamisplus.modules.hiv.repositories.AdherencePreparationRepository;
import org.lamisplus.modules.hiv.repositories.InitialClinicalEvaluationRepository;
import org.lamisplus.modules.hiv.utility.Constants;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.domain.entity.Visit;
import org.lamisplus.modules.patient.repository.PersonRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class InitialClinicalEvaluationService {

    private final InitialClinicalEvaluationRepository initialClinicalEvaluationRepository;
    private final PersonRepository personRepository;
    private final CurrentUserOrganizationService currentUserOrganizationService;
    private final HandleHIVVisitEncounter handleHIVVisitEncounter;
    private final ObjectMapper objectMapper;
    private final HIVStatusTrackerService hivStatusTrackerService;
    private final AdherencePreparationRepository adherencePreparationRepository;

//    private static final String PRE_ART_STATUS = "HIV+ NON ART";
    private static final String HIV_STATUS_ENROL_HIV_NON_ART = "HIV+ NON ART";
    private static final String HIV_STATUS_ENROL_PRE_ART_TRANSFER_IN = "Pre-ART Transfer In";
    private static final Long HIV_STATUS_ENROL_HIV_NON_ART_54 = 54L;
    private static final Long HIV_STATUS_ENROL_PRE_ART_TRANSFER_IN_56 = 56L;

    public InitialClinicalEvaluationDTO createInitialClinicalEvaluation(InitialClinicalEvaluationDTO evaluationDTO)
            throws RecordExistException {
        try {
            log.info("Creating Initial Clinical Evaluation for person ID: {}", evaluationDTO.getPersonId());

            Long personId = evaluationDTO.getPersonId();
            Person person = getPerson(personId);
            Long orgId = currentUserOrganizationService.getCurrentUserOrganization();

            // NEW: Validate that AdherencePreparation exists before ICE
            if (!adherencePreparationRepository.existsByPersonAndArchived(person, 0)) {
                log.error("Attempted ICE creation for person {} without Adherence Preparation", personId);
                throw new IllegalStateException(
                        "Adherence Preparation must be completed before Initial Clinical Evaluation. " +
                        "Please complete the Adherence Preparation form first for this patient.");
            }

            checkForExistingClinicalEvaluation(person, orgId);
            checkForSameEncounterEvaluation(person, evaluationDTO);
            evaluationDTO.setFacilityId(orgId);

            // Process and create visit
            Visit visit = handleHIVVisitEncounter.processAndCreateVisit(
                personId,
                evaluationDTO.getDateOfObservation()
            );

            if (visit != null) {
                evaluationDTO.setVisitId(visit.getId());
                evaluationDTO.setLatitude(evaluationDTO.getLatitude());
                evaluationDTO.setLongitude(evaluationDTO.getLongitude());

                // Set source
                String rawSource = evaluationDTO.getSource();
                String sourceSupport;
                if (rawSource == null || rawSource.isEmpty()) {
                    sourceSupport = Constants.WEB_SOURCE;
                } else if (Constants.POC_SOURCE.equalsIgnoreCase(rawSource)) {
                    sourceSupport = Constants.POC_SOURCE;
                } else if (rawSource.toLowerCase().contains("mobile")) {
                    sourceSupport = Constants.MOBILE_SOURCE;
                } else {
                    sourceSupport = Constants.WEB_SOURCE;
                }
                evaluationDTO.setSource(sourceSupport);
            }

            // Save the evaluation
            saveInitialClinicalEvaluation(evaluationDTO, person, visit);

            // Update HIV Status to Pre-ART after initial clinical evaluation
            // IMPORTANT: For Part 2 returning clients with "HIV Exposed Status Unknown",
            // we should NOT update the status - it should remain as is throughout the enrollment cycle
            try {
                String currentStatus = hivStatusTrackerService.getPersonCurrentHIVStatusByPersonId(personId).getStatus();
                log.info("Current HIV status for person {} before ICE: {}", personId, currentStatus);

                if (!"HIV Exposed Status Unknown".equalsIgnoreCase(currentStatus)) {
                    // Only update status for Part 1A and Part 1B (not Part 2 returning clients)
                    String hivStatus = evaluationDTO.isTransferIn() ?
                            HIV_STATUS_ENROL_PRE_ART_TRANSFER_IN : HIV_STATUS_ENROL_HIV_NON_ART;
                    hivStatusTrackerService.autoUpdateHIVStatus(person, visit, hivStatus, evaluationDTO.getDateOfObservation());
                    log.info("✓ Updated HIV status to '{}' for person {} after ICE", hivStatus, personId);
                } else {
                    log.info("✓ PRESERVED status 'HIV Exposed Status Unknown' for Part 2 returning client (person {}) - NO status update", personId);
                }
            } catch (Exception e) {
                log.error("ERROR: Could not check current HIV status for person {}: {}", personId, e.getMessage());
                log.error("SAFETY: Skipping status update to avoid overwriting Part 2 returning client status");
                // DO NOT update status if we can't check current status - this is safer for Part 2 clients
                // The old logic of "defaulting to status update" was dangerous and could overwrite
                // "HIV Exposed Status Unknown" status for Part 2 returning clients
            }

            log.info("Initial Clinical Evaluation saved successfully for person ID: {}", personId);
            return evaluationDTO;

        } catch (RecordExistException e) {
            log.error("Record already exists: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error creating Initial Clinical Evaluation: {}", e.getMessage());
            throw new IllegalStateException("An error occurred while saving: " + e.getMessage());
        }
    }


    public InitialClinicalEvaluationDTO updateInitialClinicalEvaluation(Long id, InitialClinicalEvaluationDTO evaluationDTO) {
        log.info("Updating Initial Clinical Evaluation with ID: {}", id);

        InitialClinicalEvaluation existingEvaluation = initialClinicalEvaluationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(InitialClinicalEvaluation.class, "id", String.valueOf(id)));

        // Ensure person_uuid is populated (for records created before this field was added)
        if (existingEvaluation.getPersonUuid() == null && existingEvaluation.getPerson() != null) {
            existingEvaluation.setPersonUuid(existingEvaluation.getPerson().getUuid());
        }

        // Update fields
        existingEvaluation.setVisitDate(evaluationDTO.getDateOfObservation());
        existingEvaluation.setClinicianName(evaluationDTO.getData().getClinicianName());
        existingEvaluation.setComment(evaluationDTO.getComment());
        existingEvaluation.setTransferIn(existingEvaluation.isTransferIn());

        // NOTE: enrollmentSessionUuid is NEVER updated - it's immutable once set
        // This ensures the ICE remains linked to the same enrollment cycle

        // Extract and update regimen and WHO Stage fields from DTO
        if (evaluationDTO.getData() != null && evaluationDTO.getData().getAssessment() != null) {
            // Convert Long to String for regimen fields
            Long regimenLineId = evaluationDTO.getData().getAssessment().getRegimenLineId();
            existingEvaluation.setRegimenLineId(regimenLineId != null ? String.valueOf(regimenLineId) : null);

            Long regimenId = evaluationDTO.getData().getAssessment().getRegimenId();
            existingEvaluation.setRegimenId(regimenId != null ? String.valueOf(regimenId) : null);

            Long whoStageId = evaluationDTO.getData().getAssessment().getWhoStageId();
            existingEvaluation.setWhoStageId(whoStageId);

            existingEvaluation.setNextAppointment(evaluationDTO.getData().getAssessment().getNextAppointment());
        }

        // Convert entire data DTO to JsonNode and store in JSONB fields
        existingEvaluation.setSymptoms(objectMapper.valueToTree(evaluationDTO.getData().getSymptoms()));
        existingEvaluation.setOtherSymptom(evaluationDTO.getData().getOtherSymptom());
        existingEvaluation.setTbAssessment(objectMapper.valueToTree(evaluationDTO.getData().getTbAssessment()));
        existingEvaluation.setKnownDrugAllergies(objectMapper.valueToTree(evaluationDTO.getData().getKnownDrugAllergies()));
        existingEvaluation.setPregnancy(objectMapper.valueToTree(evaluationDTO.getData().getPregnancy()));
        existingEvaluation.setCurrentMedications(objectMapper.valueToTree(evaluationDTO.getData().getCurrentMeds()));
        existingEvaluation.setDisclosure(objectMapper.valueToTree(evaluationDTO.getData().getDisclosure()));
        existingEvaluation.setDisclosureOtherText(evaluationDTO.getData().getDisclosureOtherText());
        existingEvaluation.setArvSideEffects(objectMapper.valueToTree(evaluationDTO.getData().getArvSideEffects()));
        existingEvaluation.setArvHistory(objectMapper.valueToTree(evaluationDTO.getData().getArvHistory()));
        existingEvaluation.setVitals(objectMapper.valueToTree(evaluationDTO.getData().getVitals()));
        existingEvaluation.setPhysicalExam(objectMapper.valueToTree(evaluationDTO.getData().getPhysicalExam()));
        existingEvaluation.setAssessment(objectMapper.valueToTree(evaluationDTO.getData().getAssessment()));

        InitialClinicalEvaluation savedEvaluation = initialClinicalEvaluationRepository.save(existingEvaluation);

        evaluationDTO.setId(savedEvaluation.getId());
        evaluationDTO.setFacilityId(savedEvaluation.getFacilityId());

        log.info("Initial Clinical Evaluation updated successfully with ID: {}", id);
        return evaluationDTO;
    }

    public InitialClinicalEvaluationDTO getInitialClinicalEvaluationById(Long id) {
        log.info("Fetching Initial Clinical Evaluation with ID: {}", id);

        InitialClinicalEvaluation evaluation = getEvaluation(id);
        return convertEntityToDTO(evaluation);
    }

    public InitialClinicalEvaluationDTO getInitialClinicalEvaluationByPersonId(Long personId) {
        log.info("Fetching Initial Clinical Evaluation for person ID: {}", personId);

        Person person = getPerson(personId);
        Long orgId = currentUserOrganizationService.getCurrentUserOrganization();

        // Get all ICE records for this person and return the most recent one
        // Supports multiple enrollment cycles - returns the latest ICE
        List<InitialClinicalEvaluation> evaluations = initialClinicalEvaluationRepository
                .findAllByPersonAndFacilityIdAndArchivedOrderByVisitDateDesc(person, orgId, 0);

        if (evaluations.isEmpty()) {
            throw new EntityNotFoundException(
                    InitialClinicalEvaluation.class,
                    "personId",
                    String.valueOf(personId)
            );
        }

        // Return the most recent ICE record (first in the list since ordered by visitDate DESC)
        InitialClinicalEvaluation evaluation = evaluations.get(0);
        log.info("Returning most recent ICE (ID: {}) for person ID: {}", evaluation.getId(), personId);

        return convertEntityToDTO(evaluation);
    }


    public String deleteInitialClinicalEvaluation(Long id) {
        log.info("Deleting Initial Clinical Evaluation with ID: {}", id);

        InitialClinicalEvaluation evaluation = getEvaluation(id);
        evaluation.setArchived(1);
        initialClinicalEvaluationRepository.save(evaluation);

        log.info("Initial Clinical Evaluation deleted successfully with ID: {}", id);
        return "successfully";
    }


    public boolean hasExistingICE(Long personId) {
        log.info("Checking if person ID: {} has an existing ICE record", personId);
        Person person = getPerson(personId);
        Long orgId = currentUserOrganizationService.getCurrentUserOrganization();

        boolean exists = initialClinicalEvaluationRepository
                .existsByPersonAndArchived(person, 0);

        log.info("ICE exists check for person ID {}: {}", personId, exists);
        return exists;
    }


    private void checkForExistingClinicalEvaluation(Person person, Long orgId) throws RecordExistException {
        // Get the current enrollment session UUID from the latest AdherencePreparation
        String currentEnrollmentSessionUuid = getLatestEnrollmentSessionUuid(person);

        if (currentEnrollmentSessionUuid == null) {
            // No enrollment session found - this shouldn't happen as Adherence Prep is validated first
            log.warn("No enrollment session UUID found for person {} during ICE creation check", person.getId());
            return;
        }

        // Check if an ICE already exists for THIS enrollment session (not just any ICE)
        // This allows Part 2 returning clients to have multiple ICE records for different enrollment cycles
        boolean existsForCurrentSession = initialClinicalEvaluationRepository
                .existsByEnrollmentSessionUuidAndArchived(currentEnrollmentSessionUuid, 0);

        if (existsForCurrentSession) {
            throw new RecordExistException(
                    InitialClinicalEvaluation.class,
                    "Initial Clinical Evaluation",
                    "An Initial Clinical Evaluation already exists for this enrollment cycle. Only one evaluation is allowed per enrollment cycle."
            );
        }

        log.info("No existing ICE found for enrollment session {} - allowing creation", currentEnrollmentSessionUuid);
    }


    private void checkForSameEncounterEvaluation(Person person, InitialClinicalEvaluationDTO evaluationDTO)
            throws RecordExistException {
        // Check if an ICE already exists for this person on the same date
        boolean sameEncounterExists = initialClinicalEvaluationRepository
                .findAllByPersonIdOrderByVisitDateDesc(person.getId())
                .stream()
                .anyMatch(ice -> ice.getVisitDate().equals(evaluationDTO.getDateOfObservation())
                        && ice.getArchived() == 0);

        if (sameEncounterExists) {
            throw new RecordExistException(
                    InitialClinicalEvaluation.class,
                    "Initial Clinical Evaluation",
                    "An Initial Clinical Evaluation already exists for this patient on " + evaluationDTO.getDateOfObservation() + ". Please use a different date or update the existing record."
            );
        }
    }


    private void saveInitialClinicalEvaluation(InitialClinicalEvaluationDTO evaluationDTO, Person person, Visit visit) {
        InitialClinicalEvaluation evaluation = new InitialClinicalEvaluation();

        // Set basic properties
        evaluation.setPersonId(person.getId());
        evaluation.setPersonUuid(person.getUuid());
        evaluation.setVisitId(visit != null ? visit.getId() : null);
        evaluation.setUuid(UUID.randomUUID().toString());
        evaluation.setArchived(0);
        evaluation.setTransferIn(evaluationDTO.isTransferIn());
        evaluation.setFacilityId(evaluationDTO.getFacilityId());
        evaluation.setVisitDate(evaluationDTO.getDateOfObservation());
        evaluation.setClinicianName(evaluationDTO.getData().getClinicianName());
        evaluation.setComment(evaluationDTO.getComment());
        evaluation.setSource(evaluationDTO.getSource());
        evaluation.setLongitude(evaluationDTO.getLongitude());
        evaluation.setLatitude(evaluationDTO.getLatitude());

        // CRITICAL: Get enrollment session UUID from the latest AdherencePreparation record
        // This links ICE to the same enrollment cycle - REQUIRED for proper enrollment flow
        String enrollmentSessionUuid = getLatestEnrollmentSessionUuid(person);
        if (enrollmentSessionUuid == null) {
            log.error("Cannot create ICE for person ID: {} - No enrollment session UUID found. Adherence Preparation must be completed first.", person.getId());
            throw new IllegalStateException(
                "Cannot create Initial Clinical Evaluation without an active enrollment session. " +
                "Please ensure Adherence Preparation has been completed first for this patient."
            );
        }
        evaluation.setEnrollmentSessionUuid(enrollmentSessionUuid);
        log.info("ICE linked to enrollment session UUID: {}", enrollmentSessionUuid);

        // Extract regimen and WHO Stage fields from assessment data
        if (evaluationDTO.getData() != null && evaluationDTO.getData().getAssessment() != null) {
            // Convert Long to String for regimen fields
            Long regimenLineId = evaluationDTO.getData().getAssessment().getRegimenLineId();
            evaluation.setRegimenLineId(regimenLineId != null ? String.valueOf(regimenLineId) : null);

            Long regimenId = evaluationDTO.getData().getAssessment().getRegimenId();
            evaluation.setRegimenId(regimenId != null ? String.valueOf(regimenId) : null);

            // WHO Stage ID: Save the numeric ID from the codeset to the database column
            Long whoStageId = evaluationDTO.getData().getAssessment().getWhoStageId();
            evaluation.setWhoStageId(whoStageId);

            evaluation.setNextAppointment(evaluationDTO.getData().getAssessment().getNextAppointment());
        }

        // Convert complex data to JsonNode
        evaluation.setSymptoms(objectMapper.valueToTree(evaluationDTO.getData().getSymptoms()));
        evaluation.setOtherSymptom(evaluationDTO.getData().getOtherSymptom());
        evaluation.setTbAssessment(objectMapper.valueToTree(evaluationDTO.getData().getTbAssessment()));
        evaluation.setKnownDrugAllergies(objectMapper.valueToTree(evaluationDTO.getData().getKnownDrugAllergies()));
        evaluation.setPregnancy(objectMapper.valueToTree(evaluationDTO.getData().getPregnancy()));
        evaluation.setCurrentMedications(objectMapper.valueToTree(evaluationDTO.getData().getCurrentMeds()));
        evaluation.setDisclosure(objectMapper.valueToTree(evaluationDTO.getData().getDisclosure()));
        evaluation.setDisclosureOtherText(evaluationDTO.getData().getDisclosureOtherText());
        evaluation.setArvSideEffects(objectMapper.valueToTree(evaluationDTO.getData().getArvSideEffects()));
        evaluation.setArvHistory(objectMapper.valueToTree(evaluationDTO.getData().getArvHistory()));
        evaluation.setVitals(objectMapper.valueToTree(evaluationDTO.getData().getVitals()));
        evaluation.setPhysicalExam(objectMapper.valueToTree(evaluationDTO.getData().getPhysicalExam()));
        evaluation.setAssessment(objectMapper.valueToTree(evaluationDTO.getData().getAssessment()));

        InitialClinicalEvaluation savedEvaluation = initialClinicalEvaluationRepository.save(evaluation);
        evaluationDTO.setId(savedEvaluation.getId());
    }


    private InitialClinicalEvaluationDTO convertEntityToDTO(InitialClinicalEvaluation evaluation) {
        InitialClinicalEvaluationDTO dto = new InitialClinicalEvaluationDTO();

        dto.setId(evaluation.getId());
        dto.setDateOfObservation(evaluation.getVisitDate());
        dto.setPersonId(evaluation.getPersonId());
        dto.setFacilityId(evaluation.getFacilityId());
        dto.setVisitId(evaluation.getVisitId());
        dto.setComment(evaluation.getComment());
        dto.setSource(evaluation.getSource());
        dto.setLongitude(evaluation.getLongitude());
        dto.setLatitude(evaluation.getLatitude());
        dto.setTransferIn(evaluation.isTransferIn()); // Set transferIn field from entity
        dto.setEnrollmentSessionUuid(evaluation.getEnrollmentSessionUuid());

        // Reconstruct the data DTO from JSONB fields and structured columns
        InitialClinicalEvaluationDataDTO dataDTO = new InitialClinicalEvaluationDataDTO();

        dataDTO.setClinicianName(evaluation.getClinicianName());

        // Convert JsonNode to proper types using TypeReference
        dataDTO.setSymptoms(evaluation.getSymptoms() != null ?
                objectMapper.convertValue(evaluation.getSymptoms(), new TypeReference<List<SymptomDTO>>() {}) : null);
        dataDTO.setOtherSymptom(evaluation.getOtherSymptom());

        dataDTO.setTbAssessment(evaluation.getTbAssessment() != null ?
                objectMapper.convertValue(evaluation.getTbAssessment(), TbAssessmentDTO.class) : null);

        dataDTO.setKnownDrugAllergies(evaluation.getKnownDrugAllergies() != null ?
                objectMapper.convertValue(evaluation.getKnownDrugAllergies(), new TypeReference<List<String>>() {}) : null);

        dataDTO.setPregnancy(evaluation.getPregnancy() != null ?
                objectMapper.convertValue(evaluation.getPregnancy(), PregnancyDTO.class) : null);

        // Handle currentMeds: can be List<String> (old format) or Map with codes and otherText (new format)
        dataDTO.setCurrentMeds(evaluation.getCurrentMedications() != null ?
                objectMapper.convertValue(evaluation.getCurrentMedications(), Object.class) : null);

        dataDTO.setDisclosure(evaluation.getDisclosure() != null ?
                objectMapper.convertValue(evaluation.getDisclosure(), new TypeReference<List<String>>() {}) : null);
        dataDTO.setDisclosureOtherText(evaluation.getDisclosureOtherText());

        dataDTO.setArvSideEffects(evaluation.getArvSideEffects() != null ?
                objectMapper.convertValue(evaluation.getArvSideEffects(), ArvSideEffectsDTO.class) : null);

        dataDTO.setArvHistory(evaluation.getArvHistory() != null ?
                objectMapper.convertValue(evaluation.getArvHistory(), ArvHistoryDTO.class) : null);

        dataDTO.setVitals(evaluation.getVitals() != null ?
                objectMapper.convertValue(evaluation.getVitals(), VitalsDTO.class) : null);

        dataDTO.setPhysicalExam(evaluation.getPhysicalExam() != null ?
                objectMapper.convertValue(evaluation.getPhysicalExam(), PhysicalExamDTO.class) : null);

        AssessmentDTO assessmentDTO = evaluation.getAssessment() != null ?
                objectMapper.convertValue(evaluation.getAssessment(), AssessmentDTO.class) : null;

        if (assessmentDTO != null) {
            try {
                assessmentDTO.setRegimenLineId(evaluation.getRegimenLineId() != null ?
                        Long.parseLong(evaluation.getRegimenLineId()) : null);
            } catch (NumberFormatException e) {
                log.warn("Invalid regimen line ID: {}", evaluation.getRegimenLineId());
                assessmentDTO.setRegimenLineId(null);
            }

            try {
                assessmentDTO.setRegimenId(evaluation.getRegimenId() != null ?
                        Long.parseLong(evaluation.getRegimenId()) : null);
            } catch (NumberFormatException e) {
                log.warn("Invalid regimen ID: {}", evaluation.getRegimenId());
                assessmentDTO.setRegimenId(null);
            }
            assessmentDTO.setWhoStageId(evaluation.getWhoStageId());

            assessmentDTO.setNextAppointment(evaluation.getNextAppointment());
        }

        dataDTO.setAssessment(assessmentDTO);
        dto.setData(dataDTO);

        return dto;
    }


    private InitialClinicalEvaluation getEvaluation(Long id) {
        return initialClinicalEvaluationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        InitialClinicalEvaluation.class,
                        "id",
                        Long.toString(id)
                ));
    }


    private Person getPerson(Long personId) {
        return personRepository.findById(personId)
                .orElseThrow(() -> new EntityNotFoundException(Person.class, "id", String.valueOf(personId)));
    }

    /**
     * Get the latest enrollment session UUID from AdherencePreparation for this person
     * This ensures ICE is linked to the same enrollment cycle as AdherencePrep
     */
    private String getLatestEnrollmentSessionUuid(Person person) {
        return adherencePreparationRepository.findAllByPersonAndArchived(person, 0,
                org.springframework.data.domain.PageRequest.of(0, 1,
                    org.springframework.data.domain.Sort.by("serviceDate").descending()))
                .stream()
                .findFirst()
                .map(adherencePrep -> adherencePrep.getEnrollmentSessionUuid())
                .orElse(null);
    }
}
