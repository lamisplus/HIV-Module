package org.lamisplus.modules.hiv.repositories;

import org.lamisplus.modules.hiv.domain.dto.LabReport;
import org.lamisplus.modules.hiv.domain.dto.MedicationInfo;
import org.lamisplus.modules.hiv.domain.dto.TransferPatientInfo;
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
    Optional<String>  getIPTEligiblePatientUuid(Long facilityId, String uuid);

    
    List<Observation> getAllByPersonAndFacilityId(Person person, Long orgId);


    @Query(nativeQuery = true,  value=" WITH transferForm AS (\n" +
            " SELECT\n" +
            "     p.id AS patientId,\n" +
            "     p.uuid AS personUuid,\n" +
            "     p.facility_id AS facilityId,\n" +
            "     facility.name AS facilityName,\n" +
            "     facility_lga.name AS lga,\n" +
            "     facility_state.name AS state,\n" +
            "                e.date_confirmed_hiv AS dateConfirmedHiv,\n" +
            "     e.date_of_registration AS dateEnrolledInCare,\n" +
            "     cc.body_weight AS weight,\n" +
            "     cc.height AS height,\n" +
            "            lastVisit.visit_date AS dateOfLastClinicalVisist,\n" +
            "     lastVisit.pregnancy_status AS pregnancyStatus,\n" +
            "     lastVisit.adherence_level AS adherenceLevel,\n" +
            "     bac.display AS currentWhoClinical,\n" +
            "     cd4.currentCD4Count AS currentCD4Count,\n" +
            "     bcd4.baseLineCD4Count AS baselineCD4,\n" +
            "            ca.visit_date AS dateEnrolledInTreatment,\n" +
            "     eac.last_viral_load AS viralLoad,\n" +
            "     pharmacy.currentRegimenLine AS currentRegimenLine,\n" +
            "     ca.regline AS firstLineArtRegimen,\n" +
            "             hivstatus.id as hivStatusId,\n" +
            "     hivstatus.hiv_status as hivStatus\n" +
            " FROM\n" +
            "     patient_person p\n" +
            "            INNER JOIN hiv_enrollment e ON p.uuid = e.person_uuid\n" +
            " INNER JOIN\n" +
            "(SELECT TRUE as commenced, hac.person_uuid, hac.visit_date, hr.description AS currentRegimenLine, hrt.description AS regline  FROM hiv_art_clinical hac\n" +
            "LEFT JOIN hiv_regimen hr ON hr.id = hac.regimen_id\n" +
            "LEFT JOIN hiv_regimen_type hrt ON hrt.id = hac.regimen_type_id\n" +
            "WHERE hac.archived=0 AND hac.is_commencement is true\n" +
            "GROUP BY hac.person_uuid, hac.visit_date, hac.pregnancy_status, hr.description, hrt.description\n" +
            ")ca ON p.uuid = ca.person_uuid\n" +
            "            \n" +
            " LEFT JOIN (\n" +
            "     SELECT DISTINCT ON (tvs.person_uuid)\n" +
            "         tvs.person_uuid,\n" +
            "         MAX(tvs.capture_date) AS lasVital,\n" +
            "         tvs.body_weight,\n" +
            "         tvs.height,\n" +
            "         ca.commenced,\n" +
            "         ca.visit_date\n" +
            "     FROM\n" +
            "         triage_vital_sign tvs\n" +
            "     INNER JOIN (\n" +
            "         SELECT\n" +
            "             TRUE AS commenced,\n" +
            "             hac.person_uuid,\n" +
            "             hac.visit_date\n" +
            "         FROM\n" +
            "             hiv_art_clinical hac\n" +
            "         WHERE\n" +
            "             hac.archived = 0\n" +
            "             AND hac.is_commencement IS TRUE\n" +
            "         GROUP BY\n" +
            "             hac.person_uuid,\n" +
            "             hac.visit_date\n" +
            "     ) ca ON ca.person_uuid = tvs.person_uuid\n" +
            "     GROUP BY\n" +
            "         tvs.body_weight,\n" +
            "         tvs.height,\n" +
            "         tvs.person_uuid,\n" +
            "         ca.commenced,\n" +
            "         ca.visit_date,\n" +
            "         tvs.capture_date\n" +
            "     ORDER BY\n" +
            "         tvs.person_uuid,\n" +
            "         tvs.capture_date DESC\n" +
            " ) cc ON cc.person_uuid = p.uuid\n" +
            "            LEFT JOIN (\n" +
            " \n" +
            "            \t\t\t\tSELECT * FROM (\t\t\n" +
            "SELECT person_uuid, visit_date, adherence_level,next_appointment, tb_status, pregnancy_status, facility_id,clinical_stage_id, \n" +
            "ROW_NUMBER() OVER (PARTITION BY person_uuid ORDER BY visit_date DESC) AS row\n" +
            "FROM hiv_art_clinical\n" +
            "\tWHERE archived = 0\n" +
            "\t\t\t\t\t\t\t) visit WHERE row = 1\n" +
            "            ) lastVisit ON p.uuid = lastVisit.person_uuid\n" +
            " INNER JOIN base_organisation_unit facility ON facility.id = p.facility_id\n" +
            " INNER JOIN base_organisation_unit facility_lga ON facility_lga.id = facility.parent_organisation_unit_id\n" +
            " INNER JOIN base_organisation_unit facility_state ON facility_state.id = facility_lga.parent_organisation_unit_id\n" +
            " LEFT JOIN base_application_codeset bac ON bac.id = lastVisit.clinical_stage_id\n" +
            " LEFT JOIN hiv_eac eac ON eac.person_uuid = p.uuid\n" +
            " LEFT JOIN (\n" +
            "     SELECT DISTINCT ON (sm.patient_uuid)\n" +
            "         sm.patient_uuid,\n" +
            "         sm.result_reported AS currentCD4Count,\n" +
            "         sm.date_result_reported\n" +
            "     FROM\n" +
            "         public.laboratory_result sm\n" +
            "     INNER JOIN public.laboratory_test lt ON sm.test_id = lt.id\n" +
            "     WHERE\n" +
            "         lt.lab_test_id IN (1, 50)\n" +
            "         AND sm.date_result_reported IS NOT NULL\n" +
            "         AND sm.archived = 0\n" +
            "     ORDER BY\n" +
            "         sm.patient_uuid,\n" +
            "         sm.date_result_reported DESC\n" +
            " ) cd4 ON cd4.patient_uuid = p.uuid\n" +
            " LEFT JOIN (\n" +
            "     SELECT\n" +
            "         COALESCE(\n" +
            "             CAST(cd_4 AS VARCHAR),\n" +
            "             cd4_semi_quantitative\n" +
            "         ) AS baseLineCD4Count,\n" +
            "         person_uuid\n" +
            "     FROM\n" +
            "         public.hiv_art_clinical\n" +
            "     WHERE\n" +
            "         is_commencement IS TRUE\n" +
            "         AND archived = 0\n" +
            "         AND cd_4 != 0\n" +
            " ) bcd4 ON bcd4.person_uuid = p.uuid\n" +
            "                LEFT JOIN (\n" +
            "            SELECT * FROM (\n" +
            "     SELECT\n" +
            "            id,\n" +
            "            person_id,\n" +
            "            hiv_status, status_date,\n" +
            "            ROW_NUMBER() OVER (PARTITION BY person_id ORDER BY status_date DESC) AS rn\n" +
            "            FROM hiv_status_tracker ) h where rn = 1\n" +
            " ) hivstatus ON ca.person_uuid = hivstatus.person_id\n" +
            "            \n" +
            "            LEFT JOIN (\n" +
            "            SELECT * FROM (\n" +
            "            SELECT p.person_uuid as person_uuid40, COALESCE(ds_model.display, p.dsd_model_type) as dsdModel, p.visit_date as lastPickupDate,\n" +
            "    r.description as currentARTRegimen, rt.description as currentRegimenLine,\n" +
            "    p.next_appointment as nextPickupDate,\n" +
            "    ROW_NUMBER() OVER (PARTITION BY p.person_uuid ORDER BY p.visit_date DESC) AS rn\n" +
            "            from public.hiv_art_pharmacy p\n" +
            "      INNER JOIN public.hiv_art_pharmacy_regimens pr\n" +
            "     ON pr.art_pharmacy_id = p.id\n" +
            "      INNER JOIN public.hiv_regimen r on r.id = pr.regimens_id\n" +
            "      INNER JOIN public.hiv_regimen_type rt on rt.id = r.regimen_type_id\n" +
            "            left JOIN base_application_codeset ds_model on ds_model.code = p.dsd_model_type \n" +
            "            WHERE r.regimen_type_id in (1,2,3,4,14)\n" +
            "              AND  p.archived = 0) p where rn = 1\n" +
            " ) pharmacy ON ca.person_uuid = pharmacy.person_uuid40\n" +
            "            WHERE p.facility_id = :facility_id AND p.archived = 0\n" +
            "            )\n" +
            "            SELECT\n" +
            " patientId,\n" +
            " personUuid,\n" +
            " facilityId,\n" +
            " dateEnrolledInTreatment,\n" +
            "            dateOfLastClinicalVisist,\n" +
            " facilityName,\n" +
            " lga,\n" +
            " state,\n" +
            " weight,\n" +
            " height,\n" +
            " pregnancyStatus,\n" +
            " dateEnrolledInCare,\n" +
            " dateConfirmedHiv,\n" +
            " adherenceLevel,\n" +
            " currentWhoClinical,\n" +
            " currentCD4Count,\n" +
            " baselineCD4,\n" +
            " viralLoad,\n" +
            " currentRegimenLine,\n" +
            " firstLineArtRegimen,\n" +
            "            hivStatusId,\n" +
            " hivStatus\n" +
            "            FROM\n" +
            " transferForm\n" +
            "            WHERE\n" +
            " personUuid = :uuid ")
    Optional<TransferPatientInfo> getTransferPatientInfo( String uuid, Long facility_id);

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



  @Query(value = "SELECT data->'chronicCondition'->>'hypertensive' AS hypertensive_value FROM public.hiv_observation WHERE type = 'Chronic Care' and facility_id = ?1 and person_uuid = ?2  AND archived = 0 AND data->'chronicCondition'->>'hypertensive' = 'Yes' limit 1", nativeQuery = true)
  Optional<String> getIsHypertensive(Long facilityId, String uuid);
  
}
