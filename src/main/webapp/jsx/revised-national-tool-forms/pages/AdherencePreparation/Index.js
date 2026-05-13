import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AdherencePreparationForm from "./AdherencePreparationForm";
import AdherencePreparationViewDetails from "./AdherencePreparationViewDetails";
import axios from "axios";
import { token, url as baseUrl } from "../../../../api";
import { toast } from "react-toastify";
import { CircularProgress, Box } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

function AdherencePreparationIndex(props) {
  const { patientObj, setActiveContent, activeContent } = props;
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);
  const [mode, setMode] = useState("create"); // 'create', 'edit', 'view'

  // Check if we're coming from Recent History with a record ID to view/edit
  useEffect(() => {
    const recordId = activeContent?.id;
    const action = activeContent?.actionType;

    if (recordId && (action === "view" || action === "update")) {
      fetchRecordById(recordId, action);
    }
  }, [activeContent?.id, activeContent?.actionType]);

  const fetchRecordById = async (recordId, action) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}adherence-preparation/${recordId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const record = response.data;

      if (action === "view") {
        setViewRecord(record);
        setEditRecord(null);
        setMode("view");
      } else if (action === "update") {
        setEditRecord(record);
        setViewRecord(null);
        setMode("edit");
      }
    } catch (error) {
      console.error("Error fetching adherence preparation record:", error);
      toast.error("Failed to load record");
    } finally {
      setLoading(false);
    }
  };

  const handleRecordSaved = () => {
    // Clear edit record and go back to recent history
    setEditRecord(null);
    setMode("create");

    // Navigate back to recent history
    if (setActiveContent && activeContent) {
      setActiveContent({
        ...activeContent,
        route: "recent-history",
        refreshPatient: true,
        refreshTimestamp: Date.now(),
      });
    }
  };

  const handleEdit = (record) => {
    setEditRecord(record);
    setViewRecord(null);
    setMode("edit");
  };

  const handleBackToHistory = () => {
    // Navigate back to recent history
    if (setActiveContent && activeContent) {
      setActiveContent({
        ...activeContent,
        route: "recent-history",
      });
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
    <div className={classes.root}>
      {mode === "view" && viewRecord ? (
        <AdherencePreparationViewDetails
          viewData={viewRecord}
          setEditRecord={handleEdit}
          onBack={handleBackToHistory}
        />
      ) : (
        <AdherencePreparationForm
          patientObj={patientObj}
          editData={editRecord}
          onSave={handleRecordSaved}
          setActiveContent={setActiveContent}
          activeContent={activeContent}
        />
      )}
    </div>
  );
}

export default AdherencePreparationIndex;
