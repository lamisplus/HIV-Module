package org.lamisplus.modules.hiv.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.jetbrains.annotations.NotNull;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.domain.dto.PageDTO;
import org.lamisplus.modules.base.domain.entities.ApplicationCodeSet;
import org.lamisplus.modules.base.domain.repositories.ApplicationCodesetRepository;
import org.lamisplus.modules.hiv.domain.dto.*;
import org.lamisplus.modules.hiv.domain.dto.enrollmentcommencement.CommencementDto;
import org.lamisplus.modules.hiv.domain.dto.enrollmentcommencement.EnrollmentCommencementRequestDto;
import org.lamisplus.modules.hiv.domain.dto.enrollmentcommencement.RegistrationDto;
import org.lamisplus.modules.hiv.domain.dto.enrollmentcommencement.TbPreventiveTherapyDto;
import org.lamisplus.modules.hiv.domain.dto.initialclinicalevaluation.InitialClinicalEvaluationDTO;
import org.lamisplus.modules.hiv.domain.entity.ARTClinical;
import org.lamisplus.modules.hiv.domain.entity.EnrollmentCommencement;
import org.lamisplus.modules.hiv.domain.entity.InitialClinicalEvaluation;
import org.lamisplus.modules.hiv.domain.entity.Observation;
import org.lamisplus.modules.hiv.domain.entity.PatientTransferIn;
import org.lamisplus.modules.hiv.repositories.ARTClinicalRepository;
import org.lamisplus.modules.hiv.repositories.EnrollmentCommencementRepository;
import org.lamisplus.modules.hiv.repositories.HivEnrollmentRepository;
import org.lamisplus.modules.hiv.repositories.InitialClinicalEvaluationRepository;
import org.lamisplus.modules.hiv.repositories.ObservationRepository;
import org.lamisplus.modules.hiv.repositories.PatientFlagRepository;
import org.lamisplus.modules.hiv.repositories.PatientTransferInRepository;
import org.lamisplus.modules.patient.domain.dto.PersonResponseDto;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.repository.PersonRepository;
import org.lamisplus.modules.patient.service.PersonService;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

import org.lamisplus.modules.hiv.utility.Constants;

@Service
@RequiredArgsConstructor
@Slf4j
public class HivPatientService {
    private final ARTClinicalRepository artClinicalRepository;

    private final ArtCommenceService commenceService;

    private final PersonService personService;

    private final PersonRepository personRepository;

    private final HivEnrollmentService hivEnrollmentService;

    private final ApplicationCodesetRepository applicationCodesetRepository;

    private final CurrentUserOrganizationService currentUserOrganizationService;

    private final ObservationRepository observationRepository;

    private final PatientActivityService patientActivityService;

    private final StatusManagementService statusManagementService;

    private final HivEnrollmentRepository enrollmentRepository;

    private final PatientFlagRepository patientFlagRepository;

    private final InitialClinicalEvaluationRepository initialClinicalEvaluationRepository;

    private final EnrollmentCommencementRepository enrollmentCommencementRepository;

    private final InitialClinicalEvaluationService initialClinicalEvaluationService;

    private final PatientTransferInRepository patientTransferInRepository;

    private final PatientTransferInService patientTransferInService;


    public HivEnrollmentDTO registerAndEnrollHivPatient(HivPatientEnrollmentDto hivPatientEnrollmentDto) {
        HivEnrollmentDTO hivEnrollmentDto = hivPatientEnrollmentDto.getHivEnrollment();
        Long personId = hivPatientEnrollmentDto.getPerson().getId();
        processAndSavePatient(hivPatientEnrollmentDto, hivEnrollmentDto, personId);
        hivEnrollmentDto.setFacilityId(currentUserOrganizationService.getCurrentUserOrganization());
        return hivEnrollmentService.createHivEnrollment(hivEnrollmentDto);
    }


