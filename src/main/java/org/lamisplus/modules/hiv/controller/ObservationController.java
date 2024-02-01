package org.lamisplus.modules.hiv.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.hiv.domain.dto.ObservationDto;
import org.lamisplus.modules.hiv.service.ObservationService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/observation")
public class ObservationController {
	
	private final ObservationService observationService;
	
	
	@PostMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<ObservationDto> createObservation(@RequestBody ObservationDto observationDto) {
		return ResponseEntity.ok(observationService.createAnObservation(observationDto));
	}
	
	
	@PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<ObservationDto> updateObservation(@PathVariable("id") Long id, @RequestBody ObservationDto observationDto) {
		return ResponseEntity.ok(observationService.updateObservation(id, observationDto));
	}
	
	@GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<ObservationDto> getObservationById(@PathVariable("id") Long id) {
		return ResponseEntity.ok(observationService.getObservationById(id));
	}
	
	@DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> deleteObservationById(@PathVariable("id") Long id) {
		return ResponseEntity.ok(observationService.deleteById(id));
	}
	
	@GetMapping(value = "/person/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<ObservationDto>> getObservationByPersonId(@PathVariable("id") Long id) {
		return ResponseEntity.ok(observationService.getAllObservationByPerson(id));
	}
	
//	@GetMapping(value = "/check-ipt-eligible/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
//	public  ResponseEntity<Map<String, Boolean>> checkIptEligible(@PathVariable("id") Long personId) {
//		return ResponseEntity.ok(observationService.isEligibleForIpt(personId));
//	}

//    @PostMapping(value="/eac", produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<HIVEacDto> handleEac(@RequestBody HIVEacDto dto) {
//        return ResponseEntity.ok (hivEacService.handleEac (dto));
//    }
//
//    @PutMapping(value = "/eac/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<HIVEacDto> updateEac(@PathVariable("id") Long id, @RequestBody HIVEacDto dto) {
//        return ResponseEntity.ok (hivEacService.updateEac (id, dto));
//    }
//
//    @GetMapping(value = "/eac/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<HIVEacDto> getEacById(@PathVariable("id") Long id) {
//        return ResponseEntity.ok (hivEacService.getEacById (id));
//    }
//
//    @DeleteMapping(value = "/eac/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<String> deleteEacById(@PathVariable("id") Long id) {
//        return ResponseEntity.ok (hivEacService.deleteEACById (id));
//    }
//    @GetMapping(value = "/eac/person/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<List<HIVEacDto>> getEac(@PathVariable("id") Long id) {
//        return ResponseEntity.ok (hivEacService.getEacByPersonId (id));
//    }
//
//    @GetMapping(value = "/eac/person/current-eac/{id}",produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<HIVEacDto> getCurrentEac(@PathVariable("id") Long id) {
//        return ResponseEntity.ok (hivEacService.getOpenEacByPersonId (id));
//    }


}
