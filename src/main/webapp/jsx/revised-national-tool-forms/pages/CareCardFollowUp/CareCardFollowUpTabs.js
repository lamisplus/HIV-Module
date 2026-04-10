import React, { useState, useEffect } from "react";
import { Tabs, Tab, Box, Chip } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import CareCardFollowUpForm from "./Index";
import CareCardVisitHistory from "./VisitHistory";
import * as moment from "moment";
import axios from "axios";
import { token, url as baseUrl } from "../../../../api";

const useStyles = makeStyles((theme) => ({
  tabsContainer: {
    borderBottom: "2px solid #014d88",
    marginBottom: "20px",
  },
  tab: {
    textTransform: "none",
    fontWeight: 600,
    fontSize: "14px",
    color: "#666",
    "&.Mui-selected": {
      color: "#014d88",
    },
  },
  indicator: {
    backgroundColor: "#014d88",
    height: "3px",
  },
}));

const CareCardFollowUpTabs = (props) => {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(0);
  const [editingVisit, setEditingVisit] = useState(null);
  const [visitFromHistory, setVisitFromHistory] = useState(null);

  // Handle incoming visit from Patient History
  useEffect(() => {
    const fetchVisitFromHistory = async () => {
      if (props.activeContent?.id && props.activeContent?.activeTab === "history") {
        try {
          const response = await axios.get(
            `${baseUrl}hiv/art/clinic-visit/${props.activeContent.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const visit = response.data;

          if (props.activeContent.actionType === "view") {
            setVisitFromHistory(visit);
            setActiveTab(1); // Switch to Visit History tab
          } else if (props.activeContent.actionType === "update") {
            setEditingVisit(visit);
            setActiveTab(0); // Switch to Form tab for editing
          }
        } catch (error) {
          console.error("Error fetching visit from history:", error);
        }
      }
    };

    fetchVisitFromHistory();
  }, [props.activeContent?.id, props.activeContent?.actionType]);

  const handleTabChange = (event, newValue) => {
    // If switching away from the form tab and there's an editing visit, clear it
    if (newValue !== 0 && editingVisit) {
      setEditingVisit(null);
    }
    // Clear visitFromHistory when manually switching tabs
    if (visitFromHistory) {
      setVisitFromHistory(null);
    }
    setActiveTab(newValue);
  };

  // Called from VisitHistory when user clicks Edit
  const handleEditVisit = (visit) => {
    setEditingVisit(visit);
    setActiveTab(0); // Switch to "New Visit" tab
  };

  // Called when form successfully saves or user cancels edit
  const handleEditComplete = () => {
    setEditingVisit(null);
    setActiveTab(1); // Return to "Visit History" tab
  };

  // Determine tab label based on edit mode
  const getNewVisitLabel = () => {
    if (editingVisit) {
      return (
        <Box display="flex" alignItems="center" gap={1}>
          <span>Edit Visit</span>
          <Chip
            label={moment(editingVisit.visitDate).format("DD MMM YYYY")}
            size="small"
            style={{
              backgroundColor: "#fff3cd",
              color: "#856404",
              fontWeight: 600,
              fontSize: "10px"
            }}
          />
        </Box>
      );
    }
    return "New Visit";
  };

  return (
    <div>
      <Box className={classes.tabsContainer}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          classes={{ indicator: classes.indicator }}
        >
          <Tab label={getNewVisitLabel()} className={classes.tab} />
          <Tab label="Visit History" className={classes.tab} />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <CareCardFollowUpForm
          {...props}
          editingVisit={editingVisit}
          onEditComplete={handleEditComplete}
        />
      )}
      {activeTab === 1 && (
        <CareCardVisitHistory
          {...props}
          onEditVisit={handleEditVisit}
          visitFromHistory={visitFromHistory}
        />
      )}
    </div>
  );
};

export default CareCardFollowUpTabs;
