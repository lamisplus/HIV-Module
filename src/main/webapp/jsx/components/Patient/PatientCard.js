import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
//import classNames from 'classnames';
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
//import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";

import {Link} from "react-router-dom";
import ButtonMui from "@material-ui/core/Button";
import {TiArrowBack} from "react-icons/ti";
import Badge from "react-bootstrap/Badge";

import {Label, Sticky} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import {Col, Row} from "reactstrap";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import axios from "axios";
import {token, url as baseUrl} from "./../../../api";
import Typography from "@material-ui/core/Typography";
import {calculate_age} from "../../../utils";
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
    const {classes} = props;
    //const patientCurrentStatus=props.patientObj && props.patientObj.currentStatus==="Died (Confirmed)" ? true : false ;
    const patientObject = props.patientObj1;
    // console.log("in", patientObject);
    // console.log("out", props.patientObj);
    const id = props.patientObj.id;

    const [patientFlag, setPatientFlag] = useState({});
    const [patientMlValue, setPatientMlValue] = useState({"iit": null, "chance": null});
    const getPhoneNumber = (identifier) => {
        const phoneNumber = identifier?.contactPoint?.find(
            (obj) => obj.type === "phone"
        );
        return phoneNumber ? phoneNumber.value : "";
    };
    const getAddress = (identifier) => {
        const address = identifier?.address?.find((obj) => obj.city);
        const houseAddress =
            address && address.line[0] !== null ? address.line[0] : "";
        const landMark =
            address && address.city && address.city !== null ? address.city : "";
        return address ? houseAddress + " " + landMark : "";
    };

    const fetchPatientFlags = () => {
        axios
            .get(`${baseUrl}hiv/patient-flag/${id}`, {
                headers: {Authorization: `Bearer ${token}`},
            })
            .then((response) => {
                setPatientFlag(response.data);
            })
            .catch((error) => {
                console.error("Error fetching patient flag:", error);
            });
    };

    const fetchPatientMlReport = () => {
        axios.get(`${baseUrl}hiv/iit-ml/patient/${id}/iit-report`,
            {headers: {Authorization: `Bearer ${token}`},})
            .then((response) => {
                setPatientMlValue(response.data);
            }).catch((error) => {
            if (error.response && error.response.data.apierror.message === "Could not find a matching facility with the provided ID") {
                setPatientMlValue((prevValue) => ({...prevValue, iit: false}));
            } else {
                console.error("An unexpected error occurred:", error);
            }
        });
    }

    useEffect(() => {
        fetchPatientFlags(id);
        fetchPatientMlReport();
    }, []);

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
                                                        startIcon={<TiArrowBack/>}
                                                        style={{
                                                            backgroundColor: "rgb(153, 46, 98)",
                                                            color: "#fff",
                                                            height: "35px",
                                                        }}
                                                    >
                            <span style={{textTransform: "capitalize"}}>
                              Back
                            </span>
                                                    </ButtonMui>
                                                </Link>
                                            </Col>
                                            <Col md={4} className={classes.root2}>
                        <span>
                          {" "}
                            Patient ID :{" "}
                            <b style={{color: "#0B72AA"}}>
                            {props.patientObj.hospitalNumber}
                          </b>
                        </span>
                                            </Col>

                                            <Col md={4} className={classes.root2}>
                        <span>
                          Date Of Birth :{" "}
                            <b style={{color: "#0B72AA"}}>
                            {patientObject.dateOfBirth}
                          </b>
                        </span>
                                            </Col>
                                            <Col md={4} className={classes.root2}>
                        <span>
                          {" "}
                            Age :{" "}
                            <b style={{color: "#0B72AA"}}>
                            {calculate_age(patientObject.dateOfBirth)}
                          </b>
                        </span>
                                            </Col>
                                            <Col md={4}>
                        <span>
                          {" "}
                            Gender :{" "}
                            <b style={{color: "#0B72AA"}}>
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
                          <b style={{color: "#0B72AA"}}>
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
                          <b style={{color: "#0B72AA"}}>
                            {getAddress(patientObject.address)}{" "}
                          </b>
                        </span>
                                            </Col>
                                            <Col md={4} style={{marginBottom: "6px"}}>
                        <span>
                          {" "}
                            Next Appointment Date :{" "}
                            <b style={{color: "#0B72AA"}}>
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
                                                style={{marginBottom: "6px"}}
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
                                                <br/>
                                                {patientMlValue?.iit && <div>
                                                    <Typography variant="caption">
                                                        <Label
                                                            color={"teal"}
                                                            size={"medium"}
                                                            style={{
                                                                width: '210px',
                                                                height: '50',
                                                                justifyContent: '',
                                                                alignItems: 'left',
                                                                marginBottom: '10px'
                                                            }}
                                                        >
                                                            IIT-ML PREDICTION
                                                            <br/>

                                                            <Label.Detail style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-around',
                                                                alignItems: 'center',
                                                                text: 'center',
                                                                marginBottom: '4px'
                                                            }}>
                                                                IIT Percentage
                                                                : {patientMlValue.chance === null ? "" : patientMlValue.chance}
                                                            </Label.Detail>

                                                            <Label.Detail style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-around',
                                                                alignItems: 'center',
                                                                text: 'center'
                                                            }}>
                                                                Chance of
                                                                IIT: {patientMlValue.iit === null ? null : patientMlValue.iit === true ? "True" : "False"}
                                                            </Label.Detail>
                                                        </Label>

                                                    </Typography>
                                                </div>}

                                            </Col>
                                            <Col
                                                md={4}
                                                className={classes.root2}
                                                style={{marginBottom: "6px"}}
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
