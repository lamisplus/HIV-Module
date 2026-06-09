package org.lamisplus.modules.hiv.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.hiv.domain.dto.PatientTransferInDTO;
import org.lamisplus.modules.hiv.service.PatientTransferInService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/hiv")
public class PatientTransferInController {

    private final PatientTransferInService patientTransferInService;

    @PostMapping(value = "/transfer-acknowledgement/save", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PatientTransferInDTO> createPatientTransferIn(
            @Valid @RequestBody PatientTransferInDTO transferInDTO) {
        log.info("POST /api/v1/hiv/transfer-acknowledgement/save - Creating Patient Transfer-In record");
        PatientTransferInDTO created = patientTransferInService.createPatientTransferIn(transferInDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping(value = "/patient-transfer-in/{id}", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PatientTransferInDTO> updatePatientTransferIn(
            @PathVariable("id") Long id,
            @Valid @RequestBody PatientTransferInDTO transferInDTO) {
        log.info("PUT /api/v1/hiv/patient-transfer-in/{} - Updating Patient Transfer-In record", id);
        PatientTransferInDTO updated = patientTransferInService.updatePatientTransferIn(id, transferInDTO);
        return ResponseEntity.ok(updated);
    }

    @GetMapping(value = "/patient-transfer-in/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PatientTransferInDTO> getPatientTransferInById(
            @PathVariable("id") Long id) {
        log.info("GET /api/v1/hiv/patient-transfer-in/{} - Fetching Patient Transfer-In record by ID", id);
        PatientTransferInDTO transferIn = patientTransferInService.getPatientTransferInById(id);
        return ResponseEntity.ok(transferIn);
    }


    @GetMapping(value = "/patient-transfer-in/person/{personId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PatientTransferInDTO> getPatientTransferInByPersonId(
            @PathVariable("personId") Long personId) {
        log.info("GET /api/v1/hiv/patient-transfer-in/person/{} - Fetching Patient Transfer-In record by person ID", personId);
        PatientTransferInDTO transferIn = patientTransferInService.getPatientTransferInByPersonId(personId);
        return ResponseEntity.ok(transferIn);
    }

    @GetMapping(value = "/patient-transfer-in/facility", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<PatientTransferInDTO>> getAllPatientTransferInsByFacility() {
        log.info("GET /api/v1/hiv/patient-transfer-in/facility - Fetching all Patient Transfer-In records for facility");
        List<PatientTransferInDTO> transferIns = patientTransferInService.getAllPatientTransferInsByFacility();
        return ResponseEntity.ok(transferIns);
    }

    @DeleteMapping(value = "/patient-transfer-in/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> deletePatientTransferIn(
            @PathVariable("id") Long id) {
        log.info("DELETE /api/v1/hiv/patient-transfer-in/{} - Deleting Patient Transfer-In record", id);
        String result = patientTransferInService.deletePatientTransferIn(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping(value = "/patient-transfer-in/exists/person/{personId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> checkTransferInExists(
            @PathVariable("personId") Long personId) {
        log.info("GET /api/v1/hiv/patient-transfer-in/exists/person/{} - Checking if Transfer-In exists", personId);
        boolean exists = patientTransferInService.hasExistingTransferIn(personId);
        return ResponseEntity.ok(exists);
    }
}
