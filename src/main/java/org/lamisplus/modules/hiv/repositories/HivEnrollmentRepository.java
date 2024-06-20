package org.lamisplus.modules.hiv.repositories;

import org.lamisplus.modules.hiv.domain.dto.AHDInterface;
import org.lamisplus.modules.hiv.domain.dto.EnrollmentStatus;
import org.lamisplus.modules.hiv.domain.dto.OVCDomainDTO;
import org.lamisplus.modules.hiv.domain.dto.PatientProjection;
import org.lamisplus.modules.hiv.domain.entity.HivEnrollment;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface HivEnrollmentRepository extends JpaRepository<HivEnrollment, Long> {
    Optional<HivEnrollment> getHivEnrollmentByPersonAndArchived(Person person, Integer archived);
    List<HivEnrollment> getHivEnrollmentByArchived(Integer archived);
    List<HivEnrollment> getHivEnrollmentByFacilityIdAndArchived(Long facilityId, Integer archived);
    
    @Query(value = "SELECT e.status_at_registration_id,e.date_of_registration " +
            "AS enrollmentDate, a.display AS hivEnrollmentStatus  " +
            "FROM hiv_enrollment  e INNER JOIN base_application_codeset a " +
            "ON a.id = e.status_at_registration_id " +
            "WHERE person_uuid = ?1 ",nativeQuery = true)
    Optional<EnrollmentStatus> getHivEnrollmentStatusByPersonUuid(String uuid);
    
    @Query(value ="SELECT p.id AS id, p.created_by as createBy,  p.date_of_registration as dateOfRegistration, p.first_name as firstName, p.surname AS surname,\n" +
            "             p.other_name AS otherName,\n" +
            "            p.hospital_number AS hospitalNumber, CAST (EXTRACT(YEAR from AGE(NOW(), date_of_birth)) AS INTEGER) AS age,\n" +
            "            INITCAP(p.sex) AS gender, p.date_of_birth AS dateOfBirth, p.is_date_of_birth_estimated AS isDobEstimated,\n" +
            "            p.facility_id as facilityId , p.uuid as personUuid,\n" +
            "            CAST(CASE when e.id is null then FALSE ELSE TRUE END AS Boolean) AS isEnrolled,\n" +
            "            e.target_group_id AS targetGroupId, e.id as enrollmentId, e.unique_id as uniqueId, pc.display as enrollmentStatus,\n" +
            "            ca.commenced, \n" +
            "            b.biometric_type as biometricStatus\n" +
            "            FROM patient_person p LEFT Join biometric b ON b.person_uuid = p.uuid LEFT JOIN hiv_enrollment e ON p.uuid = e.person_uuid\n" +
            "            LEFT JOIN\n" +
            "            (SELECT TRUE as commenced, hac.person_uuid FROM hiv_art_clinical hac WHERE hac.archived=0 AND hac.is_commencement is true\n" +
            "            GROUP BY hac.person_uuid)ca ON p.uuid = ca.person_uuid\n" +
            "            LEFT JOIN base_application_codeset pc on pc.id = e.status_at_registration_id\n" +
            "            WHERE p.archived=0 AND p.facility_id=?1\n" +
            "            AND e.id IS NULL \n" +
            "            GROUP BY e.id, e.target_group_id,ca.commenced, p.id, p.first_name,\n" +
            "            p.first_name, b.biometric_type, pc.display,p.surname, p.other_name, p.hospital_number, p.date_of_birth ORDER BY p.id DESC",
            nativeQuery = true)
    Page<PatientProjection> getPatientsByFacilityId(Long facilityId, Pageable page);
    
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
    Page<PatientProjection> getPatientsByFacilityBySearchParam(Long facilityId, String searchParam,  Pageable page);
    
    
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
    Page<PatientProjection> getEnrolledPatientsByFacilityBySearchParam(Long facilityId, String searchParam,  Pageable page);
    
    
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
    Page<PatientProjection> getEnrolledPatientsByFacility(Long facilityId,  Pageable page);
    
    
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
    List<PatientProjection> getEnrolledPatientsByFacility(Long facilityId);
    
    
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

    //For central sync
    List<HivEnrollment> findAllByFacilityId(Long facilityId);

    @Query(value = "SELECT * FROM hiv_enrollment WHERE last_modified_date > ?1 AND facility_id=?2",
            nativeQuery = true
    )
    List<HivEnrollment> getAllDueForServerUpload(LocalDateTime dateLastSync, Long facilityId);

    Optional<HivEnrollment> findByUuid(String uuid);
    Optional<HivEnrollment> findByUniqueIdAndArchivedAndPersonUuidNot(String uniqueId, Integer archived, String personUuid);
    Optional<HivEnrollment> findByUniqueIdAndArchived(String uniqueId, Integer archived);

    @Query(value = "SELECT  \n" +
            "    e.unique_id AS patientId,\n" +
            "    p.hospital_number AS hospitalNumber,\n" +
            "    INITCAP(p.sex) AS gender,\n" +
            "    p.date_of_birth AS dateOfBirth,\n" +
            "\tCAST(EXTRACT(YEAR FROM AGE(NOW(), p.date_of_birth)) AS INTEGER) as age,\n" +
            "\tahacs.clinical_stage as clinicalStage,\n" +
            "\tca.cd4_count as cd4Count,\n" +
            "\tca.created_date as artStartDate,\n" +
            "\tlabResult.result_reported as viralLoadResult,\n" +
            "\tpatient_status as patientStatus,\n" +
            "\theac.eac_status as eacStatus\n" +
            "FROM \n" +
            "    patient_person p\n" +
            "INNER JOIN \n" +
            "    hiv_enrollment e ON p.uuid = e.person_uuid\n" +
            "LEFT JOIN (\n" +
            "    SELECT \n" +
            "        person_uuid,\n" +
            "        clinical_stage,\n" +
            "        MAX(created_date) AS max_created_date\n" +
            "    FROM \n" +
            "        etl_hiv_art_clinical_stage\n" +
            "    GROUP BY \n" +
            "        person_uuid, \n" +
            "        clinical_stage\n" +
            ") ahacs ON p.uuid = ahacs.person_uuid\n" +
            "LEFT JOIN (\n" +
            "    SELECT \n" +
            "        hac.person_uuid, \n" +
            "        hac.visit_date, \n" +
            "        hac.pregnancy_status, \n" +
            "        hac.cd4_count,\n" +
            "\t\thac.created_date\n" +
            "    FROM \n" +
            "        hiv_art_clinical hac \n" +
            "    WHERE \n" +
            "        hac.archived = ?1\n" +
            "        AND cd4_count IS NOT NULL \n" +
            "        AND cd4_count = '<200'\n" +
            "    GROUP BY \n" +
            "        hac.person_uuid, \n" +
            "        hac.visit_date, \n" +
            "        hac.pregnancy_status, \n" +
            "        hac.cd4_count,\n" +
            "\t    hac.created_date\n" +
            ") ca ON p.uuid = ca.person_uuid\n" +
            "LEFT JOIN (\n" +
            "    SELECT \n" +
            "        patient_uuid,\n" +
            "        result_reported,\n" +
            "        MAX(date_created) AS max_date_created\n" +
            "    FROM \n" +
            "        laboratory_result\n" +
            "    WHERE \n" +
            "         result_reported ~ '^[0-9]+$' \n" +
            "    GROUP BY \n" +
            "        patient_uuid, \n" +
            "        result_reported\n" +
            ") labResult ON p.uuid = labResult.patient_uuid\n" +
            "LEFT JOIN (\n" +
            "    SELECT\n" +
            "\t    person_uuid,\n" +
            "        status as eac_status,\n" +
            "        MAX(created_date) AS max_created_date\n" +
            "    FROM \n" +
            "        hiv_eac\n" +
            "\tWHERE hiv_eac.status IS NOT NULL \n" +
            "    GROUP BY \n" +
            "        person_uuid,eac_status\n" +
            ") heac ON p.uuid = heac.person_uuid\n" +
            "LEFT JOIN (\n" +
            "    SELECT \n" +
            "        lr.patient_uuid,\n" +
            "        COUNT(*) AS low_viral_load_count\n" +
            "    FROM (\n" +
            "        SELECT\n" +
            "            patient_uuid,\n" +
            "            result_reported,\n" +
            "            ROW_NUMBER() OVER (PARTITION BY patient_uuid ORDER BY date_created DESC) AS rn\n" +
            "        FROM \n" +
            "            laboratory_result\n" +
            "        WHERE \n" +
            "            result_reported ~ '^[0-9]+$'\n" +
            "            AND CAST(result_reported AS INTEGER) < 20\n" +
            "    ) lr\n" +
            "    WHERE \n" +
            "        lr.rn <= 2\n" +
            "    GROUP BY \n" +
            "        lr.patient_uuid\n" +
            "    HAVING \n" +
            "        COUNT(*) = 2\n" +
            ") vl_check ON p.uuid = vl_check.patient_uuid\n" +
            "LEFT JOIN (\n" +
            "    SELECT \n" +
            "        person_uuid,\n" +
            "        MAX(CASE WHEN (\n" +
            "            CASE\n" +
            "                WHEN visit_date + refill_period + INTERVAL '29 day' < NOW() THEN 'IIT'\n" +
            "                ELSE 'Active'\n" +
            "            END) = 'IIT' THEN visit_date END) AS last_iit_date,\n" +
            "        MAX(CASE WHEN (\n" +
            "            CASE\n" +
            "                WHEN visit_date + refill_period + INTERVAL '29 day' < NOW() THEN 'IIT'\n" +
            "                ELSE 'Active'\n" +
            "            END) = 'Active' THEN visit_date END) AS restart_date\n" +
            "    FROM \n" +
            "        hiv_art_pharmacy\n" +
            "    WHERE \n" +
            "        archived = ?1\n" +
            "    GROUP BY \n" +
            "        person_uuid\n" +
            "    HAVING \n" +
            "        MAX(CASE WHEN (\n" +
            "            CASE\n" +
            "                WHEN visit_date + refill_period + INTERVAL '29 day' < NOW() THEN 'IIT'\n" +
            "                ELSE 'Active'\n" +
            "            END) = 'IIT' THEN visit_date END) IS NOT NULL\n" +
            "        AND MAX(CASE WHEN (\n" +
            "            CASE\n" +
            "                WHEN visit_date + refill_period + INTERVAL '29 day' < NOW() THEN 'IIT'\n" +
            "                ELSE 'Active'\n" +
            "            END) = 'Active' THEN visit_date END) IS NOT NULL\n" +
            "        AND DATE_PART('month', AGE(MAX(CASE WHEN (\n" +
            "            CASE\n" +
            "                WHEN visit_date + refill_period + INTERVAL '29 day' < NOW() THEN 'IIT'\n" +
            "                ELSE 'Active'\n" +
            "            END) = 'Active' THEN visit_date END), MAX(CASE WHEN (\n" +
            "            CASE\n" +
            "                WHEN visit_date + refill_period + INTERVAL '29 day' < NOW() THEN 'IIT'\n" +
            "                ELSE 'Active'\n" +
            "            END) = 'IIT' THEN visit_date END))) > 6\n" +
            ") iit_check ON p.uuid = iit_check.person_uuid\n" +
            "LEFT JOIN (\n" +
            "    SELECT \n" +
            "        personUuid, \n" +
            "        status AS patient_status\n" +
            "    FROM (\n" +
            "        SELECT\n" +
            "            DISTINCT ON (pharmacy.person_uuid) \n" +
            "            pharmacy.person_uuid AS personUuid,\n" +
            "            (\n" +
            "                CASE\n" +
            "                    WHEN stat.hiv_status ILIKE '%DEATH%' OR stat.hiv_status ILIKE '%Died%' THEN 'Died'\n" +
            "                    WHEN stat.status_date > pharmacy.maxdate\n" +
            "                        AND (stat.hiv_status ILIKE '%stop%' OR stat.hiv_status ILIKE '%out%' OR stat.hiv_status ILIKE '%Invalid %') \n" +
            "                    THEN stat.hiv_status\n" +
            "                    ELSE pharmacy.status\n" +
            "                END\n" +
            "            ) AS status,\n" +
            "            stat.cause_of_death, \n" +
            "            stat.va_cause_of_death\n" +
            "        FROM (\n" +
            "            SELECT\n" +
            "                (\n" +
            "                    CASE\n" +
            "                        WHEN hp.visit_date + hp.refill_period + INTERVAL '29 day' < NOW() THEN 'IIT'\n" +
            "                        ELSE 'Active'\n" +
            "                    END\n" +
            "                ) status,\n" +
            "                (\n" +
            "                    CASE\n" +
            "                        WHEN hp.visit_date + hp.refill_period + INTERVAL '29 day' < NOW() THEN hp.visit_date + hp.refill_period + INTERVAL '29 day'\n" +
            "                        ELSE hp.visit_date\n" +
            "                    END\n" +
            "                ) AS visit_date,\n" +
            "                hp.person_uuid, \n" +
            "                MAXDATE\n" +
            "            FROM\n" +
            "                hiv_art_pharmacy hp\n" +
            "            INNER JOIN (\n" +
            "                SELECT \n" +
            "                    hap.person_uuid, \n" +
            "                    hap.visit_date AS MAXDATE, \n" +
            "                    ROW_NUMBER() OVER (PARTITION BY hap.person_uuid ORDER BY hap.visit_date DESC) AS rnkkk3\n" +
            "                FROM \n" +
            "                    public.hiv_art_pharmacy hap \n" +
            "                INNER JOIN \n" +
            "                    public.hiv_art_pharmacy_regimens pr ON pr.art_pharmacy_id = hap.id \n" +
            "                INNER JOIN \n" +
            "                    hiv_enrollment h ON h.person_uuid = hap.person_uuid AND h.archived = ?1 \n" +
            "                INNER JOIN \n" +
            "                    public.hiv_regimen r ON r.id = pr.regimens_id \n" +
            "                INNER JOIN \n" +
            "                    public.hiv_regimen_type rt ON rt.id = r.regimen_type_id \n" +
            "                WHERE \n" +
            "                    r.regimen_type_id IN (1,2,3,4,14) \n" +
            "                    AND hap.archived = ?1                \n" +
            "            ) MAX ON MAX.MAXDATE = hp.visit_date AND MAX.person_uuid = hp.person_uuid AND MAX.rnkkk3 = 1\n" +
            "            WHERE \n" +
            "                hp.archived = ?1\n" +
            "        ) pharmacy\n" +
            "        LEFT JOIN (\n" +
            "            SELECT\n" +
            "                hst.hiv_status,\n" +
            "                hst.person_id,\n" +
            "                hst.status_date,\n" +
            "                hst.cause_of_death,\n" +
            "                hst.va_cause_of_death\n" +
            "            FROM (\n" +
            "                SELECT \n" +
            "                    * \n" +
            "                FROM (\n" +
            "                    SELECT DISTINCT \n" +
            "                        (person_id) person_id, \n" +
            "                        status_date, \n" +
            "                        cause_of_death,\n" +
            "                        va_cause_of_death,\n" +
            "                        hiv_status, \n" +
            "                        ROW_NUMBER() OVER (PARTITION BY person_id ORDER BY status_date DESC)\n" +
            "                    FROM \n" +
            "                        hiv_status_tracker \n" +
            "                    WHERE \n" +
            "                        archived = ?1 \n" +
            "                ) s\n" +
            "                WHERE \n" +
            "                    s.row_number = 1\n" +
            "            ) hst\n" +
            "            INNER JOIN \n" +
            "                hiv_enrollment he ON he.person_uuid = hst.person_id\n" +
            "        ) stat ON stat.person_id = pharmacy.person_uuid\n" +
            "    )\n" +
            ") st ON st.personUuid = e.person_uuid\n" +
            "LEFT JOIN \n" +
            "    base_application_codeset pc ON pc.id = e.status_at_registration_id\n" +
            "WHERE \n" +
            "    p.archived = ?1 \n" +
            "    AND p.facility_id = ?2 \n" +
            "\tAND st.patient_status = 'Active'\n" +
            "    AND CAST(EXTRACT(YEAR FROM AGE(NOW(), p.date_of_birth)) AS INTEGER) < 5\n" +
            "    OR (ahacs.clinical_stage = 'Stage III' OR ahacs.clinical_stage = 'Stage IV')\n" +
            "\tOR ca.created_date >= NOW() - INTERVAL '1 year'\n" +
            "\tOR CAST(result_reported AS INTEGER) > 999\n" +
            "\tOR heac.eac_status = 'COMPLETED'\n" +
            "\tOR (iit_check.restart_date IS NOT NULL AND ca.created_date >= NOW() - INTERVAL '6 months')\n" +
            "GROUP BY \n" +
            "    e.id, \n" +
            "    p.id, \n" +
            "    pc.display, \n" +
            "    p.hospital_number, \n" +
            "    p.date_of_birth, \n" +
            "    st.patient_status,\n" +
            "\tahacs.clinical_stage,\n" +
            "\tca.cd4_count,\n" +
            "\tca.created_date,\n" +
            "\tlabResult.result_reported,\n" +
            "\tpatient_status,\n" +
            "\theac.eac_status\n" +
            "ORDER BY \n" +
            "    p.id DESC;\n" +
            "\n", nativeQuery = true)
    List<AHDInterface> getAHDFlagByArchivedAndFacilityId(Integer archived, Long facilityId);
}
