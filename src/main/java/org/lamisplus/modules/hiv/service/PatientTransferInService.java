package org.lamisplus.modules.hiv.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.hiv.domain.dto.PatientTransferInDTO;
import org.lamisplus.modules.hiv.domain.entity.PatientTransferIn;
import org.lamisplus.modules.hiv.repositories.PatientTransferInRepository;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.repository.PersonRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatientTransferInService {

    private final PatientTransferInRepository patientTransferInRepository;
    private final PersonRepository personRepository;
    private final CurrentUserOrganizationService currentUserOrganizationService;

    public PatientTransferInDTO createPatientTransferIn(PatientTransferInDTO transferInDTO) throws RecordExistException {
        try {
            log.info("Creating Patient Transfer-In record for person ID: {}", transferInDTO.getPersonId());

            Long personId = transferInDTO.getPersonId();
            Person person = getPerson(personId);
            Long orgId = currentUserOrganizationService.getCurrentUserOrganization();
            checkForExistingTransferIn(person, orgId);

            transferInDTO.setFacilityId(orgId);

            // Convert DTO to Entity and save
            PatientTransferIn transferIn = convertDTOToEntity(transferInDTO);
            transferIn.setUuid(UUID.randomUUID().toString());
            transferIn.setArchived(0);
            transferIn.setPersonUuid(person.getUuid());
            transferIn.setFacilityId(orgId);  // Set facilityId from parent class

            PatientTransferIn savedTransferIn = patientTransferInRepository.save(transferIn);
            transferInDTO.setId(savedTransferIn.getId());
            transferInDTO.setUuid(savedTransferIn.getUuid());

            log.info("Patient Transfer-In record saved successfully for person ID: {}", personId);
            return transferInDTO;

        } catch (RecordExistException e) {
            log.error("Record already exists: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error creating Patient Transfer-In record: {}", e.getMessage());
            throw new IllegalStateException("An error occurred while saving: " + e.getMessage());
        }
    }

    public PatientTransferInDTO updatePatientTransferIn(Long id, PatientTransferInDTO transferInDTO) {
        log.info("Updating Patient Transfer-In record with ID: {}", id);

        PatientTransferIn existingTransferIn = patientTransferInRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(PatientTransferIn.class, "id", String.valueOf(id)));

        // Update fields
        existingTransferIn.setPatientCameWithTransferForm(transferInDTO.getPatientCameWithTransferForm());
        existingTransferIn.setPatientAttendedFirstVisit(transferInDTO.getPatientAttendedFirstVisit());
        existingTransferIn.setReceivedDate(transferInDTO.getReceivedDate());
        existingTransferIn.setDateOfVisit(transferInDTO.getDateOfVisit());
        existingTransferIn.setClinicianName(transferInDTO.getClinicianName());
        existingTransferIn.setTelephoneNumber(transferInDTO.getTelephoneNumber());

        // Ensure person_uuid is populated
        if (existingTransferIn.getPersonUuid() == null && existingTransferIn.getPerson() != null) {
            existingTransferIn.setPersonUuid(existingTransferIn.getPerson().getUuid());
        }

        PatientTransferIn savedTransferIn = patientTransferInRepository.save(existingTransferIn);

        log.info("Patient Transfer-In record updated successfully with ID: {}", id);
        return convertEntityToDTO(savedTransferIn);
    }

    public PatientTransferInDTO getPatientTransferInById(Long id) {
        log.info("Fetching Patient Transfer-In record with ID: {}", id);

        PatientTransferIn transferIn = patientTransferInRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(PatientTransferIn.class, "id", String.valueOf(id)));

        return convertEntityToDTO(transferIn);
    }

    public PatientTransferInDTO getPatientTransferInByPersonId(Long personId) {
        log.info("Fetching Patient Transfer-In record for person ID: {}", personId);

        Person person = getPerson(personId);
        Long orgId = currentUserOrganizationService.getCurrentUserOrganization();

        PatientTransferIn transferIn = patientTransferInRepository
                .findByPersonAndFacilityIdAndArchived(person, orgId, 0)
                .orElseThrow(() -> new EntityNotFoundException(
                        PatientTransferIn.class,
                        "personId",
                        String.valueOf(personId)
                ));

        return convertEntityToDTO(transferIn);
    }

    public List<PatientTransferInDTO> getAllPatientTransferInsByFacility() {
        Long orgId = currentUserOrganizationService.getCurrentUserOrganization();
        log.info("Fetching all Patient Transfer-In records for facility ID: {}", orgId);

        List<PatientTransferIn> transferIns = patientTransferInRepository.findAllByFacilityIdAndArchived(orgId, 0);

        return transferIns.stream()
                .map(this::convertEntityToDTO)
                .collect(Collectors.toList());
    }

    public String deletePatientTransferIn(Long id) {
        log.info("Deleting Patient Transfer-In record with ID: {}", id);

        PatientTransferIn transferIn = patientTransferInRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(PatientTransferIn.class, "id", String.valueOf(id)));

        transferIn.setArchived(1);
        patientTransferInRepository.save(transferIn);

        log.info("Patient Transfer-In record deleted successfully with ID: {}", id);
        return "successfully";
    }

    public boolean hasExistingTransferIn(Long personId) {
        log.info("Checking if person ID: {} has an existing Transfer-In record", personId);
        Person person = getPerson(personId);

        boolean exists = patientTransferInRepository.existsByPersonAndArchived(person, 0);

        log.info("Transfer-In exists check for person ID {}: {}", personId, exists);
        return exists;
    }

    private void checkForExistingTransferIn(Person person, Long orgId) throws RecordExistException {
        boolean exists = patientTransferInRepository
                .findByPersonAndFacilityIdAndArchived(person, orgId, 0)
                .isPresent();

        if (exists) {
            throw new RecordExistException(
                    PatientTransferIn.class,
                    "Patient Transfer-In",
                    "This patient already has a Transfer-In acknowledgement record."
            );
        }
    }

    private PatientTransferIn convertDTOToEntity(PatientTransferInDTO dto) {
        return PatientTransferIn.builder()
                .personId(dto.getPersonId())
                .personUuid(dto.getPersonUuid())
                .patientCameWithTransferForm(dto.getPatientCameWithTransferForm())
                .patientAttendedFirstVisit(dto.getPatientAttendedFirstVisit())
                .receivedDate(dto.getReceivedDate())
                .dateOfVisit(dto.getDateOfVisit())
                .clinicianName(dto.getClinicianName())
                .telephoneNumber(dto.getTelephoneNumber())
                .build();
        // Note: facilityId is set in createPatientTransferIn method since it's inherited from HivAuditEntity
    }

    private PatientTransferInDTO convertEntityToDTO(PatientTransferIn entity) {
        return PatientTransferInDTO.builder()
                .id(entity.getId())
                .personId(entity.getPersonId())
                .personUuid(entity.getPersonUuid())
                .uuid(entity.getUuid())
                .archived(entity.getArchived())
                .patientCameWithTransferForm(entity.getPatientCameWithTransferForm())
                .patientAttendedFirstVisit(entity.getPatientAttendedFirstVisit())
                .receivedDate(entity.getReceivedDate())
                .dateOfVisit(entity.getDateOfVisit())
                .clinicianName(entity.getClinicianName())
                .telephoneNumber(entity.getTelephoneNumber())
                .facilityId(entity.getFacilityId())
                .createdDate(entity.getCreatedDate())
                .createdBy(entity.getCreatedBy())
                .lastModifiedDate(entity.getLastModifiedDate())
                .lastModifiedBy(entity.getLastModifiedBy())
                .build();
    }

    private Person getPerson(Long personId) {
        return personRepository.findById(personId)
                .orElseThrow(() -> new EntityNotFoundException(Person.class, "id", String.valueOf(personId)));
    }
}
