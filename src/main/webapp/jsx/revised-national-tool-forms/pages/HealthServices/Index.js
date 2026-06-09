import React, { useState } from "react";
import { Tabs, Tab, Box, Badge } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import DescriptionIcon from "@mui/icons-material/Description";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HistoryIcon from "@mui/icons-material/History";
import AdherencePreparationForm from "../AdherencePreparation/AdherencePreparationForm";
import PHDPForm from "../PositiveHealthDignity/PHDPForm";
import CombinedHistory from "./CombinedHistory";

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
      id={`health-services-tabpanel-${index}`}
      aria-labelledby={`health-services-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function HealthServicesIndex(props) {
  const { patientObj, setActiveContent, activeContent } = props;
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(0);
  const [adherenceCount, setAdherenceCount] = useState(0);
  const [phdpCount, setPhdpCount] = useState(0);
  const [refreshHistory, setRefreshHistory] = useState(false);
  const [editAdherenceData, setEditAdherenceData] = useState(null);
  const [editPHDPData, setEditPHDPData] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Clear edit data when manually switching tabs
    if (newValue === 0) {
      setEditAdherenceData(null);
    } else if (newValue === 1) {
      setEditPHDPData(null);
    }
  };

  const handleAdherenceSaved = () => {
    // Clear edit data
    setEditAdherenceData(null);
    // Switch to history tab after saving
    setActiveTab(2);
    // Trigger history refresh
    setRefreshHistory(!refreshHistory);
  };

  const handlePHDPSaved = () => {
    // Clear edit data
    setEditPHDPData(null);
    // Switch to history tab after saving
    setActiveTab(2);
    // Trigger history refresh
    setRefreshHistory(!refreshHistory);
  };

  const handleEditAdherence = (record) => {
    setEditAdherenceData(record);
    setActiveTab(0);
  };

  const handleEditPHDP = (record) => {
    setEditPHDPData(record);
    setActiveTab(1);
  };

  const totalRecords = adherenceCount + phdpCount;

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
                <DescriptionIcon fontSize="small" />
                Adherence Preparation
                {adherenceCount > 0 && (
                  <Badge
                    badgeContent={adherenceCount}
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
            }
          />
          <Tab
            className={classes.tab}
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <FavoriteIcon fontSize="small" />
                Positive Health Dignity
                {phdpCount > 0 && (
                  <Badge
                    badgeContent={phdpCount}
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
            }
          />
          <Tab
            className={classes.tab}
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <HistoryIcon fontSize="small" />
                History
                {totalRecords > 0 && (
                  <Badge
                    badgeContent={totalRecords}
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
            }
          />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <AdherencePreparationForm
          patientObj={patientObj}
          editData={editAdherenceData}
          onSave={handleAdherenceSaved}
          setActiveContent={setActiveContent}
          activeContent={activeContent}
        />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <PHDPForm
          patientObj={patientObj}
          editData={editPHDPData}
          onSave={handlePHDPSaved}
          setActiveContent={setActiveContent}
          activeContent={activeContent}
        />
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <CombinedHistory
          patientObj={patientObj}
          refreshTrigger={refreshHistory}
          onAdherenceCountUpdate={setAdherenceCount}
          onPHDPCountUpdate={setPhdpCount}
          onEditAdherence={handleEditAdherence}
          onEditPHDP={handleEditPHDP}
        />
      </TabPanel>
    </div>
  );
}

export default HealthServicesIndex;
