-- ============================================================
-- HIV REGIMEN RESOLVER UPDATES
-- ============================================================

UPDATE hiv_regimen_resolver SET regimen = 'Isoniazid-Ethambutol' WHERE regimen = 'INH+ETH';
UPDATE hiv_regimen_resolver SET regimen = 'Rifampicin' WHERE regimen = 'RIF';
UPDATE hiv_regimen_resolver SET regimen = 'Fluconazole' WHERE regimen = 'FLUC';
UPDATE hiv_regimen_resolver SET regimen = 'Nystatin' WHERE regimen = 'NYS';
UPDATE hiv_regimen_resolver SET regimen = 'Isoniazid-Rifampicin-Pyrazinamide-Ethambutol' WHERE regimen = 'INH+RIF+PZI+ETH';


-- ============================================================
-- NDR CODE SET UPDATES
-- ============================================================

UPDATE ndr_code_set SET code_description = 'Isoniazid-Ethambutol' WHERE code_description = 'INH+ETH';
UPDATE ndr_code_set SET code_description = 'Rifampicin' WHERE code_description = 'RIF';
UPDATE ndr_code_set SET code_description = 'Fluconazole' WHERE code_description = 'FLUC';
UPDATE ndr_code_set SET code_description = 'Nystatin' WHERE code_description = 'NYS';
UPDATE ndr_code_set SET code_description = 'Isoniazid-Rifampicin-Pyrazinamide-Ethambutol' WHERE code_description = 'INH+RIF+PZI+ETH';
UPDATE ndr_code_set SET ndr_code = 'NDRHRZE0198' WHERE ndr_code = 'HRZE';
