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
import { token, url as baseUrl } from "../../../api";
import "react-phone-input-2/lib/style.css";
import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import "react-phone-input-2/lib/style.css";
import { Button } from "semantic-ui-react";
import moment from "moment";

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

const ChronicConditionsTwo = (props) => {
  const classes = useStyles();
  //const history = useHistory();
  const [errors, setErrors] = useState({});
  let temp = { ...errors };

  useEffect(() => {}, []);

  const handleInputChange = (e) => {
    props.setChronicConditions({
      ...props.chronicConditions,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <>
      <Card>
        <h2 style={{ color: "#000" }}>
          Screening for Chronic Conditions(Diabetics)
        </h2>
        <br />
        <form>
          <div className="row">
            <div className="form-group mb-3 col-md-6">
              <FormGroup>
                <Label>Know diabetic?</Label>
                <Input
                  type="select"
                  name="diabetic"
                  id="diabetic"
                  onChange={handleInputChange}
                  value={props.chronicConditions.diabetic}
                  disabled={props.action === "view" ? true : false}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Input>
              </FormGroup>
            </div>
            {props.chronicConditions.diabetic === "Yes" && (
              <>
                <div className="form-group mb-3 col-md-6">
                  <FormGroup>
                    <Label>Date of start of Diabetes Treatment ?</Label>
                    <Input
                      type="date"
                      name="dateOfStartOfDiabetesTreatment"
                      id="dateOfStartOfDiabetesTreatment"
                      value={
                        props.chronicConditions.dateOfStartOfDiabetesTreatment
                      }
                      min={moment(
                        props.chronicConditions.dateOfStartOfDiabetesTreatment
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
                </div>
                <div className="form-group mb-3 col-md-6">
                  <FormGroup>
                    <Label>Increased frequency of urination</Label>
                    <Input
                      type="select"
                      name="frequencyUrination"
                      id="frequencyUrination"
                      onChange={handleInputChange}
                      value={props.chronicConditions.frequencyUrination}
                      disabled={props.action === "view" ? true : false}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Input>
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-6">
                  <FormGroup>
                    <Label>Increased water(fluid) intake?</Label>
                    <Input
                      type="select"
                      name="increaseWater"
                      id="increaseWater"
                      onChange={handleInputChange}
                      value={props.chronicConditions.increaseWater}
                      disabled={props.action === "view" ? true : false}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Input>
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-6">
                  <FormGroup>
                    <Label>Increased food intake (without weight gain)</Label>
                    <Input
                      type="select"
                      name="increaseFood"
                      id="increaseFood"
                      onChange={handleInputChange}
                      value={props.chronicConditions.increaseFood}
                      disabled={props.action === "view" ? true : false}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Input>
                  </FormGroup>
                </div>
              </>
            )}
          </div>
        </form>
      </Card>
    </>
  );
};

export default ChronicConditionsTwo;
