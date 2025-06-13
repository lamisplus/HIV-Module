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
import useCodesets from "../../../../hooks/useCodesets";

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

const CODESET_KEYS = ["PREP_SIDE_EFFECTS"];
const Eligibility = (props) => {
  const { getOptions } = useCodesets(CODESET_KEYS);
  const classes = useStyles();
  const history = useHistory();
  const [errors, setErrors] = useState({});
//   const [allergies, setAllergies] = useState([]);
//   useEffect(() => {
//     PrepSideEffect();
//   }, []);
  //Get list of PrepSideEffect
//   const PrepSideEffect = () => {
//     axios
//       .get(`${baseUrl}application-codesets/v2/PREP_SIDE_EFFECTS`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((response) => {
//         setAllergies(response.data);
//       })
//       .catch((error) => {});
//   };
  useEffect(() => {
    if (props.observation.data && props.observation.data.medicalHistory) {
      setobjValues(props.observation.data.medicalHistory);
    }
  }, [props.observation.data]);
  const [visit, setVisit] = useState({ visitDate: "" });
  const [objValues, setobjValues] = useState({
    Nausea: "",
    Nausea_fever: "",
    as_never_receive_arvs: "",
    chronic: "",
    chronic_duration: "",
    cough: "",
    cough_duration: "",
    drug_allergies: "",
    duration_of_care_from: "",
    early_arv_but_not_transfer_in: "",
    fever: "",
    fever_duration: "",
    genital: "",
    genital_duration: "",
    genital_score: "",
    genital_score_duration: "",
    headache: "",
    headache_duration: "",
    hospitalization: "",
    itching: "",
    itching_duration: "",
    name_of_the_facility: "",
    new_visual: "",
    new_visual_duration: "",
    night_duration: "",
    numbness: "",
    numbness_duration: "",
    pain: "",
    pain_duration: "",
    past_medical_history: "",
    previous_arv_exposure: "",
    rash: "",
    rash_duration: "",
    recent: "",
    recent_duration: "",
    relevant_family_history: "",
    screen_for_tb: "",
    shortness_of_breath: "",
    shortness_of_breath_duration: "",
    duration_of_care_to: "",
    disclosureNoOne: "",
    familyMember: "",
    friend: "",
    spouse: "",
    spiritualLeader: "",
    disclosureOthers: "",
    HivStatusCanBeDiscussed: "",
    CurrentMedicationNone: "",
    currentART: "",
    currentCTX: "",
    currentAntiTbDdrugs: "",
    currentOthers: "",
    childMotherAlive: "",
    motherName: "",
    motherAddress: "",
    childFatherAlive: "",
    immunisationComplete: "",
    fatherName: "",
    fatherAddress: "",
    parentChildMarriageStatus: "",
    howManySibiling: "",
    immunisationComplete: "",
    modeOfInfantFeeding: "",
  });
  let temp = { ...errors };
  const [hideOtherPatientDisclosure, setHideOtherPatientDisclosure] =
    useState(false);
  const [hideOtherCurrentMedication, setHideOtherCurrentMedication] =
    useState(false);
  //Handle CheckBox
  const handleMedicalHistory = (e) => {
    setErrors({ ...errors, [e.target.name]: "" });
    if (e.target.name === "disclosureNoOne") {
      if (e.target.checked) {
        setHideOtherPatientDisclosure(true);
      } else {
        setHideOtherPatientDisclosure(false);
      }
    }
    if (e.target.name === "CurrentMedicationNone") {
      if (e.target.checked) {
        setHideOtherCurrentMedication(true);
      } else {
        setHideOtherCurrentMedication(false);
      }
    }
    setobjValues({ ...objValues, [e.target.name]: e.target.value });
  };
  const handleInputChangeobjValues = (e) => {
    setErrors({ ...errors, [e.target.name]: "" });
    setVisit({ ...visit, [e.target.name]: e.target.value });
  };
  const handleItemClick = (page, completedMenu) => {
    props.handleItemClick(page);
    if (props.completed.includes(completedMenu)) {
    } else {
      props.setCompleted([...props.completed, completedMenu]);
    }
  };
  //Validations of the forms
  const validate = () => {
    temp.screen_for_tb = objValues.screen_for_tb
      ? ""
      : "This field is required";
    temp.past_medical_history = objValues.past_medical_history
      ? ""
      : "This field is required";
    temp.relevant_family_history = objValues.relevant_family_history
      ? ""
      : "This field is required";
    temp.drug_allergies = objValues.drug_allergies
      ? ""
      : "This field is required";
    temp.visitDate = visit.visitDate ? "" : "This field is required";

    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x == "");
  };
  /**** Submit Button Processing  */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      props.observation.dateOfObservation = visit.visitDate;
      props.observation.data.medicalHistory = objValues;
      //toast.success("Medical history save successful");
      handleItemClick("past-arv", "medical-history");
    } else {
      toast.error("All fields are required");
    }
  };

  return (
    <>
      <Card className={classes.root}>
        <CardBody>
          <h2 style={{ color: "#000" }}>Eligibility Assessment</h2>
          <br />
          <form>
            <div className="row">
              <div className="form-group mb-3 col-md-4">
                <FormGroup>
                  <Label>Visit Date *</Label>
                  <InputGroup>
                    <Input
                      type="date"
                      min={
                        props.patientObj && props.patientObj.enrollment
                          ? props.patientObj.enrollment.dateOfRegistration
                          : ""
                      }
                      max={moment(new Date()).format("YYYY-MM-DD")}
                      name="visitDate"
                      id="visitDate"
                      value={
                        props.observation.dateOfObservation !== "" &&
                        props.observation.dateOfObservation !== null
                          ? props.observation.dateOfObservation
                          : visit.visitDate
                      }
                      onChange={handleInputChangeobjValues}
                    />
                  </InputGroup>
                </FormGroup>
                {errors.visitDate !== "" ? (
                  <span className={classes.error}>{errors.visitDate}</span>
                ) : (
                  ""
                )}
              </div>
              <div className="form-group mb-3 col-md-8"></div>
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>Type Of Client</Label>
                  <InputGroup>
                    <Input
                      type="select"
                      name="current_pregnant"
                      id="current_pregnant"
                      onChange={handleMedicalHistory}
                      value={objValues.current_pregnant}
                    >
                      <option value="">Select</option>
                      <option value="PLHIV New enrolled into HIV Care & Treatment">
                        PLHIV New enrolled into HIV Care & Treatment
                      </option>
                      <option value="Registered PLHIV on follow up/subsequent visit this FY">
                        Registered PLHIV on follow up/subsequent visit this FY
                      </option>
                      <option value="Registered PLHIV on first time visit this FY">
                        Registered PLHIV on first time visit this FY
                      </option>
                    </Input>
                  </InputGroup>
                </FormGroup>
              </div>
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>Pregnancy/Breastfeeding Status</Label>
                  <InputGroup>
                    <Input
                      type="select"
                      name="current_pregnant"
                      id="current_pregnant"
                      onChange={handleMedicalHistory}
                      value={objValues.current_pregnant}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Uncertain">Uncertain</option>
                    </Input>
                  </InputGroup>
                </FormGroup>
              </div>
            </div>
            <div className="row">
              <h3>ART Status : Pre-ART </h3>
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>Current Clinical Status(WHO Statging)</Label>
                  <InputGroup>
                    <Input
                      type="select"
                      name="previous_arv_exposure"
                      id="previous_arv_exposure"
                      onChange={handleMedicalHistory}
                      value={objValues.previous_arv_exposure}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Uncertain">Uncertain</option>
                    </Input>
                  </InputGroup>
                </FormGroup>
              </div>
              <div className="form-group mb-3 col-md-6"></div>
              <div className="form-group mb-3 col-md-4">
                <FormGroup>
                  <Label>Last CD4 Result</Label>
                  <InputGroup>
                    <Input
                      type="text"
                      name="previous_arv_exposure"
                      id="previous_arv_exposure"
                    />
                  </InputGroup>
                </FormGroup>
              </div>
              <div className="form-group mb-3 col-md-4">
                <FormGroup>
                  <Label>Last Viral Load Result</Label>
                  <InputGroup>
                    <Input
                      type="text"
                      name="previous_arv_exposure"
                      id="previous_arv_exposure"
                    />
                  </InputGroup>
                </FormGroup>
              </div>
              <div className="form-group mb-3 col-md-4">
                <FormGroup>
                  <Label>Eligible for Viral Load</Label>
                  <InputGroup>
                    <Input
                      type="select"
                      name="current_pregnant"
                      id="current_pregnant"
                      onChange={handleMedicalHistory}
                      value={objValues.current_pregnant}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Input>
                  </InputGroup>
                </FormGroup>
              </div>
            </div>
            <br />
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

export default Eligibility;
