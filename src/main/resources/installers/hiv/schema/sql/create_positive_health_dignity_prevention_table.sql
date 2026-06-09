-- Create Positive Health Dignity and Prevention (PHDP) table
CREATE TABLE IF NOT EXISTS hiv_positive_health_dignity_prevention (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL UNIQUE,
    person_uuid VARCHAR(255) NOT NULL,
    visit_id VARCHAR(255) NOT NULL,
    art_clinical_uuid VARCHAR(255),

    -- Core fields
    assessment_date DATE NOT NULL,
    phdp_services JSONB NOT NULL,

    clinical_notes TEXT,
    archived INTEGER DEFAULT 0,

    facility_id BIGINT,
    created_by VARCHAR(255),
    created_date TIMESTAMP,
    last_modified_by VARCHAR(255),
    last_modified_date TIMESTAMP,
    -- Foreign key constraints
    CONSTRAINT fk_phdp_person FOREIGN KEY (person_uuid)
        REFERENCES patient_person(uuid) ON DELETE CASCADE,
    CONSTRAINT fk_phdp_visit FOREIGN KEY (visit_id)
        REFERENCES patient_visit(uuid) ON DELETE CASCADE,
    CONSTRAINT fk_phdp_art_clinical FOREIGN KEY (art_clinical_uuid)
        REFERENCES hiv_art_clinical(uuid) ON DELETE SET NULL
);
-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_phdp_person_uuid
    ON hiv_positive_health_dignity_prevention(person_uuid);

CREATE INDEX IF NOT EXISTS idx_phdp_visit_id
    ON hiv_positive_health_dignity_prevention(visit_id);

CREATE INDEX IF NOT EXISTS idx_phdp_art_clinical_uuid
    ON hiv_positive_health_dignity_prevention(art_clinical_uuid);

CREATE INDEX IF NOT EXISTS idx_phdp_assessment_date
    ON hiv_positive_health_dignity_prevention(assessment_date);

CREATE INDEX IF NOT EXISTS idx_phdp_archived
    ON hiv_positive_health_dignity_prevention(archived);

CREATE INDEX IF NOT EXISTS idx_phdp_facility_id
    ON hiv_positive_health_dignity_prevention(facility_id);

-- GIN index for JSONB column to enable efficient querying
CREATE INDEX IF NOT EXISTS idx_phdp_services
    ON hiv_positive_health_dignity_prevention USING gin (phdp_services);

-- Add table and column comments
COMMENT ON TABLE hiv_positive_health_dignity_prevention IS
    'Positive Health Dignity and Prevention assessments for HIV patients. Captures prevention services including HIV transmission prevention, disease/OI prevention, and healthy living promotion.';

COMMENT ON COLUMN hiv_positive_health_dignity_prevention.phdp_services IS
    'JSONB: All PHDP services organized by category (preventHivTransmission, preventDiseasesOI, promoteHealthyLiving). Additional PHDP services stored as application codeset IDs for flexibility.';

COMMENT ON COLUMN hiv_positive_health_dignity_prevention.assessment_date IS
    'Date when the PHDP assessment was conducted';

COMMENT ON COLUMN hiv_positive_health_dignity_prevention.art_clinical_uuid IS
    'Optional link to ART clinical visit if PHDP was conducted during a clinical encounter';
