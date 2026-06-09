# Enrollment & Commencement Form - Field Auto-Population & Validation Logic

## Overview
This document details all auto-population sources and date validation rules for fields in the HIV Enrollment & Commencement form.

---

## 1️⃣ AUTO-POPULATED FROM PREVIOUS E&C RECORDS
**Context:** For **returning clients** (Part 2 flow - Transfer OUT/IN)

### Source:
`fetchPreviousEnrollmentData()` - Fetches the **FIRST/EARLIEST** enrollment record via:
```
GET /hiv/enrollment-commencement/person/{personId}/first
```

### Fields Auto-Populated (Line 426-434):

| Field | Source | Notes |
|-------|--------|-------|
| **Unique ID** | `previousData.uniqueId` | Read-only, cannot be changed |
| **Date Confirmed HIV Test** | `previousData.dateConfirmedHivTest` | Read-only, cannot be changed |
| **Mode of HIV Test** | `previousData.modeOfHivTestId` | Read-only, cannot be changed |
| **HIV Test Location** | `previousData.hivTestLocation` | Read-only, cannot be changed |
| **Care Entry Point** | N/A | Read-only but NOT auto-populated, keeps current value |

### Visual Indicators:
- Fields are **disabled** and **read-only**
- Background color: `#f5f9ff` (light blue)
- Font color: `#014d88` (dark blue)
- Font weight: `600` (semi-bold)

---

## 2️⃣ AUTO-POPULATED FROM ICE FORM
**Context:** For **new enrollment cycles** (Part 1A, 1B, Part 2, Part 3 after Transfer IN)

### A. Prior ART Field (Lines 460-476)
**Source:** `props.patientObj1.initialClinicalEvaluation.data.arvHistory`

**Trigger:** When `Previous ARV Exposure = "Yes"` in ICE form

**Logic:**
```javascript
if (arvHistory.prep === true)              → "PRIOR_ART_PREP"
if (arvHistory.pep === true)               → "PRIOR_ART_PEP"
if (arvHistory.tran === true)              → "PRIOR_ART_TRANSFER_IN_WITHOUT_RECORDS"
if (arvHistory.earlierArvNotTransfer)      → "PRIOR_ART_EARLIER_ARV_BUT_NOT_A_TRANSFER_IN"
```

**Visual Indicators:**
- Label shows: "(auto-populated from ICE)"
- Field is **disabled** and **read-only**
- Background color: `#f5f9ff`

**Special Note:**
- Skips auto-population if `enrollmentSessionUuid` starts with "MIGRATED-"
- Only runs once (when field is empty and codesets are loaded)

---

### B. Clinical Stage at Start of ART (Lines 493-519)
**Source:** `props.patientObj1.initialClinicalEvaluation.data.assessment.whoStage`

**Mapping:**
```javascript
WHO_STAGING_CRITERIA_STAGE_1  → CLINICAL_STAGE_STAGE_I
WHO_STAGING_CRITERIA_STAGE_2  → CLINICAL_STAGE_STAGE_II
WHO_STAGING_CRITERIA_STAGE_3  → CLINICAL_STAGE_STAGE_III
WHO_STAGING_CRITERIA_STAGE_4  → CLINICAL_STAGE_STAGE_IV
```

**Special Note:**
- Skips auto-population if `enrollmentSessionUuid` starts with "MIGRATED-"
- Only populates if field is currently empty

---

## 3️⃣ AUTO-POPULATED FROM ADHERENCE PREPARATION FORM
**Context:** For **new enrollment cycles** (Part 1A, 1B, Part 2, Part 3 after Transfer IN)

### Field: Date Initial Adherence Counseling Completed (Lines 478-491)
**Source:** `props.patientObj1.adherencePreparation.serviceDate`

**Visual Indicators:**
- Field is **disabled** and **read-only**
- Background color: `#f5f9ff`
- Label shows: "Date Initial Adherence Counseling Completed"

**Special Note:**
- Skips auto-population if `enrollmentSessionUuid` starts with "MIGRATED-"
- Only populates if field is currently empty

---

## 4️⃣ AUTO-POPULATED FROM ENROLLMENT DATE
**Context:** For **new patients without prior ART or Transfer-IN**

### Field: Date ART Started (Lines 1120-1143)
**Source:** `registration.date_enrolled_in_hiv_care`

**Conditions (ALL must be true):**
1. ✅ Date Enrolled in HIV Care is filled
2. ✅ Care Entry Point is **NOT** "Transfer-in"
3. ✅ Prior ART is **NOT** documented (empty)
4. ✅ Date ART Started is currently empty

