package org.lamisplus.modules.hiv.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.util.Log;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.hiv.domain.dto.HIVStatusTrackerDto;
import org.lamisplus.modules.hiv.domain.dto.PatientTrackingDto;
import org.lamisplus.modules.hiv.domain.entity.HIVStatusTracker;
import org.lamisplus.modules.hiv.domain.entity.PatientTracker;
import org.lamisplus.modules.hiv.repositories.HIVStatusTrackerRepository;
import org.lamisplus.modules.hiv.repositories.PatientTrackerRepository;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.repository.PersonRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatientTrackerService {
    private final PatientTrackerRepository patientTrackerRepository;

    private final PersonRepository personRepository;

    private final HIVStatusTrackerService statusTrackerService;

    private final HIVStatusTrackerRepository hivStatusTrackerRepository;


    public PatientTrackingDto createPatientTracker(PatientTrackingDto dto) {
        PatientTracker patientTracker = mapDtoEntity(dto);
        HIVStatusTrackerDto statusTracker = dto.getStatusTracker();
        if (statusTracker != null) {
            HIVStatusTrackerDto statusDto = statusTrackerService.registerHIVStatusTracker(statusTracker);
            HIVStatusTracker status = hivStatusTrackerRepository.findById(statusDto.getId()).orElseThrow(
                    () -> new EntityNotFoundException(HIVStatusTracker.class, "id", String.valueOf(statusDto.getId())));
            patientTracker.setStatusTracker(status);
        }
        PatientTracker en = patientTrackerRepository.save(patientTracker);
        return mapEntityDto(en);
    }


    public PatientTrackingDto updatePatientTracker(Long id, PatientTrackingDto dto) {
        PatientTracker patientTrackerExist = getPatientTrackerById(id);
        if (patientTrackerExist == null) {
        }
        PatientTracker patientTracker = mapDtoEntity(dto);
        patientTracker.setId(patientTrackerExist.getId());
        patientTracker.setUuid(patientTrackerExist.getUuid());
        HIVStatusTracker statusTracker = patientTrackerExist.getStatusTracker();
//        if (statusTracker != null && dto.getStatusTracker() != null) {
//            statusTrackerService.updateHIVStatusTracker(statusTracker.getId(), dto.getStatusTracker());
//        }
//        if (statusTracker != null && "No".equals(dto.getCareInFacilityDiscountinued()) && "Died (Confirmed)".equals(statusTracker.getHivStatus())) {
//            statusTracker.setArchived(1);
//            hivStatusTrackerRepository.save(statusTracker);
//        }
        if (statusTracker != null && dto.getStatusTracker() != null) {
            statusTrackerService.updateHIVStatusTracker(statusTracker.getId(), dto.getStatusTracker());
        }
        if (statusTracker != null && "No".equals(dto.getCareInFacilityDiscountinued()) && "Died (Confirmed)".equals(statusTracker.getHivStatus())) {
            statusTracker.setArchived(1);
            hivStatusTrackerRepository.save(statusTracker);
        }
        patientTracker.setStatusTracker(statusTracker);
        return mapEntityDto(patientTrackerRepository.save(patientTracker));
    }


    public List<PatientTrackingDto> getPatientTrackerByPatientId(Long patientId) {
        return patientTrackerRepository.getPatientTrackerByPersonAndArchived(getPatient(patientId), 0)
                .stream()
                .map(this::mapEntityDto)
                .collect(Collectors.toList());

    }

    private PatientTracker getPatientTrackerById(Long id) {
        return patientTrackerRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException(PatientTracker.class, "id", String.valueOf(id)));
    }

    public void deletePatientTrackerById(Long id) {
        PatientTracker patientTracker = getPatientTrackerById(id);
        HIVStatusTracker statusTracker = patientTracker.getStatusTracker();
        patientTrackerRepository.delete(patientTracker);
        hivStatusTrackerRepository.delete(statusTracker);
    }


    private PatientTracker mapDtoEntity(PatientTrackingDto dto) {
        PatientTracker patientTracker = getPatientTrackerFromDto(dto);
        patientTracker.setFacilityId(patientTracker.getPerson().getFacilityId());
        return patientTracker;

    }

    private PatientTrackingDto mapEntityDto(PatientTracker entity) {
        PatientTrackingDto patentTrackingDto = new PatientTrackingDto();
        patentTrackingDto.setDsdStatus(entity.getDsdStatus());
        patentTrackingDto.setDsdModel(entity.getDsdModel());
        patentTrackingDto.setReasonForTracking(entity.getReasonForTracking());
        patentTrackingDto.setCareInFacilityDiscountinued(entity.getCareInFacilityDiscountinued());
        patentTrackingDto.setReasonForDiscountinuation(entity.getReasonForDiscountinuation());
        patentTrackingDto.setCauseOfDeath(entity.getCauseOfDeath());
        patentTrackingDto.setDateOfDeath(entity.getDateOfDeath());
        patentTrackingDto.setReasonForLossToFollowUp(entity.getReasonForLossToFollowUp());
        patentTrackingDto.setReferredFor(entity.getReferredFor());
        patentTrackingDto.setReferredForOthers(entity.getReferredForOthers());
        patentTrackingDto.setReasonForTrackingOthers(entity.getReasonForTrackingOthers());
        patentTrackingDto.setCauseOfDeathOthers(entity.getCauseOfDeathOthers());
        patentTrackingDto.setReasonForLossToFollowUpOthers(entity.getReasonForLossToFollowUpOthers());
        patentTrackingDto.setAttempts(entity.getAttempts());
        patentTrackingDto.setDurationOnART(entity.getDurationOnART());
        patentTrackingDto.setDateLastAppointment(entity.getDateLastAppointment());
        patentTrackingDto.setDateReturnToCare(entity.getDateReturnToCare());
        patentTrackingDto.setDateOfDiscontinuation(entity.getDateOfDiscontinuation());
        patentTrackingDto.setDateMissedAppointment(entity.getDateMissedAppointment());
        patentTrackingDto.setFacilityId(entity.getFacilityId());
        patentTrackingDto.setPatientId(entity.getPerson().getId());
        patentTrackingDto.setDateOfObservation(entity.getDateOfObservation());

        if (entity.getStatusTracker() != null) {
            HIVStatusTrackerDto statusTracker =
                    statusTrackerService.convertEntityToDto(entity.getStatusTracker());
            patentTrackingDto.setStatusTracker(statusTracker);
        } else {
            patentTrackingDto.setStatusTracker(null);
        }
        entity.getPerson().getId();
        patentTrackingDto.setId(entity.getId());
        return patentTrackingDto;
    }

    private PatientTracker getPatientTrackerFromDto(PatientTrackingDto dto) {
        return PatientTracker.builder()
                .dsdStatus(dto.getDsdStatus())
                .dsdModel(dto.getDsdModel())
                .reasonForTracking(dto.getReasonForTracking())
                .careInFacilityDiscountinued(dto.getCareInFacilityDiscountinued())
                .reasonForDiscountinuation(dto.getReasonForDiscountinuation())
                .causeOfDeath(dto.getCauseOfDeath())
                .dateOfDeath(dto.getDateOfDeath())
                .reasonForLossToFollowUp(dto.getReasonForLossToFollowUp())
                .referredFor(dto.getReferredFor())
                .referredForOthers(dto.getReferredForOthers())
                .reasonForTrackingOthers(dto.getReasonForTrackingOthers())
                .causeOfDeathOthers(dto.getCauseOfDeathOthers())
                .reasonForLossToFollowUpOthers(dto.getReasonForLossToFollowUpOthers())
                .uuid(UUID.randomUUID().toString())
                .attempts(dto.getAttempts())
                .durationOnART(dto.getDurationOnART())
                .dateLastAppointment(dto.getDateLastAppointment())
                .dateReturnToCare(dto.getDateReturnToCare())
                .dateOfDiscontinuation(dto.getDateOfDiscontinuation())
                .dateMissedAppointment(dto.getDateMissedAppointment())
                .person(getPatient(dto.getPatientId()))
                .dateOfObservation(dto.getDateOfObservation())
                .archived(0)
                .build();
    }

    private Person getPatient(Long patientId) {
        return personRepository
                .findById(patientId)
                .orElseThrow(() -> new EntityNotFoundException(Person.class, "id", String.valueOf(patientId)));
    }

}
