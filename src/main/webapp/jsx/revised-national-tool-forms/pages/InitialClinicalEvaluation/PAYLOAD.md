# Initialization Clinical Evaluation — Backend Payload Reference

## Endpoint

```
POST /observation
Authorization: Bearer <token>
Content-Type: application/json
```

---

## Top-Level Structure

| Field               | Type     | Required | Description                                      |
|---------------------|----------|----------|--------------------------------------------------|
| `dateOfObservation` | `string` | Yes      | ISO date of the visit (`YYYY-MM-DD`)             |
| `personId`          | `number` | Yes      | Internal patient ID (`patientObj.id`)            |
| `type`              | `string` | Yes      | Always `"Initialization Clinical Evaluation"`    |
| `data`              | `object` | Yes      | Full form data (see sections below)              |

---

## `data` Object

### Visit Info

| Field           | Type     | Required | Description                    |
|-----------------|----------|----------|--------------------------------|
| `visitDate`     | `string` | Yes      | ISO date (`YYYY-MM-DD`)        |
| `clinicianName` | `string` | No       | Full name of attending clinician |

---

### `data.symptoms` — Symptoms Review

An array of symptom objects selected by the clinician. Each entry represents one symptom and its duration.

```json
"symptoms": [
  { "value": "fever",  "label": "Fever / Chills",  "duration": "5"  },
  { "value": "cough",  "label": "Cough",            "duration": "14" }
]
```

| Field      | Type     | Description                              |
|------------|----------|------------------------------------------|
| `value`    | `string` | Symptom key (see Symptom Keys below)     |
| `label`    | `string` | Human-readable symptom name             |
| `duration` | `string` | Duration in days (numeric string)        |

Also:

| Field          | Type     | Description                                      |
|----------------|----------|--------------------------------------------------|
| `otherSymptom` | `string` | Free-text for any symptom not in the list        |

#### Symptom Keys

| Key                    | Label                              |
|------------------------|------------------------------------|
| `fever`                | Fever / Chills                     |
| `weight_loss`          | Weight Loss / Failure to Gain Weight |
| `night_sweats`         | Night Sweats                       |
| `nausea`               | Nausea / Vomiting                  |
| `cough`                | Cough                              |
| `headache`             | Headache                           |
| `new_visual`           | New Visual Impairment              |
| `ear_discharge`        | Ear Discharge                      |
| `oral_sores`           | Oral Sores                         |
| `pain_swallowing`      | Pain / Difficulty when Swallowing  |
| `difficulty_breathing` | Difficulty Breathing               |
| `food_refusal`         | Food Refusal                       |
| `diarrhoea`            | Diarrhoea                          |
| `difficulty_sleeping`  | Difficulty Sleeping                |
| `pain_micturition`     | Pain on Micturition                |
| `genital_sores`        | Genital Sores                      |
| `genital_discharge`    | Genital Discharge                  |
| `genital_itching`      | Genital Itching                    |
| `convulsion`           | Convulsion                         |
| `pain`                 | Pain                               |
| `irritability`         | Irritability                       |
| `rash`                 | Rash                               |
| `weakness`             | Weakness                           |
| `itching`              | Itching                            |
| `chronic_diarrhoea`    | Chronic Diarrhoea                  |
| `numbness`             | Numbness / Tingling                |

---

### `data.tbAssessment` — TB & Other Assessments

| Field                      | Type     | Values                               | Notes                             |
|----------------------------|----------|--------------------------------------|-----------------------------------|
| `assessed_for_tb`          | `string` | `"Yes"`, `"No"`                     |                                   |
| `tb_status`                | `string` | Free text                            | e.g. `"Negative"`, `"Positive"`  |
| `developmental_assessment` | `string` | `"Appropriate"`, `"Delayed"`, `"Retarded"` |                            |
| `immunisation_complete`    | `string` | `"Yes"`, `"No"`                     |                                   |
| `mode_of_infant_feeding`   | `string` | `"EBF"`, `"EBMS"`, `"Mixed"`        | Only applicable for age ≤ 6 months |
| `known_drug_allergies`     | `string` | Free text                            | e.g. `"Penicillin"`              |
| `past_medical_history`     | `string` | Free text                            | Including hospitalisation/surgery |

---

### `data.pregnancy` — Pregnancy Information

> **Only present for female patients. Sent as `null` for male patients.**

| Field                      | Type     | Values                              | Notes                             |
|----------------------------|----------|-------------------------------------|-----------------------------------|
| `currently_pregnant`       | `string` | `"Yes"`, `"No"`, `"Uncertain"`     |                                   |
| `last_menstrual_period`    | `string` | ISO date (`YYYY-MM-DD`)             | Only if `currently_pregnant = "Yes"` |
| `gestational_age`          | `string` | Numeric string (weeks)              | Only if `currently_pregnant = "Yes"` |
| `expected_date_of_delivery`| `string` | ISO date (`YYYY-MM-DD`)             | Only if `currently_pregnant = "Yes"` |

---

### `data.currentMeds` — Current Medications

| Field           | Type      | Description                                 |
|-----------------|-----------|---------------------------------------------|
| `none`          | `boolean` | True if patient is on no medications        |
| `art`           | `boolean` | Currently on ART                            |
| `ctx`           | `boolean` | Currently on CTX (Co-trimoxazole)           |
| `anti_tb_drugs` | `boolean` | Currently on Anti-TB drugs                 |
| `other_specify` | `string`  | Free text for other medications             |

> When `none = true`, all other boolean fields are `false` and `other_specify` is `""`.

---

### `data.disclosure` — Disclosure Status

| Field              | Type      | Description                                     |
|--------------------|-----------|-------------------------------------------------|
| `no_one`           | `boolean` | Patient has not disclosed to anyone             |
| `family_member`    | `boolean` | Disclosed to a family member                    |
| `friend`           | `boolean` | Disclosed to a friend                           |
| `spouse`           | `boolean` | Disclosed to spouse                             |
| `spiritual_leader` | `boolean` | Disclosed to a spiritual leader                 |
| `others_specify`   | `string`  | Free text for other persons                     |

> When `no_one = true`, all other boolean fields are `false` and `others_specify` is `""`.

---

### `data.arvSideEffects` — Past or Current Medication Side Effects

| Field                | Type     | Values              | Notes                                      |
|----------------------|----------|---------------------|--------------------------------------------|
| `has_side_effects`   | `string` | `"None"`, `"Yes"`  |                                            |
| `side_effects_detail`| `string` | Free text           | Only collected when `has_side_effects = "Yes"` |
| `specify_medication` | `string` | Free text           | Only collected when `has_side_effects = "Yes"` |

---

### `data.arvHistory` — Previously ARV Exposure

| Field                      | Type      | Values          | Notes                                          |
|----------------------------|-----------|-----------------|------------------------------------------------|
| `previous_arv_exposure`    | `string`  | `"Yes"`, `"No"` |                                                |
| `earlier_arv_not_transfer` | `boolean` | —               | Only relevant when `previous_arv_exposure = "Yes"` |
| `prep`                     | `boolean` | —               | PrEP exposure                                  |
| `pep`                      | `boolean` | —               | PEP exposure                                   |
| `tran`                     | `boolean` | —               | Transfer-in                                    |
| `name_of_facility`         | `string`  | Free text       | Facility where patient previously received ARV |
| `duration_of_care_from`    | `string`  | ISO date        |                                                |
| `duration_of_care_to`      | `string`  | ISO date        |                                                |

---

### `data.vitals` — Physical Examination Vitals

| Field               | Type     | Unit      | Description            |
|---------------------|----------|-----------|------------------------|
| `temperature`       | `string` | °C        | Body temperature       |
| `bp_systolic`       | `string` | mmHg      | Systolic BP            |
| `bp_diastolic`      | `string` | mmHg      | Diastolic BP           |
| `pulse`             | `string` | beats/min | Pulse rate             |
| `weight`            | `string` | kg        | Patient weight         |
| `height`            | `string` | cm        | Patient height         |
| `head_circumference`| `string` | cm        | Head circumference     |
| `surface_area`      | `string` | cm²       | Body surface area      |

> All fields are numeric strings. Empty string `""` if not recorded.

---

### `data.physicalExam` — Body System Examination

Each body system follows the same shape:

```json
{
  "nsf": false,
  "findings": [
    { "value": "pallor", "label": "Pallor" }
  ],
  "other": "Free text for additional findings"
}
```

| Field      | Type      | Description                                                    |
|------------|-----------|----------------------------------------------------------------|
| `nsf`      | `boolean` | `true` = No Significant Finding. When true, `findings` is `[]` and `other` is `""` |
| `findings` | `array`   | Array of `{ value: string, label: string }` objects           |
| `other`    | `string`  | Free text for findings not in the predefined list             |

#### Systems

