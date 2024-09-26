
--Lab test table updates
UPDATE laboratory_labtest SET lab_test_name = 'Alkaline Phosphatase (ALP)' WHERE lab_test_name = 'Alk. Phosphatase';

UPDATE laboratory_labtest SET lab_test_name = 'Bilirubin' WHERE lab_test_name = 'Total Bilirubin';

UPDATE laboratory_labtest SET lab_test_name = 'Total protein' WHERE lab_test_name = 'PROTEIN';

UPDATE laboratory_labtest SET lab_test_name = 'Clinical evaluation only' WHERE lab_test_name = 'Clinical Diagnosis';

UPDATE laboratory_labtest SET lab_test_name = 'AFB smear microscopy' WHERE lab_test_name = 'AFB microscopy';

INSERT INTO public.laboratory_labtest(id, uuid, lab_test_name, unit, labtestgroup_id, created_by, date_created, modified_by, date_modified, archived) SELECT (SELECT MAX(id) + 1 FROM laboratory_labtest), uuid_generate_v4(), 'Alanine Aminoransferase (ALT)', 'IU/L', 1, NULL, NULL, NULL, NULL, NULL WHERE NOT EXISTS (SELECT lab_test_name from laboratory_labtest WHERE lab_test_name = 'Alanine Aminoransferase (ALT)' LIMIT 1);
	
INSERT INTO public.laboratory_labtest(id, uuid, lab_test_name, unit, labtestgroup_id, created_by, date_created, modified_by, date_modified, archived) SELECT (SELECT MAX(id) + 1 FROM laboratory_labtest), uuid_generate_v4(), 'Aspartate Aminotransferase (AST)', 'IU/L', 1, NULL, NULL, NULL, NULL, NULL WHERE NOT EXISTS (SELECT lab_test_name from laboratory_labtest WHERE lab_test_name = 'Aspartate Aminotransferase (AST)' LIMIT 1);

INSERT INTO public.laboratory_labtest(id, uuid, lab_test_name, unit, labtestgroup_id, created_by, date_created, modified_by, date_modified, archived) SELECT (SELECT MAX(id) + 1 FROM laboratory_labtest), uuid_generate_v4(), 'Gamma Glutamyl transferase (GGT)', 'IU/L', 1, NULL, NULL, NULL, NULL, NULL WHERE NOT EXISTS (SELECT lab_test_name from laboratory_labtest WHERE lab_test_name = 'Gamma Glutamyl transferase (GGT)' LIMIT 1);

INSERT INTO public.laboratory_labtest(id, uuid, lab_test_name, unit, labtestgroup_id, created_by, date_created, modified_by, date_modified, archived) SELECT (SELECT MAX(id) + 1 FROM laboratory_labtest), uuid_generate_v4(), 'Albumin', 'g/l', 1, NULL, NULL, NULL, NULL, NULL WHERE NOT EXISTS (SELECT lab_test_name from laboratory_labtest WHERE lab_test_name = 'Albumin' LIMIT 1);

INSERT INTO public.laboratory_labtest(id, uuid, lab_test_name, unit, labtestgroup_id, created_by, date_created, modified_by, date_modified, archived) SELECT (SELECT MAX(id) + 1 FROM laboratory_labtest), uuid_generate_v4(), 'Cobas', '+/-', 5, NULL, NULL, NULL, NULL, NULL WHERE NOT EXISTS (SELECT lab_test_name from laboratory_labtest WHERE lab_test_name = 'Cobas' LIMIT 1);
