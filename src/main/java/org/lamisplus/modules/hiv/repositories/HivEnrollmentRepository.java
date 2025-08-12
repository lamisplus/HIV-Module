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

    @Query(value = "SELECT e.status_at_registration_id,e.date_of_registration " +
            "AS enrollmentDate, a.display AS hivEnrollmentStatus  " +
            "FROM hiv_enrollment  e INNER JOIN base_application_codeset a " +
            "ON a.id = e.status_at_registration_id " +
            "WHERE person_uuid = ?1 ", nativeQuery = true)
    Optional<EnrollmentStatus> getHivEnrollmentStatusByPersonUuid(String uuid);

    @Query(value = "WITH filtered_patients AS (\n" +
            "    SELECT p.* FROM patient_person p\n" +
            "    WHERE p.archived = 0 \n" +
            "    AND p.facility_id = ?1\n" +
            "    AND NOT EXISTS (\n" +
            "        SELECT 1 FROM hiv_enrollment e WHERE e.person_uuid = p.uuid\n" +
            "    )\n" +
            ")\n" +
            "SELECT \n" +
            "    fp.id AS id,\n" +
            "    fp.created_by as createBy,\n" +
            "    fp.date_of_registration as dateOfRegistration,\n" +
            "    fp.first_name as firstName,\n" +
            "    fp.surname AS surname,\n" +
            "    fp.other_name AS otherName,\n" +
            "    fp.hospital_number AS hospitalNumber,\n" +
            "    CAST(EXTRACT(YEAR from AGE(NOW(), fp.date_of_birth)) AS INTEGER) AS age,\n" +
            "    INITCAP(fp.sex) AS gender,\n" +
            "    fp.date_of_birth AS dateOfBirth,\n" +
            "    fp.is_date_of_birth_estimated AS isDobEstimated,\n" +
            "    fp.facility_id as facilityId,\n" +
            "    fp.uuid as personUuid,\n" +
            "    false AS isEnrolled,\n" +
            "    NULL AS targetGroupId,\n" +
            "    NULL as enrollmentId,\n" +
            "    NULL as uniqueId,\n" +
            "    NULL as enrollmentStatus,\n" +
            "    COALESCE(ca.commenced, false) as commenced,\n" +
            "    b.biometric_type as biometricStatus\n" +
            "FROM filtered_patients fp\n" +
            "LEFT JOIN biometric b ON b.person_uuid = fp.uuid\n" +
            "LEFT JOIN (\n" +
            "    SELECT DISTINCT true as commenced, person_uuid\n" +
            "    FROM hiv_art_clinical\n" +
            "    WHERE archived = 0 AND is_commencement = true\n" +
            ") ca ON fp.uuid = ca.person_uuid\n" +
            "ORDER BY fp.id DESC\n" +
            "LIMIT ?2 OFFSET ?3",
            nativeQuery = true)
    List<PatientProjection> findPatientsByFacilityId(Long facilityId, int limit, int offset);

    @Query(value = "SELECT COUNT(*)\n" +
            "FROM patient_person p\n" +
            "WHERE p.archived = 0 \n" +
            "AND p.facility_id = ?1\n" +
            "AND NOT EXISTS (\n" +
            "    SELECT 1 FROM hiv_enrollment e WHERE e.person_uuid = p.uuid\n" +
            ")", nativeQuery = true)
    Long countPatientsByFacilityId(Long facilityId);

    @Query(value = "SELECT \n" +
            "    p.id AS id,\n" +
            "    p.created_by AS createBy,\n" +
            "    p.date_of_registration AS dateOfRegistration,\n" +
            "    p.first_name AS firstName,\n" +
            "    p.surname AS surname,\n" +
            "    p.other_name AS otherName,\n" +
            "    p.hospital_number AS hospitalNumber,\n" +
            "    CAST(EXTRACT(YEAR FROM AGE(NOW(), p.date_of_birth)) AS INTEGER) AS age,\n" +
            "    INITCAP(p.sex) AS gender,\n" +
            "    p.date_of_birth AS dateOfBirth,\n" +
            "    p.is_date_of_birth_estimated AS isDobEstimated,\n" +
            "    p.facility_id AS facilityId,\n" +
            "    p.uuid AS personUuid,\n" +
            "    CAST(CASE WHEN e.id IS NULL THEN FALSE ELSE TRUE END AS BOOLEAN) AS isEnrolled,\n" +
            "    e.target_group_id AS targetGroupId,\n" +
            "    e.id AS enrollmentId,\n" +
            "    e.unique_id AS uniqueId,\n" +
            "    pc.display AS enrollmentStatus,\n" +
            "    ca.commenced,\n" +
            "    b.biometric_type AS biometricStatus\n" +
            "FROM patient_person p\n" +
            "LEFT JOIN biometric b ON b.person_uuid = p.uuid\n" +
            "LEFT JOIN hiv_enrollment e ON p.uuid = e.person_uuid\n" +
            "LEFT JOIN (\n" +
            "    SELECT TRUE AS commenced, hac.person_uuid\n" +
            "    FROM hiv_art_clinical hac\n" +
            "    WHERE hac.archived = 0 AND hac.is_commencement IS TRUE\n" +
            "    GROUP BY hac.person_uuid\n" +
            ") ca ON p.uuid = ca.person_uuid\n" +
            "LEFT JOIN base_application_codeset pc ON pc.id = e.status_at_registration_id\n" +
            "WHERE p.archived = 0\n" +
            "    AND p.facility_id = ?1\n" +
            "    AND e.id IS NULL\n" +
            "    AND (\n" +
            "\t\tp.hospital_number ILIKE ?2\n" +
            "        OR p.first_name ILIKE ?2\n" +
            "        OR p.surname ILIKE ?2\n" +
            "        OR p.other_name ILIKE ?2\n" +
            "    )\n" +
            "ORDER BY p.id DESC",
            nativeQuery = true)
    Page<PatientProjection> getPatientsByFacilityBySearchParam(Long facilityId, String searchParam, Pageable page);


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
            "                        WHERE p.archived=0 AND p.facility_id= ?1 \n" +
            "                        AND (first_name ilike ?2 OR surname ilike ?2 OR unique_id ilike ?2 OR other_name ilike ?2 OR full_name ilike ?2 OR hospital_number ilike ?2) \n" +
            "                        GROUP BY e.id, e.target_group_id,ca.commenced, p.id, p.first_name, \n" +
            "                        p.first_name, b.biometric_type, pc.display,p.surname, p.other_name, p.hospital_number, p.date_of_birth \n" +
            "                        ORDER BY p.id DESC",
            nativeQuery = true)
    Page<PatientProjection> getEnrolledPatientsByFacilityBySearchParam(Long facilityId, String searchParam, Pageable page);


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
            "                        WHERE p.archived=0 AND p.facility_id= ?1 \n" +
            "                        GROUP BY e.id, e.target_group_id,ca.commenced, p.id, p.first_name, \n" +
            "                        p.first_name, b.biometric_type, pc.display,p.surname, p.other_name, p.hospital_number, p.date_of_birth \n" +
            "                        ORDER BY p.id DESC",
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