    private void processAndSavePatient(HivPatientEnrollmentDto hivPatientEnrollmentDto, HivEnrollmentDTO hivEnrollmentDto, Long personId) {
        if (personId == null) {
            PersonResponseDto person = personService.createPerson(hivPatientEnrollmentDto.getPerson());
            hivEnrollmentDto.setPersonId(person.getId());
        } else {
            hivEnrollmentDto.setPersonId(personId);
        }
    }

    public List<HivPatientDto> getHivCheckedInPatients() {
        return personService.getCheckedInPersonsByServiceCodeAndVisitId("hiv-code")
                .stream()
                .map(p -> convertPersonHivPatientDto(p.getId()))
                .collect(Collectors.toList());
    }

    public PageDTO getHivPatientsPage(String searchValue, Pageable pageable) {
        Long facilityId = currentUserOrganizationService.getCurrentUserOrganization();
        if (searchValue != null && !searchValue.isEmpty()) {
            Page<Person> persons = personRepository.findAllPersonBySearchParameters(searchValue, 0, facilityId, pageable);
            List<HivPatientDto> content = getNonIitPersons(persons);
            return getPageDto(persons, content);
        }
        Page<Person> persons = personRepository.getAllByArchivedAndFacilityIdOrderByIdDesc(0, facilityId, pageable);
        List<HivPatientDto> content = getNonIitPersons(persons);
        return getPageDto(persons, content);
    }

    public PageDTO getHivPatients(String searchValue, Pageable pageable) {
        Long facilityId = currentUserOrganizationService.getCurrentUserOrganization();
        Page<PatientProjection> persons;

        if (searchValue != null && !StringUtils.isBlank(searchValue) && !searchValue.equalsIgnoreCase("null")) {
            String queryParam = "%" + searchValue.replaceAll("\\s", "").replace(",", "") + "%";
            persons = getPatientsByFacilityBySearchParam(facilityId, queryParam, pageable);
        } else {
            List<PatientProjection> content = enrollmentRepository.findPatientsByFacilityId(
                    facilityId,
                    pageable.getPageSize(),
                    (int) pageable.getOffset()
            );
            Long total = enrollmentRepository.countPatientsByFacilityId(facilityId); // Using the new method
            persons = new PageImpl<>(content, pageable, total);
        }
        return getPageDTO(persons);
    }

    private Page<PatientProjection> getPatientsByFacilityBySearchParam(Long facilityId, String searchParam, Pageable pageable) {
        return enrollmentRepository.getPatientsByFacilityBySearchParam(
                facilityId,
                searchParam,
                pageable
        );
    }

    public PageDTO getHivEnrolledPatients(String searchValue, Pageable pageable) {
        Long facilityId = currentUserOrganizationService.getCurrentUserOrganization();
        if (!String.valueOf(searchValue).equals("null") && !searchValue.equals("*")) {
            searchValue = searchValue.replaceAll("\\s", "");
            String queryParam = "%" + searchValue + "%";
            Page<PatientProjection> persons =
                    enrollmentRepository.getEnrolledPatientsByFacilityBySearchParam(facilityId, queryParam, pageable);
            return getPageDTO(persons);
        }
        Page<PatientProjection> persons = enrollmentRepository.getEnrolledPatientsByFacility(facilityId, pageable);
        return getPageDTO(persons);
    }

    public List<PatientDTO> getHivEnrolledNonBiometricPatients(Long facilityId) {
        List<PatientDTO> nonBiometricPatients = new ArrayList<>();
        try {
            HashSet<String> negativeStatusTable = getNegativeStatusTable();
            nonBiometricPatients = enrollmentRepository.getEnrolledPatientsByFacilityMobile(facilityId)
                    .stream()
                    .map(this::getPatientDTOBuild)
                    .filter(p -> !(negativeStatusTable.contains(p.getCurrentStatus())))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("An error occurred when fetching non-biometric patients error:=> {}", e.getMessage());
        }
        return nonBiometricPatients;
    }

