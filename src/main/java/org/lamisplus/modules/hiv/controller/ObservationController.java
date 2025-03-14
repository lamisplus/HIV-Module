package org.lamisplus.modules.hiv.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.hiv.domain.dto.ObservationDto;
import org.lamisplus.modules.hiv.domain.dto.TPtCompletionStatusInfoDTO;
import org.lamisplus.modules.hiv.repositories.ObservationRepository;
import org.lamisplus.modules.hiv.service.ObservationService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/observation")
public class ObservationController {

    private final ObservationService observationService;
    private final ObservationRepository observationRepository;

    @PostMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ObservationDto> createObservation(@RequestBody ObservationDto observationDto) {
        return ResponseEntity.ok(observationService.createAnObservation(observationDto));
    }


    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ObservationDto> updateObservation(@PathVariable("id") Long id, @RequestBody ObservationDto observationDto) {
        return ResponseEntity.ok(observationService.updateObservation(id, observationDto));
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ObservationDto> getObservationById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(observationService.getObservationById(id));
    }

    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> deleteObservationById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(observationService.deleteById(id));
    }

    @GetMapping(value = "/person/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ObservationDto>> getObservationByPersonId(@PathVariable("id") Long id) {
        return ResponseEntity.ok(observationService.getAllObservationByPerson(id));
    }

    @GetMapping(value = "/check-ipt-eligible/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Boolean>> checkIptEligible(@PathVariable("id") Long personId) {
        return ResponseEntity.ok(observationService.isEligibleForIpt(personId));
    }


    @GetMapping(value = "/is-hypertensive/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Boolean>> getIsHypertensive(@PathVariable("id") Long personId) {
        return ResponseEntity.ok(observationService.getIsHypertensive(personId));
    }

    @GetMapping("/tpt-completion-status-info")
    public ResponseEntity<List<TPtCompletionStatusInfoDTO>> getTptCompletionStatusInformation(@RequestParam String personUuid) throws JsonProcessingException {
        List<TPtCompletionStatusInfoDTO> response = observationService.getTptCompletionStatusInformation(personUuid);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/tpt-completion-date")
    public ResponseEntity<String> getTptCompletionDate(@RequestParam String personUuid, @RequestParam LocalDate dateOfObservation) {
        Optional<String> tptCompletionDate = observationRepository.findTptCompletionDateByPersonAndDate(personUuid, dateOfObservation);
        return tptCompletionDate.map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok(""));
    }

}
