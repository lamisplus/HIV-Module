package org.lamisplus.modules.hiv.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.hiv.domain.dto.ObservationDto;
import org.lamisplus.modules.hiv.domain.entity.ArtPharmacy;
import org.lamisplus.modules.hiv.domain.entity.Observation;
import org.lamisplus.modules.hiv.repositories.ArtPharmacyRepository;
import org.lamisplus.modules.hiv.repositories.ObservationRepository;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.domain.entity.Visit;
import org.lamisplus.modules.patient.repository.PersonRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

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

    public ObservationDto createAnObservation(ObservationDto observationDto) {
       try {
           log.info("saving an observation of type {}", observationDto.getType());
           Long personId = observationDto.getPersonId();
           Person person = getPerson(personId);
           Long orgId = currentUserOrganizationService.getCurrentUserOrganization();
           boolean anExistingClinicalEvaluation = getAnExistingClinicalEvaluationType("Clinical evaluation", person, orgId).isEmpty();
           List<Observation> personObservations =
                   observationRepository.getAllByPersonAndFacilityId(person, person.getFacilityId());
           if (!anExistingClinicalEvaluation && observationDto.getType().equals("Clinical evaluation")) {
               throw new RecordExistException(Observation.class, "type", observationDto.getType());
           }

           boolean sameEncounterObservation = personObservations
                   .stream()
                   .anyMatch(o -> o.getType().equals(observationDto.getType())
                           && o.getDateOfObservation().equals(observationDto.getDateOfObservation()));
           if(sameEncounterObservation){
               throw new RecordExistException(Observation.class, "date of observation", ""+observationDto.getDateOfObservation());
           }

           processAndUpdateIptFromPharmacy(observationDto, person);
           observationDto.setFacilityId(orgId);
           Visit visit = handleHIVisitEncounter.processAndCreateVisit(personId, observationDto.getDateOfObservation());
           if (visit != null) {
               observationDto.setVisitId(visit.getId());
           }
           log.info("appending additional info and saving observation of type {}", observationDto.getType());
           appendAdditionalInfoAndSaveObservation(observationDto, person, visit);
           log.info("observation save successfully ");
           return observationDto;
       }catch (Exception e) {
           log.error("An error occurred while saving an observation");
           log.error("error message: " + e.getMessage());
           throw new IllegalStateException("An error occurred while saving "+e.getMessage());
       }
    }

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
        log.info ("Processing and updating IPT from pharmacy....");
        if(observationDto.getType().equals("Chronic Care")){
            JsonNode tptMonitoring = observationDto.getData().get("tptMonitoring");
            JsonNode iptCompletionDate = tptMonitoring.get("date");
            JsonNode outComeOfIpt = tptMonitoring.get("outComeOfIpt");
            log.info ("checking for IPT out come");
            if( (outComeOfIpt != null && !outComeOfIpt.isEmpty() ) || (iptCompletionDate != null && !iptCompletionDate.asText().isEmpty()) ){
                log.info ("found for IPT out come");
                StringBuilder dateIptCompleted = new StringBuilder();
                StringBuilder iptCompletionStatus = new StringBuilder();
                log.info ("checking if IPT out come has a date");
                if(iptCompletionDate != null ){
                    log.info ("found for IPT out come date");
                    dateIptCompleted.append(iptCompletionDate.asText());
                }
                if(outComeOfIpt != null){
                    iptCompletionStatus.append(outComeOfIpt.asText());
                }
                log.info ("fetching current IPT from pharmacy");
                Optional<ArtPharmacy> recentIPtPharmacy =
                        pharmacyRepository.getPharmacyIpt(person.getUuid());
                if(recentIPtPharmacy.isPresent()){
                    log.info ("found current IPT from pharmacy");
                    ArtPharmacy artPharmacy = recentIPtPharmacy.get();
                    JsonNode ipt = artPharmacy.getIpt();
                    ((ObjectNode) ipt).put("dateCompleted", dateIptCompleted.toString());
                    ((ObjectNode) ipt).put("completionStatus", iptCompletionStatus.toString());
                    artPharmacy.setIpt(ipt);
                    log.info ("updating  current IPT from pharmacy");
                    pharmacyRepository.save(artPharmacy);
                    log.info ("update was successful  current pharmacy affected uuid {}", artPharmacy.getUuid());
                }

            }
        }
    }

    private List<Observation> getAnExistingClinicalEvaluationType(String type, Person person, Long orgId) {
        return observationRepository
                .getAllByTypeAndPersonAndFacilityIdAndArchived (type, person, orgId, 0);
    }


    public ObservationDto updateObservation(Long id, ObservationDto observationDto) {
        Observation existingObservation = observationRepository.findById (id)
                .orElseThrow (() -> new EntityNotFoundException (Observation.class, "id", String.valueOf (id)));
        existingObservation.setType (observationDto.getType ());
        existingObservation.setDateOfObservation (observationDto.getDateOfObservation ());
        existingObservation.setData (observationDto.getData ());
        processAndUpdateIptFromPharmacy(observationDto, existingObservation.getPerson());
        Observation saveObservation = observationRepository.save (existingObservation);
        observationDto.setId (saveObservation.getId ());
        observationDto.setFacilityId (saveObservation.getFacilityId ());
        return observationDto;
    }

    public ObservationDto getObservationById(Long id) {
        return convertObservationToDto (getObservation (id));
    }

    public String deleteById(Long id) {
        Observation observation = getObservation (id);
        observation.setArchived (1);
        observationRepository.save (observation);
        return "successfully";
    }

    private Observation getObservation(Long id) {
        return observationRepository.findById (id).orElseThrow (() -> new EntityNotFoundException (Observation.class, "id", Long.toString (id)));
    }

    public List<ObservationDto> getAllObservationByPerson(Long personId) {
        Person person = getPerson (personId);
        Long currentUserOrganization = currentUserOrganizationService.getCurrentUserOrganization ();
        List<Observation> observations = observationRepository.getAllByPersonAndFacilityId (person, currentUserOrganization);
        return observations.stream ()
                .filter (observation -> observation.getArchived () == 0)
                .map (this::convertObservationToDto).collect (Collectors.toList ());


    }

    private ObservationDto convertObservationToDto(Observation observation) {
        return ObservationDto
                .builder ()
                .dateOfObservation (observation.getDateOfObservation ())
                .data (observation.getData ())
                .personId (observation.getPerson ().getId ())
                .facilityId (observation.getFacilityId ())
                .type (observation.getType ())
                .visitId (observation.getVisit ().getId ())
                .id (observation.getId ())
                .build ();
    }

    private Person getPerson(Long personId) {
        return personRepository.findById (personId)
                .orElseThrow (() -> new EntityNotFoundException (Person.class, "id", String.valueOf (personId)));

    }

    public Map<String, Boolean> isEligibleForIpt(Long personId) {
        Person person = getPerson(personId);
        Optional<String> iptEligiblePatientUuid =
                observationRepository.getIPTEligiblePatientUuid(person.getFacilityId(), person.getUuid());
        HashMap<String, Boolean> map = new HashMap<>();
          map.put("IPTEligibility", iptEligiblePatientUuid.isPresent());
        return map;
    }

}
