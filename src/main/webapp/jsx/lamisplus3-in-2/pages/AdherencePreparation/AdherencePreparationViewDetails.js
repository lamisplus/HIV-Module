import React from "react";
import * as moment from "moment";
import { Typography, Box, Chip, Grid, Divider, Card, CardContent } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const useStyles = makeStyles((theme) => ({
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
}));

const AdherencePreparationViewDetails = ({ viewData }) => {
  const classes = useStyles();
  const record = viewData;

  // Get services that were provided
  const services = record?.adherenceServices?.services || [];
  const treatmentSupporter = record?.treatmentSupporterData || null;

  return (
    <Box>
      {/* Header Info */}
      <Card style={{ marginBottom: "20px", backgroundColor: "#f8f9fa" }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography className={classes.fieldLabel}>Service Date</Typography>
              <Box className={classes.fieldValue}>
                {record.serviceDate
                  ? moment(record.serviceDate).format("DD MMMM YYYY")
                  : "Not recorded"}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography className={classes.fieldLabel}>Total Services Provided</Typography>
              <Box className={classes.fieldValue}>
                <Chip
                  label={`${services.length} service${services.length !== 1 ? 's' : ''}`}
                  color="primary"
                  size="small"
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Services Provided */}
      <Typography className={classes.sectionTitle}>
        Services Provided
      </Typography>

      {services.length === 0 ? (
        <Box className={classes.fieldValue}>
          <Typography variant="body2" color="textSecondary">
            No services recorded
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card variant="outlined" style={{ height: "100%" }}>
                <CardContent>
                  <Box display="flex" alignItems="flex-start" gap={1}>
                    <CheckCircleIcon color="success" fontSize="small" />
                    <Box flex={1}>
                      <Typography variant="body2" style={{ fontWeight: 500 }}>
                        {service.label || service.service}
                      </Typography>
                      {service.dates && service.dates.length > 0 && (
                        <Typography variant="caption" color="textSecondary" display="block" style={{ marginTop: 4 }}>
                          Date: {moment(service.dates[0]).format("DD MMM YYYY")}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Treatment Supporter Information */}
      {treatmentSupporter && (treatmentSupporter.name || treatmentSupporter.address || treatmentSupporter.telephone) && (
        <>
          <Divider style={{ margin: "24px 0" }} />
          <Typography className={classes.sectionTitle}>Treatment Supporter Information</Typography>
          <Card style={{ backgroundColor: "#f8f9fa" }}>
            <CardContent>
              <Grid container spacing={2}>
                {treatmentSupporter.name && (
                  <Grid item xs={12} md={4}>
                    <Typography className={classes.fieldLabel}>Name</Typography>
                    <Box className={classes.fieldValue}>
                      {treatmentSupporter.name}
                    </Box>
                  </Grid>
                )}
                {treatmentSupporter.address && (
                  <Grid item xs={12} md={4}>
                    <Typography className={classes.fieldLabel}>Address</Typography>
                    <Box className={classes.fieldValue}>
                      {treatmentSupporter.address}
                    </Box>
                  </Grid>
                )}
                {treatmentSupporter.telephone && (
                  <Grid item xs={12} md={4}>
                    <Typography className={classes.fieldLabel}>Telephone</Typography>
                    <Box className={classes.fieldValue}>
                      {treatmentSupporter.telephone}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default AdherencePreparationViewDetails;
