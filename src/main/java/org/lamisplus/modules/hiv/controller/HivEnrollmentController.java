package org.lamisplus.modules.hiv.controller;

import com.google.common.base.Stopwatch;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.PageDTO;
import org.lamisplus.modules.hiv.domain.dto.*;
import org.lamisplus.modules.hiv.service.HivEnrollmentService;
import org.lamisplus.modules.hiv.service.HivPatientService;
import org.lamisplus.modules.hiv.service.PatientActivityService;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/hiv/")
public class HivEnrollmentController {
    private final HivEnrollmentService hivEnrollmentService;

    private final HivPatientService patientService;

    private final PatientActivityService patientActivityService;


    @PostMapping(value = "enrollment", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<HivEnrollmentDTO> createHivEnrollment(@RequestBody HivEnrollmentDTO hiv) {
        return ResponseEntity.ok (hivEnrollmentService.createHivEnrollment (hiv));
    }

    @GetMapping(value = "patient/enrollment", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<HivPatientDto>> getAllHivEnrollments() {
        return ResponseEntity.ok (hivEnrollmentService.getAll ());
    }
    
    @GetMapping(value = "non-biometric-patient/enrollment/{facilityId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<PatientDTO>> getNonBiometricHivEnrollmentPatients(@PathVariable("facilityId") Long facilityId) {
        return ResponseEntity.ok (patientService.getHivEnrolledNonBiometricPatients(facilityId));
    }
    
    @GetMapping(value = "patient/enrollment/list", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PageDTO> getHivEnrollmentList(
            @RequestParam (required = false ) String searchValue,
            @RequestParam(defaultValue = "0") Integer pageNo,
            @RequestParam(defaultValue = "10") Integer pageSize
    ) {
        return ResponseEntity.ok (patientService.getHivEnrolledPatients(searchValue, PageRequest.of(pageNo, pageSize)));
    }
    
    
    @GetMapping(value = "patients", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PageDTO> getHivPatient(
            @RequestParam (required = false ) String searchValue,
            @RequestParam(defaultValue = "0") Integer pageNo,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        Stopwatch stopwatch = Stopwatch.createStarted();
        PageDTO hivPatients = patientService.getHivPatients(searchValue, PageRequest.of(pageNo, pageSize));
//        log.info("total time taken to load 10 records :{}", stopwatch.elapsed().toMillis());
        return ResponseEntity.ok (hivPatients);
    }
    
  
    
    @GetMapping(value = "patients/iit", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PageDTO> getIItHivPatient(
            @RequestParam (required = false ) String searchValue,
            @RequestParam(defaultValue = "0") Integer pageNo,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        return ResponseEntity.ok (patientService.getIITHivPatients (searchValue,PageRequest.of(pageNo, pageSize)));
    }

    @PostMapping(value = "patient", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<HivEnrollmentDTO> registerHivPatient(@RequestBody HivPatientEnrollmentDto hivPatientEnrollmentDto) {
        return ResponseEntity.ok (patientService.registerAndEnrollHivPatient (hivPatientEnrollmentDto));
    }

    @GetMapping(value = "patient/checked-in", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<HivPatientDto>> getHivCheckInPatients() {
        return ResponseEntity.ok (patientService.getHivCheckedInPatients ());
    }

    @GetMapping(value = "patient/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<HivPatientDto> getHivPatientById(@PathVariable("id") Long id) {
        return ResponseEntity.ok (patientService.getHivPatientById (id));
    }

    @GetMapping(value = "patient/activities", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<PatientActivity>> getPatientActivity(@PathVariable("id") Long id) {
        return ResponseEntity.ok (patientService.getHivPatientActivitiesById (id));
    }


    @GetMapping(value = "enrollment/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<HivEnrollmentDTO> getHivEnrollmentById(@PathVariable("id") Long id) {
        return ResponseEntity.ok (hivEnrollmentService.getHivEnrollmentById (id));
    }

    @PutMapping(value = "enrollment/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<HivEnrollmentDTO> updateHivEnrollmentById(@PathVariable("id") Long id, @RequestBody HivEnrollmentDTO hivEnrollment) {
        return ResponseEntity.ok (hivEnrollmentService.updateHivEnrollment (id, hivEnrollment));
    }

    @DeleteMapping(value = "enrollment/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> deleteHivEnrollmentById(@PathVariable("id") Long id) {
        hivEnrollmentService.deleteHivEnrollment (id);
        return ResponseEntity.accepted ().build ();
    }


    @GetMapping("/patients/{patientId}/activities")
    public List<TimelineVm> getActivities(@PathVariable Long patientId, @RequestParam(required = false, defaultValue = "false") Boolean full) {
        return patientActivityService.getTimelineVms (patientId, full);
    }
    @GetMapping("/patients/{patientId}/history/activities")
    public List<PatientActivity> getActivitiesHistory(@PathVariable Long patientId) {
        return patientActivityService.getActivities (patientId);
    }

    @GetMapping(value = "patient/enrollment/unique-id-exists")
    public ResponseEntity<?> uniqueIdExists(@RequestParam("personUuid") Optional<String> personUuid, @RequestParam("uniqueId") String uniqueId){

        return hivEnrollmentService.uniqueIdExists(
                personUuid,
                uniqueId).isPresent()
                ? new ResponseEntity<>(HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping(value = "patient-flag/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<FlagPatientDto> getHivPatientFlagById(@PathVariable("id") Long id) {
        return ResponseEntity.ok (patientService.getPatientMeta (id));
    }

}
