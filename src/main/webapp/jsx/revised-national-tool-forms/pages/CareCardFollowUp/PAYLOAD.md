# Care Card Follow-Up Visit — Backend Payload Reference

## Endpoint

```
POST /observation
Authorization: Bearer <token>
Content-Type: application/json
```

---

## Top-Level Structure

| Field               | Type     | Required | Description                                              |
|---------------------|----------|----------|----------------------------------------------------------|
| `dateOfObservation` | `string` | Yes      | ISO date — copied from `data.visitInfo.visit_date`       |
| `personId`          | `number` | Yes      | Internal patient ID (`patientObj.id`)                    |
| `type`              | `string` | Yes      | Always `"Care Card Follow-Up Visit"`                     |
| `data`              | `object` | Yes      | Contains six sub-objects (see below)                     |

---

## `data.visitInfo` — Visit Information

| Field                  | Type     | Required | Notes                                      |
|------------------------|----------|----------|--------------------------------------------|
| `visit_date`           | `string` | **Yes**  | ISO date (`YYYY-MM-DD`). Cannot be in the future. Also used as `dateOfObservation`. |
| `duration_on_art_months` | `string` | No     | Numeric string — months since ART start. e.g. `"6"` |
| `clinician_name`       | `string` | No       | Full name of attending clinician           |

---

## `data.vitals` — Vitals

| Field                           | Type     | Required | Notes                                                         |
|---------------------------------|----------|----------|---------------------------------------------------------------|
| `height_cm`                     | `string` | No       | Numeric string — e.g. `"165"`                                 |
| `weight_kg`                     | `string` | No       | Numeric string — e.g. `"60"`                                  |
| `bmi_muac`                      | `string` | No       | Calculated BMI or MUAC measurement                            |
| `bp_systolic`                   | `string` | No       | Systolic blood pressure in mmHg — e.g. `"120"`               |
| `bp_diastolic`                  | `string` | No       | Diastolic blood pressure in mmHg — e.g. `"80"`               |
| `pregnancy_breastfeeding_status`| `string` | No       | **Female patients only.** `"P"` = Pregnant, `"B"` = Breastfeeding, `"N"` = Not Applicable. Empty string for males. |
| `family_planning`               | `string` | No       | **Female patients only.** See Family Planning codes below.    |

### Family Planning Codes

| Code  | Label                          |
|-------|--------------------------------|
| `"0"` | None                           |
| `"1"` | Oral Contraceptives            |
| `"2"` | Injectables                    |
| `"3"` | Implant / Norplant             |
| `"4"` | IUD                            |
| `"5"` | Male / Female Condom           |
| `"6"` | Male / Female Sterilization    |
| `"7"` | Natural Family Planning        |
| `"8"` | Emergency Contraception        |
| `"9"` | Other                          |

---

## `data.clinical` — Clinical Status & Conditions

| Field                     | Type            | Required | Notes                                                |
|---------------------------|-----------------|----------|------------------------------------------------------|
| `who_stage`               | `string`        | No       | `"Stage 1"`, `"Stage 2"`, `"Stage 3"`, `"Stage 4"` |
| `tb_status`               | `string`        | No       | Numeric string `"1"`–`"6"`. See TB Status codes below. |
| `cryptococcal_status`     | `string`        | No       | Numeric string `"0"`–`"3"`. See Cryptococcal Status codes below. |
| `hepatitis_status`        | `string`        | No       | See Hepatitis Status values below.                   |
| `oral_problems`           | `string`        | No       | Free text — e.g. `"Oral candidiasis"`               |
| `cervical_cancer_screening`| `string\|null` | No       | **Female patients only.** Numeric string `"0"`–`"5"`. `null` for males. |
| `oi_conditions`           | `array`         | No       | Array of `{ value, label }` objects from multi-select. See OI Conditions values. |
| `noted_side_effects`      | `array`         | No       | Array of `{ value, label }` objects from multi-select. See Side Effects values. |

### TB Status Codes

| Code  | Label                                           |
|-------|-------------------------------------------------|
| `"1"` | No signs or symptoms of TB                     |
| `"2"` | Presumptive TB, referred for evaluation         |
| `"3"` | Confirmed TB, on TB treatment                  |
| `"4"` | TB treatment completed                          |
| `"5"` | Currently on TPT                               |
| `"6"` | Currently on IPT / INH prophylaxis              |

