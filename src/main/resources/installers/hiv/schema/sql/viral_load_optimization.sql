-- Viral Load Eligibility Query Optimization
-- Creates indexes and materialized view for performance

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_patient_person_facility_archived ON patient_person(facility_id, archived);
CREATE INDEX IF NOT EXISTS idx_hiv_enrollment_person_uuid ON hiv_enrollment(person_uuid, archived);
CREATE INDEX IF NOT EXISTS idx_hiv_art_clinical_enrollment_commencement ON hiv_art_clinical(hiv_enrollment_uuid, is_commencement, archived);
CREATE INDEX IF NOT EXISTS idx_laboratory_sample_patient_facility ON laboratory_sample(patient_uuid, facility_id, archived, date_sample_collected);
CREATE INDEX IF NOT EXISTS idx_laboratory_test_lab_test_id ON laboratory_test(lab_test_id, viral_load_indication);
CREATE INDEX IF NOT EXISTS idx_laboratory_result_patient_date ON laboratory_result(patient_uuid, date_result_reported, archived);
CREATE INDEX IF NOT EXISTS idx_hiv_art_pharmacy_person_facility ON hiv_art_pharmacy(person_uuid, facility_id, archived, visit_date);
CREATE INDEX IF NOT EXISTS idx_hiv_status_tracker_person_date ON hiv_status_tracker(person_id, status_date, archived);
CREATE INDEX IF NOT EXISTS idx_hiv_art_pharmacy_regimens_art_id ON hiv_art_pharmacy_regimens(art_pharmacy_id, regimens_id);
CREATE INDEX IF NOT EXISTS idx_hiv_regimen_type_id ON hiv_regimen(regimen_type_id);

-- Create Materialized View
DROP MATERIALIZED VIEW IF EXISTS mv_viral_load_eligibility;

