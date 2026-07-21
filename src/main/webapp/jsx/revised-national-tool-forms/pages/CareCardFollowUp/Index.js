import React, { useState, useEffect } from "react";
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
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
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
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";


const WHO_STAGE_CRITERIA_OPTIONS = {
  "CLINICAL_STAGE_STAGE_I": [
    "Asymptomatic",
    "Persistent generalized lymphadenopathy",
    "Performance scale: 1 asymptomatic, normal activity",
  ],
  "CLINICAL_STAGE_STAGE_II": [
    "Weight loss <10% of body weight",
    "Minor Mucocutaneous Manifestations",
    "Herpes Zoster (within last 5 years)",
    "Recurrent Upper Respiratory Tract Infections",
    "Performance scale: 2 symptomatic, normal activity",
  ],
  "CLINICAL_STAGE_STAGE_III": [
    "Weight loss >10% of body weight",
    "Unexplained Chronic Diarrhea (>1 month)",
    "Unexplained Prolonged Fever",
    "Oral Candidiasis",
    "Oral Hairy Leukoplakia",
    "TB, Pulmonary (within previous year)",
    "Severe Bacterial Infections",
    "Performance scale: 3 bedridden <50% of day in last month",
  ],
  "CLINICAL_STAGE_STAGE_IV": [
    "HIV Wasting syndrome",
    "PCP",
    "Toxoplasmosis, CNS",
    "Cryptosporidiosis with Diarrhea (>1 month)",
    "Cryptococcosis, Extrapulmonary",
    "Cytomegalovirus disease",
    "Herpes Simplex (mucotaneous >1 month)",
    "Progressive Multifocal Leukoencephalopathy",
    "Mycosis, disseminated",
    "Oesophageal Candidiasis",
    "Atypical Mycobacteriosis, disseminated",
    "Salmonella Septicemia, Non-typhoid",
    "TB, Extrapulmonary",
    "Lymphoma",
    "Kaposi's Sarcoma",
    "HIV encephalopathy",
    "Performance scale: 4 bedridden >50% of the day in last month",
  ],
};


const EAC_OPTIONS = [
  "None",
  "1st EAC",
  "2nd EAC",
  "3rd EAC",
  "Additional EAC",
];

// Single system color — matches #014d88 used throughout the application
const ACCORDION_STYLES = [
  { bg: "#014d88" },
  { bg: "#014d88" },
  { bg: "#014d88" },
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
  <div className="row" style={{ marginBottom: "8px", width: "100%", marginLeft: 0, marginRight: 0, ...style }}>
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
    <Box sx={{ marginTop: "16px", marginBottom: "16px" }}>
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

// FormAccordion — module scope only
const FormAccordion = ({ panel, title, index, children, expanded, onToggle }) => {
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
        <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "14px" }}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: "20px 24px", background: "#fff", width: "100%" }}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};


