import React, { useState } from "react";
import axios from "axios";
import { Input } from "reactstrap";
import * as moment from "moment";
import ReactSelect from "react-select";
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

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const WHO_STAGES = ["Stage 1", "Stage 2", "Stage 3", "Stage 4"];

const TB_STATUS_OPTIONS = [
  { value: "1", label: "1 — No signs or symptoms of TB" },
  { value: "2", label: "2 — Presumptive TB, referred for evaluation" },
  { value: "3", label: "3 — Confirmed TB, on TB treatment" },
  { value: "4", label: "4 — TB treatment completed" },
  { value: "5", label: "5 — Currently on TPT" },
  { value: "6", label: "6 — Currently on IPT / INH prophylaxis" },
];

const CERVICAL_CANCER_OPTIONS = [
  { value: "0", label: "0 — Not screened" },
  { value: "1", label: "1 — Screen negative (normal)" },
  { value: "2", label: "2 — Screen positive (low grade)" },
  { value: "3", label: "3 — Screen positive (high grade)" },
  { value: "4", label: "4 — Suspected cancer" },
  { value: "5", label: "5 — Referred" },
];

const FAMILY_PLANNING_OPTIONS = [
  { value: "0", label: "0 — None" },
  { value: "1", label: "1 — Oral Contraceptives" },
  { value: "2", label: "2 — Injectables" },
  { value: "3", label: "3 — Implant / Norplant" },
  { value: "4", label: "4 — IUD" },
  { value: "5", label: "5 — Male / Female Condom" },
  { value: "6", label: "6 — Male / Female Sterilization" },
  { value: "7", label: "7 — Natural Family Planning" },
  { value: "8", label: "8 — Emergency Contraception" },
  { value: "9", label: "9 — Other" },
];

const DISCLOSURE_STATUS_OPTIONS = [
  { value: "0", label: "0 — Not yet disclosed" },
  { value: "1", label: "1 — Disclosed (full)" },
  { value: "2", label: "2 — Partial disclosure (patient knows they are ill)" },
  { value: "3", label: "3 — Not applicable (adult > 18 years)" },
];

const HEPATITIS_STATUS_OPTIONS = [
  "Negative",
  "Positive (Hepatitis B)",
  "Positive (Hepatitis C)",
  "Positive (Hepatitis B + C)",
  "Not tested",
];

const OI_CONDITIONS = [
  { value: "bacterial_pneumonia",    label: "Bacterial Pneumonia" },
  { value: "candidiasis",            label: "Candidiasis" },
  { value: "cryptococcal_meningitis",label: "Cryptococcal Meningitis" },
  { value: "cryptosporidiosis",      label: "Cryptosporidiosis" },
  { value: "cytomegalovirus",        label: "Cytomegalovirus" },
  { value: "herpes_simplex",         label: "Herpes Simplex" },
  { value: "herpes_zoster",          label: "Herpes Zoster" },
  { value: "hiv_wasting_syndrome",   label: "HIV Wasting Syndrome" },
  { value: "isosporiasis",           label: "Isosporiasis" },
  { value: "kaposi_sarcoma",         label: "Kaposi's Sarcoma" },
  { value: "mac",                    label: "MAC (Mycobacterium Avium Complex)" },
  { value: "molluscum_contagiosum",  label: "Molluscum Contagiosum" },
  { value: "pcp",                    label: "PCP (Pneumocystis Pneumonia)" },
  { value: "peripheral_neuropathy",  label: "Peripheral Neuropathy" },
  { value: "pml",                    label: "Progressive Multifocal Leukoencephalopathy" },
  { value: "pulmonary_tb",           label: "Pulmonary TB" },
  { value: "toxoplasmosis",          label: "Toxoplasmosis" },
  { value: "other",                  label: "Other" },
];

const SIDE_EFFECTS = [
  { value: "anaemia",               label: "Anaemia" },
  { value: "dizziness_confusion",   label: "Dizziness / Confusion" },
  { value: "diarrhoea",             label: "Diarrhoea" },
  { value: "fatigue",               label: "Fatigue" },
  { value: "hepatotoxicity",        label: "Hepatotoxicity" },
  { value: "hypersensitivity",      label: "Hypersensitivity" },
  { value: "jaundice",              label: "Jaundice" },
  { value: "lactic_acidosis",       label: "Lactic Acidosis" },
  { value: "lipoatrophy",           label: "Lipoatrophy" },
  { value: "lipodystrophy",         label: "Lipodystrophy" },
  { value: "nausea_vomiting",       label: "Nausea / Vomiting" },
  { value: "pancreatitis",          label: "Pancreatitis" },
  { value: "peripheral_neuropathy", label: "Peripheral Neuropathy" },
  { value: "rash",                  label: "Rash" },
  { value: "renal_toxicity",        label: "Renal Toxicity" },
  { value: "other",                 label: "Other" },
];

const ARV_REGIMENS = [
  { group: "First Line — Adults", options: [
    { value: "TDF/3TC/DTG",   label: "TDF/3TC/DTG" },
    { value: "TDF/3TC/EFV",   label: "TDF/3TC/EFV" },
    { value: "TDF/3TC/NVP",   label: "TDF/3TC/NVP" },
    { value: "AZT/3TC/DTG",   label: "AZT/3TC/DTG" },
    { value: "AZT/3TC/EFV",   label: "AZT/3TC/EFV" },
    { value: "AZT/3TC/NVP",   label: "AZT/3TC/NVP" },
    { value: "ABC/3TC/DTG",   label: "ABC/3TC/DTG" },
    { value: "ABC/3TC/EFV",   label: "ABC/3TC/EFV" },
    { value: "ABC/3TC/NVP",   label: "ABC/3TC/NVP" },
  ]},
  { group: "Second Line — Adults", options: [
    { value: "TDF/3TC/ATV/r", label: "TDF/3TC/ATV/r" },
    { value: "TDF/3TC/LPV/r", label: "TDF/3TC/LPV/r" },
    { value: "AZT/3TC/ATV/r", label: "AZT/3TC/ATV/r" },
    { value: "AZT/3TC/LPV/r", label: "AZT/3TC/LPV/r" },
    { value: "ABC/3TC/LPV/r", label: "ABC/3TC/LPV/r" },
  ]},
  { group: "Third Line", options: [
    { value: "DRV/r + RAL + others", label: "DRV/r + RAL + others" },
    { value: "Other (specify)",       label: "Other (specify)" },
  ]},
  { group: "Paediatric", options: [
    { value: "ABC/3TC/DTG (Ped)",  label: "ABC/3TC/DTG (Ped)" },
    { value: "ABC/3TC/LPV/r (Ped)",label: "ABC/3TC/LPV/r (Ped)" },
    { value: "AZT/3TC/NVP (Ped)", label: "AZT/3TC/NVP (Ped)" },
    { value: "AZT/3TC/LPV/r (Ped)",label: "AZT/3TC/LPV/r (Ped)" },
    { value: "TDF/3TC/DTG (Ped)",  label: "TDF/3TC/DTG (Ped)" },
  ]},
];

const ARV_REGIMEN_FLAT = ARV_REGIMENS.flatMap((g) => g.options);

const ADHERENCE_OPTIONS = [
  { value: "G", label: "G — Good (≥ 95%)" },
  { value: "F", label: "F — Fair (85 – 94%)" },
  { value: "P", label: "P — Poor (< 85%)" },
];

const TPT_CODES = [
  { value: "6H",   label: "6H — Isoniazid (6 months)" },
  { value: "3HP",  label: "3HP — Isoniazid and Rifapentine" },
  { value: "3HR",  label: "3HR — Isoniazid and Rifampicin" },
  { value: "QTIP", label: "QTIP — CTX/INH/B6 FDC Fixed Dose" },
];

