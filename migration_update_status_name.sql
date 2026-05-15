-- Migration script to update status name from 'HIV Exposed Status Unknown' to 'Transfer-in not active'
-- Table: hiv_status_tracker
-- Date: 2026-05-15

UPDATE hiv_status_tracker
SET hiv_status = 'Transfer-in not active'
WHERE hiv_status = 'HIV Exposed Status Unknown'
AND archived = 0;
