import React, { useState, useEffect } from "react";
import axios from "axios";
import * as moment from "moment";
import { Typography, Box, CircularProgress } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent } from "@material-ui/core";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { token, url as baseUrl } from "../../../../api";
import MatButton from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
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
}));

const AdherencePreparationHistory = (props) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, [props.patientObj, props.refreshTrigger]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}adherence-preparation/person/${props.patientObj.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { pageNo: 0, pageSize: 100 },
        }
      );
      const data = response.data || [];
      setRecords(data);
      // Update count in parent component
      if (props.onCountUpdate) {
        props.onCountUpdate(data.length);
      }
    } catch (error) {
      console.error("Error fetching adherence preparation records:", error);
      toast.error("Failed to load adherence preparation records");
      setRecords([]);
      if (props.onCountUpdate) {
        props.onCountUpdate(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleView = (record) => {
    if (props.setViewRecord) {
      props.setViewRecord(record);
    }
  };

  const handleEdit = (record) => {
    if (props.setEditRecord) {
      props.setEditRecord(record);
    }
  };

  const handleDelete = async (recordId) => {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }
    setDeleting(recordId);
    try {
      await axios.delete(`${baseUrl}adherence-preparation/${recordId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Record deleted successfully");
      fetchRecords();
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

  const handleAddNew = () => {
    if (props.onAddNew) {
      props.onAddNew();
    }
  };

  const getServicesCount = (record) => {
    const services = record?.adherenceServices?.services || [];
    return services.length;
  };

  const getServicesDisplay = (record) => {
    const services = record?.adherenceServices?.services || [];
    if (services.length === 0) return "No services";
    if (services.length === 1) return services[0].label || services[0].service;
    return `${services.length} services`;
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
            ART Adherence Preparation - History
          </Typography>
          <MatButton
            variant="contained"
            className={classes.button}
            startIcon={<AddIcon style={{ color: "#fff" }} />}
            style={{ backgroundColor: "#fff", color: "#014d88", margin: 0 }}
            onClick={handleAddNew}
          >
            <span style={{ textTransform: "capitalize" }}>Add New</span>
          </MatButton>
        </Box>

        {records.length === 0 ? (
          <Box className={classes.emptyState}>
            <Typography variant="h6" gutterBottom>
              No Adherence Preparation records found
            </Typography>
            <Typography variant="body2" gutterBottom>
              Start by adding the first adherence preparation record for this patient.
            </Typography>
            <MatButton
              variant="contained"
              className={classes.button}
              startIcon={<AddIcon style={{ color: "#fff" }} />}
              style={{ backgroundColor: "#014d88", color: "#fff", marginTop: "16px" }}
              onClick={handleAddNew}
            >
              <span style={{ textTransform: "capitalize" }}>
                Add First Adherence Preparation
              </span>
            </MatButton>
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0}>
            <Table className={classes.table} aria-label="adherence preparation history">
              <TableHead className={classes.tableHeader}>
                <TableRow>
                  <TableCell>S/N</TableCell>
                  <TableCell>Service Date</TableCell>
                  <TableCell>Services Provided</TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((record, index) => (
                  <TableRow key={record.id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {record.serviceDate
                        ? moment(record.serviceDate).format("DD/MM/YYYY")
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
                    <TableCell>
                      {record.createdDate
                        ? moment(record.createdDate).format("DD/MM/YYYY HH:mm")
                        : "N/A"}
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
                          onClick={() => handleDelete(record.id)}
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
    </Card>
  );
};

export default AdherencePreparationHistory;