    private static HashSet<String> getNegativeStatusTable() {
        HashSet<String> negativeStatus = new HashSet<>();
        negativeStatus.add("DIED");
        negativeStatus.add("ART TRANSFER OUT");
        negativeStatus.add("ART Transfer Out");
        negativeStatus.add("STOPPED TREATMENT");
        negativeStatus.add("Stopped Treatment");
        negativeStatus.add("IIT");
        return negativeStatus;
    }

    private PageDTO getPageDTO(Page<PatientProjection> persons) {
        List<PatientDTO> patientDTOList = persons.getContent()
                .stream()
                .map(this::getPatientDTOBuild)
                .collect(Collectors.toList());
        return getPageDto(persons, patientDTOList);
    }

    private PatientDTO getPatientDTOBuild(PatientProjection p) {
        PatientDTO patientDTO = PatientDTO.builder()
                .age(p.getAge())
                .dateOfBirth(p.getDateOfBirth())
                .sex(p.getGender())
                .enrollmentId(p.getEnrollmentId())
                .hospitalNumber(p.getHospitalNumber())
                .firstName(p.getFirstName())
                .facilityId(p.getFacility())
                .personUuid(p.getPersonUuid())
                .targetGroupId(p.getTargetGroupId())
                .otherName(p.getOtherName())
                .surname(p.getSurname())
                .id(p.getId())
                .isDobEstimated(p.getIsDobEstimated())
                .isEnrolled(p.getIsEnrolled())
                .createBy(p.getCreateBy())
                .uniqueId(p.getUniqueId())
                .dateOfRegistration(p.getDateOfRegistration())
                .hasiceform(p.getHasiceform())
                .hasenrollmentform(p.getHasenrollmentform())
                .hivTestResult(enrollmentCommencementRepository.getLatestHivTestResultByPersonUuid(p.getPersonUuid()))
                .hasTransferIn(patientTransferInService.hasExistingTransferInByPersonUuid(p.getPersonUuid()))
//                .currentStatus(p.getStatus())
                .build();
//        patientDTO.setCommenced(p.getCommenced() != null);
        patientDTO.setCommenced(Boolean.TRUE.equals(p.getCommenced()));
        patientDTO.setBiometricStatus(p.getBiometricStatus() != null);
        List<Observation> clinicalEvaluationAndMentalHealth =
                observationRepository.getClinicalEvaluationAndMentalHealth(p.getPersonUuid());
        if (clinicalEvaluationAndMentalHealth.size() >= 2) {
            patientDTO.setMentalHealth(true);
            patientDTO.setClinicalEvaluation(true);
        }
        if (clinicalEvaluationAndMentalHealth.size() == 1) {
            String observationType = clinicalEvaluationAndMentalHealth.get(0).getType();
            if (observationType.equalsIgnoreCase("Mental health")) {
                patientDTO.setMentalHealth(true);
            }

            if (observationType.equalsIgnoreCase("Clinical evaluation")) {
                patientDTO.setClinicalEvaluation(true);
            }
        }
        return patientDTO;
    }


    @NotNull
    private List<HivPatientDto> getNonIitPersons(Page<Person> persons) {
        return persons.getContent()
                .stream()
                .filter(Objects::nonNull)
                .map(p -> personService.getPersonById(p.getId()))
                .filter(Objects::nonNull)
                .map(person -> convertPersonHivPatientDto(person.getId()))
                .collect(Collectors.toList());
    }

    private PageDTO getPageDto(Page<?> persons, List<?> content) {
        return PageDTO.builder()
                .pageNumber(persons.getNumber())
                .pageSize(persons.getSize())
                .totalPages(persons.getTotalPages())
                .totalRecords(persons.getTotalElements())
                .records(content)
                .build();
    }

