UPDATE hiv_regimen_resolver
SET regimen = CASE regimen
    WHEN 'CTX960' THEN 'Cotrimoxazole 960mg'
    WHEN 'CTX800' THEN 'Cotrimoxazole 800mg'
    WHEN 'CTX480' THEN 'Cotrimoxazole 480mg'
    WHEN 'CTX400' THEN 'Cotrimoxazole 400mg'
    WHEN 'CTX240' THEN 'Cotrimoxazole 240mg/5ml'
    WHEN 'PZI' THEN 'Pyrazinamide (PZI)'
    WHEN 'ETH' THEN 'Ethambutol'
    WHEN 'INH+RIF' THEN 'Isoniazid + Rifapentine'
    WHEN 'STR' THEN 'Streptomycin'
    WHEN 'INH+RIF+PZI+ETH+STR' THEN 'Isoniazid-Rifampicin-Pyrazinamide-Ethambutol-Streptomycin'
    WHEN 'RFB' THEN 'Rifabutin'
    WHEN 'INH+RIF+ETH' THEN 'Isoniazid-Rifampicin-Ethambutol'
    WHEN 'INH300' THEN 'Isoniazid(INH)'
    WHEN 'INH100' THEN 'Isoniazid(INH)'
    ELSE regimen
END
WHERE regimen IN ('CTX960', 'CTX800', 'CTX480', 'CTX400', 'CTX240', 'PZI', 'ETH',
                  'INH+RIF', 'STR', 'INH+RIF+PZI+ETH+STR', 'RFB', 'INH+RIF+ETH','INH300', 'INH100'
                 );

UPDATE ndr_code_set
SET code_description = CASE code_description
    WHEN 'CTX960' THEN 'Cotrimoxazole 960mg'
    WHEN 'CTX800' THEN 'Cotrimoxazole 800mg'
    WHEN 'CTX480' THEN 'Cotrimoxazole 480mg'
    WHEN 'CTX400' THEN 'Cotrimoxazole 400mg'
    WHEN 'CTX240' THEN 'Cotrimoxazole 240mg/5ml'
    WHEN 'PZI' THEN 'Pyrazinamide (PZI)'
    WHEN 'ETH' THEN 'Ethambutol'
    WHEN 'INH+RIF' THEN 'Isoniazid + Rifapentine'
    WHEN 'STR' THEN 'Streptomycin'
    WHEN 'INH+RIF+PZI+ETH+STR' THEN 'Isoniazid-Rifampicin-Pyrazinamide-Ethambutol-Streptomycin'
    WHEN 'RFB' THEN 'Rifabutin'
    WHEN 'INH+RIF+ETH' THEN 'Isoniazid-Rifampicin-Ethambutol'
    WHEN 'INH300' THEN 'Isoniazid(INH)'
    WHEN 'INH100' THEN 'Isoniazid(INH)'
    ELSE code_description
END
WHERE code_description IN ('CTX960', 'CTX800', 'CTX480', 'CTX400', 'CTX240', 'PZI', 'ETH',
                           'INH+RIF', 'STR', 'INH+RIF+PZI+ETH+STR', 'RFB', 'INH+RIF+ETH','INH300', 'INH100'
                          );



