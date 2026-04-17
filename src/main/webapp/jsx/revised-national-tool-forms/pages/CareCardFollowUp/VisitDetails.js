import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Divider,
  Button,
  Chip,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import * as moment from "moment";
import { toast } from "react-toastify";
import { token, url as baseUrl } from "../../../../api";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .form-control": { borderRadius: "0.25rem", height: "41px" },
    "& label": { fontSize: "14px", color: "#014d88", fontWeight: "bold" },
  },
  header: {
    backgroundColor: "#014d88",
    color: "#fff",
    padding: "16px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#014d88",
    textTransform: "uppercase",
    marginBottom: "16px",
    marginTop: "24px",
    borderLeft: "4px solid #014d88",
    paddingLeft: "12px",
  },
  fieldLabel: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#666",
    marginBottom: "6px",
  },
  fieldValue: {
    fontSize: "14px",
    color: "#333",
    marginBottom: "16px",
    padding: "8px 12px",
    backgroundColor: "#f5f5f5",
    borderRadius: "4px",
    minHeight: "38px",
    display: "flex",
    alignItems: "center",
  },
  button: {
    margin: theme.spacing(1),
    textTransform: "none",
  },
}));

const CareCardVisitDetails = ({
  visit,
  mode,
  onEdit,
  onCancelEdit,
  onSave,
  patientObj,
  showBackButton = false
}) => {
  const classes = useStyles();
  const [isEditing, setIsEditing] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  // Update isEditing when mode prop changes
  useEffect(() => {
    setIsEditing(mode === "edit");
  }, [mode]);

  const handleEdit = () => {
    setIsEditing(true);
    if (onEdit) onEdit();
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (onCancelEdit) onCancelEdit();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Implement update logic using the ARTClinicVisit update endpoint
      await axios.put(
        `${baseUrl}hiv/art/clinic-visit/${visit.id}`,
        visit,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Visit updated successfully");
      if (onSave) onSave();
    } catch (error) {
      console.error("Error updating visit:", error);
      toast.error("Failed to update visit");
    } finally {
      setSaving(false);
    }
  };

  const renderField = (label, value, defaultValue = "Not recorded") => (
    <Box marginBottom={2}>
      <Typography className={classes.fieldLabel}>{label}</Typography>
      <Box className={classes.fieldValue}>{value || defaultValue}</Box>
    </Box>
  );

  // Helper function to format code values to display text
  const formatCodeToDisplay = (code) => {
    if (!code) return "Not recorded";
    // Convert codes like "DSD_001" or "APPOINTMENT_TYPE_REFILL" to readable text
    return code
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <Card className={classes.root} style={{ borderRadius: "12px", maxWidth: "1200px", margin: "0 auto" }}>
      <CardContent>
        {/* Header */}
        <Box className={classes.header}>
          <Box display="flex" alignItems="center" gap={2}>
            {showBackButton && (
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={onBack}
                style={{ color: "#fff", textTransform: "none" }}
              >
                Back to List
              </Button>
            )}
            <Typography variant="h6">
              Visit Details — {moment(visit.visitDate).format("DD MMMM YYYY")}
            </Typography>
          </Box>
          <Box>
            {!isEditing ? (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEdit}
                style={{
                  color: "#fff",
                  borderColor: "#fff",
                  textTransform: "none",
                }}
              >
                Edit Visit
              </Button>
            ) : (
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  style={{ color: "#fff", borderColor: "#fff", textTransform: "none" }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    backgroundColor: "#fff",
                    color: "#014d88",
                    textTransform: "none",
                  }}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        {/* Visit Information */}
        <Typography className={classes.sectionTitle}>Visit Information</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            {renderField("Visit Date", moment(visit.visitDate).format("DD MMMM YYYY"))}
          </Grid>
          <Grid item xs={12} md={4}>
            {renderField("Duration on ART (Months)", visit.durationOnArtMonths)}
          </Grid>
          <Grid item xs={12} md={4}>
            {renderField("Clinician Name", visit.clinicianName)}
          </Grid>
        </Grid>

        <Divider style={{ margin: "24px 0" }} />

        {/* Vitals */}
        <Typography className={classes.sectionTitle}>Vital Signs</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            {renderField("Weight (kg)", visit.vitalSignDto?.bodyWeight)}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderField("Height (cm)", visit.vitalSignDto?.height)}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderField(
              "Blood Pressure",
              visit.vitalSignDto?.systolic && visit.vitalSignDto?.diastolic
                ? `${visit.vitalSignDto.systolic}/${visit.vitalSignDto.diastolic}`
                : null
            )}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderField("BMI/MUAC", visit.bmiMuac)}
          </Grid>
        </Grid>

        <Divider style={{ margin: "24px 0" }} />

        {/* Clinical Status */}
        <Typography className={classes.sectionTitle}>Clinical Status</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            {renderField("Functional Status", visit.functionalStatus)}
          </Grid>
          <Grid item xs={12} md={4}>
            {renderField("WHO Staging", visit.whoStaging)}
          </Grid>
          <Grid item xs={12} md={4}>
            {renderField("TB Status", formatCodeToDisplay(visit.tbStatus))}
          </Grid>
          {visit.tbStatus === "TB_STATUS_CONFIRMED_TB" && visit.tbStatusConfirmed && (
            <Grid item xs={12} md={4}>
              {renderField("Confirmed TB", formatCodeToDisplay(visit.tbStatusConfirmed))}
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            {renderField("Paediatric Disclosure", formatCodeToDisplay(visit.paediatricDisclosure))}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderField("DSD Status", formatCodeToDisplay(visit.dsdStatus))}
          </Grid>
        </Grid>

        {/* WHO Stage Criteria - Display if available */}
        {visit.whoStageCriteria && visit.whoStageCriteria.length > 0 && (
          <Box marginTop={2}>
            <Typography className={classes.fieldLabel}>WHO Stage Criteria</Typography>
            <Box className={classes.fieldValue} style={{ flexWrap: "wrap", alignItems: "flex-start" }}>
              {visit.whoStageCriteria.map((criteria, index) => (
                <Chip
                  key={index}
                  label={criteria}
                  size="small"
                  style={{
                    marginRight: "8px",
                    marginBottom: "8px",
                    backgroundColor: "#fff3e0",
                    color: "#e65100",
                    fontSize: "12px"
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        <Divider style={{ margin: "24px 0" }} />

        {/* Medications */}
        <Typography className={classes.sectionTitle}>Medications</Typography>
        <Box>
          {/* ARV Regimens */}
          {(() => {
            const arvRegimens = visit.aRVDrugsRegimen || visit.arvdrugsRegimen || [];
            return arvRegimens && Array.isArray(arvRegimens) && arvRegimens.length > 0 && (
              <Box marginBottom={2}>
                <Typography className={classes.fieldLabel}>ARV Regimen</Typography>
                <Grid container spacing={2}>
                  {arvRegimens.map((regimen, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Box
                        className={classes.fieldValue}
                        style={{
                          flexDirection: "column",
                          alignItems: "flex-start",
                          height: "100%"
                        }}
                      >
                        <Chip
                          label={`${regimen.regimenDrugName || regimen.regimenLineName || "Unknown Regimen"}`}
                          style={{
                            marginBottom: "8px",
                            backgroundColor: "#e3f2fd",
                            color: "#014d88",
                            fontWeight: 600
                          }}
                        />
                        {regimen.regimenAdherance && (
                          <Chip
                            label={`Adherence: ${regimen.regimenAdherance}`}
                            size="small"
                            style={{
                              marginBottom: "8px",
                              backgroundColor: "#f5f5f5",
                              color: "#666",
                            }}
                          />
                        )}
                        {regimen.dosage && (
                          <Chip
                            label={`Dose: ${regimen.dosage}`}
                            size="small"
                            style={{
                              backgroundColor: "#f5f5f5",
                              color: "#666",
                            }}
                          />
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            );
          })()}
          {renderField("Cotrimoxazole Dose", visit.cotrimoxazoleDose)}
          {renderField("Other Drugs", visit.otherDrugs)}
        </Box>

        <Divider style={{ margin: "24px 0" }} />

        {/* Lab Results */}
        <Typography className={classes.sectionTitle}>Lab Results</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {renderField("CD4 Count", visit.cd4Data?.cd4_result ? `${visit.cd4Data.cd4_result} cells/mm³` : null)}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderField("CD4 Date", visit.cd4Data?.cd4_date ? moment(visit.cd4Data.cd4_date).format("DD MMMM YYYY") : null)}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderField("RBS", visit.rbs)}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderField("EAC Status", visit.eac)}
          </Grid>
        </Grid>

        <Divider style={{ margin: "24px 0" }} />

        {/* Follow-up */}
        <Typography className={classes.sectionTitle}>Follow-up & Next Steps</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {renderField(
              "Next Appointment",
              visit.nextAppointment ? moment(visit.nextAppointment).format("DD MMMM YYYY") : null
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderField("Type of Appointment", formatCodeToDisplay(visit.typeOfAppointment))}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderField("Health Insurance Coverage", formatCodeToDisplay(visit.healthInsuranceCoverage))}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderField("EAC Status", visit.eac)}
          </Grid>
        </Grid>

        {visit.clinicalNote && (
          <>
            <Divider style={{ margin: "24px 0" }} />
            <Typography className={classes.sectionTitle}>Clinical Notes</Typography>
            {renderField("Notes", visit.clinicalNote)}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CareCardVisitDetails;
