import React, { useState } from "react";
import axios from "axios";
import { Input } from "reactstrap";
import * as moment from "moment";
import { Typography, Box, IconButton, Tooltip } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent } from "@material-ui/core";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { token, url as baseUrl } from "../../../../api";
import "semantic-ui-css/semantic.min.css";
import { Button } from "semantic-ui-react";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const PHD_SERVICES = [
  {
    key: "adherence_counseling",
    label: "Adherence counseling",
  },
  {
    key: "hiv_education_nutrition",
    label: "Basic HIV education and transmission including nutrition",
  },
  {
    key: "prevention_counselling",
    label: "Prevention counselling: abstinence, safer sex, household precautions",
  },
  {
    key: "disclosure_partner_testing",
    label: "Disclosure, partner testing and counseling, family situation",
  },
  {
    key: "condom_provision",
    label: "Condom provision",
  },
  {
    key: "sti_screening",
    label: "STI screening, diagnosis and referral for management",
  },
  {
    key: "rh_fp_services",
    label: "Provision/referral for RH/FP services",
  },
  {
    key: "substance_use_counseling",
    label: "Alcohol & other substance use risk reduction counseling",
  },
  {
    key: "palliative_care",
    label: "Symptom management and palliative care at home",
  },
  {
    key: "positive_living",
    label: "Positive living counselling",
  },
  {
    key: "support_group",
    label: "Support group enrollment, community support, clinic contacts",
  },
  {
    key: "mental_health_screening",
    label: "Mental Health Screening",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const useStyles = makeStyles(() => ({
  root: {
    "& label": { fontSize: "13px", color: "#014d88", fontWeight: "600" },
    "& .form-control": { borderRadius: "0.25rem" },
  },
}));

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const PositiveHealthDignityForm = (props) => {
  const classes = useStyles();
  const today = moment(new Date()).format("YYYY-MM-DD");

  const [saving, setSaving] = useState(false);

  // Per-service state: { dates: [""], comment: "" }
  const [services, setServices] = useState(() =>
    Object.fromEntries(
      PHD_SERVICES.map((s) => [s.key, { dates: [""], comment: "" }])
    )
  );

  // ── Date helpers ──────────────────────────────────────────────────────────

  const addDate = (key) => {
    setServices((prev) => ({
      ...prev,
      [key]: { ...prev[key], dates: [...prev[key].dates, ""] },
    }));
  };

  const removeDate = (key, idx) => {
    setServices((prev) => {
      const updated = prev[key].dates.filter((_, i) => i !== idx);
      return {
        ...prev,
        [key]: { ...prev[key], dates: updated.length > 0 ? updated : [""] },
      };
    });
  };

  const updateDate = (key, idx, value) => {
    setServices((prev) => {
      const updated = [...prev[key].dates];
      updated[idx] = value;
      return { ...prev, [key]: { ...prev[key], dates: updated } };
    });
  };

  const updateComment = (key, value) => {
    setServices((prev) => ({
      ...prev,
      [key]: { ...prev[key], comment: value },
    }));
  };

  // ── Observation date — earliest filled date or today ─────────────────────

  const getObservationDate = () => {
    for (const svc of PHD_SERVICES) {
      const filled = services[svc.key].dates.filter(Boolean);
      if (filled.length > 0) return filled[0];
    }
    return today;
  };

  // ── Validation ────────────────────────────────────────────────────────────

  const validate = () => {
    const anyFilled = PHD_SERVICES.some((svc) =>
      services[svc.key].dates.some(Boolean)
    );
    if (!anyFilled) {
      toast.error("Please record at least one service date.");
      return false;
    }
    return true;
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        dateOfObservation: getObservationDate(),
        personId: props.patientObj.id,
        type: "Care and Support/Positive Health Dignity and Prevention Services",
        data: {
          services: PHD_SERVICES.map((svc) => ({
            service: svc.key,
            label: svc.label,
            dates: services[svc.key].dates.filter(Boolean),
            comment: services[svc.key].comment,
          })),
        },
      };
      await axios.post(`${baseUrl}observation`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Positive Health Dignity record saved successfully");
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
    <Card
      className={classes.root}
      style={{ borderRadius: "12px", overflow: "visible" }}
    >
      <CardContent>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #1b5e20, #2e7d32)",
            borderRadius: "8px",
            padding: "16px 24px",
            marginBottom: "24px",
          }}
        >
          <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "18px" }}>
            Care and Support / Positive Health Dignity and Prevention Services
          </Typography>
          <Typography sx={{ color: "#c8e6c9", fontSize: "13px", marginTop: "2px" }}>
            Indicate the date(s) each service was provided. Use <strong>+</strong> to add multiple visit dates per service.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>

          {/* ── Service Table ─────────────────────────────────────────────── */}
          <div style={{ overflowX: "auto", marginBottom: "20px" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "13px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <thead>
                <tr style={{ background: "#2e7d32", color: "#fff" }}>
                  <th
                    style={{
                      padding: "12px 18px",
                      textAlign: "left",
                      width: "32%",
                      fontWeight: 700,
                      fontSize: "13px",
                    }}
                  >
                    Services
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 400,
                        color: "#c8e6c9",
                        marginTop: "3px",
                      }}
                    >
                      (Indicate &apos;X&apos; if service provided on date)
                    </div>
                  </th>
                  <th
                    style={{
                      padding: "12px 18px",
                      textAlign: "left",
                      width: "52%",
                      fontWeight: 600,
                      fontSize: "13px",
                    }}
                  >
                    Dates Provided
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 400,
                        color: "#c8e6c9",
                        marginTop: "3px",
                      }}
                    >
                      Click + to add more dates
                    </div>
                  </th>
                  <th
                    style={{
                      padding: "12px 18px",
                      textAlign: "left",
                      width: "16%",
                      fontWeight: 600,
                      fontSize: "13px",
                    }}
                  >
                    Comment
                  </th>
                </tr>
              </thead>
              <tbody>
                {PHD_SERVICES.map((svc, i) => (
                  <tr
                    key={svc.key}
                    style={{
                      background: i % 2 === 0 ? "#f1f8e9" : "#ffffff",
                      borderBottom: "1px solid #dcedc8",
                      verticalAlign: "top",
                    }}
                  >
                    {/* Service label */}
                    <td
                      style={{
                        padding: "12px 18px",
                        color: "#333",
                        fontWeight: "500",
                        lineHeight: "1.45",
                      }}
                    >
                      {svc.label}
                    </td>

                    {/* Dates */}
                    <td style={{ padding: "8px 12px" }}>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "6px",
                          alignItems: "center",
                        }}
                      >
                        {services[svc.key].dates.map((d, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "2px",
                            }}
                          >
                            <Input
                              type="date"
                              value={d}
                              max={today}
                              onChange={(e) =>
                                updateDate(svc.key, idx, e.target.value)
                              }
                              style={{
                                fontSize: "12px",
                                padding: "3px 6px",
                                height: "32px",
                                width: "146px",
                              }}
                            />
                            {services[svc.key].dates.length > 1 && (
                              <Tooltip title="Remove this date">
                                <IconButton
                                  size="small"
                                  onClick={() => removeDate(svc.key, idx)}
                                  style={{ color: "#c62828", padding: "2px" }}
                                >
                                  <RemoveCircleOutlineIcon
                                    style={{ fontSize: "18px" }}
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                          </div>
                        ))}

                        {/* Add date button */}
                        <Tooltip title="Add another date">
                          <IconButton
                            size="small"
                            onClick={() => addDate(svc.key)}
                            style={{ color: "#2e7d32", padding: "2px" }}
                          >
                            <AddCircleOutlineIcon style={{ fontSize: "20px" }} />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td>

                    {/* Comment */}
                    <td style={{ padding: "8px 12px" }}>
                      <Input
                        type="textarea"
                        value={services[svc.key].comment}
                        onChange={(e) => updateComment(svc.key, e.target.value)}
                        rows={2}
                        placeholder="Comment..."
                        style={{
                          fontSize: "12px",
                          height: "auto",
                          minHeight: "44px",
                          resize: "vertical",
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Action Buttons ────────────────────────────────────────────── */}
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
            <Button
              content="Cancel"
              icon="cancel"
              labelPosition="left"
              style={{
                backgroundColor: "#78909c",
                color: "#fff",
                borderRadius: "6px",
              }}
              onClick={() =>
                props.setActiveContent({
                  ...props.activeContent,
                  route: "recent-history",
                })
              }
              type="button"
            />
            <Button
              content={saving ? "Saving..." : "Save Record"}
              type="submit"
              icon="save"
              labelPosition="right"
              style={{
                backgroundColor: "#2e7d32",
                color: "#fff",
                borderRadius: "6px",
              }}
              disabled={saving}
            />
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default PositiveHealthDignityForm;
