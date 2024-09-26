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
import DualListBox from "react-dual-listbox";
import "react-dual-listbox/lib/react-dual-listbox.css";

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
  const [errors, setErrors] = useState({});
  const [selectedOptions1, setSelectedOptions1] = useState([]);
  const [selectedOptions2, setSelectedOptions2] = useState([]);
  const [selectedOptions3, setSelectedOptions3] = useState([]);
  const [selectedOptions4, setSelectedOptions4] = useState([]);
  const [clinicalStage, setClinicalStage] = useState([]);
  let temp = { ...errors };
  useEffect(() => {
    WhoStaging();
    if (props.observation.data) {
      setAssesment(props.observation.data.assesment);
      setWho(props.observation.data.who);
      setSelectedOptions1(props.observation.data.who?.stage1ValueOption);
      setSelectedOptions2(props.observation.data.who?.stage2ValueOption);
      setSelectedOptions3(props.observation.data.who?.stage3ValueOption);
      setSelectedOptions4(props.observation.data.who?.stage4ValueOption);
    }
  }, [props.observation.data]);
  const WhoStaging = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/CLINICAL_STAGE`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setClinicalStage(response.data);
      })
      .catch((error) => {});
  };
  const [who, setWho] = useState({
    stage: "",
    stage1Value: "",
    stage2Value: "",
    stage3Value: "",
    stage4Value: "",
    stage1ValueOption: "",
    stage2ValueOption: "",
    stage3ValueOption: "",
    stage4ValueOption: "",
  });
  const [assesment, setAssesment] = useState({ assessment: "" });
  const handleAssessment = (e) => {
    setAssesment({ ...assesment, [e.target.name]: e.target.value });
  };
  const handleWho = (e) => {
    setWho({ ...who, [e.target.name]: e.target.value });
  };

  const handleItemClick = (page, completedMenu) => {
    props.handleItemClick(page);
    if (props.completed.includes(completedMenu)) {
    } else {
      props.setCompleted([...props.completed, completedMenu]);
    }
  };
  const validate = () => {
    temp.stage = who?.stage ? "" : "This field is required";
    temp.assessment = assesment.assessment ? "" : "This field is required";

    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x == "");
  };
  /**** Submit Button Processing  */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      props.observation.data.assesment = assesment;
      props.observation.data.who = who;

      handleItemClick("plan", "who");
    }
  };
  const onSelectedOption1 = (selectedValues) => {
    setWho({ ...who, stage1ValueOption: selectedValues });
    setSelectedOptions1(selectedValues);
  };
  const onSelectedOption2 = (selectedValues) => {
    setWho({ ...who, stage2ValueOption: selectedValues });
    setSelectedOptions2(selectedValues);
  };
  const onSelectedOption3 = (selectedValues) => {
    setSelectedOptions3(selectedValues);
    setWho({ ...who, stage3ValueOption: selectedValues });
  };
  const onSelectedOption4 = (selectedValues) => {
    setWho({ ...who, stage4ValueOption: selectedValues });
    setSelectedOptions4(selectedValues);
  };
  const options1 = [
    { value: "Asymptomatic", label: "Asymptomatic" },
    {
      value: "Persistent generalized lymphadenopathy",
      label: "Persistent generalized lymphadenopathy",
    },
    {
      value: "Herpes Zoster (within last 5 years)",
      label: "Performance scale: 1 asymptomatic, normal activity",
    },
  ];
  const options2 = [
    {
      value: "Weight loss less than 10% of body weight",
      label: "Weight loss less than 10% of body weight",
    },
    {
      value: "Minor Mucocutaneous Manifestations",
      label: "Minor Mucocutaneous Manifestations",
    },
    {
      value: "Herpes Zoster (within last 5 years)",
      label: "Herpes Zoster (within last 5 years)",
    },
    {
      value: "Recurrent Upper Respiratory Tract Infections",
      label: "Recurrent Upper Respiratory Tract Infections",
    },
    {
      value: "Performance scale: 2 symptomatic, normal activity",
      label: "Performance scale: 2 symptomatic, normal activity",
    },
  ];
  const options3 = [
    {
      value: "Weight loss greater than 10% of body weight",
      label: "Weight loss greater than 10% of body weight",
    },
    {
      value: "Unexplained Chronic Diarrhea less than 1 month",
      label: "Unexplained Chronic Diarrhea less than 1 month",
    },
    {
      value: "Unexplained Prolonged Fever",
      label: "Unexplained Prolonged Fever",
    },
    { value: "Oral Candidiasis", label: "Oral Candidiasis" },
    { value: "Oral Hairy Leukoplakia", label: "Oral Hairy Leukoplakia" },

    {
      value: "TB, Pulmonary (within previous year)",
      label: "TB, Pulmonary (within previous year)",
    },
    {
      value: "Severe Bacterial Infections",
      label: "Severe Bacterial Infections",
    },
    {
      value:
        "Performance scale: 3 bedridden  less than 50% of day in last month",
      label:
        "Performance scale: 3 bedridden  less than 50% of day in last month",
    },
  ];
  const options4 = [
    { value: "HIV Wasting syndrome", label: "HIV Wasting syndrome" },
    { value: "PCP", label: "PCP" },
    { value: "Toxoplasmosis, CNS", label: "Toxoplasmosis, CNS" },

    {
      value: "Cryptosporidiosis with Diarrhea greater than 1 month",
      label: "Cryptosporidiosis with Diarrhea greater than 1 month",
    },
    {
      value: "Cryptococcosis, Extrapulmonary",
      label: "Cryptococcosis, Extrapulmonary",
    },
    { value: "Cytomegalovirus disease", label: "Cytomegalovirus disease" },
    {
      value: "Herpes Simplex (mucotaneous greater than 1 month)",
      label: "Herpes Simplex (mucotaneous greater than 1 month)",
    },
    {
      value: "Progressive Multifocal Leukoencephalopathy",
      label: "Progressive Multifocal Leukoencephalopathy",
    },
    { value: "Mycosis, disseminated", label: "Mycosis, disseminated" },
    { value: "Oesophageal Candidiasis", label: "Oesophageal Candidiasis" },
    {
      value: "Atypical Mycobacteriosis, disseminated",
      label: "Atypical Mycobacteriosis, disseminated",
    },
    {
      value: "Salmonella Septicemia, Non-typhoid",
      label: "Salmonella Septicemia, Non-typhoid",
    },

    { value: "TB, Extrapulmonary", label: "TB, Extrapulmonary" },
    { value: "Lymphoma", label: "Lymphoma" },
    { value: "Kaposi's Sarcoma", label: "Kaposi's Sarcoma" },
    { value: "HIV encephalopathy", label: "HIV encephalopathy" },
    {
      value:
        "Performance scale: 4 bedridden greater than 50% of the day in last month",
      label:
        "Performance scale: 4 bedridden greater than 50% of the day in last month",
    },
  ];

  return (
    <>
      <Card className={classes.root}>
        <CardBody>
          <h2 style={{ color: "#000" }}>Physical Examination</h2>
          <br />
          <form>
            {/* Medical History form inputs */}
            <div className="row">
              <h3>
                Assessment <span style={{ color: "red" }}> *</span>
              </h3>
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <InputGroup>
                    <Input
                      type="select"
                      name="assessment"
                      id="assessment"
                      onChange={handleAssessment}
                      value={assesment.assessment}
                    >
                      <option value="">Select</option>
                      <option value="Asymptomatic">Asymptomatic</option>
                      <option value="Symptomatic">Symptomatic</option>
                      <option value="AIDS defining illness">
                        AIDS defining illness
                      </option>
                    </Input>
                  </InputGroup>
                  {errors.assessment !== "" ? (
                    <span className={classes.error}>{errors.assessment}</span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </div>
              <div className="form-group mb-3 col-md-6"> </div>
              <hr />
              <h3>WHO staging criteria (History of any of the following) </h3>
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>
                    WHO STAGE <span style={{ color: "red" }}> *</span>
                  </Label>
                  <InputGroup>
                    <Input
                      type="select"
                      name="stage"
                      id="stage"
                      value={who?.stage}
                      onChange={handleWho}
                    >
                      <option value=""> Select</option>
                      {clinicalStage.map((value) => (
                        <option key={value.id} value={value.id}>
                          {value.display}
                        </option>
                      ))}
                    </Input>
                  </InputGroup>
                  {errors.stage !== "" ? (
                    <span className={classes.error}>{errors.stage}</span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </div>
              {who?.stage === "119" && (
                <div className="form-group mb-3 col-md-12">
                  <FormGroup>
                    <Label>Stage 1 options</Label>
                    <DualListBox
                      //canFilter
                      options={options1}
                      onChange={onSelectedOption1}
                      selected={selectedOptions1}
                    />
                  </FormGroup>
                </div>
              )}
              {who?.stage === "120" && (
                <div className="form-group mb-3 col-md-12">
                  <FormGroup>
                    <Label>Stage 2 options</Label>
                    <DualListBox
                      //canFilter
                      options={options2}
                      onChange={onSelectedOption2}
                      selected={selectedOptions2}
                    />
                  </FormGroup>
                </div>
              )}
              {who?.stage === "121" && (
                <>
                  <div className="form-group mb-3 col-md-12">
                    <FormGroup>
                      <Label>Stage 3 options</Label>
                      <DualListBox
                        //canFilter
                        options={options3}
                        onChange={onSelectedOption3}
                        selected={selectedOptions3}
                      />
                    </FormGroup>
                  </div>
                </>
              )}
              {who?.stage === "122" && (
                <div className="form-group mb-3 col-md-12">
                  <FormGroup>
                    <Label>Stage 4 options</Label>
                    <DualListBox
                      //canFilter
                      options={options4}
                      onChange={onSelectedOption4}
                      selected={selectedOptions4}
                    />
                  </FormGroup>
                </div>
              )}
            </div>
            <br />
            <Button
              content="Back"
              icon="left arrow"
              labelPosition="left"
              style={{ backgroundColor: "#992E62", color: "#fff" }}
              onClick={() => handleItemClick("appearance", "appearance")}
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
