-- ============================================================================
-- QUICK TEST SCRIPT - Run this FIRST in pgAdmin to test on a small sample
-- ============================================================================
-- This script will show you what will happen WITHOUT making changes
-- Once you verify it looks correct, run the full migration script
-- ============================================================================

-- 1. CHECK: How many records need migration?
SELECT
    'hiv_enrollment_commencement' AS table_name,
    COUNT(*) AS total_active_records,
    COUNT(CASE WHEN enrollment_session_uuid IS NULL OR enrollment_session_uuid = '' THEN 1 END) AS needs_migration,
    COUNT(CASE WHEN enrollment_session_uuid LIKE 'MIGRATED-%' THEN 1 END) AS already_migrated,
    COUNT(CASE WHEN enrollment_session_uuid IS NOT NULL
              AND enrollment_session_uuid != ''
              AND enrollment_session_uuid NOT LIKE 'MIGRATED-%' THEN 1 END) AS has_regular_uuid
FROM hiv_enrollment_commencement
WHERE archived = 0

UNION ALL

SELECT
    'hiv_initial_clinical_evaluation' AS table_name,
    COUNT(*) AS total_active_records,
    COUNT(CASE WHEN enrollment_session_uuid IS NULL OR enrollment_session_uuid = '' THEN 1 END) AS needs_migration,
    COUNT(CASE WHEN enrollment_session_uuid LIKE 'MIGRATED-%' THEN 1 END) AS already_migrated,
    COUNT(CASE WHEN enrollment_session_uuid IS NOT NULL
              AND enrollment_session_uuid != ''
              AND enrollment_session_uuid NOT LIKE 'MIGRATED-%' THEN 1 END) AS has_regular_uuid
FROM hiv_initial_clinical_evaluation
WHERE archived = 0;


-- 2. PREVIEW: Sample of 10 Enrollment records that WILL BE updated
SELECT
    ec.id AS enrollment_id,
    p.hospital_number,
    p.first_name || ' ' || p.surname AS patient_name,
    ec.date_enrolled_in_hiv_care AS enrollment_date,
    ec.date_art_started AS art_start_date,
    ec.enrollment_session_uuid AS current_uuid,
    CONCAT('MIGRATED-', ec.uuid) AS new_uuid_will_be
FROM hiv_enrollment_commencement ec
JOIN patient_person p ON p.uuid = ec.person_uuid
WHERE ec.archived = 0
  AND (ec.enrollment_session_uuid IS NULL OR ec.enrollment_session_uuid = '')
ORDER BY ec.date_art_started DESC
LIMIT 10;


-- 3. PREVIEW: Sample of 10 ICE records that WILL BE linked
SELECT
    ice.id AS ice_id,
    p.hospital_number,
    p.first_name || ' ' || p.surname AS patient_name,
    ice.visit_date AS ice_date,
    ice.enrollment_session_uuid AS current_ice_uuid,
    ec.enrollment_uuid AS matching_enrollment_uuid,
    CONCAT('MIGRATED-', ec.enrollment_uuid) AS new_uuid_will_be
FROM hiv_initial_clinical_evaluation ice
JOIN patient_person p ON p.uuid = ice.person_uuid
LEFT JOIN LATERAL (
    -- Get the most recent enrollment for this person
    SELECT uuid AS enrollment_uuid, date_art_started
    FROM hiv_enrollment_commencement
    WHERE person_uuid = ice.person_uuid
      AND archived = 0
      AND (enrollment_session_uuid IS NULL OR enrollment_session_uuid = '')
    ORDER BY date_art_started DESC
    LIMIT 1
) ec ON true
WHERE ice.archived = 0
  AND (ice.enrollment_session_uuid IS NULL OR ice.enrollment_session_uuid = '')
ORDER BY ice.visit_date DESC
LIMIT 10;


-- 4. CHECK: How many patients will be affected?
SELECT
    COUNT(DISTINCT ec.person_uuid) AS total_patients_affected
FROM hiv_enrollment_commencement ec
WHERE ec.archived = 0
  AND (ec.enrollment_session_uuid IS NULL OR ec.enrollment_session_uuid = '');


-- 5. CHECK: Do we have any patients with BOTH old and new enrollments?
-- These patients might have already gone through a new enrollment cycle
SELECT
    p.uuid AS person_uuid,
    p.hospital_number,
    p.first_name || ' ' || p.surname AS patient_name,
    COUNT(*) AS total_enrollments,
    COUNT(CASE WHEN ec.enrollment_session_uuid IS NULL OR ec.enrollment_session_uuid = '' THEN 1 END) AS old_enrollments,
    COUNT(CASE WHEN ec.enrollment_session_uuid IS NOT NULL
              AND ec.enrollment_session_uuid != ''
              AND ec.enrollment_session_uuid NOT LIKE 'MIGRATED-%' THEN 1 END) AS new_enrollments
FROM hiv_enrollment_commencement ec
JOIN patient_person p ON p.uuid = ec.person_uuid
WHERE ec.archived = 0
GROUP BY p.uuid, p.hospital_number, p.first_name, p.surname
HAVING COUNT(*) > 1
ORDER BY p.uuid
LIMIT 20;


-- ============================================================================
-- RESULTS INTERPRETATION:
-- ============================================================================
-- Query 1: Shows total counts - verify "needs_migration" is reasonable
-- Query 2: Shows sample enrollments - verify these look like old records
-- Query 3: Shows sample ICE records - verify they match with enrollments
-- Query 4: Shows how many patients affected - verify it's not all patients
-- Query 5: Shows patients with multiple enrollments - these are special cases
--
-- If everything looks good, proceed to run: migration_script_migrated_records.sql
-- ============================================================================
