-- adding new regimen not in LAMISPlus ---
INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1014, 'TDF(300mg)+3TC(300mg)+EFV(400mg)', 'TenofovirDisoproxilFumarate+Lamivudine+Efavirenz', 1, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'TDF(300mg)+3TC(300mg)+EFV(400mg)', 'TDF+3TC+EFV');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '1b', 'TDF+3TC+EFV', 'Adult 1st line', '', 'NDR1b0006');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1015, 'TAF(25mg)+3TC(300mg)+DTG(50mg)', 'TenofovirAlafenamide+Lamivudine+Dolutegravir', 1, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'TAF(25mg)+3TC(300mg)+DTG(50mg)', 'TAF+3TC+DTG');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '1k', 'TAF+3TC+DTG', 'Adult 1st line', '', 'NDR1k0020');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1016, 'TAF(25mg)+FTC(200mg)+DTG(50mg)', 'TenofovirAlafenamide+Emtricitabine+Dolutegravir', 1, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'TAF(25mg)+FTC(200mg)+DTG(50mg)', 'TAF+FTC+DTG');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '1k', 'TAF+FTC+DTG', 'Adult 1st line', '', 'NDR1k0020');


INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1018, 'AZT(300mg)+3TC(300mg)+EFV(400mg)', 'Zidovudine+Lamivudine+Efavirenz', 1, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'AZT(300mg)+3TC(300mg)+EFV(400mg)', 'AZT+3TC+EFV');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '1a', 'AZT+3TC+EFV', 'Adult 1st line', '', 'NDR1a0003');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1019, 'AZT(120mg)+3TC(60mg)+EFV(200mg)', 'Zidovudine+Lamivudine+Efavirenz', 1, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'AZT(120mg)+3TC(60mg)+EFV(200mg)', 'AZT+3TC+EFV');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '1a', 'AZT+3TC+EFV', 'Adult 1st line', '', 'NDR1a0003');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1020, 'AZT(120mg)+3TC(60mg)+EFV(50mg)', 'Zidovudine+Lamivudine+Efavirenz', 1, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'AZT(120mg)+3TC(60mg)+EFV(50mg)', 'AZT+3TC+EFV');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '1a', 'AZT+3TC+EFV', 'Adult 1st line', '', 'NDR1a0003');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1021, 'AZT(300mg)+FTC(200mg)+ATV/r(300mg/100mg)', 'Zidovudine+Emtricitabine+Atazanavir/Ritonavir', 2, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'AZT(300mg)+FTC(200mg)+ATV/r(300mg/100mg)', 'AZT+FTC+ATV/r');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '2g', 'AZT+FTC+ATV/r', 'Adult 2nd line', '', 'NDR2g0058');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1022, 'AZT(300mg)+FTC(200mg)+LPV/r(200mg/50mg)', 'Zidovudine+Emtricitabine+Lopinavir/Ritonavir', 2, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'AZT(300mg)+FTC(200mg)+LPV/r(200mg/50mg)', 'AZT+FTC+LPV/r');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '2g', 'AZT+FTC+LPV/r', 'Adult 2nd line', '', 'NDR2g0058');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1023, 'AZT(300mg)+FTC(200mg)+DRV/r(600mg/100mg)', 'Zidovudine+Emtricitabine+Darunavir+Ritonavir', 2, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'AZT(300mg)+FTC(200mg)+DRV/r(600mg/100mg)', 'AZT+FTC+DRV/r');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '2g', 'AZT+FTC+DRV/r', 'Adult 2nd line', '', 'NDR2g0058');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1024, 'ABC(600mg)+3TC(300mg)', 'Abacavir+Lamivudine', 2, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'ABC(600mg)+3TC(300mg)', 'ABC+3TC');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '2g', 'ABC+3TC', 'Adult 2nd line', '', 'NDR2g0058');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1025, 'TDF(300mg)+3TC(150mg)', 'TenofovirDisoproxilFumarate+Lamivudine', 2, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'TDF(300mg)+3TC(150mg)', 'TDF+3TC');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '2g', 'TDF+3TC', 'Adult 2nd line', '', 'NDR2g0058');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1026, 'DRV/r(400mg/50mg)', 'Darunavir+Ritonavir', 2, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'DRV/r(400mg/50mg)', 'DRV/r');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '2g', 'DRV/r', 'Adult 2nd line', '', 'NDR2g0058');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1027, 'AZT(300mg)+3TC(150mg)+DRV/r(600mg/100mg)', 'Zidovudine+Lamivudine+Darunavir+Ritonavir', 2, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'AZT(300mg)+3TC(150mg)+DRV/r(600mg/100mg)', 'AZT+3TC+DRV/r');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '2x', 'AZT+3TC+DRV/r', 'Adult 2nd line', '', 'NDR2x0074');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1028, 'AZT(300mg)+FTC(200mg)+DTG(50mg)', 'Zidovudine+Emtricitabine+Dolutegravir', 2, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'AZT(300mg)+FTC(200mg)+DTG(50mg)', 'AZT+FTC+DTG');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '4b', 'AZT+FTC+DTG', 'Adult 2nd line', '', 'NDR4b0106');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1029, 'TDF(300mg)+3TC(300mg)+DRV/r(600mg/100mg)+DTG(50mg)', 'TenofovirDisoproxilFumarate+Lamivudine+Darunavir+Ritonavir+Dolutegravir', 14, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'TDF(300mg)+3TC(300mg)+DRV/r(600mg/100mg)+DTG(50mg)', 'DRV/r+DTG ± TDF+3TC');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '3a', 'DRV/r+DTG ± TDF+3TC', 'Adult 3rd line', '', 'NDR3a0076');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1030, 'TDF(300mg)+3TC(300mg)+DRV/r(600mg/100mg)+DTG(50mg)+ETV(200mg)', 'TenofovirDisoproxilFumarate+Lamivudine+Darunavir+Ritonavir+Dolutegravir+Etravirine', 14, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'TDF(300mg)+3TC(300mg)+DRV/r(600mg/100mg)+DTG(50mg)+ETV(200mg)', 'DRV/r+TDF+3TC±ETV');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '3b', 'DRV/r+TDF+3TC±ETV', 'Adult 3rd line', '', 'NDR3b0080');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1031, 'AZT(300mg)+3TC(150mg)+DRV/r(600mg/100mg)+ETV(200mg)', 'Zidovudine+Lamivudine+Darunavir+Ritonavir+Etravirine', 14, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'AZT(300mg)+3TC(150mg)+DRV/r(600mg/100mg)+ETV(200mg)', 'DRV/r+AZT+3TC±ETV');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '3b', 'DRV/r+AZT+3TC±ETV', 'Adult 3rd line', '', 'NDR3b0081');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1032, 'AZT(300mg)+3TC(150mg)+DRV/r(600mg/100mg)', 'Zidovudine+Lamivudine+Darunavir+Ritonavir+Dolutegravir', 14, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'AZT(300mg)+3TC(150mg)+DRV/r(600mg/100mg)', 'DRV/r+DTG ± AZT+3TC');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '3a', 'DRV/r+DTG ± AZT+3TC', 'Adult 3rd line', '', 'NDR3a0077');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1033, 'AZT(300mg)+3TC(150mg)+DRV/r(600mg/100mg)+DTG(50mg)', 'Zidovudine+Lamivudine+Darunavir+Ritonavir', 14, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'AZT(300mg)+3TC(150mg)+DRV/r(600mg/100mg)+DTG(50mg)', 'AZT+3TC+DRV/r');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '2x', 'AZT+3TC+DRV/r', 'Adult 3rd line', '', 'NDR2x0074');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1034, 'TDF(300mg)+3TC(300mg)+LPV/r(200mg/50mg)+DTG(50mg)', 'TenofovirDisoproxilFumarate+Lamivudine+Lopinavir+Ritonavir+Dolutegravir', 14, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'TDF(300mg)+3TC(300mg)+LPV/r(200mg/50mg)+DTG(50mg)', 'TDF+3TC+DTG+LPV/r');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '3d', 'TDF+3TC+DTG+LPV/r', 'Adult 3rd line', '', 'NDR3d0085');
INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1035, 'TAF(25mg)+3TC(300mg)+DTG(50mg)', 'TenofovirAlafenamide+Lamivudine+Dolutegravir', 3, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'TAF(25mg)+3TC(300mg)+DTG(50mg)', 'TAF+3TC+DTG');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '4g4', 'TAF+3TC+DTG', 'Paediatric 1st Line', '', 'NDR4g0118');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1036, 'AZT(120mg)+3TC(60mg)+RAL(25mg)', 'Zidovudine+Lamivudine+Raltegravir', 3, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'AZT(120mg)+3TC(60mg)+RAL(25mg)', 'AZT+3TC+RAL');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '4g', 'AZT+3TC+RAL', 'Paediatric 1st Line', '', 'NDR4g0117');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1038, 'DTG(10mg)', 'Dolutegravir', 3, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'DTG(10mg)', 'DTG10');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '4g4', 'DTG10', 'Paediatric 1st Line', '', 'NDR4g0118');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1039, 'AZT(120mg)+3TC(60mg)+RAL(25mg)', 'Zidovudine+Lamivudine+Raltegravir', 4, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'AZT(120mg)+3TC(60mg)+RAL(25mg)', 'AZT+3TC+RAL');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '5e', 'AZT+3TC+RAL', 'Paediatric 2nd Line', '', 'NDR5e0133');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1041, 'DTG(50mg)+DRV/r(75mg/25mg)+ABC(600mg)+3TC(300mg)', 'Dolutegravir+Darunavir+Ritonavir+Abacavir+Lamivudine', 16, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'DTG(50mg)+DRV/r(75mg/25mg)+ABC(600mg)+3TC(300mg)', 'DRV/r+DTG+3TC+ABC');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '6c', 'DRV/r+DTG+3TC+ABC', 'Paediatric 3rd Line', '', 'NDR6c0158');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1042, 'DTG(50mg)+DRV/r(75mg/25mg)+AZT(600mg)+3TC((300mg)', 'Dolutegravir+Darunavir+Ritonavir+Zidovudine+Lamivudine', 16, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'DTG(50mg)+DRV/r(75mg/25mg)+AZT(600mg)+3TC((300mg)', 'DRV/r+DTG+3TC+AZT');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '6c', 'DRV/r+DTG+3TC+AZT', 'Paediatric 3rd Line', '', 'NDR6c0159');


INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1043, 'RAL(25mg)+DRV/r(75mg/25mg)+ABC(120mg)+3TC(60mg)', 'Raltegravir+Darunavir+Ritonavir+Abacavir+Lamivudine', 16, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'RAL(25mg)+DRV/r(75mg/25mg)+ABC(120mg)+3TC(60mg)', 'RAL+DRV/r+ABC+3TC');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '6d', 'RAL+DRV/r+ABC+3TC', 'Paediatric 3rd Line', '', 'NDR6d0161');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1044, 'RAL(25mg)+DRV/r(75mg/25mg)+ABC(60mg)+3TC(30mg)', 'Raltegravir+Darunavir+Ritonavir+Abacavir+Lamivudine', 16, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'RAL(25mg)+DRV/r(75mg/25mg)+ABC(60mg)+3TC(30mg)', 'AZT+3TC+RAL');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '6d', 'DRV/r+RAL+3TC+ABC', 'Paediatric 3rd Line', '', 'NDR6d0161');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1045, 'RAL(25mg)+DRV/r(75mg/100mg)+ABC(120mg)+3TC(60mg)', 'Raltegravir+Darunavir+Ritonavir+Abacavir+Lamivudine', 16, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'RAL(25mg)+DRV/r(75mg/100mg)+ABC(120mg)+3TC(60mg)', 'DRV/r+RAL+3TC+ABC');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '6d', 'DRV/r+RAL+3TC+ABC', 'Paediatric 3rd Line', '', 'NDR6d0161');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1046, 'RAL(25mg)+DRV/r(75mg/100mg)+ABC(60mg)+3TC(30mg)', 'Raltegravir+Darunavir+Ritonavir+Abacavir+Lamivudine', 16, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'RAL(25mg)+DRV/r(75mg/100mg)+ABC(60mg)+3TC(30mg)', 'DRV/r+RAL+3TC+ABC');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '6d', 'DRV/r+RAL+3TC+ABC', 'Paediatric 3rd Line', '', 'NDR6d0161');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1047, 'RAL(25mg)+DRV/r(75mg/25mg)+AZT(120mg)+3TC(60mg)', 'Raltegravir+Darunavir+Ritonavir+Zidovudine+Lamivudine', 16, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'RAL(25mg)+DRV/r(75mg/25mg)+AZT(120mg)+3TC(60mg)', 'DRV/r+RAL+3TC+AZT');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '6d', 'DRV/r+RAL+3TC+AZT', 'Paediatric 3rd Line', '', 'NDR6d0162');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1048, 'RAL(25mg)+DRV/r(75mg/25mg)+AZT(60mg)+3TC(30mg)', 'Raltegravir+Darunavir+Ritonavir+Zidovudine+Lamivudine', 16, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'RAL(25mg)+DRV/r(75mg/25mg)+AZT(60mg)+3TC(30mg)', 'DRV/r+DTG+3TC+AZT');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '6d', 'DRV/r+RAL+3TC+AZT', 'Paediatric 3rd Line', '', 'NDR6d0162');


INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1049, 'RAL(25mg)+DRV/r(75mg/120mg)+AZT(120mg)+3TC(60mg)', 'Raltegravir+Darunavir+Ritonavir+Zidovudine+Lamivudine', 16, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'RAL(25mg)+DRV/r(75mg/120mg)+AZT(120mg)+3TC(60mg)', 'DRV/r+RAL+3TC+AZT');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '6d', 'DRV/r+RAL+3TC+AZT', 'Paediatric 3rd Line', '', 'NDR6d0162');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1050, 'RAL(25mg)+DRV/r(75mg/100mg)+AZT(60mg)+3TC(30mg)', 'Raltegravir+Darunavir+Ritonavir+Zidovudine+Lamivudine', 16, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'RAL(25mg)+DRV/r(75mg/100mg)+AZT(60mg)+3TC(30mg)', 'DRV/r+RAL+3TC+AZT');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '6d', 'DRV/r+RAL+3TC+AZT', 'Paediatric 3rd Line', '', 'NDR6d0162');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1051, 'AZT(60mg)+3TC(30mg)+DTG(10mg)', 'Zidovudine+Lamivudine+Dolutegravir', 3, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'AZT(60mg)+3TC(30mg)+DTG(10mg)', 'AZT+3TC+DTG');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '5e', 'AZT+3TC+DTG', 'Paediatric 1st Line', '', 'NDR5e0134');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1052, 'AZT(60mg)+3TC(30mg)+RAL(25mg)', 'Zidovudine+Lamivudine+Raltegravir', 3, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'AZT(60mg)+3TC(30mg)+RAL(25mg)', 'AZT+3TC+RAL');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '4g', 'AZT+3TC+RAL', 'Paediatric 1st Line', '', 'NDR4g0117');


INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1053, 'DTG(5mg)', 'Dolutegravir', 3, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'DTG(5mg)', 'DTG50');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '4g4', 'DTG50', 'Paediatric 1st Line', '', 'NDR4g0118');

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'DTG(10mg)', 'DTG10');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '4g4', 'DTG10', 'Paediatric 1st Line', '', 'NDR4g0118');


INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1054, 'ZT(10mg)+NVP(10mg/1ml)', 'Zidovudine+Nevirapine', 6, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'AZT(10mg)+NVP(10mg/1ml)', 'AZT+NVP');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', 'AP2', 'AZT+NVP', 'ARV Prophylaxis for Infants', '', 'NDR-6a0148');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1055, 'AZT(120mg)+3TC(60mg)+LPV/r(100mg/25mg)', 'Zidovudine+Lamivudine+Lopinavir/Ritonavir', 4, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'AZT(120mg)+3TC(60mg)+LPV/r(100mg/25mg)', 'AZT-3TC-LPV/r');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '5a', 'AZT-3TC-LPV/r', 'Paediatric 2nd Line', '', 'NDR5a0122');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1056, 'AZT(300mg)+3TC(150mg)+ATV/r(300mg/100mg)', 'Zidovudine+Lamivudine+Atazanavir/Ritonavir', 4, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'AZT(300mg)+3TC(150mg)+ATV/r(300mg/100mg)', 'AZT-3TC-ATV/r');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '5b', 'AZT-3TC-ATV/r', 'Paediatric 2nd Line', '', 'NDR5b0125');

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (
           1058, 'ABC(120mg)+3TC(60mg)+RAL(25mg)', 'Lamivudine+Atazanavir/Ritonavir+Tenofovir+Zidovudine', 4, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES (
           'ABC(120mg)+3TC(60mg)+RAL(25mg)', 'ABC-3TC-RAL');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES (
           'ARV_REGIMEN', '5f', 'ABC-3TC-RAL', 'Paediatric 2nd Line', '', 'NDR5f0136');


-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (1059, 'ABC(120mg)+3TC(60mg)+DTG50(50mg)', 'Abacavir+Lamivudine+Dolutegravir', 1, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES ( 'ABC(120mg)+3TC(60mg)+DTG50(50mg)', 'ABC-3TC-DTG');

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (1060, 'AZT(120mg)-3TC(60mg)-DTG(50mg)', 'Zidovudine+Lamivudine+Dolutegravir', 1, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES ( 'AZT(120mg)-3TC(60mg)-DTG(50mg)', 'AZT+3TC+DTG50');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES ('ARV_REGIMEN', '1z', 'AZT+3TC+DTG50', 'Adult 1st line', '', 'NDR1z0038');

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (1061, 'AZT(120mg)+3TC(60mg)+LPV/r(100/25mg)',  'Zidovudine+Lamivudine+Lopinavir/Ritonavir', 2, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES ( 'AZT(120mg)+3TC(60mg)+LPV/r(100/25mg)', 'AZT+3TC+LPV/r');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES ('ARV_REGIMEN', '2d', 'AZT+3TC+LPV/r', 'Adult 2nd line', '', 'NDR2d0049');

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (1062, 'TDF(300mg)+3TC(300mg)+DTG50(50mg)',  'Tenofovir Disoproxil Fumarate+Lamivudine+Dolutegravir', 2, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES ( 'TDF(300mg)+3TC(300mg)+DTG50(50mg)', 'TDF+3TC+DTG');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES ('ARV_REGIMEN', '2g', 'TDF+3TC+DTG', 'Adult 2nd line', '', 'NDR2g0057');

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (1063, 'TDF(300mg)+FTC(200mg)+DTG(50mg)',  'Tenofovir Disoproxil Fumarate+Emtricitabine+Dolutegravir', 2, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES ( 'TDF(300mg)+FTC(200mg)+DTG(50mg)', 'TDF-FTC-DTG');

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (1064, 'ABC(600mg)+3TC(300mg)+LPV/r(200/50mg)',  'Abacavir+Lamivudine+Lopinavir/Ritonavir', 2, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES ( 'ABC(600mg)+3TC(300mg)+LPV/r(200/50mg)', 'ABC-3TC-LPV/r');

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (1065, 'ABC(60mg)+3TC(30mg)+DTG(5mg)',  'Abacavir+Lamivudine+Dolutegravir ', 3, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES ( 'ABC(60mg)+3TC(30mg)+DTG(5mg)', 'ABC-3TC-DTG');


-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (1066, 'AZT(60mg)+3TC(30mg)+LPV/r(100/25mg)',  'Abacavir+Lamivudine+Lopinavir/Ritonavir', 3, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES ( 'AZT(60mg)+3TC(30mg)+LPV/r(100/25mg)', 'AZT-3TC-LPV/r');

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (1067, 'AZT(120mg)+3TC(60mg)+LPV/r(100/25mg)',  'Zidovudine+Lamivudine+Lopinavir/Ritonavir', 3, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES ( 'AZT(120mg)+3TC(60mg)+LPV/r(100/25mg)', 'AZT-3TC-LPV/r');

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (1068, 'ABC(120mg)+3TC(60mg)+RAL(25mg)',  'Abacavir+Lamivudine+Raltegravir', 3, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES ( 'ABC(120mg)+3TC(60mg)+RAL(25mg)', 'ABC-3TC-RAL');


-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (1069, 'ABC(60mg)+3TC(30mg)+RAL(25mg)',  'Abacavir+Lamivudine+Raltegravir', 3, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES ( 'ABC(60mg)+3TC(30mg)+RAL(25mg)', 'ABC-3TC-RAL');

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (1070, 'ABC(120mg)+3TC(60mg)+EFV(200mg)',  'Abacavir+Lamivudine+Efavirenz', 3, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES ( 'ABC(120mg)+3TC(60mg)+EFV(200mg)', 'ABC-3TC-EFV');

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (1071, 'AZT(120mg)+3TC(60mg)+EFV(200mg)',  'Zidovudine+Lamivudine+Efavirenz', 3, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES ( 'AZT(120mg)+3TC(60mg)+EFV(200mg)', 'AZT-3TC-EFV');

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (1072, 'AZT(120mg)+3TC(60mg)+LPV/r(100/25mg)',  'Zidovudine+Lamivudine+Lopinavir/Ritonavir', 4, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES ( 'AZT(120mg)+3TC(60mg)+LPV/r(100/25mg)', 'AZT-3TC-LPV/r');

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (1073, 'AZT(60mg)+3TC(30mg)+LPV/r(100/25mg)',  'Zidovudine+Lamivudine+Lopinavir/Ritonavir', 4, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES ( 'AZT(60mg)+3TC(30mg)+LPV/r(100/25mg)', 'AZT+3TC+LPV/r');


-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (1074, 'AZT(60mg)+3TC(30mg)+LPV/r(40/10mg)',  'Zidovudine+Lamivudine+Lopinavir/Ritonavir', 4, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES ( 'AZT(60mg)+3TC(30mg)+LPV/r(40/10mg)', 'AZT-3TC-LPV/r');

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (1075, 'AZT(300mg)+3TC(150mg)+ATV/r(300/100mg)',  'Zidovudine+Lamivudine+Atazanavir/Ritonavir' , 4, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES ( 'AZT(300mg)+3TC(150mg)+ATV/r(300/100mg)', 'AZT-3TC-ATV/r');

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (1076, 'ABC(120mg)+3TC(60mg)+LPV/r(100/25mg)',  'Abacavir+Lamivudine+Lopinavir/Ritonavir' , 4, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES ( 'ABC(120mg)+3TC(60mg)+LPV/r(100/25mg)', 'ABC-3TC-LPV/r');

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (1077, 'ABC(60mg)+3TC(30mg)+LPV/r(100/25mg)',  'Abacavir+Lamivudine+Lopinavir/Ritonavir' , 4, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES ( 'ABC(60mg)+3TC(30mg)+LPV/r(100/25mg)', 'ABC-3TC-LPV/r');

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (1078, 'ABC(60mg)+3TC(30mg)+LPV/r(40/10mg)',  'Abacavir+Lamivudine+Lopinavir/Ritonavir' , 4, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES ( 'ABC(60mg)+3TC(30mg)+LPV/r(40/10mg)', 'ABC-3TC-LPV/r');

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (1079, 'ABC(120mg)+3TC(60mg)+RAL(25mg)',  'Abacavir+Lamivudine+Raltegravir' , 4, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES ( 'ABC(120mg)+3TC(60mg)+RAL(25mg)', 'ABC-3TC-RAL');

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (1080, 'ABC(60mg)+3TC(30mg)+RAL(25mg)',  'Abacavir+Lamivudine+Raltegravir' , 4, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES ( 'ABC(60mg)+3TC(30mg)+RAL(25mg)', 'ABC-3TC-RAL');

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (1081, 'TDF(300mg)+3TC(300mg)+DRV/r(400mg/50mg)',  'Tenofovir+Lamivudine+Darunavir/Ritonavir' , 4, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES ( 'TDF(300mg)+3TC(300mg)+DRV/r(400mg/50mg)', 'TDF-3TC-DRV/r');

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (1082, 'ABC(300mg)+3TC(150mg)+DRV/r(600/100mg)',  'Abacavir+Lamivudine+Darunavir+Ritonavir', 16, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES ( 'ABC(300mg)+3TC(150mg)+DRV/r(600/100mg)', 'ABC+3TC+DRV/r');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES ('ARV_REGIMEN', '6b', 'ABC+3TC+DRV/r', 'Pediatric 3rd line', '', 'NDR6b0154');

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (1083, 'ABC(60mg)+3TC(30mg)+LPV/r(100/25mg)',  'Abacavir+Lamivudine+Lopinavir/Ritonavir', 3, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES ( 'ABC(60mg)+3TC(30mg)+LPV/r(100/25mg)', 'ABC-3TC-LPV/r');

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (1084, 'Cotrimoxazole 800mg',  '', 8, true, 1);

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (1085, 'Cotrimoxazole 400mg',  '', 8, true, 1);

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (1086, 'Cotrimoxazole 120mg', '', 8, true, 1);

-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO hiv_regimen (id, description, composition, regimen_type_id, active, priority)
VALUES (1088, 'AZT(300mg)+3TC(150mg)+DTG(50mg)',  'Zidovudine+Lamivudine+Dolutegravir', 2, true, 1);

INSERT INTO hiv_regimen_resolver (regimensys, regimen)
VALUES ( 'AZT(300mg)+3TC(150mg)+DTG(50mg)', 'AZT+3TC+DTG');

INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES ('ARV_REGIMEN', '1z', 'AZT+3TC+DTG', 'Adult 2nd line', '', 'NDR1z0039');
