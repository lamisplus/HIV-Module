package org.lamisplus.modules.hiv.controller;


import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.hiv.domain.dto.*;
import org.lamisplus.modules.hiv.repositories.ObservationRepository;
import org.lamisplus.modules.hiv.service.TreatmentTransferService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/treatment-transfers")
public class TreatmentTransferController {

    private final TreatmentTransferService treatmentTransferService;
    private final ObservationRepository observationRepository;

    @GetMapping("/info/{facilityId}/{patientUuid}")
    @ApiOperation(value = "Get patient treatment transfer information.")
    public ResponseEntity<TransferPatientInfo> getTransferPatientInformation(@PathVariable("patientUuid") String uuid, @PathVariable("facilityId") Long facilityId) {
        return ResponseEntity.ok(treatmentTransferService.getTransferPatientInfo(uuid,facilityId));
    }

    @GetMapping("/patient_result/{facilityId}/{patientUuid}")
    @ApiOperation(value = "Get patient lab results")
    public ResponseEntity< List<LatestLabResult>> getPatientLabResult(@PathVariable("patientUuid") String uuid, @PathVariable("facilityId") Long facilityId) {
        return ResponseEntity.ok(treatmentTransferService.retrieveTransferPatientLabResult(facilityId, uuid));
    }


    @GetMapping("/{personUuid}")
    @ApiOperation(value = "Get patient current Medication")
    public ResponseEntity<List<MedicationInfo>> getCurrentMedication(@PathVariable String personUuid) {
        return ResponseEntity.ok(treatmentTransferService.getCurrentMedication(personUuid));
    }

    @PostMapping("/save")
    @ApiOperation(value = "Save patient treatment transfer information..")
    public ResponseEntity<ObservationDto> saveTransferPatientInformation(@RequestBody TransferPatientDto dto) throws Exception {
        return ResponseEntity.ok(treatmentTransferService.registerTransferPatientInfo(dto));
    }


    @GetMapping("/validate-encounter-date")
    public ResponseEntity<?> validateEncounterDate(
            @RequestParam String personUuid,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate encounterDate
    ) {
        String encounterDateString = encounterDate.toString();
        boolean exists = observationRepository.existsByPersonUuidAndEncounterDate(personUuid, encounterDateString);
        if (exists) {
            return ResponseEntity.badRequest().body("The selected date is already used for transfer in or out.");
        }
        return ResponseEntity.ok().body("Date is valid.");
    }


}

