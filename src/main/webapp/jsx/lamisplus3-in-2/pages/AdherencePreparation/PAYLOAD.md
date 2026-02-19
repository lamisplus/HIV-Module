# ART Adherence Preparation — Backend Payload Reference

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
| `dateOfObservation` | `string` | Yes      | ISO date — the earliest Session 1 date recorded, or today's date if none |
| `personId`          | `number` | Yes      | Internal patient ID (`patientObj.id`)                                    |
| `type`              | `string` | Yes      | Always `"ART Adherence Preparation"`                                     |
| `data`              | `object` | Yes      | Contains `services` array and `treatment_supporter` object               |

---

## `data.services` — Array of Service Session Records

Each element in the array corresponds to one adherence preparation topic and records up to three session dates.

| Field     | Type     | Required | Notes                                                  |
|-----------|----------|----------|--------------------------------------------------------|
| `service` | `string` | Yes      | Service key (see Service Keys below)                   |
| `label`   | `string` | Yes      | Human-readable label of the service                    |
| `date_1`  | `string` | No       | ISO date (`YYYY-MM-DD`) — Session 1. Empty string `""` if not done. |
| `date_2`  | `string` | No       | ISO date (`YYYY-MM-DD`) — Session 2. Empty string `""` if not done. |
| `date_3`  | `string` | No       | ISO date (`YYYY-MM-DD`) — Session 3. Empty string `""` if not done. |

### Service Keys

| Key                          | Label                                                                              |
|------------------------------|------------------------------------------------------------------------------------|
| `art_educate_essentials`     | ART — educate on essentials                                                        |
| `why_complete_adherence`     | Why complete adherence needed                                                      |
| `explain_dose_timing`        | Explain dose, when to take, what to do when one forgets dose                       |
| `manage_side_effects`        | What can occur; how to manage side effects                                         |
| `adherence_plan`             | Adherence plan (schedule, aides, explain diary, preparation for travel)            |
| `treatment_supporter_prep`   | Treatment supporter preparation                                                    |
| `ready_for_art`              | Indicate when ready for ART (date/result)                                          |

---

## `data.treatment_supporter` — Treatment Supporter Contact Details

| Field       | Type     | Required | Notes                              |
|-------------|----------|----------|------------------------------------|
| `name`      | `string` | No       | Full name of the treatment supporter |
| `address`   | `string` | No       | Home / residential address          |
| `telephone` | `string` | No       | Phone number                        |

---

## Validation Rules (enforced on frontend)

| Rule                                           | Detail                                          |
|------------------------------------------------|-------------------------------------------------|
| At least one session date must be recorded     | Across all services — at least one `date_1`, `date_2`, or `date_3` must be non-empty |

---

## Full Payload Example

```json
{
  "dateOfObservation": "2024-01-15",
  "personId": 456,
  "type": "ART Adherence Preparation",
  "data": {
    "services": [
      {
        "service": "art_educate_essentials",
        "label": "ART — educate on essentials",
        "date_1": "2024-01-15",
        "date_2": "2024-01-22",
        "date_3": ""
      },
      {
        "service": "why_complete_adherence",
        "label": "Why complete adherence needed",
        "date_1": "2024-01-15",
        "date_2": "",
        "date_3": ""
      },
      {
        "service": "explain_dose_timing",
        "label": "Explain dose, when to take, what to do when one forgets dose",
        "date_1": "2024-01-15",
        "date_2": "2024-01-22",
        "date_3": "2024-01-29"
      },
      {
        "service": "manage_side_effects",
        "label": "What can occur; how to manage side effects",
        "date_1": "2024-01-15",
        "date_2": "",
        "date_3": ""
      },
      {
        "service": "adherence_plan",
        "label": "Adherence plan (schedule, aides, explain diary, preparation for travel)",
        "date_1": "2024-01-22",
        "date_2": "",
        "date_3": ""
      },
      {
        "service": "treatment_supporter_prep",
        "label": "Treatment supporter preparation",
        "date_1": "2024-01-22",
        "date_2": "",
        "date_3": ""
      },
      {
        "service": "ready_for_art",
        "label": "Indicate when ready for ART (date/result)",
        "date_1": "2024-01-29",
        "date_2": "",
        "date_3": ""
      }
    ],
    "treatment_supporter": {
      "name": "Musa Aliyu",
      "address": "12 Kano Street, Abuja",
      "telephone": "08031234567"
    }
  }
}
```

---

## Notes for Backend

- `dateOfObservation` is the earliest non-empty `date_1` found across all services. If no dates are recorded, it falls back to today's date (though validation prevents this from being submitted).
- All seven service rows are always present in the `data.services` array even when all three date fields are empty strings. The backend should treat empty string dates as absent/null.
- `data.treatment_supporter` fields may all be empty strings if the treatment supporter details are not recorded.
