-- Update NDR codes for TDF+3TC+ATV/r regimens
UPDATE ndr_code_set
SET ndr_code = 'NDR2b0045'
WHERE code_description = 'TDF+3TC+ATV/r' AND code = '2b';

-- Update alt_description for TDF+3TC+ATV/r regimen with code 2d2
UPDATE ndr_code_set
SET alt_description = 'Adult 2nd-Line Regimens'
WHERE code_description = 'TDF+3TC+ATV/r' AND code = '2d2';

-- Update NDR code for TDF+3TC+ATV/r regimen with code 5c
UPDATE ndr_code_set
SET ndr_code = 'NDR2d0048'
WHERE code_description = 'TDF+3TC+ATV/r' AND code = '5c';

-- Insert new pediatric regimen: TDF+3TC+DTG
INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES ('ARV_REGIMEN', '4a', 'TDF+3TC+DTG', 'Peadiatric 1st-Line Regimens', '', 'NDR4a0105');

-- Insert new pediatric regimen: TDF+3TC+EFV
INSERT INTO ndr_code_set (code_set_nm, code, code_description, alt_description, sys_description, ndr_code)
VALUES ('ARV_REGIMEN', '4d', 'TDF+3TC+EFV', 'Peadiatric 1st-Line Regimens', '', 'NDR4d0110');
