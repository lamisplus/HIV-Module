package org.lamisplus.modules.hiv.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.util.Log;
import org.jetbrains.annotations.NotNull;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.domain.dto.PageDTO;
import org.lamisplus.modules.base.domain.entities.ApplicationCodeSet;
import org.lamisplus.modules.base.domain.repositories.ApplicationCodesetRepository;
import org.lamisplus.modules.hiv.domain.dto.*;
import org.lamisplus.modules.hiv.domain.entity.ARTClinical;
import org.lamisplus.modules.hiv.domain.entity.Observation;
import org.lamisplus.modules.hiv.repositories.ARTClinicalRepository;
import org.lamisplus.modules.hiv.repositories.HivEnrollmentRepository;
import org.lamisplus.modules.hiv.repositories.ObservationRepository;
import org.lamisplus.modules.patient.domain.dto.PersonResponseDto;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.repository.PersonRepository;
import org.lamisplus.modules.patient.service.PersonService;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class HivPatientService {
    private final ARTClinicalRepository artClinicalRepository;

    private final ArtCommenceService commenceService;

    private final ArtClinicVisitService artClinicVisitService;

    private final HIVStatusTrackerService statusTrackerService;


    private final PersonService personService;

    private final PersonRepository personRepository;

    private final HivEnrollmentService hivEnrollmentService;

    private final ApplicationCodesetRepository applicationCodesetRepository;

    private final CurrentUserOrganizationService currentUserOrganizationService;

    private final ObservationRepository observationRepository;

    private final  PatientActivityService patientActivityService;
    
    private final  StatusManagementService statusManagementService;
    
    private  final HivEnrollmentRepository enrollmentRepository;

    public HivEnrollmentDTO registerAndEnrollHivPatient(HivPatientEnrollmentDto hivPatientEnrollmentDto) {
        HivEnrollmentDTO hivEnrollmentDto = hivPatientEnrollmentDto.getHivEnrollment ();
        Long personId = hivPatientEnrollmentDto.getPerson ().getId ();
        processAndSavePatient (hivPatientEnrollmentDto, hivEnrollmentDto, personId);
        hivEnrollmentDto.setFacilityId (currentUserOrganizationService.getCurrentUserOrganization ());
        return hivEnrollmentService.createHivEnrollment (hivEnrollmentDto);
    }


    private void processAndSavePatient(HivPatientEnrollmentDto hivPatientEnrollmentDto, HivEnrollmentDTO hivEnrollmentDto, Long personId) {
        if (personId == null) {
            PersonResponseDto person = personService.createPerson (hivPatientEnrollmentDto.getPerson ());
            hivEnrollmentDto.setPersonId (person.getId ());
        } else {
            hivEnrollmentDto.setPersonId (personId);
        }
    }

    public List<HivPatientDto> getHivCheckedInPatients() {
        return personService.getCheckedInPersonsByServiceCodeAndVisitId ("hiv-code")
                .stream ()
                .map (p -> convertPersonHivPatientDto (p.getId ()))
                .collect (Collectors.toList ());
    }


//    public List<HivPatientDto> getHivPatients() {
//        return personService.getAllPerson ()
//                .stream ()
//                .sorted (Comparator.comparing (PersonResponseDto::getId).reversed ())
//                .collect (Collectors.toList ());
//    }
    
    public PageDTO getHivPatientsPage(String searchValue, Pageable pageable) {
        Long facilityId = currentUserOrganizationService.getCurrentUserOrganization();
        if (searchValue != null && !searchValue.isEmpty()) {
            Page<Person> persons = personRepository.findAllPersonBySearchParameters(searchValue, 0, facilityId, pageable);
            Log.info("patient size {}", persons.getContent().size());
            List<HivPatientDto> content = getNonIitPersons(persons);
            return getPageDto(persons, content);
        }
        Page<Person> persons = personRepository.getAllByArchivedAndFacilityIdOrderByIdDesc(0, facilityId, pageable);
        List<HivPatientDto> content = getNonIitPersons(persons);
        return getPageDto(persons, content);
    }
    
    public PageDTO getHivPatients(String searchValue, Pageable pageable) {
        Long facilityId = currentUserOrganizationService.getCurrentUserOrganization();

//        if(!String.valueOf(searchValue).equals("null") && !searchValue.equals("*")){
//            searchValue = searchValue.replaceAll("\\s", "");
//            String queryParam = "%"+searchValue+"%";
        if (!((searchValue == null) || (searchValue.equals("*")))) {
            searchValue = searchValue.replaceAll("\\s", "");
            searchValue = searchValue.replaceAll(",", "");

            String queryParam = "%" + searchValue + "%";
            Page<PatientProjection> persons =
                    enrollmentRepository.getPatientsByFacilityBySearchParam(facilityId, queryParam, pageable);
            return getPageDTO(persons);
        }
        Page<PatientProjection> persons = enrollmentRepository.getPatientsByFacilityId(facilityId, pageable);
        return getPageDTO(persons);
    }
    
    
    public PageDTO getHivEnrolledPatients(String searchValue, Pageable pageable) {
        Long facilityId = currentUserOrganizationService.getCurrentUserOrganization();
        if(!String.valueOf(searchValue).equals("null") && !searchValue.equals("*")){
            searchValue = searchValue.replaceAll("\\s", "");
            String queryParam = "%"+searchValue+"%";
            Page<PatientProjection> persons =
                    enrollmentRepository.getEnrolledPatientsByFacilityBySearchParam(facilityId, queryParam, pageable);
            return getPageDTO(persons);
        }
        Page<PatientProjection> persons = enrollmentRepository.getEnrolledPatientsByFacility(facilityId, pageable);
        return getPageDTO(persons);
    }
    
    public  List<PatientDTO> getHivEnrolledNonBiometricPatients(Long facilityId) {
        List<PatientDTO> nonBiometricPatients  = new ArrayList<PatientDTO>();
        log.info("start fetching non biometric patients records ...");
        try {
            HashSet<String> negativeStatusTable = getNegativeStatusTable();
             nonBiometricPatients = enrollmentRepository.getEnrolledPatientsByFacilityMobile(facilityId)
                    .stream()
                    .map(this::getPatientDTOBuild)
                    .filter(p -> !(negativeStatusTable.contains(p.getCurrentStatus())))
                    .collect(Collectors.toList());
            log.info("finished fetching non-biometric Patients  total size {}", nonBiometricPatients.size());
        }catch(Exception e){
            log.error("An error occurred when fetching non-biometric patients error:=> {}", e.getMessage());
        }
        return nonBiometricPatients;
    }
    
    private static HashSet<String> getNegativeStatusTable() {
        HashSet<String> negativeStatus = new HashSet<String>();
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
    
    private  PatientDTO getPatientDTOBuild(PatientProjection p) {
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
                .build();
        patientDTO.setCommenced(p.getCommenced() != null);
        patientDTO.setBiometricStatus(p.getBiometricStatus() != null);
        if(p.getCommenced() != null && p.getCommenced()){
            String currentStatus = statusManagementService.getCurrentStatus(p.getId());
            patientDTO.setCurrentStatus(currentStatus);
        }else if(p.getIsEnrolled()){
            patientDTO.setCurrentStatus(p.getEnrollmentStatus());
        }else{
            patientDTO.setCurrentStatus("Not Enrolled");
        }
        List<Observation> clinicalEvaluationAndMentalHealth =
                observationRepository.getClinicalEvaluationAndMentalHealth(p.getPersonUuid());
        if(clinicalEvaluationAndMentalHealth.size() >= 2){
            patientDTO.setMentalHealth(true);
            patientDTO.setClinicalEvaluation(true);
        }
        if(clinicalEvaluationAndMentalHealth.size() == 1){
            String observationType = clinicalEvaluationAndMentalHealth.get(0).getType();
            if(observationType.equalsIgnoreCase("Mental health")){
                patientDTO.setMentalHealth(true);
            }
            
            if(observationType.equalsIgnoreCase("Clinical evaluation")){
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
    
    private  PageDTO getPageDto(Page<?> persons, List<?> content) {
       return PageDTO.builder()
                .pageNumber(persons.getNumber())
                .pageSize(persons.getSize())
                .totalPages(persons.getTotalPages())
                .totalRecords(persons.getTotalElements())
                .records(content)
                .build();
    }
    
    public  PageDTO  getIITHivPatients(String searchValue, Pageable pageable) {
        Long facilityId = currentUserOrganizationService.getCurrentUserOrganization();
        if(searchValue != null && !searchValue.isEmpty()) {
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
        return convertPersonHivPatientDto (personId);
    }


    private HivPatientDto convertPersonHivPatientDto(Long personId) {
        if (Boolean.TRUE.equals (personService.isPersonExist (personId))) {
            Person person = getPerson (personId);
            PersonResponseDto bioData = personService.getPersonById (personId);
            Optional<HivEnrollmentDTO> enrollment =
                    hivEnrollmentService.getHivEnrollmentByPersonIdAndArchived (bioData.getId ());
            Optional<ARTClinical> artCommencement =
                    artClinicalRepository.findByPersonAndIsCommencementIsTrueAndArchived (person, 0);
            HivPatientDto hivPatientDto = new HivPatientDto ();
            BeanUtils.copyProperties (bioData, hivPatientDto);
            hivPatientDto.setCreateBy(person.getCreatedBy());
            addEnrollmentInfo (enrollment, hivPatientDto);
            addArtCommencementInfo (person.getId (), artCommencement, hivPatientDto);
            processAndSetObservationStatus(person, hivPatientDto);
            return hivPatientDto;
        }
        return null;
    }


    private void addArtClinicalInfo(List<ARTClinical> artClinics, HivPatientDto hivPatientDto) {
        hivPatientDto.setArtClinicVisits (artClinics.stream ()
                        .filter(Objects::nonNull)
                        .map (artClinicVisitService::convertToClinicVisitDto).collect (Collectors.toList ()));
    }


    private void addArtCommencementInfo(Long personId, Optional<ARTClinical> artCommencement, HivPatientDto hivPatientDto) {
        if (artCommencement.isPresent ()) {
            hivPatientDto.setCommenced (true);
            ARTClinicalCommenceDto artClinicalCommenceDto =
                    commenceService.convertArtToResponseDto(artCommencement.get());
            hivPatientDto.setArtCommence(artClinicalCommenceDto);
            hivPatientDto.setCurrentStatus (statusManagementService.getCurrentStatus(personId));
        }
    }


    private void addEnrollmentInfo(Optional<HivEnrollmentDTO> enrollment, HivPatientDto hivPatientDto) {
        if (enrollment.isPresent ()) {
            hivPatientDto.setEnrolled (true);
            Long enrollStatus = enrollment.get ().getStatusAtRegistrationId ();
            if(enrollStatus !=  null){
                Optional<ApplicationCodeSet> status = applicationCodesetRepository.findById (enrollStatus);
                status.ifPresent(applicationCodeSet -> hivPatientDto.setCurrentStatus(applicationCodeSet.getDisplay()));
            }else {
                hivPatientDto.setCurrentStatus("Enrolled but status not known");
            }
            hivPatientDto.setEnrollment(enrollment.get());
        } else {
            hivPatientDto.setCurrentStatus ("Not Enrolled");
        }
    }

    public Person getPerson(Long personId) {
        return personRepository.findById (personId)
                .orElseThrow (() -> new EntityNotFoundException (Person.class, "id", String.valueOf (personId)));
    }

    private void processAndSetObservationStatus(Person person, HivPatientDto hivPatientDto) {
        Long orgId = currentUserOrganizationService.getCurrentUserOrganization ();
        List<Observation> observationList = observationRepository.getAllByPersonAndFacilityId (person, orgId);
        if (!observationList.isEmpty ()) {
            observationList
                    .stream ()
                    .filter (observation -> observation.getArchived () != 1)
                    .forEach (observation -> {
                if (observation.getType ().contains ("Clinical")) {
                    hivPatientDto.setClinicalEvaluation (true);
                }
                if (observation.getType ().contains ("Mental")) {
                    hivPatientDto.setMentalHealth (true);
                }
            });
        }
    }

    public List<PatientActivity> getHivPatientActivitiesById(Long id) {
        return   patientActivityService.getActivities(id);


    }
}