**Logic:**
```javascript
date_art_started = date_enrolled_in_hiv_care
```

**Use Case:** New patients starting ART immediately upon enrollment

---

## 5️⃣ AUTO-POPULATED FROM TRIAGE/VITAL SIGNS
**Context:** When Date ART Started is filled

### Fields: Weight (kg) and Height (cm) (Lines 1145-1204)
**Source:** Vital Signs API
```
GET /patient/vital-sign/person/{personId}
```

**Matching Logic:**
- Finds vital sign record where `captureDate` matches `date_art_started`
- Only populates if fields are currently empty

**Fields Auto-Populated:**
| Field | Source | Notes |
|-------|--------|-------|
| **Weight (kg)** | `vitalSign.bodyWeight` | Only if empty |
| **Height (cm)** | `vitalSign.height` | Only if empty |
| **BMI** | Calculated automatically | `weight / (height/100)²` |

**Special Note:**
- This is **optional** auto-population
- Errors are suppressed (logged to console only)

---

## 6️⃣ DATE VALIDATION RULES

### A. Date Enrolled in HIV Care (Lines 1478-1489)
**Validation:**
```javascript
MIN: Latest of {
  - Patient Registration Date
  - Date Confirmed HIV Test
  - Previous Enrollment Date (for returning clients)
}

MAX: Today's date
```

**Business Rule:**
- Cannot be earlier than patient registration
- Cannot be earlier than HIV test confirmation
- Cannot be earlier than previous enrollment (for returning clients)
- Cannot be in the future

---

### B. Date Transferred In (Line 1616)
**Validation:**
```javascript
MAX: Earlier of {
  - Date Enrolled in HIV Care
  - Today's date
}
```

**Business Rule:**
- Transfer IN date cannot be later than enrollment date

---

### C. Date Confirmed HIV Test (Lines 1690-1699)
**Validation:**
```javascript
MIN: Patient Date of Birth

MAX: Earlier of {
  - Date Enrolled in HIV Care
  - Duration of Care From (from ICE form)
}
```

**Business Rule:**
- Cannot be before patient was born
- Cannot be after enrollment date
- Cannot be after they started care (from ICE)

**Special Note for Returning Clients:**
- Field is **read-only** (auto-populated from previous enrollment)

---

### D. Visit Date (Commencement Section) (Line 1859)
**Validation:**
```javascript
MAX: Today's date
```

**Business Rule:**
- Cannot be in the future

---

### E. Date Initial Adherence Counseling Completed (Lines 1955-1956)
**Validation:**
```javascript
MIN: Patient Date of Birth
MAX: Today's date
```

**Business Rule:**
- Cannot be before patient was born
- Cannot be in the future

**Special Note:**
- Field is **disabled** if auto-populated from Adherence Preparation
- Skipped for MIGRATED records

---

### F. Date ART Started (Lines 1972-1973)
**Validation:**
```javascript
MIN: Date Enrolled in HIV Care
MAX: Today's date
```

**Business Rule:**
- Cannot be earlier than enrollment date
- Cannot be in the future

---

### G. TPT Start Date (Lines 2291-2292)
**Validation:**
```javascript
MIN: Patient Date of Birth
MAX: Today's date
```

**Business Rule:**
- Can be earlier than enrollment (patient may have started TPT before enrolling)
- Cannot be before patient was born
- Cannot be in the future

---

### H. TPT Completion Date (Lines 2327-2328)
**Validation:**
```javascript
MIN: TPT Start Date
MAX: Today's date
```

**Business Rule:**
- Must be after TPT start date
- Cannot be in the future

---

### I. OVC Referral Dates (Lines 2497, 2548)
**Validation:**
```javascript
MAX: Today's date
```

**Business Rule:**
- Cannot be in the future

---

## 7️⃣ SPECIAL VALIDATION RULES (Backend - Line 1234-1236)

### Date Enrolled in HIV Care (for Returning Clients)
**Additional Check:**
```javascript
if (registration.previousEnrollmentDate &&
    registration.date_enrolled_in_hiv_care < registration.previousEnrollmentDate) {

  ERROR: "Date enrolled in HIV care cannot be earlier than previous enrollment date"
}
```

**Context:** This prevents returning clients from backdating their new enrollment

---

## 8️⃣ MIGRATED RECORDS SPECIAL HANDLING

**When `enrollmentSessionUuid` starts with "MIGRATED-":**

### Auto-Population SKIPPED For:
1. ❌ Prior ART (from ICE)
2. ❌ Date Initial Adherence Counseling Completed (from Adherence Prep)
3. ❌ Clinical Stage at Start of ART (from ICE WHO Stage)