CREATE MATERIALIZED VIEW mv_viral_load_eligibility AS
WITH vlEligibility AS (
    SELECT pp.id AS patientId, pp.uuid AS patientUuid, pp.first_name AS firstName,
           pp.surname AS lastName, pp.other_name AS otherName, pp.sex AS gender,
           pp.date_of_birth AS dateOfBirth, pp.hospital_number AS hospitalNumber,
           hac.visit_date AS artStartDate, pp.facility_id AS facilityId
    FROM patient_person pp
    INNER JOIN hiv_enrollment h ON pp.uuid = h.person_uuid
    INNER JOIN hiv_art_clinical hac ON hac.hiv_enrollment_uuid = h.uuid
        AND hac.archived = 0 AND hac.is_commencement = true
    WHERE pp.archived = 0
),
sample_collection_date AS (
    SELECT sample.date_sample_collected AS dateOfViralLoadSampleCollection,
           sample.patient_uuid AS personUuid120,
           sample.facility_id
    FROM (
        SELECT lt.viral_load_indication, sm.facility_id,
               CAST(sm.date_sample_collected AS DATE) AS date_sample_collected,
               sm.patient_uuid, sm.archived,
               ROW_NUMBER() OVER (PARTITION BY sm.patient_uuid, sm.facility_id ORDER BY sm.date_sample_collected DESC) AS rnkk
        FROM laboratory_sample sm
        INNER JOIN laboratory_test lt ON lt.id = sm.test_id
        WHERE lt.lab_test_id = 16 AND sm.archived = 0
          AND lt.viral_load_indication != 719
          AND sm.date_sample_collected IS NOT NULL
    ) AS sample
    WHERE sample.rnkk = 1
      AND (sample.archived IS NULL OR sample.archived = 0)
),
current_vl_result AS (
    SELECT vl_result.dateOfCurrentViralLoadSample, vl_result.person_uuid130,
           vl_result.vlFacility, vl_result.viralLoadIndication,
           vl_result.currentViralLoad, vl_result.dateOfCurrentViralLoad
    FROM (
        SELECT CAST(ls.date_sample_collected AS DATE) AS dateOfCurrentViralLoadSample,
               sm.patient_uuid AS person_uuid130,
               sm.facility_id AS vlFacility,
               sm.archived AS vlArchived,
               acode.display AS viralLoadIndication,
               sm.result_reported AS currentViralLoad,
               CAST(sm.date_result_reported AS DATE) AS dateOfCurrentViralLoad,
               ROW_NUMBER() OVER (PARTITION BY sm.patient_uuid, sm.facility_id ORDER BY ls.date_sample_collected DESC) AS rank2
        FROM laboratory_result sm
        INNER JOIN laboratory_test lt ON sm.test_id = lt.id
        INNER JOIN laboratory_sample ls ON ls.test_id = lt.id
        INNER JOIN base_application_codeset acode ON acode.id = lt.viral_load_indication
        WHERE lt.lab_test_id = 16
          AND lt.viral_load_indication != 719
          AND sm.date_result_reported IS NOT NULL
          AND sm.result_reported IS NOT NULL
    ) AS vl_result
    WHERE vl_result.rank2 = 1
      AND vl_result.dateOfCurrentViralLoad <= CAST(NOW() AS DATE)
      AND (vl_result.vlArchived = 0 OR vl_result.vlArchived IS NULL)
),
naive_vl_data AS (
    SELECT pp.uuid AS nvl_person_uuid,
           EXTRACT(YEAR FROM AGE(NOW(), pp.date_of_birth)) AS age,
           ph.visit_date, ph.regimen, ph.facility_id
    FROM patient_person pp
    INNER JOIN (
        SELECT DISTINCT pharm.person_uuid, pharm.visit_date, pharm.regimen, pharm.facility_id
        FROM (
            SELECT DISTINCT hap.person_uuid, hap.visit_date, hr.description AS regimen,
                   hap.facility_id,
                   ROW_NUMBER() OVER (PARTITION BY hap.person_uuid, hap.facility_id ORDER BY hap.visit_date DESC) AS row_number
            FROM hiv_art_pharmacy hap
            INNER JOIN hiv_art_pharmacy_regimens hapr ON hapr.art_pharmacy_id = hap.id
            INNER JOIN hiv_regimen hr ON hr.id = hapr.regimens_id
            INNER JOIN hiv_regimen_type hrt ON hrt.id = hr.regimen_type_id
            INNER JOIN hiv_regimen_resolver hrr ON hrr.regimensys = hr.description
            WHERE hap.archived = 0 AND hrt.id IN (1,2,3,4,14,16)
        ) AS pharm
        WHERE pharm.row_number = 1
    ) AS ph ON ph.person_uuid = pp.uuid
    LEFT JOIN (
        SELECT ls.patient_uuid, ls.facility_id
        FROM laboratory_sample ls
        INNER JOIN laboratory_test lt ON lt.id = ls.test_id AND lt.lab_test_id = 16
        WHERE ls.archived = 0
        GROUP BY ls.patient_uuid, ls.facility_id
    ) vl_samples ON vl_samples.patient_uuid = pp.uuid AND vl_samples.facility_id = ph.facility_id
    WHERE vl_samples.patient_uuid IS NULL
),
currentStatus AS (
    SELECT person_uuid, facility_id,
           (CASE WHEN hiv_status ILIKE '%DEATH%' OR hiv_status ILIKE '%Died%' THEN 'Died'
                 WHEN(status_date > visit_date AND (hiv_status ILIKE '%stop%' OR hiv_status ILIKE '%out%' OR hiv_status ILIKE '%Invalid %' OR hiv_status ILIKE '%ART Transfer In%'))  THEN hiv_status
                 ELSE artStatus END) AS status,
           (CASE WHEN hiv_status ILIKE '%DEATH%' OR hiv_status ILIKE '%Died%'  THEN status_date
                 WHEN(status_date > visit_date AND (hiv_status ILIKE '%stop%' OR hiv_status ILIKE '%out%' OR hiv_status ILIKE '%Invalid %' OR hiv_status ILIKE '%ART Transfer In%')) THEN status_date
                 ELSE visit_date END) AS status_date
    FROM (
        SELECT person_uuid, facility_id,
               (CASE WHEN pharmacy.visitDate + pharmacy.refill_period + INTERVAL '29 day' <= NOW() THEN 'IIT' ELSE 'Active' END) AS artStatus,
               (CASE WHEN CAST(pharmacy.visitDate + pharmacy.refill_period + INTERVAL '29 day' AS DATE) <= NOW() THEN CAST(pharmacy.visitDate + pharmacy.refill_period + INTERVAL '29 day' AS DATE) ELSE pharmacy.visitDate END) AS visit_date,
               stat.status_date, stat.hiv_status
        FROM (
            SELECT hap.person_uuid, hap.facility_id, CAST(hap.visit_date AS DATE) AS visitDate, hap.refill_period,
                   ROW_NUMBER() OVER (PARTITION BY hap.person_uuid, hap.facility_id ORDER BY hap.visit_date DESC) AS rnk
            FROM hiv_art_pharmacy hap
            INNER JOIN hiv_art_pharmacy_regimens pr ON pr.art_pharmacy_id = hap.id
            INNER JOIN hiv_enrollment h ON h.person_uuid = hap.person_uuid AND h.archived = 0
            INNER JOIN hiv_regimen r ON r.id = pr.regimens_id
            INNER JOIN hiv_regimen_type rt ON rt.id = r.regimen_type_id
            WHERE r.regimen_type_id IN (1,2,3,4,14,16)
              AND hap.archived = 0
              AND hap.visit_date <= NOW()
        ) AS pharmacy
        LEFT JOIN (
            SELECT s.person_id, s.status_date, s.hiv_status
            FROM (
                SELECT DISTINCT person_id, status_date, hiv_status,
                       ROW_NUMBER() OVER (PARTITION BY person_id ORDER BY status_date DESC) AS row_number
                FROM hiv_status_tracker
                WHERE archived = 0 AND status_date <= NOW()
            ) AS s
            WHERE s.row_number = 1
        ) AS stat ON stat.person_id = pharmacy.person_uuid
        WHERE pharmacy.rnk = 1
    ) AS completeArtStatus
),
eligibilityCalculation AS (
    SELECT vlE.patientId, vlE.patientUuid, vlE.firstName, vlE.lastName, vlE.otherName,
           vlE.gender, vlE.dateOfBirth, vlE.hospitalNumber, vlE.artStartDate, vlE.facilityId,
           (CASE
            WHEN ct.status ILIKE '%IIT%' THEN FALSE
            WHEN ct.status ILIKE '%out%' THEN FALSE
            WHEN ct.status ILIKE '%DEATH%' THEN FALSE
            WHEN ct.status ILIKE '%stop%' THEN FALSE
            WHEN (nvd.age >= 15 AND nvd.regimen ILIKE '%DTG%' AND vlE.artStartDate + 91 < NOW() AND ct.status ILIKE '%ACTIVE%') THEN TRUE
            WHEN (nvd.age >= 15 AND nvd.regimen NOT ILIKE '%DTG%' AND vlE.artStartDate + 181 < NOW() AND ct.status ILIKE '%ACTIVE%') THEN TRUE
            WHEN (nvd.age <= 15 AND vlE.artStartDate + 181 < NOW() AND ct.status ILIKE '%ACTIVE%') THEN TRUE
            WHEN CAST(NULLIF(REGEXP_REPLACE(cvlr.currentViralLoad, '[^0-9]', '', 'g'), '') AS INTEGER) IS NULL
                 AND scd.dateOfViralLoadSampleCollection IS NULL AND cvlr.dateOfCurrentViralLoad IS NULL
                 AND CAST(vlE.artStartDate AS DATE) + 181 < NOW() AND ct.status ILIKE '%ACTIVE%' THEN TRUE
            WHEN CAST(NULLIF(REGEXP_REPLACE(cvlr.currentViralLoad, '[^0-9]', '', 'g'), '') AS INTEGER) IS NULL
                 AND scd.dateOfViralLoadSampleCollection IS NOT NULL AND cvlr.dateOfCurrentViralLoad IS NULL
                 AND CAST(vlE.artStartDate AS DATE) + 91 < NOW() AND ct.status ILIKE '%ACTIVE%' THEN TRUE
            WHEN CAST(NULLIF(REGEXP_REPLACE(cvlr.currentViralLoad, '[^0-9]', '', 'g'), '') AS INTEGER) < 1000
                 AND (scd.dateOfViralLoadSampleCollection < cvlr.dateOfCurrentViralLoad OR scd.dateOfViralLoadSampleCollection IS NULL)
                 AND CAST(cvlr.dateOfCurrentViralLoad AS DATE) + 181 < NOW() AND ct.status ILIKE '%ACTIVE%' THEN TRUE
            WHEN CAST(NULLIF(REGEXP_REPLACE(cvlr.currentViralLoad, '[^0-9]', '', 'g'), '') AS INTEGER) < 1000
                 AND (scd.dateOfViralLoadSampleCollection > cvlr.dateOfCurrentViralLoad OR cvlr.dateOfCurrentViralLoad IS NULL)
                 AND CAST(scd.dateOfViralLoadSampleCollection AS DATE) + 91 < NOW() AND ct.status ILIKE '%ACTIVE%' THEN TRUE
            WHEN CAST(NULLIF(REGEXP_REPLACE(cvlr.currentViralLoad, '[^0-9]', '', 'g'), '') AS INTEGER) > 1000
                 AND (scd.dateOfViralLoadSampleCollection < cvlr.dateOfCurrentViralLoad OR scd.dateOfViralLoadSampleCollection IS NULL)
                 AND CAST(cvlr.dateOfCurrentViralLoad AS DATE) + 91 < NOW() AND ct.status ILIKE '%ACTIVE%' THEN TRUE
            WHEN CAST(NULLIF(REGEXP_REPLACE(cvlr.currentViralLoad, '[^0-9]', '', 'g'), '') AS INTEGER) > 1000
                 AND (scd.dateOfViralLoadSampleCollection > cvlr.dateOfCurrentViralLoad OR cvlr.dateOfCurrentViralLoad IS NULL)
                 AND CAST(scd.dateOfViralLoadSampleCollection AS DATE) + 91 < NOW() AND ct.status ILIKE '%ACTIVE%' THEN TRUE
            ELSE FALSE END) AS vlEligibilityStatus
    FROM vlEligibility vlE
    LEFT JOIN naive_vl_data nvd ON nvd.nvl_person_uuid = vlE.patientUuid AND nvd.facility_id = vlE.facilityId
    LEFT JOIN currentStatus ct ON ct.person_uuid = vlE.patientUuid AND ct.facility_id = vlE.facilityId
    LEFT JOIN sample_collection_date scd ON scd.personUuid120 = vlE.patientUuid AND scd.facility_id = vlE.facilityId
    LEFT JOIN current_vl_result cvlr ON cvlr.person_uuid130 = vlE.patientUuid AND cvlr.vlFacility = vlE.facilityId
)
SELECT patientId, patientUuid, firstName, lastName, otherName, gender,
       dateOfBirth, hospitalNumber, artStartDate, vlEligibilityStatus, facilityId
FROM eligibilityCalculation
WHERE vlEligibilityStatus = TRUE
ORDER BY facilityId, patientId;

-- Create indexes on materialized view
CREATE INDEX IF NOT EXISTS idx_mv_vl_facility_patient ON mv_viral_load_eligibility(facilityId, patientId);
CREATE INDEX IF NOT EXISTS idx_mv_vl_patient_uuid ON mv_viral_load_eligibility(patientUuid);