const CareCardFollowUpForm = (props) => {
  const classes = useStyles();
  const isFemale = ["female", "FEMALE", "Female"].includes(props.patientObj?.sex);

  const patientAge = props.patientObj?.age || 0;
  const isPediatric = patientAge < 15;

  // Calculate minimum visit date (should not be earlier than DOB, HIV enrollment, or ART start)
  const getMinVisitDate = () => {
    const dates = [];

    // Date of Birth
    if (props.patientObj1?.dateOfBirth) {
      dates.push(moment(props.patientObj1.dateOfBirth));
    }

    // Date of HIV Enrollment
    if (props.patientObj1?.enrollmentCommencement?.data?.registration?.date_enrolled_in_hiv_care) {
      dates.push(moment(props.patientObj1.enrollmentCommencement.data.registration.date_enrolled_in_hiv_care));
    }

    // Date of ART Start
    if (props.patientObj1?.enrollmentCommencement?.data?.commencement?.date_art_started) {
      dates.push(moment(props.patientObj1.enrollmentCommencement.data.commencement.date_art_started));
    }

    // Return the latest of these dates as the minimum allowed visit date
    if (dates.length > 0) {
      const maxDate = moment.max(dates);
      return maxDate.format("YYYY-MM-DD");
    }

    return null;
  };

  const minVisitDate = getMinVisitDate();


  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [expanded, setExpanded] = useState(["visit", "vitals", "medications", "lab"]);
  const [isEditMode, setIsEditMode] = useState(false);

  // Codesets from application
  const [yesNoCodeset, setYesNoCodeset] = useState([]);
  const [familyPlanningMethodCodeset, setFamilyPlanningMethodCodeset] = useState([]);
  const [familyPlanningStatusCodeset, setFamilyPlanningStatusCodeset] = useState([]);
  const [whoStagingCodeset, setWhoStagingCodeset] = useState([]);
  const [pregnancyStatusCodeset, setPregnancyStatusCodeset] = useState([]);
  const [tbStatusCodeset, setTbStatusCodeset] = useState([]);
  const [tbStatusConfirmedCodeset, setTbStatusConfirmedCodeset] = useState([]);
  const [cervicalCancerCodeset, setCervicalCancerCodeset] = useState([]);
  const [cervicalCancerTreatmentCodeset, setCervicalCancerTreatmentCodeset] = useState([]);
  const [hepatitisCodeset, setHepatitisCodeset] = useState([]);
  const [cryptococcalCodeset, setCryptococcalCodeset] = useState([]);
  const [opportunisticInfectionCodeset, setOpportunisticInfectionCodeset] = useState([]);
  const [arvDrugAdherenceCodeset, setArvDrugAdherenceCodeset] = useState([]);
  const [whyPoorFairAdherenceCodeset, setWhyPoorFairAdherenceCodeset] = useState([]);
  const [paediatricAdolescentDisclosureCodeset, setPaediatricAdolescentDisclosureCodeset] = useState([]);
  const [functionalStatusCodeset, setFunctionalStatusCodeset] = useState([]);
  const [dsdStatusCodeset, setDsdStatusCodeset] = useState([]);
  const [dsdModelFacilityCodeset, setDsdModelFacilityCodeset] = useState([]);
  const [dsdModelCommunityCodeset, setDsdModelCommunityCodeset] = useState([]);
  const [sideEffectsCodeset, setSideEffectsCodeset] = useState([]);
  const [labOrderIndicationCodeset, setLabOrderIndicationCodeset] = useState([]);
  const [labTestGroups, setLabTestGroups] = useState([]);
  const [labTestOptions, setLabTestOptions] = useState([]);
  const [typeOfAppointmentCodeset, setTypeOfAppointmentCodeset] = useState([]);
  const [healthInsuranceCoverageCodeset, setHealthInsuranceCoverageCodeset] = useState([]);

  // Regimen data from API
  const [adultRegimenLine, setAdultRegimenLine] = useState([]);
  const [childRegimenLine, setChildRegimenLine] = useState([]);
  const [regimenType, setRegimenType] = useState([]);
  const [tptMedications, setTptMedications] = useState([]);
  const [ctxMedications, setCtxMedications] = useState([]);

  const toggleAccordion = (panel) => {
    setExpanded((prev) =>
      prev.includes(panel) ? prev.filter((p) => p !== panel) : [...prev, panel]
    );
  };

  // Fetch codesets on component mount
  useEffect(() => {
    const fetchCodesets = async () => {
      try {
        // Fetch multiple codesets in a single request
        const params = new URLSearchParams();
        params.append('codes', 'YES_NO_OUTBREAK');
        params.append('codes', 'FAMILY_PLANNING_METHOD');
        params.append('codes', 'FAMILY_PLANNING_STATUS');
        // params.append('codes', 'WHO_STAGING_CRITERIA');
        params.append('codes', 'CLINICAL_STAGE');
        params.append('codes', 'PREGNANCY_STATUS');
        params.append('codes', 'TB_STATUS');
        params.append('codes', 'TB_STAUS_CONFIRMED');
        params.append('codes', 'CERVICAL_CANCER_SCREENING_STATUS');
        params.append('codes', 'CERVICAL_CANCER_TREATMENT');
        params.append('codes', 'HEPATITIS_SCREENING_RESULT');
        params.append('codes', 'CRYPTOCOCCAL_SCREENING_STATUS');
        params.append('codes', 'OPPORTUNISTIC_INFECTION_ILLNESS');
        params.append('codes', 'ARV_DRUG_ADHERENCE');
        params.append('codes', 'WHY_POOR_FAIR_ADHERENCE');
        params.append('codes', 'PEDIATRIC_ADOLESCENT_DISCLOSURE_STATUS');
        params.append('codes', 'FUNCTIONAL _STATUS');
        params.append('codes', 'DSD_STATUS');
        params.append('codes', 'DSD_MODEL_FACILITY');
        params.append('codes', 'DSD_MODEL_COMMUNITY');
        params.append('codes', 'PREP_SIDE_EFFECTS');
        params.append('codes', 'VL_INDICATION');
        params.append('codes', 'CONSULT_HOSPITALIZE_REFER');
        params.append('codes', 'HEALTH_INSURANCE_COVERAGE');

        const response = await axios.get(
          `${baseUrl}application-codesets/v2/codeSets?${params}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );


        // Extract individual codesets from response object
        const data = response.data || {};

        setYesNoCodeset(data.YES_NO_OUTBREAK || []);
        setFamilyPlanningMethodCodeset(data.FAMILY_PLANNING_METHOD || []);
        setFamilyPlanningStatusCodeset(data.FAMILY_PLANNING_STATUS || []);
        // setWhoStagingCodeset(data.WHO_STAGING_CRITERIA || []);
        setWhoStagingCodeset(data.CLINICAL_STAGE || []);
        setPregnancyStatusCodeset(data.PREGNANCY_STATUS || []);
        setTbStatusCodeset(data.TB_STATUS || []);
        setTbStatusConfirmedCodeset(data.TB_STAUS_CONFIRMED || []);
        setCervicalCancerCodeset(data.CERVICAL_CANCER_SCREENING_STATUS || []);
        setCervicalCancerTreatmentCodeset(data.CERVICAL_CANCER_TREATMENT || []);
        setHepatitisCodeset(data.HEPATITIS_SCREENING_RESULT || []);
        setCryptococcalCodeset(data.CRYPTOCOCCAL_SCREENING_STATUS || []);
        setOpportunisticInfectionCodeset(data.OPPORTUNISTIC_INFECTION_ILLNESS || []);
        setArvDrugAdherenceCodeset(data.ARV_DRUG_ADHERENCE || []);
        setWhyPoorFairAdherenceCodeset(data.WHY_POOR_FAIR_ADHERENCE || []);
        setPaediatricAdolescentDisclosureCodeset(data.PEDIATRIC_ADOLESCENT_DISCLOSURE_STATUS || []);
        setFunctionalStatusCodeset(data['FUNCTIONAL _STATUS'] || []);
        setDsdStatusCodeset(data.DSD_STATUS || []);
        setDsdModelFacilityCodeset(data.DSD_MODEL_FACILITY || []);
        setDsdModelCommunityCodeset(data.DSD_MODEL_COMMUNITY || []);
        setSideEffectsCodeset(data.PREP_SIDE_EFFECTS || []);
        setLabOrderIndicationCodeset(data.VL_INDICATION || []);
        setTypeOfAppointmentCodeset(data.CONSULT_HOSPITALIZE_REFER || []);
        setHealthInsuranceCoverageCodeset(data.HEALTH_INSURANCE_COVERAGE || []);
      } catch (error) {
        console.error("Error fetching codesets:", error);
        toast.error("Failed to load form options. Please refresh.");
      }
    };

    const fetchAdultRegimenLine = async () => {
      try {
        const response = await axios.get(`${baseUrl}hiv/regimen/arv/adult`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const artRegimen = response.data.filter(
          (x) => x.id === 1 || x.id === 2 || x.id === 14
        );
        setAdultRegimenLine(artRegimen);
      } catch (error) {
        console.error("Error fetching adult regimen line:", error);
      }
    };

    const fetchChildRegimenLine = async () => {
      try {
        const response = await axios.get(`${baseUrl}hiv/regimen/arv/children`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const artRegimenChildren = response.data.filter(
          (x) => x.id === 3 || x.id === 4 || x.id === 16
        );
        setChildRegimenLine(artRegimenChildren);
      } catch (error) {
        console.error("Error fetching child regimen line:", error);
      }
    };

    const fetchLabTestGroups = async () => {
      try {
        const response = await axios.get(`${baseUrl}laboratory/labtestgroups`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setLabTestGroups(response.data);

        // Transform lab test groups into options for ReactSelect
        const options = response.data.flatMap(group =>
          group.labTests.map(test => ({
            value: test.id,
            label: `${test.labTestName} (${test.unit || 'N/A'})`,
            groupName: group.groupName
          }))
        );

        setLabTestOptions(options);
      } catch (error) {
        console.error("Error fetching lab test groups:", error);
      }
    };

    const fetchTPTMedications = async () => {
      try {
        // Determine which API endpoint to use based on patient age
        const apiEndpoint = isPediatric
          ? `${baseUrl}hiv/regimen/arv/children`
          : `${baseUrl}hiv/regimen/arv/adult`;

        // Fetch regimen types
        const response = await axios.get(apiEndpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Check if TPT regimen type (ID 15) exists in the response
        const tptRegimenType = response.data.find(regimen => regimen.id === 15);

        if (tptRegimenType) {
          // Fetch TPT medications for regimen type 15
          const medicationsResponse = await axios.get(
            `${baseUrl}hiv/regimen/types/15`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setTptMedications(medicationsResponse.data || []);
        } else {
          console.warn("TPT regimen type (ID 15) not found in the API response");
          setTptMedications([]);
        }
      } catch (error) {
        console.error("Error fetching TPT medications:", error);
        setTptMedications([]);
      }
    };

    const fetchCTXMedications = async () => {
      try {
        // Fetch CTX medications for regimen type 8 (Cotrimoxazole)
        const response = await axios.get(
          `${baseUrl}hiv/regimen/types/8`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setCtxMedications(response.data || []);
      } catch (error) {
        console.error("Error fetching CTX medications:", error);
        setCtxMedications([]);
      }
    };

    fetchCodesets();
    fetchAdultRegimenLine();
    fetchChildRegimenLine();
    fetchLabTestGroups();
    fetchTPTMedications();
    fetchCTXMedications();
  }, []);

  // Populate form when editingVisit is provided
  useEffect(() => {
    if (props.editingVisit) {
      setIsEditMode(true);
      const visit = props.editingVisit;

      // Populate Visit Information
      setVisitInfo({
        visit_date: visit.visitDate ? moment(visit.visitDate).format("YYYY-MM-DD") : "",
        duration_on_art_months: visit.durationOnArtMonths || "",
        clinician_name: visit.clinicianName || "",
      });

      // Populate Vitals
      setVitals({
        height_cm: visit.vitalSignDto?.height || "",
        weight_kg: visit.vitalSignDto?.bodyWeight || "",
        bmi_muac: visit.bmiMuac || "",
        bp_systolic: visit.vitalSignDto?.systolic || "",
        bp_diastolic: visit.vitalSignDto?.diastolic || "",
        pregnancy_breastfeeding_status: visit.pregnancyStatus || "",
        family_planning_status: visit.familyPlaning || "",
        on_family_planning: visit.onFamilyPlaning || "",
      });

      // Populate Clinical Status
      const whoStageCode = whoStagingCodeset.find(opt => opt.id === visit.clinicalStageId)?.code || "";
      setClinical({
        paediatric_disclosure: visit.paediatricDisclosure || "",
        functional_status: functionalStatusCodeset.find(opt => opt.id === visit.functionalStatusId)?.code || "",
        who_stage: whoStageCode,
        who_stage_criteria: visit.whoStageCriteria || [],
        tb_status: visit.tbStatus || "",
        tb_status_confirmed: visit.tbStatusConfirmed || "",
        cryptococcal_status: visit.cryptococcalScreeningStatus || "",
        hepatitis_status: visit.hepatitisScreeningResult || "",
        oral_problems: visit.opportunisticInfections ? visit.opportunisticInfections.map(oi => ({ value: oi.code, label: oi.display })) : [],
        noted_side_effect: visit.sideEffects ? visit.sideEffects.map(se => ({ value: se.code, label: se.display })) : [],
        dsd_status: visit.dsdStatus || "",
        dsd_model: visit.dsdModel || "",
        date_devolved: visit.dateDevolved ? moment(visit.dateDevolved).format("YYYY-MM-DD") : "",
      });

      // Populate Cervical Cancer (if female)
      if (isFemale) {
        setCervicalCancer(visit.cervicalCancerScreeningStatus || "");
        setCervicalCancerTreatment(visit.cervicalCancerTreatmentProvided || "");
        setCervicalCancerOtherFindings(visit.cervicalCancerOtherFindings || "");
      }

      // Populate ARV List and fetch regimen types for each
      const arvRegimens = visit.aRVDrugsRegimen || visit.arvdrugsRegimen || [];
      if (arvRegimens && arvRegimens.length > 0) {
        const arvs = arvRegimens.map(arv => ({
          regimen_line: arv.regimenLine || "",
          regimen: arv.regimenDrug || "",
          adherence: arv.regimenAdherance || "",
          dose: arv.dosage || "",
          why_poor_fair_adherence: arv.whyPoorFairAdherence || "",
        }));
        setArvList(arvs);

        // Fetch regimen types for each ARV entry
        arvs.forEach(async (arv, index) => {
          if (arv.regimen_line) {
            try {
              const response = await axios.get(`${baseUrl}hiv/regimen/types/${arv.regimen_line}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setRegimenTypes((prev) => ({ ...prev, [index]: response.data }));
            } catch (error) {
              console.error("Error fetching regimen types for edit:", error);
            }
          }
        });
      }

      // Populate Medications
      if (visit.cotrimoxazoleDose) {
        setCtx(visit.cotrimoxazoleDose.dose || "");
        setCtxMedication(visit.cotrimoxazoleDose.medication || "");
      } else {
        setCtx("");
        setCtxMedication("");
      }
      if (visit.tptData) {
        setTpt({
          code: visit.tptData.code || "",
          dose: visit.tptData.dose || "",
          start_date: visit.tptData.start_date ? moment(visit.tptData.start_date).format("YYYY-MM-DD") : "",
          completion_date: visit.tptData.completion_date ? moment(visit.tptData.completion_date).format("YYYY-MM-DD") : "",
        });
      }
      setOtherDrugs(visit.otherDrugs || "");

      // Populate Lab Results
      setCd4Ordered(visit.cd4Ordered || false);
      setViralLoadOrdered(visit.viralLoadOrdered || false);

      // Extract viral load data from viralLoadOrder array
      const vlData = visit.viralLoadOrder && visit.viralLoadOrder.length > 0 ? visit.viralLoadOrder[0] : {};

      // Extract CD4 data from cd4Data object
      const cd4Info = visit.cd4Data || {};

      setLab({
        cd4_count: cd4Info.cd4_result || "",
        cd4_date: cd4Info.cd4_date ? moment(cd4Info.cd4_date).format("YYYY-MM-DD") : "",
        viral_load_result: vlData.result || "",
        viral_load_date: vlData.dateAssayed ? moment(vlData.dateAssayed).format("YYYY-MM-DD") : "",
        viral_load_indication: vlData.indication || "",
        eac: visit.eac || "",
        rbs: visit.rbs || "",
        other_tests_done: visit.otherTestsDone ? visit.otherTestsDone.map(test => ({ value: test.value, label: test.label, groupName: test.groupName })) : [],
        type_of_appointment: visit.typeOfAppointment || "",
      });

      // Populate Follow-up
      setFollowUp({
        health_insurance_coverage: visit.healthInsuranceCoverage || "",
        next_appointment_date: visit.nextAppointment ? moment(visit.nextAppointment).format("YYYY-MM-DD") : "",
      });
    } else {
      setIsEditMode(false);
    }
  }, [props.editingVisit, whoStagingCodeset, functionalStatusCodeset, isFemale]);

  // Clear paediatric_disclosure if patient is not < 15 years
  useEffect(() => {
    if (patientAge >= 15) {
      setClinical((prev) => ({ ...prev, paediatric_disclosure: "" }));
    }
  }, [patientAge]);

  // Calculate duration on ART in months
  const calculateDurationOnArt = (artStartDate, currentDate) => {
    if (!artStartDate || !currentDate) return "";

    const start = moment(artStartDate);
    const end = moment(currentDate);

    if (!start.isValid() || !end.isValid()) return "";

    // Calculate the difference in months
    const months = end.diff(start, 'months');

    return months >= 0 ? months : 0;
  };

  // Auto-populate Duration on ART when component mounts
  useEffect(() => {
    const artStartDate = props.patientObj1?.enrollmentCommencement?.data?.commencement?.date_art_started;
    if (artStartDate && !isEditMode) {
      const duration = calculateDurationOnArt(artStartDate, moment(new Date()).format("YYYY-MM-DD"));
      setVisitInfo((prev) => ({ ...prev, duration_on_art_months: duration }));
    }
  }, []); // Only run on mount

  // ── Section 1: Visit Information ────────────────────────────────────────
  const [visitInfo, setVisitInfo] = useState({
    visit_date: "",
    duration_on_art_months: "",
    clinician_name: "",
  });

  const handleVisit = (e) => {
    const { name, value } = e.target;

    // If visit date changes, also update duration on ART and next appointment date
    if (name === "visit_date") {
      const artStartDate = props.patientObj1?.enrollmentCommencement?.data?.commencement?.date_art_started;
      const duration = artStartDate
          ? calculateDurationOnArt(artStartDate, value || moment(new Date()).format("YYYY-MM-DD"))
          : visitInfo.duration_on_art_months;

      const nextAppointment = calculateNextAppointmentDate(value, arvList);
      setFollowUp((prev) => ({
        ...prev,
        next_appointment_date: nextAppointment || prev.next_appointment_date,
      }));

      setVisitInfo((prev) => ({ ...prev, [name]: value, duration_on_art_months: duration }));
      return;
    }

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
    family_planning_status: "",
    on_family_planning: "",
  });

  // Calculate BMI for adults or MUAC for pediatrics
  const calculateBmiMuac = (height, weight) => {
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (!heightNum || heightNum <= 0 || !weightNum || weightNum <= 0) {
      return "";
    }

    if (isPediatric) {
      const muac = (weightNum * 314) / heightNum;
      return muac.toFixed(1); // Return MUAC with 1 decimal place
    } else {
      // For adults: calculate BMI = weight (kg) / (height (m))²
      const heightInMeters = heightNum / 100; // Convert cm to meters
      const bmi = weightNum / (heightInMeters * heightInMeters);
      return bmi.toFixed(1); // Return BMI with 1 decimal place
    }
  };

  // Validate vital signs based on defined ranges
  const validateVitalField = (name, value) => {
    if (value === "" || value === null || value === undefined) return "";
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "";

    switch (name) {
      case "temperature":
        if (numValue < 35) return "Temperature cannot be less than 35°C";
        if (numValue > 47) return "Temperature cannot be greater than 47°C";
        break;
      case "bp_systolic":
        if (numValue < 90) return "Systolic pressure cannot be less than 90 mmHg";
        if (numValue > 240) return "Systolic pressure cannot be greater than 240 mmHg";
        break;
      case "bp_diastolic":
        if (numValue < 60) return "Diastolic pressure cannot be less than 60 mmHg";
        if (numValue > 140) return "Diastolic pressure cannot be greater than 140 mmHg";
        break;
      case "pulse":
        if (numValue < 40) return "Pulse cannot be less than 40 b/min";
        if (numValue > 120) return "Pulse cannot be greater than 120 b/min";
        break;
      case "weight_kg":
        if (numValue < 48.26) return "Weight cannot be less than 48.26 kg";
        if (numValue > 216.408) return "Weight cannot be greater than 216.408 kg";
        break;
      case "height_cm":
        if (numValue < 48.26) return "Height cannot be less than 48.26 cm";
        if (numValue > 216.408) return "Height cannot be greater than 216.408 cm";
        break;
      case "respiratory_rate":
        if (numValue < 5) return "Respiratory Rate cannot be less than 5 breaths/min";
        if (numValue > 60) return "Respiratory Rate cannot be greater than 60 breaths/min";
        break;
      case "surface_area":
        if (numValue < 0.1) return "Surface Area cannot be less than 0.1 m²";
        if (numValue > 3.0) return "Surface Area cannot be greater than 3.0 m²";
        break;
      default:
        break;
    }
    return "";
  };

  const handleVitals = (e) => {
    const { name, value } = e.target;
    const updatedVitals = { ...vitals, [name]: value };

    // Validate the specific field
    const error = validateVitalField(name, value);
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[name] = error;
      } else {
        delete newErrors[name];
      }
      return newErrors;
    });

    // Auto-calculate BMI/MUAC when height or weight changes
    if (name === "height_cm" || name === "weight_kg") {
      const newHeight = name === "height_cm" ? value : vitals.height_cm;
      const newWeight = name === "weight_kg" ? value : vitals.weight_kg;
      updatedVitals.bmi_muac = calculateBmiMuac(newHeight, newWeight);
    }

    // Clear "On Family Planning" when Family Planning Status changes
    if (name === "family_planning_status") {
      if (value !== "FAMILY_PLANNING_STATUS_ON_FAMILY_PLANNING") {
        updatedVitals.on_family_planning = "";
      }
    }

    setVitals(updatedVitals);
  };

  const [clinical, setClinical] = useState({
    paediatric_disclosure: "",
    functional_status: "",
    who_stage: "",
    who_stage_criteria: [],
    tb_status: "",
    tb_status_confirmed: "",
    cryptococcal_status: "",
    hepatitis_status: "",
    oral_problems: [],
    noted_side_effect: [],
    dsd_status: "",
    dsd_model: "",
    date_devolved: "",
  });
  const handleClinical = (e) => {
    const { name, value } = e.target;

    // If WHO stage is being changed, clear the criteria selection
    if (name === "who_stage") {
      setClinical((prev) => ({
        ...prev,
        [name]: value,
        who_stage_criteria: [] // Clear criteria when stage changes
      }));
    } else if (name === "dsd_status") {
      // If DSD status is being changed, clear the DSD model and date devolved
      const isFacilityOrCommunity = value && (value.includes("FACILITY") || value.includes("COMMUNITY") || value.includes("Facility") || value.includes("Community"));
      setClinical((prev) => ({
        ...prev,
        [name]: value,
        dsd_model: "",
        date_devolved: isFacilityOrCommunity ? prev.date_devolved : ""
      }));
    } else if (name === "tb_status") {
      // Clear tb_status_confirmed when tb_status changes away from "Confirmed TB"
      const isConfirmedTB = value === "TB_STATUS_CONFIRMED_TB";
      setClinical((prev) => ({
        ...prev,
        tb_status: value,
        tb_status_confirmed: isConfirmedTB ? prev.tb_status_confirmed : "",
      }));
    } else {
      setClinical((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle WHO Stage criteria transfer
  const handleWhoStageCriteriaTransfer = (newSelectedCriteria) => {
    setClinical((prev) => ({ ...prev, who_stage_criteria: newSelectedCriteria }));
  };

  // Handle Other OIs/ Other Problems multi-select change
  const handleOralProblemsChange = (selectedOptions) => {
    setClinical((prev) => ({ ...prev, oral_problems: selectedOptions || [] }));
  };

  // Transform opportunistic infection codeset to ReactSelect format
  const oralProblemsOptions = opportunisticInfectionCodeset.map((option) => ({
    value: option.code,
    label: option.display,
  }));

  const handleSideEffectsChange = (selectedOptions) => {
    setClinical((prev) => ({ ...prev, noted_side_effect: selectedOptions || [] }));
  };

  // Transform side effects codeset to ReactSelect format
  const sideEffectsOptions = sideEffectsCodeset.map((option) => ({
    value: option.code,
    label: option.display,
  }));

  // ── Cervical Cancer (Female patients only) ───────────────────────────────
  const [cervical_cancer_screening, setCervicalCancer] = useState("");
  const [cervical_cancer_treatment, setCervicalCancerTreatment] = useState("");
  const [cervical_cancer_other_findings, setCervicalCancerOtherFindings] = useState("");

  // Handle cervical cancer screening change - clear treatment if not "Screened positive & treated"
  const handleCervicalCancerScreeningChange = (e) => {
    const value = e.target.value;
    const isTreated = value === "CERVICAL_CANCER_SCREENING_STATUS_SCREENED_POSITIVE_&_TREATED";
    const isOtherFindings = value === "CERVICAL_CANCER_SCREENING_STATUS__OTHER_FINDINGS_(SPECIFY)";
    setCervicalCancer(value);

    // Clear treatment if screening status is not "Screened positive & treated"
    if (!isTreated) {
      setCervicalCancerTreatment("");
    }

    // Clear other findings if screening status is not "Other findings (specify)"
    if (!isOtherFindings) {
      setCervicalCancerOtherFindings("");
    }
  };

  // ── Section 4: Medications ───────────────────────────────────────────────
  const [arvList, setArvList] = useState([]);

  const [regimenTypes, setRegimenTypes] = useState({});

  // Modal states for ARV add, edit and delete
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentArvIndex, setCurrentArvIndex] = useState(null);
  const [newArv, setNewArv] = useState({
    regimen_line: "",
    regimen: "",
    adherence: "",
    dose: "",
    why_poor_fair_adherence: "",
  });
  const [editingArv, setEditingArv] = useState({
    regimen_line: "",
    regimen: "",
    adherence: "",
    dose: "",
    why_poor_fair_adherence: "",
  });
  const [addModalRegimenTypes, setAddModalRegimenTypes] = useState([]);
  const [editModalRegimenTypes, setEditModalRegimenTypes] = useState([]);

  const handleArv = (index, e) => {
    const { name, value } = e.target;
    const updatedArvList = [...arvList];
    updatedArvList[index] = { ...updatedArvList[index], [name]: value };

    // Clear why_poor_fair_adherence if adherence is not Poor or Fair
    if (name === "adherence") {
      if (value !== "P" && value !== "F") {
        updatedArvList[index].why_poor_fair_adherence = "";
      }
    }

    setArvList(updatedArvList);
  };

  // Open add modal
  const openAddModal = () => {
    setNewArv({
      regimen_line: "",
      regimen: "",
      adherence: "",
      dose: "",
      why_poor_fair_adherence: "",
    });
    setAddModalRegimenTypes([]);
    setAddModalOpen(true);
  };

  // Handle add modal field changes
  const handleAddModalChange = (e) => {
    const { name, value } = e.target;
    const updatedArv = { ...newArv, [name]: value };

    // Clear why_poor_fair_adherence if adherence is not Poor or Fair
    if (name === "adherence") {
      if (value !== "P" && value !== "F") {
        updatedArv.why_poor_fair_adherence = "";
      }
    }

    setNewArv(updatedArv);
  };

  // Handle regimen line change in add modal
  const handleAddModalRegimenLineChange = async (e) => {
    const regimenLineId = e.target.value;
    setNewArv({ ...newArv, regimen_line: regimenLineId, regimen: "" });

    if (regimenLineId) {
      try {
        const response = await axios.get(`${baseUrl}hiv/regimen/types/${regimenLineId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddModalRegimenTypes(response.data);
      } catch (error) {
        console.error("Error fetching regimen types:", error);
      }
    } else {
      setAddModalRegimenTypes([]);
    }
  };

  // Save new ARV entry
  const saveNewArv = () => {
    // Validation - at least regimen line should be selected
    if (arvList.length >= 1) {
      toast.error("Only one ARV regimen is allowed. Edit or delete the existing entry first.");
      setAddModalOpen(false);
      return;
    }

    // Validation - at least regimen line should be selected
    if (!newArv.regimen_line) {
      toast.error("Please select a regimen line");
      return;
    }

    const newIndex = arvList.length;
    setArvList([...arvList, { ...newArv }]);

    // Store regimen types for this index
    if (addModalRegimenTypes.length > 0) {
      setRegimenTypes((prev) => ({ ...prev, [newIndex]: addModalRegimenTypes }));
    }

    setAddModalOpen(false);
    toast.success("ARV regimen added successfully");
  };

  const calculateNextAppointmentDate = (visitDate, arvEntries) => {
    if (!visitDate || !arvEntries || arvEntries.length === 0) return "";

    const doseDays = parseInt(arvEntries[0]?.dose, 10);
    if (isNaN(doseDays) || doseDays <= 0) return "";

    const next = moment(visitDate).add(doseDays, "days");
    return next.isValid() ? next.format("YYYY-MM-DD") : "";
  };

  const removeArvEntry = (index) => {
    const updatedArvList = arvList.filter((_, i) => i !== index);
    setArvList(updatedArvList);

    // Clean up regimen types for removed index
    const updatedRegimenTypes = { ...regimenTypes };
    delete updatedRegimenTypes[index];

    // Reindex remaining regimen types
    const reindexedTypes = {};
    Object.keys(updatedRegimenTypes).forEach((key) => {
      const oldIndex = parseInt(key);
      const newIndex = oldIndex > index ? oldIndex - 1 : oldIndex;
      reindexedTypes[newIndex] = updatedRegimenTypes[key];
    });
    setRegimenTypes(reindexedTypes);
  };

  // Open edit modal
  const openEditModal = (index) => {
    setCurrentArvIndex(index);
    setEditingArv({ ...arvList[index] });
    setEditModalRegimenTypes(regimenTypes[index] || []);
    setEditModalOpen(true);
  };

  // Handle edit modal field changes
  const handleEditModalChange = (e) => {
    const { name, value } = e.target;
    const updatedArv = { ...editingArv, [name]: value };

    // Clear why_poor_fair_adherence if adherence is not Poor or Fair
    if (name === "adherence") {
      if (value !== "P" && value !== "F") {
        updatedArv.why_poor_fair_adherence = "";
      }
    }

    setEditingArv(updatedArv);
  };

  // Handle regimen line change in edit modal
  const handleEditModalRegimenLineChange = async (e) => {
    const regimenLineId = e.target.value;
    setEditingArv({ ...editingArv, regimen_line: regimenLineId, regimen: "" });

    if (regimenLineId) {
      try {
        const response = await axios.get(`${baseUrl}hiv/regimen/types/${regimenLineId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditModalRegimenTypes(response.data);
      } catch (error) {
        console.error("Error fetching regimen types:", error);
      }
    } else {
      setEditModalRegimenTypes([]);
    }
  };

  // Save edited ARV entry
  const saveEditedArv = () => {
    const updatedArvList = [...arvList];
    updatedArvList[currentArvIndex] = { ...editingArv };
    setArvList(updatedArvList);

    // Update regimen types for this index
    setRegimenTypes((prev) => ({ ...prev, [currentArvIndex]: editModalRegimenTypes }));

    setEditModalOpen(false);
    setCurrentArvIndex(null);
    toast.success("ARV regimen updated successfully");
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (index) => {
    setCurrentArvIndex(index);
    setDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    removeArvEntry(currentArvIndex);
    setDeleteDialogOpen(false);
    setCurrentArvIndex(null);
    toast.success("ARV regimen deleted successfully");
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setCurrentArvIndex(null);
  };

  // Get regimen line display name
  const getRegimenLineDisplay = (regimenLineId) => {
    const allLines = [...adultRegimenLine, ...childRegimenLine];
    const line = allLines.find((l) => l.id === parseInt(regimenLineId));
    return line ? line.description : "";
  };

  // Get regimen display name
  const getRegimenDisplay = (regimenId, index) => {
    const types = regimenTypes[index] || [];
    const regimen = types.find((r) => r.id === parseInt(regimenId));
    return regimen ? regimen.description : "";
  };

  // Get adherence display name
  const getAdherenceDisplay = (adherenceCode) => {
    const adherence = arvDrugAdherenceCodeset.find((o) => o.code === adherenceCode);
    return adherence ? adherence.display : "";
  };

  // Handle regimen line selection and fetch regimen types
  const handleRegimenLineSelect = async (index, e) => {
    const regimenLineId = e.target.value;
    const updatedArvList = [...arvList];
    updatedArvList[index] = { ...updatedArvList[index], regimen_line: regimenLineId, regimen: "" };
    setArvList(updatedArvList);

    if (regimenLineId) {
      try {
        const response = await axios.get(`${baseUrl}hiv/regimen/types/${regimenLineId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRegimenTypes((prev) => ({ ...prev, [index]: response.data }));
      } catch (error) {
        console.error("Error fetching regimen types:", error);
      }
    } else {
      setRegimenTypes((prev) => ({ ...prev, [index]: [] }));
    }
  };

  const [ctx, setCtx] = useState("");
  const [ctx_medication, setCtxMedication] = useState("");
  const handleCtx = (e) => {
    setCtx(e.target.value);
  };
  const handleCtxMedication = (e) => {
    setCtxMedication(e.target.value);
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

    // Clear related errors when dates are changed
    if (name === "start_date" || name === "completion_date") {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.tpt_start_date;
        delete newErrors.tpt_completion_date;
        return newErrors;
      });
    }
  };

  const [otherDrugs, setOtherDrugs] = useState("");

  // ── Section 5: Lab Results & Follow-up ──────────────────────────────────
  const [cd4Ordered, setCd4Ordered] = useState(false);
  const [viralLoadOrdered, setViralLoadOrdered] = useState(false);
  const [lab, setLab] = useState({
    cd4_count: "",
    cd4_date: "",
    viral_load_result: "",
    viral_load_date: "",
    viral_load_indication: "",
    eac: "",
    rbs: "",
    other_tests_done: [],
    type_of_appointment: "",
  });
  const handleLab = (e) => {
    const { name, value } = e.target;
    const updatedLab = { ...lab, [name]: value };

    // Clear EAC if viral load result is < 1000
    if (name === "viral_load_result") {
      const vlValue = parseFloat(value);
      if (isNaN(vlValue) || vlValue < 1000) {
        updatedLab.eac = "";
      }
    }

    // Validate RBS to ensure it doesn't exceed database limit
    if (name === "rbs" && value) {
      const rbsValue = parseFloat(value);
      if (!isNaN(rbsValue) && rbsValue > 999.99) {
        toast.warning("RBS value will be capped at 999.99 due to system limits.", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }

    setLab(updatedLab);
  };

  const handleOtherTestsChange = (selectedOptions) => {
    setLab((prev) => ({ ...prev, other_tests_done: selectedOptions || [] }));
  };

  const [followUp, setFollowUp] = useState({
    health_insurance_coverage: "",
    next_appointment_date: "",
  });
  const handleFollowUp = (e) => {
    const { name, value } = e.target;
    setFollowUp((prev) => ({ ...prev, [name]: value }));
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = async () => {
    const temp = {};
    if (!visitInfo.visit_date) {
      temp.visit_date = "Visit date is required";
      setErrors(temp);
      return false;
    }

    // Check if visit date is not earlier than DOB, HIV enrollment, or ART start
    if (minVisitDate && visitInfo.visit_date < minVisitDate) {
      const dobFormatted = props.patientObj1?.dateOfBirth ? moment(props.patientObj1.dateOfBirth).format("DD MMM YYYY") : "";
      const enrollmentFormatted = props.patientObj1?.enrollmentCommencement?.data?.registration?.date_enrolled_in_hiv_care
        ? moment(props.patientObj1.enrollmentCommencement.data.registration.date_enrolled_in_hiv_care).format("DD MMM YYYY")
        : "";
      const artStartFormatted = props.patientObj1?.enrollmentCommencement?.data?.commencement?.date_art_started
        ? moment(props.patientObj1.enrollmentCommencement.data.commencement.date_art_started).format("DD MMM YYYY")
        : "";

      temp.visit_date = `Visit date cannot be earlier than Date of Birth (${dobFormatted}), HIV Enrollment Date (${enrollmentFormatted}), or ART Start Date (${artStartFormatted})`;
      setErrors(temp);
      toast.error(temp.visit_date, {
        position: toast.POSITION.TOP_RIGHT,
      });
      return false;
    }

    // Check for duplicate visit date (only for new visits, not edits)
    if (!isEditMode) {
      try {
        const visitCheckResponse = await axios.get(
          `${baseUrl}hiv/art/clinic-visit/person/${props.patientObj.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const existingVisits = visitCheckResponse.data || [];
        const isDuplicate = existingVisits.some(
          (visit) => moment(visit.visitDate).format("YYYY-MM-DD") === visitInfo.visit_date
        );

        if (isDuplicate) {
          temp.visit_date = "A visit already exists for this date. Please select a different date.";
          setErrors(temp);
          toast.error("A visit already exists for this date", {
            position: toast.POSITION.TOP_RIGHT,
          });
          return false;
        }
      } catch (error) {
        console.error("Error checking for duplicate visit date:", error);
      }
    }

    if (!isEditMode) {
      try {
        const careAndSupportResponse = await axios.get(
            `${baseUrl}observation/person/${props.patientObj.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const careAndSupportRecords = careAndSupportResponse.data || [];
        const hasCareAndSupportForDate = careAndSupportRecords.some(
            (record) =>
                record.type === "Chronic Care" &&
                moment(record.dateOfObservation).format("YYYY-MM-DD") === visitInfo.visit_date
        );

        if (!hasCareAndSupportForDate) {
          temp.visit_date = "Care and Support must be documented for this visit date before creating a Care Card Follow-up.";
          setErrors(temp);
          toast.error("Please document Care and Support for this date first", {
            position: toast.POSITION.TOP_CENTER,
          });
          return false;
        }
      } catch (error) {
        console.error("Error checking care and support:", error);
        // Relaxed: don't block the save just because the check failed (e.g. API/network issue) — warn and continue.
        toast.warning("Unable to verify Care and Support documentation; proceeding anyway.", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }

    // Check if at least one ARV en, the nexttry has a regimen
    // const hasAtLeastOneRegimen = arvList.some((arv) => arv.regimen);
    // if (!hasAtLeastOneRegimen) temp.arv_regimen = "At least one ARV regimen is required";

    // Validate "Other Findings (Specify)" field when "Other findings (specify)" is selected
    if (isFemale && cervical_cancer_screening === "CERVICAL_CANCER_SCREENING_STATUS__OTHER_FINDINGS_(SPECIFY)") {
      if (!cervical_cancer_other_findings || cervical_cancer_other_findings.trim() === "") {
        temp.cervical_cancer_other_findings = "Other findings specification is required";
      }
    }

    // Validate TPT dates
    const today = moment().format("YYYY-MM-DD");
    if (tpt.start_date) {
      // Start Date cannot be in the future
      if (moment(tpt.start_date).isAfter(today)) {
        temp.tpt_start_date = "Start Date cannot be a future date";
      }
    }

    if (tpt.start_date && tpt.completion_date) {
      // Completion Date cannot be before Start Date
      if (moment(tpt.completion_date).isBefore(tpt.start_date)) {
        temp.tpt_completion_date = "Completion Date cannot be before Start Date";
      }
    }

    if (!isEditMode && followUp.next_appointment_date) {
      if (moment(followUp.next_appointment_date).isBefore(today, "day")) {
        temp.next_appointment_date = "Next Appointment Date cannot be earlier than today";
      }
    }
    // Check for vital validation errors
    const vitalFields = ["bp_systolic", "bp_diastolic", "weight_kg", "height_cm",];
    const hasVitalErrors = vitalFields.some(field => errors[field]);
    if (hasVitalErrors) {
      toast.error("Please correct the out-of-range values in the Vitals section");
      return false;
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // ── Cancel Edit ──────────────────────────────────────────────────────────
  const handleCancelEdit = () => {
    if (props.onEditComplete) {
      props.onEditComplete();
    }
  };

  // console.log("error log", errors)
  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    // const isValid = await validate();
    // if (!isValid) {
    //   toast.error("Please fill all required fields");
    //   return;
    // }
    const validationErrors = await validate();
    const hasErrors = Object.keys(validationErrors).length > 0;

    if (hasErrors) {
      // Grab the first error message to show in the toast
      const firstErrorMsg = Object.values(validationErrors)[0];
      toast.error(firstErrorMsg || "Please fill all required fields");
      return;
    }
    setSaving(true);
    try {
      // Transform arvList to match backend ARTClinicVisitDto expected format
      const arvdrugsRegimen = arvList.map((arv) => {
        const regimenLine = arv.regimen_line ? getRegimenLineDisplay(arv.regimen_line) : "";
        const regimenIndex = arvList.indexOf(arv);
        const regimenName = arv.regimen ? getRegimenDisplay(arv.regimen, regimenIndex) : "";

        return {
          regimenLine: arv.regimen_line,
          regimenDrug: arv.regimen,
          regimenLineName: regimenLine,
          regimenDrugName: regimenName,
          dosage: arv.dose,
          regimenAdherance: arv.adherence,
          whyPoorFairAdherence: arv.why_poor_fair_adherence || ""
        };
      });

      // Get patient enrollment and facility details
      const patientDetailsResponse = await axios.get(
        `${baseUrl}hiv/patient/${props.patientObj.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const patientDetails = patientDetailsResponse.data;

      // Prepare vital sign DTO
      const vitalSignDto = {
        bodyWeight: vitals.weight_kg || "",
        height: vitals.height_cm || "",
        diastolic: vitals.bp_diastolic || "",
        systolic: vitals.bp_systolic || "",
        pulse: "",
        temperature: "",
        respiratoryRate: "",
        captureDate: visitInfo.visit_date ? `${visitInfo.visit_date} 00:00` : "",
        personId: props.patientObj.id,
        facilityId: patientDetails.enrollment?.facilityId || 0,
      };

      // Prepare WHO stage data with criteria
      const whoData = {
        stage: clinical.who_stage,
        criteria: clinical.who_stage_criteria,
      };

      // Prepare opportunistic infections data
      const opportunisticInfections = clinical.oral_problems.map(problem => ({
        code: problem.value,
        display: problem.label
      }));

      // Prepare TPT data
      const tptData = {
        code: tpt.code,
        dose: tpt.dose,
        start_date: tpt.start_date,
        completion_date: tpt.completion_date,
      };

      // Prepare other tests done
      const otherTestsDone = lab.other_tests_done.map(test => ({
        value: test.value,
        label: test.label,
        groupName: test.groupName
      }));

      // Prepare viral load order data (only if ordered)
      const viralLoadOrder = viralLoadOrdered ? [{
        labTestId: 16, // Standard viral load test ID
        dateAssayed: lab.viral_load_date,
        result: lab.viral_load_result,
        indication: lab.viral_load_indication,
      }] : [];

      // Extract IDs from codes for payload
      const whoStageOption = whoStagingCodeset.find(opt => opt.code === clinical.who_stage);
      const functionalStatusOption = functionalStatusCodeset.find(opt => opt.code === clinical.functional_status);

      const payload = {
        visitDate: visitInfo.visit_date,
        personId: props.patientObj.id,
        facilityId: patientDetails.enrollment?.facilityId || 0,
        visitId: patientDetails.currentStatus?.statusId || null,
        clinicalStageId: whoStageOption?.id || null,
        whoStagingId: whoStageOption?.id || null,
        who: whoData,
        functionalStatusId: functionalStatusOption?.id || null,
        clinicalNote: "",
        vitalSignDto: vitalSignDto,
        aRVDrugsRegimen: arvdrugsRegimen,
        viralLoadOrder: viralLoadOrder,
        opportunisticInfections: opportunisticInfections,
        tbStatus: clinical.tb_status || "",
        tbStatusConfirmed: clinical.tb_status_confirmed || "",
        cryptococcalScreeningStatus: clinical.cryptococcal_status || "",
        cervicalCancerScreeningStatus: isFemale ? cervical_cancer_screening : "",
        cervicalCancerTreatmentProvided: isFemale ? cervical_cancer_treatment : "",
        cervicalCancerOtherFindings: isFemale ? cervical_cancer_other_findings : "",
        hepatitisScreeningResult: clinical.hepatitis_status || "",
        familyPlaning: vitals.family_planning_status || "",
        onFamilyPlaning: vitals.on_family_planning || "",
        pregnancyStatus: isFemale ? vitals.pregnancy_breastfeeding_status : "",
        nextAppointment: followUp.next_appointment_date || "",

        // New Care Card Follow-Up specific fields using new columns
        durationOnArtMonths: visitInfo.duration_on_art_months ? parseInt(visitInfo.duration_on_art_months) : null,
        clinicianName: visitInfo.clinician_name || "",
        bmiMuac: vitals.bmi_muac ? parseFloat(vitals.bmi_muac) : null,
        paediatricDisclosure: clinical.paediatric_disclosure || "",
        whoStageCriteria: clinical.who_stage_criteria,
        sideEffects: clinical.noted_side_effect.map(se => se.value),
        dsdStatus: clinical.dsd_status || "",
        dsdModel: clinical.dsd_model || "",
        dateDevolved: clinical.date_devolved || "",
        cotrimoxazoleDose: {
          medication: ctx_medication || "",
          dose: ctx || ""
        },
        tptData: tptData,
        otherDrugs: otherDrugs || "",
        cd4Data: {
          cd4_result: lab.cd4_count || "",
          cd4_date: lab.cd4_date || null
        },
        cd4Ordered: cd4Ordered,
        viralLoadOrdered: viralLoadOrdered,
        eac: lab.eac || "",
        rbs: lab.rbs ? Math.min(parseFloat(lab.rbs), 999.99) : null,
        otherTestsDone: otherTestsDone,
        typeOfAppointment: lab.type_of_appointment || "",
        healthInsuranceCoverage: followUp.health_insurance_coverage || "",
      };

      // Use the correct ART Clinic Visit endpoint
      if (isEditMode && props.editingVisit) {
        // Update existing visit
        await axios.put(`${baseUrl}hiv/art/clinic-visit/${props.editingVisit.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Care Card Follow-Up Visit updated successfully");

        // Call onEditComplete to return to history tab
        if (props.onEditComplete) {
          props.onEditComplete();
        }
      } else {
        // Create new visit
        await axios.post(`${baseUrl}hiv/art/clinic-visit/`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Care Card Follow-Up Visit saved successfully");
        props.setActiveContent({ ...props.activeContent, route: "recent-history" });
      }
    } catch (err) {
      console.error("Error saving Care Card Follow-Up Visit:", err);
      const msg = err?.response?.data?.apierror?.message || "An error occurred. Please try again.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const nextAppointment = calculateNextAppointmentDate(visitInfo.visit_date, arvList);
    if (nextAppointment) {
      setFollowUp((prev) => ({ ...prev, next_appointment_date: nextAppointment }));
    }
  }, [arvList, visitInfo.visit_date]);

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <Card className={classes.root} style={{ borderRadius: "12px", overflow: "visible", width: "100%" }}>
      <CardContent>

        {/* ── Page Header ──────────────────────────────────────────────── */}
        <Box sx={{ backgroundColor: "#014d88", padding: "14px 20px", marginBottom: "20px", marginTop: "-16px", marginLeft: "-16px", marginRight: "-16px", width: "calc(100% + 32px)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>
            {isEditMode ? (
              <>
                Care Card — Edit Visit
                <Chip
                  label={moment(props.editingVisit?.visitDate).format("DD MMM YYYY")}
                  size="small"
                  style={{
                    backgroundColor: "#fff3cd",
                    color: "#856404",
                    fontWeight: 600,
                    fontSize: "11px",
                    marginLeft: "12px"
                  }}
                />
              </>
            ) : (
              "Care Card — Follow-Up Visit"
            )}
          </Typography>
          {isEditMode && (
            <MatButton
              variant="outlined"
              size="small"
              startIcon={<CancelIcon />}
              onClick={handleCancelEdit}
              style={{
                color: "#fff",
                borderColor: "#fff",
                textTransform: "none",
                fontSize: "13px"
              }}
            >
              Cancel Edit
            </MatButton>
          )}
        </Box>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/*  SECTION 1 — VISIT INFORMATION                               */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <FormAccordion panel="visit" title="Visit Information" index={0} expanded={expanded} onToggle={toggleAccordion}>
            <FieldRow>
              <Col size={6}>
                <SectionLabel>Visit Date <span style={{ color: "red" }}>*</span></SectionLabel>
                <Input
                  type="date"
                  name="visit_date"
                  value={visitInfo.visit_date}
                  min={minVisitDate}
                  max={moment(new Date()).format("YYYY-MM-DD")}
                  onChange={handleVisit}
                />
                {errors.visit_date && <span className={classes.error}>{errors.visit_date}</span>}
              </Col>
              <Col size={6}>
                <SectionLabel>Duration on ART (Months)</SectionLabel>
                <Input
                  type="number"
                  name="duration_on_art_months"
                  value={visitInfo.duration_on_art_months}
                  readOnly
                  disabled
                  placeholder="Auto-calculated"
                  min="0"
                  style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
                />
              </Col>
            </FieldRow>
            <FieldRow>
              <Col size={6}>
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
            {isFemale && patientAge >= 10 && (
              <>
                <FieldRow>
                  <Col size={6}>
                    <SectionLabel>Pregnancy / Breastfeeding</SectionLabel>
                    <Input type="select" name="pregnancy_breastfeeding_status" value={vitals.pregnancy_breastfeeding_status} onChange={handleVitals}>
                      <option value="">Select</option>
                      {pregnancyStatusCodeset.map((option) => (
                        <option key={option.id} value={option.code}>
                          {option.display}
                        </option>
                      ))}
                    </Input>
                  </Col>
                  <Col size={6}>
                    <SectionLabel>Family Planning Status</SectionLabel>
                    <Input type="select" name="family_planning_status" value={vitals.family_planning_status} onChange={handleVitals}>
                      <option value="">Select</option>
                      {familyPlanningStatusCodeset.map((option) => (
                        <option key={option.id} value={option.code}>
                          {option.display}
                        </option>
                      ))}
                    </Input>
                  </Col>
                </FieldRow>
                {vitals.family_planning_status === "FAMILY_PLANNING_STATUS_ON_FAMILY_PLANNING" && (
                  <FieldRow>
                    <Col size={6}>
                      <SectionLabel>Family Planning Type</SectionLabel>
                      <Input type="select" name="on_family_planning" value={vitals.on_family_planning} onChange={handleVitals}>
                        <option value="">Select</option>
                        {familyPlanningMethodCodeset.map((option) => (
                          <option key={option.id} value={option.code}>
                            {option.display}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  </FieldRow>
                )}
              </>
            )}
          </FormAccordion>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/*  SECTION 2 — VITALS & CLINICAL STATUS                        */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <FormAccordion panel="vitals" title="Vitals & Clinical Status" index={1} expanded={expanded} onToggle={toggleAccordion}>

            <SubHeading>Vitals</SubHeading>
            <Box sx={{ background: "#fff", border: "1px solid #014d88", borderRadius: "4px", padding: "16px", marginBottom: "16px" }}>
              <FieldRow>
                <Col size={3}>
                  <SectionLabel>Height (cm)</SectionLabel>
                  <Input
                    type="number"
                    name="height_cm"
                    value={vitals.height_cm}
                    onChange={handleVitals}
                    placeholder="cm"
                    min="0"
                    step="0.1"
                  />
                  {errors.height_cm && <span className={classes.error}>{errors.height_cm}</span>}
                </Col>
                <Col size={3}>
                  <SectionLabel>Weight (kg)</SectionLabel>
                  <Input
                    type="number"
                    name="weight_kg"
                    value={vitals.weight_kg}
                    onChange={handleVitals}
                    placeholder="kg"
                    min="0"
                    step="0.1"
                  />
                  {errors.weight_kg && <span className={classes.error}>{errors.weight_kg}</span>}
                </Col>
                <Col size={3}>
                  <SectionLabel>
                    {isPediatric ? "MUAC (cm)" : "BMI"}
                    <span style={{ fontSize: "10px", color: "#666", fontWeight: "normal", marginLeft: "4px" }}>
                      (Auto-calculated)
                    </span>
                  </SectionLabel>
                  <Input
                    type="text"
                    name="bmi_muac"
                    value={vitals.bmi_muac}
                    onChange={handleVitals}
                    placeholder="Auto-calculated"
                    readOnly
                    style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
                  />
                </Col>
                <Col size={3}>
                  <SectionLabel>Blood Pressure (mmHg)</SectionLabel>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <Input type="number" name="bp_systolic" value={vitals.bp_systolic} onChange={handleVitals} placeholder="Sys" min="0" />
                    <span style={{ color: "#546e7a", fontSize: "18px", fontWeight: 300 }}>/</span>
                    <Input type="number" name="bp_diastolic" value={vitals.bp_diastolic} onChange={handleVitals} placeholder="Dia" min="0" />
                  </div>
                  {(errors.bp_systolic || errors.bp_diastolic) && <span className={classes.error}>{errors.bp_systolic || errors.bp_diastolic}</span>}
                </Col>
              </FieldRow>
            </Box>

            <SubHeading>Clinical Status</SubHeading>
            <FieldRow>
              {patientAge < 15 && (
                <Col size={6}>
                  <SectionLabel>Paediatric and Adolescent Disclosure</SectionLabel>
                  <Input type="select" name="paediatric_disclosure" value={clinical.paediatric_disclosure} onChange={handleClinical}>
                    <option value="">Select</option>
                    {paediatricAdolescentDisclosureCodeset.map((option) => (
                      <option key={option.id} value={option.code}>
                        {option.display}
                      </option>
                    ))}
                  </Input>
                </Col>
              )}
              <Col size={6}>
                <SectionLabel>Functional Status</SectionLabel>
                <Input type="select" name="functional_status" value={clinical.functional_status} onChange={handleClinical}>
                  <option value="">Select</option>
                  {functionalStatusCodeset.map((option) => (
                    <option key={option.id} value={option.code}>
                      {option.display}
                    </option>
                  ))}
                </Input>
              </Col>
            </FieldRow>
            <FieldRow>
              <Col size={6}>
                <SectionLabel>WHO Clinical Stage</SectionLabel>
                <Input type="select" name="who_stage" value={clinical.who_stage} onChange={handleClinical}>
                  <option value="">Select</option>
                  {whoStagingCodeset.map((option) => (
                    <option key={option.id} value={option.code}>
                      {option.display}
                    </option>
                  ))}
                </Input>
              </Col>
              <Col size={6}>
                <SectionLabel>TB Status</SectionLabel>
                <Input type="select" name="tb_status" value={clinical.tb_status} onChange={handleClinical}>
                  <option value="">Select</option>
                  {tbStatusCodeset.map((option) => (
                    <option key={option.id} value={option.code}>
                      {option.display}
                    </option>
                  ))}
                </Input>
              </Col>
            </FieldRow>

            {/* Confirmed TB - Conditional Field */}
            {clinical.tb_status === "TB_STATUS_CONFIRMED_TB" && (
              <FieldRow>
                <Col size={6}>
                  <SectionLabel>Confirmed TB</SectionLabel>
                  <Input type="select" name="tb_status_confirmed" value={clinical.tb_status_confirmed} onChange={handleClinical}>
                    <option value="">Select</option>
                    {tbStatusConfirmedCodeset.map((option) => (
                      <option key={option.id} value={option.code}>
                        {option.display}
                      </option>
                    ))}
                  </Input>
                </Col>
              </FieldRow>
            )}

            {/* WHO Stage Criteria - Conditional Transfer List */}
            {clinical.who_stage && WHO_STAGE_CRITERIA_OPTIONS[clinical.who_stage] && (
              <TransferList
                availableItems={WHO_STAGE_CRITERIA_OPTIONS[clinical.who_stage]}
                selectedItems={clinical.who_stage_criteria}
                onTransfer={handleWhoStageCriteriaTransfer}
                stageName={whoStagingCodeset.find(opt => opt.code === clinical.who_stage)?.display || clinical.who_stage}
              />
            )}

            <FieldRow>
              <Col size={6}>
                <SectionLabel>Cryptococcal Status</SectionLabel>
                <Input type="select" name="cryptococcal_status" value={clinical.cryptococcal_status} onChange={handleClinical}>
                  <option value="">Select</option>
                  {cryptococcalCodeset.map((option) => (
                    <option key={option.id} value={option.code}>
                      {option.display}
                    </option>
                  ))}
                </Input>
              </Col>
              <Col size={6}>
                <SectionLabel>Hepatitis Status</SectionLabel>
                <Input type="select" name="hepatitis_status" value={clinical.hepatitis_status} onChange={handleClinical}>
                  <option value="">Select</option>
                  {hepatitisCodeset.map((option) => (
                    <option key={option.id} value={option.code}>
                      {option.display}
                    </option>
                  ))}
                </Input>
              </Col>
            </FieldRow>
            {isFemale && patientAge >= 15 && (
              <FieldRow>
                <Col size={6}>
                  <SectionLabel>Cervical Cancer Status</SectionLabel>
                  <Input
                    type="select"
                    value={cervical_cancer_screening}
                    onChange={handleCervicalCancerScreeningChange}
                  >
                    <option value="">Select</option>
                    {cervicalCancerCodeset.map((option) => (
                      <option key={option.id} value={option.code}>
                        {option.display}
                      </option>
                    ))}
                  </Input>
                </Col>

                {/* Cervical Cancer Treatment - Conditional Field (beside status) */}
                {cervical_cancer_screening === "CERVICAL_CANCER_SCREENING_STATUS_SCREENED_POSITIVE_&_TREATED" && (
                  <Col size={6}>
                    <SectionLabel>Cervical Cancer Treatment</SectionLabel>
                    <Input
                      type="select"
                      value={cervical_cancer_treatment}
                      onChange={(e) => setCervicalCancerTreatment(e.target.value)}
                    >
                      <option value="">Select</option>
                      {cervicalCancerTreatmentCodeset.map((option) => (
                        <option key={option.id} value={option.code}>
                          {option.display}
                        </option>
                      ))}
                    </Input>
                  </Col>
                )}

                {/* Other Findings (Specify) - Conditional Field (beside status) */}
                {cervical_cancer_screening === "CERVICAL_CANCER_SCREENING_STATUS__OTHER_FINDINGS_(SPECIFY)" && (
                  <Col size={6}>
                    <SectionLabel>Other Findings (Specify) <span style={{ color: "red" }}>*</span></SectionLabel>
                    <Input
                      type="text"
                      value={cervical_cancer_other_findings}
                      onChange={(e) => setCervicalCancerOtherFindings(e.target.value)}
                      placeholder="Specify other findings"
                      required
                    />
                    {errors.cervical_cancer_other_findings && <span className={classes.error}>{errors.cervical_cancer_other_findings}</span>}
                  </Col>
                )}
              </FieldRow>
            )}
            <FieldRow>
              <Col size={6}>
                <SectionLabel>Other OIs/ Other Problems</SectionLabel>
                <MultiSelect
                  options={oralProblemsOptions}
                  value={clinical.oral_problems}
                  onChange={handleOralProblemsChange}
                  placeholder="Select OIs/Other Problems..."
                />
              </Col>
              <Col size={6}>
                <SectionLabel>Noted Side Effect</SectionLabel>
                <MultiSelect
                  options={sideEffectsOptions}
                  value={clinical.noted_side_effect}
                  onChange={handleSideEffectsChange}
                  placeholder="Select side effects..."
                />
              </Col>
            </FieldRow>
            <FieldRow>
              <Col size={6}>
                <SectionLabel>DSD Status</SectionLabel>
                <Input
                  type="select"
                  name="dsd_status"
                  value={clinical.dsd_status}
                  onChange={handleClinical}
                >
                  <option value="">Select</option>
                  {dsdStatusCodeset.map((option) => (
                    <option key={option.id} value={option.code}>
                      {option.display}
                    </option>
                  ))}
                </Input>
              </Col>
              {(clinical.dsd_status && (clinical.dsd_status.includes("FACILITY") || clinical.dsd_status.includes("Facility"))) && (
                <Col size={6}>
                  <SectionLabel>Facility Based DSD Model</SectionLabel>
                  <Input
                    type="select"
                    name="dsd_model"
                    value={clinical.dsd_model}
                    onChange={handleClinical}
                  >
                    <option value="">Select</option>
                    {dsdModelFacilityCodeset.map((option) => (
                      <option key={option.id} value={option.code}>
                        {option.display}
                      </option>
                    ))}
                  </Input>
                </Col>
              )}
              {(clinical.dsd_status && (clinical.dsd_status.includes("COMMUNITY") || clinical.dsd_status.includes("Community"))) && (
                <Col size={6}>
                  <SectionLabel>Community Based DSD Model</SectionLabel>
                  <Input
                    type="select"
                    name="dsd_model"
                    value={clinical.dsd_model}
                    onChange={handleClinical}
                  >
                    <option value="">Select</option>
                    {dsdModelCommunityCodeset.map((option) => (
                      <option key={option.id} value={option.code}>
                        {option.display}
                      </option>
                    ))}
                  </Input>
                </Col>
              )}
            </FieldRow>
            {(clinical.dsd_status && (clinical.dsd_status.includes("FACILITY") || clinical.dsd_status.includes("COMMUNITY") || clinical.dsd_status.includes("Facility") || clinical.dsd_status.includes("Community"))) && (
              <FieldRow>
                <Col size={6}>
                  <SectionLabel>Date Devolved</SectionLabel>
                  <Input
                    type="date"
                    name="date_devolved"
                    value={clinical.date_devolved}
                    onChange={handleClinical}
                    min={props.patientObj1?.enrollmentCommencement?.data?.commencement?.date_art_started || ""}
                    max={moment(new Date()).format("YYYY-MM-DD")}
                  />
                </Col>
              </FieldRow>
            )}
          </FormAccordion>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/*  SECTION 3 — MEDICATIONS                                     */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <FormAccordion panel="medications" title="Medications" index={2} expanded={expanded}
                         onToggle={toggleAccordion}>

            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px"}}>
              <SubHeading style={{marginBottom: 0}}>ARV Drugs</SubHeading>
              <Tooltip
                  title={arvList.length >= 1 ? "Only one ARV regimen is allowed. Edit or delete the existing entry first." : ""}>
                    <span>
                      <MatButton
                          size="small"
                          variant="contained"
                          startIcon={<AddIcon/>}
                          style={{
                            backgroundColor: arvList.length >= 1 ? "#bdbdbd" : "#014d88",
                            color: "#fff",
                            textTransform: "none",
                          }}
                          onClick={openAddModal}
                          disabled={arvList.length >= 1}
                      >
                        Add ARV Regimen
                      </MatButton>
                    </span>
              </Tooltip>
            </div>

            {errors.arv_regimen && (
                <div style={{marginBottom: "12px"}}>
                  <span className={classes.error}>{errors.arv_regimen}</span>
                </div>
            )}

            {arvList.length > 0 && (
                <TableContainer component={Paper} sx={{marginBottom: "16px", border: "1px solid #014d88"}}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{backgroundColor: "#014d88"}}>
                        <TableCell sx={{color: "#fff", fontWeight: "bold", fontSize: "12px"}}>#</TableCell>
                        <TableCell sx={{color: "#fff", fontWeight: "bold", fontSize: "12px"}}>Regimen Line</TableCell>
                        <TableCell sx={{color: "#fff", fontWeight: "bold", fontSize: "12px"}}>Regimen</TableCell>
                        <TableCell sx={{color: "#fff", fontWeight: "bold", fontSize: "12px"}}>Adherence</TableCell>
                        <TableCell sx={{color: "#fff", fontWeight: "bold", fontSize: "12px"}}>Dose</TableCell>
                        <TableCell sx={{
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: "12px",
                          textAlign: "center"
                        }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {arvList.map((arv, index) => (
                          <TableRow key={index} sx={{"&:hover": {backgroundColor: "#f5f5f5"}}}>
                            <TableCell sx={{fontSize: "13px"}}>{index + 1}</TableCell>
                            <TableCell sx={{fontSize: "13px"}}>
                              {arv.regimen_line ? getRegimenLineDisplay(arv.regimen_line) :
                                  <span style={{color: "#9e9e9e"}}>Not set</span>}
                            </TableCell>
                            <TableCell sx={{fontSize: "13px"}}>
                              {arv.regimen ? getRegimenDisplay(arv.regimen, index) :
                                  <span style={{color: "#9e9e9e"}}>Not set</span>}
                            </TableCell>
                            <TableCell sx={{fontSize: "13px"}}>
                              {arv.adherence ? getAdherenceDisplay(arv.adherence) :
                                  <span style={{color: "#9e9e9e"}}>Not set</span>}
                            </TableCell>
                            <TableCell sx={{fontSize: "13px"}}>
                              {arv.dose || <span style={{color: "#9e9e9e"}}>Not set</span>}
                            </TableCell>
                            <TableCell sx={{textAlign: "center"}}>
                              <Tooltip title="Edit">
                                <IconButton
                                    size="small"
                                    onClick={() => openEditModal(index)}
                                    sx={{color: "#014d88", marginRight: "4px"}}
                                >
                                  <EditIcon fontSize="small"/>
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                    size="small"
                                    onClick={() => openDeleteDialog(index)}
                                    sx={{color: "#d32f2f"}}
                                >
                                  <DeleteIcon fontSize="small"/>
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
            )}

            {/* Add ARV Modal */}
            <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} maxWidth="md" fullWidth>
              <DialogTitle sx={{backgroundColor: "#014d88", color: "#fff", fontWeight: "bold"}}>
                Add ARV Regimen
              </DialogTitle>
              <DialogContent sx={{paddingTop: "20px !important"}}>
                <FieldRow style={{marginTop: "16px"}}>
                  <Col size={6}>
                    <SectionLabel>Regimen Line <span style={{color: "red"}}>*</span></SectionLabel>
                    <Input
                        type="select"
                        name="regimen_line"
                        value={newArv.regimen_line}
                        onChange={handleAddModalRegimenLineChange}
                    >
                      <option value="">Select</option>
                      {patientAge >= 15 && (
                          <>
                            {adultRegimenLine.map((value) => (
                                <option key={value.id} value={value.id}>
                                  {value.description}
                                </option>
                            ))}
                          </>
                      )}
                      {patientAge < 15 && (
                          <>
                            {childRegimenLine.map((value) => (
                                <option key={value.id} value={value.id}>
                                  {value.description}
                                </option>
                            ))}
                          </>
                      )}
                    </Input>
                  </Col>
                  <Col size={6}>
                    <SectionLabel>Regimen</SectionLabel>
                    <Input
                        type="select"
                        name="regimen"
                        value={newArv.regimen}
                        onChange={handleAddModalChange}
                    >
                      <option value="">Select</option>
                      {addModalRegimenTypes.map((value) => (
                          <option key={value.id} value={value.id}>
                            {value.description}
                          </option>
                      ))}
                    </Input>
                  </Col>
                </FieldRow>
                <FieldRow>
                  <Col size={6}>
                    <SectionLabel>Adherence</SectionLabel>
                    <Input
                        type="select"
                        name="adherence"
                        value={newArv.adherence}
                        onChange={handleAddModalChange}
                    >
                      <option value="">Select</option>
                      {arvDrugAdherenceCodeset.map((option) => (
                          <option key={option.id} value={option.code}>
                            {option.display}
                          </option>
                      ))}
                    </Input>
                  </Col>
                  <Col size={6}>
                    <SectionLabel>Dose</SectionLabel>
                    <Input
                        type="number"
                        name="dose"
                        value={newArv.dose}
                        onChange={handleAddModalChange}
                        placeholder="e.g. 1 tablet daily"
                        min="0"
                        step="1"
                    />
                  </Col>
                </FieldRow>
                {(newArv.adherence === "P" || newArv.adherence === "F") && (
                    <FieldRow>
                      <Col size={12}>
                        <SectionLabel>Why Poor/Fair Adherence</SectionLabel>
                        <Input
                            type="select"
                            name="why_poor_fair_adherence"
                            value={newArv.why_poor_fair_adherence}
                            onChange={handleAddModalChange}
                        >
                          <option value="">Select</option>
                          {whyPoorFairAdherenceCodeset.map((option) => (
                              <option key={option.id} value={option.code}>
                                {option.display}
                              </option>
                          ))}
                        </Input>
                      </Col>
                    </FieldRow>
                )}
              </DialogContent>
              <DialogActions sx={{padding: "16px"}}>
                <MatButton
                    onClick={() => setAddModalOpen(false)}
                    style={{textTransform: "none"}}
                >
                  Cancel
                </MatButton>
                <MatButton
                    onClick={saveNewArv}
                    variant="contained"
                    style={{backgroundColor: "#014d88", color: "#fff", textTransform: "none"}}
                    startIcon={<AddIcon/>}
                >
                  Add to List
                </MatButton>
              </DialogActions>
            </Dialog>

            {/* Edit ARV Modal */}
            <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="md" fullWidth>
              <DialogTitle sx={{backgroundColor: "#014d88", color: "#fff", fontWeight: "bold"}}>
                Edit ARV Regimen
              </DialogTitle>
              <DialogContent sx={{paddingTop: "20px !important"}}>
                <FieldRow style={{marginTop: "16px"}}>
                  <Col size={6}>
                    <SectionLabel>Regimen Line <span style={{color: "red"}}>*</span></SectionLabel>
                    <Input
                        type="select"
                        name="regimen_line"
                        value={editingArv.regimen_line}
                        onChange={handleEditModalRegimenLineChange}
                    >
                      <option value="">Select</option>
                      {patientAge >= 15 && (
                          <>
                            {adultRegimenLine.map((value) => (
                                <option key={value.id} value={value.id}>
                                  {value.description}
                                </option>
                            ))}
                          </>
                      )}
                      {patientAge < 15 && (
                          <>
                            {childRegimenLine.map((value) => (
                                <option key={value.id} value={value.id}>
                                  {value.description}
                                </option>
                            ))}
                          </>
                      )}
                    </Input>
                  </Col>
                  <Col size={6}>
                    <SectionLabel>Regimen</SectionLabel>
                    <Input
                        type="select"
                        name="regimen"
                        value={editingArv.regimen}
                        onChange={handleEditModalChange}
                    >
                      <option value="">Select</option>
                      {editModalRegimenTypes.map((value) => (
                          <option key={value.id} value={value.id}>
                            {value.description}
                          </option>
                      ))}
                    </Input>
                  </Col>
                </FieldRow>
                <FieldRow>
                  <Col size={6}>
                    <SectionLabel>Adherence</SectionLabel>
                    <Input
                        type="select"
                        name="adherence"
                        value={editingArv.adherence}
                        onChange={handleEditModalChange}
                    >
                      <option value="">Select</option>
                      {arvDrugAdherenceCodeset.map((option) => (
                          <option key={option.id} value={option.code}>
                            {option.display}
                          </option>
                      ))}
                    </Input>
                  </Col>
                  <Col size={6}>
                    <SectionLabel>Dose</SectionLabel>
                    <Input
                        type="number"
                        name="dose"
                        value={editingArv.dose}
                        onChange={handleEditModalChange}
                        placeholder="e.g. 1 tablet daily"
                        min="0"
                        step="1"
                    />
                  </Col>
                </FieldRow>
                {(editingArv.adherence === "P" || editingArv.adherence === "F") && (
                    <FieldRow>
                      <Col size={12}>
                        <SectionLabel>Why Poor/Fair Adherence</SectionLabel>
                        <Input
                            type="select"
                            name="why_poor_fair_adherence"
                            value={editingArv.why_poor_fair_adherence}
                            onChange={handleEditModalChange}
                        >
                          <option value="">Select</option>
                          {whyPoorFairAdherenceCodeset.map((option) => (
                              <option key={option.id} value={option.code}>
                                {option.display}
                              </option>
                          ))}
                        </Input>
                      </Col>
                    </FieldRow>
                )}
              </DialogContent>
              <DialogActions sx={{padding: "16px"}}>
                <MatButton
                    onClick={() => setEditModalOpen(false)}
                    style={{textTransform: "none"}}
                >
                  Cancel
                </MatButton>
                <MatButton
                    onClick={saveEditedArv}
                    variant="contained"
                    style={{backgroundColor: "#014d88", color: "#fff", textTransform: "none"}}
                >
                  Save Changes
                </MatButton>
              </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={cancelDelete} maxWidth="xs" fullWidth>
              <DialogTitle sx={{backgroundColor: "#d32f2f", color: "#fff", fontWeight: "bold"}}>
                Confirm Delete
              </DialogTitle>
              <DialogContent sx={{paddingTop: "20px !important"}}>
                <Typography sx={{fontSize: "14px", marginBottom: "8px"}}>
                  Are you sure you want to delete this ARV regimen?
                </Typography>
                <Typography sx={{fontSize: "13px", color: "#666", fontStyle: "italic"}}>
                  This action cannot be undone.
                </Typography>
              </DialogContent>
              <DialogActions sx={{padding: "16px"}}>
                <MatButton
                    onClick={cancelDelete}
                    variant="outlined"
                    style={{textTransform: "none", borderColor: "#666", color: "#666"}}
                >
                  Cancel
                </MatButton>
                <MatButton
                    onClick={confirmDelete}
                    variant="contained"
                    style={{backgroundColor: "#d32f2f", color: "#fff", textTransform: "none"}}
                >
                  Delete
                </MatButton>
              </DialogActions>
            </Dialog>

            {/* Cotrimoxazole */}
            <SubHeading>Cotrimoxazole (CTX)</SubHeading>
            <Box sx={{
              background: "#fff",
              border: "1px solid #014d88",
              borderRadius: "4px",
              padding: "14px 16px",
              marginBottom: "16px"
            }}>
              <FieldRow>
                <Col size={6}>
                  <SectionLabel>Cotrimoxazole (CTX) Medication</SectionLabel>
                  <Input type="select" value={ctx_medication} onChange={handleCtxMedication}>
                    <option value="">Select</option>
                    {ctxMedications.map((medication) => (
                        <option key={medication.id} value={medication.id}>
                          {medication.description}
                        </option>
                    ))}
                  </Input>
                </Col>
                <Col size={6}>
                  <SectionLabel>Dose</SectionLabel>
                  <Input type="number" value={ctx} onChange={handleCtx} placeholder="e.g. 1 tablet daily, 960mg" min="0"
                         step="1"/>
                </Col>
              </FieldRow>
            </Box>

            {/* TB Preventive Therapy */}
            <SubHeading>TB Preventive Therapy (TPT)</SubHeading>
            <Box sx={{
              background: "#fff",
              border: "1px solid #014d88",
              borderRadius: "4px",
              padding: "14px 16px",
              marginBottom: "16px"
            }}>
              <FieldRow>
                <Col size={6}>
                  <SectionLabel>TPT Medication (Code)</SectionLabel>
                  <Input type="select" name="code" value={tpt.code} onChange={handleTpt}>
                    <option value="">Select</option>
                    {tptMedications.map((medication) => (
                        <option key={medication.id} value={medication.id}>
                          {medication.description}
                        </option>
                    ))}
                  </Input>
                </Col>
                <Col size={6}>
                  <SectionLabel>Dose</SectionLabel>
                  <Input type="number" name="dose" value={tpt.dose} onChange={handleTpt} placeholder="e.g. 300mg"
                         min="0" step="1"/>
                </Col>
              </FieldRow>
              <FieldRow>
                <Col size={6}>
                  <SectionLabel>Start Date</SectionLabel>
                  <Input type="date" name="start_date" value={tpt.start_date} onChange={handleTpt}/>
                  {errors.tpt_start_date && <span className={classes.error}>{errors.tpt_start_date}</span>}
                </Col>
                <Col size={6}>
                  <SectionLabel>Completion Date</SectionLabel>
                  <Input type="date" name="completion_date" value={tpt.completion_date} onChange={handleTpt}/>
                  {errors.tpt_completion_date && <span className={classes.error}>{errors.tpt_completion_date}</span>}
                </Col>
              </FieldRow>
            </Box>

            {/* Other Drugs */}
            <SubHeading>Other Drugs Prescribed</SubHeading>
            <Box sx={{
              background: "#fff",
              border: "1px solid #014d88",
              borderRadius: "4px",
              padding: "14px 16px",
              marginBottom: "16px"
            }}>
              <FieldRow>
                <Col size={12}>
                  <SectionLabel>Other Medications</SectionLabel>
                  <Input
                      type="textarea"
                      value={otherDrugs}
                      onChange={(e) => setOtherDrugs(e.target.value)}
                      rows={2}
                      placeholder="List any other drugs prescribed at this visit..."
                      style={{height: "auto"}}
                  />
                </Col>
              </FieldRow>
            </Box>
          </FormAccordion>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/*  SECTION 4 — LAB RESULTS & FOLLOW-UP                         */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <FormAccordion panel="lab" title="Lab Results & Follow-up" index={3} expanded={expanded}
                         onToggle={toggleAccordion}>

            {/* CD4 */}
            <SubHeading>CD4 Count</SubHeading>
            <Box sx={{
              background: "#fff",
              border: "1px solid #014d88",
              borderRadius: "4px",
              padding: "14px 16px",
              marginBottom: "16px"
            }}>
              <FieldRow>
                <Col size={12}>
                  <CheckGroup
                      name="cd4_ordered"
                      id="cd4_ordered"
                    label="Ordered"
                    checked={cd4Ordered}
                    onChange={(e) => setCd4Ordered(e.target.checked)}
                  />
                </Col>
              </FieldRow>
              {cd4Ordered && (
                <FieldRow>
                  <Col size={6}>
                    <SectionLabel>Result</SectionLabel>
                    <Input type="number" name="cd4_count" value={lab.cd4_count} onChange={handleLab} placeholder="cells/mm³" min="0" />
                  </Col>
                  <Col size={6}>
                    <SectionLabel>Result Date</SectionLabel>
                    <Input type="date" name="cd4_date" value={lab.cd4_date} onChange={handleLab} />
                  </Col>
                </FieldRow>
              )}
            </Box>

            {/* Viral Load */}
            <SubHeading>Viral Load</SubHeading>
            <Box sx={{ background: "#fff", border: "1px solid #014d88", borderRadius: "4px", padding: "14px 16px", marginBottom: "16px" }}>
              <FieldRow>
                <Col size={12}>
                  <CheckGroup
                    name="viral_load_ordered"
                    id="viral_load_ordered"
                    label="Ordered"
                    checked={viralLoadOrdered}
                    onChange={(e) => setViralLoadOrdered(e.target.checked)}
                  />
                </Col>
              </FieldRow>
              {viralLoadOrdered && (
                <>
                  <FieldRow>
                    <Col size={6}>
                      <SectionLabel>Result</SectionLabel>
                      <Input type="number" name="viral_load_result" value={lab.viral_load_result} onChange={handleLab} placeholder="e.g. 200" min="0" />
                    </Col>
                    <Col size={6}>
                      <SectionLabel>Result Date</SectionLabel>
                      <Input type="date" name="viral_load_date" value={lab.viral_load_date} onChange={handleLab} />
                    </Col>
                  </FieldRow>
                  <FieldRow>
                    <Col size={6}>
                      <SectionLabel>Indication for Viral Load Test</SectionLabel>
                      <Input type="select" name="viral_load_indication" value={lab.viral_load_indication} onChange={handleLab}>
                        <option value="">Select</option>
                        {labOrderIndicationCodeset.map((option) => (
                          <option key={option.id} value={option.code}>
                            {option.display}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  </FieldRow>

                  {/* EAC - Only show if viral load >= 1000 */}
                  {parseFloat(lab.viral_load_result) >= 1000 && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <Typography sx={{ fontSize: "12px", color: "#546e7a", marginBottom: "10px" }}>
                        Enhanced Adherence Counseling (EAC) — record if conducted following a high viral load result
                      </Typography>
                      <FieldRow>
                        <Col size={6}>
                          <SectionLabel>EAC</SectionLabel>
                          <Input type="select" name="eac" value={lab.eac} onChange={handleLab}>
                            <option value="">Select</option>
                            {EAC_OPTIONS.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </Input>
                        </Col>
                      </FieldRow>
                    </>
                  )}
                </>
              )}
            </Box>

            {/* RBS & Other Tests */}
            <SubHeading>Other Lab Tests</SubHeading>
            <FieldRow>
              <Col size={6}>
                <SectionLabel>RBS — Random Blood Sugar (mmol/L)</SectionLabel>
                <Input type="number" name="rbs" value={lab.rbs} onChange={handleLab} placeholder="mmol/L" min="0" step="0.1" />
              </Col>
              <Col size={6}>
                <SectionLabel>Other Tests Done</SectionLabel>
                <MultiSelect
                  options={labTestOptions}
                  value={lab.other_tests_done}
                  onChange={handleOtherTestsChange}
                  placeholder="Select lab tests..."
                />
              </Col>
            </FieldRow>
            <FieldRow>
              <Col size={6}>
                <SectionLabel>Type of Appointment</SectionLabel>
                <Input type="select" name="type_of_appointment" value={lab.type_of_appointment} onChange={handleLab}>
                  <option value="">Select</option>
                  {typeOfAppointmentCodeset.map((option) => (
                    <option key={option.id} value={option.code}>
                      {option.display}
                    </option>
                  ))}
                </Input>
              </Col>
            </FieldRow>

            {/* Follow-up */}
            <Divider sx={{ my: 2 }} />
            <SubHeading>Follow-up</SubHeading>
            <FieldRow>
              <Col size={6}>
                <SectionLabel>Currently on any health insurance coverage</SectionLabel>
                <Input type="select" name="health_insurance_coverage" value={followUp.health_insurance_coverage} onChange={handleFollowUp}>
                  <option value="">Select</option>
                  {healthInsuranceCoverageCodeset.map((option) => (
                    <option key={option.id} value={option.code}>
                      {option.display}
                    </option>
                  ))}
                </Input>
              </Col>
              <Col size={6}>
                <SectionLabel>Next Appointment Date</SectionLabel>
                <Input
                  type="date"
                  name="next_appointment_date"
                  value={followUp.next_appointment_date}
                  onChange={handleFollowUp}
                />
                {errors.next_appointment_date && <span className={classes.error}>{errors.next_appointment_date}</span>}
              </Col>
            </FieldRow>
          </FormAccordion>

          {/* ── Action Buttons ────────────────────────────────────────────── */}
          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", paddingTop: "16px", borderTop: "1px solid #e0e0e0", marginTop: "8px" }}>
            <MatButton
              variant="contained"
              className={classes.button}
              startIcon={<CancelIcon style={{ color: "#fff" }} />}
              style={{ backgroundColor: "#992E62", color: "#fff" }}
              onClick={isEditMode ? handleCancelEdit : () => props.setActiveContent({ ...props.activeContent, route: "recent-history" })}
            >
              <span style={{ textTransform: "capitalize", color: "#fff" }}>Cancel</span>
            </MatButton>
            <MatButton
              type="submit"
              variant="contained"
              className={classes.button}
              startIcon={<SaveIcon style={{ color: "#fff" }} />}
              style={{ backgroundColor: "#014d88", color: "#fff" }}
              disabled={saving}
            >
              <span style={{ textTransform: "capitalize", color: "#fff" }}>
                {saving ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update Visit" : "Save")}
              </span>
            </MatButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CareCardFollowUpForm;
