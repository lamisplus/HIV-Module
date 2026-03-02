import React from "react";
import * as moment from "moment";
import { Typography, Box, Chip } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent, Grid, Divider } from "@material-ui/core";
import MatButton from "@material-ui/core/Button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import EditIcon from "@material-ui/icons/Edit";

const useStyles = makeStyles((theme) => ({
  root: {
    "& label": { fontSize: "14px", color: "#014d88", fontWeight: "bold" },
  },
  button: {
    margin: theme.spacing(1),
  },
  fieldLabel: {
    color: "#014d88",
    fontWeight: 600,
    fontSize: "13px",
    marginBottom: "4px",
  },
  fieldValue: {
    fontSize: "14px",
    color: "#333",
    marginBottom: "16px",
  },
  sectionTitle: {
    color: "#014d88",
    fontWeight: 700,
    fontSize: "15px",
    marginBottom: "12px",
    marginTop: "8px",
  },
  serviceChip: {
    margin: "4px",
    backgroundColor: "#e3f2fd",
    color: "#014d88",
    fontWeight: 500,
  },
}));

const AdherencePreparationViewDetails = (props) => {
  const classes = useStyles();
  const record = props.viewData;

  if (!record) {
    return (
      <Card className={classes.root}>
        <CardContent>
          <Typography color="error">No record data available</Typography>
        </CardContent>
      </Card>
    );
  }

  const handleBack = () => {
    if (props.onBack) {
      props.onBack();
    }
  };

  const handleEdit = () => {
    if (props.setEditRecord) {
      props.setEditRecord(record);
    }
  };

  const services = record?.adherenceServices?.services || [];
  const treatmentSupporter = record?.treatmentSupporterData || null;

  return (
    <Card className={classes.root} style={{ borderRadius: "12px" }}>
      <CardContent>
        <Box
          sx={{
            backgroundColor: "#014d88",
            padding: "14px 20px",
            marginBottom: "24px",
            borderRadius: "8px 8px 0 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>
            ART Adherence Preparation - View Details
          </Typography>
          <Box>
            <MatButton
              variant="contained"
              className={classes.button}
              startIcon={<EditIcon style={{ color: "#fff" }} />}
              style={{ backgroundColor: "#fff", color: "#014d88", marginRight: "8px" }}
              onClick={handleEdit}
            >
              <span style={{ textTransform: "capitalize" }}>Edit</span>
            </MatButton>
          </Box>
        </Box>

        <Box sx={{ paddingX: "16px" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography className={classes.fieldLabel}>Service Date</Typography>
              <Typography className={classes.fieldValue}>
                {record.serviceDate
                  ? moment(record.serviceDate).format("DD/MM/YYYY")
                  : "Not specified"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography className={classes.fieldLabel}>Record Created</Typography>
              <Typography className={classes.fieldValue}>
                {record.createdDate
                  ? moment(record.createdDate).format("DD/MM/YYYY HH:mm")
                  : "Not available"}
              </Typography>
            </Grid>

            {record.lastModifiedDate && (
              <Grid item xs={12} md={6}>
                <Typography className={classes.fieldLabel}>Last Modified</Typography>
                <Typography className={classes.fieldValue}>
                  {moment(record.lastModifiedDate).format("DD/MM/YYYY HH:mm")}
                </Typography>
              </Grid>
            )}
          </Grid>

          <Divider style={{ margin: "24px 0" }} />

          <Typography className={classes.sectionTitle}>
            Services Provided ({services.length})
          </Typography>

          {services.length === 0 ? (
            <Typography variant="body2" color="textSecondary" style={{ marginBottom: "16px" }}>
              No services recorded
            </Typography>
          ) : (
            <Box sx={{ marginBottom: "24px" }}>
              {services.map((service, index) => (
                <Chip
                  key={index}
                  label={service.label || service.service || "Unknown Service"}
                  className={classes.serviceChip}
                />
              ))}
            </Box>
          )}

          {services.length > 0 && (
            <>
              <Divider style={{ margin: "24px 0" }} />
              <Typography className={classes.sectionTitle}>Service Details</Typography>
              <Box sx={{ marginBottom: "16px" }}>
                {services.map((service, index) => (
                  <Box
                    key={index}
                    sx={{
                      padding: "12px",
                      backgroundColor: "#f9f9f9",
                      borderRadius: "6px",
                      marginBottom: "8px",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography className={classes.fieldLabel}>Service Name</Typography>
                        <Typography variant="body2">
                          {service.label || service.service || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography className={classes.fieldLabel}>Service Code</Typography>
                        <Typography variant="body2">{service.service || "N/A"}</Typography>
                      </Grid>
                      {service.dates && service.dates.length > 0 && (
                        <Grid item xs={12} sm={6}>
                          <Typography className={classes.fieldLabel}>Date(s)</Typography>
                          <Typography variant="body2">
                            {service.dates
                              .map((d) => moment(d).format("DD/MM/YYYY"))
                              .join(", ")}
                          </Typography>
                        </Grid>
                      )}
                      {service.comment && (
                        <Grid item xs={12}>
                          <Typography className={classes.fieldLabel}>Comment</Typography>
                          <Typography variant="body2">{service.comment}</Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                ))}
              </Box>
            </>
          )}

          {treatmentSupporter && (treatmentSupporter.name || treatmentSupporter.address || treatmentSupporter.telephone) && (
            <>
              <Divider style={{ margin: "24px 0" }} />
              <Typography className={classes.sectionTitle}>
                Treatment Supporter Information
              </Typography>
              <Box
                sx={{
                  padding: "16px",
                  backgroundColor: "#f5f9ff",
                  borderRadius: "8px",
                  border: "1px solid #e3f2fd",
                }}
              >
                <Grid container spacing={2}>
                  {treatmentSupporter.name && (
                    <Grid item xs={12} md={4}>
                      <Typography className={classes.fieldLabel}>Name</Typography>
                      <Typography variant="body2">{treatmentSupporter.name}</Typography>
                    </Grid>
                  )}
                  {treatmentSupporter.address && (
                    <Grid item xs={12} md={4}>
                      <Typography className={classes.fieldLabel}>Address</Typography>
                      <Typography variant="body2">{treatmentSupporter.address}</Typography>
                    </Grid>
                  )}
                  {treatmentSupporter.telephone && (
                    <Grid item xs={12} md={4}>
                      <Typography className={classes.fieldLabel}>Telephone</Typography>
                      <Typography variant="body2">{treatmentSupporter.telephone}</Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: "8px",
            justifyContent: "flex-start",
            paddingTop: "24px",
            borderTop: "1px solid #e0e0e0",
            paddingX: "16px",
            marginTop: "24px",
          }}
        >
          <MatButton
            variant="contained"
            className={classes.button}
            startIcon={<ArrowBackIcon style={{ color: "#fff" }} />}
            style={{ backgroundColor: "#014d88", color: "#fff" }}
            onClick={handleBack}
          >
            <span style={{ textTransform: "capitalize", color: "#fff" }}>Back to History</span>
          </MatButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AdherencePreparationViewDetails;
