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
  Col,
} from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
// import AddIcon from "@material-ui/icons/Add";
// import CancelIcon from "@material-ui/icons/Cancel";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { useHistory } from "react-router-dom";
// import {TiArrowBack} from 'react-icons/ti'
import { token, url as baseUrl } from "../../../api";
import "react-phone-input-2/lib/style.css";
import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import "react-phone-input-2/lib/style.css";
import { Button } from "semantic-ui-react";
import moment from "moment";
import DualListBox from "react-dual-listbox";

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
    maxWidth: 752,
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

const optionsHTNRegiment = [
  {
    value: " Amiloride + hydrochlorothiazide",
    label: "Amiloride + hydrochlorothiazide",
  },
  {
    value: "Amlodipine",
    label: "Amlodipine",
  },

  {
    value: "Aspirin",
    label: "Aspirin",
  },
  {
    value: "Atenolol ",
    label: "Atenolol ",
  },
  {
    value: "Bendrofluazide",
    label: "Bendrofluazide",
  },
  {
    value: "Captopril",
    label: "Captopril",
  },
  {
    value: "Enalapril",
    label: "Enalapril",
  },
  {
    value: "Hydrochlorothiazide",
    label: "Hydrochlorothiazide",
  },
  {
    value: "Hydralazine",
    label: "Hydralazine",
  },
  {
    value: "Indapamine",
    label: "Indapamine",
  },
  {
    value: "Labetalol",
    label: "Labetalol",
  },
  {
    value: "Lisinopril",
    label: "Lisinopril",
  },
  {
    value: "Losartan",
    label: "Losartan",
  },
  {
    value: "Methyldopa",
    label: "Methyldopa",
  },
  {
    value: "Nifedipine",
    label: "Nifedipine",
  },
  {
    value: "Propanolol",
    label: "Propanolol",
  },
  {
    value: "Telmisartan",
    label: "Telmisartan",
  },
  { value: "Others", label: "Others" },
];

