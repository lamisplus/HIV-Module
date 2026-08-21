import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { url as baseUrl, token } from "./../../../api";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import { Sticky, Button } from "semantic-ui-react";
import { Modal } from "react-bootstrap";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import AdultClinicEvaluationForm from "../InitailClinicEvaluation/Adult/Index";
import ViewAdultClinicEvaluationForm from "../InitailClinicEvaluation/ViewAdultHistory/Index";
import AdherencePreparationIndex from "../../revised-national-tool-forms/pages/AdherencePreparation/Index";
import InitialClinicalEvaluationForm from "../../revised-national-tool-forms/pages/InitialClinicalEvaluation/Index";
import InitialClinicalEvaluationView from "../../revised-national-tool-forms/pages/InitialClinicalEvaluation/View";
import InitialClinicalEvaluationUpdate from "../../revised-national-tool-forms/pages/InitialClinicalEvaluation/Update";
import EnrollmentAndCommencementForm from "../../revised-national-tool-forms/pages/EnrollmentAndCommencement/Index";
import EnrollmentAndCommencementView from "../../revised-national-tool-forms/pages/EnrollmentAndCommencement/View";
import EnrollmentAndCommencementUpdate from "../../revised-national-tool-forms/pages/EnrollmentAndCommencement/Update";
import CareCardFollowUpForm from "../../revised-national-tool-forms/pages/CareCardFollowUp/CareCardFollowUpTabs";
import HealthServicesForm from "../../revised-national-tool-forms/pages/HealthServices/Index";
import SubstitutionSwitchForm from "../../revised-national-tool-forms/pages/SubstitutionSwitch/Index";
import TransferInForm from "../../revised-national-tool-forms/pages/TransferIn/Index";
import IntegratedLabOrderForm from "../../revised-national-tool-forms/pages/IntegratedLabOrderForm/Index";
import MentalHealthScreening from "../MentalHealthScreening/index";
import LabHistory from "./../Laboratory/LabHistory";
import PatientHistory from "./../History/PatientHistory";
import ArtCommencement from "./../ArtCommencement/ArtCommencement";
import ArtCommencementPage from "./../ArtCommencement/ArtCommencementPage";

