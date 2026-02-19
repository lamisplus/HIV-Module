package org.lamisplus.modules.hiv.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.repositories.ApplicationCodesetRepository;
import org.lamisplus.modules.hiv.domain.dto.enrollmentcommencement.CommencementDto;
import org.lamisplus.modules.hiv.domain.dto.enrollmentcommencement.EnrollmentCommencementRequestDto;
import org.lamisplus.modules.hiv.domain.dto.enrollmentcommencement.RegistrationDto;
import org.lamisplus.modules.hiv.domain.dto.enrollmentcommencement.TbPreventiveTherapyDto;
import org.lamisplus.modules.hiv.domain.entity.EnrollmentCommencement;
import org.lamisplus.modules.hiv.repositories.EnrollmentCommencementRepository;
import org.lamisplus.modules.hiv.repositories.RegimenRepository;
import org.lamisplus.modules.hiv.utility.Constants;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.domain.entity.Visit;
import org.lamisplus.modules.patient.repository.PersonRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EnrollmentCommencementService {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private final EnrollmentCommencementRepository repository;
    private final PersonRepository personRepository;
    private final HandleHIVVisitEncounter hivVisitEncounter;
    private final CurrentUserOrganizationService currentUserOrganizationService;
    private final ApplicationCodesetRepository applicationCodesetRepository;
    private final RegimenRepository regimenRepository;

    @Transactional
    public EnrollmentCommencement create(EnrollmentCommencementRequestDto request) {
        Person person = resolvePerson(request.getPersonId());

        if (repository.existsByPersonAndArchived(person, 0)) {
            throw new RecordExistException(
                    EnrollmentCommencement.class, "person", String.valueOf(person.getId()));
        }

        EnrollmentCommencement entity = buildEntity(request, person);
        return repository.save(entity);
    }

    @Transactional
    public EnrollmentCommencement update(Long id, EnrollmentCommencementRequestDto request) {
        EnrollmentCommencement existing = getById(id);
        Person person = existing.getPerson();

        EnrollmentCommencement updated = buildEntity(request, person);
        updated.setId(existing.getId());
        updated.setUuid(existing.getUuid());
        updated.setPerson(person);
        updated.setVisit(existing.getVisit());
        updated.setArchived(0);
        return repository.save(updated);
    }

    public EnrollmentCommencement getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        EnrollmentCommencement.class, "id", String.valueOf(id)));
    }

    public EnrollmentCommencement getByPersonId(Long personId) {
        Person person = resolvePerson(personId);
        return repository.findByPersonAndArchived(person, 0)
                .orElseThrow(() -> new EntityNotFoundException(
                        EnrollmentCommencement.class, "personId", String.valueOf(personId)));
    }

    @Transactional
    public void delete(Long id) {
        EnrollmentCommencement entity = getById(id);
        entity.setArchived(1);
        repository.save(entity);
    }

    private EnrollmentCommencement buildEntity(EnrollmentCommencementRequestDto request, Person person) {
        RegistrationDto reg = request.getData().getRegistration();
        CommencementDto com = request.getData().getCommencement();

        LocalDate artStartDate = parseDate(com.getDateArtStarted());

        Visit visit = hivVisitEncounter.processAndCreateVisit(person.getId(), artStartDate);

        EnrollmentCommencement entity = new EnrollmentCommencement();
        entity.setUuid(UUID.randomUUID().toString());
        entity.setPerson(person);
        entity.setVisit(visit);
        entity.setIsCommencement(Boolean.TRUE);
        entity.setArchived(0);
        entity.setFacilityId(currentUserOrganizationService.getCurrentUserOrganization());
        entity.setSource(Constants.WEB_SOURCE);

        // ── Registration fields ───────────────────────────────────────────────
        entity.setUniqueIdNo(reg.getUniqueIdNo());
        entity.setDateEnrolledInHivCare(parseDate(reg.getDateEnrolledInHivCare()));
        entity.setDateConfirmedHivTest(parseDate(reg.getDateConfirmedHivTest()));
        entity.setHivTestLocation(reg.getHivTestLocation());
        entity.setModeOfHivTest(reg.getModeOfHivTest());
        entity.setCareEntryPointId(resolveCareEntryPointId(reg.getCareEntryPoint()));
        entity.setCareEntryPointOther(reg.getCareEntryPointOther());
        entity.setMotherUniqueId(reg.getMotherUniqueId());
        entity.setOccupation(reg.getOccupation());
        entity.setMaritalStatus(reg.getMaritalStatus());
        entity.setEducationalLevel(reg.getEducationalStatus());
        entity.setNokName(reg.getNextOfKin());
        entity.setNokRelationship(reg.getNextOfKinRelationship());
        entity.setNokTelephone(reg.getNextOfKinTelephone());
        entity.setPriorArtCode(reg.getPriorArt());
        entity.setIsKp("Yes".equalsIgnoreCase(reg.getIsKp()));
        entity.setKpTypology(reg.getKpTypology());
        entity.setDateTransferredIn(parseDate(reg.getDateTransferredIn()));
        entity.setFacilityTransferredFrom(reg.getFacilityTransferredFrom());

        // ── Commencement fields ───────────────────────────────────────────────
        entity.setClinicalStageId(resolveClinicalStageId(com.getClinicalStageAtArtStart()));
        entity.setCd4AtArtStart(parseLong(com.getCd4AtArtStart()));
        entity.setCd4Lf(com.getCd4Lf());
        entity.setDateAdherenceCounselingCompleted(parseDate(com.getDateAdherenceCounselingCompleted()));
        entity.setDateArtStarted(artStartDate);
        entity.setRegimenId(resolveRegimenId(com.getFirstArtRegimen()));
        entity.setWeightKg(parseDouble(com.getWeightKg()));
        entity.setHeightCm(parseDouble(com.getHeightCm()));
        entity.setBmi(parseDouble(com.getBmi()));
        entity.setMuac(parseDouble(com.getMuac()));
        entity.setMuacIndication(com.getMuacIndication());
        entity.setPregnancyStatus(com.getPregnancyStatus());

        // ── TPT ───────────────────────────────────────────────────────────────
        TbPreventiveTherapyDto tpt = com.getTbPreventiveTherapy();
        if (tpt != null) {
            entity.setTptMedication(tpt.getMedication());
            entity.setTptCode(tpt.getCode());
            entity.setTptDose(tpt.getDose());
            entity.setTptStartDate(parseDate(tpt.getStartDate()));
            entity.setTptCompletionDate(parseDate(tpt.getCompletionDate()));
        }

        return entity;
    }

    private Person resolvePerson(Long personId) {
        return personRepository.findById(personId)
                .orElseThrow(() -> new EntityNotFoundException(
                        Person.class, "id", String.valueOf(personId)));
    }

    private LocalDate parseDate(String raw) {
        if (raw == null || raw.trim().isEmpty()) return null;
        try {
            return LocalDate.parse(raw, DATE_FMT);
        } catch (Exception e) {
            log.warn("Could not parse date '{}': {}", raw, e.getMessage());
            return null;
        }
    }

    private Long parseLong(String raw) {
        if (raw == null || raw.trim().isEmpty()) return null;
        try {
            return Long.parseLong(raw);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Double parseDouble(String raw) {
        if (raw == null || raw.trim().isEmpty()) return null;
        try {
            return Double.parseDouble(raw);
        } catch (NumberFormatException e) {
            return null;
        }
    }


    private Long resolveCareEntryPointId(String code) {
        if (code == null || code.trim().isEmpty()) return null;
        return applicationCodesetRepository
                .findAllByCodeAndArchived(code, 0)
                .stream()
                .filter(cs -> "CARE_ENTRY_POINT".equals(cs.getCodesetGroup()))
                .findFirst()
                .map(cs -> cs.getId())
                .orElse(null);
    }


    private Long resolveClinicalStageId(String display) {
        if (display == null || display.trim().isEmpty()) return null;
        return applicationCodesetRepository
                .findByDisplayAndCodesetGroup(display, "CLINICAL_STAGE")
                .map(cs -> cs.getId())
                .orElse(null);
    }


    private Long resolveRegimenId(String regimenDescription) {
        if (regimenDescription == null || regimenDescription.trim().isEmpty()) return null;
        return regimenRepository
                .findByDescriptionAndActiveIsTrue(regimenDescription)
                .map(r -> r.getId())
                .orElse(null);
    }
}
