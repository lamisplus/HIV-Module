import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FormGroup,
  Label,
  CardBody,
  Spinner,
  Input,
  Form,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import * as moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
// import AddIcon from "@material-ui/icons/Add";
// import CancelIcon from "@material-ui/icons/Cancel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { useHistory } from "react-router-dom";
// import {TiArrowBack} from 'react-icons/ti'
import { token, url as baseUrl } from "../../../../api";
import "react-phone-input-2/lib/style.css";
import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Button } from "semantic-ui-react";
import { Modal } from "react-bootstrap";

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

const BasicInfo = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [errors, setErrors] = useState({});
  let temp = { ...errors };
  useEffect(() => {
    if (props.observation.data && props.observation.data.physicalExamination) {
      setVitalSignDto(props.observation.data.physicalExamination);
    }
  }, [props.observation.data]);
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
    muac: "",
    surfaceArea: "",
    headCircumference: "",
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
  const handleInputChangeVitalSignDto = (e) => {
    setErrors({ ...errors, [e.target.name]: "" });
    setVitalSignDto({ ...vital, [e.target.name]: e.target.value });
    // if(e.target.name==='muac'){
    //     setVitalSignDto ({...vital,  [e.target.name]: e.target.value});
    // } else{
    //     setVitalSignDto ({...vital,  [e.target.name]: e.target.value.replace(/\D/g, '')});
    // }
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
  const handleItemClick = (page, completedMenu) => {
    props.handleItemClick(page);
    if (props.completed.includes(completedMenu)) {
    } else {
      props.setCompleted([...props.completed, completedMenu]);
    }
  };
  const validate = () => {
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
    props.observation.data.physicalExamination = vital;
    //toast.success("Medical history save successful");
    if (validate()) {
      handleItemClick("appearance", "physical-examination");
    }
  };

  return (
    <>
      <Card className={classes.root}>
        <CardBody>
          <h2 style={{ color: "#000" }}>Physical Examination</h2>
          <br />
          <form>
            {/* Medical History form inputs */}
            <div className="row">
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
                <div className="form-group mb-3 col-md-4">
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
                      />
                      <InputGroupText
                        style={{
                          backgroundColor: "#992E62",
                          color: "#fff",
                          border: "1px solid #992E62",
                          borderRadius: "0rem",
                        }}
                      >
                        {vital.height
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
                <div className="form-group mb-3 mt-2 col-md-4">
                  {vital.bodyWeight && vital.height && (
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
                          BMI:{" "}
                          {(
                            vital.bodyWeight /
                            (vital.height / 100) ** 2
                          ).toFixed(1)}
                        </InputGroupText>
                      </InputGroup>
                    </FormGroup>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="form-group mb-3 col-md-8">
                  <FormGroup>
                    <Label>Blood Pressure </Label>
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
                        max="2240"
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
                        type="number"
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
              {props.patientAge <= 14 && (
                <div className="row">
                  <div className=" mb-3 col-md-4">
                    <FormGroup>
                      <Label>Head circumference </Label>
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
                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label>MUAC</Label>
                      <InputGroup>
                        <Input
                          type="select"
                          name="muac"
                          id="muac"
                          onChange={handleInputChangeVitalSignDto}
                          value={vital.muac}
                        >
                          <option value="">Select</option>
                          <option value="Normal">Normal</option>
                          <option value="Under">Under</option>
                          <option value="Over">Over</option>
                        </Input>
                      </InputGroup>
                    </FormGroup>
                  </div>
                </div>
              )}
            </div>
            <br />
            <Button
              content="Back"
              icon="left arrow"
              labelPosition="left"
              style={{ backgroundColor: "#992E62", color: "#fff" }}
              onClick={() => handleItemClick("past-arv", "past-arv")}
            />
            <Button
              content="Next"
              type="submit"
              icon="right arrow"
              labelPosition="right"
              style={{ backgroundColor: "#014d88", color: "#fff" }}
              onClick={handleSubmit}
            />
          </form>
        </CardBody>
      </Card>
    </>
  );
};

export default BasicInfo;
