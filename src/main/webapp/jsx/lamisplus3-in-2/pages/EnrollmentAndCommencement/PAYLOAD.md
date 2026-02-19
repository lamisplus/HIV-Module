# ART Enrollment & Commencement — Payload Reference

## Endpoint

```
POST /observation
Authorization: Bearer <token>
Content-Type: application/json
```

---

## Top-Level Structure

```json
{
  "dateOfObservation": "2024-01-20",
  "personId": 456,
  "type": "Enrollment and ART Commencement",
  "data": {
    "registration": { ... },
    "commencement": { ... }
  }
}
```

| Field               | Type     | Required | Notes                                                              |
|---------------------|----------|----------|--------------------------------------------------------------------|
| `dateOfObservation` | `string` | Yes      | ISO date. Always a copy of `data.commencement.date_art_started`    |
| `personId`          | `number` | Yes      | Internal patient ID from `patientObj.id`                           |
| `type`              | `string` | Yes      | Always `"Enrollment and ART Commencement"`                         |
| `data`              | `object` | Yes      | Contains `registration` and `commencement` sub-objects             |

---

## `data.registration`

### HIV Care & Identification

| Field                       | Type     | Required        | Notes                                                                     |
|-----------------------------|----------|-----------------|---------------------------------------------------------------------------|
| `date_enrolled_in_hiv_care` | `string` | **Yes**         | ISO date (`YYYY-MM-DD`). Cannot be in the future                          |
| `date_confirmed_hiv_test`   | `string` | No              | ISO date (`YYYY-MM-DD`)                                                   |
| `hiv_test_location`         | `string` | No              | Free text — e.g. `"ANC"`, `"HTS Site"`                                   |
| `mode_of_hiv_test`          | `string` | No              | `"Rapid Test"` / `"PCR"` / `"Western Blot"` / `"ELISA"` / `"DNA PCR"`   |
| `care_entry_point`          | `string` | **Yes**         | Numeric string `"1"`–`"9"`. See Care Entry Point codes below              |
| `care_entry_point_other`    | `string` | Conditional     | Free text. Only meaningful when `care_entry_point = "9"`. `""` otherwise  |
| `mother_unique_id`          | `string` | **Conditional** | **Required when patient age < 2 years.** `""` for all other patients     |

#### Care Entry Point Codes

| Code  | Label              |
|-------|--------------------|
| `"1"` | OPD                |
| `"2"` | In-patients        |
| `"3"` | HTS                |
| `"4"` | TB DOTS            |
| `"5"` | STI Clinic         |
| `"6"` | ANC/PMTCT          |
| `"7"` | Transfer-in        |
| `"8"` | Community          |
| `"9"` | Others (specify)   |

---

### Additional Demographics

| Field                | Type     | Required | Notes                                                                                     |
|----------------------|----------|----------|-------------------------------------------------------------------------------------------|
| `occupation`         | `string` | No       | Free text                                                                                 |
| `marital_status`     | `string` | No       | `"Single"` / `"Married"` / `"Divorced"` / `"Separated"` / `"Cohabiting"` / `"Widower"`  |
| `educational_status` | `string` | No       | `"No Education"` / `"Primary Education"` / `"Secondary Education"` / `"Tertiary Education"` |

---

### Next of Kin

| Field                     | Type     | Required | Notes                                                                                 |
|---------------------------|----------|----------|---------------------------------------------------------------------------------------|
| `next_of_kin`             | `string` | No       | Full name                                                                             |
| `next_of_kin_relationship`| `string` | No       | `"Spouse"` / `"Parent"` / `"Child"` / `"Sibling"` / `"Friend"` / `"Guardian"` / `"Other"` |
| `next_of_kin_telephone`   | `string` | No       | Phone number                                                                          |

---

### Prior ART & Key Population

| Field        | Type     | Required | Notes                                                           |
|--------------|----------|----------|-----------------------------------------------------------------|
| `prior_art`  | `string` | No       | Numeric string `"1"`–`"4"`. See Prior ART codes below           |
| `is_kp`      | `string` | No       | `"Yes"` / `"No"`                                               |
| `kp_typology`| `string` | No       | Only when `is_kp = "Yes"`. See KP Typology values below. `""` otherwise |

#### Prior ART Codes

| Code  | Meaning                           |
|-------|-----------------------------------|
| `"1"` | Earlier ARV but not a transfer in |
| `"2"` | Transfer in without records       |
| `"3"` | PrEP                              |
| `"4"` | PEP                               |

#### KP Typology Values