const VL_INDICATION_OPTIONS = [
  { value: "1", label: "1 — Routine (Baseline)" },
  { value: "2", label: "2 — Routine (6 months)" },
  { value: "3", label: "3 — Routine (12 months)" },
  { value: "4", label: "4 — Routine (24 months / annual)" },
  { value: "5", label: "5 — High Viral Load follow-up" },
  { value: "6", label: "6 — Clinical / Immunological failure" },
  { value: "7", label: "7 — PMTCT" },
  { value: "8", label: "8 — Other" },
];

// Single system color — matches #014d88 used throughout the application
const ACCORDION_STYLES = [
  { bg: "#014d88" },
  { bg: "#014d88" },
  { bg: "#014d88" },
  { bg: "#014d88" },
  { bg: "#014d88" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components — ALL at module scope (never inside a component)
// ─────────────────────────────────────────────────────────────────────────────

const useStyles = makeStyles((theme) => ({
  root: {
    "& .form-control": { borderRadius: "0.25rem", height: "41px" },
    "& select": { "-webkit-appearance": "listbox !important" },
    "& label": { fontSize: "14px", color: "#014d88", fontWeight: "bold" },
    "& textarea.form-control": { height: "auto" },
  },
  button: { margin: theme.spacing(1) },
  error:  { color: "#f85032", fontSize: "11px" },
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
  <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", marginRight: "16px", marginBottom: "8px" }}>
    <input
      type="checkbox"
      name={name}
      id={id || name}
      checked={!!checked}
      onChange={onChange}
      style={{ width: "15px", height: "15px", margin: 0, padding: 0, flexShrink: 0, cursor: "pointer", accentColor: "#014d88", position: "relative", top: 0 }}
    />
    <label
      htmlFor={id || name}
      style={{ margin: 0, padding: 0, cursor: "pointer", fontSize: "13px", color: "#333", fontWeight: "500", lineHeight: 1, userSelect: "none" }}
    >
      {label}
    </label>
  </div>
);

const SubHeading = ({ children }) => (
  <div style={{ borderLeft: "3px solid #014d88", paddingLeft: "10px", marginBottom: "12px", marginTop: "16px", color: "#014d88", fontWeight: "700", fontSize: "14px" }}>
    {children}
  </div>
);

const MultiSelect = ({ options, value, onChange, placeholder }) => (
  <ReactSelect
    isMulti
    options={options}
    value={value}
    onChange={onChange}
    placeholder={placeholder || "Select..."}
    closeMenuOnSelect={false}
    styles={{
      control: (base) => ({ ...base, minHeight: "38px", fontSize: "13px" }),
      multiValue: (base) => ({ ...base, background: "#e3f2fd" }),
      placeholder: (base) => ({ ...base, fontSize: "13px", color: "#9e9e9e" }),
    }}
  />
);

// FormAccordion — module scope only
const FormAccordion = ({ panel, title, children, expanded, onToggle }) => {
  const isOpen = expanded.includes(panel);
  return (
    <Accordion
      expanded={isOpen}
      onChange={() => onToggle(panel)}
      sx={{
        marginBottom: "12px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        borderRadius: "4px !important",
        "&:before": { display: "none" },
        border: "1px solid #014d88",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
        sx={{
          backgroundColor: "#014d88",
          borderRadius: isOpen ? "4px 4px 0 0" : "4px",
          minHeight: "45px",
          "& .MuiAccordionSummary-content": { margin: "0" },
        }}
      >
        <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "14px" }}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: "20px 24px", background: "#fff" }}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

const CareCardFollowUpForm = (props) => {
  const classes = useStyles();
  const isFemale = ["female", "FEMALE", "Female"].includes(props.patientObj?.sex);

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [expanded, setExpanded] = useState(["visit", "vitals", "screening", "medications", "lab"]);

  const toggleAccordion = (panel) => {
    setExpanded((prev) =>
      prev.includes(panel) ? prev.filter((p) => p !== panel) : [...prev, panel]
    );
  };

  // ── Section 1: Visit Information ────────────────────────────────────────
  const [visitInfo, setVisitInfo] = useState({
    visit_date: "",
    duration_on_art_months: "",
    clinician_name: "",
  });
  const handleVisit = (e) => {
    const { name, value } = e.target;
    setVisitInfo((prev) => ({ ...prev, [name]: value }));
  };

  // ── Section 2: Vitals & Clinical Status ─────────────────────────────────
  const [vitals, setVitals] = useState({
    height_cm: "",
    weight_kg: "",
    bmi_muac: "",
    bp_systolic: "",
    bp_diastolic: "",
    pregnancy_breastfeeding_status: "",
    family_planning: "",
  });
  const handleVitals = (e) => {
    const { name, value } = e.target;
    setVitals((prev) => ({ ...prev, [name]: value }));
  };

  const [clinical, setClinical] = useState({
    who_stage: "",
    tb_status: "",
    disclosure_status: "",
    hepatitis_status: "",
    oral_problems: "",
  });
  const handleClinical = (e) => {
    const { name, value } = e.target;
    setClinical((prev) => ({ ...prev, [name]: value }));
  };

  // ── Section 3: Screening & Conditions ───────────────────────────────────
  const [cervical_cancer_screening, setCervicalCancer] = useState("");
  const [oi_conditions, setOiConditions] = useState([]);
  const [noted_side_effects, setSideEffects] = useState([]);

  // ── Section 4: Medications ───────────────────────────────────────────────
  const [arv, setArv] = useState({
    regimen: "",
    adherence: "",
    dose: "",
  });
  const handleArv = (e) => {
    const { name, value } = e.target;
    setArv((prev) => ({ ...prev, [name]: value }));
  };

  const [ctx, setCtx] = useState({
    medication: "",
    dose: "",
    adherence: "",
  });
  const handleCtx = (e) => {
    const { name, value } = e.target;
    setCtx((prev) => ({ ...prev, [name]: value }));
  };

  const [tpt, setTpt] = useState({
    code: "",
    dose: "",
    start_date: "",
    completion_date: "",
  });
  const handleTpt = (e) => {
    const { name, value } = e.target;
    setTpt((prev) => ({ ...prev, [name]: value }));
  };

  const [otherDrugs, setOtherDrugs] = useState("");

  // ── Section 5: Lab Results & Follow-up ──────────────────────────────────
  const [lab, setLab] = useState({
    cd4_count: "",
    cd4_date: "",
    viral_load_result: "",
    viral_load_date: "",
    viral_load_indication: "",
    eac_1st_date: "",
    eac_2nd_date: "",
    eac_3rd_date: "",
    rbs: "",
    other_tests_done: "",
  });
  const handleLab = (e) => {
    const { name, value } = e.target;
    setLab((prev) => ({ ...prev, [name]: value }));
  };

  const [followUp, setFollowUp] = useState({
    current_on_medication: "",
    next_appointment_date: "",
  });
  const handleFollowUp = (e) => {
    const { name, value } = e.target;
    setFollowUp((prev) => ({ ...prev, [name]: value }));
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const temp = {};
    if (!visitInfo.visit_date) temp.visit_date = "Visit date is required";
    if (!arv.regimen)          temp.arv_regimen = "ARV regimen is required";
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
        dateOfObservation: visitInfo.visit_date,
        personId: props.patientObj.id,
        type: "Care Card Follow-Up Visit",
        data: {
          visitInfo,
          vitals,
          clinical: {
            ...clinical,
            cervical_cancer_screening: isFemale ? cervical_cancer_screening : null,
            oi_conditions,
            noted_side_effects,
          },
          arv,
          cotrimoxazole: ctx,
          tpt,
          otherDrugs,
          lab,
          followUp,
        },
      };
      await axios.post(`${baseUrl}observation`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Care Card Follow-Up Visit saved successfully");
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
        <Box sx={{ backgroundColor: "#014d88", padding: "14px 20px", marginBottom: "20px" }}>
          <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>
            Care Card — Follow-Up Visit
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/*  SECTION 1 — VISIT INFORMATION                               */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <FormAccordion panel="visit" title="Visit Information" index={0} expanded={expanded} onToggle={toggleAccordion}>
            <FieldRow>
              <Col size={3}>
                <SectionLabel>Visit Date <span style={{ color: "red" }}>*</span></SectionLabel>
                <Input
                  type="date"
                  name="visit_date"
                  value={visitInfo.visit_date}
                  max={moment(new Date()).format("YYYY-MM-DD")}
                  onChange={handleVisit}
                />
                {errors.visit_date && <span className={classes.error}>{errors.visit_date}</span>}
              </Col>
              <Col size={3}>
                <SectionLabel>Duration on ART (Months)</SectionLabel>
                <Input
                  type="number"
                  name="duration_on_art_months"
                  value={visitInfo.duration_on_art_months}
                  onChange={handleVisit}
                  placeholder="e.g. 6"
                  min="0"
                />
              </Col>
              <Col size={4}>
                <SectionLabel>Clinician Name</SectionLabel>
                <Input
                  type="text"
                  name="clinician_name"
                  value={visitInfo.clinician_name}
                  onChange={handleVisit}
                  placeholder="Full name of clinician"
                />
              </Col>
            </FieldRow>
          </FormAccordion>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/*  SECTION 2 — VITALS & CLINICAL STATUS                        */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <FormAccordion panel="vitals" title="Vitals & Clinical Status" index={1} expanded={expanded} onToggle={toggleAccordion}>

            <SubHeading>Vitals</SubHeading>
            <Box sx={{ background: "#fff", border: "1px solid #014d88", borderRadius: "4px", padding: "16px", marginBottom: "16px" }}>
              <div className="row">
                <Col size={2}>
                  <SectionLabel>Height (cm)</SectionLabel>
                  <Input type="text" name="height_cm" value={vitals.height_cm} onChange={handleVitals} placeholder="cm" />
                </Col>
                <Col size={2}>
                  <SectionLabel>Weight (kg)</SectionLabel>
                  <Input type="text" name="weight_kg" value={vitals.weight_kg} onChange={handleVitals} placeholder="kg" />
                </Col>
                <Col size={2}>
                  <SectionLabel>BMI / MUAC</SectionLabel>
                  <Input type="text" name="bmi_muac" value={vitals.bmi_muac} onChange={handleVitals} placeholder="Value" />
                </Col>
                <div className="form-group mb-3 col-md-3">
                  <SectionLabel>Blood Pressure (mmHg)</SectionLabel>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <Input type="text" name="bp_systolic" value={vitals.bp_systolic} onChange={handleVitals} placeholder="Sys" />
                    <span style={{ color: "#546e7a", fontSize: "18px", fontWeight: 300 }}>/</span>
                    <Input type="text" name="bp_diastolic" value={vitals.bp_diastolic} onChange={handleVitals} placeholder="Dia" />
                  </div>
                </div>
                {isFemale && (
                  <>
                    <Col size={2}>
                      <SectionLabel>Pregnancy / Breastfeeding</SectionLabel>
                      <Input type="select" name="pregnancy_breastfeeding_status" value={vitals.pregnancy_breastfeeding_status} onChange={handleVitals}>
                        <option value="">Select</option>
                        <option value="P">P — Pregnant</option>
                        <option value="B">B — Breastfeeding</option>
                        <option value="N">N — Not Applicable</option>
                      </Input>
                    </Col>
                    <Col size={3}>
                      <SectionLabel>Family Planning</SectionLabel>
                      <Input type="select" name="family_planning" value={vitals.family_planning} onChange={handleVitals}>
                        <option value="">Select</option>
                        {FAMILY_PLANNING_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </Input>
                    </Col>
                  </>
                )}
              </div>
            </Box>

            <SubHeading>Clinical Status</SubHeading>
            <FieldRow>
              <Col size={3}>
                <SectionLabel>WHO Clinical Stage</SectionLabel>
                <Input type="select" name="who_stage" value={clinical.who_stage} onChange={handleClinical}>
                  <option value="">Select</option>
                  {WHO_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                </Input>
              </Col>
              <Col size={3}>
                <SectionLabel>TB Status</SectionLabel>
                <Input type="select" name="tb_status" value={clinical.tb_status} onChange={handleClinical}>
                  <option value="">Select</option>
                  {TB_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </Input>
              </Col>
              <Col size={3}>
                <SectionLabel>Disclosure Status</SectionLabel>
                <Input type="select" name="disclosure_status" value={clinical.disclosure_status} onChange={handleClinical}>
                  <option value="">Select</option>
                  {DISCLOSURE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </Input>
              </Col>
              <Col size={3}>
                <SectionLabel>Hepatitis Status</SectionLabel>
                <Input type="select" name="hepatitis_status" value={clinical.hepatitis_status} onChange={handleClinical}>
                  <option value="">Select</option>
                  {HEPATITIS_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </Input>
              </Col>
            </FieldRow>
            <FieldRow>
              <Col size={6}>
                <SectionLabel>Oral Problems</SectionLabel>
                <Input
                  type="text"
                  name="oral_problems"
                  value={clinical.oral_problems}
                  onChange={handleClinical}
                  placeholder="e.g. Oral candidiasis, ulcers, gingivitis..."
                />
              </Col>
            </FieldRow>
          </FormAccordion>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/*  SECTION 3 — SCREENING & CONDITIONS                          */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <FormAccordion panel="screening" title="Screening & Conditions" index={2} expanded={expanded} onToggle={toggleAccordion}>

            {isFemale && (
              <>
                <SubHeading>Cervical Cancer Screening</SubHeading>
                <FieldRow>
                  <Col size={4}>
                    <SectionLabel>Screening Result</SectionLabel>
                    <Input
                      type="select"
                      value={cervical_cancer_screening}
                      onChange={(e) => setCervicalCancer(e.target.value)}
                    >
                      <option value="">Select</option>
                      {CERVICAL_CANCER_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </Input>
                  </Col>
                </FieldRow>
                <Divider sx={{ my: 2 }} />
              </>
            )}

            <SubHeading>Opportunistic Infections / AIDS-Defining Conditions</SubHeading>
            <FieldRow>
              <Col size={12}>
                <SectionLabel>OI / AID Conditions Present</SectionLabel>
                <MultiSelect
                  options={OI_CONDITIONS}
                  value={oi_conditions}
                  onChange={setOiConditions}
                  placeholder="Search and select conditions..."
                />
              </Col>
            </FieldRow>

            <Divider sx={{ my: 2 }} />
            <SubHeading>Noted Side Effects</SubHeading>
            <FieldRow>
              <Col size={12}>
                <SectionLabel>Drug Side Effects Noted</SectionLabel>
                <MultiSelect
                  options={SIDE_EFFECTS}
                  value={noted_side_effects}
                  onChange={setSideEffects}
                  placeholder="Search and select side effects..."
                />
              </Col>
            </FieldRow>
          </FormAccordion>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/*  SECTION 4 — MEDICATIONS                                     */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <FormAccordion panel="medications" title="Medications" index={3} expanded={expanded} onToggle={toggleAccordion}>

            {/* ARV */}
            <SubHeading>ARV Drugs</SubHeading>
            <Box sx={{ background: "#fff", border: "1px solid #014d88", borderRadius: "4px", padding: "14px 16px", marginBottom: "16px" }}>
              <FieldRow>
                <Col size={4}>
                  <SectionLabel>Regimen <span style={{ color: "red" }}>*</span></SectionLabel>
                  <Input type="select" name="regimen" value={arv.regimen} onChange={handleArv}>
                    <option value="">Select regimen</option>
                    {ARV_REGIMENS.map((group) => (
                      <optgroup key={group.group} label={group.group}>
                        {group.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </optgroup>
                    ))}
                  </Input>
                  {errors.arv_regimen && <span className={classes.error}>{errors.arv_regimen}</span>}
                </Col>
                <Col size={3}>
                  <SectionLabel>Dose</SectionLabel>
                  <Input type="text" name="dose" value={arv.dose} onChange={handleArv} placeholder="e.g. 1 tablet daily" />
                </Col>
                <Col size={3}>
                  <SectionLabel>Adherence</SectionLabel>
                  <Input type="select" name="adherence" value={arv.adherence} onChange={handleArv}>
                    <option value="">Select</option>
                    {ADHERENCE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </Input>
                </Col>
              </FieldRow>
            </Box>

            {/* Cotrimoxazole */}
            <SubHeading>Cotrimoxazole (CTX)</SubHeading>
            <Box sx={{ background: "#fff", border: "1px solid #014d88", borderRadius: "4px", padding: "14px 16px", marginBottom: "16px" }}>
              <FieldRow>
                <Col size={4}>
                  <SectionLabel>Medication</SectionLabel>
                  <Input type="text" name="medication" value={ctx.medication} onChange={handleCtx} placeholder="e.g. Cotrimoxazole 960mg" />
                </Col>
                <Col size={3}>
                  <SectionLabel>Dose</SectionLabel>
                  <Input type="text" name="dose" value={ctx.dose} onChange={handleCtx} placeholder="e.g. 1 tablet daily" />
                </Col>
                <Col size={3}>
                  <SectionLabel>Adherence</SectionLabel>
                  <Input type="select" name="adherence" value={ctx.adherence} onChange={handleCtx}>
                    <option value="">Select</option>
                    {ADHERENCE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </Input>
                </Col>
              </FieldRow>
            </Box>

            {/* TB Preventive Therapy */}
            <SubHeading>TB Preventive Therapy (TPT)</SubHeading>
            <Box sx={{ background: "#fff", border: "1px solid #014d88", borderRadius: "4px", padding: "14px 16px", marginBottom: "16px" }}>
              <FieldRow>
                <Col size={3}>
                  <SectionLabel>TPT Medication (Code)</SectionLabel>
                  <Input type="select" name="code" value={tpt.code} onChange={handleTpt}>
                    <option value="">Select</option>
                    {TPT_CODES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </Input>
                </Col>
                <Col size={2}>
                  <SectionLabel>Dose</SectionLabel>
                  <Input type="text" name="dose" value={tpt.dose} onChange={handleTpt} placeholder="e.g. 300mg" />
                </Col>
                <Col size={3}>
                  <SectionLabel>Start Date</SectionLabel>
                  <Input type="date" name="start_date" value={tpt.start_date} onChange={handleTpt} />
                </Col>
                <Col size={3}>
                  <SectionLabel>Completion Date</SectionLabel>
                  <Input type="date" name="completion_date" value={tpt.completion_date} onChange={handleTpt} />
                </Col>
              </FieldRow>
            </Box>

            {/* Other Drugs */}
            <SubHeading>Other Drugs Prescribed</SubHeading>
            <FieldRow>
              <Col size={10}>
                <SectionLabel>Other Medications</SectionLabel>
                <Input
                  type="textarea"
                  value={otherDrugs}
                  onChange={(e) => setOtherDrugs(e.target.value)}
                  rows={2}
                  placeholder="List any other drugs prescribed at this visit..."
                  style={{ height: "auto" }}
                />
              </Col>
            </FieldRow>
          </FormAccordion>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/*  SECTION 5 — LAB RESULTS & FOLLOW-UP                         */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <FormAccordion panel="lab" title="Lab Results & Follow-up" index={4} expanded={expanded} onToggle={toggleAccordion}>

            {/* CD4 */}
            <SubHeading>CD4 Count</SubHeading>
            <Box sx={{ background: "#fff", border: "1px solid #014d88", borderRadius: "4px", padding: "14px 16px", marginBottom: "16px" }}>
              <FieldRow>
                <Col size={3}>
                  <SectionLabel>CD4 Count (cells/mm³)</SectionLabel>
                  <Input type="text" name="cd4_count" value={lab.cd4_count} onChange={handleLab} placeholder="cells/mm³" />
                </Col>
                <Col size={3}>
                  <SectionLabel>CD4 Date</SectionLabel>
                  <Input type="date" name="cd4_date" value={lab.cd4_date} onChange={handleLab} />
                </Col>
              </FieldRow>
            </Box>

            {/* Viral Load */}
            <SubHeading>Viral Load</SubHeading>
            <Box sx={{ background: "#fff", border: "1px solid #014d88", borderRadius: "4px", padding: "14px 16px", marginBottom: "16px" }}>
              <FieldRow>
                <Col size={3}>
                  <SectionLabel>Viral Load Result (copies/mL)</SectionLabel>
                  <Input type="text" name="viral_load_result" value={lab.viral_load_result} onChange={handleLab} placeholder="e.g. 200 or Not Detected" />
                </Col>
                <Col size={3}>
                  <SectionLabel>Viral Load Date</SectionLabel>
                  <Input type="date" name="viral_load_date" value={lab.viral_load_date} onChange={handleLab} />
                </Col>
                <Col size={4}>
                  <SectionLabel>Indication for Viral Load Test</SectionLabel>
                  <Input type="select" name="viral_load_indication" value={lab.viral_load_indication} onChange={handleLab}>
                    <option value="">Select</option>
                    {VL_INDICATION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </Input>
                </Col>
              </FieldRow>

              {/* EAC dates — shown when VL > 1000 is likely (always show as optional) */}
              <Divider sx={{ my: 1 }} />
              <Typography sx={{ fontSize: "12px", color: "#546e7a", marginBottom: "10px" }}>
                Enhanced Adherence Counseling (EAC) — record dates if conducted following a high viral load result
              </Typography>
              <FieldRow>
                <Col size={3}>
                  <SectionLabel>1st EAC Date</SectionLabel>
                  <Input type="date" name="eac_1st_date" value={lab.eac_1st_date} onChange={handleLab} />
                </Col>
                <Col size={3}>
                  <SectionLabel>2nd EAC Date</SectionLabel>
                  <Input type="date" name="eac_2nd_date" value={lab.eac_2nd_date} onChange={handleLab} />
                </Col>
                <Col size={3}>
                  <SectionLabel>3rd EAC Date</SectionLabel>
                  <Input type="date" name="eac_3rd_date" value={lab.eac_3rd_date} onChange={handleLab} />
                </Col>
              </FieldRow>
            </Box>

            {/* RBS & Other Tests */}
            <SubHeading>Other Lab Tests</SubHeading>
            <FieldRow>
              <Col size={3}>
                <SectionLabel>RBS — Random Blood Sugar (mmol/L)</SectionLabel>
                <Input type="text" name="rbs" value={lab.rbs} onChange={handleLab} placeholder="mmol/L" />
              </Col>
              <Col size={7}>
                <SectionLabel>Other Tests Done</SectionLabel>
                <Input
                  type="text"
                  name="other_tests_done"
                  value={lab.other_tests_done}
                  onChange={handleLab}
                  placeholder="e.g. Hepatitis B surface antigen, Creatinine..."
                />
              </Col>
            </FieldRow>

            {/* Follow-up */}
            <Divider sx={{ my: 2 }} />
            <SubHeading>Follow-up</SubHeading>
            <FieldRow>
              <Col size={3}>
                <SectionLabel>Currently on Medication?</SectionLabel>
                <Input type="select" name="current_on_medication" value={followUp.current_on_medication} onChange={handleFollowUp}>
                  <option value="">Select</option>
                  <option value="Y">Y — Yes</option>
                  <option value="N">N — No</option>
                </Input>
              </Col>
              <Col size={3}>
                <SectionLabel>Next Appointment Date</SectionLabel>
                <Input
                  type="date"
                  name="next_appointment_date"
                  value={followUp.next_appointment_date}
                  min={moment(new Date()).format("YYYY-MM-DD")}
                  onChange={handleFollowUp}
                />
              </Col>
            </FieldRow>
          </FormAccordion>

          {/* ── Action Buttons ────────────────────────────────────────────── */}
          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", paddingTop: "16px", borderTop: "1px solid #e0e0e0", marginTop: "8px" }}>
            <MatButton
              variant="contained"
              className={classes.button}
              startIcon={<CancelIcon style={{ color: "#fff" }} />}
              style={{ backgroundColor: "#992E62" }}
              onClick={() => props.setActiveContent({ ...props.activeContent, route: "recent-history" })}
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
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CareCardFollowUpForm;
