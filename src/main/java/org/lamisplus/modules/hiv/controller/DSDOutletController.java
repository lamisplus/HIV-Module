package org.lamisplus.modules.hiv.controller;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.hiv.domain.dto.DsdOutletDTO;
import org.lamisplus.modules.hiv.domain.dto.DsdOutletProjection;
import org.lamisplus.modules.hiv.service.DSDOutletService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/hiv/dsd-outlet")
public class DSDOutletController {

    private final DSDOutletService dsdOutletService;

    @GetMapping(value = "/{lga}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<DsdOutletDTO>> getDsdOutletByLga(@PathVariable("lga") String lga) {
        return ResponseEntity.ok(dsdOutletService.getByLga(lga));
    }


    @GetMapping(value = "/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<DsdOutletDTO>> getAllDsdOutlet() {
        return ResponseEntity.ok(dsdOutletService.getAll());
    }

    @GetMapping(value = "/organisation-unit-id/{organisationUnitId}/code/{code}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<DsdOutletProjection>> getDsdOutlets(@PathVariable("organisationUnitId") Long organisationUnitId, @PathVariable("code") String code) {
        return ResponseEntity.ok(dsdOutletService.getDsdOutlets(organisationUnitId, code));
    }

}
