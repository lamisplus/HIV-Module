import React, { useState } from "react";
import axios from "axios";
import { Input } from "reactstrap";
import * as moment from "moment";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent } from "@material-ui/core";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { token, url as baseUrl } from "../../../../api";
import MatButton from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { calculate_age_to_number } from "../../../../utils";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const MARITAL_STATUS_OPTIONS = [
  "Single",
  "Married",
  "Divorced",
  "Separated",
  "Cohabiting",
  "Widower",
];

const EDUCATION_OPTIONS = [
  "No Education",
  "Primary Education",
  "Secondary Education",
  "Tertiary Education",
];

const CARE_ENTRY_POINTS = [
  { value: "1", label: "OPD" },
  { value: "2", label: "In-patients" },
  { value: "3", label: "HTS" },
  { value: "4", label: "TB DOTS" },
  { value: "5", label: "STI Clinic" },
  { value: "6", label: "ANC/PMTCT" },
  { value: "7", label: "Transfer-in" },
  { value: "8", label: "Community" },
  { value: "9", label: "Others (specify)" },
];

const PRIOR_ART_OPTIONS = [
  { value: "1", label: "Earlier ARV but not a transfer in" },
  { value: "2", label: "Transfer in without records" },
  { value: "3", label: "PrEP" },
  { value: "4", label: "PEP" },
];

const KP_TYPOLOGY_OPTIONS = [
  "MSM",
  "FSW",
  "PWID",
  "TG",
  "Persons in custodial centers",
];

const MODE_OF_HIV_TEST_OPTIONS = [
  "Rapid Test",
  "PCR",
  "Western Blot",
  "ELISA",
  "DNA PCR",
];

const TB_PREVENTIVE_THERAPY_CODES = [
  { value: "6H",   label: "6H — Isoniazid (6 months)" },
  { value: "3HP",  label: "3HP — Isoniazid and Rifapentine" },
  { value: "3HR",  label: "3HR — Isoniazid and Rifampicin" },
  { value: "QTIP", label: "QTIP — CTX/INH/B6 FDC Fixed Dose" },
];

const CLINICAL_STAGES = ["Stage 1", "Stage 2", "Stage 3", "Stage 4"];

const CD4_LF_OPTIONS = [
  { value: "<200",  label: "< 200" },
  { value: ">=200", label: "≥ 200" },
];

