package org.lamisplus.modules.hiv.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.hiv.domain.dto.FacilityProjection;
import org.lamisplus.modules.hiv.domain.dto.ObservationDto;
import org.lamisplus.modules.hiv.domain.dto.PEPClientProjection;
import org.lamisplus.modules.hiv.domain.dto.TBCompletionStatusDTO;
import org.lamisplus.modules.hiv.domain.dto.TPtCompletionStatusInfoDTO;
import org.lamisplus.modules.hiv.domain.dto.ViralLoadEligibilityProjection;
import org.lamisplus.modules.hiv.repositories.ObservationRepository;
import org.lamisplus.modules.hiv.service.ObservationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
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

    @GetMapping("/tb-completion-date")
    public ResponseEntity<TBCompletionStatusDTO> getTbPrompt(@RequestParam String personUuid) {
        TBCompletionStatusDTO result = observationRepository.findTbClientWithoutCompletionDate(personUuid);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/current-tb-status")
    public ResponseEntity<String> getCurrentTbStatus(@RequestParam String personUuid) {
        Optional<String> currentTbStatus = observationRepository.findCurrentTbStatus(personUuid);
        return currentTbStatus.isPresent() ? ResponseEntity.ok(currentTbStatus.get()) : ResponseEntity.ok("");
    }


     // Get all eligible patients by facility
    @GetMapping("/eligible-viral-load/facility/{facilityId}")
    public ResponseEntity<Map<String, Object>> getAllEligiblePatientsByFacility(@PathVariable Long facilityId) {
        Map<String, Object> response = observationService.getAllEligiblePatientsByFacility(facilityId);
        return createResponseEntity(response);
    }

    // Get all PEP clients by facility (28 days after enrollment) with pagination and search
    @GetMapping("/pep-clients/facility/{facilityId}")
    public ResponseEntity<Map<String, Object>> getAllPEPClientsByFacility(
            @PathVariable Long facilityId,
            @RequestParam(defaultValue = "0") Integer pageNo,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false, defaultValue = "") String searchValue) {

        log.info("Fetching PEP clients for facility: {}, pageNo: {}, pageSize: {}, searchValue: '{}'",
                facilityId, pageNo, pageSize, searchValue);

        Pageable pageable = PageRequest.of(pageNo, pageSize);
        Page<PEPClientProjection> pepClientsPage = observationRepository.findAllPEPClients(
                facilityId,
                searchValue,
                pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("records", pepClientsPage.getContent());
        response.put("totalRecords", pepClientsPage.getTotalElements());
        response.put("totalPages", pepClientsPage.getTotalPages());
        response.put("currentPage", pepClientsPage.getNumber());

        log.info("Found {} PEP clients (total: {}) for facility: {}",
                pepClientsPage.getContent().size(), pepClientsPage.getTotalElements(), facilityId);

        return ResponseEntity.ok(response);
    }

    // Get all facilities for facility transfer from dropdown
    @GetMapping("/facilities")
    public ResponseEntity<List<FacilityProjection>> getAllFacilities() {
        log.info("Fetching all facilities for transfer dropdown");
        List<FacilityProjection> facilities = observationRepository.getAllFacilities();
        log.info("Found {} facilities", facilities.size());
        return ResponseEntity.ok(facilities);
    }

    /**
     * Helper method to create ResponseEntity based on service response
     */
    private ResponseEntity<Map<String, Object>> createResponseEntity(Map<String, Object> response) {
        boolean success = (Boolean) response.get("success");
        if (success) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
