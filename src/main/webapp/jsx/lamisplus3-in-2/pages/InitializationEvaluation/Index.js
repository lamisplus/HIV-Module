import React, { useEffect, useState } from "react";
import axios from "axios";
import { FormGroup, Label, Input } from "reactstrap";
import * as moment from "moment";
import ReactSelect from "react-select";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
  Box,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent } from "@material-ui/core";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { token, url as baseUrl } from "../../../../api";
import "semantic-ui-css/semantic.min.css";
import { Button } from "semantic-ui-react";
import { calculate_age_to_number } from "../../../../utils";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const SYMPTOM_OPTIONS = [
  { value: "fever", label: "Fever / Chills" },
  { value: "weight_loss", label: "Weight Loss / Failure to Gain Weight" },
  { value: "night_sweats", label: "Night Sweats" },
  { value: "nausea", label: "Nausea / Vomiting" },
  { value: "cough", label: "Cough" },
  { value: "headache", label: "Headache" },
  { value: "new_visual", label: "New Visual Impairment" },
  { value: "ear_discharge", label: "Ear Discharge" },
  { value: "oral_sores", label: "Oral Sores" },
  { value: "pain_swallowing", label: "Pain / Difficulty when Swallowing" },
  { value: "difficulty_breathing", label: "Difficulty Breathing" },
  { value: "food_refusal", label: "Food Refusal" },
  { value: "diarrhoea", label: "Diarrhoea" },
  { value: "difficulty_sleeping", label: "Difficulty Sleeping" },
  { value: "pain_micturition", label: "Pain on Micturition" },
  { value: "genital_sores", label: "Genital Sores" },
  { value: "genital_discharge", label: "Genital Discharge" },
  { value: "genital_itching", label: "Genital Itching" },
  { value: "convulsion", label: "Convulsion" },
  { value: "pain", label: "Pain" },
  { value: "irritability", label: "Irritability" },
  { value: "rash", label: "Rash" },
  { value: "weakness", label: "Weakness" },
  { value: "itching", label: "Itching" },
  { value: "chronic_diarrhoea", label: "Chronic Diarrhoea" },
  { value: "numbness", label: "Numbness / Tingling" },
];

