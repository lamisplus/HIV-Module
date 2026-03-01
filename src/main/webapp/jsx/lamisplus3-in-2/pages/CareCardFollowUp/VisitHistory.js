import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Button,
  Divider,
  Chip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import * as moment from "moment";
import { toast } from "react-toastify";
import { token, url as baseUrl } from "../../../../api";
import CareCardVisitDetails from "./VisitDetails";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "20px",
  },
  accordion: {
    marginBottom: "8px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px !important",
    "&:before": {
      display: "none",
    },
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    "&:hover": {
      boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
    },
  },
  accordionSummary: {
    backgroundColor: "#fafafa",
    borderRadius: "8px",
    minHeight: "56px",
    "&.Mui-expanded": {
      borderBottomLeftRadius: "0",
      borderBottomRightRadius: "0",
      backgroundColor: "#f5f5f5",
    },
  },
  visitDate: {
    fontSize: "15px",
    fontWeight: 700,
    color: "#014d88",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  vitalsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
    padding: "16px",
    backgroundColor: "#fff",
  },
  vitalItem: {
    textAlign: "center",
  },
  vitalLabel: {
    fontSize: "11px",
    fontWeight: 600,
    color: "#666",
    textTransform: "uppercase",
    marginBottom: "4px",
  },
  vitalValue: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#014d88",
  },
  noVisitsMessage: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#666",
  },
  actionButtons: {
    display: "flex",
    gap: "8px",
    padding: "12px 16px",
    backgroundColor: "#f9f9f9",
    borderTop: "1px solid #e0e0e0",
  },
}));

