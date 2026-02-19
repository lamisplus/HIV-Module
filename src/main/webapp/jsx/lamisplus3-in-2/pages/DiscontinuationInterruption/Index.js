import React, { useState } from "react";
import axios from "axios";
import { Input } from "reactstrap";
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

const INTERRUPTION_WHY_CODES = [
  { value: "1",  label: "1 — Toxicity / side effects" },
  { value: "2",  label: "2 — Pregnancy" },
  { value: "3",  label: "3 — Treatment failure" },
  { value: "4",  label: "4 — Poor adherence" },
  { value: "5",  label: "5 — Illness / hospitalization" },
  { value: "6",  label: "6 — Drugs out of stock" },
  { value: "7",  label: "7 — Patient lacks finances" },
  { value: "8",  label: "8 — Other patient decision" },
  { value: "9",  label: "9 — Planned Rx interruption" },
  { value: "10", label: "10 — Other" },
];

const CAUSE_OF_DEATH_OPTIONS = [
  { value: "1", label: "1 — HIV related" },
  { value: "2", label: "2 — TB" },
  { value: "3", label: "3 — Road accident" },
  { value: "4", label: "4 — Malaria" },
  { value: "5", label: "5 — COPD" },
  { value: "6", label: "6 — Hypertension" },
  { value: "7", label: "7 — Diabetes" },
  { value: "8", label: "8 — Others" },
];

// Number of interruption rows
const INTERRUPTION_ROWS = 6;

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
      marginBottom: "14px",
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