    public PageDTO getIITHivPatients(String searchValue, Pageable pageable) {
        Long facilityId = currentUserOrganizationService.getCurrentUserOrganization();
        if (searchValue != null && !searchValue.isEmpty()) {
            Page<Person> persons = personRepository.findAllPersonBySearchParameters(searchValue, 0, facilityId, pageable);
            List<HivPatientDto> content = getPersonIit(persons);
            return PageDTO.builder()
                    .pageNumber(persons.getNumber())
                    .pageSize(persons.getSize())
                    .totalPages(persons.getTotalPages())
                    .totalRecords(persons.getTotalElements())
                    .records(content)
                    .build();
        }
        Page<Person> persons = personRepository.getAllByArchivedAndFacilityIdOrderByIdDesc(0, facilityId, pageable);
        List<HivPatientDto> content = getPersonIit(persons);
        return PageDTO.builder()
                .pageNumber(persons.getNumber())
                .pageSize(persons.getSize())
                .totalPages(persons.getTotalPages())
                .totalRecords(persons.getTotalElements())
                .records(content)
                .build();

    }

    @NotNull
    private List<HivPatientDto> getPersonIit(Page<Person> persons) {
        return persons.getContent()
                .stream()
                .filter(Objects::nonNull)
                .map(p -> personService.getPersonById(p.getId()))
                .filter(Objects::nonNull)
                .map(person -> convertPersonHivPatientDto(person.getId()))
                .filter(Objects::nonNull)
                .filter(p -> p.getCurrentStatus().equals("IIT"))
                .collect(Collectors.toList());
    }

    public HivPatientDto getHivPatientById(Long personId) {
        return convertPersonHivPatientDto(personId);
    }


    private HivPatientDto convertPersonHivPatientDto(Long personId) {
        if (Boolean.TRUE.equals(personService.isPersonExist(personId))) {
            Person person = getPerson(personId);
            PersonResponseDto bioData = personService.getPersonById(personId);
            // Using new table: hiv_initial_clinical_evaluation (replaces hiv_enrollment)
            Optional<InitialClinicalEvaluation> initialClinicalEvaluation =
                    initialClinicalEvaluationRepository.findByPersonAndArchived(person, 0);
            // Using new table: hiv_enrollment_commencement (replaces hiv_art_clinical)
            Optional<EnrollmentCommencement> enrollmentCommencement =
                    enrollmentCommencementRepository.findByPersonAndArchived(person, 0);
            // Fetch Transfer-In data
            Optional<PatientTransferIn> transferIn =
                    patientTransferInRepository.findByPersonAndArchived(person, 0);
            HivPatientDto hivPatientDto = new HivPatientDto();
            BeanUtils.copyProperties(bioData, hivPatientDto);
            hivPatientDto.setCreateBy(person.getCreatedBy());
            addInitialClinicalEvaluationInfo(initialClinicalEvaluation, hivPatientDto);
            addEnrollmentCommencementInfo(person.getId(), enrollmentCommencement, hivPatientDto);
            addTransferInInfo(transferIn, hivPatientDto);
            processAndSetObservationStatus(person, hivPatientDto);
            return hivPatientDto;
        }
        return null;
    }

    private void addEnrollmentCommencementInfo(Long personId, Optional<EnrollmentCommencement> enrollmentCommencement, HivPatientDto hivPatientDto) {
        if (enrollmentCommencement.isPresent()) {
            hivPatientDto.setCommenced(true);
            hivPatientDto.setHasenrollmentform(true);
            EnrollmentCommencement ec = enrollmentCommencement.get();
            // Enrollment Commencement represents ART Start status
            Long statusAtRegistrationId = ec.getStatusAtRegistrationId();
            if (statusAtRegistrationId != null) {
                Optional<ApplicationCodeSet> status = applicationCodesetRepository.findById(statusAtRegistrationId);
                status.ifPresent(applicationCodeSet -> hivPatientDto.setCurrentStatus(applicationCodeSet.getDisplay()));
            } else {
                hivPatientDto.setCurrentStatus(statusManagementService.getCurrentStatus(personId));
            }
            // Convert entity to DTO
            try {
                EnrollmentCommencementRequestDto ecDto = convertEnrollmentCommencementToDto(ec);
                hivPatientDto.setEnrollmentCommencement(ecDto);
            } catch (Exception e) {
                log.warn("Could not convert Enrollment Commencement to DTO for person ID: {}", personId, e);
            }
        }
    }