| Key                 | Label                 | Extra Fields          | Notes                          |
|---------------------|-----------------------|-----------------------|--------------------------------|
| `generalAppearance` | General Appearance    | —                     |                                |
| `headEyeEnt`        | Head / Eye / ENT      | —                     |                                |
| `cardiovascular`    | Cardiovascular        | —                     |                                |
| `respiratory`       | Respiratory           | `rate` (string, b/min)| Respiratory rate field added   |
| `gastrointestinal`  | Gastrointestinal      | —                     |                                |
| `genitalia`         | Genitalia             | `tanner_stage` (string) |                              |
| `breastGlands`      | Breasts / Glands      | —                     | **`null` for male patients**   |
| `skin`              | Skin                  | —                     |                                |
| `neurological`      | Neurological          | —                     |                                |
| `mentalStatus`      | Mental Status         | —                     |                                |

Also at the top level of `physicalExam`:

| Field                | Type     | Description                                |
|----------------------|----------|--------------------------------------------|
| `additionalFindings` | `string` | Free text for overall additional findings  |

#### Body System Finding Keys

**General Appearance:** `pallor`, `febrile`, `dehydrated`, `jaundice`, `peripheral_edema`

**Head / Eye / ENT:** `icterus`, `thrush`, `oral_ulcer`, `oral_ks`, `abnormal_fundoscopy`, `gingivitis`, `otitis_media`

**Cardiovascular:** `abnormal_heart_rate`, `auscultation_finding`

**Respiratory:** `labored_breathing`, `intercostal_recession`, `cyanosis`, `wheezing`, `auscultation_finding`

**Gastrointestinal:** `distention`, `hepatomegaly`, `spenomegaly`, `tenderness`

**Genitalia:** `genital_discharge`, `genital_ulcer_lesion`, `lymphadenopathy`

**Breasts / Glands:** `lumps_masses`, `discharge`, `parotid_swelling`, `lymphadenopathy`

**Skin:** `pruritic_papular`, `abscesses`, `herpes_zoster`, `kaposi_lesions`, `seborrheic_dermatitis`, `fungal_infections`, `scabies`

**Neurological:** `disoriented_tpp`, `impaired_consciousness`, `slurred_speech`, `blindness_1_2_eyes`, `weakness_paralysis`, `numbness_extremities`

**Mental Status:** `slow_mentation`, `memory_loss`, `mood_swings`, `depression`, `anxiety`, `suicidal_ideation`

---

### `data.assessment` — Confirmatory Details

#### Clinical Assessment

| Field                    | Type      | Description                     |
|--------------------------|-----------|---------------------------------|
| `asymptomatic`           | `boolean` |                                 |
| `symptomatic`            | `boolean` |                                 |
| `aids_defining_illness`  | `boolean` |                                 |
| `opportunistic_infection`| `boolean` |                                 |
| `who_stage`              | `string`  | **Required.** `"Stage 1"`, `"Stage 2"`, `"Stage 3"`, `"Stage 4"` |

#### Enrol In

| Field                        | Type      | Description                      |
|------------------------------|-----------|----------------------------------|
| `enroll_general_followup`    | `boolean` | General Medical Follow-up        |
| `enroll_arv_therapy`         | `boolean` | ARV Therapy                      |
| `enroll_ahd_management`      | `boolean` | AHD Management                   |
| `enroll_pending_lab_results` | `boolean` | Pending Lab Results              |

#### Plan for ART

| Field                       | Type      | Description                            |
|-----------------------------|-----------|----------------------------------------|
| `plan_art_ongoing_monitoring`| `boolean` | Ongoing Monitoring                    |
| `plan_art_postponed`        | `boolean` | ARV Tx Postponed for Clinical Reasons |
| `plan_art_change_treatment` | `boolean` | Change Treatment                       |
| `plan_art_restart`          | `boolean` | Restart Treatment                      |
| `plan_art_start_new`        | `boolean` | Start New Treatment                    |

#### Other

| Field                | Type     | Required | Description                      |
|----------------------|----------|----------|----------------------------------|
| `drugs_in_regimen`   | `string` | No       | Free text list of drugs          |
| `additional_comments`| `string` | No       | Free text                        |
| `next_appointment`   | `string` | No       | ISO date (`YYYY-MM-DD`)          |

---

## Full Payload Example