`"MSM"` / `"FSW"` / `"PWID"` / `"TG"` / `"Persons in custodial centers"`

---

### Transfer Details

> Collected only when `prior_art = "2"` **or** `care_entry_point = "7"`. Both fields are `""` otherwise.

| Field                      | Type     | Notes                                  |
|----------------------------|----------|----------------------------------------|
| `date_transferred_in`      | `string` | ISO date (`YYYY-MM-DD`)                |
| `facility_transferred_from`| `string` | Free text — name of sending facility   |

---

## `data.commencement`

### Clinical Status at ART Start

| Field                         | Type     | Required | Notes                                                   |
|-------------------------------|----------|----------|---------------------------------------------------------|
| `clinical_stage_at_art_start` | `string` | **Yes**  | `"Stage 1"` / `"Stage 2"` / `"Stage 3"` / `"Stage 4"` |
| `cd4_at_art_start`            | `string` | No       | Numeric string in cells/mm³ — e.g. `"350"`              |
| `cd4_lf`                      | `string` | No       | `"<200"` or `">=200"`. `""` if not recorded             |

---

### ART Dates & Regimen

| Field                                  | Type     | Required | Notes                                                                    |
|----------------------------------------|----------|----------|--------------------------------------------------------------------------|
| `date_adherence_counseling_completed`  | `string` | No       | ISO date (`YYYY-MM-DD`). Cannot be in the future                         |
| `date_art_started`                     | `string` | **Yes**  | ISO date (`YYYY-MM-DD`). Also sent as top-level `dateOfObservation`      |
| `first_art_regimen`                    | `string` | No       | Free text — e.g. `"TDF/3TC/DTG"`                                        |

---

### Vitals at Commencement

| Field              | Type     | Required     | Unit  | Notes                                                                                     |
|--------------------|----------|--------------|-------|-------------------------------------------------------------------------------------------|
| `weight_kg`        | `string` | No           | kg    | Numeric string — e.g. `"65"`                                                              |
| `height_cm`        | `string` | No           | cm    | Numeric string — e.g. `"170"`                                                             |
| `bmi`              | `string` | No           | kg/m² | **Auto-calculated:** `weight_kg / (height_cm / 100)²`, 1 decimal place. Read-only. `""` if weight or height is missing — e.g. `"22.5"` |
| `muac`             | `string` | No           | cm    | **Pediatric only (age ≤ 15).** Mid-Upper Arm Circumference — e.g. `"13.5"`. `""` for adult patients |
| `muac_indication`  | `string` | No           | —     | **Pediatric only (age ≤ 15).** Auto-derived from `muac`. Read-only. See MUAC Indication table below. `""` for adult patients or when `muac` is blank |
| `pregnancy_status` | `string` | No           | —     | **Adult females only (age > 15).** `"Pregnant"` / `"Breastfeeding"` / `""`. Always `""` for males and pediatric females |

#### MUAC Indication (auto-derived, read-only)

| `muac_indication` value | MUAC (cm) range  | Clinical meaning                    |
|-------------------------|------------------|-------------------------------------|
| `"Underweight"`         | < 12.5           | At risk of acute malnutrition       |
| `"Well Nourished"`      | 12.5 – < 16.0    | Normal nutritional status           |
| `"Overweight/Obese"`    | ≥ 16.0           | Above normal range                  |
| `""`                    | Not entered      | MUAC not recorded / adult patient   |

---

### TB Preventive Therapy (TPT)

`tb_preventive_therapy` is a **nested object**, always present in the payload. All sub-fields are `""` when no TPT is prescribed.

| Sub-field         | Type     | Notes                                                                   |
|-------------------|----------|-------------------------------------------------------------------------|
| `medication`      | `string` | Free text drug name — e.g. `"Isoniazid"`. `""` if not prescribed       |
| `code`            | `string` | See TPT Code table below. `""` if not prescribed                        |
| `dose`            | `string` | Free text — e.g. `"300mg"`, `"300mg/300mg"`                            |
| `start_date`      | `string` | ISO date (`YYYY-MM-DD`)                                                 |
| `completion_date` | `string` | ISO date (`YYYY-MM-DD`)                                                 |

#### TPT Codes

| Code     | Full Name                                              |
|----------|--------------------------------------------------------|
| `"6H"`   | Isoniazid — 6 months                                   |
| `"3HP"`  | Isoniazid and Rifapentine                              |
| `"3HR"`  | Isoniazid and Rifampicin                               |
| `"QTIP"` | Cotrimoxazole/Isoniazid/Pyridoxine FDC (CTX/INH/B6)   |

