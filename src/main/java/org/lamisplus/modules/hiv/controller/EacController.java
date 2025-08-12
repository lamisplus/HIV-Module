package org.lamisplus.modules.hiv.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.hiv.domain.dto.*;
import org.lamisplus.modules.hiv.service.EACOutComeService;
import org.lamisplus.modules.hiv.service.HIVEacService;
import org.lamisplus.modules.hiv.service.HIVEacSessionService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/hiv/eac")
public class EacController {
	
	private final HIVEacService hIVEacService;
	private final HIVEacSessionService hIVEacSessionService;
	private final EACOutComeService eacOutComeService;
	
	@GetMapping(value = "/patient/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<HIVEacDto>> getPatientEacs(@PathVariable("id") Long id) {
		return ResponseEntity.ok(hIVEacService.getPatientEAcs(id));
	}
	
	@GetMapping(value = "/open/patient/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<EACPharmacyDisplayDto> getPatientEac(@PathVariable("id") Long id) {
		return ResponseEntity.ok(hIVEacService.getPatientOpenEAc(id));
	}
	
	@PutMapping(value = "/stop/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<HIVEacDto> stopEac(@PathVariable("id") Long id,
	                                         @RequestBody EACStopDto data) {
		return ResponseEntity.ok(hIVEacService.stopEac(id, data));
	}

	@PostMapping(value = "/session", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<HIVEacSessionDto> registerEacSession(@RequestBody HIVEacSessionDto data) {
		return ResponseEntity.ok(hIVEacSessionService.createEacSession(data));
	}
	
	@PostMapping(value = "/out-come", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<EacOutComeDto> registerEacOut(
			@RequestParam("eacId") Long id,
			@RequestBody EacOutComeDto data) {
		return ResponseEntity.ok(eacOutComeService.registerEACOutcome(id, data));
	}
	
	@GetMapping(value = "/session/eac/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<HIVEacSessionDto>> getSessionByEacId(@PathVariable("id") Long id) {
		return ResponseEntity.ok(hIVEacSessionService.getSessionByEac(id));
	}
	
	@PutMapping(value = "/session/edit/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<HIVEacSessionDto> updateEacSession(
			@PathVariable("id") Long id,
			@RequestBody HIVEacSessionDto data) {
		return ResponseEntity.ok(hIVEacSessionService.updateEacSession(id, data));
	}
	
	@DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> deleteEac(@PathVariable("id") Long id) {
		hIVEacService.deleteEac(id);
		return ResponseEntity.ok("success");
	}
	
	@DeleteMapping(value = "session/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> deleteEacSession(@PathVariable("id") Long id) {
		hIVEacSessionService.deleteEacSessionById(id);
		return ResponseEntity.ok("success");
	}

	@GetMapping(value = "/eac-outcome", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<EacOutComeDto>> getAllEacOutComeByPerson(@RequestParam("personUuid") String personUuid) {
		return ResponseEntity.ok(eacOutComeService.getAllEacOutComeByPerson(personUuid));
	}

	@PutMapping(value = "/eac-outcome/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<EacOutComeDto> updateEacOutcome(@PathVariable("id") Long id, @RequestBody EacOutComeDto eacOutCome) {
		return ResponseEntity.ok(eacOutComeService.updateEacOutCome(id, eacOutCome));
	}

	@DeleteMapping(value = "/eac-outcome/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> deleteEacOutcome(@PathVariable("id") Long id) {
		return ResponseEntity.ok(eacOutComeService.deleteEacOutcome(id));
	}

}
