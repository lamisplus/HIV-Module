package org.lamisplus.modules.hiv.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.hiv.domain.dto.enrollmentcommencement.EnrollmentCommencementRequestDto;
import org.lamisplus.modules.hiv.domain.entity.EnrollmentCommencement;
import org.lamisplus.modules.hiv.service.EnrollmentCommencementService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/hiv/enrollment-commencement")
public class EnrollmentCommencementController {

    private final EnrollmentCommencementService service;

    /**
     * POST /api/v1/hiv/enrollment-commencement
     * Save a new combined enrollment & commencement record.
     */
    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<EnrollmentCommencement> create(
            @RequestBody EnrollmentCommencementRequestDto request) {
        return ResponseEntity.ok(service.create(request));
    }

    /**
     * GET /api/v1/hiv/enrollment-commencement/{id}
     * Retrieve by primary key.
     */
    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<EnrollmentCommencement> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    /**
     * GET /api/v1/hiv/enrollment-commencement/person/{personId}
     * Retrieve by patient person ID.
     */
    @GetMapping(value = "/person/{personId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<EnrollmentCommencement> getByPersonId(@PathVariable Long personId) {
        return ResponseEntity.ok(service.getByPersonId(personId));
    }

    /**
     * PUT /api/v1/hiv/enrollment-commencement/{id}
     * Update an existing record.
     */
    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<EnrollmentCommencement> update(
            @PathVariable Long id,
            @RequestBody EnrollmentCommencementRequestDto request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    /**
     * DELETE /api/v1/hiv/enrollment-commencement/{id}
     * Soft-delete (sets archived = 1).
     */
    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
