import React, { useState } from "react";
import { Tabs, Tab, Box, Badge } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import HistoryIcon from "@mui/icons-material/History";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import AdherencePreparationForm from "./AdherencePreparationForm";
import AdherencePreparationHistory from "./AdherencePreparationHistory";
import AdherencePreparationViewDetails from "./AdherencePreparationViewDetails";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tabsContainer: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: "#fff",
  },
  tab: {
    textTransform: "none",
    fontWeight: 600,
    fontSize: "14px",
    minWidth: 160,
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`adherence-prep-tabpanel-${index}`}
      aria-labelledby={`adherence-prep-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function AdherencePreparationIndex(props) {
  const { patientObj, setActiveContent, activeContent } = props;
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(0);
  const [recordCount, setRecordCount] = useState(0);
  const [refreshHistory, setRefreshHistory] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Clear edit/view records when switching tabs
    if (newValue === 0) {
      setEditRecord(null);
      setViewRecord(null);
    }
  };

  const handleRecordSaved = () => {
    // Switch to history tab after saving
    setActiveTab(0);
    // Clear edit record
    setEditRecord(null);
    // Trigger history refresh
    setRefreshHistory(!refreshHistory);
  };

  const handleAddNew = () => {
    setEditRecord(null);
    setActiveTab(1);
  };

  const handleEdit = (record) => {
    setEditRecord(record);
    setViewRecord(null);
    setActiveTab(1);
  };

  const handleView = (record) => {
    setViewRecord(record);
    setEditRecord(null);
    setActiveTab(2);
  };

  const handleBackToHistory = () => {
    setEditRecord(null);
    setViewRecord(null);
    setActiveTab(0);
  };

  return (
    <div className={classes.root}>
      <Box className={classes.tabsContainer}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab
            className={classes.tab}
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <HistoryIcon fontSize="small" />
                History
                {recordCount > 0 && (
                  <Badge badgeContent={recordCount} color="primary" />
                )}
              </Box>
            }
          />
          <Tab
            className={classes.tab}
            label={
              <Box display="flex" alignItems="center" gap={1}>
                {editRecord ? (
                  <>
                    <EditIcon fontSize="small" />
                    Edit Record
                  </>
                ) : (
                  <>
                    <AddCircleIcon fontSize="small" />
                    Create New
                  </>
                )}
              </Box>
            }
          />
          {viewRecord && (
            <Tab
              className={classes.tab}
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <VisibilityIcon fontSize="small" />
                  View Details
                </Box>
              }
            />
          )}
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <AdherencePreparationHistory
          patientObj={patientObj}
          refreshTrigger={refreshHistory}
          onCountUpdate={setRecordCount}
          setEditRecord={handleEdit}
          setViewRecord={handleView}
          onAddNew={handleAddNew}
        />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <AdherencePreparationForm
          patientObj={patientObj}
          editData={editRecord}
          onSave={handleRecordSaved}
          setActiveContent={setActiveContent}
          activeContent={activeContent}
        />
      </TabPanel>

      {viewRecord && (
        <TabPanel value={activeTab} index={2}>
          <AdherencePreparationViewDetails
            viewData={viewRecord}
            setEditRecord={handleEdit}
            onBack={handleBackToHistory}
          />
        </TabPanel>
      )}
    </div>
  );
}

export default AdherencePreparationIndex;