**Reason:** MIGRATED records are from the old system and don't have:
- Adherence Preparation records
- ICE records in new format
- Linked enrollment cycle

**These patients see full menu immediately until they Transfer OUT/IN**

---

## 9️⃣ FIELD VISIBILITY RULES

### Prior ART Field (Line 300)
**Shows when:**
```javascript
previousArvExposure === "Yes" (from ICE)
  OR
Prior ART field has a value (edit/view mode)
```

### Specify Entry Point (Line 1584)
**Shows when:**
```javascript
Care Entry Point === "OTHERS"
```

### Transfer-IN Fields (Line 1603)
**Shows when:**
```javascript
Care Entry Point === "TRANSFER" (Transfer-in)
```

Shows:
- Date Transferred In
- Facility Transferred From

### MUAC Indication (Line 2095)
**Shows when:**
```javascript
Patient is Pediatric (age < 15)
```

### Pregnancy/Breastfeeding Status
**Shows when:**
```javascript
Patient is Female AND NOT Pediatric (age >= 15)
```

### TPT Fields (Line 2249)
**Shows when:**
```javascript
tpt_started === true (checkbox checked)
```

Shows:
- TPT Medication
- Dose
- Start Date
- TPT Completed (dropdown)
- Completion Date (if completed)

### OVC Fields (Line 2401)
**Shows when:**
```javascript
has_ovc_information === true (checkbox checked)
```

---

## 🔟 NUMERIC FIELD VALIDATIONS

| Field | Min | Max | Step |
|-------|-----|-----|------|
| CD4 at ART Start | 0 | - | 1 |
| Weight (kg) | 0 | - | 0.1 |
| Height (cm) | 0 | - | 0.1 |
| MUAC | 0 | - | 0.1 |
| TPT Dose | 0 | - | 1 |

---

## 📋 SUMMARY TABLE

| Field | Auto-Pop Source | Min Date | Max Date | Special Rules |
|-------|----------------|----------|----------|---------------|
| **Unique ID** | Previous E&C | - | - | Read-only for returning clients |
| **Date Enrolled in HIV Care** | - | Max(regDate, testDate, prevEnroll) | Today | Must be after confirm HIV test |
| **Date Transferred In** | - | - | Earlier(enrollDate, today) | Only for Transfer-in |
| **Date Confirmed HIV Test** | Previous E&C | DOB | Earlier(enrollDate, durationOfCareFrom) | Read-only for returning clients |
| **Mode of HIV Test** | Previous E&C | - | - | Read-only for returning clients |
| **HIV Test Location** | Previous E&C | - | - | Read-only for returning clients |
| **Prior ART** | ICE (ARV History) | - | - | Read-only when auto-populated |
| **Visit Date** | - | - | Today | - |
| **Clinical Stage at ART Start** | ICE (WHO Stage) | - | - | Auto-mapped from WHO staging |
| **Date Adherence Counseling** | Adherence Prep | DOB | Today | Read-only when auto-populated |
| **Date ART Started** | Enrollment Date | Enrollment Date | Today | Auto-populated for new patients |
| **Weight (kg)** | Vital Signs | 0 | - | Matches ART start date |
| **Height (cm)** | Vital Signs | 0 | - | Matches ART start date |
| **BMI** | Calculated | - | - | Auto-calculated from weight/height |
| **TPT Start Date** | - | DOB | Today | Can be before enrollment |
| **TPT Completion Date** | - | TPT Start | Today | Only if TPT completed |
| **OVC Referral Dates** | - | - | Today | Only if OVC checkbox checked |

---

## ⚠️ IMPORTANT NOTES

1. **MIGRATED Records:** All auto-population from ICE and Adherence Prep is skipped for MIGRATED patients
2. **Returning Clients:** Previous enrollment fields are read-only and cannot be changed
3. **Vital Signs:** Auto-population happens only when Date ART Started matches vital sign capture date
4. **Transfer-IN:** Date ART Started is NOT auto-populated for transfer-in patients
5. **Prior ART:** If Prior ART exists, Date ART Started is NOT auto-populated from enrollment date
6. **Validation Order:** Frontend validations run first, then backend validations on submit
7. **Error Display:** Only critical errors block form submission; optional auto-population errors are suppressed

---

**Document Version:** 1.0
**Last Updated:** 2026-05-23
**Related Files:**
- `EnrollmentAndCommencement/Index.js` (Lines 250-2600)
- `AdherencePreparationService.java` (Backend validation)
- `EnrollmentCommencementService.java` (Backend submission logic)
