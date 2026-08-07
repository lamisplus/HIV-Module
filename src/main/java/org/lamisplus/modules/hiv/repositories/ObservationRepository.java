package org.lamisplus.modules.hiv.repositories;

import org.lamisplus.modules.hiv.domain.dto.*;
import org.lamisplus.modules.hiv.domain.entity.Observation;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

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

    @Query(nativeQuery = true, value="WITH transferOutData AS (\n" +
            "    SELECT \n" +
            "        p.id AS patientId,\n" +
            "        p.uuid AS patientUuid,\n" +
            "        p.facility_id AS facilityId\n" +
            "    FROM patient_person p\n" +
            "    WHERE p.archived = 0\n" +
            "),\n" +
            "lastEnrollment AS (\n" +
            "    SELECT * FROM (\n" +
            "        SELECT \n" +
            "            person_uuid,\n" +
            "            visit_id,\n" +
            "            date_confirmed_hiv_test AS dateConfirmedHiv,\n" +
            "            visit_date AS visitDate,\n" +
            "            visit_date AS dateEnrolledInTreatment,\n" +
            "            regimen_line_id,\n" +
            "            date_art_started,\n" +
            "            date_enrolled_in_hiv_care AS dateEnrolledInCare,\n" +
            "            cd4_percentage,\n" +
            "            cd4_at_art_start AS baselineCD4, \n" +
            "            ROW_NUMBER() OVER (PARTITION BY person_uuid ORDER BY visit_date DESC) rnk\n" +
            "        FROM hiv_enrollment_commencement\n" +
            "        WHERE archived = 0\n" +
            "    ) lst WHERE rnk = 1\n" +
            "),\n" +
            "hivstatus AS (\n" +
            "    SELECT id AS hivStatusId, person_id, hiv_status AS hivStatus\n" +
            "    FROM (\n" +
            "        SELECT \n" +
            "            id,\n" +
            "            person_id,\n" +
            "            hiv_status,\n" +
            "            status_date,\n" +
            "            ROW_NUMBER() OVER (PARTITION BY person_id ORDER BY status_date DESC) AS rn\n" +
            "        FROM hiv_status_tracker\n" +
            "        WHERE archived = 0\n" +
            "    ) h\n" +
            "    WHERE rn = 1\n" +
            "),\n" +
            "lastVisit AS (\n" +
            "    SELECT *\n" +
            "    FROM (\n" +
            "        SELECT \n" +
            "            person_uuid,\n" +
            "            visit_date,\n" +
            "            next_appointment,\n" +
            "            tb_status,\n" +
            "            pregnancy_status,\n" +
            "            facility_id,\n" +
            "            clinical_stage_id,\n" +
            "            arvdrugs_regimen->0->>'regimenAdherance' AS level_of_adherence,\n" +
            "            ROW_NUMBER() OVER (PARTITION BY person_uuid ORDER BY visit_date DESC) AS row\n" +
            "        FROM hiv_art_clinical\n" +
            "        WHERE archived = 0\n" +
            "    ) visit\n" +
            "    WHERE row = 1\n" +
            "),\n" +
            "cd4 AS (\n" +
            "    SELECT patient_uuid, currentCD4Count\n" +
            "    FROM (\n" +
            "        SELECT \n" +
            "            sm.patient_uuid,\n" +
            "            sm.result_reported AS currentCD4Count,\n" +
            "            sm.date_result_reported,\n" +
            "            ROW_NUMBER() OVER (\n" +
            "                PARTITION BY sm.patient_uuid \n" +
            "                ORDER BY CAST(sm.date_result_reported AS DATE) DESC\n" +
            "            ) AS row\n" +
            "        FROM public.laboratory_result sm\n" +
            "        INNER JOIN public.laboratory_test lt ON sm.test_id = lt.id\n" +
            "        WHERE lt.lab_test_id IN (1, 50)\n" +
            "          AND sm.date_result_reported IS NOT NULL\n" +
            "          AND sm.archived = 0\n" +
            "    ) cd4C\n" +
            "    WHERE row = 1\n" +
            "),\n" +
            "lastVitals AS (\n" +
            "    SELECT person_uuid, captureDate, weight, height\n" +
            "    FROM (\n" +
            "        SELECT \n" +
            "            person_uuid,\n" +
            "            CAST(capture_date AS DATE) AS captureDate,\n" +
            "            body_weight AS weight,\n" +
            "            height,\n" +
            "            ROW_NUMBER() OVER (\n" +
            "                PARTITION BY person_uuid \n" +
            "                ORDER BY CAST(capture_date AS DATE) DESC\n" +
            "            ) AS rnnkk\n" +
            "        FROM triage_vital_sign\n" +
            "        WHERE archived = 0\n" +
            "    ) triage\n" +
            "    WHERE rnnkk = 1\n" +
            "),\n" +
            "pharmacy AS (\n" +
            "    SELECT person_uuid4, currentRegimenLine\n" +
            "    FROM (\n" +
            "        SELECT \n" +
            "            p.person_uuid AS person_uuid4,\n" +
            "            rt.description AS currentRegimenLine,\n" +
            "            ROW_NUMBER() OVER (\n" +
            "                PARTITION BY p.person_uuid \n" +
            "                ORDER BY p.visit_date DESC\n" +
            "            ) AS rn\n" +
            "        FROM public.hiv_art_pharmacy p\n" +
            "        INNER JOIN public.hiv_art_pharmacy_regimens pr \n" +
            "            ON pr.art_pharmacy_id = p.id\n" +
            "        INNER JOIN public.hiv_regimen r \n" +
            "            ON r.id = pr.regimens_id\n" +
            "        INNER JOIN public.hiv_regimen_type rt \n" +
            "            ON rt.id = r.regimen_type_id\n" +
            "        WHERE r.regimen_type_id IN (1,2,3,4,14,16)\n" +
            "          AND p.archived = 0\n" +
            "    ) p\n" +
            "    WHERE rn = 1\n" +
            "),\n" +
            "currentViralLoadResult AS (\n" +
            "    SELECT person_uuid130, currentViralLoad\n" +
            "    FROM (\n" +
            "        SELECT \n" +
            "            sm.patient_uuid AS person_uuid130,\n" +
            "            sm.result_reported AS currentViralLoad,\n" +
            "            ROW_NUMBER() OVER (\n" +
            "                PARTITION BY sm.patient_uuid \n" +
            "                ORDER BY ls.date_sample_collected DESC\n" +
            "            ) AS rank2\n" +
            "        FROM public.laboratory_result sm\n" +
            "        INNER JOIN public.laboratory_test lt ON sm.test_id = lt.id\n" +
            "        INNER JOIN public.laboratory_sample ls ON ls.test_id = lt.id\n" +
            "        INNER JOIN public.base_application_codeset acode \n" +
            "            ON acode.id = lt.viral_load_indication\n" +
            "        WHERE lt.lab_test_id = 16\n" +
            "          AND (sm.archived = 0 OR sm.archived IS NULL)\n" +
            "          AND lt.viral_load_indication != 719\n" +
            "          AND sm.date_result_reported IS NOT NULL\n" +
            "          AND sm.result_reported IS NOT NULL\n" +
            "    ) vl_result\n" +
            "    WHERE rank2 = 1\n" +
            ")\n" +
            "SELECT \n" +
            "    base.patientId,\n" +
            "    base.patientUuid AS personUuid,\n" +
            "    base.facilityId,\n" +
            "    le.visit_id,\n" +
            "    le.dateConfirmedHiv,\n" +
            "    le.dateEnrolledInTreatment,\n" +
            "    le.dateEnrolledInCare,\n" +
            "    le.visitDate,\n" +
            "    le.regimen_line_id AS firstLineArtRegimen,\n" +
            "    le.date_art_started,\n" +
            "    le.cd4_percentage,\n" +
            "    le.baselineCD4,\n" +
            "    hs.hivStatusId,\n" +
            "    hs.hivStatus,\n" +
            "    lv.visit_date AS lastVisitDate,\n" +
            "    levelAdh.display AS adherenceLevel,\n" +
            "    lv.next_appointment,\n" +
            "    lv.tb_status,\n" +
            "    pregnantStatus.display AS pregnancyStatus,\n" +
            "    clinicalStage.display AS currentWhoClinical,\n" +
            "    cd.currentCD4Count,\n" +
            "    vit.captureDate,\n" +
            "    vit.weight,\n" +
            "    vit.height,\n" +
            "    ph.currentRegimenLine,\n" +
            "    vl.currentViralLoad AS viralLoad\n" +
            "FROM transferOutData base\n" +
            "JOIN lastEnrollment le \n" +
            "       ON le.person_uuid = base.patientUuid\n" +
            "LEFT JOIN hivstatus hs \n" +
            "       ON hs.person_id = base.patientUuid\n" +
            "LEFT JOIN lastVisit lv \n" +
            "       ON lv.person_uuid = base.patientUuid\n" +
            "LEFT JOIN cd4 cd \n" +
            "       ON cd.patient_uuid = base.patientUuid\n" +
            "LEFT JOIN lastVitals vit \n" +
            "       ON vit.person_uuid = base.patientUuid\n" +
            "LEFT JOIN pharmacy ph \n" +
            "       ON ph.person_uuid4 = base.patientUuid\n" +
            "LEFT JOIN currentViralLoadResult vl \n" +
            "       ON vl.person_uuid130 = base.patientUuid\n" +
            "LEFT JOIN base_application_codeset levelAdh \n" +
            "       ON levelAdh.code = lv.level_of_adherence\n" +
            "LEFT JOIN base_application_codeset pregnantStatus\n" +
            "       ON pregnantStatus.code = lv.pregnancy_status\n" +
            "LEFT JOIN base_application_codeset clinicalStage\n" +
            "       ON clinicalStage.id = lv.clinical_stage_id\n" +
            "WHERE base.facilityId = :facilityId AND base.patientUuid = :uuid")
    Optional<TransferPatientInfo> getTransferPatientInfo(@Param("uuid") String uuid, @Param("facilityId") Long facilityId);

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
            "SELECT person_uuid, visitDate, tbTreatmentStartDate, tbCompletionDate, status, status_date, CAST(tbTreatmentStartDate + INTERVAL '6 Month' AS DATE) AS intervalDate,\n" +
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
            "AND hap.visit_date <= CAST(NOW() AS DATE)\n" +
            ") pharmacy\n" +
            "LEFT JOIN (\n" +
            "SELECT * FROM (SELECT DISTINCT (person_id) person_id, status_date,\n" +
            "hiv_status, ROW_NUMBER() OVER (PARTITION BY person_id ORDER BY status_date DESC)\n" +
            "FROM hiv_status_tracker WHERE archived=0 AND status_date <= CAST(NOW() AS DATE) )s\n" +
            "WHERE s.row_number=1\n" +
            ")stat ON stat.person_id = pharmacy.person_uuid\n" +
            "WHERE pharmacy.rnk = 1\n" +
            ") completeArtStatus\n" +
            ") currentArtStatus ON currentArtStatus.person_uuid = ho.person_uuid\n" +
            "WHERE archived = 0\n" +
            ") subQ WHERE rnkk = 1\n" +
            ")\n" +
            "SELECT tbStart.pass6Month, tbStart.tbTreatmentStartDate, tbStart.visitDate, tbStart.tbCompletionDate,\n" +
            "CASE WHEN tbStart.pass6Month IS TRUE  AND tbStart.tbCompletionDate = '' THEN true\n" +
            "WHEN tbStart.pass6Month IS TRUE  AND tbStart.tbCompletionDate != '' THEN false\n" +
            "WHEN tbStart.pass6Month IS TRUE  THEN true\n" +
            "END AS showPrompt\n" +
            "FROM tbImpl\n" +
            "LEFT JOIN tbStartDate tbStart ON tbImpl.person_uuid = tbStart.person_uuid\n" +
            "WHERE tbStart.status IN ('Active') \n" +
            "AND tbImpl.person_uuid = ?1", nativeQuery = true)
    TBCompletionStatusDTO findTbClientWithoutCompletionDate(String personUuid);


    @Query(value = "WITH tbStatusImpl AS (\n" +
            "SELECT he.person_uuid FROM hiv_enrollment_commencement he WHERE archived = 0),\n" +
            "tbStatus AS (\n" +
            "SELECT * FROM (\n" +
            "SELECT person_uuid, (CASE WHEN data->'tbIptScreening'->>'status' = 'Presumptive TB and referred for evaluation' THEN 'Presumptive TB'\n" +
            "ELSE data->'tbIptScreening'->>'status' END) tbStatus, date_of_observation,\n" +
            "ROW_NUMBER() OVER (PARTITION BY person_uuid ORDER BY date_of_observation DESC) rankkk\n" +
            "FROM hiv_observation\n" +
            "WHERE archived = 0 AND type = 'Chronic Care' AND data->'tbIptScreening'->>'status' !=''\n" +
            ") subQ WHERE rankkk = 1\n" +
            ")\n" +
            "SELECT tbStat.tbStatus FROM tbStatusImpl tbImpl\n" +
            "LEFT JOIN tbStatus tbStat ON tbImpl.person_uuid = tbStat.person_uuid\n" +
            "WHERE tbImpl.person_uuid = ?1", nativeQuery = true)
    Optional<String> findCurrentTbStatus(String personUuid);


    @Query(value = "SELECT p.id AS id, hts.client_code AS uniqueId, hts.id as htsEncounterId, p.hospital_number AS hospitalNumber, " +
            "p.surname AS surname, p.first_name AS firstName, p.other_name AS otherName, " +
            "hts.date_of_visit AS dateEnrolled, p.date_of_birth AS dateOfBirth, p.uuid AS personUuid, " +
            "CASE WHEN ls.patient_uuid IS NOT NULL THEN TRUE ELSE FALSE END AS hasSample, " +
            "CASE WHEN lr.patient_uuid IS NOT NULL THEN TRUE ELSE FALSE END AS hasResult, " +
            "lr.result_reported AS testResult " +
            "FROM patient_person p " +
            "INNER JOIN ( " +
            "    SELECT DISTINCT ON (patient_uuid) " +
            "        patient_uuid, id, client_code, date_of_visit, observation " +
            "    FROM hts_encounter " +
            "    WHERE COALESCE(observation->>'hivEarlyDetectResult', observation->>'hivEarlyDetect') IN ( " +
            "        'HIV_EARLY_DETECT_RESULT_ANTIGEN_REACTIVE', " +
            "        'HIV_EARLY_DETECT_RESULT_ANTIGEN_+_ANTIBODY_REACTIVE' " +
            "    ) " +
            "    ORDER BY patient_uuid, date_of_visit DESC " +
            ") hts ON CAST(hts.patient_uuid AS TEXT) = CAST(p.uuid AS TEXT) " +
            "LEFT JOIN ( " +
            "    SELECT DISTINCT ON (patient_uuid) patient_uuid, date_sample_collected " +
            "    FROM laboratory_sample " +
            "    WHERE archived = 0 AND LOWER(patient_category) = 'pep' " +
            "    ORDER BY patient_uuid, date_sample_collected DESC " +
            ") ls ON CAST(ls.patient_uuid AS TEXT) = CAST(p.uuid AS TEXT) " +
            "LEFT JOIN ( " +
            "    SELECT DISTINCT ON (lr.patient_uuid) " +
            "        lr.patient_uuid, lr.result_reported, lr.date_result_reported " +
            "    FROM laboratory_result lr " +
            "    INNER JOIN laboratory_test lt ON lt.id = lr.test_id " +
            "    INNER JOIN laboratory_sample lsamp ON lsamp.test_id = lt.id " +
            "    WHERE lr.archived = 0 AND lt.lab_test_id = 16 " +
            "    AND LOWER(lsamp.patient_category) = 'pep' " +
            "    ORDER BY lr.patient_uuid, lr.date_result_reported DESC " +
            ") lr ON CAST(lr.patient_uuid AS TEXT) = CAST(p.uuid AS TEXT) " +
            "WHERE p.archived = 0 " +
            "AND p.facility_id = :facilityId " +
            "AND (lr.result_reported IS NULL OR " +
            "(LOWER(lr.result_reported) NOT LIKE '%negative%' " +
            "AND LOWER(lr.result_reported) NOT LIKE '%undetected%' " +
            "AND TRIM(lr.result_reported) != '0' " +
            "AND TRIM(lr.result_reported) != '0.0')) " +
            "AND (:searchValue IS NULL OR :searchValue = '' OR " +
            "LOWER(p.hospital_number) LIKE LOWER(CONCAT('%', :searchValue, '%')) OR " +
            "LOWER(p.first_name) LIKE LOWER(CONCAT('%', :searchValue, '%')) OR " +
            "LOWER(p.surname) LIKE LOWER(CONCAT('%', :searchValue, '%')) OR " +
            "LOWER(hts.client_code) LIKE LOWER(CONCAT('%', :searchValue, '%'))) " +
            "ORDER BY hts.date_of_visit DESC",
            countQuery = "SELECT COUNT(*) " +
                    "FROM patient_person p " +
                    "INNER JOIN ( " +
                    "    SELECT DISTINCT ON (patient_uuid) " +
                    "        patient_uuid, id, client_code, date_of_visit " +
                    "    FROM hts_encounter " +
                    "    WHERE COALESCE(observation->>'hivEarlyDetectResult', observation->>'hivEarlyDetect') IN ( " +
                    "        'HIV_EARLY_DETECT_RESULT_ANTIGEN_REACTIVE', " +
                    "        'HIV_EARLY_DETECT_RESULT_ANTIGEN_+_ANTIBODY_REACTIVE' " +
                    "    ) " +
                    "    ORDER BY patient_uuid, date_of_visit DESC " +
                    ") hts ON CAST(hts.patient_uuid AS TEXT) = CAST(p.uuid AS TEXT) " +
                    "LEFT JOIN ( " +
                    "    SELECT DISTINCT ON (lr.patient_uuid) " +
                    "        lr.patient_uuid, lr.result_reported " +
                    "    FROM laboratory_result lr " +
                    "    INNER JOIN laboratory_test lt ON lt.id = lr.test_id " +
                    "    INNER JOIN laboratory_sample lsamp ON lsamp.test_id = lt.id " +
                    "    WHERE lr.archived = 0 AND lt.lab_test_id = 16 " +
                    "    AND LOWER(lsamp.patient_category) = 'pep' " +
                    "    ORDER BY lr.patient_uuid, lr.date_result_reported DESC " +
                    ") lr ON CAST(lr.patient_uuid AS TEXT) = CAST(p.uuid AS TEXT) " +
                    "WHERE p.archived = 0 " +
                    "AND p.facility_id = :facilityId " +
                    "AND (lr.result_reported IS NULL OR " +
                    "(LOWER(lr.result_reported) NOT LIKE '%negative%' " +
                    "AND LOWER(lr.result_reported) NOT LIKE '%undetected%' " +
                    "AND TRIM(lr.result_reported) != '0' " +
                    "AND TRIM(lr.result_reported) != '0.0')) " +
                    "AND (:searchValue IS NULL OR :searchValue = '' OR " +
                    "LOWER(p.hospital_number) LIKE LOWER(CONCAT('%', :searchValue, '%')) OR " +
                    "LOWER(p.first_name) LIKE LOWER(CONCAT('%', :searchValue, '%')) OR " +
                    "LOWER(p.surname) LIKE LOWER(CONCAT('%', :searchValue, '%')) OR " +
                    "LOWER(hts.client_code) LIKE LOWER(CONCAT('%', :searchValue, '%')))",
            nativeQuery = true)
    Page<PEPClientProjection> findAllPEPClients(
            @Param("facilityId") Long facilityId,
            @Param("searchValue") String searchValue,
            Pageable pageable);

    // Get all facilities - for facility transfer from dropdown
    @Query(value = "SELECT id, name " +
            "FROM base_organisation_unit " +
            "WHERE organisation_unit_level_id = 4 " +
            "AND name IS NOT NULL " +
            "AND name != '' " +
            "ORDER BY name ASC",
            nativeQuery = true)
    List<FacilityProjection> getAllFacilities();

    // get all client eligible for viral load - using materialized view for performance
    @Query(value = "SELECT patientId, patientUuid, firstName, lastName, otherName, gender, " +
            "dateOfBirth, hospitalNumber, artStartDate, vlEligibilityStatus " +
            "FROM mv_viral_load_eligibility " +
            "WHERE facilityId = :facilityId " +
            "ORDER BY patientId",
            nativeQuery = true)
    List<ViralLoadEligibilityProjection> findAllEligiblePatientsByFacility(@Param("facilityId") Long facilityId);

    // Original complex query - kept for reference and fallback
    @Query(value = "WITH vlEligibility AS (" +
            "    SELECT pp.id AS patientId, pp.uuid AS patientUuid, pp.first_name AS firstName, " +
            "           pp.surname AS lastName, pp.other_name AS otherName, pp.sex AS gender, " +
            "           pp.date_of_birth AS dateOfBirth, pp.hospital_number AS hospitalNumber, " +
            "           hac.visit_date AS artStartDate " +
            "    FROM patient_person pp " +
            "    INNER JOIN hiv_enrollment h ON pp.uuid = h.person_uuid " +
            "    INNER JOIN hiv_art_clinical hac ON hac.hiv_enrollment_uuid = h.uuid " +
            "        AND hac.archived = 0 AND hac.is_commencement = true " +
            "    WHERE pp.archived = 0 AND pp.facility_id = :facilityId " +
            "), " +
            "sample_collection_date AS (" +
            "    SELECT sample.date_sample_collected AS dateOfViralLoadSampleCollection, " +
            "           sample.patient_uuid AS personUuid120 " +
            "    FROM (" +
            "        SELECT lt.viral_load_indication, sm.facility_id, " +
            "               CAST(sm.date_sample_collected AS DATE) AS date_sample_collected, " +
            "               sm.patient_uuid, sm.archived, " +
            "               ROW_NUMBER() OVER (PARTITION BY sm.patient_uuid ORDER BY sm.date_sample_collected DESC) AS rnkk " +
            "        FROM laboratory_sample sm " +
            "        INNER JOIN laboratory_test lt ON lt.id = sm.test_id " +
            "        WHERE lt.lab_test_id = 16 AND sm.archived = 0 " +
            "          AND lt.viral_load_indication != 719 " +
            "          AND sm.date_sample_collected IS NOT NULL " +
            "          AND sm.facility_id = :facilityId " +
            "    ) AS sample " +
            "    WHERE sample.rnkk = 1 " +
            "      AND (sample.archived IS NULL OR sample.archived = 0) " +
            "), " +
            "current_vl_result AS (" +
            "    SELECT vl_result.dateOfCurrentViralLoadSample, vl_result.person_uuid130, " +
            "           vl_result.vlFacility, vl_result.viralLoadIndication, " +
            "           vl_result.currentViralLoad, vl_result.dateOfCurrentViralLoad " +
            "    FROM (" +
            "        SELECT CAST(ls.date_sample_collected AS DATE) AS dateOfCurrentViralLoadSample, " +
            "               sm.patient_uuid AS person_uuid130, " +
            "               sm.facility_id AS vlFacility, " +
            "               sm.archived AS vlArchived, " +
            "               acode.display AS viralLoadIndication, " +
            "               sm.result_reported AS currentViralLoad, " +
            "               CAST(sm.date_result_reported AS DATE) AS dateOfCurrentViralLoad, " +
            "               ROW_NUMBER() OVER (PARTITION BY sm.patient_uuid ORDER BY ls.date_sample_collected DESC) AS rank2 " +
            "        FROM laboratory_result sm " +
            "        INNER JOIN laboratory_test lt ON sm.test_id = lt.id " +
            "        INNER JOIN laboratory_sample ls ON ls.test_id = lt.id " +
            "        INNER JOIN base_application_codeset acode ON acode.id = lt.viral_load_indication " +
            "        WHERE lt.lab_test_id = 16 " +
            "          AND lt.viral_load_indication != 719 " +
            "          AND sm.date_result_reported IS NOT NULL " +
            "          AND sm.result_reported IS NOT NULL " +
            "    ) AS vl_result " +
            "    WHERE vl_result.rank2 = 1 " +
            "      AND vl_result.dateOfCurrentViralLoad <= CAST(NOW() AS DATE) " +
            "      AND (vl_result.vlArchived = 0 OR vl_result.vlArchived IS NULL) " +
            "), " +
            "naive_vl_data AS (" +
            "    SELECT pp.uuid AS nvl_person_uuid, " +
            "           EXTRACT(YEAR FROM AGE(NOW(), pp.date_of_birth)) AS age, " +
            "           ph.visit_date, ph.regimen " +
            "    FROM patient_person pp " +
            "    INNER JOIN (" +
            "        SELECT DISTINCT pharm.person_uuid, pharm.visit_date, pharm.regimen " +
            "        FROM (" +
            "            SELECT DISTINCT hap.person_uuid, hap.visit_date, hr.description AS regimen, " +
            "                   ROW_NUMBER() OVER (PARTITION BY hap.person_uuid ORDER BY hap.visit_date DESC) AS row_number " +
            "            FROM hiv_art_pharmacy hap " +
            "            INNER JOIN hiv_art_pharmacy_regimens hapr ON hapr.art_pharmacy_id = hap.id " +
            "            INNER JOIN hiv_regimen hr ON hr.id = hapr.regimens_id " +
            "            INNER JOIN hiv_regimen_type hrt ON hrt.id = hr.regimen_type_id " +
            "            INNER JOIN hiv_regimen_resolver hrr ON hrr.regimensys = hr.description " +
            "            WHERE hap.archived = 0 AND hrt.id IN (1,2,3,4,14,16) AND hap.facility_id = :facilityId " +
            "        ) AS pharm " +
            "        WHERE pharm.row_number = 1 " +
            "    ) AS ph ON ph.person_uuid = pp.uuid " +
            "    WHERE pp.uuid NOT IN (" +
            "        SELECT ls.patient_uuid " +
            "        FROM laboratory_sample ls " +
            "        INNER JOIN laboratory_test lt ON lt.id = ls.test_id AND lt.lab_test_id = 16 " +
            "        WHERE ls.archived = 0 AND ls.facility_id = :facilityId " +
            "        GROUP BY ls.patient_uuid " +
            "    ) " +
            "), " +
            "currentStatus AS (" +
            "    SELECT person_uuid, " +
            "           (CASE WHEN hiv_status ILIKE '%DEATH%' OR hiv_status ILIKE '%Died%' THEN 'Died' " +
            "                 WHEN(status_date > visit_date AND (hiv_status ILIKE '%stop%' OR hiv_status ILIKE '%out%' OR hiv_status ILIKE '%Invalid %' OR hiv_status ILIKE '%ART Transfer In%'))  THEN hiv_status " +
            "                 ELSE artStatus END) AS status, " +
            "           (CASE WHEN hiv_status ILIKE '%DEATH%' OR hiv_status ILIKE '%Died%'  THEN status_date " +
            "                 WHEN(status_date > visit_date AND (hiv_status ILIKE '%stop%' OR hiv_status ILIKE '%out%' OR hiv_status ILIKE '%Invalid %' OR hiv_status ILIKE '%ART Transfer In%')) THEN status_date " +
            "                 ELSE visit_date END) AS status_date " +
            "    FROM (" +
            "        SELECT person_uuid, " +
            "               (CASE WHEN pharmacy.visitDate + pharmacy.refill_period + INTERVAL '29 day' <= NOW() THEN 'IIT' ELSE 'Active' END) AS artStatus, " +
            "               (CASE WHEN CAST(pharmacy.visitDate + pharmacy.refill_period + INTERVAL '29 day' AS DATE) <= NOW() THEN CAST(pharmacy.visitDate + pharmacy.refill_period + INTERVAL '29 day' AS DATE) ELSE pharmacy.visitDate END) AS visit_date, " +
            "               stat.status_date, stat.hiv_status " +
            "        FROM (" +
            "            SELECT hap.person_uuid, CAST(hap.visit_date AS DATE) AS visitDate, hap.refill_period, " +
            "                   ROW_NUMBER() OVER (PARTITION BY hap.person_uuid ORDER BY hap.visit_date DESC) AS rnk " +
            "            FROM hiv_art_pharmacy hap " +
            "            INNER JOIN hiv_art_pharmacy_regimens pr ON pr.art_pharmacy_id = hap.id " +
            "            INNER JOIN hiv_enrollment h ON h.person_uuid = hap.person_uuid AND h.archived = 0 " +
            "            INNER JOIN hiv_regimen r ON r.id = pr.regimens_id " +
            "            INNER JOIN hiv_regimen_type rt ON rt.id = r.regimen_type_id " +
            "            WHERE r.regimen_type_id IN (1,2,3,4,14,16) " +
            "              AND hap.archived = 0 " +
            "              AND hap.visit_date <= NOW() " +
            "              AND hap.facility_id = :facilityId " +
            "        ) AS pharmacy " +
            "        LEFT JOIN (" +
            "            SELECT s.person_id, s.status_date, s.hiv_status " +
            "            FROM (" +
            "                SELECT DISTINCT person_id, status_date, hiv_status, " +
            "                       ROW_NUMBER() OVER (PARTITION BY person_id ORDER BY status_date DESC) AS row_number " +
            "                FROM hiv_status_tracker " +
            "                WHERE archived = 0 AND status_date <= NOW() " +
            "            ) AS s " +
            "            WHERE s.row_number = 1 " +
            "        ) AS stat ON stat.person_id = pharmacy.person_uuid " +
            "        WHERE pharmacy.rnk = 1 " +
            "    ) AS completeArtStatus " +
            "), " +
            "eligibilityCalculation AS (" +
            "    SELECT vlE.patientId, vlE.patientUuid, vlE.firstName, vlE.lastName, vlE.otherName, " +
            "           vlE.gender, vlE.dateOfBirth, vlE.hospitalNumber, vlE.artStartDate, " +
            "           (CASE " +
            "            WHEN ct.status ILIKE '%IIT%' THEN FALSE " +
            "            WHEN ct.status ILIKE '%out%' THEN FALSE " +
            "            WHEN ct.status ILIKE '%DEATH%' THEN FALSE " +
            "            WHEN ct.status ILIKE '%stop%' THEN FALSE " +
            "            WHEN (nvd.age >= 15 AND nvd.regimen ILIKE '%DTG%' AND vlE.artStartDate + 91 < NOW() AND ct.status ILIKE '%ACTIVE%') THEN TRUE " +
            "            WHEN (nvd.age >= 15 AND nvd.regimen NOT ILIKE '%DTG%' AND vlE.artStartDate + 181 < NOW() AND ct.status ILIKE '%ACTIVE%') THEN TRUE " +
            "            WHEN (nvd.age <= 15 AND vlE.artStartDate + 181 < NOW() AND ct.status ILIKE '%ACTIVE%') THEN TRUE " +
            "            WHEN CAST(NULLIF(REGEXP_REPLACE(cvlr.currentViralLoad, '[^0-9]', '', 'g'), '') AS INTEGER) IS NULL " +
            "                 AND scd.dateOfViralLoadSampleCollection IS NULL AND cvlr.dateOfCurrentViralLoad IS NULL " +
            "                 AND CAST(vlE.artStartDate AS DATE) + 181 < NOW() AND ct.status ILIKE '%ACTIVE%' THEN TRUE " +
            "            WHEN CAST(NULLIF(REGEXP_REPLACE(cvlr.currentViralLoad, '[^0-9]', '', 'g'), '') AS INTEGER) IS NULL " +
            "                 AND scd.dateOfViralLoadSampleCollection IS NOT NULL AND cvlr.dateOfCurrentViralLoad IS NULL " +
            "                 AND CAST(vlE.artStartDate AS DATE) + 91 < NOW() AND ct.status ILIKE '%ACTIVE%' THEN TRUE " +
            "            WHEN CAST(NULLIF(REGEXP_REPLACE(cvlr.currentViralLoad, '[^0-9]', '', 'g'), '') AS INTEGER) < 1000 " +
            "                 AND (scd.dateOfViralLoadSampleCollection < cvlr.dateOfCurrentViralLoad OR scd.dateOfViralLoadSampleCollection IS NULL) " +
            "                 AND CAST(cvlr.dateOfCurrentViralLoad AS DATE) + 181 < NOW() AND ct.status ILIKE '%ACTIVE%' THEN TRUE " +
            "            WHEN CAST(NULLIF(REGEXP_REPLACE(cvlr.currentViralLoad, '[^0-9]', '', 'g'), '') AS INTEGER) < 1000 " +
            "                 AND (scd.dateOfViralLoadSampleCollection > cvlr.dateOfCurrentViralLoad OR cvlr.dateOfCurrentViralLoad IS NULL) " +
            "                 AND CAST(scd.dateOfViralLoadSampleCollection AS DATE) + 91 < NOW() AND ct.status ILIKE '%ACTIVE%' THEN TRUE " +
            "            WHEN CAST(NULLIF(REGEXP_REPLACE(cvlr.currentViralLoad, '[^0-9]', '', 'g'), '') AS INTEGER) > 1000 " +
            "                 AND (scd.dateOfViralLoadSampleCollection < cvlr.dateOfCurrentViralLoad OR scd.dateOfViralLoadSampleCollection IS NULL) " +
            "                 AND CAST(cvlr.dateOfCurrentViralLoad AS DATE) + 91 < NOW() AND ct.status ILIKE '%ACTIVE%' THEN TRUE " +
            "            WHEN CAST(NULLIF(REGEXP_REPLACE(cvlr.currentViralLoad, '[^0-9]', '', 'g'), '') AS INTEGER) > 1000 " +
            "                 AND (scd.dateOfViralLoadSampleCollection > cvlr.dateOfCurrentViralLoad OR cvlr.dateOfCurrentViralLoad IS NULL) " +
            "                 AND CAST(scd.dateOfViralLoadSampleCollection AS DATE) + 91 < NOW() AND ct.status ILIKE '%ACTIVE%' THEN TRUE " +
            "            ELSE FALSE END) AS vlEligibilityStatus " +
            "    FROM vlEligibility vlE " +
            "    LEFT JOIN naive_vl_data nvd ON nvd.nvl_person_uuid = vlE.patientUuid " +
            "    LEFT JOIN currentStatus ct ON ct.person_uuid = vlE.patientUuid " +
            "    LEFT JOIN sample_collection_date scd ON scd.personUuid120 = vlE.patientUuid " +
            "    LEFT JOIN current_vl_result cvlr ON cvlr.person_uuid130 = vlE.patientUuid " +
            ") " +
            "SELECT patientId, patientUuid, firstName, lastName, otherName, gender, " +
            "       dateOfBirth, hospitalNumber, artStartDate, vlEligibilityStatus " +
            "FROM eligibilityCalculation " +
            "WHERE vlEligibilityStatus = TRUE " +
            "ORDER BY patientId",
            nativeQuery = true)
    List<ViralLoadEligibilityProjection> findAllEligiblePatientsByFacilityLegacy(@Param("facilityId") Long facilityId);

    Optional<Observation> findByEnrollmentSessionUuidAndTypeAndArchived(String enrollmentSessionUuid, String type, Integer archived);
    boolean existsByEnrollmentSessionUuidAndTypeAndArchived(String enrollmentSessionUuid, String type, Integer archived);
    List<Observation> findAllByEnrollmentSessionUuidAndArchived(String enrollmentSessionUuid, Integer archived);

