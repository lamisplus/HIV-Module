import React, { useState, useEffect } from "react";
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
  const [codesets, setCodesets] = useState({
    careEntryPoints: [],
    priorArt: [],
    kpTypology: [],
    clinicalStages: [],
    mode_of_hiv_test: [],
    cd4_lf:[]
  });
  const [loadingCodesets, setLoadingCodesets] = useState(true);
  const [regimenLines, setRegimenLines] = useState([]);
  const [regimens, setRegimens] = useState([]);
  const [loadingRegimens, setLoadingRegimens] = useState(false);
  const [hasExistingRecord, setHasExistingRecord] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(true);

  // ── Check if patient already has enrollment-commencement record ──────────
  useEffect(() => {
    checkForExistingRecord();
  }, [props.patientObj.id]);

  const checkForExistingRecord = async () => {
    setCheckingExisting(true);
    try {
      const response = await axios.get(
        `${baseUrl}hiv/enrollment-commencement/check-exists/person/${props.patientObj.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data === true) {
        setHasExistingRecord(true);
        toast.warning("This patient already has an Enrollment & Commencement record. Only one record is allowed per patient.");
      }
    } catch (error) {
      console.error("Error checking for existing record:", error);
    } finally {
      setCheckingExisting(false);
    }
  };

  // ── Fetch Codesets from API ──────────────────────────────────────────────
  useEffect(() => {
    fetchCodesets();
    fetchRegimenLines();
  }, []);

  const fetchCodesets = async () => {
    setLoadingCodesets(true);
    try {
      const params = new URLSearchParams();
      params.append('codes', 'POINT_ENTRY');
      params.append('codes', 'FACILITY_HTS_TEST_SETTING');
      params.append('codes', 'TARGET_GROUP');
      params.append('codes', 'CLINICAL_STAGE');
      params.append('codes', 'PREVIOUSLY_KNOWN_HIV_+VE_STATUS');
      params.append('codes', 'VISITECT_CD4_TEST_RESULT');

      const response = await axios.get(
        `${baseUrl}application-codesets/v2/codeSets?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Codeset API Response:", response.data);

      setCodesets({
        careEntryPoints: response.data.POINT_ENTRY || [],
        priorArt: response.data['PREVIOUSLY_KNOWN_HIV_+VE_STATUS'] || [],
        kpTypology: response.data.TARGET_GROUP || [],
        clinicalStages: response.data.CLINICAL_STAGE || [],
        mode_of_hiv_test: response.data.FACILITY_HTS_TEST_SETTING || [],
        cd4_lf: response.data.VISITECT_CD4_TEST_RESULT || [],
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

  // Helper to find codeset ID by code pattern
  const getCodesetIdByCode = (codesetArray, codePattern) => {
    const found = codesetArray.find(item => item.code?.includes(codePattern));
    return found ? found.id : null;
  };

  // Fetch Regimen Lines based on patient age
  const fetchRegimenLines = async () => {
    try {
      const endpoint = isPediatric
        ? `${baseUrl}hiv/regimen/arv/children`
        : `${baseUrl}hiv/regimen/arv/adult`;

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Filter for ART regimen lines only
      const artLines = isPediatric
        ? response.data.filter((x) => x.id === 3 || x.id === 4 || x.id === 16)
        : response.data.filter((x) => x.id === 1 || x.id === 2 || x.id === 14);

      setRegimenLines(artLines);
    } catch (error) {
      console.error("Error fetching regimen lines:", error);
      toast.error("Failed to load regimen lines");
    }
  };

  // Fetch specific regimens when regimen line is selected
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

  const toggleAccordion = (panel) => {
    setExpanded((prev) =>
      prev.includes(panel) ? prev.filter((p) => p !== panel) : [...prev, panel]
    );
  };

  // ── Section 1: Patient Registration Details ─────────────────────────────
  const [registration, setRegistration] = useState({
    date_enrolled_in_hiv_care: "",
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

    // Handle dependent field clearing
    if (name === 'is_kp') {
      // Clear kp_typology when is_kp changes to "No" or empty
      if (value !== 'Yes') {
        setRegistration((prev) => ({
          ...prev,
          [name]: value,
          kp_typology: ""
        }));
      } else {
        setRegistration((prev) => ({ ...prev, [name]: value }));
      }
    } else if (name === 'care_entry_point') {
      // Clear transfer-related fields when care_entry_point changes away from "Transfer In"
      const transferInId = getCodesetIdByCode(codesets.careEntryPoints, "TRANSFER");
      if (value != transferInId) {
        setRegistration((prev) => ({
          ...prev,
          [name]: value,
          date_transferred_in: "",
          facility_transferred_from: ""
        }));
      } else {
        setRegistration((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setRegistration((prev) => ({ ...prev, [name]: value }));
    }

    // Real-time validation — clear error if field becomes valid
    if (errors[name]) {
      const newErrors = { ...errors };

      // Always-required fields
      if (['date_enrolled_in_hiv_care', 'date_confirmed_hiv_test', 'hiv_test_location',
           'mode_of_hiv_test', 'care_entry_point', 'prior_art'].includes(name)) {
        if (value && String(value).trim() !== '') {
          delete newErrors[name];
        }
      }

      // Conditionally required — mother_unique_id
      if (name === 'mother_unique_id' && isInfant) {
        if (value && String(value).trim() !== '') {
          delete newErrors[name];
        }
      }

      // Conditionally required — kp_typology
      if (name === 'kp_typology' && registration.is_kp === 'Yes') {
        if (value && String(value).trim() !== '') {
          delete newErrors[name];
        }
      }

      // Conditionally required — date_transferred_in
      const transferInId = getCodesetIdByCode(codesets.careEntryPoints, "TRANSFER");
      if (name === 'date_transferred_in' && registration.care_entry_point == transferInId) {
        if (value && String(value).trim() !== '') {
          delete newErrors[name];
        }
      }

      // Conditionally required — facility_transferred_from
      if (name === 'facility_transferred_from' && registration.date_transferred_in &&
          String(registration.date_transferred_in).trim() !== '') {
        if (value && String(value).trim() !== '') {
          delete newErrors[name];
        }
      }

      // Special case: If care_entry_point changes away from Transfer-in, clear transfer errors
      if (name === 'care_entry_point' && value != transferInId) {
        delete newErrors.date_transferred_in;
        delete newErrors.facility_transferred_from;
      }

      // Special case: If is_kp changes to "No", clear kp_typology error
      if (name === 'is_kp' && value !== 'Yes') {
        delete newErrors.kp_typology;
      }

      setErrors(newErrors);
    }
  };

  const [commencement, setCommencement] = useState({
    clinical_stage_at_art_start: "",
    cd4_at_art_start: "",
    cd4_lf: "",
    date_adherence_counseling_completed: "",
    date_art_started: "",
    regimen_line_id: "",
    first_art_regimen: "",
    weight_kg: "",
    height_cm: "",
    bmi: "",
    muac: "",
    muac_indication: "",
    is_pregnant: "",
    pregnancy_status: "",
    tb_preventive_therapy: {
      medication: "",
      code: "",
      dose: "",
      start_date: "",
      completion_date: "",
    },
  });

  const handleCommencement = (e) => {
    const { name, value } = e.target;

    // If regimen line changes, fetch regimens for that line
    if (name === "regimen_line_id") {
      fetchRegimens(value);
      setCommencement((prev) => ({
        ...prev,
        regimen_line_id: value,
        first_art_regimen: "" // Clear selected regimen when line changes
      }));
      return;
    }

    // Handle dependent field clearing for pregnancy
    if (name === "is_pregnant" && value !== "Yes") {
      setCommencement((prev) => {
        const updated = { ...prev, [name]: value, pregnancy_status: "" };
        const w = prev.weight_kg;
        const h = prev.height_cm;
        updated.bmi = calcBmi(w, h);
        const muacVal = prev.muac;
        updated.muac_indication = calcMuacIndication(muacVal);
        return updated;
      });
    } else {
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
    }

    if (errors[name]) {
      const newErrors = { ...errors };
      if (name === 'date_art_started' && value && String(value).trim() !== '') {
        delete newErrors[name];
      }

      setErrors(newErrors);
    }
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

    if (!registration.date_enrolled_in_hiv_care || String(registration.date_enrolled_in_hiv_care).trim() === '') {
      temp.date_enrolled_in_hiv_care = "Date enrolled in HIV care is required";
    }

    if (!registration.date_confirmed_hiv_test || String(registration.date_confirmed_hiv_test).trim() === '') {
      temp.date_confirmed_hiv_test = "Date of confirmed HIV test is required";
    }

    if (!registration.hiv_test_location || String(registration.hiv_test_location).trim() === '') {
      temp.hiv_test_location = "HIV test location is required";
    }

    if (!registration.mode_of_hiv_test || String(registration.mode_of_hiv_test).trim() === '') {
      temp.mode_of_hiv_test = "Mode of HIV test is required";
    }

    if (!registration.care_entry_point || String(registration.care_entry_point).trim() === '') {
      temp.care_entry_point = "Care entry point is required";
    }

    if (!registration.prior_art || String(registration.prior_art).trim() === '') {
      temp.prior_art = "Prior ART status is required";
    }


    if (!commencement.date_art_started || String(commencement.date_art_started).trim() === '') {
      temp.date_art_started = "Date ART started is required";
    }

    // 1. Mother's Unique ID — Required if patient age < 2 years (infant)
    if (isInfant && (!registration.mother_unique_id || String(registration.mother_unique_id).trim() === '')) {
      temp.mother_unique_id = "Mother's Unique ID is required for infants (age < 2 years)";
    }

    // 2. KP Typology — Required if is_kp = "Yes"
    if (registration.is_kp === 'Yes' && (!registration.kp_typology || String(registration.kp_typology).trim() === '')) {
      temp.kp_typology = "KP Typology is required when patient is a Key Population";
    }

    // 3. Transfer-in date — Required if care_entry_point is Transfer-in
    const transferInId = getCodesetIdByCode(codesets.careEntryPoints, "TRANSFER");
    if (registration.care_entry_point == transferInId && (!registration.date_transferred_in || String(registration.date_transferred_in).trim() === '')) {
      temp.date_transferred_in = "Transfer-in date is required when care entry point is 'Transfer-in'";
    }

    // 4. Facility Transferred From — Required if date_transferred_in is provided
    if (registration.date_transferred_in && String(registration.date_transferred_in).trim() !== '' &&
        (!registration.facility_transferred_from || String(registration.facility_transferred_from).trim() === '')) {
      temp.facility_transferred_from = "Facility transferred from is required when transfer-in date is provided";
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill all required fields");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        personId: props.patientObj.id,
        data: {
          registration,
          commencement,
        },
      };
      await axios.post(`${baseUrl}hiv/enrollment-commencement`, payload, {
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

  // Show loading state while checking for existing record
  if (checkingExisting) {
    return (
      <Card className={classes.root} style={{ borderRadius: "12px" }}>
        <CardContent>
          <Box sx={{ textAlign: "center", padding: "40px" }}>
            <Typography>Checking existing records...</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Show message if record already exists
  if (hasExistingRecord) {
    return (
      <Card className={classes.root} style={{ borderRadius: "12px" }}>
        <CardContent>
          <Box
            sx={{
              backgroundColor: "#ff9800",
              padding: "14px 20px",
              marginBottom: "20px",
              borderRadius: "8px",
            }}
          >
            <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>
              Record Already Exists
            </Typography>
          </Box>
          <Box sx={{ padding: "20px", textAlign: "center" }}>
            <Typography sx={{ fontSize: "14px", marginBottom: "20px" }}>
              This patient already has an Enrollment & Commencement record.
              This is a one-off form and only one record is allowed per patient.
            </Typography>
            <Typography sx={{ fontSize: "14px", marginBottom: "20px" }}>
              You can view or update the existing record from the Recent Activities history tab.
            </Typography>
            <MatButton
              variant="contained"
              style={{ backgroundColor: "#014d88", marginTop: "10px" }}
              onClick={() =>
                props.setActiveContent({
                  ...props.activeContent,
                  route: "recent-history",
                })
              }
            >
              Go to Recent Activities
            </MatButton>
          </Box>
        </CardContent>
      </Card>
    );
  }

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
                <SectionLabel>
                  Date of Confirmed HIV Test{" "}
                  <span style={{ color: "red" }}>*</span>
                </SectionLabel>
                <Input
                  type="date"
                  name="date_confirmed_hiv_test"
                  value={registration.date_confirmed_hiv_test}
                  max={registration.date_enrolled_in_hiv_care || moment(new Date()).format("YYYY-MM-DD")}
                  onChange={handleReg}
                />
                {errors.date_confirmed_hiv_test && (
                  <span className={classes.error}>
                    {errors.date_confirmed_hiv_test}
                  </span>
                )}
              </Col>
              <Col size={3}>
                <SectionLabel>
                  HIV Test Location{" "}
                  <span style={{ color: "red" }}>*</span>
                </SectionLabel>
                <Input
                  type="text"
                  name="hiv_test_location"
                  value={registration.hiv_test_location}
                  onChange={handleReg}
                  placeholder="e.g. ANC, HTS Site"
                />
                {errors.hiv_test_location && (
                  <span className={classes.error}>
                    {errors.hiv_test_location}
                  </span>
                )}
              </Col>
              <Col size={3}>
                <SectionLabel>
                  Mode of HIV Test{" "}
                  <span style={{ color: "red" }}>*</span>
                </SectionLabel>
                <Input
                  type="select"
                  name="mode_of_hiv_test"
                  value={registration.mode_of_hiv_test}
                  onChange={handleReg}
                  disabled={loadingCodesets}
                >
                  <option value="">{loadingCodesets ? "Loading..." : "Select"}</option>
                  {codesets.mode_of_hiv_test.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.display}</option>
                  ))}
                </Input>
                {errors.mode_of_hiv_test && (
                  <span className={classes.error}>
                    {errors.mode_of_hiv_test}
                  </span>
                )}
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
                  disabled={loadingCodesets}
                >
                  <option value="">{loadingCodesets ? "Loading..." : "Select"}</option>
                  {codesets.careEntryPoints.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.display}
                    </option>
                  ))}
                </Input>
                {errors.care_entry_point && (
                  <span className={classes.error}>
                    {errors.care_entry_point}
                  </span>
                )}
              </Col>
              {registration.care_entry_point == getCodesetIdByCode(codesets.careEntryPoints, "OTHERS") && (
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
              {isInfant && (
                <Col size={3}>
                  <SectionLabel>
                    Mother's Unique ID
                    <span style={{ color: "red" }}> *</span>
                  </SectionLabel>
                  <Input
                    type="text"
                    name="mother_unique_id"
                    value={registration.mother_unique_id}
                    onChange={handleReg}
                    placeholder="Required for infants < 2 yrs"
                  />
                  {errors.mother_unique_id && (
                    <span className={classes.error}>
                      {errors.mother_unique_id}
                    </span>
                  )}
                </Col>
              )}
            </FieldRow>

            {/* Prior ART & KP Typology */}
            <Divider sx={{ my: 2 }} />
            <SubHeading>Prior ART &amp; Key Population</SubHeading>
            <FieldRow>
              <Col size={4}>
                <SectionLabel>
                  Prior ART{" "}
                  <span style={{ color: "red" }}>*</span>
                </SectionLabel>
                <Input
                  type="select"
                  name="prior_art"
                  value={registration.prior_art}
                  onChange={handleReg}
                  disabled={loadingCodesets}
                >
                  <option value="">{loadingCodesets ? "Loading..." : "Select"}</option>
                  {codesets.priorArt.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.display}
                    </option>
                  ))}
                </Input>
                {errors.prior_art && (
                  <span className={classes.error}>
                    {errors.prior_art}
                  </span>
                )}
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
                  <SectionLabel>
                    KP Typology{" "}
                    <span style={{ color: "red" }}>*</span>
                  </SectionLabel>
                  <Input
                    type="select"
                    name="kp_typology"
                    value={registration.kp_typology}
                    onChange={handleReg}
                    disabled={loadingCodesets}
                  >
                    <option value="">{loadingCodesets ? "Loading..." : "Select"}</option>
                    {codesets.kpTypology.map((opt) => (
                      <option key={opt.id} value={opt.id}>{opt.display}</option>
                    ))}
                  </Input>
                  {errors.kp_typology && (
                    <span className={classes.error}>
                      {errors.kp_typology}
                    </span>
                  )}
                </Col>
              )}
            </FieldRow>

            {/* Transfer Info */}
            {registration.care_entry_point == getCodesetIdByCode(codesets.careEntryPoints, "TRANSFER") && (
              <>
                <Divider sx={{ my: 2 }} />
                <SubHeading>Transfer Details</SubHeading>
                <FieldRow>
                  <Col size={3}>
                    <SectionLabel>
                      Date Transferred In{" "}
                      <span style={{ color: "red" }}>*</span>
                    </SectionLabel>
                    <Input
                      type="date"
                      name="date_transferred_in"
                      value={registration.date_transferred_in}
                      max={registration.date_enrolled_in_hiv_care || moment(new Date()).format("YYYY-MM-DD")}
                      onChange={handleReg}
                    />
                    {errors.date_transferred_in && (
                      <span className={classes.error}>
                        {errors.date_transferred_in}
                      </span>
                    )}
                  </Col>
                  <Col size={5}>
                    <SectionLabel>
                      Facility Transferred From
                      {registration.date_transferred_in && registration.date_transferred_in.trim() !== "" && (
                        <span style={{ color: "red" }}> *</span>
                      )}
                    </SectionLabel>
                    <Input
                      type="text"
                      name="facility_transferred_from"
                      value={registration.facility_transferred_from}
                      onChange={handleReg}
                      placeholder="Name of sending facility"
                    />
                    {errors.facility_transferred_from && (
                      <span className={classes.error}>
                        {errors.facility_transferred_from}
                      </span>
                    )}
                  </Col>
                </FieldRow>
              </>
            )}
          </FormAccordion>

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
                  disabled={loadingCodesets}
                >
                  <option value="">{loadingCodesets ? "Loading..." : "Select"}</option>
                  {codesets.clinicalStages.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.display}</option>
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
                  disabled={loadingCodesets}
                >
                  <option value="">{loadingCodesets ? "Loading..." : "Select"}</option>
                  {codesets.cd4_lf.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.display}
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
                  min={registration.date_enrolled_in_hiv_care}
                  max={moment(new Date()).format("YYYY-MM-DD")}
                  onChange={handleCommencement}
                />
                {errors.date_art_started && (
                  <span className={classes.error}>
                    {errors.date_art_started}
                  </span>
                )}
              </Col>
            </FieldRow>

            <FieldRow>
              <Col size={3}>
                <SectionLabel>{isPediatric ? "Child" : "Adult"} Regimen Line</SectionLabel>
                <Input
                  type="select"
                  name="regimen_line_id"
                  value={commencement.regimen_line_id}
                  onChange={handleCommencement}
                >
                  <option value="">Select regimen line first...</option>
                  {regimenLines.map((line) => (
                    <option key={line.id} value={line.id}>
                      {line.description}
                    </option>
                  ))}
                </Input>
              </Col>
              <Col size={5}>
                <SectionLabel>First ART Regimen</SectionLabel>
                <Input
                  type="select"
                  name="first_art_regimen"
                  value={commencement.first_art_regimen}
                  onChange={handleCommencement}
                  disabled={!commencement.regimen_line_id || loadingRegimens}
                >
                  <option value="">
                    {!commencement.regimen_line_id
                      ? "Select regimen line first..."
                      : loadingRegimens
                      ? "Loading..."
                      : "Select regimen..."}
                  </option>
                  {regimens.map((regimen) => (
                    <option key={regimen.id} value={regimen.id}>
                      {regimen.description}
                    </option>
                  ))}
                </Input>
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
                  <>
                    <Col size={2}>
                      <SectionLabel>Is Pregnant?</SectionLabel>
                      <Input
                        type="select"
                        name="is_pregnant"
                        value={commencement.is_pregnant}
                        onChange={handleCommencement}
                      >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </Input>
                    </Col>
                    {commencement.is_pregnant === "Yes" && (
                      <Col size={3}>
                        <SectionLabel>Pregnancy Status</SectionLabel>
                        <Input
                          type="select"
                          name="pregnancy_status"
                          value={commencement.pregnancy_status}
                          onChange={handleCommencement}
                        >
                          <option value="">Select</option>
                          <option value="Pregnant">Pregnant</option>
                          <option value="Breastfeeding">Breastfeeding</option>
                        </Input>
                      </Col>
                    )}
                  </>
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
                    min={registration.date_enrolled_in_hiv_care}
                    max={moment(new Date()).format("YYYY-MM-DD")}
                    onChange={handleTpt}
                  />
                </Col>
                <Col size={2}>
                  <SectionLabel>Completion Date</SectionLabel>
                  <Input
                    type="date"
                    name="completion_date"
                    value={commencement.tb_preventive_therapy.completion_date}
                    min={commencement.tb_preventive_therapy.start_date}
                    max={moment(new Date()).format("YYYY-MM-DD")}
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
