import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  Divider,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import * as moment from "moment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "react-toastify";
import { token, url as baseUrl } from "../../../../api";


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

const PHDPViewDetails = ({ record }) => {
  const classes = useStyles();

  // Get services that were provided (have dates)
  const services = record.phdpServices?.services || [];
  const providedServices = services.filter(s => s.dates && s.dates.length > 0);
  const encounterComment = record.phdpServices?.encounterComment;

  return (
    <Box>
      {/* Header Info */}
      <Card style={{ marginBottom: "20px", backgroundColor: "#f8f9fa" }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography className={classes.fieldLabel}>Assessment Date</Typography>
              <Box className={classes.fieldValue}>
                {record.assessmentDate
                  ? moment(record.assessmentDate).format("DD MMMM YYYY")
                  : "Not recorded"}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography className={classes.fieldLabel}>Total Services Provided</Typography>
              <Box className={classes.fieldValue}>
                <Chip
                  label={`${providedServices.length} service${providedServices.length !== 1 ? 's' : ''}`}
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

      {providedServices.length === 0 ? (
        <Box className={classes.fieldValue}>
          <Typography variant="body2" color="textSecondary">
            No services recorded
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {providedServices.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card variant="outlined" style={{ height: "100%" }}>
                <CardContent>
                  <Box display="flex" alignItems="flex-start" gap={1}>
                    <CheckCircleIcon color="success" fontSize="small" />
                    <Box flex={1}>
                      <Typography variant="body2" style={{ fontWeight: 500 }}>
                        {service.label}
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

      {/* Clinical Notes */}
      {(record.clinicalNotes || encounterComment) && (
        <>
          <Divider style={{ margin: "24px 0" }} />
          <Typography className={classes.sectionTitle}>Additional Comments</Typography>
          <Box className={classes.fieldValue}>
            <Typography variant="body2">
              {record.clinicalNotes || encounterComment || "No comments"}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default PHDPViewDetails;
