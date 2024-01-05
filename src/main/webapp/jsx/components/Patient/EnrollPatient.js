import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import MatButton from "@material-ui/core/Button";
import Button from "@material-ui/core/Button";
import { FormGroup, Label, Spinner, Input, Form } from "reactstrap";
//import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckSquare,
  faCoffee,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
//import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from "yup";
import * as moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
//import AddIcon from "@material-ui/icons/Add";
import CancelIcon from "@material-ui/icons/Cancel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { Link, useHistory, useLocation } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";
//import {useForm} from "react-hook-form";
import { token, url as baseUrl } from "../../../api";
//import PhoneInput from 'react-phone-input-2'
import "react-phone-input-2/lib/style.css";
//import { getValue } from "@syncfusion/ej2-base";
import "./patient.css";
// import Form from 'react-bootstrap/Form';
import { Modal } from "react-bootstrap";
import { Label as LabelSui } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";

library.add(faCheckSquare, faCoffee, faEdit, faTrash);

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(20),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  cardBottom: {
    marginBottom: 20,
  },
  Select: {
    height: 45,
    width: 300,
  },
  button: {
    margin: theme.spacing(1),
  },
  root: {
    flexGrow: 1,
    "& .card-title": {
      color: "#fff",
      fontWeight: "bold",
    },
    "& .form-control": {
      borderRadius: "0.25rem",
      height: "41px",
    },
    "& .card-header:first-child": {
      borderRadius: "calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0",
    },
    "& .dropdown-toggle::after": {
      display: " block !important",
    },
    "& select": {
      "-webkit-appearance": "listbox !important",
    },
    "& p": {
      color: "red",
    },
    "& label": {
      fontSize: "14px",
      color: "#014d88",
      fontWeight: "bold",
    },
  },
  demo: {
    backgroundColor: theme.palette.background.default,
  },
  inline: {
    display: "inline",
  },
  error: {
    color: "#f85032",
    fontSize: "12.8px",
  },
}));

