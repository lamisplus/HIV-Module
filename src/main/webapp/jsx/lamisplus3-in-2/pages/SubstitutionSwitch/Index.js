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
        data: {
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
          {/* SECTION A — SUBSTITUTION WITHIN LINE                              */}
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
            <SubHeading>Substitution Within Line</SubHeading>

            {/* Line checkboxes */}
            <div style={{ display: "flex", gap: "24px", marginBottom: "18px", flexWrap: "wrap" }}>
              {[
                { name: "within_1st_line", label: "1st Line" },
                { name: "within_2nd_line", label: "2nd Line" },
                { name: "within_3rd_line", label: "3rd Line" },
              ].map(({ name, label }) => (
                <label
                  key={name}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "7px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  <input
                    type="checkbox"
                    name={name}
                    checked={substitution[name]}
                    onChange={handleSubstitution}
                    style={{
                      width: "15px",
                      height: "15px",
                      margin: 0,
                      accentColor: "#014d88",
                      cursor: "pointer",
                    }}
                  />
                  {label}
                </label>
              ))}
            </div>

            {/* Row 35-37 */}
            <div className="row" style={{ marginBottom: "12px" }}>
              <div className="form-group mb-3 col-md-3">
                <SectionLabel>35. Date of New Regimen</SectionLabel>
                <Input
                  type="date"
                  name="date_new_regimen_35"
                  value={substitution.date_new_regimen_35}
                  max={today}
                  onChange={handleSubstitution}
                />
              </div>
              <div className="form-group mb-3 col-md-3">
                <SectionLabel>36. Why</SectionLabel>
                <Input
                  type="select"
                  name="why_36"
                  value={substitution.why_36}
                  onChange={handleSubstitution}
                >
                  <option value="">Select reason code</option>
                  {SUBSTITUTION_WHY_CODES.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Input>
              </div>
              <div className="form-group mb-3 col-md-6">
                <SectionLabel>37. New Regimen</SectionLabel>
                <Input
                  type="text"
                  name="new_regimen_37"
                  value={substitution.new_regimen_37}
                  onChange={handleSubstitution}
                  placeholder="e.g. TDF/3TC/DTG"
                />
              </div>
            </div>

            {/* Row 38-40 */}
            <div className="row">
              <div className="form-group mb-3 col-md-3">
                <SectionLabel>38. Date of New Regimen</SectionLabel>
                <Input
                  type="date"
                  name="date_new_regimen_38"
                  value={substitution.date_new_regimen_38}
                  max={today}
                  onChange={handleSubstitution}
                />
              </div>
              <div className="form-group mb-3 col-md-3">
                <SectionLabel>39. Why</SectionLabel>
                <Input
                  type="select"
                  name="why_39"
                  value={substitution.why_39}
                  onChange={handleSubstitution}
                >
                  <option value="">Select reason code</option>
                  {SUBSTITUTION_WHY_CODES.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Input>
              </div>
              <div className="form-group mb-3 col-md-6">
                <SectionLabel>40. New Regimen</SectionLabel>
                <Input
                  type="text"
                  name="new_regimen_40"
                  value={substitution.new_regimen_40}
                  onChange={handleSubstitution}
                  placeholder="e.g. AZT/3TC/EFV"
                />
              </div>
            </div>
          </Box>

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
            <SubHeading>Switch to Line</SubHeading>

            {/* Target line checkboxes */}
            <div style={{ display: "flex", gap: "24px", marginBottom: "18px", flexWrap: "wrap" }}>
              {[
                { name: "switch_to_2nd_line", label: "2nd Line" },
                { name: "switch_to_3rd_line", label: "3rd Line" },
              ].map(({ name, label }) => (
                <label
                  key={name}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "7px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  <input
                    type="checkbox"
                    name={name}
                    checked={switchSection[name]}
                    onChange={handleSwitch}
                    style={{
                      width: "15px",
                      height: "15px",
                      margin: 0,
                      accentColor: "#014d88",
                      cursor: "pointer",
                    }}
                  />
                  {label}
                </label>
              ))}
            </div>

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
              <Typography
                sx={{ fontWeight: 700, color: "#014d88", fontSize: "13px", marginBottom: "12px" }}
              >
                41. Drug Resistance (DR) Genotyping
              </Typography>
              <div className="row">
                <div className="form-group mb-3 col-md-2">
                  <SectionLabel>41a. DR Genotyping Done</SectionLabel>
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
                <div className="form-group mb-3 col-md-2">
                  <SectionLabel>41b. Sample Collection Date</SectionLabel>
                  <Input
                    type="date"
                    name="dr_sample_collection_date"
                    value={switchSection.dr_sample_collection_date}
                    max={today}
                    onChange={handleSwitch}
                  />
                </div>
                <div className="form-group mb-3 col-md-2">
                  <SectionLabel>41c. Date Result Received</SectionLabel>
                  <Input
                    type="date"
                    name="dr_date_result_received"
                    value={switchSection.dr_date_result_received}
                    onChange={handleSwitch}
                  />
                </div>
                <div className="form-group mb-3 col-md-3">
                  <SectionLabel>41d. Result</SectionLabel>
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
                  <SectionLabel>41e. If Resistant, Specify</SectionLabel>
                  <Input
                    type="text"
                    name="dr_if_resistant_specify"
                    value={switchSection.dr_if_resistant_specify}
                    onChange={handleSwitch}
                    placeholder="Specify resistance details..."
                    disabled={switchSection.dr_result !== "2" && switchSection.dr_result !== "4"}
                  />
                </div>
              </div>
            </div>

            {/* Row 42-44 */}
            <div className="row" style={{ marginBottom: "12px" }}>
              <div className="form-group mb-3 col-md-3">
                <SectionLabel>42. Date New Regimen</SectionLabel>
                <Input
                  type="date"
                  name="date_new_regimen_42"
                  value={switchSection.date_new_regimen_42}
                  max={today}
                  onChange={handleSwitch}
                />
              </div>
              <div className="form-group mb-3 col-md-3">
                <SectionLabel>43. Why</SectionLabel>
                <Input
                  type="select"
                  name="why_43"
                  value={switchSection.why_43}
                  onChange={handleSwitch}
                >
                  <option value="">Select reason code</option>
                  {SUBSTITUTION_WHY_CODES.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Input>
              </div>
              <div className="form-group mb-3 col-md-6">
                <SectionLabel>44. New Regimen</SectionLabel>
                <Input
                  type="text"
                  name="new_regimen_44"
                  value={switchSection.new_regimen_44}
                  onChange={handleSwitch}
                  placeholder="e.g. LPV/r + AZT/3TC"
                />
              </div>
            </div>

            {/* Row 45-47 */}
            <div className="row">
              <div className="form-group mb-3 col-md-3">
                <SectionLabel>45. Date New Regimen</SectionLabel>
                <Input
                  type="date"
                  name="date_new_regimen_45"
                  value={switchSection.date_new_regimen_45}
                  max={today}
                  onChange={handleSwitch}
                />
              </div>
              <div className="form-group mb-3 col-md-3">
                <SectionLabel>46. Why</SectionLabel>
                <Input
                  type="select"
                  name="why_46"
                  value={switchSection.why_46}
                  onChange={handleSwitch}
                >
                  <option value="">Select reason code</option>
                  {SUBSTITUTION_WHY_CODES.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Input>
              </div>
              <div className="form-group mb-3 col-md-6">
                <SectionLabel>47. New Regimen</SectionLabel>
                <Input
                  type="text"
                  name="new_regimen_47"
                  value={switchSection.new_regimen_47}
                  onChange={handleSwitch}
                  placeholder="e.g. DRV/r + TDF/3TC"
                />
              </div>
            </div>
          </Box>

          {/* ── Why Code Reference ───────────────────────────────────────────── */}
          <Box
            sx={{
              background: "#f5f9ff",
              border: "1px dashed #014d88",
              borderRadius: "4px",
              padding: "12px 16px",
              marginBottom: "20px",
            }}
          >
            <Typography sx={{ fontWeight: 700, color: "#014d88", fontSize: "12px", marginBottom: "6px" }}>
              Why Code Reference (fields 36, 39, 43, 46)
            </Typography>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 24px" }}>
              {SUBSTITUTION_WHY_CODES.map((c) => (
                <span key={c.value} style={{ fontSize: "11px", color: "#546e7a" }}>{c.label}</span>
              ))}
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
