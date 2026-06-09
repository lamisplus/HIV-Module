import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Box, Checkbox, CircularProgress } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { toast } from "react-toastify";
import { token, url as baseUrl } from "../../../api";

const useStyles = makeStyles((theme) => ({
  commentTextArea: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #014D88",
    fontFamily: "inherit",
    resize: "vertical",
    minHeight: "80px",
  },
}));

const PHDPServices = ({ preventive, setPreventive, setErrors, errors, encounterDate, patientObj }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [selectedServices, setSelectedServices] = useState({});

  useEffect(() => {
    fetchServiceProvidedOptions();
  }, []);


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

      // Initialize selectedServices state from preventive if available
      const initialSelected = {};
      const existingServices = preventive?.phdpServices || [];
      services.forEach((service) => {
        initialSelected[service.id] = existingServices.includes(service.id);
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

  const toggleService = (serviceId) => {
    const newSelected = {
      ...selectedServices,
      [serviceId]: !selectedServices[serviceId],
    };

    setSelectedServices(newSelected);

    // Update preventive state with selected service IDs (convert back to numbers if needed)
    const selectedIds = Object.keys(newSelected)
      .filter((id) => newSelected[id])
      .map((id) => parseInt(id, 10));

    setPreventive({
      ...preventive,
      phdpServices: selectedIds,
    });
  };

  const handleCommentChange = (e) => {
    setPreventive({
      ...preventive,
      phdpComment: e.target.value,
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* Services List (Grid Layout) */}
      <Box sx={{ marginBottom: "24px" }}>
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

      {/* Comments Section */}
      <Box sx={{ marginBottom: "28px" }}>
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
          value={preventive?.phdpComment || ""}
          onChange={handleCommentChange}
          placeholder="Enter any additional notes about services provided..."
          className={classes.commentTextArea}
        />
      </Box>
    </>
  );
};

export default PHDPServices;
