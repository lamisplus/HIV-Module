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
import * as moment from "moment";
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
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Button } from "semantic-ui-react";
import { Modal } from "react-bootstrap";

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

const PositiveHealthDignity = (props) => {
  const handleInputChange = (e) => {
    props.setPreventive({
      ...props.preventive,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Card>
        <CardBody>
          <form>
            <div className="row">
              <h3>Prevent HIV Transmission</h3>
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>
                    How many doses of ARV's have you missed since the last
                    appointment (if on ART)?
                  </Label>
                  <Input
                    type="select"
                    name="lastAppointment"
                    id="lastAppointment"
                    onChange={handleInputChange}
                    value={props.preventive.lastAppointment}
                    disabled={props.action === "view" ? true : false}
                  >
                    <option value="">Select</option>
                    <option value="≤3">≤ 3</option>
                    <option value="4-8">4-8</option>
                    <option value="≥9">≥ 9</option>
                  </Input>
                </FormGroup>
              </div>
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>Medication adherence counseling done?</Label>
                  <Input
                    type="select"
                    name="medication"
                    id="medication"
                    onChange={handleInputChange}
                    value={props.preventive.medication}
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
                  <Label>
                    Have you disclosed your status to your parent(s)?
                  </Label>
                  <Input
                    type="select"
                    name="parentStatus"
                    id="parentStatus"
                    onChange={handleInputChange}
                    value={props.preventive.parentStatus}
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
                  <Label>
                    Do you use condoms during every sexual encounter?
                  </Label>
                  <Input
                    type="select"
                    name="condoms"
                    id="condoms"
                    onChange={handleInputChange}
                    value={props.preventive.condoms}
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
                  <Label>Condom use counseling done?</Label>
                  <Input
                    type="select"
                    name="condomCounseling"
                    id="condomCounseling"
                    onChange={handleInputChange}
                    value={props.preventive.condomCounseling}
                    disabled={props.action === "view" ? true : false}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Input>
                </FormGroup>
              </div>

              <div className="row">
                <br />
                <h3>Prevent Diseases/Optimistic Infections</h3>
                <div className="form-group mb-3 col-md-6">
                  <FormGroup>
                    <Label>
                      Do you/partner have genital
                      sores/rash/pain/discharge/bleeding?
                    </Label>
                    <Input
                      type="select"
                      name="preventDiseases"
                      id="preventDiseases"
                      onChange={handleInputChange}
                      value={props.preventive.preventDiseases}
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
                    <Label>
                      How many doses of Cotrimoxazole have you missed since the
                      last appointment?
                    </Label>
                    <Input
                        type="number" min="0"
                      name="cotrimoxazole"
                      id="cotrimoxazole"
                      onChange={handleInputChange}
                      value={props.preventive.cotrimoxazole}
                      disabled={props.action === "view" ? true : false}
                    />
                  </FormGroup>
                </div>
              </div>
              <div className="row">
                <br />
                <h3>Promote Health Living</h3>
                <div className="form-group mb-3 col-md-6">
                  <FormGroup>
                    <Label>How regularly do you take alcohol in a week?</Label>
                    <Input
                      type="select"
                      name="alcohol"
                      id="alcohol"
                      onChange={handleInputChange}
                      value={props.preventive.alcohol}
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
                    <Label>Nutrituional counseling done?</Label>
                    <Input
                      type="select"
                      name="nutrituional"
                      id="nutrituional"
                      onChange={handleInputChange}
                      value={props.preventive.nutrituional}
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
                    <Label>WASH counseling done?</Label>
                    <Input
                      type="select"
                      name="wash"
                      id="wash"
                      onChange={handleInputChange}
                      value={props.preventive.wash}
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
                    <Label>Additional PHDP services provided?</Label>
                    <Input
                      type="select"
                      name="phdp"
                      id="phdp"
                      onChange={handleInputChange}
                      value={props.preventive.phdp}
                      disabled={props.action === "view" ? true : false}
                    >
                      <option value="">Select</option>
                      <option value="Insecticide treated nets">
                        Insecticide treated nets
                      </option>
                      <option value="Intermittent prophylactic treatment">
                        Intermittent prophylactic treatment 
                      </option>
                      <option value="Cervical Cancer Screening">
                        Cervical Cancer Screening 
                      </option>
                      <option value="Active member of SG">
                        Active member of SG
                      </option>
                      <option value="Family Planning">Family Planning </option>
                      <option value="Basic care kits">Basic care kits</option>
                      <option value="Disclosure counseling">
                        Disclosure counseling
                      </option>
                      <option value="Social Services">Social Services</option>
                      <option value="Linkage to IGAs">Linkage to IGAs</option>

                      <option value="Leg ">Leg </option>
                      <option value="Mental Health">Mental Health</option>
                      <option value="Others">Others</option>
                    </Input>
                  </FormGroup>
                </div>
              </div>
            </div>
            <br />
          </form>
        </CardBody>
      </Card>
    </>
  );
};

export default PositiveHealthDignity;