---

## Validation Rules

| Field                                         | Rule                                           |
|-----------------------------------------------|------------------------------------------------|
| `data.registration.date_enrolled_in_hiv_care` | Required. Must not be in the future            |
| `data.registration.care_entry_point`          | Required                                       |
| `data.registration.mother_unique_id`          | Required when patient age < 2 years            |
| `data.commencement.date_art_started`          | Required. Must not be in the future            |
| `data.commencement.clinical_stage_at_art_start` | Required                                     |

---

## Complete Payload Examples

### Example 1 — Adult Female, Pregnant, with TPT

```json
{
  "dateOfObservation": "2024-02-05",
  "personId": 789,
  "type": "Enrollment and ART Commencement",
  "data": {
    "registration": {
      "date_enrolled_in_hiv_care": "2024-02-01",
      "date_confirmed_hiv_test": "2023-11-20",
      "hiv_test_location": "STI Clinic",
      "mode_of_hiv_test": "Rapid Test",
      "care_entry_point": "7",
      "care_entry_point_other": "",
      "mother_unique_id": "",
      "occupation": "Commercial Sex Worker",
      "marital_status": "Single",
      "educational_status": "Primary Education",
      "next_of_kin": "Grace Obi",
      "next_of_kin_relationship": "Sibling",
      "next_of_kin_telephone": "08098765432",
      "prior_art": "2",
      "is_kp": "Yes",
      "kp_typology": "FSW",
      "date_transferred_in": "2024-01-28",
      "facility_transferred_from": "Abuja General Hospital"
    },
    "commencement": {
      "clinical_stage_at_art_start": "Stage 3",
      "cd4_at_art_start": "150",
      "cd4_lf": "<200",
      "date_adherence_counseling_completed": "2024-02-03",
      "date_art_started": "2024-02-05",
      "first_art_regimen": "AZT/3TC/EFV",
      "weight_kg": "52",
      "height_cm": "158",
      "bmi": "20.8",
      "muac": "",
      "muac_indication": "",
      "pregnancy_status": "Pregnant",
      "tb_preventive_therapy": {
        "medication": "Isoniazid",
        "code": "3HP",
        "dose": "300mg/300mg",
        "start_date": "2024-02-05",
        "completion_date": "2024-05-05"
      }
    }
  }
}
```

---

### Example 2 — Adult Male, No TPT

```json
{
  "dateOfObservation": "2024-01-20",
  "personId": 456,
  "type": "Enrollment and ART Commencement",
  "data": {
    "registration": {
      "date_enrolled_in_hiv_care": "2024-01-15",
      "date_confirmed_hiv_test": "2024-01-10",
      "hiv_test_location": "HTS Site",
      "mode_of_hiv_test": "Rapid Test",
      "care_entry_point": "3",
      "care_entry_point_other": "",
      "mother_unique_id": "",
      "occupation": "Trader",
      "marital_status": "Married",
      "educational_status": "Secondary Education",
      "next_of_kin": "Amina Bello",
      "next_of_kin_relationship": "Spouse",
      "next_of_kin_telephone": "08012345678",
      "prior_art": "1",
      "is_kp": "No",
      "kp_typology": "",
      "date_transferred_in": "",
      "facility_transferred_from": ""
    },
    "commencement": {
      "clinical_stage_at_art_start": "Stage 2",
      "cd4_at_art_start": "350",
      "cd4_lf": ">=200",
      "date_adherence_counseling_completed": "2024-01-18",
      "date_art_started": "2024-01-20",
      "first_art_regimen": "TDF/3TC/DTG",
      "weight_kg": "68",
      "height_cm": "165",
      "bmi": "24.9",
      "muac": "",
      "muac_indication": "",
      "pregnancy_status": "",
      "tb_preventive_therapy": {
        "medication": "",
        "code": "",
        "dose": "",
        "start_date": "",
        "completion_date": ""
      }
    }
  }
}
```

---

### Example 3 — Pediatric Child (age 8, underweight MUAC), with TPT