    private void addInitialClinicalEvaluationInfo(Optional<InitialClinicalEvaluation> initialClinicalEvaluation, HivPatientDto hivPatientDto) {
        if (initialClinicalEvaluation.isPresent()) {
            hivPatientDto.setEnrolled(true);
            hivPatientDto.setHasiceform(true);
            InitialClinicalEvaluation ice = initialClinicalEvaluation.get();
            // Initial Clinical Evaluation represents Pre-ART status
            if (ice.isTransferIn()) {
                hivPatientDto.setCurrentStatus("Pre-ART Transfer In");
            } else {
                hivPatientDto.setCurrentStatus("HIV+ NON ART");
            }
            // Convert entity to DTO using the service's converter method
            try {
                InitialClinicalEvaluationDTO iceDto = initialClinicalEvaluationService.getInitialClinicalEvaluationById(ice.getId());
                hivPatientDto.setInitialClinicalEvaluation(iceDto);
            } catch (Exception e) {
                log.warn("Could not convert Initial Clinical Evaluation to DTO for person ID: {}", ice.getPersonId(), e);
            }
        } else {
            hivPatientDto.setCurrentStatus("Not Enrolled");
        }
    }

    private void addTransferInInfo(Optional<PatientTransferIn> transferIn, HivPatientDto hivPatientDto) {
        if (transferIn.isPresent()) {
            PatientTransferIn ti = transferIn.get();
            // Convert entity to DTO using the service's converter method
            try {
                PatientTransferInDTO tiDto = patientTransferInService.getPatientTransferInById(ti.getId());
                hivPatientDto.setTransferIn(tiDto);
            } catch (Exception e) {
                log.warn("Could not convert Transfer-In to DTO for person ID: {}", ti.getPersonId(), e);
            }
        }
    }

    public Person getPerson(Long personId) {
        return personRepository.findById(personId)
                .orElseThrow(() -> new EntityNotFoundException(Person.class, "id", String.valueOf(personId)));
    }

    private void processAndSetObservationStatus(Person person, HivPatientDto hivPatientDto) {
        Long orgId = currentUserOrganizationService.getCurrentUserOrganization();
        List<Observation> observationList = observationRepository.getAllByPersonAndFacilityIdAndArchived(person, orgId, Constants.UNARCHIVED);
        if (!observationList.isEmpty()) {
            observationList
                    .stream()
                    .filter(observation -> observation.getArchived() != 1)
                    .forEach(observation -> {
                        if (observation.getType().contains("Clinical")) {
                            hivPatientDto.setClinicalEvaluation(true);
                        }
                        if (observation.getType().contains("Mental")) {
                            hivPatientDto.setMentalHealth(true);
                        }
                    });
        }
    }

    public List<PatientActivity> getHivPatientActivitiesById(Long id) {
        return patientActivityService.getActivities(id);
    }

    public FlagPatientDto getPatientMeta(Long personId) {
        Long personIdd = personRepository.findById(personId).orElseThrow(() -> new RuntimeException("Person not found")).getId();
        Long facilityId = currentUserOrganizationService.getCurrentUserOrganization();
        Optional<Integer> patientFlagsParams = patientFlagRepository.getPatientFlagsParameter(facilityId);
        Integer suppressionValue = patientFlagsParams.orElse(null);
        return artClinicalRepository.getPatientMetaData(personIdd, facilityId, suppressionValue);
    }

