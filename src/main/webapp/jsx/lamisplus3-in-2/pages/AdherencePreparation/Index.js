import React, { useState } from "react";
import axios from "axios";
import { Input } from "reactstrap";
import * as moment from "moment";
import { Typography, Box } from "@mui/material";
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

const SERVICES = [
  {
    key: "art_educate_essentials",
    label: "ART — educate on essentials",
  },
  {
    key: "why_complete_adherence",
    label: "Why complete adherence needed",
  },
  {
    key: "explain_dose_timing",
    label: "Explain dose, when to take, what to do when one forgets dose",
  },
  {
    key: "manage_side_effects",
    label: "What can occur; how to manage side effects",
  },
  {
    key: "adherence_plan",
    label: "Adherence plan (schedule, aides, explain diary, preparation for travel)",
  },
  {
    key: "treatment_supporter_prep",
    label: "Treatment supporter preparation",
  },
  {
    key: "ready_for_art",
    label: "Indicate when ready for ART (date/result)",
  },
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
}));

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const AdherencePreparationForm = (props) => {
  const classes = useStyles();
  const today = moment(new Date()).format("YYYY-MM-DD");

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Per-service: three session date slots
  const [serviceDates, setServiceDates] = useState(() =>
    Object.fromEntries(
      SERVICES.map((s) => [s.key, { date_1: "", date_2: "", date_3: "" }])
    )
  );

  // Treatment supporter contact details
  const [treatmentSupporter, setTreatmentSupporter] = useState({
    name: "",
    address: "",
    telephone: "",
  });

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleDateChange = (serviceKey, field, value) => {
    setServiceDates((prev) => ({
      ...prev,
      [serviceKey]: { ...prev[serviceKey], [field]: value },
    }));
  };

  const handleTreatmentSupporter = (e) => {
    const { name, value } = e.target;
    setTreatmentSupporter((prev) => ({ ...prev, [name]: value }));
  };

  // ── Observation date — first non-empty session date or today ────────────

  const getObservationDate = () => {
    for (const svc of SERVICES) {
      const d = serviceDates[svc.key];
      if (d.date_1) return d.date_1;
    }
    return today;
  };

  // ── Validation ────────────────────────────────────────────────────────────

  const validate = () => {
    const anyDate = SERVICES.some((svc) => {
      const d = serviceDates[svc.key];
      return d.date_1 || d.date_2 || d.date_3;
    });
    if (!anyDate) {
      setErrors({ general: "At least one service session date must be recorded." });
      return false;
    }
    setErrors({});
    return true;
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please record at least one service date.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        dateOfObservation: getObservationDate(),
        personId: props.patientObj.id,
        type: "ART Adherence Preparation",
        data: {
          services: SERVICES.map((svc) => ({
            service: svc.key,
            label: svc.label,
            date_1: serviceDates[svc.key].date_1,
            date_2: serviceDates[svc.key].date_2,
            date_3: serviceDates[svc.key].date_3,
          })),
          treatment_supporter: treatmentSupporter,
        },
      };
      await axios.post(`${baseUrl}observation`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("ART Adherence Preparation saved successfully");
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
            ART Adherence Preparation
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>

          {/* ── Service Table ─────────────────────────────────────────────── */}
          <div style={{ overflowX: "auto", marginBottom: "24px" }}>
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
                <tr style={{ background: "#014d88", color: "#fff" }}>
                  <th
                    style={{
                      padding: "12px 18px",
                      textAlign: "left",
                      width: "46%",
                      fontWeight: 700,
                      fontSize: "13px",
                    }}
                  >
                    Services
                  </th>
                  {["Session 1 Date", "Session 2 Date", "Session 3 Date"].map(
                    (col) => (
                      <th
                        key={col}
                        style={{
                          padding: "12px 8px",
                          textAlign: "center",
                          width: "18%",
                          fontWeight: 600,
                          fontSize: "12px",
                        }}
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {SERVICES.map((svc, i) => (
                  <tr
                    key={svc.key}
                    style={{
                      background: i % 2 === 0 ? "#f5f9ff" : "#ffffff",
                      borderBottom: "1px solid #dce8f5",
                    }}
                  >
                    <td
                      style={{
                        padding: "11px 18px",
                        color: "#333",
                        fontWeight: "500",
                        lineHeight: "1.45",
                      }}
                    >
                      {svc.label}
                    </td>
                    {["date_1", "date_2", "date_3"].map((field) => (
                      <td
                        key={field}
                        style={{ padding: "7px 8px", textAlign: "center" }}
                      >
                        <Input
                          type="date"
                          value={serviceDates[svc.key][field]}
                          max={today}
                          onChange={(e) =>
                            handleDateChange(svc.key, field, e.target.value)
                          }
                          style={{
                            fontSize: "12px",
                            padding: "4px 6px",
                            height: "34px",
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Treatment Supporter Contact Details ───────────────────────── */}
          <Box
            sx={{
              background: "#fff",
              border: "1px solid #014d88",
              borderRadius: "4px",
              padding: "16px 20px",
              marginBottom: "20px",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                color: "#014d88",
                fontSize: "14px",
                marginBottom: "14px",
                borderLeft: "3px solid #014d88",
                paddingLeft: "10px",
              }}
            >
              Treatment Supporter — Name, Address &amp; Telephone Contact
            </Typography>
            <div className="row">
              <div className="form-group mb-3 col-md-4">
                <label>Name</label>
                <Input
                  type="text"
                  name="name"
                  value={treatmentSupporter.name}
                  onChange={handleTreatmentSupporter}
                  placeholder="Full name of treatment supporter"
                />
              </div>
              <div className="form-group mb-3 col-md-4">
                <label>Address</label>
                <Input
                  type="text"
                  name="address"
                  value={treatmentSupporter.address}
                  onChange={handleTreatmentSupporter}
                  placeholder="Home / residential address"
                />
              </div>
              <div className="form-group mb-3 col-md-4">
                <label>Telephone</label>
                <Input
                  type="tel"
                  name="telephone"
                  value={treatmentSupporter.telephone}
                  onChange={handleTreatmentSupporter}
                  placeholder="Phone number"
                />
              </div>
            </div>
          </Box>

          {/* ── Error Banner ─────────────────────────────────────────────── */}
          {errors.general && (
            <div
              style={{
                color: "#d32f2f",
                fontSize: "13px",
                marginBottom: "16px",
                background: "#ffebee",
                padding: "10px 16px",
                borderRadius: "6px",
                border: "1px solid #ef9a9a",
              }}
            >
              {errors.general}
            </div>
          )}

          {/* ── Action Buttons ────────────────────────────────────────────── */}
          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", paddingTop: "16px", borderTop: "1px solid #e0e0e0" }}>
            <MatButton
              variant="contained"
              className={classes.button}
              startIcon={<CancelIcon style={{ color: "#fff" }} />}
              style={{ backgroundColor: "#992E62" }}
              onClick={() => props.setActiveContent({ ...props.activeContent, route: "recent-history" })}
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

export default AdherencePreparationForm;
