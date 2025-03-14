package org.lamisplus.modules.hiv.service;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.hiv.domain.dto.EacOutComeDto;
import org.lamisplus.modules.hiv.domain.dto.TransferPatientInfo;
import org.lamisplus.modules.hiv.domain.entity.EacOutCome;
import org.lamisplus.modules.hiv.domain.entity.HIVEac;
import org.lamisplus.modules.hiv.domain.entity.HIVEacSession;
import org.lamisplus.modules.hiv.domain.entity.HivEnrollment;
import org.lamisplus.modules.hiv.repositories.EacOutComeRepository;
import org.lamisplus.modules.hiv.repositories.HIVEacRepository;
import org.lamisplus.modules.hiv.repositories.HIVEacSessionRepository;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.domain.entity.Visit;
import org.lamisplus.modules.patient.repository.PersonRepository;
import org.lamisplus.modules.patient.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EACOutComeService {
	
	private final EacOutComeRepository eacOutComeRepository;
	private final HIVEacRepository hivEacRepository;
	
	private final HIVEacSessionRepository hivEacSessionRepository;
	
	private final HandleHIVVisitEncounter hivVisitEncounter;
	private final PersonRepository personRepository;

	private final CurrentUserOrganizationService currentUserOrganizationService;
	
	
	public EacOutComeDto registerEACOutcome(Long id, EacOutComeDto dto) {
		HIVEac eac = getEac(id);
		EacOutCome eacOutCome = mapDtoEntity(dto);
		eacOutCome.setEac(eac);
		eacOutCome.setPerson(eac.getPerson());
		eacOutCome.setFacilityId(eac.getPerson().getFacilityId());
		
		Visit visit = hivVisitEncounter.processAndCreateVisit(eac.getPerson().getId(), dto.getOutComeDate());
		eacOutCome.setVisit(visit);
		List<HIVEacSession> eacSessionList = hivEacSessionRepository.getHIVEacSesByEac(eac);
		if (!eacSessionList.isEmpty() && eacSessionList.size() >= 3) {
			EacOutCome outcome = eacOutComeRepository.save(eacOutCome);
			eac.setStatus("COMPLETED");
			hivEacRepository.save(eac);
			return mapEntityDto(outcome);
		} else throw new IllegalArgumentException("You must have at least 3 EAC sessions");
	}
	
	private HIVEac getEac(Long eacId) {
		return hivEacRepository
				.findById(eacId)
				.orElseThrow(() -> new EntityNotFoundException(HIVEac.class, "id", String.valueOf(eacId)));
	}
	
	
	private EacOutComeDto mapEntityDto(EacOutCome entity) {
		return EacOutComeDto.builder()
				.id(entity.getId())
				.eacId(entity.getEac().getId())
				.personId(entity.getPerson().getId())
				.visitId(entity.getVisit().getId())
				.repeatViralLoader(entity.getRepeatViralLoader())
				.outcome(entity.getOutcome())
				.plan(entity.getPlan())
				.currentRegimen(entity.getCurrentRegimen())
				.switchRegimen(entity.getSwitchRegimen())
				.planAction(entity.getPlanAction())
				.build();
		
	}
	
	private EacOutCome mapDtoEntity(EacOutComeDto dto) {
		EacOutCome eacOutCome = new EacOutCome();
		eacOutCome.setId(dto.getId());
		eacOutCome.setRepeatViralLoader(dto.getRepeatViralLoader());
		eacOutCome.setOutcome(dto.getOutcome());
		eacOutCome.setPlan(dto.getPlan());
		eacOutCome.setCurrentRegimen(dto.getCurrentRegimen());
		eacOutCome.setSwitchRegimen(dto.getSwitchRegimen());
		eacOutCome.setPlanAction(dto.getPlanAction());
		eacOutCome.setArchived(0);
		eacOutCome.setUuid(UUID.randomUUID().toString());
		return eacOutCome;
		
	}

	public List<EacOutComeDto> getAllEacOutComeByPerson(String personUuid) {
		Optional<Person> personOptional = personRepository.findByUuidAndFacilityIdAndArchived(personUuid, currentUserOrganizationService.getCurrentUserOrganization(), 0);
		if (!personOptional.isPresent()) {
			throw new EntityNotFoundException(Person.class, "personUuid", "" + personUuid);
		}

		Person person = personOptional.get();
		List<EacOutCome> eacOutComes = eacOutComeRepository.findByPerson(person);

        return eacOutComes.stream()
				.map(this::mapEntityDto)
				.collect(Collectors.toList());
	}

	public EacOutComeDto updateEacOutCome(Long id, EacOutComeDto eacOutComeDto) {
		EacOutCome eacOutCome = eacOutComeRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException(EacOutCome.class, "id", id.toString()));

		eacOutCome.setRepeatViralLoader(eacOutComeDto.getRepeatViralLoader());
		eacOutCome.setOutcome(eacOutComeDto.getOutcome());
		eacOutCome.setPlan(eacOutComeDto.getPlan());
		eacOutCome.setCurrentRegimen(eacOutComeDto.getCurrentRegimen());
		eacOutCome.setSwitchRegimen(eacOutComeDto.getSwitchRegimen());
		eacOutCome.setSubstituteRegimen(eacOutComeDto.getSubstituteRegimen());
		eacOutCome.setPlanAction(eacOutComeDto.getPlanAction());


		eacOutCome = eacOutComeRepository.save(eacOutCome);

		return mapEntityDto(eacOutCome);
	}

	public String deleteEacOutcome(Long id){
		EacOutCome eacOutCome = eacOutComeRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException(EacOutCome.class, "id", id.toString()));
		eacOutCome.setArchived(1);
		eacOutComeRepository.save(eacOutCome);
		return "Successfully deleted record";

	}



}
