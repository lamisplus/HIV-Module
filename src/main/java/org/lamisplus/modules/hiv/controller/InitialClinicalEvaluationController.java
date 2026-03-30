package org.lamisplus.modules.hiv.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.hiv.domain.dto.initialclinicalevaluation.InitialClinicalEvaluationDTO;
import org.lamisplus.modules.hiv.domain.dto.ObservationDto;
import org.lamisplus.modules.hiv.service.InitialClinicalEvaluationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/hiv/observation/initial-clinical-evaluation")
public class InitialClinicalEvaluationController {

    private final InitialClinicalEvaluationService initialClinicalEvaluationService;


    @PostMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<InitialClinicalEvaluationDTO> createInitialClinicalEvaluation(
            @Valid @RequestBody InitialClinicalEvaluationDTO evaluationDTO) {
        log.info("POST /api/v1/hiv/observation/initial-clinical-evaluation - Creating Initial Clinical Evaluation");
        InitialClinicalEvaluationDTO created = initialClinicalEvaluationService.createInitialClinicalEvaluation(evaluationDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }


    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<InitialClinicalEvaluationDTO> updateInitialClinicalEvaluation(
            @PathVariable("id") Long id,
            @Valid @RequestBody InitialClinicalEvaluationDTO evaluationDTO) {
        log.info("PUT /api/v1/hiv/observation/initial-clinical-evaluation/{} - Updating Initial Clinical Evaluation", id);
        InitialClinicalEvaluationDTO updated = initialClinicalEvaluationService.updateInitialClinicalEvaluation(id, evaluationDTO);
        return ResponseEntity.ok(updated);
    }


    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<InitialClinicalEvaluationDTO> getInitialClinicalEvaluationById(
            @PathVariable("id") Long id) {
        log.info("GET /api/v1/hiv/observation/initial-clinical-evaluation/{} - Fetching Initial Clinical Evaluation by ID", id);
        InitialClinicalEvaluationDTO evaluation = initialClinicalEvaluationService.getInitialClinicalEvaluationById(id);
        return ResponseEntity.ok(evaluation);
    }


    @GetMapping(value = "/person/{personId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<InitialClinicalEvaluationDTO> getInitialClinicalEvaluationByPersonId(
            @PathVariable("personId") Long personId) {
        log.info("GET /api/v1/hiv/observation/initial-clinical-evaluation/person/{} - Fetching Initial Clinical Evaluation by person ID", personId);
        InitialClinicalEvaluationDTO evaluation = initialClinicalEvaluationService.getInitialClinicalEvaluationByPersonId(personId);
        return ResponseEntity.ok(evaluation);
    }


    @GetMapping(value = "/person/{personId}/all-observations", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ObservationDto>> getAllObservationsByPerson(
            @PathVariable("personId") Long personId) {
        log.info("GET /api/v1/hiv/observation/initial-clinical-evaluation/person/{}/all-observations - Fetching all observations", personId);
        List<ObservationDto> observations = initialClinicalEvaluationService.getAllObservationsByPerson(personId);
        return ResponseEntity.ok(observations);
    }


    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> deleteInitialClinicalEvaluation(
            @PathVariable("id") Long id) {
        log.info("DELETE /api/v1/hiv/observation/initial-clinical-evaluation/{} - Deleting Initial Clinical Evaluation", id);
        String result = initialClinicalEvaluationService.deleteInitialClinicalEvaluation(id);
        return ResponseEntity.ok(result);
    }


    @GetMapping(value = "/exists/person/{personId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> checkICEExists(
            @PathVariable("personId") Long personId) {
        log.info("GET /api/v1/hiv/observation/initial-clinical-evaluation/exists/person/{} - Checking if ICE exists", personId);
        boolean exists = initialClinicalEvaluationService.hasExistingICE(personId);
        return ResponseEntity.ok(exists);
    }
}
