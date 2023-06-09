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
        Long personId = observationDto.getPersonId ();
        Person person = getPerson (personId);
        Long orgId = currentUserOrganizationService.getCurrentUserOrganization ();
        Optional<Observation> anExistingObservationType = getAnExistingObservationType(observationDto, person, orgId);
        if (anExistingObservationType.isPresent ()) {
            Observation observation = anExistingObservationType.get();
            if(observation.getType().equals("Clinical evaluation"))
                throw new RecordExistException (Observation.class, "type", observationDto.getType ());
        }
        processAndUpdateIptFromPharmacy(observationDto, person);
        observationDto.setFacilityId (orgId);
        Visit visit = handleHIVisitEncounter.processAndCreateVisit (personId, observationDto.getDateOfObservation());
        if (visit != null) {
            observationDto.setVisitId (visit.getId ());
        }
      
        Observation observation = new Observation ();
        BeanUtils.copyProperties (observationDto, observation);
        observation.setPerson (person);
        observation.setUuid (UUID.randomUUID ().toString ());
        observation.setVisit (visit);
        observation.setArchived (0);
        Observation saveObservation = observationRepository.save (observation);
        observationDto.setId (saveObservation.getId ());
        return observationDto;
    }
    
   
    private void processAndUpdateIptFromPharmacy(ObservationDto observationDto, Person person) {
        if(observationDto.getType().equals("Chronic Care")){
            JsonNode tptMonitoring = observationDto.getData().get("tptMonitoring");
            JsonNode iptCompletionDate = tptMonitoring.get("date");
            JsonNode outComeOfIpt = tptMonitoring.get("outComeOfIpt");
            if( (outComeOfIpt != null && !outComeOfIpt.isEmpty() ) || (iptCompletionDate != null && !iptCompletionDate.asText().isEmpty()) ){
                StringBuilder dateIptCompleted = new StringBuilder();
                StringBuilder iptCompletionStatus = new StringBuilder();
                
                if(iptCompletionDate != null ){
                    dateIptCompleted.append(iptCompletionDate.asText());
                }
                if(outComeOfIpt != null){
                    iptCompletionStatus.append(outComeOfIpt.asText());
                }
                Optional<ArtPharmacy> recentIPtPharmacy =
                        pharmacyRepository.getPharmacyIpt(person.getUuid());
                if(recentIPtPharmacy.isPresent()){
                    ArtPharmacy artPharmacy = recentIPtPharmacy.get();
                    JsonNode ipt = artPharmacy.getIpt();
                    ((ObjectNode) ipt).put("dateCompleted", dateIptCompleted.toString());
                    ((ObjectNode) ipt).put("completionStatus", iptCompletionStatus.toString());
                    artPharmacy.setIpt(ipt);
                    pharmacyRepository.save(artPharmacy);
                }
                
            }
            
            System.out.println(""+ tptMonitoring);
        }
    }
    
    private Optional<Observation> getAnExistingObservationType(ObservationDto observationDto, Person person, Long orgId) {
        return observationRepository
                .getAllByTypeAndPersonAndFacilityIdAndArchived (observationDto.getType (), person, orgId, 0);
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
