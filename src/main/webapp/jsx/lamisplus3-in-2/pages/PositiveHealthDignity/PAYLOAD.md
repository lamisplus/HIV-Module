# Care and Support / Positive Health Dignity and Prevention Services — Backend Payload Reference

## Endpoint

```
POST /observation
Authorization: Bearer <token>
Content-Type: application/json
```

---

## Top-Level Structure

| Field               | Type     | Required | Description                                                              |
|---------------------|----------|----------|--------------------------------------------------------------------------|
| `dateOfObservation` | `string` | Yes      | ISO date — the earliest date entered across all services, or today's date |
| `personId`          | `number` | Yes      | Internal patient ID (`patientObj.id`)                                    |
| `type`              | `string` | Yes      | Always `"Care and Support/Positive Health Dignity and Prevention Services"` |
| `data`              | `object` | Yes      | Contains `services` array                                                |

---

## `data.services` — Array of Service Provision Records

Each element corresponds to one care and support service. Services with no dates recorded are still included in the array with an empty `dates` array.

| Field     | Type       | Required | Notes                                                                   |
|-----------|------------|----------|-------------------------------------------------------------------------|
| `service` | `string`   | Yes      | Service key (see Service Keys below)                                    |
| `label`   | `string`   | Yes      | Human-readable label of the service                                     |
| `dates`   | `string[]` | No       | Array of ISO dates (`YYYY-MM-DD`) — one entry per visit the service was provided. Empty array `[]` if never provided. |
| `comment` | `string`   | No       | Free text comment for this service. Empty string `""` if none.          |

### Service Keys

| Key                          | Label                                                                              |
|------------------------------|------------------------------------------------------------------------------------|
| `adherence_counseling`       | Adherence counseling                                                               |
| `hiv_education_nutrition`    | Basic HIV education and transmission including nutrition                            |
| `prevention_counselling`     | Prevention counselling: abstinence, safer sex, household precautions               |
| `disclosure_partner_testing` | Disclosure, partner testing and counseling, family situation                       |
| `condom_provision`           | Condom provision                                                                   |
| `sti_screening`              | STI screening, diagnosis and referral for management                               |
| `rh_fp_services`             | Provision/referral for RH/FP services                                              |
| `substance_use_counseling`   | Alcohol & other substance use risk reduction counseling                            |
| `palliative_care`            | Symptom management and palliative care at home                                     |
| `positive_living`            | Positive living counselling                                                        |
| `support_group`              | Support group enrollment, community support, clinic contacts                       |
| `mental_health_screening`    | Mental Health Screening                                                            |

---

## Validation Rules (enforced on frontend)

| Rule                                         | Detail                                                               |
|----------------------------------------------|----------------------------------------------------------------------|
| At least one service date must be recorded   | At least one non-empty entry in any service's `dates` array          |

---

## Full Payload Example

```json
{
  "dateOfObservation": "2024-02-10",
  "personId": 456,
  "type": "Care and Support/Positive Health Dignity and Prevention Services",
  "data": {
    "services": [
      {
        "service": "adherence_counseling",
        "label": "Adherence counseling",
        "dates": ["2024-02-10", "2024-03-15", "2024-04-20"],
        "comment": "Patient showing good understanding"
      },
      {
        "service": "hiv_education_nutrition",
        "label": "Basic HIV education and transmission including nutrition",
        "dates": ["2024-02-10"],
        "comment": ""
      },
      {
        "service": "prevention_counselling",
        "label": "Prevention counselling: abstinence, safer sex, household precautions",
        "dates": ["2024-02-10", "2024-04-20"],
        "comment": ""
      },
      {
        "service": "disclosure_partner_testing",
        "label": "Disclosure, partner testing and counseling, family situation",
        "dates": ["2024-03-15"],
        "comment": "Partner tested negative"
      },
      {
        "service": "condom_provision",
        "label": "Condom provision",
        "dates": ["2024-02-10", "2024-03-15", "2024-04-20"],
        "comment": ""
      },
      {
        "service": "sti_screening",
        "label": "STI screening, diagnosis and referral for management",
        "dates": [],
        "comment": ""
      },
      {
        "service": "rh_fp_services",
        "label": "Provision/referral for RH/FP services",
        "dates": ["2024-02-10"],
        "comment": "Referred to FP clinic"
      },
      {
        "service": "substance_use_counseling",
        "label": "Alcohol & other substance use risk reduction counseling",
        "dates": [],
        "comment": ""
      },
      {
        "service": "palliative_care",
        "label": "Symptom management and palliative care at home",
        "dates": [],
        "comment": ""
      },
      {
        "service": "positive_living",
        "label": "Positive living counselling",
        "dates": ["2024-03-15"],
        "comment": ""
      },
      {
        "service": "support_group",
        "label": "Support group enrollment, community support, clinic contacts",
        "dates": ["2024-02-10"],
        "comment": "Enrolled in Tuesday support group"
      },
      {
        "service": "mental_health_screening",
        "label": "Mental Health Screening",
        "dates": ["2024-04-20"],
        "comment": "PHQ-9 score: 4 (minimal depression)"
      }
    ]
  }
}
```

---

## Notes for Backend

- `dateOfObservation` is the first non-empty date found across all services (in service order). Fallback is today's date.
- All 12 service rows are always present in the `data.services` array. Services where no dates were recorded will have `dates: []`.
- Empty strings in the `dates` array on the frontend are filtered out before submission — the backend will only receive valid ISO date strings.
- `comment` is an empty string `""` when not provided; the backend should treat this as absent/null.
- The `dates` array is unbounded — the user can add as many visit dates as needed per service via the `+` button in the UI.
