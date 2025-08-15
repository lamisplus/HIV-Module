import React, { useState, useEffect } from "react";
import {
  Grid,
  Segment,
  Label,
  Icon,
  List,
  Button,
  Card,
  Feed,
} from "semantic-ui-react";
// Page titie
import { FormGroup, Input, Label as FormLabelName } from "reactstrap";
import { Checkbox, Table } from "semantic-ui-react";
import ADR from "./ADR/Index";
import OpportunisticInfection from "./OpportunisticInfection/Index";
import TBScreening from "./TBScreening/Index";
import { url as baseUrl, token } from "../../../api";
import MatButton from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";
import axios from "axios";
import AddVitals from "./Vitals/AddVitals";
import AddAllergy from "./Allergies/AddAllergy";
import AddCondition from "./Conditions/AddCondition";
import PostPatient from "./PostPatient/Index";

let adherenceLevelObj = [];
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

const CODESET_KEYS = [
  "CLINICAL_STAGE",
  "PREP_SIDE_EFFECTS",
  "TB_STATUS",
  "FUNCTIONAL _STATUS",
  "PrEP_LEVEL_OF_ADHERENCE",
];

const Widget = (props) => {
  const { getOptions } = useCodesets(CODESET_KEYS);
  const classes = useStyles();
  const [saving, setSaving] = useState(false);
  const [TBForms, setTBForms] = useState(false);
  const [addVitalModal, setAddVitalModal] = useState(false);
  const AddVitalToggle = () => setAddVitalModal(!addVitalModal);
  const [addConditionModal, setAddConditionModal] = useState(false);
  const AddConditionToggle = () => setAddConditionModal(!addConditionModal);
  const [addAllergyModal, setAddAllergyModal] = useState(false);
  const AddAllergyToggle = () => setAddAllergyModal(!addAllergyModal);
  const [postPatientModal, setPostPatientModal] = useState(false);
  const PostPatientToggle = () => setPostPatientModal(!postPatientModal);
  const [objValues, setObjValues] = useState({
    adherenceLevel: "",
    adheres: {},
    adrScreened: "",
    adverseDrugReactions: {},
    artStatusId: 0,
    cd4: "",
    cd4Percentage: 0,
    clinicalNote: "",
    clinicalStageId: 0,
    facilityId: 0,
    functionalStatusId: 0,
    hivEnrollmentId: 0,
    nextAppointment: "",
    lmpDate: "",
    oiScreened: "",
    opportunisticInfections: {},
    personId: 0,
    stiIds: "",
    stiTreated: "",
    uuid: "",
    visitDate: "",

    whoStagingId: 0,
  });

  // useEffect(() => {
  //   FunctionalStatus();
  //   WhoStaging();
  //   AdherenceLevel();
  //   TBStatus();
  //   PrepSideEffect();
  // }, []);

  //Get list of WhoStaging
  // const WhoStaging = () => {
  //   axios
  //     .get(`${baseUrl}application-codesets/v2/CLINICAL_STAGE`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     .then((response) => {
  //       setClinicalStage(response.data);
  //     })
  //     .catch((error) => {});
  // };
  //Get list of WhoStaging
  // const PrepSideEffect = () => {
  //   axios
  //     .get(`${baseUrl}application-codesets/v2/PREP_SIDE_EFFECTS`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     .then((response) => {
  //       setPrepSideEffect(response.data);
  //       adherenceLevelObj = response.data;
  //     })
  //     .catch((error) => {});
  // };
  ///GET LIST OF FUNCTIONAL%20_STATUS
  // TB STATUS
  // const TBStatus = () => {
  //   axios
  //     .get(`${baseUrl}application-codesets/v2/TB_STATUS`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     .then((response) => {
  //       setTbStatus(response.data);
  //     })
  //     .catch((error) => {});
  // };

  // async function FunctionalStatus() {
  //   axios
  //     .get(`${baseUrl}application-codesets/v2/FUNCTIONAL%20_STATUS`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     .then((response) => {
  //       setFunctionalStatus(response.data);
  //       //setValues(response.data)
  //     })
  //     .catch((error) => {});
  // }
  ///Level of Adherence
  // async function AdherenceLevel() {
  //   axios
  //     .get(`${baseUrl}application-codesets/v2/PrEP_LEVEL_OF_ADHERENCE`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     .then((response) => {
  //       setAdherenceLevel(response.data);
  //     })
  //     .catch((error) => {});
  // }
  const handleInputChange = (e) => {
    setObjValues({ ...objValues, [e.target.name]: e.target.value });
    if (e.target.name === "whoStagingId") {
      if (e.target.value === "NO") {
        setTBForms(true);
      } else {
        setTBForms(false);
      }
    }
  };
  const addVitalsModal = () => {
    //setpatientObj({...patientObj, ...row});
    setAddVitalModal(!addVitalModal);
  };
  const addConditionsModal = () => {
    //setpatientObj({...patientObj, ...row});
    setAddConditionModal(!addConditionModal);
  };
  const addAllergiesModal = () => {
    //setpatientObj({...patientObj, ...row});
    setAddAllergyModal(!addAllergyModal);
  };
  const PostPatientService = (row) => {
    //setpatientObj({...patientObj, ...row});
    setPostPatientModal(!postPatientModal);
  };

  return (
    <div>
      <h2>Child Clinic Follow-up Visit</h2>
      <Grid columns="equal">
        <Grid.Column>
          <Segment>
            <Label as="a" color="blue" ribbon>
              Recent Vitals
            </Label>
            <Label
              as="a"
              color="teal"
              onClick={() => addVitalsModal()}
              className="float-end"
              size="mini"
            >
              <Icon name="plus" />
            </Label>
            <br />
            <List celled>
              <List.Item>
                Pulse{" "}
                <span className="float-end">
                  <b>45bmp</b>
                </span>
              </List.Item>
              <List.Item>
                Respiratory Rate{" "}
                <span className="float-end">
                  <b>41bmp</b>
                </span>
              </List.Item>
              <List.Item>
                Temperature{" "}
                <span className="float-end">
                  <b>
                    32<sub>0</sub>C
                  </b>
                </span>
              </List.Item>
              <List.Item>
                Blood Presure{" "}
                <span className="float-end">
                  <b>332/30</b>
                </span>
              </List.Item>
              <List.Item>
                Height{" "}
                <span className="float-end">
                  <b>31.89m</b>
                </span>
              </List.Item>
              <List.Item>
                Weight{" "}
                <span className="float-end">
                  <b>376kg</b>
                </span>
              </List.Item>
            </List>
          </Segment>
          <Segment>
            <Label as="a" color="black" ribbon>
              Conditions
            </Label>
            <Label
              as="a"
              color="teal"
              onClick={() => addConditionsModal()}
              className="float-end"
              size="mini"
            >
              <Icon name="plus" />
            </Label>
            <br />
            <Label as="a" color="white" size="mini" pointing>
              Laser Fever
            </Label>
            <Label as="a" color="white" size="mini" pointing>
              Typoid Fever
            </Label>
            <Label as="a" color="white" size="mini" pointing>
              Asthma
            </Label>
          </Segment>
          <Segment>
            <Label as="a" color="red" ribbon>
              Allergies
            </Label>
            <Label
              as="a"
              color="teal"
              onClick={() => addAllergiesModal()}
              className="float-end"
              size="mini"
            >
              <Icon name="plus" />
            </Label>
            <br />
            <br />
            <Label.Group color="blue">
              <Label as="a" size="mini">
                dust
              </Label>
              <Label as="a" size="mini">
                smoke
              </Label>
            </Label.Group>
          </Segment>
        </Grid.Column>
        <Grid.Column width={9}>
          <Segment>
            <Label as="a" color="black" ribbon>
              <b>Consultation</b>
            </Label>
            <br />
            <div className=" mb-3">
              <FormLabelName>Encounter Date</FormLabelName>
              <input type="date" className="form-control" />
            </div>
            <br />
            <div className=" mb-3">
              <FormLabelName>Visit Note</FormLabelName>
              <textarea className="form-control"></textarea>
            </div>
            <div className="row">
              <div className=" mb-3 col-md-6">
                <FormGroup>
                  <FormLabelName>WHO Staging</FormLabelName>
                  <Input
                    type="select"
                    name="whoStagingId"
                    id="whoStagingId"
                    value={objValues.whoStagingId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="select"> </option>

                    {getOptions("CLINICAL_STAGE").map((value) => (
                      <option key={value.id} value={value.id}>
                        {value.display}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </div>
              <div className=" mb-3 col-md-6">
                <FormGroup>
                  <FormLabelName>Functional Status</FormLabelName>
                  <Input
                    type="select"
                    name="functionalStatusId"
                    id="functionalStatusId"
                    value={objValues.functionalStatusId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="select"> </option>

                    {getOptions("FUNCTIONAL _STATUS").map((value) => (
                      <option key={value.id} value={value.id}>
                        {value.display}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </div>
              <div className=" mb-3 col-md-6">
                <FormGroup>
                  <FormLabelName>Level of Adherence</FormLabelName>
                  <Input
                    type="select"
                    name="adherenceLevel"
                    id="adherenceLevel"
                    value={objValues.adherenceLevel}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="select"> </option>

                    {getOptions("PrEP_LEVEL_OF_ADHERENCE").map((value) => (
                      <option key={value.id} value={value.id}>
                        {value.display}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </div>
            </div>
            <br />
            <Label as="a" color="red" ribbon>
              Opportunistic Infection
            </Label>
            <br />
            <br />
            <OpportunisticInfection />
            <br />
            <Label as="a" color="pink" ribbon>
              ADR
            </Label>
            <br />
            <br />
            <ADR />
            <br />
            <Label as="a" color="teal" ribbon>
              TB Screening
            </Label>
            <br />
            <br />
            <TBScreening />
            <br />
            <MatButton
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<SaveIcon />}
              //onClick={handleSubmit}
            >
              {!saving ? (
                <span style={{ textTransform: "capitalize" }}>Save</span>
              ) : (
                <span style={{ textTransform: "capitalize" }}>Saving...</span>
              )}
            </MatButton>
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment>
            <List>
              <List.Item>
                <Button
                  icon
                  labelPosition="right"
                  color="teal"
                  fluid
                  onClick={() => PostPatientService()}
                >
                  <Icon name="external alternate" />
                  Post Patient
                </Button>
              </List.Item>
              {/* <List.Item>
                  <Button icon labelPosition='right' color='green' fluid>
                      <Icon name='eye' />
                        View History
                    </Button>
                  </List.Item> */}
              <List.Item>
                <Button icon labelPosition="right" color="blue" fluid>
                  <Icon name="calendar alternate" />
                  Appointment
                </Button>
              </List.Item>
            </List>
            <Card>
              <Card.Content>
                <b>Previous Clinical Notes</b>
              </Card.Content>
              <Card.Content>
                {/* <Feed>
                <Feed.Event>
                  <Feed.Content>
                    <Feed.Date content='20-03-2022' />
                    <Feed.Summary>
                      The malaria is plus 3 and and need more attention
                    </Feed.Summary>
                  </Feed.Content>
                </Feed.Event>
                <hr/>
                <Feed.Event>
                  <Feed.Content>
                    <Feed.Date content='20-05-2022' />
                    <Feed.Summary>
                      Blood presure is too high
                    </Feed.Summary>
                  </Feed.Content>
                </Feed.Event>
              </Feed> */}
              </Card.Content>
            </Card>
          </Segment>
        </Grid.Column>
      </Grid>
      <AddVitals toggle={AddVitalToggle} showModal={addVitalModal} />
      <AddAllergy toggle={AddAllergyToggle} showModal={addAllergyModal} />
      <AddCondition toggle={AddConditionToggle} showModal={addConditionModal} />
      <PostPatient toggle={PostPatientToggle} showModal={postPatientModal} />
    </div>
  );
};

export default Widget;
