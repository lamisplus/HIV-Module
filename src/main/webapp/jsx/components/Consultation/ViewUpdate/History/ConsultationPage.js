import React, { useState, useEffect } from "react";
import {
  Grid,
  Segment,
  Label,
  List,
  Label as LabelSui,
  Message,
} from "semantic-ui-react";
import { Table } from "react-bootstrap";
// Page titie
import {
  FormGroup,
  Label as FormLabelName,
  InputGroup,
  InputGroupText,
  Input,
} from "reactstrap";
import ADR from "./../ADR/Index";
import OpportunisticInfection from "./../OpportunisticInfection/Index";
import TBScreening from "./../TBScreening/Index";
import { url as baseUrl, token } from "../../../../../api";
import MatButton from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
//import { Row, Col,   } from "react-bootstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
//import Button from '@material-ui/core/Button';
//import ButtonGroup from '@material-ui/core/ButtonGroup';
import { Button as ButtonSMUI, Icon } from "semantic-ui-react";
//import {Link} from 'react-router-dom';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Select from "react-select";
import { Dropdown } from "react-bootstrap";

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
    marginBottom: 20,
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

const ClinicVisit = (props) => {
  const patientObj = props.patientObj ? props.patientObj : {};
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [splitButtonOpen, setSplitButtonOpen] = React.useState(false);
  const toggleDropDown = () => setDropdownOpen(!dropdownOpen);
  const toggleSplit = () => setSplitButtonOpen(!splitButtonOpen);
  const [visitId, setVisitId] = useState();
  const [enableUpdateButton, setEnableUpdateButton] = useState(false);
  const [heightValue, setHeightValue] = useState("cm");
  const [enableUpdate, setEnableUpdate] = useState(false); //Enable update for all input field if the user have permission
  const [errors, setErrors] = useState({});
  const [clinicVisitList, setClinicVisitList] = useState([]);
  const [loading, setLoading] = useState(true);
  let temp = { ...errors };
  const classes = useStyles();
  // the visit date history
  //end of the visit date history
  const [getPatientObj, setGetPatientObj] = useState({});
  const [saving, setSaving] = useState(false);
  const [clinicalStage, setClinicalStage] = useState([]);
  const [functionalStatus, setFunctionalStatus] = useState([]);
  const [adherenceLevel, setAdherenceLevel] = useState([]);
  const [tbStatus, setTbStatus] = useState([]);
  const [TBForms, setTBForms] = useState(false);
  const [currentVitalSigns, setcurrentVitalSigns] = useState({});
  const [showCurrentVitalSigns, setShowCurrentVitalSigns] = useState(false);
  const [adultRegimenLine, setAdultRegimenLine] = useState([]);
  const [childRegimenLine, setChildRegimenLine] = useState([]);
  const [regimenTypeObj, setRegimenTypeObj] = useState([]);
  //opportunistic infection Object
  const [infection, setInfection] = useState({
    illnessInfection: "",
    ondateInfection: "",
  });
  const [infectionList, setInfectionList] = useState([]);
  const [testGroup, setTestGroup] = useState([]);
  const [test, setTest] = useState([]);
  //ADR array Object
  const [adrObj, setAdrObj] = useState({ adr: "", adrOnsetDate: "" });
  const [adrList, setAdrList] = useState([]);
  const [arvDrugOrderList, setarvDrugOrderList] = useState([]);
  const [cryptococcal, setCryptococcal] = useState([]);
  const [cervicalStatus, setCervicalStatus] = useState([]);
  const [cervicalTreatment, setCervicalTreatment] = useState([]);
  const [hepatitis, setHepatitis] = useState([]);
  const [pregnancyStatus, setPregnancyStatus] = useState([]);
  const [familyPlaining, setFamilyPlaining] = useState([]);
  const [vLIndication, setVLIndication] = useState([]);
  const [testOrderList, setTestOrderList] = useState([]); //Test Order List
  const [selectedOption, setSelectedOption] = useState([]);
  const [labTestOptions, setLabTestOptions] = useState([]);
  const [loadClinicHistory, setLoadClinicHistory] = useState(true);
  const [disabledField, setDisabledField] = useState(false);
  const [arvDrugObj, setArvDrugObj] = useState({
    regimenLine: "",
    regimenDrug: "",
    regimenLineName: "",
    regimenDrugName: "",
    dosage: "",
    regimenAdherance: "",
  });
  const [tests, setTests] = useState({
    comments: "",
    dateAssayed: "",
    labNumber: "",
    labTestGroupId: "",
    labTestId: "",
    dateResultReceived: "",
    patientId: props.patientObj ? props.patientObj.id : "",
    result: "",
    sampleCollectionDate: null,
    viralLoadIndication: 0,
    visitId: "",
  });
  //Vital signs clinical decision support
  const [vitalClinicalSupport, setVitalClinicalSupport] = useState({
    bodyWeight: "",
    diastolic: "",
    height: "",
    systolic: "",
    pulse: "",
    temperature: "",
    respiratoryRate: "",
  });
  const [objValues, setObjValues] = useState({
    adherenceLevel: "",
    adheres: {},
    adrScreened: "",
    adverseDrugReactions: {},
    artStatusId: "",
    cd4: "",
    cd4Percentage: "",
    clinicalNote: "",
    clinicalStageId: "",
    facilityId: 0,
    functionalStatusId: "",
    hivEnrollmentId: "",
    nextAppointment: "",
    lmpDate: "",
    oiScreened: "",
    opportunisticInfections: {},
    personId: patientObj.id,
    tbScreen: {},
    stiIds: "",
    stiTreated: "",
    uuid: "",
    visitDate: "",
    whoStagingId: "",
    cryptococcalScreeningStatus: "",
    cervicalCancerScreeningStatus: "",
    cervicalCancerTreatmentProvided: "",
    hepatitisScreeningResult: "",
    familyPlaning: "",
    onFamilyPlaning: "",
    levelOfAdherence: "",
    tbStatus: "",
    tbPrevention: "",
    arvdrugsRegimen: {},
    viralLoadOrder: {},
    tbPrevention: "",
    pregnancyStatus: "",
  });
  const [vital, setVitalSignDto] = useState({
    bodyWeight: "",
    diastolic: "",
    encounterDate: "",
    facilityId: 1,
    height: "",
    personId: props.patientObj.id,
    serviceTypeId: 1,
    systolic: "",
    pulse: "",
    temperature: "",
    respiratoryRate: "",
  });
  const [tbObj, setTbObj] = useState({
    currentOnIpt: "",
    coughing: "",
    antiTBDrug: "",
    nightSweat: "",
    fever: "",
    contactWithTBCase: "",
    lethergy: "",
    tbStatusId: "",
  });

  useEffect(() => {
    FunctionalStatus();
    WhoStaging();
    AdherenceLevel();
    TBStatus();
    VitalSigns();

    //ClinicVisitListHistory();
    AdultRegimenLine();
    ChildRegimenLine();
    CRYPTOCOCCAL_SCREENING_STATUS();
    CERVICAL_CANCER_SCREENING_STATUS();
    CERVICAL_CANCER_TREATMENT();
    HEPATITIS_SCREENING_RESULT();
    PREGANACY_STATUS();
    FAMILY_PLANNING_METHOD();
    TestGroup();
    if (props.activeContent.id !== "") {
      GetPatientObj();
      GetVisitById(props.activeContent.id);
      setVisitId(props.activeContent.id);
    }
    if (props.activeContent && props.activeContent.actionType === "view") {
      setDisabledField(true);
    }
    if (
      objValues.adherenceLevel !== null &&
      objValues.adherenceLevel === "Good"
    ) {
      objValues.levelOfAdherence = 354;
    } else if (
      objValues.adherenceLevel !== null &&
      objValues.adherenceLevel === "Fair"
    ) {
      objValues.levelOfAdherence = 355;
    } else if (
      objValues.adherenceLevel !== null &&
      objValues.adherenceLevel === "Poor"
    ) {
      objValues.levelOfAdherence = 356;
    } else {
      objValues.levelOfAdherence = objValues.levelOfAdherence;
    }
  }, [patientObj.id, props.activeContent.id, objValues.adherenceLevel]); // objValues.viralLoadOrder
  const calculate_age = (dob) => {
    var today = new Date();
    var dateParts = dob.split("-");
    var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    var birthDate = new Date(dateObject); // create a date object directlyfrom`dob1`argument
    var age_now = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age_now--;
    }
    if (age_now === 0) {
      return m;
    }
    return age_now;
  };
  const patientAge = calculate_age(
    moment(patientObj.dateOfBirth).format("DD-MM-YYYY")
  );
  //Get list of Test Group
  const TestGroup = () => {
    axios
      .get(`${baseUrl}laboratory/labtestgroups`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTestGroup(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  // PREGANACY_STATUS
  const PREGANACY_STATUS = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/PREGNANCY_STATUS	`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setPregnancyStatus(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  // CRYPTOCOCCAL_SCREENING_STATUS
  const CRYPTOCOCCAL_SCREENING_STATUS = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/CRYPTOCOCCAL_SCREENING_STATUS	`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCryptococcal(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  // CERVICAL_CANCER_SCREENING_STATUS
  const CERVICAL_CANCER_SCREENING_STATUS = () => {
    axios
      .get(
        `${baseUrl}application-codesets/v2/CERVICAL_CANCER_SCREENING_STATUS	`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setCervicalStatus(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  // CERVICAL_CANCER_TREATMENT
  const CERVICAL_CANCER_TREATMENT = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/CERVICAL_CANCER_TREATMENT	`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCervicalTreatment(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  // HEPATITIS_SCREENING_RESULT
  const HEPATITIS_SCREENING_RESULT = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/HEPATITIS_SCREENING_RESULT	`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setHepatitis(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  // HEPATITIS_SCREENING_RESULT
  const FAMILY_PLANNING_METHOD = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/FAMILY_PLANNING_METHOD	`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setFamilyPlaining(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  //GET AdultRegimenLine
  const AdultRegimenLine = () => {
    axios
      .get(`${baseUrl}hiv/regimen/arv/adult`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAdultRegimenLine(
          response.data.filter((x) => x.id === 1 || x.id === 2 || x.id === 14)
        );
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  //GET AdultRegimenLine
  const ChildRegimenLine = () => {
    axios
      .get(`${baseUrl}hiv/regimen/arv/adult`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setChildRegimenLine(
          response.data.filter((x) => x.id === 3 || x.id === 4)
        );
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  //GET LIST Drug Refill
  // async function ClinicVisitListHistory() {
  //   setLoading(true)
  //   axios
  //       .get(`${baseUrl}hiv/art/clinic-visit/person?pageNo=0&pageSize=1000&personId=${props.patientObj.id}`,
  //       { headers: {"Authorization" : `Bearer ${token}`} }
  //       )
  //       .then((response) => {
  //           setLoading(false)
  //           setClinicVisitList(response.data.filter((x)=> x.isCommencement!==true));
  //       })
  //       .catch((error) => {
  //           setLoading(false)
  //       });
  // }
  //Check for the last Vital Signs
  const VitalSigns = () => {
    axios
      .get(`${baseUrl}patient/vital-sign/person/${props.patientObj.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const lastVitalSigns = response.data[response.data.length - 1];
        if (
          lastVitalSigns.encounterDate >=
          moment(new Date()).format("YYYY-MM-DD")
        ) {
          setcurrentVitalSigns(lastVitalSigns);
          setShowCurrentVitalSigns(true);
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  //Get The updated patient objeect
  const GetPatientObj = () => {
    axios
      .get(`${baseUrl}hiv/patient/${props.patientObj.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setGetPatientObj(response.data);
        //patientObj=response.data
      })
      .catch((error) => {
        //console.log(error);
      });
  };

  //Get list of WhoStaging
  const WhoStaging = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/CLINICAL_STAGE`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        //console.log(response.data);
        setClinicalStage(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  ///GET LIST OF FUNCTIONAL%20_STATUS
  // TB STATUS
  const TBStatus = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/TB_STATUS`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        //console.log(response.data);
        setTbStatus(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  };

  async function FunctionalStatus() {
    axios
      .get(`${baseUrl}application-codesets/v2/FUNCTIONAL%20_STATUS`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setFunctionalStatus(response.data);
        //setValues(response.data)
      })
      .catch((error) => {});
  }
  ///Level of Adherence
  async function AdherenceLevel() {
    axios
      .get(`${baseUrl}application-codesets/v2/PrEP_LEVEL_OF_ADHERENCE`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response.data);
        setAdherenceLevel(response.data);
      })
      .catch((error) => {});
  }
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
  const handleInputChangeVitalSignDto = (e) => {
    setErrors({ ...errors, [e.target.name]: "" });
    setVitalSignDto({ ...vital, [e.target.name]: e.target.value });
    // if(e.target.name!=='encounterDate' && e.target.name!=='muac'){
    //   setVitalSignDto({ ...vital, [e.target.name]: e.target.value.replace(/\D/g, '') });
    // }else{
    //   setVitalSignDto({ ...vital, [e.target.name]: e.target.value });
    // }
  };

  //Handle CheckBox
  const handleCheckBox = (e) => {
    if (e.target.checked) {
      //currentVitalSigns.personId === null ? props.patientObj.id : currentVitalSigns.personId
      setVitalSignDto({ ...currentVitalSigns });
    } else {
      setVitalSignDto({
        bodyWeight: "",
        diastolic: "",
        captureDate: "",
        encounterDate: "",
        facilityId: "",
        height: "",
        personId: props.patientObj.id,
        serviceTypeId: "",
        systolic: "",
        pulse: "",
        temperature: "",
        respiratoryRate: "",
      });
    }
  };
  //to check the input value for clinical decision
  const handleInputValueCheckHeight = (e) => {
    if (
      e.target.name === "height" &&
      (e.target.value < 48.26 || e.target.value > 216.408)
    ) {
      const message =
        "Height cannot be greater than 216.408 and less than 48.26";
      setVitalClinicalSupport({ ...vitalClinicalSupport, height: message });
    } else {
      setVitalClinicalSupport({ ...vitalClinicalSupport, height: "" });
    }
  };
  const handleInputValueCheckBodyWeight = (e) => {
    if (
      e.target.name === "bodyWeight" &&
      (e.target.value < 3 || e.target.value > 150)
    ) {
      const message =
        "Body weight must not be greater than 150 and less than 3";
      setVitalClinicalSupport({ ...vitalClinicalSupport, bodyWeight: message });
    } else {
      setVitalClinicalSupport({ ...vitalClinicalSupport, bodyWeight: "" });
    }
  };
  const handleInputValueCheckSystolic = (e) => {
    if (
      e.target.name === "systolic" &&
      (e.target.value < 90 || e.target.value > 240)
    ) {
      const message =
        "Blood Pressure systolic must not be greater than 240 and less than 90";
      setVitalClinicalSupport({ ...vitalClinicalSupport, systolic: message });
    } else {
      setVitalClinicalSupport({ ...vitalClinicalSupport, systolic: "" });
    }
  };
  const handleInputValueCheckDiastolic = (e) => {
    if (
      e.target.name === "diastolic" &&
      (e.target.value < 60 || e.target.value > 140)
    ) {
      const message =
        "Blood Pressure diastolic must not be greater than 140 and less than 60";
      setVitalClinicalSupport({ ...vitalClinicalSupport, diastolic: message });
    } else {
      setVitalClinicalSupport({ ...vitalClinicalSupport, diastolic: "" });
    }
  };
  const handleInputValueCheckPulse = (e) => {
    if (
      e.target.name === "pulse" &&
      (e.target.value < 40 || e.target.value > 120)
    ) {
      const message = "Pulse must not be greater than 120 and less than 40";
      setVitalClinicalSupport({ ...vitalClinicalSupport, pulse: message });
    } else {
      setVitalClinicalSupport({ ...vitalClinicalSupport, pulse: "" });
    }
  };
  const handleInputValueCheckRespiratoryRate = (e) => {
    if (
      e.target.name === "respiratoryRate" &&
      (e.target.value < 10 || e.target.value > 70)
    ) {
      const message =
        "Respiratory Rate must not be greater than 70 and less than 10";
      setVitalClinicalSupport({
        ...vitalClinicalSupport,
        respiratoryRate: message,
      });
    } else {
      setVitalClinicalSupport({ ...vitalClinicalSupport, respiratoryRate: "" });
    }
  };
  const handleInputValueCheckTemperature = (e) => {
    if (
      e.target.name === "temperature" &&
      (e.target.value < 35 || e.target.value > 47)
    ) {
      const message =
        "Temperature must not be greater than 47 and less than 35";
      setVitalClinicalSupport({
        ...vitalClinicalSupport,
        temperature: message,
      });
    } else {
      setVitalClinicalSupport({ ...vitalClinicalSupport, temperature: "" });
    }
  };
  const handleInputChangeRegimenLine = (e) => {
    const regimenId = e.target.value;
    setArvDrugObj({ ...arvDrugObj, [e.target.name]: e.target.value });
  };
  const handleInputChangeRegimen = (e) => {
    const regimenId = e.target.value;
    setArvDrugObj({ ...arvDrugObj, [e.target.name]: e.target.value });
    if (e.target.value !== "") {
      RegimenType(regimenId);
    }
  };
  function RegimenType(id) {
    async function getCharacters() {
      try {
        const response = await axios.get(`${baseUrl}hiv/regimen/types/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) {
          setRegimenTypeObj(response.data);
        }
      } catch (e) {}
    }
    getCharacters();
  }
  //Validations of the forms
  const validate = () => {
    objValues.visitDate === "" &&
      (temp.encounterDate = vital.encounterDate
        ? ""
        : "This field is required"); //objValues.visitDate
    temp.nextAppointment = objValues.nextAppointment
      ? ""
      : "This field is required";
    temp.whoStagingId = objValues.whoStagingId ? "" : "This field is required";
    //patientAge>=10  && (temp.pregnancyStatus = objValues.pregnancyStatus ? "" : "This field is required")
    {
      patientAge >= 10 &&
        patientObj.sex === "Female" &&
        (temp.pregnancyStatus = objValues.pregnancyStatus
          ? ""
          : "This field is required");
    }
    temp.functionalStatusId = objValues.functionalStatusId
      ? ""
      : "This field is required";
    //temp.levelOfAdherence = objValues.levelOfAdherence ? "" : "This field is required"
    //temp.labTestGroupId = vital.diastolic ? "" : "This field is required"
    //temp.systolic = vital.systolic ? "" : "This field is required"
    temp.height = vital.height ? "" : "This field is required";
    temp.bodyWeight = vital.bodyWeight ? "" : "This field is required";
    //TB VALIDATION
    temp.tbStatusId = tbObj.tbStatusId ? "" : "This field is required";
    // temp.antiTBDrug = tbObj.antiTBDrug ? "" : "This field is required"
    // tbObj.antiTBDrug && tbObj.antiTBDrug==='NO' && (temp.currentOnIpt = tbObj.currentOnIpt ? "" : "This field is required")
    // tbObj.currentOnIpt && tbObj.currentOnIpt==='NO' && (temp.fever = tbObj.fever ? "" : "This field is required")
    // tbObj.currentOnIpt && tbObj.currentOnIpt==='NO' && (temp.nightSweat = tbObj.nightSweat ? "" : "This field is required")
    // tbObj.currentOnIpt && tbObj.currentOnIpt==='NO' && (temp.lethergy = tbObj.lethergy ? "" : "This field is required")
    // tbObj.currentOnIpt && tbObj.currentOnIpt==='NO' && (temp.coughing = tbObj.coughing ? "" : "This field is required")
    // tbObj.currentOnIpt && tbObj.currentOnIpt==='NO' && (temp.contactWithTBCase = tbObj.contactWithTBCase ? "" : "This field is required")
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x == "");
  };
  const handleInputChangeObject = (e) => {
    setSelectedOption(e);
    tests.labTestGroupId = e.testGroupId;
    tests.labTestId = e.value;
  };
  //Validations of the Lab Viral Load
  const validateLabOrder = () => {
    temp.labTestGroupId = tests.labTestGroupId ? "" : "This field is required";
    temp.labTestId = tests.labTestId ? "" : "This field is required";
    tests.labTestId === "16" &&
      (temp.viralLoadIndication = tests.viralLoadIndication
        ? ""
        : "This field is required");
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x == "");
  };
  //Validations of the ARV DRUG Load
  const validateArvDrug = () => {
    temp.regimenLine = arvDrugObj.regimenLine ? "" : "This field is required";
    temp.regimenDrug = arvDrugObj.regimenDrug ? "" : "This field is required";
    temp.dosage = arvDrugObj.dosage ? "" : "This field is required";
    temp.regimenAdherance = arvDrugObj.regimenAdherance
      ? ""
      : "This field is required";
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x == "");
  };
  const addOrder = (e) => {
    if (validateLabOrder()) {
      tests.visitId = visitId;
      setTestOrderList([...testOrderList, tests]);
      setTests({
        comments: "",
        dateAssayed: "",
        labNumber: "",
        labTestGroupId: "",
        labTestId: "",
        dateResultReceived: "",
        patientId: props.patientObj ? props.patientObj.id : "",
        result: "",
        sampleCollectionDate: null,
        viralLoadIndication: 0,
        visitId: "",
      });
    }
  };
  /* Remove ADR  function **/
  const removeOrder = (index) => {
    testOrderList.splice(index, 1);
    setTestOrderList([...testOrderList]);
  };
  const addArvDrugOrder = (e) => {
    if (validateArvDrug()) {
      const actualRegimen =
        patientAge <= 17 ? childRegimenLine : adultRegimenLine; //determine the regimen to filter by age
      const regimenName = actualRegimen.find(
        (x) => x.id === parseInt(arvDrugObj.regimenLine)
      );
      arvDrugObj.regimenLineName = regimenName.description;
      const regimenType = regimenTypeObj.find(
        (x) => x.id === parseInt(arvDrugObj.regimenDrug)
      );
      arvDrugObj.regimenDrugName = regimenType.description;
      setarvDrugOrderList([...arvDrugOrderList, arvDrugObj]);
      setArvDrugObj({
        regimenLine: "",
        regimenDrug: "",
        regimenLineName: "",
        regimenDrugName: "",
        dosage: "",
        regimenAdherance: "",
      });
    }
  };
  /* Remove ADR  function **/
  const removeArvDrugOrder = (index) => {
    arvDrugOrderList.splice(index, 1);
    setarvDrugOrderList([...arvDrugOrderList]);
  };
  const handleSelectedTestGroup = (e) => {
    setTests({ ...tests, labTestGroupId: e.target.value });
    const getTestList = testGroup.filter(
      (x) => x.id === parseInt(e.target.value)
    );
    setTest(getTestList[0].labTests);
    // if(e.target.value==='4'){
    //     setVlRequired(true)
    // }else{
    //     setVlRequired(false)
    // }
  };
  const handleInputChangeTest = (e) => {
    setErrors({ ...temp, [e.target.name]: "" }); //reset the error message to empty once the field as value
    setTests({ ...tests, [e.target.name]: e.target.value });
  };

  /**** Submit Button Processing  */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      setSaving(true);
      objValues.visitDate =
        vital && vital.encounterDate
          ? vital.encounterDate
          : objValues.visitDate;
      vital["captureDate"] =
        vital && vital.encounterDate
          ? vital.encounterDate
          : objValues.visitDate;
      if (vital && !vital.encounterDate) {
        vital["encounterDate"] =
          vital && vital.encounterDate
            ? vital.encounterDate
            : objValues.visitDate;
      }

      objValues.adverseDrugReactions = adrList;
      objValues.artStatusId = getPatientObj.artCommence.id;
      objValues.hivEnrollmentId = getPatientObj.enrollment.id;
      objValues.opportunisticInfections = infectionList;
      objValues.tbScreen = tbObj;
      objValues.tbStatus = tbObj.tbStatusId;
      objValues.viralLoadOrder = testOrderList;
      objValues.arvdrugsRegimen = arvDrugOrderList;
      objValues["vitalSignDto"] = vital;

      axios
        .put(`${baseUrl}hiv/art/clinic-visit/${objValues.id}`, objValues, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setSaving(false);
          props.ClinicVisitListHistory();
          toast.success("Clinic Visit(Care card) updated successful", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          GetVisitById(objValues.id);
          props.setActiveContent({
            ...props.activeContent,
            route: "recent-history",
            activeTab: "history",
          });
        })
        .catch((error) => {
          setSaving(false);
          if (error.response && error.response.data) {
            let errorMessage =
              error.response.data.apierror &&
              error.response.data.apierror.message !== ""
                ? error.response.data.apierror.message
                : "Something went wrong, please try again";
            if (
              error.response.data.apierror &&
              error.response.data.apierror.message !== "" &&
              error.response.data.apierror &&
              error.response.data.apierror.subErrors[0].message !== ""
            ) {
              toast.error(
                error.response.data.apierror.message +
                  " : " +
                  error.response.data.apierror.subErrors[0].field +
                  " " +
                  error.response.data.apierror.subErrors[0].message,
                { position: toast.POSITION.BOTTOM_CENTER }
              );
            } else {
              toast.error(errorMessage, {
                position: toast.POSITION.BOTTOM_CENTER,
              });
            }
          }
        });
    } else {
      toast.error("All field are required", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };
  const getVisitDetail = (e) => {
    if (e.id) {
      setEnableUpdateButton(true);
      setVisitId(e.id);
      GetVisitById(e.id);
    }
  };
  const EnableUpdateAction = () => {
    setEnableUpdate(true);
  };
  //Get visit by ID
  function GetVisitById(visitID) {
    if (visitID !== "") {
      axios
        .get(`${baseUrl}hiv/art/clinic-visit/${visitID}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const e = response.data;
          setObjValues(e);
          setVitalSignDto({ ...vital, ...e.vitalSignDto });
          objValues.clinicalNote = e.clinicalNote;
          objValues.functionalStatusId = e.functionalStatusId;
          objValues.whoStagingId = e.whoStagingId;
          objValues.nextAppointment = e.nextAppointment;
          vital.captureDate = e.visitDate;
          objValues.visitDate = e.visitDate;
          //setObjValues(e)
          const objTB = e.tbScreen !== null ? e.tbScreen : tbObj;
          setTbObj({ ...objTB });
          const adrListObj =
            e.adverseDrugReactions !== null ? e.adverseDrugReactions : adrList;
          setAdrList([...adrListObj]);
          const inffectionObj =
            e.opportunisticInfections !== null
              ? e.opportunisticInfections
              : infectionList;
          setInfectionList([...inffectionObj]);
          const viralObj =
            e.viralLoadOrder !== null ? e.viralLoadOrder : testOrderList;
          setTestOrderList(viralObj);
          const arvObj =
            e.arvdrugsRegimen !== null ? e.arvdrugsRegimen : arvDrugOrderList;
          setarvDrugOrderList([...arvObj]);
          tbObj.tbStatusId =
            objValues.tbStatus !== null && objValues.tbStatus !== ""
              ? objValues.tbStatus
              : "";
        })
        .catch((error) => {});
    }
  }
  function BmiCal(bmi) {
    if (bmi < 18.5) {
      return <Message size="mini" color="brown" content="Underweight" />;
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      <Message size="mini" color="olive" content="Well nourished" />;
    } else if (bmi > 25) {
      <Message size="mini" color="blue" content="Overweight/Obese" />;
    }
  }

  return (
    <div className={classes.root}>
      <div className="row">
        <div className="col-xl-3 col-xxl-3 col-lg-3">
          <div className="card" style={{ height: "500px" }}>
            <div
              className="card-header  border-0 pb-2"
              style={{ backgroundColor: "#014D88" }}
            >
              <h4 className="card-title" style={{ color: "#fff" }}>
                {" "}
                Clinic Visits
              </h4>
            </div>
            <div className="card-body">
              <PerfectScrollbar
                style={{ height: "370px" }}
                id="DZ_W_Todo1"
                className="widget-media dz-scroll ps ps--active-y"
              >
                {props.clinicVisitList.map((visit, index) => (
                  <div
                    className="media pb-3 border-bottom mb-0 align-items-center"
                    key={index}
                  >
                    <div className="media-body">
                      <ButtonSMUI
                        color="black"
                        content="Visit Date"
                        //icon='calendar alternate'
                        size="mini"
                        onClick={() => getVisitDetail(visit)}
                        label={{
                          basic: true,
                          color: "grey",
                          pointing: "left",
                          content: `${visit.visitDate}`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </PerfectScrollbar>
            </div>
          </div>
        </div>

        <div className="col-xl-9 col-xxl-9 col-lg-9">
          <div className="card">
            <div
              className="card-header  border-0 pb-2"
              style={{ backgroundColor: "#014D88" }}
            >
              <h4 className="card-title" style={{ color: "#fff" }}>
                {" "}
              </h4>
              {enableUpdateButton && (
                <ButtonSMUI
                  color="facebook"
                  onClick={() => EnableUpdateAction()}
                >
                  <Icon name="edit" /> Edit Visit
                </ButtonSMUI>
              )}
            </div>
            <div className="card-body">
              <Grid columns="equal">
                <Grid.Column className={classes.root}>
                  <Segment>
                    <Label
                      as="a"
                      color="black"
                      style={{ width: "106%", height: "35px" }}
                      ribbon
                    >
                      <h4 style={{ color: "#fff" }}>
                        {" "}
                        Visit Date -{" "}
                        {vital.encounterDate && vital.encounterDate !== ""
                          ? vital.encounterDate
                          : objValues.visitDate}
                      </h4>
                    </Label>
                    <div className="row">
                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <FormLabelName>
                            Date of Visit{" "}
                            <span style={{ color: "red" }}> *</span>
                          </FormLabelName>
                          <Input
                            type="date"
                            name="encounterDate"
                            id="encounterDate"
                            value={
                              vital.encounterDate && vital.encounterDate !== ""
                                ? vital.encounterDate
                                : objValues.visitDate
                            }
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.25rem",
                            }}
                            onChange={handleInputChangeVitalSignDto}
                            max={moment(new Date()).format("YYYY-MM-DD")}
                            disabled={!enableUpdate}
                            required
                          />
                          {errors.encounterDate !== "" ? (
                            <span className={classes.error}>
                              {errors.encounterDate}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                      <div className="form-group mb-3 col-md-6"></div>
                      <div className="row">
                        <div className=" mb-3 col-md-4">
                          <FormGroup>
                            <FormLabelName>Pulse</FormLabelName>
                            <InputGroup>
                              <Input
                                type="number"
                                name="pulse"
                                id="pulse"
                                onChange={handleInputChangeVitalSignDto}
                                min="40"
                                max="120"
                                value={vital.pulse}
                                onKeyUp={handleInputValueCheckPulse}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0rem",
                                }}
                                disabled={!enableUpdate}
                              />
                              <InputGroupText
                                addonType="append"
                                style={{
                                  backgroundColor: "#014D88",
                                  color: "#fff",
                                  border: "1px solid #014D88",
                                  borderRadius: "0rem",
                                }}
                              >
                                bmp
                              </InputGroupText>
                            </InputGroup>
                            {vitalClinicalSupport.pulse !== "" ? (
                              <span className={classes.error}>
                                {vitalClinicalSupport.pulse}
                              </span>
                            ) : (
                              ""
                            )}
                            {errors.pulse !== "" ? (
                              <span className={classes.error}>
                                {errors.pulse}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>
                        <div className=" mb-3 col-md-4">
                          <FormGroup>
                            <FormLabelName>Respiratory Rate </FormLabelName>
                            <InputGroup>
                              <Input
                                type="number"
                                name="respiratoryRate"
                                id="respiratoryRate"
                                onChange={handleInputChangeVitalSignDto}
                                min="10"
                                max="70"
                                value={vital.respiratoryRate}
                                onKeyUp={handleInputValueCheckRespiratoryRate}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0rem",
                                }}
                                disabled={!enableUpdate}
                              />
                              <InputGroupText
                                addonType="append"
                                style={{
                                  backgroundColor: "#014D88",
                                  color: "#fff",
                                  border: "1px solid #014D88",
                                  borderRadius: "0rem",
                                }}
                              >
                                bmp
                              </InputGroupText>
                            </InputGroup>
                            {vitalClinicalSupport.respiratoryRate !== "" ? (
                              <span className={classes.error}>
                                {vitalClinicalSupport.respiratoryRate}
                              </span>
                            ) : (
                              ""
                            )}
                            {errors.respiratoryRate !== "" ? (
                              <span className={classes.error}>
                                {errors.respiratoryRate}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>
                        <div className=" mb-3 col-md-4">
                          <FormGroup>
                            <FormLabelName>Temperature </FormLabelName>
                            <InputGroup>
                              <Input
                                type="number"
                                name="temperature"
                                id="temperature"
                                onChange={handleInputChangeVitalSignDto}
                                min="35"
                                max="47"
                                value={vital.temperature}
                                onKeyUp={handleInputValueCheckTemperature}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0rem",
                                }}
                                disabled={!enableUpdate}
                              />
                              <InputGroupText
                                addonType="append"
                                style={{
                                  backgroundColor: "#014D88",
                                  color: "#fff",
                                  border: "1px solid #014D88",
                                  borderRadius: "0rem",
                                }}
                              >
                                <sup>o</sup>c
                              </InputGroupText>
                            </InputGroup>
                            {vitalClinicalSupport.temperature !== "" ? (
                              <span className={classes.error}>
                                {vitalClinicalSupport.temperature}
                              </span>
                            ) : (
                              ""
                            )}
                            {errors.temperature !== "" ? (
                              <span className={classes.error}>
                                {errors.temperature}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>
                        <div className=" mb-3 col-md-5">
                          <FormGroup>
                            <FormLabelName>
                              Body Weight{" "}
                              <span style={{ color: "red" }}> *</span>
                            </FormLabelName>
                            <InputGroup>
                              <Input
                                type="number"
                                name="bodyWeight"
                                id="bodyWeight"
                                onChange={handleInputChangeVitalSignDto}
                                min="3"
                                max="150"
                                value={vital.bodyWeight}
                                onKeyUp={handleInputValueCheckBodyWeight}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0rem",
                                }}
                                disabled={!enableUpdate}
                              />
                              <InputGroupText
                                addonType="append"
                                style={{
                                  backgroundColor: "#014D88",
                                  color: "#fff",
                                  border: "1px solid #014D88",
                                  borderRadius: "0rem",
                                }}
                              >
                                kg
                              </InputGroupText>
                            </InputGroup>
                            {vitalClinicalSupport.bodyWeight !== "" ? (
                              <span className={classes.error}>
                                {vitalClinicalSupport.bodyWeight}
                              </span>
                            ) : (
                              ""
                            )}
                            {errors.bodyWeight !== "" ? (
                              <span className={classes.error}>
                                {errors.bodyWeight}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-5">
                          <FormGroup>
                            <FormLabelName>
                              Height <span style={{ color: "red" }}> *</span>
                            </FormLabelName>
                            <InputGroup>
                              <InputGroupText
                                addonType="append"
                                isOpen={dropdownOpen}
                                toggle={toggleDropDown}
                                style={{
                                  backgroundColor: "#014D88",
                                  color: "#fff",
                                  border: "1px solid #014D88",
                                  borderRadius: "0rem",
                                }}
                              >
                                cm
                              </InputGroupText>
                              <Input
                                type="number"
                                name="height"
                                id="height"
                                onChange={handleInputChangeVitalSignDto}
                                value={vital.height}
                                min="48.26"
                                max="216.408"
                                onKeyUp={handleInputValueCheckHeight}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0rem",
                                }}
                                disabled={!enableUpdate}
                              />
                              <InputGroupText
                                addonType="append"
                                isOpen={dropdownOpen}
                                toggle={toggleDropDown}
                                style={{
                                  backgroundColor: "#992E62",
                                  color: "#fff",
                                  border: "1px solid #992E62",
                                  borderRadius: "0rem",
                                }}
                              >
                                {vital.height !== ""
                                  ? (vital.height / 100).toFixed(2) + "m"
                                  : "m"}
                              </InputGroupText>
                            </InputGroup>
                            {vitalClinicalSupport.height !== "" ? (
                              <span className={classes.error}>
                                {vitalClinicalSupport.height}
                              </span>
                            ) : (
                              ""
                            )}
                            {errors.height !== "" ? (
                              <span className={classes.error}>
                                {errors.height}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>
                        <div className="form-group mb-3 mt-2 col-md-2">
                          {vital.bodyWeight !== "" && vital.height !== "" && (
                            <FormGroup>
                              <Label> </Label>
                              <InputGroup>
                                <InputGroupText
                                  addonType="append"
                                  style={{
                                    backgroundColor: "#014D88",
                                    color: "#fff",
                                    border: "1px solid #014D88",
                                    borderRadius: "0rem",
                                  }}
                                >
                                  BMI :{" "}
                                  {(
                                    vital.bodyWeight /
                                    ((vital.height / 100) *
                                      (vital.height / 100))
                                  ).toFixed(2)}
                                </InputGroupText>
                              </InputGroup>
                            </FormGroup>
                          )}
                        </div>
                        <div className="form-group mb-3 mt-2 col-md-12">
                          {BmiCal(
                            (
                              vital.bodyWeight /
                              ((vital.height / 100) * (vital.height / 100))
                            ).toFixed(2)
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="form-group mb-3 col-md-12">
                          <FormGroup>
                            <FormLabelName>Blood Pressure </FormLabelName>
                            <InputGroup>
                              <InputGroupText
                                addonType="append"
                                style={{
                                  backgroundColor: "#014D88",
                                  color: "#fff",
                                  border: "1px solid #014D88",
                                  borderRadius: "0rem",
                                }}
                              >
                                systolic(mmHg)
                              </InputGroupText>
                              <Input
                                type="number"
                                name="systolic"
                                id="systolic"
                                min="90"
                                max="240"
                                onChange={handleInputChangeVitalSignDto}
                                value={vital.systolic}
                                onKeyUp={handleInputValueCheckSystolic}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0rem",
                                }}
                                disabled={!enableUpdate}
                              />
                              <InputGroupText
                                addonType="append"
                                style={{
                                  backgroundColor: "#014D88",
                                  color: "#fff",
                                  border: "1px solid #014D88",
                                  borderRadius: "0rem",
                                }}
                              >
                                diastolic(mmHg)
                              </InputGroupText>
                              <Input
                                type="number"
                                name="diastolic"
                                id="diastolic"
                                min={0}
                                max={140}
                                onChange={handleInputChangeVitalSignDto}
                                value={vital.diastolic}
                                onKeyUp={handleInputValueCheckDiastolic}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0rem",
                                }}
                              />
                            </InputGroup>
                            {vitalClinicalSupport.systolic !== "" ? (
                              <span className={classes.error}>
                                {vitalClinicalSupport.systolic}
                              </span>
                            ) : (
                              ""
                            )}
                            {errors.systolic !== "" ? (
                              <span className={classes.error}>
                                {errors.systolic}
                              </span>
                            ) : (
                              ""
                            )}
                            {vitalClinicalSupport.diastolic !== "" ? (
                              <span className={classes.error}>
                                {vitalClinicalSupport.diastolic}
                              </span>
                            ) : (
                              ""
                            )}
                            {errors.diastolic !== "" ? (
                              <span className={classes.error}>
                                {errors.diastolic}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>
                      </div>
                    </div>
                    {patientAge && patientAge < 14 && (
                      <div className="row">
                        <div className=" mb-3 col-md-4">
                          <FormGroup>
                            <FormLabelName>Head Circumference </FormLabelName>
                            <InputGroup>
                              <Input
                                type="text"
                                name="headCircumference"
                                id="headCircumference"
                                onChange={handleInputChangeVitalSignDto}
                                min="35"
                                max="47"
                                value={vital.headCircumference}
                                onKeyUp={handleInputValueCheckTemperature}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0rem",
                                }}
                                disabled={!enableUpdate}
                              />
                              <InputGroupText
                                addonType="append"
                                style={{
                                  backgroundColor: "#014D88",
                                  color: "#fff",
                                  border: "1px solid #014D88",
                                  borderRadius: "0rem",
                                }}
                              >
                                cm
                              </InputGroupText>
                            </InputGroup>
                          </FormGroup>
                        </div>
                        <div className=" mb-3 col-md-4">
                          <FormGroup>
                            <FormLabelName>Surface Area </FormLabelName>
                            <InputGroup>
                              <Input
                                type="text"
                                name="surfaceArea"
                                id="surfaceArea"
                                onChange={handleInputChangeVitalSignDto}
                                value={vital.surfaceArea}
                                onKeyUp={handleInputValueCheckTemperature}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0rem",
                                }}
                                disabled={!enableUpdate}
                              />
                              <InputGroupText
                                addonType="append"
                                style={{
                                  backgroundColor: "#014D88",
                                  color: "#fff",
                                  border: "1px solid #014D88",
                                  borderRadius: "0rem",
                                }}
                              >
                                cm<sup>3</sup>
                              </InputGroupText>
                            </InputGroup>
                          </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <FormLabelName>MUAC</FormLabelName>
                            <InputGroup>
                              <Input
                                type="select"
                                name="muac"
                                id="muac"
                                onChange={handleInputChangeVitalSignDto}
                                value={vital.muac}
                                disabled={!enableUpdate}
                              >
                                <option value="">Select</option>
                                <option value="Normal">Normal</option>
                                <option value="Under">Under</option>
                                <option value="Over">Over</option>
                              </Input>
                              <InputGroupText
                                addonType="append"
                                style={{
                                  backgroundColor: "#014D88",
                                  color: "#fff",
                                  border: "1px solid #014D88",
                                  borderRadius: "0rem",
                                }}
                              >
                                cm
                              </InputGroupText>
                            </InputGroup>
                          </FormGroup>
                        </div>
                      </div>
                    )}

                    <Label
                      as="a"
                      color="grey"
                      style={{ width: "106%", height: "35px" }}
                      ribbon
                    >
                      <h4 style={{ color: "#fff" }}>CONSULTATION</h4>
                    </Label>
                    <br />
                    <br />

                    <div className=" mb-3">
                      <FormLabelName>Clinical Notes</FormLabelName>
                      <textarea
                        name="clinicalNote"
                        className="form-control"
                        value={objValues.clinicalNote}
                        onChange={handleInputChange}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                        disabled={!enableUpdate}
                      ></textarea>
                      {errors.clinicalNote !== "" ? (
                        <span className={classes.error}>
                          {errors.clinicalNote}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="row">
                      <div className=" mb-3 col-md-6">
                        <FormGroup>
                          <FormLabelName>
                            WHO Staging <span style={{ color: "red" }}> *</span>
                          </FormLabelName>
                          <Input
                            type="select"
                            name="whoStagingId"
                            id="whoStagingId"
                            value={
                              objValues.clinicalStageId !== null
                                ? objValues.clinicalStageId
                                : objValues.whoStagingId
                            }
                            onChange={handleInputChange}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.25rem",
                            }}
                            disabled={!enableUpdate}
                          >
                            <option value="select">Select </option>

                            {clinicalStage.map((value) => (
                              <option key={value.id} value={value.id}>
                                {value.display}
                              </option>
                            ))}
                          </Input>
                          {errors.whoStagingId !== "" ? (
                            <span className={classes.error}>
                              {errors.whoStagingId}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                      <div className=" mb-3 col-md-6">
                        <FormGroup>
                          <FormLabelName>
                            Functional Status{" "}
                            <span style={{ color: "red" }}> *</span>
                          </FormLabelName>
                          <Input
                            type="select"
                            name="functionalStatusId"
                            id="functionalStatusId"
                            value={objValues.functionalStatusId}
                            onChange={handleInputChange}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.25rem",
                            }}
                            disabled={!enableUpdate}
                          >
                            <option value="select">Select </option>

                            {functionalStatus.map((value) => (
                              <option key={value.id} value={value.id}>
                                {value.display}
                              </option>
                            ))}
                          </Input>
                          {errors.functionalStatusId !== "" ? (
                            <span className={classes.error}>
                              {errors.functionalStatusId}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>

                      <div className=" mb-3 col-md-6">
                        <FormGroup>
                          <FormLabelName>Level of Adherence </FormLabelName>
                          <Input
                            type="select"
                            name="levelOfAdherence"
                            id="levelOfAdherence"
                            value={objValues.levelOfAdherence}
                            onChange={handleInputChange}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.25rem",
                            }}
                            disabled={!enableUpdate}
                          >
                            <option value="select">Select </option>

                            {adherenceLevel.map((value) => (
                              <option key={value.id} value={value.id}>
                                {value.display}
                              </option>
                            ))}
                          </Input>
                          {errors.levelOfAdherence !== "" ? (
                            <span className={classes.error}>
                              {errors.levelOfAdherence}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                      <div className=" mb-3 col-md-6">
                        <FormGroup>
                          <FormLabelName>
                            Cryptococcal Screening Status
                          </FormLabelName>
                          <Input
                            type="select"
                            name="cryptococcalScreeningStatus"
                            id="cryptococcalScreeningStatus"
                            value={objValues.cryptococcalScreeningStatus}
                            onChange={handleInputChange}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.25rem",
                            }}
                            disabled={!enableUpdate}
                          >
                            <option value="select">Select </option>

                            {cryptococcal.map((value) => (
                              <option key={value.code} value={value.code}>
                                {value.display}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </div>
                      {/* <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                    <FormLabelName >TB Status </FormLabelName>
                    <Input
                        type="select"
                        name="tbStatus"
                        id="tbStatus"
                        value={objValues.tbStatus}
                        onChange={handleInputChange}
                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                        disabled={!enableUpdate}
                        >
                        <option value=""> Select</option>
                            {tbStatus.map((value) => (
                                <option key={value.id} value={value.id}>
                                    {value.display}
                                </option>
                            ))}

                    </Input>
                    {errors.tbStatus !=="" ? (
                        <span className={classes.error}>{errors.tbStatus}</span>
                        ) : "" }
                    </FormGroup>
                </div> */}
                      {patientAge >= 10 &&
                        (patientObj.sex === "Female" ||
                          patientObj.sex === "FEMALE" ||
                          patientObj.sex === "female") && (
                          <>
                            <div className=" mb-3 col-md-6">
                              <FormGroup>
                                <FormLabelName>
                                  Cervical Cancer Screening Status
                                </FormLabelName>
                                <Input
                                  type="select"
                                  name="cervicalCancerScreeningStatus"
                                  id="cervicalCancerScreeningStatus"
                                  value={
                                    objValues.cervicalCancerScreeningStatus
                                  }
                                  onChange={handleInputChange}
                                  style={{
                                    border: "1px solid #014D88",
                                    borderRadius: "0.25rem",
                                  }}
                                  disabled={!enableUpdate}
                                >
                                  <option value="select">Select </option>

                                  {cervicalStatus.map((value) => (
                                    <option key={value.code} value={value.code}>
                                      {value.display}
                                    </option>
                                  ))}
                                </Input>
                              </FormGroup>
                            </div>
                            <div className=" mb-3 col-md-6">
                              <FormGroup>
                                <FormLabelName>
                                  Cervical Cancer Treatment Provided
                                </FormLabelName>
                                <Input
                                  type="select"
                                  name="cervicalCancerTreatmentProvided"
                                  id="cervicalCancerTreatmentProvided"
                                  value={
                                    objValues.cervicalCancerTreatmentProvided
                                  }
                                  onChange={handleInputChange}
                                  style={{
                                    border: "1px solid #014D88",
                                    borderRadius: "0.25rem",
                                  }}
                                  disabled={!enableUpdate}
                                >
                                  <option value="select">Select </option>

                                  {cervicalTreatment.map((value) => (
                                    <option key={value.code} value={value.code}>
                                      {value.display}
                                    </option>
                                  ))}
                                </Input>
                              </FormGroup>
                            </div>
                            <div className=" mb-3 col-md-6">
                              <FormGroup>
                                <FormLabelName>
                                  Pregnancy Status{" "}
                                  <span style={{ color: "red" }}> *</span>
                                </FormLabelName>
                                <Input
                                  type="select"
                                  name="pregnancyStatus"
                                  id="pregnancyStatus"
                                  value={objValues.pregnancyStatus}
                                  onChange={handleInputChange}
                                  style={{
                                    border: "1px solid #014D88",
                                    borderRadius: "0.25rem",
                                  }}
                                  disabled={!enableUpdate}
                                >
                                  <option value="select">Select </option>

                                  {pregnancyStatus.map((value) => (
                                    <option
                                      key={value.code}
                                      value={value.display}
                                    >
                                      {value.display}
                                    </option>
                                  ))}
                                </Input>
                                {errors.pregnancyStatus !== "" ? (
                                  <span className={classes.error}>
                                    {errors.pregnancyStatus}
                                  </span>
                                ) : (
                                  ""
                                )}
                              </FormGroup>
                            </div>
                          </>
                        )}
                      <div className=" mb-3 col-md-6">
                        <FormGroup>
                          <FormLabelName>
                            Hepatitis Screening Result
                          </FormLabelName>
                          <Input
                            type="select"
                            name="hepatitisScreeningResult"
                            id="hepatitisScreeningResult"
                            value={objValues.hepatitisScreeningResult}
                            onChange={handleInputChange}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.25rem",
                            }}
                            disabled={!enableUpdate}
                          >
                            <option value="select">Select </option>

                            {hepatitis.map((value) => (
                              <option key={value.code} value={value.code}>
                                {value.display}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </div>
                      {/* This section is if the patient is Female */}

                      <div className=" mb-3 col-md-6">
                        <FormGroup>
                          <FormLabelName>Family Planing ?</FormLabelName>
                          <Input
                            type="select"
                            name="familyPlaning"
                            id="familyPlaning"
                            value={objValues.familyPlaning}
                            onChange={handleInputChange}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.25rem",
                            }}
                            disabled={!enableUpdate}
                          >
                            <option value="select">Select </option>
                            <option value="Yes">Yes </option>
                            <option value="No">No </option>
                          </Input>
                        </FormGroup>
                      </div>
                      {objValues.familyPlaning === "Yes" && (
                        <div className=" mb-3 col-md-6">
                          <FormGroup>
                            <FormLabelName>On Family Planing </FormLabelName>
                            <Input
                              type="select"
                              name="onFamilyPlaning"
                              id="onFamilyPlaning"
                              value={objValues.onFamilyPlaning}
                              onChange={handleInputChange}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.25rem",
                              }}
                              disabled={!enableUpdate}
                            >
                              <option value="select">Select </option>

                              {familyPlaining.map((value) => (
                                <option key={value.code} value={value.code}>
                                  {value.display}
                                </option>
                              ))}
                            </Input>
                          </FormGroup>
                        </div>
                      )}
                    </div>
                    <br />
                    <Label
                      as="a"
                      color="red"
                      style={{ width: "106%", height: "35px" }}
                      ribbon
                    >
                      <h4 style={{ color: "#fff" }}>OPPORTUNISTIC INFECTION</h4>
                    </Label>
                    <br />
                    <br />
                    <OpportunisticInfection
                      setInfection={setInfection}
                      infection={infection}
                      setInfectionList={setInfectionList}
                      infectionList={infectionList}
                      enableUpdate={enableUpdate}
                      encounterDate={vital.encounterDate}
                    />
                    <br />
                    <Label
                      as="a"
                      color="pink"
                      style={{ width: "106%", height: "35px" }}
                      ribbon
                    >
                      <h4 style={{ color: "#fff" }}>ADR</h4>
                    </Label>
                    <br />
                    <br />
                    <ADR
                      setAdrObj={setAdrObj}
                      adrObj={adrObj}
                      setAdrList={setAdrList}
                      adrList={adrList}
                      enableUpdate={enableUpdate}
                      encounterDate={vital.encounterDate}
                    />
                    <br />

                    <Label
                      as="a"
                      color="blue"
                      style={{ width: "106%", height: "35px" }}
                      ribbon
                    >
                      TB Screening
                    </Label>
                    <br />
                    {/* TB Screening Form */}
                    <TBScreening
                      tbObj={tbObj}
                      setTbObj={setTbObj}
                      errors={errors}
                      setErrors={setErrors}
                    />

                    <br />
                    <Label
                      as="a"
                      color="teal"
                      style={{ width: "106%", height: "35px" }}
                      ribbon
                    >
                      <h4 style={{ color: "#fff" }}>ARV DRUGS Regimen</h4>
                    </Label>

                    <br />
                    <br />
                    {/* ARV DRUGS Regimen */}
                    <div className="row">
                      <div className=" mb-3 col-md-6">
                        <FormGroup>
                          <FormLabelName>Regimen Line </FormLabelName>
                          <Input
                            type="select"
                            name="regimenLine"
                            id="regimenLine"
                            value={arvDrugObj.regimenLine}
                            onChange={handleInputChangeRegimen}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.25rem",
                            }}
                            disabled={!enableUpdate}
                          >
                            <option value="select">Select </option>
                            {patientAge > 17 && (
                              <>
                                {adultRegimenLine.map((value) => (
                                  <option key={value.id} value={value.id}>
                                    {value.description}
                                  </option>
                                ))}
                              </>
                            )}
                            {patientAge <= 17 && (
                              <>
                                {childRegimenLine.map((value) => (
                                  <option key={value.id} value={value.id}>
                                    {value.description}
                                  </option>
                                ))}
                              </>
                            )}
                          </Input>
                          {errors.regimenLine !== "" ? (
                            <span className={classes.error}>
                              {errors.regimenLine}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                      <div className=" mb-3 col-md-6">
                        <FormGroup>
                          <FormLabelName>Regimen </FormLabelName>
                          <Input
                            type="select"
                            name="regimenDrug"
                            id="regimenDrug"
                            value={arvDrugObj.regimenDrug}
                            onChange={handleInputChangeRegimenLine}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.25rem",
                            }}
                            disabled={!enableUpdate}
                          >
                            <option value="select">Select </option>

                            {regimenTypeObj.map((value) => (
                              <option key={value.id} value={value.id}>
                                {value.description}
                              </option>
                            ))}
                          </Input>
                          {errors.regimenDrug !== "" ? (
                            <span className={classes.error}>
                              {errors.regimenDrug}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                      <div className=" mb-3 col-md-4">
                        <FormGroup>
                          <FormLabelName>Dosage </FormLabelName>
                          <Input
                            type="text"
                            name="dosage"
                            id="dosage"
                            value={arvDrugObj.dosage}
                            onChange={handleInputChangeRegimenLine}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.25rem",
                            }}
                            disabled={!enableUpdate}
                          />
                          {errors.dosage !== "" ? (
                            <span className={classes.error}>
                              {errors.dosage}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                      <div className=" mb-3 col-md-6">
                        <FormGroup>
                          <FormLabelName>Adherence </FormLabelName>
                          <Input
                            type="select"
                            name="regimenAdherance"
                            id="regimenAdherance"
                            value={arvDrugObj.regimenAdherance}
                            onChange={handleInputChangeRegimenLine}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.25rem",
                            }}
                            disabled={!enableUpdate}
                          >
                            <option value="select">Select </option>

                            {adherenceLevel.map((value) => (
                              <option key={value.id} value={value.id}>
                                {value.display}
                              </option>
                            ))}
                            <option value="None">None </option>
                          </Input>
                          {errors.regimenAdherance !== "" ? (
                            <span className={classes.error}>
                              {errors.regimenAdherance}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                      <div className="col-md-2 float-end">
                        <LabelSui
                          as="a"
                          color="black"
                          size="tiny"
                          onClick={addArvDrugOrder}
                          style={{ marginTop: 35 }}
                        >
                          <Icon name="plus" /> Add
                        </LabelSui>
                      </div>
                      <div className="row"></div>
                      {arvDrugOrderList.length > 0 ? (
                        <List>
                          <Table striped responsive>
                            <thead>
                              <tr>
                                <th>Regimen Line</th>
                                <th>Regimen</th>
                                <th>Dosage</th>
                                <th>Adherence</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {arvDrugOrderList.map((regimenObject, index) => (
                                <ArvDrugOrderObjList
                                  key={index}
                                  index={index}
                                  regimenObject={regimenObject}
                                  adherenceLevel={adherenceLevel}
                                  removeArvDrugOrder={removeArvDrugOrder}
                                />
                              ))}
                            </tbody>
                          </Table>
                          <br />
                          <br />
                        </List>
                      ) : (
                        ""
                      )}
                    </div>
                    {/* END ARV DRUGS Regimen */}
                    <br />
                    <Label
                      as="a"
                      color="teal"
                      style={{ width: "106%", height: "35px" }}
                      ribbon
                    >
                      <h4 style={{ color: "#fff" }}>Lab & Viral Load Order</h4>
                    </Label>
                    <br />
                    <br />
                    {/* Viral Load  Form */}
                    <div className="row">
                      {/* <div  className=" col-md-4">
                            <FormGroup>
                                  <FormLabelName for="testGroup">Select Test Group</FormLabelName>

                                    <Input
                                        type="select"
                                        name="labTestGroupId"
                                        id="labTestGroupId"
                                        value={tests.labTestGroupId}
                                        onChange={handleSelectedTestGroup} 
                                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}                  
                                        >
                                        <option value="">Select </option>
                                                        
                                            {testGroup.map((value) => (
                                                <option key={value.id} value={value.id}>
                                                    {value.groupName}
                                                </option>
                                            ))}
                                    </Input>
                                    {errors.labTestGroupId !=="" ? (
                                            <span className={classes.error}>{errors.labTestGroupId}</span>
                                        ) : "" }      
                              </FormGroup>
                          </div> */}
                      <div className="form-group mb-3 col-md-5">
                        <FormGroup>
                          <FormLabelName for="testGroup">
                            Select Test
                          </FormLabelName>

                          <Select
                            //value={selectedOption}
                            onChange={handleInputChangeObject}
                            options={labTestOptions}
                            menuPortalTarget={document.body}
                            menuPosition={"fixed"}
                          />
                          {errors.labTestId !== "" ? (
                            <span className={classes.error}>
                              {errors.labTestId}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                      {(tests.labTestId === "16" || tests.labTestId === 16) && (
                        <div className="form-group mb-3 col-md-5">
                          <FormGroup>
                            <FormLabelName for="vlIndication">
                              VL Indication
                            </FormLabelName>
                            <Input
                              type="select"
                              name="viralLoadIndication"
                              id="viralLoadIndication"
                              value={tests.viralLoadIndication}
                              onChange={handleInputChangeTest}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.25rem",
                              }}
                              disabled={!enableUpdate}
                            >
                              <option value="">Select </option>

                              {vLIndication.map((value) => (
                                <option key={value.id} value={value.id}>
                                  {value.display}
                                </option>
                              ))}
                            </Input>
                            {errors.viralLoadIndication !== "" ? (
                              <span className={classes.error}>
                                {errors.viralLoadIndication}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>
                      )}
                      <div className="form-group mb-3 col-md-2">
                        <LabelSui
                          as="a"
                          color="black"
                          size="tiny"
                          onClick={addOrder}
                          style={{ marginTop: 35 }}
                        >
                          <Icon name="plus" /> Add
                        </LabelSui>
                      </div>
                      {testOrderList.length > 0 ? (
                        <List>
                          <Table striped responsive>
                            <thead>
                              <tr>
                                <th>Test Group</th>
                                <th>Test</th>
                                <th>VL Indication</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {testOrderList.map((tests, index) => (
                                <TestOrdersList
                                  key={index}
                                  index={index}
                                  order={tests}
                                  testGroupObj={testGroup}
                                  vLIndicationObj={vLIndication}
                                  removeOrder={removeOrder}
                                />
                              ))}
                            </tbody>
                          </Table>
                          <br />
                          <br />
                        </List>
                      ) : (
                        ""
                      )}
                    </div>
                    <br />
                    {/* END Viral Load  Form */}

                    <Label
                      as="a"
                      color="blue"
                      style={{ width: "106%", height: "35px" }}
                      ribbon
                    >
                      <h4 style={{ color: "#fff" }}>
                        NEXT CLINICAL APPOINTMENT DATE
                      </h4>
                    </Label>
                    <br />
                    <br />
                    {/* TB Screening Form */}
                    <Input
                      type="date"
                      name="nextAppointment"
                      id="nextAppointment"
                      className="col-md-6"
                      value={objValues.nextAppointment}
                      onChange={handleInputChange}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.25rem",
                      }}
                      min={moment(new Date()).format("YYYY-MM-DD")}
                      disabled={!enableUpdate}
                    />
                    {errors.nextAppointment !== "" ? (
                      <span className={classes.error}>
                        {errors.nextAppointment}
                      </span>
                    ) : (
                      ""
                    )}
                    <br />
                    <MatButton
                      type="submit"
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      disabled={saving}
                      startIcon={<SaveIcon />}
                      style={{ backgroundColor: "#014d88" }}
                      onClick={handleSubmit}
                      hidden={!enableUpdate}
                    >
                      {!saving ? (
                        <span style={{ textTransform: "capitalize" }}>
                          Update
                        </span>
                      ) : (
                        <span style={{ textTransform: "capitalize" }}>
                          Updating...
                        </span>
                      )}
                    </MatButton>
                  </Segment>
                </Grid.Column>
              </Grid>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
function TestOrdersList({
  order,
  index,
  removeOrder,
  testGroupObj,
  vLIndicationObj,
}) {
  const testGroupID = order && order.labTestGroupId ? order.labTestGroupId : "";
  const testTestID = order && order.labTestId ? order.labTestId : "";
  const testGroupName = testGroupObj.find(
    (x) => x.id === parseInt(testGroupID)
  );
  const testName =
    testGroupName &&
    testGroupName.labTests.find((x) => x.id === parseInt(testTestID));
  const vLIndication =
    vLIndicationObj.length > 0
      ? vLIndicationObj.find(
          (x) => x.id === parseInt(order.viralLoadIndication)
        )
      : {};

  return (
    <tr>
      <th>
        {testGroupName &&
        testGroupName.groupName == "Others" &&
        testName.labTestName === "Viral Load"
          ? testName.labTestName
          : testGroupName.groupName}
      </th>
      <th>
        {testGroupName &&
        testGroupName.groupName === "Others" &&
        testName.labTestName === "Viral Load"
          ? vLIndication.display
          : testName.labTestName}
      </th>
      <th>
        {vLIndication && vLIndication.display ? vLIndication.display : ""}
      </th>
      <th></th>
      <th>
        <IconButton
          aria-label="delete"
          size="small"
          color="error"
          onClick={() => removeOrder(index)}
        >
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      </th>
    </tr>
  );
}
function ArvDrugOrderObjList({
  index,
  removeArvDrugOrder,
  regimenObject,
  adherenceLevel,
}) {
  const adherence = adherenceLevel.find(
    (x) => x.id === parseInt(regimenObject.regimenAdherance)
  );

  return (
    <tr>
      <th>{regimenObject.regimenLineName}</th>
      <th>{regimenObject.regimenDrugName}</th>
      <th>{regimenObject.dosage}</th>
      <th>{adherence && adherence.display}</th>
      <th></th>
      <th>
        <IconButton
          aria-label="delete"
          size="small"
          color="error"
          onClick={() => removeArvDrugOrder(index)}
        >
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      </th>
    </tr>
  );
}

export default ClinicVisit;