const UserRegistration = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const [today, setToday] = useState(
    new Date().toISOString().substr(0, 10).replace("T", " ")
  );
  const [saving, setSaving] = useState(false);
  const [disabledAgeBaseOnAge, setDisabledAgeBaseOnAge] = useState(false);
  const [ageDisabled, setAgeDisabled] = useState(true);
  const [errors, setErrors] = useState({});
  //HIV INFORMATION
  const [femaleStatus, setfemaleStatus] = useState(false);
  //const [values, setValues] = useState([]);
  const [objValues, setObjValues] = useState({
    id: "",
    uniqueId: "",
    dateOfRegistration: "",
    entryPointId: "",
    facilityName: "",
    statusAtRegistrationId: "",
    dateConfirmedHiv: "",
    sourceOfReferrerId: "",
    enrollmentSettingId: "",
    pregnancyStatusId: "",
    dateOfLpm: "",
    tbStatusId: "",
    targetGroupId: "",
    ovc_enrolled: "",
    ovcNumber: "",
    householdNumber: "",
    referredToOVCPartner: "",
    dateReferredToOVCPartner: "",
    referredFromOVCPartner: "",
    dateReferredFromOVCPartner: "",
    careEntryPointOther: "",
    personId: "",
    ovcUniqueId: "",
    lipName: "",
  });
  const [carePoints, setCarePoints] = useState([]);
  const [sourceReferral, setSourceReferral] = useState([]);
  const [hivStatus, setHivStatus] = useState([]);
  const [enrollSetting, setEnrollSetting] = useState([]);
  const [tbStatus, setTbStatus] = useState([]);
  const [kP, setKP] = useState([]);
  const [pregnancyStatus, setPregnancyStatus] = useState([]);
  //set ro show the facility name field if is transfer in
  const [transferIn, setTransferIn] = useState(false);
  // display the OVC number if patient is enrolled into OVC
  const [ovcEnrolled, setOvcEnrolled] = useState(false);
  //Input fields to hidden base on some conditions
  const [hideTargetGroup, setHideTargetGroup] = useState("false");
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen(!open);
  const locationState = location.state;

  let patientId = null;
  let patientObj = {};
  patientId = locationState ? locationState.patientId : null;
  patientObj = locationState ? locationState.patientObj : {};
  const [basicInfo, setBasicInfo] = useState(patientObj);
  //objValues.uniqueId=basicInfo.hospitalNumber
  useEffect(() => {
    CareEntryPoint();
    SourceReferral();
    HivStatus();
    EnrollmentSetting();
    TBStatus();
    KP();
    PregnancyStatus();
    if (basicInfo.dateOfRegistration < basicInfo.dob) {
      alert("Date of registration can not be earlier than date of birth");
    }
  }, [patientObj, patientId]);

  const handleAgeChange = (e) => {
    const ageNumber = e.target.value.replace(/\D/g, "");
    if (!ageDisabled && ageNumber) {
      if (ageNumber !== "" && ageNumber >= 60) {
        toggle();
      }
      if (ageNumber <= 1) {
        setDisabledAgeBaseOnAge(true);
      } else {
        setDisabledAgeBaseOnAge(false);
      }
      const currentDate = new Date();
      currentDate.setDate(15);
      currentDate.setMonth(5);
      const estDob = moment(currentDate.toISOString());
      const dobNew = estDob.add(ageNumber * -1, "years");
      //setBasicInfo({...basicInfo, dob: moment(dobNew).format("YYYY-MM-DD")});
      basicInfo.dob = moment(dobNew).format("YYYY-MM-DD");
    }
    setBasicInfo({ ...basicInfo, age: ageNumber });
  };
  //End of Date of Birth and Age handling
  /*****  Validation  */
  const validate = () => {
    let temp = { ...errors };

    temp.targetGroupId = objValues.targetGroupId
      ? ""
      : "Target group is required.";
    temp.dateConfirmedHiv = objValues.dateConfirmedHiv
      ? ""
      : "date confirm HIV is required.";
    temp.sourceOfReferrerId = objValues.sourceOfReferrerId
      ? ""
      : "Source of referrer is required.";
    temp.enrollmentSettingId = objValues.enrollmentSettingId
      ? ""
      : "Enrollment Setting Number  is required.";
    temp.tbStatusId = objValues.tbStatusId ? "" : "TB status is required.";
    temp.statusAtRegistrationId = objValues.statusAtRegistrationId
      ? ""
      : "Status at Registration is required.";
    temp.entryPointId = objValues.entryPointId
      ? ""
      : "Care Entry Point is required.";
    temp.dateOfRegistration = objValues.dateOfRegistration
      ? ""
      : "Date of Registration is required.";
    temp.uniqueId = objValues.uniqueId ? "" : "Unique ID is required.";
    {
      basicInfo.age > 9 &&
        basicInfo.sex === "Female" &&
        (temp.pregnancyStatusId = objValues.pregnancyStatusId
          ? ""
          : "This field is required.");
    }

    setErrors({ ...temp });
    return Object.values(temp).every((x) => x == "");
  };
  //Handle Input Change for Basic Infor
  const handleInputChangeBasic = (e) => {
    setErrors({ ...errors, [e.target.name]: "" });
    setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
    //manupulate inpute fields base on gender/sex
    if (e.target.name === "sexId" && e.target.value === "Female") {
      setfemaleStatus(true);
    }
    if (e.target.name === "firstName" && e.target.value !== "") {
      const name = alphabetOnly(e.target.value);
      setBasicInfo({ ...basicInfo, [e.target.name]: name });
    }
    if (e.target.name === "lastName" && e.target.value !== "") {
      const name = alphabetOnly(e.target.value);
      setBasicInfo({ ...basicInfo, [e.target.name]: name });
    }
    if (e.target.name === "middleName" && e.target.value !== "") {
      const name = alphabetOnly(e.target.value);
      setBasicInfo({ ...basicInfo, [e.target.name]: name });
    }
    if (e.target.name === "ninNumber" && e.target.value !== "") {
      const ninNumberValue = checkNINLimit(e.target.value.replace(/\D/g, ""));
      setBasicInfo({ ...basicInfo, [e.target.name]: ninNumberValue });
    }
  };
  const checkNINLimit = (e) => {
    const limit = 11;
    const acceptedNumber = e.slice(0, limit);
    return acceptedNumber;
  };
  const alphabetOnly = (value) => {
    const result = value.replace(/[^a-z]/gi, "");
    return result;
  };

  const CareEntryPoint = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/POINT_ENTRY`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        //console.log(response.data);
        setCarePoints(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  //Get list of Source of Referral
  const SourceReferral = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/SOURCE_REFERRAL`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        //console.log(response.data);
        setSourceReferral(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  //Get list of HIV STATUS ENROLLMENT
  const HivStatus = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/HIV_STATUS_ENROL`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        //console.log(response.data);
        setHivStatus(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  //Get list of HIV STATUS ENROLLMENT
  const EnrollmentSetting = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/ENROLLMENT_SETTING`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        //console.log(response.data);
        setEnrollSetting(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  //Get list of HIV STATUS ENROLLMENT
  const TBStatus = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/TB_STATUS`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        //console.log(response.data);
        setTbStatus(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  //Get list of KP
  const KP = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/TARGET_GROUP`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        //console.log(response.data);
        setKP(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  //Get list of KP
  const PregnancyStatus = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/PREGNANCY_STATUS`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        //console.log(response.data);
        setPregnancyStatus(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  const handleInputChange = (e) => {
    setErrors({ ...errors, [e.target.name]: "" });
    setObjValues({ ...objValues, [e.target.name]: e.target.value });
    if (e.target.name === "entryPointId") {
      if (e.target.value === "21") {
        setTransferIn(true);
        setObjValues({ ...objValues, [e.target.name]: e.target.value });
      } else {
        setTransferIn(false);
        objValues.facilityName = ""; // make the value empty
        //setObjValues ({...objValues,  ['facilityName']: ""});
        setObjValues({ ...objValues, [e.target.name]: e.target.value });
      }
      if (e.target.value === "24") {
        setTransferIn(true);
        setObjValues({ ...objValues, [e.target.name]: e.target.value });
      } else {
        setTransferIn(false);
        objValues.careEntryPointOther = ""; // make the value empty
        //setObjValues ({...objValues,  ['facilityName']: ""});
        setObjValues({ ...objValues, [e.target.name]: e.target.value });
      }
    }
  };
  //Handle CheckBox
  const handleCheckBox = (e) => {
    if (e.target.checked) {
      setOvcEnrolled(true);
    } else {
      objValues.ovc_enrolled = "";
      objValues.ovcNumber = "";
      objValues.householdNumber = "";
      objValues.referredToOVCPartner = "";
      objValues.dateReferredToOVCPartner = "";
      objValues.referredFromOVCPartner = "";
      objValues.dateReferredFromOVCPartner = "";
      objValues.ovcUniqueId = "";
      setOvcEnrolled(false);
    }
  };
  const handleCancel = () => {
    history.push({ pathname: "/" });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setSaving(true);
      try {
        objValues.personId = patientId;
        const response = await axios.post(
          `${baseUrl}hiv/enrollment`,
          objValues,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Patient Register successful", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setSaving(false);
        history.push("/");
      } catch (error) {
        setSaving(false);
        if (error.response && error.response.data) {
          let errorMessage =
            error.response.data.apierror &&
            error.response.data.apierror.message !== ""
              ? error.response.data.apierror.message
              : "Something went wrong, please try again";
          if (
            error.response.data.apierror &&
            error.response.data.apierror.message !== "" &&
            error.response.data.apierror &&
            error.response.data.apierror.subErrors[0].message !== ""
          ) {
            toast.error(
              error.response.data.apierror.message +
                " : " +
                error.response.data.apierror.subErrors[0].field +
                " " +
                error.response.data.apierror.subErrors[0].message,
              { position: toast.POSITION.BOTTOM_CENTER }
            );
          } else {
            toast.error(errorMessage, {
              position: toast.POSITION.BOTTOM_CENTER,
            });
          }
        } else {
          toast.error("Something went wrong. Please try again...", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      }
    }
  };

  return (
    <>
      <div
        className="row page-titles mx-0"
        style={{ marginTop: "0px", marginBottom: "-10px" }}
      >
        <ol className="breadcrumb">
          <li className="breadcrumb-item active">
            <h4>
              {" "}
              <Link to={"/"}>HIV /</Link> Patient Enrollment
            </h4>
          </li>
        </ol>
      </div>
      <ToastContainer autoClose={3000} hideProgressBar />
      <Card className={classes.root}>
        <CardContent>
          <Link
            to={{
              pathname: "/",
              state: "users",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              className=" float-end ms-1"
              style={{ backgroundColor: "#014d88", fontWeight: "bolder" }}
              startIcon={<TiArrowBack />}
            >
              <span style={{ textTransform: "capitalize", color: "#fff" }}>
                Back{" "}
              </span>
            </Button>
          </Link>
          <br />
          <br />
          <div className="col-xl-12 col-lg-12">
            <Form>
              <div className="card">
                <div
                  className="card-header"
                  style={{
                    backgroundColor: "#014d88",
                    color: "#fff",
                    fontWeight: "bolder",
                    borderRadius: "0.2rem",
                  }}
                >
                  <h5 className="card-title" style={{ color: "#fff" }}>
                    {"Basic Information"}
                  </h5>
                </div>

                <div className="card-body">
                  <div className="basic-form">
                    <div className="row">
                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="firstName">Name</Label>
                          <Input
                            className="form-control"
                            type="text"
                            name="firstName"
                            id="firstName"
                            value={
                              basicInfo.firstName + " " + basicInfo.surname
                            }
                            onChange={handleInputChangeBasic}
                            style={{
                              border: "none",
                              backgroundColor: "transparent",
                              outline: "none",
                            }}
                            //disabled
                          />
                          {errors.firstName !== "" ? (
                            <span className={classes.error}>
                              {errors.firstName}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                      <div className="form-group mb-3 col-md-3">
                        <FormGroup>
                          <Label for="patientId">Hospital Number </Label>
                          <input
                            className="form-control"
                            type="text"
                            name="hospitalNumber"
                            id="hospitalNumber"
                            value={basicInfo.hospitalNumber}
                            onChange={handleInputChangeBasic}
                            style={{
                              border: "none",
                              backgroundColor: "transparent",
                              outline: "none",
                            }}
                            //disabled
                          />
                        </FormGroup>
                      </div>

                      <div className="form-group  col-md-2">
                        <FormGroup>
                          <Label>Sex </Label>
                          <Input
                            className="form-control"
                            name="sexId"
                            id="sexId"
                            onChange={handleInputChangeBasic}
                            value={basicInfo.sex}
                            style={{
                              border: "none",
                              backgroundColor: "transparent",
                              outline: "none",
                            }}
                          />
                        </FormGroup>
                      </div>
                      <div className="form-group mb-3 col-md-2">
                        <FormGroup>
                          <Label>Age </Label>
                          <input
                            className="form-control"
                            type="text"
                            name="age"
                            id="age"
                            value={basicInfo.age}
                            disabled={ageDisabled}
                            onChange={handleAgeChange}
                            style={{
                              border: "none",
                              backgroundColor: "transparent",
                              outline: "none",
                            }}
                          />
                        </FormGroup>
                      </div>
                    </div>
                  </div>
                </div>
                {/* </div> */}
              </div>

              {/* Adding HIV ENROLLEMENT FORM HERE */}
              <div className="card">
                <div
                  className="card-header"
                  style={{
                    backgroundColor: "#014d88",
                    color: "#fff",
                    fontWeight: "bolder",
                    borderRadius: "0.2rem",
                  }}
                >
                  <h5 className="card-title" style={{ color: "#fff" }}>
                    HIV Enrollment
                  </h5>
                </div>

                <div className="card-body">
                  <div className="row">
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label for="uniqueId">
                          Unique ID No <span style={{ color: "red" }}> *</span>
                        </Label>
                        <Input
                          type="text"
                          name="uniqueId"
                          id="uniqueId"
                          onChange={handleInputChange}
                          value={objValues.uniqueId}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        />
                        {errors.uniqueId !== "" ? (
                          <span className={classes.error}>
                            {errors.uniqueId}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    {objValues.entryPointId === "21" ||
                    objValues.statusAtRegistrationId === "55" ? (
                      <>
                        <div className="form-group mb-3 col-md-6">
                          <FormGroup>
                            <Label for="dateOfRegistration">
                              Date of Enrollment{" "}
                              <span style={{ color: "red" }}> *</span>
                            </Label>
                            <Input
                              type="date"
                              name="dateOfRegistration"
                              id="dateOfRegistration"
                              min="01-01-1980"
                              max={moment(new Date()).format("YYYY-MM-DD")}
                              onChange={handleInputChange}
                              value={objValues.dateOfRegistration}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {errors.dateOfRegistration !== "" ? (
                              <span className={classes.error}>
                                {errors.dateOfRegistration}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="form-group mb-3 col-md-6">
                          <FormGroup>
                            <Label for="dateOfRegistration">
                              Date of Enrollment{" "}
                              <span style={{ color: "red" }}> *</span>
                            </Label>
                            <Input
                              type="date"
                              name="dateOfRegistration"
                              id="dateOfRegistration"
                              min={basicInfo.dateOfRegistration}
                              max={moment(new Date()).format("YYYY-MM-DD")}
                              onChange={handleInputChange}
                              value={objValues.dateOfRegistration}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {errors.dateOfRegistration !== "" ? (
                              <span className={classes.error}>
                                {errors.dateOfRegistration}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="row">
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label for="entryPointId">
                          Care Entry Point{" "}
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <Input
                          type="select"
                          name="entryPointId"
                          id="entryPointId"
                          onChange={handleInputChange}
                          value={objValues.entryPointId}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        >
                          <option value=""> </option>
                          {carePoints.map((value) => (
                            <option key={value.id} value={value.id}>
                              {value.display}
                            </option>
                          ))}
                        </Input>
                        {errors.entryPointId !== "" ? (
                          <span className={classes.error}>
                            {errors.entryPointId}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      {objValues.entryPointId === "21" ? (
                        <FormGroup>
                          <Label>Facility Name</Label>
                          <Input
                            type="text"
                            name="facilityName"
                            id="facilityName"
                            onChange={handleInputChange}
                            value={objValues.facilityName}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                        </FormGroup>
                      ) : (
                        ""
                      )}
                      {objValues.entryPointId === "24" ? (
                        <FormGroup>
                          <Label>Care Entry Point (Others)</Label>
                          <Input
                            type="text"
                            name="careEntryPointOther"
                            id="careEntryPointOther"
                            onChange={handleInputChange}
                            value={objValues.careEntryPointOther}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                        </FormGroup>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          HIV Status at Registration{" "}
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <Input
                          type="select"
                          name="statusAtRegistrationId"
                          id="statusAtRegistrationId"
                          onChange={handleInputChange}
                          value={objValues.statusAtRegistrationId}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        >
                          <option value=""> Select</option>
                          {hivStatus.map((value) => (
                            <option key={value.id} value={value.id}>
                              {value.display}
                            </option>
                          ))}
                        </Input>
                        {errors.statusAtRegistrationId !== "" ? (
                          <span className={classes.error}>
                            {errors.statusAtRegistrationId}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Date of Confirmed HIV Test{" "}
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <Input
                          type="date"
                          name="dateConfirmedHiv"
                          id="dateConfirmedHiv"
                          min={patientObj.dateOfBirth}
                          max={objValues.dateOfRegistration}
                          onChange={handleInputChange}
                          value={objValues.dateConfirmedHiv}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        />
                        {errors.dateConfirmedHiv !== "" ? (
                          <span className={classes.error}>
                            {errors.dateConfirmedHiv}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Source of Referral{" "}
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <Input
                          type="select"
                          name="sourceOfReferrerId"
                          id="sourceOfReferrerId"
                          value={objValues.sourceOfReferrerId}
                          onChange={handleInputChange}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                          required
                        >
                          <option value="">Select </option>
                          {sourceReferral.map((value) => (
                            <option key={value.id} value={value.id}>
                              {value.display}
                            </option>
                          ))}
                        </Input>
                        {errors.sourceOfReferrerId !== "" ? (
                          <span className={classes.error}>
                            {errors.sourceOfReferrerId}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    {objValues.sourceOfReferrerId === "870" ||
                    objValues.sourceOfReferrerId === 870 ? (
                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>LIP Name</Label>
                          <Input
                            type="text"
                            name="lipName"
                            id="lipName"
                            onChange={handleInputChange}
                            value={objValues.lipName}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                        </FormGroup>
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Enrollment Setting{" "}
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <Input
                          type="select"
                          name="enrollmentSettingId"
                          id="enrollmentSettingId"
                          value={objValues.enrollmentSettingId}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                          onChange={handleInputChange}
                          required
                        >
                          <option value=""> Select</option>

                          {enrollSetting.map((value) => (
                            <option key={value.id} value={value.id}>
                              {value.display}
                            </option>
                          ))}
                        </Input>
                        {errors.enrollmentSettingId !== "" ? (
                          <span className={classes.error}>
                            {errors.enrollmentSettingId}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    {basicInfo.sex === "Female" && basicInfo.age > 9 && (
                      <>
                        <div className="form-group mb-3 col-md-6">
                          <FormGroup>
                            <Label>
                              {" "}
                              Pregnancy <span style={{ color: "red" }}> *</span>
                            </Label>
                            <Input
                              type="select"
                              name="pregnancyStatusId"
                              id="pregnancyStatusId"
                              value={objValues.pregnancyStatusId}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                              onChange={handleInputChange}
                            >
                              <option value="">Select </option>
                              {pregnancyStatus.map((value) => (
                                <option key={value.id} value={value.id}>
                                  {value.display}
                                </option>
                              ))}
                            </Input>
                            {errors.pregnancyStatusId !== "" ? (
                              <span className={classes.error}>
                                {errors.pregnancyStatusId}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>
                        {objValues.pregnancyStatusId === "73" && (
                          <>
                            <div className="form-group mb-3 col-md-6">
                              <FormGroup>
                                <Label>Date of LMP </Label>
                                <Input
                                  type="date"
                                  name="dateOfLpm"
                                  id="dateOfLpm"
                                  max={today}
                                  onChange={handleInputChange}
                                  value={objValues.dateOfLpm}
                                  style={{
                                    border: "1px solid #014D88",
                                    borderRadius: "0.2rem",
                                  }}
                                  required
                                />
                              </FormGroup>
                            </div>
                          </>
                        )}
                      </>
                    )}
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          TB Status <span style={{ color: "red" }}> *</span>{" "}
                        </Label>
                        <Input
                          type="select"
                          name="tbStatusId"
                          id="tbStatusId"
                          value={objValues.tbStatusId}
                          onChange={handleInputChange}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                          required
                        >
                          <option value=""> Select</option>
                          {tbStatus.map((value) => (
                            <option key={value.id} value={value.id}>
                              {value.display}
                            </option>
                          ))}
                        </Input>
                        {errors.tbStatusId !== "" ? (
                          <span className={classes.error}>
                            {errors.tbStatusId}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    {hideTargetGroup === "false" ? (
                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>
                            Target Group{" "}
                            <span style={{ color: "red" }}> *</span>
                          </Label>
                          <Input
                            type="select"
                            name="targetGroupId"
                            id="targetGroupId"
                            value={objValues.targetGroupId}
                            onChange={handleInputChange}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          >
                            <option value=""> Select</option>
                            {(basicInfo.sex === "Female" ||
                              basicInfo.sex === "female") && (
                              <>
                                {kP
                                  .filter((x) => x.display !== "MSM")
                                  .map((value) => (
                                    <option key={value.id} value={value.id}>
                                      {value.display}
                                    </option>
                                  ))}
                              </>
                            )}
                            {(basicInfo.sex === "Male" ||
                              basicInfo.sex === "male") && (
                              <>
                                {kP
                                  .filter((x) => x.display !== "FSW")
                                  .map((value) => (
                                    <option key={value.id} value={value.id}>
                                      {value.display}
                                    </option>
                                  ))}
                              </>
                            )}
                          </Input>
                          {errors.targetGroupId !== "" ? (
                            <span className={classes.error}>
                              {errors.targetGroupId}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                    ) : (
                      ""
                    )}
                    {basicInfo.age <= 17 && (
                      <div className="form-group mb-3 col-md-3">
                        <div className="form-check custom-checkbox ml-1 ">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            name="ovc_enrolled"
                            id="ovc_enrolled"
                            onChange={handleCheckBox}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                          >
                            Enrolled into OVC?
                          </label>
                        </div>
                      </div>
                    )}
                    {/* <div className="form-group mb-3 col-md-3">
                                    {ovcEnrolled===true ? 
                                        (
                                        <FormGroup>
                                        <Label >OVC Number</Label>
                                        <Input
                                            type="text"
                                            name="ovcNumber"
                                            id="ovcNumber"
                                            required={ovcEnrolled}
                                            onChange={handleInputChange}
                                            style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                            value={objValues.ovcNumber}
                                            
                                        />
                                        </FormGroup>
                                        )
                                        :
                                        ""
                                    }
                                </div> */}

                    {ovcEnrolled === true && (
                      <>
                        <div className="row">
                          <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                              <Label>Household Unique Number</Label>
                              <Input
                                type="text"
                                name="householdNumber"
                                id="householdNumber"
                                required={ovcEnrolled}
                                onChange={handleInputChange}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                                value={objValues.householdNumber}
                              />
                            </FormGroup>
                          </div>
                          <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                              <Label>OVC Unique ID</Label>
                              <Input
                                type="text"
                                name="ovcUniqueId"
                                id="ovcUniqueId"
                                required={ovcEnrolled}
                                onChange={handleInputChange}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                                value={objValues.ovcUniqueId}
                              />
                            </FormGroup>
                          </div>

                          <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                              <Label>Referred To OVC Partner</Label>
                              <Input
                                type="text"
                                name="referredToOVCPartner"
                                id="referredToOVCPartner"
                                required={ovcEnrolled}
                                onChange={handleInputChange}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                                value={objValues.referredToOVCPartner}
                              />
                            </FormGroup>
                          </div>
                          <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                              <Label>Date Referred To OVC Partner</Label>
                              <Input
                                type="date"
                                name="dateReferredToOVCPartner"
                                id="dateReferredToOVCPartner"
                                min={basicInfo.dob}
                                //max={objValues.dateOfRegistration }
                                onChange={handleInputChange}
                                value={objValues.dateReferredToOVCPartner}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              />
                              {/* {errors.dateConfirmedHiv !=="" ? (
                                            <span className={classes.error}>{errors.dateConfirmedHiv}</span>
                                            ) : "" }  */}
                            </FormGroup>
                          </div>
                          <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                              <Label>Referred From OVC Partner</Label>
                              <Input
                                type="text"
                                name="referredFromOVCPartner"
                                id="referredFromOVCPartner"
                                required={ovcEnrolled}
                                onChange={handleInputChange}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                                value={objValues.referredFromOVCPartner}
                              />
                            </FormGroup>
                          </div>
                          <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                              <Label>Date Referred From OVC Partner</Label>
                              <Input
                                type="date"
                                name="dateReferredFromOVCPartner"
                                id="dateReferredFromOVCPartner"
                                min={basicInfo.dob}
                                max={objValues.dateOfRegistration}
                                onChange={handleInputChange}
                                value={objValues.dateReferredFromOVCPartner}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              />
                              {/* {errors.dateConfirmedHiv !=="" ? (
                                            <span className={classes.error}>{errors.dateConfirmedHiv}</span>
                                            ) : "" }  */}
                            </FormGroup>
                          </div>
                          <div className="row">
                            <h3>OVC Service Provided</h3>
                            <div className="form-group mb-3 col-md-4">
                              <FormGroup>
                                <Label>Service Domain</Label>
                                <Input
                                  type="select"
                                  name="dateReferredFromOVCPartner"
                                  id="dateReferredFromOVCPartner"
                                  min={basicInfo.dob}
                                  max={objValues.dateOfRegistration}
                                  onChange={handleInputChange}
                                  value={objValues.dateReferredFromOVCPartner}
                                  style={{
                                    border: "1px solid #014D88",
                                    borderRadius: "0.2rem",
                                  }}
                                />
                              </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-4">
                              <FormGroup>
                                <Label>Avialable Services</Label>
                                <Input
                                  type="text"
                                  name="services"
                                  id="services"
                                  onChange={handleInputChange}
                                  value={objValues.services}
                                  style={{
                                    border: "1px solid #014D88",
                                    borderRadius: "0.2rem",
                                  }}
                                />
                              </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-2">
                              <LabelSui
                                as="a"
                                color="black"
                                size="tiny"
                                style={{ marginTop: 35 }}
                              >
                                <Icon name="plus" /> Add
                              </LabelSui>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {/* END OF HIV ENROLLEMENT FORM */}
              {saving ? <Spinner /> : ""}

              <br />

              <MatButton
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<SaveIcon />}
                hidden={disabledAgeBaseOnAge}
                onClick={handleSubmit}
                disabled={saving}
              >
                {!saving ? (
                  <span style={{ textTransform: "capitalize" }}>Save</span>
                ) : (
                  <span style={{ textTransform: "capitalize" }}>Saving...</span>
                )}
              </MatButton>

              <MatButton
                variant="contained"
                className={classes.button}
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                style={{ backgroundColor: "#992E62" }}
              >
                <span style={{ textTransform: "capitalize", color: "#fff" }}>
                  Cancel
                </span>
              </MatButton>
            </Form>
          </div>
        </CardContent>
      </Card>
      <Modal
        show={open}
        toggle={toggle}
        className="fade"
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Notification!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Are you Sure of the Age entered?</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={toggle}
            style={{ backgroundColor: "#014d88", color: "#fff" }}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserRegistration;
