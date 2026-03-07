-- ============================================================
-- NDR CODE SET UPDATES - TB REGIMEN CODES
-- ============================================================

    UPDATE ndr_code_set
    SET ndr_code = CASE
        WHEN code_description = 'Isoniazid-Rifampicin' AND code = 'HR' THEN 'NDRHR0196'
        WHEN code_description = 'Isoniazid-Ethambutol' AND code = 'HE' THEN 'NDRHE0195'
        WHEN code_description = 'Isoniazid-Rifampicin-Pyrazinamide-Ethambutol' AND code = 'HRZE' THEN 'NDRHRZE0198'
        WHEN code_description = 'Streptomycin' AND code = 'S' THEN 'NDRS0194'
        WHEN code_description = 'Ethambutol' AND code = 'E' THEN 'NDRE0193'
        WHEN code_description = 'Isoniazid (INH)' AND code = 'H' THEN 'NDRH0190'
        WHEN code_description = 'Isoniazid-Rifampicin-Ethambutol' AND code = 'HRE' THEN 'NDRHRE0197'
        WHEN code_description = 'Isoniazid-Rifampicin-Pyrazinamide-Ethambutol-Streptomycin' AND code = 'HRZES' THEN 'NDRHRZES0199'
        ELSE ndr_code
    END
    WHERE (code_description = 'Isoniazid-Rifampicin' AND code = 'HR')
       OR (code_description = 'Isoniazid-Ethambutol' AND code = 'HE')
       OR (code_description = 'Isoniazid-Rifampicin-Pyrazinamide-Ethambutol' AND code = 'HRZE')
       OR (code_description = 'Streptomycin' AND code = 'S')
       OR (code_description = 'Ethambutol' AND code = 'E')
       OR (code_description = 'Isoniazid (INH)' AND code = 'H')
       OR (code_description = 'Isoniazid-Rifampicin-Ethambutol' AND code = 'HRE')
       OR (code_description = 'Isoniazid-Rifampicin-Pyrazinamide-Ethambutol-Streptomycin' AND code = 'HRZES');

-- ============================================================
-- CLEANUP - DELETE ORPHANED/DUPLICATE NDR CODE SET ENTRIES
-- ============================================================

DELETE FROM ndr_code_set
WHERE code = 'CTX960' AND ndr_code IS NULL;

DELETE FROM ndr_code_set
WHERE code = 'CTX800' AND ndr_code IS NULL;

DELETE FROM ndr_code_set
WHERE code = 'CTX480' AND ndr_code IS NULL;

DELETE FROM ndr_code_set
WHERE code = 'CTX400' AND ndr_code IS NULL;

DELETE FROM ndr_code_set
WHERE code = 'CTX240' AND ndr_code IS NULL;

DELETE FROM ndr_code_set
WHERE code_description = 'TDF+3TC+DTG' AND ndr_code IS NULL;

DELETE FROM ndr_code_set
WHERE code_description = 'ABC+3TC+DTG' AND ndr_code IS NULL;

DELETE FROM ndr_code_set
WHERE code_description = 'Fluconazole' AND ndr_code IS NULL;
