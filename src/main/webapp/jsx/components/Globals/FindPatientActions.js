import React, { memo, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { ButtonGroup, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@material-ui/core";
import { MdDashboard } from "react-icons/md";
import { TiArrowForward } from "react-icons/ti";
import { FaUserPlus, FaExchangeAlt } from "react-icons/fa";
import { usePermissions } from "../../../hooks/usePermissions";
import TransferInForm from "../../revised-national-tool-forms/pages/TransferIn/Index";

const FindPatientActions = memo(({ row }) => {
  const { hasiceform, hasenrollmentform } = row;
  const { hasPermission } = usePermissions();
  const history = useHistory();
  const canEnroll = hasPermission("hiv_enrollment_register");

  const [showEnrollmentTypeModal, setShowEnrollmentTypeModal] = useState(false);
  const [showTransferFormModal, setShowTransferFormModal] = useState(false);

  if (!canEnroll) return null;

  // 2. Logic: Determine patient enrollment status
  const isFullyEnrolled = hasiceform && hasenrollmentform; // Both ICE and Enrollment done
  const hasCompletedICE = hasiceform && !hasenrollmentform; // ICE done, Enrollment pending

  const handleEnrollClick = (e) => {
    if (e) e.preventDefault();
    // If ICE is already done, skip the transfer-in question and go directly to enrollment
    if (hasCompletedICE) {
      handleDirectEnrollment();
    } else {
      setShowEnrollmentTypeModal(true);
    }
  };

  const handleDirectEnrollment = () => {
    // Patient has already completed ICE, go directly to Enrollment & Commencement form
    history.push({
      pathname: "/patient-history",
      state: {
        patientObj: row,
        enrollmentFlow: true,
        skipICE: true  // Flag to skip ICE and go directly to enrollment
      },
    });
  };

  const handleTransferIn = () => {
    setShowEnrollmentTypeModal(false);
    localStorage.setItem("currentStatus", "ART TRANSFER IN");
    // Store patient ID to track which patient this enrollment session is for
    localStorage.setItem("enrollingPatientId", row.id);
    localStorage.setItem("isTransferInEnrollment", "true");
    setShowTransferFormModal(true);
  };

  const handleNewEnrollment = () => {
    setShowEnrollmentTypeModal(false);
    history.push({
      pathname: "/patient-history",
      state: { patientObj: row, enrollmentFlow: true },
    });
  };

  const handleTransferFormClose = () => {
    setShowTransferFormModal(false);
    localStorage.removeItem("currentStatus");
    localStorage.removeItem("enrollingPatientId");
    localStorage.removeItem("isTransferInEnrollment");
  };

  const handleTransferFormSuccess = () => {
    setShowTransferFormModal(false);
    localStorage.removeItem("currentStatus");
    // Keep enrollingPatientId and isTransferInEnrollment in localStorage
    // They will be used by ICE form and cleared after ICE submission
    history.push({
      pathname: "/patient-history",
      state: { patientObj: row, enrollmentFlow: true, fromTransferIn: true },
    });
  };

  const mockActiveContent = { route: "transfer-form", id: "", activeTab: "home", actionType: "create", obj: {} };
  const mockSetActiveContent = (content) => {
    if (content.route === "recent-history") handleTransferFormSuccess();
  };

  // 3. Render Dashboard Link if fully enrolled
  if (isFullyEnrolled) {
    return (
        <Link to={{ pathname: "/patient-history", state: { patientObj: row } }}>
          <ButtonGroup
              variant="contained"
              style={{ backgroundColor: "rgb(153, 46, 98)", height: "30px", width: "215px" }}
              size="large"
          >
            <Button style={{ backgroundColor: "rgb(153, 46, 98)" }}><MdDashboard /></Button>
            <Button style={{ backgroundColor: "rgb(153, 46, 98)" }}>
            <span style={{ fontSize: "12px", color: "#fff", fontWeight: "bolder" }}>
              Patient Dashboard
            </span>
            </Button>
          </ButtonGroup>
        </Link>
    );
  }

  return (
      <>
        <ButtonGroup
            variant="contained"
            onClick={handleEnrollClick}
            style={{
              backgroundColor: hasCompletedICE ? "#28a745" : "rgb(153, 46, 98)",
              height: "30px",
              width: "215px",
              cursor: "pointer"
            }}
            size="large"
        >
          <Button style={{ backgroundColor: hasCompletedICE ? "#28a745" : "rgb(153, 46, 98)" }}>
            <TiArrowForward />
          </Button>
          <Button style={{ backgroundColor: hasCompletedICE ? "#28a745" : "rgb(153, 46, 98)" }}>
          <span style={{ fontSize: "10px", color: "#fff", fontWeight: "bolder" }}>
            {hasCompletedICE ? "Complete Enrollment" : "Enroll Patient"}
          </span>
          </Button>
        </ButtonGroup>

        {/* Enrollment Type Modal */}
        <Dialog open={showEnrollmentTypeModal} onClose={() => setShowEnrollmentTypeModal(false)} maxWidth="sm" fullWidth>
          <DialogTitle style={{ backgroundColor: "#014d88", color: "#fff" }}>
            <FaUserPlus style={{ marginRight: "10px" }} /> Patient Enrollment Type
          </DialogTitle>
          <DialogContent>
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <h5>Is this a Transfer-In patient?</h5>
            </div>
            <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
              <Button onClick={handleTransferIn} variant="contained" style={{ backgroundColor: "#014d88", color: "white" }}>
                <FaExchangeAlt style={{ marginRight: "8px" }} /> Yes, Transfer-In
              </Button>
              <Button onClick={handleNewEnrollment} variant="contained" style={{ backgroundColor: "#992E62", color: "white" }}>
                <FaUserPlus style={{ marginRight: "8px" }} /> No, New Enrollment
              </Button>
            </div>
          </DialogContent>
          <DialogActions><Button onClick={() => setShowEnrollmentTypeModal(false)}>Cancel</Button></DialogActions>
        </Dialog>

        {/* Transfer Form Modal */}
        <Dialog open={showTransferFormModal} onClose={handleTransferFormClose} maxWidth="lg" fullWidth>
          <DialogTitle style={{ backgroundColor: "#014d88", color: "#fff" }}>
            <FaExchangeAlt style={{ marginRight: "10px" }} /> Client Transfer-In Acknowledge Form
          </DialogTitle>
          <DialogContent>
            <TransferInForm patientObj={row} activeContent={mockActiveContent} setActiveContent={mockSetActiveContent} onClose={handleTransferFormClose} />
          </DialogContent>
        </Dialog>
      </>
  );
});

export default FindPatientActions;
