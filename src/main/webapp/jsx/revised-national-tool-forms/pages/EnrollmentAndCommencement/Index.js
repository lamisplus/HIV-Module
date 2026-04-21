import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Input } from "reactstrap";
import * as moment from "moment";
import Select from "react-select";
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
import EditIcon from "@material-ui/icons/Edit";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
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

const Col = ({ size = 6, children }) => (
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
      disableGutters
      sx={{
        width: "100%",
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
          width: "100% !important",
          margin: "0 !important",
          "& .MuiAccordionSummary-content": {
            margin: "16px 0 !important",
            width: "100%",
          },
        }}
      >
        <Typography
          sx={{ color: "#fff", fontWeight: 700, fontSize: "15px", letterSpacing: "0.3px" }}
        >
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{ padding: "20px 24px", background: "#fff", width: "100%" }}
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

  // ── Determine Mode ─────────────────────────────────────────────────────────
  // Mode can be: 'create', 'edit', or 'view'
  // Determine based on props.mode OR activeContent.route
  const getMode = () => {
    if (props.mode) return props.mode;
    const route = props.activeContent?.route;
    if (route === 'enrollment-and-commencement-update') return 'edit';
    if (route === 'enrollment-and-commencement-view') return 'view';
    return 'create';
  };

  const mode = getMode();
  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create';

  const patientAge = calculate_age_to_number(props.patientObj?.dateOfBirth);
  const isPediatric = patientAge >= 0 && patientAge <= 15;
  const isInfant    = patientAge < 1.5;
  const isFemale    = ["female", "FEMALE", "Female"].includes(props.patientObj?.sex);
  const isMale      = ["male", "MALE", "Male"].includes(props.patientObj?.sex);
  // Pregnancy / breastfeeding only relevant for adult females
  const showPregnancyStatus = isFemale && !isPediatric;

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditMode || isViewMode);
  const [errors, setErrors] = useState({});
  const [expanded, setExpanded] = useState(["registration", "commencement"]);
  const [codesets, setCodesets] = useState({
    careEntryPoints: [],
    priorArt: [],
    kpTypology: [],
    clinicalStages: [],
    mode_of_hiv_test: [],
    cd4_lf: [],
    pregnancyStatus: []
  });
  const [loadingCodesets, setLoadingCodesets] = useState(true);
  const [regimenLines, setRegimenLines] = useState([]);
  const [regimens, setRegimens] = useState([]);
  const [loadingRegimens, setLoadingRegimens] = useState(false);
  const [tptMedications, setTptMedications] = useState([]);
  const [loadingTptMedications, setLoadingTptMedications] = useState(false);
  const [hasExistingRecord, setHasExistingRecord] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [checkingUniqueId, setCheckingUniqueId] = useState(false);

  // ── Facility State ──────────────────────────────────────────────────────
  const [facilities, setFacilities] = useState([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);

  // ── Check if patient already has enrollment-commencement record ──────────
  // Only check for existing record in CREATE mode
  useEffect(() => {
    if (isCreateMode) {
      checkForExistingRecord();
    } else {
      setCheckingExisting(false);
    }
  }, [props.patientObj.id, isCreateMode]);

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
    fetchRegimenLines(); // Fetch regimen lines in all modes for proper display
    fetchTptMedications(); // Fetch TPT medications in all modes for proper display
    fetchFacilities(); // Fetch facilities for transfer-in dropdown
    if (isEditMode || isViewMode) {
      fetchExistingData();
    }
  }, []);

  // ── Fetch Existing Data for Edit/View Mode ──────────────────────────────
  const fetchExistingData = async () => {
    setLoading(true);
    try {
      const endpoint = isViewMode
        ? `${baseUrl}hiv/enrollment-commencement/person/${props.patientObj.id}`
        : `${baseUrl}hiv/enrollment-commencement/${props.activeContent.id}`;

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data;

      // Populate registration fields
      setRegistration({
        unique_id: data.uniqueId || "",
        date_enrolled_in_hiv_care: data.dateEnrolledInHivCare ? moment(data.dateEnrolledInHivCare).format("YYYY-MM-DD") : "",
        mother_unique_id: data.motherUniqueId || "",
        care_entry_point: data.careEntryPointId || "",
        care_entry_point_other: data.careEntryPointOther || "",
        date_transferred_in: data.dateTransferredIn ? moment(data.dateTransferredIn).format("YYYY-MM-DD") : "",
        facility_transferred_from: data.facilityTransferredFrom || "",
        date_confirmed_hiv_test: data.dateConfirmedHivTest ? moment(data.dateConfirmedHivTest).format("YYYY-MM-DD") : "",
        mode_of_hiv_test: data.modeOfHivTestId || "",
        hiv_test_location: data.hivTestLocation || "",
        prior_art: data.priorArtId || "",
        is_kp: data.isKp ? "Yes" : "No",
        kp_typology: data.kpTypologyId || "",
      });

      // Populate commencement fields
      const hasTpt = data.tptMedication || data.tptDose || data.tptStartDate || data.tptCompleted || data.tptCompletionDate;
      setCommencement({
        visit_date: data.visitDate ? moment(data.visitDate).format("YYYY-MM-DD") : "",
        clinical_stage_at_art_start: data.clinicalStageId || "",
        cd4_at_art_start: data.cd4AtArtStart || "",
        cd4_percentage: data.cd4Percentage || "",
        cd4_lf: data.cd4LfId || "",
        date_adherence_counseling_completed: data.dateAdherenceCounselingCompleted ? moment(data.dateAdherenceCounselingCompleted).format("YYYY-MM-DD") : "",
        date_art_started: data.dateArtStarted ? moment(data.dateArtStarted).format("YYYY-MM-DD") : "",
        regimen_line_id: data.regimenLineId || "",
        first_art_regimen: data.regimenId || "",
        weight_kg: data.weightKg || "",
        height_cm: data.heightCm || "",
        bmi: data.bmi || "",
        muac: data.muac || "",
        muac_indication: data.muacIndication || "",
        is_pregnant: data.isPregnant ? "Yes" : "No",
        pregnancy_status: data.pregnancyStatus || "",
        tpt_started: hasTpt,
        tb_preventive_therapy: {
          medication: data.tptMedication || "",
          dose: data.tptDose || "",
          start_date: data.tptStartDate ? moment(data.tptStartDate).format("YYYY-MM-DD") : "",
          tpt_completed: data.tptCompleted || "",
          completion_date: data.tptCompletionDate ? moment(data.tptCompletionDate).format("YYYY-MM-DD") : "",
        },
      });

      // Fetch regimens for the selected regimen line (for edit/view mode)
      if ((isEditMode || isViewMode) && data.regimenLineId) {
        await fetchRegimenLines();
        await fetchRegimens(data.regimenLineId);
      }
    } catch (error) {
      const msg =
        error?.response?.data?.apierror?.message ||
        "Failed to load enrollment data";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const fetchCodesets = async () => {
    setLoadingCodesets(true);
    try {
      const params = new URLSearchParams();
      params.append('codes', 'POINT_ENTRY');
      params.append('codes', 'MODE_HIV_TEST');
      params.append('codes', 'KP_TYPE');
      params.append('codes', 'CLINICAL_STAGE');
      params.append('codes', 'PRIOR_ART');
      params.append('codes', 'VISITECT_CD4_TEST_RESULT');
      params.append('codes', 'PREGNANCY_STATUS');

      const response = await axios.get(
        `${baseUrl}application-codesets/v2/codeSets?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );


      setCodesets({
        careEntryPoints: response.data.POINT_ENTRY || [],
        priorArt: response.data.PRIOR_ART || [],
        kpTypology: response.data.KP_TYPE || [],
        clinicalStages: response.data.CLINICAL_STAGE || [],
        mode_of_hiv_test: response.data.MODE_HIV_TEST || [],
        cd4_lf: response.data.VISITECT_CD4_TEST_RESULT || [],
        pregnancyStatus: response.data.PREGNANCY_STATUS || [],
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

  // Helper to find codeset code by code pattern
  const getCodesetCodeByPattern = (codesetArray, codePattern) => {
    const found = codesetArray.find(item => item.code?.includes(codePattern));
    return found ? found.code : null;
  };

  // Helper to get codeset display value (for view mode)
  const getCodesetDisplay = (codeValue, codesetArray) => {
    if (!codeValue) return "—";
    const item = codesetArray.find(c => c.code === codeValue || c.id === codeValue);
    return item ? item.display : codeValue;
  };

  // Helper to format date for display
  const formatDate = (date) => {
    return date ? moment(date).format("DD-MMM-YYYY") : "—";
  };

  // Helper to filter KP Typology based on gender
  const getFilteredKpTypology = (kpTypologyArray) => {
    return kpTypologyArray.filter(opt => {
      const display = opt.display?.toUpperCase() || '';

      // MSM - only show for males
      if (display.includes('MSM')) {
        return isMale;
      }

      // FSW - only show for females
      if (display.includes('FSW') || display.includes('FEMALE SEX WORKER')) {
        return isFemale;
      }

      // PWID, TG, Persons in custodial centers - always show
      return true;
    });
  };

  // Helper to filter Prior ART options based on Care Entry Point
  const getFilteredPriorArt = (priorArtArray) => {
    // Check if Care Entry Point is Transfer-in
    const transferInCode = getCodesetCodeByPattern(codesets.careEntryPoints, "TRANSFER");
    const isTransferIn = registration.care_entry_point == transferInCode;

    return priorArtArray.filter(opt => {
      // "Transfer in without records" should only show if Care Entry Point is "Transfer-in"
      if (opt.code?.includes('TRANSFER_IN_WITHOUT_RECORDS')) {
        return isTransferIn;
      }

      // All other options are always available
      return true;
    });
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

  // Fetch TPT medications
  const fetchTptMedications = async () => {
    setLoadingTptMedications(true);
    try {
      const response = await axios.get(`${baseUrl}hiv/regimen/types/15`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTptMedications(response.data || []);
    } catch (error) {
      console.error("Error fetching TPT medications:", error);
      toast.error("Failed to load TPT medications");
      setTptMedications([]);
    } finally {
      setLoadingTptMedications(false);
    }
  };

  // Fetch Facilities for transfer-in dropdown
  const fetchFacilities = async () => {
    setLoadingFacilities(true);
    try {
      const response = await axios.get(`${baseUrl}observation/facilities`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Facilities fetched:", response.data);
      setFacilities(response.data || []);
    } catch (error) {
      console.error("Error fetching facilities:", error);
      toast.error("Failed to load facilities");
      setFacilities([]);
    } finally {
      setLoadingFacilities(false);
    }
  };

  const toggleAccordion = (panel) => {
    setExpanded((prev) =>
      prev.includes(panel) ? prev.filter((p) => p !== panel) : [...prev, panel]
    );
  };

  // ── Format Facilities for react-select ─────────────────────────────────
  const getFacilityOptions = () => {
    return facilities.map(facility => ({
      label: facility.name,
      value: facility.name
    }));
  };

  // ── Handle Facility Selection ──────────────────────────────────────────
  const handleFacilitySelect = (selectedOption) => {
    const facilityName = selectedOption ? selectedOption.value : "";
    setRegistration((prev) => ({
      ...prev,
      facility_transferred_from: facilityName
    }));

    // Clear error if facility is selected
    if (facilityName && errors.facility_transferred_from) {
      const newErrors = { ...errors };
      delete newErrors.facility_transferred_from;
      setErrors(newErrors);
    }
  };

  // ── Check if Unique ID already exists ────────────────────────────────────
  const checkUniqueIdExists = async (uniqueId) => {
    if (!uniqueId || String(uniqueId).trim() === '') {
      return;
    }

    setCheckingUniqueId(true);
    try {
      const personId = props.patientObj?.id;
      const url = `${baseUrl}hiv/enrollment-commencement/unique-id-exists?uniqueId=${encodeURIComponent(uniqueId)}${personId ? `&personId=${personId}` : ''}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data === true) {
        setErrors((prev) => ({
          ...prev,
          unique_id: "Unique ID already exists"
        }));
      } else {
        // Clear error if ID is unique
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.unique_id;
          return newErrors;
        });
      }
    } catch (error) {
      console.error("Error checking unique ID:", error);
      // Don't block the user if the check fails - let backend handle it
    } finally {
      setCheckingUniqueId(false);
    }
  };

  // Handler for unique_id onBlur event
  const handleUniqueIdBlur = () => {
    if (registration.unique_id && String(registration.unique_id).trim() !== '') {
      checkUniqueIdExists(registration.unique_id);
    }
  };

  // ── Section 1: Patient Registration Details ─────────────────────────────
  const [registration, setRegistration] = useState({
    unique_id: "",
    date_enrolled_in_hiv_care: "",
    mother_unique_id: "",
    care_entry_point: "",
    care_entry_point_other: "",
    date_transferred_in: "",
    facility_transferred_from: "",
    date_confirmed_hiv_test: "",
    mode_of_hiv_test: "",          // renamed from mode_of_hiv_confirmation
    hiv_test_location: "",
    prior_art: "",
    is_kp: "",
    kp_typology: "",
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
      const transferInCode = getCodesetCodeByPattern(codesets.careEntryPoints, "TRANSFER");
      if (value != transferInCode) {
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

      // Date Enrolled in HIV Care — special validation
      if (name === 'date_enrolled_in_hiv_care' && value && String(value).trim() !== '') {
        const patientRegDate = props.patientObj?.dateOfRegistration;
        const isValidAgainstRegDate = !patientRegDate || value >= patientRegDate;
        const isValidAgainstTestDate = !registration.date_confirmed_hiv_test || value >= registration.date_confirmed_hiv_test;

        if (isValidAgainstRegDate && isValidAgainstTestDate) {
          delete newErrors[name];
        }
      }

      // Always-required fields (excluding date_enrolled_in_hiv_care which has special validation above)
      if (['unique_id', 'date_confirmed_hiv_test', 'hiv_test_location',
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
      const transferInCode = getCodesetCodeByPattern(codesets.careEntryPoints, "TRANSFER");
      if (name === 'date_transferred_in' && registration.care_entry_point == transferInCode) {
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
      if (name === 'care_entry_point' && value != transferInCode) {
        delete newErrors.date_transferred_in;
        delete newErrors.facility_transferred_from;
      }

      // Special case: If is_kp changes to "No", clear kp_typology error
      if (name === 'is_kp' && value !== 'Yes') {
        delete newErrors.kp_typology;
      }

      setErrors(newErrors);
    }

    // Special case: If date_confirmed_hiv_test changes, re-validate date_enrolled_in_hiv_care
    if (name === 'date_confirmed_hiv_test' && errors.date_enrolled_in_hiv_care) {
      const newErrors = { ...errors };
      const enrollmentDate = registration.date_enrolled_in_hiv_care;

      if (enrollmentDate) {
        const patientRegDate = props.patientObj?.dateOfRegistration;
        const isValidAgainstRegDate = !patientRegDate || enrollmentDate >= patientRegDate;
        const isValidAgainstTestDate = !value || enrollmentDate >= value;

        if (isValidAgainstRegDate && isValidAgainstTestDate) {
          delete newErrors.date_enrolled_in_hiv_care;
          setErrors(newErrors);
        }
      }
    }
  };

  const [commencement, setCommencement] = useState({
    visit_date: "",
    clinical_stage_at_art_start: "",
    cd4_at_art_start: "",
    cd4_percentage: "",
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
    tpt_started: false,
    tb_preventive_therapy: {
      medication: "",
      dose: "",
      start_date: "",
      tpt_completed: "",
      completion_date: "",
    },
  });

  const handleCommencement = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

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

    // Handle TPT Started checkbox - clear TPT fields when unchecked
    if (name === "tpt_started") {
      setCommencement((prev) => ({
        ...prev,
        tpt_started: checked,
        tb_preventive_therapy: checked ? prev.tb_preventive_therapy : {
          medication: "",
          dose: "",
          start_date: "",
          tpt_completed: "",
          completion_date: "",
        },
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
        const updated = { ...prev, [name]: inputValue };
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
      if ((name === 'date_art_started' || name === 'visit_date') && value && String(value).trim() !== '') {
        delete newErrors[name];
      }

      setErrors(newErrors);
    }
  };

  // Handler for the nested TPT object
  const handleTpt = (e) => {
    const { name, value } = e.target;

    // If TPT Completed changes to "No" or empty, clear completion date and error
    if (name === "tpt_completed" && value !== "Yes") {
      setCommencement((prev) => ({
        ...prev,
        tb_preventive_therapy: {
          ...prev.tb_preventive_therapy,
          tpt_completed: value,
          completion_date: "",
        },
      }));

      // Clear completion date error if it exists
      if (errors.tpt_completion_date) {
        const newErrors = { ...errors };
        delete newErrors.tpt_completion_date;
        setErrors(newErrors);
      }
    } else {
      setCommencement((prev) => ({
        ...prev,
        tb_preventive_therapy: { ...prev.tb_preventive_therapy, [name]: value },
      }));

      // Real-time validation — clear error if completion_date becomes valid
      if (name === 'completion_date' && errors.tpt_completion_date) {
        if (value && String(value).trim() !== '') {
          const newErrors = { ...errors };
          delete newErrors.tpt_completion_date;
          setErrors(newErrors);
        }
      }
    }
  };

  // ── Auto-populate Date ART Started with Date Enrolled in HIV Care ────────
  useEffect(() => {
    // Find the selected care entry point
    const selectedCareEntryPoint = codesets.careEntryPoints.find(opt => opt.code == registration.care_entry_point);

    // Check if Care Entry Point is Transfer-in using code or display
    const isTransferIn = selectedCareEntryPoint?.code?.includes("TRANSFER") ||
                         selectedCareEntryPoint?.display?.toLowerCase().includes("transfer");

    const hasPriorArt = registration.prior_art && String(registration.prior_art).trim() !== '';
    const hasEnrollmentDate = registration.date_enrolled_in_hiv_care && String(registration.date_enrolled_in_hiv_care).trim() !== '';

    // Only auto-populate if:
    // 1. Date enrolled in HIV care is filled
    // 2. Care entry point is NOT Transfer-in
    // 3. Prior ART is NOT documented (empty)
    // 4. Date ART started is currently empty (don't override user's edits)
    if (hasEnrollmentDate && !isTransferIn && !hasPriorArt && !commencement.date_art_started) {
      setCommencement((prev) => ({
        ...prev,
        date_art_started: registration.date_enrolled_in_hiv_care
      }));
    }
  }, [registration.date_enrolled_in_hiv_care, registration.care_entry_point, registration.prior_art, codesets.careEntryPoints]);

  // ── Auto-populate Weight, Height from Triage/Vital Signs ────────────────
  useEffect(() => {
    const fetchVitalSigns = async () => {
      // Only fetch if we have both personId and date_art_started
      if (!props.patientObj?.id || !commencement.date_art_started) {
        return;
      }

      try {
        const response = await axios.get(
          `${baseUrl}patient/vital-sign/person/${props.patientObj.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          // Format the date_art_started to match captureDate format (YYYY-MM-DD)
          const artStartDate = commencement.date_art_started;

          // Find vital sign record matching the ART start date
          const matchingVitalSign = response.data.find(vs => {
            if (vs.captureDate) {
              // Extract date part from captureDate (format: "2026-03-07T00:00:00")
              const vitalSignDate = vs.captureDate.split('T')[0];
              return vitalSignDate === artStartDate;
            }
            return false;
          });

          if (matchingVitalSign) {
            // Auto-populate weight and height only if they are empty
            setCommencement((prev) => {
              const updates = {};

              // Populate weight if not already filled and exists in vital sign
              if (!prev.weight_kg && matchingVitalSign.bodyWeight) {
                updates.weight_kg = String(matchingVitalSign.bodyWeight);
              }

              // Populate height if not already filled and exists in vital sign
              if (!prev.height_cm && matchingVitalSign.height) {
                updates.height_cm = String(matchingVitalSign.height);
              }

              // If we have updates, calculate BMI
              if (Object.keys(updates).length > 0) {
                const w = updates.weight_kg || prev.weight_kg;
                const h = updates.height_cm || prev.height_cm;
                updates.bmi = calcBmi(w, h);
              }

              return Object.keys(updates).length > 0 ? { ...prev, ...updates } : prev;
            });
          }
        }
      } catch (error) {
        console.error("Error fetching vital signs:", error);
        // Don't show error to user - this is optional auto-population
      }
    };

    fetchVitalSigns();
  }, [props.patientObj?.id, commencement.date_art_started]);

  // ── Validation ───────────────────────────────────────────────────────────
  const validate = () => {
    const temp = {};

    if (!registration.unique_id || String(registration.unique_id).trim() === '') {
      temp.unique_id = "Unique ID is required";
    } else if (errors.unique_id === "Unique ID already exists") {
      // Preserve existing duplicate error
      temp.unique_id = "Unique ID already exists";
    }

    if (!registration.date_enrolled_in_hiv_care || String(registration.date_enrolled_in_hiv_care).trim() === '') {
      temp.date_enrolled_in_hiv_care = "Date enrolled in HIV care is required";
    } else {
      // Validate that date_enrolled_in_hiv_care is not earlier than patient registration date
      const patientRegDate = props.patientObj?.dateOfRegistration;
      if (patientRegDate && registration.date_enrolled_in_hiv_care < patientRegDate) {
        temp.date_enrolled_in_hiv_care = "Date enrolled in HIV care cannot be earlier than patient registration date";
      }

      // Validate that date_enrolled_in_hiv_care is not earlier than date of confirmed HIV test
      if (registration.date_confirmed_hiv_test && registration.date_enrolled_in_hiv_care < registration.date_confirmed_hiv_test) {
        temp.date_enrolled_in_hiv_care = "Date enrolled in HIV care cannot be earlier than date of confirmed HIV test";
      }
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

    if (!commencement.visit_date || String(commencement.visit_date).trim() === '') {
      temp.visit_date = "Visit date is required";
    }

    if (!commencement.date_art_started || String(commencement.date_art_started).trim() === '') {
      temp.date_art_started = "Date ART started is required";
    } else {
      // Validate that date_art_started is not earlier than date_enrolled_in_hiv_care
      if (registration.date_enrolled_in_hiv_care && commencement.date_art_started < registration.date_enrolled_in_hiv_care) {
        temp.date_art_started = "Date ART started cannot be earlier than date enrolled in HIV care";
      }
    }

    // 1. Mother's Unique ID — Required if patient age < 18 months (infant)
    if (isInfant && (!registration.mother_unique_id || String(registration.mother_unique_id).trim() === '')) {
      temp.mother_unique_id = "Mother's Unique ID is required for infants (age < 18 months)";
    }

    // 2. KP Typology — Required if is_kp = "Yes"
    if (registration.is_kp === 'Yes' && (!registration.kp_typology || String(registration.kp_typology).trim() === '')) {
      temp.kp_typology = "KP Typology is required when patient is a Key Population";
    }

    // 3. Transfer-in date — Required if care_entry_point is Transfer-in
    const transferInCode = getCodesetCodeByPattern(codesets.careEntryPoints, "TRANSFER");
    if (registration.care_entry_point == transferInCode && (!registration.date_transferred_in || String(registration.date_transferred_in).trim() === '')) {
      temp.date_transferred_in = "Transfer-in date is required when care entry point is 'Transfer-in'";
    }

    // 4. Facility Transferred From — Required if date_transferred_in is provided
    if (registration.date_transferred_in && String(registration.date_transferred_in).trim() !== '' &&
        (!registration.facility_transferred_from || String(registration.facility_transferred_from).trim() === '')) {
      temp.facility_transferred_from = "Facility transferred from is required when transfer-in date is provided";
    }

    // 5. TPT Completion Date — Required if tpt_completed = "Yes"
    if (commencement.tpt_started &&
        commencement.tb_preventive_therapy.tpt_completed === 'Yes' &&
        (!commencement.tb_preventive_therapy.completion_date || String(commencement.tb_preventive_therapy.completion_date).trim() === '')) {
      temp.tpt_completion_date = "TPT Completion Date is required when TPT is marked as completed";
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if Unique ID validation is still in progress (only for create mode)
    if (isCreateMode && checkingUniqueId) {
      toast.warning("Please wait while we verify the Unique ID");
      return;
    }

    // Re-validate Unique ID before submission (only for create mode)
    if (isCreateMode && registration.unique_id && String(registration.unique_id).trim() !== '') {
      await checkUniqueIdExists(registration.unique_id);
    }

    // Check if there's a duplicate Unique ID error after re-validation
    if (errors.unique_id === "Unique ID already exists") {
      toast.error("Unique ID already exists. Please use a different Unique ID.");
      return;
    }

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

      if (isEditMode) {
        await axios.put(
          `${baseUrl}hiv/enrollment-commencement/${props.activeContent.id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Enrollment and Commencement updated successfully");
      } else {
        await axios.post(`${baseUrl}hiv/enrollment-commencement`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Enrollment and Commencement saved successfully");
      }

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

  // Show loading state while checking for existing record OR loading data
  if (checkingExisting || loading) {
    return (
      <Card className={classes.root} style={{ borderRadius: "12px" }}>
        <CardContent>
          <Box sx={{ textAlign: "center", padding: "40px" }}>
            <Typography>{loading ? "Loading..." : "Checking existing records..."}</Typography>
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
      style={{ borderRadius: "12px", overflow: "visible", width: "100%" }}
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
            Enrollment &amp; ART Commencement {isEditMode && "(Update)"} {isViewMode && "(View)"}
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
            title="Enrollment"
            index={0}
            expanded={expanded}
            onToggle={toggleAccordion}
          >
            {/* Row 1: Unique ID, Date Enrolled in HIV Care */}
            <FieldRow>
              <Col>
                <SectionLabel>
                  Unique ID{" "}
                  <span style={{ color: "red" }}>*</span>
                </SectionLabel>
                <Input
                  type="text"
                  name="unique_id"
                  value={registration.unique_id}
                  onChange={handleReg}
                  onBlur={handleUniqueIdBlur}
                  placeholder="Enter unique identifier"
                  disabled={checkingUniqueId || isViewMode || isEditMode}
                  readOnly={isViewMode}
                  style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
                />
                {checkingUniqueId && (
                  <span style={{ color: "#014d88", fontSize: "12px", marginTop: "4px" }}>
                    Checking Unique ID...
                  </span>
                )}
                {errors.unique_id && (
                  <span className={classes.error}>
                    {errors.unique_id}
                  </span>
                )}
              </Col>
              <Col>
                <SectionLabel>
                  Date Enrolled in HIV Care{" "}
                  <span style={{ color: "red" }}>*</span>
                </SectionLabel>
                <Input
                  type="date"
                  name="date_enrolled_in_hiv_care"
                  value={registration.date_enrolled_in_hiv_care}
                  min={
                    // Calculate min date as the latest of patient registration date and HIV test date
                    (() => {
                      const dates = [
                        props.patientObj?.dateOfRegistration,
                        registration.date_confirmed_hiv_test
                      ].filter(Boolean);
                      return dates.length > 0 ? dates.reduce((a, b) => a > b ? a : b) : undefined;
                    })()
                  }
                  max={moment(new Date()).format("YYYY-MM-DD")}
                  onChange={handleReg}
                  disabled={isViewMode}
                  style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
                />
                {errors.date_enrolled_in_hiv_care && (
                  <span className={classes.error}>
                    {errors.date_enrolled_in_hiv_care}
                  </span>
                )}
              </Col>
            </FieldRow>

            {/* Row 2: Mother's Unique ID (if infant), Care Entry Point */}
            <FieldRow>
              {isInfant && (
                <Col>
                  <SectionLabel>
                    Mother's Unique ID
                    <span style={{ color: "red" }}> *</span>
                  </SectionLabel>
                  <Input
                    type="text"
                    name="mother_unique_id"
                    value={registration.mother_unique_id}
                    onChange={handleReg}
                    placeholder="Required for infants < 18 months"
                    disabled={isViewMode}
                    readOnly={isViewMode}
                    style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
                  />
                  {errors.mother_unique_id && (
                    <span className={classes.error}>
                      {errors.mother_unique_id}
                    </span>
                  )}
                </Col>
              )}
              <Col>
                <SectionLabel>
                  Care Entry Point{" "}
                  <span style={{ color: "red" }}>*</span>
                </SectionLabel>
                <Input
                  type="select"
                  name="care_entry_point"
                  value={registration.care_entry_point}
                  onChange={handleReg}
                  disabled={loadingCodesets || isViewMode}
                  style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
                >
                  <option value="">{loadingCodesets ? "Loading..." : "Select"}</option>
                  {codesets.careEntryPoints.map((opt) => (
                    <option key={opt.id} value={opt.code}>
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
            </FieldRow>

            {/* Row 3: Specify Entry Point (if Others selected) */}
            {registration.care_entry_point == getCodesetCodeByPattern(codesets.careEntryPoints, "OTHERS") && (
              <FieldRow>
                <Col>
                  <SectionLabel>Specify Entry Point</SectionLabel>
                  <Input
                    type="text"
                    name="care_entry_point_other"
                    value={registration.care_entry_point_other}
                    onChange={handleReg}
                    placeholder="Please specify..."
                    disabled={isViewMode}
                    readOnly={isViewMode}
                    style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
                  />
                </Col>
              </FieldRow>
            )}

            {/* Row 4: Date Transferred In, Facility Transferred From (if Transfer-in selected) */}
            {registration.care_entry_point == getCodesetCodeByPattern(codesets.careEntryPoints, "TRANSFER") && (
              <FieldRow>
                <Col>
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
                    disabled={isViewMode}
                    style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
                  />
                  {errors.date_transferred_in && (
                    <span className={classes.error}>
                      {errors.date_transferred_in}
                    </span>
                  )}
                </Col>
                <Col>
                  <SectionLabel>
                    Facility Transferred From
                    {registration.date_transferred_in && registration.date_transferred_in.trim() !== "" && (
                      <span style={{ color: "red" }}> *</span>
                    )}
                  </SectionLabel>
                  {isViewMode ? (
                    <Input
                      type="text"
                      name="facility_transferred_from"
                      value={registration.facility_transferred_from}
                      readOnly
                      style={{ background: "#f5f9ff", color: "#014d88", fontWeight: 600 }}
                    />
                  ) : (
                    <Select
                      name="facility_transferred_from"
                      value={getFacilityOptions().find(option => option.value === registration.facility_transferred_from)}
                      onChange={handleFacilitySelect}
                      options={getFacilityOptions()}
                      isLoading={loadingFacilities}
                      placeholder="Search or select facility..."
                      isSearchable={true}
                      isClearable={true}
                      noOptionsMessage={() => "No facilities found"}
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: '41px',
                          borderColor: '#ced4da',
                          borderRadius: '0.25rem',
                          '&:hover': {
                            borderColor: '#ced4da'
                          }
                        }),
                        valueContainer: (base) => ({
                          ...base,
                          padding: '2px 8px'
                        })
                      }}
                    />
                  )}
                  {errors.facility_transferred_from && (
                    <span className={classes.error}>
                      {errors.facility_transferred_from}
                    </span>
                  )}
                </Col>
              </FieldRow>
            )}

            {/* Row 5: Date of Confirmed HIV Test, Mode of HIV Test */}
            <FieldRow>
              <Col>
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
                  disabled={isViewMode}
                  style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
                />
                {errors.date_confirmed_hiv_test && (
                  <span className={classes.error}>
                    {errors.date_confirmed_hiv_test}
                  </span>
                )}
              </Col>
              <Col>
                <SectionLabel>
                  Mode of HIV Test{" "}
                  <span style={{ color: "red" }}>*</span>
                </SectionLabel>
                <Input
                  type="select"
                  name="mode_of_hiv_test"
                  value={registration.mode_of_hiv_test}
                  onChange={handleReg}
                  disabled={loadingCodesets || isViewMode}
                  style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
                >
                  <option value="">{loadingCodesets ? "Loading..." : "Select"}</option>
                  {codesets.mode_of_hiv_test.map((opt) => (
                    <option key={opt.id} value={opt.code}>{opt.display}</option>
                  ))}
                </Input>
                {errors.mode_of_hiv_test && (
                  <span className={classes.error}>
                    {errors.mode_of_hiv_test}
                  </span>
                )}
              </Col>
            </FieldRow>

            {/* Row 6: HIV Test Location, Prior ART */}
            <FieldRow>
              <Col>
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
                  disabled={isViewMode}
                  readOnly={isViewMode}
                  style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
                />
                {errors.hiv_test_location && (
                  <span className={classes.error}>
                    {errors.hiv_test_location}
                  </span>
                )}
              </Col>
              <Col>
                <SectionLabel>
                  Prior ART{" "}
                  <span style={{ color: "red" }}>*</span>
                </SectionLabel>
                <Input
                  type="select"
                  name="prior_art"
                  value={registration.prior_art}
                  onChange={handleReg}
                  disabled={loadingCodesets || isViewMode}
                  style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
                >
                  <option value="">{loadingCodesets ? "Loading..." : "Select"}</option>
                  {getFilteredPriorArt(codesets.priorArt).map((opt) => (
                    <option key={opt.id} value={opt.code}>
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
            </FieldRow>

            {/* Row 7: Is Patient KP, KP Typology */}
            <FieldRow>
              <Col>
                <SectionLabel>Is Patient KP?</SectionLabel>
                <Input
                  type="select"
                  name="is_kp"
                  value={registration.is_kp}
                  onChange={handleReg}
                  disabled={isViewMode}
                  style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Input>
              </Col>
              {registration.is_kp === "Yes" && (
                <Col>
                  <SectionLabel>
                    KP Typology{" "}
                    <span style={{ color: "red" }}>*</span>
                  </SectionLabel>
                  <Input
                    type="select"
                    name="kp_typology"
                    value={registration.kp_typology}
                    onChange={handleReg}
                    disabled={loadingCodesets || isViewMode}
                    style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
                  >
                    <option value="">{loadingCodesets ? "Loading..." : "Select"}</option>
                    {getFilteredKpTypology(codesets.kpTypology).map((opt) => (
                      <option key={opt.id} value={opt.code}>{opt.display}</option>
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
          </FormAccordion>

          <FormAccordion
            panel="commencement"
            title="ART Commencement"
            index={1}
            expanded={expanded}
            onToggle={toggleAccordion}
          >
            {/* Visit Date */}
            <FieldRow>
              <Col>
                <SectionLabel>
                  Visit Date{" "}
                  <span style={{ color: "red" }}>*</span>
                </SectionLabel>
                <Input
                  type="date"
                  name="visit_date"
                  value={commencement.visit_date}
                  max={moment(new Date()).format("YYYY-MM-DD")}
                  onChange={handleCommencement}
                  disabled={isViewMode}
                  style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
                />
                {errors.visit_date && (
                  <span className={classes.error}>
                    {errors.visit_date}
                  </span>
                )}
              </Col>
            </FieldRow>

            {/* Clinical Status */}
            <Divider sx={{ my: 2 }} />
            <SubHeading>Clinical Status at ART Start</SubHeading>

            {/* Row 1: Clinical Stage at Start of ART, CD4 Count at Start of ART */}
            <FieldRow>
              <Col>
                <SectionLabel>
                  Clinical Stage at Start of ART{" "}
                  <span style={{ color: "red" }}>*</span>
                </SectionLabel>
                <Input
                  type="select"
                  name="clinical_stage_at_art_start"
                  value={commencement.clinical_stage_at_art_start}
                  onChange={handleCommencement}
                  disabled={loadingCodesets || isViewMode}
                  style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
                >
                  <option value="">{loadingCodesets ? "Loading..." : "Select"}</option>
                  {codesets.clinicalStages.map((opt) => (
                    <option key={opt.id} value={opt.code}>{opt.display}</option>
                  ))}
                </Input>
                {errors.clinical_stage_at_art_start && (
                  <span className={classes.error}>
                    {errors.clinical_stage_at_art_start}
                  </span>
                )}
              </Col>
              <Col>
                <SectionLabel>CD4 Count at Start of ART</SectionLabel>
                <Input
                  type="number"
                  name="cd4_at_art_start"
                  value={commencement.cd4_at_art_start}
                  onChange={handleCommencement}
                  placeholder="cells/mm³"
                  min="0"
                  step="1"
                  disabled={isViewMode}
                  readOnly={isViewMode}
                  style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
                />
              </Col>
            </FieldRow>

            {/* Row 2: CD4 %, CD4 LF */}
            <FieldRow>
              <Col>
                <SectionLabel>CD4 %</SectionLabel>
                <Input
                  type="number"
                  name="cd4_percentage"
                  value={commencement.cd4_percentage}
                  onChange={handleCommencement}
                  placeholder="%"
                  min="0"
                  max="100"
                  step="0.1"
                  disabled={isViewMode}
                  readOnly={isViewMode}
                  style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
                />
              </Col>
              <Col>
                <SectionLabel>CD4 LF</SectionLabel>
                <Input
                  type="select"
                  name="cd4_lf"
                  value={commencement.cd4_lf}
                  onChange={handleCommencement}
                  disabled={loadingCodesets || isViewMode}
                  style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
                >
                  <option value="">{loadingCodesets ? "Loading..." : "Select"}</option>
                  {codesets.cd4_lf.map((opt) => (
                    <option key={opt.id} value={opt.code}>
                      {opt.display}
                    </option>
                  ))}
                </Input>
              </Col>
            </FieldRow>

            {/* ART Dates & Regimen */}
            <Divider sx={{ my: 2 }} />
            <SubHeading>ART Dates &amp; Regimen</SubHeading>

            {/* Row 3: Date Initial Adherence Counseling Completed, Date ART Started */}
            <FieldRow>
              <Col>
                <SectionLabel>
                  Date Initial Adherence Counseling Completed
                </SectionLabel>
                <Input
                  type="date"
                  name="date_adherence_counseling_completed"
                  value={commencement.date_adherence_counseling_completed}
                  max={moment(new Date()).format("YYYY-MM-DD")}
                  onChange={handleCommencement}
                  disabled={isViewMode}
                  style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
                />
              </Col>
              <Col>
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
                  disabled={isViewMode}
                  style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
                />
                {errors.date_art_started && (
                  <span className={classes.error}>
                    {errors.date_art_started}
                  </span>
                )}
              </Col>
            </FieldRow>

            {/* Row 4: First ART Regimen Line, First ART Regimen */}
            <FieldRow>
              <Col>
                <SectionLabel>{isPediatric ? "Child" : "Adult"} First ART Regimen Line</SectionLabel>
                <Input
                  type="select"
                  name="regimen_line_id"
                  value={commencement.regimen_line_id}
                  onChange={handleCommencement}
                  disabled={isViewMode}
                  style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
                >
                  <option value="">Select regimen line first...</option>
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
                  name="first_art_regimen"
                  value={commencement.first_art_regimen}
                  onChange={handleCommencement}
                  disabled={!commencement.regimen_line_id || loadingRegimens || isViewMode}
                  style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
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
              {/* Row 5: Weight, Height */}
              <FieldRow>
                <Col>
                  <SectionLabel>Weight (kg)</SectionLabel>
                  <Input
                    type="number"
                    name="weight_kg"
                    value={commencement.weight_kg}
                    onChange={handleCommencement}
                    placeholder="kg"
                    min="0"
                    step="0.1"
                    disabled={isViewMode}
                    readOnly={isViewMode}
                    style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
                  />
                </Col>
                <Col>
                  <SectionLabel>Height / Length (cm)</SectionLabel>
                  <Input
                    type="number"
                    name="height_cm"
                    value={commencement.height_cm}
                    onChange={handleCommencement}
                    placeholder="cm"
                    min="0"
                    step="0.1"
                    disabled={isViewMode}
                    readOnly={isViewMode}
                    style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
                  />
                </Col>
              </FieldRow>

              {/* Row 6: BMI */}
              <FieldRow>
                <Col>
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
              </FieldRow>

              {/* ── MUAC — pediatric only ──────────────────────────── */}
              {isPediatric && (
                <>
                  {/* Row 7: MUAC (cm), MUAC Indication */}
                  <FieldRow>
                    <Col>
                      <SectionLabel>MUAC (cm)</SectionLabel>
                      <Input
                        type="number"
                        name="muac"
                        value={commencement.muac}
                        onChange={handleCommencement}
                        placeholder="e.g. 13.5"
                        min="0"
                        step="0.1"
                        disabled={isViewMode}
                        readOnly={isViewMode}
                        style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
                      />
                    </Col>
                    <Col>
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
                  </FieldRow>
                </>
              )}

              {/* ── Pregnancy Status — adult females only ──────────── */}
              {showPregnancyStatus && (
                <>
                  {/* Row 8: Is Pregnant?, Pregnancy Status */}
                  <FieldRow>
                    <Col>
                      <SectionLabel>Is Pregnant?</SectionLabel>
                      <Input
                        type="select"
                        name="is_pregnant"
                        value={commencement.is_pregnant}
                        onChange={handleCommencement}
                        disabled={isViewMode}
                        style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
                      >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </Input>
                    </Col>
                    {commencement.is_pregnant === "Yes" && (
                      <Col>
                        <SectionLabel>Pregnancy Status</SectionLabel>
                        <Input
                          type="select"
                          name="pregnancy_status"
                          value={commencement.pregnancy_status}
                          onChange={handleCommencement}
                          disabled={loadingCodesets || isViewMode}
                          style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
                        >
                          <option value="">{loadingCodesets ? "Loading..." : "Select"}</option>
                          {codesets.pregnancyStatus.map((opt) => (
                            <option key={opt.id} value={opt.code}>
                              {opt.display}
                            </option>
                          ))}
                        </Input>
                      </Col>
                    )}
                  </FieldRow>
                </>
              )}
            </Box>

            {/* TB Preventive Therapy */}
            <Divider sx={{ my: 2 }} />
            <SubHeading>TB Preventive Therapy (TPT)</SubHeading>

            {/* Has Client ever had TPT? Checkbox */}
            <FieldRow>
              <Col size={12}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                  <input
                    type="checkbox"
                    id="tpt_started"
                    name="tpt_started"
                    checked={commencement.tpt_started}
                    onChange={handleCommencement}
                    disabled={isViewMode}
                    style={{
                      width: "18px",
                      height: "18px",
                      marginRight: "8px",
                      cursor: isViewMode ? "not-allowed" : "pointer"
                    }}
                  />
                  <label
                    htmlFor="tpt_started"
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#014d88",
                      cursor: isViewMode ? "not-allowed" : "pointer",
                      margin: 0
                    }}
                  >
                    Has Client ever had TPT?
                  </label>
                </div>
              </Col>
            </FieldRow>

            {/* TPT Details - Only show if checkbox is checked */}
            {commencement.tpt_started && (
              <Box
                sx={{
                  background: "#fff",
                  border: "1px solid #014d88",
                  borderRadius: "4px",
                  padding: "16px",
                }}
              >
                {/* Row 9: TPT MEDICATION */}
                <FieldRow>
                  <Col>
                    <SectionLabel>TPT MEDICATION</SectionLabel>
                    <Input
                      type="select"
                      name="medication"
                      value={commencement.tb_preventive_therapy.medication}
                      onChange={handleTpt}
                      disabled={loadingTptMedications || isViewMode}
                      style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
                    >
                      <option value="">{loadingTptMedications ? "Loading..." : "Select"}</option>
                      {tptMedications.map((med) => (
                        <option key={med.id} value={med.id}>
                          {med.description}
                        </option>
                      ))}
                    </Input>
                  </Col>
                </FieldRow>

                {/* Row 10: Dose, Start Date */}
                <FieldRow>
                  <Col>
                    <SectionLabel>Dose</SectionLabel>
                    <Input
                      type="number"
                      name="dose"
                      value={commencement.tb_preventive_therapy.dose}
                      onChange={handleTpt}
                      placeholder="e.g. 300"
                      min="0"
                      step="1"
                      disabled={isViewMode}
                      readOnly={isViewMode}
                      style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
                    />
                  </Col>
                  <Col>
                    <SectionLabel>Start Date</SectionLabel>
                    <Input
                      type="date"
                      name="start_date"
                      value={commencement.tb_preventive_therapy.start_date}
                      min={registration.date_enrolled_in_hiv_care}
                      max={moment(new Date()).format("YYYY-MM-DD")}
                      onChange={handleTpt}
                      disabled={isViewMode}
                      style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
                    />
                  </Col>
                </FieldRow>

                {/* Row 11: TPT Completed, Completion Date (conditional) */}
                <FieldRow>
                  <Col>
                    <SectionLabel>TPT Completed</SectionLabel>
                    <Input
                      type="select"
                      name="tpt_completed"
                      value={commencement.tb_preventive_therapy.tpt_completed}
                      onChange={handleTpt}
                      disabled={isViewMode}
                      style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Input>
                  </Col>
                  {commencement.tb_preventive_therapy.tpt_completed === "Yes" && (
                    <Col>
                      <SectionLabel>
                        Completion Date{" "}
                        <span style={{ color: "red" }}>*</span>
                      </SectionLabel>
                      <Input
                        type="date"
                        name="completion_date"
                        value={commencement.tb_preventive_therapy.completion_date}
                        min={commencement.tb_preventive_therapy.start_date}
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        onChange={handleTpt}
                        disabled={isViewMode}
                        style={isViewMode ? { background: "#f5f9ff", color: "#014d88", fontWeight: 600 } : {}}
                      />
                      {errors.tpt_completion_date && (
                        <span className={classes.error}>
                          {errors.tpt_completion_date}
                        </span>
                      )}
                    </Col>
                  )}
                </FieldRow>
              </Box>
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
            {isViewMode ? (
              <>
                {/* View Mode Buttons: Back + Edit */}
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
                  <span style={{ textTransform: "capitalize", color: "#fff", fontWeight: "bold" }}>Back</span>
                </MatButton>
                <MatButton
                  variant="contained"
                  className={classes.button}
                  startIcon={<EditIcon style={{ color: "#fff" }} />}
                  style={{ backgroundColor: "#014d88" }}
                  onClick={() =>
                    props.setActiveContent({
                      ...props.activeContent,
                      route: "enrollment-and-commencement-update",
                    })
                  }
                >
                  <span style={{ textTransform: "capitalize", color: "#fff", fontWeight: "bold" }}>Edit</span>
                </MatButton>
              </>
            ) : (
              <>
                {/* Create/Edit Mode Buttons: Cancel + Save/Update */}
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
                  <span style={{ textTransform: "capitalize", color: "#fff", fontWeight: "bold" }}>Cancel</span>
                </MatButton>
                <MatButton
                  type="submit"
                  variant="contained"
                  className={classes.button}
                  startIcon={<SaveIcon style={{ color: "#fff" }} />}
                  style={{ backgroundColor: "#014d88" }}
                  disabled={saving}
                >
                  <span style={{ textTransform: "capitalize", color: "#fff", fontWeight: "bold" }}>
                    {saving ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update" : "Save")}
                  </span>
                </MatButton>
              </>
            )}
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnrollmentAndCommencementForm;
