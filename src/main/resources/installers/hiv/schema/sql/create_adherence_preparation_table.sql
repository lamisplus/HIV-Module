-- Create Adherence Preparation table
CREATE TABLE IF NOT EXISTS hiv_adherence_preparation (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL UNIQUE,
    person_uuid VARCHAR(255) NOT NULL,
    visit_id VARCHAR(255) NOT NULL,
    art_clinical_uuid VARCHAR(255),

    -- Core fields
    service_date DATE NOT NULL,
    adherence_services JSONB NOT NULL,
    treatment_supporter_data JSONB,

    archived INTEGER DEFAULT 0,

    facility_id BIGINT,
    created_by VARCHAR(255),
    created_date TIMESTAMP,
    last_modified_by VARCHAR(255),
    last_modified_date TIMESTAMP,

    -- Foreign key constraints
    CONSTRAINT fk_adherence_prep_person FOREIGN KEY (person_uuid)
        REFERENCES patient_person(uuid) ON DELETE CASCADE,
    CONSTRAINT fk_adherence_prep_visit FOREIGN KEY (visit_id)
        REFERENCES patient_visit(uuid) ON DELETE CASCADE,
    CONSTRAINT fk_adherence_prep_art_clinical FOREIGN KEY (art_clinical_uuid)
        REFERENCES hiv_art_clinical(uuid) ON DELETE SET NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_adherence_prep_person_uuid
    ON hiv_adherence_preparation(person_uuid);

CREATE INDEX IF NOT EXISTS idx_adherence_prep_visit_id
    ON hiv_adherence_preparation(visit_id);

CREATE INDEX IF NOT EXISTS idx_adherence_prep_art_clinical_uuid
    ON hiv_adherence_preparation(art_clinical_uuid);

CREATE INDEX IF NOT EXISTS idx_adherence_prep_service_date
    ON hiv_adherence_preparation(service_date);

CREATE INDEX IF NOT EXISTS idx_adherence_prep_archived
    ON hiv_adherence_preparation(archived);

CREATE INDEX IF NOT EXISTS idx_adherence_prep_facility_id
    ON hiv_adherence_preparation(facility_id);

-- GIN index for JSONB columns to enable efficient querying
CREATE INDEX IF NOT EXISTS idx_adherence_prep_services
    ON hiv_adherence_preparation USING gin (adherence_services);

CREATE INDEX IF NOT EXISTS idx_adherence_prep_treatment_supporter
    ON hiv_adherence_preparation USING gin (treatment_supporter_data);

-- Add table and column comments
COMMENT ON TABLE hiv_adherence_preparation IS
    'Adherence Preparation services for HIV patients. Captures services provided and treatment supporter information.';

COMMENT ON COLUMN hiv_adherence_preparation.adherence_services IS
    'JSONB: Services provided during adherence preparation session';

COMMENT ON COLUMN hiv_adherence_preparation.treatment_supporter_data IS
    'JSONB: Treatment supporter information and related data';

COMMENT ON COLUMN hiv_adherence_preparation.service_date IS
    'Date when the adherence preparation services were provided';

COMMENT ON COLUMN hiv_adherence_preparation.art_clinical_uuid IS
    'Optional link to ART clinical visit if adherence prep was conducted during a clinical encounter';
