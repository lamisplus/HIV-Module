import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AdherencePreparationForm from "./AdherencePreparationForm";
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
  const { patientObj, setActiveContent, activeContent, mode } = props;
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [editRecord, setEditRecord] = useState(null);

  // Check if we're coming from Recent History with a record ID to view/edit
  useEffect(() => {
    const recordId = activeContent?.id;
    const action = activeContent?.actionType;

    if (recordId && (action === "view" || action === "update")) {
      fetchRecordById(recordId);
    }
  }, [activeContent?.id, activeContent?.actionType]);

  const fetchRecordById = async (recordId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}adherence-preparation/${recordId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditRecord(response.data);
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className={classes.root}>
      <AdherencePreparationForm
        patientObj={patientObj}
        editData={editRecord}
        onSave={handleRecordSaved}
        setActiveContent={setActiveContent}
        activeContent={activeContent}
        mode={mode}
      />
    </div>
  );
}

export default AdherencePreparationIndex;