```json
{
  "dateOfObservation": "2024-03-10",
  "personId": 1045,
  "type": "Enrollment and ART Commencement",
  "data": {
    "registration": {
      "date_enrolled_in_hiv_care": "2024-03-10",
      "date_confirmed_hiv_test": "2024-03-05",
      "hiv_test_location": "OPD",
      "mode_of_hiv_test": "Rapid Test",
      "care_entry_point": "1",
      "care_entry_point_other": "",
      "mother_unique_id": "",
      "occupation": "",
      "marital_status": "",
      "educational_status": "Primary Education",
      "next_of_kin": "Emeka Nwosu",
      "next_of_kin_relationship": "Parent",
      "next_of_kin_telephone": "08033344455",
      "prior_art": "",
      "is_kp": "No",
      "kp_typology": "",
      "date_transferred_in": "",
      "facility_transferred_from": ""
    },
    "commencement": {
      "clinical_stage_at_art_start": "Stage 3",
      "cd4_at_art_start": "180",
      "cd4_lf": "<200",
      "date_adherence_counseling_completed": "2024-03-08",
      "date_art_started": "2024-03-10",
      "first_art_regimen": "ABC/3TC/DTG",
      "weight_kg": "18",
      "height_cm": "120",
      "bmi": "12.5",
      "muac": "11.8",
      "muac_indication": "Underweight",
      "pregnancy_status": "",
      "tb_preventive_therapy": {
        "medication": "Isoniazid",
        "code": "6H",
        "dose": "10mg/kg",
        "start_date": "2024-03-10",
        "completion_date": "2024-09-10"
      }
    }
  }
}
```

---

### Example 4 — Infant (age < 2), mother_unique_id required, DNA PCR test

```json
{
  "dateOfObservation": "2024-03-15",
  "personId": 1023,
  "type": "Enrollment and ART Commencement",
  "data": {
    "registration": {
      "date_enrolled_in_hiv_care": "2024-03-15",
      "date_confirmed_hiv_test": "2024-03-10",
      "hiv_test_location": "ANC",
      "mode_of_hiv_test": "DNA PCR",
      "care_entry_point": "6",
      "care_entry_point_other": "",
      "mother_unique_id": "LAG/ART/00123",
      "occupation": "",
      "marital_status": "",
      "educational_status": "",
      "next_of_kin": "Ngozi Eze",
      "next_of_kin_relationship": "Parent",
      "next_of_kin_telephone": "08055544433",
      "prior_art": "",
      "is_kp": "No",
      "kp_typology": "",
      "date_transferred_in": "",
      "facility_transferred_from": ""
    },
    "commencement": {
      "clinical_stage_at_art_start": "Stage 3",
      "cd4_at_art_start": "",
      "cd4_lf": "<200",
      "date_adherence_counseling_completed": "",
      "date_art_started": "2024-03-15",
      "first_art_regimen": "ABC/3TC/LPV/r",
      "weight_kg": "8.5",
      "height_cm": "75",
      "bmi": "15.1",
      "muac": "12.0",
      "muac_indication": "Underweight",
      "pregnancy_status": "",
      "tb_preventive_therapy": {
        "medication": "Isoniazid",
        "code": "6H",
        "dose": "10mg/kg",
        "start_date": "2024-03-15",
        "completion_date": "2024-09-15"
      }
    }
  }
}
```

---

## Backend Notes

| Topic | Note |
|-------|------|
| `dateOfObservation` | Always mirrors `data.commencement.date_art_started` |
| `care_entry_point_other` | Only meaningful when `care_entry_point = "9"`. Always `""` otherwise |
| `mother_unique_id` | Frontend-required for infants (age < 2). Always `""` for other patients |
| `kp_typology` | Only present when `is_kp = "Yes"`. Always `""` otherwise |
| `date_transferred_in` / `facility_transferred_from` | Only collected when `prior_art = "2"` or `care_entry_point = "7"`. Always `""` otherwise |
| `cd4_lf` | Single string enum (`"<200"` / `">=200"` / `""`). Replaces previous boolean pair `cd4_lf_less_200` + `cd4_lf_gte_200` |
| `bmi` | Frontend auto-computes as `weight_kg / (height_cm/100)²`. Backend receives pre-computed string. `""` if either input is missing |
| `muac` | Only collected for pediatric patients (age ≤ 15). Always `""` for adults |
| `muac_indication` | Frontend auto-derives from `muac`. Backend receives pre-computed string. Should not be editable. Always `""` for adults |
| `pregnancy_status` | Replaces previous boolean pair `pregnant` + `breastfeeding`. Only collected for adult females (age > 15). Always `""` for males and pediatric females |
| `tb_preventive_therapy` | Always a nested object — never flat fields. All sub-fields are `""` when no TPT is prescribed |
| Numeric fields | `weight_kg`, `height_cm`, `cd4_at_art_start`, `bmi`, `muac` are all sent as strings. Backend should cast as needed |
