INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '6b', 'DRV/r+TDF+3TC', 'DRV/r+TDF+3TC', '', 'NDR6b0153');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '5f', 'ABC-3TC-ATV/r', 'ABC-3TC-ATV/r', '', 'NDR5f0137');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1010, 'TDF(300mg)+3TC(300mg)+DRV/r(400mg/50mg)', 'Tenofovir+Lamivudine+Darunavir', 16, true, 1);

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1011, 'TDF(300mg)+3TC(300mg)+DRV/r(400mg/50mg)', 'Tenofovir+Lamivudine+Darunavir', 2, true, 1);

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1012, 'ABC(600mg)+3TC(300mg)+ATV/r(300mg/100mg)', 'Abacavir+Lamivudine+Atazanavir/Ritonavir', 4, true, 1);

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1013, 'ABC(600mg)+3TC(300mg)+ATV/r(300mg/100mg)', 'Abacavir+Lamivudine+Atazanavir/Ritonavir', 2, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'TDF(300mg)+3TC(300mg)+DRV/r(400mg/50mg)', 'TDF-3TC-DRV/r');

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'TDF(300mg)+3TC(300mg)+DRV/r(400mg/50mg)', 'DRV/r+TDF+3TC');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '5a', 'AZT-3TC-LPV/r', 'Adult 2nd line', '', 'NDR5a0122');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '4c', 'AZT-3TC-LPV/r', 'Paediatric 1st Line', '', 'NDR4c0108');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '6d', 'DRV/r +DTG or (RAL) ± 1-2 NRTIs', 'RAL(25mg)+DRV/r(75mg/100mg)+ABC/3TC(120mg/60mg)', '', 'NDR6d0161');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '6d', 'DRV/r +DTG or (RAL) ± 1-2 NRTIs', 'RAL(25mg)+DRV/r(75mg/100mg)+ABC/3TC(60mg/30mg)', '', 'NDR6d0161');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '6d', 'DRV/r +DTG or (RAL) ± 1-2 NRTIs', 'RAL(25mg)+DRV/r(75mg/120mg)+AZT/3TC(120mg/60mg)', '', 'NDR6d0162');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '6d', 'DRV/r +DTG or (RAL) ± 1-2 NRTIs', 'RAL(25mg)+DRV/r(75mg/100mg)+AZT/3TC(60mg/30mg)', '', 'NDR6d0162');

UPDATE ndr_code_set SET ndr_code = 'NDR4f0115' WHERE code_description = 'D4T-3TC-NVP';
UPDATE ndr_code_set SET ndr_code = 'NDR1q0028' WHERE code_description = 'D4T-3TC-EFV';
UPDATE ndr_code_set SET ndr_code = 'NDR4f0115' WHERE code_description = 'D4T-3TC-NVP';
UPDATE ndr_code_set SET ndr_code = 'NDR1b0008' WHERE code_description = 'AZT-3TC-NVP';
UPDATE ndr_code_set SET ndr_code = 'NDR4d0111', code = '4d4' WHERE code_description = 'ABC-3TC-NVP';
UPDATE ndr_code_set SET ndr_code = 'NDR4f0113', code = '4f' WHERE code_description = 'ABC-3TC-EFV';
UPDATE ndr_code_set SET ndr_code = 'NDR2d0048', code = '2d2' WHERE code_description = 'TDF-3TC-ATV/r';
UPDATE ndr_code_set SET ndr_code = 'NDR2b0044', code = '2b' WHERE code_description = 'TDF-3TC-LPV/r';
UPDATE ndr_code_set SET ndr_code = 'NDR2c0046', code = '2c' WHERE code_description = 'TDF-FTC-ATV/r';
UPDATE ndr_code_set SET ndr_code = 'NDR1f0017', code = '1f' WHERE code_description = 'TDF-3TC-NVP';
UPDATE ndr_code_set SET ndr_code = 'NDR1b0006', code = '1b' WHERE code_description = 'TDF-3TC-EFV';
UPDATE ndr_code_set SET ndr_code = 'NDR1d0014', code = '1d' WHERE code_description = 'TDF-FTC-NVP';
UPDATE ndr_code_set SET ndr_code = 'NDR1d0013', code = '1d' WHERE code_description = 'TDF-FTC-EFV';

UPDATE ndr_code_set SET ndr_code = 'NDR2a0041', code = '2a' WHERE code_description = 'TDF-FTC-LPV/r';
UPDATE ndr_code_set SET ndr_code = 'NDR1a0002', code = '1a' WHERE code_description = 'TDF-FTC-DTG';
UPDATE ndr_code_set SET ndr_code = 'NDR4b0106', code = '4b' WHERE code_description = 'ABC-FTC-DTG';

