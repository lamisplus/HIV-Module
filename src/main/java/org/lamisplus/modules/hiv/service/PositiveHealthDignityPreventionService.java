package org.lamisplus.modules.hiv.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.hiv.domain.dto.PositiveHealthDignityPreventionDto;
import org.lamisplus.modules.hiv.domain.entity.ARTClinical;
import org.lamisplus.modules.hiv.domain.entity.PositiveHealthDignityPrevention;
import org.lamisplus.modules.hiv.repositories.ARTClinicalRepository;
import org.lamisplus.modules.hiv.repositories.PositiveHealthDignityPreventionRepository;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.domain.entity.Visit;
import org.lamisplus.modules.patient.repository.PersonRepository;
import org.lamisplus.modules.patient.repository.VisitRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Slf4j
@Service
public class PositiveHealthDignityPreventionService {

    private final PositiveHealthDignityPreventionRepository phdpRepository;
    private final PersonRepository personRepository;
    private final VisitRepository visitRepository;
    private final ARTClinicalRepository artClinicalRepository;
    private final CurrentUserOrganizationService organizationUtil;
    private final HandleHIVVisitEncounter hivVisitEncounter;


    public PositiveHealthDignityPreventionDto createPhdp(PositiveHealthDignityPreventionDto phdpDto) {
        log.info("Creating PHDP record for person ID: {}", phdpDto.getPersonId());
        Person person = getPerson(phdpDto.getPersonId());
        Visit visit = hivVisitEncounter.processAndCreateVisit(
                phdpDto.getPersonId(),
                phdpDto.getAssessmentDate()
        );

        // Convert DTO to entity
        PositiveHealthDignityPrevention phdp = convertDtoToEntity(phdpDto);
        phdp.setPerson(person);
        phdp.setVisit(visit);
        phdp.setUuid(UUID.randomUUID().toString());
        phdp.setArchived(0);
        phdp.setFacilityId(organizationUtil.getCurrentUserOrganization());
        // Link to ART Clinical if provided
        if (phdpDto.getArtClinicalId() != null) {
            ARTClinical artClinical = getArtClinical(phdpDto.getArtClinicalId());
            phdp.setArtClinical(artClinical);
        }
        phdp.setPhdpServices(phdpDto.getPhdpServices());

        PositiveHealthDignityPrevention savedPhdp = phdpRepository.save(phdp);
        return convertEntityToDto(savedPhdp);
    }


    public PositiveHealthDignityPreventionDto updatePhdp(Long id, PositiveHealthDignityPreventionDto phdpDto) {
        log.info("Updating PHDP record with ID: {}", id);

        PositiveHealthDignityPrevention existingPhdp = getExistingPhdp(id);

        // Update fields
        existingPhdp.setAssessmentDate(phdpDto.getAssessmentDate());
        existingPhdp.setClinicalNotes(phdpDto.getClinicalNotes());

        // Explicitly set JSONB field
        existingPhdp.setPhdpServices(phdpDto.getPhdpServices());

        // Update ART Clinical link if provided
        if (phdpDto.getArtClinicalId() != null) {
            ARTClinical artClinical = getArtClinical(phdpDto.getArtClinicalId());
            existingPhdp.setArtClinical(artClinical);
        } else {
            existingPhdp.setArtClinical(null);
        }

        PositiveHealthDignityPrevention updatedPhdp = phdpRepository.save(existingPhdp);
        log.info("PHDP record updated successfully with ID: {}", updatedPhdp.getId());

        return convertEntityToDto(updatedPhdp);
    }

    public void archivePhdp(Long id) {
        PositiveHealthDignityPrevention phdp = getExistingPhdp(id);
        phdp.setArchived(1);
        phdpRepository.save(phdp);
    }

    public PositiveHealthDignityPreventionDto getPhdpById(Long id) {
        log.info("Fetching PHDP record with ID: {}", id);
        PositiveHealthDignityPrevention phdp = getExistingPhdp(id);
        return convertEntityToDto(phdp);
    }

    public List<PositiveHealthDignityPreventionDto> getAllPhdpByPersonId(Long personId, int pageNo, int pageSize) {
        Person person = getPerson(personId);
        Pageable paging = PageRequest.of(pageNo, pageSize, Sort.by("assessmentDate").descending());
        Page<PositiveHealthDignityPrevention> phdpRecords = phdpRepository.findAllByPersonAndArchived(person, 0, paging);

        if (phdpRecords.hasContent()) {
            return phdpRecords.getContent().stream()
                    .map(this::convertEntityToDto)
                    .collect(Collectors.toList());
        }
        return Collections.emptyList();
    }

    public List<PositiveHealthDignityPreventionDto> getAllPhdp() {
        log.info("Fetching all PHDP records");
        return phdpRepository.findByArchived(0).stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());
    }


    @NotNull
    private PositiveHealthDignityPrevention convertDtoToEntity(PositiveHealthDignityPreventionDto dto) {
        PositiveHealthDignityPrevention entity = new PositiveHealthDignityPrevention();
        BeanUtils.copyProperties(dto, entity);
        entity.setPhdpServices(dto.getPhdpServices());
        return entity;
    }

    @NotNull
    private PositiveHealthDignityPreventionDto convertEntityToDto(PositiveHealthDignityPrevention entity) {
        PositiveHealthDignityPreventionDto dto = new PositiveHealthDignityPreventionDto();
        BeanUtils.copyProperties(entity, dto);
        dto.setPersonId(entity.getPerson().getId());
        dto.setVisitId(entity.getVisit().getUuid());
        if (entity.getArtClinical() != null) {
            dto.setArtClinicalId(entity.getArtClinical().getId());
        }
        dto.setPhdpServices(entity.getPhdpServices());
        return dto;
    }

    private Person getPerson(Long personId) {
        return personRepository.findById(personId)
                .orElseThrow(() -> new EntityNotFoundException(Person.class, "id", String.valueOf(personId)));
    }

    private Visit getVisit(String visitUuid) {
        return visitRepository.findByUuid(visitUuid)
                .orElseThrow(() -> new EntityNotFoundException(Visit.class, "uuid", visitUuid));
    }

    private ARTClinical getArtClinical(Long artClinicalId) {
        return artClinicalRepository.findById(artClinicalId)
                .orElseThrow(() -> new EntityNotFoundException(ARTClinical.class, "id", String.valueOf(artClinicalId)));
    }

    private PositiveHealthDignityPrevention getExistingPhdp(Long id) {
        return phdpRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(PositiveHealthDignityPrevention.class, "id", String.valueOf(id)));
    }
}
