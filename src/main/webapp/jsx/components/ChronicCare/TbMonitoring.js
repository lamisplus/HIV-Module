import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FormGroup,
  Label,
  CardBody,
  Input,
  InputGroup,
} from "reactstrap";
import * as moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import { Card } from "@material-ui/core";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { token, url as baseUrl } from "../../../api";
import "react-phone-input-2/lib/style.css";
import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import "react-phone-input-2/lib/style.css";


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

const TBMonitoring = (props) => {
  const classes = useStyles();
  let errors = props.errors
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
  // TPT Logic
  useEffect(() => {
       // console.log(props.tbObj)

  }, []);

  // console.log("TB IN TBMONITORING", props.tbObj)
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



  return (
    <>
      <Card className={classes.root}>
        <CardBody>
          <h2 style={{ color: "#000" }}>TB Monitoring</h2>
          <br />
          <form>
            <div className="row">
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label> Current Weight (In kg) </Label>
                  <span style={{color: "red"}}> *</span>
                  <InputGroup>
                    <Input
                        type="number"
                        name="currentWeight"
                        id="currentWeight"
                        min="1"
                        onChange={props.handleInputChange}
                        value={props.tbObj.currentWeight}
                        disabled={props.action === "view" ? true : false}
                    ></Input>
                  </InputGroup>
                  {errors.currentWeight !== "" ? (
                      <span className={classes.error}>{errors.currentWeight}</span>
                  ) : (
                      ""
                  )}
                </FormGroup>
              </div>
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>
                    Have you completed TB Treatment?{" "}
                    <span style={{color: "red"}}> *</span>
                  </Label>
                  <InputGroup>
                    <Input
                        type="select"
                        name="completedTbTreatment"
                        id="completedTbTreatment"
                        onChange={props.handleInputChange}
                        value={props.tbObj.completedTbTreatment}
                        disabled={props.action === "view" ? true : false}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Input>
                  </InputGroup>
                  {errors.completedTbTreatment !== "" ? (
                      <span className={classes.error}>{errors.completedTbTreatment}</span>
                  ) : (
                      ""
                  )}
                </FormGroup>

              </div>
              {props.tbObj.completedTbTreatment === "Yes" && (
                  <>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          TB Treatment Completion Date{" "}
                          <span style={{color: "red"}}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                              type="date"
                              name="completionDate"
                              id="completionDate"
                              onChange={props.handleInputChange}
                              value={props.tbObj.completionDate}
                              // min={props.encounterDate}
                              disabled={
                                props.action === "view" ? true : false
                              }
                              min={props.tbObj.tbTreatmentStartDate}
                              max={moment(new Date()).format("YYYY-MM-DD")}
                              onKeyPress={(e) => e.preventDefault()}
                          ></Input>
                        </InputGroup>
                        {errors.completionDate !== "" ? (
                            <span className={classes.error}>{errors.completionDate}</span>
                        ) : (
                            ""
                        )}
                      </FormGroup>

                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Treatment Outcome{" "}
                          <span style={{color: "red"}}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                              type="select"
                              name="treatmentOutcome"
                              id="treatmentOutcome"
                              onChange={props.handleInputChange}
                              value={props.tbObj.treatmentOutcome}
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
                        {errors.treatmentOutcome !== "" ? (
                            <span className={classes.error}>{errors.treatmentOutcome}</span>
                        ) : (
                            ""
                        )}
                      </FormGroup>

                    </div>
                    {(props.tbObj.treatmentOutcome === "Treatment completed" || props.tbObj.treatmentOutcome === "Cured" ) &&
                        <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>TB Treatment Completion Status</Label>
                        <InputGroup>
                          <Input
                              type="text"
                              name="treatmentCompletionStatus"
                              id="treatmentCompletionStatus"
                              onChange={props.handleInputChange}
                              disabled
                              value={(props.tbObj.treatmentOutcome === 'Cured' || props.tbObj.treatmentOutcome === 'Treatment completed') ? "Treatment success" : ""}
                          >
                          </Input>
                        </InputGroup>
                      </FormGroup>
                    </div>}
                  </>
              )}

              <br/>
              <hr/>

            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
};

export default TBMonitoring;