//    @Modifying
//    @Transactional
//    @Query(value = "UPDATE hts_encounter " +
//            "SET observation = jsonb_set(" +
//            "                     jsonb_set(observation, '{finalHivTestResult}', to_jsonb(CAST(:finalResult AS text)), true), " +
//            "                     '{hivEarlyDetectResult}', to_jsonb(CAST('' AS text)), true" +
//            "                   ) " +
//            "WHERE id = :htsEncounterId AND patient_uuid = :patientUuid",
//            nativeQuery = true)
//    int updateFinalHivTestResult(@Param("htsEncounterId") Long htsEncounterId,
//                                 @Param("patientUuid") String patientUuid,
//                                 @Param("finalResult") String finalResult);


    @Modifying
    @Transactional
    @Query(value = "UPDATE hts_encounter " +
            "SET observation = jsonb_set(" +
            "                     jsonb_set(" +
            "                       jsonb_set(observation, '{finalHivTestResult}', to_jsonb(CAST(:finalResult AS text)), true), " +
            "                       '{hivEarlyDetectResult}', to_jsonb(CAST('' AS text)), true" +
            "                     ), " +
            "                     '{suspectedAcuteInfection}', to_jsonb(CAST('' AS text)), true" +
            "                   ) " +
            "WHERE id = :htsEncounterId AND patient_uuid = :patientUuid",
            nativeQuery = true)
    int updateFinalHivTestResult(@Param("htsEncounterId") Long htsEncounterId,
                                 @Param("patientUuid") String patientUuid,
                                 @Param("finalResult") String finalResult);

}
