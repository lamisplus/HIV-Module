import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  FormGroup,
  Label,
  InputGroup,
  InputGroupText,
  Input,
} from "reactstrap";
import MatButton from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import axios from "axios";
import { toast } from "react-toastify";
import { url as baseUrl, token } from "../../../api";
//import { useHistory } from "react-router-dom";
//import {  Modal, Button } from "react-bootstrap";
import "react-widgets/dist/css/react-widgets.css";
import moment from "moment";
import "react-summernote/dist/react-summernote.css"; // import styles
import { Spinner } from "reactstrap";
//import { DateTimePicker } from "react-widgets";
import { Message } from "semantic-ui-react";

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
    width: 350,
  },
  button: {
    margin: theme.spacing(1),
  },

  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
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
  input: {
    display: "none",
  },
  error: {
    color: "#f85032",
    fontSize: "11px",
  },
  success: {
    color: "#4BB543 ",
    fontSize: "11px",
  },
}));

const ArtCommencement = (props) => {
  const patientObj = props.patientObj;
  const [enrollDate, setEnrollDate] = useState("");
  //let history = useHistory();
  let gender = "";
  const classes = useStyles();
  const [clinicalStage, setClinicalStage] = useState([]);
  //const [values, setValues] = useState([]);
  const [saving, setSaving] = useState(false);
  const [viraLoadStart, setViraLoadStart] = useState(false);
  const [errors, setErrors] = useState({});
  let temp = { ...errors };
  //const [tbStatus, setTbStatus] = useState([]);
  //const [regimenLine, setRegimenLine] = useState([]);
  const [regimenType, setRegimenType] = useState([]);
  const [pregnancyStatus, setpregnancyStatus] = useState([]);
  const [functionalStatus, setFunctionalStatus] = useState([]);
  const [adultRegimenLine, setAdultRegimenLine] = useState([]);
  const [childRegimenLine, setChildRegimenLine] = useState([]);
  const [objValues, setObjValues] = useState({
    personId: props.patientObj.id,
    visitDate: null,
    viralLoad: "",
    whoStagingId: "",
    clinicalStageId: "",
    cd4: null,
    cd4Percentage: null,
    isCommencement: true,
    functionalStatusId: "",
    clinicalNote: "",
    hivEnrollmentId: "",
    vitalSignDto: "",
    facilityId: 1,
    regimenTypeId: 0,
    regimenId: 0,
    viralLoadAtStartOfArt: "",
    isViralLoadAtStartOfArt: null,
    dateOfViralLoadAtStartOfArt: null,
    cd4Count: null,
    cd4SemiQuantitative: "",
    cd4FlowCytometry: "",
    cd4Type: "",
    pregnancyStatus: null,
    dateOfLpm: "",
  });

  const [vital, setVitalSignDto] = useState({
    bodyWeight: "",
    diastolic: "",
    encounterDate: "",
    facilityId: 1,
    height: "",
    personId: props.patientObj.id,
    serviceTypeId: 1,
    systolic: "",
    pulse: "",
    temperature: "",
    respiratoryRate: "",
    headCircumference: "",
    surfaceArea: "",
    muac: "",
  });
  //Vital signs clinical decision support
  const [vitalClinicalSupport, setVitalClinicalSupport] = useState({
    bodyWeight: "",
    diastolic: "",
    height: "",
    systolic: "",
    pulse: "",
    temperature: "",
    respiratoryRate: "",
  });
  const calculate_age = (dob) => {
    var today = new Date();
    var dateParts = dob.split("-");
    var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    var birthDate = new Date(dateObject); // create a date object directlyfrom`dob1`argument
    var age_now = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age_now--;
    }
    if (age_now === 0) {
      return m;
    }
    return age_now;
  };
  const patientAge = calculate_age(
    moment(patientObj.dateOfBirth).format("DD-MM-YYYY")
  );
  const [patientObject, setPatientObject] = useState(null);
  useEffect(() => {
    FunctionalStatus();
    WhoStaging();
    //TBStatus();
    PreganacyStatus();
    RegimenLine();
    InitialClinicEvaluation();
    AdultRegimenLine();
    ChildRegimenLine();
    PatientCurrentObject();
    gender =
      props.patientObj.gender && props.patientObj.gender.display
        ? props.patientObj.gender.display
        : null;
  }, [props.patientObj]);
  //GET  Patients
  const PatientCurrentObject = () => {
    axios
      .get(`${baseUrl}hiv/patient/${props.patientObj.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setEnrollDate(
          response.data.enrollment.entryPointId === 21
            ? response.data.enrollment.dateConfirmedHiv
            : response.data.enrollment.dateOfRegistration
        );
        setPatientObject(response.data);
        objValues.pregnancyStatus = response.data.enrollment.pregnancyStatusId;
        //console.log(response.data.enrollment.pregnancyStatusId)
        setObjValues({
          ...objValues,
          pregnancyStatus: response.data.enrollment.pregnancyStatusId,
        });
      })
      .catch((error) => {});
  };

  //GET AdultRegimenLine
  const AdultRegimenLine = () => {
    axios
      .get(`${baseUrl}hiv/regimen/arv/adult`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const artRegimen = response.data.filter(
          (x) => x.id === 1 || x.id === 2 || x.id === 14
        );
        setAdultRegimenLine(artRegimen);
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  //GET ChildRegimenLine
  const ChildRegimenLine = () => {
    axios
      .get(`${baseUrl}hiv/regimen/arv/children`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const artRegimenChildren = response.data.filter(
          (x) => x.id === 3 || x.id === 4
        );
        setChildRegimenLine(artRegimenChildren);
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  //Get list of WhoStaging
  const WhoStaging = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/CLINICAL_STAGE`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        //console.log(response.data);
        setClinicalStage(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  const InitialClinicEvaluation = () => {
    axios
      .get(`${baseUrl}observation/person/${props.patientObj.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const obj1 = response.data.find(
          (x) => x.type === "Clinical evaluation"
        );

        //const cd4CountObj=obj1.data.plan
        //console.log(obj1.data.plan)
        objValues.cd4Type = obj1.data.plan.cd4Type;
        objValues.cd4Count = obj1.data.plan.cd4Count;
        objValues.whoStagingId = obj1.data.who.stage;
        objValues.regimenTypeId = obj1.data.regimen.regimenLine;
        RegimenType(obj1.data.regimen.regimenLine);
        objValues.regimenId = obj1.data.regimen.regimen;
        setVitalSignDto({ ...obj1.data.physicalExamination });
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  //Get list of RegimenLine
  const RegimenLine = () => {
    axios
      .get(`${baseUrl}hiv/regimen/types`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        //console.log(response.data);
        //setRegimenLine(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  //Get list of RegimenLine
  const RegimenType = (id) => {
    axios
      .get(`${baseUrl}hiv/regimen/types/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        //console.log(response.data);
        setRegimenType(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  //Get list of PREGANACY_STATUS
  const PreganacyStatus = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/PREGNANCY_STATUS`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        //console.log(response.data);
        setpregnancyStatus(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  ///GET LIST OF FUNCTIONAL%20_STATUS
  async function FunctionalStatus() {
    axios
      .get(`${baseUrl}application-codesets/v2/FUNCTIONAL%20_STATUS`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setFunctionalStatus(response.data);
        //setValues(response.data)
      })
      .catch((error) => {});
  }
  // TB STATUS
  // const TBStatus =()=>{
  //     axios
  //        .get(`${baseUrl}application-codesets/v2/TB_STATUS`,
  //            { headers: {"Authorization" : `Bearer ${token}`} }
  //        )
  //        .then((response) => {
  //            //console.log(response.data);
  //            setTbStatus(response.data);
  //        })
  //        .catch((error) => {
  //        //console.log(error);
  //        });

  //  }

  const handleInputChange = (e) => {
    setErrors({ ...temp, [e.target.name]: "" });
    setObjValues({ ...objValues, [e.target.name]: e.target.value });
    if (e.target.name === "isViralLoadAtStartOfArt" && e.target.value !== "") {
      if (e.target.value === "true") {
        setViraLoadStart(true);
        setObjValues({ ...objValues, [e.target.name]: true });
      } else {
        setObjValues({ ...objValues, [e.target.name]: false });
        setViraLoadStart(false);
      }
    } else if (e.target.name === "cd4Percentage" && e.target.value !== "") {
      setObjValues({
        ...objValues,
        [e.target.name]: e.target.value.replace(/\D/g, ""),
      });
    } else if (e.target.name === "cd4" && e.target.value !== "") {
      setObjValues({
        ...objValues,
        [e.target.name]: e.target.value.replace(/\D/g, ""),
      });
    }

    if (
      e.target.name === "isViralLoadAtStartOfArt" &&
      e.target.value === "false"
    ) {
      objValues.viralLoadAtStartOfArt = "";
      objValues.dateOfViralLoadAtStartOfArt = "";
      setObjValues({ ...objValues, ["viralLoadAtStartOfArt"]: " " });
      setObjValues({ ...objValues, ["dateOfViralLoadAtStartOfArt"]: " " });
      setObjValues({ ...objValues, [e.target.name]: e.target.value });
    }
  };

  const handleInputChangeVitalSignDto = (e) => {
    setErrors({ ...temp, [e.target.name]: "" });
    setVitalSignDto({ ...vital, [e.target.name]: e.target.value });
    // if(e.target.name==='muac'){
    //     setVitalSignDto ({...vital,  [e.target.name]: e.target.value});
    // } else{
    //     setVitalSignDto ({...vital,  [e.target.name]: e.target.value.replace(/\D/g, '')});
    // }
  };
  const handleSelecteRegimen = (e) => {
    let regimenID = e.target.value;
    //regimenTypeId regimenId
    setObjValues({ ...objValues, regimenTypeId: regimenID });
    RegimenType(regimenID);
    setErrors({ ...temp, [e.target.name]: "" });
  };
  //to check the input value for clinical decision
  const handleInputValueCheckHeight = (e) => {
    if (
      e.target.name === "height" &&
      (e.target.value < 48.26 || e.target.value > 216.408)
    ) {
      const message =
        "Height cannot be greater than 216.408 and less than 48.26";
      setVitalClinicalSupport({ ...vitalClinicalSupport, height: message });
    } else {
      setVitalClinicalSupport({ ...vitalClinicalSupport, height: "" });
    }
  };
  const handleInputValueCheckBodyWeight = (e) => {
    if (
      e.target.name === "bodyWeight" &&
      (e.target.value < 3 || e.target.value > 150)
    ) {
      const message =
        "Body weight must not be greater than 150 and less than 3";
      setVitalClinicalSupport({ ...vitalClinicalSupport, bodyWeight: message });
    } else {
      setVitalClinicalSupport({ ...vitalClinicalSupport, bodyWeight: "" });
    }
  };
  const handleInputValueCheckSystolic = (e) => {
    if (
      e.target.name === "systolic" &&
      (e.target.value < 90 || e.target.value > 240)
    ) {
      const message =
        "Blood Pressure systolic must not be greater than 240 and less than 90";
      setVitalClinicalSupport({ ...vitalClinicalSupport, systolic: message });
    } else {
      setVitalClinicalSupport({ ...vitalClinicalSupport, systolic: "" });
    }
  };
  const handleInputValueCheckDiastolic = (e) => {
    if (
      e.target.name === "diastolic" &&
      (e.target.value < 60 || e.target.value > 140)
    ) {
      const message =
        "Blood Pressure diastolic must not be greater than 140 and less than 60";
      setVitalClinicalSupport({ ...vitalClinicalSupport, diastolic: message });
    } else {
      setVitalClinicalSupport({ ...vitalClinicalSupport, diastolic: "" });
    }
  };
  const handleInputValueCheckPulse = (e) => {
    if (
      e.target.name === "pulse" &&
      (e.target.value < 40 || e.target.value > 120)
    ) {
      const message = "Pulse must not be greater than 120 and less than 40";
      setVitalClinicalSupport({ ...vitalClinicalSupport, pulse: message });
    } else {
      setVitalClinicalSupport({ ...vitalClinicalSupport, pulse: "" });
    }
  };
  const handleInputValueCheckRespiratoryRate = (e) => {
    if (
      e.target.name === "respiratoryRate" &&
      (e.target.value < 10 || e.target.value > 70)
    ) {
      const message =
        "Respiratory Rate must not be greater than 70 and less than 10";
      setVitalClinicalSupport({
        ...vitalClinicalSupport,
        respiratoryRate: message,
      });
    } else {
      setVitalClinicalSupport({ ...vitalClinicalSupport, respiratoryRate: "" });
    }
  };
  const handleInputValueCheckTemperature = (e) => {
    if (
      e.target.name === "temperature" &&
      (e.target.value < 35 || e.target.value > 47)
    ) {
      const message =
        "Temperature must not be greater than 47 and less than 35";
      setVitalClinicalSupport({
        ...vitalClinicalSupport,
        temperature: message,
      });
    } else {
      setVitalClinicalSupport({ ...vitalClinicalSupport, temperature: "" });
    }
  };
  // const handleInputChangeVitalStart =(e)=>{
  //     if(e.target.value===true ){
  //         setViraLoadStart(true)
  //         setObjValues({...objValues, isViralLoadAtStartOfArt:true})
  //     }else{
  //         setObjValues({...objValues, isViralLoadAtStartOfArt:false})
  //         setViraLoadStart(false)
  //     }
  // }

  //FORM VALIDATION
  const validate = () => {
    temp.visitDate = objValues.visitDate ? "" : "This field is required";
    temp.regimenId = objValues.regimenId ? "" : "This field is required";
    temp.regimenTypeId = objValues.regimenTypeId
      ? ""
      : "This field is required";
    temp.whoStagingId = objValues.whoStagingId ? "" : "This field is required";
    temp.functionalStatusId = objValues.functionalStatusId
      ? ""
      : "This field is required";
    //temp.tbStatusId = objValues.tbStatusId ? "" : "This field is required"
    temp.bodyWeight = vital.bodyWeight ? "" : "This field is required";
    temp.height = vital.height ? "" : "This field is required";
    //temp.systolic = vital.systolic ? "" : "This field is required"
    //temp.diastolic = vital.diastolic ? "" : "This field is required"
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x == "");
  };

  /**** Submit Button Processing  */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      objValues.personId = props.patientObj.id;
      vital.encounterDate = objValues.visitDate;
      vital.personId = props.patientObj.id;
      objValues.vitalSignDto = vital;
      objValues.hivEnrollmentId = patientObject && patientObject.enrollment.id;
      objValues.clinicalStageId = objValues.whoStagingId;
      if (objValues.pregnancyStatus !== null) {
        const pregnancyDisplay = pregnancyStatus.find(
          (x) => x.id === parseInt(objValues.pregnancyStatus)
        );
        objValues.pregnancyStatus = pregnancyDisplay.display;
      }
      // else{
      //     objValues.pregnancyStatus = objValues.pregnancyStatus
      // }
      //Logic for cd4 value
      if (objValues.cd4Type === "Flow Cyteometry") {
        objValues.cd4 = objValues.cd4Count;
      }
      setSaving(true);
      axios
        .post(`${baseUrl}hiv/art/commencement/`, objValues, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setSaving(false);
          //props.setArt(true)
          props.patientObj.commenced = true;
          toast.success("Record save successful");
          props.setActiveContent({
            ...props.activeContent,
            route: "recent-history",
          });
          //props.toggle()
          //props.PatientCurrentStatus()
        })
        .catch((error) => {
          setSaving(false);
          if (error.response && error.response.data) {
            let errorMessage =
              error.response.data.apierror &&
              error.response.data.apierror.message !== ""
                ? error.response.data.apierror.message
                : "Something went wrong, please try again";
            toast.error(errorMessage);
          } else {
            toast.error("Something went wrong. Please try again...");
          }
        });
    }
  };
  function BmiCal(bmi) {
    if (bmi < 18.5) {
      return <Message size="mini" color="brown" content="Underweight" />;
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      <Message size="mini" color="olive" content="Well nourished" />;
    } else if (bmi > 25) {
      <Message size="mini" color="blue" content="Overweight/Obese" />;
    }
  }

  return (
    <div>
      <div className="col-md-6">
        <h2>ART Commencement</h2>
      </div>
      <div className="col-md-6"></div>
      <br />
      <Card className={classes.root}>
        <CardBody>
          <form>
            <div className="row">
              {/* statusAtRegistrationId  entryPointId */}
              {patientObject &&
              (patientObject.enrollment.entryPointId === "21" ||
                patientObject.enrollment.statusAtRegistrationId === "55") ? (
                <>
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="artDate">
                        ART Start Date <span style={{ color: "red" }}> *</span>{" "}
                      </Label>
                      <Input
                        type="date"
                        name="visitDate"
                        id="visitDate"
                        onChange={handleInputChange}
                        value={objValues.visitDate}
                        min="01-01-1980"
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                        required
                      />
                      {errors.visitDate !== "" ? (
                        <span className={classes.error}>
                          {errors.visitDate}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="artDate">
                        ART Start Date <span style={{ color: "red" }}> *</span>{" "}
                      </Label>
                      <Input
                        type="date"
                        name="visitDate"
                        id="visitDate"
                        onChange={handleInputChange}
                        value={objValues.visitDate}
                        min={enrollDate}
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                        required
                      />
                      {errors.visitDate !== "" ? (
                        <span className={classes.error}>
                          {errors.visitDate}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>
                </>
              )}

              {/* <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                        <Label for="cd4">CD4 at start of ART </Label>
                        <Input
                            type="text"
                            name="cd4"
                            id="cd4"
                            min={0}
                            onChange={handleInputChange}
                            value={objValues.cd4}
                            style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                            
                        />
                        
                        </FormGroup>
                    </div>
                 */}
              <div className="form-group mb-3 col-md-4">
                <FormGroup>
                  <Label for="cd4Percentage">CD4%</Label>
                  <Input
                    type="text"
                    name="cd4Percentage"
                    id="cd4Percentage"
                    min={0}
                    onChange={handleInputChange}
                    value={objValues.cd4Percentage}
                    style={{
                      border: "1px solid #014D88",
                      borderRadius: "0.25rem",
                    }}
                  />
                </FormGroup>
              </div>
              <div className="row">
                <div className="form-group  col-md-6">
                  <FormGroup>
                    <Label>CD4 Count (Type)</Label>
                    <select
                      className="form-control"
                      name="cd4Type"
                      id="cd4Type"
                      value={objValues.cd4Type}
                      onChange={handleInputChange}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.2rem",
                      }}
                    >
                      <option value={""}></option>
                      <option value="Semi-Quantitative">
                        Semi-Quantitative
                      </option>
                      <option value="Flow Cyteometry">Flow Cyteometry</option>
                    </select>
                  </FormGroup>
                </div>
                {objValues.cd4Type === "Semi-Quantitative" && (
                  <div className="form-group  col-md-6">
                    <FormGroup>
                      <Label>CD4 Count Value(Semi-Quantitative)</Label>
                      <select
                        className="form-control"
                        name="cd4Count"
                        id="cd4Count"
                        value={objValues.cd4Count}
                        onChange={handleInputChange}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      >
                        <option value={""}></option>
                        <option value="<200">{"<200"}</option>
                        <option value=">=200">{">=200"}</option>
                      </select>
                    </FormGroup>
                  </div>
                )}
                {objValues.cd4Type === "Flow Cyteometry" && (
                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label for="">CD4 Count Value (Flow Cyteometry)</Label>
                      <Input
                        type="number"
                        min={1}
                        name="cd4Count"
                        id="cd4Count"
                        value={objValues.cd4Count}
                        onChange={handleInputChange}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                      />
                    </FormGroup>
                  </div>
                )}
              </div>
              <div className="form-group mb-3 col-md-4">
                <FormGroup>
                  <Label>
                    Original Regimen Line{" "}
                    <span style={{ color: "red" }}> *</span>
                  </Label>
                  <Input
                    type="select"
                    name="regimenTypeId"
                    id="regimenTypeId"
                    value={objValues.regimenTypeId}
                    onChange={handleSelecteRegimen}
                    required
                    style={{
                      border: "1px solid #014D88",
                      borderRadius: "0.25rem",
                    }}
                  >
                    <option value=""> Select</option>

                    {patientAge && patientAge > 15 && (
                      <>
                        {adultRegimenLine.map((value) => (
                          <option key={value.id} value={value.id}>
                            {value.description}
                          </option>
                        ))}
                      </>
                    )}
                    {patientAge && patientAge <= 15 && (
                      <>
                        {childRegimenLine.map((value) => (
                          <option key={value.id} value={value.id}>
                            {value.description}
                          </option>
                        ))}
                      </>
                    )}
                  </Input>
                  {errors.regimenTypeId !== "" ? (
                    <span className={classes.error}>
                      {errors.regimenTypeId}
                    </span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </div>
              <div className="form-group mb-3 col-md-4">
                <FormGroup>
                  <Label>
                    Original Regimen <span style={{ color: "red" }}> *</span>
                  </Label>
                  <Input
                    type="select"
                    name="regimenId"
                    id="regimenId"
                    value={objValues.regimenId}
                    onChange={handleInputChange}
                    style={{
                      border: "1px solid #014D88",
                      borderRadius: "0.25rem",
                    }}
                  >
                    <option value=""> Select</option>
                    {regimenType.map((value) => (
                      <option key={value.id} value={value.id}>
                        {value.description}
                      </option>
                    ))}
                  </Input>
                  {errors.regimenId !== "" ? (
                    <span className={classes.error}>{errors.regimenId}</span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </div>

              <div className="form-group mb-3 col-md-4">
                <FormGroup>
                  <Label>Viral Load at Start of ART </Label>
                  <Input
                    type="select"
                    name="isViralLoadAtStartOfArt"
                    id="isViralLoadAtStartOfArt"
                    onChange={handleInputChange}
                    value={objValues.isViralLoadAtStartOfArt}
                    style={{
                      border: "1px solid #014D88",
                      borderRadius: "0.25rem",
                    }}
                    required
                  >
                    <option value=""> Select</option>
                    <option value="true"> YES</option>
                    <option value="false"> NO</option>
                  </Input>
                </FormGroup>
              </div>
              {viraLoadStart && (
                <>
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label>Viral Load at Start of ART Result</Label>
                      <Input
                        type="number"
                        name="viralLoadAtStartOfArt"
                        id="viralLoadAtStartOfArt"
                        onChange={handleInputChange}
                        value={objValues.viralLoadAtStartOfArt}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                        required
                      />
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label>Date of Viral Load at Start of ART</Label>
                      <Input
                        type="date"
                        name="dateOfViralLoadAtStartOfArt"
                        id="dateOfViralLoadAtStartOfArt"
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        onChange={handleInputChange}
                        value={objValues.dateOfViralLoadAtStartOfArt}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                        required
                      />
                    </FormGroup>
                  </div>
                </>
              )}

              <div className="form-group mb-3 col-md-4">
                <FormGroup>
                  <Label>
                    WHO Staging <span style={{ color: "red" }}> *</span>
                  </Label>
                  <Input
                    type="select"
                    name="whoStagingId"
                    id="whoStagingId"
                    value={objValues.whoStagingId}
                    onChange={handleInputChange}
                    max={moment(new Date()).format("YYYY-MM-DD")}
                    style={{
                      border: "1px solid #014D88",
                      borderRadius: "0.25rem",
                    }}
                  >
                    <option value=""> Select</option>
                    {clinicalStage.map((value) => (
                      <option key={value.id} value={value.id}>
                        {value.display}
                      </option>
                    ))}
                  </Input>
                  {errors.whoStagingId !== "" ? (
                    <span className={classes.error}>{errors.whoStagingId}</span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </div>

              <div className="form-group mb-3 col-md-4">
                <FormGroup>
                  <Label>
                    Functional Status <span style={{ color: "red" }}> *</span>
                  </Label>
                  <Input
                    type="select"
                    name="functionalStatusId"
                    id="functionalStatusId"
                    value={objValues.functionalStatusId}
                    onChange={handleInputChange}
                    style={{
                      border: "1px solid #014D88",
                      borderRadius: "0.25rem",
                    }}
                    required
                  >
                    <option value=""> Select</option>

                    {functionalStatus.map((value) => (
                      <option key={value.id} value={value.id}>
                        {value.display}
                      </option>
                    ))}
                  </Input>
                  {errors.functionalStatusId !== "" ? (
                    <span className={classes.error}>
                      {errors.functionalStatusId}
                    </span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </div>
              {objValues.isViralLoadAtStartOfArt &&
                objValues.isViralLoadAtStartOfArt !== null && (
                  <div className="form-group mb-3 col-md-8"></div>
                )}
              {!objValues.isViralLoadAtStartOfArt &&
                objValues.isViralLoadAtStartOfArt !== null && (
                  <div className="form-group mb-3 col-md-4"></div>
                )}
              {patientAge >= 10 &&
              (props.patientObj.sex === "Female" ||
                props.patientObj.sex === "FEMALE" ||
                props.patientObj.sex === "female") ? (
                <>
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label>
                        Pregnancy Status{" "}
                        <span style={{ color: "red" }}> *</span>
                      </Label>
                      <Input
                        type="select"
                        name="pregnancyStatus"
                        id="pregnancyStatus"
                        onChange={handleInputChange}
                        value={objValues.pregnancyStatus}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                        //disabled
                      >
                        <option value=""> Select</option>
                        {pregnancyStatus.map((value) => (
                          <option key={value.id} value={value.id}>
                            {value.display}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </div>
                  {objValues.pregnancyStatus === "73" && (
                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label>LMP</Label>
                        <Input
                          type="date"
                          name="dateOfLpm"
                          id="dateOfLpm"
                          onChange={handleInputChange}
                          value={objValues.dateOfLpm}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                          }}
                          max={moment(new Date()).format("YYYY-MM-DD")}
                        />
                      </FormGroup>
                    </div>
                  )}
                </>
              ) : (
                ""
              )}
              {/* <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                        <Label >TB Status</Label>
                        <Input
                            type="select"
                            name="tbStatusId"
                            id="tbStatusId"
                            value={objValues.tbStatusId}
                            onChange={handleInputChange}
                            style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                            required
                            >
                                <option value=""> Select</option>
        
                                {tbStatus.map((value) => (
                                    <option key={value.id} value={value.id}>
                                        {value.display}
                                    </option>
                                ))}
                        </Input>
                        {errors.tbStatusId !=="" ? (
                            <span className={classes.error}>{errors.tbStatusId}</span>
                            ) : "" }
                        </FormGroup>
                    </div> */}
              <div className="row">
                <div className=" mb-3 col-md-4">
                  <FormGroup>
                    <Label>Pulse</Label>
                    <InputGroup>
                      <Input
                        type="number"
                        name="pulse"
                        id="pulse"
                        onChange={handleInputChangeVitalSignDto}
                        min="40"
                        max="120"
                        value={vital.pulse}
                        onKeyUp={handleInputValueCheckPulse}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0rem",
                        }}
                      />
                      <InputGroupText
                        addonType="append"
                        style={{
                          backgroundColor: "#014D88",
                          color: "#fff",
                          border: "1px solid #014D88",
                          borderRadius: "0rem",
                        }}
                      >
                        bmp
                      </InputGroupText>
                    </InputGroup>
                    {vitalClinicalSupport.pulse !== "" ? (
                      <span className={classes.error}>
                        {vitalClinicalSupport.pulse}
                      </span>
                    ) : (
                      ""
                    )}
                    {errors.pulse !== "" ? (
                      <span className={classes.error}>{errors.pulse}</span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </div>
                <div className=" mb-3 col-md-4">
                  <FormGroup>
                    <Label>Respiratory Rate </Label>
                    <InputGroup>
                      <Input
                        type="number"
                        name="respiratoryRate"
                        id="respiratoryRate"
                        onChange={handleInputChangeVitalSignDto}
                        min="10"
                        max="70"
                        value={vital.respiratoryRate}
                        onKeyUp={handleInputValueCheckRespiratoryRate}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0rem",
                        }}
                      />
                      <InputGroupText
                        addonType="append"
                        style={{
                          backgroundColor: "#014D88",
                          color: "#fff",
                          border: "1px solid #014D88",
                          borderRadius: "0rem",
                        }}
                      >
                        bmp
                      </InputGroupText>
                    </InputGroup>
                    {vitalClinicalSupport.respiratoryRate !== "" ? (
                      <span className={classes.error}>
                        {vitalClinicalSupport.respiratoryRate}
                      </span>
                    ) : (
                      ""
                    )}
                    {errors.respiratoryRate !== "" ? (
                      <span className={classes.error}>
                        {errors.respiratoryRate}
                      </span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </div>
                <div className=" mb-3 col-md-4">
                  <FormGroup>
                    <Label>Temperature </Label>
                    <InputGroup>
                      <Input
                        type="number"
                        name="temperature"
                        id="temperature"
                        onChange={handleInputChangeVitalSignDto}
                        min="35"
                        max="47"
                        value={vital.temperature}
                        onKeyUp={handleInputValueCheckTemperature}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0rem",
                        }}
                      />
                      <InputGroupText
                        addonType="append"
                        style={{
                          backgroundColor: "#014D88",
                          color: "#fff",
                          border: "1px solid #014D88",
                          borderRadius: "0rem",
                        }}
                      >
                        <sup>o</sup>c
                      </InputGroupText>
                    </InputGroup>
                    {vitalClinicalSupport.temperature !== "" ? (
                      <span className={classes.error}>
                        {vitalClinicalSupport.temperature}
                      </span>
                    ) : (
                      ""
                    )}
                    {errors.temperature !== "" ? (
                      <span className={classes.error}>
                        {errors.temperature}
                      </span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </div>

                <div className=" mb-3 col-md-4">
                  <FormGroup>
                    <Label>
                      Body Weight <span style={{ color: "red" }}> *</span>
                    </Label>
                    <InputGroup>
                      <Input
                        type="number"
                        name="bodyWeight"
                        id="bodyWeight"
                        onChange={handleInputChangeVitalSignDto}
                        min="3"
                        max="150"
                        value={vital.bodyWeight}
                        onKeyUp={handleInputValueCheckBodyWeight}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0rem",
                        }}
                        disabled
                      />
                      <InputGroupText
                        addonType="append"
                        style={{
                          backgroundColor: "#014D88",
                          color: "#fff",
                          border: "1px solid #014D88",
                          borderRadius: "0rem",
                        }}
                      >
                        kg
                      </InputGroupText>
                    </InputGroup>
                    {vitalClinicalSupport.bodyWeight !== "" ? (
                      <span className={classes.error}>
                        {vitalClinicalSupport.bodyWeight}
                      </span>
                    ) : (
                      ""
                    )}
                    {errors.bodyWeight !== "" ? (
                      <span className={classes.error}>{errors.bodyWeight}</span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-5">
                  <FormGroup>
                    <Label>
                      Height <span style={{ color: "red" }}> *</span>
                    </Label>
                    <InputGroup>
                      <InputGroupText
                        addonType="append"
                        style={{
                          backgroundColor: "#014D88",
                          color: "#fff",
                          border: "1px solid #014D88",
                          borderRadius: "0rem",
                        }}
                      >
                        cm
                      </InputGroupText>
                      <Input
                        type="number"
                        name="height"
                        id="height"
                        onChange={handleInputChangeVitalSignDto}
                        value={vital.height}
                        min="48.26"
                        max="216.408"
                        onKeyUp={handleInputValueCheckHeight}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0rem",
                        }}
                        disabled
                      />
                      <InputGroupText
                        addonType="append"
                        style={{
                          backgroundColor: "#992E62",
                          color: "#fff",
                          border: "1px solid #992E62",
                          borderRadius: "0rem",
                        }}
                      >
                        {vital.height !== ""
                          ? (vital.height / 100).toFixed(2) + "m"
                          : "m"}
                      </InputGroupText>
                    </InputGroup>
                    {vitalClinicalSupport.height !== "" ? (
                      <span className={classes.error}>
                        {vitalClinicalSupport.height}
                      </span>
                    ) : (
                      ""
                    )}
                    {errors.height !== "" ? (
                      <span className={classes.error}>{errors.height}</span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 mt-2 col-md-3">
                  {vital.bodyWeight !== "" && vital.height !== "" && (
                    <FormGroup>
                      <Label> </Label>
                      <InputGroup>
                        <InputGroupText
                          addonType="append"
                          style={{
                            backgroundColor: "#014D88",
                            color: "#fff",
                            border: "1px solid #014D88",
                            borderRadius: "0rem",
                          }}
                        >
                          BMI :{" "}
                          {(
                            vital.bodyWeight /
                            ((vital.height / 100) * (vital.height / 100))
                          ).toFixed(2)}
                        </InputGroupText>
                      </InputGroup>
                    </FormGroup>
                  )}
                </div>
              </div>
              {vital.bodyWeight !== "" && vital.height !== "" && (
                <div className="form-group mb-3 mt-2 col-md-12">
                  {BmiCal(
                    (
                      vital.bodyWeight /
                      ((vital.height / 100) * (vital.height / 100))
                    ).toFixed(2)
                  )}
                </div>
              )}
              <div className="row">
                <div className="form-group mb-3 col-md-12">
                  <FormGroup>
                    <Label>Blood Pressure</Label>
                    <InputGroup>
                      <InputGroupText
                        addonType="append"
                        style={{
                          backgroundColor: "#014D88",
                          color: "#fff",
                          border: "1px solid #014D88",
                          borderRadius: "0rem",
                        }}
                      >
                        systolic(mmHg)
                      </InputGroupText>
                      <Input
                        type="number"
                        name="systolic"
                        id="systolic"
                        min="90"
                        max="240"
                        onChange={handleInputChangeVitalSignDto}
                        value={vital.systolic}
                        onKeyUp={handleInputValueCheckSystolic}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0rem",
                        }}
                      />
                      <InputGroupText
                        addonType="append"
                        style={{
                          backgroundColor: "#014D88",
                          color: "#fff",
                          border: "1px solid #014D88",
                          borderRadius: "0rem",
                        }}
                      >
                        diastolic(mmHg)
                      </InputGroupText>
                      <Input
                        type="text"
                        name="diastolic"
                        id="diastolic"
                        min={0}
                        max={140}
                        onChange={handleInputChangeVitalSignDto}
                        value={vital.diastolic}
                        onKeyUp={handleInputValueCheckDiastolic}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0rem",
                        }}
                      />
                    </InputGroup>
                    {vitalClinicalSupport.systolic !== "" ? (
                      <span className={classes.error}>
                        {vitalClinicalSupport.systolic}
                      </span>
                    ) : (
                      ""
                    )}
                    {errors.systolic !== "" ? (
                      <span className={classes.error}>{errors.systolic}</span>
                    ) : (
                      ""
                    )}
                    {vitalClinicalSupport.diastolic !== "" ? (
                      <span className={classes.error}>
                        {vitalClinicalSupport.diastolic}
                      </span>
                    ) : (
                      ""
                    )}
                    {errors.diastolic !== "" ? (
                      <span className={classes.error}>{errors.diastolic}</span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </div>
              </div>
              {patientAge && patientAge < 14 && (
                <div className="row">
                  <div className=" mb-3 col-md-4">
                    <FormGroup>
                      <Label>Head Circumference </Label>
                      <InputGroup>
                        <Input
                          type="number"
                          name="headCircumference"
                          id="headCircumference"
                          onChange={handleInputChangeVitalSignDto}
                          min="35"
                          max="47"
                          value={vital.headCircumference}
                          onKeyUp={handleInputValueCheckTemperature}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0rem",
                          }}
                        />
                        <InputGroupText
                          addonType="append"
                          style={{
                            backgroundColor: "#014D88",
                            color: "#fff",
                            border: "1px solid #014D88",
                            borderRadius: "0rem",
                          }}
                        >
                          cm
                        </InputGroupText>
                      </InputGroup>
                    </FormGroup>
                  </div>
                  <div className=" mb-3 col-md-4">
                    <FormGroup>
                      <Label>Surface Area </Label>
                      <InputGroup>
                        <Input
                          type="number"
                          name="surfaceArea"
                          id="surfaceArea"
                          onChange={handleInputChangeVitalSignDto}
                          value={vital.surfaceArea}
                          onKeyUp={handleInputValueCheckTemperature}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0rem",
                          }}
                        />
                        <InputGroupText
                          addonType="append"
                          style={{
                            backgroundColor: "#014D88",
                            color: "#fff",
                            border: "1px solid #014D88",
                            borderRadius: "0rem",
                          }}
                        >
                          cm<sup>3</sup>
                        </InputGroupText>
                      </InputGroup>
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label>MUAC</Label>
                      <InputGroup>
                        <Input
                          type="select"
                          name="muac"
                          id="muac"
                          value={vital.muac}
                          onChange={handleInputChangeVitalSignDto}
                        >
                          <option value="">Select</option>
                          <option value="Normal">Normal</option>
                          <option value="Under">Under</option>
                          <option value="Over">Over</option>
                        </Input>
                        <InputGroupText
                          addonType="append"
                          style={{
                            backgroundColor: "#014D88",
                            color: "#fff",
                            border: "1px solid #014D88",
                            borderRadius: "0rem",
                          }}
                        >
                          cm
                        </InputGroupText>
                      </InputGroup>
                    </FormGroup>
                  </div>
                </div>
              )}
              <div className="form-group mb-3 col-md-12">
                <FormGroup>
                  <Label>Clinical Notes</Label>
                  <Input
                    type="textarea"
                    name="clinicalNote"
                    rows="3"
                    cols="50"
                    id="clinicalNote"
                    onChange={handleInputChange}
                    value={objValues.clinicalNote}
                    style={{
                      border: "1px solid #014D88",
                      borderRadius: "0.25rem",
                    }}
                    required
                  />
                </FormGroup>
              </div>
            </div>

            {saving ? <Spinner /> : ""}
            <br />

            <MatButton
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
              disabled={saving}
              style={{ backgroundColor: "#014d88" }}
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
              startIcon={<CancelIcon style={{ color: "#fff" }} />}
              style={{ backgroundColor: "#992E62" }}
            >
              <span style={{ textTransform: "capitalize" }}>Cancel</span>
            </MatButton>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default ArtCommencement;
