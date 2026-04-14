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
  { value: "1", label: "1 — Toxicity / side effects" },
  { value: "2", label: "2 — Pregnancy" },
  { value: "3", label: "3 — Risk of pregnancy" },
  { value: "4", label: "4 — Due to new TB" },
  { value: "5", label: "5 — New drug available" },
  { value: "6", label: "6 — Drug out of stock" },
  { value: "7", label: "7 — Clinical treatment failure" },
  { value: "8", label: "8 — Immunologic failure" },
  { value: "9", label: "9 — Virologic failure" },
  { value: "10", label: "10 — Other reason (specify)" },
];

const DR_RESULT_OPTIONS = [
  { value: "1", label: "1 — Wild type" },
  { value: "2", label: "2 — Resistant detected" },
  { value: "3", label: "3 — No resistance detected" },
  { value: "4", label: "4 — Partial or mixed resistance" },
  { value: "5", label: "5 — Indeterminate or unsuccessful tests" },
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
    const anySubstitution =
      substitution.date_new_regimen_35 ||
      substitution.date_new_regimen_38;
    const anySwitch =
      switchSection.date_new_regimen_42 ||
      switchSection.date_new_regimen_45;
    if (!anySubstitution && !anySwitch) {
      temp.general = "At least one substitution or switch entry must be filled.";
    }
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill at least one substitution or switch entry.");
      return;
    }
    setSaving(true);
    try {
      const observationDate =
        substitution.date_new_regimen_35 ||
        substitution.date_new_regimen_38 ||
        switchSection.date_new_regimen_42 ||
        switchSection.date_new_regimen_45 ||
        today;

      const payload = {
        dateOfObservation: observationDate,
        personId: props.patientObj.id,
        type: "Substitutions and Switches",
        visitDate: objValues.visitDate,
        data: {
          objValues,
          switchs,
          Substitutes,
          substitution,
          switchSection,
        },
      };
      await axios.post(`${baseUrl}observation`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Substitution / Switch record saved successfully");
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
                    onKeyPress={(e) => e.preventDefault()}
                />
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
                >
                  <option value="">Select</option>
                  <option value="Switch Regimen">Switch Regimen</option>
                  <option value="Substitute Regimen">Substitute Regimen</option>
                </Input>
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
                      >
                        <option value="">Select</option>
                        {regimenLineLineType && regimenLineLineType.length > 0 && regimenLineLineType.map((value) => (
                          <option key={value.id} value={value.id}>
                            {value.description}
                          </option>
                        ))}
                      </Input>
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
                      >
                        <option value="">Select</option>
                        {regimenLineLineType && regimenLineLineType.length > 0 && regimenLineLineType.map((value) => (
                          <option key={value.id} value={value.id}>
                            {value.description}
                          </option>
                        ))}
                      </Input>
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
                      />
                    </div>
                    <div className="form-group mb-3 col-md-2">
                      <SectionLabel>Date Result Received</SectionLabel>
                      <Input
                        type="date"
                        name="dr_date_result_received"
                        value={switchSection.dr_date_result_received}
                        onChange={handleSwitch}
                      />
                    </div>
                    <div className="form-group mb-3 col-md-3">
                      <SectionLabel>Result</SectionLabel>
                      <Input
                        type="select"
                        name="dr_result"
                        value={switchSection.dr_result}
                        onChange={handleSwitch}
                      >
                        <option value="">Select result</option>
                        {DR_RESULT_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </Input>
                    </div>
                    <div className="form-group mb-3 col-md-3">
                      <SectionLabel>If Resistant, Specify</SectionLabel>
                      <Input
                        type="text"
                        name="dr_if_resistant_specify"
                        value={switchSection.dr_if_resistant_specify}
                        onChange={handleSwitch}
                        placeholder="Specify resistance details..."
                        disabled={switchSection.dr_result !== "2" && switchSection.dr_result !== "4"}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

          </Box>
          {/* ── Error Banner ─────────────────────────────────────────────────── */}
          {errors.general && (
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
              {errors.general}
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

export default SubstitutionSwitchForm;
