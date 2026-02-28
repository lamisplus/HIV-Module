-- Make hiv_enrollment_uuid column nullable for backward compatibility
-- (New records use enrollment_commencement_uuid instead)
ALTER TABLE hiv_art_clinical
ALTER COLUMN hiv_enrollment_uuid DROP NOT NULL;

-- Make visit_id column nullable (can be null if visit creation fails)
ALTER TABLE hiv_art_clinical
ALTER COLUMN visit_id DROP NOT NULL;
