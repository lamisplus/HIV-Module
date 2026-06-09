package org.lamisplus.modules.hiv.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.hiv.domain.dto.AdherencePreparationDto;
import org.lamisplus.modules.hiv.domain.dto.EnrollmentCycleStatusDto;
import org.lamisplus.modules.hiv.service.AdherencePreparationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/adherence-preparation")
@RequiredArgsConstructor
public class AdherencePreparationController {

    private final AdherencePreparationService adherencePreparationService;

    @PostMapping
    public ResponseEntity<AdherencePreparationDto> create(@Valid @RequestBody AdherencePreparationDto dto) {
        log.info("Request to create Adherence Preparation");
        AdherencePreparationDto result = adherencePreparationService.createAdherencePreparation(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdherencePreparationDto> update(
            @PathVariable Long id,
            @Valid @RequestBody AdherencePreparationDto dto) {
        AdherencePreparationDto result = adherencePreparationService.updateAdherencePreparation(id, dto);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdherencePreparationDto> getById(@PathVariable Long id) {
        AdherencePreparationDto result = adherencePreparationService.getAdherencePreparationById(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/person/{personId}")
    public ResponseEntity<List<AdherencePreparationDto>> getAllByPersonId(
            @PathVariable Long personId,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "100") int pageSize) {
        log.info("Request to get Adherence Preparation records for person ID: {}", personId);
        List<AdherencePreparationDto> results = adherencePreparationService.getAllAdherencePreparationByPersonId(personId, pageNo, pageSize);
        return ResponseEntity.ok(results);
    }

    @GetMapping
    public ResponseEntity<List<AdherencePreparationDto>> getAll() {
        log.info("Request to get all Adherence Preparation records");
        List<AdherencePreparationDto> results = adherencePreparationService.getAllAdherencePreparation();
        return ResponseEntity.ok(results);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> archive(@PathVariable Long id) {
        log.info("Request to archive Adherence Preparation with ID: {}", id);
        adherencePreparationService.archiveAdherencePreparation(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/enrollment-session/{personId}")
    public ResponseEntity<String> getLatestEnrollmentSessionUuid(@PathVariable Long personId) {
        log.info("Request to get latest enrollment session UUID for person ID: {}", personId);
        String sessionUuid = adherencePreparationService.getLatestEnrollmentSessionUuidByPersonId(personId);
        if (sessionUuid != null) {
            return ResponseEntity.ok(sessionUuid);
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/enrollment-cycle-status/{personId}")
    public ResponseEntity<EnrollmentCycleStatusDto> getEnrollmentCycleStatus(@PathVariable Long personId) {
        log.info("Request to get enrollment cycle status for person ID: {}", personId);
        EnrollmentCycleStatusDto status = adherencePreparationService.getEnrollmentCycleStatus(personId);
        return ResponseEntity.ok(status);
    }
}
