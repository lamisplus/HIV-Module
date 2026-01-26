-- ============================================================
-- SQL Script to Add Additional HIV Drugs (Batch 2)
-- Run this script FIRST before running add_hiv_regimen_drugs_batch2.sql
-- ============================================================

-- Insert new HIV drugs from drug10.png
INSERT INTO hiv_drug (id, abbrev, name, strength, pack_size, doseform, morning, afternoon, evening, item_id)
VALUES (225, 'FDC', 'Pyridoxine Fixed Dose', '25mg', 0, 'Tablets', 1, 0, 0, 226);

INSERT INTO hiv_drug (id, abbrev, name, strength, pack_size, doseform, morning, afternoon, evening, item_id)
VALUES (226, 'RPT', 'Rifampicin', '300mg', 0, 'Tablets', 1, 0, 0, 226);
