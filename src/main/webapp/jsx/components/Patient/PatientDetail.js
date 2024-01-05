import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { url as baseUrl, token } from "./../../../api";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import { Sticky } from "semantic-ui-react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import PatientCardDetail from "./PatientCard";
import { useHistory } from "react-router-dom";
import SubMenu from "./SubMenu";
import RecentHistory from "./../History/RecentHistory";
import ClinicVisit from "../Consultation/Index";
import Pharmacy from "./../Pharmacy/Index";
import Laboratory from "./../Laboratory/index";
import DashboardFilledTransferForm from "./DashboardFilledTransferForm";
import EnhancedAdherenceCounseling from "../EnhancedAdherenceCounseling/Index";
import CervicalCancer from "./../CervicalCancer/Index";
import CervicalCancerUpdate from "./../CervicalCancer/ViewPage";
import ClientStatusUpdate from "./../ClientStatusUpdate/ClientStatusUpdate";
//import AdultClinicEvaluationFrom from '../InitailClinicEvaluation/index__'
import AdultClinicEvaluationForm from "../InitailClinicEvaluation/Adult/Index";
import ViewAdultClinicEvaluationForm from "../InitailClinicEvaluation/ViewAdultHistory/Index";
//import ChildClinicEvaluationForm from '../InitailClinicEvaluation/ChildClinicEvaluationForm'
import MentalHealthScreening from "../MentalHealthScreening/index";
import LabHistory from "./../Laboratory/LabHistory";
import PatientHistory from "./../History/PatientHistory";
import ArtCommencement from "./../ArtCommencement/ArtCommencement";
import ArtCommencementPage from "./../ArtCommencement/ArtCommencementPage";
//History of patient
import ViewMentalHealthScreening from "./../MentalHealthScreening/ViewMhs";
//import ViewAdultClinicEvaluationFrom from './../InitailClinicEvaluation/ViewAdultClinicEvaluationFrom'
import ViewArtCommencement from "./../ArtCommencement/ViewArtCommencement";
import FirstEac from "./../EnhancedAdherenceCounseling/ViewEAC/FirstEac";
import SecondEac from "./../EnhancedAdherenceCounseling/ViewEAC/SecondEac";
import ThirdEac from "./../EnhancedAdherenceCounseling/ViewEAC/ThirdEac";
import ViewLaboratory from "./../Laboratory/ViewLaboratory";
import PharmacyRefillViewUpdate from "./../Pharmacy/PharmacyRefillViewUpdate";
import Biometrics from "./Biometric";
import TrackingForm from "./../TrackingForm/Index";
import TrackingFormUpdate from "./../TrackingForm/ViewUpdate";
import FirstEacPage from "./../EnhancedAdherenceCounseling/FirstEAC";
import EACOUTCOME from "../EnhancedAdherenceCounseling/EacOutCome";
import EACSESSION from "./../EnhancedAdherenceCounseling/SessionList";
import EACSESSIONUPDATE from "./../EnhancedAdherenceCounseling/ViewUpdateEACSessions";
import NEWEACSESSION from "./../EnhancedAdherenceCounseling/NewSessions";
import ChronicCare from "./../ChronicCare/Index";
import LabOrderResult from "./../Laboratory/LabOrderResult/index";
import ViralLoadOrderResult from "./../Laboratory/ViralLoadOrderResult/index";
import IntensiveFollowUpUpdate from "./../IntensiveFollowUp/ViewUpdate";
import IntensiveFollowUp from "./../IntensiveFollowUp/Index";
import TransferForm from "./../TransferForm/Index";
import ViewUpdateLabOrderResult from "./../Laboratory/LabOrderResult/UpdateLabOrderResult";
import UpdateViewViralLoadOrderResult from "./../Laboratory/ViralLoadOrderResult/UpdateViewViralLoadOrderResult";
import OtzServiceForm from "./../Otz/ServiceForm";
import OtzPeadiatricDisclosureChecklist from "./../Otz/PeadiatricDisclosureChecklist";
import OtzRegister from "./../Otz/Register";
import EnrollmentOtz from "../Otz/Enrollment";

const styles = (theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: "bottom",
    height: 20,
    width: 20,
  },
  details: {
    alignItems: "center",
  },
  column: {
    flexBasis: "20.33%",
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
});