### Cryptococcal Status Codes

| Code  | Label                                                   |
|-------|---------------------------------------------------------|
| `"0"` | Not screened                                            |
| `"1"` | Negative                                                |
| `"2"` | Positive                                                |
| `"3"` | Not applicable                                          |

### Hepatitis Status Values

`"Negative"`, `"Positive (Hepatitis B)"`, `"Positive (Hepatitis C)"`, `"Positive (Hepatitis B + C)"`, `"Not tested"`

### Cervical Cancer Screening Codes (Female only)

| Code  | Label                            |
|-------|----------------------------------|
| `"0"` | Not screened                    |
| `"1"` | Screen negative (normal)        |
| `"2"` | Screen positive (low grade)     |
| `"3"` | Screen positive (high grade)    |
| `"4"` | Suspected cancer                |
| `"5"` | Referred                        |

### OI Condition Values (`oi_conditions[].value`)

`"bacterial_pneumonia"`, `"candidiasis"`, `"cryptococcal_meningitis"`, `"cryptosporidiosis"`,
`"cytomegalovirus"`, `"herpes_simplex"`, `"herpes_zoster"`, `"hiv_wasting_syndrome"`,
`"isosporiasis"`, `"kaposi_sarcoma"`, `"mac"`, `"molluscum_contagiosum"`, `"pcp"`,
`"peripheral_neuropathy"`, `"pml"`, `"pulmonary_tb"`, `"toxoplasmosis"`, `"other"`

### Noted Side Effect Values (`noted_side_effects[].value`)

`"anaemia"`, `"dizziness_confusion"`, `"diarrhoea"`, `"fatigue"`, `"hepatotoxicity"`,
`"hypersensitivity"`, `"jaundice"`, `"lactic_acidosis"`, `"lipoatrophy"`, `"lipodystrophy"`,
`"nausea_vomiting"`, `"pancreatitis"`, `"peripheral_neuropathy"`, `"rash"`, `"renal_toxicity"`,
`"other"`

---

## `data.arv` — ARV Drugs

| Field      | Type     | Required | Notes                                                     |
|------------|----------|----------|-----------------------------------------------------------|
| `regimen`  | `string` | **Yes**  | ARV regimen name — e.g. `"TDF/3TC/DTG"`. See ARV Regimen values. |
| `dose`     | `string` | No       | Free text — e.g. `"1 tablet daily"`                      |
| `adherence`| `string` | No       | `"G"` (Good ≥95%), `"F"` (Fair 85–94%), `"P"` (Poor <85%) |

### ARV Regimen Values

**First Line — Adults:** `TDF/3TC/DTG`, `TDF/3TC/EFV`, `TDF/3TC/NVP`, `AZT/3TC/DTG`, `AZT/3TC/EFV`, `AZT/3TC/NVP`, `ABC/3TC/DTG`, `ABC/3TC/EFV`, `ABC/3TC/NVP`

**Second Line — Adults:** `TDF/3TC/ATV/r`, `TDF/3TC/LPV/r`, `AZT/3TC/ATV/r`, `AZT/3TC/LPV/r`, `ABC/3TC/LPV/r`

**Third Line:** `DRV/r + RAL + others`, `Other (specify)`

**Paediatric:** `ABC/3TC/DTG (Ped)`, `ABC/3TC/LPV/r (Ped)`, `AZT/3TC/NVP (Ped)`, `AZT/3TC/LPV/r (Ped)`, `TDF/3TC/DTG (Ped)`

---

## `data.cotrimoxazole` — Cotrimoxazole (CTX)

| Field        | Type     | Required | Notes                                     |
|--------------|----------|----------|-------------------------------------------|
| `medication` | `string` | No       | Free text — e.g. `"Cotrimoxazole 960mg"` |
| `dose`       | `string` | No       | Free text — e.g. `"1 tablet daily"`      |
| `adherence`  | `string` | No       | `"G"`, `"F"`, or `"P"` (same as ARV)     |

---

## `data.tpt` — TB Preventive Therapy

