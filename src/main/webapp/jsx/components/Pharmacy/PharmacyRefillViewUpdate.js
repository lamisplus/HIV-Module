import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Input,
  Label,
  FormGroup,
  CardBody,
  Card,
  InputGroupText,
  InputGroup,
} from "reactstrap";
import { Table } from "react-bootstrap";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import MatButton from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";

import "react-widgets/dist/css/react-widgets.css";
import moment from "moment";
import { Spinner } from "reactstrap";

import { url as baseUrl, token } from "../../../api";
import { toast } from "react-toastify";
import { Icon, List, Label as LabelSui } from "semantic-ui-react";
import { calculate_age_to_number } from "../../../utils";
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  error: {
    color: "#f85032",
    fontSize: "11px",
  },
  success: {
    color: "#4BB543 ",
    fontSize: "11px",
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
}));
let refillPeriodValue = null;

const Pharmacy = (props) => {
  const patientObj = props.patientObj;
  const [selectedCombinedRegimen, setSelectedCombinedRegimen] = useState([]);
  const enrollDate =
    patientObj && patientObj.artCommence
      ? patientObj.artCommence.visitDate
      : null;
  const classes = useStyles();
  const [saving, setSaving] = useState(false);
  //const [selectedOption, setSelectedOption] = useState([]);
  const [selectedOptionAdr, setSelectedOptionAdr] = useState();
  const [prepSideEffect, setPrepSideEffect] = useState([]);
  const [mmdType, setmmdType] = useState();
  const [dsdModelType, setDsdModelType] = useState([]);
  const [showmmdType, setShowmmdType] = useState(false);
  const [showRegimen, setShowRegimen] = useState(false);
  const [regimen, setRegimen] = useState([]);
  const [eacStatusObj, setEacStatusObj] = useState();
  const [regimenType, setRegimenType] = useState([]);
  const [regimenTypeOI, setRegimenTypeOI] = useState([]);
  const [regimenTypeTB, setRegimenTypeTB] = useState([]);
  const [regimenDrug, setRegimenDrug] = useState([]);
  const [regimenDrugList, setRegimenDrugList] = useState([]);
  const [showCurrentVitalSigns, setShowCurrentVitalSigns] = useState(false);
  const [adultArtRegimenLine, setAdultArtRegimenLine] = useState([]);
  const [oIRegimenLine, setOIRegimenLine] = useState([]);
  const [tbRegimenLine, setTbRegimenLine] = useState([]);
  //const [othersRegimenLine, setOthersRegimenLine] = useState([]);
  const [childRegimenLine, setChildRegimenLine] = useState([]);
  const [iptType, setIPT_TYPE] = useState([]);
  const [showIptType, setIptType] = useState(false);
  const [childrenOI, setChildrenOI] = useState([]);
  const [childrenTB, setChildrenTB] = useState([]);
  const [otherDrugs, setOtherDrugs] = useState([]);
  const [regimenTypeOther, setRegimenTypeOther] = useState([]);
  const [iptEligibilty, setIptEligibilty] = useState("");
  const [dsdDevolvement, setDsdDevolvement] = useState(null);
  const [clientDsdStatus, setClientDsdStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tptCareAndSupportRegimen, setTptCareAndSupportRegimen] = useState("")
  const [objValues, setObjValues] = useState({
    adherence: "",
    adrScreened: "",
    adverseDrugReactions: {},
    dsdModel: "",
    isDevolve: "",
    extra: {},
    facilityId: 2,
    mmdType: null,
    nextAppointment: null,
    personId: props.patientObj.id,
    refillPeriod: null,
    prescriptionError: null,
    regimenId: [],
    regimenTypeId: "",
    visitDate: null,
    visitId: 0,
    refill: "",
    refillType: "",
    dsdModelType,
    switch: "",
    substitute: "",
    iptType: "",
    visitType: "",
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
  const [disabledField, setDisabledField] = useState(false);
  useEffect(() => {
    RegimenLine();
    PrepSideEffect();
    VitalSigns();
    AdultRegimenLine();
    PharmacyRefillDetail();
    CheckEACStatus();
    IPT_TYPE();
    VitalSigns();
    ChildRegimenLine();
    OtherDrugs();
    GetIptEligibilty();
    if (props.activeContent && props.activeContent.actionType === "view") {
      setDisabledField(true);
    }
  }, [props.activeContent.obj, props.activeContent.id, objValues.dsdModelType]);

  useEffect(() => {
    if (iptEligibilty.IPTEligibility === true && tptCareAndSupportRegimen !== "") {
      handleSelectedRegimenOI({target: {value: 15}});
    }
  }, [iptEligibilty.IPTEligibility, tptCareAndSupportRegimen]);

  const IPT_TYPE = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/IPT_TYPE`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setIPT_TYPE(response.data);
      })
      .catch((error) => {});
  };
  const GetIptEligibilty = () => {
    //GET IPT ELIGIBILITY
    axios
      .get(`${baseUrl}observation/check-ipt-eligible/${props.patientObj.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setIptEligibilty(response.data);
      })
      .catch((error) => {});
  };

  const GetCareAndSupportTptRegimen = () => {
    if (!objValues.visitDate) return; // Only proceed if visitDate is set
    axios
        .get(`${baseUrl}observation/person/${props.patientObj.id}`, {
          headers: {Authorization: `Bearer ${token}`}, // Add token here
        })
        .then((response) => {
          const data = response.data;
          const matchedRecord = data.find(
              (item) =>
                  item.type === "Chronic Care" &&
                  item.dateOfObservation === objValues.visitDate &&
                  item.data.tptMonitoring.tptRegimen !== null &&
                  item.data.tptMonitoring.tptRegimen !== ""
          );
          // If a matching record is found, set the tptRegimen and update objValues
          if (matchedRecord) {
            setTptCareAndSupportRegimen(matchedRecord.data.tptMonitoring.tptRegimen);
            setObjValues((prevValues) => ({
              ...prevValues,
              regimenId: matchedRecord.data.tptMonitoring.tptRegimen,
            }));
          } else {
            setTptCareAndSupportRegimen("");
          }
        })
        .catch((error) => {
          console.error("Error fetching care and support data:", error);
        });
  };

  useEffect(() => {
    GetCareAndSupportTptRegimen();
  }, [objValues.visitDate]);

  //GET Other Drugd
  //remove arv prohpylaxis for pregnant women form the list of regimen type and populate the drop down list
  const OtherDrugs = async () => {
    try {
      const response = await axios.get(`${baseUrl}hiv/regimen/other/drugs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter out items with id !== 5
      const filteredData = Object.entries(response.data)
        .map(([key, value]) => ({
          label: value.description,
          value: value.id,
        }))
        .filter((item) => item.value !== 5);

      setOtherDrugs(filteredData);
    } catch (error) {
      // Handle errors here
      console.error("Error fetching OtherDrugs:", error);
      //.catch((error) => {});
    }
  };
//  check if patient is on dsd
  useEffect(() => {
    setIsLoading(true);
    axios
        .get(`${baseUrl}hiv/art/pharmacy/devolve/patient/${patientObj.personUuid}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const isOnDsd = response.data === true;
          setClientDsdStatus(isOnDsd ? "Yes" : "No");
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
  }, []);

  const patientAge = calculate_age_to_number(patientObj.dateOfBirth);
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
        setChildrenOI(
          response.data.filter((x) => x.id === 15 || x.id === 9 || x.id === 8)
        );
        setChildrenTB(response.data.filter((x) => x.id === 11));
      })
      .catch((error) => {});
  };
  //Get Pharmacy refill Detail
  const PharmacyRefillDetail = () => {
    axios
      .get(`${baseUrl}hiv/art/pharmacy/${props.activeContent.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const data = response.data;

        setObjValues(data);
        setRegimenDrugList(data && data.extra ? data.extra.regimens : []);
        DsdModelType(objValues.dsdModel);
        objValues.dsdModelType = data.dsdModelType;
        //}
      })
      .catch((error) => {});
  };
  //Get list of DSD Model Type
  function DsdModelType(dsdmodel) {
    const dsd =
      dsdmodel === "Facility" ? "DSD_MODEL_FACILITY" : "DSD_MODEL_COMMUNITY";
    axios
      .get(`${baseUrl}application-codesets/v2/${dsd}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setDsdModelType(response.data);
      })
      .catch((error) => {});
  }
  //GET AdultRegimenLine
  const AdultRegimenLine = () => {
    axios
      .get(`${baseUrl}hiv/regimen/arv/adult`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        //const filterRegimen=response.data.filter((x)=> (x.id===1 || x.id===2 || x.id===3 || x.id===4 || x.id===14))
        const artRegimen = response.data.filter(
          (x) => x.id === 1 || x.id === 2 || x.id === 14
        );
        const tbRegimen = response.data.filter((x) => x.id === 10);
        const oIRegimen = response.data.filter(
          (x) => x.id === 9 || x.id === 15 || x.id === 8
        );
        const othersRegimen = response.data.filter(
          (x) =>
            x.id !== 1 || x.id === 2 || x.id === 3 || x.id === 4 || x.id === 14
        );
        setAdultArtRegimenLine(artRegimen);
        setTbRegimenLine(tbRegimen);
        setOIRegimenLine(oIRegimen);
      })
      .catch((error) => {});
  };

  //Check for the last Vital Signs
  const VitalSigns = () => {
    axios
      .get(`${baseUrl}patient/vital-sign/person/${props.patientObj.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const lastVitalSigns = response.data[response.data.length - 1];

        if (
          lastVitalSigns.captureDate >= moment(new Date()).format("YYYY-MM-DD")
        ) {
          setVitalSignDto(lastVitalSigns);
          setShowCurrentVitalSigns(true);
        }
      })
      .catch((error) => {});
  };
  //Get EAC Status
  const CheckEACStatus = () => {
    axios
      .get(`${baseUrl}hiv/eac/open/patient/${props.patientObj.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setEacStatusObj(response.data);
      })
      .catch((error) => {});
  };
  //Get list of RegimenLine
  const RegimenLine = () => {
    axios
      .get(`${baseUrl}hiv/regimen/types`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setRegimen(response.data);
      })
      .catch((error) => {});
  };
  //Get list of PrepSideEffect
  const PrepSideEffect = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/PREP_SIDE_EFFECTS`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setPrepSideEffect(
          Object.entries(response.data).map(([key, value]) => ({
            label: value.display,
            value: value.id,
          }))
        );
      })
      .catch((error) => {});
  };
  function RegimenType(id) {
    async function getCharacters() {
      try {
        const response = await axios.get(`${baseUrl}hiv/regimen/types/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.length > 0) {
          setRegimenType(
            Object.entries(response.data).map(([key, value]) => ({
              label: value.description,
              value: value.id,
            }))
          );
        }
      } catch (e) {}
    }
    getCharacters();
  }
  function RegimenTypeOI(id) {
    async function getCharacters() {
      try {
        const response = await axios.get(`${baseUrl}hiv/regimen/types/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.length > 0) {
          setRegimenTypeOI(
            Object.entries(response.data).map(([key, value]) => ({
              label: value.description,
              value: value.id,
            }))
          );
        }
      } catch (e) {}
    }
    getCharacters();
  }
  function RegimenTypeTB(id) {
    async function getCharacters() {
      try {
        const response = await axios.get(`${baseUrl}hiv/regimen/types/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.length > 0) {
          setRegimenTypeTB(
            Object.entries(response.data).map(([key, value]) => ({
              label: value.description,
              value: value.id,
            }))
          );
        }
      } catch (e) {}
    }
    getCharacters();
  }
  function RegimenDrug(id) {
    let drugId = id;
    async function getCharacters(drugId) {
      try {
        const response = await axios.get(`${baseUrl}hiv/regimen/drugs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.length > 0) {
          setSelectedCombinedRegimen(response.data);
          const regimenName = regimenType.find((x) => {
            if (x.value == parseInt(drugId)) {
              return x;
            }
          });

          const drugObj = [
            {
              dispense: "",
              prescribed: "",
              dosage: "",
              freqency: "",
              duration: objValues.refillPeriod,
              name: regimenName.label,
              regimenId: regimenName.value,
              regimenName: regimenName.label,
            },
          ];
          setRegimenDrug(drugObj);
        }
      } catch (e) {}
    }
    getCharacters(drugId);
  }
  function RegimenDrugOI(id) {
    let drugId = id;
    async function getCharacters(drugId) {
      try {
        const response = await axios.get(`${baseUrl}hiv/regimen/drugs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) {
          setSelectedCombinedRegimen(response.data);
          const regimenName = regimenTypeOI.find((x) => {
            if (x.value == parseInt(drugId)) {
              return x;
            }
          });

          const drugObj = [
            {
              dispense: "",
              prescribed: "",
              dosage: "",
              freqency: "",
              duration: objValues.refillPeriod,
              name: regimenName.label,
              regimenId: regimenName.value,
              regimenName: regimenName.label,
            },
          ];
          setRegimenDrug(drugObj);
        }
      } catch (e) {}
    }
    getCharacters(drugId);
  }
  function RegimenDrugTB(id) {
    let drugId = id;
    async function getCharacters(drugId) {
      try {
        const response = await axios.get(`${baseUrl}hiv/regimen/drugs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) {
          setSelectedCombinedRegimen(response.data);
          const regimenName = regimenTypeTB.find((x) => {
            if (x.value == parseInt(drugId)) {
              return x;
            }
          });

          const drugObj = [
            {
              dispense: "",
              prescribed: "",
              dosage: "",
              freqency: "",
              duration: objValues.refillPeriod,
              name: regimenName.label,
              regimenId: regimenName.value,
              regimenName: regimenName.label,
            },
          ];
          setRegimenDrug(drugObj);
        }
      } catch (e) {}
    }
    getCharacters(drugId);
  }
  function RegimenDrugOther(id) {
    let drugId = id;
    async function getCharacters(drugId) {
      try {
        const response = await axios.get(`${baseUrl}hiv/regimen/drugs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) {
          setSelectedCombinedRegimen(response.data);
          const regimenName = regimenTypeOther.find((x) => {
            if (x.value == parseInt(drugId)) {
              return x;
            }
          });

          const drugObj = [
            {
              dispense: "",
              prescribed: "",
              dosage: "",
              freqency: "",
              duration: objValues.refillPeriod,
              name: regimenName.label,
              regimenId: regimenName.value,
              regimenName: regimenName.label,
            },
          ];
          setRegimenDrug(drugObj);
        }
      } catch (e) {}
    }
    getCharacters(drugId);
  }
  function RegimenTypeOther(id) {
    async function getCharacters() {
      try {
        const response = await axios.get(`${baseUrl}hiv/regimen/types/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.length > 0) {
          setRegimenTypeOther(
            Object.entries(response.data).map(([key, value]) => ({
              label: value.description,
              value: value.id,
            }))
          );
        }
      } catch (e) {}
    }
    getCharacters();
  }
  const handleInputChange = (e) => {
    if (e.target.name === "dsdModel" && e.target.value !== "") {
      DsdModelType(e.target.value);
      setObjValues({ ...objValues, [e.target.name]: e.target.value });
    }
    setObjValues({ ...objValues, [e.target.name]: e.target.value });
  };
  const handleSelectedRegimen = (e) => {
    const regimenId = e.target.value;

    if (regimenId !== "") {
      RegimenType(regimenId);
      setShowRegimen(true);
    } else {
      setRegimenType([]);
      setShowRegimen(false);
    }
  };
  const handleSelectedRegimenOther = (e) => {
    const regimenId = e.target.value;

    if (regimenId !== "") {
      RegimenTypeOther(regimenId);
    } else {
      setRegimenTypeOther([]);
    }
  };
  const handleSelectedRegimenOI = (e) => {
    const regimenId = e.target.value;

    if (regimenId !== "") {
      RegimenTypeOI(regimenId);
      if (regimenId === "15") {
        setIptType(true);
      } else {
        setIptType(false);
      }
    } else {
      setRegimenTypeOI([]);
    }
  };
  const handleSelectedRegimenTB = (e) => {
    const regimenId = e.target.value;

    if (regimenId !== "") {
      RegimenTypeTB(regimenId);
    } else {
      setRegimenTypeTB([]);
    }
  };
  const handleSelectedRegimenCombination = (e) => {
    const regimenId = e.target.value;
    if (regimenId !== "") {
      RegimenDrug(regimenId);
      //setShowRegimen(true)
    } else {
      setRegimenType([]);
      //setShowRegimen(false)
    }
    setObjValues({ ...objValues, [e.target.name]: e.target.value });
  };
  const handleSelectedRegimenCombinationOI = (e) => {
    const regimenId = e.target.value;
    if (regimenId !== "") {
      RegimenDrugOI(regimenId);
      //setShowRegimen(true)
    } else {
      setRegimenTypeOI([]);
      //setShowRegimen(false)
    }
    setObjValues({ ...objValues, [e.target.name]: e.target.value });
  };
  const handleSelectedRegimenCombinationTB = (e) => {
    const regimenId = e.target.value;
    if (regimenId !== "") {
      RegimenDrugTB(regimenId);
      //setShowRegimen(true)
    } else {
      setRegimenTypeTB([]);
      //setShowRegimen(false)
    }
    setObjValues({ ...objValues, [e.target.name]: e.target.value });
  };
  const handleSelectedRegimenCombinationOthers = (e) => {
    const regimenId = e.target.value;
    if (regimenId !== "") {
      RegimenDrugOther(regimenId);
      //setShowRegimenOthers(true)
    } else {
      setRegimenTypeTB([]);
      //setShowRegimenOthers(false)
    }
    setObjValues({ ...objValues, [e.target.name]: e.target.value });
  };
  const handleCheckBoxRegimen = (e) => {
    const originalCombination = regimenDrug;
    if (e.target.checked) {
      const newObjCombination = selectedCombinedRegimen.map((x) => {
        x["dispense"] = "";
        x["prescribed"] = "";
        x["dosage"] = "";
        //x['freqency']=""
        x["duration"] = objValues.refillPeriod;
        x["regimenId"] = regimenDrug[0].regimenId;
        x["regimenName"] = regimenDrug[0].regimenName;
        return x;
      });
      setRegimenDrug(newObjCombination);
    } else {
      RegimenDrug(objValues.regimenId);
    }
  };

  const handlRefillPeriod = (e) => {
    let refillcount = "";
    if (e.target.value === "30") {
      refillcount = e.target.value - 2;
    } else if (e.target.value === "60") {
      refillcount = e.target.value - 4;
    } else if (e.target.value === "90") {
      refillcount = e.target.value - 6;
    } else if (e.target.value === "120") {
      refillcount = e.target.value - 8;
    } else if (e.target.value === "160") {
      refillcount = e.target.value - 10;
    } else if (e.target.value === "180") {
      refillcount = e.target.value - 12;
    } else {
      refillcount = e.target.value;
    }
    refillPeriodValue = refillcount;
    const visitDate = objValues.visitDate;
    const nextrefillDate = moment(visitDate, "YYYY-MM-DD")
      .add(refillcount, "days")
      .toDate();
    const nextDate = moment(nextrefillDate).format("YYYY-MM-DD");
    objValues.refillPeriod = e.target.value;
    setObjValues({ ...objValues, refillPeriod: e.target.value });
    setObjValues({ ...objValues, nextAppointment: nextDate });

    if (refillcount === "90") {
      setShowmmdType(true);
      setmmdType("MMD-3");
    } else if (refillcount === "120") {
      setShowmmdType(true);
      setmmdType("MMD-4");
    } else if (refillcount === "150") {
      setShowmmdType(true);
      setmmdType("MMD-5");
    } else if (refillcount === "180") {
      setShowmmdType(true);
      setmmdType("MMD-6");
    } else {
      setShowmmdType(false);
      setmmdType("");
    }
  };
  const handleCheckBox = (e) => {
    if (e.target.checked) {
      setObjValues({ ...objValues, [e.target.name]: true });
    }
  };

  const handleFormChange = (index, event) => {
    let data = [...regimenDrug];
    const prescribedQuantity = data[index]["frequency"] * data[index]["duration"];
    if (event.target.name === "dispense" && event.target.value > prescribedQuantity) {
      event.target.value = prescribedQuantity;
      data[index][event.target.name] = prescribedQuantity;
    } else {
      data[index][event.target.name] = event.target.value;
    }
    data[index]["prescribed"] = prescribedQuantity;
    setRegimenDrug(data);
  };

  const addDrug = (e) => {
    setRegimenDrugList([...regimenDrugList, ...regimenDrug]);
  };
  /* Remove ADR  function **/
  const removeAttempt = (index) => {
    regimenDrugList.splice(index, 1);
    setRegimenDrugList([...regimenDrugList]);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    // if (dsdDevolvement === null) {
    //   toast.error("No recent DSD, unable to proceed", {
    //     position: toast.POSITION.BOTTOM_CENTER,
    //   });
    //   setSaving(false);
    //   return;
    // }
    objValues.adverseDrugReactions = selectedOptionAdr;
    objValues.personId = props.patientObj.id;
    objValues.extra["regimens"] = regimenDrugList;
    objValues.mmdType = mmdType;
    //delete regimenList['name']
    objValues.regimen = regimenDrugList;

    axios
      .put(
        `${baseUrl}hiv/art/pharmacy/${props.activeContent.obj.id}`,
        objValues,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setSaving(false);
        //props.PharmacyList();
        //props.PatientCurrentObject();
        toast.success("Pharmacy drug refill successful", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setOIRegimenLine([]);
        props.setActiveContent({
          ...props.activeContent,
          route: "pharmacy",
          activeTab: "history",
        });
        setObjValues({
          adherence: "",
          adrScreened: "",
          adverseDrugReactions: {},
          dsdModel: "",
          isDevolve: "",
          extra: {},
          facilityId: 2,
          mmdType: null,
          nextAppointment: null,
          personId: props.patientObj.id,
          refillPeriod: null,
          prescriptionError: null,
          regimenId: [],
          regimenTypeId: "",
          visitDate: null,
          visitId: 0,
          refill: "",
          refillType: "",
          switch: "",
          substitute: "",
          dsdModelType: "",
          iptType: "",
        });
        setRegimenDrugList([]);
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
          toast.error("Something went wrong, please try again...", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      });
  };

  let TotalDispensed = regimenDrug.reduce(function (prev, current) {
    return prev + +current.dispense;
  }, 0);
  let TotalPrescribed = regimenDrug.reduce(function (prev, current) {
    const duration =
      (current && current.frequency ? current.frequency : "") *
      current.duration;
    return prev + +duration;
  }, 0);

  return (
    <div>
      <div className="row">
        <div className="col-md-6">
          <h2>Pharmacy Drug Refill</h2>
        </div>

        <Card className={classes.root}>
          <CardBody>
            <form>
              <div className="row">
                <div className="row">
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="artDate">
                        Encounter Date <span style={{color: "red"}}> *</span>{" "}
                      </Label>
                      <Input
                          type="date"
                          name="visitDate"
                          id="visitDate"
                          onChange={handleInputChange}
                          value={objValues.visitDate}
                          min={enrollDate}
                          max={moment(new Date()).format("YYYY-MM-DD")}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                          }}
                          disabled={disabledField}
                          onKeyPress={(e) => e.preventDefault()}
                      />
                    </FormGroup>
                  </div>
                </div>
                {vital.bodyWeight !== "" && vital.height !== "" && (
                    <>
                      <div className="row">
                        <div className=" mb-3 col-md-3">
                          <FormGroup>
                            <Label>Body Weight</Label>
                            <InputGroup>
                              <Input
                                  type="text"
                                  name="bodyWeight"
                                  id="bodyWeight"
                                  min="3"
                                  value={vital.bodyWeight}
                                  max="150"
                                  disabled
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
                          </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-3">
                          <FormGroup>
                            <Label>Height</Label>
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
                                  type="text"
                                  name="height"
                                  id="height"
                                  disabled
                                  value={vital.height}
                                  min="48.26"
                                  max="216.408"
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
                                        ((vital.height * vital.height) / 100)
                                    ).toFixed(2)}
                                  </InputGroupText>
                                </InputGroup>
                              </FormGroup>
                          )}
                        </div>
                      </div>
                    </>
                )}
                <div className="row">
                  <div className="form-group mb-3 col-md-3">
                    <FormGroup>
                      <Label>Visit Type</Label>
                      <Input
                          type="select"
                          name="visitType"
                          id="visitType"
                          value={objValues.visitType}
                          onChange={handleInputChange}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                          }}
                          disabled={disabledField}
                      >
                        <option value="">Select</option>
                        <option value="Initial Visit">Initial Visit</option>
                        <option value="Follow Up Visit">
                          Follow Up Visit{" "}
                        </option>
                      </Input>
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-3">
                    <FormGroup>
                      <Label>Refill</Label>
                      <Input
                          type="select"
                          name="refill"
                          id="refill"
                          value={objValues.refill}
                          onChange={handleInputChange}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                          }}
                          disabled={disabledField}
                      >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </Input>
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="artDate">
                        Encounter Date <span style={{color: "red"}}> *</span>
                      </Label>
                      <Input
                          type="date"
                          name="visitDate"
                          id="visitDate"
                          onChange={handleInputChange}
                          value={objValues.visitDate}
                          min={enrollDate !== "" ? enrollDate : ""}
                          max={moment(new Date()).format("YYYY-MM-DD")}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                          }}
                          disabled={disabledField}
                          onKeyPress={(e) => e.preventDefault()}
                      />
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label>Substitution/Switch </Label>
                      <Input
                          type="select"
                          name="refillType"
                          id="refillType"
                          value={objValues.refillType}
                          disabled={disabledField}
                          onChange={handleInputChange}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                          }}
                      >
                        <option value="">Select</option>

                        <option value="Switch">Switch</option>
                        <option value="Substitution">Substitution</option>
                        <option value="None">None</option>
                      </Input>
                    </FormGroup>
                  </div>
                </div>
                <div className="row">
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label>
                        Refill Period(days){" "}
                        <span style={{color: "red"}}> *</span>
                      </Label>
                      <Input
                          type="select"
                          name="refillPeriod"
                          id="refillPeriod"
                          value={objValues.refillPeriod}
                          disabled={objValues.visitDate !== null ? false : true}
                          onChange={handlRefillPeriod}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                          }}
                      >
                        <option value="">Select</option>
                        <option value="15">15</option>
                        <option value="30">30</option>
                        <option value="60">60</option>
                        <option value="90">90</option>
                        <option value="120">120</option>
                        <option value="150">150</option>
                        <option value="180">180</option>
                      </Input>
                    </FormGroup>
                  </div>

                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="artDate">
                        {" "}
                        Date of Next Appointment{" "}
                        <span style={{color: "red"}}> *</span>{" "}
                      </Label>
                      <Input
                          type="date"
                          name="nextAppointment"
                          id="nextAppointment"
                          min={enrollDate}
                          disabled={
                            objValues.refillPeriod !== null ? false : true
                          }
                          onChange={handleInputChange}
                          value={objValues.nextAppointment}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                          }}
                          required
                          onKeyPress={(e) => e.preventDefault()}
                      />
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="">Client on DSD?</Label>
                      <Input
                          type="select"
                          name="clientDsdStatus"
                          id="clientDsdStatus"
                          disabled={true}
                          value={clientDsdStatus}
                      >
                        <option value="Yes">Yes</option>
                        // Add options for Yes and No
                        <option value="No">No</option>
                      </Input>
                    </FormGroup>
                  </div>
                  {showmmdType && (
                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label>MMD Type</Label>
                          <Input
                              type="text"
                              name="mmdType"
                              id="mmdType"
                              disabled="true"
                              value={mmdType}
                              onChange={handleInputChange}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.25rem",
                              }}
                          />
                        </FormGroup>
                      </div>
                  )}
                </div>
                {eacStatusObj &&
                    eacStatusObj.eacsession &&
                    eacStatusObj.eacsession !== "Default" && (
                        <>
                          <h3>Ehanced Adherance Counseling</h3>
                          <div className="row">
                            <div className="form-group mb-3 col-md-3">
                              <FormGroup>
                                <Label>Viral Load Result</Label>
                                <Input
                                    type="date"
                                    name="deliveryPoint"
                                    id="deliveryPoint"
                                    disabled
                                />
                              </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-3">
                              <FormGroup>
                                <Label>Date of Last Viral Load</Label>
                                <Input
                                    type="date"
                                    name="deliveryPoint"
                                    id="deliveryPoint"
                                    disabled
                                    onKeyPress={(e) => e.preventDefault()}
                                />
                              </FormGroup>
                            </div>

                            <div className="form-group mb-3 col-md-3">
                              <FormGroup>
                                <Label>EAC Status</Label>
                                <p>Second Session</p>
                              </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-3">
                              <FormGroup>
                                <Label>Date of EAC</Label>
                                <Input
                                    type="date"
                                    name="deliveryPoint"
                                    id="deliveryPoint"
                                    disabled
                                    onKeyPress={(e) => e.preventDefault()}
                                />
                              </FormGroup>
                            </div>
                          </div>
                        </>
                    )}
                <hr/>
                <LabelSui
                    as="a"
                    color="teal"
                    style={{width: "106%", height: "35px"}}
                    ribbon
                >
                  <h4 style={{color: "#fff"}}>ART DRUGS</h4>
                </LabelSui>
                <br/>
                <div className="form-group mb-3 col-md-6">
                  <FormGroup>
                    <Label>Select Regimen Line </Label>
                    <Input
                        type="select"
                        name="regimen"
                        id="regimen"
                        value={objValues.drugName}
                        onChange={handleSelectedRegimen}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                        disabled={objValues.refillPeriod !== null ? false : true}
                    >
                      <option value="">Select</option>
                      {patientAge >= 15 && (
                          <>
                            {adultArtRegimenLine.map((value) => (
                                <option key={value.id} value={value.id}>
                                  {value.description}
                                </option>
                            ))}
                          </>
                      )}
                      {patientAge < 15 && (
                          <>
                            {childRegimenLine.map((value) => (
                                <option key={value.id} value={value.id}>
                                  {value.description}
                                </option>
                            ))}
                          </>
                      )}
                    </Input>
                  </FormGroup>
                </div>

                <div className="form-group mb-3 col-md-6">
                  <FormGroup>
                    <Label>Regimen </Label>

                    <Input
                        type="select"
                        name="regimenId"
                        id="regimenId"
                        value={objValues.regimenId}
                        onChange={handleSelectedRegimenCombination}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                        disabled={objValues.refillPeriod !== null ? false : true}
                    >
                      <option value="">Select</option>

                      {regimenType.map((value) => (
                          <option key={value.id} value={value.value}>
                            {value.label}
                          </option>
                      ))}
                    </Input>
                  </FormGroup>
                </div>
                <LabelSui
                    as="a"
                    color="teal"
                    style={{width: "106%", height: "35px"}}
                    ribbon
                >
                  <h4 style={{color: "#fff"}}>OI DRUGS</h4>
                </LabelSui>
                <br/>
                <div className="form-group mb-3 col-xs-6 col-sm-6 col-md-6 col-lg-6">
                  <FormGroup>
                    <Label>OI's </Label>
                    <Input
                        type="select"
                        name="regimen"
                        id="regimen"
                        // value={objValues.drugName}
                        value={
                          iptEligibilty.IPTEligibility === true && tptCareAndSupportRegimen !== ""
                              ? 15
                              : objValues.drugName
                        }
                        onChange={handleSelectedRegimenOI}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                        disabled={objValues.refillPeriod !== null ? false : true
                            || (iptEligibilty.IPTEligibility === true && tptCareAndSupportRegimen !== "")}
                    >
                      <option value="">Select</option>
                      {patientAge > 15 && (
                          <>
                            {/* If IPTEligibility is true */}
                            {iptEligibilty.IPTEligibility === true ? (
                                <>
                                  {/* If tpeCareAndSupport is also true, show only x.id === 15 */}
                                  {tptCareAndSupportRegimen !== "" ? (
                                      <>
                                        {oIRegimenLine
                                            .filter((x) => x.id === 15) // Only show option with id 15
                                            .map((value) => (
                                                <option key={value.id} value={value.id}>
                                                  {value.description}
                                                </option>
                                            ))}
                                      </>
                                  ) : (
                                      <>
                                        {/* Otherwise, show all options */}
                                        {oIRegimenLine.map((value) => (
                                            <option key={value.id} value={value.id}>
                                              {value.description}
                                            </option>
                                        ))}
                                      </>
                                  )}
                                </>
                            ) : (
                                <>
                                  {/* If IPTEligibility is false, exclude id === 15 */}
                                  {oIRegimenLine
                                      .filter((x) => x.id !== 15)
                                      .map((value) => (
                                          <option key={value.id} value={value.id}>
                                            {value.description}
                                          </option>
                                      ))}
                                </>
                            )}
                          </>
                      )}
                      {patientAge <= 15 && (
                          <>
                            {iptEligibilty.IPTEligibility === true ? ( //Logic to check for TPT eligibility to filter TPT drugs for children
                                <>
                                  {oIRegimenLine.map((value) => (
                                      <option key={value.id} value={value.id}>
                                        {value.description}
                                      </option>
                                  ))}
                                </>
                            ) : (
                                <>
                                  {oIRegimenLine
                                      .filter((x) => x.id !== 15)
                                      .map((value) => (
                                          <option key={value.id} value={value.id}>
                                            {value.description}
                                          </option>
                                      ))}
                                </>
                            )}
                          </>
                      )}
                    </Input>
                  </FormGroup>
                </div>


                <div className="form-group mb-3 col-md-6">
                  <FormGroup>
                    <Label>Drugs</Label>
                    <Input
                        type="select"
                        name="regimenId"
                        id="regimenId"
                        value={objValues.regimenId}
                        onChange={handleSelectedRegimenCombinationOI}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                        disabled={objValues.refillPeriod !== null ? false : true}
                    >
                      <option value="">Select</option>

                      {regimenTypeOI.map((value) => (
                          <option key={value.id} value={value.value}>
                            {value.label}
                          </option>
                      ))}
                    </Input>
                  </FormGroup>
                </div>

                {iptEligibilty.IPTEligibility === true && ( //iptEligibilty check to display Visit type
                    <div className="form-group mb-3 col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <FormGroup>
                        <Label>Visit Type</Label>

                        <Input
                            type="select"
                            name="iptType"
                            id="iptType"
                            value={objValues.iptType}
                            onChange={handleInputChange}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.25rem",
                            }}
                        >
                          <option value="">Select</option>

                          {iptType.map((value) => (
                              <option key={value.id} value={value.code}>
                                {value.display}
                              </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </div>
                )}

                <LabelSui
                    as="a"
                    color="blue"
                    style={{width: "106%", height: "35px"}}
                    ribbon
                >
                  <h4 style={{color: "#fff"}}>TB DRUG</h4>
                </LabelSui>
                <br/>
                <div className="form-group mb-3 col-md-6">
                  <FormGroup>
                    <Label>TB Treatment </Label>
                    <Input
                        type="select"
                        name="regimen"
                        id="regimen"
                        value={objValues.drugName}
                        onChange={handleSelectedRegimenTB}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                        disabled={objValues.refillPeriod !== null ? false : true}
                    >
                      <option value="">Select</option>
                      {patientAge > 15 && (
                          <>
                            {tbRegimenLine.map((value) => (
                                <option key={value.id} value={value.id}>
                                  {value.description}
                                </option>
                            ))}
                          </>
                      )}
                      {patientAge <= 15 && (
                          <>
                            {childrenTB.map((value) => (
                                <option key={value.id} value={value.id}>
                                  {value.description}
                                </option>
                            ))}
                          </>
                      )}
                    </Input>
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-6">
                  <FormGroup>
                    <Label>Drugs </Label>

                    <Input
                        type="select"
                        name="regimenId"
                        id="regimenId"
                        value={objValues.regimenId}
                        onChange={handleSelectedRegimenCombinationTB}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                        disabled={objValues.refillPeriod !== null ? false : true}
                    >
                      <option value="">Select</option>

                      {regimenTypeTB.map((value) => (
                          <option key={value.id} value={value.value}>
                            {value.label}
                          </option>
                      ))}
                    </Input>
                  </FormGroup>
                </div>
                <LabelSui
                    as="a"
                    color="blue"
                    style={{width: "106%", height: "35px"}}
                    ribbon
                >
                  <h4 style={{color: "#fff"}}>OTHER DRUG</h4>
                </LabelSui>
                <br/>
                <div className="form-group mb-3 col-xs-6 col-sm-6 col-md-6 col-lg-6">
                  <FormGroup>
                    <Label>Other Drugs </Label>

                    <Input
                        type="select"
                        name="regimen"
                        id="regimen"
                        value={objValues.drugName}
                        onChange={handleSelectedRegimenOther}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                        disabled={objValues.refillPeriod !== null ? false : true}
                    >
                      <option value="">Select</option>

                      {otherDrugs.map((value) => (
                          <option key={value.id} value={value.value}>
                            {value.label}
                          </option>
                      ))}
                    </Input>
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-xs-6 col-sm-6 col-md-6 col-lg-6">
                  <FormGroup>
                    <Label>Drug</Label>
                    <Input
                        type="select"
                        name="regimenId"
                        id="regimenId"
                        value={objValues.regimenId}
                        onChange={handleSelectedRegimenCombinationOthers}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                        disabled={objValues.refillPeriod !== null ? false : true}
                    >
                      <option value="">Select</option>
                      {regimenTypeOther.map((value) => (
                          <option key={value.id} value={value.value}>
                            {value.label}
                          </option>
                      ))}
                    </Input>
                  </FormGroup>
                </div>

                {regimenDrug && regimenDrug.length > 0 ? (
                    <>
                      <Card>
                        <CardBody>
                          <h4>Drugs Information </h4>
                          <div className="form-check custom-checkbox ml-1 ">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                name="devolvePatient"
                                id="devolvePatient"
                                onChange={handleCheckBoxRegimen}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.25rem",
                                }}
                            />
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                            >
                              As no combination
                            </label>
                          </div>
                          <div className="row">
                            <div className="form-group mb-3 col-md-4">
                              Regimen Name{" "}
                            </div>
                            <div className="form-group mb-3 col-md-2">
                              Frequency{" "}
                            </div>
                            <div className="form-group mb-3 col-md-2">
                              Duration{" "}
                            </div>
                            <div className="form-group mb-3 col-md-2">
                              Quantity Prescribed
                            </div>
                            <div className="form-group mb-3 col-md-2">
                              Quantity Dispensed
                            </div>
                          </div>
                          {regimenDrug.map((input, index) => (
                              <>
                                <div className="row">
                                  <div className="form-group mb-3 col-md-4">
                                    <FormGroup>
                                      <Label>
                                        <b>
                                          {input.name}{" "}
                                          {input.strength !== ""
                                              ? input.strength
                                              : ""}
                                        </b>
                                      </Label>
                                      <Input
                                          type="hidden"
                                          name="id"
                                          id="id"
                                          value={input.id}
                                          onChange={(event) =>
                                              handleFormChange(index, event)
                                          }
                                          required
                                      ></Input>
                                    </FormGroup>
                                  </div>

                                  <div className="form-group mb-3 col-md-2">
                                    <FormGroup>
                                      <Input
                                          type="select"
                                          name="frequency"
                                          id="frequency"
                                          value={input.frequency}
                                          style={{
                                            border: "1px solid #014D88",
                                            borderRadius: "0.25rem",
                                          }}
                                          onChange={(event) =>
                                              handleFormChange(index, event)
                                          }
                                          required
                                      >
                                        <option value="">Select</option>
                                        <option value="2">BD</option>
                                        <option value="1">OD</option>
                                        <option value="4">2BD</option>
                                        <option value="6">OD/BD</option>
                                        <option value="8">QDS</option>
                                        <option value="10">3ce/Week</option>
                                      </Input>
                                    </FormGroup>
                                  </div>
                                  <div className="form-group mb-3 col-md-2">
                                    <FormGroup>
                                      <Input
                                          type="number"
                                          name="duration"
                                          id="duration"
                                          value={input.duration}
                                          style={{
                                            border: "1px solid #014D88",
                                            borderRadius: "0.25rem",
                                          }}
                                          onChange={(event) =>
                                              handleFormChange(index, event)
                                          }
                                          //disabled
                                      ></Input>
                                    </FormGroup>
                                  </div>
                                  <div className="form-group mb-3 col-md-2">
                                    <FormGroup>
                                      <Input
                                          type="text"
                                          name="prescribed"
                                          id="prescribed"
                                          value={
                                            input.frequency && input.frequency !== ""
                                                ? input.frequency * input.duration
                                                : 0
                                          }
                                          style={{
                                            border: "1px solid #014D88",
                                            borderRadius: "0.25rem",
                                          }}
                                          onChange={(event) =>
                                              handleFormChange(index, event)
                                          }
                                          disabled
                                      ></Input>
                                    </FormGroup>
                                  </div>
                                  <div className="form-group mb-3 col-md-2">
                                    <FormGroup>
                                      <Input
                                          type="number"
                                          name="dispense"
                                          id="dispense"
                                          value={input.dispense}
                                          style={{
                                            border: "1px solid #014D88",
                                            borderRadius: "0.25rem",
                                          }}
                                          onChange={(event) =>
                                              handleFormChange(index, event)
                                          }
                                          required
                                      ></Input>
                                    </FormGroup>
                                  </div>
                                </div>
                              </>
                          ))}
                          <div className="row">
                            <div className="form-group mb-3 col-md-4"></div>

                            <div className="form-group mb-3 col-md-2"></div>
                            <div className="form-group mb-3 col-md-2"></div>
                            <div className="form-group mb-3 col-md-2">
                              <b>Total : {TotalPrescribed}</b>
                            </div>
                            <div className="form-group mb-3 col-md-2">
                              <b>Total : {TotalDispensed}</b>
                            </div>
                          </div>
                          <div className="row">
                            <div className="form-group mb-3 col-md-2 float-end">
                              <LabelSui
                                  as="a"
                                  color="black"
                                  onClick={addDrug}
                                  size="small"
                                  style={{marginTop: 35}}
                              >
                                <Icon name="plus"/> Add
                              </LabelSui>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                      <br/>
                      <br/>
                    </>
                ) : (
                    ""
                )}
                {regimenDrugList.length > 0 ? (
                    <List>
                      <Table striped responsive>
                        <thead>
                        <tr>
                          <th>Regimen Drug</th>
                          <th>Frequency</th>
                          <th>Duration</th>
                          <th>Quantity Prescribed</th>
                          <th>Quantity Dispensed</th>

                          <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {regimenDrugList.map((regimenDrugObj, index) => (
                            <DrugDispensedLists
                                key={index}
                                index={index}
                                regimenDrugObj={regimenDrugObj}
                                removeAttempt={removeAttempt}
                            />
                        ))}
                        </tbody>
                      </Table>
                    </List>
                ) : (
                    ""
                )}
              </div>
              {saving ? <Spinner/> : ""}
              <br/>
              {regimenDrugList.length > 0 && (
                  <MatButton
                      type="submit"
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      startIcon={<SaveIcon/>}
                      hidden={disabledField}
                      onClick={handleSubmit}
                      style={{backgroundColor: "#014d88"}}
                      disabled={saving}
                  >
                    {!saving ? (
                        <span style={{textTransform: "capitalize"}}>Update</span>
                    ) : (
                        <span style={{textTransform: "capitalize"}}>
                      Updating...
                    </span>
                    )}
                  </MatButton>
              )}
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

function DrugDispensedLists({regimenDrugObj, index, removeAttempt}) {
  function FrequencyLabel(count) {
    if (count === "1") {
      return "OD";
    } else if (count === "2") {
      return "BD";
    } else if (count === "4") {
      return "2BD";
    } else if (count === "6") {
      return "OD/BD";
    } else if (count === "8") {
      return "QDS";
    } else if (count === "10") {
      return "3ce/Week";
    } else {
      return "";
    }
  }

  return (
      <tr>
        <th>
          {regimenDrugObj.name ? regimenDrugObj.name : regimenDrugObj.regimenName}{" "}
          {regimenDrugObj.strength !== "" ? regimenDrugObj.strength : ""}
        </th>
        <th>{FrequencyLabel(regimenDrugObj.frequency)}</th>
        <th>{regimenDrugObj.duration}</th>
        <th>{regimenDrugObj.prescribed}</th>
        <th>{regimenDrugObj.dispense}</th>
        <th></th>
        <th>
          <IconButton
              aria-label="delete"
              size="small"
              color="error"
              onClick={() => removeAttempt(index)}
          >
            <DeleteIcon fontSize="inherit"/>
          </IconButton>
        </th>
      </tr>
  );
}

export default Pharmacy;
