import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import * as moment from "moment";
import { toast } from "react-toastify";
import { token, url as baseUrl } from "../../../../api";
import PHDPViewDetails from "./PHDPViewDetails";
import PHDPForm from "./PHDPForm";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  emptyState: {
    textAlign: "center",
    padding: theme.spacing(6),
    color: "#666",
  },
  tableHeader: {
    backgroundColor: "#014d88",
    "& th": {
      color: "#fff",
      fontWeight: 600,
    },
  },
  actionButton: {
    marginRight: theme.spacing(1),
  },
  addButton: {
    marginBottom: theme.spacing(2),
  },
}));

const PHDPHistory = ({ patientObj, refreshTrigger, onCountUpdate, onAddNew }) => {
  const classes = useStyles();
  const [phdpRecords, setPhdpRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchPHDPRecords();
  }, [patientObj.id, refreshTrigger]);

  const fetchPHDPRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}positive-health-dignity-prevention/person/${patientObj.id}?pageNo=0&pageSize=100`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Handle different response formats
      const records = Array.isArray(response.data)
        ? response.data
        : response.data?.content || [];

      setPhdpRecords(records);
      if (onCountUpdate) {
        onCountUpdate(records.length);
      }
    } catch (error) {
      console.error("Error fetching PHDP records:", error);
      toast.error("Failed to load PHDP records");
      setPhdpRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setViewDialogOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setEditDialogOpen(true);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(
        `${baseUrl}positive-health-dignity-prevention/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("PHDP record deleted successfully");
      fetchPHDPRecords();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting PHDP record:", error);
      toast.error("Failed to delete PHDP record");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedRecord(null);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedRecord(null);
  };

  const handleSaveEdit = () => {
    setEditDialogOpen(false);
    setSelectedRecord(null);
    fetchPHDPRecords();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (phdpRecords.length === 0) {
    return (
      <Card>
        <CardContent className={classes.emptyState}>
          <Typography variant="h6" gutterBottom>
            No PHDP Records Found
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            This patient has no Positive Health, Dignity & Prevention assessments yet.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            onClick={onAddNew}
            style={{ backgroundColor: "#014d88" }}
          >
            Add First PHDP Assessment
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={classes.root}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddCircleIcon />}
        onClick={onAddNew}
        className={classes.addButton}
        style={{ backgroundColor: "#014d88" }}
      >
        Add New PHDP Assessment
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell>Assessment Date</TableCell>
              <TableCell>Services Provided</TableCell>
              <TableCell>Comments</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {phdpRecords.map((record) => {
              // Count services that have dates (were provided)
              const services = record.phdpServices?.services || [];
              const servicesCount = services.filter(s => s.dates && s.dates.length > 0).length;

              return (
                <TableRow key={record.id} hover>
                  <TableCell>
                    {record.assessmentDate
                      ? moment(record.assessmentDate).format("DD MMM YYYY")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${servicesCount} service${servicesCount !== 1 ? "s" : ""}`}
                      size="small"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    {record.clinicalNotes ? (
                      <Typography variant="body2" sx={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {record.clinicalNotes}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="textSecondary">No comments</Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleView(record)}
                        color="primary"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(record)}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedRecord(record);
                          setDeleteDialogOpen(true);
                        }}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>PHDP Assessment Details</DialogTitle>
        <DialogContent>
          {selectedRecord && <PHDPViewDetails record={selectedRecord} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Edit PHDP Assessment</DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <PHDPForm
              patientObj={patientObj}
              editData={selectedRecord}
              onSave={handleSaveEdit}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Alert severity="warning">
            Are you sure you want to delete this PHDP assessment from{" "}
            {selectedRecord?.assessmentDate
              ? moment(selectedRecord.assessmentDate).format("DD MMMM YYYY")
              : ""}
            ? This action cannot be undone.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => handleDelete(selectedRecord.id)}
            color="error"
            variant="contained"
            disabled={deletingId !== null}
          >
            {deletingId ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PHDPHistory;
