package org.lamisplus.modules.hiv.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.domain.entities.ApplicationCodeSet;
import org.lamisplus.modules.base.domain.repositories.ApplicationCodesetRepository;
import org.lamisplus.modules.hiv.controller.exception.NoRecordFoundException;
import org.lamisplus.modules.hiv.domain.dto.*;
import org.lamisplus.modules.hiv.domain.entity.Observation;
import org.lamisplus.modules.hiv.repositories.ObservationRepository;

import org.lamisplus.modules.hiv.utility.Constants;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TreatmentTransferService {

    private final ObservationRepository observationRepository;
    private final ObservationService observationService;
    private final HIVStatusTrackerService hivStatusTrackerService;
    private final StatusManagementService statusManagementService;
    private final ApplicationCodesetRepository applicationCodesetRepository;
    private final HivEnrollmentService hivEnrollmentService;

    public TransferPatientInfo getTransferPatientInfo(String patientUuid) {
        try {
            if (patientUuid != null) {
                return observationRepository.getTransferPatientInfo(patientUuid)
                        .orElseThrow(() -> new NoRecordFoundException("Patient record not found"));
            } else {
                throw new IllegalArgumentException("patientUuid and facilityId cannot be null");
            }
        } catch (Exception e) {
            log.info("Error while retrieving transfer patient info", e);
            throw new NoRecordFoundException("Error while retrieving transfer patient info: " + e.getMessage());
        }
    }

    public List<LabReport> retrieveTransferPatientLabResult(Long facilityId, String uuid) {
        try {
            if (uuid != null && facilityId != null) {
                return observationRepository.getPatientLabResults(facilityId, uuid);
            } else {
                throw new IllegalArgumentException("Transfer patient uuid or facility id can not be null");
            }
        } catch (Exception e) {
            // Log the exception for troubleshooting
            log.info("Error while retrieving transfer patient lab results", e);
            throw new NoRecordFoundException("Error while retrieving transfer patient lab result: " + e.getMessage());
        }
    }

    public List<MedicationInfo> getCurrentMedication(String personUuid) {
        try {
            if (personUuid != null) {
                return observationRepository.getTransferPatientTreatmentMedication(personUuid);
            } else {
                throw new IllegalArgumentException("Person uuid can not be null");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error while retrieving patients  current medication: " + e.getCause());
        }
    }


    /**
     * check patient hiv status before form was submitted
     * if dead, return a message that patient is dead
     * if not  register form, save information in the observation table
     * change the patient hiv_status_tracker to transfer out
     */
    public ObservationDto registerTransferPatientInfo(TransferPatientDto dto) throws Exception {
        if (dto == null) {
            throw new IllegalArgumentException("TransferPatientInfo is null");
        }
        Optional<HivEnrollmentDTO> enrollment = hivEnrollmentService.getHivEnrollmentByPersonIdAndArchived(dto.getPatientId());
        ApplicationCodeSet codeSet = applicationCodesetRepository.findByDisplay(Constants.TRANSFER_OUT_DISPLAY);
        if (codeSet == null) {
            throw new EntityNotFoundException(ApplicationCodeSet.class, "display", Constants.TRANSFER_OUT_DISPLAY);
        }
        String currentStatus = statusManagementService.getCurrentStatus(dto.getPatientId());
        if (currentStatus.equalsIgnoreCase(Constants.DEAD_CONFIRMED_DISPLAY)) {
            throw new Exception("Patient is confirmed dead");
        }
        // get the current person
        HIVStatusTrackerDto hivStatusTracker = hivStatusTrackerService.getHIVStatusTrackerById(dto.getHivStatusId());
        if (hivStatusTracker == null) {
            throw new Exception("Patient tracker not found");
        }
        // Create observation
        ObservationDto createdObservation = createObservation(dto, codeSet);
        // update the statusAtRegistrationId of enrollment
        enrollment.get().setStatusAtRegistrationId(codeSet.getId());
        // Update HIVStatusTracker and set status transfer date to current date
        hivStatusTracker.setHivStatus(codeSet.getDisplay());
        hivStatusTracker.setStatusDate(LocalDate.now());
        hivStatusTrackerService.updateHIVStatusTracker(hivStatusTracker.getId(), hivStatusTracker);
        hivEnrollmentService.updateHivEnrollment(enrollment.get().getId(), enrollment.get());
        return createdObservation;
    }


    private JsonNode mapTransferPatientInfoToDto(TransferPatientDto transferPatientDto) {
        TransferPatientInfo transferPatientInfo = getTransferPatientInfo(transferPatientDto.getPersonUuid());
        if (transferPatientInfo == null) {
            throw new EntityNotFoundException(Observation.class, "Person uuid", transferPatientDto.getPersonUuid());
        }
        BeanUtils.copyProperties(transferPatientInfo, transferPatientDto);
        transferPatientDto.setLgaTransferTo(transferPatientDto.getLgaTransferTo());
        transferPatientDto.setStateTransferTo(transferPatientDto.getStateTransferTo());
        transferPatientDto.setFacilityTransferTo(transferPatientDto.getFacilityTransferTo());
        transferPatientDto.setBmi(transferPatientDto.getBmi());
        transferPatientDto.setGaInWeeks(transferPatientDto.getGaInWeeks());
        transferPatientDto.setClinicalNote(transferPatientDto.getClinicalNote());
        transferPatientDto.setModeOfHIVTest(transferPatientDto.getModeOfHIVTest());
        transferPatientDto.setCurrentMedication(transferPatientDto.getCurrentMedication());
        transferPatientDto.setLabResult(transferPatientDto.getLabResult());
        transferPatientDto.setReasonForTransfer(transferPatientDto.getReasonForTransfer());
        transferPatientDto.setNameOfTreatmentSupporter(transferPatientDto.getNameOfTreatmentSupporter());
        transferPatientDto.setContactAddressOfTreatmentSupporter(transferPatientDto.getContactAddressOfTreatmentSupporter());
        transferPatientDto.setPhoneNumberOfTreatmentSupporter(transferPatientDto.getPhoneNumberOfTreatmentSupporter());
        transferPatientDto.setRelationshipWithClients(transferPatientDto.getRelationshipWithClients());
        transferPatientDto.setRecommendations(transferPatientDto.getRecommendations());
        transferPatientDto.setCliniciansName(transferPatientDto.getCliniciansName());
        transferPatientDto.setDateOfClinicVisitAtTransferringSite(transferPatientDto.getDateOfClinicVisitAtTransferringSite());
        transferPatientDto.setDateOfFirstConfirmedScheduleApp(transferPatientDto.getDateOfFirstConfirmedScheduleApp());
        transferPatientDto.setPersonEffectingTheTransfer(transferPatientDto.getPersonEffectingTheTransfer());
        transferPatientDto.setAcknowlegdeReceiveDate(transferPatientDto.getAcknowlegdeReceiveDate());
        transferPatientDto.setAcknowlegdeTelephoneNumber(transferPatientDto.getAcknowlegdeTelephoneNumber());
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.valueToTree(transferPatientDto);
    }

    private ObservationDto createObservation(TransferPatientDto transferPatientDto, ApplicationCodeSet codeSet) {
        log.info("Inside createObservation");
        ObservationDto observationDto = new ObservationDto();
        observationDto.setPersonId(transferPatientDto.getPatientId());
        observationDto.setVisitId(null);
        observationDto.setType(codeSet.getDisplay());
        observationDto.setDateOfObservation(LocalDate.now());
        observationDto.setFacilityId(transferPatientDto.getFacilityId());
        observationDto.setData(mapTransferPatientInfoToDto(transferPatientDto));
        return observationService.createAnObservation(observationDto);
    }
}