const DiscontinuationInterruptionForm = (props) => {
  const classes = useStyles();
  const today = moment(new Date()).format("YYYY-MM-DD");

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // ── Section 48: ART Interruption rows ────────────────────────────────────
  const [interruptions, setInterruptions] = useState(
    Array.from({ length: INTERRUPTION_ROWS }, () => ({
      type: "",          // "S" = Stopped, "D" = Default
      date: "",
      why: "",
      date_of_restart: "",
    }))
  );

  const handleInterruption = (rowIdx, field, value) => {
    setInterruptions((prev) => {
      const updated = [...prev];
      updated[rowIdx] = { ...updated[rowIdx], [field]: value };
      return updated;
    });
  };

  // ── Outcome / Discontinuation fields (49-54) ─────────────────────────────
  const [outcome, setOutcome] = useState({
    date_transferred_out: "",      // 49
    facility_referred_to: "",      // 50
    date_patient_died: "",         // 51
    source_of_death_information: "", // 52
    cause_of_death: "",            // 53
    history_of_drug_allergies: "", // 54
  });

  const handleOutcome = (e) => {
    const { name, value } = e.target;
    setOutcome((prev) => ({ ...prev, [name]: value }));
  };

  // ── Validation ────────────────────────────────────────────────────────────

  const validate = () => {
    const temp = {};
    const anyInterruption = interruptions.some(
      (row) => row.type || row.date || row.why
    );
    const anyOutcome =
      outcome.date_transferred_out ||
      outcome.date_patient_died ||
      outcome.history_of_drug_allergies;
    if (!anyInterruption && !anyOutcome) {
      temp.general =
        "Please fill at least one ART interruption row or an outcome field.";
    }
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill at least one interruption or outcome field.");
      return;
    }
    setSaving(true);
    try {
      const firstDate =
        interruptions.find((r) => r.date)?.date ||
        outcome.date_transferred_out ||
        outcome.date_patient_died ||
        today;

      const payload = {
        dateOfObservation: firstDate,
        personId: props.patientObj.id,
        type: "Discontinuations and Interruptions",
        data: {
          interruptions: interruptions.filter(
            (row) => row.type || row.date || row.why || row.date_of_restart
          ),
          outcome,
        },
      };
      await axios.post(`${baseUrl}observation`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Discontinuation / Interruption record saved successfully");
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
            Discontinuations &amp; Interruptions
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>

          <div className="row">

            {/* ── LEFT: Section 48 — ART Interruptions ───────────────────── */}
            <div className="col-md-6">
              <Box
                sx={{
                  background: "#fff",
                  border: "1px solid #014d88",
                  borderRadius: "4px",
                  padding: "16px",
                  marginBottom: "20px",
                  height: "100%",
                }}
              >
                <SubHeading>48. ART Interruptions</SubHeading>

                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "12px",
                    }}
                  >
                    <thead>
                      <tr style={{ background: "#014d88", color: "#fff" }}>
                        <th
                          style={{
                            padding: "10px 8px",
                            textAlign: "center",
                            width: "18%",
                            fontWeight: 600,
                            fontSize: "11px",
                          }}
                        >
                          Stopped (S) /<br />Default (D)
                        </th>
                        <th
                          style={{
                            padding: "10px 8px",
                            textAlign: "center",
                            width: "26%",
                            fontWeight: 600,
                            fontSize: "11px",
                          }}
                        >
                          Date
                        </th>
                        <th
                          style={{
                            padding: "10px 8px",
                            textAlign: "center",
                            width: "18%",
                            fontWeight: 600,
                            fontSize: "11px",
                          }}
                        >
                          Why
                        </th>
                        <th
                          style={{
                            padding: "10px 8px",
                            textAlign: "center",
                            width: "38%",
                            fontWeight: 600,
                            fontSize: "11px",
                          }}
                        >
                          Date of Restart (if placed back on medication)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {interruptions.map((row, idx) => (
                        <tr
                          key={idx}
                          style={{
                            background: idx % 2 === 0 ? "#f5f9ff" : "#ffffff",
                            borderBottom: "1px solid #dce8f5",
                          }}
                        >
                          {/* S / D select */}
                          <td style={{ padding: "6px 6px", textAlign: "center" }}>
                            <Input
                              type="select"
                              value={row.type}
                              onChange={(e) =>
                                handleInterruption(idx, "type", e.target.value)
                              }
                              style={{
                                fontSize: "12px",
                                height: "32px",
                                padding: "2px 4px",
                                textAlign: "center",
                              }}
                            >
                              <option value="">—</option>
                              <option value="S">S</option>
                              <option value="D">D</option>
                            </Input>
                          </td>
                          {/* Date */}
                          <td style={{ padding: "6px 6px" }}>
                            <Input
                              type="date"
                              value={row.date}
                              max={today}
                              onChange={(e) =>
                                handleInterruption(idx, "date", e.target.value)
                              }
                              style={{ fontSize: "12px", height: "32px", padding: "2px 6px" }}
                            />
                          </td>
                          {/* Why code */}
                          <td style={{ padding: "6px 6px", textAlign: "center" }}>
                            <Input
                              type="select"
                              value={row.why}
                              onChange={(e) =>
                                handleInterruption(idx, "why", e.target.value)
                              }
                              style={{
                                fontSize: "12px",
                                height: "32px",
                                padding: "2px 4px",
                              }}
                            >
                              <option value="">—</option>
                              {INTERRUPTION_WHY_CODES.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.value}
                                </option>
                              ))}
                            </Input>
                          </td>
                          {/* Date of restart */}
                          <td style={{ padding: "6px 6px" }}>
                            <Input
                              type="date"
                              value={row.date_of_restart}
                              onChange={(e) =>
                                handleInterruption(idx, "date_of_restart", e.target.value)
                              }
                              style={{ fontSize: "12px", height: "32px", padding: "2px 6px" }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Why code reference */}
                <Box
                  sx={{
                    background: "#f5f9ff",
                    border: "1px dashed #014d88",
                    borderRadius: "4px",
                    padding: "10px 12px",
                    marginTop: "14px",
                  }}
                >
                  <Typography
                    sx={{ fontWeight: 700, color: "#014d88", fontSize: "11px", marginBottom: "5px" }}
                  >
                    Why Code Reference
                  </Typography>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px" }}>
                    {INTERRUPTION_WHY_CODES.map((c) => (
                      <span key={c.value} style={{ fontSize: "11px", color: "#546e7a" }}>
                        {c.label}
                      </span>
                    ))}
                  </div>
                </Box>
              </Box>
            </div>

            {/* ── RIGHT: Outcome / Discontinuation fields ─────────────────── */}
            <div className="col-md-6">
              <Box
                sx={{
                  background: "#fff",
                  border: "1px solid #014d88",
                  borderRadius: "4px",
                  padding: "16px",
                  marginBottom: "20px",
                }}
              >
                <SubHeading>Outcome &amp; Discontinuation Details</SubHeading>

                {/* 49 & 50 */}
                <div className="row">
                  <div className="form-group mb-3 col-md-6">
                    <SectionLabel>49. Date Patient Transferred-Out</SectionLabel>
                    <Input
                      type="date"
                      name="date_transferred_out"
                      value={outcome.date_transferred_out}
                      max={today}
                      onChange={handleOutcome}
                    />
                  </div>
                  <div className="form-group mb-3 col-md-6">
                    <SectionLabel>50. Facility Referred To</SectionLabel>
                    <Input
                      type="text"
                      name="facility_referred_to"
                      value={outcome.facility_referred_to}
                      onChange={handleOutcome}
                      placeholder="Name of receiving facility"
                    />
                  </div>
                </div>

                <Divider sx={{ my: 2 }} />

                {/* 51 & 52 */}
                <div className="row">
                  <div className="form-group mb-3 col-md-6">
                    <SectionLabel>51. Date Patient Died</SectionLabel>
                    <Input
                      type="date"
                      name="date_patient_died"
                      value={outcome.date_patient_died}
                      max={today}
                      onChange={handleOutcome}
                    />
                  </div>
                  <div className="form-group mb-3 col-md-6">
                    <SectionLabel>52. Source of Death Information</SectionLabel>
                    <Input
                      type="select"
                      name="source_of_death_information"
                      value={outcome.source_of_death_information}
                      onChange={handleOutcome}
                    >
                      <option value="">Select source</option>
                      <option value="Hospital Records">Hospital Records</option>
                      <option value="Family Report">Family Report</option>
                      <option value="Community Report">Community Report</option>
                      <option value="Verbal Autopsy">Verbal Autopsy</option>
                      <option value="Other">Other</option>
                    </Input>
                  </div>
                </div>

                {/* 53 */}
                <div className="form-group mb-3">
                  <SectionLabel>53. Cause of Death</SectionLabel>
                  <Input
                    type="select"
                    name="cause_of_death"
                    value={outcome.cause_of_death}
                    onChange={handleOutcome}
                  >
                    <option value="">Select cause of death</option>
                    {CAUSE_OF_DEATH_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Input>
                </div>

                <Divider sx={{ my: 2 }} />

                {/* 54 */}
                <div className="form-group mb-0">
                  <SectionLabel>54. History of Drug Allergies</SectionLabel>
                  <Input
                    type="textarea"
                    name="history_of_drug_allergies"
                    value={outcome.history_of_drug_allergies}
                    onChange={handleOutcome}
                    rows={4}
                    placeholder="Document any known drug allergies or adverse drug reactions..."
                    style={{ height: "auto", minHeight: "90px", resize: "vertical" }}
                  />
                </div>
              </Box>
            </div>
          </div>

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

export default DiscontinuationInterruptionForm;