const ACCORDION_STYLES = [
  { bg: "#014d88" },
  { bg: "#014d88" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Reusable sub-components  (all defined at module scope — NEVER inside a component)
// ─────────────────────────────────────────────────────────────────────────────

const useStyles = makeStyles((theme) => ({
  root: {
    "& .form-control": { borderRadius: "0.25rem", height: "41px" },
    "& select": { "-webkit-appearance": "listbox !important" },
    "& label": { fontSize: "14px", color: "#014d88", fontWeight: "bold" },
    "& textarea.form-control": { height: "auto" },
  },
  button: { margin: theme.spacing(1) },
  error: { color: "#f85032", fontSize: "12px", marginTop: "4px" },
  fieldLabel: {
    fontSize: "13px",
    color: "#014d88",
    fontWeight: "bold",
    marginBottom: "4px",
    display: "block",
  },
}));

const SectionLabel = ({ children }) => (
  <label
    style={{
      fontSize: "12px",
      fontWeight: "600",
      color: "#014d88",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginBottom: "6px",
      display: "block",
    }}
  >
    {children}
  </label>
);

const FieldRow = ({ children, style }) => (
  <div className="row" style={{ marginBottom: "8px", ...style }}>
    {children}
  </div>
);

const Col = ({ size = 3, children }) => (
  <div className={`form-group mb-3 col-md-${size}`}>{children}</div>
);

const SubHeading = ({ children }) => (
  <div
    style={{
      borderLeft: "3px solid #014d88",
      paddingLeft: "10px",
      marginBottom: "12px",
      marginTop: "16px",
      color: "#014d88",
      fontWeight: "700",
      fontSize: "14px",
    }}
  >
    {children}
  </div>
);

// FormAccordion MUST be at module scope — never inside another component
const FormAccordion = ({ panel, title, index, children, expanded, onToggle }) => {
  const style = ACCORDION_STYLES[index] || ACCORDION_STYLES[0];
  const isOpen = expanded.includes(panel);
  return (
    <Accordion
      expanded={isOpen}
      onChange={() => onToggle(panel)}
      sx={{
        marginBottom: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        borderRadius: "8px !important",
        "&:before": { display: "none" },
        border: "1px solid #014d88",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
        sx={{
          backgroundColor: "#014d88",
          borderRadius: isOpen ? "8px 8px 0 0" : "8px",
          minHeight: "52px",
          "& .MuiAccordionSummary-content": { margin: "0" },
        }}
      >
        <Typography
          sx={{ color: "#fff", fontWeight: 700, fontSize: "15px", letterSpacing: "0.3px" }}
        >
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{ padding: "20px 24px", background: "#fff" }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BMI helper
// ─────────────────────────────────────────────────────────────────────────────

const calcBmi = (weightKg, heightCm) => {
  const w = parseFloat(weightKg);
  const h = parseFloat(heightCm);
  if (w > 0 && h > 0) {
    const hm = h / 100;
    return (w / (hm * hm)).toFixed(1);
  }
  return "";
};

// ─────────────────────────────────────────────────────────────────────────────
// MUAC indication helper (pediatric only)
//  < 12.5 cm  → Underweight
//  12.5–16 cm → Well Nourished
//  ≥ 16 cm    → Overweight/Obese
// ─────────────────────────────────────────────────────────────────────────────

const calcMuacIndication = (muacCm) => {
  const v = parseFloat(muacCm);
  if (isNaN(v) || v <= 0) return "";
  if (v < 12.5) return "Underweight";
  if (v < 16.0) return "Well Nourished";
  return "Overweight/Obese";
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

const EnrollmentAndCommencementForm = (props) => {
  const classes = useStyles();
  const patientAge = calculate_age_to_number(props.patientObj?.dateOfBirth);
  const isPediatric = patientAge >= 0 && patientAge <= 15;
  const isInfant    = patientAge < 2;
  const isFemale    = ["female", "FEMALE", "Female"].includes(props.patientObj?.sex);
  // Pregnancy / breastfeeding only relevant for adult females
  const showPregnancyStatus = isFemale && !isPediatric;

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [expanded, setExpanded] = useState(["registration", "commencement"]);

  const toggleAccordion = (panel) => {
    setExpanded((prev) =>
      prev.includes(panel) ? prev.filter((p) => p !== panel) : [...prev, panel]
    );
  };

  // ── Section 1: Patient Registration Details ─────────────────────────────
  const [registration, setRegistration] = useState({
    date_enrolled_in_hiv_care: "",
    occupation: "",
    marital_status: "",
    educational_status: "",
    next_of_kin: "",
    next_of_kin_relationship: "",
    next_of_kin_telephone: "",
    mother_unique_id: "",
    care_entry_point: "",
    care_entry_point_other: "",
    date_confirmed_hiv_test: "",
    mode_of_hiv_test: "",          // renamed from mode_of_hiv_confirmation
    hiv_test_location: "",
    prior_art: "",
    is_kp: "",
    kp_typology: "",
    date_transferred_in: "",
    facility_transferred_from: "",
  });

  const handleReg = (e) => {
    const { name, value } = e.target;
    setRegistration((prev) => ({ ...prev, [name]: value }));
  };

  // ── Section 2: Enrollment & ART Commencement ────────────────────────────
  const [commencement, setCommencement] = useState({
    clinical_stage_at_art_start: "",
    cd4_at_art_start: "",
    cd4_lf: "",                   // merged: "<200" | ">=200"
    date_adherence_counseling_completed: "",
    date_art_started: "",
    first_art_regimen: "",
    weight_kg: "",
    height_cm: "",
    bmi: "",                       // auto-calculated; read-only
    muac: "",                      // pediatric only (mid-upper arm circumference, cm)
    muac_indication: "",           // auto-derived; read-only
    pregnancy_status: "",          // merged: "" | "Pregnant" | "Breastfeeding"
    tb_preventive_therapy: {       // nested object
      medication: "",
      code: "",
      dose: "",
      start_date: "",
      completion_date: "",
    },
  });

  // Auto-recalculate BMI (from weight/height) and MUAC indication (from muac)
  const handleCommencement = (e) => {
    const { name, value } = e.target;
    setCommencement((prev) => {
      const updated = { ...prev, [name]: value };
      // BMI
      const w = name === "weight_kg" ? value : prev.weight_kg;
      const h = name === "height_cm" ? value : prev.height_cm;
      updated.bmi = calcBmi(w, h);
      // MUAC indication
      const muacVal = name === "muac" ? value : prev.muac;
      updated.muac_indication = calcMuacIndication(muacVal);
      return updated;
    });
  };

  // Handler for the nested TPT object
  const handleTpt = (e) => {
    const { name, value } = e.target;
    setCommencement((prev) => ({
      ...prev,
      tb_preventive_therapy: { ...prev.tb_preventive_therapy, [name]: value },
    }));
  };

  // ── Validation ───────────────────────────────────────────────────────────
  const validate = () => {
    const temp = {};
    if (!registration.date_enrolled_in_hiv_care)
      temp.date_enrolled_in_hiv_care = "Date enrolled in HIV care is required";
    if (!registration.care_entry_point)
      temp.care_entry_point = "Care entry point is required";
    // Mother's Unique ID required for infants (age < 2)
    if (isInfant && !registration.mother_unique_id)
      temp.mother_unique_id = "Mother's Unique ID is required for patients under 2 years";
    if (!commencement.date_art_started)
      temp.date_art_started = "Date ART started is required";
    if (!commencement.clinical_stage_at_art_start)
      temp.clinical_stage_at_art_start = "Clinical stage is required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill all required fields");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        dateOfObservation: commencement.date_art_started,
        personId: props.patientObj.id,
        type: "Enrollment and ART Commencement",
        data: {
          registration,
          commencement,
        },
      };
      await axios.post(`${baseUrl}observation`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Enrollment and Commencement saved successfully");
      props.setActiveContent({
        ...props.activeContent,
        route: "recent-history",
      });
    } catch (err) {
      const msg =
        err?.response?.data?.apierror?.message ||
        "An error occurred. Please try again.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <Card
      className={classes.root}
      style={{ borderRadius: "12px", overflow: "visible" }}
    >
      <CardContent>
        {/* ── Page Header ─────────────────────────────────────────────── */}
        <Box
          sx={{
            backgroundColor: "#014d88",
            padding: "14px 20px",
            marginBottom: "20px",
          }}
        >
          <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>
            ART Enrollment &amp; Commencement
            {isPediatric && (
              <span
                style={{
                  marginLeft: "12px",
                  fontSize: "12px",
                  fontWeight: 400,
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "10px",
                  padding: "2px 10px",
                }}
              >
                Pediatric
              </span>
            )}
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/*  SECTION 1 — PATIENT REGISTRATION DETAILS                    */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <FormAccordion
            panel="registration"
            title="Patient Registration Details"
            index={0}
            expanded={expanded}
            onToggle={toggleAccordion}
          >
            {/* HIV Care Enrollment */}
            <SubHeading>HIV Care &amp; Identification</SubHeading>
            <FieldRow>
              <Col size={3}>
                <SectionLabel>
                  Date Enrolled in HIV Care{" "}
                  <span style={{ color: "red" }}>*</span>
                </SectionLabel>
                <Input
                  type="date"
                  name="date_enrolled_in_hiv_care"
                  value={registration.date_enrolled_in_hiv_care}
                  max={moment(new Date()).format("YYYY-MM-DD")}
                  onChange={handleReg}
                />
                {errors.date_enrolled_in_hiv_care && (
                  <span className={classes.error}>
                    {errors.date_enrolled_in_hiv_care}
                  </span>
                )}
              </Col>
              <Col size={3}>
                <SectionLabel>Date of Confirmed HIV Test</SectionLabel>
                <Input
                  type="date"
                  name="date_confirmed_hiv_test"
                  value={registration.date_confirmed_hiv_test}
                  max={moment(new Date()).format("YYYY-MM-DD")}
                  onChange={handleReg}
                />
              </Col>
              <Col size={3}>
                <SectionLabel>HIV Test Location</SectionLabel>
                <Input
                  type="text"
                  name="hiv_test_location"
                  value={registration.hiv_test_location}
                  onChange={handleReg}
                  placeholder="e.g. ANC, HTS Site"
                />
              </Col>
              <Col size={3}>
                <SectionLabel>Mode of HIV Test</SectionLabel>
                <Input
                  type="select"
                  name="mode_of_hiv_test"
                  value={registration.mode_of_hiv_test}
                  onChange={handleReg}
                >
                  <option value="">Select</option>
                  {MODE_OF_HIV_TEST_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </Input>
              </Col>
            </FieldRow>

            <FieldRow>
              <Col size={3}>
                <SectionLabel>
                  Care Entry Point{" "}
                  <span style={{ color: "red" }}>*</span>
                </SectionLabel>
                <Input
                  type="select"
                  name="care_entry_point"
                  value={registration.care_entry_point}
                  onChange={handleReg}
                >
                  <option value="">Select</option>
                  {CARE_ENTRY_POINTS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.value}. {opt.label}
                    </option>
                  ))}
                </Input>
                {errors.care_entry_point && (
                  <span className={classes.error}>
                    {errors.care_entry_point}
                  </span>
                )}
              </Col>
              {registration.care_entry_point === "9" && (
                <Col size={3}>
                  <SectionLabel>Specify Entry Point</SectionLabel>
                  <Input
                    type="text"
                    name="care_entry_point_other"
                    value={registration.care_entry_point_other}
                    onChange={handleReg}
                    placeholder="Please specify..."
                  />
                </Col>
              )}
              <Col size={3}>
                <SectionLabel>
                  Mother's Unique ID
                  {isInfant && <span style={{ color: "red" }}> *</span>}
                </SectionLabel>
                <Input
                  type="text"
                  name="mother_unique_id"
                  value={registration.mother_unique_id}
                  onChange={handleReg}
                  placeholder={isInfant ? "Required for infants < 2 yrs" : "Mother's facility ID"}
                />
                {errors.mother_unique_id && (
                  <span className={classes.error}>
                    {errors.mother_unique_id}
                  </span>
                )}
              </Col>
            </FieldRow>

            {/* Demographics */}
            <Divider sx={{ my: 2 }} />
            <SubHeading>Additional Demographics</SubHeading>
            <FieldRow>
              <Col size={3}>
                <SectionLabel>Occupation</SectionLabel>
                <Input
                  type="text"
                  name="occupation"
                  value={registration.occupation}
                  onChange={handleReg}
                  placeholder="e.g. Farmer, Trader"
                />
              </Col>
              <Col size={3}>
                <SectionLabel>Marital Status</SectionLabel>
                <Input
                  type="select"
                  name="marital_status"
                  value={registration.marital_status}
                  onChange={handleReg}
                >
                  <option value="">Select</option>
                  {MARITAL_STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </Input>
              </Col>
              <Col size={3}>
                <SectionLabel>Educational Status</SectionLabel>
                <Input
                  type="select"
                  name="educational_status"
                  value={registration.educational_status}
                  onChange={handleReg}
                >
                  <option value="">Select</option>
                  {EDUCATION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </Input>
              </Col>
            </FieldRow>

            {/* Next of Kin */}
            <Divider sx={{ my: 2 }} />
            <SubHeading>Next of Kin</SubHeading>
            <FieldRow>
              <Col size={4}>
                <SectionLabel>Next of Kin (Full Name)</SectionLabel>
                <Input
                  type="text"
                  name="next_of_kin"
                  value={registration.next_of_kin}
                  onChange={handleReg}
                  placeholder="Full name"
                />
              </Col>
              <Col size={4}>
                <SectionLabel>Relationship</SectionLabel>
                <Input
                  type="select"
                  name="next_of_kin_relationship"
                  value={registration.next_of_kin_relationship}
                  onChange={handleReg}
                >
                  <option value="">Select</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Parent">Parent</option>
                  <option value="Child">Child</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Friend">Friend</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Other">Other</option>
                </Input>
              </Col>
              <Col size={4}>
                <SectionLabel>Next of Kin Telephone</SectionLabel>
                <Input
                  type="text"
                  name="next_of_kin_telephone"
                  value={registration.next_of_kin_telephone}
                  onChange={handleReg}
                  placeholder="Phone number"
                />
              </Col>
            </FieldRow>

            {/* Prior ART & KP Typology */}
            <Divider sx={{ my: 2 }} />
            <SubHeading>Prior ART &amp; Key Population</SubHeading>
            <FieldRow>
              <Col size={4}>
                <SectionLabel>Prior ART</SectionLabel>
                <Input
                  type="select"
                  name="prior_art"
                  value={registration.prior_art}
                  onChange={handleReg}
                >
                  <option value="">Select</option>
                  {PRIOR_ART_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.value}. {opt.label}
                    </option>
                  ))}
                </Input>
              </Col>
              <Col size={2}>
                <SectionLabel>Is Patient KP?</SectionLabel>
                <Input
                  type="select"
                  name="is_kp"
                  value={registration.is_kp}
                  onChange={handleReg}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Input>
              </Col>
              {registration.is_kp === "Yes" && (
                <Col size={4}>
                  <SectionLabel>KP Typology</SectionLabel>
                  <Input
                    type="select"
                    name="kp_typology"
                    value={registration.kp_typology}
                    onChange={handleReg}
                  >
                    <option value="">Select</option>
                    {KP_TYPOLOGY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </Input>
                </Col>
              )}
            </FieldRow>

            {/* Transfer Info */}
            {(registration.prior_art === "2" ||
              registration.care_entry_point === "7") && (
              <>
                <Divider sx={{ my: 2 }} />
                <SubHeading>Transfer Details</SubHeading>
                <FieldRow>
                  <Col size={3}>
                    <SectionLabel>Date Transferred In</SectionLabel>
                    <Input
                      type="date"
                      name="date_transferred_in"
                      value={registration.date_transferred_in}
                      max={moment(new Date()).format("YYYY-MM-DD")}
                      onChange={handleReg}
                    />
                  </Col>
                  <Col size={5}>
                    <SectionLabel>Facility Transferred From</SectionLabel>
                    <Input
                      type="text"
                      name="facility_transferred_from"
                      value={registration.facility_transferred_from}
                      onChange={handleReg}
                      placeholder="Name of sending facility"
                    />
                  </Col>
                </FieldRow>
              </>
            )}
          </FormAccordion>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/*  SECTION 2 — ENROLLMENT & ART COMMENCEMENT                   */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <FormAccordion
            panel="commencement"
            title="Enrollment & ART Commencement"
            index={1}
            expanded={expanded}
            onToggle={toggleAccordion}
          >
            {/* Clinical Status */}
            <SubHeading>Clinical Status at ART Start</SubHeading>
            <FieldRow>
              <Col size={3}>
                <SectionLabel>
                  Clinical Stage at Start of ART{" "}
                  <span style={{ color: "red" }}>*</span>
                </SectionLabel>
                <Input
                  type="select"
                  name="clinical_stage_at_art_start"
                  value={commencement.clinical_stage_at_art_start}
                  onChange={handleCommencement}
                >
                  <option value="">Select</option>
                  {CLINICAL_STAGES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Input>
                {errors.clinical_stage_at_art_start && (
                  <span className={classes.error}>
                    {errors.clinical_stage_at_art_start}
                  </span>
                )}
              </Col>
              <Col size={3}>
                <SectionLabel>CD4 Count at Start of ART</SectionLabel>
                <Input
                  type="text"
                  name="cd4_at_art_start"
                  value={commencement.cd4_at_art_start}
                  onChange={handleCommencement}
                  placeholder="cells/mm³"
                />
              </Col>
              <Col size={3}>
                <SectionLabel>CD4 LF</SectionLabel>
                <Input
                  type="select"
                  name="cd4_lf"
                  value={commencement.cd4_lf}
                  onChange={handleCommencement}
                >
                  <option value="">Select</option>
                  {CD4_LF_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Input>
              </Col>
            </FieldRow>

            {/* ART Dates & Regimen */}
            <Divider sx={{ my: 2 }} />
            <SubHeading>ART Dates &amp; Regimen</SubHeading>
            <FieldRow>
              <Col size={3}>
                <SectionLabel>
                  Date Initial Adherence Counseling Completed
                </SectionLabel>
                <Input
                  type="date"
                  name="date_adherence_counseling_completed"
                  value={commencement.date_adherence_counseling_completed}
                  max={moment(new Date()).format("YYYY-MM-DD")}
                  onChange={handleCommencement}
                />
              </Col>
              <Col size={3}>
                <SectionLabel>
                  Date ART Started{" "}
                  <span style={{ color: "red" }}>*</span>
                </SectionLabel>
                <Input
                  type="date"
                  name="date_art_started"
                  value={commencement.date_art_started}
                  max={moment(new Date()).format("YYYY-MM-DD")}
                  onChange={handleCommencement}
                />
                {errors.date_art_started && (
                  <span className={classes.error}>
                    {errors.date_art_started}
                  </span>
                )}
              </Col>
              <Col size={4}>
                <SectionLabel>First ART Regimen</SectionLabel>
                <Input
                  type="text"
                  name="first_art_regimen"
                  value={commencement.first_art_regimen}
                  onChange={handleCommencement}
                  placeholder="e.g. TDF/3TC/DTG"
                />
              </Col>
            </FieldRow>

            {/* Vitals at Commencement */}
            <Divider sx={{ my: 2 }} />
            <SubHeading>Vitals at Commencement</SubHeading>
            <Box
              sx={{
                background: "#fff",
                border: "1px solid #014d88",
                borderRadius: "4px",
                padding: "16px",
                marginBottom: "16px",
              }}
            >
              <div className="row">
                <Col size={3}>
                  <SectionLabel>Weight (kg)</SectionLabel>
                  <Input
                    type="text"
                    name="weight_kg"
                    value={commencement.weight_kg}
                    onChange={handleCommencement}
                    placeholder="kg"
                  />
                </Col>
                <Col size={3}>
                  <SectionLabel>Height / Length (cm)</SectionLabel>
                  <Input
                    type="text"
                    name="height_cm"
                    value={commencement.height_cm}
                    onChange={handleCommencement}
                    placeholder="cm"
                  />
                </Col>
                <Col size={3}>
                  <SectionLabel>
                    BMI{" "}
                    <span style={{ fontWeight: 400, color: "#546e7a", textTransform: "none", letterSpacing: 0 }}>
                      (auto-calculated)
                    </span>
                  </SectionLabel>
                  <Input
                    type="text"
                    name="bmi"
                    value={commencement.bmi}
                    readOnly
                    placeholder="kg/m²"
                    style={{ background: "#f5f9ff", color: "#014d88", fontWeight: 600 }}
                  />
                </Col>
                {/* ── MUAC — pediatric only ──────────────────────────── */}
                {isPediatric && (
                  <>
                    <Col size={2}>
                      <SectionLabel>MUAC (cm)</SectionLabel>
                      <Input
                        type="text"
                        name="muac"
                        value={commencement.muac}
                        onChange={handleCommencement}
                        placeholder="e.g. 13.5"
                      />
                    </Col>
                    <Col size={3}>
                      <SectionLabel>
                        MUAC Indication{" "}
                        <span style={{ fontWeight: 400, color: "#546e7a", textTransform: "none", letterSpacing: 0 }}>
                          (auto-derived)
                        </span>
                      </SectionLabel>
                      <Input
                        type="text"
                        name="muac_indication"
                        value={commencement.muac_indication}
                        readOnly
                        placeholder="—"
                        style={{
                          fontWeight: 600,
                          background:
                            commencement.muac_indication === "Underweight"
                              ? "#fff3e0"
                              : commencement.muac_indication === "Well Nourished"
                              ? "#e8f5e9"
                              : commencement.muac_indication === "Overweight/Obese"
                              ? "#fce4ec"
                              : "#f5f9ff",
                          color:
                            commencement.muac_indication === "Underweight"
                              ? "#e65100"
                              : commencement.muac_indication === "Well Nourished"
                              ? "#2e7d32"
                              : commencement.muac_indication === "Overweight/Obese"
                              ? "#880e4f"
                              : "#014d88",
                        }}
                      />
                    </Col>
                  </>
                )}
                {showPregnancyStatus && (
                  <Col size={3}>
                    <SectionLabel>Pregnancy Status</SectionLabel>
                    <Input
                      type="select"
                      name="pregnancy_status"
                      value={commencement.pregnancy_status}
                      onChange={handleCommencement}
                    >
                      <option value="">Not applicable</option>
                      <option value="Pregnant">Pregnant</option>
                      <option value="Breastfeeding">Breastfeeding</option>
                    </Input>
                  </Col>
                )}
              </div>
            </Box>

            {/* TB Preventive Therapy */}
            <Divider sx={{ my: 2 }} />
            <SubHeading>TB Preventive Therapy (TPT)</SubHeading>
            <Box
              sx={{
                background: "#fff",
                border: "1px solid #014d88",
                borderRadius: "4px",
                padding: "16px",
              }}
            >
              <FieldRow>
                <Col size={4}>
                  <SectionLabel>TPT Medication (Name)</SectionLabel>
                  <Input
                    type="text"
                    name="medication"
                    value={commencement.tb_preventive_therapy.medication}
                    onChange={handleTpt}
                    placeholder="e.g. Isoniazid, Rifapentine"
                  />
                </Col>
                <Col size={2}>
                  <SectionLabel>TPT Code</SectionLabel>
                  <Input
                    type="select"
                    name="code"
                    value={commencement.tb_preventive_therapy.code}
                    onChange={handleTpt}
                  >
                    <option value="">Select</option>
                    {TB_PREVENTIVE_THERAPY_CODES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Input>
                </Col>
                <Col size={2}>
                  <SectionLabel>Dose</SectionLabel>
                  <Input
                    type="text"
                    name="dose"
                    value={commencement.tb_preventive_therapy.dose}
                    onChange={handleTpt}
                    placeholder="e.g. 300mg"
                  />
                </Col>
                <Col size={2}>
                  <SectionLabel>Start Date</SectionLabel>
                  <Input
                    type="date"
                    name="start_date"
                    value={commencement.tb_preventive_therapy.start_date}
                    onChange={handleTpt}
                  />
                </Col>
                <Col size={2}>
                  <SectionLabel>Completion Date</SectionLabel>
                  <Input
                    type="date"
                    name="completion_date"
                    value={commencement.tb_preventive_therapy.completion_date}
                    onChange={handleTpt}
                  />
                </Col>
              </FieldRow>
            </Box>
          </FormAccordion>

          {/* ── Action Buttons ─────────────────────────────────────────── */}
          <Box
            sx={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
              padding: "16px 0",
              borderTop: "1px solid #e0e0e0",
              marginTop: "8px",
            }}
          >
            <MatButton
              variant="contained"
              className={classes.button}
              startIcon={<CancelIcon style={{ color: "#fff" }} />}
              style={{ backgroundColor: "#992E62" }}
              onClick={() =>
                props.setActiveContent({
                  ...props.activeContent,
                  route: "recent-history",
                })
              }
              type="button"
            >
              <span style={{ textTransform: "capitalize" }}>Cancel</span>
            </MatButton>
            <MatButton
              type="submit"
              variant="contained"
              className={classes.button}
              startIcon={<SaveIcon />}
              style={{ backgroundColor: "#014d88" }}
              disabled={saving}
            >
              <span style={{ textTransform: "capitalize" }}>{saving ? "Saving..." : "Save"}</span>
            </MatButton>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnrollmentAndCommencementForm;
