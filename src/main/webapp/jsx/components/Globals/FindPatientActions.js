import React, { memo, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { ButtonGroup, Button } from "@material-ui/core";
import { MdDashboard } from "react-icons/md";
import { TiArrowForward } from "react-icons/ti";
import { FaUserPlus, FaExchangeAlt } from "react-icons/fa";
import { usePermissions } from "../../../hooks/usePermissions";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@material-ui/core";
import TransferForm from "../TransferForm/Index";
import TransferInForm from "../../revised-national-tool-forms/pages/TransferIn/Index";
import axios from "axios";
import { token as authToken, url as baseUrl } from "../../../api";

const FindPatientActions = memo(({ row }) => {
  const { hasPermission } = usePermissions();
  const canEnroll = hasPermission("hiv_enrollment_register");
  const history = useHistory();

  const [showEnrollmentTypeModal, setShowEnrollmentTypeModal] = useState(false);
  const [showTransferFormModal, setShowTransferFormModal] = useState(false);
  const [isICEDone, setIsICEDone] = useState(null);
  const [isEnrollmentDone, setIsEnrollmentDone] = useState(null);
  const [isCheckingForms, setIsCheckingForms] = useState(true);

  // console.log("FindPatientActions - canEnroll:", canEnroll, "row:", row, "isICEDone:", isICEDone, "isEnrollmentDone:", isEnrollmentDone, "showEnrollmentTypeModal:", showEnrollmentTypeModal);

  // Check if ICE and Enrollment forms have been filled
  useEffect(() => {
    const checkForms = async () => {
      if (!row?.id) return;

      setIsCheckingForms(true);
      try {
        // Check ICE form
        const iceResponse = await axios.get(
          `${baseUrl}hiv/observation/initial-clinical-evaluation/exists/person/${row.id}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        setIsICEDone(iceResponse.data === true);

        // Check Enrollment form
        try {
          await axios.get(
            `${baseUrl}hiv/enrollment-commencement/person/${row.id}`,
            { headers: { Authorization: `Bearer ${authToken}` } }
          );
          setIsEnrollmentDone(true);
        } catch (enrollError) {
          if (enrollError.response?.status === 404) {
            setIsEnrollmentDone(false);
          } else {
            setIsEnrollmentDone(false);
          }
        }
      } catch (error) {
        console.error("Error checking forms:", error);
        setIsICEDone(false);
        setIsEnrollmentDone(false);
      } finally {
        setIsCheckingForms(false);
      }
    };

    checkForms();
  }, [row?.id]);

  if (!canEnroll) return null;

  // Show Patient Dashboard if both ICE and Enrollment are done
  if (isICEDone === true && isEnrollmentDone === true) {
    return (
      <Link to={{ pathname: "/patient-history", state: { patientObj: row } }}>
        <ButtonGroup
          variant="contained"
          aria-label="split button"
          style={{
            backgroundColor: "rgb(153, 46, 98)",
            height: "30px",
            width: "215px",
          }}
          size="large"
        >
          <Button
            color="primary"
            size="small"
            style={{ backgroundColor: "rgb(153, 46, 98)" }}
          >
            <MdDashboard />
          </Button>
          <Button style={{ backgroundColor: "rgb(153, 46, 98)" }}>
            <span
              style={{ fontSize: "12px", color: "#fff", fontWeight: "bolder" }}
            >
              Patient Dashboard
            </span>
          </Button>
        </ButtonGroup>
      </Link>
    );
  }

  // Show loading state while checking
  if (isCheckingForms) {
    return (
      <ButtonGroup
        variant="contained"
        aria-label="split button"
        style={{
          backgroundColor: "#ccc",
          height: "30px",
          width: "215px",
        }}
        size="large"
        disabled
      >
        <Button
          color="primary"
          size="small"
          style={{ backgroundColor: "#ccc" }}
          disabled
        >
          <MdDashboard />
        </Button>
        <Button style={{ backgroundColor: "#ccc" }} disabled>
          <span
            style={{ fontSize: "12px", color: "#fff", fontWeight: "bolder" }}
          >
            Checking...
          </span>
        </Button>
      </ButtonGroup>
    );
  }

  const handleEnrollClick = (e) => {
    if (e) e.preventDefault();
    console.log("Enroll button clicked! Opening modal...");
    setShowEnrollmentTypeModal(true);
  };

  const handleTransferIn = () => {
    setShowEnrollmentTypeModal(false);
    // Set localStorage to indicate this is transfer-in
    localStorage.setItem("currentStatus", "ART TRANSFER IN");
    // Show transfer form modal
    setShowTransferFormModal(true);
  };

  const handleNewEnrollment = () => {
    setShowEnrollmentTypeModal(false);
    // Route directly to ICE form
    history.push({
      pathname: "/patient-history",
      state: {
        patientObj: row,
        enrollmentFlow: true
      },
    });
  };

  const handleTransferFormClose = () => {
    setShowTransferFormModal(false);
    localStorage.removeItem("currentStatus");
    history.replace("/", {});
  };

  // This will be called after transfer form is saved successfully
  const handleTransferFormSuccess = () => {
    setShowTransferFormModal(false);
    localStorage.removeItem("currentStatus");
    // Route to ICE form after successful transfer form submission
    history.push({
      pathname: "/patient-history",
      state: {
        patientObj: row,
        enrollmentFlow: true,
        fromTransferIn: true
      },
    });
  };

  // Mock activeContent and setActiveContent for TransferForm
  const mockActiveContent = {
    route: "transfer-form",
    id: "",
    activeTab: "home",
    actionType: "create",
    obj: {},
  };

  const mockSetActiveContent = (content) => {
    // If route is changed to "recent-history", it means form was saved successfully
    if (content.route === "recent-history") {
      handleTransferFormSuccess();
    }
  };

  return (
    <>
      <ButtonGroup
        variant="contained"
        aria-label="split button"
        onClick={handleEnrollClick}
        style={{
          backgroundColor: "rgb(153, 46, 98)",
          height: "30px",
          width: "215px",
          cursor: "pointer",
        }}
        size="large"
      >
        <Button
          color="primary"
          size="small"
          style={{ backgroundColor: "rgb(153, 46, 98)", cursor: "pointer" }}
        >
          <TiArrowForward />
        </Button>
        <Button style={{ backgroundColor: "rgb(153, 46, 98)", cursor: "pointer" }}>
          <span
            style={{ fontSize: "12px", color: "#fff", fontWeight: "bolder" }}
          >
            Enroll Patient
          </span>
        </Button>
      </ButtonGroup>

      {/* Enrollment Type Selection Modal */}
      <Dialog
        open={showEnrollmentTypeModal}
        onClose={() => setShowEnrollmentTypeModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle style={{ backgroundColor: "#014d88", color: "#fff", fontWeight: "bold" }}>
          <span style={{ color: "#fff", fontWeight: "bold" }}>
            <FaUserPlus style={{ marginRight: "10px", verticalAlign: "middle" }} />
            Patient Enrollment Type
          </span>
        </DialogTitle>
        <DialogContent style={{ paddingTop: "20px !important" }}>
          <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "25px" }}>
            <h5 style={{ color: "#333", fontWeight: "500", marginBottom: "10px" }}>
              Is this a Transfer-In patient?
            </h5>
            <p style={{ color: "#666", fontSize: "14px" }}>
              Please select the appropriate enrollment type for this patient
            </p>
          </div>

          <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginBottom: "20px" }}>
            <Button
              onClick={handleTransferIn}
              variant="contained"
              style={{
                backgroundColor: "#014d88",
                color: "white",
                padding: "12px 30px",
                fontSize: "15px",
                fontWeight: "600",
                textTransform: "none",
                borderRadius: "4px",
                minWidth: "180px",
              }}
            >
              <FaExchangeAlt style={{ marginRight: "8px" }} />
              Yes, Transfer-In
            </Button>

            <Button
              onClick={handleNewEnrollment}
              variant="contained"
              style={{
                backgroundColor: "#992E62",
                color: "white",
                padding: "12px 30px",
                fontSize: "15px",
                fontWeight: "600",
                textTransform: "none",
                borderRadius: "4px",
                minWidth: "180px",
              }}
            >
              <FaUserPlus style={{ marginRight: "8px" }} />
              No, New Enrollment
            </Button>
          </div>
        </DialogContent>
        <DialogActions style={{ padding: "16px" }}>
          <Button
            onClick={() => setShowEnrollmentTypeModal(false)}
            style={{
              color: "#666",
              textTransform: "none",
              fontSize: "14px",
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Transfer-In Form Modal */}
      <Dialog
        open={showTransferFormModal}
        onClose={handleTransferFormClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle style={{ backgroundColor: "#014d88", color: "#fff", fontWeight: "bold" }}>
          <span style={{ color: "#fff", fontWeight: "bold" }}>
            <FaExchangeAlt style={{ marginRight: "10px", verticalAlign: "middle" }} />
            Client Transfer-In Acknowledge Form
          </span>
        </DialogTitle>
        <DialogContent style={{ paddingTop: "20px !important" }}>
          <TransferInForm
            patientObj={row}
            activeContent={mockActiveContent}
            setActiveContent={mockSetActiveContent}
            onClose={handleTransferFormClose} // 👇 Pass navigation handler
          />
        </DialogContent>
      </Dialog>
    </>
  );
});

export default FindPatientActions;
