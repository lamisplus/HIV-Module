import React, { Fragment, useState, useEffect } from "react";
// import { Link } from 'react-router-dom';
import { Row } from "react-bootstrap";
import { Modal, Button, Table } from "react-bootstrap";
import {
  Input,
  Label,
  FormGroup,
  InputGroupText,
  InputGroup,
  Col,
  CardBody,
  Card,
} from "reactstrap";
import { Tab, Grid } from "semantic-ui-react";
import MatButton from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { token, url as baseUrl } from "./../../../../api";
import axios from "axios";
import useCodesets from "../../../../hooks/useCodesets";


const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
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
let adherenceLevelObj = [];


const CODESET_KEYS = ["TB_STATUS"];
const ADR = (props) => {
  const { getOptions } = useCodesets(CODESET_KEYS);
  const patientObj = props.patientObj;
  const classes = useStyles();
  const [clinicalStage, setClinicalStage] = useState([]);
  const [functionalStatus, setFunctionalStatus] = useState([]);
  const [adherenceLevel, setAdherenceLevel] = useState([]);
  const [tbStatus, setTbStatus] = useState([]);
  const [TBForms, setTBForms] = useState(false);
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
    tbStatusId: "",
  });
  const [vital, setVitalSignDto] = useState({
    bodyWeight: "",
    diastolic: "",
    encounterDate: "",
    facilityId: 1,
    height: "",
    personId: "",
    serviceTypeId: 1,
    systolic: "",
  });

  // useEffect(() => {
  //   FunctionalStatus();
  //   WhoStaging();
  //   TBStatus();
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

  return (
    <div>
      <div className="row">
        <div className="form-group mb-3 col-md-6">
          <FormGroup>
            <Label>Patient on Anti TB Drugs?</Label>
            <Input
              type="select"
              name="whoStagingId"
              id="whoStagingId"
              value={objValues.whoStagingId}
              onChange={handleInputChange}
              required
            >
              <option value=""> </option>
              <option value="YES"> YES</option>
              <option value="NO">NO </option>
            </Input>
          </FormGroup>
        </div>
        {TBForms === true ? (
          <>
            <div className="form-group mb-3 col-md-6">
              <FormGroup>
                <Label>Patient Currently on IPT?</Label>
                <Input
                  type="select"
                  name="functionalStatusId"
                  id="functionalStatusId"
                  value={objValues.functionalStatusId}
                  onChange={handleInputChange}
                  required
                >
                  <option value=""> </option>
                  <option value="YES"> YES</option>
                  <option value="NO">NO </option>
                </Input>
              </FormGroup>
            </div>
            <div className="form-group mb-3 col-md-4">
              <FormGroup>
                <Label>Couching?</Label>
                <Input
                  type="select"
                  name="adherenceLevel"
                  id="adherenceLevel"
                  value={objValues.adherenceLevel}
                  onChange={handleInputChange}
                  required
                >
                  <option value=""> </option>
                  <option value="YES"> YES</option>
                  <option value="NO">NO </option>
                </Input>
              </FormGroup>
            </div>
            <div className="form-group mb-3 col-md-4">
              <FormGroup>
                <Label>Night Sweat?</Label>
                <Input
                  type="select"
                  name="adherenceLevel"
                  id="adherenceLevel"
                  value={objValues.adherenceLevel}
                  onChange={handleInputChange}
                  required
                >
                  <option value=""> </option>
                  <option value="YES"> YES</option>
                  <option value="NO">NO </option>
                </Input>
              </FormGroup>
            </div>
            <div className="form-group mb-3 col-md-4">
              <FormGroup>
                <Label>Fever</Label>
                <Input
                  type="select"
                  name="adherenceLevel"
                  id="adherenceLevel"
                  value={objValues.adherenceLevel}
                  onChange={handleInputChange}
                  required
                >
                  <option value=""> </option>
                  <option value="YES"> YES</option>
                  <option value="NO">NO </option>
                </Input>
              </FormGroup>
            </div>
            <div className="form-group mb-3 col-md-4">
              <FormGroup>
                <Label>Countact with TB Case?</Label>
                <Input
                  type="select"
                  name="adherenceLevel"
                  id="adherenceLevel"
                  value={objValues.adherenceLevel}
                  onChange={handleInputChange}
                  required
                >
                  <option value=""> </option>
                  <option value="YES"> YES</option>
                  <option value="NO">NO </option>
                </Input>
              </FormGroup>
            </div>
            <div className="form-group mb-3 col-md-4">
              <FormGroup>
                <Label>Lethergy</Label>
                <Input
                  type="select"
                  name="adherenceLevel"
                  id="adherenceLevel"
                  value={objValues.adherenceLevel}
                  onChange={handleInputChange}
                  required
                >
                  <option value=""> </option>
                  <option value="YES"> YES</option>
                  <option value="NO">NO </option>
                </Input>
              </FormGroup>
            </div>
            <div className="form-group mb-3 col-md-4">
              <FormGroup>
                <Label>TB Status</Label>
                <Input
                  type="select"
                  name="tbStatusId"
                  id="tbStatusId"
                  value={objValues.tbStatusId}
                  onChange={handleInputChange}
                  required
                >
                  <option value=""> </option>

                  {getOptions("TB_STATUS").map((value) => (
                    <option key={value.id} value={value.id}>
                      {value.display}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ADR;
