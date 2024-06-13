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
import { Button } from "semantic-ui-react";

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

const TPT = (props) => {
  const classes = useStyles();
  //const [errors, setErrors] = useState({});
  const [adherence, setAdherence] = useState([]);
  const [tbTreatmentType, setTbTreatmentType] = useState([]);
  const [tbTreatmentOutCome, setTbTreatmentOutCome] = useState([]);

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
  useEffect(() => {
    TB_TREATMENT_TYPE();
    TB_TREATMENT_OUTCOME();
    CLINIC_VISIT_LEVEL_OF_ADHERENCE();
  }, []);
  //Get list of CLINIC_VISIT_LEVEL_OF_ADHERENCE
  const CLINIC_VISIT_LEVEL_OF_ADHERENCE = () => {
    axios
      .get(
        `${baseUrl}application-codesets/v2/CLINIC_VISIT_LEVEL_OF_ADHERENCE`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setAdherence(response.data);
      })
      .catch((error) => {});
  };
  //let temp = { ...errors }

  //Handle CheckBox
  const handleTpt = (e) => {
    props.setErrors({ ...props.errors, [e.target.name]: "" });
    props.setTpt({ ...props.tpt, [e.target.name]: e.target.value });
    //making the field to be empty once the selection logic is apply(skip logic)
    if (e.target.name === "outComeOfIpt" && e.target.value === "") {
      props.tpt.date = " ";
      props.setTpt({ ...props.tpt, ["date"]: "" });
      props.setTpt({ ...props.tpt, [e.target.name]: e.target.value });
    }
  };

  return (
    <>
      <Card className={classes.root}>
        <CardBody>
          <h2 style={{ color: "#000" }}>TB/TPT Monitoring</h2>
          <br />
          <form>
            <div className="row">
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>Weight</Label>
                  <InputGroup>
                    <Input
                      type="text"
                      name="weight"
                      id="weight"
                      onChange={handleTpt}
                      value={props.tpt.weight}
                      disabled={props.action === "view" ? true : false}
                    ></Input>
                  </InputGroup>
                </FormGroup>
              </div>
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>
                    TB Symptoms (cough, fever, night sweats, weight
                    loss,contacts)
                  </Label>
                  <InputGroup>
                    <Input
                      type="select"
                      name="tbSymptoms"
                      id="tbSymptoms"
                      onChange={handleTpt}
                      value={props.tpt.tbSymptoms}
                      disabled={props.action === "view" ? true : false}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Uncertain">Uncertain</option>
                    </Input>
                  </InputGroup>
                </FormGroup>
              </div>
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>
                    Hepatitis Symptoms (Abdominal pain, nausea, vomiting,
                    abnormal LFTs, Children: persistent irritability, yellowish
                    urine and eyes)
                  </Label>
                  <InputGroup>
                    <Input
                      type="select"
                      name="hepatitisSymptoms"
                      id="hepatitisSymptoms"
                      onChange={handleTpt}
                      disabled={props.action === "view" ? true : false}
                      value={props.tpt.hepatitisSymptoms}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Uncertain">Uncertain</option>
                    </Input>
                  </InputGroup>
                </FormGroup>
              </div>
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>
                    Neurologic Symptoms (Numbness, tingling, paresthesias)
                  </Label>
                  <InputGroup>
                    <Input
                      type="select"
                      name="neurologicSymptoms"
                      id="neurologicSymptoms"
                      onChange={handleTpt}
                      disabled={props.action === "view" ? true : false}
                      value={props.tpt.neurologicSymptoms}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Uncertain">Uncertain</option>
                    </Input>
                  </InputGroup>
                </FormGroup>
              </div>

              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>Rash </Label>
                  <InputGroup>
                    <Input
                      type="select"
                      name="rash"
                      id="rash"
                      onChange={handleTpt}
                      value={props.tpt.rash}
                      disabled={props.action === "view" ? true : false}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Uncertain">Uncertain</option>
                    </Input>
                  </InputGroup>
                </FormGroup>
              </div>
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>
                    Adherence ( {">"} 80% doses = Good
                    {"<"} 80% doses = bad )
                  </Label>
                  <InputGroup>
                    <Input
                      type="select"
                      name="adherence"
                      id="adherence"
                      onChange={handleTpt}
                      value={props.tpt.adherence}
                      disabled={props.action === "view" ? true : false}
                    >
                      <option value="">Select</option>
                      {adherence.map((value) => (
                        <option key={value.id} value={value.display}>
                          {value.display}
                        </option>
                      ))}
                    </Input>
                  </InputGroup>
                </FormGroup>
              </div>
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>Referred for further services</Label>
                  <InputGroup>
                    <Input
                      type="select"
                      name="referredForServices"
                      id="referredForServices"
                      onChange={handleTpt}
                      value={props.tpt.referredForServices}
                      disabled={props.action === "view" ? true : false}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Uncertain">Uncertain</option>
                    </Input>
                  </InputGroup>
                </FormGroup>
              </div>
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>Outcome of IPT</Label>
                  <InputGroup>
                    <Input
                      type="select"
                      name="outComeOfIpt"
                      id="outComeOfIpt"
                      onChange={handleTpt}
                      value={props.tpt.outComeOfIpt}
                      disabled={props.action === "view" ? true : false}
                    >
                      <option value="">Select</option>
                      <option value="IPT Completed">IPT Completed</option>
                      <option value="Developed active TB">
                        Developed active TB
                      </option>
                      <option value="Died">Died </option>
                      <option value="Transferred out">Transferred out </option>
                      <option value="Stopped IPT">Stopped IPT</option>
                      <option value="Lost to follow up">
                        Lost to follow up{" "}
                      </option>
                    </Input>
                  </InputGroup>
                </FormGroup>
              </div>
              {props.tpt.outComeOfIpt !== "" && (
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label>Outcome Date </Label>
                    <InputGroup>
                      <Input
                        type="date"
                        name="date"
                        id="date"
                        value={props.tpt.date}
                        onChange={handleTpt}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                        // min={props.encounterDate}
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        disabled={props.action === "view" ? true : false}
                      ></Input>
                    </InputGroup>
                  </FormGroup>
                  {props.errors.outcomeDate !== "" ? (
                    <span className={classes.error}>
                      {props.errors.outcomeDate}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              )}
              {props.tpt.outComeOfIpt === "Stopped IPT" && (
                <div className="form-group mb-3 col-md-6">
                  <FormGroup>
                    <Label>Reasons for stopping IPT</Label>
                    <InputGroup>
                      <Input
                        type="text"
                        name="resonForStoppingIpt"
                        id="resonForStoppingIpt"
                        onChange={handleTpt}
                        value={props.tpt.resonForStoppingIpt}
                        disabled={props.action === "view" ? true : false}
                      >
                        <option value="">Select</option>
                        <option value="Developed symptoms of hepatitis">
                          Developed symptoms of hepatitis
                        </option>
                      </Input>
                    </InputGroup>
                  </FormGroup>
                </div>
              )}

              <>
                <div className="form-group mb-3 col-md-6">
                  <FormGroup>
                    <Label>
                      Have you completed TB Treatment?{" "}
                      <span style={{ color: "red" }}> *</span>
                    </Label>
                    <InputGroup>
                      <Input
                        type="select"
                        name="tbTreatment"
                        id="tbTreatment"
                        onChange={handleTpt}
                        value={props.tpt.tbTreatment}
                        disabled={props.action === "view" ? true : false}
                      >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </Input>
                    </InputGroup>
                  </FormGroup>
                  {props.errors.tbTreatment !== "" ? (
                    <span className={classes.error}>
                      {props.errors.tbTreatment}
                    </span>
                  ) : (
                    ""
                  )}
                </div>

                {props.tpt.tbTreatment === "Yes" && (
                  <>
                    {/* <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          TB treatment start date{" "}
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="date"
                            name="tbTreatmentStartDate"
                            id="tbTreatmentStartDate"
                            onChange={handleTpt}
                            value={props.tpt.tbTreatmentStartDate}
                            // min={props.encounterDate}
                            max={moment(new Date()).format("YYYY-MM-DD")}
                            disabled={props.action === "view" ? true : false}
                          ></Input>
                        </InputGroup>
                      </FormGroup>
                    </div> */}

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Treatment Type{" "}
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="select"
                            name="treatmentType"
                            id="treatmentType"
                            onChange={handleTpt}
                            value={props.tpt.treatmentType}
                            disabled={props.action === "view" ? true : false}
                          >
                            <option value="">Select</option>
                            {tbTreatmentType.map((value) => (
                              <option key={value.id} value={value.display}>
                                {value.display}
                              </option>
                            ))}
                          </Input>
                        </InputGroup>
                      </FormGroup>
                      {props.errors.treatmentType !== "" ? (
                        <span className={classes.error}>
                          {props.errors.treatmentType}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Treatment Outcome{" "}
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="select"
                            name="treatmentOutcome"
                            id="treatmentOutcome"
                            onChange={handleTpt}
                            value={props.tpt.treatmentOutcome}
                            disabled={props.action === "view" ? true : false}
                          >
                            <option value="">Select</option>
                            {tbTreatmentOutCome.map((value) => (
                              <option key={value.id} value={value.display}>
                                {value.display}
                              </option>
                            ))}
                          </Input>
                        </InputGroup>
                      </FormGroup>
                      {props.errors.treatmentOutcome !== "" ? (
                        <span className={classes.error}>
                          {props.errors.treatmentOutcome}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    {props.tpt.tbTreatment === "Yes" &&
                      props.tpt.treatementType !== "" &&
                      props.tpt.treatmentOutcome === "Treatment completed" && (
                        <>
                          <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                              <Label>
                                TB Treatment Completion Date{" "}
                                <span style={{ color: "red" }}> *</span>
                              </Label>
                              <InputGroup>
                                <Input
                                  type="date"
                                  name="completionDate"
                                  id="completionDate"
                                  onChange={handleTpt}
                                  value={props.tpt.completionDate}
                                  // min={props.encounterDate}
                                  disabled={
                                    props.action === "view" ? true : false
                                  }
                                  max={moment(new Date()).format("YYYY-MM-DD")}
                                ></Input>
                              </InputGroup>
                            </FormGroup>
                            {props.errors.completionDate !== "" ? (
                              <span className={classes.error}>
                                {props.errors.completionDate}
                              </span>
                            ) : (
                              ""
                            )}
                          </div>

                          <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                              <Label>TB Treatment Completion Status</Label>
                              <InputGroup>
                                <Input
                                  type="select"
                                  name="treatmentCompletionStatus"
                                  id="treatmentCompletionResult"
                                  onChange={handleTpt}
                                  disabled={
                                    props.action === "view" ? true : false
                                  }
                                  value={props.tpt.treatmentCompletionStatus}
                                >
                                  <option value="">Select</option>
                                  <option value="Treatment failed">
                                    Treatment failed
                                  </option>
                                  <option value="Treatment success">
                                    Treatment success
                                  </option>
                                </Input>
                              </InputGroup>
                            </FormGroup>
                            {props.errors.treatmentCompletionStatus !== "" ? (
                              <span className={classes.error}>
                                {props.errors.treatmentCompletionStatus}
                              </span>
                            ) : (
                              ""
                            )}
                          </div>
                        </>
                      )}
                  </>
                )}
              </>
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
};

export default TPT;
