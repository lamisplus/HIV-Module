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
import "semantic-ui-css/semantic.min.css";
import { Button } from "semantic-ui-react";

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

const TB_PREVENTIVE_THERAPY_CODES = [
  { value: "6H",   label: "6H — Isoniazid (6 months)" },
  { value: "3HP",  label: "3HP — Isoniazid and Rifapentine" },
  { value: "3HR",  label: "3HR — Isoniazid and Rifampicin" },
  { value: "QTIP", label: "QTIP — CTX/INH/B6 FDC Fixed Dose" },
];

const CLINICAL_STAGES = ["Stage 1", "Stage 2", "Stage 3", "Stage 4"];

const ACCORDION_STYLES = [
  { bg: "#1565c0", light: "#e3f2fd" }, // Patient Registration - blue
  { bg: "#2e7d32", light: "#e8f5e9" }, // Enrollment & ART - green
];

// ─────────────────────────────────────────────────────────────────────────────
// Reusable sub-components  (all defined at module scope — NEVER inside a component)
// ─────────────────────────────────────────────────────────────────────────────

const useStyles = makeStyles(() => ({
  root: {
    "& .form-control": { borderRadius: "0.25rem", height: "41px" },
    "& select": { "-webkit-appearance": "listbox !important" },
    "& label": { fontSize: "14px", color: "#014d88", fontWeight: "600" },
    "& textarea.form-control": { height: "auto" },
  },
  error: { color: "#d32f2f", fontSize: "12px", marginTop: "4px" },
  fieldLabel: {
    fontSize: "13px",
    color: "#014d88",
    fontWeight: "600",
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

const CheckGroup = ({ name, id, label, checked, onChange }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "7px",
      marginRight: "16px",
      marginBottom: "8px",
    }}
  >
    <input
      type="checkbox"
      name={name}
      id={id || name}
      checked={!!checked}
      onChange={onChange}
      style={{
        width: "15px",
        height: "15px",
        margin: 0,
        padding: 0,
        flexShrink: 0,
        cursor: "pointer",
        accentColor: "#014d88",
        position: "relative",
        top: 0,
      }}
    />
    <label
      htmlFor={id || name}
      style={{
        margin: 0,
        padding: 0,
        cursor: "pointer",
        fontSize: "13px",
        color: "#333",
        fontWeight: "500",
        lineHeight: 1,
        userSelect: "none",
      }}
    >
      {label}
    </label>
  </div>
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
        border: `1px solid ${style.bg}22`,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
        sx={{
          background: `linear-gradient(135deg, ${style.bg}, ${style.bg}cc)`,
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
        sx={{ padding: "20px 24px", background: style.light + "55" }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

const EnrollmentAndCommencementForm = (props) => {
  const classes = useStyles();
  const isFemale = ["female", "FEMALE", "Female"].includes(
    props.patientObj?.sex
  );

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [expanded, setExpanded] = useState(["registration", "commencement"]);

  const toggleAccordion = (panel) => {
    setExpanded((prev) =>
      prev.includes(panel) ? prev.filter((p) => p !== panel) : [...prev, panel]
    );
  };

  // ── Section 1: Patient Registration Details ────────────────────────────
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
    mode_of_hiv_confirmation: "",
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

  // ── Section 2: Enrollment & ART Commencement ───────────────────────────
  const [commencement, setCommencement] = useState({
    clinical_stage_at_art_start: "",
    cd4_at_art_start: "",
    cd4_lf_less_200: false,
    cd4_lf_gte_200: false,
    date_adherence_counseling_completed: "",
    date_art_started: "",
    first_art_regimen: "",
    weight_kg: "",
    height_cm: "",
    bmi_muac: "",
    pregnant: false,
    breastfeeding: false,
    tb_preventive_therapy_code: "",
    tb_preventive_therapy_dose: "",
    tb_preventive_therapy_start_date: "",
    tb_preventive_therapy_completion_date: "",
  });

  const handleCommencement = (e) => {
    const { name, type, value, checked } = e.target;
    setCommencement((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // When one CD4 LF checkbox is ticked, clear the other
  const handleCd4Lf = (e) => {
    const { name, checked } = e.target;
    if (name === "cd4_lf_less_200") {
      setCommencement((prev) => ({
        ...prev,
        cd4_lf_less_200: checked,
        cd4_lf_gte_200: checked ? false : prev.cd4_lf_gte_200,
      }));
    } else {
      setCommencement((prev) => ({
        ...prev,
        cd4_lf_gte_200: checked,
        cd4_lf_less_200: checked ? false : prev.cd4_lf_less_200,
      }));
    }
  };

  // ── Validation ────────────────────────────────────────────────────────
  const validate = () => {
    const temp = {};
    if (!registration.date_enrolled_in_hiv_care)
      temp.date_enrolled_in_hiv_care = "Date enrolled in HIV care is required";
    if (!registration.care_entry_point)
      temp.care_entry_point = "Care entry point is required";
    if (!commencement.date_art_started)
      temp.date_art_started = "Date ART started is required";
    if (!commencement.clinical_stage_at_art_start)
      temp.clinical_stage_at_art_start = "Clinical stage is required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // ── Submit ─────────────────────────────────────────────────────────────
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
            background: "linear-gradient(135deg, #014d88, #0288d1)",
            borderRadius: "8px",
            padding: "16px 24px",
            marginBottom: "20px",
          }}
        >
          <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "18px" }}>
            Enrollment &amp; ART Commencement Form
          </Typography>
          <Typography sx={{ color: "#b3d9f5", fontSize: "13px", marginTop: "2px" }}>
            Complete all applicable sections below
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
                <SectionLabel>Mode of HIV Confirmation</SectionLabel>
                <Input
                  type="select"
                  name="mode_of_hiv_confirmation"
                  value={registration.mode_of_hiv_confirmation}
                  onChange={handleReg}
                >
                  <option value="">Select</option>
                  <option value="Rapid Test">Rapid Test</option>
                  <option value="PCR">PCR</option>
                  <option value="Western Blot">Western Blot</option>
                  <option value="ELISA">ELISA</option>
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
                <SectionLabel>Mother's Unique ID</SectionLabel>
                <Input
                  type="text"
                  name="mother_unique_id"
                  value={registration.mother_unique_id}
                  onChange={handleReg}
                  placeholder="Mother's facility ID"
                />
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
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
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
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
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
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
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
                    <option key={s} value={s}>
                      {s}
                    </option>
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
                <SectionLabel>CD4 LF (Low / High)</SectionLabel>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    paddingTop: "8px",
                  }}
                >
                  <CheckGroup
                    name="cd4_lf_less_200"
                    id="cd4_lf_less_200"
                    label="< 200"
                    checked={commencement.cd4_lf_less_200}
                    onChange={handleCd4Lf}
                  />
                  <CheckGroup
                    name="cd4_lf_gte_200"
                    id="cd4_lf_gte_200"
                    label="≥ 200"
                    checked={commencement.cd4_lf_gte_200}
                    onChange={handleCd4Lf}
                  />
                </Box>
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
                border: "1px solid #c8e6c9",
                borderRadius: "8px",
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
                  <SectionLabel>BMI / MUAC</SectionLabel>
                  <Input
                    type="text"
                    name="bmi_muac"
                    value={commencement.bmi_muac}
                    onChange={handleCommencement}
                    placeholder="BMI or MUAC value"
                  />
                </Col>
                {isFemale && (
                  <Col size={3}>
                    <SectionLabel>Reproductive Status</SectionLabel>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        paddingTop: "8px",
                      }}
                    >
                      <CheckGroup
                        name="pregnant"
                        id="pregnant"
                        label="Pregnant"
                        checked={commencement.pregnant}
                        onChange={handleCommencement}
                      />
                      <CheckGroup
                        name="breastfeeding"
                        id="breastfeeding"
                        label="Breastfeeding"
                        checked={commencement.breastfeeding}
                        onChange={handleCommencement}
                      />
                    </Box>
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
                border: "1px solid #c8e6c9",
                borderRadius: "8px",
                padding: "16px",
              }}
            >
              <FieldRow>
                <Col size={3}>
                  <SectionLabel>TPT Medication (Code)</SectionLabel>
                  <Input
                    type="select"
                    name="tb_preventive_therapy_code"
                    value={commencement.tb_preventive_therapy_code}
                    onChange={handleCommencement}
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
                    name="tb_preventive_therapy_dose"
                    value={commencement.tb_preventive_therapy_dose}
                    onChange={handleCommencement}
                    placeholder="e.g. 300mg"
                  />
                </Col>
                <Col size={3}>
                  <SectionLabel>TPT Start Date</SectionLabel>
                  <Input
                    type="date"
                    name="tb_preventive_therapy_start_date"
                    value={commencement.tb_preventive_therapy_start_date}
                    onChange={handleCommencement}
                  />
                </Col>
                <Col size={3}>
                  <SectionLabel>TPT Completion Date</SectionLabel>
                  <Input
                    type="date"
                    name="tb_preventive_therapy_completion_date"
                    value={commencement.tb_preventive_therapy_completion_date}
                    onChange={handleCommencement}
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
            <Button
              content="Cancel"
              icon="cancel"
              labelPosition="left"
              style={{
                backgroundColor: "#78909c",
                color: "#fff",
                borderRadius: "6px",
              }}
              onClick={() =>
                props.setActiveContent({
                  ...props.activeContent,
                  route: "recent-history",
                })
              }
              type="button"
            />
            <Button
              content={saving ? "Saving..." : "Save Record"}
              type="submit"
              icon="save"
              labelPosition="right"
              style={{
                backgroundColor: "#014d88",
                color: "#fff",
                borderRadius: "6px",
              }}
              disabled={saving}
            />
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnrollmentAndCommencementForm;
