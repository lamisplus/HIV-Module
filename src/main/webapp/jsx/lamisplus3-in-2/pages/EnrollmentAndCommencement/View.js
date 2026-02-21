import React, { useState, useEffect } from "react";
import axios from "axios";
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
import EditIcon from "@material-ui/icons/Edit";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { calculate_age_to_number } from "../../../../utils";

const ACCORDION_STYLES = [
  { bg: "#014d88" },
  { bg: "#014d88" },
];

const useStyles = makeStyles((theme) => ({
  root: {
    "& label": { fontSize: "14px", color: "#014d88", fontWeight: "bold" },
  },
  button: { margin: theme.spacing(1) },
  fieldLabel: {
    fontSize: "13px",
    color: "#014d88",
    fontWeight: "bold",
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
  <div className="row" style={{ marginBottom: "12px", ...style }}>
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

const FieldDisplay = ({ label, value, classes }) => (
  <div>
    <SectionLabel>{label}</SectionLabel>
    <div className={classes.fieldValue}>
      {value || "—"}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

const EnrollmentAndCommencementView = (props) => {
  const classes = useStyles();
  const patientAge = calculate_age_to_number(props.patientObj?.dateOfBirth);
  const isPediatric = patientAge >= 0 && patientAge <= 15;
  const isInfant    = patientAge < 2;
  const isFemale    = ["female", "FEMALE", "Female"].includes(props.patientObj?.sex);
  const showPregnancyStatus = isFemale && !isPediatric;

  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(["registration", "commencement"]);
  const [data, setData] = useState(null);
  const [codesets, setCodesets] = useState({
    careEntryPoints: [],
    priorArt: [],
    kpTypology: [],
    clinicalStages: [],
    mode_of_hiv_test: [],
    cd4_lf: [],
  });
  const [regimen, setRegimen] = useState(null);

  useEffect(() => {
    fetchCodesets();
    fetchData();
  }, []);

  const fetchCodesets = async () => {
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

      setCodesets({
        careEntryPoints: response.data.POINT_ENTRY || [],
        priorArt: response.data['PREVIOUSLY_KNOWN_HIV_+VE_STATUS'] || [],
        kpTypology: response.data.TARGET_GROUP || [],
        clinicalStages: response.data.CLINICAL_STAGE || [],
        mode_of_hiv_test: response.data.FACILITY_HTS_TEST_SETTING || [],
        cd4_lf: response.data.VISITECT_CD4_TEST_RESULT || [],
      });
    } catch (error) {
      console.error("Failed to load codesets:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}hiv/enrollment-commencement/person/${props.patientObj.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(response.data);

      // Fetch regimen details if regimenId exists
      if (response.data.regimenId) {
        fetchRegimen(response.data.regimenId);
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

  const fetchRegimen = async (regimenId) => {
    try {
      const response = await axios.get(
        `${baseUrl}hiv/regimen/${regimenId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRegimen(response.data);
    } catch (error) {
      console.error("Failed to load regimen:", error);
    }
  };

  const toggleAccordion = (panel) => {
    setExpanded((prev) =>
      prev.includes(panel) ? prev.filter((p) => p !== panel) : [...prev, panel]
    );
  };

  const formatDate = (date) => {
    return date ? moment(date).format("DD-MMM-YYYY") : "—";
  };

  const getCodesetDisplay = (id, codesetArray) => {
    if (!id) return "—";
    const item = codesetArray.find(c => c.id === id);
    return item ? item.display : id;
  };

  if (loading) {
    return (
      <Card className={classes.root}>
        <CardContent>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Typography>Loading...</Typography>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className={classes.root}>
        <CardContent>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Typography>No enrollment data found</Typography>
          </div>
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
            ART Enrollment &amp; Commencement (View)
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
              <FieldDisplay
                label="Date Enrolled in HIV Care"
                value={formatDate(data.dateEnrolledInHivCare)}
                classes={classes}
              />
            </Col>
            <Col size={3}>
              <FieldDisplay
                label="Date of Confirmed HIV Test"
                value={formatDate(data.dateConfirmedHivTest)}
                classes={classes}
              />
            </Col>
            <Col size={3}>
              <FieldDisplay
                label="HIV Test Location"
                value={data.hivTestLocation}
                classes={classes}
              />
            </Col>
            <Col size={3}>
              <FieldDisplay
                label="Mode of HIV Test"
                value={getCodesetDisplay(data.modeOfHivTestId, codesets.mode_of_hiv_test)}
                classes={classes}
              />
            </Col>
          </FieldRow>

          <FieldRow>
            <Col size={3}>
              <FieldDisplay
                label="Care Entry Point"
                value={getCodesetDisplay(data.careEntryPointId, codesets.careEntryPoints)}
                classes={classes}
              />
            </Col>
            {data.careEntryPointOther && (
              <Col size={3}>
                <FieldDisplay
                  label="Specify Entry Point"
                  value={data.careEntryPointOther}
                  classes={classes}
                />
              </Col>
            )}
            {isInfant && data.motherUniqueId && (
              <Col size={3}>
                <FieldDisplay
                  label="Mother's Unique ID"
                  value={data.motherUniqueId}
                  classes={classes}
                />
              </Col>
            )}
          </FieldRow>

          {/* Prior ART & KP Typology */}
          <Divider sx={{ my: 2 }} />
          <SubHeading>Prior ART &amp; Key Population</SubHeading>
          <FieldRow>
            <Col size={4}>
              <FieldDisplay
                label="Prior ART"
                value={getCodesetDisplay(data.priorArtId, codesets.priorArt)}
                classes={classes}
              />
            </Col>
            <Col size={2}>
              <FieldDisplay
                label="Is Patient KP?"
                value={data.isKp ? "Yes" : "No"}
                classes={classes}
              />
            </Col>
            {data.isKp && data.kpTypologyId && (
              <Col size={4}>
                <FieldDisplay
                  label="KP Typology"
                  value={getCodesetDisplay(data.kpTypologyId, codesets.kpTypology)}
                  classes={classes}
                />
              </Col>
            )}
          </FieldRow>

          {/* Transfer Info */}
          {data.dateTransferredIn && (
            <>
              <Divider sx={{ my: 2 }} />
              <SubHeading>Transfer Details</SubHeading>
              <FieldRow>
                <Col size={3}>
                  <FieldDisplay
                    label="Date Transferred In"
                    value={formatDate(data.dateTransferredIn)}
                    classes={classes}
                  />
                </Col>
                <Col size={5}>
                  <FieldDisplay
                    label="Facility Transferred From"
                    value={data.facilityTransferredFrom}
                    classes={classes}
                  />
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
              <FieldDisplay
                label="Clinical Stage at Start of ART"
                value={getCodesetDisplay(data.clinicalStageId, codesets.clinicalStages)}
                classes={classes}
              />
            </Col>
            <Col size={3}>
              <FieldDisplay
                label="CD4 Count at Start of ART"
                value={data.cd4AtArtStart ? `${data.cd4AtArtStart} cells/mm³` : "—"}
                classes={classes}
              />
            </Col>
            <Col size={3}>
              <FieldDisplay
                label="CD4 LF"
                value={getCodesetDisplay(data.cd4LfId, codesets.cd4_lf)}
                classes={classes}
              />
            </Col>
          </FieldRow>

          {/* ART Dates & Regimen */}
          <Divider sx={{ my: 2 }} />
          <SubHeading>ART Dates &amp; Regimen</SubHeading>
          <FieldRow>
            <Col size={3}>
              <FieldDisplay
                label="Date Initial Adherence Counseling Completed"
                value={formatDate(data.dateAdherenceCounselingCompleted)}
                classes={classes}
              />
            </Col>
            <Col size={3}>
              <FieldDisplay
                label="Date ART Started"
                value={formatDate(data.dateArtStarted)}
                classes={classes}
              />
            </Col>
            <Col size={3}>
              <FieldDisplay
                label="First ART Regimen"
                value={regimen ? regimen.description : "—"}
                classes={classes}
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
                <FieldDisplay
                  label="Weight (kg)"
                  value={data.weightKg ? `${data.weightKg} kg` : "—"}
                  classes={classes}
                />
              </Col>
              <Col size={3}>
                <FieldDisplay
                  label="Height / Length (cm)"
                  value={data.heightCm ? `${data.heightCm} cm` : "—"}
                  classes={classes}
                />
              </Col>
              <Col size={3}>
                <FieldDisplay
                  label="BMI"
                  value={data.bmi ? `${data.bmi} kg/m²` : "—"}
                  classes={classes}
                />
              </Col>
              {isPediatric && data.muac && (
                <>
                  <Col size={2}>
                    <FieldDisplay
                      label="MUAC (cm)"
                      value={data.muac ? `${data.muac} cm` : "—"}
                      classes={classes}
                    />
                  </Col>
                  <Col size={3}>
                    <FieldDisplay
                      label="MUAC Indication"
                      value={data.muacIndication}
                      classes={classes}
                    />
                  </Col>
                </>
              )}
              {showPregnancyStatus && data.isPregnant && (
                <>
                  <Col size={2}>
                    <FieldDisplay
                      label="Is Pregnant?"
                      value={data.isPregnant ? "Yes" : "No"}
                      classes={classes}
                    />
                  </Col>
                  {data.isPregnant && data.pregnancyStatus && (
                    <Col size={3}>
                      <FieldDisplay
                        label="Pregnancy Status"
                        value={data.pregnancyStatus}
                        classes={classes}
                      />
                    </Col>
                  )}
                </>
              )}
            </div>
          </Box>

          {/* TB Preventive Therapy */}
          {(data.tptMedication || data.tptCode || data.tptDose || data.tptStartDate || data.tptCompletionDate) && (
            <>
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
                    <FieldDisplay
                      label="TPT Medication (Name)"
                      value={data.tptMedication}
                      classes={classes}
                    />
                  </Col>
                  <Col size={2}>
                    <FieldDisplay
                      label="TPT Code"
                      value={data.tptCode}
                      classes={classes}
                    />
                  </Col>
                  <Col size={2}>
                    <FieldDisplay
                      label="Dose"
                      value={data.tptDose}
                      classes={classes}
                    />
                  </Col>
                  <Col size={2}>
                    <FieldDisplay
                      label="Start Date"
                      value={formatDate(data.tptStartDate)}
                      classes={classes}
                    />
                  </Col>
                  <Col size={2}>
                    <FieldDisplay
                      label="Completion Date"
                      value={formatDate(data.tptCompletionDate)}
                      classes={classes}
                    />
                  </Col>
                </FieldRow>
              </Box>
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
                route: "enrollment-and-commencement-update",
                id: data.id,
              })
            }
          >
            <span style={{ textTransform: "capitalize" }}>Edit</span>
          </MatButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EnrollmentAndCommencementView;
