import React, { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
//import classNames from 'classnames';
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
//import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";

import { Link } from "react-router-dom";
import ButtonMui from "@material-ui/core/Button";
import { TiArrowBack } from "react-icons/ti";
import Badge from "react-bootstrap/Badge";

import { Label, Sticky } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { Col, Row } from "reactstrap";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import moment from "moment";
import axios from "axios";
import { url as baseUrl, token } from "./../../../api";
import Typography from "@material-ui/core/Typography";
import { calculate_age } from "../../../utils";
import { usePermissions } from "../../../hooks/usePermissions";
//Dtate Picker package
Moment.locale("en");
momentLocalizer();

const styles = (theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: "bottom",
    height: 20,
    width: 20,
  },
  details: {
    alignItems: "center",
  },
  column: {
    flexBasis: "20.33%",
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
});

function PatientCard(props) {
  const { classes } = props;
  const [checkinStatus, setCheckinStatus] = useState(true);
  const { hasAnyPermission } = usePermissions();


  const patientObject = props.patientObj1;
  const [status, setStatus] = useState("show");


  let weight = parseInt(patientObject?.artCommence?.vitalSignDto?.bodyWeight);
  let height = parseInt(patientObject?.artCommence?.vitalSignDto?.height);

  const changeStatus = () => {
    if (status === "show") {
      setStatus("");
    } else {
      setStatus("show");
    }
  };

 
  const id = props.patientObj.id;

  const [patientFlag, setPatientFlag] = useState({});

  const permissions = useMemo(
    () => ({
      view_patient: hasAnyPermission("view_patient", "all_permissions"),
    }),
    [hasAnyPermission]
  );



  const handleCheckOut = async () => {
   try {
    const response = await axios.get(`${baseUrl}`)
   } catch (error) {
    
   }
  };



  const getHospitalNumber = (identifier) => {
    const identifiers = identifier;
    const hospitalNumber = identifiers.identifier.find(
      (obj) => obj.type == "HospitalNumber"
    );
    return hospitalNumber ? hospitalNumber.value : "";
  };
  const getPhoneNumber = (identifier) => {
    const identifiers = identifier;
    const phoneNumber = identifiers.contactPoint.find(
      (obj) => obj.type === "phone"
    );
    return phoneNumber ? phoneNumber.value : "";
  };
  const getAddress = (identifier) => {
    const identifiers = identifier;
    const address = identifiers.address.find((obj) => obj.city);
    const houseAddress =
      address && address.line[0] !== null ? address.line[0] : "";
    const landMark =
      address && address.city && address.city !== null ? address.city : "";
    return address ? houseAddress + " " + landMark : "";
  };

  const fetchPatientFlags = () => {
    axios
      .get(`${baseUrl}hiv/patient-flag/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setPatientFlag(response.data);
      
      });
  };

  

  useEffect(() => {
    fetchPatientFlags(id);
  }, []);

  const calculateBMI = (weight, height) => {
    const BMI = (weight / (height / 100) ** 2).toFixed(1);

    if (BMI < 18.5) {
      return (
        <span className="text-primary">{`Patient is underweight with a BMI of ${BMI}`}</span>
      );
    } else if (BMI > 19 && BMI < 24.9) {
      return (
        <span className="text-success">{`Patient is normal weight with a BMI of ${BMI}`}</span>
      );
    } else if (BMI > 25 && BMI < 29.9) {
      return (
        <span className="text-info">{`Patient is overweight with a BMI of ${BMI}`}</span>
      );
    } else if (BMI > 30) {
      return (
        <span className="text-danger">{`Patient is obese with a BMI of ${BMI}`}</span>
      );
    }
    return null;
  };

  return (
    <Sticky>
      <div className={classes.root}>
        <ExpansionPanel>
          <ExpansionPanelSummary>
            <Row>
              <Col md={12}>
                <Row className={"mt-1"}>
                  {patientObject && patientObject !== null ? (
                    <>
                      <Col md={12} className={classes.root2}>
                        <b
                          style={{
                            fontSize: "25px",
                            color: "rgb(153, 46, 98)",
                          }}
                        >
                          {patientObject.firstName !== ""
                            ? patientObject.firstName
                            : ""}{" "}
                          {patientObject.surname !== ""
                            ? patientObject.surname
                            : ""}
                        </b>

                        {/* Checkout Patient */}

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            gap: "10px",
                            marginTop: "10px",
                          }}
                        >
                          <Link to={"/"}>
                            <ButtonMui
                              variant="contained"
                              color="primary"
                              style={{
                                backgroundColor: "rgb(153, 46, 98)",
                                color: "#fff",
                                height: "35px",
                              }}
                              startIcon={<TiArrowBack />}
                            >
                              <span style={{ textTransform: "capitalize" }}>
                                Back
                              </span>
                            </ButtonMui>
                          </Link>
                        </div>
                      </Col>
                      <Col md={4} className={classes.root2}>
                        <span>
                          {" "}
                          Patient ID :{" "}
                          <b style={{ color: "#0B72AA" }}>
                            {getHospitalNumber(patientObject.identifier)}
                          </b>
                        </span>
                      </Col>
                      <Col md={4} className={classes.root2}>
                        <span>
                          Date Of Birth :{" "}
                          <b style={{ color: "#0B72AA" }}>
                            {patientObject.dateOfBirth}
                          </b>
                        </span>
                      </Col>
                      <Col md={4} className={classes.root2}>
                        <span>
                          {" "}
                          Age :{" "}
                          <b style={{ color: "#0B72AA" }}>
                            {calculate_age(patientObject.dateOfBirth)}
                          </b>
                        </span>
                      </Col>
                      <Col md={4}>
                        <span>
                          {" "}
                          Gender :{" "}
                          <b style={{ color: "#0B72AA" }}>
                            {patientObject.sex && patientObject.sex !== null
                              ? patientObject.sex
                              : ""}
                          </b>
                        </span>
                      </Col>
                      <Col md={4} className={classes.root2}>
                        <span>
                          {" "}
                          Phone Number :
                          <b style={{ color: "#0B72AA" }}>
                            {patientObject.contactPoint !== null
                              ? getPhoneNumber(patientObject.contactPoint)
                              : ""}
                          </b>
                        </span>
                      </Col>
                      <Col md={4} className={classes.root2}>
                        <span>
                          {" "}
                          Address :
                          <b style={{ color: "#0B72AA" }}>
                            {getAddress(patientObject.address)}{" "}
                          </b>
                        </span>
                      </Col>
                      <Col md={4} style={{ marginBottom: "6px" }}>
                        <span>
                          {" "}
                          Next Appointment Date :{" "}
                          <b style={{ color: "#0B72AA" }}>
                            {patientFlag.nextAppointmentDate &&
                            patientFlag.nextAppointmentDate !== null
                              ? patientFlag.nextAppointmentDate
                              : ""}
                            {patientFlag.dateDiff !== null ? (
                              <span
                                style={{
                                  fontStyle: "italic",
                                  color: "rgb(153, 46, 98)",
                                }}
                              >
                                {" "}
                                {"   "} due in{" "}
                                <Badge
                                  style={{
                                    backgroundColor: "red",
                                    fontSize: "14px",
                                  }}
                                >
                                  {" "}
                                  {patientFlag.dateDiff}
                                </Badge>{" "}
                                days{" "}
                              </span>
                            ) : null}
                          </b>
                        </span>
                      </Col>
                      <Col
                        md={4}
                        className={classes.root2}
                        style={{ marginBottom: "6px" }}
                      >
                        <Typography variant="caption">
                          <Label
                            size={"medium"}
                            style={{
                              width: "210px",
                              height: "50",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Label.Detail
                              style={{
                                display: "flex",
                                justifyContent: "space-around",
                                alignItems: "center",
                                text: "center",
                              }}
                            >
                              {patientFlag.missedAppointment ===
                              "Missed Appointment"
                                ? "MISSED APPOINTMENT"
                                : "PATIENT STILL IN CARE"}

                              {patientFlag.missedAppointment ===
                              "Missed Appointment" ? (
                                <Badge
                                  style={{
                                    backgroundColor: "red",
                                    fontSize: "14px",
                                  }}
                                >
                                  {" "}
                                  {patientFlag.daysMissedAppointment}
                                </Badge>
                              ) : // <div style={{ width: '25px', height: '25px', borderRadius: '50%', backgroundColor: 'red', padding: '3px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >{patientFlag.daysMissedAppointment}</div>
                              null}
                            </Label.Detail>
                          </Label>
                        </Typography>
                      </Col>
                      <Col
                        md={4}
                        className={classes.root2}
                        style={{ marginBottom: "6px" }}
                      >
                        <Typography variant="caption">
                          <Label
                            size={"medium"}
                            style={{
                              width: "300px",
                              height: "90",
                              justifyContent: "space-between",
                              alignItems: "left",
                            }}
                          >
                            {/* <Label.Detail style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', text: 'center'}}> */}
                            {patientFlag.vlSurpression ===
                            "LOW SURPRESSION RATE" ? (
                              <span>
                                VIRAL LOAD RESULT{" "}
                                <Badge
                                  style={{
                                    backgroundColor: "blue",
                                    fontSize: "14px",
                                  }}
                                >
                                  {" "}
                                  {patientFlag.currentViralLoadResult}
                                </Badge>{" "}
                              </span>
                            ) : patientFlag.vlSurpression ===
                              "HIGH SURPRESSION RATE" ? (
                              <span>
                                VIRAL LOAD RESULT{" "}
                                <Badge
                                  style={{
                                    backgroundColor: "red",
                                    fontSize: "14px",
                                  }}
                                >
                                  {" "}
                                  {patientFlag.currentViralLoadResult}
                                </Badge>{" "}
                              </span>
                            ) : (
                              <span>NO VIRAL LOAD RESULT </span>
                            )}
                          </Label>
                        </Typography>
                      </Col>
                      <Col md={4}>
                        <div>
                          <Typography variant="caption">
                            <Label color={"teal"} size={"mini"}>
                              ART STATUS : {patientObject.currentStatus}
                            </Label>
                          </Typography>{" "}
                          <Typography variant="caption">
                            <Label
                              color={
                                patientObject.biometricStatus === true
                                  ? "green"
                                  : "red"
                              }
                              size={"mini"}
                            >
                              Biometric Status
                              <Label.Detail>
                                {patientObject.biometricStatus === true
                                  ? "Captured"
                                  : "Not Captured"}
                              </Label.Detail>
                            </Label>
                          </Typography>
                        </div>
                      </Col>
                      <Col md={4}></Col>
                      <Col md={4}>
                        {patientObject?.artCommence !== null && (
                          <ul className="d-flex align-items-center">
                            <li className="nav-item dropdown">
                              <a
                                className="nav-link nav-icon show"
                                onClick={() => changeStatus()}
                              >
                                <i className="bi bi-bell"></i>
                                <span className="badge bg-primary badge-number">
                                  1
                                </span>
                              </a>

                              <ul
                                className={`dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications ${status}`}
                              >
                                <li className="dropdown-header">
                                  {calculateBMI(weight, height)}
                                </li>
                              </ul>
                            </li>
                          </ul>
                        )}
                      </Col>
                    </>
                  ) : (
                    <p>Loading Please wait...</p>
                  )}
                </Row>
              </Col>
            </Row>
          </ExpansionPanelSummary>
        </ExpansionPanel>
      </div>
    </Sticky>
  );
}

PatientCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PatientCard);
