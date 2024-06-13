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
} from "reactstrap";
import * as moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import { Card } from "@material-ui/core";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { token, url as baseUrl } from "../../../api";
import "react-phone-input-2/lib/style.css";
import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import "react-phone-input-2/lib/style.css";
import { Button } from "semantic-ui-react";
import { calculate_age_to_number } from "../../../utils";
import { fi } from "date-fns/locale";

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

const TbScreening = (props) => {
  let { age } = props.patientObj;
  const classes = useStyles();
  const [contraindicationDisplay, setcontraindicationDisplay] = useState(false);
  const [tbTreatmentType, setTbTreatmentType] = useState([]);
  const [tbTreatmentOutCome, setTbTreatmentOutCome] = useState([]);
  const [tbScreeningType, setTbScreeningType] = useState([]);
  const [tbScreeningType2, setTbScreeningType2] = useState([]);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const patientAge = calculate_age_to_number(props.patientObj.dateOfBirth);
  const [symptomScreeningKey, setSymptomScreeningKey] =
    useState("Symptom screen");
  const {
    coughing,
    fever,
    nightSweats,
    losingWeight,
    historyWithAdults,
    poorWeightGain,
  } = props.tbObj;

  const booleanInputs = {
    coughing,
    fever,
    nightSweats,
    losingWeight,
    historyWithAdults,
    poorWeightGain,
  };
  const [isAnyYesValue, setIsAnyYesValue] = useState(false);

  const getIsAnyYesValue = () => {
    for (let x in booleanInputs) {
      if (booleanInputs[`${x}`] === "Yes") {
        return setIsAnyYesValue(true);
      } else {
        setIsAnyYesValue(false);
      }
    }
  };
  const [isNoneSelected, setIsNoneSelected] = useState(true);

  const getIsNoneSelected = () => {
    for (let x in booleanInputs) {
      if (booleanInputs[`${x}`]) {
        return setIsNoneSelected(false);
      } else {
        setIsNoneSelected(true);
      }
    }
  };
  const [isAllNoValues, setIsAllNoValues] = useState(true);

  const getIsAllNoValues = () => {
    for (let x in booleanInputs) {
      if (!booleanInputs[`${x}`] || booleanInputs[`${x}`] === "Yes") {
        return setIsAllNoValues(false);
      } else {
        setIsAllNoValues(true);
      }
    }
  };

  useEffect(() => {
    getIsAnyYesValue();
    getIsNoneSelected();
    getIsAllNoValues();
  });

  useEffect(() => {
    if (props.tbObj.tbTreatment === "Yes") {
      alert("here1");

      props.setTbObj((prev) => ({
        ...prev,
        status: "Currently on TB treatment",
      }));
      props.setActiveContent((activeContent) => ({
        ...activeContent,
        showTbTptMonitoring: true,
      }));
    } else if (
      props.tbObj.tbTreatment === "No" &&
      props.tbObj.tbScreeningType === ""
    ) {
      alert("here2");

      props.setTbObj((prev) => ({
        ...prev,
        outcome: "",
        status: "",
      }));
    } else if (
      props.tbObj.tbTreatment === "No" &&
      props.tbObj.tbScreeningType === "Chest X-ray" &&
      props.tbObj.chestXray === ""
    ) {
      alert("here3");

      props.setTbObj((prev) => ({
        ...prev,
        outcome: "",
        status: "",
      }));
    } else if (
      props.tbObj.tbTreatment === "No" &&
      props.tbObj.tbScreeningType === "Chest X-ray" &&
      props.tbObj.chestXray === "X-ray suggestive of TB"
    ) {
      alert("here4");

      props.setTbObj((prev) => ({
        ...prev,
        outcome: "Presumptive TB",
        status: "Presumptive TB referred for evaluation",
      }));
    } else if (
      props.tbObj.tbTreatment === "No" &&
      props.tbObj.tbScreeningType === "Chest X-ray" &&
      props.tbObj.chestXray === "X-ray not suggestive of TB"
    ) {
      alert("here5");

      props.setTbObj((prev) => ({
        ...prev,
        outcome: "Not Presumptive TB",
        status: "No signs and Symptoms of TB",
      }));
    } else if (
      props.tbObj.tbTreatment === "No" &&
      props.tbObj.tbScreeningType === "Symptom screen (alone)" &&
      isAnyYesValue
    ) {
      alert("here6");

      props.setTbObj((prev) => ({
        ...prev,
        outcome: "Presumptive TB",
        status: "Presumptive TB referred for evaluation",
      }));
    } else if (
      props.tbObj.tbTreatment === "No" &&
      props.tbObj.tbScreeningType === "Symptom screen (alone)" &&
      isAllNoValues
    ) {
      alert("here7");

      props.setTbObj((prev) => ({
        ...prev,
        outcome: "Not Presumptive TB",
        status: "No signs and Symptoms of TB",
      }));
    } else if (
      props.tbObj.tbTreatment === "No" &&
      props.tbObj.tbScreeningType === "Symptom screen (alone)" &&
      isNoneSelected
    ) {
      alert("here8");

      props.setTbObj((prev) => ({
        ...prev,
        outcome: "",
        status: "",
      }));
    } else {
      alert("here9");
      props.setTbObj((prev) => ({
        ...prev,
        outcome: "",
        status: "",
      }));
    }
  }, [
    props.tbObj.tbTreatment,
    props.tbObj.coughing,
    props.tbObj.fever,
    props.tbObj.nightSweats,
    props.tbObj.tbScreeningType,
    props.tbObj.eligibleForTPT,
    props.tbObj.outcome,
    props.tbObj.status,
    props.tbObj.losingWeight,
    props.tbObj.chestXray,
    props.tbObj.completionDate,
    props.tbObj.treatementType,
    props.tbObj.tbTreatmentStartDate,
    props.tbObj.treatmentOutcome,
    props.tbObj.treatmentCompletionResult,
    props.tbObj.isTbTestConfirmed,
  ]);
  useEffect(() => {
    console.log("is None selected: ", isNoneSelected);
    TB_TREATMENT_OUTCOME();
    TB_TREATMENT_TYPE();
    TB_SCREENING_TYPE();
  }, []);

  const TB_TREATMENT_TYPE = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/TB_TREATMENT_TYPE`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTbTreatmentType(response.data);
      })
      .catch((error) => {});
  };
  const TB_TREATMENT_OUTCOME = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/TB_TREATMENT_OUTCOME`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTbTreatmentOutCome(response.data);
      })
      .catch((error) => {});
  };

  const TB_SCREENING_TYPE = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/TB_SCREENING_TYPE`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTbScreeningType(response.data);
      })
      .catch((error) => {});
  };

  const handleInputChange = (e) => {
    props.setTbObj({ ...props.tbObj, [e.target.name]: e.target.value });
  };

  const handleInputChangeContrain = (e) => {
    if (e.target.checked) {
      props.setTbObj({ ...props.tbObj, [e.target.name]: e.target.checked });
    } else {
      props.setTbObj({ ...props.tbObj, [e.target.name]: false });
    }
  };

  useEffect(() => {
    if (props.tbObj.chestXray === "Symptom screen (alone)" && isAnyYesValue) {
      props.setTbObj({ ...props.tbObj, outcome: "Presumptive TB" });
    }
  });
  // useEffect(() => {
  //   if (props.tbObj.tbTreatment === "No") {
  //     props.setTbObj((prev) => ({
  //       ...props.tbObj,
  //       tbScreeningType: "",
  //       chestXray: "",
  //     }));
  //   }
  // }, [props.tbObj.tbScreeningType, props.tbObj.chestXray]);
  return (
    <>
      <Card className={classes.root}>
        <CardBody>
          <h2 style={{ color: "#000", fontSize: ".9em" }}>
            TB Treatment/TB Prevention
          </h2>
          <br />
          <form>
            <div className="row">
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>
                    Are you currently on TB treatment?{" "}
                    <span style={{ color: "red" }}> *</span>
                  </Label>
                  <InputGroup>
                    <Input
                      type="select"
                      name="tbTreatment"
                      id="tbTreatment"
                      onChange={handleInputChange}
                      value={props.tbObj.tbTreatment}
                      disabled={props.action === "view" ? true : false}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Input>
                  </InputGroup>
                </FormGroup>
              </div>
              {props.tbObj.tbTreatment === "No" && (
                <>
                  {/* <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label>
                        Are you currently on Tuberculosis Preventive Therapy (
                        TPT ) <span style={{ color: "red" }}> *</span>
                      </Label>
                      <InputGroup>
                        <Input
                          type="select"
                          name="currentlyOnTuberculosis"
                          id="currentlyOnTuberculosis"
                          onChange={handleInputChange}
                          value={props.tbObj.currentlyOnTuberculosis}
                          disabled={props.action === "view" ? true : false}
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Input>
                      </InputGroup>
                    </FormGroup>
                  </div> */}

                  {/* SCREENING TYPE OPTIONS */}
                  <div className="form-group  mb-3 col-md-6">
                    <FormGroup>
                      <Label>Screening Type</Label>
                      <InputGroup>
                        <Input
                          type="select"
                          name="tbScreeningType"
                          id="tbScreeningType"
                          onChange={handleInputChange}
                          disabled={props.action === "view" ? true : false}
                          value={props.tbObj.tbScreeningType}
                        >
                          <option value="">Select</option>
                          {tbScreeningType.map((value) => (
                            <option key={value.id} value={value.display}>
                              {value.display}
                            </option>
                          ))}
                        </Input>
                      </InputGroup>
                    </FormGroup>
                  </div>

                  {/* PREVIOUSLY  ON TPT */}
                  <div className="form-group  mb-3 col-md-6">
                    {/* (props.tbObj.currentlyOnTuberculosis === "Yes" */}
                    {props.tbObj.currentlyOnTuberculosis === "No" && (
                      <FormGroup>
                        <Label>
                          Have you previously completed TPT?{" "}
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="select"
                            name="previouslyCompletedTPT"
                            id="previouslyCompletedTPT"
                            onChange={handleInputChange}
                            value={props.tbObj.previouslyCompletedTPT}
                            disabled={props.action === "view" ? true : false}
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </Input>
                        </InputGroup>
                      </FormGroup>
                    )}
                    {props.tbObj.currentlyOnTuberculosis === "Yes" && (
                      <FormGroup>
                        <Label>
                          Have you previously completed TPT?{" "}
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="select"
                            name="previouslyCompletedTPT"
                            id="previouslyCompletedTPT"
                            onChange={handleInputChange}
                            value={props.tbObj.previouslyCompletedTPT}
                            disabled={props.action === "view" ? true : false}
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </Input>
                        </InputGroup>
                      </FormGroup>
                    )}
                  </div>

                  {/* SCREENING QUESTIONS */}
                  {props.tbObj.tbScreeningType?.includes(
                    symptomScreeningKey
                  ) && (
                    <>
                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>
                            Are you coughing?{" "}
                            <span style={{ color: "red" }}> *</span>
                          </Label>
                          <InputGroup>
                            <Input
                              type="select"
                              name="coughing"
                              id="coughing"
                              onChange={handleInputChange}
                              value={props.tbObj.coughing}
                              disabled={props.action === "view" ? true : false}
                            >
                              <option value="">Select</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </Input>
                          </InputGroup>
                        </FormGroup>
                      </div>

                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>
                            Do you have fever for 2 weeks or more? (Unexplained
                            fever) <span style={{ color: "red" }}> *</span>
                          </Label>
                          <InputGroup>
                            <Input
                              type="select"
                              name="fever"
                              id="fever"
                              onChange={handleInputChange}
                              value={props.tbObj.fever}
                              disabled={props.action === "view" ? true : false}
                            >
                              <option value="">Select</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </Input>
                          </InputGroup>
                        </FormGroup>
                      </div>

                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>
                            Are you having night sweats? (drenching or excessive
                            night sweats)
                            <span style={{ color: "red" }}> *</span>
                          </Label>
                          <InputGroup>
                            <Input
                              type="select"
                              name="nightSweats"
                              id="nightSweats"
                              onChange={handleInputChange}
                              value={props.tbObj.nightSweats}
                              disabled={props.action === "view" ? true : false}
                            >
                              <option value="">Select</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </Input>
                          </InputGroup>
                        </FormGroup>
                      </div>

                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>
                            Are you losing weight? (Unplanned weight loss)
                            <span style={{ color: "red" }}> *</span>
                          </Label>
                          <InputGroup>
                            <Input
                              type="select"
                              name="losingWeight"
                              id="losingWeight"
                              onChange={handleInputChange}
                              value={props.tbObj.losingWeight}
                              disabled={props.action === "view" ? true : false}
                            >
                              <option value="">Select</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </Input>
                          </InputGroup>
                        </FormGroup>
                      </div>
                      {props.tbObj.tbScreeningType ===
                        "Symptom screen (alone)" &&
                        patientAge <= 14 && (
                          <>
                            <div className="form-group mb-3 col-md-6">
                              <FormGroup>
                                <Label>
                                  History of contacts with TB adults
                                  (Paediatrics clients {"<"} 12 months){" "}
                                </Label>
                                <InputGroup>
                                  <Input
                                    type="select"
                                    name="historyWithAdults"
                                    id="historyWithAdults"
                                    onChange={handleInputChange}
                                    value={props.tbObj.historyWithAdults}
                                    disabled={
                                      props.action === "view" ? true : false
                                    }
                                  >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </Input>
                                </InputGroup>
                              </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-6">
                              <FormGroup>
                                <Label>
                                  Poor weight gain (Paediatrics clients {"<"}12
                                  months){" "}
                                </Label>
                                <InputGroup>
                                  <Input
                                    type="select"
                                    name="poorWeightGain"
                                    id="poorWeightGain"
                                    onChange={handleInputChange}
                                    value={props.tbObj.poorWeightGain}
                                    disabled={
                                      props.action === "view" ? true : false
                                    }
                                  >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </Input>
                                </InputGroup>
                              </FormGroup>
                            </div>
                          </>
                        )}

                      {/* <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>
                            Is TB test confirmed positive?{" "}
                            <span style={{ color: "red" }}> *</span>
                          </Label>
                          <InputGroup>
                            <Input
                              type="select"
                              name="isTbTestConfirmed"
                              id="isTbTestConfirmed"
                              onChange={handleInputChange}
                              value={props.tbObj.isTbTestConfirmed}
                              disabled={props.action === "view" ? true : false}
                            >
                              <option value="">Select</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </Input>
                          </InputGroup>
                        </FormGroup>
                      </div> */}
                    </>
                  )}

                  {/* TB SCREENING TYPE === Chest X-ray*/}

                  {props.tbObj.tbScreeningType === "Chest X-ray" && (
                    <>
                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>Chest X-ray Result</Label>
                          <InputGroup>
                            <Input
                              type="select"
                              name="chestXray"
                              id="chestXray"
                              onChange={handleInputChange}
                              disabled={props.action === "view" ? true : false}
                              value={props.tbObj.chestXray}
                            >
                              <option value="">Select</option>
                              <option value="X-ray suggestive of TB">
                                X-ray suggestive of TB
                              </option>
                              <option value="X-ray not suggestive of TB">
                                X-ray not suggestive of TB
                              </option>
                            </Input>
                          </InputGroup>
                        </FormGroup>
                      </div>
                    </>
                  )}
                </>
              )}
              {/* <hr />

              <br />
              <p style={{ color: "black" }}>
                Eligible for IPT:<b>{" " + props.tbObj.eligibleForTPT}</b>
              </p> */}
              <br />
              <hr />

              {props.tbObj.tbTreatment === "No" &&
                props.tbObj.tbScreeningType && (
                  <p className="smooth-transition" style={{ color: "black" }}>
                    TB Screening Outcome:
                    <b> {props.tbObj.outcome}</b>
                  </p>
                )}
              <p className="smooth-transition">
                <span key={1} style={{ display: "inline", color: "black" }}>
                  {" "}
                  TB Status:{" "}
                </span>
                {
                  <span>
                    <b
                      style={{
                        color: props.tbObj.status ? "green" : "red",
                      }}
                    >
                      {props.tbObj.status}
                    </b>{" "}
                  </span>
                }
              </p>
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
};
export default TbScreening;
