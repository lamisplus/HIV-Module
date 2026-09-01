-- SECTION 1: COLOR GREEN
UPDATE ndr_code_set
SET ndr_code = CASE code
                   WHEN '9d' THEN 'NDR9d0175'
                   WHEN '9e' THEN 'NDR9e0176'
                   WHEN '9f' THEN 'NDR9f0177'
                   WHEN '9g' THEN 'NDR9g0178'
                   WHEN '2e' THEN 'NDR2e0050'
                   WHEN 'DDS' THEN 'NDRDDS0188'
                   WHEN 'INHB6' THEN 'NDRINHB60189'
                   WHEN '3c' THEN 'NDR3c0084'
                   WHEN '3e' THEN 'NDR3e0086'
                   WHEN '3f' THEN 'NDR3f0087'
                   WHEN '3j' THEN 'NDR3j0091'
                   WHEN '3k' THEN 'NDR3k0092'
                   WHEN '3p' THEN 'NDR3p0096'
                   WHEN '3q' THEN 'NDR3q0097'
                   WHEN '1r' THEN 'NDR1r0030'
                   WHEN '2f' THEN 'NDR2f0054'
                   WHEN '3u' THEN 'NDR3u0101'
                   WHEN '2a' THEN 'NDR2a0040'
                   WHEN '5g' THEN 'NDR5g0138'
                   WHEN '5h' THEN 'NDR5h0141'
                   WHEN '2b' THEN 'NDR2b0043'
                   WHEN '4c' THEN 'NDR4c0108'
                   WHEN '1s' THEN 'NDR1s0031'
                   WHEN '1u' THEN 'NDR1u0032'
                   WHEN '1v' THEN 'NDR1v0033'
                   WHEN '1w' THEN 'NDR1w0034'
                   WHEN '1x' THEN 'NDR1x0036'
                   WHEN '1z' THEN 'NDR1z0038'
                   WHEN '2h' THEN 'NDR2h0059'
                   WHEN '2i' THEN 'NDR2i0060'
                   WHEN '2k' THEN 'NDR2k0062'
                   WHEN '2n' THEN 'NDR2n0064'
                   WHEN '2o' THEN 'NDR2o0065'
                   WHEN '2p' THEN 'NDR2p0066'
                   WHEN '2q' THEN 'NDR2q0067'
                   WHEN '2r' THEN 'NDR2r0068'
                   WHEN '2s' THEN 'NDR2s0069'
                   WHEN '2t' THEN 'NDR2t0070'
                   WHEN '2u' THEN 'NDR2u0071'
                   WHEN '2w' THEN 'NDR2w0073'
                   WHEN '2x' THEN 'NDR2x0074'
                   WHEN '5c5' THEN 'NDR5c0128'
                   WHEN '3r' THEN 'NDR3r0098'
                   WHEN '3s' THEN 'NDR3s0099'
                   WHEN '3t' THEN 'NDR3t0100'
                   WHEN '3w' THEN 'NDR3w0103'
                   WHEN '3x' THEN 'NDR3x0104'
                   WHEN '6d' THEN 'NDR6d0161'
                   ELSE ndr_code
    END
WHERE ndr_code IS NULL
  AND code IN (
               '9d', '9e', '9f', '9g', '2e', 'DDS', 'INHB6',
               '3c', '3e', '3f', '3j', '3k', '3p', '3q',
               '1r', '2f', '3u',
               '2a', '5g', '5h', '2b', '4c',
               '1s', '1u', '1v', '1w', '1x', '1z',
               '2h', '2i', '2k', '2n', '2o', '2p', '2q', '2r', '2s', '2t', '2u', '2w', '2x',
               '5c5',
               '3r', '3s', '3t', '3w', '3x',
               '6d'
    );


-- SECTION 2: COLOR YELLOW
UPDATE ndr_code_set
SET code_description = 'TDF+3TC+AZT',
    ndr_code = 'NDR9C0180'
WHERE code = 'C'
  AND code_description = 'TDF-3TC-AZT '
  AND ndr_code IS NULL;

UPDATE ndr_code_set
SET code_description = 'DDI+3TC+IND/r',
    ndr_code = 'NDR2v0072'
WHERE code = '2v'
  AND code_description = '	DDI-3TC-IND/r'
  AND ndr_code IS NULL;


INSERT INTO ndr_code_set (code_set_nm, code, code_description, ndr_code)
VALUES ('ARV_REGIMEN', '6d', 'DRV/r+RAL+3TC+TDF', 'NDR6d0160');

-- UPDATE ndr_code_set
-- SET code_description = 'DTG+3TC+TDF',
--     ndr_code = 'NDR6e0163'
-- WHERE code = '6e'
--   AND code_description = 'DTG+2 NRTIs'
--   AND ndr_code IS NULL;
--
-- UPDATE ndr_code_set
-- SET code_description = 'RAL+3TC+TDF',
--     ndr_code = 'NDR6f0166'
-- WHERE code = '6f'
--   AND code_description = 'RAL(or DTG) + 2 NRTIs'
--   AND ndr_code IS NULL;
--
-- UPDATE ndr_code_set
-- SET code_description = 'DRV/r+3TC+TDF+EFV',
--     ndr_code = 'NDR6g0169'
-- WHERE code = '6g'
--   AND code_description = 'DRV/r-2NRTIs+NNRTI'
--   AND ndr_code IS NULL;

DELETE FROM ndr_code_set
WHERE code IN ('6e', '6f', '6g', '4G');
-- STEP 2: Insert all 9 records fresh (3 codes × 3 variations each)
INSERT INTO ndr_code_set (code_set_nm, code, code_description, ndr_code)
VALUES
    -- 6e variations (TDF, ABC, AZT)
    ('ARV_REGIMEN', '6e', 'DTG+3TC+TDF', 'NDR6e0163'),
    ('ARV_REGIMEN', '6e', 'DTG+3TC+ABC', 'NDR6e0164'),
    ('ARV_REGIMEN', '6e', 'DTG+3TC+AZT', 'NDR6e0165'),

    -- 6f variations (TDF, ABC, AZT)
    ('ARV_REGIMEN', '6f', 'RAL+3TC+TDF', 'NDR6f0166'),
    ('ARV_REGIMEN', '6f', 'RAL+3TC+ABC', 'NDR6f0167'),
    ('ARV_REGIMEN', '6f', 'RAL+3TC+AZT', 'NDR6f0168'),

    -- 6g variations (TDF, ABC, AZT)
    ('ARV_REGIMEN', '6g', 'DRV/r+3TC+TDF+EFV', 'NDR6g0169'),
    ('ARV_REGIMEN', '6g', 'DRV/r+3TC+ABC+EFV', 'NDR6g0170'),
    ('ARV_REGIMEN', '6g', 'DRV/r+3TC+AZT+EFV', 'NDR6g0171');

UPDATE ndr_code_set
SET code = '2e22',
    code_description = 'AZT+TDF+3TC+ATV/r',
    ndr_code = 'NDR2e0053'
WHERE code = '2e'
  AND code_description = 'AZT+TDF+3TC+ATV/r'
  AND ndr_code IS NULL;

UPDATE ndr_code_set
SET code_description = 'ABC+3TC+LPV+ATV/r',
    ndr_code = 'NDR3o0095'
WHERE code = '3o'
  AND code_description = '	ABC-3TC-LPV-ATV/r'
  AND ndr_code IS NULL;

UPDATE ndr_code_set
SET code = '3a3',
    code_description = 'AZT+TDF+3TC+LPV/r',
    ndr_code = 'NDR3a0079'
WHERE code = '2f'
  AND code_description = 'AZT+TDF+3TC+LPV/r'
  AND ndr_code IS NULL;

DELETE FROM ndr_code_set
WHERE code = '4G'
  AND ndr_code IS NULL;

-- Row 14, 15, 16: code='6e', '6f', '6g' - new record (AZT occurrence)
INSERT INTO ndr_code_set (code_set_nm, code, code_description, ndr_code)
VALUES
    ('ARV_REGIMEN', '6e', 'DTG+3TC+AZT', 'NDR6e0165'),
    ('ARV_REGIMEN', '6f', 'RAL+3TC+AZT', 'NDR6f0168'),
    ('ARV_REGIMEN', '6g', 'DRV/r+3TC+AZT+EFV', 'NDR6g0171');

-- Row 14, 15, 16: code='6e', '6f', '6g' - new record (ABC occurrence)
INSERT INTO ndr_code_set (code_set_nm, code, code_description, ndr_code)
VALUES
    ('ARV_REGIMEN', '6e', 'DTG+3TC+ABC', 'NDR6e0164'),
    ('ARV_REGIMEN', '6f', 'RAL+3TC+ABC', 'NDR6f0167'),
    ('ARV_REGIMEN', '6g', 'DRV/r+3TC+ABC+EFV', 'NDR6g0170');

-- Row 17: code='4H' - add a new ndr_code_set (Added code_set_nm to prevent NOT NULL error)
INSERT INTO ndr_code_set (code_set_nm, code, code_description, ndr_code, alt_description)
VALUES ('ARV_REGIMEN', '4H', 'ABC+3TC+EFV', 'NDR4f0113', 'Paediatric 1st-Line Regimens');


-- SECTION 3: COLOR RED (Deletions)
DELETE FROM ndr_code_set
WHERE ndr_code IS NULL
  AND code IN (
               '1k', '2g', '4g4', '1x1', '1z1',
               '5f', '6b6', '4d', '1a', '1b', '1d',
               '3a', '3b', '4a', '4b', '4f', '5e', '6b'
    );