UPDATE ndr_code_set SET ndr_code = 'NDR1a0003', code = '1a' WHERE code_description = 'AZT-3TC-EFV';
UPDATE ndr_code_set SET ndr_code = 'NDR1a0001', code = '1a' WHERE code_description = 'TDF-3TC-DTG';
UPDATE ndr_code_set SET ndr_code = 'NDR3d0085', code = '3d' WHERE code_description = 'TDF-3TC-DTG-LPV/r';
UPDATE ndr_code_set SET ndr_code = 'NDR2j0061', code = '2j' WHERE code_description = 'ABC-DDI-LPV/r';
UPDATE ndr_code_set SET ndr_code = 'NDR2m0063', code = '2m' WHERE code_description = 'ABC-3TC-ATV/r';
UPDATE ndr_code_set SET ndr_code = 'NDR1c0009', code = '1c' WHERE code_description = 'ABC-3TC-DTG';
UPDATE ndr_code_set SET ndr_code = 'NDR3g0088', code = '3g' WHERE code_description = 'ABC-3TC-DTG-ATV/r';
UPDATE ndr_code_set SET ndr_code = 'NDR3h0089', code = '3h' WHERE code_description = 'ABC-3TC-DTG-DRV-RTV';

UPDATE ndr_code_set SET ndr_code = 'NDR3n0094', code = '3n' WHERE code_description = 'ABC-3TC-AZT-ATV/r';
UPDATE ndr_code_set SET ndr_code = 'NDR3m0093', code = '3m' WHERE code_description = 'ABC-3TC-AZT-EFV';
UPDATE ndr_code_set SET ndr_code = 'NDR1g0018', code = '1g' WHERE code_description = 'ABC-3TC-AZT';
UPDATE ndr_code_set SET ndr_code = 'NDR5f0136', code = '5f' WHERE code_description = 'ABC-3TC-RAL';
UPDATE ndr_code_set SET ndr_code = 'NDR3i0090', code = '3i' WHERE code_description = 'ABC-3TC-AZT-LPV/r';

UPDATE ndr_code_set SET ndr_code = 'NDR5h0140', code = '5h' WHERE code_description = 'ABC-3TC-LPV/r';

UPDATE ndr_code_set SET ndr_code = 'NDR1y0037', code = '1y' WHERE code_description = 'ABC-3TC-DDI';

UPDATE ndr_code_set SET ndr_code = 'NDR5d0132', code = '5d5' WHERE code_description = 'DDI-3TC-NVP';
UPDATE ndr_code_set SET ndr_code = 'NDR9h0179', code = '9h' WHERE code_description = '3TC-NVP';
UPDATE ndr_code_set SET ndr_code = 'NDR9b0173', code = '9b' WHERE code_description = '3TC';
UPDATE ndr_code_set SET ndr_code = 'NDR-4d0109', code = 'AP1' WHERE code_description = 'NVP';
UPDATE ndr_code_set SET ndr_code = 'NDR9a0172', code = '9a' WHERE code_description = 'AZT';

UPDATE ndr_code_set SET ndr_code = 'NDR3b0081', code = '3b' WHERE code_description = 'DRV/r-DTG + 1-2 NRTIs';
UPDATE ndr_code_set SET ndr_code = 'NDR6d0161', code = '6d' WHERE code_description = 'DRV/r +DTG or (RAL) ± 1-2 NRTIs';

UPDATE ndr_code_set SET ndr_code = 'NDR3b0080', code = '3b', alt_description = 'DRV/r+TDF+3TC±ETV' WHERE code = '6b' AND code_description = 'DRV/r +2NRTIs ± ETV';
UPDATE ndr_code_set SET ndr_code = 'NDR3b0081', code = '3b', alt_description = 'DRV/r+TDF+3TC±ETV' WHERE code = '6b' AND code_description = 'DRV/r +2NRTIs ± ETV';
UPDATE ndr_code_set SET ndr_code = 'NDR3b0080', code = '3b', alt_description = 'DRV/r+TDF+3TC±ETV' WHERE code = '3b' AND code_description = 'DRV/r +2NRTIs ± ETV';
UPDATE ndr_code_set SET ndr_code = 'NDR3b0081', code = '3b', alt_description = 'DRV/r+TDF+3TC±ETV' WHERE code = '3b' AND code_description = 'DRV/r +2NRTIs ± ETV';

UPDATE ndr_code_set SET ndr_code = 'NDR2y0075' WHERE code_description = 'TDF-3TC-DRV/r';
UPDATE ndr_code_set SET ndr_code = 'NDR2f0055', code = '2f2' WHERE code_description = 'AZT-3TC-ATV/r';

UPDATE ndr_code_set SET ndr_code = 'NDR4e0112', code = '4e', alt_description = 'Adult 1st line' WHERE code_description = 'AZT-3TC-LPV/r';