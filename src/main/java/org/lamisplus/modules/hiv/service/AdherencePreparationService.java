package org.lamisplus.modules.hiv.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.hiv.domain.dto.AdherencePreparationDto;
import org.lamisplus.modules.hiv.domain.entity.ARTClinical;
import org.lamisplus.modules.hiv.domain.entity.AdherencePreparation;
import org.lamisplus.modules.hiv.repositories.ARTClinicalRepository;
import org.lamisplus.modules.hiv.repositories.AdherencePreparationRepository;
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

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Slf4j
@Service
public class AdherencePreparationService {

    private final AdherencePreparationRepository adherencePreparationRepository;
    private final PersonRepository personRepository;
    private final VisitRepository visitRepository;
    private final ARTClinicalRepository artClinicalRepository;
    private final CurrentUserOrganizationService organizationUtil;
    private final HandleHIVVisitEncounter hivVisitEncounter;


    public AdherencePreparationDto createAdherencePreparation(AdherencePreparationDto dto) {
        log.info("Creating Adherence Preparation record for person ID: {}", dto.getPersonId());
        Person person = getPerson(dto.getPersonId());
        Visit visit = hivVisitEncounter.processAndCreateVisit(
                dto.getPersonId(),
                dto.getServiceDate()
        );

        // Convert DTO to entity
        AdherencePreparation adherencePreparation = convertDtoToEntity(dto);
        adherencePreparation.setPerson(person);
        adherencePreparation.setVisit(visit);
        adherencePreparation.setUuid(UUID.randomUUID().toString());
        adherencePreparation.setArchived(0);
        adherencePreparation.setFacilityId(organizationUtil.getCurrentUserOrganization());

        // Link to ART Clinical if provided
        if (dto.getArtClinicalId() != null) {
            ARTClinical artClinical = getArtClinical(dto.getArtClinicalId());
            adherencePreparation.setArtClinical(artClinical);
        }

        adherencePreparation.setAdherenceServices(dto.getAdherenceServices());
        adherencePreparation.setTreatmentSupporterData(dto.getTreatmentSupporterData());

        AdherencePreparation saved = adherencePreparationRepository.save(adherencePreparation);
        return convertEntityToDto(saved);
    }


    public AdherencePreparationDto updateAdherencePreparation(Long id, AdherencePreparationDto dto) {
        log.info("Updating Adherence Preparation record with ID: {}", id);

        AdherencePreparation existing = getExistingAdherencePreparation(id);

        // Update fields
        existing.setServiceDate(dto.getServiceDate());
        existing.setAdherenceServices(dto.getAdherenceServices());
        existing.setTreatmentSupporterData(dto.getTreatmentSupporterData());

        // Update ART Clinical link if provided
        if (dto.getArtClinicalId() != null) {
            ARTClinical artClinical = getArtClinical(dto.getArtClinicalId());
            existing.setArtClinical(artClinical);
        } else {
            existing.setArtClinical(null);
        }

        AdherencePreparation updated = adherencePreparationRepository.save(existing);
        log.info("Adherence Preparation record updated successfully with ID: {}", updated.getId());

        return convertEntityToDto(updated);
    }

    public void archiveAdherencePreparation(Long id) {
        AdherencePreparation adherencePreparation = getExistingAdherencePreparation(id);
        adherencePreparation.setArchived(1);
        adherencePreparationRepository.save(adherencePreparation);
    }

    public AdherencePreparationDto getAdherencePreparationById(Long id) {
        log.info("Fetching Adherence Preparation record with ID: {}", id);
        AdherencePreparation adherencePreparation = getExistingAdherencePreparation(id);
        return convertEntityToDto(adherencePreparation);
    }

    public List<AdherencePreparationDto> getAllAdherencePreparationByPersonId(Long personId, int pageNo, int pageSize) {
        Person person = getPerson(personId);
        Pageable paging = PageRequest.of(pageNo, pageSize, Sort.by("serviceDate").descending());
        Page<AdherencePreparation> records = adherencePreparationRepository.findAllByPersonAndArchived(person, 0, paging);

        if (records.hasContent()) {
            return records.getContent().stream()
                    .map(this::convertEntityToDto)
                    .collect(Collectors.toList());
        }
        return Collections.emptyList();
    }

    public List<AdherencePreparationDto> getAllAdherencePreparation() {
        log.info("Fetching all Adherence Preparation records");
        return adherencePreparationRepository.findByArchived(0).stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());
    }


    @NotNull
    private AdherencePreparation convertDtoToEntity(AdherencePreparationDto dto) {
        AdherencePreparation entity = new AdherencePreparation();
        BeanUtils.copyProperties(dto, entity);
        entity.setAdherenceServices(dto.getAdherenceServices());
        entity.setTreatmentSupporterData(dto.getTreatmentSupporterData());
        return entity;
    }

    @NotNull
    private AdherencePreparationDto convertEntityToDto(AdherencePreparation entity) {
        AdherencePreparationDto dto = new AdherencePreparationDto();
        BeanUtils.copyProperties(entity, dto);
        dto.setPersonId(entity.getPerson().getId());
        dto.setVisitId(entity.getVisit().getUuid());
        if (entity.getArtClinical() != null) {
            dto.setArtClinicalId(entity.getArtClinical().getId());
        }
        dto.setAdherenceServices(entity.getAdherenceServices());
        dto.setTreatmentSupporterData(entity.getTreatmentSupporterData());
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

    private AdherencePreparation getExistingAdherencePreparation(Long id) {
        return adherencePreparationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(AdherencePreparation.class, "id", String.valueOf(id)));
    }
}
