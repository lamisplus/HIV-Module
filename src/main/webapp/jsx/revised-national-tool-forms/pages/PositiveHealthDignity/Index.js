import React, { useState } from "react";
import { Tabs, Tab, Box, Badge } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import HistoryIcon from "@mui/icons-material/History";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PHDPForm from "./PHDPForm";
import PHDPHistory from "./PHDPHistory";

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
      id={`phdp-tabpanel-${index}`}
      aria-labelledby={`phdp-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function PHDPIndex(props) {
  const { patientObj, setActiveContent, activeContent } = props;
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(0);
  const [phdpCount, setPhdpCount] = useState(0);
  const [refreshHistory, setRefreshHistory] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePHDPSaved = () => {
    // Switch to history tab after saving
    setActiveTab(1);
    // Trigger history refresh
    setRefreshHistory(!refreshHistory);
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
                <AddCircleIcon fontSize="small" />
                Create PHDP
              </Box>
            }
          />
          <Tab
            className={classes.tab}
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <HistoryIcon fontSize="small" />
                History
                {phdpCount > 0 && (
                  <Badge badgeContent={phdpCount} color="primary" />
                )}
              </Box>
            }
          />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <PHDPForm
          patientObj={patientObj}
          onSave={handlePHDPSaved}
          setActiveContent={setActiveContent}
          activeContent={activeContent}
        />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <PHDPHistory
          patientObj={patientObj}
          refreshTrigger={refreshHistory}
          onCountUpdate={setPhdpCount}
          onAddNew={() => setActiveTab(0)}
        />
      </TabPanel>
    </div>
  );
}

export default PHDPIndex;
