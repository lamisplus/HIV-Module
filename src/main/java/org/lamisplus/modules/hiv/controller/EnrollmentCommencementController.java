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


    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<EnrollmentCommencement> create(
            @RequestBody EnrollmentCommencementRequestDto request) {
        return ResponseEntity.ok(service.create(request));
    }


    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<EnrollmentCommencement> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping(value = "/person/{personId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<EnrollmentCommencement> getByPersonId(@PathVariable Long personId) {
        return ResponseEntity.ok(service.getByPersonId(personId));
    }


    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<EnrollmentCommencement> update(
            @PathVariable Long id,
            @RequestBody EnrollmentCommencementRequestDto request) {
        return ResponseEntity.ok(service.update(id, request));
    }


    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