| Field             | Type     | Required | Notes                            |
|-------------------|----------|----------|----------------------------------|
| `code`            | `string` | No       | See TPT Medication Codes below. Empty string `""` if not prescribed. |
| `dose`            | `string` | No       | Free text — e.g. `"300mg"`      |
| `start_date`      | `string` | No       | ISO date (`YYYY-MM-DD`)          |
| `completion_date` | `string` | No       | ISO date (`YYYY-MM-DD`)          |

### TPT Medication Codes

| Code     | Full Name                                                      |
|----------|----------------------------------------------------------------|
| `"6H"`   | Isoniazid — 6 months                                          |
| `"3HP"`  | Isoniazid and Rifapentine                                      |
| `"3HR"`  | Isoniazid and Rifampicin                                       |
| `"QTIP"` | Cotrimoxazole/Isoniazid/Pyridoxine Fixed Dose (CTX/INH/B6 FDC)|

---

## `data.otherDrugs` — Other Drugs Prescribed

| Field        | Type     | Required | Notes                                                          |
|--------------|----------|----------|----------------------------------------------------------------|
| `otherDrugs` | `string` | No       | Free text list of any other drugs prescribed at this visit     |

---

## `data.lab` — Lab Results

| Field                  | Type     | Required | Notes                                                       |
|------------------------|----------|----------|-------------------------------------------------------------|
| `cd4_count`            | `string` | No       | Numeric string — cells/mm³. e.g. `"350"`                   |
| `cd4_date`             | `string` | No       | ISO date (`YYYY-MM-DD`)                                     |
| `viral_load_result`    | `string` | No       | Free text — e.g. `"200"` or `"Not Detected"`               |
| `viral_load_date`      | `string` | No       | ISO date (`YYYY-MM-DD`)                                     |
| `viral_load_indication`| `string` | No       | Numeric string `"1"`–`"8"`. See VL Indication codes below. |
| `eac_1st_date`         | `string` | No       | ISO date — 1st EAC session date (used when VL > 1000)       |
| `eac_2nd_date`         | `string` | No       | ISO date — 2nd EAC session date                             |
| `eac_3rd_date`         | `string` | No       | ISO date — 3rd EAC session date                             |
| `rbs`                  | `string` | No       | Random blood sugar in mmol/L — e.g. `"5.6"`                |
| `other_tests_done`     | `string` | No       | Free text — e.g. `"HBsAg, Creatinine"`                     |

### Viral Load Indication Codes

| Code  | Label                              |
|-------|------------------------------------|
| `"1"` | Routine (Baseline)                 |
| `"2"` | Routine (6 months)                 |
| `"3"` | Routine (12 months)                |
| `"4"` | Routine (24 months / annual)       |
| `"5"` | High Viral Load follow-up          |
| `"6"` | Clinical / Immunological failure   |
| `"7"` | PMTCT                              |
| `"8"` | Other                              |

---

## `data.followUp` — Follow-up

| Field                   | Type     | Required | Notes                                                    |
|-------------------------|----------|----------|----------------------------------------------------------|
| `current_on_medication` | `string` | No       | `"Y"` = Yes, `"N"` = No                                 |
| `next_appointment_date` | `string` | No       | ISO date (`YYYY-MM-DD`). Must not be in the past.        |

---

## Validation Rules (enforced on frontend)

| Field                       | Rule                                         |
|-----------------------------|----------------------------------------------|
| `data.visitInfo.visit_date` | Required, must not be in the future          |
| `data.arv.regimen`          | Required                                     |

---

## Full Payload Example

