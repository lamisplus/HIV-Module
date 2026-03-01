package org.lamisplus.modules.hiv.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.hiv.domain.dto.PositiveHealthDignityPreventionDto;
import org.lamisplus.modules.hiv.service.PositiveHealthDignityPreventionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/positive-health-dignity-prevention")
public class PositiveHealthDignityPreventionController {

    private final PositiveHealthDignityPreventionService phdpService;

    /**
     * Create a new PHDP record
     * POST /api/v1/positive-health-dignity-prevention
     */
    @PostMapping
    public ResponseEntity<PositiveHealthDignityPreventionDto> createPhdp(
            @Valid @RequestBody PositiveHealthDignityPreventionDto phdpDto) {
        log.info("REST request to create PHDP for person ID: {}", phdpDto.getPersonId());
        PositiveHealthDignityPreventionDto result = phdpService.createPhdp(phdpDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    /**
     * Update an existing PHDP record
     * PUT /api/v1/positive-health-dignity-prevention/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<PositiveHealthDignityPreventionDto> updatePhdp(
            @PathVariable Long id,
            @Valid @RequestBody PositiveHealthDignityPreventionDto phdpDto) {
        log.info("REST request to update PHDP with ID: {}", id);
        PositiveHealthDignityPreventionDto result = phdpService.updatePhdp(id, phdpDto);
        return ResponseEntity.ok(result);
    }

    /**
     * Get PHDP record by ID
     * GET /api/v1/positive-health-dignity-prevention/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<PositiveHealthDignityPreventionDto> getPhdpById(@PathVariable Long id) {
        log.info("REST request to get PHDP with ID: {}", id);
        PositiveHealthDignityPreventionDto result = phdpService.getPhdpById(id);
        return ResponseEntity.ok(result);
    }

    /**
     * Get all PHDP records for a person with pagination
     * GET /api/v1/positive-health-dignity-prevention/person/{personId}?pageNo=0&pageSize=10
     */
    @GetMapping("/person/{personId}")
    public ResponseEntity<List<PositiveHealthDignityPreventionDto>> getAllPhdpByPersonId(
            @PathVariable Long personId,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize) {
        log.info("REST request to get PHDP records for person ID: {}", personId);
        List<PositiveHealthDignityPreventionDto> result = phdpService.getAllPhdpByPersonId(personId, pageNo, pageSize);
        return ResponseEntity.ok(result);
    }

    /**
     * Get all non-archived PHDP records
     * GET /api/v1/positive-health-dignity-prevention
     */
    @GetMapping
    public ResponseEntity<List<PositiveHealthDignityPreventionDto>> getAllPhdp() {
        log.info("REST request to get all PHDP records");
        List<PositiveHealthDignityPreventionDto> result = phdpService.getAllPhdp();
        return ResponseEntity.ok(result);
    }

    /**
     * Archive (soft delete) a PHDP record
     * DELETE /api/v1/positive-health-dignity-prevention/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> archivePhdp(@PathVariable Long id) {
        log.info("REST request to archive PHDP with ID: {}", id);
        phdpService.archivePhdp(id);
        return ResponseEntity.noContent().build();
    }
}