import ViewMentalHealthScreening from "./../MentalHealthScreening/ViewMhs";
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
import ClientVerficationForm from "./../ClientVerfication/ClientVerification";
import TransferForm from "./../TransferForm/Index";
import ViewUpdateLabOrderResult from "./../Laboratory/LabOrderResult/UpdateLabOrderResult";
import UpdateViewViralLoadOrderResult from "./../Laboratory/ViralLoadOrderResult/UpdateViewViralLoadOrderResult";
import OtzServiceForm from "./../Otz/ServiceForm";
import OtzPeadiatricDisclosureChecklist from "./../Otz/PeadiatricDisclosureChecklist";
import OtzRegister from "./../Otz/Register";
import Tracking from "../ClientVerfication/ClientVerification";
import ClientVerification from "../ClientVerfication/ClientVerification";
import EnrollmentOtz from "../Otz/Enrollment";
import ViewChronicCare from "../ChronicCare/viewChronicCare";
import DsdServiceForm from "../DSD/DsdServiceForm";
import DsdServiceFormView from "../DSD/DsdServiceFormView";
// import EACOutcome from "../EnhancedAdherenceCounseling/EacOutCome";
import EACOutcome from "../EnhancedAdherenceCounseling/EACOutcome/index";
import ViewUpdateEACOutcome from "../EnhancedAdherenceCounseling/EACOutcome/ViewUpdateEACOutcome";
import PatientVisits from "./PatientVisits";

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
  // ── patientObj is now a state, seeded once from the router-state snapshot ──
  // Previously this was re-derived from history.location.state on every render,
  // which meant fields like hasTransferIn were frozen at whatever they were when
  // the user first landed on this page — stale by the time later steps in the
  // Transfer-In → ICE → Enrollment flow needed them. This file never pushes new
  // router state to itself mid-session, so seeding once and then explicitly
  // merging fresh fields (below, once the patient record is refetched) is safe
  // and gives every child that reads props.patientObj up-to-date data without
  // needing a full page refresh.
  const [patientObj, setPatientObj] = useState(() =>
      history.location && history.location.state
          ? history.location.state.patientObj
          : {}
  );
  const enrollmentFlow =
      history.location && history.location.state
          ? history.location.state.enrollmentFlow
          : false;
  const skipICE =
      history.location && history.location.state
          ? history.location.state.skipICE
          : false;
  const fromTransferIn =
      history.location && history.location.state
          ? history.location.state.fromTransferIn
          : false;
  const pepClient =
      history.location && history.location.state
          ? history.location.state.pepClient
          : false;
  const viralLoadForm =
      history.location && history.location.state
          ? history.location.state.viralLoadForm
          : false;
  const viralLoadHistory =
      history.location && history.location.state
          ? history.location.state.viralLoadHistory
          : false;


  const [patientObj1, setPatientObj1] = useState(null);
  const [showModal, setShowModal] = useState({ show: false, message: "" });
  const [checkingEnrollmentStatus, setCheckingEnrollmentStatus] = useState(enrollmentFlow);
  useEffect(() => {
    const getCurrentPatientRecord = async (id) => {
      try {
        const response = await axios.get(`${baseUrl}hiv/patient/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatientObj1(response.data);
        // Merge the up-to-date derived flags into patientObj so every child
        // reading props.patientObj (not just patientObj1) sees current data.
        setPatientObj((prev) => ({
          ...prev,
          hasTransferIn: !!response.data.transferIn || response.data.hasTransferIn === true,
          hasiceform: response.data.hasiceform,
          hasenrollmentform: response.data.hasenrollmentform,
          currentStatus: response.data.currentStatus,
        }));
      } catch (error) {
        if (error.response && error.response.data) {
          let errorMessage =
              error.response.data.apierror &&
              error.response.data.apierror.message !== ""
                  ? error.response.data.apierror.message
                  : "Something went wrong, please try again";
          toast.error(errorMessage);
        } else {
          toast.error("Something went wrong. Please try again...");
        }
      }
    };

    if (patientObj?.id) {
      getCurrentPatientRecord(patientObj.id);
    }
  }, [patientObj?.id]);

  // Refresh patient data when navigating to enrollment form or recent history
  // This ensures hasiceform and hasenrollmentform flags are up to date
  useEffect(() => {
    const refreshPatientData = async () => {
      if (patientObj?.id && (
          activeContent.route === 'enrollment-and-commencement' ||
          activeContent.route === 'recent-history'
      )) {
        try {
          const response = await axios.get(`${baseUrl}hiv/patient/${patientObj.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setPatientObj1(response.data);
          // Same merge here — this is the refetch that fires right when the
          // user navigates into the Enrollment & Commencement step.
          setPatientObj((prev) => ({
            ...prev,
            hasTransferIn: !!response.data.transferIn || response.data.hasTransferIn === true,
            hasiceform: response.data.hasiceform,
            hasenrollmentform: response.data.hasenrollmentform,
            currentStatus: response.data.currentStatus,
          }));
        } catch (error) {
          console.log("Error refreshing patient data:", error);
        }
      }
    };

    refreshPatientData();
  }, [activeContent.route, activeContent.refreshTimestamp, patientObj?.id]);

  const PatientCurrentObject = () => {
    useEffect(() => {
      axios
          .get(`${baseUrl}hiv/patient/${patientObj.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            setPatientObj1(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
    }, []);
  };

  const hideModal = () => {
    setShowModal({ show: false, message: "" });
  };

  useEffect(() => {
    axios
        .get(
            `${baseUrl}observation/tpt-completion-status-info?personUuid=${patientObj.personUuid}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
        )
        .then((response) => {
          const drugsOfInterest = [
            "Isoniazid-(INH) 100mg",
            "Isoniazid-(INH) 300mg",
            "Isoniazid 100mg",
            "Isoniazid 300mg",
            "Isoniazid(300mg)/Pyridoxine(25mg)/Cotrimoxazole(960mg)",
            "Isoniazid and Rifapentine-(3HP)",
            "Isoniazid and Rifampicin-(3HR)",
          ];

          const matchingObject = Array.isArray(response?.data)
              ? response.data.find((item) =>
                  item.pharmacyData.regimens.some((regimen) =>
                      drugsOfInterest.includes(regimen.name)
                  )
              )
              : null;

          if (matchingObject) {
            const { observationData, pharmacyData, visitDate } = matchingObject;
            if (observationData.tptMonitoring.outComeOfIpt !== "") {
              setShowModal({ show: false, message: "" });
              return;
            }
            const regimenNames = pharmacyData.regimens.map(
                (regimen) => regimen.regimenName
            );
            const visitDateObj = new Date(visitDate);
            const today = new Date();
            const differenceInDays = Math.floor(
                (today - visitDateObj) / (1000 * 3600 * 24)
            );

            if (
                differenceInDays >= 180 &&
                regimenNames.some((name) =>
                    [
                      "Isoniazid-(INH) 300mg",
                      "Isoniazid-(INH) 100mg",
                      "Isoniazid 100mg",
                      "Isoniazid 300mg",
                      "Isoniazid(300mg)/Pyridoxine(25mg)/Cotrimoxazole(960mg)",
                    ].includes(name)
                )
            ) {
              setShowModal({
                show: true,
                message: `Patient ID: ${patientObj.hospitalNumber} was initiated on TPT 180 days ago: Please update Outcome of TPT`,
              });
            } else if (
                differenceInDays >= 90 &&
                regimenNames.some((name) =>
                    [
                      "Isoniazid and Rifapentine-(3HP)",
                      "Isoniazid and Rifampicin-(3HR)",
                    ].includes(name)
                )
            ) {
              setShowModal({
                show: true,
                message: ` Patient ID: ${patientObj.hospitalNumber} was initiated on TPT 90 days ago: Please update Outcome of TPT`,
              });
            } else {
              setShowModal({ show: false, message: "" });
            }
          } else {
            setShowModal({ show: false, message: "" });
          }
        })
        .catch((error) => {
          console.error(error);
        });
  }, [patientObj.personUuid]);

  // Auto-open appropriate form when enrollmentFlow is true
  // NEW FLOW: AdherencePreparation → ICE → Enrollment & Commencement
  useEffect(() => {
    const checkEnrollmentStatusAndRoute = async () => {
      if (!enrollmentFlow || !patientObj?.id) {
        setCheckingEnrollmentStatus(false);
        return;
      }

      // If skipICE flag is set, go directly to enrollment form without checking
      if (skipICE) {
        setActiveContent({
          route: "enrollment-and-commencement",
          id: "",
          activeTab: "home",
          actionType: "create",
          obj: {},
        });
        setCheckingEnrollmentStatus(false);
        return;
      }

      try {
        // STEP 1: Check if Adherence Preparation is completed (NEW - FIRST CHECK)
        let isAdherenceCompleted = false;
        try {
          const adherenceResponse = await axios.get(
              `${baseUrl}hiv/adherence-preparation/person/${patientObj.id}?pageNo=0&pageSize=1`,
              { headers: { Authorization: `Bearer ${token}` } }
          );
          isAdherenceCompleted = adherenceResponse.data && adherenceResponse.data.content && adherenceResponse.data.content.length > 0;
        } catch (adherenceError) {
          isAdherenceCompleted = false;
        }

        // If Adherence Preparation is NOT done, open Adherence Preparation form
        if (!isAdherenceCompleted) {
          setActiveContent({
            route: "adherence-preparation",
            id: "",
            activeTab: "home",
            actionType: "create",
            obj: {},
          });
          setCheckingEnrollmentStatus(false);
          return;
        }

        // STEP 2: Check if ICE form is already completed
        const iceResponse = await axios.get(
            `${baseUrl}hiv/observation/initial-clinical-evaluation/exists/person/${patientObj.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const isICECompleted = typeof iceResponse.data === 'boolean' ? iceResponse.data : false;

        if (isICECompleted) {
          // STEP 3: ICE is done, now check if Enrollment & Commencement is also done
          try {
            const enrollmentResponse = await axios.get(
                `${baseUrl}hiv/enrollment-commencement/person/${patientObj.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // If we get a response with data, enrollment exists
            const isEnrollmentCompleted = enrollmentResponse.data && enrollmentResponse.data.id;
            if (isEnrollmentCompleted) {
              // All forms done (Adherence + ICE + Enrollment), route to recent history
              setActiveContent({
                route: "recent-history",
                id: "",
                activeTab: "home",
                actionType: "",
                obj: {},
              });
            } else {
              // Adherence and ICE done but Enrollment is not, route to Enrollment & Commencement form
              setActiveContent({
                route: "enrollment-and-commencement",
                id: "",
                activeTab: "home",
                actionType: "create",
                obj: {},
              });
            }
          } catch (enrollmentError) {
            // If 404 or any error, enrollment doesn't exist
            setActiveContent({
              route: "enrollment-and-commencement",
              id: "",
              activeTab: "home",
              actionType: "create",
              obj: {},
            });
          }
        } else {
          // Adherence is done but ICE not done yet, open ICE form
          setActiveContent({
            route: "initial-clinical-evaluation",
            id: "",
            activeTab: "home",
            actionType: "create",
            obj: {},
          });
        }
      } catch (error) {
        // Default to Adherence Preparation form if check fails
        setActiveContent({
          route: "adherence-preparation",
          id: "",
          activeTab: "home",
          actionType: "create",
          obj: {},
        });
      } finally {
        setCheckingEnrollmentStatus(false);
      }
    };

    checkEnrollmentStatusAndRoute();
  }, [enrollmentFlow, patientObj?.id]);

  // Auto-open viral load form for PEP clients
  useEffect(() => {
    if (pepClient && viralLoadForm && patientObj?.id) {
      setActiveContent({
        route: "laboratoryViralLoadOrderResult",
        id: "",
        activeTab: "viralLoad",
        actionType: "create",
        obj: {},
        pepClient: true,  // Pass pepClient flag through activeContent
      });
    }
  }, [pepClient, viralLoadForm, patientObj?.id]);

  // Auto-open viral load history tab for PEP clients with sample awaiting result
  useEffect(() => {
    if (pepClient && viralLoadHistory && patientObj?.id) {
      setActiveContent({
        route: "laboratoryViralLoadOrderResult",
        id: "",
        activeTab: "history",
        actionType: "",
        obj: {},
        pepClient: true,
      });
    }
  }, [pepClient, viralLoadHistory, patientObj?.id]);

  // Show loading state while checking enrollment status
  if (checkingEnrollmentStatus) {
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
              <div style={{ textAlign: "center", padding: "40px" }}>
                <Typography>Checking enrollment status...</Typography>
              </div>
            </CardContent>
          </Card>
        </div>
    );
  }

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
                patientObj1={patientObj1 !== null ? patientObj1 : patientObj}
            />
            <Sticky>
              <SubMenu
                  patientObj={patientObj}
                  setActiveContent={setActiveContent}
                  expandedPatientObj={patientObj1}
                  art={art}
                  activeContent={activeContent}
                  pepClient={pepClient}
                  viralLoadForm={viralLoadForm}
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
            {activeContent.route === "adherence-preparation" && (
                <AdherencePreparationIndex
                    patientObj={patientObj}
                    setActiveContent={setActiveContent}
                    activeContent={activeContent}
                />
            )}
            {activeContent.route === "initial-clinical-evaluation" && (
                <InitialClinicalEvaluationForm
                    patientObj={patientObj}
                    setActiveContent={setActiveContent}
                    activeContent={activeContent}
                    fromTransferIn={fromTransferIn}
                />
            )}
            {activeContent.route === "initial-clinical-evaluation-view" && (
                <InitialClinicalEvaluationView
                    patientObj={patientObj}
                    setActiveContent={setActiveContent}
                    activeContent={activeContent}
                />
            )}
            {activeContent.route === "initial-clinical-evaluation-update" && (
                <InitialClinicalEvaluationUpdate
                    patientObj={patientObj}
                    setActiveContent={setActiveContent}
                    activeContent={activeContent}
                />
            )}
            {activeContent.route === "enrollment-and-commencement" && (
                <EnrollmentAndCommencementForm
                    patientObj={patientObj}
                    setActiveContent={setActiveContent}
                    activeContent={activeContent}
                    patientObj1 = {patientObj1}
                />
            )}
            {activeContent.route === "enrollment-and-commencement-view" && (
                <EnrollmentAndCommencementView
                    patientObj={patientObj}
                    setActiveContent={setActiveContent}
                    activeContent={activeContent}
                    patientObj1 = {patientObj1}
                />
            )}
            {activeContent.route === "enrollment-and-commencement-update" && (
                <EnrollmentAndCommencementUpdate
                    patientObj={patientObj}
                    setActiveContent={setActiveContent}
                    activeContent={activeContent}
                />
            )}
            {activeContent.route === "care-card-follow-up" && (
                <CareCardFollowUpForm
                    patientObj={patientObj}
                    setActiveContent={setActiveContent}
                    activeContent={activeContent}
                    patientObj1 = {patientObj1}
                />
            )}
            {activeContent.route === "health-services" && (
                <HealthServicesForm
                    patientObj={patientObj}
                    setActiveContent={setActiveContent}
                    activeContent={activeContent}
                    patientObj1 = {patientObj1}
                />
            )}
            {activeContent.route === "substitution-switch" && (
                <SubstitutionSwitchForm
                    patientObj={patientObj}
                    setActiveContent={setActiveContent}
                    activeContent={activeContent}
                />
            )}
            {activeContent.route === "substitution-switch-view" && (
                <SubstitutionSwitchForm
                    patientObj={patientObj}
                    setActiveContent={setActiveContent}
                    activeContent={activeContent}
                />
            )}
            {activeContent.route === "substitution-switch-update" && (
                <SubstitutionSwitchForm
                    patientObj={patientObj}
                    setActiveContent={setActiveContent}
                    activeContent={activeContent}
                />
            )}
            {activeContent.route === "integrated-lab-order" && (
                <IntegratedLabOrderForm
                    patientObj={patientObj}
                    setActiveContent={setActiveContent}
                    activeContent={activeContent}
                />
            )}
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
                <EACOutcome
                    patientObj={patientObj}
                    setActiveContent={setActiveContent}
                    activeContent={activeContent}
                />
            )}
            {activeContent.route === "view-outcome" && (
                <ViewUpdateEACOutcome
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
                    patientObj ={patientObj1}
                />
            )}
            {activeContent.route === "patient-visit" && (
                <PatientVisits
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
            {activeContent.route === "client-verfication-form" && (
                <ClientVerification
                    patientObj={patientObj}
                    setActiveContent={setActiveContent}
                    activeContent={activeContent}
                />
            )}
            {activeContent.route === "dsd-service-form" && (
                <DsdServiceForm
                    patientObj={patientObj}
                    setActiveContent={setActiveContent}
                    activeContent={activeContent}
                />
            )}
            {activeContent.route === "dsd-service-form-view" && (
                <DsdServiceFormView
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
            {activeContent.route === "Chronic-Care-view" && (
                <ViewChronicCare
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
                    activeContent={{
                      ...activeContent,
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
                    activeContent={{
                      ...activeContent,
                      patientId: patientObj?.id || patientObj1?.id,
                    }}
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

        {/* Transfer-In Acknowledgement Modal for View/Edit */}
        {activeContent.route === "transfer-in-acknowledgement-view" && (
            <Dialog
                open={true}
                onClose={() => setActiveContent({ ...activeContent, route: "recent-history" })}
                maxWidth="lg"
                fullWidth
            >
              <DialogTitle style={{ backgroundColor: "#014d88", color: "#fff" }}>
                {activeContent.actionType === "view"
                    ? "View Transfer-In Acknowledgement"
                    : "Edit Transfer-In Acknowledgement"}
              </DialogTitle>
              <DialogContent>
                <TransferInForm
                    patientObj={patientObj}
                    setActiveContent={setActiveContent}
                    activeContent={activeContent}
                />
              </DialogContent>
            </Dialog>
        )}

        {showModal.show && (
            <Modal
                show={showModal.show}
                className="fade"
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
              <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                  Update TPT Completion Status
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <h4>{showModal.message}</h4>
              </Modal.Body>
              <Modal.Footer>
                <Button
                    style={{ backgroundColor: "#014d88", color: "#fff" }}
                    onClick={hideModal}
                >
                  Cancel
                </Button>
              </Modal.Footer>
            </Modal>
        )}
      </div>
  );
}

PatientCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PatientCard);