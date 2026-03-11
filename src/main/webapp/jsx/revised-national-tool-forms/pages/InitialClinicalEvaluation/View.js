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
  Chip,
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

const ACCORDION_STYLES = [
  { bg: "#014d88" },
  { bg: "#014d88" },
  { bg: "#014d88" },
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

const InitialClinicalEvaluationView = (props) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState([
    "basic",
    "tb-assessment",
    "pregnancy",
    "medication",
    "vitals",
    "physical-exam",
    "assessment",
  ]);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}hiv/observation/initial-clinical-evaluation/person/${props.patientObj.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(response.data);
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.apierror?.message ||
        "Failed to load initial clinical evaluation data";
      toast.error(msg);
    } finally {
      setLoading(false);
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

  const getYesNo = (value) => {
    if (value === null || value === undefined || value === "") return "—";
    return value === "Yes" || value === true || value === "yes" ? "Yes" : "No";
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
            <Typography>No initial clinical evaluation data found</Typography>
          </div>
        </CardContent>
      </Card>
    );
  }

  const evalData = data.data || {};

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
                route: "initial-clinical-evaluation",
                id: data.id,
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
};

export default InitialClinicalEvaluationView;
