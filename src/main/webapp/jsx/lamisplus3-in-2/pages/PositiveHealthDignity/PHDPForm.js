import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "reactstrap";
import * as moment from "moment";
import { Typography, Box, Checkbox, CircularProgress } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent } from "@material-ui/core";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { token, url as baseUrl } from "../../../../api";
import MatButton from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const useStyles = makeStyles((theme) => ({
  root: {
    "& label": { fontSize: "14px", color: "#014d88", fontWeight: "bold" },
    "& .form-control": { borderRadius: "0.25rem", height: "41px" },
  },
  button: { margin: theme.spacing(1) },
  commentTextArea: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontFamily: "inherit",
    resize: "vertical",
    minHeight: "80px",
  },
  serviceItem: {
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    borderBottom: "1px solid #e0e0e0",
    "&:hover": {
      backgroundColor: "#f5f9ff",
    },
  },
  serviceLabel: {
    flex: 1,
    fontSize: "14px",
    color: "#333",
    fontWeight: 500,
  },
}));

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const PHDPForm = (props) => {
  const classes = useStyles();
  const today = moment(new Date()).format("YYYY-MM-DD");
  const isEditMode = !!props.editData;

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [serviceDate, setServiceDate] = useState(today);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [selectedServices, setSelectedServices] = useState({});
  const [globalComment, setGlobalComment] = useState("");

  // Fetch SERVICE_PROVIDED codeset options
  useEffect(() => {
    fetchServiceProvidedOptions();
  }, []);

  // Populate form when in edit mode
  useEffect(() => {
    if (isEditMode && props.editData && serviceOptions.length > 0) {
      populateEditData();
    }
  }, [props.editData, serviceOptions]);

  const fetchServiceProvidedOptions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}application-codesets/v2/SERVICE_PROVIDED`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const services = response.data || [];
      setServiceOptions(services);

      // Initialize selectedServices state
      const initialSelected = {};
      services.forEach((service) => {
        initialSelected[service.id] = false;
      });
      setSelectedServices(initialSelected);
    } catch (error) {
      console.error("Error fetching SERVICE_PROVIDED options:", error);
      toast.error("Failed to load service options");
      setServiceOptions([]);
      setSelectedServices({});
    } finally {
      setLoading(false);
    }
  };

  const populateEditData = () => {
    const editData = props.editData;

    // Set assessment date
    if (editData.assessmentDate) {
      setServiceDate(moment(editData.assessmentDate).format("YYYY-MM-DD"));
    }

    // Set comments
    const comment = editData.clinicalNotes || editData.phdpServices?.encounterComment || "";
    setGlobalComment(comment);

    // Set selected services
    const providedServices = editData.phdpServices?.services || [];
    const newSelectedServices = {};

    serviceOptions.forEach((service) => {
      // Check if this service was previously selected (has dates)
      const wasProvided = providedServices.find(
        (ps) => ps.serviceId === service.id && ps.dates && ps.dates.length > 0
      );
      newSelectedServices[service.id] = !!wasProvided;
    });

    setSelectedServices(newSelectedServices);
  };

  // ── Service toggle handler ────────────────────────────────────────────────
  const toggleService = (serviceId) => {
    setSelectedServices((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const anyChecked = Object.values(selectedServices).some((v) => v);
    if (!anyChecked) {
      toast.error("Please select at least one service provided on this date.");
      return false;
    }
    if (!serviceDate) {
      toast.error("Please select a valid service date.");
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
      // Only include services that were actually selected/provided
      const providedServices = serviceOptions
        .filter((svc) => selectedServices[svc.id])
        .map((svc) => ({
          service: svc.code,
          label: svc.display,
          serviceId: svc.id,
          dates: [serviceDate],
          comment: "",
        }));

      const payload = {
        personId: props.patientObj.id,
        assessmentDate: serviceDate,
        phdpServices: {
          services: providedServices,
          encounterComment: globalComment.trim() || null,
        },
        clinicalNotes: globalComment.trim() || null,
      };

      if (isEditMode) {
        // Update existing record
        await axios.put(
          `${baseUrl}positive-health-dignity-prevention/${props.editData.id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("PHDP record updated successfully");
      } else {
        // Create new record
        await axios.post(`${baseUrl}positive-health-dignity-prevention`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("PHDP record saved successfully");
      }

      if (props.onSave) {
        props.onSave();
      } else if (props.setActiveContent && props.activeContent) {
        props.setActiveContent({ ...props.activeContent, route: "recent-history" });
      }

      // Reset form
      setServiceDate(today);
      const resetSelected = {};
      serviceOptions.forEach((service) => {
        resetSelected[service.id] = false;
      });
      setSelectedServices(resetSelected);
      setGlobalComment("");
    } catch (err) {
      const msg =
        err?.response?.data?.apierror?.message ||
        "An error occurred. Please try again.";
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

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card
      className={classes.root}
      style={{ borderRadius: "12px", overflow: "visible" }}
    >
      <CardContent>
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <Box sx={{ backgroundColor: "#014d88", padding: "14px 20px", marginBottom: "24px", borderRadius: "8px 8px 0 0" }}>
          <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>
            {isEditMode ? "Edit" : "Create"} - Care and Support / Positive Health Dignity and Prevention Services
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          {/* ── Service Date Picker ─────────────────────────────────────────── */}
          <Box sx={{ marginBottom: "24px", paddingX: "16px" }}>
            <Typography
              variant="subtitle1"
              sx={{
                color: "#014d88",
                fontWeight: 600,
                marginBottom: "8px",
                display: "block"
              }}
            >
              Service Date *
            </Typography>
            <Input
              type="date"
              value={serviceDate}
              max={today}
              onChange={(e) => setServiceDate(e.target.value)}
              style={{
                width: "100%",
                maxWidth: "220px",
                fontSize: "14px",
                height: "40px",
                padding: "0 8px"
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: "#666",
                display: "block",
                marginTop: "4px",
                fontStyle: "italic"
              }}
            >
              Select the date when services were provided
            </Typography>
          </Box>

          {/* ── Services List (Grid Layout) ────────────────────────────────────── */}
          <Box sx={{ marginBottom: "24px", paddingX: "16px" }}>
            <Typography
              variant="subtitle1"
              sx={{
                color: "#014d88",
                fontWeight: 600,
                marginBottom: "12px",
                fontSize: "14px"
              }}
            >
              Services Provided (Check all that apply)
            </Typography>

            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                overflow: "auto",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                maxHeight: "400px",
                padding: "16px",
              }}
            >
              {serviceOptions.length === 0 ? (
                <Box sx={{ padding: "24px", textAlign: "center", color: "#666" }}>
                  <Typography variant="body2">
                    No services available. Please configure SERVICE_PROVIDED in application codesets.
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)",
                      lg: "repeat(4, 1fr)",
                    },
                    gap: "12px",
                  }}
                >
                  {serviceOptions.map((service) => (
                    <Box
                      key={service.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 12px",
                        backgroundColor: "#f9f9f9",
                        borderRadius: "6px",
                        border: "1px solid #e0e0e0",
                        "&:hover": {
                          backgroundColor: "#f5f9ff",
                          borderColor: "#014d88",
                        },
                      }}
                    >
                      <Checkbox
                        checked={!!selectedServices[service.id]}
                        onChange={() => toggleService(service.id)}
                        color="primary"
                        sx={{ padding: "4px", marginRight: "8px" }}
                      />
                      <Typography
                        sx={{
                          flex: 1,
                          fontSize: "13px",
                          color: "#333",
                          fontWeight: 500,
                          lineHeight: 1.3,
                        }}
                      >
                        {service.display}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>

          {/* ── Global Comments Section ─────────────────────────────────────── */}
          <Box sx={{ marginBottom: "28px", paddingX: "16px" }}>
            <Typography
              variant="subtitle1"
              sx={{
                color: "#014d88",
                fontWeight: 600,
                marginBottom: "10px",
                fontSize: "14px"
              }}
            >
              Additional Comments (Optional)
            </Typography>
            <textarea
              value={globalComment}
              onChange={(e) => setGlobalComment(e.target.value)}
              placeholder="Enter any additional notes about services provided on this date..."
              className={classes.commentTextArea}
            />
          </Box>

          {/* ── Action Buttons ────────────────────────────────────────────── */}
          <Box sx={{ display: "flex", gap: "8px", justifyContent: "flex-end", paddingTop: "16px", borderTop: "1px solid #e0e0e0", paddingX: "16px" }}>
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
              <span style={{ textTransform: "capitalize", color: "#fff" }}>{saving ? "Saving..." : "Save"}</span>
            </MatButton>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default PHDPForm;
