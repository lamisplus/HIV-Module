import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, FormGroup, Label } from "reactstrap";
import * as moment from "moment";
import { Typography, Box, Divider } from "@mui/material";
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

const SUBSTITUTION_WHY_CODES = [
  { id: 4000, code: "SUBSTITUTION_TOXICITY", display: "Toxicity / side effects" },
  { id: 4001, code: "SUBSTITUTION_PREGNANCY", display: "Pregnancy" },
  { id: 4002, code: "SUBSTITUTION_PREGNANCY_RISK", display: "Risk of pregnancy" },
  { id: 4003, code: "SUBSTITUTION_NEW_TB", display: "Due to new TB" },
  { id: 4004, code: "SUBSTITUTION_NEW_DRUG", display: "New drug available" },
  { id: 4005, code: "SUBSTITUTION_DRUG_OUT_OF_STOCK", display: "Drug out of stock" },
  { id: 4006, code: "SUBSTITUTION_CLINICAL_FAILURE", display: "Clinical treatment failure" },
  { id: 4007, code: "SUBSTITUTION_IMMUNOLOGIC_FAILURE", display: "Immunologic failure" },
  { id: 4008, code: "SUBSTITUTION_VIROLOGIC_FAILURE", display: "Virologic failure" },
  { id: 4009, code: "SUBSTITUTION_OTHER", display: "Other reason (specify)" },
];

