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

const useStyles = makeStyles((theme) => ({
  root: {
    "& label": { fontSize: "14px", color: "#014d88", fontWeight: "bold" },
    "& .form-control": { borderRadius: "0.25rem", height: "41px" },
  },
  button: { margin: theme.spacing(1) },
}));

const AdherencePreparationForm = (props) => {
  const classes = useStyles();
  const today = moment(new Date()).format("YYYY-MM-DD");
  const isEditMode = !!props.editData;

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [serviceDate, setServiceDate] = useState(today);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [selectedServices, setSelectedServices] = useState({});
  const [treatmentSupporter, setTreatmentSupporter] = useState({
    name: "",
    address: "",
    telephone: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchServiceProvidedOptions();
  }, []);

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

    if (editData.serviceDate) {
      setServiceDate(moment(editData.serviceDate).format("YYYY-MM-DD"));
    }

    const providedServices = editData.adherenceServices?.services || [];
    const newSelectedServices = {};

    serviceOptions.forEach((service) => {
      const wasProvided = providedServices.find(
        (ps) => ps.serviceId === service.id && ps.dates && ps.dates.length > 0
      );
      newSelectedServices[service.id] = !!wasProvided;
    });

    setSelectedServices(newSelectedServices);

    // Populate treatment supporter data if available
    if (editData.treatmentSupporterData) {
      setTreatmentSupporter({
        name: editData.treatmentSupporterData.name || "",
        address: editData.treatmentSupporterData.address || "",
        telephone: editData.treatmentSupporterData.telephone || "",
      });
    }
  };

  const toggleService = (serviceId) => {
    setSelectedServices((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
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

    const anyChecked = Object.values(selectedServices).some((v) => v);
    if (!anyChecked) {
      toast.error("Please select at least one service provided on this date.");
      return false;
    }
    if (!serviceDate) {
      toast.error("Please select a valid service date.");
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
        serviceDate: serviceDate,
        adherenceServices: {
          services: providedServices,
        },
        treatmentSupporterData: treatmentSupporter.name || treatmentSupporter.address || treatmentSupporter.telephone
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
          refreshTimestamp: Date.now()
        });
      }

      setServiceDate(today);
      const resetSelected = {};
      serviceOptions.forEach((service) => {
        resetSelected[service.id] = false;
      });
      setSelectedServices(resetSelected);
      setTreatmentSupporter({ name: "", address: "", telephone: "" });
      setErrors({});
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
        <Box sx={{ backgroundColor: "#014d88", padding: "14px 20px", marginBottom: "24px", borderRadius: "8px 8px 0 0" }}>
          <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>
            {isEditMode ? "Edit" : "Create"} - ART Adherence Preparation Services
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
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
                  <label htmlFor="supporter-telephone">Telephone *</label>
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

export default AdherencePreparationForm;
