import React, { useState, useEffect } from "react";
import axios from "axios";
import * as moment from "moment";
import { Typography, Box, CircularProgress, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent } from "@material-ui/core";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { token, url as baseUrl } from "../../../../api";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import AdherencePreparationViewDetails from "../AdherencePreparation/AdherencePreparationViewDetails";
import PHDPViewDetails from "../PositiveHealthDignity/PHDPViewDetails";

const useStyles = makeStyles((theme) => ({
  root: {
    "& label": { fontSize: "14px", color: "#014d88", fontWeight: "bold" },
  },
  table: {
    minWidth: 650,
  },
  tableHeader: {
    backgroundColor: "#014d88",
    "& th": {
      color: "#fff",
      fontWeight: "bold",
      fontSize: "14px",
    },
  },
  button: {
    margin: theme.spacing(1),
  },
  emptyState: {
    textAlign: "center",
    padding: theme.spacing(4),
    color: "#666",
  },
  chipAdherence: {
    backgroundColor: "#e3f2fd",
    color: "#1976d2",
    fontWeight: 600,
    fontSize: "11px",
  },
  chipPHDP: {
    backgroundColor: "#fce4ec",
    color: "#c2185b",
    fontWeight: 600,
    fontSize: "11px",
  },
}));

const CombinedHistory = (props) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [combinedRecords, setCombinedRecords] = useState([]);
  const [deleting, setDeleting] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState(null);

  useEffect(() => {
    fetchAllRecords();
  }, [props.patientObj, props.refreshTrigger]);

  const fetchAllRecords = async () => {
    setLoading(true);
    try {
      // Fetch both adherence and PHDP records in parallel
      const [adherenceResponse, phdpResponse] = await Promise.all([
        axios.get(
          `${baseUrl}adherence-preparation/person/${props.patientObj.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { pageNo: 0, pageSize: 100 },
          }
        ),
        axios.get(
          `${baseUrl}positive-health-dignity-prevention/person/${props.patientObj.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { pageNo: 0, pageSize: 100 },
          }
        ),
      ]);

      // Handle different response formats (array or paginated)
      const adherenceRecords = Array.isArray(adherenceResponse.data)
        ? adherenceResponse.data
        : adherenceResponse.data?.content || [];

      const phdpRecords = Array.isArray(phdpResponse.data)
        ? phdpResponse.data
        : phdpResponse.data?.content || [];

      const adherenceData = adherenceRecords.map((record) => ({
        ...record,
        type: "adherence",
        typeName: "Adherence Preparation",
      }));

      const phdpData = phdpRecords.map((record) => ({
        ...record,
        type: "phdp",
        typeName: "Positive Health Dignity",
      }));

      // Combine and sort by date (most recent first)
      const combined = [...adherenceData, ...phdpData].sort((a, b) => {
        const dateA = new Date(a.serviceDate || a.assessmentDate || a.createdDate);
        const dateB = new Date(b.serviceDate || b.assessmentDate || b.createdDate);
        return dateB - dateA;
      });

      setCombinedRecords(combined);

      // Update counts in parent component
      if (props.onAdherenceCountUpdate) {
        props.onAdherenceCountUpdate(adherenceData.length);
      }
      if (props.onPHDPCountUpdate) {
        props.onPHDPCountUpdate(phdpData.length);
      }
    } catch (error) {
      console.error("Error fetching records:", error);
      toast.error("Failed to load records");
      setCombinedRecords([]);
      if (props.onAdherenceCountUpdate) props.onAdherenceCountUpdate(0);
      if (props.onPHDPCountUpdate) props.onPHDPCountUpdate(0);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (record) => {
    setViewRecord(record);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setViewRecord(null);
  };

  const handleEdit = (record) => {
    if (record.type === "adherence" && props.onEditAdherence) {
      props.onEditAdherence(record);
    } else if (record.type === "phdp" && props.onEditPHDP) {
      props.onEditPHDP(record);
    }
  };

  const handleDelete = async (record) => {
    if (!window.confirm(`Are you sure you want to delete this ${record.typeName} record?`)) {
      return;
    }

    setDeleting(record.id);
    try {
      const endpoint = record.type === "adherence"
        ? `${baseUrl}adherence-preparation/${record.id}`
        : `${baseUrl}positive-health-dignity-prevention/${record.id}`;

      await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Record deleted successfully");
      fetchAllRecords();
    } catch (error) {
      console.error("Error deleting record:", error);
      const msg =
        error?.response?.data?.apierror?.message ||
        "Failed to delete record. Please try again.";
      toast.error(msg);
    } finally {
      setDeleting(null);
    }
  };

  const getServicesCount = (record) => {
    if (record.type === "adherence") {
      const services = record?.adherenceServices?.services || [];
      return services.length;
    } else {
      // PHDP record - count services that have dates (were provided)
      const services = record?.phdpServices?.services || [];
      return services.filter(s => s.dates && s.dates.length > 0).length;
    }
  };

  const getServicesDisplay = (record) => {
    if (record.type === "adherence") {
      const services = record?.adherenceServices?.services || [];
      if (services.length === 0) return "No services";
      if (services.length === 1) return services[0].label || services[0].service;
      return `${services.length} services`;
    } else {
      // PHDP record
      const services = record?.phdpServices?.services || [];
      const providedServices = services.filter(s => s.dates && s.dates.length > 0);
      if (providedServices.length === 0) return "No services";
      if (providedServices.length === 1) return providedServices[0].label || providedServices[0].service;
      return `${providedServices.length} services`;
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
            Health Services History
          </Typography>
        </Box>

        {combinedRecords.length === 0 ? (
          <Box className={classes.emptyState}>
            <Typography variant="h6" gutterBottom>
              No records found
            </Typography>
            <Typography variant="body2" gutterBottom>
              No Adherence Preparation or Positive Health Dignity records have been created for this patient yet.
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0}>
            <Table className={classes.table} aria-label="combined history">
              <TableHead className={classes.tableHeader}>
                <TableRow>
                  <TableCell>S/N</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Service Date</TableCell>
                  <TableCell>Details</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {combinedRecords.map((record, index) => (
                  <TableRow key={`${record.type}-${record.id}`} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Chip
                        label={record.typeName}
                        size="small"
                        className={
                          record.type === "adherence"
                            ? classes.chipAdherence
                            : classes.chipPHDP
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {(record.serviceDate || record.assessmentDate)
                        ? moment(record.serviceDate || record.assessmentDate).format("DD/MM/YYYY")
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {getServicesDisplay(record)}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        ({getServicesCount(record)} service
                        {getServicesCount(record) !== 1 ? "s" : ""})
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleView(record)}
                          style={{ marginRight: "8px" }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          color="default"
                          size="small"
                          onClick={() => handleEdit(record)}
                          style={{ marginRight: "8px" }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          style={{ color: "#992E62" }}
                          size="small"
                          onClick={() => handleDelete(record)}
                          disabled={deleting === record.id}
                        >
                          {deleting === record.id ? (
                            <CircularProgress size={20} style={{ color: "#992E62" }} />
                          ) : (
                            <DeleteIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>

      {/* View Details Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {viewRecord?.type === "adherence"
            ? "Adherence Preparation Details"
            : "Positive Health Dignity Details"}
        </DialogTitle>
        <DialogContent>
          {viewRecord && viewRecord.type === "adherence" && (
            <AdherencePreparationViewDetails viewData={viewRecord} />
          )}
          {viewRecord && viewRecord.type === "phdp" && (
            <PHDPViewDetails record={viewRecord} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog} style={{ backgroundColor: "#014d88", color: "#fff" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default CombinedHistory;