const DR_RESULT_OPTIONS = [
  { id: 3000, code: "DR_WILD_TYPE", display: "Wild type" },
  { id: 3001, code: "DR_RESISTANT_DETECTED", display: "Resistant detected" },
  { id: 3002, code: "DR_NO_RESISTANCE", display: "No resistance detected" },
  { id: 3003, code: "DR_PARTIAL_MIXED_RESISTANCE", display: "Partial or mixed resistance" },
  { id: 3004, code: "DR_INDETERMINATE", display: "Indeterminate or unsuccessful tests" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const useStyles = makeStyles((theme) => ({
  root: {
    "& label": { fontSize: "14px", color: "#014d88", fontWeight: "bold" },
    "& .form-control": { borderRadius: "0.25rem", height: "41px" },
  },
  button: { margin: theme.spacing(1) },
  error: { color: "#f85032", fontSize: "12px", marginTop: "4px" },
}));

// ─────────────────────────────────────────────────────────────────────────────
// Helper sub-components
// ─────────────────────────────────────────────────────────────────────────────

const SectionLabel = ({ children }) => (
  <label
    style={{
      fontSize: "12px",
      fontWeight: "bold",
      color: "#014d88",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginBottom: "4px",
      display: "block",
    }}
  >
    {children}
  </label>
);

const SubHeading = ({ children }) => (
  <div
    style={{
      borderLeft: "3px solid #014d88",
      paddingLeft: "10px",
      marginBottom: "12px",
      marginTop: "4px",
      color: "#014d88",
      fontWeight: "700",
      fontSize: "14px",
    }}
  >
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const SubstitutionSwitchForm = (props) => {
  const classes = useStyles();
  const today = moment(new Date()).format("YYYY-MM-DD");

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const isViewMode = props.activeContent && props.activeContent.actionType === "view";

  // ── New State Variables ────────────────────────────────────────────────────
  const [objValues, setObjValues] = useState({
    currentRegimen: "",
    planAction: "",
    id: "",
    outComeDate: "",
    outcome: "",
    repeatViralLoader: "",
    personId: props.patientObj.id,
    plan: "",
    visitId: "",
    switchRegimen: "",
    comment: "",
    postViralLoadResult: "",
    postViralLoadResultDate: "",
    visitDate: ""
  });

  const [switchs, setSwitchs] = useState({
    currentRegimen: "",
    dateSwitched: "",
    reasonSwitched: "",
    switchRegimenLine: "",
    switchRegimenLineType: ""
  });

  const [Substitutes, setSubstitutes] = useState({
    currentRegimen: "",
    substituteRegimen: "",
    dateSubstituted: "",
    reasonSubstituted: "",
    substituteRegimenLineType: "",
  });

  const [regimenLine, setRegimenLine] = useState([]);
  const [regimenLineLineType, setRegimenLineLineType] = useState([]);
  const [currentViralLoad, setCurrentViralLoad] = useState({});
  const [currentRegimen, setCurrentRegimen] = useState(null);
  const [patientRegimenInfo, setPatientRegimenInfo] = useState(null);
  const [regimenType, setRegimenType] = useState([]);
  const [patientAge, setPatientAge] = useState(0);
  const [isPediatric, setIsPediatric] = useState(false);

  // ── Section A: Substitution within line ────────────────────────────────────
  const [substitution, setSubstitution] = useState({
    within_1st_line: false,
    within_2nd_line: false,
    within_3rd_line: false,
    // Row 35-37
    date_new_regimen_35: "",
    why_36: "",
    new_regimen_37: "",
    // Row 38-40
    date_new_regimen_38: "",
    why_39: "",
    new_regimen_40: "",
  });

  const handleSubstitution = (e) => {
    const { name, type, value, checked } = e.target;
    setSubstitution((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ── Section B: Switch to line ───────────────────────────────────────────────
  const [switchSection, setSwitchSection] = useState({
    switch_to_2nd_line: false,
    switch_to_3rd_line: false,
    // DR Genotyping (41a-41e)
    dr_genotyping_done: "",
    dr_sample_collection_date: "",
    dr_date_result_received: "",
    dr_result: "",
    dr_if_resistant_specify: "",
    // Row 42-44
    date_new_regimen_42: "",
    why_43: "",
    new_regimen_44: "",
    // Row 45-47
    date_new_regimen_45: "",
    why_46: "",
    new_regimen_47: "",
  });

  const handleSwitch = (e) => {
    const { name, type, value, checked } = e.target;
    setSwitchSection((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Validate date result received is not before sample collection date
    if (name === "dr_date_result_received" || name === "dr_sample_collection_date") {
      const sampleDate = name === "dr_sample_collection_date" ? value : switchSection.dr_sample_collection_date;
      const resultDate = name === "dr_date_result_received" ? value : switchSection.dr_date_result_received;

      if (sampleDate && resultDate && new Date(resultDate) < new Date(sampleDate)) {
        setErrors((prev) => ({
          ...prev,
          dr_date_result_received: "Date Result Received cannot be before Sample Collection Date"
        }));
      } else {
        // Clear the error if validation passes
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.dr_date_result_received;
          return newErrors;
        });
      }
    }
  };

  // ── New Handler Functions ──────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setObjValues({ ...objValues, [name]: value });

    if (name === "plan") {
      switch (value) {
        case "Switch Regimen":
          setSubstitutes({
            currentRegimen: "",
            substituteRegimen: "",
            dateSubstituted: "",
            reasonSubstituted: "",
            substituteRegimenLineType: "",
          });
          break;
        case "Substitute Regimen":
          setSwitchs({
            currentRegimen: "",
            dateSwitched: "",
            reasonSwitched: "",
            switchRegimenLine: "",
            switchRegimenLineType: ""
          });
          break;
        default:
          break;
      }
    }
  };

  const handleSelectedRegimen = (e) => {
    const regimenId = e.target.value;
    setSwitchs({ ...switchs, [e.target.name]: e.target.value });
    if (regimenId !== "") {
      RegimenType(regimenId);
    } else {
      setRegimenType([]);
    }
  };

  const handleInputSwitchChange = (e) => {
    setSwitchs({ ...switchs, [e.target.name]: e.target.value });
  };

  const handleSelectedSubstituteRegimen = (e) => {
    const regimenId = e.target.value;
    setSubstitutes({ ...Substitutes, [e.target.name]: e.target.value });
    if (regimenId !== "") {
      RegimenType(regimenId);
    } else {
      setRegimenType([]);
    }
  };

  // ── API Calls ───────────────────────────────────────────────────────────────
  const CurrentRegimen = () => {
    setLoading(true);
    axios
      .get(`${baseUrl}hiv/art/pharmacy/patient/current-regimen/${props.patientObj.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setLoading(false);
        setCurrentRegimen(response.data);
        if (response.data) {
          const regimenTypeID = response.data && response.data.regimenType ? response.data.regimenType.id : "";
          axios
            .get(`${baseUrl}hiv/regimen/types/${regimenTypeID}`, {
              headers: { Authorization: `Bearer ${token}` }
            })
            .then((response) => {
              setLoading(false);
              setRegimenType(response.data);
            })
            .catch((error) => {});
        }
      })
      .catch((error) => {});
  };

  const getPatientCurrentRegimen = () => {
    setLoading(true);
    axios
      .get(`${baseUrl}hiv/art/pharmacy/get-current-regimen-info?personUuid=${props.patientObj.personUuid}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setLoading(false);
        setPatientRegimenInfo(response.data);
        setObjValues((prev) => ({
          ...prev,
          currentRegimen: response.data?.currentartregimen
        }));
      })
      .catch((error) => {
        console.log("Error ", error);
        setLoading(false);
      });
  };

  function RegimenType(id) {
    async function getCharacters() {
      try {
        const response = await axios.get(`${baseUrl}hiv/regimen/types/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.length > 0) {
          setRegimenLineLineType(response.data);
        }
      } catch (e) {}
    }
    getCharacters();
  }

  const getRegimenLine = () => {
    setLoading(true);
    axios
      .get(`${baseUrl}hiv/regimen/types`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setLoading(false);
        setRegimenLine(response.data);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  // ── Helper: Calculate Patient Age ──────────────────────────────────────────
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // ── Load existing record for view/update ───────────────────────────────────
  useEffect(() => {
    if (props.activeContent && props.activeContent.id && props.activeContent.actionType !== "create") {
      axios
        .get(`${baseUrl}observation/${props.activeContent.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => {
          const record = response.data;
          const data = record.data;

          // Set visit date - format to YYYY-MM-DD
          const formattedVisitDate = record.dateOfObservation
            ? moment(record.dateOfObservation).format("YYYY-MM-DD")
            : "";

          setObjValues((prev) => ({
            ...prev,
            visitDate: formattedVisitDate,
            plan: data.plan || "",
            currentRegimen: data.currentRegimen || "",
          }));

          // Load switch data
          if (data.plan === "Switch Regimen" && data.switch) {
            setSwitchs({
              currentRegimen: data.currentRegimen || "",
              dateSwitched: data.switch.dateSwitched
                ? moment(data.switch.dateSwitched).format("YYYY-MM-DD")
                : "",
              reasonSwitched: data.switch.reasonSwitched || "",
              switchRegimenLine: data.switch.switchRegimenLine || "",
              switchRegimenLineType: data.switch.switchRegimenLineType || ""
            });

            // Load regimen types for the selected switch regimen line
            if (data.switch.switchRegimenLine) {
              RegimenType(data.switch.switchRegimenLine);
            }

            // Load DR Genotyping data if exists
            if (data.drGenotyping) {
              setSwitchSection((prev) => ({
                ...prev,
                dr_genotyping_done: data.drGenotyping.done || "",
                dr_sample_collection_date: data.drGenotyping.sampleCollectionDate
                  ? moment(data.drGenotyping.sampleCollectionDate).format("YYYY-MM-DD")
                  : "",
                dr_date_result_received: data.drGenotyping.dateResultReceived
                  ? moment(data.drGenotyping.dateResultReceived).format("YYYY-MM-DD")
                  : "",
                dr_result: data.drGenotyping.result || "",
                dr_if_resistant_specify: data.drGenotyping.resistantSpecify || "",
              }));
            }
          }

          // Load substitute data
          if (data.plan === "Substitute Regimen" && data.substitute) {
            setSubstitutes({
              currentRegimen: data.currentRegimen || "",
              substituteRegimen: data.substitute.substituteRegimen || "",
              dateSubstituted: data.substitute.dateSubstituted
                ? moment(data.substitute.dateSubstituted).format("YYYY-MM-DD")
                : "",
              reasonSubstituted: data.substitute.reasonSubstituted || "",
              substituteRegimenLineType: data.substitute.substituteRegimenLineType || "",
            });

            // Load regimen types for the selected substitute regimen line
            if (data.substitute.substituteRegimen) {
              RegimenType(data.substitute.substituteRegimen);
            }
          }
        })
        .catch((error) => {
          console.error("Error loading record:", error);
          toast.error("Failed to load record");
        });
    }
  }, [props.activeContent]);

  // ── useEffect ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (props.patientObj && props.patientObj.id && props.patientObj.personUuid) {
      // Calculate patient age and determine if pediatric
      const age = calculateAge(props.patientObj.dateOfBirth);
      setPatientAge(age);
      setIsPediatric(age < 15); // Pediatric is typically < 15 years

      CurrentRegimen();
      getPatientCurrentRegimen();
      getRegimenLine();
    }
  }, [props.patientObj]);

  // ── Validation ──────────────────────────────────────────────────────────────

  const validate = () => {
    const temp = {};

    // Validate Visit Date
    if (!objValues.visitDate) {
      temp.visitDate = "Visit Date is required";
    }

    // Validate Plan is selected
    if (!objValues.plan) {
      temp.plan = "Please select either Switch Regimen or Substitute Regimen";
    }

    // Validate Switch Regimen fields
    if (objValues.plan === "Switch Regimen") {
      if (!switchs.switchRegimenLine) {
        temp.switchRegimenLine = "Switch Regimen Line is required";
      }
      if (!switchs.switchRegimenLineType) {
        temp.switchRegimenLineType = "Switch Regimen Type is required";
      }
      if (!switchs.dateSwitched) {
        temp.dateSwitched = "Switch Date is required";
      }
    }

    // Validate Substitute Regimen fields
    if (objValues.plan === "Substitute Regimen") {
      if (!Substitutes.substituteRegimen) {
        temp.substituteRegimen = "Substitute Regimen Line is required";
      }
      if (!Substitutes.substituteRegimenLineType) {
        temp.substituteRegimenLineType = "Substitute Regimen Type is required";
      }
      if (!Substitutes.dateSubstituted) {
        temp.dateSubstituted = "Substitute Date is required";
      }
    }

    // Validate DR Genotyping dates if DR Genotyping is done
    if (switchSection.dr_genotyping_done === "Yes") {
      if (!switchSection.dr_sample_collection_date) {
        temp.dr_sample_collection_date = "Sample Collection Date is required when DR Genotyping is done";
      }
      if (!switchSection.dr_date_result_received) {
        temp.dr_date_result_received = "Date Result Received is required when DR Genotyping is done";
      }
      if (!switchSection.dr_result) {
        temp.dr_result = "Result is required when DR Genotyping is done";
      }

      // Validate date order
      if (switchSection.dr_sample_collection_date && switchSection.dr_date_result_received) {
        if (new Date(switchSection.dr_date_result_received) < new Date(switchSection.dr_sample_collection_date)) {
          temp.dr_date_result_received = "Date Result Received cannot be before Sample Collection Date";
        }
      }

      // Validate resistant specify field
      if ((switchSection.dr_result === "DR_RESISTANT_DETECTED" || switchSection.dr_result === "DR_PARTIAL_MIXED_RESISTANCE")
          && !switchSection.dr_if_resistant_specify) {
        temp.dr_if_resistant_specify = "Please specify resistance details";
      }
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      // Show the first error message
      const firstError = Object.values(errors)[0];
      toast.error(firstError || "Please fill all required fields");
      return;
    }
    setSaving(true);
    try {
      // Determine observation date based on which form was filled
      const observationDate = objValues.plan === "Switch Regimen"
        ? switchs.dateSwitched
        : Substitutes.dateSubstituted || today;

      // Build clean payload with only relevant data
      const data = {
        plan: objValues.plan,
        currentRegimen: objValues.currentRegimen,
        currentRegimenLine: patientRegimenInfo?.currentregimenline || "",
      };

      // Add switch-specific data
      if (objValues.plan === "Switch Regimen") {
        data.switch = {
          dateSwitched: switchs.dateSwitched,
          reasonSwitched: switchs.reasonSwitched,
          switchRegimenLine: switchs.switchRegimenLine,
          switchRegimenLineType: switchs.switchRegimenLineType,
        };

        // Add DR Genotyping data if present
        if (switchSection.dr_genotyping_done === "Yes") {
          data.drGenotyping = {
            done: switchSection.dr_genotyping_done,
            sampleCollectionDate: switchSection.dr_sample_collection_date,
            dateResultReceived: switchSection.dr_date_result_received,
            result: switchSection.dr_result,
            resistantSpecify: switchSection.dr_if_resistant_specify || "",
          };
        }
      }

      // Add substitute-specific data
      if (objValues.plan === "Substitute Regimen") {
        data.substitute = {
          dateSubstituted: Substitutes.dateSubstituted,
          reasonSubstituted: Substitutes.reasonSubstituted,
          substituteRegimen: Substitutes.substituteRegimen,
          substituteRegimenLineType: Substitutes.substituteRegimenLineType,
        };
      }

      const payload = {
        dateOfObservation: observationDate,
        personId: props.patientObj.id,
        type: "Substitutions and Switches",
        visitDate: objValues.visitDate,
        data: data,
      };

      // Check if update or create
      if (props.activeContent && props.activeContent.id && props.activeContent.actionType === "update") {
        // Update existing record
        await axios.put(`${baseUrl}observation/${props.activeContent.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Substitution / Switch record updated successfully");
      } else {
        // Create new record
        await axios.post(`${baseUrl}observation`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Substitution / Switch record saved successfully");
      }

      props.setActiveContent({ ...props.activeContent, route: "recent-history" });
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
    <Card className={classes.root} style={{ borderRadius: "12px", overflow: "visible" }}>
      <CardContent>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <Box sx={{ backgroundColor: "#014d88", padding: "14px 20px", marginBottom: "24px" }}>
          <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>
            Substitutions / Switches
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* SECTION A — PLAN AND REGIMEN MANAGEMENT                           */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <div className="row">
            <div className="form-group mb-3 col-md-6">
              <FormGroup>
                <Label>Visit Date</Label>
                <Input
                    type="date"
                    name="visitDate"
                    id="visitDate"
                    value={objValues.visitDate}
                    onChange={handleInputChange}
                    style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}
                    required
                    disabled={isViewMode}
                    onKeyPress={(e) => e.preventDefault()}
                />
                {errors.visitDate && (
                  <span className={classes.error}>{errors.visitDate}</span>
                )}
              </FormGroup>
            </div>
            <div className="form-group mb-3 col-md-6">
              <FormGroup>
                <Label>Plan</Label>
                <Input
                    type="select"
                    name="plan"
                    id="plan"
                    value={objValues.plan}
                    onChange={handleInputChange}
                    style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}
                    disabled={isViewMode}
                >
                  <option value="">Select</option>
                  <option value="Switch Regimen">Switch Regimen</option>
                  <option value="Substitute Regimen">Substitute Regimen</option>
                </Input>
                {errors.plan && (
                  <span className={classes.error}>{errors.plan}</span>
                )}
              </FormGroup>
            </div>
          </div>

          {objValues.plan === "Switch Regimen" && (
              <>
                <div className="row">

                  <div className="col-md-12">
                    <h4>Switch Regimen</h4>
                  </div>
                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label>Current Regimen Line</Label>
                      <Input
                          type="text"
                          name="currentRegimenLine"
                          id="currentRegimenLine"
                          value={patientRegimenInfo && patientRegimenInfo.currentregimenline ? patientRegimenInfo.currentregimenline : ""}
                          onChange={handleInputChange}
                        disabled
                        style={{ border: "1px solid #014D88", borderRadius: "0.25rem" }}
                      />
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label>Current Regimen</Label>
                      <Input
                        type="text"
                        name="currentRegimen"
                        id="currentRegimen"
                        value={patientRegimenInfo && patientRegimenInfo.currentartregimen ? patientRegimenInfo.currentartregimen : ""}
                        onChange={handleInputChange}
                        disabled
                        style={{ border: "1px solid #014D88", borderRadius: "0.25rem" }}
                      />
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label>Switch Regimen Line</Label>
                      <Input
                        type="select"
                        name="switchRegimenLine"
                        id="switchRegimenLine"
                        value={switchs.switchRegimenLine}
                        onChange={handleSelectedRegimen}
                        style={{ border: "1px solid #014D88", borderRadius: "0.25rem" }}
                        disabled={isViewMode}
                      >
                        <option value="">Select</option>
                        {regimenLine
                          .filter((value) => {
                            if (!value.description) return false;

                            const desc = value.description.toLowerCase();

                            // Filter for 2nd and 3rd line only
                            const isSecondOrThirdLine =
                              desc.includes('2nd line') ||
                              desc.includes('second line') ||
                              desc.includes('3rd line') ||
                              desc.includes('third line');

                            if (!isSecondOrThirdLine) return false;

                            // Filter based on age: pediatric or adult
                            if (isPediatric) {
                              return desc.includes('pediatric') || desc.includes('paediatric') || desc.includes('child');
                            } else {
                              return desc.includes('adult');
                            }
                          })
                          .map((value) => (
                            <option key={value.id} value={value.id}>
                              {value.description}
                            </option>
                          ))
                        }
                      </Input>
                      {errors.switchRegimenLine && (
                        <span className={classes.error}>{errors.switchRegimenLine}</span>
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label>Switch Regimen Type</Label>
                      <Input
                        type="select"
                        name="switchRegimenLineType"
                        id="switchRegimenLineType"
                        value={switchs.switchRegimenLineType}
                        onChange={handleInputSwitchChange}
                        style={{ border: "1px solid #014D88", borderRadius: "0.25rem" }}
                        disabled={isViewMode}
                      >
                        <option value="">Select</option>
                        {regimenLineLineType && regimenLineLineType.length > 0 && regimenLineLineType.map((value) => (
                          <option key={value.id} value={value.id}>
                            {value.description}
                          </option>
                        ))}
                      </Input>
                      {errors.switchRegimenLineType && (
                        <span className={classes.error}>{errors.switchRegimenLineType}</span>
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label for="">Switch Date</Label>
                      <Input
                        type="date"
                        name="dateSwitched"
                        id="dateSwitched"
                        value={switchs.dateSwitched}
                        onChange={handleInputSwitchChange}
                        min={moment(currentViralLoad && currentViralLoad.dateResultReceived ? currentViralLoad.dateResultReceived : "").format("YYYY-MM-DD")}
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        style={{ border: "1px solid #014D88", borderRadius: "0.25rem" }}
                        required
                        disabled={isViewMode}
                        onKeyPress={(e) => e.preventDefault()}
                      />
                      {errors.dateSwitched && (
                        <span className={classes.error}>{errors.dateSwitched}</span>
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label for="">Reason for switching Regimen</Label>
                      <Input
                        type="textarea"
                        name="reasonSwitched"
                        id="reasonSwitched"
                        value={switchs.reasonSwitched}
                        onChange={handleInputSwitchChange}
                        style={{ border: "1px solid #014D88", borderRadius: "0.25rem" }}
                        disabled={isViewMode}
                      />
                    </FormGroup>
                  </div>
                </div>
              </>
            )}

          {objValues.plan === "Substitute Regimen" && (
            <>
              <div className="row">
                <div className="col-md-12">
                  <h4>Substitute Regimen</h4>
                </div>
                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label>Current Regimen Line</Label>
                      <Input
                        type="text"
                        name="currentRegimenLine"
                        id="currentRegimenLine"
                        value={patientRegimenInfo && patientRegimenInfo.currentregimenline ? patientRegimenInfo.currentregimenline : ""}
                        onChange={handleInputChange}
                        disabled
                        style={{ border: "1px solid #014D88", borderRadius: "0.25rem" }}
                      />
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label>Current Regimen</Label>
                      <Input
                        type="text"
                        name="currentRegimen"
                        id="currentRegimen"
                        value={patientRegimenInfo && patientRegimenInfo.currentartregimen ? patientRegimenInfo.currentartregimen : ""}
                        onChange={handleInputChange}
                        disabled
                        style={{ border: "1px solid #014D88", borderRadius: "0.25rem" }}
                      />
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label>Substitute Regimen Line</Label>
                      <Input
                        type="select"
                        name="substituteRegimen"
                        id="substituteRegimen"
                        value={Substitutes.substituteRegimen}
                        onChange={handleSelectedSubstituteRegimen}
                        style={{ border: "1px solid #014D88", borderRadius: "0.25rem" }}
                        disabled={isViewMode}
                      >
                        <option value="">Select</option>
                        {regimenLine
                          .filter((value) => {
                            if (!value.description) return false;

                            const desc = value.description.toLowerCase();

                            // Exclude TB treatment regimens
                            if (desc.includes('tb') || desc.includes('tuberculosis')) {
                              return false;
                            }

                            // Filter based on age: pediatric or adult
                            if (isPediatric) {
                              return desc.includes('pediatric') || desc.includes('paediatric') || desc.includes('child');
                            } else {
                              return desc.includes('adult');
                            }
                          })
                          .map((value) => (
                            <option key={value.id} value={value.id}>
                              {value.description}
                            </option>
                          ))
                        }
                      </Input>
                      {errors.substituteRegimen && (
                        <span className={classes.error}>{errors.substituteRegimen}</span>
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label>Substitute Regimen Type</Label>
                      <Input
                        type="select"
                        name="substituteRegimenLineType"
                        id="substituteRegimenLineType"
                        value={Substitutes.substituteRegimenLineType}
                        onChange={handleSelectedSubstituteRegimen}
                        style={{ border: "1px solid #014D88", borderRadius: "0.25rem" }}
                        disabled={isViewMode}
                      >
                        <option value="">Select</option>
                        {regimenLineLineType && regimenLineLineType.length > 0 && regimenLineLineType.map((value) => (
                          <option key={value.id} value={value.id}>
                            {value.description}
                          </option>
                        ))}
                      </Input>
                      {errors.substituteRegimenLineType && (
                        <span className={classes.error}>{errors.substituteRegimenLineType}</span>
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label for="">Substitute Date</Label>
                      <Input
                        type="date"
                        name="dateSubstituted"
                        id="dateSubstituted"
                        value={Substitutes.dateSubstituted}
                        onChange={handleSelectedSubstituteRegimen}
                        min={moment(currentViralLoad && currentViralLoad.dateResultReceived ? currentViralLoad.dateResultReceived : "").format("YYYY-MM-DD")}
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        style={{ border: "1px solid #014D88", borderRadius: "0.25rem" }}
                        required
                        disabled={isViewMode}
                        onKeyPress={(e) => e.preventDefault()}
                      />
                      {errors.dateSubstituted && (
                        <span className={classes.error}>{errors.dateSubstituted}</span>
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label for="">Reason for Substitute Regimen</Label>
                      <Input
                        type="textarea"
                        name="reasonSubstituted"
                        id="reasonSubstituted"
                        value={Substitutes.reasonSubstituted}
                        onChange={handleSelectedSubstituteRegimen}
                        style={{ border: "1px solid #014D88", borderRadius: "0.25rem" }}
                        disabled={isViewMode}
                      />
                    </FormGroup>
                  </div>
                </div>
              </>
            )}

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* SECTION B — SWITCH TO LINE                                        */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <Box
            sx={{
              background: "#fff",
              border: "1px solid #014d88",
              borderRadius: "4px",
              padding: "16px 20px",
              marginBottom: "20px",
            }}
          >
            <SubHeading> Drug Resistance (DR) Genotyping</SubHeading>
            {/* DR Genotyping row (41a – 41e) */}
            <Divider sx={{ mb: 2 }} />
            <div
              style={{
                background: "#f5f9ff",
                border: "1px solid #dce8f5",
                borderRadius: "4px",
                padding: "14px 16px",
                marginBottom: "18px",
              }}
            >
              {/*<Typography*/}
              {/*  sx={{ fontWeight: 700, color: "#014d88", fontSize: "13px", marginBottom: "12px" }}*/}
              {/*>*/}
              {/*  Drug Resistance (DR) Genotyping*/}
              {/*</Typography>*/}
              <div className="row">
                <div className="form-group mb-3 col-md-2">
                  <SectionLabel>DR Genotyping Done</SectionLabel>
                  <Input
                    type="select"
                    name="dr_genotyping_done"
                    value={switchSection.dr_genotyping_done}
                    onChange={handleSwitch}
                    disabled={isViewMode}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Input>
                </div>

                {switchSection.dr_genotyping_done === "Yes" && (
                  <>
                    <div className="form-group mb-3 col-md-2">
                      <SectionLabel>Sample Collection Date</SectionLabel>
                      <Input
                        type="date"
                        name="dr_sample_collection_date"
                        value={switchSection.dr_sample_collection_date}
                        max={today}
                        onChange={handleSwitch}
                        disabled={isViewMode}
                      />
                      {errors.dr_sample_collection_date && (
                        <span className={classes.error}>{errors.dr_sample_collection_date}</span>
                      )}
                    </div>
                    <div className="form-group mb-3 col-md-2">
                      <SectionLabel>Date Result Received</SectionLabel>
                      <Input
                        type="date"
                        name="dr_date_result_received"
                        value={switchSection.dr_date_result_received}
                        onChange={handleSwitch}
                        min={switchSection.dr_sample_collection_date || ""}
                        max={today}
                        disabled={isViewMode}
                      />
                      {errors.dr_date_result_received && (
                        <span className={classes.error}>{errors.dr_date_result_received}</span>
                      )}
                    </div>
                    <div className="form-group mb-3 col-md-3">
                      <SectionLabel>Result</SectionLabel>
                      <Input
                        type="select"
                        name="dr_result"
                        value={switchSection.dr_result}
                        onChange={handleSwitch}
                        disabled={isViewMode}
                      >
                        <option value="">Select result</option>
                        {DR_RESULT_OPTIONS.map((opt) => (
                          <option key={opt.id} value={opt.code}>
                            {opt.display}
                          </option>
                        ))}
                      </Input>
                      {errors.dr_result && (
                        <span className={classes.error}>{errors.dr_result}</span>
                      )}
                    </div>
                    <div className="form-group mb-3 col-md-3">
                      <SectionLabel>If Resistant, Specify</SectionLabel>
                      <Input
                        type="text"
                        name="dr_if_resistant_specify"
                        value={switchSection.dr_if_resistant_specify}
                        onChange={handleSwitch}
                        placeholder="Specify resistance details..."
                        disabled={isViewMode || (switchSection.dr_result !== "DR_RESISTANT_DETECTED" && switchSection.dr_result !== "DR_PARTIAL_MIXED_RESISTANCE")}
                      />
                      {errors.dr_if_resistant_specify && (
                        <span className={classes.error}>{errors.dr_if_resistant_specify}</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

          </Box>
          {/* ── Error Summary Banner ─────────────────────────────────────────────────── */}
          {Object.keys(errors).length > 0 && (
            <div
              style={{
                color: "#d32f2f",
                fontSize: "13px",
                marginBottom: "16px",
                background: "#ffebee",
                padding: "10px 16px",
                borderRadius: "4px",
                border: "1px solid #ef9a9a",
              }}
            >
              Please fix the following errors before submitting:
              <ul style={{ marginTop: "8px", marginBottom: "0", paddingLeft: "20px" }}>
                {Object.values(errors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Action Buttons ───────────────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "flex-end",
              paddingTop: "16px",
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <MatButton
              variant="contained"
              className={classes.button}
              startIcon={<CancelIcon style={{ color: "#fff" }} />}
              style={{ backgroundColor: "#992E62" }}
              onClick={() =>
                props.setActiveContent({ ...props.activeContent, route: "recent-history" })
              }
              type="button"
            >
              <span style={{ textTransform: "capitalize", color: "#fff", fontWeight: "bold" }}>{isViewMode ? "Close" : "Cancel"}</span>
            </MatButton>
            {!isViewMode && (
              <MatButton
                type="submit"
                variant="contained"
                className={classes.button}
                startIcon={<SaveIcon style={{ color: "#fff" }} />}
                style={{ backgroundColor: "#014d88" }}
                disabled={saving}
              >
                <span style={{ textTransform: "capitalize", color: "#fff", fontWeight: "bold" }}>
                  {saving ? "Saving..." : props.activeContent.actionType === "update" ? "Update" : "Save"}
                </span>
              </MatButton>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SubstitutionSwitchForm;
