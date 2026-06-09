-- Migration script to add enrollment_session_uuid columns for tracking enrollment cycles
-- This enables linking AdherencePreparation, ICE, Enrollment, Transfer forms per enrollment cycle
-- Supports enrollment flows:
--   Part 1A: Positive HTS → AdherencePrep → ICE → Enrollment
--   Part 1B: Transfer-IN (New) → AdherencePrep → ICE → Enrollment
--   Part 2: Transfer OUT → Transfer IN → AdherencePrep → ICE → Enrollment

-- ============================================================================
-- STEP 1: Add enrollment_session_uuid to hiv_adherence_preparation
-- ============================================================================
ALTER TABLE hiv_adherence_preparation
ADD COLUMN IF NOT EXISTS enrollment_session_uuid VARCHAR(255);

COMMENT ON COLUMN hiv_adherence_preparation.enrollment_session_uuid IS
    'UUID linking this adherence preparation record to a specific enrollment cycle. Generated in frontend when form loads.';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_adherence_prep_enrollment_session_uuid
    ON hiv_adherence_preparation(enrollment_session_uuid)
    WHERE enrollment_session_uuid IS NOT NULL;


-- ============================================================================
-- STEP 2: Add enrollment_session_uuid to hiv_initial_clinical_evaluation (ICE)
-- ============================================================================
ALTER TABLE hiv_initial_clinical_evaluation
ADD COLUMN IF NOT EXISTS enrollment_session_uuid VARCHAR(255);

COMMENT ON COLUMN hiv_initial_clinical_evaluation.enrollment_session_uuid IS
    'UUID linking this ICE record to a specific enrollment cycle. Shared with AdherencePreparation and EnrollmentCommencement.';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_ice_enrollment_session_uuid
    ON hiv_initial_clinical_evaluation(enrollment_session_uuid)
    WHERE enrollment_session_uuid IS NOT NULL;

-- Create composite index for person + session lookups
CREATE INDEX IF NOT EXISTS idx_ice_person_session
    ON hiv_initial_clinical_evaluation(person_uuid, enrollment_session_uuid)
    WHERE enrollment_session_uuid IS NOT NULL;


-- ============================================================================
-- STEP 3: Add enrollment_session_uuid to hiv_enrollment_commencement
-- (This replaces the old hiv_enrollment table)
-- ============================================================================
ALTER TABLE hiv_enrollment_commencement
ADD COLUMN IF NOT EXISTS enrollment_session_uuid VARCHAR(255);

COMMENT ON COLUMN hiv_enrollment_commencement.enrollment_session_uuid IS
    'UUID linking this enrollment record to a specific enrollment cycle. Shared with AdherencePreparation and ICE.';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_enrollment_comm_enrollment_session_uuid
    ON hiv_enrollment_commencement(enrollment_session_uuid)
    WHERE enrollment_session_uuid IS NOT NULL;

-- Create composite index for person + session lookups (using person_uuid from join)
CREATE INDEX IF NOT EXISTS idx_enrollment_comm_person_session
    ON hiv_enrollment_commencement(person_uuid, enrollment_session_uuid)
    WHERE enrollment_session_uuid IS NOT NULL;


-- ============================================================================
-- STEP 4: Add enrollment_session_uuid to hiv_observation
-- (Used for Transfer OUT and Transfer IN within facility - Part 2)
-- ============================================================================
ALTER TABLE hiv_observation
ADD COLUMN IF NOT EXISTS enrollment_session_uuid VARCHAR(255);

COMMENT ON COLUMN hiv_observation.enrollment_session_uuid IS
    'UUID linking this observation (Transfer OUT/IN) to a specific enrollment cycle for returning clients.';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_observation_enrollment_session_uuid
    ON hiv_observation(enrollment_session_uuid)
    WHERE enrollment_session_uuid IS NOT NULL;

-- Create composite index for person + type + session lookups
CREATE INDEX IF NOT EXISTS idx_observation_person_type_session
    ON hiv_observation(person_uuid, type, enrollment_session_uuid)
    WHERE enrollment_session_uuid IS NOT NULL;


-- ============================================================================
-- STEP 5: Add enrollment_session_uuid to hiv_patient_transfer_in
-- (Used for Transfer-IN acknowledgement - New Patient - Part 1B)
-- ============================================================================
ALTER TABLE hiv_patient_transfer_in
ADD COLUMN IF NOT EXISTS enrollment_session_uuid VARCHAR(255);

COMMENT ON COLUMN hiv_patient_transfer_in.enrollment_session_uuid IS
    'UUID linking this transfer-in record to a specific enrollment cycle. Created when new patient transfers in.';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_transfer_in_enrollment_session_uuid
    ON hiv_patient_transfer_in(enrollment_session_uuid)
    WHERE enrollment_session_uuid IS NOT NULL;

-- Create composite index for person + session lookups
CREATE INDEX IF NOT EXISTS idx_transfer_in_person_session
    ON hiv_patient_transfer_in(person_uuid, enrollment_session_uuid)
    WHERE enrollment_session_uuid IS NOT NULL;


-- ============================================================================
-- Summary of Changes
-- ============================================================================
-- Added enrollment_session_uuid column to five tables:
--   1. hiv_adherence_preparation        - AdherencePreparation form
--   2. hiv_initial_clinical_evaluation  - ICE form
--   3. hiv_enrollment_commencement      - Enrollment/Commencement form (replaces hiv_enrollment)
--   4. hiv_observation                  - Transfer OUT/IN within facility (Part 2)
--   5. hiv_patient_transfer_in          - Transfer-IN for new patients (Part 1B)
--
-- Created indexes for optimal query performance on session-based lookups
--
-- All columns are nullable for backward compatibility with existing records
--
-- Usage Flow:
--   Part 1A: Session UUID created when AdherencePreparation form loads
--            Session passed: AdherencePrep → ICE → Enrollment
--
--   Part 1B: Session UUID created when Transfer-IN form is submitted
--            Session passed: Transfer-IN → AdherencePrep → ICE → Enrollment
--
--   Part 2:  Session UUID created when Transfer OUT happens
--            Session passed: Transfer OUT → Transfer IN → AdherencePrep → ICE → Enrollment
--            New session created at Transfer IN
-- ============================================================================
