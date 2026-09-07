-- =============================================
-- REMOVE EXISTING NDR CODES
-- =============================================
DELETE FROM ndr_code_set WHERE code IN ('6e', '6b');
DELETE FROM ndr_code_set WHERE code_description IN ('TDF+3TC+AVT/r', 'AZT+3TC+LPV/r', 'ABC+3TC+LPV/r', 'AZT+3TC+ATV/r', 'DRV/r +2NRTIs ± ETV');

-- =============================================
-- REMOVE EXISTING DRV/r +2NRTIs ± ETV RESOLVER
-- =============================================
DELETE FROM hiv_regimen_resolver WHERE regimen IN ('DRV/r +2NRTIs ± ETV');

INSERT INTO hiv_regimen_resolver (regimensys, regimen) VALUES ('TDF/3TC(300mg/300mg)+DRV/r(600mg/100mg)+DTG(50mg)+ETV(200mg)', 'DRV/r+ABC+3TC±ETV');
INSERT INTO hiv_regimen_resolver (regimensys, regimen) VALUES ('AZT/3TC(300mg/150mg)+DRV/r(600mg/100mg)+ETV(200mg)+DTG(50mg)', 'DRV/r+AZT+3TC±ETV');


-- =============================================
-- INSERT UPDATED ARV REGIMENS
-- =============================================
INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code) VALUES ('ARV_REGIMEN', '2b', 'TDF+3TC+ATV/r', 'Adult 2nd-Line Regimens', '', 'NDR2b0043');
INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code) VALUES ('ARV_REGIMEN', '2b2', 'TDF+3TC+ATV/r', 'Adult 2nd-Line Regimens', '', 'NDR2b0048');
INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code) VALUES ('ARV_REGIMEN', '5c', 'TDF+3TC+ATV/r', 'Pediatric 2nd-Line Regimens', '', 'NDR5c0127');
INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code) VALUES ('ARV_REGIMEN', '2d', 'AZT+3TC+LPV/r', 'Adult 2nd-Line Regimens', 'Retired', 'NDR2d0049');
INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code) VALUES ('ARV_REGIMEN', '4e', 'AZT+3TC+LPV/r', 'Pediatric 1st-Line Regimen', '', 'NDR4e0112');
INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code) VALUES ('ARV_REGIMEN', '5a', 'AZT+3TC+LPV/r', 'Pediatric 2nd-Line Regimens', '', 'NDR5a0122');
INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code) VALUES ('ARV_REGIMEN', '5h', 'ABC+3TC+LPV/r', 'Pediatric 2nd-Line Regimens', '', 'NDR5h0141');
INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code) VALUES ('ARV_REGIMEN', '4c', 'ABC+3TC+LPV/r', 'Pediatric 1st-Line Regimen', '', 'NDR4c0108');
INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code) VALUES ('ARV_REGIMEN', '2f2', 'AZT+3TC+ATV/r', 'Adult 2nd-Line Regimens', 'Retired', 'NDR2f0055');
INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code) VALUES ('ARV_REGIMEN', '5b', 'AZT+3TC+ATV/r', 'Pediatric 1st-Line Regimen', '', 'NDR5b0125');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code) VALUES ('ARV_REGIMEN', '6b', 'DRV/r+ABC+3TC±ETV', 'Pediatric 3rd-Line Regimen', '', 'NDR6b0151');
INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code) VALUES ('ARV_REGIMEN', '6b', 'DRV/r+AZT+3TC±ETV', 'Pediatric 3rd-Line Regimen', '', 'NDR6b0152');


-- =============================================
-- ADD ZIDOVUDINE (AZT) DRUG
-- =============================================
INSERT INTO hiv_drug (id, abbrev, name, strength, pack_size, doseform, morning, afternoon, evening, item_id) VALUES (230, 'AZT', 'Zidovudine', '600mg', 0, 'Tablets', 1, 0, 0, 230);

-- =============================================
-- DTG + 3TC + TDF
-- =============================================
INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority) VALUES (1110, 'DTG(50mg)+3TC(300mg)+TDF(300mg)', 'TenofovirDisoproxilFumarate+Lamivudine+Dolutegravir', 16, true, 1);
INSERT INTO hiv_regimen_resolver (regimensys, regimen) VALUES ('DTG(50mg)+3TC(300mg)+TDF(300mg)', 'DTG+3TC+TDF');
INSERT INTO hiv_regimen_drug (id, regimen_id, drug_id) VALUES (1310, 1110, 211);
INSERT INTO hiv_regimen_drug (id, regimen_id, drug_id) VALUES (1311, 1110, 5);
INSERT INTO hiv_regimen_drug (id, regimen_id, drug_id) VALUES (1312, 1110, 122);
INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code) VALUES ('ARV_REGIMEN', '6e', 'DTG+3TC+TDF', 'Pediatric 3rd-Line Regimen', '', 'NDR6e0163');

-- =============================================
-- DTG + 3TC + ABC
-- =============================================
INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority) VALUES (1111, 'DTG(50mg)+3TC(300mg)+ABC(600mg)', 'Abacavir+Lamivudine+Dolutegravir', 16, true, 1);
INSERT INTO hiv_regimen_resolver (regimensys, regimen) VALUES ('DTG(50mg)+3TC(300mg)+ABC(600mg)', 'DTG+3TC+ABC');
INSERT INTO hiv_regimen_drug (id, regimen_id, drug_id) VALUES (1313, 1111, 102);
INSERT INTO hiv_regimen_drug (id, regimen_id, drug_id) VALUES (1314, 1111, 5);
INSERT INTO hiv_regimen_drug (id, regimen_id, drug_id) VALUES (1315, 1111, 122);
INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code) VALUES ('ARV_REGIMEN', '6e', 'DTG+3TC+ABC', 'Pediatric 3rd-Line Regimen', '', 'NDR6e0164');

-- =============================================
-- DTG + 3TC + AZT
-- =============================================
INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority) VALUES (1112, 'DTG(50mg)+3TC(300mg)+AZT(600mg)', 'Zidovudine+Lamivudine+Dolutegravir', 16, true, 1);
INSERT INTO hiv_regimen_resolver (regimensys, regimen) VALUES ('DTG(50mg)+3TC(300mg)+AZT(600mg)', 'DTG+3TC+AZT');
INSERT INTO hiv_regimen_drug (id, regimen_id, drug_id) VALUES (1316, 1112, 230);
INSERT INTO hiv_regimen_drug (id, regimen_id, drug_id) VALUES (1317, 1112, 5);
INSERT INTO hiv_regimen_drug (id, regimen_id, drug_id) VALUES (1318, 1112, 122);
INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code) VALUES ('ARV_REGIMEN', '6e', 'DTG+3TC+AZT', 'Pediatric 3rd-Line Regimen', '', 'NDR6e0165');