const CareCardVisitHistory = (props) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [viewMode, setViewMode] = useState(null); // null = no selection, "view" = view mode, "edit" = edit mode
  const [pageNo, setPageNo] = useState(0);
  const [pageSize] = useState(10);

  useEffect(() => {
    fetchVisits();
  }, []);

  // Refresh visits when component becomes visible (useful after edit)
  useEffect(() => {
    // This will refetch when the component remounts or props change
    fetchVisits();
  }, [props.onEditVisit]);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}hiv/art/clinic-visit/person?pageNo=${pageNo}&pageSize=${pageSize}&personId=${props.patientObj.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVisits(response.data || []);
    } catch (error) {
      console.error("Error fetching visit history:", error);
      toast.error("Failed to load visit history");
    } finally {
      setLoading(false);
    }
  };

  const handleViewVisit = (visit) => {
    setSelectedVisit(visit);
    setViewMode("view");
  };

  const handleEditVisit = (visit) => {
    // Call parent component's edit handler to switch tabs
    if (props.onEditVisit) {
      props.onEditVisit(visit);
    }
  };

  const handleEdit = () => {
    setViewMode("edit");
  };

  const handleCancelEdit = () => {
    setViewMode("view");
  };

  const handleSaveEdit = async () => {
    setViewMode("view");
    await fetchVisits(); // Refresh list after save
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress style={{ color: "#014d88" }} />
      </Box>
    );
  }

  if (visits.length === 0) {
    return (
      <Box className={classes.noVisitsMessage}>
        <Typography variant="h6" style={{ color: "#666", marginBottom: "12px" }}>
          No Visit History Found
        </Typography>
        <Typography variant="body2">
          This patient has no recorded Care Card follow-up visits yet.
        </Typography>
      </Box>
    );
  }

  return (
    <div className={classes.container}>
      <Grid container spacing={3}>
        {/* Left Column: Accordion Visit List */}
        <Grid item xs={12} md={5}>
          <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
            <Typography variant="h6" style={{ color: "#014d88", fontWeight: 700 }}>
              Visit History
            </Typography>
            <Chip
              label={`${visits.length} visit${visits.length !== 1 ? 's' : ''}`}
              size="small"
              style={{
                backgroundColor: "#014d88",
                color: "#fff",
                fontWeight: 600,
              }}
            />
          </Box>

          {visits.map((visit, index) => (
            <Accordion key={visit.id} className={classes.accordion}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon style={{ color: "#014d88" }} />}
                className={classes.accordionSummary}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                  <Box className={classes.visitDate}>
                    <CalendarTodayIcon style={{ fontSize: "18px" }} />
                    {moment(visit.visitDate).format("DD MMM YYYY")}
                  </Box>
                  <Chip
                    label={visit.artStatus || "Active"}
                    size="small"
                    style={{
                      backgroundColor: "#e3f2fd",
                      color: "#014d88",
                      fontWeight: 600,
                      fontSize: "11px",
                      marginRight: "8px",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails style={{ padding: 0, display: "block" }}>
                {/* Vitals Grid */}
                <Box className={classes.vitalsGrid}>
                  <Box className={classes.vitalItem}>
                    <Typography className={classes.vitalLabel}>Weight</Typography>
                    <Typography className={classes.vitalValue}>
                      {visit.vitalSignDto?.bodyWeight || "—"}
                      <span style={{ fontSize: "12px", fontWeight: 500 }}> kg</span>
                    </Typography>
                  </Box>
                  <Box className={classes.vitalItem}>
                    <Typography className={classes.vitalLabel}>Height</Typography>
                    <Typography className={classes.vitalValue}>
                      {visit.vitalSignDto?.height || "—"}
                      <span style={{ fontSize: "12px", fontWeight: 500 }}> cm</span>
                    </Typography>
                  </Box>
                  <Box className={classes.vitalItem}>
                    <Typography className={classes.vitalLabel}>BP</Typography>
                    <Typography className={classes.vitalValue}>
                      {visit.vitalSignDto?.systolic && visit.vitalSignDto?.diastolic
                        ? `${visit.vitalSignDto.systolic}/${visit.vitalSignDto.diastolic}`
                        : "—"}
                    </Typography>
                  </Box>
                  <Box className={classes.vitalItem}>
                    <Typography className={classes.vitalLabel}>Next Appt</Typography>
                    <Typography className={classes.vitalValue} style={{ fontSize: "13px" }}>
                      {visit.nextAppointment ? moment(visit.nextAppointment).format("DD MMM YY") : "—"}
                    </Typography>
                  </Box>
                </Box>

                {/* Action Buttons */}
                <Box className={classes.actionButtons}>
                  <Button
                    fullWidth
                    size="medium"
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleViewVisit(visit)}
                    style={{
                      borderColor: "#014d88",
                      color: "#014d88",
                      textTransform: "none",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    View Details
                  </Button>
                  <Button
                    fullWidth
                    size="medium"
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditVisit(visit)}
                    style={{
                      backgroundColor: "#014d88",
                      color: "#fff",
                      textTransform: "none",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    Edit Visit
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>

        {/* Right Column: Selected Visit Details */}
        <Grid item xs={12} md={7}>
          {!selectedVisit || !viewMode ? (
            <Card style={{ border: "1px solid #e0e0e0", borderRadius: "8px" }}>
              <CardHeader
                style={{ backgroundColor: "#f5f5f5", borderBottom: "1px solid #e0e0e0" }}
                title={
                  <Typography style={{ fontSize: "16px", fontWeight: 700, color: "#014d88" }}>
                    Visit Details Preview
                  </Typography>
                }
              />
              <CardContent style={{ padding: "24px", minHeight: "500px" }}>
                {visits.length > 0 ? (
                  <Box>
                    <Typography variant="body2" style={{ color: "#666", textAlign: "center", marginTop: "100px" }}>
                      Click "View" on any visit card to see full details here
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" style={{ color: "#666", textAlign: "center" }}>
                    No visits available
                  </Typography>
                )}
              </CardContent>
            </Card>
          ) : (
            <CareCardVisitDetails
              visit={selectedVisit}
              mode={viewMode}
              onEdit={handleEdit}
              onCancelEdit={handleCancelEdit}
              onSave={handleSaveEdit}
              patientObj={props.patientObj}
              showBackButton={false}
            />
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default CareCardVisitHistory;
