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
import { useHistory } from "react-router-dom";
// import {TiArrowBack} from 'react-icons/ti'
import { token, url as baseUrl } from "../../../api";
import "react-phone-input-2/lib/style.css";
import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import "react-phone-input-2/lib/style.css";
import { calculate_age_to_number } from "../../../utils";
import { h } from "preact";
import useFacilityId from "../../../hooks/useFacilityId";
import { el } from "date-fns/locale";
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

const TbTreatmentScreening = (props) => {
  const classes = useStyles();
  let errors = props.errors
  const [tbSpecimenType, setTbSpecimenType] = useState([]);
  const [tbDiagnosticTestType, setTbDiagnosticTestType] = useState([]);
  const [chestXrayTest, setChestXrayTest] = useState([]);
  const [treatmentType, setTreatmentType] = useState([]);
  const handleEligibility = (e) => {
    // props.setEligibility({
    //   ...props.eligibility,
    //   [e.target.name]: e.target.value,
    // });
  };
  useEffect(() => {
    TB_DIAGNOSTIC_TEST_TYPE();
    TB_SPECIMEN_TYPE();
    CHEST_X_RAY_TEST_RESULT();
    TB_TREATMENT_TYPE()
  }, []);
  const TB_SPECIMEN_TYPE = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/TB_SPECIMEN_TYPE`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTbSpecimenType(response.data);
      })
      .catch((error) => {});
  };
  const TB_TREATMENT_TYPE = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/TB_TREATMENT_TYPE`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTreatmentType(response.data);
      })
      .catch((error) => {});
  };
  const CHEST_X_RAY_TEST_RESULT = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/CHEST X-RAY_TEST_RESULT`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setChestXrayTest(response.data);
      })
      .catch((error) => {});
  };
  const TB_DIAGNOSTIC_TEST_TYPE = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/TB_DIAGNOSTIC_TEST_TYPE`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTbDiagnosticTestType(response.data);
      })
      .catch((error) => {});
  };

  return (
    <>
      <Card className={classes.root}>
        <CardBody>
          <h2 style={{ color: "#000" }}>TB Diagnosis and Treatment Enrolment: </h2>
          <br />
          
          <form>
            <div className="row">
              <div className="form-group mb-3 col-md-8"></div>
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>Specimen collected status </Label>
                  <InputGroup>
                    <Input
                      type="select"
                      name="specimentCollectedStatus"
                      id="specimentCollectedStatus"
                      onChange={props.handleInputChange}
                      value={props.tbObj.specimentCollectedStatus}
                      disabled={props.action === "view" ? true : false}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Input>
                  </InputGroup>
                  {errors.specimentCollectedStatus !== "" ? (
                      <span className={classes.error}>{errors.specimentCollectedStatus}</span>
                  ) : (
                      ""
                  )}
                </FormGroup>
              </div>
              {props.tbObj.specimentCollectedStatus==='Yes' && (<>
                
                <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>Specimen Sent Status</Label>
                  <InputGroup>
                    <Input
                      type="select"
                      name="specimentSent"
                      id="specimentSent"
                      onChange={props.handleInputChange}
                      value={props.tbObj.specimentSent}
                      disabled={props.action === "view" ? true : false}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Input>
                  </InputGroup>
                  {errors.specimentSent !== "" ? (
                      <span className={classes.error}>{errors.specimentSent}</span>
                  ) : (
                      ""
                  )}
                </FormGroup>
              </div>
                
              </>)}
              {props.tbObj.specimentSent==='Yes' && (<>
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>Specimen Type </Label>
                  <InputGroup>
                    <Input
                      type="select"
                      name="specimenType"
                      id="specimenType"
                      disabled={props.action === "view" ? true : false}
                      onChange={props.handleInputChange}
                      value={props.tbObj.specimenType}
                    >
                      <option value="">Select</option>
                      {tbSpecimenType.map((value) => (
                        <option key={value.id} value={value.display}>
                          {value.display}
                        </option>
                      ))}
                    </Input>
                  </InputGroup>
                  {errors.specimenType !== "" ? (
                      <span className={classes.error}>{errors.specimenType}</span>
                  ) : (
                      ""
                  )}
                </FormGroup>
                </div>
                </>)}
              {/* To Be Reviewed */}
              {props.tbObj.specimentSent==='Yes' && (<>
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>Date Specimen Was Sent</Label>
                  <InputGroup>
                    <Input
                      type="date"
                      name="dateSpecimenSent"
                      id="dateSpecimenSent"
                      value={props.tbObj.dateSpecimenSent}
                      onChange={props.handleInputChange}
                      min={props.dateOfObservation}
                      max={moment(new Date()).format("YYYY-MM-DD")}
                      // disabled={props.action === "view" ? true : false}
                      onKeyPress={(e) => e.preventDefault()}
                    />
                  </InputGroup>
                  {errors.dateSpecimenSent !== "" ? (
                      <span className={classes.error}>{errors.dateSpecimenSent}</span>
                  ) : (
                      ""
                  )}
                </FormGroup>
                {/* )} */}
              </div>
              </>)}
              {props.tbObj.specimentSent==='Yes' && (<>
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>Diagnostic Test Done</Label>
                  <InputGroup>
                    <Input
                      type="select"
                      name="diagnosticTestDone"
                      id="diagnosticTestDone"
                      onChange={props.handleInputChange} 
                      value={props.tbObj.diagnosticTestDone}
                      disabled={props.action === "view" ? true : false}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Input>
                  </InputGroup>
                  {errors.diagnosticTestDone !== "" ? (
                      <span className={classes.error}>{errors.diagnosticTestDone}</span>
                  ) : (
                      ""
                  )}
                </FormGroup>
              </div>
              </>)}
              {props.tbObj.diagnosticTestDone==='Yes' && (<>
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>Date Of Diagnostic Test </Label>
                  <InputGroup>
                    <Input
                      type="date"
                      name="dateOfDiagnosticTest"
                      id="dateOfDiagnosticTest"
                      onChange={props.handleInputChange}
                      value={props.tbObj.dateOfDiagnosticTest}
                      min={props.tbObj.dateSpecimenSent}
                      max={moment(new Date()).format("YYYY-MM-DD")}
                      disabled={props.action === "view" ? true : false}
                      onKeyPress={(e) => e.preventDefault()}
                    >
                     
                    </Input>
                  </InputGroup>
                  {errors.dateOfDiagnosticTest !== "" ? (
                      <span className={classes.error}>{errors.dateOfDiagnosticTest}</span>
                  ) : (
                      ""
                  )}
                </FormGroup>
              </div>
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>Diagnostic Test Type </Label>
                  <InputGroup>
                    <Input
                      type="select"
                      name="diagnosticTestType"
                      id="diagnosticTestType"
                      onChange={props.handleInputChange}
                      value={props.tbObj.diagnosticTestType}
                      disabled={props.action === "view" ? true : false}
                    >
                      <option value="">Select</option>
                      {tbDiagnosticTestType.map((value) => (
                        <option key={value.id} value={value.display}>
                          {value.display}
                        </option>
                      ))}
                    </Input>
                  </InputGroup>
                  {errors.diagnosticTestType !== "" ? (
                      <span className={classes.error}>{errors.diagnosticTestType}</span>
                  ) : (
                      ""
                  )}
                </FormGroup>
              </div>
                {props.tbObj.specimentSent==='Yes' && props.tbObj.diagnosticTestDone==='Yes' && (<>
                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label> Date Diagnostic Test result received</Label>
                      <InputGroup>
                        <Input
                            type="date"
                            name="DateDiagnosticTestResultReceived"
                            id="DateDiagnosticTestResultReceived"
                            onChange={props.handleInputChange}
                            value={props.tbObj.DateDiagnosticTestResultReceived}
                            disabled={props.action === "view" ? true : false}
                            min={props.tbObj.dateOfDiagnosticTest}
                            max={moment(new Date()).format("YYYY-MM-DD")}
                            onKeyPress={(e) => e.preventDefault()}
                        >
                        </Input>
                      </InputGroup>
                      {/*{errors.DateDiagnosticTestResultReceived !== "" ? (*/}
                      {/*    <span className={classes.error}>{errors.DateDiagnosticTestResultReceived}</span>*/}
                      {/*) : (*/}
                      {/*    ""*/}
                      {/*)}*/}
                    </FormGroup>
                  </div>
                </>)}
              </>)}
              {(props.tbObj.diagnosticTestType==='Truenat' || props.tbObj.diagnosticTestType==='GeneXpert')   && (<>
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>TB Test Result </Label>
                  <InputGroup>
                    <Input
                        type="select"
                        name="tbTestResult"
                        id="tbTestResult"
                        onChange={props.handleInputChange}
                        value={props.tbObj.tbTestResult}
                        disabled={props.action === "view" ? true : false}
                    >
                      <option value="">Select</option>
                      <option value="MTB not detected">MTB not detected</option>
                      <option value="MTB detected RR not detected">MTB detected RR not detected</option>
                      <option value="MTB detected RR detected">MTB detected RR detected</option>
                      <option value="MTB trace RR indeterminate">MTB trace RR indeterminate</option>
                      <option value="Error">Error</option>
                      <option value="Invalid">Invalid</option>
                      <option value="Incomplete">Incomplete</option>
                    </Input>
                  </InputGroup>
                  {errors.tbTestResult !== "" ? (
                      <span className={classes.error}>{errors.tbTestResult}</span>
                  ) : (
                      ""
                  )}
                </FormGroup>
              </div> 
              </>)}
              {props.tbObj.diagnosticTestType==='Cobas'  && (<>
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>TB Test Result </Label>
                  <InputGroup>
                    <Input
                      type="select"
                      name="tbTestResult"
                      id="tbTestResult"
                      onChange={props.handleInputChange}
                      value={props.tbObj.tbTestResult}
                      disabled={props.action === "view" ? true : false}
                    >
                      <option value="">Select</option>
                      <option value="MTB not detected">MTB not detected</option>
                      <option value="MTB detected RIF/INH not detected">MTB detected RIF/INH not detected</option>
                      <option value="MTB detected RIF detected">MTB detected RIF detected</option>
                      <option value="MTB detected INH detected">MTB detected INH detected </option>
                      <option value="MTB detected RIF&INH detected">MTB detected RIF&INH detected </option>
                    </Input>
                  </InputGroup>
                  {errors.tbTestResult !== "" ? (
                      <span className={classes.error}>{errors.tbTestResult}</span>
                  ) : (
                      ""
                  )}
                </FormGroup>
              </div>
              </>)}
              {(props.tbObj.diagnosticTestType==='TB-LAMP' || props.tbObj.diagnosticTestType==='LF-LAM' ||  props.tbObj.diagnosticTestType==='Smear Microscopy')   && (<>
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>TB Test Result </Label>
                  <InputGroup>
                    <Input
                      type="select"
                      name="tbTestResult"
                      id="tbTestResult"
                      onChange={props.handleInputChange}
                      value={props.tbObj.tbTestResult}
                      disabled={props.action === "view" ? true : false}
                    >
                      <option value="">Select</option>
                      <option value="Positive">Positive</option>
                      <option value="Negative">Negative</option>
                    </Input>
                  </InputGroup>
                  {errors.tbTestResult !== "" ? (
                      <span className={classes.error}>{errors.tbTestResult}</span>
                  ) : (
                      ""
                  )}
                </FormGroup>
              </div>
              </>)}

              {/*{((props.tbObj.diagnosticTestType==='GeneXpert' ||*/}
              {/*props.tbObj.diagnosticTestType==='Truenat' || props.tbObj.diagnosticTestType==='Cobas' || props.tbObj.diagnosticTestType==='TB-LAMP' || props.tbObj.diagnosticTestType==='Smear Microscopy' || (props.tbObj.diagnosticTestType || "").includes("LF-LAM")) &&*/}
              {/*(props.tbObj.tbTestResult==='MTB not detected' ||*/}
              {/*props.tbObj.tbTestResult==='Negative')*/}

              {/*)   && (<>*/}
              {/*<div className="form-group mb-3 col-md-6">*/}
              {/*  <FormGroup>*/}
              {/*    <Label>Clinically Evaluated </Label>*/}
              {/*    <InputGroup>*/}
              {/*      <Input*/}
              {/*        type="select"*/}
              {/*        name="clinicallyEvaulated"*/}
              {/*        id="clinicallyEvaulated"*/}
              {/*        onChange={props.handleInputChange}*/}
              {/*        value={props.tbObj.clinicallyEvaulated}*/}
              {/*        disabled={props.action === "view" ? true : false}*/}
              {/*      >*/}
              {/*        <option value="">Select</option>*/}
              {/*        <option value="Yes">Yes</option>*/}
              {/*        <option value="No">No</option>*/}
              {/*      </Input>*/}
              {/*    </InputGroup>*/}
              {/*    {errors.clinicallyEvaulated !== "" ? (*/}
              {/*        <span className={classes.error}>{errors.clinicallyEvaulated}</span>*/}
              {/*    ) : (*/}
              {/*        ""*/}
              {/*    )}*/}
              {/*  </FormGroup>*/}
              {/*</div>*/}
              {/* </>)}*/}

              {(((props.tbObj.diagnosticTestType==='GeneXpert' ||
                      props.tbObj.diagnosticTestType==='Truenat' || props.tbObj.diagnosticTestType==='Cobas' || props.tbObj.diagnosticTestType==='TB-LAMP' || props.tbObj.diagnosticTestType==='Smear Microscopy' || ["LF-LAM"].includes(props.tbObj.diagnosticTestType)) &&
                  (props.tbObj.tbTestResult==='MTB not detected' ||
                      props.tbObj.tbTestResult==='Negative')) || (props.tbObj.specimentSent || "").toLowerCase() === 'no'

              )   && (
                  <>
                <div className="form-group mb-3 col-md-6">
                  <FormGroup>
                    <Label>Clinically Evaluated </Label>
                    <InputGroup>
                      <Input
                          type="select"
                          name="clinicallyEvaulated"
                          id="clinicallyEvaulated"
                          onChange={props.handleInputChange}
                          value={props.tbObj.clinicallyEvaulated}
                          disabled={props.action === "view" ? true : false}
                      >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </Input>
                    </InputGroup>
                    {errors.clinicallyEvaulated !== "" ? (
                        <span className={classes.error}>{errors.clinicallyEvaulated}</span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>

                  </>

              )}

              {/*{((props.tbObj.diagnosticTestType==='GeneXpert' || */}
              {/*props.tbObj.diagnosticTestType==='Truenat' || props.tbObj.diagnosticTestType==='Cobas' || props.tbObj.diagnosticTestType==='TB-LAMP' || props.tbObj.diagnosticTestType==='Smear Microscopy' || props.tbObj.diagnosticTestType==='LF-LAM') &&*/}
              {/*(props.tbObj.tbTestResult==='MTB not detected' ||*/}
              {/*props.tbObj.tbTestResult==='Negative' )*/}

              {(((props.tbObj.diagnosticTestType === 'GeneXpert' ||
                          props.tbObj.diagnosticTestType === 'Truenat' || props.tbObj.diagnosticTestType === 'Cobas' || props.tbObj.diagnosticTestType === 'TB-LAMP' || props.tbObj.diagnosticTestType === 'Smear Microscopy' || ["LF-LAM"].includes(props.tbObj.diagnosticTestType)) &&
                      (props.tbObj.tbTestResult === 'MTB not detected' ||
                          props.tbObj.tbTestResult === 'Negative')) || (props.tbObj.specimentSent || "").toLowerCase() === 'no'

              ) && (
                  <>
                    { props.tbObj.clinicallyEvaulated === "Yes" &&
                        <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>Chest X-Ray Done </Label>
                  <InputGroup>
                    <Input
                      type="select"
                      name="chestXrayDone"
                      id="chestXrayDone"
                      onChange={props.handleInputChange}
                      value={props.tbObj.chestXrayDone}
                      disabled={props.action === "view" ? true : false}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Input>
                  </InputGroup>
                  {errors.chestXrayDone !== "" ? (
                      <span className={classes.error}>{errors.chestXrayDone}</span>
                  ) : (
                      ""
                  )}
                </FormGroup>
              </div>
                    }
                    {
                        props.tbObj?.clinicallyEvaulated === "Yes" &&
                        props.tbObj?.specimentSent === 'No' &&
                        props.tbObj?.chestXrayDone === "No"
                        &&
                        <div className="form-group mb-3 col-md-6">
                          <FormGroup>
                            <Label>Result of clinical evaluation </Label>
                            <InputGroup>
                              <Input
                                  type="select"
                                  name="resultOfClinicalEvaluation"
                                  id="resultOfClinicalEvaluation"
                                  onChange={props.handleInputChange}
                                  value={props.tbObj.resultOfClinicalEvaluation}
                                  disabled={props.action === "view" ? true : false}
                              >
                                <option value="">Select</option>
                                <option value="Suggestive of TB">Suggestive of TB</option>
                                <option value="Not suggestive of TB">Not suggestive of TB</option>
                              </Input>
                            </InputGroup>
                            {/*{errors.clinicallyEvaulated !== "" ? (*/}
                            {/*    <span className={classes.error}>{errors.clinicallyEvaulated}</span>*/}
                            {/*) : (*/}
                            {/*    ""*/}
                            {/*)}*/}
                          </FormGroup>
                        </div>

                    }
              </>)}
              {props.tbObj.chestXrayDone==='Yes' && (<>
                  <div className="form-group mb-3 col-md-6">
                   <FormGroup>
                  <Label>Chest X-ray Result </Label>
                  <InputGroup>
                    <Input
                      type="select"
                      name="chestXrayResultTest"
                      id="chestXrayResultTest"
                      onChange={props.handleInputChange}
                      value={props.tbObj.chestXrayResultTest}
                      disabled={props.action === "view" ? true : false}
                    >
                      <option value="">Select</option>
                      {chestXrayTest.map((value) => (
                        <option key={value.id} value={value.display}>
                          {value.display}
                        </option>
                      ))}
                      
                    </Input>
                  </InputGroup>
                  {errors.chestXrayResultTest !== "" ? (
                      <span className={classes.error}>{errors.chestXrayResultTest}</span>
                  ) : (
                      ""
                  )}
                </FormGroup>
                </div>
                 <div className="form-group mb-3 col-md-6">
                  <FormGroup>
                  <Label>Date of Chest X-ray </Label>
                  <InputGroup>
                    <Input
                      type="date"
                      name="dateOfChestXrayResultTestDone"
                      id="dateOfChestXrayResultTestDone"
                      onChange={props.handleInputChange}
                      value={props.tbObj.dateOfChestXrayResultTestDone}
                      min={props.tbObj.dateOfDiagnosticTest}
                      max={moment(new Date()).format("YYYY-MM-DD")}
                      disabled={props.action === "view" ? true : false}
                      onKeyPress={(e) => e.preventDefault()}
                    >
                    </Input>
                  </InputGroup>
                  {errors.dateOfDiagnosticTest !== "" ? (
                      <span className={classes.error}>{errors.dateOfDiagnosticTest}</span>
                  ) : (
                      ""
                  )}
                </FormGroup>
                </div>
              </>)}
              {(
                props.tbObj.tbTestResult==='MTB detected RIF detected' ||
                props.tbObj.tbTestResult==='MTB detected RIF&INH detected' ||
                props.tbObj.tbTestResult=== 'MTB detected RR detected' ||
                props.tbObj.tbTestResult ==='MTB detected RR not detected' ||
                props.tbObj.tbTestResult ==='MTB trace RR indeterminate' ||
                props.tbObj.tbTestResult ==='MTB detected INH detected' ||
                  props.tbObj.tbTestResult === "MTB detected RIF/INH not detected" ||
                props.tbObj.tbTestResult === "Positive" ||
                props.tbObj.chestXrayResultTest ==='Suggestive of TB'
                )  && (<> 
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>TB Type </Label>
                  <InputGroup>
                    <Input
                      type="select"
                      name="tbType"
                      id="tbType"
                      onChange={props.handleInputChange}
                      value={props.tbObj.tbType}
                      disabled={props.action === "view" ? true : false}
                    >
                      <option value="">Select</option>
                      {treatmentType.map((value) => (
                        <option key={value.id} value={value.display}>
                          {value.display}
                        </option>
                      ))}
                    </Input>
                  </InputGroup>
                  {errors.tbType !== "" ? (
                      <span className={classes.error}>{errors.tbType}</span>
                  ) : (
                      ""
                  )}
                </FormGroup>
              </div>
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>TB Treatment Started</Label>
                  <InputGroup>
                    <Input
                      type="select"
                      name="tbTreatmentStarted"
                      id="tbTreatmentStarted"
                      onChange={props.handleInputChange}
                      value={props.tbObj.tbTreatmentStarted}
                      disabled={props.action === "view" ? true : false}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Input>
                  </InputGroup>
                  {errors.tbTreatmentStarted !== "" ? (
                      <span className={classes.error}>{errors.tbTreatmentStarted}</span>
                  ) : (
                      ""
                  )}
                </FormGroup>
              </div>

                {props.tbObj.tbTreatmentStarted === "Yes" && <div className="form-group mb-3 col-md-6">
                  <FormGroup>
                    <Label>TB Treatment Start Date </Label>
                    <InputGroup>
                      <Input
                          type="date"
                          name="tbTreatmentStartDate"
                          id="tbTreatmentStartDate"
                          onChange={props.handleInputChange}
                          min={props.tbObj.DateDiagnosticTestResultReceived}
                          max={moment(new Date()).format("YYYY-MM-DD")}
                          value={props.tbObj.tbTreatmentStartDate}
                          disabled={props.action === "view" ? true : false}
                          onKeyPress={(e) => e.preventDefault()}
                      >

                      </Input>
                    </InputGroup>
                    {errors.tbTreatmentStartDate !== "" ? (
                        <span className={classes.error}>{errors.tbTreatmentStartDate}</span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>}
              </>)}
             
            </div>
            <br />
            {(props.tbObj.tbTreatment!=='Yes' ) && (<>
                <p style={{ color: "black" }}>
                TB Evaluation Outcome:<b>{" " + props.tbObj.tbEvaulationOutcome}</b>
                </p>
              </>)}
          </form>
        </CardBody>
      </Card>
    </>
  );
};

export default TbTreatmentScreening;
