-- Add enrollment_commencement_uuid foreign key column to hiv_art_clinical table
ALTER TABLE hiv_art_clinical
ADD COLUMN IF NOT EXISTS enrollment_commencement_uuid VARCHAR(255);

-- Add foreign key constraint
ALTER TABLE hiv_art_clinical
ADD CONSTRAINT fk_art_clinical_enrollment_commencement
FOREIGN KEY (enrollment_commencement_uuid)
REFERENCES enrollment_commencement(uuid);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_art_clinical_enrollment_commencement
ON hiv_art_clinical(enrollment_commencement_uuid);