    /**
     * Converts EnrollmentCommencement entity to EnrollmentCommencementRequestDto
     */
    private EnrollmentCommencementRequestDto convertEnrollmentCommencementToDto(EnrollmentCommencement ec) {
        EnrollmentCommencementRequestDto dto = new EnrollmentCommencementRequestDto();
        // Set basic fields
        dto.setPersonId(ec.getPerson() != null ? ec.getPerson().getId() : null);
        dto.setDateOfObservation(ec.getVisitDate() != null ? ec.getVisitDate().toString() : null);
        dto.setType("enrollment_commencement");

        // Create data object
        EnrollmentCommencementRequestDto.EnrollmentCommencementData data =
                new EnrollmentCommencementRequestDto.EnrollmentCommencementData();
        // Set registration data
        RegistrationDto registration = new RegistrationDto();
        registration.setUniqueId(ec.getUniqueId());
        registration.setStatusAtRegistrationId(ec.getStatusAtRegistrationId());
        registration.setDateEnrolledInHivCare(ec.getDateEnrolledInHivCare() != null ? ec.getDateEnrolledInHivCare().toString() : null);
        registration.setDateConfirmedHivTest(ec.getDateConfirmedHivTest() != null ? ec.getDateConfirmedHivTest().toString() : null);
        registration.setHivTestLocation(ec.getHivTestLocation());
        registration.setModeOfHivTest(ec.getModeOfHivTestId());
        registration.setCareEntryPoint(ec.getCareEntryPointId());
        registration.setCareEntryPointOther(ec.getCareEntryPointOther());
        registration.setMotherUniqueId(ec.getMotherUniqueId());
        registration.setPriorArt(ec.getPriorArtId());
        registration.setIsKp(ec.getIsKp() != null && ec.getIsKp() ? "Yes" : "No");
        registration.setKpTypology(ec.getKpTypologyId());
        registration.setDateTransferredIn(ec.getDateTransferredIn() != null ? ec.getDateTransferredIn().toString() : null);
        registration.setFacilityTransferredFrom(ec.getFacilityTransferredFrom());
        data.setRegistration(registration);

        // Set commencement data
        CommencementDto commencement = new CommencementDto();
        commencement.setVisitDate(ec.getVisitDate() != null ? ec.getVisitDate().toString() : null);
        commencement.setClinicalStageAtArtStart(ec.getClinicalStageId());
        commencement.setCd4AtArtStart(ec.getCd4AtArtStart() != null ? ec.getCd4AtArtStart().toString() : null);
        commencement.setCd4Percentage(ec.getCd4Percentage() != null ? ec.getCd4Percentage().toString() : null);
        commencement.setCd4Lf(ec.getCd4LfId());
        commencement.setDateAdherenceCounselingCompleted(ec.getDateAdherenceCounselingCompleted() != null ?
                ec.getDateAdherenceCounselingCompleted().toString() : null);
        commencement.setDateArtStarted(ec.getDateArtStarted() != null ? ec.getDateArtStarted().toString() : null);
        commencement.setRegimenLineId(ec.getRegimenLineId());
        commencement.setFirstArtRegimen(ec.getRegimenId());
        commencement.setWeightKg(ec.getWeightKg() != null ? ec.getWeightKg().toString() : null);
        commencement.setHeightCm(ec.getHeightCm() != null ? ec.getHeightCm().toString() : null);
        commencement.setBmi(ec.getBmi() != null ? ec.getBmi().toString() : null);
        commencement.setMuac(ec.getMuac() != null ? ec.getMuac().toString() : null);
        commencement.setMuacIndication(ec.getMuacIndication());
        commencement.setIsPregnant(ec.getIsPregnant() != null && ec.getIsPregnant() ? "Yes" : "No");
        commencement.setPregnancyStatus(ec.getPregnancyStatus());

        // Set TPT data if available
        if (ec.getTptMedication() != null || ec.getTptStartDate() != null) {
            TbPreventiveTherapyDto tpt = new TbPreventiveTherapyDto();
            tpt.setMedication(ec.getTptMedication());
            tpt.setDose(ec.getTptDose());
            tpt.setStartDate(ec.getTptStartDate() != null ? ec.getTptStartDate().toString() : null);
            tpt.setTptCompleted(ec.getTptCompleted());
            tpt.setCompletionDate(ec.getTptCompletionDate() != null ? ec.getTptCompletionDate().toString() : null);
            commencement.setTbPreventiveTherapy(tpt);
        }

        data.setCommencement(commencement);
        dto.setData(data);

        return dto;
    }

}
