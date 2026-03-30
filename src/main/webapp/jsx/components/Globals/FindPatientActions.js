import React, { memo } from "react";
import { Link } from "react-router-dom";
import { ButtonGroup, Button } from "@material-ui/core";
import { MdDashboard } from "react-icons/md";
import { TiArrowForward } from "react-icons/ti";
import { usePermissions } from "../../../hooks/usePermissions";

const FindPatientActions = memo(({ row }) => {
  const { hasPermission } = usePermissions();
  const canEnroll = hasPermission("hiv_enrollment_register");

  console.log("FindPatientActions - canEnroll:", canEnroll, "row:", row);

  if (!canEnroll) return null;

  if (row.currentStatus !== "Not Enrolled") {
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

  const handleEnrollClick = (e) => {
    console.log("Enroll button clicked!", { row, enrollmentFlow: true });
    alert("Enroll button clicked! Check console for details.");
  };

  return (
    <Link
      to={{
        pathname: "/patient-history",
        state: { patientObj: row, enrollmentFlow: true },
      }}
      onClick={handleEnrollClick}
      style={{ textDecoration: "none", cursor: "pointer" }}
    >
      <ButtonGroup
        variant="contained"
        aria-label="split button"
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
    </Link>
  );
});

export default FindPatientActions;
