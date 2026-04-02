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
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ScaleIcon from "@mui/icons-material/Scale";
import AirIcon from "@mui/icons-material/Air";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent } from "@material-ui/core";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { token, url as baseUrl } from "../../../../api";
import MatButton from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import EditIcon from "@material-ui/icons/Edit";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
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

// WHO Stage Clinical Criteria Options - these are hardcoded on the frontend
// Each WHO stage code maps to an array of available clinical criteria
const WHO_STAGE_CRITERIA_OPTIONS = {
  "WHO_STAGING_CRITERIA_STAGE_1": [
    "Asymptomatic",
    "Persistent Generalized Lymphadenopathy",
  ],
  "WHO_STAGING_CRITERIA_STAGE_2": [
    "Moderate Unexplained Weight Loss (<10% of presumed or measured body weight)",
    "Recurrent Respiratory Tract Infections (sinusitis, tonsillitis, otitis media, pharyngitis)",
    "Herpes Zoster",
    "Angular Cheilitis",
    "Recurrent Oral Ulceration",
    "Papular Pruritic Eruptions",
    "Seborrheic Dermatitis",
    "Fungal Nail Infections",
  ],
  "WHO_STAGING_CRITERIA_STAGE_3": [
    "Weight loss greater than 10% of body weight",
    "Unexplained Chronic Diarrhea less than 1 month",
    "Oral Candidiasis",
    "TB, Pulmonary (within previous year)",
    "Severe Bacterial Infections",
    "Performance scale: 3 bedridden less than 50%",
    "Unexplained Prolonged Fever",
    "Oral Hairy Leukoplakia",
    "Acute Necrotizing Ulcerative Stomatitis, Gingivitis or Periodontitis",
    "Unexplained Anemia (<8 g/dl), neutropenia, and/or chronic thrombocytopenia",
  ],
  "WHO_STAGING_CRITERIA_STAGE_4": [
    "HIV Wasting Syndrome",
    "Pneumocystis Pneumonia",
    "Recurrent Severe Bacterial Pneumonia",
    "Chronic Herpes Simplex Infection (orolabial, genital or anorectal >1 month)",
    "Esophageal Candidiasis (or candidiasis of trachea, bronchi or lungs)",
    "Extrapulmonary Tuberculosis",
    "Kaposi Sarcoma",
    "Cytomegalovirus Infection (retinitis or infection of other organs)",
    "CNS Toxoplasmosis",
    "HIV Encephalopathy",
    "Extrapulmonary Cryptococcosis including Meningitis",
    "Disseminated Non-tuberculosis Mycobacterial Infection",
    "Progressive Multifocal Leukoencephalopathy",
    "Chronic Cryptosporidiosis",
    "Chronic Isosporiasis",
    "Disseminated Mycosis (extrapulmonary histoplasmosis, coccidioidomycosis)",
    "Recurrent Septicemia (including non-typhoidal Salmonella)",
    "Lymphoma (cerebral or B-cell non-Hodgkin)",
    "Invasive Cervical Carcinoma",
    "Atypical Disseminated Leishmaniasis",
    "Symptomatic HIV-associated Nephropathy",
    "Symptomatic HIV-associated Cardiomyopathy",
  ],
};

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
    { value: "tanner_stage", label: "Tanner Stage" },
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
  button: { margin: theme.spacing(1) },
  fieldLabel: {
    fontSize: "13px",
    color: "#014d88",
    fontWeight: "600",
    marginBottom: "4px",
    display: "block",
  },
  fieldValue: {
    fontSize: "14px",
    color: "#333",
    padding: "10px 12px",
    background: "#f5f9ff",
    borderRadius: "4px",
    border: "1px solid #e0e0e0",
    minHeight: "41px",
    display: "flex",
    alignItems: "center",
  },
}));

const ACCORDION_STYLES = [
  { bg: "#014d88" },
  { bg: "#014d88" },
  { bg: "#014d88" },
  { bg: "#014d88" },
  { bg: "#014d88" },
];


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

const Col = ({ size = 6, children }) => (
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
    marginTop: "0",
    color: "#014d88",
    fontWeight: "700",
    fontSize: "14px",
  }}>
    {children}
  </div>
);

