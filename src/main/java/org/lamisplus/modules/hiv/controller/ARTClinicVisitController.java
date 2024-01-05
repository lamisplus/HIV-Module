package org.lamisplus.modules.hiv.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.hiv.domain.dto.ARTClinicVisitDto;
import org.lamisplus.modules.hiv.domain.dto.ARTClinicalVisitDisplayDto;
import org.lamisplus.modules.hiv.service.ArtClinicVisitService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/hiv/art/clinic-visit")
public class ARTClinicVisitController {

    private final ArtClinicVisitService artClinicVisitService;


    @PostMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ARTClinicVisitDto> createArtClinicVisit(@RequestBody ARTClinicVisitDto artClinicVisitDto) {
        return ResponseEntity.ok (artClinicVisitService.createArtClinicVisit (artClinicVisitDto));
    }

    @GetMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ARTClinicVisitDto>> getAllArtClinicVisit() {
        return ResponseEntity.ok (artClinicVisitService.getAllArtClinicVisit ());
    }


    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ARTClinicVisitDto> getArtClinicVisitById(@PathVariable("id") Long id) {
        return ResponseEntity.ok (artClinicVisitService.getArtClinicVisitById (id));
    }

    @GetMapping(value = "person", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ARTClinicalVisitDisplayDto>> getArtClinicVisitByPersonId(
            @RequestParam(defaultValue = "0") Integer pageNo,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam Long personId) {
        return ResponseEntity.ok (artClinicVisitService.getAllArtClinicVisitByPersonId (personId, pageNo, pageSize));
    }

    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ARTClinicVisitDto> updateArtClinicVisitById(
            @PathVariable("id") Long id,
            @RequestBody ARTClinicVisitDto artClinicVisitDto) {
        return ResponseEntity.ok (artClinicVisitService.updateClinicVisit (id, artClinicVisitDto));
    }

    @DeleteMapping(value = "/{id}/{reason}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> deleteArtClinicVisitId(@PathVariable("id") Long id, @PathVariable("reason") String reason) {
        artClinicVisitService.archivedClinicVisit (id, reason);
        return ResponseEntity.accepted ().build ();
    }
}
