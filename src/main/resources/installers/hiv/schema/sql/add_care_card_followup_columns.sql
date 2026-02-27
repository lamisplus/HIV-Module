-- Migration script to add new columns for Care Card Follow-Up functionality
-- These columns enhance the hiv_art_clinical table to support comprehensive patient follow-up visits

-- Visit Information
ALTER TABLE hiv_art_clinical ADD COLUMN IF NOT EXISTS duration_on_art_months INTEGER;
COMMENT ON COLUMN hiv_art_clinical.duration_on_art_months IS 'Duration patient has been on ART in months';

ALTER TABLE hiv_art_clinical ADD COLUMN IF NOT EXISTS clinician_name VARCHAR(255);
COMMENT ON COLUMN hiv_art_clinical.clinician_name IS 'Name of clinician conducting the visit';

-- Vitals
ALTER TABLE hiv_art_clinical ADD COLUMN IF NOT EXISTS bmi_muac DECIMAL(5,2);
COMMENT ON COLUMN hiv_art_clinical.bmi_muac IS 'BMI for adults (age >= 15) or MUAC in cm for pediatrics (age < 15)';

-- Clinical Status
ALTER TABLE hiv_art_clinical ADD COLUMN IF NOT EXISTS paediatric_disclosure VARCHAR(100);
COMMENT ON COLUMN hiv_art_clinical.paediatric_disclosure IS 'Pediatric and adolescent HIV disclosure status';

ALTER TABLE hiv_art_clinical ADD COLUMN IF NOT EXISTS who_stage_criteria JSONB;
COMMENT ON COLUMN hiv_art_clinical.who_stage_criteria IS 'Array of WHO clinical stage criteria selected for the patient';

ALTER TABLE hiv_art_clinical ADD COLUMN IF NOT EXISTS noted_side_effect TEXT;
COMMENT ON COLUMN hiv_art_clinical.noted_side_effect IS 'Side effects noted during the visit';

ALTER TABLE hiv_art_clinical ADD COLUMN IF NOT EXISTS dsd_status VARCHAR(100);
COMMENT ON COLUMN hiv_art_clinical.dsd_status IS 'Differentiated Service Delivery (DSD) status';

ALTER TABLE hiv_art_clinical ADD COLUMN IF NOT EXISTS dsd_model VARCHAR(100);
COMMENT ON COLUMN hiv_art_clinical.dsd_model IS 'DSD model type (Facility-based or Community-based)';

ALTER TABLE hiv_art_clinical ADD COLUMN IF NOT EXISTS date_devolved DATE;
COMMENT ON COLUMN hiv_art_clinical.date_devolved IS 'Date patient was devolved to DSD model';

-- Medications
ALTER TABLE hiv_art_clinical ADD COLUMN IF NOT EXISTS cotrimoxazole_dose VARCHAR(100);
COMMENT ON COLUMN hiv_art_clinical.cotrimoxazole_dose IS 'Cotrimoxazole (CTX) dosage prescribed';

ALTER TABLE hiv_art_clinical ADD COLUMN IF NOT EXISTS tpt_data JSONB;
COMMENT ON COLUMN hiv_art_clinical.tpt_data IS 'TB Preventive Therapy complete data including code, dose, start date, completion date';

ALTER TABLE hiv_art_clinical ADD COLUMN IF NOT EXISTS other_drugs TEXT;
COMMENT ON COLUMN hiv_art_clinical.other_drugs IS 'Other medications prescribed during the visit';

-- Lab Results
ALTER TABLE hiv_art_clinical ADD COLUMN IF NOT EXISTS cd4_ordered BOOLEAN DEFAULT FALSE;
COMMENT ON COLUMN hiv_art_clinical.cd4_ordered IS 'Whether CD4 count test was ordered during this visit';

ALTER TABLE hiv_art_clinical ADD COLUMN IF NOT EXISTS viral_load_ordered BOOLEAN DEFAULT FALSE;
COMMENT ON COLUMN hiv_art_clinical.viral_load_ordered IS 'Whether viral load test was ordered during this visit';

ALTER TABLE hiv_art_clinical ADD COLUMN IF NOT EXISTS eac VARCHAR(50);
COMMENT ON COLUMN hiv_art_clinical.eac IS 'Enhanced Adherence Counseling (EAC) session indicator (None, 1st EAC, 2nd EAC, 3rd EAC, Additional EAC)';

ALTER TABLE hiv_art_clinical ADD COLUMN IF NOT EXISTS rbs DECIMAL(5,2);
COMMENT ON COLUMN hiv_art_clinical.rbs IS 'Random Blood Sugar result in mmol/L';

ALTER TABLE hiv_art_clinical ADD COLUMN IF NOT EXISTS other_tests_done JSONB;
COMMENT ON COLUMN hiv_art_clinical.other_tests_done IS 'Array of other laboratory tests performed during the visit';

ALTER TABLE hiv_art_clinical ADD COLUMN IF NOT EXISTS type_of_appointment VARCHAR(100);
COMMENT ON COLUMN hiv_art_clinical.type_of_appointment IS 'Type of appointment (Conduct, Hospitalised, Refer)';

-- Follow-up
ALTER TABLE hiv_art_clinical ADD COLUMN IF NOT EXISTS health_insurance_coverage VARCHAR(100);
COMMENT ON COLUMN hiv_art_clinical.health_insurance_coverage IS 'Current health insurance coverage status (NHIA, BHCPF, SHIA, Private HMO)';

-- Create indexes for commonly queried columns
CREATE INDEX IF NOT EXISTS idx_hiv_art_clinical_dsd_status ON hiv_art_clinical(dsd_status) WHERE dsd_status IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_hiv_art_clinical_dsd_model ON hiv_art_clinical(dsd_model) WHERE dsd_model IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_hiv_art_clinical_date_devolved ON hiv_art_clinical(date_devolved) WHERE date_devolved IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_hiv_art_clinical_paediatric_disclosure ON hiv_art_clinical(paediatric_disclosure) WHERE paediatric_disclosure IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_hiv_art_clinical_type_of_appointment ON hiv_art_clinical(type_of_appointment) WHERE type_of_appointment IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_hiv_art_clinical_health_insurance ON hiv_art_clinical(health_insurance_coverage) WHERE health_insurance_coverage IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_hiv_art_clinical_viral_load_ordered ON hiv_art_clinical(viral_load_ordered) WHERE viral_load_ordered = TRUE;
CREATE INDEX IF NOT EXISTS idx_hiv_art_clinical_cd4_ordered ON hiv_art_clinical(cd4_ordered) WHERE cd4_ordered = TRUE;

-- JSONB GIN indexes for better performance on JSONB columns
CREATE INDEX IF NOT EXISTS idx_hiv_art_clinical_who_stage_criteria ON hiv_art_clinical USING GIN(who_stage_criteria) WHERE who_stage_criteria IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_hiv_art_clinical_tpt_data ON hiv_art_clinical USING GIN(tpt_data) WHERE tpt_data IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_hiv_art_clinical_other_tests ON hiv_art_clinical USING GIN(other_tests_done) WHERE other_tests_done IS NOT NULL;