const SYSTEM_FINDINGS = {
  generalAppearance: [
    { value: "pallor", label: "Pallor" },
    { value: "febrile", label: "Febrile" },
    { value: "dehydrated", label: "Dehydrated" },
    { value: "jaundice", label: "Jaundice" },
    { value: "peripheral_edema", label: "Peripheral Edema" },
  ],
  headEyeEnt: [
    { value: "icterus", label: "Icterus" },
    { value: "thrush", label: "Thrush" },
    { value: "oral_ulcer", label: "Oral Ulcer" },
    { value: "oral_ks", label: "Oral KS" },
    { value: "abnormal_fundoscopy", label: "Abnormal Fundoscopy" },
    { value: "gingivitis", label: "Gingivitis" },
    { value: "otitis_media", label: "Otitis Media" },
  ],
  cardiovascular: [
    { value: "abnormal_heart_rate", label: "Abnormal Heart Rate" },
    { value: "auscultation_finding", label: "Auscultation Finding" },
  ],
  respiratory: [
    { value: "labored_breathing", label: "Labored Breathing" },
    { value: "intercostal_recession", label: "Inter/Subcostal Recession" },
    { value: "cyanosis", label: "Cyanosis" },
    { value: "wheezing", label: "Wheezing" },
    { value: "auscultation_finding", label: "Auscultation Finding" },
  ],
  gastrointestinal: [
    { value: "distention", label: "Distention" },
    { value: "hepatomegaly", label: "Hepatomegaly" },
    { value: "spenomegaly", label: "Splenomegaly" },
    { value: "tenderness", label: "Tenderness" },
  ],
  genitalia: [
    { value: "genital_discharge", label: "Genital Discharge" },
    { value: "genital_ulcer_lesion", label: "Genital Ulcer/Lesion" },
    { value: "lymphadenopathy", label: "Lymphadenopathy" },
  ],
  breastGlands: [
    { value: "lumps_masses", label: "Lumps / Masses" },
    { value: "discharge", label: "Discharge" },
    { value: "parotid_swelling", label: "Parotid Swelling" },
    { value: "lymphadenopathy", label: "Lymphadenopathy" },
  ],
  skin: [
    { value: "pruritic_papular", label: "Pruritic Papular Dermatitis" },
    { value: "abscesses", label: "Abscesses" },
    { value: "herpes_zoster", label: "Herpes Zoster" },
    { value: "kaposi_lesions", label: "Kaposi's Lesions" },
    { value: "seborrheic_dermatitis", label: "Seborrheic Dermatitis" },
    { value: "fungal_infections", label: "Fungal Infections" },
    { value: "scabies", label: "Scabies" },
  ],
  neurological: [
    { value: "disoriented_tpp", label: "Disoriented in TPP" },
    { value: "impaired_consciousness", label: "Impaired Consciousness" },
    { value: "slurred_speech", label: "Slurred Speech" },
    { value: "blindness_1_2_eyes", label: "Blindness 1 or 2 Eyes" },
    { value: "weakness_paralysis", label: "Weakness / Paralysis" },
    { value: "numbness_extremities", label: "Numbness of Extremities" },
  ],
  mentalStatus: [
    { value: "slow_mentation", label: "Slow Mentation" },
    { value: "memory_loss", label: "Memory Loss" },
    { value: "mood_swings", label: "Mood Swings" },
    { value: "depression", label: "Depression" },
    { value: "anxiety", label: "Anxiety" },
    { value: "suicidal_ideation", label: "Suicidal Ideation" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const useStyles = makeStyles((theme) => ({
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

const ACCORDION_STYLES = [
  { bg: "#1565c0", light: "#e3f2fd" }, // Symptoms Review - blue
  { bg: "#2e7d32", light: "#e8f5e9" }, // Medical History - green
  { bg: "#6a1b9a", light: "#f3e5f5" }, // Previously ARV Exposure - purple
  { bg: "#01579b", light: "#e1f5fe" }, // Physical Examination - sky blue
  { bg: "#b71c1c", light: "#ffebee" }, // Confirmatory Details - red
];

// ─────────────────────────────────────────────────────────────────────────────
// Reusable sub-components
// ─────────────────────────────────────────────────────────────────────────────

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
  <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", marginRight: "16px", marginBottom: "8px" }}>
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
  <div style={{
    borderLeft: "3px solid #014d88",
    paddingLeft: "10px",
    marginBottom: "12px",
    marginTop: "16px",
    color: "#014d88",
    fontWeight: "700",
    fontSize: "14px",
  }}>
    {children}
  </div>
);

// FormAccordion MUST live outside the main component so React never treats it
// as a new component type on re-render (which would unmount all inputs).
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
        <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "15px", letterSpacing: "0.3px" }}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: "20px 24px", background: style.light + "55" }}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

const BodySystem = ({ label, systemKey, state, onChange, extraContent }) => {
  const findings = SYSTEM_FINDINGS[systemKey] || [];

  const handleNSF = (e) => {
    onChange(systemKey, {
      nsf: e.target.checked,
      findings: [],
      other: "",
      ...(state.rate !== undefined ? { rate: "" } : {}),
      ...(state.tanner_stage !== undefined ? { tanner_stage: "" } : {}),
    });
  };

  const handleFindings = (selected) => {
    onChange(systemKey, { ...state, findings: selected || [] });
  };

  const handleOther = (e) => {
    onChange(systemKey, { ...state, other: e.target.value });
  };

  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "12px 16px",
        marginBottom: "12px",
        background: state.nsf ? "#f9fbe7" : "#fff",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
        <Typography sx={{ fontWeight: 600, color: "#014d88", fontSize: "13px" }}>
          {label}
        </Typography>
        <label style={{ display: "inline-flex", alignItems: "center", gap: "7px", cursor: "pointer", fontSize: "12px", color: "#388e3c", fontWeight: 600, margin: 0 }}>
          <input
            type="checkbox"
            checked={state.nsf}
            onChange={handleNSF}
            style={{
              width: "15px",
              height: "15px",
              margin: 0,
              padding: 0,
              flexShrink: 0,
              cursor: "pointer",
              accentColor: "#388e3c",
              position: "relative",
              top: 0,
            }}
          />
          NSF (No Significant Finding)
        </label>
      </Box>
      {!state.nsf && (
        <div className="row">
          {extraContent}
          <div className={`form-group mb-2 col-md-${extraContent ? "6" : "8"}`}>
            <SectionLabel>Findings</SectionLabel>
            <ReactSelect
              isMulti
              options={findings}
              value={state.findings}
              onChange={handleFindings}
              placeholder="Select findings..."
              closeMenuOnSelect={false}
              styles={{
                control: (base) => ({ ...base, minHeight: "38px", fontSize: "13px" }),
                multiValue: (base) => ({ ...base, background: "#e3f2fd" }),
                placeholder: (base) => ({ ...base, fontSize: "13px", color: "#9e9e9e" }),
              }}
            />
          </div>
          <div className="form-group mb-2 col-md-4">
            <SectionLabel>Other (specify)</SectionLabel>
            <Input
              type="text"
              value={state.other}
              onChange={handleOther}
              placeholder="Additional findings..."
              style={{ fontSize: "13px" }}
            />
          </div>
        </div>
      )}
      {state.nsf && (
        <Typography sx={{ fontSize: "12px", color: "#9e9e9e", fontStyle: "italic" }}>
          No significant finding recorded for this system.
        </Typography>
      )}
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

const InitializationEvaluationForm = (props) => {
  const classes = useStyles();
  const patientAge = calculate_age_to_number(props.patientObj.dateOfBirth);
  const isFemale = ["female", "FEMALE", "Female"].includes(props.patientObj.sex);

  const [enrollDate, setEnrollDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [expanded, setExpanded] = useState(["symptoms", "medical", "arv", "physical", "confirmatory"]);

  const toggleAccordion = (panel) => {
    setExpanded((prev) =>
      prev.includes(panel) ? prev.filter((p) => p !== panel) : [...prev, panel]
    );
  };

  // ── Visit Date / Clinician ───────────────────────────────────────────────
  const [visitDate, setVisitDate] = useState("");
  const [clinicianName, setClinicianName] = useState("");

  // ── Section: Symptoms Review ─────────────────────────────────────────────
  const [symptomSelect, setSymptomSelect] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [otherSymptom, setOtherSymptom] = useState("");

  const addedSymptomValues = selectedSymptoms.map((s) => s.value);
  const availableSymptomOptions = SYMPTOM_OPTIONS.filter(
    (o) => !addedSymptomValues.includes(o.value)
  );

  const handleAddSymptom = (option) => {
    if (!option) return;
    setSelectedSymptoms((prev) => [...prev, { value: option.value, label: option.label, duration: "" }]);
    setSymptomSelect(null);
  };

  const handleRemoveSymptom = (value) => {
    setSelectedSymptoms((prev) => prev.filter((s) => s.value !== value));
  };

  const handleSymptomDuration = (value, duration) => {
    setSelectedSymptoms((prev) =>
      prev.map((s) => (s.value === value ? { ...s, duration } : s))
    );
  };

  // ── Section: Medical History ─────────────────────────────────────────────
  const [tbAssessment, setTbAssessment] = useState({
    assessed_for_tb: "",
    tb_status: "",
    developmental_assessment: "",
    immunisation_complete: "",
    mode_of_infant_feeding: "",
    known_drug_allergies: "",
    past_medical_history: "",
  });

  const handleTb = (e) => {
    const { name, value } = e.target;
    setTbAssessment((prev) => ({ ...prev, [name]: value }));
  };

  const [pregnancy, setPregnancy] = useState({
    currently_pregnant: "",
    last_menstrual_period: "",
    gestational_age: "",
    expected_date_of_delivery: "",
  });

  const handlePregnancy = (e) => {
    const { name, value } = e.target;
    setPregnancy((prev) => ({ ...prev, [name]: value }));
  };

  const [currentMeds, setCurrentMeds] = useState({
    none: false, art: false, ctx: false, anti_tb_drugs: false, other_specify: "",
  });

  const handleMeds = (e) => {
    const { name, type, value, checked } = e.target;
    if (name === "none" && checked) {
      setCurrentMeds({ none: true, art: false, ctx: false, anti_tb_drugs: false, other_specify: "" });
      return;
    }
    setCurrentMeds((prev) => ({ ...prev, none: false, [name]: type === "checkbox" ? checked : value }));
  };

  const [disclosure, setDisclosure] = useState({
    no_one: false, family_member: false, friend: false, spouse: false, spiritual_leader: false, others_specify: "",
  });

  const handleDisclosure = (e) => {
    const { name, type, value, checked } = e.target;
    if (name === "no_one" && checked) {
      setDisclosure({ no_one: true, family_member: false, friend: false, spouse: false, spiritual_leader: false, others_specify: "" });
      return;
    }
    setDisclosure((prev) => ({ ...prev, no_one: false, [name]: type === "checkbox" ? checked : value }));
  };

  const [arvSideEffects, setArvSideEffects] = useState({
    has_side_effects: "", side_effects_detail: "", specify_medication: "",
  });

  const handleSideEffects = (e) => {
    const { name, value } = e.target;
    setArvSideEffects((prev) => ({ ...prev, [name]: value }));
  };

  // ── Section: Previously ARV Exposure ────────────────────────────────────
  const [arvHistory, setArvHistory] = useState({
    previous_arv_exposure: "",
    earlier_arv_not_transfer: false,
    prep: false,
    pep: false,
    tran: false,
    name_of_facility: "",
    duration_of_care_from: "",
    duration_of_care_to: "",
  });

  const handleArv = (e) => {
    const { name, type, value, checked } = e.target;
    setArvHistory((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // ── Section: Physical Examination ────────────────────────────────────────
  const [vitals, setVitals] = useState({
    temperature: "", bp_systolic: "", bp_diastolic: "",
    pulse: "", weight: "", height: "", head_circumference: "", surface_area: "",
  });

  const handleVitals = (e) => {
    const { name, value } = e.target;
    setVitals((prev) => ({ ...prev, [name]: value }));
  };

  const makeSystem = (extra = {}) => ({ nsf: false, findings: [], other: "", ...extra });

  const [systems, setSystems] = useState({
    generalAppearance: makeSystem(),
    headEyeEnt: makeSystem(),
    cardiovascular: makeSystem(),
    respiratory: makeSystem({ rate: "" }),
    gastrointestinal: makeSystem(),
    genitalia: makeSystem({ tanner_stage: "" }),
    breastGlands: makeSystem(),
    skin: makeSystem(),
    neurological: makeSystem(),
    mentalStatus: makeSystem(),
  });

  const handleSystem = (key, newState) => {
    setSystems((prev) => ({ ...prev, [key]: newState }));
  };

  const handleSystemExtra = (key, field, value) => {
    setSystems((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const [additionalFindings, setAdditionalFindings] = useState("");

  // ── Section: Confirmatory Details ────────────────────────────────────────
  const [assessment, setAssessment] = useState({
    asymptomatic: false,
    symptomatic: false,
    aids_defining_illness: false,
    opportunistic_infection: false,
    who_stage: "",
    enroll_general_followup: false,
    enroll_arv_therapy: false,
    enroll_ahd_management: false,
    enroll_pending_lab_results: false,
    plan_art_ongoing_monitoring: false,
    plan_art_postponed: false,
    plan_art_change_treatment: false,
    plan_art_restart: false,
    plan_art_start_new: false,
    drugs_in_regimen: "",
    additional_comments: "",
    next_appointment: "",
  });

  const handleAssessment = (e) => {
    const { name, type, value, checked } = e.target;
    setAssessment((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // ── Effects ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (props.patientObj?.id) {
      axios
        .get(`${baseUrl}hiv/patient/${props.patientObj.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const enrollment = res.data.enrollment;
          setEnrollDate(
            enrollment?.entryPointId === 21
              ? enrollment?.dateConfirmedHiv
              : enrollment?.dateOfRegistration
          );
        })
        .catch(() => {});
    }
  }, [props.patientObj?.id]);

  // ── Validation ───────────────────────────────────────────────────────────
  const validate = () => {
    const temp = {};
    if (!visitDate) temp.visitDate = "Visit date is required";
    if (!assessment.who_stage) temp.who_stage = "WHO Stage is required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill all required fields");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        dateOfObservation: visitDate,
        personId: props.patientObj.id,
        type: "Initialization Clinical Evaluation",
        data: {
          visitDate,
          clinicianName,
          symptoms: selectedSymptoms,
          otherSymptom,
          tbAssessment,
          pregnancy: isFemale ? pregnancy : null,
          currentMeds,
          disclosure,
          arvSideEffects,
          arvHistory,
          vitals,
          physicalExam: {
            ...systems,
            breastGlands: isFemale ? systems.breastGlands : null,
            additionalFindings,
          },
          assessment,
        },
      };
      await axios.post(`${baseUrl}observation`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Initialization Evaluation saved successfully");
      props.setActiveContent({ ...props.activeContent, route: "recent-history" });
    } catch (err) {
      const msg = err?.response?.data?.apierror?.message || "An error occurred. Please try again.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <Card className={classes.root} style={{ borderRadius: "12px", overflow: "visible" }}>
      <CardContent>
        {/* ── Page Header ──────────────────────────────────────────────── */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #014d88, #0288d1)",
            borderRadius: "8px",
            padding: "16px 24px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "18px" }}>
              {patientAge < 14
                ? "Pediatric — Initialization Clinical Evaluation"
                : "Adult — Initialization Clinical Evaluation"}
            </Typography>
            <Typography sx={{ color: "#b3d9f5", fontSize: "13px", marginTop: "2px" }}>
              Complete all applicable sections below
            </Typography>
          </Box>
        </Box>

        {/* ── Visit Details Row ─────────────────────────────────────────── */}
        <Box
          sx={{
            background: "#f5f7fa",
            border: "1px solid #e0e8f0",
            borderRadius: "8px",
            padding: "16px 20px",
            marginBottom: "20px",
          }}
        >
          <div className="row">
            <div className="form-group mb-0 col-md-4">
              <FormGroup>
                <label className={classes.fieldLabel}>
                  Visit Date <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  type="date"
                  value={visitDate}
                  min={enrollDate}
                  max={moment(new Date()).format("YYYY-MM-DD")}
                  onChange={(e) => setVisitDate(e.target.value)}
                />
                {errors.visitDate && (
                  <span className={classes.error}>{errors.visitDate}</span>
                )}
              </FormGroup>
            </div>
            <div className="form-group mb-0 col-md-4">
              <FormGroup>
                <label className={classes.fieldLabel}>Clinician Name</label>
                <Input
                  type="text"
                  value={clinicianName}
                  onChange={(e) => setClinicianName(e.target.value)}
                  placeholder="Full name of clinician"
                />
              </FormGroup>
            </div>
          </div>
        </Box>

        <form onSubmit={handleSubmit}>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/*  SECTION 1: SYMPTOMS REVIEW                                   */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <FormAccordion panel="symptoms" title="Symptoms Review" index={0} expanded={expanded} onToggle={toggleAccordion}>
            <Typography sx={{ fontSize: "13px", color: "#546e7a", marginBottom: "16px" }}>
              Search and select each symptom the patient is experiencing, then specify the duration.
            </Typography>

            {/* Symptom picker */}
            <div className="row" style={{ marginBottom: "16px" }}>
              <div className="col-md-7">
                <SectionLabel>Select a Symptom to Add</SectionLabel>
                <ReactSelect
                  options={availableSymptomOptions}
                  value={symptomSelect}
                  onChange={handleAddSymptom}
                  placeholder="Search and select a symptom..."
                  isSearchable
                  isClearable
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: "42px",
                      borderColor: "#1565c0",
                      fontSize: "14px",
                    }),
                    placeholder: (base) => ({ ...base, color: "#9e9e9e", fontSize: "13px" }),
                  }}
                />
                <Typography sx={{ fontSize: "11px", color: "#90a4ae", marginTop: "4px" }}>
                  Once selected, the symptom will appear below. You can add as many as needed.
                </Typography>
              </div>
            </div>

            {/* Added symptoms list */}
            {selectedSymptoms.length > 0 && (
              <Box
                sx={{
                  background: "#fff",
                  border: "1px solid #bbdefb",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginBottom: "12px",
                }}
              >
                <Typography sx={{ fontWeight: 600, color: "#1565c0", fontSize: "13px", marginBottom: "12px" }}>
                  Added Symptoms ({selectedSymptoms.length})
                </Typography>
                {selectedSymptoms.map((symptom, idx) => (
                  <Box
                    key={symptom.value}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "8px 12px",
                      marginBottom: "8px",
                      background: idx % 2 === 0 ? "#f8fbff" : "#fff",
                      borderRadius: "6px",
                      border: "1px solid #e3f2fd",
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Chip
                        label={symptom.label}
                        size="small"
                        sx={{
                          background: "#1565c0",
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: "12px",
                        }}
                      />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <label style={{ fontSize: "12px", color: "#546e7a", whiteSpace: "nowrap", margin: 0 }}>
                        Duration (days):
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={symptom.duration}
                        onChange={(e) => handleSymptomDuration(symptom.value, e.target.value)}
                        placeholder="0"
                        style={{ width: "90px", height: "34px", fontSize: "13px" }}
                      />
                    </Box>
                    <Tooltip title="Remove symptom">
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveSymptom(symptom.value)}
                        sx={{ color: "#ef5350" }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ))}
              </Box>
            )}

            {selectedSymptoms.length === 0 && (
              <Box
                sx={{
                  border: "1px dashed #bbdefb",
                  borderRadius: "8px",
                  padding: "20px",
                  textAlign: "center",
                  marginBottom: "12px",
                  background: "#fafcff",
                }}
              >
                <Typography sx={{ color: "#90a4ae", fontSize: "13px" }}>
                  No symptoms added yet. Use the dropdown above to add symptoms.
                </Typography>
              </Box>
            )}

            {/* Other symptom */}
            <div className="row" style={{ marginTop: "8px" }}>
              <div className="col-md-6">
                <SectionLabel>Other Symptoms (specify)</SectionLabel>
                <Input
                  type="text"
                  value={otherSymptom}
                  onChange={(e) => setOtherSymptom(e.target.value)}
                  placeholder="Describe any other symptoms not listed above..."
                />
              </div>
            </div>
          </FormAccordion>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/*  SECTION 2: MEDICAL HISTORY                                   */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <FormAccordion panel="medical" title="Medical History" index={1} expanded={expanded} onToggle={toggleAccordion}>

            {/* TB & Assessments */}
            <SubHeading>TB &amp; Other Assessments</SubHeading>
            <FieldRow>
              <Col size={3}>
                <SectionLabel>Patient Assessed for TB?</SectionLabel>
                <Input type="select" name="assessed_for_tb" value={tbAssessment.assessed_for_tb} onChange={handleTb}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Input>
              </Col>
              <Col size={3}>
                <SectionLabel>TB Status</SectionLabel>
                <Input type="text" name="tb_status" value={tbAssessment.tb_status} onChange={handleTb} placeholder="Enter TB status" />
              </Col>
              <Col size={3}>
                <SectionLabel>Developmental Assessment</SectionLabel>
                <Input type="select" name="developmental_assessment" value={tbAssessment.developmental_assessment} onChange={handleTb}>
                  <option value="">Select</option>
                  <option value="Appropriate">Appropriate</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Retarded">Retarded</option>
                </Input>
              </Col>
              <Col size={3}>
                <SectionLabel>Immunisation Complete for Age</SectionLabel>
                <Input type="select" name="immunisation_complete" value={tbAssessment.immunisation_complete} onChange={handleTb}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Input>
              </Col>
            </FieldRow>
            <FieldRow>
              {patientAge <= 14 && (
                <Col size={3}>
                  <SectionLabel>Mode of Infant Feeding (≤6 months)</SectionLabel>
                  <Input type="select" name="mode_of_infant_feeding" value={tbAssessment.mode_of_infant_feeding} onChange={handleTb}>
                    <option value="">Select</option>
                    <option value="EBF">EBF</option>
                    <option value="EBMS">EBMS</option>
                    <option value="Mixed">Mixed</option>
                  </Input>
                </Col>
              )}
              <Col size={4}>
                <SectionLabel>Known Drug Allergies</SectionLabel>
                <Input type="text" name="known_drug_allergies" value={tbAssessment.known_drug_allergies} onChange={handleTb} placeholder="e.g. Penicillin, Sulfa drugs" />
              </Col>
              <Col size={8}>
                <SectionLabel>Past Medical History (including hospitalisation and surgery)</SectionLabel>
                <Input type="textarea" name="past_medical_history" value={tbAssessment.past_medical_history} onChange={handleTb} rows={2} placeholder="Describe relevant past medical history..." style={{ height: "auto" }} />
              </Col>
            </FieldRow>

            {/* Pregnancy */}
            {isFemale && patientAge > 14 && (
              <>
                <Divider sx={{ my: 2 }} />
                <SubHeading>Pregnancy Information</SubHeading>
                <FieldRow>
                  <Col size={3}>
                    <SectionLabel>Currently Pregnant</SectionLabel>
                    <Input type="select" name="currently_pregnant" value={pregnancy.currently_pregnant} onChange={handlePregnancy}>
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Uncertain">Uncertain</option>
                    </Input>
                  </Col>
                  {pregnancy.currently_pregnant === "Yes" && (
                    <>
                      <Col size={3}>
                        <SectionLabel>Last Menstrual Period</SectionLabel>
                        <Input type="date" name="last_menstrual_period" value={pregnancy.last_menstrual_period} onChange={handlePregnancy} />
                      </Col>
                      <Col size={3}>
                        <SectionLabel>Gestational Age (Weeks)</SectionLabel>
                        <Input type="text" name="gestational_age" value={pregnancy.gestational_age} onChange={handlePregnancy} placeholder="Weeks" />
                      </Col>
                      <Col size={3}>
                        <SectionLabel>Expected Date of Delivery</SectionLabel>
                        <Input type="date" name="expected_date_of_delivery" value={pregnancy.expected_date_of_delivery} onChange={handlePregnancy} />
                      </Col>
                    </>
                  )}
                </FieldRow>
              </>
            )}

            {/* Current Medications */}
            <Divider sx={{ my: 2 }} />
            <SubHeading>Current Medications</SubHeading>
            <Box sx={{ background: "#fff", border: "1px solid #e8f5e9", borderRadius: "8px", padding: "12px 16px" }}>
              <CheckGroup name="none" id="meds_none" label="None" checked={currentMeds.none} onChange={handleMeds} />
              {!currentMeds.none && (
                <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px", mt: 1 }}>
                  <CheckGroup name="art" id="meds_art" label="ART" checked={currentMeds.art} onChange={handleMeds} />
                  <CheckGroup name="ctx" id="meds_ctx" label="CTX" checked={currentMeds.ctx} onChange={handleMeds} />
                  <CheckGroup name="anti_tb_drugs" id="meds_anti_tb" label="Anti-TB Drugs" checked={currentMeds.anti_tb_drugs} onChange={handleMeds} />
                  <div style={{ marginLeft: "8px", display: "inline-block" }}>
                    <Input
                      type="text"
                      name="other_specify"
                      value={currentMeds.other_specify}
                      onChange={handleMeds}
                      placeholder="Other (specify)..."
                      style={{ width: "220px", height: "34px", fontSize: "13px" }}
                    />
                  </div>
                </Box>
              )}
            </Box>

            {/* Patient Disclosure */}
            <Divider sx={{ my: 2 }} />
            <SubHeading>Patient Has Disclosed / Can Disclose Status To</SubHeading>
            <Box sx={{ background: "#fff", border: "1px solid #e8f5e9", borderRadius: "8px", padding: "12px 16px" }}>
              <CheckGroup name="no_one" id="disc_no_one" label="No One" checked={disclosure.no_one} onChange={handleDisclosure} />
              {!disclosure.no_one && (
                <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px", mt: 1 }}>
                  <CheckGroup name="family_member" id="disc_family" label="Family Member" checked={disclosure.family_member} onChange={handleDisclosure} />
                  <CheckGroup name="friend" id="disc_friend" label="Friend" checked={disclosure.friend} onChange={handleDisclosure} />
                  <CheckGroup name="spouse" id="disc_spouse" label="Spouse" checked={disclosure.spouse} onChange={handleDisclosure} />
                  <CheckGroup name="spiritual_leader" id="disc_spiritual" label="Spiritual Leader" checked={disclosure.spiritual_leader} onChange={handleDisclosure} />
                  <div style={{ marginLeft: "8px", display: "inline-block" }}>
                    <Input
                      type="text"
                      name="others_specify"
                      value={disclosure.others_specify}
                      onChange={handleDisclosure}
                      placeholder="Others (specify)..."
                      style={{ width: "220px", height: "34px", fontSize: "13px" }}
                    />
                  </div>
                </Box>
              )}
            </Box>

            {/* ARV Side Effects */}
            <Divider sx={{ my: 2 }} />
            <SubHeading>Past or Current Medication Side Effects</SubHeading>
            <FieldRow>
              <Col size={3}>
                <SectionLabel>Side Effects Present?</SectionLabel>
                <Input type="select" name="has_side_effects" value={arvSideEffects.has_side_effects} onChange={handleSideEffects}>
                  <option value="">Select</option>
                  <option value="None">None</option>
                  <option value="Yes">Yes</option>
                </Input>
              </Col>
              {arvSideEffects.has_side_effects === "Yes" && (
                <>
                  <Col size={5}>
                    <SectionLabel>Side Effects Detail</SectionLabel>
                    <Input type="textarea" name="side_effects_detail" value={arvSideEffects.side_effects_detail} onChange={handleSideEffects} rows={2} style={{ height: "auto" }} placeholder="Describe side effects..." />
                  </Col>
                  <Col size={4}>
                    <SectionLabel>Specify Medication(s)</SectionLabel>
                    <Input type="text" name="specify_medication" value={arvSideEffects.specify_medication} onChange={handleSideEffects} placeholder="Name the medication(s)" />
                  </Col>
                </>
              )}
            </FieldRow>
          </FormAccordion>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/*  SECTION 3: PREVIOUSLY ARV EXPOSURE                           */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <FormAccordion panel="arv" title="Previously ARV Exposure" index={2} expanded={expanded} onToggle={toggleAccordion}>
            <FieldRow>
              <Col size={3}>
                <SectionLabel>Previous ARV Exposure</SectionLabel>
                <Input type="select" name="previous_arv_exposure" value={arvHistory.previous_arv_exposure} onChange={handleArv}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Input>
              </Col>
            </FieldRow>

            {arvHistory.previous_arv_exposure === "Yes" && (
              <>
                <SubHeading>ARV Exposure Type</SubHeading>
                <Box sx={{ background: "#fff", border: "1px solid #f3e5f5", borderRadius: "8px", padding: "12px 16px", marginBottom: "16px" }}>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    <CheckGroup name="earlier_arv_not_transfer" id="arv_earlier" label="Earlier ARV (not a Transfer-in)" checked={arvHistory.earlier_arv_not_transfer} onChange={handleArv} />
                    <CheckGroup name="prep" id="arv_prep" label="PrEP" checked={arvHistory.prep} onChange={handleArv} />
                    <CheckGroup name="pep" id="arv_pep" label="PEP" checked={arvHistory.pep} onChange={handleArv} />
                    <CheckGroup name="tran" id="arv_tran" label="Transfer-in" checked={arvHistory.tran} onChange={handleArv} />
                  </Box>
                </Box>

                <SubHeading>Facility &amp; Duration</SubHeading>
                <FieldRow>
                  <Col size={4}>
                    <SectionLabel>Name of Facility</SectionLabel>
                    <Input type="text" name="name_of_facility" value={arvHistory.name_of_facility} onChange={handleArv} placeholder="Facility where patient received ARV" />
                  </Col>
                  <Col size={4}>
                    <SectionLabel>Duration of Care From</SectionLabel>
                    <Input type="date" name="duration_of_care_from" value={arvHistory.duration_of_care_from} onChange={handleArv} />
                  </Col>
                  <Col size={4}>
                    <SectionLabel>Duration of Care To</SectionLabel>
                    <Input type="date" name="duration_of_care_to" value={arvHistory.duration_of_care_to} onChange={handleArv} />
                  </Col>
                </FieldRow>
              </>
            )}

            {arvHistory.previous_arv_exposure === "No" && (
              <Box sx={{ padding: "16px", textAlign: "center", color: "#9e9e9e", fontSize: "13px" }}>
                No previous ARV exposure recorded.
              </Box>
            )}
          </FormAccordion>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/*  SECTION 4: PHYSICAL EXAMINATION                              */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <FormAccordion panel="physical" title="Physical Examination" index={3} expanded={expanded} onToggle={toggleAccordion}>

            {/* Vitals */}
            <SubHeading>Vitals</SubHeading>
            <Box
              sx={{
                background: "#fff",
                border: "1px solid #b3e5fc",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "20px",
              }}
            >
              <div className="row">
                <Col size={2}>
                  <SectionLabel>Temp (°C)</SectionLabel>
                  <Input type="text" name="temperature" value={vitals.temperature} onChange={handleVitals} placeholder="°C" />
                </Col>
                <div className="form-group mb-3 col-md-3">
                  <SectionLabel>Blood Pressure (mm/Hg)</SectionLabel>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <Input type="text" name="bp_systolic" value={vitals.bp_systolic} onChange={handleVitals} placeholder="Sys" />
                    <span style={{ color: "#546e7a", fontSize: "18px", fontWeight: 300 }}>/</span>
                    <Input type="text" name="bp_diastolic" value={vitals.bp_diastolic} onChange={handleVitals} placeholder="Dia" />
                  </div>
                </div>
                <Col size={2}>
                  <SectionLabel>Pulse (b/min)</SectionLabel>
                  <Input type="text" name="pulse" value={vitals.pulse} onChange={handleVitals} placeholder="b/min" />
                </Col>
                <Col size={2}>
                  <SectionLabel>Weight (kg)</SectionLabel>
                  <Input type="text" name="weight" value={vitals.weight} onChange={handleVitals} placeholder="kg" />
                </Col>
                <Col size={2}>
                  <SectionLabel>Height (cm)</SectionLabel>
                  <Input type="text" name="height" value={vitals.height} onChange={handleVitals} placeholder="cm" />
                </Col>
                <Col size={2}>
                  <SectionLabel>Head Circumference (cm)</SectionLabel>
                  <Input type="text" name="head_circumference" value={vitals.head_circumference} onChange={handleVitals} placeholder="cm" />
                </Col>
                <Col size={2}>
                  <SectionLabel>Surface Area (cm²)</SectionLabel>
                  <Input type="text" name="surface_area" value={vitals.surface_area} onChange={handleVitals} placeholder="cm²" />
                </Col>
              </div>
            </Box>

            {/* Body Systems */}
            <SubHeading>Body System Examination</SubHeading>
            <Typography sx={{ fontSize: "12px", color: "#78909c", marginBottom: "12px" }}>
              For each system, check <strong>NSF</strong> if there are no significant findings, or select the specific findings observed.
            </Typography>

            <BodySystem label="General Appearance" systemKey="generalAppearance" state={systems.generalAppearance} onChange={handleSystem} />
            <BodySystem label="Head / Eye / ENT" systemKey="headEyeEnt" state={systems.headEyeEnt} onChange={handleSystem} />
            <BodySystem label="Cardiovascular" systemKey="cardiovascular" state={systems.cardiovascular} onChange={handleSystem} />
            <BodySystem
              label="Respiratory"
              systemKey="respiratory"
              state={systems.respiratory}
              onChange={handleSystem}
              extraContent={
                !systems.respiratory.nsf && (
                  <div className="form-group mb-2 col-md-2">
                    <SectionLabel>Rate (breaths/min)</SectionLabel>
                    <Input
                      type="text"
                      value={systems.respiratory.rate || ""}
                      onChange={(e) => handleSystemExtra("respiratory", "rate", e.target.value)}
                      placeholder="b/min"
                    />
                  </div>
                )
              }
            />
            <BodySystem label="Gastrointestinal" systemKey="gastrointestinal" state={systems.gastrointestinal} onChange={handleSystem} />
            <BodySystem
              label="Genitalia"
              systemKey="genitalia"
              state={systems.genitalia}
              onChange={handleSystem}
              extraContent={
                !systems.genitalia.nsf && (
                  <div className="form-group mb-2 col-md-2">
                    <SectionLabel>Tanner Stage</SectionLabel>
                    <Input
                      type="text"
                      value={systems.genitalia.tanner_stage || ""}
                      onChange={(e) => handleSystemExtra("genitalia", "tanner_stage", e.target.value)}
                      placeholder="Stage"
                    />
                  </div>
                )
              }
            />
            {isFemale && (
              <BodySystem label="Breasts / Glands" systemKey="breastGlands" state={systems.breastGlands} onChange={handleSystem} />
            )}
            <BodySystem label="Skin" systemKey="skin" state={systems.skin} onChange={handleSystem} />
            <BodySystem label="Neurological" systemKey="neurological" state={systems.neurological} onChange={handleSystem} />
            <BodySystem label="Mental Status" systemKey="mentalStatus" state={systems.mentalStatus} onChange={handleSystem} />

            {/* Additional Findings */}
            <Divider sx={{ my: 2 }} />
            <div className="row">
              <div className="form-group col-md-12">
                <SectionLabel>Additional and Detailed Findings</SectionLabel>
                <Input
                  type="textarea"
                  value={additionalFindings}
                  onChange={(e) => setAdditionalFindings(e.target.value)}
                  rows={3}
                  placeholder="Record any additional clinical findings here..."
                  style={{ height: "auto" }}
                />
              </div>
            </div>
          </FormAccordion>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/*  SECTION 5: CONFIRMATORY DETAILS                              */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <FormAccordion panel="confirmatory" title="Confirmatory Details" index={4} expanded={expanded} onToggle={toggleAccordion}>

            {/* Assessment */}
            <SubHeading>Assessment</SubHeading>
            <Box sx={{ background: "#fff", border: "1px solid #ffcdd2", borderRadius: "8px", padding: "12px 16px", marginBottom: "16px" }}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                <CheckGroup name="asymptomatic" id="assess_asymptomatic" label="Asymptomatic" checked={assessment.asymptomatic} onChange={handleAssessment} />
                <CheckGroup name="symptomatic" id="assess_symptomatic" label="Symptomatic" checked={assessment.symptomatic} onChange={handleAssessment} />
                <CheckGroup name="aids_defining_illness" id="assess_aids" label="AIDS Defining Illness" checked={assessment.aids_defining_illness} onChange={handleAssessment} />
                <CheckGroup name="opportunistic_infection" id="assess_oi" label="Opportunistic Infection" checked={assessment.opportunistic_infection} onChange={handleAssessment} />
              </Box>
            </Box>

            {/* WHO Stage */}
            <FieldRow>
              <Col size={4}>
                <SectionLabel>
                  WHO Stage <span style={{ color: "red" }}>*</span>
                </SectionLabel>
                <Input type="select" name="who_stage" value={assessment.who_stage} onChange={handleAssessment}>
                  <option value="">Select WHO Stage</option>
                  <option value="Stage 1">Stage 1 — Asymptomatic</option>
                  <option value="Stage 2">Stage 2 — Mild</option>
                  <option value="Stage 3">Stage 3 — Advanced</option>
                  <option value="Stage 4">Stage 4 — Severe</option>
                </Input>
                {errors.who_stage && (
                  <span className={classes.error}>{errors.who_stage}</span>
                )}
              </Col>
            </FieldRow>

            {/* Enrol In */}
            <Divider sx={{ my: 2 }} />
            <SubHeading>Enrol In</SubHeading>
            <Box sx={{ background: "#fff", border: "1px solid #ffcdd2", borderRadius: "8px", padding: "12px 16px", marginBottom: "16px" }}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                <CheckGroup name="enroll_general_followup" id="enroll_general" label="General Medical Follow-up" checked={assessment.enroll_general_followup} onChange={handleAssessment} />
                <CheckGroup name="enroll_arv_therapy" id="enroll_arv" label="ARV Therapy" checked={assessment.enroll_arv_therapy} onChange={handleAssessment} />
                <CheckGroup name="enroll_ahd_management" id="enroll_ahd" label="AHD Management" checked={assessment.enroll_ahd_management} onChange={handleAssessment} />
                <CheckGroup name="enroll_pending_lab_results" id="enroll_pending" label="Pending Lab Results" checked={assessment.enroll_pending_lab_results} onChange={handleAssessment} />
              </Box>
            </Box>

            {/* Plan for ART */}
            <SubHeading>Plan for Antiretroviral Therapy (ART)</SubHeading>
            <Box sx={{ background: "#fff", border: "1px solid #ffcdd2", borderRadius: "8px", padding: "12px 16px", marginBottom: "16px" }}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                <CheckGroup name="plan_art_ongoing_monitoring" id="plan_ongoing" label="Ongoing Monitoring" checked={assessment.plan_art_ongoing_monitoring} onChange={handleAssessment} />
                <CheckGroup name="plan_art_postponed" id="plan_postponed" label="ARV Tx Postponed for Clinical Reasons" checked={assessment.plan_art_postponed} onChange={handleAssessment} />
                <CheckGroup name="plan_art_change_treatment" id="plan_change" label="Change Treatment" checked={assessment.plan_art_change_treatment} onChange={handleAssessment} />
                <CheckGroup name="plan_art_restart" id="plan_restart" label="Restart Treatment" checked={assessment.plan_art_restart} onChange={handleAssessment} />
                <CheckGroup name="plan_art_start_new" id="plan_start_new" label="Start New Treatment" checked={assessment.plan_art_start_new} onChange={handleAssessment} />
              </Box>
            </Box>

            {/* Drugs, Comments, Appointment */}
            <FieldRow>
              <Col size={5}>
                <SectionLabel>Drugs in Regimen</SectionLabel>
                <Input
                  type="textarea"
                  name="drugs_in_regimen"
                  value={assessment.drugs_in_regimen}
                  onChange={handleAssessment}
                  rows={2}
                  placeholder="List drugs in regimen..."
                  style={{ height: "auto" }}
                />
              </Col>
              <Col size={5}>
                <SectionLabel>Additional Comments</SectionLabel>
                <Input
                  type="textarea"
                  name="additional_comments"
                  value={assessment.additional_comments}
                  onChange={handleAssessment}
                  rows={2}
                  placeholder="Any additional comments..."
                  style={{ height: "auto" }}
                />
              </Col>
              <Col size={2}>
                <SectionLabel>Next Appointment Date</SectionLabel>
                <Input
                  type="date"
                  name="next_appointment"
                  value={assessment.next_appointment}
                  onChange={handleAssessment}
                  min={moment(new Date()).format("YYYY-MM-DD")}
                />
              </Col>
            </FieldRow>
          </FormAccordion>

          {/* ── Action Buttons ────────────────────────────────────────────── */}
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
              style={{ backgroundColor: "#78909c", color: "#fff", borderRadius: "6px" }}
              onClick={() =>
                props.setActiveContent({ ...props.activeContent, route: "recent-history" })
              }
              type="button"
            />
            <Button
              content={saving ? "Saving..." : "Save Record"}
              type="submit"
              icon="save"
              labelPosition="right"
              style={{ backgroundColor: "#014d88", color: "#fff", borderRadius: "6px" }}
              disabled={saving}
            />
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default InitializationEvaluationForm;