```json
{
  "dateOfObservation": "2024-01-15",
  "personId": 123,
  "type": "Initialization Clinical Evaluation",
  "data": {
    "visitDate": "2024-01-15",
    "clinicianName": "Dr. Jane Smith",
    "symptoms": [
      { "value": "fever", "label": "Fever / Chills", "duration": "5" },
      { "value": "cough", "label": "Cough", "duration": "14" }
    ],
    "otherSymptom": "Mild fatigue",
    "tbAssessment": {
      "assessed_for_tb": "Yes",
      "tb_status": "Negative",
      "developmental_assessment": "Appropriate",
      "immunisation_complete": "Yes",
      "mode_of_infant_feeding": "",
      "known_drug_allergies": "Penicillin",
      "past_medical_history": "Hypertension since 2019"
    },
    "pregnancy": {
      "currently_pregnant": "Yes",
      "last_menstrual_period": "2023-12-01",
      "gestational_age": "6",
      "expected_date_of_delivery": "2024-09-01"
    },
    "currentMeds": {
      "none": false,
      "art": true,
      "ctx": false,
      "anti_tb_drugs": false,
      "other_specify": "Vitamin B6"
    },
    "disclosure": {
      "no_one": false,
      "family_member": true,
      "friend": false,
      "spouse": true,
      "spiritual_leader": false,
      "others_specify": ""
    },
    "arvSideEffects": {
      "has_side_effects": "Yes",
      "side_effects_detail": "Nausea and dizziness",
      "specify_medication": "Efavirenz"
    },
    "arvHistory": {
      "previous_arv_exposure": "Yes",
      "earlier_arv_not_transfer": false,
      "prep": true,
      "pep": false,
      "tran": false,
      "name_of_facility": "Lagos General Hospital",
      "duration_of_care_from": "2022-01-01",
      "duration_of_care_to": "2023-06-30"
    },
    "vitals": {
      "temperature": "37.2",
      "bp_systolic": "120",
      "bp_diastolic": "80",
      "pulse": "72",
      "weight": "65",
      "height": "170",
      "head_circumference": "",
      "surface_area": ""
    },
    "physicalExam": {
      "generalAppearance": {
        "nsf": false,
        "findings": [{ "value": "pallor", "label": "Pallor" }],
        "other": "Mild lethargy"
      },
      "headEyeEnt":       { "nsf": true,  "findings": [], "other": "" },
      "cardiovascular":   { "nsf": false, "findings": [], "other": "" },
      "respiratory": {
        "nsf": false,
        "findings": [{ "value": "wheezing", "label": "Wheezing" }],
        "other": "",
        "rate": "22"
      },
      "gastrointestinal": { "nsf": true,  "findings": [], "other": "" },
      "genitalia": {
        "nsf": false,
        "findings": [],
        "other": "",
        "tanner_stage": "3"
      },
      "breastGlands": {
        "nsf": true,
        "findings": [],
        "other": ""
      },
      "skin": {
        "nsf": false,
        "findings": [{ "value": "herpes_zoster", "label": "Herpes Zoster" }],
        "other": ""
      },
      "neurological":  { "nsf": true, "findings": [], "other": "" },
      "mentalStatus":  { "nsf": true, "findings": [], "other": "" },
      "additionalFindings": "Patient appears generally unwell"
    },
    "assessment": {
      "asymptomatic": false,
      "symptomatic": true,
      "aids_defining_illness": false,
      "opportunistic_infection": false,
      "who_stage": "Stage 2",
      "enroll_general_followup": false,
      "enroll_arv_therapy": true,
      "enroll_ahd_management": false,
      "enroll_pending_lab_results": false,
      "plan_art_ongoing_monitoring": false,
      "plan_art_postponed": false,
      "plan_art_change_treatment": false,
      "plan_art_restart": false,
      "plan_art_start_new": true,
      "drugs_in_regimen": "TDF/3TC/DTG",
      "additional_comments": "Patient counseled on ART adherence",
      "next_appointment": "2024-02-15"
    }
  }
}
```

---

## Validation Rules (enforced on frontend)

| Field              | Rule                          |
|--------------------|-------------------------------|
| `visitDate`        | Required, must not be in the future, must be >= enrollment date |
| `assessment.who_stage` | Required                  |

---

## Notes for Backend

- `data.pregnancy` is explicitly `null` when the patient is male. The backend should handle a `null` value gracefully for this field.
- `data.physicalExam.breastGlands` is explicitly `null` when the patient is male.
- All `findings` arrays contain objects with shape `{ value: string, label: string }`. The backend may store just `value` if `label` is not needed.
- `vitals` fields are all strings (numeric). The backend should parse them to the appropriate numeric type.
- `symptoms[].duration` is a numeric string representing days.
