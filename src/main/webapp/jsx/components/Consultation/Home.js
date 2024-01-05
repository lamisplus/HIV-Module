import React, { useState, useEffect } from "react";
import {
  Grid,
  Segment,
  Label,
  Icon,
  List,
  Card,
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
import ADR from "./ADR/Index";
import OpportunisticInfection from "./OpportunisticInfection/Index";
import TBScreening from "./TBScreening/Index";
import { url as baseUrl, token } from "../../../api";
import MatButton from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";
import axios from "axios";
//import AddVitals from './Vitals/AddVitals'
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import moment from "moment";
import { toast } from "react-toastify";
import { Accordion, Alert } from "react-bootstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Label as LabelSui } from "semantic-ui-react";
import Select from "react-select";

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
    "& FormLabelName": {
      fontSize: "14px",
      color: "#014d88",
      fontWeight: "bold",
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
  let visitId = "";
  let patientObj = props.patientObj ? props.patientObj : {};

  const [errors, setErrors] = useState({});
  const [clinicVisitList, setClinicVisitList] = useState([]);
  const [vLIndication, setVLIndication] = useState([]);
  const [testOrderList, setTestOrderList] = useState([]); //Test Order List
  const [loading, setLoading] = useState(true);
  const [activeAccordionHeaderShadow, setActiveAccordionHeaderShadow] =
    useState(0);
  let temp = { ...errors };
  let testsOptions = [];
  const classes = useStyles();
  const [getPatientObj, setGetPatientObj] = useState({});
  const [saving, setSaving] = useState(false);
  const [clinicalStage, setClinicalStage] = useState([]);
  const [functionalStatus, setFunctionalStatus] = useState([]);
  const [adherenceLevel, setAdherenceLevel] = useState([]);
  const [testGroup, setTestGroup] = useState([]);
  const [test, setTest] = useState([]);
  const [tbStatus, setTbStatus] = useState([]);
  const [adultRegimenLine, setAdultRegimenLine] = useState([]);
  const [childRegimenLine, setChildRegimenLine] = useState([]);
  const [regimenTypeObj, setRegimenTypeObj] = useState([]);
  const [TBForms, setTBForms] = useState(false);

  const [currentVitalSigns, setcurrentVitalSigns] = useState({});
  const [showCurrentVitalSigns, setShowCurrentVitalSigns] = useState(false);
  //opportunistic infection Object
  const [infection, setInfection] = useState({
    illnessInfection: "",
    ondateInfection: "",
  });
  const [infectionList, setInfectionList] = useState([]);
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
  const [enrollDate, setEnrollDate] = useState("");
  const [loadClinicHistory, setLoadClinicHistory] = useState(true);
  const [loadVitalHistory, setLoadVitalHistory] = useState(true);
  const [selectedOption, setSelectedOption] = useState([]);
  const [labTestOptions, setLabTestOptions] = useState([]);
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
  const [arvDrugObj, setArvDrugObj] = useState({
    regimenLine: "",
    regimenDrug: "",
    regimenLineName: "",
    regimenDrugName: "",
    dosage: "",
    regimenAdherance: "",
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
  });
  const [vital, setVitalSignDto] = useState({
    bodyWeight: "",
    diastolic: "",
    encounterDate: "",
    //captureDate:"",
    facilityId: 1,
    height: "",
    personId: props.patientObj.id,
    serviceTypeId: 1,
    systolic: "",
    pulse: "",
    temperature: "",
    respiratoryRate: "",
    headCircumference: "",
    surfaceArea: "",
    muac: "",
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
    viralLoadIndication: "",
    visitId: "",
  });
  const [careSupportObj, setCareSupportObj] = useState(null);
  const [careSupportTb, setCareSupportTb] = useState(null);
  useEffect(() => {
    FunctionalStatus();
    WhoStaging();
    AdherenceLevel();
    TBStatus();
    VitalSigns();
    PatientDetailId();
    ViraLoadIndication();
    TestGroup();
    AdultRegimenLine();
    ChildRegimenLine();
    CRYPTOCOCCAL_SCREENING_STATUS();
    CERVICAL_CANCER_SCREENING_STATUS();
    CERVICAL_CANCER_TREATMENT();
    HEPATITIS_SCREENING_RESULT();
    PREGANACY_STATUS();
    FAMILY_PLANNING_METHOD();
    GetPatientDTOObj();
    PatientCurrentRegimen();
    GetCareSupport()
    if (props.patientObj.id) {
      ClinicVisitList();
    }
    //hiv/patient/3
  }, [props.patientObj]);
  const GetPatientDTOObj = () => {
    axios
      .get(`${baseUrl}hiv/patient/${props.patientObj.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const patientDTO = response.data.enrollment;
        setEnrollDate(
          patientDTO && patientDTO.dateOfRegistration
            ? patientDTO.dateOfRegistration
            : ""
        );
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  const GetCareSupport =()=>{
    axios
        .get(`${baseUrl}observation/person/${props.patientObj.id}`,
            { headers: {"Authorization" : `Bearer ${token}`} }
        )
        .then((response) => {
          //console.log(response.data.filter((x)=> x.type==='Chronic Care'))
          setCareSupportObj(response.data.filter((x)=> x.type==='Chronic Care'))
        })
        .catch((error) => {
          //console.log(error);
        });

  }
  //Get the patient current regimen
  const PatientCurrentRegimen = () => {
    axios
      .get(
        `${baseUrl}hiv/art/pharmacy/patient/current-regimen/${props.patientObj.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        const currentRegimenObj = response.data;
        arvDrugObj.regimenLine = currentRegimenObj.regimenType.id;
        RegimenType(currentRegimenObj.regimenType.id);
        arvDrugObj.regimenDrug = currentRegimenObj.id;
      })
      .catch((error) => {
        //console.log(error);
      });
  };
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
  // FAMILY_PLANNING_METHOD
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
  //GET VIRAL LOAD INDICATION
  const ViraLoadIndication = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/VIRAL_LOAD_INDICATION`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setVLIndication(response.data);
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
  //GET ChildRegimenLine
  const ChildRegimenLine = () => {
    axios
      .get(`${baseUrl}hiv/regimen/arv/children`, {
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
  //Get list of Test Group
  const TestGroup = () => {
    axios
      .get(`${baseUrl}laboratory/labtestgroups`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTestGroup(response.data);
        response.data.map((x) => {
          x.labTests.map((x2) => {
            testsOptions.push({
              value: x2.id,
              label: x2.labTestName,
              testGroupId: x.id,
              testGroupName: x.groupName,
              sampleType: x2.sampleType,
            });
          });
          //console.log(testsOptions)
        });
        setLabTestOptions(testsOptions);
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  //GET LIST Drug Refill
  async function ClinicVisitList() {
    setLoading(true);
    axios
      .get(
        `${baseUrl}hiv/art/clinic-visit/person?pageNo=0&pageSize=10&personId=${props.patientObj.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setLoading(false);
        setLoadClinicHistory(false);
        setClinicVisitList(response.data);
      })
      .catch((error) => {
        setLoadClinicHistory(false);
        setLoading(false);
      });
  }
  //Check for the last Vital Signs
  const VitalSigns = () => {
    axios
      .get(`${baseUrl}patient/vital-sign/person/${props.patientObj.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setLoadVitalHistory(false);
        const lastVitalSigns = response.data[response.data.length - 1];
        //console.log(lastVitalSigns)
        if (
          lastVitalSigns.captureDate >= moment(new Date()).format("YYYY-MM-DD")
        ) {
          setcurrentVitalSigns(lastVitalSigns);
          setShowCurrentVitalSigns(true);
        }
      })
      .catch((error) => {
        setLoadVitalHistory(false);
        //console.log(error);
      });
  };
  //Check for the Patient Object
  const PatientDetailId = () => {
    axios
      .get(`${baseUrl}hiv/patient/${props.patientObj.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setGetPatientObj(response.data);
        patientObj = response.data;
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
  const handleInputChangeVitalSignDto = (e) => {
    setErrors({ ...errors, [e.target.name]: "" });
    setVitalSignDto({ ...vital, [e.target.name]: e.target.value });
    if(e.target.name==='encounterDate' ){
      //Validate the care and support date against the encounter date that was selected
      const supportCareDetail= careSupportObj.find((x)=> x.dateOfObservation===e.target.value)
      if(supportCareDetail!==undefined){
        setCareSupportTb(supportCareDetail && supportCareDetail.data.tbIptScreening.status)
        setSaving(false)
      }else{
        toast.error("Please select a valid date that exist for care & support")
        setSaving(true)
      }
      //objValues.tbStatus=supportCareDetail.data.tbIptScreening.status!==""? supportCareDetail.data.tbIptScreening.status :""
      //setVitalSignDto({ ...vital, [e.target.name]: e.target.value.replace(/\D/g, '') });
    }else{
      //setVitalSignDto({ ...vital, [e.target.name]: e.target.value });
    }
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
        viralLoadIndication: "",
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

  //Handle CheckBox
  const handleCheckBox = (e) => {
    if (e.target.checked) {
      //currentVitalSigns.personId === null ? props.patientObj.id : currentVitalSigns.personId
      setVitalSignDto({ ...currentVitalSigns });
    } else {
      setVitalSignDto({
        bodyWeight: "",
        diastolic: "",
        encounterDate: "",
        facilityId: "",
        height: "",
        personId: props.patientObj.id,
        serviceTypeId: "",
        systolic: "",
        pulse: "",
        temperature: "",
        respiratoryRate: "",
        headCircumference: "",
        surfaceArea: "",
        muac: "",
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
  const handleInputChangeObject = (e) => {
    setSelectedOption(e);
    tests.labTestGroupId = e.testGroupId;
    tests.labTestId = e.value;
  };
  //Validations of the forms
  const validate = () => {
    temp.encounterDate = vital.encounterDate ? "" : "This field is required";
    temp.nextAppointment = objValues.nextAppointment
      ? ""
      : "This field is required";
    temp.whoStagingId = objValues.whoStagingId ? "" : "This field is required";
    temp.functionalStatusId = objValues.functionalStatusId
      ? ""
      : "This field is required";
    {
      patientAge >= 10 &&
        patientObj.sex === "Female" &&
        (temp.pregnancyStatus = objValues.pregnancyStatus
          ? ""
          : "This field is required");
    }
    //temp.adherenceLevel = objValues.adherenceLevel ? "" : "This field is required"
    //temp.diastolic = vital.diastolic ? "" : "This field is required"
    //temp.systolic = vital.systolic ? "" : "This field is required"
    temp.height = vital.height ? "" : "This field is required";
    temp.bodyWeight = vital.bodyWeight ? "" : "This field is required";
    //TB VALIDATION
    temp.tbStatusId = tbObj.tbStatusId ? "" : "This field is required";
    //temp.antiTBDrug = tbObj.antiTBDrug ? "" : "This field is required";
    // tbObj.antiTBDrug &&
    //   tbObj.antiTBDrug === "NO" &&
    //   (temp.currentOnIpt = tbObj.currentOnIpt ? "" : "This field is required");
    // tbObj.currentOnIpt &&
    //   tbObj.currentOnIpt === "NO" &&
    //   (temp.fever = tbObj.fever ? "" : "This field is required");
    // tbObj.currentOnIpt &&
    //   tbObj.currentOnIpt === "NO" &&
    //   (temp.nightSweat = tbObj.nightSweat ? "" : "This field is required");
    // tbObj.currentOnIpt &&
    //   tbObj.currentOnIpt === "NO" &&
    //   (temp.lethergy = tbObj.lethergy ? "" : "This field is required");
    // tbObj.currentOnIpt &&
    //   tbObj.currentOnIpt === "NO" &&
    //   (temp.coughing = tbObj.coughing ? "" : "This field is required");
    // tbObj.currentOnIpt &&
    //   tbObj.currentOnIpt === "NO" &&
    //   (temp.contactWithTBCase = tbObj.contactWithTBCase
    //     ? ""
    //     : "This field is required");
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x === "");
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
      objValues.visitDate = vital.encounterDate;
      vital["captureDate"] = vital.encounterDate;
      objValues.adverseDrugReactions = adrList;
      objValues.artStatusId = getPatientObj.artCommence.id;
      objValues.hivEnrollmentId = getPatientObj.enrollment.id;
      objValues.opportunisticInfections = infectionList;
      objValues.tbScreen = tbObj;
      objValues.tbStatus = tbObj.tbStatusId;
      objValues.viralLoadOrder = testOrderList;
      objValues.arvdrugsRegimen = arvDrugOrderList;
      objValues["vitalSignDto"] = vital;
      //console.log(objValues.tbStatus);

      axios
        .post(`${baseUrl}hiv/art/clinic-visit/`, objValues, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          PatientDetailId();
          props.ClinicVisitListHistory();
          setSaving(false);
          toast.success("Clinic Visit(Care card) save successful", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          props.setActiveContent({
            ...props.activeContent,
            route: "consultation",
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
          } else {
            toast.error("Something went wrong. Please try again...", {
              position: toast.POSITION.BOTTOM_CENTER,
            });
          }
        });
    } else {
      toast.error("All field are required", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };
  function BmiCal(bmi) {
    if (bmi < 18.5) {
      return <Message size="mini" color="brown" content="Underweight" />;
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      <Message size="mini" color="olive" content="Well nourished" />;
    } else if (bmi > 25) {
      <Message size="mini" color="blue" content="Overweight/Obese" />;
    }
  }

  //console.log(errors);
  return (
    <div className={classes.root}>
      <div className="row">
        <div className="col-md-6">
          <h2>Clinic Follow-up Visit</h2>
        </div>
      </div>
      <Grid columns="equal">
        <Grid.Column width={5}>
          <Segment>
            <Label
              as="a"
              color="blue"
              style={{ width: "110%", height: "35px" }}
              ribbon
            >
              <h4 style={{ color: "#fff" }}>Vital Signs</h4>
            </Label>
            <br />
            {loadVitalHistory === false ? (
              <>
                <PerfectScrollbar
                  style={{ height: "370px" }}
                  id="DZ_W_Todo1"
                  className="widget-media dz-scroll ps ps--active-y"
                >
                  <br />
                  <ul className="timeline">
                    {clinicVisitList.length > 0 ? (
                      <Accordion
                        className="accordion accordion-header-bg accordion-header-shadow accordion-rounded "
                        defaultActiveKey="0"
                      >
                        <>
                          {clinicVisitList.map((visit, i) => (
                            <div className="accordion-item" key={i}>
                              <Accordion.Toggle
                                as={Card.Text}
                                eventKey={`${i}`}
                                className={`accordion-header ${
                                  activeAccordionHeaderShadow === 1
                                    ? ""
                                    : "collapsed"
                                } accordion-header-info`}
                                onClick={() =>
                                  setActiveAccordionHeaderShadow(
                                    activeAccordionHeaderShadow === 1 ? -1 : i
                                  )
                                }
                                style={{ width: "100%" }}
                              >
                                <span className="accordion-header-icon"></span>
                                <span className="accordion-header-text float-start">
                                  Visit Date :{" "}
                                  <span className="">{visit.visitDate}</span>{" "}
                                </span>
                                <span className="accordion-header-indicator"></span>
                              </Accordion.Toggle>
                              <Accordion.Collapse
                                eventKey={`${i}`}
                                className="accordion__body"
                              >
                                <div className="accordion-body-text">
                                  <List celled style={{ width: "100%" }}>
                                    {visit.vitalSignDto &&
                                      visit.vitalSignDto.pulse !== null && (
                                        <List.Item
                                          style={{
                                            paddingBottom: "10px",
                                            paddingTop: "10px",
                                            borderTop: "1px solid #fff",
                                            marginTop: "-5px",
                                          }}
                                        >
                                          Pulse{" "}
                                          <span
                                            style={{
                                              color: "rgb(153, 46, 98)",
                                            }}
                                            className="float-end"
                                          >
                                            <b>
                                              {visit.vitalSignDto.pulse} bpm
                                            </b>
                                          </span>
                                        </List.Item>
                                      )}
                                    {visit.vitalSignDto &&
                                      visit.vitalSignDto.respiratoryRate !==
                                        null && (
                                        <List.Item
                                          style={{
                                            paddingBottom: "10px",
                                            paddingTop: "10px",
                                          }}
                                        >
                                          Respiratory Rate{" "}
                                          <span className="float-end">
                                            <b
                                              style={{
                                                color: "rgb(153, 46, 98)",
                                              }}
                                            >
                                              {
                                                visit.vitalSignDto
                                                  .respiratoryRate
                                              }{" "}
                                              bpm
                                            </b>
                                          </span>
                                        </List.Item>
                                      )}
                                    {visit.vitalSignDto &&
                                      visit.vitalSignDto.temperature !==
                                        null && (
                                        <List.Item
                                          style={{
                                            paddingBottom: "10px",
                                            paddingTop: "10px",
                                          }}
                                        >
                                          Temperature{" "}
                                          <span className="float-end">
                                            <b
                                              style={{
                                                color: "rgb(153, 46, 98)",
                                              }}
                                            >
                                              {visit.vitalSignDto.temperature}{" "}
                                              <sup>0</sup>C
                                            </b>
                                          </span>
                                        </List.Item>
                                      )}
                                    {visit.vitalSignDto &&
                                      visit.vitalSignDto.systolic !== null &&
                                      visit.vitalSignDto.diastolic !== null && (
                                        <List.Item
                                          style={{
                                            paddingBottom: "10px",
                                            paddingTop: "10px",
                                          }}
                                        >
                                          Blood Pressure{" "}
                                          <span className="float-end">
                                            <b
                                              style={{
                                                color: "rgb(153, 46, 98)",
                                              }}
                                            >
                                              {visit.vitalSignDto.systolic}/
                                              {visit.vitalSignDto.diastolic}
                                            </b>
                                          </span>
                                        </List.Item>
                                      )}
                                    {visit.vitalSignDto &&
                                      visit.vitalSignDto.height !== null && (
                                        <List.Item
                                          style={{
                                            paddingBottom: "10px",
                                            paddingTop: "10px",
                                          }}
                                        >
                                          Height{" "}
                                          <span className="float-end">
                                            <b
                                              style={{
                                                color: "rgb(153, 46, 98)",
                                              }}
                                            >
                                              {visit.vitalSignDto.height} cm
                                            </b>
                                          </span>
                                        </List.Item>
                                      )}
                                    {visit.vitalSignDto &&
                                      visit.vitalSignDto.bodyWeight !==
                                        null && (
                                        <List.Item
                                          style={{
                                            paddingBottom: "10px",
                                            paddingTop: "10px",
                                          }}
                                        >
                                          Weight{" "}
                                          <span className="float-end">
                                            <b
                                              style={{
                                                color: "rgb(153, 46, 98)",
                                              }}
                                            >
                                              {visit.vitalSignDto.bodyWeight} kg
                                            </b>
                                          </span>
                                        </List.Item>
                                      )}
                                    {visit.vitalSignDto &&
                                      visit.vitalSignDto.bodyWeight !== null &&
                                      visit.vitalSignDto.height !== null && (
                                        <List.Item
                                          style={{
                                            paddingBottom: "10px",
                                            paddingTop: "10px",
                                          }}
                                        >
                                          BMI{" "}
                                          <span className="float-end">
                                            <b
                                              style={{
                                                color: "rgb(153, 46, 98)",
                                              }}
                                            >
                                              {(
                                                visit.vitalSignDto.bodyWeight /
                                                ((visit.vitalSignDto.height /
                                                  100) *
                                                  (visit.vitalSignDto.height /
                                                    100))
                                              ).toFixed(2)}{" "}
                                              kg/m<sup>2</sup>
                                            </b>
                                          </span>
                                        </List.Item>
                                      )}
                                  </List>
                                </div>
                              </Accordion.Collapse>
                            </div>
                          ))}
                        </>
                      </Accordion>
                    ) : (
                      <>
                        <br />
                        <Alert
                          variant="primary"
                          className="alert-dismissible   "
                        >
                          <p>No Vital Signs</p>
                        </Alert>
                      </>
                    )}
                  </ul>
                </PerfectScrollbar>
              </>
            ) : (
              <>
                <p>Loading please wait...</p>
              </>
            )}
          </Segment>
          <Segment>
            <Label
              as="a"
              color="teal"
              style={{ width: "110%", height: "35px" }}
              ribbon
            >
              <h4 style={{ color: "#fff" }}>Previous Clinical Notes</h4>
            </Label>
            {loadClinicHistory === false ? (
              <>
                <PerfectScrollbar
                  style={{ height: "370px" }}
                  id="DZ_W_Todo1"
                  className="widget-media dz-scroll ps ps--active-y"
                >
                  <br />
                  <ul className="timeline">
                    {clinicVisitList.length > 0 ? (
                      <Accordion
                        className="accordion accordion-header-bg accordion-header-shadow accordion-rounded "
                        defaultActiveKey="0"
                      >
                        <>
                          {clinicVisitList.map((visit, i) => (
                            <div className="accordion-item" key={i}>
                              <Accordion.Toggle
                                as={Card.Text}
                                eventKey={`${i}`}
                                className={`accordion-header ${
                                  activeAccordionHeaderShadow === 1
                                    ? ""
                                    : "collapsed"
                                } accordion-header-info`}
                                onClick={() =>
                                  setActiveAccordionHeaderShadow(
                                    activeAccordionHeaderShadow === 1 ? -1 : i
                                  )
                                }
                                style={{ width: "100%" }}
                              >
                                <span className="accordion-header-icon"></span>
                                <span
                                  className="accordion-header-text float-start"
                                  style={{ width: "100%" }}
                                >
                                  Visit Date :{" "}
                                  <span className="">{visit.visitDate}</span>{" "}
                                </span>
                                <span className="accordion-header-indicator "></span>
                              </Accordion.Toggle>
                              <Accordion.Collapse
                                eventKey={`${i}`}
                                className="accordion__body"
                              >
                                <div className="accordion-body-text">
                                  <p>{visit.clinicalNote}</p>
                                </div>
                              </Accordion.Collapse>
                            </div>
                          ))}
                        </>
                      </Accordion>
                    ) : (
                      <>
                        <br />
                        <Alert
                          variant="primary"
                          className="alert-dismissible  "
                        >
                          <p>No Clinical Notes</p>
                        </Alert>
                      </>
                    )}
                  </ul>
                </PerfectScrollbar>
              </>
            ) : (
              <>
                <p>Loading please wait...</p>
              </>
            )}
          </Segment>
        </Grid.Column>
        <Grid.Column width={11} className={classes.root}>
          <Segment>
            <Label
              as="a"
              color="blue"
              style={{ width: "106%", height: "35px" }}
              ribbon
            >
              <h4 style={{ color: "#fff" }}>VITAL SIGNS</h4>
            </Label>
            <br />
            <br />
            <div className="row">
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <FormLabelName>
                    Date of Visit <span style={{ color: "red" }}> *</span>
                  </FormLabelName>
                  <Input
                    type="date"
                    name="encounterDate"
                    id="encounterDate"
                    value={vital.encounterDate}
                    style={{
                      border: "1px solid #014D88",
                      borderRadius: "0.25rem",
                    }}
                    onChange={handleInputChangeVitalSignDto}
                    min={enrollDate}
                    max={moment(new Date()).format("YYYY-MM-DD")}
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
              <div className="form-group mb-3 col-md-6">
                {showCurrentVitalSigns && (
                  <div className="form-check custom-checkbox ml-1 ">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="currentVitalSigns"
                      id="currentVitalSigns"
                      onChange={handleCheckBox}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="basic_checkbox_1"
                    >
                      use current Vital Signs
                    </label>
                  </div>
                )}
              </div>
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
                      <span className={classes.error}>{errors.pulse}</span>
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

                <div className=" mb-3 col-md-4">
                  <FormGroup>
                    <FormLabelName>
                      Body Weight <span style={{ color: "red" }}> *</span>
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
                      <span className={classes.error}>{errors.bodyWeight}</span>
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
                      />
                      <InputGroupText
                        addonType="append"
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
                      <span className={classes.error}>{errors.height}</span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 mt-2 col-md-3">
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
                            ((vital.height / 100) * (vital.height / 100))
                          ).toFixed(2)}
                        </InputGroupText>
                      </InputGroup>
                    </FormGroup>
                  )}
                </div>
                {vital.bodyWeight !== "" && vital.height !== "" && (
                  <div className="form-group mb-3 mt-2 col-md-12">
                    {BmiCal(
                      (
                        vital.bodyWeight /
                        ((vital.height / 100) * (vital.height / 100))
                      ).toFixed(2)
                    )}
                  </div>
                )}
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
                      <span className={classes.error}>{errors.systolic}</span>
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
                      <span className={"float-end"}>
                        <span className={classes.error}>
                          {errors.diastolic}
                        </span>
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
                        type="number"
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
                        type="number"
                        name="surfaceArea"
                        id="surfaceArea"
                        onChange={handleInputChangeVitalSignDto}
                        value={vital.surfaceArea}
                        onKeyUp={handleInputValueCheckTemperature}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0rem",
                        }}
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
              color="black"
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
                style={{ border: "1px solid #014D88", borderRadius: "0.25rem" }}
              ></textarea>
              {errors.clinicalNote !== "" ? (
                <span className={classes.error}>{errors.clinicalNote}</span>
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
                    value={objValues.whoStagingId}
                    onChange={handleInputChange}
                    style={{
                      border: "1px solid #014D88",
                      borderRadius: "0.25rem",
                    }}
                    required
                  >
                    <option value="select">Select </option>

                    {clinicalStage.map((value) => (
                      <option key={value.id} value={value.id}>
                        {value.display}
                      </option>
                    ))}
                  </Input>
                  {errors.whoStagingId !== "" ? (
                    <span className={classes.error}>{errors.whoStagingId}</span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </div>
              <div className=" mb-3 col-md-6">
                <FormGroup>
                  <FormLabelName>
                    Functional Status <span style={{ color: "red" }}> *</span>
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
                    required
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
                    required
                  >
                    <option value="select">Select </option>

                    {adherenceLevel.map((value) => (
                      <option key={value.id} value={value.id}>
                        {value.display}
                      </option>
                    ))}
                  </Input>
                  {errors.adherenceLevel !== "" ? (
                    <span className={classes.error}>
                      {errors.adherenceLevel}
                    </span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </div>
              <div className=" mb-3 col-md-6">
                <FormGroup>
                  <FormLabelName>Cryptococcal Screening Status</FormLabelName>
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
                    required
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
                  <FormLabelName >TB Status * </FormLabelName>
                  <Input
                      type="select"
                      name="tbStatus"
                      id="tbStatus"
                      value={objValues.tbStatus}
                      onChange={handleInputChange}
                      style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                      required
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
              <div className=" mb-3 col-md-6">
                <FormGroup>
                  <FormLabelName>Hepatitis Screening Result</FormLabelName>
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
                    required
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
              {patientAge >= 10 &&
                (patientObj.sex === "Female" ||
                  patientObj.sex === "FEMALE" ||
                  patientObj.sex === "female") && (
                  <>
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
                          required
                        >
                          <option value="select">Select </option>

                          {pregnancyStatus.map((value) => (
                            <option key={value.code} value={value.display}>
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
                    <div className=" mb-3 col-md-6">
                      <FormGroup>
                        <FormLabelName>
                          Cervical Cancer Screening Status
                        </FormLabelName>
                        <Input
                          type="select"
                          name="cervicalCancerScreeningStatus"
                          id="cervicalCancerScreeningStatus"
                          value={objValues.cervicalCancerScreeningStatus}
                          onChange={handleInputChange}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                          }}
                          required
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
                          value={objValues.cervicalCancerTreatmentProvided}
                          onChange={handleInputChange}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                          }}
                          required
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
                  </>
                )}
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
                    required
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
                      required
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
            {/* End of section if the patient is Female */}
            <Label
              as="a"
              color="red"
              style={{ width: "106%", height: "35px" }}
              ribbon
            >
              <h4 style={{ color: "#fff" }}>OPPORTUNISTIC INFECTION</h4>
            </Label>
            <OpportunisticInfection
              setInfection={setInfection}
              infection={infection}
              setInfectionList={setInfectionList}
              infectionList={infectionList}
              artStartDate={enrollDate}
              encounterDate={vital.encounterDate}
            />

            <Label
              as="a"
              color="pink"
              style={{ width: "106%", height: "35px" }}
              ribbon
            >
              <h4 style={{ color: "#fff" }}>ADR </h4>
            </Label>

            <ADR
              setAdrObj={setAdrObj}
              adrObj={adrObj}
              setAdrList={setAdrList}
              adrList={adrList}
              artStartDate={enrollDate}
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
            {/* TB Screening Form */}
            <TBScreening
              tbStatus={tbStatus}
              tbObj={tbObj}
              setTbObj={setTbObj}
              errors={errors}
              careSupportTb={careSupportTb}
              setErrors={setErrors}
            />
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
                    required
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
                    <span className={classes.error}>{errors.regimenLine}</span>
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
                    required
                  >
                    <option value="select">Select </option>

                    {regimenTypeObj.map((value) => (
                      <option key={value.id} value={value.id}>
                        {value.description}
                      </option>
                    ))}
                  </Input>
                  {errors.regimenDrug !== "" ? (
                    <span className={classes.error}>{errors.regimenDrug}</span>
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
                    required
                  />
                  {errors.dosage !== "" ? (
                    <span className={classes.error}>{errors.dosage}</span>
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
                    required
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
              <div className=" mb-3 col-md-5">
                <FormGroup>
                  <FormLabelName for="testGroup">Select Test</FormLabelName>
                  <Select
                    //value={selectedOption}
                    onChange={handleInputChangeObject}
                    options={labTestOptions}
                    styles={classes.root}
                    menuPortalTarget={document.body}
                    menuPosition={"fixed"}
                  />
                  {errors.labTestId !== "" ? (
                    <span className={classes.error}>{errors.labTestId}</span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </div>
              {(tests.labTestId === "16" || tests.labTestId === 16) && (
                <div className="mb-3 col-md-5">
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
                </List>
              ) : (
                ""
              )}
            </div>
            {/* END Viral Load  Form */}

            <Label
              as="a"
              color="blue"
              style={{ width: "106%", height: "35px" }}
              ribbon
            >
              <h4 style={{ color: "#fff" }}>NEXT CLINICAL APPOINTMENT DATE </h4>
            </Label>
            <br />
            <br />
            {/* TB Screening Form */}
            <Input
              type="date"
              name="nextAppointment"
              id="nextAppointment"
              className="col-md-6"
              value={vital.nextAppointment}
              onChange={handleInputChange}
              style={{ border: "1px solid #014D88", borderRadius: "0.25rem" }}
              min={vital.encounterDate}
            />
            {errors.nextAppointment !== "" ? (
              <span className={classes.error}>{errors.nextAppointment}</span>
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
            >
              {!saving ? (
                <span style={{ textTransform: "capitalize" }}>Save</span>
              ) : (
                <span style={{ textTransform: "capitalize" }}>Saving...</span>
              )}
            </MatButton>
          </Segment>
        </Grid.Column>
      </Grid>
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
  const testGroupName = testGroupObj.find(
    (x) => x.id === parseInt(order.labTestGroupId)
  );
  const testName = testGroupName.labTests.find(
    (x) => x.id === parseInt(order.labTestId)
  );
  const vLIndication =
    vLIndicationObj.length > 0
      ? vLIndicationObj.find(
          (x) => x.id === parseInt(order.viralLoadIndication)
        )
      : {};

  return (
    <tr>
      <th>
        {testGroupName.groupName == "Others" &&
        testName.labTestName === "Viral Load"
          ? testName.labTestName
          : testGroupName.groupName}
      </th>
      <th>
        {testGroupName.groupName === "Others" &&
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
