package org.lamisplus.modules.hiv.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.hiv.domain.dto.enrollmentcommencement.EnrollmentCommencementRequestDto;
import org.lamisplus.modules.hiv.domain.entity.EnrollmentCommencement;
import org.lamisplus.modules.hiv.service.EnrollmentCommencementService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/hiv/enrollment-commencement")
public class EnrollmentCommencementController {

    private final EnrollmentCommencementService service;


    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<EnrollmentCommencement> create(
            @Valid @RequestBody EnrollmentCommencementRequestDto request) {
        log.info("POST /api/v1/hiv/enrollment-commencement - Creating Enrollment & Commencement for person ID: {}", request.getPersonId());
        EnrollmentCommencement created = service.create(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }


    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<EnrollmentCommencement> getById(@PathVariable Long id) {
        log.info("GET /api/v1/hiv/enrollment-commencement/{} - Fetching Enrollment & Commencement by ID", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping(value = "/person/{personId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<EnrollmentCommencement> getByPersonId(@PathVariable Long personId) {
        log.info("GET /api/v1/hiv/enrollment-commencement/person/{} - Fetching Enrollment & Commencement by person ID", personId);
        return ResponseEntity.ok(service.getByPersonId(personId));
    }


    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<EnrollmentCommencement> update(
            @PathVariable Long id,
            @Valid @RequestBody EnrollmentCommencementRequestDto request) {
        log.info("PUT /api/v1/hiv/enrollment-commencement/{} - Updating Enrollment & Commencement", id);
        return ResponseEntity.ok(service.update(id, request));
    }


    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("DELETE /api/v1/hiv/enrollment-commencement/{} - Deleting Enrollment & Commencement", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping(value = "/exists/person/{personId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> checkExists(@PathVariable Long personId) {
        log.info("GET /api/v1/hiv/enrollment-commencement/exists/person/{} - Checking if Enrollment exists", personId);
        return ResponseEntity.ok(service.hasExistingRecord(personId));
    }

    @GetMapping(value = "/unique-id-exists", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> checkUniqueIdExists(
            @RequestParam(value = "personId", required = false) Long personId,
            @RequestParam("uniqueId") String uniqueId) {
        log.info("GET /api/v1/hiv/enrollment-commencement/unique-id-exists - Checking if Unique ID '{}' exists (personId: {})", uniqueId, personId);
        boolean exists = service.uniqueIdExists(personId, uniqueId);
        return ResponseEntity.ok(exists);
    }
}
