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
import { calculate_age_to_number } from "../../../utils";
import { fi } from "date-fns/locale";
import TbTreatmentScreening from "./TbTreatmentScreening";
import TbMonitoring from "./TbMonitoring";

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

const TbScreening = (props) => {
  let age = props.patientObj.age;
  let dateOfBirth = props.patientObj.dateOfBirth;
  let errors = props.errors;
  const classes = useStyles();
  const [contraindicationDisplay, setcontraindicationDisplay] = useState(false);
  const [tbTreatmentType, setTbTreatmentType] = useState([]);
  const [tbTreatmentOutCome, setTbTreatmentOutCome] = useState([]);
  const [tbScreeningType, setTbScreeningType] = useState([]);
  const [tbScreeningType2, setTbScreeningType2] = useState([]);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [chestXrayResult, setChestXrayResult] = useState([]);
  const patientAge = calculate_age_to_number(props.patientObj.dateOfBirth);
  const [careAndSupportEncounterDate, setCareAndSupportEncounterDate] =
    useState("");

  useEffect(() => {
    TB_TREATMENT_OUTCOME();
    TB_TREATMENT_TYPE();
    TB_SCREENING_TYPE();
    CHEST_XRAY_TEST_RESULT();
    // CXR_SCREENING_TYPE();
  }, []);
  const TB_TREATMENT_TYPE = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/TB_TREATMENT_TYPE`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTbTreatmentType(response.data);
      })
      .catch((error) => {});
  };
  const CHEST_XRAY_TEST_RESULT = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/CHEST X-RAY_TEST_RESULT`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setChestXrayResult(response.data);
      })
      .catch((error) => {});
  };
  const TB_TREATMENT_OUTCOME = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/TB_TREATMENT_OUTCOME`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTbTreatmentOutCome(response.data);
      })
      .catch((error) => {});
  };

  const TB_SCREENING_TYPE = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/TB_SCREENING_TYPE`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTbScreeningType(response.data);
      })
      .catch((error) => {});
  };


  const getActiveTbTreatmentStartDate = (observations) => {
    if (!Array.isArray(observations) || observations.length === 0) return "";

    const sorted = [...observations].sort(
        (a, b) => new Date(b.dateOfObservation) - new Date(a.dateOfObservation)
    );

    // BLOCK 1: If any visit has completion date is not null, do NOT auto-fill
    const hasCompletedTreatment = sorted.some(obs => {
      const screening = obs.data?.tbIptScreening;
      return screening?.completionDate.trim() !== "";
    });

    if (hasCompletedTreatment) {
      return "";
    }

    //  BLOCK 2: If most recent visit has completionDate, block
    const latestScreening = sorted[0]?.data?.tbIptScreening;
    if (latestScreening?.completionDate && latestScreening.completionDate.trim() !== "") {
      return "";
    }

    //  Only now look for the most recent valid start date
    for (const obs of sorted) {
      const screening = obs.data?.tbIptScreening;
      if (!screening) continue;

      const hasValidStartDate = screening.tbTreatmentStartDate && screening.tbTreatmentStartDate.trim() !== "";
      const hasCompletionDate = screening.completionDate && screening.completionDate.trim() !== "";

      if (hasValidStartDate && !hasCompletionDate) {
        return screening.tbTreatmentStartDate;
      }
    }

    return "";
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // List of valid TPT fields
    const tptFields = [
      "date",
      "weight",
      "referredForServices",
      "adherence",
      "rash",
      "hepatitisSymptoms",
      "tbSymptoms",
      "resonForStoppingIpt",
      "outComeOfIpt",
      "everCompletedTpt",
      "eligibilityTpt",
      "tptPreventionOutcome",
      "currentlyOnTpt",
      "contractionForTpt",
      "liverSymptoms",
      "chronicAlcohol",
      "neurologicSymptoms",
      "dateTptStarted",
      "tptRegimen",
      "endedTpt",
      "dateOfTptCompleted",
      "dateTptEnded",
      "tbSideEffect",
      "giUpsetEffect",
      "hepatotoxicityEffect",
      "neurologicSymptomsEffect",
      "giUpsetEffectSeverity",
      "hypersensitivityReactionEffect",
      "hypersensitivityReactionEffectSeverity",
      "neurologicSymptomsEffectSeverity",
      "hepatotoxicityEffectSeverity",
      "enrolledOnTpt",
    ];
    // Define the common update object
    let updateObj = {
      ...props.tbObj,
      [name]: value,
    };

    // Build tpt update only if name is in tptFields
    let updatedTpt = { ...props.tpt };
    if (tptFields.includes(name)) {
      updatedTpt = {
        ...props.tpt,
        [name]: value,
      };
    }

    if (name === "tbTreatment") {
      if (value === "Yes") {
        // Auto-populate tbTreatmentStartDate from most recent active treatment
        const autoDate = getActiveTbTreatmentStartDate(props.chronicCareRecords);

        updateObj = {
          ...props.tbObj,
          tbTreatment: "Yes",
          tbTreatmentStartDate: autoDate, // Auto-fill if available
          // Reset other fields as before
          tbScreeningType: "",
          cadScore: "",
          cadOutcome: "",
          completedTbTreatment: "",
          specimentCollectedStatus: "",
          diagnosticTestType: "",
          tbEvaulationOutcome: "",
          chestXrayResult: "",
          outcome: "",
          status: "",
          tbType: "",
          coughing: "",
          fever: "",
          nightSweats: "",
          losingWeight: "",
          historyWithAdults: "",
          poorWeightGain: "",
          specimentSent: "",
          tbTestResult: "",
          specimenType: "",
          poorTreatmentAdherence: "",
          chestXrayDone: "",
          clinicallyEvaulated: "",
          DateDiagnosticTestResultReceived: "",
          dateOfChestXrayResultTestDone: "",
          dateOfDiagnosticTest: "",
          dateSpecimenSent: "",
          diagnosticTestDone: "",
          tbTreeatmentStarted: "",
          chestXrayResultTest: "",
        };

        // Also reset TPT fields
        updatedTpt = {
          ...updatedTpt,
          weight: "",
          referredForServices: "",
          adherence: "",
          rash: "",
          hepatitisSymptoms: "",
          tbSymptoms: "",
          resonForStoppingIpt: "",
          outComeOfIpt: "",
          everCompletedTpt: "",
          eligibilityTpt: "",
          tptPreventionOutcome: "",
          currentlyOnTpt: "",
          contractionForTpt: "",
          liverSymptoms: "",
          chronicAlcohol: "",
          neurologicSymptoms: "",
          dateTptStarted: "",
          tptRegimen: "",
          endedTpt: "",
          dateOfTptCompleted: "",
          dateTptEnded: "",
          tbSideEffect: "",
          giUpsetEffect: "",
          hepatotoxicityEffect: "",
          neurologicSymptomsEffect: "",
          giUpsetEffectSeverity: "",
          hypersensitivityReactionEffect: "",
          hypersensitivityReactionEffectSeverity: "",
          neurologicSymptomsEffectSeverity: "",
          hepatotoxicityEffectSeverity: "",
          enrolledOnTpt: "",
        };

      } else {
        // If "No" or empty
        updateObj = {
          ...props.tbObj,
          tbTreatment: value,
          tbTreatmentStartDate: "",
          // Reset all related fields (your existing reset logic)
          tbScreeningType: "",
          cadScore: "",
          cadOutcome: "",
          completedTbTreatment: "",
          specimentCollectedStatus: "",
          diagnosticTestType: "",
          tbEvaulationOutcome: "",
          chestXrayResult: "",
          outcome: "",
          status: "",
          tbType: "",
          coughing: "",
          fever: "",
          nightSweats: "",
          losingWeight: "",
          historyWithAdults: "",
          poorWeightGain: "",
          specimentSent: "",
          tbTestResult: "",
          specimenType: "",
          poorTreatmentAdherence: "",
          chestXrayDone: "",
          clinicallyEvaulated: "",
          DateDiagnosticTestResultReceived: "",
          dateOfChestXrayResultTestDone: "",
          dateOfDiagnosticTest: "",
          dateSpecimenSent: "",
          diagnosticTestDone: "",
          tbTreeatmentStarted: "",
          chestXrayResultTest: "",
        };
        updatedTpt = {
          ...updatedTpt,
          weight: "",
          referredForServices: "",
          adherence: "",
          rash: "",
          hepatitisSymptoms: "",
          tbSymptoms: "",
          resonForStoppingIpt: "",
          outComeOfIpt: "",
          everCompletedTpt: "",
          eligibilityTpt: "",
          tptPreventionOutcome: "",
          currentlyOnTpt: "",
          contractionForTpt: "",
          liverSymptoms: "",
          chronicAlcohol: "",
          neurologicSymptoms: "",
          dateTptStarted: "",
          tptRegimen: "",
          endedTpt: "",
          dateOfTptCompleted: "",
          dateTptEnded: "",
          tbSideEffect: "",
          giUpsetEffect: "",
          hepatotoxicityEffect: "",
          neurologicSymptomsEffect: "",
          giUpsetEffectSeverity: "",
          hypersensitivityReactionEffect: "",
          hypersensitivityReactionEffectSeverity: "",
          neurologicSymptomsEffectSeverity: "",
          hepatotoxicityEffectSeverity: "",
          enrolledOnTpt: "",
        };
      }
    }

    else if (name === "tbScreeningType" || value === "") {
      updateObj = {
        ...updateObj,
        chestXray: "",
        cadScore: "",
        cadOutcome: "",
        chestXrayResult: "",
        isTbTestConfirmed: "",
        fever: "",
        nightSweats: "",
        coughing: "",
        losingWeight: "",
        outcome: "",
        historyWithAdults: "",
        poorWeightGain: "",
        status: "",
        specimentSent: "",
        tbTestResult: "",
        specimenType: "",
        poorTreatmentAdherence: "",
        diagnosticTestType: "",
        chestXrayDone: "",
        clinicallyEvaulated: "",
        DateDiagnosticTestResultReceived: "",
        dateOfChestXrayResultTestDone: "",
        dateOfDiagnosticTest: "",
        dateSpecimenSent: "",
        diagnosticTestDone: "",
        tbTreeatmentStarted: "",
        chestXrayResultTest: "",
        tbType: "",
        tbTreatmentStarted: "",
        tbTreatmentStartDate: "",
        specimentCollectedStatus: "",
        tbEvaulationOutcome: "",
      };
    }
    // CAD Score logic when tbScreeningType is set to "Chest X-Ray with CAD and/or Symptom screening"
    else if (
      name === "cadScore" &&
      props.tbObj.tbScreeningType ===
        "Chest X-Ray with CAD and/or Symptom screening"
    ) {
      let numericValue = parseInt(value, 10);
      if (isNaN(numericValue) || value === "") {
        numericValue = "";
      } else {
        numericValue = Math.min(100, Math.max(0, numericValue));
      }
      let chestXrayDisplay = "";
      if (!isNaN(numericValue) && numericValue !== "") {
        chestXrayDisplay =
          numericValue >= 34 ? "Suggestive of TB" : "Not suggestive of TB";
      }
      // Update the tbObj with new cadScore and chestXrayResult
      updateObj = {
        ...props.tbObj,
        cadScore: numericValue,
        chestXrayResult: chestXrayDisplay,

        coughing: "",
        fever: "",
        nightSweats: "",
        losingWeight: "",
        historyWithAdults: "",
        poorWeightGain: "",
        specimentSent: "",
        tbTestResult: "",
        specimenType: "",
        poorTreatmentAdherence: "",
        chestXrayDone: "",
        clinicallyEvaulated: "",
        DateDiagnosticTestResultReceived: "",
        dateOfChestXrayResultTestDone: "",
        dateOfDiagnosticTest: "",
        dateSpecimenSent: "",
        diagnosticTestDone: "",
        tbTreeatmentStarted: "",
        chestXrayResultTest: "",
        tbType: "",
        diagnosticTestType: "",
        tbTreatmentStarted: "",
        tbTreatmentStartDate: "",
        tbEvaulationOutcome: "",
      };
    } else if (name === "chestXrayResult" || value === "") {
      updateObj = {
        ...updateObj,
        completedTbTreatment: "",
        specimentCollectedStatus: "",
      };
      updatedTpt = {
        ...updatedTpt,
        weight: "",
        referredForServices: "",
        adherence: "",
        rash: "",
        hepatitisSymptoms: "",
        tbSymptoms: "",
        resonForStoppingIpt: "",
        outComeOfIpt: "",
        everCompletedTpt: "",
        eligibilityTpt: "",
        tptPreventionOutcome: "",
        currentlyOnTpt: "",
        contractionForTpt: "",
        liverSymptoms: "",
        chronicAlcohol: "",
        neurologicSymptoms: "",
        dateTptStarted: "",
        tptRegimen: "",
        endedTpt: "",
        dateOfTptCompleted: "",
        dateTptEnded: "",
        tbSideEffect: "",
        giUpsetEffect: "",
        hepatotoxicityEffect: "",
        neurologicSymptomsEffect: "",
        giUpsetEffectSeverity: "",
        hypersensitivityReactionEffect: "",
        hypersensitivityReactionEffectSeverity: "",
        neurologicSymptomsEffectSeverity: "",
        hepatotoxicityEffectSeverity: "",
        enrolledOnTpt: "",
      };
    } else if (
      props.tbObj.tbTreatment === "No" &&
      props.tbObj.cadScore !== "" &&
      props.tbObj.tbScreeningType ===
        "Chest X-Ray with CAD and/or Symptom screening" &&
      (name === "coughing" ||
        name === "fever" ||
        name === "nightSweats" ||
        name === "losingWeight")
    ) {
      updateObj = {
        ...updateObj,
        specimentCollectedStatus: "",
        specimentSent: "",
        tbTestResult: "",
        specimenType: "",
        poorTreatmentAdherence: "",
        chestXrayDone: "",
        clinicallyEvaulated: "",
        DateDiagnosticTestResultReceived: "",
        dateOfChestXrayResultTestDone: "",
        dateOfDiagnosticTest: "",
        dateSpecimenSent: "",
        diagnosticTestDone: "",
        tbTreatmentStarted: "",
        chestXrayResultTest: "",
        tbType: "",
        tbTreatmentStartDate: "",
        tbEvaulationOutcome: "",
        diagnosticTestType: "",
      };
      props.setTbObj(updateObj);
    } else if (name === "specimentCollectedStatus" || value === "") {
      updateObj = {
        ...updateObj,
        specimentSent: "",
        tbTestResult: "",
        diagnosticTestType: "",
        diagnosticTestDone: "",
        specimenType: "",
        DateDiagnosticTestResultReceived: "",
        dateOfChestXrayResultTestDone: "",
        chestXrayResultTest: "",
        tbType: "",
        tbTreatmentStarted: "",
        dateOfDiagnosticTest: "",
        chestXrayDone: "",
        tbEvaulationOutcome: "",
        clinicallyEvaulated: "",
        completionDate: "",
        treatmentOutcome: "",
        treatmentCompletionStatus: "",
      };
    } else if (name === "specimentSent" || value === "") {
      updateObj = {
        ...updateObj,
        specimenType: "",
        dateSpecimenSent: "",
        diagnosticTestDone: "",
        diagnosticTestType: "",
        chestXrayResultTest: "",
        tbType: "",
        tbTreatmentStarted: "",
        dateOfChestXrayResultTestDone: "",
        dateOfDiagnosticTest: "",
        DateDiagnosticTestResultReceived: "",
        chestXrayDone: "",
        tbTestResult: "",
        tbEvaulationOutcome: "",
        clinicallyEvaulated: "",
        completionDate: "",
        treatmentOutcome: "",
        treatmentCompletionStatus: "",
      };
    } else if (name === "diagnosticTestDone" || value === "") {
      updateObj = {
        ...updateObj,
        dateOfDiagnosticTest: "",
        diagnosticTestType: "",
        DateDiagnosticTestResultReceived: "",
      };
    } else if (name === "diagnosticTestType" || value === "") {
      updateObj = {
        ...updateObj,
        chestXrayDone: "",
        tbTestResult: "",
        chestXrayResultTest: "",
        tbEvaulationOutcome: "",
      };
    } else if (name === "tbTestResult" || value === "") {
      updateObj = {
        ...updateObj,
        chestXrayDone: "",
        clinicallyEvaulated: "",
        chestXrayResultTest: "",
        tbEvaulationOutcome: "",
        tbType: "",
        tbTreatmentStarted: "",
        dateOfChestXrayResultTestDone: "",
      };
    } else if (name === "chestXrayResultTest" || value === "") {
      updateObj = {
        ...updateObj,
        tbType: "",
        tbTreatmentStarted: "",
        dateOfChestXrayResultTestDone: "",
      };
    } else if (name === "chestXrayDone" || value === "") {
      updateObj = {
        ...updateObj,
        chestXrayResultTest: "",
        dateOfChestXrayResultTestDone: "",
        resultOfClinicalEvaluation: "",
        tbEvaulationOutcome: "",
      };
    } else if (name === "completedTbTreatment" || value === "") {
      updateObj = {
        ...updateObj,
        completionDate: "",
        treatmentOutcome: "",
        treatmentCompletionStatus: "",
      };
    } else if (name === "clinicallyEvaulated" || value === "") {
      updateObj = {
        ...updateObj,
        chestXrayDone: "",
      };
    } else if (name === "chestXrayDone" || value === "") {
      updateObj = {
        ...updateObj,
        dateOfChestXrayResultTestDone: "",
        chestXrayResultTest: "",
      };
    }

    // Set the updated state
    props.setTbObj(updateObj);
    props.setTpt(updatedTpt);

    // Validate the field and remove the error message if the field is filled
    if (value) {
      let tempErrors = { ...props.errors };
      tempErrors[name] = "";
      props.setErrors(tempErrors);
    } else {
      props.setTbObj(updateObj);
    }
  };

  // RESET:TB Diagnosis and Treatment Enrolment on outcome changes
  useEffect(() => {
    if (props.act === "create") {
      props.setTbObj({
        ...props.tbObj,
        specimentCollectedStatus: "",
        specimentSent: "",
        tbTestResult: "",
        dateSpecimenSent: "",
        specimenType: "",
        diagnosticTestDone: "",
        dateOfDiagnosticTest: "",
      });
    }
  }, [props.tbObj.outcome]);


  useEffect(() => {
    const updatedTbObj = { ...props.tbObj };

    // Case 1: Currently on TB treatment
    if (
      props.tbObj.tbTreatment === "Yes" &&
      props.tbObj.tbScreeningType === "" &&
      props.tbObj.chestXrayResult === ""
    ) {
      updatedTbObj.outcome = "";
      updatedTbObj.status = "Currently on TB treatment";
      updatedTbObj.cadOutcome = "";
    }
    // Skip remaining if already on TB treatment
    else {
      // Case 2: Symptom screen only - No symptoms for Adult
      if (
        props.tbObj.tbTreatment === "No" &&
        props.tbObj.tbScreeningType === "Symptom screen (alone)" && 
        patientAge > 14
      ) {
        const noSymptoms =
          props.tbObj.coughing === "No" &&
          props.tbObj.fever === "No" &&
          props.tbObj.nightSweats === "No" &&
          props.tbObj.losingWeight === "No";

        if (noSymptoms) {
          updatedTbObj.outcome = "Not Presumptive";
          updatedTbObj.status = "No signs or symptoms of TB";
          updatedTbObj.eligibleForTPT = "";
        }
      }

      //  Symptom screen only - No symptoms for Pediatric
      if (
        props.tbObj.tbTreatment === "No" &&
        props.tbObj.tbScreeningType === "Symptom screen (alone)" &&
        patientAge <= 14
      ) {
        const noSymptoms =
          props.tbObj.coughing === "No" &&
          props.tbObj.fever === "No" &&
          props.tbObj.nightSweats === "No" &&
          props.tbObj.losingWeight === "No" &&
          props.tbObj.historyWithAdults === "No" &&
          props.tbObj.poorWeightGain === "No";

        if (noSymptoms) {
          updatedTbObj.outcome = "Not Presumptive";
          updatedTbObj.status = "No signs or symptoms of TB";
          updatedTbObj.eligibleForTPT = "";
        }
      }

      //  Symptom screen only - symptoms for Pediatric
      if (
        props.tbObj.tbTreatment === "No" &&
        props.tbObj.tbScreeningType === "Symptom screen (alone)" &&
        patientAge <= 14
      ) {
        const noSymptoms =
          props.tbObj.coughing === "Yes" ||
          props.tbObj.fever === "Yes" ||
          props.tbObj.nightSweats === "Yes" ||
          props.tbObj.losingWeight === "Yes" ||
          props.tbObj.historyWithAdults === "Yes" ||
          props.tbObj.poorWeightGain === "Yes";

        if (noSymptoms) {
          updatedTbObj.outcome = "Presumptive TB";
          updatedTbObj.status = "Presumptive TB";
          updatedTbObj.eligibleForTPT = "No";
        }
      }
      // Case 3: Symptom screen only - Has symptom
      if (
        props.tbObj.tbTreatment === "No" &&
        props.tbObj.tbScreeningType === "Symptom screen (alone)" &&
        patientAge > 14
      ) {
        const hasSymptom =
          props.tbObj.coughing === "Yes" ||
          props.tbObj.fever === "Yes" ||
          props.tbObj.nightSweats === "Yes" ||
          props.tbObj.losingWeight === "Yes";

        if (hasSymptom) {
          updatedTbObj.outcome = "Presumptive TB";
          updatedTbObj.status = "Presumptive TB";
          updatedTbObj.eligibleForTPT = "";
        }
      }

      // Case 6: CAD + Chest X-ray logic
      if (
        props.tbObj.tbTreatment === "No" &&
        props.tbObj.cadScore !== "" &&
        props.tbObj.tbScreeningType ===
          "Chest X-Ray with CAD and/or Symptom screening" 
      ) {
        if (props.tbObj.chestXrayResult === "Not suggestive of TB") {
          updatedTbObj.cadOutcome = "Not Presumptive";
          updatedTbObj.outcome = "";
          updatedTbObj.status = "No signs or symptoms of TB";
        } else if (props.tbObj.chestXrayResult === "Suggestive of TB") {
          updatedTbObj.cadOutcome = "Presumptive TB";
          updatedTbObj.outcome = "";
          updatedTbObj.status = "Presumptive TB";
        }
      }

      // Case 7: General symptom evaluation
      const hasSymptom =
        props.tbObj.coughing === "Yes" ||
        props.tbObj.fever === "Yes" ||
        props.tbObj.nightSweats === "Yes" ||
        props.tbObj.losingWeight === "Yes";

      const noSymptoms =
        props.tbObj.coughing === "No" &&
        props.tbObj.fever === "No" &&
        props.tbObj.nightSweats === "No" &&
        props.tbObj.losingWeight === "No";

      const pedHasSymptoms =
        props.tbObj.coughing === "Yes" ||
        props.tbObj.fever === "Yes" ||
        props.tbObj.nightSweats === "Yes" ||
        props.tbObj.losingWeight === "Yes";
      props.tbObj.historyWithAdults === "Yes" ||
        props.tbObj.poorWeightGain === "Yes";

      const pedHasNoSymptoms =
        props.tbObj.coughing === "No" &&
        props.tbObj.fever === "No" &&
        props.tbObj.nightSweats === "No" &&
        props.tbObj.losingWeight === "No" &&
        props.tbObj.historyWithAdults === "No" &&
        props.tbObj.poorWeightGain === "No";

      if (
        pedHasSymptoms &&
        updatedTbObj.tbTreatment === "No" &&
        updatedTbObj.tbScreeningType ===
          "Chest X-Ray with CAD and/or Symptom screening" &&
        !updatedTbObj.outcome &&
        patientAge <= 14
      ) {
        updatedTbObj.outcome = "Presumptive TB";
        updatedTbObj.status = "";
      }

      if (
        pedHasNoSymptoms &&
        updatedTbObj.tbTreatment === "No" &&
        updatedTbObj.tbScreeningType ===
          "Chest X-Ray with CAD and/or Symptom screening" &&
        !updatedTbObj.outcome &&
        patientAge <= 14
      ) {
        updatedTbObj.outcome = "Not Presumptive";
        updatedTbObj.status = "";
      }

      if (hasSymptom && !updatedTbObj.outcome && patientAge > 14) {
        updatedTbObj.outcome = "Presumptive TB";
        updatedTbObj.status = "";
      }

      if (noSymptoms && !updatedTbObj.outcome && patientAge > 14 ) {
        updatedTbObj.outcome = "Not Presumptive";
        updatedTbObj.status = "";
      }

      // Case 8: Combine outcomes
      if (
        updatedTbObj.cadOutcome === "Presumptive TB" &&
        updatedTbObj.outcome === "Presumptive TB"
      ) {
        updatedTbObj.status = "Presumptive TB";
      }

      if (
        updatedTbObj.cadOutcome === "Presumptive TB" &&
        updatedTbObj.outcome === "Not Presumptive"
      ) {
        updatedTbObj.status = "Presumptive TB";
      }
      if (
        updatedTbObj.cadOutcome === "Not Presumptive" &&
        updatedTbObj.outcome === "Presumptive TB"
      ) {
        updatedTbObj.status = "Presumptive TB";
      }

      if (
        updatedTbObj.cadOutcome === "Not Presumptive" &&
        updatedTbObj.outcome === "Not Presumptive"
      ) {
        updatedTbObj.status = "No signs or symptoms of TB";
      }

      //  Diagnostic Test & Evaluation Outcome
      else if (
        props.tbObj?.specimentCollectedStatus.trim() === "Yes" &&
        props.tbObj?.specimentSent.trim() === "Yes" &&
        props.tbObj.tbTestResult === "MTB not detected" &&
        props.tbObj?.clinicallyEvaulated === "Yes" &&
        props.tbObj?.chestXrayDone === "Yes" &&
        props.tbObj?.chestXrayResultTest === "Suggestive of TB"
      ) {
        updatedTbObj.tbEvaulationOutcome = "TB Diagnosed";
      } else if (
        props.tbObj?.specimentCollectedStatus.trim() === "Yes" &&
        props.tbObj?.specimentSent.trim() === "Yes" &&
        props.tbObj.tbTestResult === "MTB not detected" &&
        props.tbObj?.clinicallyEvaulated === "Yes" &&
        props.tbObj?.chestXrayDone === "Yes" &&
        props.tbObj?.chestXrayResultTest === "Not suggestive of TB"
      ) {
        updatedTbObj.tbEvaulationOutcome = "TB Not Diagnosed";
      }

      // Chest X-ray suggestive of TB
      else if (props.tbObj.chestXrayResultTest === "Suggestive of TB") {
        updatedTbObj.tbEvaulationOutcome = "TB Diagnosed";
      }
      // EvaulationOutcome for  MTB not detected
      else if (props.tbObj.tbTestResult === "MTB not detected") {
        updatedTbObj.tbEvaulationOutcome = "TB Not Diagnosed";
      }

      // MTB detected cases
      else if (
        props.tbObj.tbTestResult === "MTB detected RR detected" ||
        props.tbObj.tbTestResult === "MTB trace RR indeterminate" ||
        props.tbObj.tbTestResult === "MTB detected RIF/INH not detected" ||
        props.tbObj.tbTestResult === "MTB detected INH detected" ||
        props.tbObj.tbTestResult === "MTB detected RR not detected" ||
        props.tbObj.tbTestResult === "MTB detected RIF&INH detected" ||
        props.tbObj.tbTestResult === "MTB detected RIF detected"
      ) {
        updatedTbObj.tbEvaulationOutcome = "TB Diagnosed";
      }

      // Positive smear/TB-LAMP/LF-LAM test
      else if (
        props.tbObj?.tbTestResult.trim() === "Positive" &&
        ["TB-LAMP", "LF-LAM", "Smear Microscopy"].includes(
          props.tbObj?.diagnosticTestType.trim()
        )
      ) {
        updatedTbObj.tbEvaulationOutcome = "TB Diagnosed";
      }

      // Negative smear/TB-LAMP/LF-LAM test
      else if (
        props.tbObj?.tbTestResult.trim() === "Negative" &&
        ["TB-LAMP", "LF-LAM", "Smear Microscopy"].includes(
          props.tbObj?.diagnosticTestType.trim()
        )
      ) {
        updatedTbObj.tbEvaulationOutcome = "TB Not Diagnosed";
      }

      // Specimen collected, sent, test negative, but CXR and clinical eval suggest TB
      else if (
        props.tbObj?.specimentCollectedStatus.trim() === "Yes" &&
        props.tbObj?.specimentSent.trim() === "Yes" &&
        ["TB-LAMP", "LF-LAM", "Smear Microscopy"].includes(
          props.tbObj?.diagnosticTestType.trim()
        ) &&
        props.tbObj?.tbTestResult.trim() === "Negative" &&
        props.tbObj?.chestXrayResultTest === "Suggestive of TB" &&
        props.tbObj.clinicallyEvaulated === "Yes"
      ) {
        updatedTbObj.tbEvaulationOutcome = "TB Diagnosed";
      }
      // Specimen collected, NOT sent, clinical eval YES, CXR NO, result is suggestive
      else if (
        props.tbObj?.specimentCollectedStatus.trim() === "Yes" &&
        props.tbObj?.specimentSent.trim() === "No" &&
        props.tbObj?.clinicallyEvaulated === "Yes" &&
        props.tbObj?.chestXrayDone === "No" &&
        props.tbObj?.resultOfClinicalEvaluation === "Suggestive of TB"
      ) {
        updatedTbObj.tbEvaulationOutcome = "TB Diagnosed";
      }

      // Specimen collected, NOT sent, clinical eval YES, CXR NO, result NOT suggestive
      else if (
        props.tbObj?.specimentCollectedStatus.trim() === "Yes" &&
        props.tbObj?.specimentSent.trim() === "No" &&
        props.tbObj?.clinicallyEvaulated === "Yes" &&
        props.tbObj?.chestXrayDone === "No" &&
        props.tbObj?.resultOfClinicalEvaluation === "Not suggestive of TB"
      ) {
        updatedTbObj.tbEvaulationOutcome = "TB Not Diagnosed";
      }

      // Specimen collected, NOT sent, clinical eval YES, CXR done and result NOT suggestive
      else if (
        props.tbObj?.specimentCollectedStatus.trim() === "Yes" &&
        props.tbObj?.specimentSent.trim() === "No" &&
        props.tbObj?.clinicallyEvaulated === "Yes" &&
        props.tbObj?.chestXrayDone === "Yes" &&
        props.tbObj?.chestXrayResultTest === "Not suggestive of TB"
      ) {
        updatedTbObj.tbEvaulationOutcome = "TB Not Diagnosed";
      }

      // Specimen collected, NOT sent, CXR suggestive + clinical eval YES
      else if (
        props.tbObj?.specimentCollectedStatus.trim() === "Yes" &&
        props.tbObj?.specimentSent.trim() === "No" &&
        props.tbObj?.clinicallyEvaulated === "Yes" &&
        props.tbObj?.chestXrayDone === "Yes" &&
        props.tbObj?.chestXrayResultTest === "Suggestive of TB"
      ) {
        updatedTbObj.tbEvaulationOutcome = "TB Diagnosed";
      }

      // Invalid/Error/Incomplete test results
      else if (
        props.tbObj?.tbTestResult === "Error" ||
        props.tbObj?.tbTestResult === "Invalid" ||
        props.tbObj?.tbTestResult === "Incomplete"
      ) {
        updatedTbObj.tbEvaulationOutcome = "";
      }
    }
    props.setTbObj(updatedTbObj);
  }, [
    props.tbObj.tbTreatment,
    props.tbObj.tbScreeningType,
    props.tbObj.chestXrayResult,
    props.tbObj.cadScore,
    props.tbObj.outcome,
    props.tbObj.tbTestResult,
    props.tbObj.diagnosticTestType,
    props.tbObj.specimentCollectedStatus,
    props.tbObj.specimentSent,
    props.tbObj.chestXrayResultTest,
    props.tbObj.clinicallyEvaulated,
    props.tbObj.chestXrayDone,
    props.tbObj.resultOfClinicalEvaluation,
    props.tbObj.coughing,
    props.tbObj.fever,
    props.tbObj.nightSweats,
    props.tbObj.losingWeight,
    props.tbObj.historyWithAdults,
    props.tbObj.poorWeightGain,
    props.tbObj.historyWithAdults
  ]);

  const shouldShowTbTreatment = (tbObj) => {
    return (
      tbObj.outcome === "Presumptive TB" ||
      (tbObj.tbTreatment === "No" &&
        tbObj.cadScore !== "" &&
        tbObj.tbScreeningType ===
          "Chest X-Ray with CAD and/or Symptom screening" &&
        tbObj.status === "Presumptive TB")
    );
  };

  return (
    <>
      <Card className={classes.root}>
        <CardBody>
          <h2 style={{ color: "#000" }}>TB Treatment Section</h2>
          <br />

          <form>
            <div className="row">
              <div className="form-group mb-3 col-md-12">
                <FormGroup>
                  <Label>
                    Are you currently on TB treatment?{" "}
                    <span style={{ color: "red" }}> *</span>
                  </Label>
                  <InputGroup>
                    <Input
                      type="select"
                      name="tbTreatment"
                      id="tbTreatment"
                      onChange={handleInputChange}
                      value={props.tbObj.tbTreatment}
                      disabled={props.action === "view" ? true : false}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Input>
                  </InputGroup>
                  {errors.tbTreatment !== "" ? (
                    <span className={classes.error}>{errors.tbTreatment}</span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </div>
              {props.tbObj.tbTreatment === "Yes" && (
                <>
                  <div className="form-group mb-3 col-md-12">
                    <FormGroup>
                      <Label>
                        TB treatment start date{" "}
                        <span style={{ color: "red" }}> *</span>
                      </Label>
                      <InputGroup>
                        <Input
                          type="date"
                          name="tbTreatmentStartDate"
                          id="tbTreatmentStartDate"
                          onChange={handleInputChange}
                          value={props.tbObj.tbTreatmentStartDate}
                          min={props.patientObj.dateOfBirth}
                          max={moment(new Date()).format("YYYY-MM-DD")}
                          disabled={props.action === "view" ? true : false}
                          required
                          onKeyPress={(e) => e.preventDefault()}
                        ></Input>
                      </InputGroup>
                    </FormGroup>
                    {props.errors.tbTreatmentStartDate !== "" ? (
                      <span className={classes.error}>
                        {props.errors.tbTreatmentStartDate}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </>
              )}

              {props.tbObj.tbTreatment === "No" && (
                <>
                  {/* SCREENING TYPE OPTIONS */}
                  <h2 style={{ color: "#000" }}>TB Screening Section</h2>
                  <br />
                  <div className="form-group  mb-3 col-md-6">
                    <FormGroup>
                      <Label>Screening Type</Label>
                      <InputGroup>
                        <Input
                          type="select"
                          name="tbScreeningType"
                          id="tbScreeningType"
                          onChange={handleInputChange}
                          disabled={props.action === "view"}
                          value={props.tbObj.tbScreeningType}
                        >
                          <option value="">Select</option>
                          {tbScreeningType.map((value) => (
                            <option key={value.id} value={value.display}>
                              {value.display}
                            </option>
                          ))}
                          {props.tbObj.tbScreeningType ===
                            "Chest X-ray with CAD" && (
                            <option
                              value="Chest X-ray with CAD"
                              key="legacy-option"
                            >
                              Chest X-ray with CAD
                            </option>
                          )}
                        </Input>
                      </InputGroup>
                      {errors.tbScreeningType !== "" ? (
                        <span className={classes.error}>
                          {errors.tbScreeningType}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>

                  {props.tbObj.tbScreeningType ===
                    "Chest X-Ray with CAD and/or Symptom screening" && (
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>CAD Score</Label>
                        <span style={{ color: "red" }}> *</span>
                        <InputGroup>
                          <Input
                            type="number"
                            name="cadScore"
                            id="cadScore"
                            onChange={handleInputChange}
                            disabled={props.action === "view"}
                            value={props.tbObj.cadScore}
                            min="0"
                            max="100"
                            // onKeyPress={(e) => e.preventDefault()}
                          />
                        </InputGroup>
                        {errors.cadScore !== "" ? (
                          <span className={classes.error}>
                            {errors.cadScore}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                  )}
                  {props.tbObj.tbTreatment === "No" &&
                    props.tbObj.tbScreeningType ===
                      "Chest X-Ray with CAD and/or Symptom screening" &&
                    props.cadOutcome !== "" && (
                      <p style={{ color: "black" }}>
                        Chest X-Ray with CAD and/or Symptom screening Screening
                        Outcome:
                        <b> {" " + props.tbObj.cadOutcome}</b>
                      </p>
                    )}

                  {/* PREVIOUSLY  ON TPT */}
                  <div className="form-group  mb-3 col-md-6">
                    {props.tbObj.currentlyOnTuberculosis === "Yes" && (
                      <FormGroup>
                        <Label>
                          Have you previously completed TPT?{" "}
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="select"
                            name="previouslyCompletedTPT"
                            id="previouslyCompletedTPT"
                            onChange={handleInputChange}
                            value={props.tbObj.previouslyCompletedTPT}
                            disabled={props.action === "view" ? true : false}
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </Input>
                        </InputGroup>
                      </FormGroup>
                    )}
                  </div>

                  {/* SCREENING QUESTIONS */}
                  {props.tbObj.tbScreeningType === "Symptom screen (alone)" && (
                    <>
                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>
                            Are you coughing?{" "}
                            <span style={{ color: "red" }}> *</span>
                          </Label>
                          <InputGroup>
                            <Input
                              type="select"
                              name="coughing"
                              id="coughing"
                              onChange={handleInputChange}
                              value={props.tbObj.coughing}
                              disabled={props.action === "view" ? true : false}
                            >
                              <option value="">Select</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </Input>
                          </InputGroup>
                          {errors.coughing && (
                            <span style={{ color: "red" }}>
                              {errors.coughing}
                            </span>
                          )}
                        </FormGroup>
                      </div>

                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>
                            Do you have fever for 2 weeks or more? (Unexplained
                            fever) <span style={{ color: "red" }}> *</span>
                          </Label>
                          <InputGroup>
                            <Input
                              type="select"
                              name="fever"
                              id="fever"
                              onChange={handleInputChange}
                              value={props.tbObj.fever}
                              disabled={props.action === "view" ? true : false}
                            >
                              <option value="">Select</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </Input>
                          </InputGroup>
                          {errors.fever && (
                            <span style={{ color: "red" }}>{errors.fever}</span>
                          )}
                        </FormGroup>
                      </div>

                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>
                            Are you having night sweats? (drenching or excessive
                            night sweats)
                            <span style={{ color: "red" }}> *</span>
                          </Label>
                          <InputGroup>
                            <Input
                              type="select"
                              name="nightSweats"
                              id="nightSweats"
                              onChange={handleInputChange}
                              value={props.tbObj.nightSweats}
                              disabled={props.action === "view" ? true : false}
                            >
                              <option value="">Select</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </Input>
                          </InputGroup>
                          {errors.nightSweats && (
                            <span style={{ color: "red" }}>
                              {errors.nightSweats}
                            </span>
                          )}
                        </FormGroup>
                      </div>

                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>
                            Are you losing weight? (Unexplained weight loss)
                            <span style={{ color: "red" }}> *</span>
                          </Label>
                          <InputGroup>
                            <Input
                              type="select"
                              name="losingWeight"
                              id="losingWeight"
                              onChange={handleInputChange}
                              value={props.tbObj.losingWeight}
                              disabled={props.action === "view" ? true : false}
                            >
                              <option value="">Select</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </Input>
                          </InputGroup>
                          {errors.losingWeight && (
                            <span style={{ color: "red" }}>
                              {errors.losingWeight}
                            </span>
                          )}
                        </FormGroup>
                      </div>
                      {props.tbObj.tbScreeningType ===
                        "Symptom screen (alone)" &&
                        patientAge <= 14 && (
                          <>
                            <div className="form-group mb-3 col-md-6">
                              <FormGroup>
                                <Label>
                                  History of contacts with TB adults
                                </Label>
                                <InputGroup>
                                  <Input
                                    type="select"
                                    name="historyWithAdults"
                                    id="historyWithAdults"
                                    onChange={handleInputChange}
                                    value={props.tbObj.historyWithAdults}
                                    disabled={
                                      props.action === "view" ? true : false
                                    }
                                  >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </Input>
                                </InputGroup>
                              </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-6">
                              <FormGroup>
                                <Label>Poor weight gain months) </Label>
                                <InputGroup>
                                  <Input
                                    type="select"
                                    name="poorWeightGain"
                                    id="poorWeightGain"
                                    onChange={handleInputChange}
                                    value={props.tbObj.poorWeightGain}
                                    disabled={
                                      props.action === "view" ? true : false
                                    }
                                  >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </Input>
                                </InputGroup>
                              </FormGroup>
                            </div>
                          </>
                        )}
                    </>
                  )}

                  {/*SYMPTOMS SCREENING FOR  CHEST X RAY WITH CARD AND CAD SCORE */}

                  {props.tbObj.cadScore !== "" &&
                    props.tbObj.tbScreeningType ===
                      "Chest X-Ray with CAD and/or Symptom screening" && (
                      <>
                        <h2 style={{ color: "#000" }}>Symptoms Screening</h2>
                        <br />
                        <div className="form-group mb-3 col-md-6">
                          <FormGroup>
                            <Label>Are you coughing? </Label>
                            <InputGroup>
                              <Input
                                type="select"
                                name="coughing"
                                id="coughing"
                                onChange={handleInputChange}
                                value={props.tbObj.coughing}
                                disabled={
                                  props.action === "view" ? true : false
                                }
                              >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </Input>
                            </InputGroup>
                          </FormGroup>
                        </div>

                        <div className="form-group mb-3 col-md-6">
                          <FormGroup>
                            <Label>
                              Do you have fever for 2 weeks or more?
                              (Unexplained fever)
                            </Label>
                            <InputGroup>
                              <Input
                                type="select"
                                name="fever"
                                id="fever"
                                onChange={handleInputChange}
                                value={props.tbObj.fever}
                                disabled={
                                  props.action === "view" ? true : false
                                }
                              >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </Input>
                            </InputGroup>
                          </FormGroup>
                        </div>

                        <div className="form-group mb-3 col-md-6">
                          <FormGroup>
                            <Label>
                              Are you having night sweats? (drenching or
                              excessive night sweats)
                            </Label>
                            <InputGroup>
                              <Input
                                type="select"
                                name="nightSweats"
                                id="nightSweats"
                                onChange={handleInputChange}
                                value={props.tbObj.nightSweats}
                                disabled={
                                  props.action === "view" ? true : false
                                }
                              >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </Input>
                            </InputGroup>
                          </FormGroup>
                        </div>

                        <div className="form-group mb-3 col-md-6">
                          <FormGroup>
                            <Label>
                              Are you losing weight? (Unexplained weight loss)
                            </Label>
                            <InputGroup>
                              <Input
                                type="select"
                                name="losingWeight"
                                id="losingWeight"
                                onChange={handleInputChange}
                                value={props.tbObj.losingWeight}
                                disabled={
                                  props.action === "view" ? true : false
                                }
                              >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </Input>
                            </InputGroup>
                          </FormGroup>
                        </div>
                        {props.tbObj.tbTreatment === "No" &&
                          props.tbObj.tbScreeningType ===
                            "Chest X-Ray with CAD and/or Symptom screening" &&
                          props.cadOutcome !== "" &&
                          patientAge <= 14 && (
                            <>
                              <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                  <Label>
                                    History of contacts with TB adults
                                  </Label>
                                  <InputGroup>
                                    <Input
                                      type="select"
                                      name="historyWithAdults"
                                      id="historyWithAdults"
                                      onChange={handleInputChange}
                                      value={props.tbObj.historyWithAdults}
                                      disabled={
                                        props.action === "view" ? true : false
                                      }
                                    >
                                      <option value="">Select</option>
                                      <option value="Yes">Yes</option>
                                      <option value="No">No</option>
                                    </Input>
                                  </InputGroup>
                                </FormGroup>
                              </div>
                              <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                  <Label>Poor weight gain months) </Label>
                                  <InputGroup>
                                    <Input
                                      type="select"
                                      name="poorWeightGain"
                                      id="poorWeightGain"
                                      onChange={handleInputChange}
                                      value={props.tbObj.poorWeightGain}
                                      disabled={
                                        props.action === "view" ? true : false
                                      }
                                    >
                                      <option value="">Select</option>
                                      <option value="Yes">Yes</option>
                                      <option value="No">No</option>
                                    </Input>
                                  </InputGroup>
                                </FormGroup>
                              </div>
                            </>
                          )}
                      </>
                    )}

                  {/* TB SCREENING TYPE === Chest X-ray*/}

                  {props.tbObj.tbScreeningType === "Chest X-ray" && (
                    <>
                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>Chest X-ray</Label>
                          <InputGroup>
                            <Input
                              type="select"
                              name="chestXray"
                              id="chestXray"
                              onChange={handleInputChange}
                              disabled={props.action === "view" ? true : false}
                              value={props.tbObj.chestXray}
                            >
                              <option value="">Select</option>
                              <option value="X-ray suggestive">
                                X-ray suggestive
                              </option>
                              <option value="X-ray not suggestive">
                                X-ray not suggestive
                              </option>
                            </Input>
                          </InputGroup>
                          {errors.chestXray !== "" ? (
                            <span className={classes.error}>
                              {errors.chestXray}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>

                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>
                            Is TB test confirmed positive?{" "}
                            {/* <span style={{ color: "red" }}> *</span> */}
                          </Label>
                          <InputGroup>
                            <Input
                              type="select"
                              name="isTbTestConfirmed"
                              id="isTbTestConfirmed"
                              onChange={handleInputChange}
                              value={props.tbObj.isTbTestConfirmed}
                              disabled={props.action === "view" ? true : false}
                            >
                              <option value="">Select</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </Input>
                          </InputGroup>
                          {errors.isTbTestConfirmed !== "" ? (
                            <span className={classes.error}>
                              {errors.isTbTestConfirmed}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                    </>
                  )}
                </>
              )}
              <hr />

              <br />
              {props.tbObj.tbTreatment !== "Yes" && (
                <>
                  <p style={{ color: "black" }}>
                    TB Screening Outcome:<b>{" " + props.tbObj.outcome}</b>
                  </p>
                </>
              )}

              <p style={{ color: "black" }}>
                TB Screening Status:
                <b>
                  {" " + props.tbObj.status === "undefined"
                    ? ""
                    : props.tbObj.status}
                </b>
              </p>
            </div>
          </form>
          <br />

          {shouldShowTbTreatment(props.tbObj) && (
            <>
              <hr />
              <br />
              <TbTreatmentScreening
                dateOfObservation={props.encounterDate}
                errors={errors}
                tbObj={props.tbObj}
                handleInputChange={handleInputChange}
                dateOfBirth={dateOfBirth}
              />
            </>
          )}

          <br />
          {props.tbObj.tbTreatment === "Yes" && (
            <>
              <hr />
              <br />
              <TbMonitoring
                errors={errors}
                tbObj={props.tbObj}
                handleInputChange={handleInputChange}
              />
            </>
          )}

          <br />
        </CardBody>
      </Card>
    </>
  );
};

export default TbScreening;
