package org.lamisplus.modules.hiv.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.query.NativeQuery;
import org.hibernate.type.StringType;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.hiv.domain.dto.TPtCompletionStatusInfoDTO;
import org.lamisplus.modules.hiv.domain.dto.ObservationDto;
import org.lamisplus.modules.hiv.domain.entity.ArtPharmacy;
import org.lamisplus.modules.hiv.domain.entity.Observation;
import org.lamisplus.modules.hiv.repositories.ArtPharmacyRepository;
import org.lamisplus.modules.hiv.repositories.ObservationRepository;
import org.lamisplus.modules.hiv.utility.Constants;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.domain.entity.Visit;
import org.lamisplus.modules.patient.repository.PersonRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ObservationService {

    private final ObservationRepository observationRepository;
    private final PersonRepository personRepository;

    private final CurrentUserOrganizationService currentUserOrganizationService;

    private final HandleHIVVisitEncounter handleHIVisitEncounter;

    private final ArtPharmacyRepository pharmacyRepository;
    @PersistenceContext
    private EntityManager entityManager;


    public ObservationDto createAnObservation(ObservationDto observationDto) throws RecordExistException {
        try {
//            log.info("Saving an observation of type {}", observationDto.getType());

            Long personId = observationDto.getPersonId();
            Person person = getPerson(personId);
            Long orgId = currentUserOrganizationService.getCurrentUserOrganization();

            checkForExistingClinicalEvaluation(person, orgId, observationDto);

            checkForSameEncounterObservation(person, observationDto);

            processAndUpdateIptFromPharmacy(observationDto, person);

            observationDto.setFacilityId(orgId);
            Visit visit = handleHIVisitEncounter.processAndCreateVisit(personId, observationDto.getDateOfObservation());

            if (visit != null) {
                observationDto.setVisitId(visit.getId());
                observationDto.setLatitude(observationDto.getLatitude());
                observationDto.setLongitude(observationDto.getLongitude());
                String sourceSupport = observationDto.getSource() == null || observationDto.getSource().isEmpty() ? Constants.WEB_SOURCE : Constants.MOBILE_SOURCE;
                observationDto.setSource(sourceSupport);
            }

//            log.info("Appending additional info and saving observation of type {}", observationDto.getType());
            appendAdditionalInfoAndSaveObservation(observationDto, person, visit);

//            log.info("Observation saved successfully ");
            return observationDto;

        } catch (RecordExistException e) {
            // Handle RecordExistException
            log.error("Record already exists: " + e.getMessage());
            throw e; // Rethrow the exception if needed

        } catch (Exception e) {
            // Handle other exceptions
            log.error("An error occurred while saving an observation");
            log.error("Error message: " + e.getMessage());
            throw new IllegalStateException("An error occurred while saving " + e.getMessage());
        }
    }

    private void checkForExistingClinicalEvaluation(Person person, Long orgId, ObservationDto observationDto)
            throws RecordExistException {
        boolean anExistingClinicalEvaluation = getAnExistingClinicalEvaluationType("Clinical evaluation", person, orgId).isEmpty();
        if (!anExistingClinicalEvaluation && observationDto.getType().equals("Clinical evaluation")) {
            throw new RecordExistException(Observation.class, "type", observationDto.getType());
        }
    }

    private void checkForSameEncounterObservation(Person person, ObservationDto observationDto)
            throws RecordExistException {
        List<Observation> personObservations = observationRepository.getAllByPersonAndFacilityIdAndArchived(person, person.getFacilityId(), 1);
        boolean sameEncounterObservation = personObservations.stream()
                .anyMatch(o -> o.getType().equals(observationDto.getType())
                        && o.getDateOfObservation().equals(observationDto.getDateOfObservation())
                        && o.getArchived() == 0);
        if (sameEncounterObservation) {
            throw new RecordExistException(Observation.class, "date of observation", "" + observationDto.getDateOfObservation());
        }
    }


//    public ObservationDto createAnObservation(ObservationDto observationDto) throws RecordExistException {
//        try {
//            log.info("saving an observation of type {}", observationDto.getType());
//            Long personId = observationDto.getPersonId();
//            Person person = getPerson(personId);
//            Long orgId = currentUserOrganizationService.getCurrentUserOrganization();
//            boolean anExistingClinicalEvaluation = getAnExistingClinicalEvaluationType("Clinical evaluation", person, orgId).isEmpty();
//            List<Observation> personObservations =
//                    observationRepository.getAllByPersonAndFacilityId(person, person.getFacilityId());
//            if (!anExistingClinicalEvaluation && observationDto.getType().equals("Clinical evaluation")) {
//                throw new RecordExistException(Observation.class, "type", observationDto.getType());
//            }
//
//            boolean sameEncounterObservation = personObservations
//                    .stream()
//                    .anyMatch(o -> o.getType().equals(observationDto.getType())
//                            && o.getDateOfObservation().equals(observationDto.getDateOfObservation()));
//            if(sameEncounterObservation){
//                throw new RecordExistException(Observation.class, "date of observation", ""+observationDto.getDateOfObservation());
//            }
//
//            processAndUpdateIptFromPharmacy(observationDto, person);
//            observationDto.setFacilityId(orgId);
//            Visit visit = handleHIVisitEncounter.processAndCreateVisit(personId, observationDto.getDateOfObservation());
//            if (visit != null) {
//                observationDto.setVisitId(visit.getId());
//            }
//            log.info("appending additional info and saving observation of type {}", observationDto.getType());
//            appendAdditionalInfoAndSaveObservation(observationDto, person, visit);
//            log.info("observation save successfully ");
//            return observationDto;
//
//        } catch (RecordExistException e) {
//            // Handle RecordExistException
//            log.error("Record already exists: " + e.getMessage());
//            throw e; // Rethrow the exception if needed
//
//        } catch (Exception e) {
//            // Handle other exceptions
//            log.error("An error occurred while saving an observation");
//            log.error("Error message: " + e.getMessage());
//            throw new IllegalStateException("An error occurred while saving " + e.getMessage());
//        }
//    }
//    public ObservationDto createAnObservation(ObservationDto observationDto) {
//       try {
//           log.info("saving an observation of type {}", observationDto.getType());
//           Long personId = observationDto.getPersonId();
//           Person person = getPerson(personId);
//           Long orgId = currentUserOrganizationService.getCurrentUserOrganization();
//           boolean anExistingClinicalEvaluation = getAnExistingClinicalEvaluationType("Clinical evaluation", person, orgId).isEmpty();
//           List<Observation> personObservations =
//                   observationRepository.getAllByPersonAndFacilityId(person, person.getFacilityId());
//           if (!anExistingClinicalEvaluation && observationDto.getType().equals("Clinical evaluation")) {
//               throw new RecordExistException(Observation.class, "type", observationDto.getType());
//           }
//
//           boolean sameEncounterObservation = personObservations
//                   .stream()
//                   .anyMatch(o -> o.getType().equals(observationDto.getType())
//                           && o.getDateOfObservation().equals(observationDto.getDateOfObservation()));
//           if(sameEncounterObservation){
//               throw new RecordExistException(Observation.class, "date of observation", ""+observationDto.getDateOfObservation());
//           }
//
//           processAndUpdateIptFromPharmacy(observationDto, person);
//           observationDto.setFacilityId(orgId);
//           Visit visit = handleHIVisitEncounter.processAndCreateVisit(personId, observationDto.getDateOfObservation());
//           if (visit != null) {
//               observationDto.setVisitId(visit.getId());
//           }
//           log.info("appending additional info and saving observation of type {}", observationDto.getType());
//           appendAdditionalInfoAndSaveObservation(observationDto, person, visit);
//           log.info("observation save successfully ");
//           return observationDto;
//       }catch (Exception e) {
//           log.error("An error occurred while saving an observation");
//           log.error("error message: " + e.getMessage());
//           throw new IllegalStateException("An error occurred while saving "+e.getMessage());
//       }
//    }

    private void appendAdditionalInfoAndSaveObservation(ObservationDto observationDto, Person person, Visit visit) {
        Observation observation = new Observation();
        BeanUtils.copyProperties(observationDto, observation);
        observation.setPerson(person);
        observation.setUuid(UUID.randomUUID().toString());
        observation.setVisit(visit);
        observation.setArchived(0);
        Observation saveObservation = observationRepository.save(observation);
        observationDto.setId(saveObservation.getId());
    }


    private void processAndUpdateIptFromPharmacy(ObservationDto observationDto, Person person) {
        if (observationDto.getType().equals("Chronic Care")) {
            JsonNode tptMonitoring = observationDto.getData().get("tptMonitoring");
            JsonNode iptCompletionDate = tptMonitoring.get("date");
            JsonNode outComeOfIpt = tptMonitoring.get("outComeOfIpt");
            if ((outComeOfIpt != null && !outComeOfIpt.isEmpty()) || (iptCompletionDate != null && !iptCompletionDate.asText().isEmpty())) {
//                log.info ("found for IPT out come");
                StringBuilder dateIptCompleted = new StringBuilder();
                StringBuilder iptCompletionStatus = new StringBuilder();
//                log.info ("checking if IPT out come has a date");
                if (iptCompletionDate != null) {
//                    log.info ("found for IPT out come date");
                    dateIptCompleted.append(iptCompletionDate.asText());
                }
                if (outComeOfIpt != null) {
                    iptCompletionStatus.append(outComeOfIpt.asText());
                }
//                log.info ("fetching current IPT from pharmacy");
                Optional<ArtPharmacy> recentIPtPharmacy =
                        pharmacyRepository.getPharmacyIpt(person.getUuid());
                if (recentIPtPharmacy.isPresent()) {
//                    log.info ("found current IPT from pharmacy");
                    ArtPharmacy artPharmacy = recentIPtPharmacy.get();
                    JsonNode ipt = artPharmacy.getIpt();
                    ((ObjectNode) ipt).put("dateCompleted", dateIptCompleted.toString());
                    ((ObjectNode) ipt).put("completionStatus", iptCompletionStatus.toString());
                    artPharmacy.setIpt(ipt);
//                    log.info ("updating  current IPT from pharmacy");
                    pharmacyRepository.save(artPharmacy);
//                    log.info ("update was successful  current pharmacy affected uuid {}", artPharmacy.getUuid());
                }

            }
        }
    }

    private List<Observation> getAnExistingClinicalEvaluationType(String type, Person person, Long orgId) {
        return observationRepository
                .getAllByTypeAndPersonAndFacilityIdAndArchived(type, person, orgId, 0);
    }


    public ObservationDto updateObservation(Long id, ObservationDto observationDto) {
        Observation existingObservation = observationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Observation.class, "id", String.valueOf(id)));
        existingObservation.setType(observationDto.getType());
        existingObservation.setDateOfObservation(observationDto.getDateOfObservation());
        existingObservation.setData(observationDto.getData());
        processAndUpdateIptFromPharmacy(observationDto, existingObservation.getPerson());
        Observation saveObservation = observationRepository.save(existingObservation);
        observationDto.setId(saveObservation.getId());
        observationDto.setFacilityId(saveObservation.getFacilityId());
        return observationDto;
    }

    public ObservationDto getObservationById(Long id) {
        return convertObservationToDto(getObservation(id));
    }

    public String deleteById(Long id) {
        Observation observation = getObservation(id);
        observation.setArchived(1);
        observationRepository.save(observation);
        return "successfully";
    }

    private Observation getObservation(Long id) {
        return observationRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(Observation.class, "id", Long.toString(id)));
    }

    public List<ObservationDto> getAllObservationByPerson(Long personId) {
        Person person = getPerson(personId);
        Long currentUserOrganization = currentUserOrganizationService.getCurrentUserOrganization();
        List<Observation> observations = observationRepository.getAllByPersonAndFacilityId(person, currentUserOrganization);
        return observations.stream()
                .filter(observation -> observation.getArchived() == 0)
                .map(this::convertObservationToDto).collect(Collectors.toList());


    }

    private ObservationDto convertObservationToDto(Observation observation) {
        return ObservationDto
                .builder()
                .dateOfObservation(observation.getDateOfObservation())
                .data(observation.getData())
                .personId(observation.getPerson().getId())
                .facilityId(observation.getFacilityId())
                .type(observation.getType())
                .visitId(observation.getVisit().getId())
                .id(observation.getId())
                .build();
    }

    private Person getPerson(Long personId) {
        return personRepository.findById(personId)
                .orElseThrow(() -> new EntityNotFoundException(Person.class, "id", String.valueOf(personId)));

    }

    public Map<String, Boolean> isEligibleForIpt(Long personId) {
        Person person = getPerson(personId);
        Optional<String> iptEligiblePatientUuid =
                observationRepository.getIPTEligiblePatientUuid(person.getFacilityId(), person.getUuid());
        HashMap<String, Boolean> map = new HashMap<>();
        map.put("IPTEligibility", iptEligiblePatientUuid.isPresent());
        return map;
    }


    public Map<String, Boolean> getIsHypertensive(Long personId) {
        Person person = getPerson(personId);
        Optional<String> isHypertensivePatientUuid = observationRepository.getIsHypertensive(person.getFacilityId(), person.getUuid());
        HashMap<String, Boolean> map = new HashMap<>();
        map.put("isHypertensive", isHypertensivePatientUuid.isPresent());
        return map;
    }


    public TPtCompletionStatusInfoDTO getTptCompletionStatusInformation(String personUuid) throws JsonProcessingException {
        String sqlQuery = "SELECT row_to_json(t) AS object " +
                "FROM ( " +
                "    SELECT hap.visit_date as visitdate, ho.data as observationdata, hap.extra as pharmacydata " +
                "    FROM hiv_observation ho " +
                "    INNER JOIN hiv_art_pharmacy hap ON ho.person_uuid = hap.person_uuid " +
                "    AND ho.date_of_observation = hap.visit_date " +
                "    WHERE ho.person_uuid = :personUuid " +
                "    AND ho.type = 'Chronic Care' " +
                "    AND ho.archived = 0 " +
                ") AS t";
        Query query = entityManager.createNativeQuery(sqlQuery);
        query.unwrap(NativeQuery.class).addScalar("object", StringType.INSTANCE);
        query.setParameter("personUuid", personUuid);

        List<String> observations = query.getResultList();
        if (observations.isEmpty()) {
            return null;
        }
        String jsonString = observations.get(0);
        JsonNode json = new ObjectMapper().readTree(jsonString);
        TPtCompletionStatusInfoDTO response = new TPtCompletionStatusInfoDTO();
        response.setVisitDate(json.get("visitdate").asText());
        response.setObservationData(json.get("observationdata"));
        response.setPharmacyData(json.get("pharmacydata"));
        return response;
    }


}
