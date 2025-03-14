package org.lamisplus.modules.hiv.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.hiv.domain.dto.PatientFlagConfigsDto;
import org.lamisplus.modules.hiv.domain.dto.PatientFlagDto;
import org.lamisplus.modules.hiv.service.CurrentUserOrganizationService;
import org.lamisplus.modules.hiv.service.PatientFlagService;
import org.lamisplus.modules.hiv.service.PatientFlagService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/patient-flag")
public class PatientFlagController {

    private final PatientFlagService patientFlagService;
    private final CurrentUserOrganizationService currentUserOrganizationService;

    @PostMapping(value = "",  produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PatientFlagDto> createPatientFlag (@RequestBody PatientFlagDto patientFlagDto) {
        return ResponseEntity.ok(patientFlagService.createOrUpdatePatientFlag(patientFlagDto));
    }

    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> deletePatientFlag (@PathVariable("id") Long id) {
        return ResponseEntity.ok(patientFlagService.deleteFlag(id));
    }

    @GetMapping(value = "/patient-flag-configs", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<PatientFlagConfigsDto>> getPatientFlagConfigs () throws ExecutionException, InterruptedException {
        Long facility = currentUserOrganizationService.getCurrentUserOrganization();
        return ResponseEntity.ok(patientFlagService.getPatientFlagsConfigs(facility));
    }
}
