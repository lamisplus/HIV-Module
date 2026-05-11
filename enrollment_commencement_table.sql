CREATE TABLE IF NOT EXISTS enrollment_commencement (
    id                                  BIGSERIAL PRIMARY KEY,
    uuid                                VARCHAR(255) NOT NULL UNIQUE,
    unique_id_no                        VARCHAR(100),
    facility_id                         BIGINT,
    person_uuid                         VARCHAR(255) NOT NULL,
    visit_id                            VARCHAR(255) NOT NULL,
    vital_sign_uuid                     VARCHAR(255),
    is_commencement                     BOOLEAN DEFAULT TRUE,
    art_status_id                       BIGINT,
    status_at_registration_id           BIGINT,
    source                              VARCHAR(255),
    latitude                            VARCHAR(255),
    longitude                           VARCHAR(255),
    archived                            INTEGER DEFAULT 0,

    -- Audit
    created_by                          VARCHAR(255),
    created_date                        TIMESTAMP,
    last_modified_by                    VARCHAR(255),
    last_modified_date                  TIMESTAMP,

    -- Registration — HIV Care & Identification
    date_enrolled_in_hiv_care           DATE NOT NULL,
    date_confirmed_hiv_test             DATE NOT NULL,
    hiv_test_location                   VARCHAR(255) NOT NULL,
    mode_of_hiv_test_id                 BIGINT NOT NULL,
    care_entry_point_id                 BIGINT NOT NULL,
    care_entry_point_other              VARCHAR(255),
    mother_unique_id                    VARCHAR(100),

    -- Registration — Prior ART & Key Population
    prior_art_id                        BIGINT NOT NULL,
    is_kp                               BOOLEAN DEFAULT FALSE,
    kp_typology_id                      BIGINT,

    -- ── Registration — Transfer Details
    date_transferred_in                 DATE,
    facility_transferred_from           VARCHAR(255),

    -- ── Commencement — Clinical Status
    clinical_stage_id                   BIGINT,
    cd4_at_art_start                    BIGINT,
    cd4_lf_id                           BIGINT,

    -- ── Commencement — ART Dates & Regimen
    date_adherence_counseling_completed DATE,
    date_art_started                    DATE NOT NULL,
    regimen_id                          BIGINT,

    -- ── Commencement — Vitals
    weight_kg                           DOUBLE PRECISION,
    height_cm                           DOUBLE PRECISION,
    bmi                                 DOUBLE PRECISION,
    muac                                DOUBLE PRECISION,
    muac_indication                     VARCHAR(50),
    is_pregnant                         BOOLEAN,
    is_breast_feeding                   BOOLEAN,

    --  Commencement — TB Preventive Therapy
    tpt_medication                      VARCHAR(255),
    tpt_code                            VARCHAR(20),
    tpt_dose                            VARCHAR(100),
    tpt_start_date                      DATE,
    tpt_completion_date                 DATE
);


-- ──────────────────────────────────────────────────────────────────────────────
-- STEP 3: Add Foreign Key Constraints
-- ──────────────────────────────────────────────────────────────────────────────
ALTER TABLE enrollment_commencement
    ADD CONSTRAINT fk_ec_person_uuid
    FOREIGN KEY (person_uuid) REFERENCES patient_person(uuid);

ALTER TABLE enrollment_commencement
    ADD CONSTRAINT fk_ec_visit
    FOREIGN KEY (visit_id) REFERENCES patient_visit(uuid);

ALTER TABLE enrollment_commencement
    ADD CONSTRAINT fk_ec_vital_sign
    FOREIGN KEY (vital_sign_uuid) REFERENCES triage_vital_sign(uuid);


-- ──────────────────────────────────────────────────────────────────────────────
-- STEP 4: Create Indexes for Performance
-- ──────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_ec_person_uuid
    ON enrollment_commencement(person_uuid, archived);

CREATE INDEX IF NOT EXISTS idx_ec_unique_id_no
    ON enrollment_commencement(unique_id_no);

CREATE INDEX IF NOT EXISTS idx_ec_mother_unique_id
    ON enrollment_commencement(mother_unique_id);

CREATE INDEX IF NOT EXISTS idx_ec_facility_id
    ON enrollment_commencement(facility_id);

CREATE INDEX IF NOT EXISTS idx_ec_date_art_started
    ON enrollment_commencement(date_art_started);


