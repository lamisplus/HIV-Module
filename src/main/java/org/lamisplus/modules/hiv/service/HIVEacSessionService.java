package org.lamisplus.modules.hiv.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.hiv.domain.dto.HIVEacSessionDto;
import org.lamisplus.modules.hiv.domain.entity.HIVEac;
import org.lamisplus.modules.hiv.domain.entity.HIVEacSession;
import org.lamisplus.modules.hiv.repositories.HIVEacRepository;
import org.lamisplus.modules.hiv.repositories.HIVEacSessionRepository;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.domain.entity.Visit;
import org.springframework.stereotype.Service;
import reactor.util.UUIDUtils;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HIVEacSessionService {
	
	private final HIVEacSessionRepository hiveacSessionRepository;
	
	private final HIVEacRepository hiveacRepository;
	
	private final HandleHIVVisitEncounter handleHIVisitEncounter;
	
	public HIVEacSessionDto createEacSession(HIVEacSessionDto dto) {
		HIVEacSession hivEacSession = mapDtoEntity(dto);
		HIVEac eac = getEac(dto.getEacId());
		Visit visit = handleHIVisitEncounter.processAndCreateVisit(dto.getPersonId(), dto.getFollowUpDate());
		List<HIVEacSession> hivEacSesByEac = hiveacSessionRepository.getHIVEacSesByEac(eac);
		handleEacSessionStatus(hivEacSession, hivEacSesByEac);
		hivEacSession.setEac(eac);
		hivEacSession.setUuid(UUIDUtils.random().toString());
		hivEacSession.setPerson(eac.getPerson());
		hivEacSession.setFacilityId(eac.getPerson().getFacilityId());
		hivEacSession.setEacSessionDate(dto.getSessionDate());
		hivEacSession.setVisit(visit);
		hivEacSession.setArchived(0);
		HIVEacSession eacSession = hiveacSessionRepository.save(hivEacSession);
		String status = eacSession.getStatus() + " completed";
		eac.setStatus(status.toUpperCase());
		hiveacRepository.save(eac);
		return mapEntityToDto(eacSession);
	}
	
	public HIVEacSessionDto updateEacSession(Long id, HIVEacSessionDto dto) {
		HIVEacSession existEacSession = getEacSession(id);
		HIVEacSession updateEacSession = mapDtoEntity(dto);
		updateEacSession.setEac(existEacSession.getEac());
		updateEacSession.setUuid(existEacSession.getUuid());
		updateEacSession.setPerson(existEacSession.getPerson());
		updateEacSession.setFacilityId(existEacSession.getFacilityId());
		updateEacSession.setVisit(existEacSession.getVisit());
		updateEacSession.setArchived(0);
		updateEacSession.setId(existEacSession.getId());
		hiveacSessionRepository.save(updateEacSession);
		return mapEntityToDto(updateEacSession);
	}
	
	
	public List<HIVEacSessionDto> getSessionByEac(Long eacId) {
		return hiveacSessionRepository.getHIVEacSesByEac(getEac(eacId))
				.stream()
				.filter(e -> e.getArchived() != 1)
				.map(this::mapEntityToDto)
				.sorted(Comparator.comparing(HIVEacSessionDto::getSessionDate).reversed())
				.collect(Collectors.toList());
	}
	
	public void deleteEacSessionById(Long id) {
		HIVEacSession eacSession = getEacSession(id);
		eacSession.setArchived(1);
		hiveacSessionRepository.save(eacSession);
	}
	
	private HIVEacSession getEacSession(Long id) {
		return hiveacSessionRepository
				.findById(id)
				.orElseThrow(() -> new EntityNotFoundException(HIVEacSession.class, "id", String.valueOf(id)));
	}
	
	
	private HIVEac getEac(Long eacId) {
		return hiveacRepository.findById(eacId)
				.orElseThrow(() -> new EntityNotFoundException(HIVEac.class, "id", String.valueOf(eacId)));
		
	}
	
	private static void handleEacSessionStatus(HIVEacSession hivEacSession, List<HIVEacSession> hivEacSesByEac) {
		int eacCount = 0;
		if (!hivEacSesByEac.isEmpty()) {
			eacCount = hivEacSesByEac.size();
		}
		switch (eacCount) {
			case 0:
				hivEacSession.setStatus("FIRST EAC");
				break;
			case 1:
				hivEacSession.setStatus("SECOND EAC");
				break;
			case 2:
				hivEacSession.setStatus("THIRD EAC");
				break;
			case 3:
				hivEacSession.setStatus("FOURTH EAC");
				break;
			case 4:
				hivEacSession.setStatus("FIFTH EAC");
				break;
			case 5:
				hivEacSession.setStatus("SIXTH EAC");
				break;
			default:
				throw new IllegalStateException("You are not allowed to have more than one extended EAC sessions: " + hivEacSesByEac.size());
		}
	}

	private HIVEacSessionDto mapEntityToDto(HIVEacSession entity) {
		HIVEac eac = entity.getEac();
		Person person = entity.getPerson();
		Visit visit = entity.getVisit();
		// Initialize barriers with an empty map if it's null
		JsonNode barriers = entity.getBarriers() != null ? entity.getBarriers() : JsonNodeFactory.instance.objectNode();
		return HIVEacSessionDto.builder()
				.facilityId(entity.getFacilityId())
				.id(entity.getId())
				.eacId(eac.getId())
				.personId(person.getId())
				.visitId(visit.getId())
				.barriers(barriers) // Use the initialized barriers map
				.intervention(entity.getIntervention())
				.barriersOthers(entity.getBarriersOthers())
				.interventionOthers(entity.getInterventionOthers())
				.comment(entity.getComment())
				.followUpDate(entity.getFollowUpDate())
				.sessionDate(entity.getEacSessionDate())
				.adherence(entity.getAdherence())
				.status(entity.getStatus())
				.uuid(entity.getUuid())
				.referral(entity.getReferral())
				.build();
	}
	
	private HIVEacSession mapDtoEntity(HIVEacSessionDto dto) {
		HIVEacSession hIVEacSession = new HIVEacSession();
		hIVEacSession.setId(dto.getId());
		hIVEacSession.setBarriers(dto.getBarriers());
		hIVEacSession.setIntervention(dto.getIntervention());
		hIVEacSession.setBarriersOthers(dto.getBarriersOthers());
		hIVEacSession.setInterventionOthers(dto.getInterventionOthers());
		hIVEacSession.setComment(dto.getComment());
		hIVEacSession.setFollowUpDate(dto.getFollowUpDate());
		hIVEacSession.setEacSessionDate(dto.getSessionDate());
		hIVEacSession.setReferral(dto.getReferral());
		hIVEacSession.setAdherence(dto.getAdherence());
		hIVEacSession.setStatus(dto.getStatus());
		return hIVEacSession;
		
	}
	
}
