-- ============================================================================
-- MIGRATION SCRIPT: Add MIGRATED- prefix to enrollment_session_uuid
-- Purpose: Identify legacy records that existed before the new enrollment flow
--
-- This script will:
-- 1. Find all hiv_enrollment_commencement records without enrollment_session_uuid
-- 2. Generate MIGRATED-{uuid} for each record
-- 3. Link the same session UUID to corresponding hiv_initial_clinical_evaluation records
--
-- Run this in pgAdmin to test before adding to code
-- ============================================================================

-- STEP 1: Check current state (BEFORE migration)
-- This query shows how many records need migration
SELECT
    'hiv_enrollment_commencement' AS table_name,
    COUNT(*) AS total_records,
    COUNT(CASE WHEN enrollment_session_uuid IS NULL THEN 1 END) AS records_without_uuid,
    COUNT(CASE WHEN enrollment_session_uuid IS NOT NULL AND enrollment_session_uuid LIKE 'MIGRATED-%' THEN 1 END) AS already_migrated
FROM hiv_enrollment_commencement
WHERE archived = 0

UNION ALL

SELECT
    'hiv_initial_clinical_evaluation' AS table_name,
    COUNT(*) AS total_records,
    COUNT(CASE WHEN enrollment_session_uuid IS NULL THEN 1 END) AS records_without_uuid,
    COUNT(CASE WHEN enrollment_session_uuid IS NOT NULL AND enrollment_session_uuid LIKE 'MIGRATED-%' THEN 1 END) AS already_migrated
FROM hiv_initial_clinical_evaluation
WHERE archived = 0;


-- ============================================================================
-- STEP 2: PREVIEW what will be updated (DRY RUN)
-- Run this first to see what records will be affected
-- ============================================================================

-- Preview Enrollment Commencement records that will be updated
SELECT
    ec.id,
    ec.person_uuid,
    ec.date_enrolled_in_hiv_care,
    ec.date_art_started,
    ec.enrollment_session_uuid AS current_uuid,
    CONCAT('MIGRATED-', ec.uuid) AS new_uuid,
    p.first_name,
    p.surname,
    p.hospital_number
FROM hiv_enrollment_commencement ec
JOIN patient_person p ON p.uuid = ec.person_uuid
WHERE ec.archived = 0
  AND (ec.enrollment_session_uuid IS NULL OR ec.enrollment_session_uuid = '')
ORDER BY ec.date_art_started DESC
LIMIT 20;  -- Remove LIMIT to see all records


-- Preview ICE records that will be linked
SELECT
    ice.id,
    ice.person_uuid,
    ice.visit_date,
    ice.enrollment_session_uuid AS current_uuid,
    ec.uuid AS enrollment_uuid,
    CONCAT('MIGRATED-', ec.uuid) AS new_uuid,
    p.first_name,
    p.surname
