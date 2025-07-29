package org.lamisplus.modules.hiv.repositories;

import org.lamisplus.modules.hiv.domain.dto.LabReport;
import org.lamisplus.modules.hiv.domain.dto.LatestLabResult;
import org.lamisplus.modules.hiv.domain.dto.MedicationInfo;
import org.lamisplus.modules.hiv.domain.dto.TransferPatientInfo;
import org.lamisplus.modules.hiv.domain.entity.Observation;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
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

    @Query(value = "SELECT tbTreatmentPersonUuid\n" +
            "FROM (\n" +
            "  SELECT\n" +
            "    COALESCE( COALESCE(NULLIF(CAST(data->'tptMonitoring'->>'eligibilityTpt' AS text), ''), NULL), COALESCE(NULLIF(CAST(data->'tbIptScreening'->>'eligibleForTPT' AS text), ''), '')) AS eligibleForTPT,\n" +
            "    person_uuid AS tbTreatmentPersonUuid,\n" +
            "    ROW_NUMBER() OVER (PARTITION BY person_uuid ORDER BY date_of_observation DESC) AS row_number\n" +
            "  FROM hiv_observation\n" +
            "  WHERE type = 'Chronic Care'\n" +
            "    AND facility_id = ?1 \n" +
            ") tbTreatment\n" +
            "WHERE row_number = 1\n" +
            "  AND eligibleForTPT IS NOT NULL\n" +
            "  AND eligibleForTPT = 'Yes'\n" +
            "  AND tbTreatmentPersonUuid = ?2", nativeQuery = true)
    Optional<String>  getIPTEligiblePatientUuid(Long facilityId, String uuid);


    List<Observation> getAllByPersonAndFacilityId(Person person, Long orgId);

    @Query(nativeQuery = true, value="WITH transferForm AS (\n" +
            "    SELECT\n" +
            "        p.id AS patientId,\n" +
            "        p.uuid AS personUuid,\n" +
            "        p.facility_id AS facilityId,\n" +
            "        COALESCE(e.date_confirmed_hiv, e.date_started) AS dateConfirmedHiv,\n" +
            "        e.date_of_registration AS dateEnrolledInCare,\n" +
            "        cc.body_weight AS weight,\n" +
            "        cc.height AS height,\n" +
            "        lastVisit.visit_date AS dateOfLastClinicalVisist,\n" +
            "        lastVisit.pregnancy_status AS pregnancyStatus,\n" +
            "        bac_adl.display AS adherenceLevel,\n" +
            "        bac.display AS currentWhoClinical,\n" +
            "        cd4.currentCD4Count AS currentCD4Count,\n" +
            "        bcd4.baseLineCD4Count AS baselineCD4,\n" +
            "        ca.visit_date AS dateEnrolledInTreatment,\n" +
            "        eac.last_viral_load AS viralLoad,\n" +
            "        pharmacy.currentRegimenLine AS currentRegimenLine,\n" +
            "        ca.regline AS firstLineArtRegimen,\n" +
            "        hivstatus.id as hivStatusId,\n" +
            "        hivstatus.hiv_status as hivStatus\n" +
            "    FROM\n" +
            "        patient_person p\n" +
            "        INNER JOIN hiv_enrollment e ON p.uuid = e.person_uuid\n" +
            "    INNER JOIN\n" +
            "        (SELECT TRUE as commenced, hac.person_uuid, hac.visit_date, hr.description AS currentRegimenLine, hrt.description AS regline  \n" +
            "        FROM hiv_art_clinical hac\n" +
            "        LEFT JOIN hiv_regimen hr ON hr.id = hac.regimen_id\n" +
            "        LEFT JOIN hiv_regimen_type hrt ON hrt.id = hac.regimen_type_id\n" +
            "        WHERE hac.archived=0 AND hac.is_commencement is true\n" +
            "        GROUP BY hac.person_uuid, hac.visit_date, hac.pregnancy_status, hr.description, hrt.description\n" +
            "        )ca ON p.uuid = ca.person_uuid\n" +
            "                    \n" +
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
            "        SELECT * FROM (\n" +
            "            SELECT person_uuid, visit_date, level_of_adherence, next_appointment, tb_status, pregnancy_status, facility_id,clinical_stage_id, \n" +
            "            ROW_NUMBER() OVER (PARTITION BY person_uuid ORDER BY visit_date DESC) AS row\n" +
            "            FROM hiv_art_clinical\n" +
            "            WHERE archived = 0\n" +
            "        ) visit WHERE row = 1\n" +
            "    ) lastVisit ON p.uuid = lastVisit.person_uuid\n" +
            "    INNER JOIN base_organisation_unit facility ON facility.id = p.facility_id\n" +
            "    INNER JOIN base_organisation_unit facility_lga ON facility_lga.id = facility.parent_organisation_unit_id\n" +
            "    INNER JOIN base_organisation_unit facility_state ON facility_state.id = facility_lga.parent_organisation_unit_id\n" +
            "    LEFT JOIN base_application_codeset bac ON bac.id = lastVisit.clinical_stage_id\n" +
            "    LEFT JOIN base_application_codeset bac_adl ON \n" +
            "        CASE \n" +
            "            WHEN lastVisit.level_of_adherence ~ '^[0-9]+$' \n" +
            "            THEN cast(lastVisit.level_of_adherence AS bigint) = bac_adl.id \n" +
            "            ELSE FALSE \n" +
            "        END\n" +
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
            "    LEFT JOIN (\n" +
            "        SELECT * FROM (\n" +
            "            SELECT\n" +
            "                id,\n" +
            "                person_id,\n" +
            "                hiv_status, status_date,\n" +
            "                ROW_NUMBER() OVER (PARTITION BY person_id ORDER BY status_date DESC) AS rn\n" +
            "            FROM hiv_status_tracker \n" +
            "        ) h where rn = 1\n" +
            "    ) hivstatus ON ca.person_uuid = hivstatus.person_id\n" +
            "    LEFT JOIN (\n" +
            "        SELECT * FROM (\n" +
            "            SELECT \n" +
            "                p.person_uuid as person_uuid40, \n" +
            "                COALESCE(ds_model.display, p.dsd_model_type) as dsdModel, \n" +
            "                p.visit_date as lastPickupDate,\n" +
            "                r.description as currentARTRegimen, \n" +
            "                rt.description as currentRegimenLine,\n" +
            "                p.next_appointment as nextPickupDate,\n" +
            "                ROW_NUMBER() OVER (PARTITION BY p.person_uuid ORDER BY p.visit_date DESC) AS rn\n" +
            "            from public.hiv_art_pharmacy p\n" +
            "            INNER JOIN public.hiv_art_pharmacy_regimens pr ON pr.art_pharmacy_id = p.id\n" +
            "            INNER JOIN public.hiv_regimen r on r.id = pr.regimens_id\n" +
            "            INNER JOIN public.hiv_regimen_type rt on rt.id = r.regimen_type_id\n" +
            "            left JOIN base_application_codeset ds_model on ds_model.code = p.dsd_model_type \n" +
            "            WHERE r.regimen_type_id in (1,2,3,4,14,16)\n" +
            "            AND p.archived = 0\n" +
            "        ) p where rn = 1\n" +
            "    ) pharmacy ON ca.person_uuid = pharmacy.person_uuid40\n" +
            "    WHERE p.facility_id = :facilityId AND p.archived = 0\n" +
            "), RankedTransferForm AS (\n" +
            "    SELECT \n" +
            "        *,\n" +
            "        ROW_NUMBER() OVER (PARTITION BY personUuid ORDER BY dateEnrolledInTreatment DESC) AS rn\n" +
            "    FROM transferForm\n" +
            ")\n" +
            "SELECT \n" +
            "    patientId,\n" +
            "    personUuid,\n" +
            "    facilityId,\n" +
            "    dateEnrolledInTreatment,\n" +
            "    dateOfLastClinicalVisist,\n" +
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
            "    hivStatusId,\n" +
            "    hivStatus\n" +
            "FROM RankedTransferForm\n" +
            "WHERE rn = 1 AND personUuid = :uuid")
    Optional<TransferPatientInfo> getTransferPatientInfo( String uuid, Long facilityId);

    @Query(nativeQuery = true, value =
            "SELECT \n" +
                    "    lbr.facility_id AS facilityId,\n" +
                    "    lbr.patient_uuid AS patientId,\n" +
                    "    lbr.result_reported AS result, \n" +
                    "    lbr.date_result_reported AS dateReported, \n" +
                    "    llt.lab_test_name AS test\n" +
                    "FROM \n" +
                    "    laboratory_result lbr\n" +
                    "LEFT JOIN \n" +
                    "    laboratory_test lt ON lt.id = lbr.test_id\n" +
                    "LEFT JOIN \n" +
                    "    laboratory_labtest llt ON llt.id = lt.lab_test_id\n" +
                    "WHERE \n" +
                    "    lbr.patient_uuid = ?2\n" +
                    "    AND lbr.archived = 0\n" +
                    "    AND lbr.facility_id = ?1\n" +
                    "ORDER BY \n" +
                    "    lbr.date_result_reported DESC\n" +
                    "LIMIT 5")
    List<LatestLabResult> getPatientLabResults(@Param("facilityId") Long facilityId, @Param("patientUuid") String patientUuid);

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

  @Query(value = "SELECT data->'chronicCondition'->>'hypertensive' AS hypertensive_value FROM public.hiv_observation WHERE type = 'Chronic Care' and facility_id = ?1 and person_uuid = ?2  AND archived = 0 AND data->'chronicCondition'->>'hypertensive' = 'Yes' limit 1", nativeQuery = true)
  Optional<String> getIsHypertensive(Long facilityId, String uuid);

    @Query(value = "SELECT CASE WHEN COUNT(o) > 0 THEN true ELSE false END FROM hiv_observation o WHERE o.person_uuid = :personUuid AND o.type IN ('ART Transfer In', 'ART Transfer Out') AND (o.data ->> 'encounterDate' IS NOT NULL) AND o.data ->> 'encounterDate' = :encounterDate", nativeQuery = true)
    boolean existsByPersonUuidAndEncounterDate(@Param("personUuid") String personUuid, @Param("encounterDate") String encounterDate);

    @Query(value = "SELECT CASE " +
            "WHEN o.data -> 'tptMonitoring' ->> 'everCompletedTpt' = 'Yes' " +
            "THEN o.data -> 'tptMonitoring' ->> 'dateOfTptCompleted' " +
            "ELSE '' END AS tptCompletionDate " +
            "FROM hiv_observation o " +
            "JOIN patient_person p ON o.person_uuid = p.uuid " +
            "WHERE p.uuid = :personUuid " +
            "AND o.date_of_observation = :dateOfObservation " +
            "AND o.type = 'Chronic Care'", nativeQuery = true)
    Optional<String> findTptCompletionDateByPersonAndDate(
            @Param("personUuid") String personUuid,
            @Param("dateOfObservation") LocalDate dateOfObservation
          );

    @Query(value = "SELECT EXISTS (" +
            "SELECT 1 FROM hiv_observation " +
            "WHERE person_uuid = :personUuid " +
            "AND type IN ('ART Transfer In', 'ART Transfer Out') " +
            "AND data->>'encounterDate' = :encounterDate" +
            ") as has_transfer",
            nativeQuery = true)
    boolean hasTransferOnDate(@Param("personUuid") String personUuid,
                              @Param("encounterDate") String encounterDate);

    @Query(value =
            "SELECT * FROM hiv_observation " +
                    "WHERE person_uuid = :personUuid " +
                    "AND type = 'ART Transfer Out' " +
                    "AND data->>'encounterDate' IS NOT NULL " +
                    "ORDER BY CAST(data->>'encounterDate' AS DATE) DESC " +
                    "LIMIT 1",
            nativeQuery = true)
    Optional<Observation> findMostRecentTransferOut(@Param("personUuid") String personUuid);

    @Query(value = "WITH tbImpl AS (\n" +
            "SELECT he.person_uuid FROM hiv_enrollment he WHERE archived = 0\n" +
            "),\n" +
            "tbStartDate AS (\n" +
            "SELECT person_uuid, tbTreatmentStartDate, status, status_date, CAST(tbTreatmentStartDate + INTERVAL '6 Month' AS DATE) AS intervalDate,\n" +
            "(CASE WHEN NOW() >= CAST(tbTreatmentStartDate + INTERVAL '6 Month' AS DATE) THEN TRUE ELSE FALSE END) AS pass6Month\n" +
            "FROM (\n" +
            "SELECT ho.person_uuid, ho.date_of_observation visitDate,  NULLIF(CAST(NULLIF(ho.data->'tbIptScreening'->>'tbTreatmentStartDate', '') AS DATE), NULL) tbTreatmentStartDate, \n" +
            "ho.data->'tbIptScreening'->>'completionDate' tbCompletionDate, currentArtStatus.status, currentArtStatus.status_date,\n" +
            "ROW_NUMBER() OVER (PARTITION BY ho.person_uuid ORDER BY ho.date_of_observation DESC) rnkk FROM hiv_observation ho\n" +
            "LEFT JOIN (\n" +
            "SELECT person_uuid, (CASE WHEN hiv_status ILIKE '%DEATH%' OR hiv_status ILIKE '%Died%' THEN 'Died' WHEN(status_date > visit_date AND (hiv_status ILIKE '%stop%' OR hiv_status ILIKE '%out%' OR hiv_status ILIKE '%Invalid %' OR hiv_status ILIKE '%ART Transfer In%'))  THEN hiv_status ELSE artStatus END) AS status,\n" +
            "(CASE WHEN hiv_status ILIKE '%DEATH%' OR hiv_status ILIKE '%Died%'  THEN status_date WHEN(status_date > visit_date AND (hiv_status ILIKE '%stop%' OR hiv_status ILIKE '%out%' OR hiv_status ILIKE '%Invalid %' OR hiv_status ILIKE '%ART Transfer In%')) THEN status_date ELSE visit_date END ) AS status_date\n" +
            "FROM (SELECT person_uuid, (CASE WHEN pharmacy.visitDate + pharmacy.refill_period + INTERVAL '29 day' <= NOW() THEN 'IIT' ELSE 'Active' END ) artStatus,\n" +
            "(CASE WHEN CAST(pharmacy.visitDate + pharmacy.refill_period + INTERVAL '29 day' AS DATE) <= NOW() THEN CAST(pharmacy.visitDate + pharmacy.refill_period + INTERVAL '29 day' AS DATE) ELSE pharmacy.visitDate END) AS visit_date, stat.status_date,stat.hiv_status\n" +
            "FROM (\n" +
            "SELECT hap.person_uuid, CAST(hap.visit_date AS DATE) visitDate, refill_period, ROW_NUMBER() OVER (PARTITION BY hap.person_uuid ORDER BY hap.visit_date DESC) as rnk\n" +
            "FROM public.hiv_art_pharmacy hap \n" +
            "INNER JOIN public.hiv_art_pharmacy_regimens pr ON pr.art_pharmacy_id = hap.id \n" +
            "INNER JOIN hiv_enrollment h ON h.person_uuid = hap.person_uuid AND h.archived = 0 \n" +
            "INNER JOIN public.hiv_regimen r on r.id = pr.regimens_id \n" +
            "INNER JOIN public.hiv_regimen_type rt on rt.id = r.regimen_type_id \n" +
            "WHERE r.regimen_type_id in (1,2,3,4,14, 16) \n" +
            "AND hap.archived = 0  \n" +
            "AND hap.visit_date BETWEEN CAST('1901-01-01' AS DATE) AND CAST(NOW() AS DATE)\n" +
            ") pharmacy\n" +
            "LEFT JOIN (\n" +
            "SELECT * FROM (SELECT DISTINCT (person_id) person_id, status_date,\n" +
            "hiv_status, ROW_NUMBER() OVER (PARTITION BY person_id ORDER BY status_date DESC)\n" +
            "FROM hiv_status_tracker WHERE archived=0 AND status_date BETWEEN CAST('1901-01-01' AS DATE) AND CAST(NOW() AS DATE) )s\n" +
            "WHERE s.row_number=1\n" +
            ")stat ON stat.person_id = pharmacy.person_uuid\n" +
            "WHERE pharmacy.rnk = 1\n" +
            ") completeArtStatus\n" +
            ") currentArtStatus ON currentArtStatus.person_uuid = ho.person_uuid\n" +
            "WHERE archived = 0 AND data->'tbIptScreening'->>'tbTreatmentStartDate' IS NOT NULL AND data->'tbIptScreening'->>'tbTreatmentStartDate' <> ''\n" +
            "AND data->'tbIptScreening'->>'completionDate' ='') subQ WHERE rnkk = 1\n" +
            ")\n" +
            "SELECT tbStart.pass6Month FROM tbImpl\n" +
            "LEFT JOIN tbStartDate tbStart ON tbImpl.person_uuid = tbStart.person_uuid\n" +
            "WHERE tbStart.status IN ('Active') AND tbImpl.person_uuid = ?1", nativeQuery = true)
    Optional<Boolean> findTbClientWithoutCompletionDate(String personUuid);
}