```json
{
  "dateOfObservation": "2024-03-15",
  "personId": 456,
  "type": "Care Card Follow-Up Visit",
  "data": {
    "visitInfo": {
      "visit_date": "2024-03-15",
      "duration_on_art_months": "6",
      "clinician_name": "Dr. Amina Bello"
    },
    "vitals": {
      "height_cm": "165",
      "weight_kg": "62",
      "bmi_muac": "22.8",
      "bp_systolic": "118",
      "bp_diastolic": "76",
      "pregnancy_breastfeeding_status": "N",
      "family_planning": "5"
    },
    "clinical": {
      "who_stage": "Stage 2",
      "tb_status": "1",
      "cryptococcal_status": "3",
      "hepatitis_status": "Negative",
      "oral_problems": "",
      "cervical_cancer_screening": "1",
      "oi_conditions": [
        { "value": "herpes_zoster", "label": "Herpes Zoster" }
      ],
      "noted_side_effects": []
    },
    "arv": {
      "regimen": "TDF/3TC/DTG",
      "dose": "1 tablet daily",
      "adherence": "G"
    },
    "cotrimoxazole": {
      "medication": "Cotrimoxazole 960mg",
      "dose": "1 tablet daily",
      "adherence": "G"
    },
    "tpt": {
      "code": "6H",
      "dose": "300mg",
      "start_date": "2024-01-20",
      "completion_date": "2024-07-20"
    },
    "otherDrugs": "Multivitamin 1 tablet daily",
    "lab": {
      "cd4_count": "420",
      "cd4_date": "2024-03-01",
      "viral_load_result": "Not Detected",
      "viral_load_date": "2024-03-10",
      "viral_load_indication": "3",
      "eac_1st_date": "",
      "eac_2nd_date": "",
      "eac_3rd_date": "",
      "rbs": "",
      "other_tests_done": "HBsAg"
    },
    "followUp": {
      "current_on_medication": "Y",
      "next_appointment_date": "2024-06-15"
    }
  }
}
```

---

## Example — Male Patient (no female-specific fields)

```json
{
  "dateOfObservation": "2024-04-02",
  "personId": 789,
  "type": "Care Card Follow-Up Visit",
  "data": {
    "visitInfo": {
      "visit_date": "2024-04-02",
      "duration_on_art_months": "12",
      "clinician_name": "Dr. James Obi"
    },
    "vitals": {
      "height_cm": "172",
      "weight_kg": "70",
      "bmi_muac": "23.6",
      "bp_systolic": "130",
      "bp_diastolic": "85",
      "pregnancy_breastfeeding_status": "",
      "family_planning": ""
    },
    "clinical": {
      "who_stage": "Stage 1",
      "tb_status": "5",
      "cryptococcal_status": "3",
      "hepatitis_status": "Not tested",
      "oral_problems": "",
      "cervical_cancer_screening": null,
      "oi_conditions": [],
      "noted_side_effects": [
        { "value": "nausea_vomiting", "label": "Nausea / Vomiting" }
      ]
    },
    "arv": {
      "regimen": "AZT/3TC/DTG",
      "dose": "1 tablet twice daily",
      "adherence": "F"
    },
    "cotrimoxazole": {
      "medication": "",
      "dose": "",
      "adherence": ""
    },
    "tpt": {
      "code": "3HP",
      "dose": "300mg/300mg",
      "start_date": "2024-01-15",
      "completion_date": "2024-04-15"
    },
    "otherDrugs": "",
    "lab": {
      "cd4_count": "550",
      "cd4_date": "2024-03-28",
      "viral_load_result": "Not Detected",
      "viral_load_date": "2024-03-28",
      "viral_load_indication": "4",
      "eac_1st_date": "",
      "eac_2nd_date": "",
      "eac_3rd_date": "",
      "rbs": "5.2",
      "other_tests_done": "Full blood count"
    },
    "followUp": {
      "current_on_medication": "Y",
      "next_appointment_date": "2024-10-02"
    }
  }
}
```

---

## Notes for Backend

- `dateOfObservation` at the top level is always a copy of `data.visitInfo.visit_date`.
- `data.vitals.pregnancy_breastfeeding_status` and `data.vitals.family_planning` are only collected for female patients. They will be empty strings `""` for male patients — treat empty string as absent.
- `data.clinical.cervical_cancer_screening` is only collected for female patients. It will be `null` for male patients.
- `data.clinical.oi_conditions` and `data.clinical.noted_side_effects` are arrays of `{ value, label }` objects from a multi-select. The backend may store the `value` keys only or both fields.
- All numeric measurements (`height_cm`, `weight_kg`, `cd4_count`, `rbs`, `bp_systolic`, `bp_diastolic`) are sent as **strings**. The backend should cast to the appropriate numeric type.
- `data.tpt.code` will be an empty string `""` if no TPT was prescribed.
- EAC dates (`eac_1st_date`, `eac_2nd_date`, `eac_3rd_date`) will be empty strings `""` if not applicable.
