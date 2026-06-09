-- ++++++++++++++++++++++++++++++++++++++++06-11-2025+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1091, 'Rifampicin', 'Rifampicin', 15, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'Rifampicin', 'RIF');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'TB_REGIMEN', 'R', 'RIF', 'Isoniazid Preventive Therapy (IPT)', '', 'NDRR0191');

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1092, 'Pyrazinamide (PZI)', 'Pyrazinamide (PZI)', 15, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'Pyrazinamide (PZI)', 'PZI');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'TB_REGIMEN', 'Z', 'PZI', 'Isoniazid Preventive Therapy (IPT)', '', 'NDRZ0192');


-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1093, 'Ethambutol', 'Ethambutol', 15, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'Ethambutol', 'ETH');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'TB_REGIMEN', 'E', 'ETH', 'Isoniazid Preventive Therapy (IPT)', '', 'NDRE0193');


-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1094, 'Liposomal Amphotericin B (3mg/Kg IV dly) 50mg', 'Liposomal Amphotericin B (3mg/Kg IV dly) 50mg', 15, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'Liposomal Amphotericin B (3mg/Kg IV dly) 50mg', 'LAB');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'OI_REGIMEN', 'LAB350', 'LAB', 'Isoniazid Preventive Therapy (IPT)', '', 'NDRLAB3500206');

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1095, 'Isoniazid-Pyridoxine', 'Isoniazid-Pyridoxine', 15, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'Isoniazid-Pyridoxine', 'INH+PYR');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'OI_REGIMEN', 'INHB6', 'INH+PYR', 'Isoniazid Preventive Therapy (IPT)', '', 'NDRINHB60189');

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1096, 'Isoniazid + Rifapentine', 'Isoniazid + Rifapentine', 15, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'Isoniazid + Rifapentine', 'INH+RIF');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'OI_REGIMEN', 'ISF3HP', 'INH+RIF', 'Isoniazid Preventive Therapy (IPT)', '', 'NDRISF3HP0206');


-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1097, 'Streptomycin', 'Streptomycin', 10, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'Streptomycin', 'STR');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'TB_REGIMEN', 'S', 'STR', 'TB Treatment Adult', '', 'NDRS0194');

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1098, 'Isoniazid-Rifampicin-Pyrazinamide-Ethambutol-Streptomycin', 'Isoniazid-Rifampicin-Pyrazinamide-Ethambutol-Streptomycin', 10, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'Isoniazid-Rifampicin-Pyrazinamide-Ethambutol-Streptomycin', 'INH+RIF+PZI+ETH+STR');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'TB_REGIMEN', 'HRZES', 'INH+RIF+PZI+ETH+STR', 'TB Treatment Adult', '', 'NDRHRZES0199');

--Rifabutin

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1099, 'Rifabutin', 'Rifabutin', 10, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'Rifabutin', 'RFB');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'TB_REGIMEN', 'RF', 'RFB', 'TB Treatment Adult', '', 'NDRRF0206');


-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1100, 'Isoniazid-Rifampicin-Ethambutol', 'Isoniazid-Rifampicin-Ethambutol', 10, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'Isoniazid-Rifampicin-Ethambutol', 'INH+RIF+ETH');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'TB_REGIMEN', 'HRE', 'INH+RIF+ETH', 'TB Treatment Adult', '', 'NDRHRE0197');

-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1101, 'ABC(120mg)/3TC(60mg)+DTG(50mg)', '"Abacavir+Lamivudine+Dolutegravir"', 1, true, 1);

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '1c', 'ABC+3TC(or FTC)+DTG', 'Adult 1st line', '', 'NDR1c0009');