function PatientCard(props) {
  let history = useHistory();
  const [art, setArt] = useState(false);
  const [activeContent, setActiveContent] = useState({
    route: "recent-history",
    id: "",
    activeTab: "home",
    actionType: "create",
    obj: {},
  });
  const { classes } = props;
  const patientObj =
    history.location && history.location.state
      ? history.location.state.patientObj
      : {};
  const [patientObj1, setPatientObj1] = useState(null);
  useEffect(() => {
    PatientCurrentObject();
    //CheckBiometric();
  }, []);

  ///GET Patient
  const PatientCurrentObject = () => {
    axios
      .get(`${baseUrl}hiv/patient/${patientObj.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        //console.log("patient obj 1" + JSON.stringify(response.data));
        setPatientObj1(response.data);
      })
      .catch((error) => {});
  };

  return (
    <div className={classes.root}>
      <div
        className="row page-titles mx-0"
        style={{ marginTop: "0px", marginBottom: "-10px" }}
      >
        <ol className="breadcrumb">
          <li className="breadcrumb-item active">
            <h4>
              {" "}
              <Link to={"/"}>HIV /</Link> Patient Dashboard
            </h4>
          </li>
        </ol>
      </div>
      <Card>
        <CardContent>
          <PatientCardDetail
            patientObj={patientObj}
            setArt={setArt}
            setActiveContent={setActiveContent}
            patientObj1={patientObj1}
          />
          <Sticky>
            <SubMenu
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              expandedPatientObj={patientObj1}
              art={art}
              activeContent={activeContent}

            />
          </Sticky>
          <br />
          {activeContent.route === "recent-history" && (
            <RecentHistory
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
          {activeContent.route === "biometrics" && (
            <Biometrics
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
          {activeContent.route === "consultation" && (
            <ClinicVisit
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
              PatientCurrentObject={PatientCurrentObject}
            />
          )}
          {/* {activeContent==='child-consultation' &&( <ChildConsultation patientObj={patientObj} setActiveContent={setActiveContent}/>)} */}
          {activeContent.route === "pharmacy" && (
            <Pharmacy
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
              PatientCurrentObject={PatientCurrentObject}
            />
          )}
          {activeContent.route === "laboratory" && (
            <Laboratory
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}

          {activeContent.route === "counseling" && (
            <EnhancedAdherenceCounseling
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
          {activeContent.route === "cervical-cancer" && (
            <CervicalCancer
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
          {activeContent.route === "cervical-cancer-update" && (
            <CervicalCancerUpdate
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
          {activeContent.route === "status-update" && (
            <ClientStatusUpdate
              patientObj={patientObj}
              setActiveContent={setActiveContent}
            />
          )}
          {activeContent.route === "adult-evaluation" && (
            <AdultClinicEvaluationForm
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
          {/* {activeContent.route==='child-evaluation' &&( <ChildClinicEvaluationForm patientObj={patientObj} setActiveContent={setActiveContent} activeContent={activeContent}/>)} */}
          {activeContent.route === "mhs" && (
            <MentalHealthScreening
              patientObj={patientObj}
              setActiveContent={setActiveContent}
            />
          )}
          {activeContent.route === "lab-history" && (
            <LabHistory
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
          {activeContent.route === "patient-history" && (
            <PatientHistory
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
          {activeContent.route === "art-commencement" && (
            <ArtCommencement
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
          {activeContent.route === "art-commencementPage" && (
            <ArtCommencementPage
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
          {/* History Pages */}
          {activeContent.route === "mental-health-view" && (
            <ViewMentalHealthScreening
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
          {activeContent.route === "adult-clinic-eveluation-view" && (
            <ViewAdultClinicEvaluationForm
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
          {activeContent.route === "art-commencement-view" && (
            <ViewArtCommencement
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
          {activeContent.route === "first-eac-history" && (
            <FirstEac
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
          {activeContent.route === "second-eac-history" && (
            <SecondEac
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
          {activeContent.route === "completed-eac-history" && (
            <ThirdEac
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
          {activeContent.route === "lab-view" && (
            <ViewLaboratory
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
          {activeContent.route === "pharmacy-update" && (
            <PharmacyRefillViewUpdate
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
              PatientCurrentObject={PatientCurrentObject}
            />
          )}
          {activeContent.route === "tracking-form" && (
            <TrackingForm
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
              PatientCurrentObject={PatientCurrentObject}
            />
          )}
          {activeContent.route === "client-tracker" && (
            <TrackingFormUpdate
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
              PatientCurrentObject={PatientCurrentObject}
            />
          )}
          {activeContent.route === "first-eac" && (
            <FirstEacPage
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
          {activeContent.route === "eac-outcome" && (
            <EACOUTCOME
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
          {activeContent.route === "eac-session" && (
            <EACSESSION
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
          {activeContent.route === "eac-session-update" && (
            <EACSESSIONUPDATE
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
          {activeContent.route === "new-eac-session" && (
            <NEWEACSESSION
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
          {activeContent.route === "chronic-care" && (
            <ChronicCare
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
          {activeContent.route === "laboratoryOrderResult" && (
            <LabOrderResult
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
          {activeContent.route === "laboratoryViralLoadOrderResult" && (
            <ViralLoadOrderResult
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
          {activeContent.route === "intensive-followup" && (
            <IntensiveFollowUp
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
          {activeContent.route === "intensive-follow-up-update" && (
            <IntensiveFollowUpUpdate
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
          {activeContent.route === "transfer-form" && (
            <TransferForm
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
              PatientCurrentObject={PatientCurrentObject}
            />
          )}

          {activeContent.route === "lab-view-viral-load-order-result" && (
            <UpdateViewViralLoadOrderResult
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
          {activeContent.route === "lab-view-order-result" && (
            <ViewUpdateLabOrderResult
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}

          {activeContent.route === "otz-service-form" && (
            <OtzServiceForm
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={{...activeContent,
                patientId: patientObj?.id || patientObj1?.id,
              }}
              expandedPatientObj={patientObj1}
              art={art}

            />
          )}
          {activeContent.route === "otz-enrollment-form" && (
            <EnrollmentOtz
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
          {activeContent.route === "otz-register" && (
            <OtzRegister
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}

          {activeContent.route === "filled-transferForm" && (
            <DashboardFilledTransferForm
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
          {activeContent.route === "otz-peadiatric-disclosure-checklist" && (
            <OtzPeadiatricDisclosureChecklist
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

PatientCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PatientCard);
