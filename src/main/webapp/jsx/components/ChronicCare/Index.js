import React, { useState, useEffect } from "react";
import axios from "axios";
import MatButton from "@material-ui/core/Button";
//import Button from "@material-ui/core/Button";
import { Spinner, Form, FormGroup, Label, InputGroup, Input } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
//import AddIcon from "@material-ui/icons/Add";
import CancelIcon from "@material-ui/icons/Cancel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { FaPlus, FaAngleDown } from "react-icons/fa";
import { token, url as baseUrl } from "../../../api";
import moment from "moment";
import ChronicConditions from "./ChronicConditions";
import Eligibilty from "./Eligibilty";
import GenderBase from "./GenderBase";
import NutritionalStatus from "./NutritionalStatus";
import PositiveHealthDignity from "./PositiveHealthDignity";
import ReproductiveIntentions from "./ReproductiveIntentions";
import Tb from "./Tb";
import Tpt from "./Tpt";
import ChronicConditionsTwo from "./ChronicConditionsTwo";

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
    "& > *": {
      margin: theme.spacing(1),
    },
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
  success: {
    color: "#4BB543 ",
    fontSize: "11px",
  },
}));

const ChronicCare = (props) => {
  const patientObj = props.patientObj;
  const [saving, setSaving] = useState(false);
  const classes = useStyles();
  const [errors, setErrors] = useState({});
  const [disabledField, setSisabledField] = useState(false);
  let temp = { ...errors };
  const [showEligibility, setShowEligibility] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);
  const [showGenderBase, setShowGenderBase] = useState(false);
  const [showChronicCondition, setShowChronicCondition] = useState(false);
  const [showChronicConditionTwo, setShowChronicConditionTwo] = useState(false);
  const [showPositiveHealth, setShowPositiveHealth] = useState(false);
  const [showReproductive, setShowReproductive] = useState(false);
  const [showTb, setShowTb] = useState(false); //Tpt
  const [showTpt, setShowTpt] = useState(false);
  const [enrollDate, setEnrollDate] = useState("");
  const [chronicDateExist, setChronicDateExist] = useState(null);
  const [lastDateOfObservation, setlastDateOfObservation] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isHypertensive, setHypertensive] = useState("");
  //GenderBase Object
  const [genderBase, setGenderBase] = useState({
    partnerEverPhysically: "",
    haveBeenBeaten: "",
    partnerLivelihood: "",
  });
  //Eligibility Object
  const [eligibility, setEligibility] = useState({
    typeOfClient: "",
    pregnantStatus: "",
    whoStaging: "",
    lastCd4Result: "",
    lastCd4ResultDate: "",
    lastViralLoadResult: "",
    lastViralLoadResultDate: "",
    eligibleForViralLoad: "",
  });
  //Chronic Care Object
  const [chronicConditions, setChronicConditions] = useState({
    diastolic: "",
    systolic: "",
    pulse: "",
    increaseFood: "",
    increaseWater: "",
    frequencyUrination: "",
    hypertensive: "",
    firstTimeDiabetic: "",
    diabetic: "",
    bp: "",
    firstTimeHypertensive: "",
    dateofStartOfHTNTreatment: "",
    htnRegimenAtStart: [],
    currentHtnRegimen: [],
    lastHTNMedicationPickupDate: "",
    durationOfHtnDrugRefill: "",
    currentHtnStatus: "",
    dateOfCurrentHtnStatus: "",
    reasonForStoppedIIT: "",
    dateOfStartOfDiabetesTreatment: "",
  });
  //Nutrition Object
  const [nutrition, setNutrition] = useState({
    height: "",
    weight: "",
    support: "",
    education: "",
  });
  //Preventive Object
  const [preventive, setPreventive] = useState({
    lastAppointment: "",
    medication: "",
    cotrimoxazole: "",
    parentStatus: "",
    condoms: "",
    condomCounseling: "",
    preventDiseases: "",
    alcohol: "",
    nutrituional: "",
    wash: " ",
    phdp: "",
  });
  //Reproductive Object
  const [reproductive, setReproductive] = useState({
    cervicalCancer: "",
    pregnantWithinNextYear: "",
    contraceptive: "",
  });
  //TPT object
  const [tpt, setTpt] = useState({
    date: null,
    weight: "",
    referredForServices: "",
    adherence: "",
    rash: "",
    // neurologicSymptoms: "",g
    hepatitisSymptoms: "",
    tbSymptoms: "",
    resonForStoppingIpt: "",
    outComeOfIpt: "",
    // tbTreatmentStartDate: "",
 
    //TPT prevention
    everCompletedTpt:"",
    eligibilityTpt:"",
    tptPreventionOutcome:"",
    currentlyOnTpt:"",
    contractionForTpt:"",
    liverSymptoms:"",
    chronicAlcohol:"",
    neurologicSymptoms:"",
    dateTptStarted:"",
    tptRegimen:"",
    endedTpt:"",
    dateOfTptCompleted:"",
    dateTptEnded:"",
    tbSideEffect:"",
    giUpsetEffect:"",
    hepatotoxicityEffect:"",
    neurologicSymptomsEffect:"",
    giUpsetEffectSeverity:"",
    hypersensitivityReactionEffect:"",
    hypersensitivityReactionEffectSeverity:"",
    neurologicSymptomsEffectSeverity:"",
    hepatotoxicityEffectSeverity:'',
    enrolledOnTpt:""

  });
  const [tbObj, setTbObj] = useState({
    //TB and IPT Screening Object
    currentlyOnTuberculosis: "",
    tbTreatment: "",
    // tbTreatmentStartDate: "",
    coughing: "",
    fever: "",
    losingWeight: "",
    nightSweats: "",
    poorWeightGain: "",
    historyWithAdults: "",
    outcome: "",
    priorInh: false,
    highAlcohol: false,
    activeHepatitis: false,
    age1year: false,
    poorTreatmentAdherence: false,
    abnormalChest: false,
    activeTb: false,
    contraindications: "",
    eligibleForTPT: "",
    chestXrayResult:"",
    isTbTestConfirmed:"",

    // treatementOutcome: "",
    //This is section for TB Treament Variable
    specimentCollectedStatus: "",
    specimenType: "",
    dateSpecimenSent: "",
    diagnosticTestDone: "",
    diagnosticTestType: "",
    tbTestResult: "",
    specimentSent: "",
    clinicallyEvaulated: "",
    chestXrayDone: "",
    tbEvaulationOutcome: "",
    tbType: "",
    tbTreatmentStarted: "",
    tbTreatmentStartDate: "",
    dateOfDiagnosticTest:"",
    chestXrayResultTest:"",
    dateOfChestXrayResultTestDone:"",
    DateDiagnosticTestResultReceived:"",
    resultOfClinicalEvaluation:"",
    careCardPatientTbStatus:"",
    treatmentType: "",
    treatmentOutcome: "",
    completionDate: "",
    treatmentCompletionStatus: "",
    completedTbTreatment: "",
    currentWeight:""

  });
  const [observationObj, setObservationObj] = useState({
    //Predefine object for chronic care DTO
    eligibility: "",
    nutrition: "",
    genderBase: "",
    chronicCondition: "",
    positiveHealth: "",
    peproductive: "",
    tbIptScreening: "",
    tptMonitoring: "",
  });
  const [observation, setObservation] = useState({
    data: {},
    dateOfObservation: "",
    facilityId: null,
    personId: 0,
    type: "Chronic Care",
    visitId: null,
  });
  useEffect(() => {
    // GetChronicCare();
    GetChronicCareData();
    PatientCurrentObject();
    getIsHypertensive();
    if (
      props.activeContent.id &&
      props.activeContent.id !== "" &&
      props.activeContent.id !== null
    ) {
      setSisabledField(props.activeContent.actionType === "view");
    }
    setIsUpdate(
      props.activeContent && props.activeContent.actionType === "update"
    );
  }, [props.activeContent.id,props.tbObj]);
  //GET  Patients
  async function PatientCurrentObject() {
    axios
      .get(`${baseUrl}hiv/patient/${props.patientObj.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setEnrollDate(response.data.enrollment.dateOfRegistration);
        //setPatientObject(response.data);
      })
      .catch((error) => {});
  }


  const getIsHypertensive = async () => {
    try {
      //function to get is hypertensive
      const response = await axios.get(
        `${baseUrl}observation/is-hypertensive/${patientObj.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        setHypertensive(response.data["isHypertensive"]);
      }
    } catch (error) {// Handle error here
      //console.error(error);
    }
  };



  const GetChronicCareData = () => {
    //function to get chronic care data check if record exist using date for validation
    axios
      .get(`${baseUrl}observation/person/${patientObj.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const DateObj = response.data.filter((x) => x.type === "Chronic Care");
        if (response.data) {
          setChronicDateExist(DateObj);
        }
      })
      .catch((error) => {});
  };

  const handleInputChange = (e) => {
    setErrors({ ...temp, [e.target.name]: "" });
    setObservation({ ...observation, [e.target.name]: e.target.value });
  };

  //Validations of the forms
  const validate = () => {
    // tpt.outComeOfIpt !== "" &&
    //   (temp.outcomeDate = tpt.date ? "" : "This field is required");
      temp.tbTreatment = tbObj.tbTreatment ? '' : "This field is required.";
      if(tbObj.tbTreatment === "Yes"){
        temp.tbTreatmentStartDate = tbObj.tbTreatmentStartDate ? '' : "This field is required.";
        temp.completedTbTreatment = tbObj. completedTbTreatment ? '' : "This field is required.";
        // temp.currentWeight = tbObj.currentWeight ? '' : "This field is required.";
        temp.currentWeight = tbObj.currentWeight ? (tbObj.currentWeight > 200 ? "Current Weight cannot be greater than 200." : '') : "This field is required.";
      }
    if(tbObj.completedTbTreatment === "Yes"){
      temp.completionDate = tbObj.completionDate ? '' : "This field is required.";
      temp.treatmentOutcome = tbObj.treatmentOutcome? '' : "This field is required.";
    }
    if(tbObj.tbTreatment === "No"){
      temp.tbScreeningType = tbObj.tbScreeningType ? '' : "This field is required.";
    }
    if(tbObj.tbScreeningType !== '' && tbObj.tbScreeningType === 'Chest X-ray'){
      temp.chestXray = tbObj.chestXray ? '' : "This field is required.";
      temp.isTbTestConfirmed = tbObj.isTbTestConfirmed ? '' : "This field is required.";
    }
    if(tbObj.tbScreeningType !== '' && tbObj.tbScreeningType === 'Chest X-ray with CAD'){
      temp.chestXrayResult = tbObj.chestXrayResult ? '' : "This field is required.";
    }
    if (tbObj.tbScreeningType === 'Chest X-ray with CAD' || tbObj.tbScreeningType === 'Chest X-ray without CAD') {
      temp.chestXrayResult = tbObj.chestXrayResult ? '' : "This field is required.";
    }
    if (tbObj.tbScreeningType === 'Chest X-ray with CAD' || tbObj.tbScreeningType === 'Chest X-ray without CAD') {
      temp.chestXrayResult = tbObj.chestXrayResult ? '' : "This field is required.";
    }
    if(tbObj.tbTreatment ==="No" && tbObj.outcome === "Presumptive TB" ){
      temp.specimentCollectedStatus = tbObj.specimentCollectedStatus ? '' : "This field is required.";
    }
    if (tbObj.tbScreeningType === 'Symptom screen (alone)') {
      temp.coughing = tbObj.coughing ? '' : "This field is required.";
      temp.fever = tbObj.fever ? '': "This field is required. ";
      temp.nightSweats= tbObj.nightSweats ? '' : "This field is required.";
      temp.losingWeight = tbObj.losingWeight ? '': "This field is required. ";
    }
    if(tbObj.specimentCollectedStatus === "Yes"){
      temp.specimentSent = tbObj.specimentSent ? '' : "This field is required.";
    }
    if(tbObj.diagnosticTestDone==='Yes'){
      temp.dateOfDiagnosticTest = tbObj.dateOfDiagnosticTest ? '' : "This field is required.";
      temp.diagnosticTestType = tbObj.diagnosticTestType ? '' : "This field is required.";
    }
    if((tbObj.diagnosticTestType==='GeneXpert'
            || tbObj.diagnosticTestType==='Truenat'
            || tbObj.diagnosticTestType==='Cobas'
            || tbObj.diagnosticTestType==='TB-LAMP'
            || tbObj.diagnosticTestType==='Smear Microscopy') &&
        (tbObj.tbTestResult==='MTB not detected' ||
            tbObj.tbTestResult==='Negative')

    ){
      temp.chestXrayDone = tbObj.chestXrayDone ? '' : "This field is required.";
      temp.clinicallyEvaulated = tbObj.clinicallyEvaulated ? '' : "This field is required.";
    }
    if(tbObj.chestXrayDone==='Yes'){
      temp.chestXrayResultTest = tbObj.chestXrayResultTest ? '' : "This field is required.";
      temp.dateOfChestXrayResultTestDone = tbObj.dateOfChestXrayResultTestDone ? '' : "This field is required.";
    }
    if(
        tbObj.tbTestResult==='MTB detected RIF detected' ||
        tbObj.tbTestResult==='MTB detected RIF&INH detected' ||
       tbObj.tbTestResult=== 'MTB detected RR detected' ||
       tbObj.tbTestResult ==='MTB detected RR not detected' ||
        tbObj.tbTestResult ==='MTB trace RR indeterminate' ||
        tbObj.chestXrayResultTest ==='Suggestive of TB'
    ){
      temp.tbType = tbObj.tbType ? '' : "This field is required.";
      temp.tbTreatmentStarted = tbObj.tbTreatmentStarted ? '' : "This field is required.";
      temp.tbTreatmentStartDate = tbObj.tbTreatmentStartDate ? '' : "This field is required.";
    }
    temp.dateOfObservation = observation.dateOfObservation ? "" : "This field is required";
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x === "");
  };

  const showErrorMessage = (message) => {
    toast.error(message, { position: toast.POSITION.BOTTOM_CENTER });
  };

  const showSuccessMessage = (message) => {
    toast.success(message, { position: toast.POSITION.BOTTOM_CENTER });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Set up observation object
    observation.personId = patientObj.id;
    observationObj.eligibility = eligibility;
    observationObj.nutrition = nutrition;
    observationObj.genderBase = genderBase;
    observationObj.chronicCondition = chronicConditions;
    observationObj.positiveHealth = preventive;
    observationObj.peproductive = reproductive;
    observationObj.tbIptScreening = tbObj;
    observationObj.tptMonitoring = tpt;
    observation.data = observationObj;

    // Validate form
    if (!validate()) {
      showErrorMessage("All fields are required");
      setSaving(false);
      return;
    }

    // Check for duplicate visit Date
    if (
      chronicDateExist !== null &&
      chronicDateExist.find(
        (x) => x.dateOfObservation === observation.dateOfObservation
      )
    ) {
      showErrorMessage(
        "Chronic Care visit date " +
          observation.dateOfObservation +
          " already exists."
      );
      setSaving(false);
      return;
    }

    // Send  request
    try {
      const response = isUpdate
        ? await axios.put(
            `${baseUrl}observation/${props.activeContent.id}`,
            observation,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        : await axios.post(`${baseUrl}observation`, observation, {
            headers: { Authorization: `Bearer ${token}` },
          });

      setSaving(false);
      showSuccessMessage("Chronic Care Save successful");
      props.setActiveContent({
        ...props.activeContent,
        route: "recent-history",
      });
    } catch (error) {
      setSaving(false);
      if (error.response && error.response.data) {
        const errorMessage =
          error.response.data.apierror &&
          error.response.data.apierror.message !== ""
            ? error.response.data.apierror.message
            : "Something went wrong. Please try again...";
        showErrorMessage(errorMessage);
      }
    }
  };


  const onClickEligibility = () => {
    setShowEligibility(!showEligibility);
  };
  const onClickTb = () => {
    setShowTb(!showTb);
  };
  const onClickNutrition = () => {
    setShowNutrition(!showNutrition);
  };
  const onClickGenderBase = () => {
    setShowGenderBase(!showGenderBase);
  };
  const onClickChronicCondition = () => {
    setShowChronicCondition(!showChronicCondition);
  };
  const onClickChronicConditionTwo = () => {
    setShowChronicConditionTwo(!showChronicConditionTwo);
  };
  const onClickPositiveHealth = () => {
    setShowPositiveHealth(!showPositiveHealth);
  };
  const onClickReproductive = () => {
    setShowReproductive(!showReproductive);
  };
  const onClickTpt = () => {
    setShowTpt(!showTpt);
  };

  const handleCancel = () => {
    //history.push({ pathname: '/' });
  };
  return (
    <>
      <ToastContainer autoClose={3000} hideProgressBar />
      <div
        className="row page-titles mx-0"
        style={{ marginTop: "0px", marginBottom: "-10px" }}
      >
        <ol className="breadcrumb">
          <li className="breadcrumb-item active">
            <h2> Care and Support</h2>
          </li>
        </ol>
      </div>

      <Card className={classes.root}>
        <CardContent>
          <div className="col-xl-12 col-lg-12">
            <Form>
              <div className="row">
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label>Visit Date *</Label>

                    <Input
                      type="date"
                      name="dateOfObservation"
                      id="dateOfObservation"
                      value={observation.dateOfObservation}
                      onChange={handleInputChange}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.25rem",
                      }}
                      min={enrollDate}
                      max={moment(new Date()).format("YYYY-MM-DD")}
                      onKeyPress={(e) => e.preventDefault()}
                    ></Input>
                  </FormGroup>
                  {errors.dateOfObservation !== "" ? (
                    <span className={classes.error}>
                      {errors.dateOfObservation}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              {/* Eligibility Assessment */}
              <div className="card">
                <div
                  className="card-header"
                  style={{
                    backgroundColor: "#014d88",
                    color: "#fff",
                    fontWeight: "bolder",
                    borderRadius: "0.2rem",
                  }}
                >
                  <h5 className="card-title" style={{ color: "#fff" }}>
                    Eligibility Assessment
                  </h5>
                  {showEligibility === false ? (
                    <>
                      <span
                        className="float-end"
                        style={{ cursor: "pointer" }}
                        onClick={onClickEligibility}
                      >
                        <FaPlus />
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        className="float-end"
                        style={{ cursor: "pointer" }}
                        onClick={onClickEligibility}
                      >
                        <FaAngleDown />
                      </span>{" "}
                    </>
                  )}
                </div>
                {showEligibility && (
                  <Eligibilty
                    setEligibility={setEligibility}
                    eligibility={eligibility}
                    setErrors={setErrors}
                    errors={errors}
                    encounterDate={observation.dateOfObservation}
                    patientObj={patientObj}
                  />
                )}
              </div>
              {/* End Eligibility Assessment */}
              {/* TB & IPT  Screening  */}
              <div className="card">
                <div
                  className="card-header"
                  style={{
                    backgroundColor: "#014d88",
                    color: "#fff",
                    fontWeight: "bolder",
                    borderRadius: "0.2rem",
                  }}
                >
                  <h5 className="card-title" style={{ color: "#fff" }}>
                  TB Screening/Monitoring{" "}
                  </h5>
                  {showTb === false ? (
                    <>
                      <span
                        className="float-end"
                        style={{ cursor: "pointer" }}
                        onClick={onClickTb}
                      >
                        <FaPlus />
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        className="float-end"
                        style={{ cursor: "pointer" }}
                        onClick={onClickTb}
                      >
                        <FaAngleDown />
                      </span>{" "}
                    </>
                  )}
                </div>
                {showTb && (
                  <Tb
                    setTbObj={setTbObj}
                    tbObj={tbObj}
                    setErrors={setErrors}
                    errors={errors}
                    encounterDate={observation.dateOfObservation}
                    patientObj={patientObj}
                    setTpt={setTpt}
                    tpt={tpt}
                    act="create"
                  />
                )}
              </div>
              {/* End TB & IPT  Screening  */}
              {/* TPT MONITORING */}
              {/*{tbObj.outcome!=='' && (<>*/}
              {/*  <div className="card">*/}
              {/*  <div*/}
              {/*    className="card-header"*/}
              {/*    style={{*/}
              {/*      backgroundColor: "#014d88",*/}
              {/*      color: "#fff",*/}
              {/*      fontWeight: "bolder",*/}
              {/*      borderRadius: "0.2rem",*/}
              {/*    }}*/}
              {/*  >*/}
              {/*    <h5 className="card-title" style={{ color: "#fff" }}>*/}
              {/*    TPT Prevention/Monitoring*/}
              {/*    </h5>*/}
              {/*    {showTpt === false ? (*/}
              {/*      <>*/}
              {/*        <span*/}
              {/*          className="float-end"*/}
              {/*          style={{ cursor: "pointer" }}*/}
              {/*          onClick={onClickTpt}*/}
              {/*        >*/}
              {/*          <FaPlus />*/}
              {/*        </span>*/}
              {/*      </>*/}
              {/*    ) : (*/}
              {/*      <>*/}
              {/*        <span*/}
              {/*          className="float-end"*/}
              {/*          style={{ cursor: "pointer" }}*/}
              {/*          onClick={onClickTpt}*/}
              {/*        >*/}
              {/*          <FaAngleDown />*/}
              {/*        </span>{" "}*/}
              {/*      </>*/}
              {/*    )}*/}
              {/*  </div>*/}
              {/*  {showTpt && (*/}
              {/*    <Tpt*/}
              {/*      setTpt={setTpt}*/}
              {/*      tpt={tpt}*/}
              {/*      tbObj={tbObj}*/}
              {/*      setTbObj={setTbObj}*/}
              {/*      setErrors={setErrors}*/}
              {/*      errors={errors}*/}
              {/*      encounterDate={observation.dateOfObservation}*/}
              {/*      patientObj={patientObj}*/}
              {/*    />*/}
              {/*  )}*/}
              {/*</div>*/}
              {/*</>)}*/}

              {
                  (tbObj.tbEvaulationOutcome === 'TB Not Diagnosed' ||
                      tbObj.outcome === "Not Presumptive" ||
                       tbObj.status === 'No signs or symptoms of TB'
                  // || tbObj.tbTreatment === "No"
                  )
                  &&
                  (
                      <div className="card">
                        <div
                            className="card-header"
                            style={{
                              backgroundColor: "#014d88",
                              color: "#fff",
                              fontWeight: "bolder",
                              borderRadius: "0.2rem",
                            }}
                        >
                          <h5 className="card-title" style={{ color: "#fff" }}>
                            TPT Prevention/Monitoring
                          </h5>
                          {showTpt === false ? (
                              <span
                                  className="float-end"
                                  style={{ cursor: "pointer" }}
                                  onClick={onClickTpt}
                              >
            <FaPlus />
          </span>
                          ) : (
                              <span
                                  className="float-end"
                                  style={{ cursor: "pointer" }}
                                  onClick={onClickTpt}
                              >
            <FaAngleDown />
          </span>
                          )}
                        </div>
                        {showTpt && (
                            <Tpt
                                setTpt={setTpt}
                                tpt={tpt}
                                tbObj={tbObj}
                                setTbObj={setTbObj}
                                setErrors={setErrors}
                                errors={errors}
                                encounterDate={observation.dateOfObservation}
                                patientObj={patientObj}
                            />
                        )}
                      </div>
                  )
              }
              
              {/* End TPT MONITORING */}
              {/* End Nutritional Status Assessment */}
              <div className="card">
                <div
                  className="card-header"
                  style={{
                    backgroundColor: "#014d88",
                    color: "#fff",
                    fontWeight: "bolder",
                    borderRadius: "0.2rem",
                  }}
                >
                  <h5 className="card-title" style={{ color: "#fff" }}>
                    Nutritional Status Assessment
                  </h5>
                  {showNutrition === false ? (
                    <>
                      <span
                        className="float-end"
                        style={{ cursor: "pointer" }}
                        onClick={onClickNutrition}
                      >
                        <FaPlus />
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        className="float-end"
                        style={{ cursor: "pointer" }}
                        onClick={onClickNutrition}
                      >
                        <FaAngleDown />
                      </span>{" "}
                    </>
                  )}
                </div>
                {showNutrition && (
                  <NutritionalStatus
                    nutrition={nutrition}
                    setNutrition={setNutrition}
                    setErrors={setErrors}
                    errors={errors}
                    encounterDate={observation.dateOfObservation}
                    patientObj={patientObj}
                    action={props.activeContent.actionType}
                  />
                )}
              </div>
              {/* End Nutritional Status Assessment */}
              {/* Gender Based Violence Screening */}
              <div className="card">
                <div
                  className="card-header"
                  style={{
                    backgroundColor: "#014d88",
                    color: "#fff",
                    fontWeight: "bolder",
                    borderRadius: "0.2rem",
                  }}
                >
                  <h5 className="card-title" style={{ color: "#fff" }}>
                    Gender Based Violence Screening{" "}
                  </h5>
                  {showGenderBase === false ? (
                    <>
                      <span
                        className="float-end"
                        style={{ cursor: "pointer" }}
                        onClick={onClickGenderBase}
                      >
                        <FaPlus />
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        className="float-end"
                        style={{ cursor: "pointer" }}
                        onClick={onClickGenderBase}
                      >
                        <FaAngleDown />
                      </span>{" "}
                    </>
                  )}
                </div>
                {showGenderBase && (
                  <div className="card-body">
                    <div className="row">
                      <GenderBase
                        setGenderBase={setGenderBase}
                        genderBase={genderBase}
                        setErrors={setErrors}
                        errors={errors}
                        encounterDate={observation.dateOfObservation}
                        patientObj={patientObj}
                      />
                    </div>
                  </div>
                )}
              </div>
              {/* End Gender Based Violence Screening */}
              {/* End Screening for Chronic Conditions */}
              <div className="card">
                <div
                  className="card-header"
                  style={{
                    backgroundColor: "#014d88",
                    color: "#fff",
                    fontWeight: "bolder",
                    borderRadius: "0.2rem",
                  }}
                >
                  <h5 className="card-title" style={{ color: "#fff" }}>
                    Screening for Chronic Conditions Hypertension
                  </h5>
                  {showChronicCondition === false ? (
                    <>
                      <span
                        className="float-end"
                        style={{ cursor: "pointer" }}
                        onClick={onClickChronicCondition}
                      >
                        <FaPlus />
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        className="float-end"
                        style={{ cursor: "pointer" }}
                        onClick={onClickChronicCondition}
                      >
                        <FaAngleDown />
                      </span>{" "}
                    </>
                  )}
                </div>
                {showChronicCondition && (
                  <div className="card-body">
                    <div className="row">
                      <ChronicConditions
                        chronicConditions={chronicConditions}
                        setChronicConditions={setChronicConditions}
                        setErrors={setErrors}
                        errors={errors}
                        encounterDate={observation.dateOfObservation}
                        patientObj={patientObj}
                        isHypertensive={isHypertensive}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="card">
                <div
                  className="card-header"
                  style={{
                    backgroundColor: "#014d88",
                    color: "#fff",
                    fontWeight: "bolder",
                    borderRadius: "0.2rem",
                  }}
                >
                  <h5 className="card-title" style={{ color: "#fff" }}>
                    Screening for Chronic Conditions Diabetics
                  </h5>
                  {showChronicConditionTwo === false ? (
                    <>
                      <span
                        className="float-end"
                        style={{ cursor: "pointer" }}
                        onClick={onClickChronicConditionTwo}
                      >
                        <FaPlus />
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        className="float-end"
                        style={{ cursor: "pointer" }}
                        onClick={onClickChronicConditionTwo}
                      >
                        <FaAngleDown />
                      </span>{" "}
                    </>
                  )}
                </div>
                {showChronicConditionTwo && (
                  <div className="card-body">
                    <div className="row">
                      <ChronicConditionsTwo
                        chronicConditions={chronicConditions}
                        setChronicConditions={setChronicConditions}
                        setErrors={setErrors}
                        errors={errors}
                        encounterDate={observation.dateOfObservation}
                        patientObj={patientObj}
                        isHypertensive={isHypertensive}
                      />
                    </div>
                  </div>
                )}
              </div>
              {/* End Screening for Chronic Conditions */}
              {/* Positive Health Dignity and Prevention */}
              <div className="card">
                <div
                  className="card-header"
                  style={{
                    backgroundColor: "#014d88",
                    color: "#fff",
                    fontWeight: "bolder",
                    borderRadius: "0.2rem",
                  }}
                >
                  <h5 className="card-title" style={{ color: "#fff" }}>
                    Positive Health Dignity and Prevention(PHDP){" "}
                  </h5>
                  {showPositiveHealth === false ? (
                    <>
                      <span
                        className="float-end"
                        style={{ cursor: "pointer" }}
                        onClick={onClickPositiveHealth}
                      >
                        <FaPlus />
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        className="float-end"
                        style={{ cursor: "pointer" }}
                        onClick={onClickPositiveHealth}
                      >
                        <FaAngleDown />
                      </span>{" "}
                    </>
                  )}
                </div>
                {showPositiveHealth && (
                  <div className="card-body">
                    <div className="row">
                      <PositiveHealthDignity
                        preventive={preventive}
                        setPreventive={setPreventive}
                        setErrors={setErrors}
                        errors={errors}
                        encounterDate={observation.dateOfObservation}
                        patientObj={patientObj}
                      />
                    </div>
                  </div>
                )}
              </div>
              {/* End Positive Health Dignity and Prevention */}
              {/* Reproductive Intentions */}
              <div className="card">
                <div
                  className="card-header"
                  style={{
                    backgroundColor: "#014d88",
                    color: "#fff",
                    fontWeight: "bolder",
                    borderRadius: "0.2rem",
                  }}
                >
                  <h5 className="card-title" style={{ color: "#fff" }}>
                    Reproductive Intentions{" "}
                  </h5>
                  {showReproductive === false ? (
                    <>
                      <span
                        className="float-end"
                        style={{ cursor: "pointer" }}
                        onClick={onClickReproductive}
                      >
                        <FaPlus />
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        className="float-end"
                        style={{ cursor: "pointer" }}
                        onClick={onClickReproductive}
                      >
                        <FaAngleDown />
                      </span>{" "}
                    </>
                  )}
                </div>
                {showReproductive && (
                  <div className="card-body">
                    <div className="row">
                      <ReproductiveIntentions
                        setReproductive={setReproductive}
                        reproductive={reproductive}
                        setErrors={setErrors}
                        errors={errors}
                        encounterDate={observation.dateOfObservation}
                        patientObj={patientObj}
                      />
                    </div>
                  </div>
                )}
              </div>
              {/* End Reproductive Intentions */}
              {saving ? <Spinner /> : ""}

              <br />
              <MatButton
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<SaveIcon />}
                style={{ backgroundColor: "#014d88" }}
                onClick={handleSubmit}
                disabled={saving}
              >
                {!saving ? (
                  <span style={{ textTransform: "capitalize" }}>Save</span>
                ) : (
                  <span style={{ textTransform: "capitalize" }}>Saving...</span>
                )}
              </MatButton>
            </Form>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ChronicCare;