// TransferList Component for WHO Stage Criteria Selection
const TransferList = ({ availableItems, selectedItems, onTransfer, stageName }) => {
  const moveToSelected = (item) => {
    onTransfer([...selectedItems, item]);
  };

  const moveToAvailable = (item) => {
    onTransfer(selectedItems.filter((i) => i !== item));
  };

  const moveAllToSelected = () => {
    onTransfer([...availableItems]);
  };

  const moveAllToAvailable = () => {
    onTransfer([]);
  };

  const unselectedItems = availableItems.filter((item) => !selectedItems.includes(item));

  return (
    <Box sx={{ marginTop: "16px" }}>
      <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#546e7a", marginBottom: "12px" }}>
        {stageName} options
      </Typography>
      <Box sx={{ display: "flex", gap: "12px", alignItems: "center" }}>
        {/* Available Items List */}
        <Box
          sx={{
            flex: 1,
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            minHeight: "200px",
            maxHeight: "300px",
            overflowY: "auto",
            padding: "12px",
            background: "#fafafa",
          }}
        >
          {unselectedItems.length === 0 ? (
            <Typography sx={{ fontSize: "12px", color: "#9e9e9e", fontStyle: "italic", textAlign: "center", marginTop: "80px" }}>
              All options selected
            </Typography>
          ) : (
            unselectedItems.map((item, idx) => (
              <Box
                key={idx}
                onClick={() => moveToSelected(item)}
                sx={{
                  padding: "8px 10px",
                  marginBottom: "6px",
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "13px",
                  "&:hover": {
                    background: "#e3f2fd",
                    borderColor: "#014d88",
                  },
                }}
              >
                {item}
              </Box>
            ))
          )}
        </Box>

        {/* Transfer Buttons */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <Tooltip title="Move all to selected">
            <IconButton
              size="small"
              onClick={moveAllToSelected}
              disabled={unselectedItems.length === 0}
              sx={{
                border: "1px solid #014d88",
                borderRadius: "4px",
                color: "#014d88",
                "&:disabled": { borderColor: "#ddd", color: "#ddd" },
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: "bold" }}>≫</span>
            </IconButton>
          </Tooltip>
          <Tooltip title="Move all to available">
            <IconButton
              size="small"
              onClick={moveAllToAvailable}
              disabled={selectedItems.length === 0}
              sx={{
                border: "1px solid #014d88",
                borderRadius: "4px",
                color: "#014d88",
                "&:disabled": { borderColor: "#ddd", color: "#ddd" },
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: "bold" }}>≪</span>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Selected Items List */}
        <Box
          sx={{
            flex: 1,
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            minHeight: "200px",
            maxHeight: "300px",
            overflowY: "auto",
            padding: "12px",
            background: "#fafafa",
          }}
        >
          {selectedItems.length === 0 ? (
            <Typography sx={{ fontSize: "12px", color: "#9e9e9e", fontStyle: "italic", textAlign: "center", marginTop: "80px" }}>
              No options selected
            </Typography>
          ) : (
            selectedItems.map((item, idx) => (
              <Box
                key={idx}
                onClick={() => moveToAvailable(item)}
                sx={{
                  padding: "8px 10px",
                  marginBottom: "6px",
                  background: "#e3f2fd",
                  border: "1px solid #014d88",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "13px",
                  "&:hover": {
                    background: "#fff",
                    borderColor: "#ddd",
                  },
                }}
              >
                {item}
              </Box>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

// FormAccordion MUST live outside the main component so React never treats it
// as a new component type on re-render (which would unmount all inputs).
const FormAccordion = ({ panel, title, index, children, expanded, onToggle }) => {
  const style = ACCORDION_STYLES[index] || ACCORDION_STYLES[0];
  const isOpen = expanded.includes(panel);
  return (
    <Accordion
      expanded={isOpen}
      onChange={() => onToggle(panel)}
      disableGutters
      sx={{
        marginBottom: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        borderRadius: "8px !important",
        "&:before": { display: "none !important" },
        border: "1px solid #014d88",
        overflow: "visible",
        position: "relative",
        zIndex: 1,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
        aria-controls={`${panel}-content`}
        id={`${panel}-header`}
        sx={{
          backgroundColor: "#014d88 !important",
          borderRadius: isOpen ? "8px 8px 0 0" : "8px",
          minHeight: "52px !important",
          height: "auto !important",
          padding: "0 16px !important",
          "& .MuiAccordionSummary-content": {
            margin: "16px 0 !important",
            display: "flex !important",
            alignItems: "center !important",
          },
          "&.Mui-expanded": {
            minHeight: "52px !important",
          },
          display: "flex !important",
          alignItems: "center !important",
          visibility: "visible !important",
          opacity: "1 !important",
          position: "sticky !important",
          top: "0",
          zIndex: 10,
        }}
      >
        <Typography sx={{
          color: "#fff !important",
          fontWeight: "700 !important",
          fontSize: "15px !important",
          letterSpacing: "0.3px",
          visibility: "visible !important",
          display: "block !important",
        }}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: "12px 24px", background: "#fff" }}>
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
      ...(state.tannerStage !== undefined ? { tannerStage: "" } : {}),
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
          <div className={`form-group mb-2 col-md-${extraContent ? "6" : (systemKey === "genitalia" && !state.findings?.some(f => f.value === "tanner_stage") ? "12" : "8")}`}>
            <SectionLabel>Findings </SectionLabel>
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
          {/* Show Other field for all systems except Genitalia, or for Genitalia only when Tanner Stage is selected */}
          {(systemKey !== "genitalia" || state.findings?.some(f => f.value === "tanner_stage")) && (
            <div className="form-group mb-2 col-md-4">
              <SectionLabel>{systemKey === "genitalia" && state.findings?.some(f => f.value === "tanner_stage") ? "Tanner Stage (specify)" : "Other (specify)"}</SectionLabel>
              <Input
                type="text"
                value={state.other}
                onChange={handleOther}
                placeholder={systemKey === "genitalia" && state.findings?.some(f => f.value === "tanner_stage") ? "e.g., Stage 1, Stage 2..." : "Additional findings..."}
                style={{ fontSize: "13px" }}
              />
            </div>
          )}
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
// View Mode Components
// ─────────────────────────────────────────────────────────────────────────────

const FieldDisplay = ({ label, value, classes }) => (
  <div>
    <SectionLabel>{label}</SectionLabel>
    <div className={classes.fieldValue}>
      {value || "—"}
    </div>
  </div>
);

const ChipList = ({ items, label }) => (
  <div>
    <SectionLabel>{label}</SectionLabel>
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, minHeight: "41px", alignItems: "center" }}>
      {items && items.length > 0 ? (
        items.map((item, idx) => (
          <Chip
            key={idx}
            label={item}
            sx={{
              backgroundColor: "#014d88",
              color: "#fff",
              fontSize: "13px",
              height: "28px",
            }}
          />
        ))
      ) : (
        <span style={{ color: "#999", fontSize: "14px" }}>—</span>
      )}
    </Box>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * InitialClinicalEvaluationForm - Unified component for create/edit/view modes
 *
 * @param {Object} props
 * @param {string} props.mode - 'create', 'edit', or 'view'
 * @param {Object} props.patientObj - Patient object
 * @param {Object} props.activeContent - Active content for routing (required for edit/view)
 * @param {Function} props.setActiveContent - Function to change route
 */
const InitialClinicalEvaluationForm = (props) => {
  const classes = useStyles();
  const { mode = 'create' } = props;
  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create';

  // Check if this is read-only view (from Recent Activities "View" button)
  const isReadOnly = props.activeContent?.actionType === 'view';

  const patientAge = calculate_age_to_number(props.patientObj.dateOfBirth);
  const isFemale = ["female", "FEMALE", "Female"].includes(props.patientObj.sex);

  const [enrollDate, setEnrollDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [expanded, setExpanded] = useState(
    isViewMode
      ? ["basic", "tb-assessment", "pregnancy", "medication", "vitals", "physical-exam", "assessment"]
      : ["symptoms", "medical", "arv", "physical", "confirmatory"]
  );
  const [recordId, setRecordId] = useState(null);  // Track record ID for updates
  const [loadingRecord, setLoadingRecord] = useState(isEditMode || isViewMode);  // Loading state for fetching existing record
  const [viewData, setViewData] = useState(null);  // Data for view mode

  // ── Codesets State ────────────────────────────────────────────────────────
  const [codesets, setCodesets] = useState({
    tbStatus: [],
    developmentalAssessment: [],
    immunisationComplete: [],
    currentlyPregnant: [],
    whoStage: [],
    assessment: [],
    enrollIn: [],
    planForArt: [],
    knownDrugAllergies: [],
    currentMedications : [],
    patientDiscloseStatus : []

  });
  const [loadingCodesets, setLoadingCodesets] = useState(true);

  // ── Regimen State ─────────────────────────────────────────────────────────
  const [regimenLines, setRegimenLines] = useState([]);
  const [regimens, setRegimens] = useState([]);
  const [loadingRegimens, setLoadingRegimens] = useState(false);

  // ── Fetch Data on Mount ──────────────────────────────────────────────────
  useEffect(() => {
    fetchCodesets();
    fetchRegimenLines(); // Fetch regimen lines on mount
    if (isViewMode || isEditMode) {
      fetchExistingData();
    }
  }, []);

  const fetchCodesets = async () => {
    setLoadingCodesets(true);
    try {
      const params = new URLSearchParams();
      params.append('codes', 'TB_STATUS');
      params.append('codes', 'STI_ASSESSED_BY');
      params.append('codes', 'YES_NO_OUTBREAK');
      params.append('codes', 'DO_YOU_HAVE_THE_FOLLOWING');
      params.append('codes', 'WHO_STAGING_CRITERIA');
      params.append('codes', 'PHYSICAL_EXAM_ASSESSMENT');
      params.append('codes', 'ENROLL_IN');
      params.append('codes', 'PLAN_FOR_ART');
      params.append('codes', 'PERSON_CONTACTED');
      params.append('codes', 'HIVST_KIT_USER');

      const response = await axios.get(
        `${baseUrl}application-codesets/v2/codeSets?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Codeset  Response:", response.data);

      setCodesets({
        tbStatus: response.data.TB_STATUS || [],
        developmentalAssessment: response.data.STI_ASSESSED_BY || [],
        immunisationComplete: response.data.YES_NO_OUTBREAK || [],
        knownDrugAllergies: response.data.DO_YOU_HAVE_THE_FOLLOWING || [],
        currentlyPregnant: response.data.YES_NO_OUTBREAK || [],
        whoStage: response.data.WHO_STAGING_CRITERIA || [],
        assessment: response.data.PHYSICAL_EXAM_ASSESSMENT || [],
        enrollIn: response.data.ENROLL_IN || [],
        planForArt: response.data.PLAN_FOR_ART || [],
        currentMedications: response.data.PERSON_CONTACTED || [],
        patientDiscloseStatus: response.data.HIVST_KIT_USER || [],
      });
    } catch (error) {
      console.error("Error fetching codesets:", error);
      console.error("Error details:", error.response?.data);
      console.error("Error status:", error.response?.status);
      toast.error("Failed to load dropdown options");
    } finally {
      setLoadingCodesets(false);
    }
  };

  // ── Fetch Regimen Lines ───────────────────────────────────────────────────
  const fetchRegimenLines = async () => {
    try {
      // Determine if patient is pediatric (< 15 years old)
      const isPediatric = patientAge < 15;
      const endpoint = isPediatric
        ? `${baseUrl}hiv/regimen/arv/children`
        : `${baseUrl}hiv/regimen/arv/adult`;

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRegimenLines(response.data || []);
    } catch (error) {
      console.error("Error fetching regimen lines:", error);
      toast.error("Failed to load regimen lines");
      setRegimenLines([]);
    }
  };

  // ── Fetch Regimens based on Regimen Line ──────────────────────────────────
  const fetchRegimens = async (regimenLineId) => {
    if (!regimenLineId) {
      setRegimens([]);
      return;
    }

    setLoadingRegimens(true);
    try {
      const response = await axios.get(`${baseUrl}hiv/regimen/types/${regimenLineId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRegimens(response.data || []);
    } catch (error) {
      console.error("Error fetching regimens:", error);
      toast.error("Failed to load regimens");
      setRegimens([]);
    } finally {
      setLoadingRegimens(false);
    }
  };

  // ── Fetch Existing Data for View/Edit Mode ────────────────────────────────
  const fetchExistingData = async () => {
    setLoadingRecord(true);
    try {
      const response = await axios.get(
        `${baseUrl}hiv/observation/initial-clinical-evaluation/person/${props.patientObj.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (isViewMode) {
        setViewData(response.data);
      } else if (isEditMode) {
        // Populate form fields for edit mode
        const data = response.data;
        const formData = data.data || {};

        setRecordId(data.id);
        setVisitDate(data.dateOfObservation || "");
        setClinicianName(formData.clinicianName || "");

        // Symptoms
        if (formData.symptoms && Array.isArray(formData.symptoms)) {
          setSelectedSymptoms(formData.symptoms.map(s => ({
            value: typeof s === 'string' ? s : (s.value || s),
            label: typeof s === 'string' ? s : (s.label || s.value || s),
            duration: s.duration || ""
          })));
        }
        setOtherSymptom(formData.otherSymptom || "");

        // TB Assessment
        if (formData.tbAssessment) {
          setTbAssessment({
            assessedForTb: formData.tbAssessment.assessedForTb || "",
            tbStatus: formData.tbAssessment.tbStatus || "",
            developmentalAssessment: formData.tbAssessment.developmentalAssessment || "",
            immunisationComplete: formData.tbAssessment.immunisationComplete || "",
            modeOfInfantFeeding: formData.tbAssessment.modeOfInfantFeeding || "",
            pastMedicalHistory: formData.tbAssessment.pastMedicalHistory || "",
          });
        }

        // Known Drug Allergies
        if (typeof formData.knownDrugAllergies === 'string') {
          setKnownDrugAllergies(formData.knownDrugAllergies);
        } else if (Array.isArray(formData.knownDrugAllergies)) {
          setKnownDrugAllergies(formData.knownDrugAllergies.join(", "));
        }

        // Pregnancy
        if (formData.pregnancy) {
          setPregnancy({
            currentlyPregnant: formData.pregnancy.currentlyPregnant || "",
            lastMenstrualPeriod: formData.pregnancy.lastMenstrualPeriod || "",
            gestationalAge: formData.pregnancy.gestationalAge || "",
            expectedDateOfDelivery: formData.pregnancy.expectedDateOfDelivery || "",
          });
        }

        // Current Medications
        if (Array.isArray(formData.currentMeds)) {
          setCurrentMeds(formData.currentMeds);
        }

        // Disclosure
        if (Array.isArray(formData.disclosure)) {
          setDisclosure(formData.disclosure);
        }
        setDisclosureOtherText(formData.disclosureOtherText || "");

        // ARV Side Effects
        if (formData.arvSideEffects) {
          setArvSideEffects({
            hasSideEffects: formData.arvSideEffects.hasSideEffects || "",
            sideEffectsDetail: formData.arvSideEffects.sideEffectsDetail || "",
            specifyMedication: formData.arvSideEffects.specifyMedication || "",
          });
        }

        // ARV History
        if (formData.arvHistory) {
          setArvHistory({
            previousArvExposure: formData.arvHistory.previousArvExposure || "",
            earlierArvNotTransfer: formData.arvHistory.earlierArvNotTransfer || "",
            nameOfFacility: formData.arvHistory.nameOfFacility || "",
            prep: formData.arvHistory.prep || "",
            pep: formData.arvHistory.pep || "",
            tran: formData.arvHistory.tran || "",
            durationOfCareFrom: formData.arvHistory.durationOfCareFrom || "",
            durationOfCareTo: formData.arvHistory.durationOfCareTo || "",
          });
        }

        // Vitals
        if (formData.vitals) {
          setVitals({
            temperature: formData.vitals.temperature || "",
            bpSystolic: formData.vitals.bpSystolic || "",
            bpDiastolic: formData.vitals.bpDiastolic || "",
            pulse: formData.vitals.pulse || "",
            respiratoryRate: formData.vitals.respiratoryRate || "",
            weight: formData.vitals.weight || "",
            height: formData.vitals.height || "",
            headCircumference: formData.vitals.headCircumference || "",
            surfaceArea: formData.vitals.surfaceArea || "",
          });
          setBmi(formData.vitals.bmi || "");
        }

        // Physical Exam
        if (formData.physicalExam) {
          setSystems(formData.physicalExam);
          setAdditionalFindings(formData.physicalExam.additionalFindings || "");
        }

        // Assessment
        if (formData.assessment) {
          console.log("📊 Assessment Data from API:", formData.assessment);
          console.log("WHO Stage from API:", formData.assessment.whoStage);
          console.log("WHO Stage Type:", typeof formData.assessment.whoStage);

          setAssessment({
            assessmentItems: formData.assessment.assessmentItems || [],
            whoStage: formData.assessment.whoStage || "",
            whoStageCriteria: formData.assessment.whoStageCriteria || [],
            enrollInItems: formData.assessment.enrollInItems || [],
            planForArtItems: formData.assessment.planForArtItems || [],
            drugsInRegimen: formData.assessment.drugsInRegimen || "",
            regimenLineId: formData.assessment.regimenLineId || "",
            regimenId: formData.assessment.regimenId || "",
            additionalComments: formData.assessment.additionalComments || "",
            nextAppointment: formData.assessment.nextAppointment || "",
          });

          // Fetch regimens if regimen line is selected
          if (formData.assessment.regimenLineId) {
            fetchRegimens(formData.assessment.regimenLineId);
          }
        }
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.apierror?.message ||
        "Failed to load initial clinical evaluation data";
      toast.error(msg);
    } finally {
      setLoadingRecord(false);
    }
  };

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
  const [symptomDurationErrors, setSymptomDurationErrors] = useState({});

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
    // Clear error for removed symptom
    setSymptomDurationErrors((prev) => {
      const updated = { ...prev };
      delete updated[value];
      return updated;
    });
  };

  const handleSymptomDuration = (value, duration) => {
    setSelectedSymptoms((prev) =>
      prev.map((s) => (s.value === value ? { ...s, duration } : s))
    );

    // Clear error if duration is valid (not empty and > 0)
    if (duration && parseFloat(duration) > 0) {
      setSymptomDurationErrors((prev) => {
        const updated = { ...prev };
        delete updated[value];
        return updated;
      });
    }
  };

  // ── Section: Medical History ─────────────────────────────────────────────
  const [tbAssessment, setTbAssessment] = useState({
    assessedForTb: "",
    tbStatus: "",
    developmentalAssessment: "",
    immunisationComplete: "",
    modeOfInfantFeeding: "",
    pastMedicalHistory: "",
  });

  const handleTb = (e) => {
    const { name, value } = e.target;
    // Clear conditional fields when assessedForTb changes
    if (name === "assessedForTb") {
      if (value === "Yes") {
        // Clear developmental assessment when TB = Yes
        setTbAssessment((prev) => ({ ...prev, [name]: value, developmentalAssessment: "" }));
      } else if (value === "No") {
        // Clear TB status when TB = No
        setTbAssessment((prev) => ({ ...prev, [name]: value, tbStatus: "" }));
      } else {
        // Clear both when empty
        setTbAssessment((prev) => ({ ...prev, [name]: value, tbStatus: "", developmentalAssessment: "" }));
      }
    } else {
      setTbAssessment((prev) => ({ ...prev, [name]: value }));
    }
  };

  const [knownDrugAllergies, setKnownDrugAllergies] = useState("");  // Free text for drug allergies

  const [pregnancy, setPregnancy] = useState({
    currentlyPregnant: "",
    lastMenstrualPeriod: "",
    gestationalAge: "",
    expectedDateOfDelivery: "",
  });
  const [pregnancyErrors, setPregnancyErrors] = useState({});

  // Calculate gestational age and expected delivery date from LMP
  const calculatePregnancyDetails = (lmp) => {
    if (!lmp) return { gestationalAge: "", edd: "" };

    const lmpDate = new Date(lmp);
    const today = new Date();

    // Calculate gestational age in weeks
    const diffTime = today - lmpDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const gestationalWeeks = Math.floor(diffDays / 7);

    // Calculate Expected Date of Delivery (LMP + 280 days or 40 weeks)
    const eddDate = new Date(lmpDate);
    eddDate.setDate(eddDate.getDate() + 280);

    return {
      gestationalAge: gestationalWeeks >= 0 ? gestationalWeeks.toString() : "",
      edd: gestationalWeeks >= 0 ? moment(eddDate).format("YYYY-MM-DD") : "",
    };
  };

  // Validate pregnancy fields
  const validatePregnancyField = (name, value) => {
    if (!value) return ""; // Allow empty

    if (name === "lastMenstrualPeriod") {
      const lmpDate = new Date(value);
      const today = new Date();
      const maxLMP = new Date();
      maxLMP.setDate(maxLMP.getDate() - 280); // 40 weeks ago

      if (lmpDate > today) {
        return "Last Menstrual Period cannot be in the future";
      }
      if (lmpDate < maxLMP) {
        return "Last Menstrual Period cannot be more than 40 weeks ago";
      }
    }

    if (name === "expectedDateOfDelivery") {
      const eddDate = new Date(value);
      const today = new Date();

      if (eddDate < today) {
        return "Expected Date of Delivery cannot be in the past";
      }
    }

    return "";
  };

  const handlePregnancy = (e) => {
    const { name, value } = e.target;

    // Validate the field
    const error = validatePregnancyField(name, value);
    setPregnancyErrors((prev) => ({ ...prev, [name]: error }));

    // If Last Menstrual Period is changed, calculate gestational age and EDD
    if (name === "lastMenstrualPeriod") {
      const { gestationalAge, edd } = calculatePregnancyDetails(value);
      setPregnancy((prev) => ({
        ...prev,
        [name]: value,
        gestationalAge: gestationalAge,
        expectedDateOfDelivery: edd,
      }));

      // Validate the auto-calculated EDD
      const eddError = validatePregnancyField("expectedDateOfDelivery", edd);
      setPregnancyErrors((prev) => ({ ...prev, expectedDateOfDelivery: eddError }));
    } else {
      setPregnancy((prev) => ({ ...prev, [name]: value }));
    }
  };

  const [currentMeds, setCurrentMeds] = useState([]);  // Array of selected medication codes

  const handleMedsCheckbox = (code, checked) => {
    setCurrentMeds((prev) => {
      return checked
        ? [...prev, code]  // Add code if checked
        : prev.filter((item) => item !== code);  // Remove code if unchecked
    });
  };

  const [disclosure, setDisclosure] = useState([]);  // Array of selected disclosure codes
  const [disclosureOtherText, setDisclosureOtherText] = useState("");  // Text for "Other (specify)"

  const handleDisclosureCheckbox = (code, checked) => {
    setDisclosure((prev) => {
      const updated = checked
        ? [...prev, code]  // Add code if checked
        : prev.filter((item) => item !== code);  // Remove code if unchecked

      // Clear "Other (specify)" text if "Other" option is unchecked
      if (!checked && (code.toLowerCase().includes('other') || code === 'OTHER')) {
        setDisclosureOtherText("");
      }

      return updated;
    });
  };

  const [arvSideEffects, setArvSideEffects] = useState({
    hasSideEffects: "", sideEffectsDetail: "", specifyMedication: "",
  });

  const handleSideEffects = (e) => {
    const { name, value } = e.target;
    setArvSideEffects((prev) => ({ ...prev, [name]: value }));
  };

  // ── Section: Previously ARV Exposure ────────────────────────────────────
  const [arvHistory, setArvHistory] = useState({
    previousArvExposure: "",
    earlierArvNotTransfer: false,
    prep: false,
    pep: false,
    tran: false,
    nameOfFacility: "",
    durationOfCareFrom: "",
    durationOfCareTo: "",
  });
  const [arvHistoryErrors, setArvHistoryErrors] = useState({});

  const handleArv = (e) => {
    const { name, type, value, checked } = e.target;
    setArvHistory((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));

    // Validate duration dates for date inputs
    if (type === "date" && (name === "durationOfCareFrom" || name === "durationOfCareTo")) {
      const careFrom = name === "durationOfCareFrom" ? value : arvHistory.durationOfCareFrom;
      const careTo = name === "durationOfCareTo" ? value : arvHistory.durationOfCareTo;

      // Clear previous errors
      setArvHistoryErrors((prev) => {
        const updated = { ...prev };
        delete updated.durationOfCareTo;
        return updated;
      });

      // Validate if both dates are present
      if (careFrom && careTo) {
        const fromDate = new Date(careFrom);
        const toDate = new Date(careTo);

        if (toDate < fromDate) {
          setArvHistoryErrors((prev) => ({
            ...prev,
            durationOfCareTo: "Duration of Care To cannot be earlier than Duration of Care From"
          }));
        }
      }
    }
  };

  // ── Section: Physical Examination ────────────────────────────────────────
  const [vitals, setVitals] = useState({
    temperature: "", bpSystolic: "", bpDiastolic: "",
    pulse: "", weight: "", height: "", headCircumference: "", surfaceArea: "",
  });
  const [bmi, setBmi] = useState("");
  const [vitalsErrors, setVitalsErrors] = useState({});

  // Validate vitals and calculate BMI
  const validateVital = (name, value) => {
    if (!value) return ""; // Allow empty values

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "Must be a valid number";

    switch (name) {
      case "temperature":
        if (numValue < 35) return "Temperature cannot be less than 35°C";
        if (numValue > 47) return "Temperature cannot be greater than 47°C";
        break;
      case "bpSystolic":
        if (numValue < 90) return "Systolic pressure cannot be less than 90 mmHg";
        if (numValue > 240) return "Systolic pressure cannot be greater than 240 mmHg";
        break;
      case "bpDiastolic":
        if (numValue < 60) return "Diastolic pressure cannot be less than 60 mmHg";
        if (numValue > 140) return "Diastolic pressure cannot be greater than 140 mmHg";
        break;
      case "pulse":
        if (numValue < 40) return "Pulse cannot be less than 40 b/min";
        if (numValue > 120) return "Pulse cannot be greater than 120 b/min";
        break;
      case "weight":
        if (numValue < 48.26) return "Weight cannot be less than 48.26 kg";
        if (numValue > 216.408) return "Weight cannot be greater than 216.408 kg";
        break;
      case "height":
        if (numValue < 48.26) return "Height cannot be less than 48.26 cm";
        if (numValue > 216.408) return "Height cannot be greater than 216.408 cm";
        break;
      default:
        break;
    }
    return "";
  };

  // Calculate BMI when weight or height changes
  const calculateBMI = (weight, height) => {
    if (weight && height) {
      const weightNum = parseFloat(weight);
      const heightNum = parseFloat(height);
      if (!isNaN(weightNum) && !isNaN(heightNum) && heightNum > 0) {
        const heightInMeters = heightNum / 100; // Convert cm to meters
        const bmiValue = weightNum / (heightInMeters * heightInMeters);
        return bmiValue.toFixed(2);
      }
    }
    return "";
  };

  const handleVitals = (e) => {
    const { name, value } = e.target;

    // Validate the input
    const error = validateVital(name, value);
    setVitalsErrors((prev) => ({ ...prev, [name]: error }));

    // Update vitals state
    const newVitals = { ...vitals, [name]: value };
    setVitals(newVitals);

    // Calculate BMI if weight or height changed
    if (name === "weight" || name === "height") {
      const newBmi = calculateBMI(
        name === "weight" ? value : vitals.weight,
        name === "height" ? value : vitals.height
      );
      setBmi(newBmi);
    }
  };

  const makeSystem = (extra = {}) => ({ nsf: false, findings: [], other: "", ...extra });

  const [systems, setSystems] = useState({
    generalAppearance: makeSystem(),
    headEyeEnt: makeSystem(),
    cardiovascular: makeSystem(),
    respiratory: makeSystem(),
    gastrointestinal: makeSystem(),
    genitalia: makeSystem({ tannerStage: "" }),
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
    assessmentItems: [],        // Array of selected assessment codes
    whoStage: "",              // WHO Stage code (e.g., "WHO_STAGING_CRITERIA_STAGE_2")
    whoStageId: null,          // WHO Stage ID for database storage
    whoStageCriteria: [],      // Array of selected clinical criteria for the WHO stage
    enrollInItems: [],         // Array of selected enrollment codes
    planForArtItems: [],      // Array of selected ART plan codes
    regimenLineId: "",         // First ART Regimen Line ID
    regimenId: "",             // First ART Regimen ID
    additionalComments: "",
    nextAppointment: "",
  });

  const handleAssessment = (e) => {
    const { name, type, value, checked } = e.target;

    // If WHO stage is being changed, clear the criteria selection and capture the ID
    if (name === "whoStage") {
      // Find the ID for the selected WHO Stage code
      const selectedWhoStage = codesets.whoStage.find(option => option.code === value);
      const whoStageId = selectedWhoStage ? selectedWhoStage.id : null;

      setAssessment((prev) => ({
        ...prev,
        whoStage: value,
        whoStageId: whoStageId, // Store the ID for backend
        whoStageCriteria: [] // Clear criteria when stage changes
      }));
    } else if (name === "regimenLineId") {
      // If regimen line changes, fetch regimens for that line and clear selected regimen
      fetchRegimens(value);
      setAssessment((prev) => ({
        ...prev,
        regimenLineId: value,
        regimenId: "" // Clear regimen when line changes
      }));
    } else {
      setAssessment((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    }
  };

  // Handle WHO Stage criteria transfer
  const handleWhoStageCriteriaTransfer = (newSelectedCriteria) => {
    setAssessment((prev) => ({ ...prev, whoStageCriteria: newSelectedCriteria }));
  };

  // Handle checkbox arrays (assessment, enroll_in, plan_for_art)
  const handleCheckboxArray = (arrayName, code, checked) => {
    setAssessment((prev) => {
      const currentArray = prev[arrayName] || [];
      const newArray = checked
        ? [...currentArray, code]  // Add code if checked
        : currentArray.filter((item) => item !== code);  // Remove code if unchecked
      return { ...prev, [arrayName]: newArray };
    });
  };

  // Helper to check if pregnancy code indicates "Yes"
  const isPregnant = () => {
    if (!pregnancy.currentlyPregnant) return false;

    // Find the selected option from the codeset
    const selectedOption = codesets.currentlyPregnant.find(
      opt => opt.code === pregnancy.currentlyPregnant
    );

    if (selectedOption) {
      // Check if the display value indicates "Yes"
      const display = selectedOption.display.toUpperCase();
      return display === 'YES' || display.includes('YES');
    }

    // Fallback: Check if code contains "YES" or matches common patterns
    const code = pregnancy.currentlyPregnant.toUpperCase();
    return code.includes('YES') || code === 'Y' || code === 'PREGNANT';
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

  // Fetch existing record when in update mode
  useEffect(() => {
    if (props.activeContent?.actionType === "update" && props.activeContent?.id) {
      fetchExistingRecord(props.activeContent.id);
    }
  }, [props.activeContent?.id, props.activeContent?.actionType]);

  const fetchExistingRecord = async (id) => {
    setLoadingRecord(true);
    try {
      const response = await axios.get(
        `${baseUrl}hiv/observation/initial-clinical-evaluation/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const record = response.data;
      setRecordId(record.id);
      populateForm(record.data);
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.apierror?.message ||
        "Failed to load record for editing";
      toast.error(msg);
      props.setActiveContent({ ...props.activeContent, route: "recent-history" });
    } finally {
      setLoadingRecord(false);
    }
  };

  const populateForm = (data) => {
    // Basic information
    if (data.visitDate) setVisitDate(data.visitDate);
    if (data.clinicianName) setClinicianName(data.clinicianName);

    // Symptoms
    if (data.symptoms) {
      setSelectedSymptoms(data.symptoms);
      // Clear any existing symptom duration errors when loading data
      setSymptomDurationErrors({});
    }
    if (data.otherSymptom) setOtherSymptom(data.otherSymptom);

    // TB Assessment
    if (data.tbAssessment) setTbAssessment(data.tbAssessment);

    // Known Drug Allergies - Convert from array to string if needed
    if (data.knownDrugAllergies) {
      // If it's an array from backend, take the first element, otherwise use as is
      const allergiesValue = Array.isArray(data.knownDrugAllergies)
        ? (data.knownDrugAllergies[0] || "")
        : data.knownDrugAllergies;
      setKnownDrugAllergies(allergiesValue);
    }

    // Pregnancy
    if (data.pregnancy && isFemale) setPregnancy(data.pregnancy);

    // Current Medications
    if (data.currentMeds) setCurrentMeds(data.currentMeds);

    // Disclosure
    if (data.disclosure) setDisclosure(data.disclosure);
    if (data.disclosureOtherText) setDisclosureOtherText(data.disclosureOtherText);

    // ARV Side Effects
    if (data.arvSideEffects) setArvSideEffects(data.arvSideEffects);

    // ARV History
    if (data.arvHistory) setArvHistory(data.arvHistory);

    // Vitals
    if (data.vitals) {
      const { bmi: bmiValue, ...vitalData } = data.vitals;
      setVitals(vitalData);
      if (bmiValue) setBmi(bmiValue);
    }

    // Physical Exam / Systems
    if (data.physicalExam) {
      const { additionalFindings: addFindings, ...systemsData } = data.physicalExam;
      setSystems(systemsData);
      if (addFindings) setAdditionalFindings(addFindings);
    }

    // Assessment - ensure all arrays are properly initialized
    if (data.assessment) {
      setAssessment({
        assessmentItems: data.assessment.assessmentItems || [],
        whoStage: data.assessment.whoStage || "",
        whoStageId: data.assessment.whoStageId || null,
        whoStageCriteria: data.assessment.whoStageCriteria || [],
        enrollInItems: data.assessment.enrollInItems || [],
        planForArtItems: data.assessment.planForArtItems || [],
        regimenLineId: data.assessment.regimenLineId || "",
        regimenId: data.assessment.regimenId || "",
        additionalComments: data.assessment.additionalComments || "",
        nextAppointment: data.assessment.nextAppointment || "",
      });

      // Fetch regimens if regimen line is set
      if (data.assessment.regimenLineId) {
        fetchRegimens(data.assessment.regimenLineId);
      }
    }
  };

  // Clear immunisationComplete if patient is not between 0-2 years
  useEffect(() => {
    if (patientAge < 0 || patientAge > 2) {
      setTbAssessment((prev) => ({ ...prev, immunisationComplete: "" }));
    }
  }, [patientAge]);

  // Clear pregnancy details if currentlyPregnant is not "Yes"
  useEffect(() => {
    if (!isPregnant() && pregnancy.currentlyPregnant !== "") {
      setPregnancy((prev) => ({
        ...prev,
        lastMenstrualPeriod: "",
        gestationalAge: "",
        expectedDateOfDelivery: "",
      }));
      // Clear pregnancy validation errors
      setPregnancyErrors({});
    }
  }, [pregnancy.currentlyPregnant]);

  // ── Real-time Payload Logging ────────────────────────────────────────────
  useEffect(() => {
    // Build the payload structure that would be sent
    const currentPayload = {
      dateOfObservation: visitDate,
      personId: props.patientObj.id,
      type: "Initial Clinical Evaluation",
      data: {
        visitDate,
        clinicianName,
        symptoms: selectedSymptoms,
        otherSymptom,
        tbAssessment,
        // Convert knownDrugAllergies string to array format expected by backend
        knownDrugAllergies: knownDrugAllergies ? [knownDrugAllergies] : [],
        pregnancy: isFemale ? pregnancy : null,
        currentMeds,
        disclosure,
        disclosureOtherText,
        arvSideEffects,
        arvHistory,
        vitals: {
          ...vitals,
          bmi,
        },
        physicalExam: {
          ...systems,
          breastGlands: isFemale ? systems.breastGlands : null,
          additionalFindings,
        },
        assessment,
      },
    };

    console.log("═══════════════════════════════════════════════════════");
    console.log("🔄 REAL-TIME ICE FORM DATA");
    console.log("═══════════════════════════════════════════════════════");
    console.log(JSON.stringify(currentPayload, null, 2));
    console.log("═══════════════════════════════════════════════════════");
  }, [
    visitDate,
    clinicianName,
    selectedSymptoms,
    otherSymptom,
    tbAssessment,
    knownDrugAllergies,
    pregnancy,
    currentMeds,
    disclosure,
    disclosureOtherText,
    arvSideEffects,
    arvHistory,
    vitals,
    bmi,
    systems,
    additionalFindings,
    assessment,
    isFemale,
    props.patientObj.id
  ]);

  console.log("selectedSymptoms :", selectedSymptoms)

  // ── Validation ───────────────────────────────────────────────────────────
  const validate = () => {
    const temp = {};

    // Required fields
    if (!visitDate) temp.visitDate = "Visit date is required";
    if (!tbAssessment.assessedForTb) temp.assessedForTb = "Patient Assessed for TB is required";

    // Conditional validation based on TB assessment
    if (tbAssessment.assessedForTb === "No") {
      if (!tbAssessment.developmentalAssessment) temp.developmentalAssessment = "Developmental Assessment is required";
    }

    // Validate symptom durations
    const durationErrors = {};
    selectedSymptoms.forEach((symptom) => {
      const duration = parseFloat(symptom.duration);
      if (!symptom.duration || symptom.duration === "" || duration <= 0 || isNaN(duration)) {
        durationErrors[symptom.value] = "Duration is required and must be greater than 0";
      }
    });
    setSymptomDurationErrors(durationErrors);
    if (Object.keys(durationErrors).length > 0) {
      temp.symptoms = "Please provide valid duration for all selected symptoms";
    }

    if (!knownDrugAllergies || knownDrugAllergies.trim() === "") temp.knownDrugAllergies = "Known Drug Allergies is required";

    // Validate disclosure "Other (specify)" text if "Other" option is selected
    const hasOtherDisclosure = disclosure.some(code => code.toLowerCase().includes('other') || code === 'OTHER');
    if (hasOtherDisclosure && (!disclosureOtherText || disclosureOtherText.trim() === "")) {
      temp.disclosureOtherText = "Please specify other disclosure details";
    }

    if (assessment.assessmentItems.length === 0) temp.assessmentItems = "Assessment is required (select at least one option)";
    if (!assessment.whoStage) temp.whoStage = "WHO Stage is required";
    if (!assessment.nextAppointment) temp.nextAppointment = "Next Appointment Date is required";

    // Check for vitals validation errors
    const hasVitalsErrors = Object.values(vitalsErrors).some(error => error !== "");
    if (hasVitalsErrors) {
      temp.vitals = "Please correct all vitals validation errors before submitting";
    }

    // Check for pregnancy validation errors
    const hasPregnancyErrors = Object.values(pregnancyErrors).some(error => error !== "");
    if (hasPregnancyErrors) {
      temp.pregnancy = "Please correct all pregnancy field validation errors before submitting";
    }

    // Check for ARV history validation errors
    const hasArvHistoryErrors = Object.values(arvHistoryErrors).some(error => error !== "");
    if (hasArvHistoryErrors) {
      temp.arvHistory = "Please correct ARV history date errors before submitting";
    }

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
        data: {
          visitDate,
          clinicianName,
          symptoms: selectedSymptoms,
          otherSymptom,
          tbAssessment,
          // Convert knownDrugAllergies string to array format expected by backend
          knownDrugAllergies: knownDrugAllergies ? [knownDrugAllergies] : [],
          pregnancy: isFemale ? pregnancy : null,
          currentMeds,
          disclosure,
          disclosureOtherText,
          arvSideEffects,
          arvHistory,
          vitals: {
            ...vitals,
            bmi,
          },
          physicalExam: {
            ...systems,
            breastGlands: isFemale ? systems.breastGlands : null,
            additionalFindings,
          },
          assessment,
        },
      };

      // Log the complete payload structure
      console.log("═══════════════════════════════════════════════════════");
      console.log("📋 INITIAL CLINICAL EVALUATION PAYLOAD");
      console.log("═══════════════════════════════════════════════════════");
      console.log("Complete Payload:", JSON.stringify(payload, null, 2));
      console.log("───────────────────────────────────────────────────────");
      console.log("Assessment State:", assessment);
      console.log("WHO Stage Value:", assessment.whoStage);
      console.log("WHO Stage Type:", typeof assessment.whoStage);
      console.log("───────────────────────────────────────────────────────");
      console.log("Payload Object:", payload);
      console.log("═══════════════════════════════════════════════════════");

      // Add ID to payload if updating
      if (recordId) {
        payload.id = recordId;
        console.log("📝 Updating existing record with ID:", recordId);
      } else {
        console.log("✨ Creating new record");
      }

      const response = recordId
        ? await axios.put(
            `${baseUrl}hiv/observation/initial-clinical-evaluation/${recordId}`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        : await axios.post(
            `${baseUrl}hiv/observation/initial-clinical-evaluation`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          );

      toast.success(
        recordId
          ? "Initial Clinical Evaluation updated successfully"
          : "Initial Clinical Evaluation saved successfully"
      );
      console.log("Response:", response.data);

      // After creating new ICE form, redirect to Enrollment & Commencement form
      // After updating existing ICE form, go back to recent history
      props.setActiveContent({
        ...props.activeContent,
        route: recordId ? "recent-history" : "enrollment-and-commencement"
      });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.apierror?.message ||
        "An error occurred. Please try again.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Helper Functions
  // ─────────────────────────────────────────────────────────────────────────

  const formatDate = (date) => {
    return date ? moment(date).format("DD-MMM-YYYY") : "—";
  };

  const getYesNo = (value) => {
    if (value === null || value === undefined || value === "") return "—";
    return value === "Yes" || value === true || value === "yes" ? "Yes" : "No";
  };

  const getModeTitleSuffix = () => {
    if (isViewMode) return "(View)";
    if (isEditMode) return "(Update)";
    return "";
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  // Show loading state while fetching existing record
  if (loadingRecord) {
    return (
      <Card className={classes.root} style={{ borderRadius: "12px", overflow: "visible" }}>
        <CardContent>
          <Box sx={{ textAlign: "center", padding: "40px" }}>
            <Typography sx={{ fontSize: "16px", color: "#014d88" }}>
              Loading...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Show error state if no data found in view mode
  if (isViewMode && !viewData) {
    return (
      <Card className={classes.root}>
        <CardContent>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Typography>No initial clinical evaluation data found</Typography>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isUpdateMode = recordId !== null;

  // ─────────────────────────────────────────────────────────────────────────
  // Render View Mode
  // ─────────────────────────────────────────────────────────────────────────
  if (isViewMode && viewData) {
    const evalData = viewData.data || {};

    return (
      <Card className={classes.root} style={{ borderRadius: "12px", overflow: "visible" }}>
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
              Initial Clinical Evaluation (View)
            </Typography>
          </Box>

          {/* ── Visit Details ─────────────────────────────────────────────── */}
          <Box
            sx={{
              background: "#f5f7fa",
              border: "1px solid #e0e8f0",
              borderRadius: "8px",
              padding: "16px 20px",
              marginBottom: "20px",
            }}
          >
            <FieldRow>
              <Col size={3}>
                <FieldDisplay
                  label="Visit Date"
                  value={formatDate(evalData.visitDate)}
                  classes={classes}
                />
              </Col>
              <Col size={3}>
                <FieldDisplay
                  label="Clinician Name"
                  value={evalData.clinicianName}
                  classes={classes}
                />
              </Col>
              {evalData.pregnancy && evalData.pregnancy.currentlyPregnant && (
                <>
                  <Col size={2}>
                    <FieldDisplay
                      label="Currently Pregnant"
                      value={getYesNo(evalData.pregnancy.currentlyPregnant)}
                      classes={classes}
                    />
                  </Col>
                  {(evalData.pregnancy.currentlyPregnant === "Yes" || evalData.pregnancy.currentlyPregnant === true) && (
                    <>
                      <Col size={2}>
                        <FieldDisplay
                          label="Last Menstrual Period"
                          value={formatDate(evalData.pregnancy.lastMenstrualPeriod)}
                          classes={classes}
                        />
                      </Col>
                      <Col size={2}>
                        <FieldDisplay
                          label="Gestational Age (Weeks)"
                          value={evalData.pregnancy.gestationalAge}
                          classes={classes}
                        />
                      </Col>
                    </>
                  )}
                </>
              )}
            </FieldRow>
            {evalData.pregnancy && (evalData.pregnancy.currentlyPregnant === "Yes" || evalData.pregnancy.currentlyPregnant === true) && (
              <FieldRow style={{ marginTop: "12px" }}>
                <Col size={3}>
                  <FieldDisplay
                    label="Expected Date of Delivery"
                    value={formatDate(evalData.pregnancy.expectedDateOfDelivery)}
                    classes={classes}
                  />
                </Col>
              </FieldRow>
            )}
          </Box>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/*  SECTION 1 — BASIC INFORMATION                               */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <FormAccordion
            panel="basic"
            title="Basic Information"
            index={0}
            expanded={expanded}
            onToggle={toggleAccordion}
          >
            <SubHeading>Symptoms</SubHeading>
            <FieldRow>
              <Col size={12}>
                <ChipList
                  label="Selected Symptoms"
                  items={evalData.symptoms?.map(s => typeof s === 'string' ? s : s.label || s.value) || []}
                />
              </Col>
            </FieldRow>
            {evalData.otherSymptom && (
              <FieldRow>
                <Col size={12}>
                  <FieldDisplay
                    label="Other Symptom Details"
                    value={evalData.otherSymptom}
                    classes={classes}
                  />
                </Col>
              </FieldRow>
            )}
          </FormAccordion>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/*  SECTION 2 — TB ASSESSMENT                                   */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <FormAccordion
            panel="tb-assessment"
            title="TB Assessment & Infant Care"
            index={1}
            expanded={expanded}
            onToggle={toggleAccordion}
          >
            <FieldRow>
              <Col size={3}>
                <FieldDisplay
                  label="Assessed for TB"
                  value={getYesNo(evalData.tbAssessment?.assessedForTb)}
                  classes={classes}
                />
              </Col>
              <Col size={3}>
                <FieldDisplay
                  label="TB Status"
                  value={evalData.tbAssessment?.tbStatus}
                  classes={classes}
                />
              </Col>
              <Col size={3}>
                <FieldDisplay
                  label="Developmental Assessment"
                  value={evalData.tbAssessment?.developmentalAssessment}
                  classes={classes}
                />
              </Col>
              <Col size={3}>
                <FieldDisplay
                  label="Immunisation Complete"
                  value={getYesNo(evalData.tbAssessment?.immunisationComplete)}
                  classes={classes}
                />
              </Col>
            </FieldRow>
            <FieldRow>
              <Col size={6}>
                <FieldDisplay
                  label="Mode of Infant Feeding"
                  value={evalData.tbAssessment?.modeOfInfantFeeding}
                  classes={classes}
                />
              </Col>
              <Col size={6}>
                <FieldDisplay
                  label="Past Medical History"
                  value={evalData.tbAssessment?.pastMedicalHistory}
                  classes={classes}
                />
              </Col>
            </FieldRow>
          </FormAccordion>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/*  SECTION 3 — MEDICATION HISTORY                              */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <FormAccordion
            panel="pregnancy"
            title="Medication History"
            index={2}
            expanded={expanded}
            onToggle={toggleAccordion}
          >
            <SubHeading>Drug Allergies & Current Medications</SubHeading>
            <FieldRow>
              <Col size={12}>
                {Array.isArray(evalData.knownDrugAllergies) && evalData.knownDrugAllergies.length > 0 ? (
                  <ChipList
                    label="Known Drug Allergies"
                    items={evalData.knownDrugAllergies}
                  />
                ) : (
                  <FieldDisplay
                    label="Known Drug Allergies"
                    value={evalData.knownDrugAllergies}
                    classes={classes}
                  />
                )}
              </Col>
            </FieldRow>
            <FieldRow>
              <Col size={12}>
                {Array.isArray(evalData.currentMeds) && evalData.currentMeds.length > 0 ? (
                  <ChipList
                    label="Current Medications"
                    items={evalData.currentMeds}
                  />
                ) : (
                  <FieldDisplay
                    label="Current Medications"
                    value={evalData.currentMeds}
                    classes={classes}
                  />
                )}
              </Col>
            </FieldRow>

            <Divider sx={{ my: 2 }} />
            <SubHeading>Disclosure & ARV History</SubHeading>
            <FieldRow>
              <Col size={12}>
                {Array.isArray(evalData.disclosure) && evalData.disclosure.length > 0 ? (
                  <ChipList
                    label="Disclosure"
                    items={evalData.disclosure}
                  />
                ) : (
                  <FieldDisplay
                    label="Disclosure"
                    value={evalData.disclosure}
                    classes={classes}
                  />
                )}
              </Col>
            </FieldRow>

            {evalData.arvSideEffects && (
              <>
                <FieldRow>
                  <Col size={4}>
                    <FieldDisplay
                      label="Has ARV Side Effects"
                      value={getYesNo(evalData.arvSideEffects.hasSideEffects)}
                      classes={classes}
                    />
                  </Col>
                  <Col size={4}>
                    <FieldDisplay
                      label="Side Effects Detail"
                      value={evalData.arvSideEffects.sideEffectsDetail}
                      classes={classes}
                    />
                  </Col>
                  <Col size={4}>
                    <FieldDisplay
                      label="Specify Medication"
                      value={evalData.arvSideEffects.specifyMedication}
                      classes={classes}
                    />
                  </Col>
                </FieldRow>
              </>
            )}

            {evalData.arvHistory && (
              <>
                <Divider sx={{ my: 2 }} />
                <SubHeading>ARV Exposure History</SubHeading>
                <FieldRow>
                  <Col size={3}>
                    <FieldDisplay
                      label="Previous ARV Exposure"
                      value={evalData.arvHistory.previousArvExposure}
                      classes={classes}
                    />
                  </Col>
                  <Col size={3}>
                    <FieldDisplay
                      label="Earlier ARV (Not Transfer)"
                      value={getYesNo(evalData.arvHistory.earlierArvNotTransfer)}
                      classes={classes}
                    />
                  </Col>
                  <Col size={6}>
                    <FieldDisplay
                      label="Facility Name"
                      value={evalData.arvHistory.nameOfFacility}
                      classes={classes}
                    />
                  </Col>
                </FieldRow>
                <FieldRow>
                  <Col size={3}>
                    <FieldDisplay
                      label="PrEP"
                      value={getYesNo(evalData.arvHistory.prep)}
                      classes={classes}
                    />
                  </Col>
                  <Col size={3}>
                    <FieldDisplay
                      label="PEP"
                      value={getYesNo(evalData.arvHistory.pep)}
                      classes={classes}
                    />
                  </Col>
                  <Col size={3}>
                    <FieldDisplay
                      label="Transfer"
                      value={getYesNo(evalData.arvHistory.tran)}
                      classes={classes}
                    />
                  </Col>
                </FieldRow>
                <FieldRow>
                  <Col size={4}>
                    <FieldDisplay
                      label="Duration of Care From"
                      value={formatDate(evalData.arvHistory.durationOfCareFrom)}
                      classes={classes}
                    />
                  </Col>
                  <Col size={4}>
                    <FieldDisplay
                      label="Duration of Care To"
                      value={formatDate(evalData.arvHistory.durationOfCareTo)}
                      classes={classes}
                    />
                  </Col>
                </FieldRow>
              </>
            )}
          </FormAccordion>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/*  SECTION 4 — VITALS                                          */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <FormAccordion
            panel="vitals"
            title="Vitals"
            index={3}
            expanded={expanded}
            onToggle={toggleAccordion}
          >
            {evalData.vitals && (
              <Box
                sx={{
                  background: "#fff",
                  border: "1px solid #014d88",
                  borderRadius: "4px",
                  padding: "16px",
                }}
              >
                <FieldRow>
                  <Col size={3}>
                    <FieldDisplay
                      label="Temperature (°C)"
                      value={evalData.vitals.temperature}
                      classes={classes}
                    />
                  </Col>
                  <Col size={3}>
                    <FieldDisplay
                      label="BP Systolic (mmHg)"
                      value={evalData.vitals.bpSystolic}
                      classes={classes}
                    />
                  </Col>
                  <Col size={3}>
                    <FieldDisplay
                      label="BP Diastolic (mmHg)"
                      value={evalData.vitals.bpDiastolic}
                      classes={classes}
                    />
                  </Col>
                  <Col size={3}>
                    <FieldDisplay
                      label="Pulse (bpm)"
                      value={evalData.vitals.pulse}
                      classes={classes}
                    />
                  </Col>
                </FieldRow>
                <FieldRow>
                  <Col size={3}>
                    <FieldDisplay
                      label="Respiratory Rate (breaths/min)"
                      value={evalData.vitals.respiratoryRate}
                      classes={classes}
                    />
                  </Col>
                  <Col size={3}>
                    <FieldDisplay
                      label="Weight (kg)"
                      value={evalData.vitals.weight}
                      classes={classes}
                    />
                  </Col>
                  <Col size={3}>
                    <FieldDisplay
                      label="Height (cm)"
                      value={evalData.vitals.height}
                      classes={classes}
                    />
                  </Col>
                  <Col size={3}>
                    <FieldDisplay
                      label="Head Circumference (cm)"
                      value={evalData.vitals.headCircumference}
                      classes={classes}
                    />
                  </Col>
                  <Col size={3}>
                    <FieldDisplay
                      label="Surface Area (m²)"
                      value={evalData.vitals.surfaceArea}
                      classes={classes}
                    />
                  </Col>
                </FieldRow>
                <FieldRow>
                  <Col size={3}>
                    <FieldDisplay
                      label="BMI (kg/m²)"
                      value={evalData.vitals.bmi}
                      classes={classes}
                    />
                  </Col>
                </FieldRow>
              </Box>
            )}
          </FormAccordion>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/*  SECTION 5 — PHYSICAL EXAMINATION                            */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <FormAccordion
            panel="physical-exam"
            title="Physical Examination (Body Systems)"
            index={4}
            expanded={expanded}
            onToggle={toggleAccordion}
          >
            {evalData.physicalExam && (
              <>
                {Object.entries(evalData.physicalExam).map(([systemKey, systemData], idx) => {
                  if (systemKey === "additionalFindings" || !systemData) return null;

                  const systemName = systemKey
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())
                    .trim();

                  return (
                    <Box key={idx} sx={{ mb: 3 }}>
                      <SubHeading>{systemName}</SubHeading>
                      <Box
                        sx={{
                          background: "#f5f9ff",
                          border: "1px solid #e0e0e0",
                          borderRadius: "4px",
                          padding: "12px",
                        }}
                      >
                        <FieldRow>
                          <Col size={2}>
                            <FieldDisplay
                              label="NSF (No Significant Finding)"
                              value={getYesNo(systemData.nsf)}
                              classes={classes}
                            />
                          </Col>
                          {systemData.rate && (
                            <Col size={3}>
                              <FieldDisplay
                                label="Rate"
                                value={systemData.rate}
                                classes={classes}
                              />
                            </Col>
                          )}
                          {systemData.tannerStage && (
                            <Col size={3}>
                              <FieldDisplay
                                label="Tanner Stage"
                                value={systemData.tannerStage}
                                classes={classes}
                              />
                            </Col>
                          )}
                          {systemData.other && (
                            <Col size={12}>
                              <FieldDisplay
                                label="Other Findings"
                                value={systemData.other}
                                classes={classes}
                              />
                            </Col>
                          )}
                        </FieldRow>
                        {systemData.findings && systemData.findings.length > 0 && (
                          <FieldRow>
                            <Col size={12}>
                              <ChipList
                                label="Findings"
                                items={systemData.findings.map(f => {
                                  if (typeof f === 'string') return f;
                                  if (f.label) return f.label;
                                  if (f.value) return f.value;
                                  if (f.finding) return f.finding;
                                  return '';
                                }).filter(Boolean)}
                              />
                            </Col>
                          </FieldRow>
                        )}
                      </Box>
                    </Box>
                  );
                })}

                {evalData.physicalExam.additionalFindings && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <FieldRow>
                      <Col size={12}>
                        <FieldDisplay
                          label="Additional Findings"
                          value={evalData.physicalExam.additionalFindings}
                          classes={classes}
                        />
                      </Col>
                    </FieldRow>
                  </>
                )}
              </>
            )}
          </FormAccordion>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/*  SECTION 6 — ASSESSMENT & PLAN                               */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <FormAccordion
            panel="assessment"
            title="Assessment & Plan"
            index={5}
            expanded={expanded}
            onToggle={toggleAccordion}
          >
            {evalData.assessment && (
              <>
                <FieldRow>
                  <Col size={12}>
                    <ChipList
                      label="Assessment Items"
                      items={evalData.assessment.assessmentItems}
                    />
                  </Col>
                </FieldRow>

                <Divider sx={{ my: 2 }} />
                <SubHeading>WHO Stage</SubHeading>
                <FieldRow>
                  <Col size={3}>
                    <FieldDisplay
                      label="WHO Stage"
                      value={evalData.assessment.whoStage}
                      classes={classes}
                    />
                  </Col>
                  <Col size={9}>
                    <ChipList
                      label="WHO Stage Criteria"
                      items={evalData.assessment.whoStageCriteria}
                    />
                  </Col>
                </FieldRow>

                <Divider sx={{ my: 2 }} />
                <SubHeading>Enrollment & ART Plan</SubHeading>
                <FieldRow>
                  <Col size={6}>
                    <ChipList
                      label="Enroll In"
                      items={evalData.assessment.enrollInItems}
                    />
                  </Col>
                  <Col size={6}>
                    <ChipList
                      label="Plan for ART"
                      items={evalData.assessment.planForArtItems}
                    />
                  </Col>
                </FieldRow>

                <FieldRow>
                  <Col size={12}>
                    <FieldDisplay
                      label="Drugs in Regimen"
                      value={evalData.assessment.drugsInRegimen}
                      classes={classes}
                    />
                  </Col>
                </FieldRow>

                <FieldRow>
                  <Col size={12}>
                    <FieldDisplay
                      label="Additional Comments"
                      value={evalData.assessment.additionalComments}
                      classes={classes}
                    />
                  </Col>
                </FieldRow>

                <FieldRow>
                  <Col size={4}>
                    <FieldDisplay
                      label="Next Appointment"
                      value={formatDate(evalData.assessment.nextAppointment)}
                      classes={classes}
                    />
                  </Col>
                </FieldRow>
              </>
            )}
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
              startIcon={<ArrowBackIcon style={{ color: "#fff" }} />}
              style={{ backgroundColor: "#992E62" }}
              onClick={() =>
                props.setActiveContent({
                  ...props.activeContent,
                  route: "recent-history",
                })
              }
              type="button"
            >
              <span style={{ textTransform: "capitalize" }}>Back</span>
            </MatButton>
            <MatButton
              variant="contained"
              className={classes.button}
              startIcon={<EditIcon />}
              style={{ backgroundColor: "#014d88" }}
              onClick={() =>
                props.setActiveContent({
                  ...props.activeContent,
                  route: "initial-clinical-evaluation-update",
                  id: viewData.id,
                  actionType: "update",
                })
              }
            >
              <span style={{ textTransform: "capitalize" }}>Edit</span>
            </MatButton>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render Create/Edit Mode
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <Card className={classes.root} style={{ borderRadius: "12px", overflow: "visible" }}>
      <CardContent>
        {/* ── Page Header ──────────────────────────────────────────────── */}
        <Box
          sx={{
            backgroundColor: "#014d88",
            padding: "14px 20px",
            marginBottom: "20px",
          }}
        >
          <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>
            Initial Clinical Evaluation
            {isUpdateMode && !isReadOnly && (
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
                Edit Mode
              </span>
            )}
          </Typography>
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
            <div className="form-group mb-0 col-md-6">
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
                  disabled={isReadOnly}
                />
                {errors.visitDate && (
                  <span className={classes.error}>{errors.visitDate}</span>
                )}
              </FormGroup>
            </div>
            {isFemale && patientAge > 14 && (
              <div className="form-group mb-0 col-md-6">
                <FormGroup>
                  <label className={classes.fieldLabel}>Currently Pregnant</label>
                  <Input type="select" name="currentlyPregnant" value={pregnancy.currentlyPregnant} onChange={handlePregnancy} disabled={loadingCodesets || isReadOnly}>
                    <option value="">{loadingCodesets ? "Loading..." : "Select"}</option>
                    {codesets.currentlyPregnant.map((opt) => (
                      <option key={opt.id} value={opt.code}>{opt.display}</option>
                    ))}
                  </Input>
                </FormGroup>
              </div>
            )}
          </div>

          {/* Row 2: Last Menstrual Period, Expected Date of Delivery (if pregnant) */}
          {isFemale && patientAge > 14 && isPregnant() && (
            <div className="row">
              <div className="form-group mb-0 col-md-6">
                <FormGroup>
                  <label className={classes.fieldLabel}>Last Menstrual Period</label>
                  <Input
                    type="date"
                    name="lastMenstrualPeriod"
                    value={pregnancy.lastMenstrualPeriod}
                    onChange={handlePregnancy}
                    max={moment(new Date()).format("YYYY-MM-DD")}
                    style={{ borderColor: pregnancyErrors.lastMenstrualPeriod ? "#d32f2f" : "" }}
                    disabled={isReadOnly}
                  />
                  {pregnancyErrors.lastMenstrualPeriod && (
                    <span className={classes.error}>{pregnancyErrors.lastMenstrualPeriod}</span>
                  )}
                </FormGroup>
              </div>
              <div className="form-group mb-0 col-md-6">
                <FormGroup>
                  <label className={classes.fieldLabel}>Expected Date of Delivery</label>
                  <Input
                    type="date"
                    value={pregnancy.expectedDateOfDelivery}
                    readOnly
                    style={{
                      backgroundColor: "#f5f5f5",
                      cursor: "not-allowed",
                      fontWeight: pregnancy.expectedDateOfDelivery ? "600" : "400",
                      color: pregnancy.expectedDateOfDelivery ? "#014d88" : "#9e9e9e",
                      borderColor: pregnancyErrors.expectedDateOfDelivery ? "#d32f2f" : ""
                    }}
                  />
                  {pregnancyErrors.expectedDateOfDelivery && (
                    <span className={classes.error}>{pregnancyErrors.expectedDateOfDelivery}</span>
                  )}
                </FormGroup>
              </div>
            </div>
          )}

          {/* Row 3: Gestational Age (if pregnant) */}
          {isFemale && patientAge > 14 && isPregnant() && (
            <div className="row">
              <div className="form-group mb-0 col-md-6">
                <FormGroup>
                  <label className={classes.fieldLabel}>Gestational Age (Weeks)</label>
                  <Input
                    type="text"
                    value={pregnancy.gestationalAge}
                    readOnly
                    placeholder="Auto"
                    style={{
                      backgroundColor: "#f5f5f5",
                      cursor: "not-allowed",
                      fontWeight: pregnancy.gestationalAge ? "600" : "400",
                      color: pregnancy.gestationalAge ? "#014d88" : "#9e9e9e"
                    }}
                  />
                </FormGroup>
              </div>
            </div>
          )}
        </Box>

        <form onSubmit={handleSubmit}>
          <fieldset disabled={isReadOnly} style={{ border: 'none', padding: 0, margin: 0 }}>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/*  SECTION 1: SYMPTOMS REVIEW                                   */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <FormAccordion panel="symptoms" title="Symptoms Review" index={0} expanded={expanded} onToggle={toggleAccordion}>
            <Typography sx={{ fontSize: "13px", color: "#546e7a", marginBottom: "16px", marginTop: "0" }}>
              Search and select each symptom the patient is experiencing, then specify the duration.
            </Typography>

            {/* Symptom picker */}
            <div className="row" style={{ marginBottom: "16px" }}>
              <div className="col-md-6">
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
                      borderColor: "#014d88",
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
                  border: "1px solid #014d88",
                  borderRadius: "4px",
                  padding: "12px 16px",
                  marginBottom: "12px",
                }}
              >
                <Typography sx={{ fontWeight: 600, color: "#014d88", fontSize: "13px", marginBottom: "12px" }}>
                  Added Symptoms ({selectedSymptoms.length})
                </Typography>
                <div className="row">
                  {selectedSymptoms.map((symptom, idx) => (
                    <div key={symptom.value} className="col-md-6" style={{ marginBottom: "8px" }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "8px 12px",
                          background: "#f8fbff",
                          borderRadius: "6px",
                          border: "1px solid #dce8f5",
                          height: "100%",
                        }}
                      >
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Chip
                            label={symptom.label}
                            size="small"
                            sx={{
                              background: "#014d88",
                              color: "#fff",
                              fontWeight: 600,
                              fontSize: "12px",
                              maxWidth: "100%",
                            }}
                          />
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: "4px", flexShrink: 0 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <label style={{ fontSize: "11px", color: "#546e7a", whiteSpace: "nowrap", margin: 0 }}>
                              Days:
                            </label>
                            <Input
                              type="number"
                              min="1"
                              value={symptom.duration}
                              onChange={(e) => handleSymptomDuration(symptom.value, e.target.value)}
                              placeholder="0"
                              style={{
                                width: "70px",
                                height: "32px",
                                fontSize: "12px",
                                borderColor: symptomDurationErrors[symptom.value] ? "#d32f2f" : ""
                              }}
                            />
                          </Box>
                          {symptomDurationErrors[symptom.value] && (
                            <span className={classes.error} style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                              {symptomDurationErrors[symptom.value]}
                            </span>
                          )}
                        </Box>
                        <Tooltip title="Remove symptom">
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveSymptom(symptom.value)}
                            sx={{ color: "#d32f2f", padding: "4px", flexShrink: 0 }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </div>
                  ))}
                </div>
              </Box>
            )}

            {selectedSymptoms.length === 0 && (
              <Box
                sx={{
                  border: "1px dashed #014d88",
                  borderRadius: "4px",
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

            {/* Row 1: Patient Assessed for TB? */}
            <FieldRow>
              <Col>
                <SectionLabel>Patient Assessed for TB? <span style={{ color: "red" }}>*</span></SectionLabel>
                <Input type="select" name="assessedForTb" value={tbAssessment.assessedForTb} onChange={handleTb}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Input>
                {errors.assessedForTb && (
                  <span className={classes.error}>{errors.assessedForTb}</span>
                )}
              </Col>
            </FieldRow>

            {/* Row 2: TB Status (if assessed Yes) OR Developmental Assessment (if assessed No) */}
            <FieldRow>
              {tbAssessment.assessedForTb === "Yes" && (
                <Col>
                  <SectionLabel>TB Status</SectionLabel>
                  <Input type="select" name="tbStatus" value={tbAssessment.tbStatus} onChange={handleTb} disabled={loadingCodesets}>
                    <option value="">{loadingCodesets ? "Loading..." : "Select"}</option>
                    {codesets.tbStatus.map((opt) => (
                      <option key={opt.id} value={opt.code}>{opt.display}</option>
                    ))}
                  </Input>
                </Col>
              )}

              {tbAssessment.assessedForTb === "No" && (
                <Col>
                  <SectionLabel>Developmental Assessment <span style={{ color: "red" }}>*</span></SectionLabel>
                  <Input type="select" name="developmentalAssessment" value={tbAssessment.developmentalAssessment} onChange={handleTb} disabled={loadingCodesets}>
                    <option value="">{loadingCodesets ? "Loading..." : "Select"}</option>
                    {codesets.developmentalAssessment.map((opt) => (
                      <option key={opt.id} value={opt.code}>{opt.display}</option>
                    ))}
                  </Input>
                  {errors.developmentalAssessment && (
                    <span className={classes.error}>{errors.developmentalAssessment}</span>
                  )}
                </Col>
              )}

              {patientAge >= 0 && patientAge <= 2 && (
                <Col>
                  <SectionLabel>Immunisation Complete for Age</SectionLabel>
                  <Input type="select" name="immunisationComplete" value={tbAssessment.immunisationComplete} onChange={handleTb} disabled={loadingCodesets}>
                    <option value="">{loadingCodesets ? "Loading..." : "Select"}</option>
                    {codesets.immunisationComplete.map((opt) => (
                      <option key={opt.id} value={opt.code}>{opt.display}</option>
                    ))}
                  </Input>
                </Col>
              )}
            </FieldRow>
            <FieldRow>
              {patientAge <= 14 && (
                <Col size={3}>
                  <SectionLabel>Mode of Infant Feeding (≤6 months)</SectionLabel>
                  <Input type="select" name="modeOfInfantFeeding" value={tbAssessment.modeOfInfantFeeding} onChange={handleTb}>
                    <option value="">Select</option>
                    <option value="EBF">EBF</option>
                    <option value="EBMS">EBMS</option>
                    <option value="Mixed">Mixed</option>
                  </Input>
                </Col>
              )}
            </FieldRow>

            {/* Known Drug Allergies */}
            <Divider sx={{ my: 2 }} />
            <SubHeading>Known Drug Allergies <span style={{ color: "red" }}>*</span></SubHeading>
            <FieldRow>
              <Col size={12}>
                <Input
                  type="textarea"
                  name="knownDrugAllergies"
                  value={knownDrugAllergies}
                  onChange={(e) => setKnownDrugAllergies(e.target.value)}
                  rows={3}
                  placeholder="Enter known drug allergies (e.g., Penicillin, Sulfa drugs, etc.)"
                  style={{ height: "auto" }}
                />
                {errors.knownDrugAllergies && (
                  <span className={classes.error}>{errors.knownDrugAllergies}</span>
                )}
              </Col>
            </FieldRow>

            <FieldRow>
              <Col size={12}>
                <SectionLabel>Past Medical History (including hospitalisation and surgery)</SectionLabel>
                <Input type="textarea" name="pastMedicalHistory" value={tbAssessment.pastMedicalHistory} onChange={handleTb} rows={2} placeholder="Describe relevant past medical history..." style={{ height: "auto" }} />
              </Col>
            </FieldRow>

            {/* Current Medications */}
            <Divider sx={{ my: 2 }} />
            <SubHeading>Current Medications</SubHeading>
            <Box sx={{ background: "#fff", border: "1px solid #014d88", borderRadius: "4px", padding: "12px 16px" }}>
              {loadingCodesets ? (
                <Typography sx={{ fontSize: "13px", color: "#9e9e9e" }}>Loading medication options...</Typography>
              ) : (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {codesets.currentMedications.map((opt) => (
                    <CheckGroup
                      key={opt.id}
                      name={`meds_${opt.code}`}
                      id={`meds_${opt.code}`}
                      label={opt.display}
                      checked={currentMeds.includes(opt.code)}
                      onChange={(e) => handleMedsCheckbox(opt.code, e.target.checked)}
                    />
                  ))}
                </Box>
              )}
            </Box>

            {/* Patient Disclosure */}
            <Divider sx={{ my: 2 }} />
            <SubHeading>Patient Has Disclosed / Can Disclose Status To</SubHeading>
            <Box sx={{ background: "#fff", border: "1px solid #014d88", borderRadius: "4px", padding: "12px 16px" }}>
              {loadingCodesets ? (
                <Typography sx={{ fontSize: "13px", color: "#9e9e9e" }}>Loading disclosure options...</Typography>
              ) : (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {codesets.patientDiscloseStatus.map((opt) => (
                    <CheckGroup
                      key={opt.id}
                      name={`disc_${opt.code}`}
                      id={`disc_${opt.code}`}
                      label={opt.display}
                      checked={disclosure.includes(opt.code)}
                      onChange={(e) => handleDisclosureCheckbox(opt.code, e.target.checked)}
                    />
                  ))}
                </Box>
              )}
            </Box>

            {/* Show "Other (specify)" text field if "Other" option is selected */}
            {disclosure.some(code => code.toLowerCase().includes('other') || code === 'OTHER') && (
              <FieldRow style={{ marginTop: "12px" }}>
                <Col size={12}>
                  <SectionLabel>Specify <span style={{ color: "red" }}>*</span></SectionLabel>
                  <Input
                    type="text"
                    value={disclosureOtherText}
                    onChange={(e) => setDisclosureOtherText(e.target.value)}
                    placeholder="Please specify other disclosure details..."
                  />
                  {errors.disclosureOtherText && (
                    <span className={classes.error}>{errors.disclosureOtherText}</span>
                  )}
                </Col>
              </FieldRow>
            )}

            {/* ARV Side Effects */}
            <Divider sx={{ my: 2 }} />
            <SubHeading>Past or Current Medication Side Effects</SubHeading>
            <FieldRow>
              <Col>
                <SectionLabel>Side Effects Present?</SectionLabel>
                <Input type="select" name="hasSideEffects" value={arvSideEffects.hasSideEffects} onChange={handleSideEffects}>
                  <option value="">Select</option>
                  <option value="None">None</option>
                  <option value="Yes">Yes</option>
                </Input>
              </Col>
            </FieldRow>

            {/* Row 2: Side Effects Detail, Specify Medication(s) - Only if Side Effects Present */}
            {arvSideEffects.hasSideEffects === "Yes" && (
              <FieldRow>
                <Col>
                  <SectionLabel>Side Effects Detail</SectionLabel>
                  <Input type="textarea" name="sideEffectsDetail" value={arvSideEffects.sideEffectsDetail} onChange={handleSideEffects} rows={2} style={{ height: "auto" }} placeholder="Describe side effects..." />
                </Col>
                <Col>
                  <SectionLabel>Specify Medication(s)</SectionLabel>
                  <Input type="text" name="specifyMedication" value={arvSideEffects.specifyMedication} onChange={handleSideEffects} placeholder="Name the medication(s)" />
                </Col>
              </FieldRow>
            )}
          </FormAccordion>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/*  SECTION 3: PREVIOUSLY ARV EXPOSURE                           */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <FormAccordion panel="arv" title="Previously ARV Exposure" index={2} expanded={expanded} onToggle={toggleAccordion}>
            <FieldRow>
              <Col>
                <SectionLabel>Previous ARV Exposure</SectionLabel>
                <Input type="select" name="previousArvExposure" value={arvHistory.previousArvExposure} onChange={handleArv}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Input>
              </Col>
            </FieldRow>

            {arvHistory.previousArvExposure === "Yes" && (
              <>
                <SubHeading>ARV Exposure Type</SubHeading>
                <Box sx={{ background: "#fff", border: "1px solid #014d88", borderRadius: "4px", padding: "12px 16px", marginBottom: "16px" }}>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    <CheckGroup name="earlierArvNotTransfer" id="arv_earlier" label="Earlier ARV (not a Transfer-in)" checked={arvHistory.earlierArvNotTransfer} onChange={handleArv} />
                    <CheckGroup name="prep" id="arv_prep" label="PrEP" checked={arvHistory.prep} onChange={handleArv} />
                    <CheckGroup name="pep" id="arv_pep" label="PEP" checked={arvHistory.pep} onChange={handleArv} />
                    <CheckGroup name="tran" id="arv_tran" label="Transfer-in" checked={arvHistory.tran} onChange={handleArv} />
                  </Box>
                </Box>

                <SubHeading>Facility &amp; Duration</SubHeading>
                <FieldRow>
                  <Col>
                    <SectionLabel>Name of Facility</SectionLabel>
                    <Input type="text" name="nameOfFacility" value={arvHistory.nameOfFacility} onChange={handleArv} placeholder="Facility where patient received ARV" />
                  </Col>
                </FieldRow>
                <FieldRow>
                  <Col>
                    <SectionLabel>Duration of Care From</SectionLabel>
                    <Input
                      type="date"
                      name="durationOfCareFrom"
                      value={arvHistory.durationOfCareFrom}
                      onChange={handleArv}
                      max={arvHistory.durationOfCareTo || undefined}
                    />
                  </Col>
                  <Col>
                    <SectionLabel>Duration of Care To</SectionLabel>
                    <Input
                      type="date"
                      name="durationOfCareTo"
                      value={arvHistory.durationOfCareTo}
                      onChange={handleArv}
                      min={arvHistory.durationOfCareFrom || undefined}
                      style={{ borderColor: arvHistoryErrors.durationOfCareTo ? "#d32f2f" : "" }}
                    />
                    {arvHistoryErrors.durationOfCareTo && (
                      <span className={classes.error}>{arvHistoryErrors.durationOfCareTo}</span>
                    )}
                  </Col>
                </FieldRow>
              </>
            )}

            {arvHistory.previousArvExposure === "No" && (
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
                border: "1px solid #014d88",
                borderRadius: "4px",
                padding: "16px",
                marginBottom: "20px",
              }}
            >
              {/* Row 1: Temperature, BP, Pulse */}
              <div className="row">
                <Col size={4}>
                  <SectionLabel>Temperature (°C)</SectionLabel>
                  <Input
                    type="text"
                    name="temperature"
                    value={vitals.temperature}
                    onChange={handleVitals}
                    placeholder="°C"
                    style={{ borderColor: vitalsErrors.temperature ? "#d32f2f" : "" }}
                  />
                  {vitalsErrors.temperature && (
                    <span className={classes.error}>{vitalsErrors.temperature}</span>
                  )}
                </Col>
                <div className="form-group mb-3 col-md-4">
                  <SectionLabel>Blood Pressure (mmHg)</SectionLabel>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <Input
                        type="text"
                        name="bpSystolic"
                        value={vitals.bpSystolic}
                        onChange={handleVitals}
                        placeholder="Sys"
                        style={{ borderColor: vitalsErrors.bpSystolic ? "#d32f2f" : "" }}
                      />
                      {vitalsErrors.bpSystolic && (
                        <span className={classes.error}>{vitalsErrors.bpSystolic}</span>
                      )}
                    </div>
                    <span style={{ color: "#546e7a", fontSize: "18px", fontWeight: 300 }}>/</span>
                    <div style={{ flex: 1 }}>
                      <Input
                        type="text"
                        name="bpDiastolic"
                        value={vitals.bpDiastolic}
                        onChange={handleVitals}
                        placeholder="Dia"
                        style={{ borderColor: vitalsErrors.bpDiastolic ? "#d32f2f" : "" }}
                      />
                      {vitalsErrors.bpDiastolic && (
                        <span className={classes.error}>{vitalsErrors.bpDiastolic}</span>
                      )}
                    </div>
                  </div>
                </div>
                <Col size={4}>
                  <SectionLabel>Pulse (bpm)</SectionLabel>
                  <Input
                    type="text"
                    name="pulse"
                    value={vitals.pulse}
                    onChange={handleVitals}
                    placeholder="bpm"
                    style={{ borderColor: vitalsErrors.pulse ? "#d32f2f" : "" }}
                  />
                  {vitalsErrors.pulse && (
                    <span className={classes.error}>{vitalsErrors.pulse}</span>
                  )}
                </Col>
              </div>

              {/* Row 2: Weight, Height, BMI */}
              <div className="row" style={{ marginTop: "8px" }}>
                <Col size={4}>
                  <SectionLabel>Weight (kg)</SectionLabel>
                  <Input
                    type="text"
                    name="weight"
                    value={vitals.weight}
                    onChange={handleVitals}
                    placeholder="kg"
                    style={{ borderColor: vitalsErrors.weight ? "#d32f2f" : "" }}
                  />
                  {vitalsErrors.weight && (
                    <span className={classes.error}>{vitalsErrors.weight}</span>
                  )}
                </Col>
                <Col size={4}>
                  <SectionLabel>Height (cm)</SectionLabel>
                  <Input
                    type="text"
                    name="height"
                    value={vitals.height}
                    onChange={handleVitals}
                    placeholder="cm"
                    style={{ borderColor: vitalsErrors.height ? "#d32f2f" : "" }}
                  />
                  {vitalsErrors.height && (
                    <span className={classes.error}>{vitalsErrors.height}</span>
                  )}
                </Col>
                <Col size={4}>
                  <SectionLabel>BMI (kg/m²)</SectionLabel>
                  <Input
                    type="text"
                    value={bmi}
                    readOnly
                    placeholder="Auto-calculated"
                    style={{
                      backgroundColor: "#f5f5f5",
                      cursor: "not-allowed",
                      fontWeight: bmi ? "600" : "400",
                      color: bmi ? "#014d88" : "#9e9e9e"
                    }}
                  />
                </Col>
              </div>

              {/* Row 3: Head Circumference (if age ≤ 15), Surface Area, Respiratory Rate */}
              <div className="row" style={{ marginTop: "8px" }}>
                {patientAge <= 15 && (
                  <Col size={4}>
                    <SectionLabel>Head Circumference (cm)</SectionLabel>
                    <Input
                      type="text"
                      name="headCircumference"
                      value={vitals.headCircumference}
                      onChange={handleVitals}
                      placeholder="cm"
                    />
                  </Col>
                )}
                <Col size={4}>
                  <SectionLabel>Surface Area (m²)</SectionLabel>
                  <Input
                    type="text"
                    name="surfaceArea"
                    value={vitals.surfaceArea}
                    onChange={handleVitals}
                    placeholder="m²"
                  />
                </Col>
                <Col size={4}>
                  <SectionLabel>Respiratory Rate (breaths/min)</SectionLabel>
                  <Input
                    type="text"
                    name="respiratoryRate"
                    value={vitals.respiratoryRate}
                    onChange={handleVitals}
                    placeholder="breaths/min"
                  />
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
            />
            <BodySystem label="Gastrointestinal" systemKey="gastrointestinal" state={systems.gastrointestinal} onChange={handleSystem} />
            <BodySystem
              label="Genitalia"
              systemKey="genitalia"
              state={systems.genitalia}
              onChange={handleSystem}
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
            <SubHeading>Assessment <span style={{ color: "red" }}>*</span></SubHeading>
            <Box sx={{ background: "#fff", border: "1px solid #014d88", borderRadius: "4px", padding: "12px 16px", marginBottom: "16px" }}>
              {loadingCodesets ? (
                <Typography sx={{ fontSize: "13px", color: "#9e9e9e" }}>Loading assessment options...</Typography>
              ) : (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {codesets.assessment.map((opt) => (
                    <CheckGroup
                      key={opt.id}
                      name={`assessment_${opt.code}`}
                      id={`assessment_${opt.code}`}
                      label={opt.display}
                      checked={assessment.assessmentItems?.includes(opt.code) || false}
                      onChange={(e) => handleCheckboxArray('assessmentItems', opt.code, e.target.checked)}
                    />
                  ))}
                </Box>
              )}
            </Box>
            {errors.assessmentItems && (
              <Typography sx={{ fontSize: "12px", color: "#d32f2f", marginTop: "-12px", marginBottom: "16px" }}>
                {errors.assessmentItems}
              </Typography>
            )}

            {/* WHO Stage */}
            <FieldRow>
              <Col>
                <SectionLabel>
                  WHO Stage <span style={{ color: "red" }}>*</span>
                </SectionLabel>
                <Input type="select" name="whoStage" value={assessment.whoStage} onChange={handleAssessment} disabled={loadingCodesets}>
                  <option value="">{loadingCodesets ? "Loading..." : "Select WHO Stage"}</option>
                  {codesets.whoStage.map((opt) => (
                    <option key={opt.id} value={opt.code}>{opt.display}</option>
                  ))}
                </Input>
                {errors.whoStage && (
                  <span className={classes.error}>{errors.whoStage}</span>
                )}
              </Col>
            </FieldRow>

            {/* WHO Stage Criteria - Conditional Transfer List */}
            {assessment.whoStage && WHO_STAGE_CRITERIA_OPTIONS[assessment.whoStage] && (
              <TransferList
                availableItems={WHO_STAGE_CRITERIA_OPTIONS[assessment.whoStage]}
                selectedItems={assessment.whoStageCriteria}
                onTransfer={handleWhoStageCriteriaTransfer}
                stageName={codesets.whoStage.find(opt => opt.code === assessment.whoStage)?.display || assessment.whoStage}
              />
            )}

            {/* Enrol In */}
            <Divider sx={{ my: 2 }} />
            <SubHeading>Enrol In</SubHeading>
            <Box sx={{ background: "#fff", border: "1px solid #014d88", borderRadius: "4px", padding: "12px 16px", marginBottom: "16px" }}>
              {loadingCodesets ? (
                <Typography sx={{ fontSize: "13px", color: "#9e9e9e" }}>Loading enrollment options...</Typography>
              ) : (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {codesets.enrollIn.map((opt) => (
                    <CheckGroup
                      key={opt.id}
                      name={`enroll_${opt.code}`}
                      id={`enroll_${opt.code}`}
                      label={opt.display}
                      checked={assessment.enrollInItems?.includes(opt.code) || false}
                      onChange={(e) => handleCheckboxArray('enrollInItems', opt.code, e.target.checked)}
                    />
                  ))}
                </Box>
              )}
            </Box>

            {/* Plan for ART */}
            <SubHeading>Plan for Antiretroviral Therapy (ART)</SubHeading>
            <Box sx={{ background: "#fff", border: "1px solid #014d88", borderRadius: "4px", padding: "12px 16px", marginBottom: "16px" }}>
              {loadingCodesets ? (
                <Typography sx={{ fontSize: "13px", color: "#9e9e9e" }}>Loading ART plan options...</Typography>
              ) : (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {codesets.planForArt.map((opt) => (
                    <CheckGroup
                      key={opt.id}
                      name={`plan_art_${opt.code}`}
                      id={`plan_art_${opt.code}`}
                      label={opt.display}
                      checked={assessment.planForArtItems?.includes(opt.code) || false}
                      onChange={(e) => handleCheckboxArray('planForArtItems', opt.code, e.target.checked)}
                    />
                  ))}
                </Box>
              )}
            </Box>

            {/* Regimen Selection and Comments */}
            <FieldRow>
              <Col>
                <SectionLabel>First ART Regimen Line</SectionLabel>
                <Input
                  type="select"
                  name="regimenLineId"
                  value={assessment.regimenLineId}
                  onChange={handleAssessment}
                >
                  <option value="">Select regimen line...</option>
                  {regimenLines.map((line) => (
                    <option key={line.id} value={line.id}>
                      {line.description}
                    </option>
                  ))}
                </Input>
              </Col>
              <Col>
                <SectionLabel>First ART Regimen</SectionLabel>
                <Input
                  type="select"
                  name="regimenId"
                  value={assessment.regimenId}
                  onChange={handleAssessment}
                  disabled={!assessment.regimenLineId || loadingRegimens}
                >
                  <option value="">
                    {loadingRegimens
                      ? "Loading regimens..."
                      : assessment.regimenLineId
                        ? "Select regimen..."
                        : "Select regimen line first..."}
                  </option>
                  {regimens.map((regimen) => (
                    <option key={regimen.id} value={regimen.id}>
                      {regimen.description}
                    </option>
                  ))}
                </Input>
              </Col>
            </FieldRow>
            <FieldRow>
              <Col>
                <SectionLabel>Additional Comments</SectionLabel>
                <Input
                  type="textarea"
                  name="additionalComments"
                  value={assessment.additionalComments}
                  onChange={handleAssessment}
                  rows={2}
                  placeholder="Any additional comments..."
                  style={{ height: "auto" }}
                />
              </Col>
            </FieldRow>
            <FieldRow>
              <Col>
                <SectionLabel>Next Appointment Date <span style={{ color: "red" }}>*</span></SectionLabel>
                <Input
                  type="date"
                  name="nextAppointment"
                  value={assessment.nextAppointment}
                  onChange={handleAssessment}
                  min={moment(new Date()).format("YYYY-MM-DD")}
                />
                {errors.nextAppointment && (
                  <span className={classes.error}>{errors.nextAppointment}</span>
                )}
              </Col>
              <Col>
                <SectionLabel>Clinician Name</SectionLabel>
                <Input
                  type="text"
                  value={clinicianName}
                  onChange={(e) => setClinicianName(e.target.value)}
                  placeholder="Full name of clinician"
                />
              </Col>
            </FieldRow>
          </FormAccordion>

          {/* ── Validation Error Alert ────────────────────────────────────── */}
          {errors.vitals && (
            <Alert severity="error" sx={{ marginBottom: "16px" }}>
              {errors.vitals}
            </Alert>
          )}
          {errors.pregnancy && (
            <Alert severity="error" sx={{ marginBottom: "16px" }}>
              {errors.pregnancy}
            </Alert>
          )}

          </fieldset>

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
              startIcon={<ArrowBackIcon style={{ color: "#fff" }} />}
              style={{ backgroundColor: "#992E62", color: "#fff" }}
              onClick={() =>
                props.setActiveContent({ ...props.activeContent, route: "recent-history" })
              }
              type="button"
            >
              <span style={{ textTransform: "capitalize", color: "#fff" }}>Back</span>
            </MatButton>
            {isReadOnly ? (
              <MatButton
                variant="contained"
                startIcon={<EditIcon style={{ color: "#fff" }} />}
                style={{ backgroundColor: "#014d88", color: "#fff" }}
                onClick={() =>
                  props.setActiveContent({
                    ...props.activeContent,
                    route: "initial-clinical-evaluation-update",
                    actionType: "update",
                  })
                }
                type="button"
              >
                <span style={{ textTransform: "capitalize", color: "#fff" }}>Edit</span>
              </MatButton>
            ) : (
              <MatButton
                type="submit"
                variant="contained"
                startIcon={<SaveIcon style={{ color: "#fff" }} />}
                style={{ backgroundColor: "#014d88", color: "#fff" }}
                disabled={saving}
              >
                <span style={{ textTransform: "capitalize", color: "#fff" }}>
                  {saving ? (recordId ? "Updating..." : "Saving...") : (recordId ? "Update" : "Save")}
                </span>
              </MatButton>
            )}
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default InitialClinicalEvaluationForm;
