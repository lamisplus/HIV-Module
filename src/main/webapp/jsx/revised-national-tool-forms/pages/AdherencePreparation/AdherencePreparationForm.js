import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "reactstrap";
import * as moment from "moment";
import { Typography, Box, CircularProgress } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent } from "@material-ui/core";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { token, url as baseUrl } from "../../../../api";
import MatButton from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  root: {
    "& label": { fontSize: "14px", color: "#014d88", fontWeight: "bold" },
    "& .form-control": { borderRadius: "0.25rem", height: "41px" },
  },
  button: { margin: theme.spacing(1) },
}));

// Define the adherence preparation questions
const ADHERENCE_QUESTIONS = [
  {
    key: "educateOnEssentials",
    label: "ART - educate on essentials",
  },
  {
    key: "explainCompleteAdherence",
    label: "Why complete adherence needed",
  },
  {
    key: "explainDoseAndSchedule",
    label: "Explain dose, when to take, what to do when one forgets dose",
  },
  {
    key: "explainSideEffects",
    label: "What can occur; how to manage side effects",
  },
  {
    key: "discussAdherencePlan",
    label: "Adherence plan (schedule, aides, explain diary, preparation for travel)",
  },
  {
    key: "prepareTreatmentSupporter",
    label: "Treatment supporter preparation",
  },
];

const AdherencePreparationForm = (props) => {
  const classes = useStyles();
  const today = moment(new Date()).format("YYYY-MM-DD");
  const isEditMode = !!props.editData && !!props.editData.id;

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visitDate, setVisitDate] = useState(today);
  const [readyForArt, setReadyForArt] = useState("");
  const [answers, setAnswers] = useState({
    educateOnEssentials: "",
    explainCompleteAdherence: "",
    explainDoseAndSchedule: "",
    explainSideEffects: "",
    discussAdherencePlan: "",
    prepareTreatmentSupporter: "",
  });
  const [treatmentSupporter, setTreatmentSupporter] = useState({
    name: "",
    address: "",
    telephone: "",
  });
  const [errors, setErrors] = useState({});

  // Populate form when in edit mode or reset when not
  useEffect(() => {
    if (isEditMode && props.editData) {
      populateEditData();
    } else if (!isEditMode) {
      // Reset form when not in edit mode
      setVisitDate(today);
      setReadyForArt("");
      setAnswers({
        educateOnEssentials: "",
        explainCompleteAdherence: "",
        explainDoseAndSchedule: "",
        explainSideEffects: "",
        discussAdherencePlan: "",
        prepareTreatmentSupporter: "",
      });
      setTreatmentSupporter({ name: "", address: "", telephone: "" });
      setErrors({});
    }
  }, [props.editData, isEditMode]);

  const populateEditData = () => {
    const editData = props.editData;

    // Set visit date
    if (editData.serviceDate) {
      setVisitDate(moment(editData.serviceDate).format("YYYY-MM-DD"));
    }

    // Set ready for ART
    if (editData.readyForArt) {
      setReadyForArt(editData.readyForArt);
    }

    // Set answers from adherenceServices
    if (editData.adherenceServices) {
      const services = editData.adherenceServices;

      // Handle both old format (with services array) and new format (with question keys)
      if (services.services && Array.isArray(services.services)) {
        // Old format - set default values
        setAnswers({
          educateOnEssentials: "No",
          explainCompleteAdherence: "No",
          explainDoseAndSchedule: "No",
          explainSideEffects: "No",
          discussAdherencePlan: "No",
          prepareTreatmentSupporter: "No",
        });
      } else {
        // New format - use actual values
        setAnswers({
          educateOnEssentials: services.educateOnEssentials || "",
          explainCompleteAdherence: services.explainCompleteAdherence || "",
          explainDoseAndSchedule: services.explainDoseAndSchedule || "",
          explainSideEffects: services.explainSideEffects || "",
          discussAdherencePlan: services.discussAdherencePlan || "",
          prepareTreatmentSupporter: services.prepareTreatmentSupporter || "",
        });
      }
    }

    // Set treatment supporter data
    if (editData.treatmentSupporterData) {
      setTreatmentSupporter({
        name: editData.treatmentSupporterData.name || "",
        address: editData.treatmentSupporterData.address || "",
        telephone: editData.treatmentSupporterData.telephone || "",
      });
    }
  };

  const handleAnswerChange = (questionKey, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionKey]: value,
    }));
  };

  const handleTreatmentSupporterChange = (e) => {
    const { name, value } = e.target;
    setTreatmentSupporter((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validatePhoneNumber = (phone) => {
    if (!phone) return true; // Phone is optional
    // Remove all spaces, dashes, and parentheses
    const cleaned = phone.replace(/[\s\-()]/g, "");
    // Check if it contains only digits and optional + at the start
    const phoneRegex = /^\+?\d{10,15}$/;
    return phoneRegex.test(cleaned);
  };

  const validate = () => {
    const newErrors = {};

    // Check if at least one question is answered with "Yes"
    const anyYes = Object.values(answers).some((v) => v === "Yes");
    if (!anyYes) {
      toast.error("Please answer Yes to at least one adherence preparation question.");
      return false;
    }

    if (!visitDate) {
      toast.error("Please select a valid visit date.");
      return false;
    }

    if (!readyForArt) {
      toast.error("Please indicate if the patient is ready for ART.");
      return false;
    }

    // Validate telephone number if provided
    if (treatmentSupporter.telephone && !validatePhoneNumber(treatmentSupporter.telephone)) {
      newErrors.telephone = "Please enter a valid telephone number (10-15 digits)";
      toast.error("Please enter a valid telephone number (10-15 digits)");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        personId: props.patientObj.id,
        serviceDate: visitDate,
        readyForArt: readyForArt,
        adherenceServices: {
          visitDate: visitDate,
          ...answers,
        },
        treatmentSupporterData:
          treatmentSupporter.name || treatmentSupporter.address || treatmentSupporter.telephone
            ? treatmentSupporter
            : null,
      };

      if (isEditMode) {
        await axios.put(
          `${baseUrl}adherence-preparation/${props.editData.id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Adherence Preparation record updated successfully");
      } else {
        await axios.post(`${baseUrl}adherence-preparation`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Adherence Preparation record saved successfully");
      }

      if (props.onSave) {
        props.onSave();
      } else if (props.setActiveContent && props.activeContent) {
        props.setActiveContent({
          ...props.activeContent,
          route: "recent-history",
          refreshPatient: true,
          refreshTimestamp: Date.now(),
        });
      }

      // Reset form
      setVisitDate(today);
      setReadyForArt("");
      setAnswers({
        educateOnEssentials: "",
        explainCompleteAdherence: "",
        explainDoseAndSchedule: "",
        explainSideEffects: "",
        discussAdherencePlan: "",
        prepareTreatmentSupporter: "",
      });
      setTreatmentSupporter({ name: "", address: "", telephone: "" });
      setErrors({});
    } catch (err) {
      const msg =
        err?.response?.data?.apierror?.message || "An error occurred. Please try again.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (props.onSave) {
      props.onSave();
    } else if (props.setActiveContent && props.activeContent) {
      props.setActiveContent({ ...props.activeContent, route: "recent-history" });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card className={classes.root} style={{ borderRadius: "12px", overflow: "visible" }}>
      <CardContent>
        <Box
          sx={{
            backgroundColor: "#014d88",
            padding: "14px 20px",
            marginBottom: "24px",
            borderRadius: "8px 8px 0 0",
          }}
        >
          <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>
            {isEditMode ? "Edit" : "Create"} - ART Adherence Preparation Services
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          {/* Visit Date and Ready for ART - Two columns */}
          <Box sx={{ marginBottom: "24px", paddingX: "16px" }}>
            <div className="row">
              <div className="form-group mb-3 col-md-6">
                <label htmlFor="visit-date">Visit Date *</label>
                <Input
                  type="date"
                  id="visit-date"
                  value={visitDate}
                  max={today}
                  onChange={(e) => setVisitDate(e.target.value)}
                  style={{ fontSize: "14px" }}
                />
              </div>
              <div className="form-group mb-3 col-md-6">
                <label htmlFor="ready-for-art">Is Patient Ready for ART? *</label>
                <Input
                  type="select"
                  id="ready-for-art"
                  value={readyForArt}
                  onChange={(e) => setReadyForArt(e.target.value)}
                  style={{ fontSize: "14px" }}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Input>
              </div>
            </div>
          </Box>

          {/* Adherence Preparation Questions - Two columns */}
          <Box sx={{ marginBottom: "24px", paddingX: "16px" }}>
            <Typography
              variant="subtitle1"
              sx={{
                color: "#014d88",
                fontWeight: 600,
                marginBottom: "16px",
                fontSize: "14px",
              }}
            >
              Adherence Preparation Checklist *
            </Typography>

            <div className="row">
              {ADHERENCE_QUESTIONS.map((question) => (
                <div key={question.key} className="form-group mb-3 col-md-6">
                  <label htmlFor={question.key}>{question.label}</label>
                  <Input
                    type="select"
                    id={question.key}
                    value={answers[question.key]}
                    onChange={(e) => handleAnswerChange(question.key, e.target.value)}
                    style={{ fontSize: "14px" }}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Input>
                </div>
              ))}
            </div>
          </Box>

          {/* Treatment Supporter Section */}
          <Box sx={{ marginBottom: "24px", paddingX: "16px" }}>
            <Typography
              variant="subtitle1"
              sx={{
                color: "#014d88",
                fontWeight: 600,
                marginBottom: "12px",
                fontSize: "14px",
              }}
            >
              Treatment Supporter Information (Optional)
            </Typography>
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                padding: "20px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <div className="row">
                <div className="form-group mb-3 col-md-4">
                  <label htmlFor="supporter-name">Name</label>
                  <Input
                    type="text"
                    id="supporter-name"
                    name="name"
                    value={treatmentSupporter.name}
                    onChange={handleTreatmentSupporterChange}
                    placeholder="Full name of treatment supporter"
                    style={{ fontSize: "14px" }}
                  />
                </div>
                <div className="form-group mb-3 col-md-4">
                  <label htmlFor="supporter-address">Address</label>
                  <Input
                    type="text"
                    id="supporter-address"
                    name="address"
                    value={treatmentSupporter.address}
                    onChange={handleTreatmentSupporterChange}
                    placeholder="Home / residential address"
                    style={{ fontSize: "14px" }}
                  />
                </div>
                <div className="form-group mb-3 col-md-4">
                  <label htmlFor="supporter-telephone">Telephone</label>
                  <Input
                    type="tel"
                    id="supporter-telephone"
                    name="telephone"
                    value={treatmentSupporter.telephone}
                    onChange={handleTreatmentSupporterChange}
                    placeholder="Phone number (10-15 digits)"
                    style={{
                      fontSize: "14px",
                      borderColor: errors.telephone ? "#d32f2f" : "",
                    }}
                    invalid={!!errors.telephone}
                  />
                  {errors.telephone && (
                    <Typography
                      variant="caption"
                      sx={{ color: "#d32f2f", display: "block", marginTop: "4px" }}
                    >
                      {errors.telephone}
                    </Typography>
                  )}
                </div>
              </div>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: "8px",
              justifyContent: "flex-end",
              paddingTop: "16px",
              borderTop: "1px solid #e0e0e0",
              paddingX: "16px",
            }}
          >
            <MatButton
              variant="contained"
              className={classes.button}
              startIcon={<CancelIcon style={{ color: "#fff" }} />}
              style={{ backgroundColor: "#992E62", color: "#fff" }}
              onClick={handleCancel}
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
                {saving ? "Saving..." : "Save"}
              </span>
            </MatButton>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdherencePreparationForm;
