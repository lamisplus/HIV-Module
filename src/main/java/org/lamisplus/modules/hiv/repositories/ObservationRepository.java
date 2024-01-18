package org.lamisplus.modules.hiv.repositories;

import org.lamisplus.modules.hiv.domain.dto.*;
import org.lamisplus.modules.hiv.domain.entity.Observation;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ObservationRepository extends JpaRepository<Observation, Long> {
    List<Observation> getAllByTypeAndPersonAndFacilityIdAndArchived(String type, Person person, Long facilityId, Integer archived);
    List<Observation> getAllByPersonAndFacilityIdAndArchived(Person person, Long facilityId, Integer archived);
    List<Observation> getAllByPersonAndArchived(Person person, Integer archived);

    @Query(value = "SELECT * from hiv_observation where (type = 'Clinical evaluation' \n" +
            "            OR type = 'Mental health' )\n" +
            "            AND person_uuid = ?1  AND archived = 0", nativeQuery = true)
    List<Observation> getClinicalEvaluationAndMentalHealth(String personUuid);


    //For central sync
    List<Observation> findAllByFacilityId(Long facilityId);

    @Query(value = "SELECT * FROM hiv_observation WHERE last_modified_date > ?1 AND facility_id=?2",
            nativeQuery = true
    )
    List<Observation> getAllDueForServerUpload(LocalDateTime dateLastSync, Long facilityId);

    Optional<Observation> findByUuid(String uuid);

    @Query(value = "SELECT tbTreatmentPersonUuid FROM (SELECT \n" +
            "COALESCE(NULLIF(CAST(data->'tbIptScreening'->>'eligibleForTPT' AS text), ''), '') as eligibleForTPT,\n" +
            "person_uuid as tbTreatmentPersonUuid,\n" +
            "ROW_NUMBER() OVER ( PARTITION BY person_uuid ORDER BY date_of_observation DESC)\n" +
            "FROM hiv_observation WHERE type = 'Chronic Care'   \n" +
            "\t\t\t   AND facility_id = ?1 \n" +
            ") tbTreatment WHERE row_number = 1 AND  eligibleForTPT IS NOT NULL \n" +
            "AND eligibleForTPT = 'Yes'\n" +
            "AND tbTreatmentPersonUuid = ?2", nativeQuery = true)
    Optional<String> getIPTEligiblePatientUuid(Long facilityId, String uuid);

    List<Observation> getAllByPersonAndFacilityId(Person person, Long orgId);

    @Query(nativeQuery = true, value =
            "SELECT " +
                    "    a.facility_id AS facilityId, " +
                    "    (SELECT x.name FROM base_organisation_unit x WHERE x.id = a.facility_id LIMIT 1) AS facility, " +
                    "    a.patient_uuid AS patientId, " +
                    "    (SELECT x.hospital_number FROM patient_person x WHERE x.uuid = a.patient_uuid LIMIT 1) AS hospitalNum, " +
                    "    c.lab_test_name AS test, " +
                    "    d.date_sample_collected AS sampleCollectionDate, " +
                    "    oi.code AS datimId, " +
                    "    b.result_reported AS result, " +
                    "    b.date_result_reported AS dateReported " +
                    "FROM " +
                    "    laboratory_test a " +
                    "    INNER JOIN laboratory_result b ON a.id = b.test_id " +
                    "    INNER JOIN laboratory_labtest c ON a.lab_test_id = c.id " +
                    "    INNER JOIN base_organisation_unit_identifier oi ON oi.organisation_unit_id = a.facility_id " +
                    "    INNER JOIN laboratory_sample d ON a.id = d.test_id " +
                    "WHERE " +
                    "    c.lab_test_name = 'Viral Load' " +
                    "    AND b.result_reported != '' " +
                    "    AND a.facility_id = ?1 " +
                    "    AND a.patient_uuid = ?2")
    List<LabReport> getPatientLabResults(@Param("facilityId") Long facilityId, @Param("patientUuid") String patientUuid);



    @Query(nativeQuery = true, value = "SELECT\n" +
            "  obj.value->>'name' AS regimenName,\n" +
            "  obj.value->>'dosage' AS dosage,\n" +
            "  obj.value->>'prescribed' as prescribed,\n" +
            "  obj.value->>'dispense' AS dispense,\n" +
            "  obj.value->>'duration' AS duration,\n" +
            "  obj.value->>'frequency' AS frequency \n" +
            "FROM (\n" +
            "  SELECT hap.extra->'regimens' AS regimens\n" +
            "  FROM public.hiv_art_pharmacy hap\n" +
            "  WHERE hap.person_uuid = :uuid\n" +
            "  ORDER BY hap.visit_date DESC\n" +
            ") hap\n" +
            "CROSS JOIN LATERAL jsonb_array_elements(hap.regimens) as obj;")
    List<MedicationInfo> getTransferPatientTreatmentMedication(@Param("uuid") String uuid);

    @Query(nativeQuery = true, value =
            "SELECT " +
                    "  coalesce( " +
                    "    cast(cd_4 as varchar), " +
                    "    cd4_semi_quantitative " +
                    "  ) as baseLineCD4Count " +
                    "FROM " +
                    "  public.hiv_art_clinical " +
                    "WHERE " +
                    "  is_commencement is true " +
                    "  AND archived = 0 " +
                    "  AND cd_4 != 0 " +
                    "  AND facility_id = :facilityId " +
                    "  AND public.hiv_art_clinical.person_uuid = :uuid")
    Optional<BaseLineCd4Count> getPatientBaseLineCd4Count(@Param("uuid") String uuid, @Param("facilityId") Long facilityId);

@Query(nativeQuery = true, value =
        "SELECT " +
                "    sm.result_reported AS currentCD4Count " +
                "FROM " +
                "    public.laboratory_result sm " +
                "    INNER JOIN public.laboratory_test lt ON sm.test_id = lt.id " +
                "WHERE " +
                "    lt.lab_test_id IN (1, 50) " +
                "    AND sm.date_result_reported IS NOT NULL " +
                "    AND sm.archived = 0 " +
                "    AND sm.facility_id = :facilityId " +
                "    AND sm.patient_uuid = :uuid " +
                "ORDER BY " +
                "    date_result_reported DESC " +
                "LIMIT 1")
    Optional<PatientCurrentCD4> getPatientCurrentCD4(@Param("uuid") String uuid, @Param("facilityId") Long facilityId);



   @Query(nativeQuery = true, value ="WITH transferForm AS (\n" +
           "    SELECT\n" +
           "        p.id AS patientId,\n" +
           "        p.uuid AS personUuid,\n" +
           "        h.facility_id AS facilityId,\n" +
           "        facility.name AS facilityName,\n" +
           "        facility_lga.name AS lga,\n" +
           "        facility_state.name AS state,\n" +
           "        cc.body_weight AS weight,\n" +
           "        cc.height AS height,\n" +
           "        pregstatus.pregnancy_status AS pregnancyStatus,\n" +
           "        h.date_confirmed_hiv AS dateConfirmedHiv,\n" +
           "        h.date_of_registration AS dateEnrolledInCare,\n" +
           "        adhre.adherence_level AS adherenceLevel,\n" +
           "        bac.display AS currentWhoClinical,\n" +
           "        cd4.currentCD4Count AS currentCD4Count,\n" +
           "        bcd4.baseLineCD4Count AS baselineCD4,\n" +
           "        eac.last_viral_load AS viralLoad,\n" +
           "        regline.currentRegimenLine AS currentRegimenLine,\n" +
           "        regline.firstLineArtRegimen AS firstLineArtRegimen,\n" +
           "\t    hivstatus.id as hivStatusId,\n" +
           "\t    hivstatus.hiv_status as hivStatus\n" +
           "    FROM\n" +
           "        patient_person p\n" +
           "    LEFT JOIN (\n" +
           "        SELECT DISTINCT ON (tvs.person_uuid)\n" +
           "            tvs.person_uuid,\n" +
           "            MAX(tvs.capture_date) AS lasVital,\n" +
           "            tvs.body_weight,\n" +
           "            tvs.height,\n" +
           "            ca.commenced,\n" +
           "            ca.visit_date\n" +
           "        FROM\n" +
           "            triage_vital_sign tvs\n" +
           "        INNER JOIN (\n" +
           "            SELECT\n" +
           "                TRUE AS commenced,\n" +
           "                hac.person_uuid,\n" +
           "                hac.visit_date\n" +
           "            FROM\n" +
           "                hiv_art_clinical hac\n" +
           "            WHERE\n" +
           "                hac.archived = 0\n" +
           "                AND hac.is_commencement IS TRUE\n" +
           "            GROUP BY\n" +
           "                hac.person_uuid,\n" +
           "                hac.visit_date\n" +
           "        ) ca ON ca.person_uuid = tvs.person_uuid\n" +
           "        GROUP BY\n" +
           "            tvs.body_weight,\n" +
           "            tvs.height,\n" +
           "            tvs.person_uuid,\n" +
           "            ca.commenced,\n" +
           "            ca.visit_date,\n" +
           "            tvs.capture_date\n" +
           "        ORDER BY\n" +
           "            tvs.person_uuid,\n" +
           "            tvs.capture_date DESC\n" +
           "    ) cc ON cc.person_uuid = p.uuid\n" +
           "    LEFT JOIN (\n" +
           "        SELECT DISTINCT ON (hac.person_uuid)\n" +
           "            hac.person_uuid,\n" +
           "            MAX(hac.visit_date) AS lastVisit,\n" +
           "            hac.adherence_level,\n" +
           "            hac.clinical_stage_id\n" +
           "        FROM\n" +
           "            hiv_art_clinical AS hac\n" +
           "        GROUP BY\n" +
           "            hac.person_uuid,\n" +
           "            hac.visit_date,\n" +
           "            hac.adherence_level,\n" +
           "            hac.clinical_stage_id\n" +
           "    ) adhre ON adhre.person_uuid = p.uuid\n" +
           "    LEFT JOIN (\n" +
           "        SELECT DISTINCT ON (hac.person_uuid)\n" +
           "            hac.person_uuid,\n" +
           "            MAX(hac.visit_date) AS lastVisit,\n" +
           "            hac.pregnancy_status\n" +
           "        FROM\n" +
           "            hiv_art_clinical AS hac\n" +
           "        GROUP BY\n" +
           "            hac.person_uuid,\n" +
           "            hac.visit_date,\n" +
           "            hac.pregnancy_status\n" +
           "    ) pregstatus ON pregstatus.person_uuid = p.uuid\n" +
           "    LEFT JOIN (\n" +
           "        SELECT DISTINCT ON (hac.person_uuid)\n" +
           "            hac.person_uuid,\n" +
           "            MAX(hac.visit_date) AS lastVisit,\n" +
           "            hac.regimen_id,\n" +
           "            hac.regimen_type_id,\n" +
           "            hr.description AS currentRegimenLine,\n" +
           "            hrt.description AS firstLineArtRegimen\n" +
           "        FROM\n" +
           "            hiv_art_clinical AS hac\n" +
           "        LEFT JOIN hiv_regimen hr ON hr.id = hac.regimen_id\n" +
           "        LEFT JOIN hiv_regimen_type hrt ON hrt.id = hac.regimen_type_id\n" +
           "        GROUP BY\n" +
           "            hac.person_uuid,\n" +
           "            hac.visit_date,\n" +
           "            hac.regimen_id,\n" +
           "            hac.regimen_type_id,\n" +
           "            hr.description,\n" +
           "            hrt.description\n" +
           "    ) regline ON regline.person_uuid = p.uuid\n" +
           "    INNER JOIN base_organisation_unit facility ON facility.id = facility_id\n" +
           "    INNER JOIN base_organisation_unit facility_lga ON facility_lga.id = facility.parent_organisation_unit_id\n" +
           "    INNER JOIN base_organisation_unit facility_state ON facility_state.id = facility_lga.parent_organisation_unit_id\n" +
           "    LEFT JOIN base_application_codeset bac ON bac.id = adhre.clinical_stage_id\n" +
           "    LEFT JOIN hiv_eac eac ON eac.person_uuid = p.uuid\n" +
           "    LEFT JOIN (\n" +
           "        SELECT DISTINCT ON (sm.patient_uuid)\n" +
           "            sm.patient_uuid,\n" +
           "            sm.result_reported AS currentCD4Count,\n" +
           "            sm.date_result_reported\n" +
           "        FROM\n" +
           "            public.laboratory_result sm\n" +
           "        INNER JOIN public.laboratory_test lt ON sm.test_id = lt.id\n" +
           "        WHERE\n" +
           "            lt.lab_test_id IN (1, 50)\n" +
           "            AND sm.date_result_reported IS NOT NULL\n" +
           "            AND sm.archived = 0\n" +
           "        ORDER BY\n" +
           "            sm.patient_uuid,\n" +
           "            sm.date_result_reported DESC\n" +
           "    ) cd4 ON cd4.patient_uuid = p.uuid\n" +
           "    LEFT JOIN (\n" +
           "        SELECT\n" +
           "            COALESCE(\n" +
           "                CAST(cd_4 AS VARCHAR),\n" +
           "                cd4_semi_quantitative\n" +
           "            ) AS baseLineCD4Count,\n" +
           "            person_uuid\n" +
           "        FROM\n" +
           "            public.hiv_art_clinical\n" +
           "        WHERE\n" +
           "            is_commencement IS TRUE\n" +
           "            AND archived = 0\n" +
           "            AND cd_4 != 0\n" +
           "    ) bcd4 ON bcd4.person_uuid = p.uuid\n" +
           "\t LEFT JOIN LATERAL (\n" +
           "        SELECT\n" +
           "            hst.hiv_status,\n" +
           "            hst.status_date,\n" +
           "            hst.person_id,\n" +
           "            hst.visit_id,\n" +
           "            hst.id\n" +
           "        FROM\n" +
           "            hiv_status_tracker hst\n" +
           "        WHERE\n" +
           "            hst.person_id = p.uuid\n" +
           "        ORDER BY\n" +
           "            hst.status_date DESC,\n" +
           "            hst.id DESC\n" +
           "        LIMIT 1\n" +
           "    ) hivstatus ON true\n" +
           "    LEFT JOIN hiv_enrollment h ON h.person_uuid = p.uuid\n" +
           ")\n" +
           "SELECT\n" +
           "    patientId,\n" +
           "    personUuid,\n" +
           "    facilityId,\n" +
           "    (SELECT MIN(visit_date) FROM hiv_art_clinical WHERE person_uuid = personUuid) AS dateEnrolledInTreatment,\n" +
           "    facilityName,\n" +
           "    lga,\n" +
           "    state,\n" +
           "    weight,\n" +
           "    height,\n" +
           "    pregnancyStatus,\n" +
           "    dateEnrolledInCare,\n" +
           "    dateConfirmedHiv,\n" +
           "    adherenceLevel,\n" +
           "    currentWhoClinical,\n" +
           "    currentCD4Count,\n" +
           "    baselineCD4,\n" +
           "    viralLoad,\n" +
           "    currentRegimenLine,\n" +
           "    firstLineArtRegimen,\n" +
           "\thivStatusId,\n" +
           "\thivStatus\n" +
           "FROM\n" +
           "    transferForm \n" +
           "WHERE\n" +
           "  personUuid = :uuid\n")
    Optional<TransferPatientInfo> getTransferPatientInfo(@Param("uuid") String uuid);
}
