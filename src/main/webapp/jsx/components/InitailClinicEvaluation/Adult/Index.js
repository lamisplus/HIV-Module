import React, { useCallback, useEffect, useState } from "react";
import { Button } from "semantic-ui-react";
import { Card, CardBody } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { Link, useHistory, useLocation } from "react-router-dom";
//import {TiArrowBack} from 'react-icons/ti'
//import {token, url as baseUrl } from "../../../api";
import "react-phone-input-2/lib/style.css";
import { Icon, Menu, Sticky } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import MedicalHistory from "./MedicalHistory";
import PastArv from "./PastArv";
import PhysicalExamination from "./PhysicalExamination";
import Appearance from "./Appearance";
import WhoStaging from "./WhoStaging";
import Plan from "./Plan";
import AdultRegimenNextAppointment from "./AdultRegimenNextAppointment";
import ChildRegimenNextAppointment from "./ChildRegimenNextAppointment";
import { calculate_age_to_number } from "../../../../utils";
// import RecencyTesting from './NewRegistration/RecencyTesting'
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  error: {
    color: "#f85032",
    fontSize: "12.8px",
  },
  success: {
    color: "#4BB543 ",
    fontSize: "11px",
  },
}));

const UserRegistration = (props) => {
  //const classes = useStyles();
  const location = useLocation();
  const locationState = location.state;
  //const [saving, setSaving] = useState(false);
  const [activeItem, setactiveItem] = useState("medical-history");
  const [completed, setCompleted] = useState([]);
  const [patientObj, setPatientObj] = useState("");
  const [observation, setObservation] = useState({
    data: {
      medicalHistory: "",
      currentMedical: "",
      patientDisclosure: "",
      pastArvMedical: "",
      physicalExamination: "",
      generalApperance: "",
      skin: "",
      eye: "",
      breast: "",
      cardiovascular: "",
      genitalia: "",
      respiratory: "",
      gastrointestinal: "",
      assesment: "",
      who: "",
      plan: "",
      regimen: "",
      enroll: "",
      planArt: "",
      nextAppointment: "",
      neurological: "",
      mentalstatus: "",
      visitDate: "",
      clinicianName: "",
    },
    dateOfObservation: null,
    facilityId: null,
    personId: patientObj && patientObj.id,
    type: "Clinical evaluation",
    visitId: null,
  });
  const handleItemClick = (activeItem) => {
    setactiveItem(activeItem);
    //setCompleted({...completed, ...completedMenu})
  };
  useEffect(() => {
    if (locationState && locationState.patientObj) {
      setPatientObj(locationState.patientObj);
    }
  }, []);

  const patientAge = calculate_age_to_number(props.patientObj.dateOfBirth);
  return (
    <>
      <div class="ui sticky">
        <Card>
          <CardBody>
            <div className="row">
              {patientAge < 14 ? (
                <h2>Pediatric- Initial Clinical Evaluation </h2>
              ) : (
                <h2>Adult- Initial Clinical Evaluation </h2>
              )}
              <br />
              <br />
              <form>
                <div className="col-md-3 float-start">
                  <Menu
                    size="large"
                    vertical
                    style={{ backgroundColor: "#014D88" }}
                  >
                    <Menu.Item
                      name="inbox"
                      active={activeItem === "medical-history"}
                      onClick={() => handleItemClick("medical-history")}
                      style={{
                        backgroundColor:
                          activeItem === "medical-history" ? "#000" : "",
                      }}
                      disabled={activeItem !== "medical-history" ? true : false}
                    >
                      <span style={{ color: "#fff" }}>
                        {" "}
                        Medical History
                        {completed.includes("medical-history") && (
                          <Icon name="check" color="green" />
                        )}
                      </span>
                    </Menu.Item>

                    <Menu.Item
                      name="inbox"
                      active={activeItem === "past-arv"}
                      onClick={() => handleItemClick("past-arv")}
                      style={{
                        backgroundColor:
                          activeItem === "past-arv" ? "#000" : "",
                      }}
                      disabled={activeItem !== "past-arv" ? true : false}
                    >
                      <span style={{ color: "#fff" }}>
                        Past/Current ARV
                        {completed.includes("past-arv") && (
                          <Icon name="check" color="green" />
                        )}
                      </span>

                      {/* <Label color='teal'>3</Label> */}
                    </Menu.Item>
                    <Menu.Item
                      name="spam"
                      active={activeItem === "physical-examination"}
                      onClick={() => handleItemClick("physical-examination")}
                      style={{
                        backgroundColor:
                          activeItem === "physical-examination" ? "#000" : "",
                      }}
                      disabled={
                        activeItem !== "physical-examination" ? true : false
                      }
                    >
                      {/* <Label>4</Label> */}
                      <span style={{ color: "#fff" }}>
                        Physical Examination
                        {completed.includes("physical-examination") && (
                          <Icon name="check" color="green" />
                        )}
                      </span>
                    </Menu.Item>

                    <Menu.Item
                      name="spam"
                      active={activeItem === "appearance"}
                      onClick={() => handleItemClick("appearance")}
                      style={{
                        backgroundColor:
                          activeItem === "appearance" ? "#000" : "",
                      }}
                      disabled={activeItem !== "appearance" ? true : false}
                    >
                      {/* <Label>4</Label> */}
                      <span style={{ color: "#fff" }}>
                        General Appearance
                        {completed.includes("appearance") && (
                          <Icon name="check" color="green" />
                        )}
                      </span>
                    </Menu.Item>
                    <Menu.Item
                      name="spam"
                      active={activeItem === "who"}
                      onClick={() => handleItemClick("who")}
                      style={{
                        backgroundColor: activeItem === "who" ? "#000" : "",
                      }}
                      disabled={activeItem !== "who" ? true : false}
                    >
                      {/* <Label>4</Label> */}
                      <span style={{ color: "#fff" }}>
                        Assessment & WHO
                        {completed.includes("who") && (
                          <Icon name="check" color="green" />
                        )}
                      </span>
                    </Menu.Item>
                    <Menu.Item
                      name="spam"
                      active={activeItem === "plan"}
                      onClick={() => handleItemClick("plan")}
                      style={{
                        backgroundColor: activeItem === "plan" ? "#000" : "",
                      }}
                      disabled={activeItem !== "plan" ? true : false}
                    >
                      {/* <Label>4</Label> */}
                      <span style={{ color: "#fff" }}>
                        Plan & Enroll In
                        {completed.includes("plan") && (
                          <Icon name="check" color="green" />
                        )}
                      </span>
                    </Menu.Item>

                    <Menu.Item
                      name="spam"
                      active={activeItem === "regimen"}
                      onClick={() => handleItemClick("regimen")}
                      style={{
                        backgroundColor: activeItem === "regimen" ? "#000" : "",
                      }}
                      //disabled={activeItem !== 'regimen' ? true : false}
                    >
                      {/* <Label>4</Label> */}
                      <span style={{ color: "#fff" }}>
                        Regimen & <br />
                        Next Appointment
                        {completed.includes("regimen") && (
                          <Icon name="check" color="green" />
                        )}
                      </span>
                    </Menu.Item>
                  </Menu>
                </div>
                <div
                  className="col-md-9 float-end"
                  style={{ backgroundColor: "#fff" }}
                >
                  {activeItem === "medical-history" && (
                    <MedicalHistory
                      handleItemClick={handleItemClick}
                      setCompleted={setCompleted}
                      completed={completed}
                      setPatientObj={setPatientObj}
                      patientObj={patientObj}
                      setObservation={setObservation}
                      observation={observation}
                      patientAge={patientAge}
                    />
                  )}
                  {activeItem === "past-arv" && (
                    <PastArv
                      handleItemClick={handleItemClick}
                      setCompleted={setCompleted}
                      completed={completed}
                      setPatientObj={setPatientObj}
                      patientObj={patientObj}
                      setObservation={setObservation}
                      observation={observation}
                      patientAge={patientAge}
                    />
                  )}
                  {activeItem === "physical-examination" && (
                    <PhysicalExamination
                      handleItemClick={handleItemClick}
                      setCompleted={setCompleted}
                      completed={completed}
                      setPatientObj={setPatientObj}
                      patientObj={patientObj}
                      setObservation={setObservation}
                      observation={observation}
                      patientAge={patientAge}
                    />
                  )}
                  {activeItem === "appearance" && (
                    <Appearance
                      handleItemClick={handleItemClick}
                      setCompleted={setCompleted}
                      completed={completed}
                      setPatientObj={setPatientObj}
                      patientObj={patientObj}
                      setObservation={setObservation}
                      observation={observation}
                      patientAge={patientAge}
                    />
                  )}
                  {activeItem === "who" && (
                    <WhoStaging
                      handleItemClick={handleItemClick}
                      setCompleted={setCompleted}
                      completed={completed}
                      setPatientObj={setPatientObj}
                      patientObj={patientObj}
                      setObservation={setObservation}
                      observation={observation}
                      patientAge={patientAge}
                    />
                  )}
                  {activeItem === "plan" && (
                    <Plan
                      handleItemClick={handleItemClick}
                      setCompleted={setCompleted}
                      completed={completed}
                      setPatientObj={setPatientObj}
                      patientObj={patientObj}
                      setObservation={setObservation}
                      observation={observation}
                      patientAge={patientAge}
                    />
                  )}
                  {activeItem === "regimen" && (
                    <>
                      {patientAge < 14 ? (
                        <ChildRegimenNextAppointment
                          handleItemClick={handleItemClick}
                          setCompleted={setCompleted}
                          completed={completed}
                          setPatientObj={setPatientObj}
                          patientObj={patientObj}
                          setObservation={setObservation}
                          observation={observation}
                          activeContent={props.activeContent}
                          setActiveContent={props.setActiveContent}
                        />
                      ) : (
                        <AdultRegimenNextAppointment
                          handleItemClick={handleItemClick}
                          setCompleted={setCompleted}
                          completed={completed}
                          setPatientObj={setPatientObj}
                          patientObj={patientObj}
                          setObservation={setObservation}
                          observation={observation}
                          activeContent={props.activeContent}
                          setActiveContent={props.setActiveContent}
                        />
                      )}
                    </>
                  )}
                </div>
              </form>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default UserRegistration;