FROM hiv_initial_clinical_evaluation ice
JOIN patient_person p ON p.uuid = ice.person_uuid
LEFT JOIN LATERAL (
    -- Get the most recent enrollment for this person
    SELECT uuid, date_art_started
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
LIMIT 20;  -- Remove LIMIT to see all records


-- ============================================================================
-- STEP 3: ACTUAL MIGRATION (Run this after reviewing preview)
-- ============================================================================

-- Begin transaction for safety
BEGIN;

-- 3.1: Update hiv_enrollment_commencement
-- Add MIGRATED- prefix to records without enrollment_session_uuid
UPDATE hiv_enrollment_commencement
SET enrollment_session_uuid = CONCAT('MIGRATED-', uuid)
WHERE archived = 0
  AND (enrollment_session_uuid IS NULL OR enrollment_session_uuid = '');

-- Check how many records were updated
SELECT
    'hiv_enrollment_commencement updated' AS status,
    COUNT(*) AS records_updated
FROM hiv_enrollment_commencement
WHERE archived = 0
  AND enrollment_session_uuid LIKE 'MIGRATED-%';


-- 3.2: Update hiv_initial_clinical_evaluation
-- Link ICE records to the same MIGRATED- session UUID as their enrollment
UPDATE hiv_initial_clinical_evaluation ice
SET enrollment_session_uuid = ec.enrollment_session_uuid
FROM (
    -- Get the most recent MIGRATED enrollment for each person
    SELECT DISTINCT ON (person_uuid)
        person_uuid,
        enrollment_session_uuid,
        date_art_started
    FROM hiv_enrollment_commencement
    WHERE archived = 0
      AND enrollment_session_uuid LIKE 'MIGRATED-%'
    ORDER BY person_uuid, date_art_started DESC
) ec
WHERE ice.person_uuid = ec.person_uuid
  AND ice.archived = 0
  AND (ice.enrollment_session_uuid IS NULL OR ice.enrollment_session_uuid = '');

-- Check how many ICE records were updated
SELECT
    'hiv_initial_clinical_evaluation updated' AS status,
    COUNT(*) AS records_updated
FROM hiv_initial_clinical_evaluation
WHERE archived = 0
  AND enrollment_session_uuid LIKE 'MIGRATED-%';


-- ============================================================================
-- STEP 4: VERIFICATION - Check results after migration
-- ============================================================================

-- 4.1: Count records by enrollment_session_uuid status
SELECT
    'hiv_enrollment_commencement' AS table_name,
    COUNT(*) AS total_records,
    COUNT(CASE WHEN enrollment_session_uuid IS NULL THEN 1 END) AS still_null,
    COUNT(CASE WHEN enrollment_session_uuid LIKE 'MIGRATED-%' THEN 1 END) AS migrated,
    COUNT(CASE WHEN enrollment_session_uuid NOT LIKE 'MIGRATED-%' AND enrollment_session_uuid IS NOT NULL THEN 1 END) AS regular_uuid
FROM hiv_enrollment_commencement
WHERE archived = 0

UNION ALL

SELECT
    'hiv_initial_clinical_evaluation' AS table_name,
    COUNT(*) AS total_records,
    COUNT(CASE WHEN enrollment_session_uuid IS NULL THEN 1 END) AS still_null,
    COUNT(CASE WHEN enrollment_session_uuid LIKE 'MIGRATED-%' THEN 1 END) AS migrated,
    COUNT(CASE WHEN enrollment_session_uuid NOT LIKE 'MIGRATED-%' AND enrollment_session_uuid IS NOT NULL THEN 1 END) AS regular_uuid
FROM hiv_initial_clinical_evaluation
WHERE archived = 0;


-- 4.2: Verify that matching records have the same session UUID
-- This should return matching pairs of EC and ICE with same MIGRATED- UUID
SELECT
    p.uuid AS person_uuid,
    p.first_name,
    p.surname,
    p.hospital_number,
    ec.id AS enrollment_id,
    ec.date_art_started,
    ec.enrollment_session_uuid AS enrollment_uuid,
    ice.id AS ice_id,
    ice.visit_date AS ice_date,
    ice.enrollment_session_uuid AS ice_uuid,
    CASE
        WHEN ec.enrollment_session_uuid = ice.enrollment_session_uuid THEN 'MATCH ✓'
        ELSE 'MISMATCH ✗'
    END AS uuid_match_status
FROM patient_person p
JOIN hiv_enrollment_commencement ec ON ec.person_uuid = p.uuid
JOIN hiv_initial_clinical_evaluation ice ON ice.person_uuid = p.uuid
WHERE ec.archived = 0
  AND ice.archived = 0
  AND ec.enrollment_session_uuid LIKE 'MIGRATED-%'
ORDER BY p.uuid, ec.date_art_started DESC
LIMIT 50;


-- 4.3: Find any orphaned records (ICE without matching EC)
SELECT
    ice.id AS ice_id,
    ice.person_uuid,
    p.first_name,
    p.surname,
    ice.visit_date,
    ice.enrollment_session_uuid
FROM hiv_initial_clinical_evaluation ice
JOIN patient_person p ON p.uuid = ice.person_uuid
LEFT JOIN hiv_enrollment_commencement ec
    ON ec.person_uuid = ice.person_uuid
    AND ec.archived = 0
    AND ec.enrollment_session_uuid LIKE 'MIGRATED-%'
WHERE ice.archived = 0
  AND ice.enrollment_session_uuid LIKE 'MIGRATED-%'
  AND ec.id IS NULL;


-- 4.4: Sample of successfully migrated records
SELECT
    p.hospital_number,
    p.first_name,
    p.surname,
    ec.date_enrolled_in_hiv_care,
    ec.date_art_started,
    ec.enrollment_session_uuid,
    ice.visit_date AS ice_date,
    ice.enrollment_session_uuid AS ice_session_uuid
FROM hiv_enrollment_commencement ec
JOIN patient_person p ON p.uuid = ec.person_uuid
LEFT JOIN hiv_initial_clinical_evaluation ice
    ON ice.person_uuid = ec.person_uuid
    AND ice.enrollment_session_uuid = ec.enrollment_session_uuid
WHERE ec.archived = 0
  AND ec.enrollment_session_uuid LIKE 'MIGRATED-%'
ORDER BY ec.date_art_started DESC
LIMIT 10;


-- ============================================================================
-- STEP 5: ROLLBACK or COMMIT
-- ============================================================================

-- If everything looks good, COMMIT the transaction:
-- COMMIT;

-- If there are issues, ROLLBACK the transaction:
-- ROLLBACK;

-- ============================================================================
-- NOTES:
-- ============================================================================
-- 1. This script is wrapped in a transaction (BEGIN...COMMIT/ROLLBACK)
-- 2. Review the VERIFICATION queries before committing
-- 3. The script only updates records where enrollment_session_uuid IS NULL or ''
-- 4. Records with existing UUIDs are NOT modified
-- 5. The MIGRATED- prefix allows the backend to identify legacy records
-- 6. After migration, these patients will see full menu immediately
-- ============================================================================
