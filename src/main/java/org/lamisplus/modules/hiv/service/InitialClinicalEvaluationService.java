package org.lamisplus.modules.hiv.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.hiv.domain.dto.initialclinicalevaluation.InitialClinicalEvaluationDTO;
import org.lamisplus.modules.hiv.domain.dto.ObservationDto;
import org.lamisplus.modules.hiv.domain.entity.Observation;
import org.lamisplus.modules.hiv.repositories.ObservationRepository;
import org.lamisplus.modules.hiv.utility.Constants;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.domain.entity.Visit;
import org.lamisplus.modules.patient.repository.PersonRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class InitialClinicalEvaluationService {

    private final ObservationRepository observationRepository;
    private final PersonRepository personRepository;
    private final CurrentUserOrganizationService currentUserOrganizationService;
    private final HandleHIVVisitEncounter handleHIVVisitEncounter;
    private final ObjectMapper objectMapper;
    private final HIVStatusTrackerService hivStatusTrackerService;

    private static final String OBSERVATION_TYPE = "Initial Clinical evaluation";
    private static final String PRE_ART_STATUS = "HIV+ NON ART";


    public InitialClinicalEvaluationDTO createInitialClinicalEvaluation(InitialClinicalEvaluationDTO evaluationDTO)
            throws RecordExistException {
        try {
            log.info("Creating Initial Clinical Evaluation for person ID: {}", evaluationDTO.getPersonId());

            Long personId = evaluationDTO.getPersonId();
            Person person = getPerson(personId);
            Long orgId = currentUserOrganizationService.getCurrentUserOrganization();


            checkForExistingClinicalEvaluation(person, orgId);
            checkForSameEncounterObservation(person, evaluationDTO);
            evaluationDTO.setFacilityId(orgId);
            evaluationDTO.setType(OBSERVATION_TYPE);

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

            // Save the observation
            saveObservation(evaluationDTO, person, visit);

            // Update HIV Status to Pre-ART after initial clinical evaluation
            hivStatusTrackerService.autoUpdateHIVStatus(person, visit, PRE_ART_STATUS, evaluationDTO.getDateOfObservation());

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

        Observation existingObservation = observationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Observation.class, "id", String.valueOf(id)));

        existingObservation.setType(OBSERVATION_TYPE);
        existingObservation.setDateOfObservation(evaluationDTO.getDateOfObservation());
        existingObservation.setComment(evaluationDTO.getComment());
        existingObservation.setData(objectMapper.valueToTree(evaluationDTO.getData()));

        Observation savedObservation = observationRepository.save(existingObservation);

        evaluationDTO.setId(savedObservation.getId());
        evaluationDTO.setFacilityId(savedObservation.getFacilityId());

        log.info("Initial Clinical Evaluation updated successfully with ID: {}", id);
        return evaluationDTO;
    }

    public InitialClinicalEvaluationDTO getInitialClinicalEvaluationById(Long id) {
        log.info("Fetching Initial Clinical Evaluation with ID: {}", id);

        Observation observation = getObservation(id);
        return convertObservationToDTO(observation);
    }

    public InitialClinicalEvaluationDTO getInitialClinicalEvaluationByPersonId(Long personId) {
        log.info("Fetching Initial Clinical Evaluation for person ID: {}", personId);

        Person person = getPerson(personId);
        Long orgId = currentUserOrganizationService.getCurrentUserOrganization();

        List<Observation> observations = observationRepository
                .getAllByTypeAndPersonAndFacilityIdAndArchived(OBSERVATION_TYPE, person, orgId, 0);

        if (observations.isEmpty()) {
            throw new EntityNotFoundException(Observation.class, "personId", String.valueOf(personId));
        }
        return convertObservationToDTO(observations.get(0));
    }


    public List<ObservationDto> getAllObservationsByPerson(Long personId) {
        log.info("Fetching all observations for person ID: {}", personId);
        Person person = getPerson(personId);
        Long orgId = currentUserOrganizationService.getCurrentUserOrganization();

        List<Observation> observations = observationRepository.getAllByPersonAndFacilityId(person, orgId);

        return observations.stream()
                .filter(observation -> observation.getArchived() == 0)
                .map(this::convertObservationToDtoGeneric)
                .collect(Collectors.toList());
    }


    public String deleteInitialClinicalEvaluation(Long id) {
        log.info("Deleting Initial Clinical Evaluation with ID: {}", id);

        Observation observation = getObservation(id);
        observation.setArchived(1);
        observationRepository.save(observation);

        log.info("Initial Clinical Evaluation deleted successfully with ID: {}", id);
        return "successfully";
    }


    public boolean hasExistingICE(Long personId) {
        log.info("Checking if person ID: {} has an existing ICE record", personId);
        Person person = getPerson(personId);
        Long orgId = currentUserOrganizationService.getCurrentUserOrganization();

        List<Observation> existingEvaluations = observationRepository
                .getAllByTypeAndPersonAndFacilityIdAndArchived(OBSERVATION_TYPE, person, orgId, 0);

        boolean exists = !existingEvaluations.isEmpty();
        log.info("ICE exists check for person ID {}: {}", personId, exists);
        return exists;
    }


    private void checkForExistingClinicalEvaluation(Person person, Long orgId) throws RecordExistException {
        List<Observation> existingEvaluations = observationRepository
                .getAllByTypeAndPersonAndFacilityIdAndArchived(OBSERVATION_TYPE, person, orgId, 0);

        if (!existingEvaluations.isEmpty()) {
            throw new RecordExistException(Observation.class, "Initial Clinical Evaluation",
                "This patient already has an Initial Clinical Evaluation record. Only one evaluation is allowed per patient.");
        }
    }


    private void checkForSameEncounterObservation(Person person, InitialClinicalEvaluationDTO evaluationDTO)
            throws RecordExistException {
        List<Observation> personObservations = observationRepository
                .getAllByPersonAndFacilityIdAndArchived(person, person.getFacilityId(), 0);

        boolean sameEncounterExists = personObservations.stream()
                .anyMatch(o -> o.getType().equals(OBSERVATION_TYPE)
                        && o.getDateOfObservation().equals(evaluationDTO.getDateOfObservation()));

        if (sameEncounterExists) {
            throw new RecordExistException(
                Observation.class,
                "Initial Clinical Evaluation",
                "An Initial Clinical Evaluation already exists for this patient on " + evaluationDTO.getDateOfObservation() + ". Please use a different date or update the existing record."
            );
        }
    }


    private void saveObservation(InitialClinicalEvaluationDTO evaluationDTO, Person person, Visit visit) {
        Observation observation = new Observation();

        // Copy basic properties
        observation.setDateOfObservation(evaluationDTO.getDateOfObservation());
        observation.setType(evaluationDTO.getType());
        observation.setComment(evaluationDTO.getComment());
        observation.setSource(evaluationDTO.getSource());
        observation.setLongitude(evaluationDTO.getLongitude());
        observation.setLatitude(evaluationDTO.getLatitude());
        observation.setFacilityId(evaluationDTO.getFacilityId());

        // Convert data DTO to JsonNode
        observation.setData(objectMapper.valueToTree(evaluationDTO.getData()));

        // Set relationships
        observation.setPerson(person);
        observation.setVisit(visit);
        observation.setUuid(UUID.randomUUID().toString());
        observation.setArchived(0);
        Observation savedObservation = observationRepository.save(observation);
        evaluationDTO.setId(savedObservation.getId());
    }


    private InitialClinicalEvaluationDTO convertObservationToDTO(Observation observation) {
        InitialClinicalEvaluationDTO dto = new InitialClinicalEvaluationDTO();

        dto.setId(observation.getId());
        dto.setDateOfObservation(observation.getDateOfObservation());
        dto.setPersonId(observation.getPerson().getId());
        dto.setType(observation.getType());
        dto.setFacilityId(observation.getFacilityId());
        dto.setVisitId(observation.getVisit().getId());
        dto.setComment(observation.getComment());
        dto.setSource(observation.getSource());
        dto.setLongitude(observation.getLongitude());
        dto.setLatitude(observation.getLatitude());
        dto.setData(objectMapper.convertValue(
            observation.getData(),
            org.lamisplus.modules.hiv.domain.dto.initialclinicalevaluation.InitialClinicalEvaluationDataDTO.class
        ));

        return dto;
    }


    private ObservationDto convertObservationToDtoGeneric(Observation observation) {
        return ObservationDto.builder()
                .id(observation.getId())
                .dateOfObservation(observation.getDateOfObservation())
                .data(observation.getData())
                .personId(observation.getPerson().getId())
                .facilityId(observation.getFacilityId())
                .type(observation.getType())
                .visitId(observation.getVisit().getId())
                .comment(observation.getComment())
                .source(observation.getSource())
                .longitude(observation.getLongitude())
                .latitude(observation.getLatitude())
                .build();
    }


    private Observation getObservation(Long id) {
        return observationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Observation.class, "id", Long.toString(id)));
    }


    private Person getPerson(Long personId) {
        return personRepository.findById(personId)
                .orElseThrow(() -> new EntityNotFoundException(Person.class, "id", String.valueOf(personId)));
    }
}