-- ──────────────────────────────────────────────────────────────────────────────
-- STEP 5: Add Comments to Table and Columns (Optional but Recommended)
-- ──────────────────────────────────────────────────────────────────────────────
COMMENT ON TABLE enrollment_commencement IS
'Combined enrollment and ART commencement data for HIV patients. This table merges registration details with ART commencement information in a single, streamlined structure.';

COMMENT ON COLUMN enrollment_commencement.mother_unique_id IS
'Required ONLY for infants (age < 2 years). Validated in backend service.';

COMMENT ON COLUMN enrollment_commencement.kp_typology_id IS
'Required ONLY when is_kp = TRUE. Validated in backend service.';

COMMENT ON COLUMN enrollment_commencement.date_transferred_in IS
'Required ONLY when care_entry_point indicates "Transfer In". Validated in backend service.';

COMMENT ON COLUMN enrollment_commencement.facility_transferred_from IS
'Required ONLY when date_transferred_in is provided. Validated in backend service.';


-- ──────────────────────────────────────────────────────────────────────────────
-- STEP 6: Data Migration (Optional)
-- ──────────────────────────────────────────────────────────────────────────────
-- This step migrates existing data from hiv_enrollment and hiv_art_clinical tables.
-- IMPORTANT: Only run this if you have existing data to migrate and the table is empty.
-- Comment out or delete this section if not needed.
-- ──────────────────────────────────────────────────────────────────────────────

/*
-- Check if migration is needed (only if table is empty and source tables exist)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'hiv_enrollment')
       AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'hiv_art_clinical')
       AND NOT EXISTS (SELECT 1 FROM enrollment_commencement LIMIT 1)
    THEN
        INSERT INTO enrollment_commencement (
            uuid,
            unique_id_no,
            facility_id,
            person_uuid,
            visit_id,
            vital_sign_uuid,
            is_commencement,
            art_status_id,
            status_at_registration_id,
            source,
            latitude,
            longitude,
            archived,
            created_by,
            created_date,
            last_modified_by,
            last_modified_date,
            date_enrolled_in_hiv_care,
            date_confirmed_hiv_test,
            care_entry_point_id,
            care_entry_point_other,
            clinical_stage_id,
            cd4_at_art_start,
            date_art_started,
            regimen_id,
            pregnancy_status
        )
        SELECT
            e.uuid,
            e.unique_id                         AS unique_id_no,
            e.facility_id,
            e.person_uuid,
            e.visit_id,
            c.vital_sign_uuid,
            TRUE                                AS is_commencement,
            c.art_status_id,
            e.status_at_registration_id,
            e.source,
            e.latitude,
            e.longitude,
            COALESCE(e.archived, 0)             AS archived,
            e.created_by,
            e.created_date,
            e.last_modified_by,
            e.last_modified_date,
            e.date_of_registration              AS date_enrolled_in_hiv_care,
            e.date_confirmed_hiv                AS date_confirmed_hiv_test,
            e.entry_point_id                    AS care_entry_point_id,
            e.care_entry_point_other,
            c.clinical_stage_id,
            c.cd_4                              AS cd4_at_art_start,
            c.visit_date                        AS date_art_started,
            c.regimen_id,
            c.pregnancy_status
        FROM hiv_enrollment e
        JOIN hiv_art_clinical c
            ON  c.hiv_enrollment_uuid = e.uuid
            AND c.is_commencement     = TRUE
            AND c.archived            = 0
        WHERE e.archived = 0;

        RAISE NOTICE 'Data migration completed successfully. % records migrated.',
                     (SELECT COUNT(*) FROM enrollment_commencement);
    ELSE
        RAISE NOTICE 'Data migration skipped. Either source tables do not exist or enrollment_commencement already has data.';
    END IF;
END $$;
*/


-- ──────────────────────────────────────────────────────────────────────────────
-- STEP 7: Verification Queries
-- ──────────────────────────────────────────────────────────────────────────────
-- Run these queries to verify the table was created successfully:
-- ──────────────────────────────────────────────────────────────────────────────

-- Check table structure
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'enrollment_commencement'
ORDER BY ordinal_position;

-- Check indexes
SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'enrollment_commencement';

-- Check foreign keys
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'enrollment_commencement';

-- Check row count
SELECT COUNT(*) as total_records FROM enrollment_commencement;

