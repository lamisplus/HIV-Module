package org.lamisplus.modules.hiv.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.hiv.domain.entity.HIVDrug;
import org.lamisplus.modules.hiv.domain.entity.Regimen;
import org.lamisplus.modules.hiv.domain.entity.RegimenType;
import org.lamisplus.modules.hiv.repositories.RegimenTypeRepository;
import org.lamisplus.modules.hiv.service.RegimenService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/hiv/regimen")
public class RegimenController {
	
	private final RegimenTypeRepository repository;
	private final RegimenService regimenService;
	
	@GetMapping(value = "/types", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<RegimenType>> getRegimenTypes() {
		return ResponseEntity.ok(repository.findAll());
	}
	@GetMapping(value = "/arv/adult", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<RegimenType>> getAdultRegimenTypes() {
		return ResponseEntity.ok(repository.findAll().stream()
				.filter(e -> e.getDescription().contains("Adult")
						|| e.getDescription().contains("Third Line")
						||e.getDescription().contains("IPT")
						|| e.getDescription().contains("OI")
						|| e.getDescription().contains("CTX")
				)
				.collect(Collectors.toList()));
	}
	
	
	@GetMapping(value = "/arv/children", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<RegimenType>> getChildrenRegimenTypes() {
		return ResponseEntity.ok(repository.findAll().stream().filter(e -> e.getDescription().contains("TB Treatment Children")
				|| e.getDescription().contains("OI")
				||e.getDescription().contains("IPT")
				|| e.getDescription().contains("CTX")
				|| e.getDescription().contains("Paediatric 1st Line")
				|| e.getDescription().contains("Paediatric 2nd Line")
				|| e.getDescription().contains("Paediatric 3rd Line")
				)
				.collect(Collectors.toList()));
	}
	
	@GetMapping(value = "/tb/drugs", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<RegimenType>> getTbDrugsType() {
		return ResponseEntity.ok(
				repository.findAll().stream().filter(e -> e.getDescription().contains("TB") || e.getDescription().contains("IPT"))
				.collect(Collectors.toList()));
	}
	

	
	@GetMapping(value = "/other/drugs", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<RegimenType>> getOtherRegimenTypes() {
		return ResponseEntity.ok(repository.findAll()
				.stream()
				.filter(e -> e.getDescription().contains("Other")
						|| e.getDescription().contains("ARV")
						|| e.getDescription().contains("PEP")
						|| e.getDescription().contains("CTX")
						||e.getDescription().contains("PrEP"))
				.collect(Collectors.toList()));
	}
	
	
	@GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Regimen> getRegimen(@PathVariable("id") Long id) {
		return ResponseEntity.ok(regimenService.getRegimenById(id));
	}
	
	@GetMapping(value = "/types/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Regimen>> getRegimensByTypeId(@PathVariable("id") Long id) {
		return ResponseEntity.ok(regimenService.getRegimenByTypeId(id));
	}
	
	@GetMapping(value = "/drugs/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<HIVDrug>> getRegimenDrugsById(@PathVariable("id") Long id) {
		return ResponseEntity.ok(regimenService.getRegimenDrugsById(id));
	}
	
	
}
