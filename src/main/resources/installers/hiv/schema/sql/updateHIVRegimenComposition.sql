-- ============================================================
-- HIV REGIMEN UPDATES
-- ============================================================

-- Cotrimoxazole/Isoniazid/Pyridoxine composition update
UPDATE hiv_regimen
SET composition = 'Cotrimoxazole/Isoniazid/Pyridoxine 960/300/25mg'
WHERE description = 'Isoniazid(300mg)/Pyridoxine(25mg)/Cotrimoxazole(960mg)';

-- Isoniazid/Rifampicin (3HR) - regimen type and composition
UPDATE hiv_regimen
SET regimen_type_id = 10,
    composition     = 'Isoniazid/Rifampicin (3HR)'
WHERE description = 'Isoniazid and Rifampicin-(3HR)';

-- Isoniazid/Rifapentine (3HP) - regimen type and composition
UPDATE hiv_regimen
SET regimen_type_id = 9,
    composition     = 'Isoniazid/Rifampentine (3HP)'
WHERE description = 'Isoniazid and Rifapentine-(3HP)';


-- ============================================================
-- HIV REGIMEN RESOLVER UPDATES
-- ============================================================

-- INH+RIF(3HP) → Isoniazid/Rifampentine (3HP)
UPDATE hiv_regimen_resolver
SET regimensys = 'Isoniazid/Rifampentine (3HP)',
    regimen     = 'Isoniazid/Rifampentine (3HP)'
WHERE regimen = 'INH+RIF(3HP)';

-- INH+RIF(3HR) → Isoniazid/Rifampicin (3HR)
UPDATE hiv_regimen_resolver
SET regimensys = 'Isoniazid/Rifampicin (3HR)',
    regimen     = 'Isoniazid/Rifampicin (3HR)'
WHERE regimen = 'INH+RIF(3HR)';

-- Isoniazid + Rifapentine → Isoniazid-Rifapentine
UPDATE hiv_regimen_resolver
SET regimen = 'Isoniazid-Rifapentine'
WHERE regimen = 'Isoniazid + Rifapentine';

-- CTX+INH+PYR → Cotrimoxazole/Isoniazid/Pyridoxine 960/300/25mg
UPDATE hiv_regimen_resolver
SET regimen = 'Cotrimoxazole/Isoniazid/Pyridoxine 960/300/25mg'
WHERE regimen = 'CTX+INH+PYR';


-- ============================================================
-- NDR CODE SET UPDATES
-- ============================================================

-- INH+RIF(3HP) → OI_REGIMEN / Isoniazid/Rifampentine (3HP)
UPDATE ndr_code_set
SET code_set_nm      = 'OI_REGIMEN',
    code_description = 'Isoniazid/Rifampentine (3HP)'
WHERE code_description = 'INH+RIF(3HP)';

-- INH+RIF(3HR) → Isoniazid/Rifampicin (3HR)
UPDATE ndr_code_set
SET code_description = 'Isoniazid/Rifampicin (3HR)'
WHERE code_description = 'INH+RIF(3HR)';

-- Isoniazid + Rifapentine → Isoniazid-Rifapentine
UPDATE ndr_code_set
SET code_description = 'Isoniazid-Rifapentine'
WHERE code_description = 'Isoniazid + Rifapentine';

-- CTX+INH+PYR → Cotrimoxazole/Isoniazid/Pyridoxine 960/300/25mg
UPDATE ndr_code_set
SET code_description = 'Cotrimoxazole/Isoniazid/Pyridoxine 960/300/25mg',
    code_set_nm      = 'OI_REGIMEN'
WHERE code_description = 'CTX+INH+PYR';
