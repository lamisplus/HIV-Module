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
import org.lamisplus.modules.hiv.domain.entity.HIVStatusTracker;
import org.lamisplus.modules.hiv.domain.entity.HivEnrollment;
import org.lamisplus.modules.hiv.domain.entity.Observation;
import org.lamisplus.modules.hiv.repositories.HIVStatusTrackerRepository;
import org.lamisplus.modules.hiv.repositories.ObservationRepository;
import org.lamisplus.modules.hiv.utility.Constants;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TreatmentTransferService {

    private final ObservationRepository observationRepository;
    private final ObservationService observationService;
    private final ApplicationCodesetRepository applicationCodesetRepository;
    private final HivEnrollmentService hivEnrollmentService;
    private final HIVStatusTrackerRepository hivStatusTrackerRepository;
    private final CurrentUserOrganizationService currentUserOrganizationService;

    public TransferPatientInfo getTransferPatientInfo(String patientUuid, Long facilityId) {
        return observationRepository.getTransferPatientInfo(patientUuid, currentUserOrganizationService.getCurrentUserOrganization()).get();
    }

    public List<LatestLabResult> retrieveTransferPatientLabResult(Long facilityId, String uuid) {
        try {
            if (uuid != null && facilityId != null) {
                return observationRepository.getPatientLabResults(facilityId, uuid);
            } else {
                throw new IllegalArgumentException("Transfer patient uuid or facility id can not be null");
            }
        } catch (Exception e) {
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

    public ObservationDto registerTransferPatientInfo(TransferPatientDto dto) throws Exception {
        if (dto == null) {
            throw new IllegalArgumentException("TransferPatientInfo is null");
        }
        String status = dto.getCurrentStatus().equalsIgnoreCase("ART TRANSFER OUT") ? "ART Transfer In" : "ART Transfer Out";
        ApplicationCodeSet codeSet = applicationCodesetRepository.findByDisplayAndCodesetGroup(status, Constants.CODE_SET_GROUP)
                .orElseThrow(() -> new EntityNotFoundException(ApplicationCodeSet.class, "display", status));
        Boolean existsRecordWithDiedStatus = hivStatusTrackerRepository.existsRecordWithDiedStatus(dto.getPersonUuid());
        if (existsRecordWithDiedStatus) {
            throw new Exception("Patient is confirmed dead");
        }
        // Create observation
        ObservationDto createdObservation = createObservation(dto, codeSet);
        //update hiv_enrollment status
        updateHivEnrollStatus(dto, codeSet);
        //create hiv_status_tracker record
        createNewHivStatus(dto, status);
        return createdObservation;
    }

    private void updateHivEnrollStatus(TransferPatientDto dto, ApplicationCodeSet codeSet) {
        HivEnrollmentDTO enrollment = hivEnrollmentService.getHivEnrollmentByPersonIdAndArchived(dto.getPatientId())
                .orElseThrow(() -> new EntityNotFoundException(HivEnrollment.class, "personId", "" + dto.getPatientId()));
        enrollment.setStatusAtRegistrationId(codeSet.getId());
        if (dto.getCurrentStatus().equalsIgnoreCase("ART Transfer Out")) {
            enrollment.setEntryPointId(21L);
        }
        hivEnrollmentService.updateHivEnrollment(enrollment.getId(), enrollment);
    }


    private void createNewHivStatus(TransferPatientDto dto, String finalStatus) {
        HIVStatusTracker hivStatusTracker = hivStatusTrackerRepository.findById(dto.getHivStatusId())
                .orElseThrow(() -> new EntityNotFoundException(HIVStatusTrackerRepository.class, "id", "" + dto.getHivStatusId()));
        hivStatusTracker.setId(null);
        hivStatusTracker.setHivStatus(finalStatus);
        hivStatusTracker.setUuid(UUID.randomUUID().toString());
        hivStatusTracker.setCreatedDate(LocalDateTime.now());
        hivStatusTracker.setStatusDate(LocalDate.parse(dto.getEncounterDate()));
        hivStatusTrackerRepository.save(hivStatusTracker);
    }


    private JsonNode mapTransferPatientInfoToDto(TransferPatientDto transferPatientDto) {
        TransferPatientInfo transferPatientInfo = getTransferPatientInfo(transferPatientDto.getPersonUuid(), transferPatientDto.getFacilityId());
        if (transferPatientInfo == null) {
            throw new EntityNotFoundException(Observation.class, "Person uuid", transferPatientDto.getPersonUuid());
        }
        BeanUtils.copyProperties(transferPatientInfo, transferPatientDto);
        transferPatientDto.setLgaTransferTo(transferPatientDto.getLgaTransferTo());
        transferPatientDto.setStateTransferTo(transferPatientDto.getStateTransferTo());
        transferPatientDto.setFacilityTransferTo(transferPatientDto.getFacilityTransferTo());
        transferPatientDto.setFacilityName(transferPatientDto.getFacilityName());
        transferPatientDto.setLga(transferPatientDto.getLga());
        transferPatientDto.setState(transferPatientDto.getState());
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
        transferPatientDto.setEncounterDate(transferPatientDto.getEncounterDate());
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.valueToTree(transferPatientDto);
    }

    private ObservationDto createObservation(TransferPatientDto transferPatientDto, ApplicationCodeSet codeSet1) {
        ObservationDto observationDto = new ObservationDto();
        observationDto.setPersonId(transferPatientDto.getPatientId());
        observationDto.setVisitId(null);
        observationDto.setType(codeSet1.getDisplay());
        observationDto.setDateOfObservation(LocalDate.parse(transferPatientDto.getEncounterDate()));
        observationDto.setFacilityId(transferPatientDto.getFacilityId());
        observationDto.setData(mapTransferPatientInfoToDto(transferPatientDto));
        return observationService.createAnObservation(observationDto);
    }

    public boolean checkTransferStatus(String personUuid, LocalDate encounterDate) {
        String formattedDate = encounterDate.format(DateTimeFormatter.ISO_DATE);
        return observationRepository.hasTransferOnDate(personUuid, formattedDate);
    }

    public boolean isTransferOutEncounterOver24Hours(String personUuid) {
        return observationRepository.findMostRecentTransferOut(personUuid)
                .map(observation -> {
                    String encounterDateStr = observation.getData().get("encounterDate").toString();
                    if (encounterDateStr == null) {
                        log.error("Encounter date is missing for personUuid: {}", personUuid);
                        return false;
                    }
                    try {
                        encounterDateStr = encounterDateStr.replaceAll("^\"|\"$", "").trim();
                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd"); // Adjust as needed
                        LocalDateTime encounterDateTime = LocalDate.parse(encounterDateStr, formatter).atStartOfDay();
                        LocalDateTime twentyFourHoursAgo = LocalDateTime.now().minusHours(24);
                        return encounterDateTime.isBefore(twentyFourHoursAgo);
                    } catch (DateTimeParseException e) {
                        log.error("Error parsing encounter date for personUuid: {}. Date string: {}", personUuid, encounterDateStr, e);
                        return false;
                    }
                })
                .orElse(false);
    }


}