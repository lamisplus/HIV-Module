import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
//import classNames from 'classnames';
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
//import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";

import { Link } from "react-router-dom";
import ButtonMui from "@material-ui/core/Button";
import { TiArrowBack } from "react-icons/ti";

import { Label, Sticky } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { Col, Row } from "reactstrap";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import moment from "moment";
import axios from "axios";
import { url as baseUrl, token } from "./../../../api";
import Typography from "@material-ui/core/Typography";

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
  //const patientCurrentStatus=props.patientObj && props.patientObj.currentStatus==="Died (Confirmed)" ? true : false ;
  const patientObject = props.patientObj1;
  //const [patientObject, setPatientObject] = useState(props.patientObj1);
  //console.log(props.patientObj1)
  // useEffect(() => {
  //   PatientCurrentObject();
  //   //CheckBiometric();
  // }, [props.patientObj]);
  //   //GET  Patients
  //   async function PatientCurrentObject() {
  //       axios
  //           .get(`${baseUrl}hiv/patient/${props.patientObj.id}`,
  //           { headers: {"Authorization" : `Bearer ${token}`} }
  //           )
  //           .then((response) => {
  //             setPatientObject(response.data);
  //           })
  //           .catch((error) => {
  //           });
  //   }

  const calculate_age = (dob) => {
    var today = new Date();
    var dateParts = dob.split("-");
    var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    var birthDate = new Date(dateObject); // create a date object directlyfrom`dob1`argument
    var age_now = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (age_now <= 0 && m < 0 && today.getDate() < birthDate.getDate()) {
      age_now--;
    }
    // if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    //         age_now--;
    //     }
    if (age_now === 0) {
      return m + " month(s)";
    }
    return age_now + " year(s)";
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
    console.log(address);
    const houseAddress =
      address?.line && address?.line[0] !== null ? address?.line[0] : "";
    const landMark =
      address && address.city && address.city !== null ? address.city : "";
    return address ? houseAddress + " " + landMark : "";
  };
  console.log(patientObject);
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
                        <Link to={"/"}>
                          <ButtonMui
                            variant="contained"
                            color="primary"
                            className=" float-end ms-2 mr-2 mt-2"
                            //startIcon={<FaUserPlus size="10"/>}
                            startIcon={<TiArrowBack />}
                            style={{
                              backgroundColor: "rgb(153, 46, 98)",
                              color: "#fff",
                              height: "35px",
                            }}
                          >
                            <span style={{ textTransform: "capitalize" }}>
                              Back
                            </span>
                          </ButtonMui>
                        </Link>
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
                            {calculate_age(
                              moment(patientObject.dateOfBirth).format(
                                "DD-MM-YYYY"
                              )
                            )}
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
                            {patientObject.address &&
                              getAddress(patientObject.address)}{" "}
                          </b>
                        </span>
                      </Col>
                      <Col md={12}>
                        <div>
                          <Typography variant="caption">
                            <Label color={"teal"} size={"mini"}>
                              ART STATUS : {patientObject.currentStatus}
                            </Label>
                          </Typography>
                        </div>
                      </Col>
                      <Col md={12}>
                        {/* {biometricStatus===true ? (
                          <> */}
                        <div>
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
                        {/* </>
                          )
                          :
                          <>
                              
                          </>
                      } */}
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
