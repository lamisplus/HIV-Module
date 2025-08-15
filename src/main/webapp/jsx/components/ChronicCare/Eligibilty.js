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
import useCodesets from "../../../hooks/useCodesets";
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

const CODESET_KEYS = [
  "CHRONIC_CARE_CLIENT_TYPE",
  "ART_STATUS",
  "PREGNANCY_STATUS",
  "WHO_STAGING_CRITERIA",
];

const Eligibility = (props) => {
  const classes = useStyles();
  const { getOptions } = useCodesets(CODESET_KEYS);

  const [facilityId, setFacilityId] = useState(null);
  const [lastCd4Result, setLastCd4Result] = useState({});
  const getFacilityId = useFacilityId(baseUrl, token);

  const handleEligibility = (e) => {
    props.setEligibility({
      ...props.eligibility,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    getLastCD4Result();
  }, [getFacilityId]);
  const getFilteredPregnancyStatus = () => {
    return getOptions("PREGNANCY_STATUS").filter(
      (status) => status.display !== "Post Partum"
    );
  };

  const patientAge = calculate_age_to_number(props.patientObj.dateOfBirth);

  const getLastCD4Result = () => {
    axios
      .get(
        `${baseUrl}laboratory/cs/page/load/${props.patientObj.id}/${getFacilityId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        const lastCd4Result = response.data;
        setLastCd4Result(lastCd4Result);
      })
      .catch((error) => {
        console.error("Error fetching Last CD4 Result:", error);
      });
  };
  useEffect(() => {
    // Update props.eligibility.lastCd4Result with the value of lastCd4Result.cd4?.resultReported
    props.setEligibility((prevEligibility) => ({
      ...prevEligibility,
      lastCd4Result: lastCd4Result.cd4?.resultReported || "",
      lastCd4ResultDate: formattedDate(lastCd4Result.cd4?.dateResultReported),
      lastViralLoadResult: lastCd4Result.vl?.resultReported || "",
      lastViralLoadResultDate: lastCd4Result.vl?.dateResultReported
        ? formattedDate(lastCd4Result.vl?.dateResultReported)
        : "",
    }));
  }, [lastCd4Result.cd4?.resultReported, lastCd4Result.vl?.resultReported]);
  const formattedDate = (inputDate) => {

  
  
    const dateObject = new Date(inputDate);
      if (isNaN(dateObject)) {
        return ""; 
      }
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <>
      <Card className={classes.root}>
        <CardBody>
          <h2 style={{ color: "#000" }}>Eligibility Assessment</h2>
          <br />
          <form>
            <div className="row">
              <div className="form-group mb-3 col-md-8"></div>
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>Type Of Client</Label>
                  <InputGroup>
                    <Input
                      type="select"
                      name="typeOfClient"
                      id="typeOfClient"
                      onChange={handleEligibility}
                      value={props.eligibility.typeOfClient}
                      disabled={props.action === "view" ? true : false}
                    >
                      <option value="">Select</option>
                      {getOptions("CHRONIC_CARE_CLIENT_TYPE").map((value) => (
                        <option key={value.id} value={value.display}>
                          {value.display}
                        </option>
                      ))}
                    </Input>
                  </InputGroup>
                </FormGroup>
              </div>
              {patientAge >= 10 && props.patientObj.sex === "Female" && (
                <div className="form-group mb-3 col-md-6">
                  <FormGroup>
                    <Label>Pregnancy Status</Label>
                    <InputGroup>
                      <Input
                        type="select"
                        name="pregnantStatus"
                        id="pregnantStatus"
                        onChange={handleEligibility}
                        disabled={props.action === "view" ? true : false}
                        value={props.eligibility.pregnantStatus}
                      >
                        <option value="">Select</option>
                        {getFilteredPregnancyStatus().map((value) => (
                          <option key={value.id} value={value.display}>
                            {value.display}
                          </option>
                        ))}
                      </Input>
                    </InputGroup>
                  </FormGroup>
                </div>
              )}
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>ART Status</Label>
                  <InputGroup>
                    <Input
                      type="select"
                      name="artStatus"
                      id="artStatus"
                      disabled={props.action === "view" ? true : false}
                      onChange={handleEligibility}
                      value={props.eligibility.artStatus}
                    >
                      <option value="">Select</option>
                      {getOptions("ART_STATUS").map((value) => (
                        <option key={value.id} value={value.display}>
                          {value.display}
                        </option>
                      ))}
                    </Input>
                  </InputGroup>
                </FormGroup>
              </div>
              {/* To Be Reviewed */}
              {/* <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>WHO Clinical Staging</Label>
                  <InputGroup>
                    <Input
                      type="select"
                      name="whoStaging"
                      disabled={props.action === "view" ? true : false}
                      id="whoStaging"
                      onChange={handleEligibility}
                      value={props.eligibility.whoStaging}
                    >
                      <option value="">Select</option>
                      {who.map((value) => (
                        <option key={value.id} value={value.display}>
                          {value.display}
                        </option>
                      ))}
                    </Input>
                  </InputGroup>
                </FormGroup>
              </div> */}
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>Last CD4 Result</Label>
                  <InputGroup>
                    <Input
                      type="text"
                      name="lastCd4Result"
                      id="lastCd4Result"
                      value={props.eligibility.lastCd4Result}
                      onChange={handleEligibility}
                      // disabled={props.action === "view" ? true : false}
                      disabled={true}
                    />
                  </InputGroup>
                </FormGroup>
                {/* )} */}
              </div>
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>Last CD4 Result Date</Label>
                  <InputGroup>
                    <Input
                      type="text"
                      name="lastCd4ResultDate"
                      id="lastCd4ResultDate"
                      value={props.eligibility.lastCd4ResultDate}
                      onChange={handleEligibility}
                      // disabled={props.action === "view" ? true : false}
                      disabled={true}
                    />
                  </InputGroup>
                </FormGroup>
              </div>

              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>Last Viral Load Result</Label>
                  <InputGroup>
                    <Input
                      type="text"
                      name="lastViralLoadResult"
                      id="lastViralLoadResult"
                      value={props.eligibility.lastViralLoadResult}
                      onChange={handleEligibility}
                      // disabled={props.action === "view" ? true : false}
                      disabled={true}
                    />
                  </InputGroup>
                </FormGroup>
              </div>
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>Last Viral Load Result Date</Label>
                  <InputGroup>
                    <Input
                      type="text"
                      name="lastViralLoadResultDate"
                      id="lastViralLoadResultDate"
                      value={props.eligibility.lastViralLoadResultDate}
                      onChange={handleEligibility}
                      // disabled={props.action === "view" ? true : false}
                      disabled={true}
                    />
                  </InputGroup>
                </FormGroup>
              </div>
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>Eligible for Viral Load</Label>
                  <InputGroup>
                    <Input
                      type="select"
                      name="eligibleForViralLoad"
                      id="eligibleForViralLoad"
                      onChange={handleEligibility}
                      value={props.eligibility.eligibleForViralLoad}
                      disabled={props.action === "view" ? true : false}
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
          </form>
        </CardBody>
      </Card>
    </>
  );
};

export default Eligibility;
