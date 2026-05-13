package org.lamisplus.modules.hiv.repositories;

import org.lamisplus.modules.hiv.domain.dto.EnrollmentStatus;
import org.lamisplus.modules.hiv.domain.dto.OVCDomainDTO;
import org.lamisplus.modules.hiv.domain.dto.PatientProjection;
import org.lamisplus.modules.hiv.domain.entity.HivEnrollment;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface HivEnrollmentRepository extends JpaRepository<HivEnrollment, Long> {
    Optional<HivEnrollment> getHivEnrollmentByPersonAndArchived(Person person, Integer archived);

    List<HivEnrollment> getHivEnrollmentByFacilityIdAndArchived(Long facilityId, Integer archived);

    @Query(value = "SELECT " +
            "    p.id AS id, " +
            "    p.created_by AS createBy, " +
            "    p.date_of_registration AS dateOfRegistration, " +
            "    p.first_name AS firstName, " +
            "    p.surname AS surname, " +
            "    p.other_name AS otherName, " +
            "    p.hospital_number AS hospitalNumber, " +
            "    CAST(EXTRACT(YEAR FROM AGE(NOW(), p.date_of_birth)) AS INTEGER) AS age, " +
            "    INITCAP(p.sex) AS gender, " +
            "    p.date_of_birth AS dateOfBirth, " +
            "    p.is_date_of_birth_estimated AS isDobEstimated, " +
            "    p.facility_id AS facilityId, " +
            "    p.uuid AS personUuid, " +
            "    (SELECT EXISTS (SELECT 1 FROM hiv_initial_clinical_evaluation ice WHERE ice.person_uuid = p.uuid AND ice.archived = 0)) AS isEnrolled, " +
            "    (SELECT EXISTS (SELECT 1 FROM hiv_enrollment_commencement ec WHERE ec.person_uuid = p.uuid AND ec.archived = 0)) AS commenced, " +
            "    (SELECT EXISTS (SELECT 1 FROM hiv_initial_clinical_evaluation ice WHERE ice.person_uuid = p.uuid AND ice.archived = 0)) AS hasiceform, " +
            "    (SELECT EXISTS (SELECT 1 FROM hiv_enrollment_commencement ec WHERE ec.person_uuid = p.uuid AND ec.archived = 0)) AS hasenrollmentform, " +
            "    NULL AS targetGroupId, " +
            "    e.id AS enrollmentId, " +
            "    e.unique_id AS uniqueId, " +
            "    pc.display AS enrollmentStatus, " +
            "    b.biometric_type AS biometricStatus " +
            "FROM patient_person p " +
            "LEFT JOIN ( " +
            "    SELECT DISTINCT person_uuid, biometric_type FROM biometric WHERE archived = 0 " +
            ") b ON b.person_uuid = p.uuid " +
            "LEFT JOIN hiv_enrollment_commencement e ON p.uuid = e.person_uuid " +
            "LEFT JOIN base_application_codeset pc ON pc.id = e.status_at_registration_id " +
            "WHERE p.archived = 0 " +
            "    AND p.facility_id = ?1 " +
            "    AND NOT ( " +
            "        EXISTS (SELECT 1 FROM hiv_enrollment_commencement e2 WHERE e2.person_uuid = p.uuid AND e2.archived = 0) " +
            "        AND EXISTS (SELECT 1 FROM hiv_initial_clinical_evaluation ice2 WHERE ice2.person_uuid = p.uuid AND ice2.archived = 0) " +
            "    ) " +
            "    AND NOT EXISTS ( " +
            "        SELECT 1 FROM hts_client hc2 " +
            "        WHERE hc2.person_uuid = p.uuid AND hc2.hiv_test_result = 'Negative' AND hc2.archived = 0 " +
            "    ) " +
            "    AND NOT EXISTS (SELECT 1 FROM hiv_patient_transfer_in ti WHERE ti.person_uuid = p.uuid AND ti.archived = 0) " +
            "    AND ( " +
            "        p.hospital_number ILIKE ?2 " +
            "        OR p.first_name ILIKE ?2 " +
            "        OR p.surname ILIKE ?2 " +
            "        OR p.other_name ILIKE ?2 " +
            "    ) " +
            "ORDER BY p.id DESC",
            countQuery = "SELECT count(*) FROM patient_person p " +
                    "WHERE p.archived = 0 " +
                    "AND p.facility_id = ?1 " +
                    "AND NOT ( " +
                    "    EXISTS (SELECT 1 FROM hiv_enrollment_commencement e2 WHERE e2.person_uuid = p.uuid AND e2.archived = 0) " +
                    "    AND EXISTS (SELECT 1 FROM hiv_initial_clinical_evaluation ice2 WHERE ice2.person_uuid = p.uuid AND ice2.archived = 0) " +
                    ") " +
                    "AND NOT EXISTS ( " +
                    "    SELECT 1 FROM hts_client hc2 " +
                    "    WHERE hc2.person_uuid = p.uuid AND hc2.hiv_test_result = 'Negative' AND hc2.archived = 0 " +
                    ") " +
                    "AND NOT EXISTS (SELECT 1 FROM hiv_patient_transfer_in ti WHERE ti.person_uuid = p.uuid AND ti.archived = 0) " +
                    "AND (p.hospital_number ILIKE ?2 OR p.first_name ILIKE ?2 OR p.surname ILIKE ?2 OR p.other_name ILIKE ?2)",
            nativeQuery = true)
    Page<PatientProjection> getPatientsByFacilityBySearchParam(Long facilityId, String searchParam, Pageable page);


    @Query(value = "SELECT e.status_at_registration_id,e.date_enrolled_in_hiv_care " +
            "AS enrollmentDate, a.display AS hivEnrollmentStatus  " +
            "FROM hiv_enrollment_commencement e INNER JOIN base_application_codeset a " +
            "ON a.id = e.status_at_registration_id " +
            "WHERE person_uuid = ?1 AND e.archived = 0 " +
            "ORDER BY e.date_art_started DESC, e.id DESC LIMIT 1", nativeQuery = true)
    Optional<EnrollmentStatus> getHivEnrollmentStatusByPersonUuid(String uuid);

    @Query(value = "SELECT COUNT(*)\n" +
            "FROM patient_person p\n" +
            "WHERE p.archived = 0 \n" +
            "AND p.facility_id = ?1\n" +
            "AND NOT EXISTS (\n" +
            "    SELECT 1 FROM hiv_enrollment_commencement e WHERE e.person_uuid = p.uuid\n" +
            ")", nativeQuery = true)
    Long countPatientsByFacilityId(Long facilityId);



    @Query(value = "WITH filtered_patients AS ( " +
            "    SELECT p.uuid, p.id, p.created_by, p.date_of_registration, p.first_name, p.surname, p.other_name, p.hospital_number, " +
            "    p.date_of_birth, p.sex, p.is_date_of_birth_estimated, p.facility_id FROM patient_person p " +
            "    WHERE p.archived = 0 " +
            "    AND p.facility_id = ?1 " +
            "    AND NOT ( " +
            "        EXISTS (SELECT 1 FROM hiv_enrollment_commencement e WHERE e.person_uuid = p.uuid AND e.archived = 0) " +
            "        AND EXISTS (SELECT 1 FROM hiv_initial_clinical_evaluation ice WHERE ice.person_uuid = p.uuid AND ice.archived = 0) " +
            "    ) " +
            "    AND NOT EXISTS ( " +
            "        SELECT 1 FROM hts_client hc " +
            "        WHERE hc.person_uuid = p.uuid AND hc.hiv_test_result = 'Negative' AND hc.archived = 0 " +
            "    ) " +
            "    AND NOT EXISTS (SELECT 1 FROM hiv_patient_transfer_in ti WHERE ti.person_uuid = p.uuid AND ti.archived = 0) " +
            ") " +
            "SELECT " +
            "    fp.id AS id, " +
            "    fp.created_by AS createby, " +
            "    fp.date_of_registration AS dateofregistration, " +
            "    fp.first_name AS firstname, " +
            "    fp.surname AS surname, " +
            "    fp.other_name AS othername, " +
            "    fp.hospital_number AS hospitalnumber, " +
            "    CAST(EXTRACT(YEAR FROM AGE(NOW(), fp.date_of_birth)) AS INTEGER) AS age, " +
            "    INITCAP(fp.sex) AS gender, " +
            "    fp.date_of_birth AS dateofbirth, " +
            "    fp.is_date_of_birth_estimated AS isdobestimated, " +
            "    fp.facility_id AS facilityid, " +
            "    fp.uuid AS personuuid, " +
            "    (SELECT EXISTS (SELECT 1 FROM hiv_initial_clinical_evaluation ice WHERE ice.person_uuid = fp.uuid AND ice.archived = 0)) AS isEnrolled, " +
            "    (SELECT EXISTS (SELECT 1 FROM hiv_enrollment_commencement ec WHERE ec.person_uuid = fp.uuid AND ec.archived = 0)) AS commenced, " +
            "    b.biometric_type AS biometricstatus, " +
            "    (SELECT EXISTS (SELECT 1 FROM hiv_initial_clinical_evaluation ice WHERE ice.person_uuid = fp.uuid AND ice.archived = 0)) AS hasiceform, " +
            "    (SELECT EXISTS (SELECT 1 FROM hiv_enrollment_commencement ec WHERE ec.person_uuid = fp.uuid AND ec.archived = 0)) AS hasenrollmentform " +
            "FROM filtered_patients fp " +
            "LEFT JOIN ( " +
            "    SELECT DISTINCT person_uuid, biometric_type FROM biometric WHERE archived = 0 " +
            ") b ON b.person_uuid = fp.uuid " +
            "ORDER BY fp.id DESC " +
            "LIMIT ?2 OFFSET ?3",
            nativeQuery = true)
    List<PatientProjection> findPatientsByFacilityId(Long facilityId, int limit, int offset);

    @Query(value = "WITH enrolledART AS ( " +
            "SELECT DISTINCT ON (person_uuid) " +
            "    person_uuid, " +
            "    date_modified " +
            "FROM ( " +
            "    SELECT ec.person_uuid, ec.last_modified_date as date_modified " +
            "    FROM hiv_enrollment_commencement ec " +
            "    WHERE ec.archived = 0 " +
            "    UNION ALL " +
            "    SELECT ti.person_uuid, ti.last_modified_date as date_modified " +
            "    FROM hiv_patient_transfer_in ti " +
            "    WHERE ti.archived = 0 " +
            ") combined " +
            "ORDER BY person_uuid, date_modified DESC " +
            "), " +
            "enrolledPatient AS ( " +
            "SELECT DISTINCT ON (ec.person_uuid) " +
            "ec.id, ec.person_uuid, ec.unique_id, ec.status_at_registration_id, TRUE as commenced " +
            "FROM hiv_enrollment_commencement ec " +
            "WHERE archived = 0 " +
            "), " +
            "patientClient AS ( " +
            "SELECT p.id AS id, p.created_by as createBy, p.date_of_registration as dateOfRegistration, " +
            "p.first_name as firstName, p.surname AS surname, p.other_name AS otherName, p.hospital_number AS hospitalNumber, " +
            "CAST(EXTRACT(YEAR from AGE(NOW(), p.date_of_birth)) AS INTEGER) AS age, INITCAP(p.sex) AS gender, p.date_of_birth AS dateOfBirth, " +
            "p.is_date_of_birth_estimated AS isDobEstimated, p.facility_id as facilityId, p.uuid as personUuid " +
            "FROM patient_person p WHERE p.archived = 0 " +
            "), " +
            "biometric AS ( " +
            "SELECT DISTINCT person_uuid, biometric_type FROM biometric WHERE archived = 0 " +
            "), " +
            "transferInClient AS ( " +
            "SELECT DISTINCT ON (person_uuid) person_uuid FROM hiv_patient_transfer_in e WHERE e.archived = 0 " +
            ") " +
            "SELECT p.id, p.createBy, p.dateOfRegistration, p.firstName, p.surname, " +
            "p.otherName, p.hospitalNumber, p.age, p.gender, p.dateOfBirth, p.isDobEstimated, " +
            "p.facilityId, p.personUuid, CAST(CASE when pc.display is null then FALSE ELSE TRUE END AS Boolean) AS isEnrolled, enP.id as enrollmentId, " +
            "enP.unique_id as uniqueId, pc.display as enrollmentStatus, enP.commenced, b.biometric_type as biometricStatus " +
            "FROM enrolledART eArt " +
            "LEFT JOIN transferInClient tInC ON eArt.person_uuid = tInC.person_uuid " +
            "LEFT JOIN patientClient p ON p.personUuid = eArt.person_uuid " +
            "LEFT JOIN biometric b ON b.person_uuid = eArt.person_uuid " +
            "LEFT JOIN enrolledPatient enP ON enP.person_uuid = eArt.person_uuid " +
            "LEFT JOIN base_application_codeset pc on pc.id = enP.status_at_registration_id " +
            "WHERE p.facilityId = ?1 AND (p.firstName ilike ?2 OR p.surname ilike ?2 OR enP.unique_id ilike ?2 OR p.otherName ilike ?2 OR p.hospitalNumber ilike ?2)",
            countQuery = "SELECT COUNT(DISTINCT eArt.person_uuid) " +
                    "FROM ( " +
                    "    SELECT DISTINCT ON (person_uuid) person_uuid " +
                    "    FROM ( " +
                    "        SELECT ec.person_uuid FROM hiv_enrollment_commencement ec WHERE ec.archived = 0 " +
                    "        UNION ALL " +
                    "        SELECT ti.person_uuid FROM hiv_patient_transfer_in ti WHERE ti.archived = 0 " +
                    "    ) combined " +
                    "    ORDER BY person_uuid " +
                    ") eArt " +
                    "LEFT JOIN patient_person p ON p.uuid = eArt.person_uuid AND p.archived = 0 " +
                    "LEFT JOIN hiv_enrollment_commencement enP ON enP.person_uuid = eArt.person_uuid AND enP.archived = 0 " +
                    "WHERE p.facility_id = ?1 " +
                    "AND (p.first_name ilike ?2 OR p.surname ilike ?2 OR enP.unique_id ilike ?2 OR p.other_name ilike ?2 OR p.hospital_number ilike ?2)",
            nativeQuery = true)
    Page<PatientProjection> getEnrolledPatientsByFacilityBySearchParam(Long facilityId, String searchParam, Pageable page);

    @Query(value = "WITH enrolledART AS ( " +
            "SELECT DISTINCT ON (person_uuid) " +
            "    person_uuid, " +
            "    date_modified " +
            "FROM ( " +
            "    SELECT ec.person_uuid, ec.last_modified_date as date_modified " +
            "    FROM hiv_enrollment_commencement ec " +
            "    WHERE ec.archived = 0 " +
            "    UNION ALL " +
            "    SELECT ti.person_uuid, ti.last_modified_date as date_modified " +
            "    FROM hiv_patient_transfer_in ti " +
            "    WHERE ti.archived = 0 " +
            ") combined " +
            "ORDER BY person_uuid, date_modified DESC " +
            "), " +
            "enrolledPatient AS ( " +
            "SELECT DISTINCT ON (ec.person_uuid) " +
            "ec.id, ec.person_uuid, ec.unique_id, ec.status_at_registration_id, TRUE as commenced " +
            "FROM hiv_enrollment_commencement ec " +
            "WHERE archived = 0 " +
            "), " +
            "patientClient AS ( " +
            "SELECT p.id AS id, p.created_by as createBy, p.date_of_registration as dateOfRegistration, " +
            "p.first_name as firstName, p.surname AS surname, p.other_name AS otherName, p.hospital_number AS hospitalNumber, " +
            "CAST(EXTRACT(YEAR from AGE(NOW(), p.date_of_birth)) AS INTEGER) AS age, INITCAP(p.sex) AS gender, p.date_of_birth AS dateOfBirth, " +
            "p.is_date_of_birth_estimated AS isDobEstimated, p.facility_id as facilityId, p.uuid as personUuid " +
            "FROM patient_person p WHERE p.archived = 0 " +
            "), " +
            "biometric AS ( " +
            "SELECT DISTINCT person_uuid, biometric_type FROM biometric WHERE archived = 0 " +
            "), " +
            "transferInClient AS ( " +
            "SELECT DISTINCT ON (person_uuid) person_uuid FROM hiv_patient_transfer_in e WHERE e.archived = 0 " +
            ") " +
            "SELECT p.id, p.createBy, p.dateOfRegistration, p.firstName, p.surname, " +
            "p.otherName, p.hospitalNumber, p.age, p.gender, p.dateOfBirth, p.isDobEstimated, " +
            "p.facilityId, p.personUuid, CAST(CASE when pc.display is null then FALSE ELSE TRUE END AS Boolean) AS isEnrolled, enP.id as enrollmentId, " +
            "enP.unique_id as uniqueId, pc.display as enrollmentStatus, enP.commenced, b.biometric_type as biometricStatus " +
            "FROM enrolledART eArt " +
            "LEFT JOIN transferInClient tInC ON eArt.person_uuid = tInC.person_uuid " +
            "LEFT JOIN patientClient p ON p.personUuid = eArt.person_uuid " +
            "LEFT JOIN biometric b ON b.person_uuid = eArt.person_uuid " +
            "LEFT JOIN enrolledPatient enP ON enP.person_uuid = eArt.person_uuid " +
            "LEFT JOIN base_application_codeset pc on pc.id = enP.status_at_registration_id " +
            "WHERE p.facilityId = ?1",
            countQuery = "SELECT COUNT(DISTINCT person_uuid) " +
                    "FROM ( " +
                    "    SELECT ec.person_uuid " +
                    "    FROM hiv_enrollment_commencement ec " +
                    "    WHERE ec.archived = 0 AND ec.facility_id = ?1 " +
                    "    UNION ALL " +
                    "    SELECT ti.person_uuid " +
                    "    FROM hiv_patient_transfer_in ti " +
                    "    WHERE ti.archived = 0 AND ti.facility_id = ?1 " +
                    ") combined",
            nativeQuery = true)
    Page<PatientProjection> getEnrolledPatientsByFacility(Long facilityId, Pageable page);


    @Query(value = "SELECT p.id AS id,p.created_by as createBy, p.date_of_registration as dateOfRegistration, p.first_name as firstName, p.surname AS surname, \n" +
            "                         p.other_name AS otherName, \n" +
            "                        p.hospital_number AS hospitalNumber, CAST (EXTRACT(YEAR from AGE(NOW(), date_of_birth)) AS INTEGER) AS age, \n" +
            "                        INITCAP(p.sex) AS gender, p.date_of_birth AS dateOfBirth, p.is_date_of_birth_estimated AS isDobEstimated, \n" +
            "                        p.facility_id as facilityId , p.uuid as personUuid, \n" +
            "                        CAST(CASE when pc.display is null then FALSE ELSE TRUE END AS Boolean) AS isEnrolled, \n" +
            "                        e.target_group_id AS targetGroupId, e.id as enrollmentId, e.unique_id as uniqueId, pc.display as enrollmentStatus, \n" +
            "                        ca.commenced,  \n" +
            "                        b.biometric_type as biometricStatus \n" +
            "                        FROM patient_person p LEFT Join biometric b ON b.person_uuid = p.uuid " +
            "                        INNER JOIN hiv_enrollment e ON p.uuid = e.person_uuid\n" +
            "                        LEFT JOIN \n" +
            "                        (SELECT TRUE as commenced, hac.person_uuid FROM hiv_art_clinical hac WHERE hac.archived=0 AND hac.is_commencement is true \n" +
            "                        GROUP BY hac.person_uuid)ca ON p.uuid = ca.person_uuid \n" +
            "                        LEFT JOIN base_application_codeset pc on pc.id = e.status_at_registration_id \n" +
            "                        WHERE p.archived=1 " +
            "                       AND  b.biometric_type IS NULL \n" +
            "                       AND p.facility_id= ?1 \n" +
            "                        GROUP BY e.id, e.target_group_id,ca.commenced, p.id, p.first_name, \n" +
            "                        p.first_name, b.biometric_type, pc.display,p.surname, p.other_name, p.hospital_number, p.date_of_birth \n" +
            "                        ORDER BY p.id DESC",
            nativeQuery = true)
    List<PatientProjection> getEnrolledPatientsByFacilityMobile(Long facilityId);


    @Query(value = "SELECT id, name  from domain", nativeQuery = true)
    List<OVCDomainDTO> getOVCDomains();

    @Query(value = "SELECT name from ovc_service where domain_id =?1", nativeQuery = true)
    List<String> getOVCServiceByDomainId(Long domainId);

    Optional<HivEnrollment> findByUuid(String uuid);

    Optional<HivEnrollment> findByUniqueIdAndArchivedAndPersonUuidNot(String uniqueId, Integer archived, String personUuid);

    Optional<HivEnrollment> findByUniqueIdAndArchived(String uniqueId, Integer archived);
}