const ChronicConditions = (props) => {
  const classes = useStyles();
  //const history = useHistory();
  const [errors, setErrors] = useState({});
  const [selected, setSelected] = useState([]);
  const [selected2, setSelected2] = useState([]);

const handleInputChangeHtnRegimenAtStart = (selectedValues) => {
  const updatedChronicConditions = {
    ...props.chronicConditions,
    htnRegimenAtStart: selectedValues,
  };

  props.setChronicConditions(updatedChronicConditions);
};

const handleInputChangeCurrentHtnRegimen = (selectedValues) => {
  const updatedChronicConditions = {
    ...props.chronicConditions,
    currentHtnRegimen: selectedValues,
  };

  props.setChronicConditions(updatedChronicConditions);
};
  
     const handleInputChange = (e) => {
       props.setChronicConditions({
         ...props.chronicConditions,
         [e.target.name]: e.target.value,
       });
     };

  let temp = { ...errors };



 

  return (
    <>
      <Card>
        <CardBody>
          <h2 style={{ color: "#000" }}>
            Screening for Chronic Conditions(Hypertension)
          </h2>
          <br />
          <form>
            {/* Medical History form inputs */}
            <div className="row">
              <div className="form-group mb-3 col-md-8"></div>
              {props.isHypertensive != "" && props.isHypertensive === true ? (
                <>
                  <div className="row">
                    {/* <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          First time identified within the programme?
                        </Label>
                        <Input
                          type="select"
                          name="firstTimeHypertensive"
                          id="firstTimeHypertensive"
                          onChange={handleInputChange}
                          value={props.chronicConditions.firstTimeHypertensive}
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Input>
                      </FormGroup>
                    </div> */}
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
                              max="2240"
                              onChange={handleInputChange}
                              value={props.chronicConditions.systolic}
                              //onKeyUp={handleInputValueCheckSystolic}
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
                              onChange={handleInputChange}
                              value={props.chronicConditions.diastolic}
                              //onKeyUp={handleInputValueCheckDiastolic}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0rem",
                              }}
                            />
                          </InputGroup>
                        </FormGroup>
                      </div>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>BP above 140/80mmHg?</Label>
                        <Input
                          type="select"
                          name="bp"
                          id="bp"
                          onChange={handleInputChange}
                          value={props.chronicConditions.bp}
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Input>
                      </FormGroup>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="row">
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>Known Hypertensive </Label>
                        <Input
                          type="select"
                          name="hypertensive"
                          id="hypertensive"
                          onChange={handleInputChange}
                          value={props.chronicConditions.hypertensive}
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Input>
                      </FormGroup>
                    </div>

                    {/* <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          First time identified within the programme?
                        </Label>
                        <Input
                          type="select"
                          name="firstTimeHypertensive"
                          id="firstTimeHypertensive"
                          onChange={handleInputChange}
                          value={props.chronicConditions.firstTimeHypertensive}
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Input>
                      </FormGroup>
                    </div> */}
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
                              max="2240"
                              onChange={handleInputChange}
                              value={props.chronicConditions.systolic}
                              //onKeyUp={handleInputValueCheckSystolic}
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
                              onChange={handleInputChange}
                              value={props.chronicConditions.diastolic}
                              //onKeyUp={handleInputValueCheckDiastolic}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0rem",
                              }}
                            />
                          </InputGroup>
                        </FormGroup>
                      </div>
                    </div>

                    <div className="row">
                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>BP above 140/80mmHg?</Label>
                          <Input
                            type="select"
                            name="bp"
                            id="bp"
                            onChange={handleInputChange}
                            value={props.chronicConditions.bp}
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </Input>
                        </FormGroup>
                      </div>

                      {props.chronicConditions.hypertensive === "Yes" && (
                        <>
                          <Col>
                            <FormGroup>
                              <Label for="dateofStartOfHTNTreatment">
                                Date of start of HTN Treatment{" "}
                              </Label>
                              {""}
                              <span style={{ color: "red" }}> *</span>
                              <Input
                                type="date"
                                name="dateofStartOfHTNTreatment"
                                id="dateofStartOfHTNTreatment"
                                value={
                                  props.chronicConditions
                                    .dateofStartOfHTNTreatment
                                }
                                min={moment(
                                  props.chronicConditions
                                    .dateofStartOfHTNTreatment
                                ).format("YYYY-MM-DD")}
                                max={moment(new Date()).format("YYYY-MM-DD")}
                                onChange={handleInputChange}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.25rem",
                                }}
                                required
                                onKeyPress={(e) => e.preventDefault()}
                              />
                            </FormGroup>
                          </Col>

                          <hr />

                          <FormGroup>
                            <Label>HTN Regimen at Start</Label>
                            <DualListBox
                              value={props.chronicConditions.htnRegimenAtStart}
                              options={optionsHTNRegiment}
                              onChange={(value) =>
                                handleInputChangeHtnRegimenAtStart(value)
                              }
                              selected={
                                props.chronicConditions.htnRegimenAtStart
                              }
                            />
                          </FormGroup>

                          <FormGroup>
                            <Label>Current HTN Regimen</Label>
                            <DualListBox
                              value={props.chronicConditions.currentHtnRegimen}
                              options={optionsHTNRegiment}
                              onChange={(value) =>
                                handleInputChangeCurrentHtnRegimen(value)
                              }
                              selected={
                                props.chronicConditions.currentHtnRegimen
                              }
                            />
                          </FormGroup>

                          <Col>
                            <FormGroup>
                              <Label for="dateofStartOfHTNTreatment">
                                Last HTN Medication Pickup Date{" "}
                              </Label>
                              {""}
                              <span style={{ color: "red" }}> *</span>
                              <Input
                                type="date"
                                name="lastHTNMedicationPickupDate"
                                id="lastHTNMedicationPickupDate"
                                value={
                                  props.chronicConditions
                                    .lastHTNMedicationPickupDate
                                }
                                min={moment(
                                  props.chronicConditions
                                    .lastHTNMedicationPickupDate
                                ).format("YYYY-MM-DD")}
                                max={moment(new Date()).format("YYYY-MM-DD")}
                                onChange={handleInputChange}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.25rem",
                                }}
                                required
                                onKeyPress={(e) => e.preventDefault()}
                              />
                            </FormGroup>
                          </Col>

                          <Col>
                            <FormGroup>
                              <Label>Duration of HTN Drug Refill (Days)</Label>
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
                                  Duration of HTN Drug Refill
                                </InputGroupText>
                                <Input
                                  type="number"
                                  name="durationOfHtnDrugRefill"
                                  id="durationOfHtnDrugRefill"
                                  min="90"
                                  max="2240"
                                  onChange={handleInputChange}
                                  value={
                                    props.chronicConditions
                                      .durationOfHtnDrugRefill
                                  }
                                  //onKeyUp={handleInputValueCheckSystolic}
                                  style={{
                                    border: "1px solid #014D88",
                                    borderRadius: "0rem",
                                  }}
                                />
                              </InputGroup>
                            </FormGroup>
                          </Col>

                          <Col>
                            <FormGroup>
                              <Label>Current HTN Status</Label>
                              <Input
                                type="select"
                                name="currentHtnStatus"
                                id="currentHtnStatus"
                                onChange={handleInputChange}
                                value={props.chronicConditions.currentHtnStatus}
                              >
                                <option value="">Select</option>
                                <option value="Currently on HTN Treatment">
                                  Currently on HTN Treatment
                                </option>
                                <option value="Interrupted Treatment">
                                  Interrupted Treatment
                                </option>
                                <option value="Stopped">Stopped</option>
                                <option value="Dead">Dead</option>
                              </Input>
                            </FormGroup>
                          </Col>

                          <div className="row">
                            <Col>
                              <FormGroup>
                                <Label for="dateofStartOfHTNTreatment">
                                  Date of Current HTN Status{" "}
                                </Label>
                                {""}
                                <span style={{ color: "red" }}> *</span>
                                <Input
                                  type="date"
                                  name="dateOfCurrentHtnStatus"
                                  id="dateOfCurrentHtnStatus"
                                  value={
                                    props.chronicConditions
                                      .dateOfCurrentHtnStatus
                                  }
                                  min={moment(
                                    props.chronicConditions
                                      .dateOfCurrentHtnStatus
                                  ).format("YYYY-MM-DD")}
                                  max={moment(new Date()).format("YYYY-MM-DD")}
                                  onChange={handleInputChange}
                                  style={{
                                    border: "1px solid #014D88",
                                    borderRadius: "0.25rem",
                                  }}
                                  required
                                  onKeyPress={(e) => e.preventDefault()}
                                />
                              </FormGroup>
                            </Col>
                            <Col>
                              <FormGroup>
                                <Label for="dateofStartOfHTNTreatment">
                                  Reasons for Stopped/IIT{" "}
                                </Label>
                                {""}

                                <Input
                                  type="text"
                                  name="reasonForStoppedIIT"
                                  id="reasonForStoppedIIT"
                                  value={
                                    props.chronicConditions.reasonForStoppedIIT
                                  }
                                  onChange={handleInputChange}
                                  style={{
                                    border: "1px solid #014D88",
                                    borderRadius: "0.25rem",
                                  }}
                                  required
                                />
                              </FormGroup>
                            </Col>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
};

export default ChronicConditions;
