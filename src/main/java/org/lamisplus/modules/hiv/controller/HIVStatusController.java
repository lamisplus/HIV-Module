package org.lamisplus.modules.hiv.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.hiv.domain.dto.HIVStatusTrackerDto;
import org.lamisplus.modules.hiv.service.HIVStatusTrackerService;
import org.lamisplus.modules.hiv.service.StatusManagementService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/hiv/status/")
public class HIVStatusController {
	
	private final HIVStatusTrackerService hivStatusTrackerService;
	
	private final StatusManagementService statusManagementService;
	
	
	@PostMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<HIVStatusTrackerDto> registerHIVStatusTracke(@RequestBody HIVStatusTrackerDto hivStatusTrackerDto) {
		return ResponseEntity.ok(hivStatusTrackerService.registerHIVStatusTracker(hivStatusTrackerDto));
	}


	@PostMapping(value = "/activate-stop_status/{personId}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Void> activateTreatmentForPreviousTransferOut(@PathVariable("personId") String  personId) {
		hivStatusTrackerService.activateTransferOutStatus(personId);
		return  ResponseEntity.noContent().build();
	}


	@GetMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<HIVStatusTrackerDto>> getAllHIVStatusTracker() {
		return ResponseEntity.ok(hivStatusTrackerService.getAllHIVStatusTracker());
	}
	
	
	@GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<HIVStatusTrackerDto> getHIVStatusTrackerById(@PathVariable("id") Long id) {
		return ResponseEntity.ok(hivStatusTrackerService.getHIVStatusTrackerById(id));
	}
	
	@GetMapping(value = "patient-current/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> getPersonCurrentHIVStatus(@PathVariable("id") Long personId) {
		return ResponseEntity.ok(statusManagementService.getCurrentStatus(personId));
	}
	
	@GetMapping(value = "patient/{personId}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<HIVStatusTrackerDto>> getAllPatientHIVStatus(@PathVariable("personId") Long personId) {
		return ResponseEntity.ok(hivStatusTrackerService.getPersonHIVStatusByPersonId(personId));
	}
	
	@PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<HIVStatusTrackerDto> updateHIVStatusTrackerById(
			@PathVariable("id") Long id,
			@RequestBody HIVStatusTrackerDto hivStatusTrackerDto) {
		return ResponseEntity.ok(hivStatusTrackerService.updateHIVStatusTracker(id, hivStatusTrackerDto));
	}
	
	@DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> archivedHIVStatusTrackerById(@PathVariable("id") Long id) {
		hivStatusTrackerService.archivedHIVStatusTracker(id);
		return ResponseEntity.accepted().build();
	}
	
	
}
