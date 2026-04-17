package org.lamisplus.modules.hiv.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.hiv.domain.dto.initialclinicalevaluation.*;
import org.lamisplus.modules.hiv.domain.entity.InitialClinicalEvaluation;
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
             //
            // Update HIV Status to Pre-ART after initial clinical evaluation
            String hivStatus = evaluationDTO.isTransferIn() ?
                    HIV_STATUS_ENROL_PRE_ART_TRANSFER_IN : HIV_STATUS_ENROL_HIV_NON_ART;
            hivStatusTrackerService.autoUpdateHIVStatus(person, visit, hivStatus, evaluationDTO.getDateOfObservation());

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

        InitialClinicalEvaluation evaluation = initialClinicalEvaluationRepository
                .findByPersonAndFacilityIdAndArchived(person, orgId, 0)
                .orElseThrow(() -> new EntityNotFoundException(
                        InitialClinicalEvaluation.class,
                        "personId",
                        String.valueOf(personId)
                ));

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
        boolean exists = initialClinicalEvaluationRepository
                .findByPersonAndFacilityIdAndArchived(person, orgId, 0)
                .isPresent();

        if (exists) {
            throw new RecordExistException(
                    InitialClinicalEvaluation.class,
                    "Initial Clinical Evaluation",
                    "This patient already has an Initial Clinical Evaluation record. Only one evaluation is allowed per patient."
            );
        }
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
}
