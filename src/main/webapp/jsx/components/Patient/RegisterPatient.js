import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import MatButton from "@material-ui/core/Button";
import Button from "@material-ui/core/Button";
import { FormGroup, Label, Spinner, Input, Form } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckSquare,
  faCoffee,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import * as moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import AddIcon from "@material-ui/icons/Add";
import CancelIcon from "@material-ui/icons/Cancel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { Link, useHistory, useLocation } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";
import { token, url as baseUrl } from "../../../api";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./patient.css";
import { Modal } from "react-bootstrap";
import { Label as LabelSui } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";

library.add(faCheckSquare, faCoffee, faEdit, faTrash);

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
    //maxWidth: 752,
    //flexGrow: 1,
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

const UserRegistration = (props) => {
  const history = useHistory();
  const location = useLocation();
  const locationState = location.state;

  let patientId = null;
  patientId = locationState ? locationState.patientId : null;
  let patientObj = locationState
    ? locationState.patientObj
    : {
        active: true,
        streetAddress: "",
        address: [],
        contact: [],
        contactPoint: [],
        dateOfBirth: "",
        deceased: false,
        deceasedDateTime: null,
        firstName: "",
        genderId: "",
        identifier: "",
        otherName: "",
        maritalStatusId: "",
        educationId: "",
        employmentStatusId: "",
        dateOfRegistration: "",
        isDateOfBirthEstimated: null,
        age: "",
        phoneNumber: "",
        altPhonenumber: "",
        dob: "",
        countryId: 1,
        stateId: "",
        district: "",
        sexId: "",
        ninNumber: "",
      };
  const [basicInfo, setBasicInfo] = useState(patientObj);
  const [relatives, setRelatives] = useState({
    address: "",
    phone: "",
    firstName: "",
    email: "",
    relationshipId: "",
    lastName: "",
    middleName: "",
  });
  const [today, setToday] = useState(
    new Date().toISOString().substr(0, 10).replace("T", " ")
  );
  const [contacts, setContacts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [disabledAgeBaseOnAge, setDisabledAgeBaseOnAge] = useState(false);
  const [ageDisabled, setAgeDisabled] = useState(true);
  const [showRelative, setShowRelative] = useState(false);
  //const [editRelative, setEditRelative] = useState(null);
  const [genders, setGenders] = useState([]);
  const [maritalStatusOptions, setMaritalStatusOptions] = useState([]);
  const [educationOptions, setEducationOptions] = useState([]);
  const [occupationOptions, setOccupationOptions] = useState([]);
  const [relationshipOptions, setRelationshipOptions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [errors, setErrors] = useState({});
  const [topLevelUnitCountryOptions, settopLevelUnitCountryOptions] = useState(
    []
  );
  const [patientDTO, setPatientDTO] = useState({
    person: "",
    hivEnrollment: "",
  });
  const userDetail =
    props.location && props.location.state ? props.location.state.user : null;
  const classes = useStyles();

  //HIV INFORMATION
  const [femaleStatus, setfemaleStatus] = useState(false);
  const [dateValidate, setDateValidate] = useState(false);
  //const [values, setValues] = useState([]);
  const [objValues, setObjValues] = useState({
    id: "",
    uniqueId: "",
    dateOfRegistration: "",
    entryPointId: "",
    facilityName: "",
    statusAtRegistrationId: "",
    dateConfirmedHiv: "",
    sourceOfReferrerId: "",
    enrollmentSettingId: "",
    pregnancyStatusId: "",
    dateOfLpm: "",
    tbStatusId: "",
    targetGroupId: "",
    ovc_enrolled: "",
    ovcNumber: "",
    houseHoldNumber: "",
    referredToOVCPartner: "",
    dateReferredToOVCPartner: "",
    referredFromOVCPartner: "",
    dateReferredFromOVCPartner: "",
    careEntryPointOther: "",
    ovcUniqueId: "",
    lipName: "",
  });
  const [carePoints, setCarePoints] = useState([]);
  const [sourceReferral, setSourceReferral] = useState([]);
  const [hivStatus, setHivStatus] = useState([]);
  const [enrollSetting, setEnrollSetting] = useState([]);
  const [tbStatus, setTbStatus] = useState([]);
  const [kP, setKP] = useState([]);
  const [pregnancyStatus, setPregnancyStatus] = useState([]);
  //set ro show the facility name field if is transfer in
  const [transferIn, setTransferIn] = useState(false);
  // display the OVC number if patient is enrolled into OVC

  const [isChecked, setChecked] = useState(false);
  const [ovcEnrolled, setOvcEnrolled] = useState(false);
  //Input fields to hidden base on some conditions
  const [hideTargetGroup, setHideTargetGroup] = useState("false");
  //status for hospital Number
  const [hospitalNumStatus, setHospitalNumStatus] = useState(false);
  const [hospitalNumStatus2, setHospitalNumStatus2] = useState(false);
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen(!open);
  const [sexVal, setSexVal] = useState("");

  useEffect(() => {
    handleSexId(basicInfo?.gender);
    handleDobChange(basicInfo?.birthDate);
    loadGenders();
    loadMaritalStatus();
    loadEducation();
    loadOccupation();
    loadRelationships();
    loadTopLevelCountry();
    CareEntryPoint();
    SourceReferral();
    HivStatus();
    EnrollmentSetting();
    TBStatus();
    KP();
    PregnancyStatus();
    GetCountry();
    setStateByCountryId();
    if (basicInfo.dateOfRegistration < basicInfo.dob) {
      toast.error("Date of registration can not be earlier than date of birth");
    }
  }, [basicInfo.dateOfRegistration]);

  const loadGenders = useCallback(async () => {
    try {
      const response = await axios.get(
        `${baseUrl}application-codesets/v2/SEX`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGenders(response.data.sort());
    } catch (e) {}
  }, []);
  const loadMaritalStatus = useCallback(async () => {
    try {
      const response = await axios.get(
        `${baseUrl}application-codesets/v2/MARITAL_STATUS`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMaritalStatusOptions(response.data.sort());
    } catch (e) {}
  }, []);
  const loadEducation = useCallback(async () => {
    try {
      const response = await axios.get(
        `${baseUrl}application-codesets/v2/EDUCATION`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEducationOptions(response.data.sort());
    } catch (e) {}
  }, []);
  const loadOccupation = useCallback(async () => {
    try {
      const response = await axios.get(
        `${baseUrl}application-codesets/v2/OCCUPATION`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOccupationOptions(response.data.sort());
    } catch (e) {}
  }, []);
  const loadRelationships = useCallback(async () => {
    try {
      const response = await axios.get(
        `${baseUrl}application-codesets/v2/RELATIONSHIP`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRelationshipOptions(response.data.sort());
    } catch (e) {}
  }, []);
  const loadTopLevelCountry = useCallback(async () => {
    const response = await axios.get(
      `${baseUrl}organisation-units/parent-organisation-units/0`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    settopLevelUnitCountryOptions(response.data.sort());
  }, []);
  const loadOrganisationUnitsByParentId = async (parentId) => {
    const response = await axios.get(
      `${baseUrl}organisation-units/parent-organisation-units/${parentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  };

  //Country List
  const GetCountry = () => {
    axios
      .get(`${baseUrl}organisation-units/parent-organisation-units/0`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        
      });
  };
  //Get States from selected country
  const getStates = (e) => {
    const getCountryId = e.target.value;
    setStateByCountryId(1);
    setBasicInfo({ ...basicInfo, countryId: getCountryId });
  };
  //Get list of State
  function setStateByCountryId() {
    axios
      .get(`${baseUrl}organisation-units/parent-organisation-units/1`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        
        setStates(response.data.sort());
      })
      .catch((error) => {
        
      });
  }
  //fetch province
  const getProvinces = (e) => {
    const stateId = e.target.value;
    setBasicInfo({ ...basicInfo, stateId: e.target.value });
    axios
      .get(
        `${baseUrl}organisation-units/parent-organisation-units/${stateId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setProvinces(response.data.sort());
      })
      .catch((error) => {
        
      });
  };
  //Date of Birth and Age handle
  // const handleDobChange = (e) => {
  //   let dob = e !== null ? e : e?.target?.value;
  //   if (dob) {
  //     const today = new Date();
  //     const birthDate = new Date(dob);
  //     let age_now = today.getFullYear() - birthDate.getFullYear();
  //     const m = today.getMonth() - birthDate.getMonth();
  //     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
  //       age_now--;
  //     }
  //     basicInfo.age = age_now;

  //     if (basicInfo?.enrolledInOvcProgram === "YES") {
  //       setChecked(true);
  //       setOvcEnrolled(true);
  //     }
  //     //setBasicInfo({...basicInfo, age: age_now});
  //   } else {
  //     setBasicInfo({ ...basicInfo, age: "" });
  //   }
  //   setBasicInfo({ ...basicInfo, dob: dob });
  //   if (basicInfo.age !== "" && basicInfo.age >= 60) {
  //     toggle();
  //   }
  // };

  const handleDobChange = (e) => {
    let dob = e?.target?.value || (typeof e === 'string' ? e : null);
    // Check if dob is a valid date string
    if (dob && !isNaN(Date.parse(dob))) {
      setBasicInfo((prevInfo) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age_now = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age_now--;
        }
        if (basicInfo?.enrolledInOvcProgram === "YES") {
          setChecked(true);
          setOvcEnrolled(true);
        }
        return {
          ...prevInfo,
          age: age_now,
          dob: dob,
        };
      });

      if (basicInfo.age !== "" && basicInfo.age >= 60) {
        toggle();
      }
    } else {
      // console.error(`Invalid date format: ${dob}`);
    }
  };

  const handleDateOfBirthChange = (e) => {
    if (e.target.value === "Actual") {
      setAgeDisabled(true);
    } else if (e.target.value === "Estimated") {
      setAgeDisabled(false);
    }
  };
  const handleAgeChange = (e) => {
    const ageNumber = e.target.value.replace(/\D/g, "");
    if (!ageDisabled && ageNumber) {
      const currentDate = new Date();
      currentDate.setDate(15);
      currentDate.setMonth(5);
      const estDob = moment(currentDate.toISOString());
      const dobNew = estDob.add(ageNumber * -1, "years");
      //setBasicInfo({...basicInfo, dob: moment(dobNew).format("YYYY-MM-DD")});
      basicInfo.dob = moment(dobNew).format("YYYY-MM-DD");
      if (ageNumber !== "" && ageNumber >= 60) {
        toggle();
      }
    }
    setBasicInfo({ ...basicInfo, age: ageNumber });
  };

  // const handleAgeChange = (e) => {
  //     if (!ageDisabled && e.target.value) {
  //         setValue('age', e.target.value);
  //         const currentDate = new Date();
  //         currentDate.setDate(15);
  //         currentDate.setMonth(5);
  //         const estDob = moment(currentDate.toISOString());
  //         const dob = estDob.add((e.target.value * -1), 'years');
  //         setValue('dob', format(new Date(dob.toDate()), 'yyyy-MM-dd'));
  //         if(calculate_age(format(new Date(dob.toDate()), 'yyyy-MM-dd'))>=60){
  //             toggle()
  //         }
  //     }
  // }
  //End of Date of Birth and Age handling
  const handleSexId = (gender) => {
    if (gender === "Male") {
      setSexVal(376);
    } else {
      setSexVal(377);
    }
  };
  //Handle Input Change for Basic Infor
  const handleInputChangeBasic = (e) => {
    setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
    //manupulate inpute fields base on gender/sex
    if (
      (e.target.name === "sexId" && e.target.value === "377") ||
      sexVal === "377"
    ) {
      setfemaleStatus(true);
    } else {
      objValues.pregnancyStatusId = "";
      objValues.dateOfLpm = "";
    }
    if (e.target.name === "firstName" && e.target.value !== "") {
      const name = alphabetOnly(e.target.value);
      setBasicInfo({ ...basicInfo, [e.target.name]: name });
    }
    if (e.target.name === "lastName" && e.target.value !== "") {
      const name = alphabetOnly(e.target.value);
      setBasicInfo({ ...basicInfo, [e.target.name]: name });
    }
    if (e.target.name === "middleName" && e.target.value !== "") {
      const name = alphabetOnly(e.target.value);
      setBasicInfo({ ...basicInfo, [e.target.name]: name });
    }
    if (e.target.name === "ninNumber" && e.target.value !== "") {
      const ninNumberValue = checkNumberLimit(
        e.target.value.replace(/\D/g, "")
      );
      setBasicInfo({ ...basicInfo, [e.target.name]: ninNumberValue });
    }
    if (e.target.name === "hospitalNumber" && e.target.value !== "") {
      async function getHosiptalNumber() {
        const hosiptalNumber = e.target.value;
        const response = await axios.post(
          `${baseUrl}patient/exist/hospital-number`,
          hosiptalNumber,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "text/plain",
            },
          }
        );
        if (response.data !== true) {
          setHospitalNumStatus(false);
          errors.hospitalNumber = "";
          setObjValues({ ...objValues, uniqueId: e.target.value });
          setHospitalNumStatus2(true);
        } else {
          errors.hospitalNumber = "";
          toast.error("Error! Hosiptal Number already exist");
          setHospitalNumStatus(true);
          setHospitalNumStatus2(false);
        }
      }
      getHosiptalNumber();
    }
  };

  //Function to show relatives
  const handleAddRelative = () => {
    setShowRelative(true);
  };
  //Function to cancel the relatives form
  const handleCancelSaveRelationship = () => {
    setShowRelative(false);
  };
  /*****  Validation  Relationship Input*/
  const validateRelatives = () => {
    let temp = { ...errors };
    temp.firstName = relatives.firstName ? "" : "First Name is required";
    //temp.lastName = relatives.lastName ? "" : "Last Name  is required."
    //temp.phone = relatives.phone ? "" : "Phone Number  is required."
    temp.relationshipId = relatives.relationshipId
      ? ""
      : "Relationship Type is required.";
    setErrors({ ...temp });
    return Object.values(temp).every((x) => x == "");
  };
  //Function to add relatives
  const handleSaveRelationship = (e) => {
    if (validateRelatives()) {
      setContacts([...contacts, relatives]);
      setRelatives({
        address: "",
        phone: "",
        firstName: "",
        email: "",
        relationshipId: "",
        lastName: "",
        middleName: "",
      });
    }
  };
  const handleDeleteRelative = (index) => {
    contacts.splice(index, 1);
    setContacts([...contacts]);
  };
  const handleEditRelative = (relative, index) => {
    setRelatives(relative);
    setShowRelative(true);
    contacts.splice(index, 1);
  };
  const getRelationship = (relationshipId) => {
    const relationship = relationshipOptions.find(
      (obj) => obj.id == relationshipId
    );
    return relationship ? relationship.display : "";
  };
  const handleInputChangeRelatives = (e) => {
    setRelatives({ ...relatives, [e.target.name]: e.target.value });
  };
  /*****  Validation  */
  const validate = () => {
    let temp = { ...errors };
    temp.firstName =
      basicInfo.firstName || basicInfo.otherName
        ? ""
        : "First Name is required";
    temp.hospitalNumber = basicInfo.hospitalNumber
      ? ""
      : "Hospital Number  is required.";
    //temp.middleName = basicInfo.middleName ? "" : "Middle is required."

    temp.lastName = basicInfo.lastName ? "" : "Last Name  is required.";
    temp.sexId =
      basicInfo.sexId || basicInfo.gender ? "" : "Gender is required.";
    temp.dateOfRegistration = basicInfo.dateOfRegistration
      ? ""
      : "Date of Registration is required.";
    temp.educationId = basicInfo.educationId ? "" : "Education is required.";
    temp.streetAddress = basicInfo.streetAddress ? "" : "Address is required.";
    //temp.phoneNumber = basicInfo.phoneNumber ? "" : "Phone Number  is required."
    //temp.countryId = basicInfo.countryId ? "" : "Country is required.";
    temp.stateId = basicInfo.stateId ? "" : "State is required.";
    temp.district = basicInfo.district ? "" : "Province/LGA is required.";
    //HIV FORM VALIDATION
    temp.targetGroupId = objValues.targetGroupId
      ? ""
      : "Target group is required.";
    {
      objValues.statusAtRegistrationId !== "55" &&
        (temp.dateConfirmedHiv = objValues.dateConfirmedHiv
          ? ""
          : "date confirm HIV is required.");
    }
    temp.sourceOfReferrerId = objValues.sourceOfReferrerId
      ? ""
      : "Source of referrer is required.";
    temp.enrollmentSettingId = objValues.enrollmentSettingId
      ? ""
      : "Enrollment Setting Number  is required.";
    temp.tbStatusId = objValues.tbStatusId ? "" : "TB status is required.";
    temp.statusAtRegistrationId = objValues.statusAtRegistrationId
      ? ""
      : "Status at Registration is required.";
    temp.entryPointId = objValues.entryPointId
      ? ""
      : "Care Entry Point is required.";
    temp.dateOfRegistration = objValues.dateOfRegistration
      ? ""
      : "Date of Registration is required.";
    temp.uniqueId = objValues.uniqueId ? "" : "Unique ID is required.";
    {
      basicInfo.age > 9 &&
        basicInfo.sex === "Female" &&
        (temp.pregnancyStatusId = objValues.pregnancyStatusId
          ? ""
          : "This field is required.");
    }
    //basicInfo.sexId==='377'
    setErrors({ ...temp });
    return Object.values(temp).every((x) => x === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setSaving(true);
      let newConatctsInfo = [];
      //Manipulate relatives contact  address:"",
      const actualcontacts =
        contacts &&
        contacts.length > 0 &&
        contacts.map((x) => {
          const contactInfo = {
            address: {
              line: [x.address],
            },
            contactPoint: {
              type: "phone",
              value: x.phone,
            },
            firstName: x.firstName,
            fullName: x.firstName + " " + x.middleName + " " + x.lastName,
            relationshipId: x.relationshipId,
            surname: x.lastName,
            otherName: x.middleName,
          };

          newConatctsInfo.push(contactInfo);
        });
      try {
        const patientForm = {
          active: true,
          address: [
            {
              city: basicInfo.streetAddress,
              countryId: basicInfo.countryId,
              district: basicInfo.district,
              line: [basicInfo.landmark],
              organisationUnitId: 0,
              postalCode: "",
              stateId: basicInfo.stateId,
            },
          ],
          contact: newConatctsInfo,
          contactPoint: [],
          dateOfBirth: basicInfo.dob,
          deceased: false,
          deceasedDateTime: null,
          firstName: basicInfo.firstName,
          genderId: basicInfo.sexId !== undefined ? basicInfo.sexId : sexVal,
          sexId: basicInfo.sexId !== undefined ? basicInfo.sexId : sexVal,
          identifier: [
            {
              assignerId: 1,
              type: "HospitalNumber",
              value: basicInfo.hospitalNumber,
            },
          ],
          otherName: basicInfo.middleName,
          maritalStatusId: basicInfo.maritalStatusId,
          surname: basicInfo.lastName,
          educationId: basicInfo.educationId,
          employmentStatusId: basicInfo.employmentStatusId,
          dateOfRegistration: basicInfo.dateOfRegistration,
          isDateOfBirthEstimated:
            basicInfo.dateOfBirth == "Actual" ? false : true,
          ninNumber: basicInfo.ninNumber,
        };

        const phone = {
          type: "phone",
          value: basicInfo.phoneNumber,
        };
        if (basicInfo.email) {
          const email = {
            type: "email",
            value: basicInfo.email,
          };
          patientForm.contactPoint.push(email);
        }
        if (basicInfo.altPhonenumber) {
          const altPhonenumber = {
            type: "altphone",
            value: basicInfo.altPhonenumber,
          };
          patientForm.contactPoint.push(altPhonenumber);
        }
        patientForm.contactPoint.push(phone);
        patientForm.id = patientId;
        patientDTO.person = patientForm;

        if (basicInfo?.enrolledInOvcProgram === "YES") {
          objValues.referredFromOVCPartner = "YES";
          objValues.dateReferredFromOVCPartner = basicInfo?.enrollmentDate;
          objValues.ovcNumber = basicInfo?.ovcUniqueId;
          objValues.houseHoldNumber = basicInfo?.householdUniqueId;
        }

        patientDTO.hivEnrollment = objValues;
        const response = await axios.post(`${baseUrl}hiv/patient`, patientDTO, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSaving(false);
        toast.success("Patient Register successful", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        history.push("/");
      } catch (error) {
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
      }
    }
  };


   const alphabetOnly = (value) => {
     const result = value.replace(/[^a-z]/gi, "");
     return result;
   };

   const CareEntryPoint = () => {
     axios
       .get(`${baseUrl}application-codesets/v2/POINT_ENTRY`, {
         headers: { Authorization: `Bearer ${token}` },
       })
       .then((response) => {
         setCarePoints(response.data);
       })
       .catch((error) => {});
   };
   //Get list of Source of Referral
   const SourceReferral = () => {
     axios
       .get(`${baseUrl}application-codesets/v2/SOURCE_REFERRAL`, {
         headers: { Authorization: `Bearer ${token}` },
       })
       .then((response) => {
         setSourceReferral(response.data);
       })
       .catch((error) => {});
   };
   //Get list of HIV STATUS ENROLLMENT
   const HivStatus = () => {
     axios
       .get(`${baseUrl}application-codesets/v2/HIV_STATUS_ENROL`, {
         headers: { Authorization: `Bearer ${token}` },
       })
       .then((response) => {
         setHivStatus(response.data);
       })
       .catch((error) => {});
   };
   //Get list of HIV STATUS ENROLLMENT
   const EnrollmentSetting = () => {
     axios
       .get(`${baseUrl}application-codesets/v2/ENROLLMENT_SETTING`, {
         headers: { Authorization: `Bearer ${token}` },
       })
       .then((response) => {
         setEnrollSetting(response.data);
       })
       .catch((error) => {});
   };
   //Get list of HIV STATUS ENROLLMENT
   const TBStatus = () => {
     axios
       .get(`${baseUrl}application-codesets/v2/TB_STATUS`, {
         headers: { Authorization: `Bearer ${token}` },
       })
       .then((response) => {
         setTbStatus(response.data);
       })
       .catch((error) => {});
   };
   //Get list of KP
   const KP = () => {
     axios
       .get(`${baseUrl}application-codesets/v2/TARGET_GROUP`, {
         headers: { Authorization: `Bearer ${token}` },
       })
       .then((response) => {
         setKP(response.data);
       })
       .catch((error) => {});
   };
   //Get list of KP
   const PregnancyStatus = () => {
     axios
       .get(`${baseUrl}application-codesets/v2/PREGNANCY_STATUS`, {
         headers: { Authorization: `Bearer ${token}` },
       })
       .then((response) => {
         setPregnancyStatus(response.data);
       })
       .catch((error) => {});
   };
   const handleInputChange = (e) => {
     setObjValues({ ...objValues, [e.target.name]: e.target.value });
     if (e.target.name === "entryPointId") {
       if (e.target.value === 21) {
         setObjValues({ ...objValues, [e.target.name]: e.target.value });
       } else {
         objValues.facilityName = ""; // make the value empty
         //setObjValues ({...objValues,  ['facilityName']: ""});
         setObjValues({ ...objValues, [e.target.name]: e.target.value });
       }
       if (e.target.value === 24) {
         setObjValues({ ...objValues, [e.target.name]: e.target.value });
       } else {
         objValues.careEntryPointOther = ""; // make the value empty
         //setObjValues ({...objValues,  ['facilityName']: ""});
         setObjValues({ ...objValues, [e.target.name]: e.target.value });
       }
     }
     // if (e.target.name === "uniqueId" && e.target.value !== "") {
     //   async function getUniqueId() {
     //     const uniqueId = e.target.value;
     //     const response = await axios.get(
     //         `${baseUrl}hiv/patient/enrollment/unique-id-exists?uniqueId=${uniqueId}`,
     //         {
     //           headers: { Authorization: `Bearer ${token}` },
     //         });
     //         if (response.data !== true) {
     //           setUniqueIdNumStatus(false);
     //           errors.uniqueId = "";
     //           setObjValues({ ...objValues, uniqueId: e.target.value });
     //           setHospitalNumStatus2(true);
     //         } else {
     //           errors.uniqueId = "";
     //           toast.error("Error! Unique Number already exist");
     //           setUniqueIdNumStatus(true);
     //           setUniqueIdNumStatus2(false);
     //         }
     //   }
     //   getUniqueId();
     // }
   };

   const checkPhoneNumber = (e, inputName) => {
     const NumberValue = checkNumberLimit(e.target.value.replace(/\D/g, ""));
     setRelatives({ ...relatives, [inputName]: NumberValue });
   };

   const checkNumberLimit = (e) => {
     const limit = 11;
     const acceptedNumber = e.slice(0, limit);
     return acceptedNumber;
   };
   const handleInputChangePhoneNumber = (e, inputName) => {
     const limit = 11;
     const NumberValue = checkNumberLimit(e.target.value.replace(/\D/g, ""));
     setBasicInfo({ ...basicInfo, [inputName]: NumberValue });
   };
   //Handle CheckBox
   // const handleCheckBox = (e) => {
   //   if (e.target.checked) {
   //     setOvcEnrolled(true);
   //   } else {
   //     //Clear value
   //     objValues.ovc_enrolled = "";
   //     objValues.ovcNumber = "";
   //     objValues.householdNumber = "";
   //     objValues.referredToOVCPartner = "";
   //     objValues.dateReferredToOVCPartner = "";
   //     objValues.referredFromOVCPartner = "";
   //     objValues.dateReferredFromOVCPartner = "";
   //     objValues.ovcUniqueId = "";
   //     setOvcEnrolled(false);
   //   }
   // };

      const handleCheckBox = (e) => {
        setOvcEnrolled(e.target.checked);
        if (!e.target.checked) {
            //Clear values
            objValues.ovc_enrolled = "";
            objValues.ovcNumber = "";
            objValues.householdNumber = "";
            objValues.referredToOVCPartner = "";
            objValues.dateReferredToOVCPartner = "";
            objValues.referredFromOVCPartner = "";
            objValues.dateReferredFromOVCPartner = "";
            objValues.ovcUniqueId = "";
        }
    };


   const handleCancel = () => {
     history.push({ pathname: "/" });
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
             <h4>
               {" "}
               <Link to={"/"}>HIV /</Link> Patient Registration
             </h4>
           </li>
         </ol>
       </div>
       <Link
         to={{
           pathname: "/",
           state: "users",
         }}
       >
         <Button
           variant="contained"
           color="primary"
           className=" float-end mr-10 pr-10"
           style={{
             backgroundColor: "#014d88",
             fontWeight: "bolder",
             margingRight: "-40px",
           }}
           startIcon={<TiArrowBack />}
         >
           <span style={{ textTransform: "capitalize", color: "#fff" }}>
             Back{" "}
           </span>
         </Button>
       </Link>
       <br />
       <br />

       <Card className={classes.root}>
         <CardContent>
           <div className="col-xl-12 col-lg-12">
             <Form>
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
                     {userDetail === null
                       ? "Basic Information"
                       : "Edit User Information"}
                   </h5>
                 </div>

                 <div className="card-body">
                   <div className="basic-form">
                     <div className="row">
                       <div className="form-group mb-3 col-md-4">
                         <FormGroup>
                           <Label for="dateOfRegistration">
                             Date of Registration{" "}
                             <span style={{ color: "red" }}> *</span>{" "}
                           </Label>
                           <Input
                             className="form-control"
                              type="date" onKeyPress={(e) => e.preventDefault()}
                             name="dateOfRegistration"
                             id="dateOfRegistration"
                             min="1983-12-31"
                             max={moment(new Date()).format("YYYY-MM-DD")}
                             value={basicInfo.dateOfRegistration}
                             //value={basicInfo.dateOfRegistration===""? moment(new Date()).format("YYYY-MM-DD") : basicInfo.dateOfRegistration}
                             onChange={handleInputChangeBasic}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           />
                           {errors.dateOfRegistration !== "" ? (
                             <span className={classes.error}>
                               {errors.dateOfRegistration}
                             </span>
                           ) : (
                             ""
                           )}
                         </FormGroup>
                       </div>

                       <div className="form-group mb-3 col-md-4">
                         <FormGroup>
                           <Label for="patientId">
                             Hospital Number{" "}
                             <span style={{ color: "red" }}> *</span>
                           </Label>
                           <input
                             className="form-control"
                             type="text"
                             name="hospitalNumber"
                             id="hospitalNumber"
                             value={basicInfo.hospitalNumber}
                             onChange={handleInputChangeBasic}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           />
                           {errors.hospitalNumber !== "" ? (
                             <span className={classes.error}>
                               {errors.hospitalNumber}
                             </span>
                           ) : (
                             ""
                           )}
                           {hospitalNumStatus === true ? (
                             <span className={classes.error}>
                               {"Hospital number already exist"}
                             </span>
                           ) : (
                             ""
                           )}
                           {/* {hospitalNumStatus2===true ? (
                                                        <span className={classes.success}>{"Hospital number is OK."}</span>
                                                    ) :""} */}
                         </FormGroup>
                       </div>
                       {/* <div className="form-group mb-3 col-md-4">
                                                <FormGroup>
                                                    <Label for="patientId">EMR Number <span style={{ color:"red"}}> *</span> </Label>
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        name="emrNumber"
                                                        id="emrNumber"
                                                        disabled='true'
                                                        value={1094328}
                                                        //onChange={handleInputChangeBasic}
                                                        style={{border: "1px solid #014D88",borderRadius:"0.2rem"}}
                                                    />

                                                </FormGroup>

                                            </div> */}
                     </div>

                     <div className="row">
                       <div className="form-group mb-3 col-md-4">
                         <FormGroup>
                           <Label for="firstName">
                             First Names{" "}
                             <span style={{ color: "red" }}> *</span>
                           </Label>
                           <Input
                             className="form-control"
                             type="text"
                             name="firstName"
                             id="firstName"
                             value={
                               basicInfo.firstName !== undefined
                                 ? basicInfo.firstName
                                 : basicInfo.otherName
                             }
                             onChange={handleInputChangeBasic}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           />
                           {errors.firstName !== "" ? (
                             <span className={classes.error}>
                               {errors.firstName}
                             </span>
                           ) : (
                             ""
                           )}
                         </FormGroup>
                       </div>

                       <div className="form-group mb-3 col-md-4">
                         <FormGroup>
                           <Label>Middle Name</Label>
                           <Input
                             className="form-control"
                             type="text"
                             name="middleName"
                             id="middleName"
                             value={
                               basicInfo.middleName !== undefined
                                 ? basicInfo.middleName
                                 : basicInfo.otherName
                             }
                             onChange={handleInputChangeBasic}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           />
                         </FormGroup>
                       </div>

                       <div className="form-group mb-3 col-md-4">
                         <FormGroup>
                           <Label>
                             Last Name <span style={{ color: "red" }}> *</span>
                           </Label>
                           <input
                             className="form-control"
                             type="text"
                             name="lastName"
                             id="lastName"
                             value={
                               basicInfo.lastName !== ""
                                 ? basicInfo.lastName
                                 : basicInfo.surname
                             }
                             onChange={handleInputChangeBasic}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           />
                           {errors.lastName !== "" ? (
                             <span className={classes.error}>
                               {errors.lastName}
                             </span>
                           ) : (
                             ""
                           )}
                         </FormGroup>
                       </div>
                     </div>

                     <div className="row">
                       <div className="form-group  col-md-4">
                         <FormGroup>
                           <Label>
                             Sex <span style={{ color: "red" }}> *</span>
                           </Label>
                           <select
                             className="form-control"
                             name="sexId"
                             id="sexId"
                             onChange={handleInputChangeBasic}
                             value={
                               basicInfo.sexId !== undefined
                                 ? basicInfo.sexId
                                 : sexVal
                             }
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           >
                             <option value={""}>Select</option>
                             {genders.map((gender, index) => (
                               <option key={gender.id} value={gender.id}>
                                 {gender.display}
                               </option>
                             ))}
                           </select>
                           {errors.sexId !== "" ? (
                             <span className={classes.error}>
                               {errors.sexId}
                             </span>
                           ) : (
                             ""
                           )}
                         </FormGroup>
                       </div>
                       <div className="form-group mb-2 col-md-2">
                         <FormGroup>
                           <Label>Date Of Birth</Label>
                           <div className="radio">
                             <label>
                               <input
                                 type="radio"
                                 value="Actual"
                                 name="dateOfBirth"
                                 defaultChecked
                                 onChange={(e) => handleDateOfBirthChange(e)}
                                 style={{
                                   border: "1px solid #014D88",
                                   borderRadius: "0.2rem",
                                 }}
                               />{" "}
                               Actual
                             </label>
                           </div>
                           <div className="radio">
                             <label>
                               <input
                                 type="radio"
                                 value="Estimated"
                                 name="dateOfBirth"
                                 onChange={(e) => handleDateOfBirthChange(e)}
                                 style={{
                                   border: "1px solid #014D88",
                                   borderRadius: "0.2rem",
                                 }}
                               />{" "}
                               Estimated
                             </label>
                           </div>
                         </FormGroup>
                       </div>

                       <div className="form-group mb-3 col-md-3">
                         <FormGroup>
                           <Label>Date </Label>
                           <input
                             className="form-control"
                              type="date" onKeyPress={(e) => e.preventDefault()}
                             name="dob"
                             min="1940-01-01"
                             id="dob"
                             max={basicInfo.dateOfRegistration}
                             value={
                               basicInfo.dob !== undefined
                                 ? basicInfo.dob
                                 : basicInfo.birthDate
                             }
                             onChange={handleDobChange}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           />
                         </FormGroup>
                       </div>

                       <div className="form-group mb-3 col-md-3">
                         <FormGroup>
                           <Label>Age</Label>
                           <input
                             type="text"
                             name="age"
                             className="form-control"
                             id="age"
                             min="1"
                             value={basicInfo.age}
                             disabled={ageDisabled}
                             onChange={handleAgeChange}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           />
                         </FormGroup>
                         {basicInfo.age !== "" && basicInfo.age >= 80 ? (
                           <span className={classes.error}>
                             Are you sure of the age
                           </span>
                         ) : (
                           ""
                         )}
                       </div>
                     </div>

                     <div className={"row"}>
                       {/*                                            {watchShowAge >=0 &&
                                            <>*/}
                       <div className="form-group mb-3 col-md-3">
                         <FormGroup>
                           <Label>Marital Status</Label>
                           <select
                             className="form-control"
                             name="maritalStatusId"
                             id="maritalStatusId"
                             onChange={handleInputChangeBasic}
                             value={basicInfo.maritalStatusId}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           >
                             <option value={""}>Select</option>
                             {maritalStatusOptions.map(
                               (maritalStatusOption, index) => (
                                 <option
                                   key={maritalStatusOption.id}
                                   value={maritalStatusOption.id}
                                 >
                                   {maritalStatusOption.display}
                                 </option>
                               )
                             )}
                           </select>
                         </FormGroup>
                       </div>

                       <div className="form-group  col-md-4">
                         <FormGroup>
                           <Label>
                             Employment Status{" "}
                             <span style={{ color: "red" }}> *</span>
                           </Label>
                           <select
                             className="form-control"
                             name="employmentStatusId"
                             id="employmentStatusId"
                             onChange={handleInputChangeBasic}
                             value={basicInfo.employmentStatusId}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           >
                             <option value={""}>Select</option>
                             {occupationOptions.map(
                               (occupationOption, index) => (
                                 <option
                                   key={occupationOption.id}
                                   value={occupationOption.id}
                                 >
                                   {occupationOption.display}
                                 </option>
                               )
                             )}
                           </select>
                           {errors.employmentStatusId !== "" ? (
                             <span className={classes.error}>
                               {errors.employmentStatusId}
                             </span>
                           ) : (
                             ""
                           )}
                         </FormGroup>
                       </div>

                       <div className="form-group  col-md-4">
                         <FormGroup>
                           <Label>
                             Education Level{" "}
                             <span style={{ color: "red" }}> *</span>
                           </Label>
                           <select
                             className="form-control"
                             name="educationId"
                             id="educationId"
                             onChange={handleInputChangeBasic}
                             value={basicInfo.educationId}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           >
                             <option value={""}>Select</option>
                             {educationOptions.map((educationOption, index) => (
                               <option
                                 key={educationOption.id}
                                 value={educationOption.id}
                               >
                                 {educationOption.display}
                               </option>
                             ))}
                           </select>
                           {errors.educationId !== "" ? (
                             <span className={classes.error}>
                               {errors.educationId}
                             </span>
                           ) : (
                             ""
                           )}
                         </FormGroup>
                       </div>
                       <div className="form-group mb-3 col-md-4">
                         <FormGroup>
                           <Label for="ninNumber">
                             National Identity Number (NIN){" "}
                           </Label>
                           <input
                             className="form-control"
                             type="text"
                             name="ninNumber"
                             value={basicInfo.ninNumber}
                             id="ninNumber"
                             onChange={handleInputChangeBasic}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           />
                         </FormGroup>
                       </div>
                     </div>
                   </div>
                 </div>
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
                     Contact Details
                   </h5>
                 </div>

                 <div className="card-body">
                   <div className={"row"}>
                     <div className="form-group  col-md-4">
                       <FormGroup>
                         <Label>
                           Phone Number <span style={{ color: "red" }}> *</span>
                         </Label>
                         {/* <PhoneInput
                                                    containerStyle={{width:'100%',border: "1px solid #014D88"}}
                                                    inputStyle={{width:'100%',borderRadius:'0px'}}
                                                    country={'ng'}
                                                    placeholder="(234)7099999999"
                                                    maxLength={5}
                                                    name="phoneNumber"
                                                    id="phoneNumber"
                                                    masks={{ng: '...-...-....', at: '(....) ...-....'}}
                                                    value={basicInfo.phoneNumber}
                                                   onChange={(e)=>{checkPhoneNumberBasic(e,'phoneNumber')}}

                                                   //onChange={(e)=>{handleInputChangeBasic(e,'phoneNumber')}}
                                                /> */}
                         <Input
                           type="text"
                           name="phoneNumber"
                           id="phoneNumber"
                           onChange={(e) => {
                             handleInputChangePhoneNumber(e, "phoneNumber");
                           }}
                           value={basicInfo.phoneNumber}
                           style={{
                             border: "1px solid #014D88",
                             borderRadius: "0.2rem",
                           }}
                           required
                         />
                         {errors.phoneNumber !== "" ? (
                           <span className={classes.error}>
                             {errors.phoneNumber}
                           </span>
                         ) : (
                           ""
                         )}
                         {/* {basicInfo.phoneNumber.length >13 ||  basicInfo.phoneNumber.length <13? (
                                                <span className={classes.error}>{"The maximum and minimum required number is 13 digit"}</span>
                                                ) : "" } */}
                       </FormGroup>
                     </div>

                     <div className="form-group col-md-4">
                       <FormGroup>
                         <Label>Alt. Phone Number</Label>
                         {/* <PhoneInput
                                                    containerStyle={{width:'100%',border: "1px solid #014D88"}}
                                                    inputStyle={{width:'100%',borderRadius:'0px'}}
                                                    country={'ng'}
                                                    placeholder="(234)7099999999"
                                                    value={basicInfo.altPhonenumber}
                                                    masks={{ng: '...-...-....', at: '(....) ...-....'}}
                                                    onChange={(e)=>{checkPhoneNumberBasic(e,'altPhonenumber')}}

                                                /> */}
                         <Input
                           type="text"
                           name="altPhonenumber"
                           id="altPhonenumber"
                           onChange={(e) => {
                             handleInputChangePhoneNumber(e, "altPhonenumber");
                           }}
                           value={basicInfo.altPhonenumber}
                           style={{
                             border: "1px solid #014D88",
                             borderRadius: "0.2rem",
                           }}
                           required
                         />
                       </FormGroup>
                     </div>

                     <div className="form-group col-md-4">
                       <FormGroup>
                         <Label>Email</Label>
                         <input
                           className="form-control"
                           type="email"
                           name="email"
                           id="email"
                           onChange={handleInputChangeBasic}
                           value={basicInfo.email}
                           style={{
                             border: "1px solid #014D88",
                             borderRadius: "0.2rem",
                           }}
                           required
                         />
                       </FormGroup>
                     </div>
                   </div>

                   <div className="row">
                     <div className="form-group  col-md-4">
                       <FormGroup>
                         <Label>
                           Country <span style={{ color: "red" }}> *</span>
                         </Label>
                         <select
                           className="form-control"
                           type="text"
                           name="countryId"
                           id="countryId"
                           style={{
                             border: "1px solid #014D88",
                             borderRadius: "0.2rem",
                           }}
                           value={
                             basicInfo.countryId !== undefined
                               ? basicInfo.countryId
                               : 1
                           }
                           onChange={getStates}
                           disabled
                         >
                           <option value={""}>Select</option>
                           {countries.map((value, index) => (
                             <option key={index} value={value.id}>
                               {value.name}
                             </option>
                           ))}
                         </select>
                         {errors.countryId !== "" ? (
                           <span className={classes.error}>
                             {errors.countryId}
                           </span>
                         ) : (
                           ""
                         )}
                       </FormGroup>
                     </div>

                     <div className="form-group  col-md-4">
                       <FormGroup>
                         <Label>
                           State <span style={{ color: "red" }}> *</span>
                         </Label>
                         <select
                           className="form-control"
                           type="text"
                           name="stateId"
                           id="stateId"
                           value={basicInfo.stateId}
                           style={{
                             border: "1px solid #014D88",
                             borderRadius: "0.2rem",
                           }}
                           onChange={getProvinces}
                         >
                           <option value="">Select</option>
                           {states.map((value, index) => (
                             <option key={index} value={value.id}>
                               {value.name}
                             </option>
                           ))}
                         </select>
                         {errors.stateId !== "" ? (
                           <span className={classes.error}>
                             {errors.stateId}
                           </span>
                         ) : (
                           ""
                         )}
                       </FormGroup>
                     </div>

                     <div className="form-group  col-md-4">
                       <FormGroup>
                         <Label>
                           Province/District/LGA{" "}
                           <span style={{ color: "red" }}> *</span>
                         </Label>
                         <select
                           className="form-control"
                           type="text"
                           name="district"
                           id="district"
                           value={basicInfo.district}
                           style={{
                             border: "1px solid #014D88",
                             borderRadius: "0.2rem",
                           }}
                           onChange={handleInputChangeBasic}
                         >
                           <option value="">Select</option>
                           {provinces.map((value, index) => (
                             <option key={index} value={value.id}>
                               {value.name}
                             </option>
                           ))}
                         </select>
                         {errors.district !== "" ? (
                           <span className={classes.error}>
                             {errors.district}
                           </span>
                         ) : (
                           ""
                         )}
                       </FormGroup>
                     </div>
                   </div>

                   <div className={"row"}>
                     <div className="form-group  col-md-4">
                       <FormGroup>
                         <Label>
                           Street Address{" "}
                           <span style={{ color: "red" }}> *</span>
                         </Label>
                         <input
                           className="form-control"
                           type="text"
                           name="streetAddress"
                           id="streetAddress"
                           value={basicInfo.streetAddress}
                           onChange={handleInputChangeBasic}
                           style={{
                             border: "1px solid #014D88",
                             borderRadius: "0.2rem",
                           }}
                         />
                         {errors.streetAddress !== "" ? (
                           <span className={classes.error}>
                             {errors.streetAddress}
                           </span>
                         ) : (
                           ""
                         )}
                       </FormGroup>
                     </div>

                     <div className="form-group  col-md-4">
                       <FormGroup>
                         <Label>Landmark</Label>
                         <input
                           className="form-control"
                           type="text"
                           name="landmark"
                           id="landmark"
                           value={basicInfo.landmark}
                           onChange={handleInputChangeBasic}
                           style={{
                             border: "1px solid #014D88",
                             borderRadius: "0.2rem",
                           }}
                         />
                       </FormGroup>
                     </div>
                   </div>
                 </div>
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
                     Relationship / Next Of Kin
                   </h5>
                 </div>
                 <div className="card-body">
                   <div className="row">
                     {contacts && contacts.length > 0 && (
                       <div className="col-xl-12 col-lg-12">
                         <table style={{ width: "100%" }} className="mb-3">
                           <thead className="mb-3">
                             <tr>
                               <th>Relationship Type</th>
                               <th>Name</th>
                               <th>Phone</th>
                               <th>Address</th>
                               <th>Actions</th>
                             </tr>
                           </thead>
                           <tbody className="mb-3">
                             {contacts.map((item, index) => {
                               return (
                                 <tr key={item.index} className="mb-3">
                                   <td>
                                     {getRelationship(item.relationshipId)}
                                   </td>
                                   <td>
                                     {item.firstName +
                                       " " +
                                       item.middleName +
                                       " " +
                                       item.lastName}
                                   </td>
                                   <td>{item.phone}</td>
                                   <td>{item.address}</td>
                                   <td>
                                     <button
                                       type="button"
                                       className="btn btn-default btn-light btn-sm editRow"
                                       onClick={() =>
                                         handleEditRelative(item, index)
                                       }
                                     >
                                       <FontAwesomeIcon icon="edit" />
                                     </button>
                                     &nbsp;&nbsp;
                                     <button
                                       type="button"
                                       className="btn btn-danger btn-sm removeRow"
                                       onClick={(e) =>
                                         handleDeleteRelative(index)
                                       }
                                     >
                                       <FontAwesomeIcon icon="trash" />
                                     </button>
                                   </td>
                                 </tr>
                               );
                             })}
                           </tbody>
                         </table>
                       </div>
                     )}
                     <div className="col-xl-12 col-lg-12">
                       {showRelative && (
                         <div className="card">
                           <div className="card-body">
                             <div className="row">
                               <div className="form-group mb-3 col-md-3">
                                 <FormGroup>
                                   <Label for="relationshipType">
                                     Relationship Type{" "}
                                     <span style={{ color: "red" }}> *</span>
                                   </Label>
                                   <select
                                     className="form-control"
                                     name="relationshipId"
                                     id="relationshipId"
                                     value={relatives.relationshipId}
                                     style={{
                                       border: "1px solid #014D88",
                                       borderRadius: "0.2rem",
                                     }}
                                     onChange={handleInputChangeRelatives}
                                   >
                                     <option value={""}>Select</option>
                                     {relationshipOptions.map(
                                       (relative, index) => (
                                         <option
                                           key={relative.id}
                                           value={relative.id}
                                         >
                                           {relative.display}
                                         </option>
                                       )
                                     )}
                                   </select>
                                   {errors.relationshipId !== "" ? (
                                     <span className={classes.error}>
                                       {errors.relationshipId}
                                     </span>
                                   ) : (
                                     ""
                                   )}
                                 </FormGroup>
                               </div>

                               <div className="form-group mb-3 col-md-3">
                                 <FormGroup>
                                   <Label for="cfirstName">
                                     First Name{" "}
                                     <span style={{ color: "red" }}> *</span>
                                   </Label>
                                   <input
                                     className="form-control"
                                     type="text"
                                     name="firstName"
                                     value={relatives.firstName}
                                     id="firstName"
                                     style={{
                                       border: "1px solid #014D88",
                                       borderRadius: "0.2rem",
                                     }}
                                     onChange={handleInputChangeRelatives}
                                   />
                                   {errors.firstName !== "" ? (
                                     <span className={classes.error}>
                                       {errors.firstName}
                                     </span>
                                   ) : (
                                     ""
                                   )}
                                 </FormGroup>
                               </div>

                               <div className="form-group mb-3 col-md-3">
                                 <FormGroup>
                                   <Label>Middle Name</Label>
                                   <input
                                     className="form-control"
                                     type="text"
                                     name="middleName"
                                     id="middleName"
                                     value={relatives.middleName}
                                     style={{
                                       border: "1px solid #014D88",
                                       borderRadius: "0.2rem",
                                     }}
                                     onChange={handleInputChangeRelatives}
                                   />
                                   {/* {errors.cmiddleName && <p>{errors.cmiddleName.message}</p>} */}
                                 </FormGroup>
                               </div>

                               <div className="form-group mb-3 col-md-3">
                                 <FormGroup>
                                   <Label>Last Name </Label>
                                   <input
                                     className="form-control"
                                     type="text"
                                     name="lastName"
                                     id="lastName"
                                     value={relatives.lastName}
                                     style={{
                                       border: "1px solid #014D88",
                                       borderRadius: "0.2rem",
                                     }}
                                     onChange={handleInputChangeRelatives}
                                   />
                                 </FormGroup>
                               </div>
                             </div>

                             <div className="row">
                               <div className="form-group mb-3 col-md-3">
                                 <FormGroup>
                                   <Label for="contactPhoneNumber">
                                     Phone Number
                                   </Label>
                                   <Input
                                     type="text"
                                     name="phone"
                                     id="phone"
                                     onChange={(e) => {
                                       checkPhoneNumber(e, "phone");
                                     }}
                                     value={relatives.phone}
                                     style={{
                                       border: "1px solid #014D88",
                                       borderRadius: "0.2rem",
                                     }}
                                     required
                                   />
                                   {errors.phone !== "" ? (
                                     <span className={classes.error}>
                                       {errors.phone}
                                     </span>
                                   ) : (
                                     ""
                                   )}
                                 </FormGroup>
                               </div>

                               <div className="form-group mb-3 col-md-3">
                                 <FormGroup>
                                   <Label for="contactEmail">Email</Label>
                                   <input
                                     className="form-control"
                                     type="email"
                                     name="email"
                                     id="email"
                                     value={relatives.email}
                                     style={{
                                       border: "1px solid #014D88",
                                       borderRadius: "0.2rem",
                                     }}
                                     onChange={handleInputChangeRelatives}
                                     required
                                   />
                                   {/* {errors.contactEmail && <p>{errors.contactEmail.message}</p>} */}
                                 </FormGroup>
                               </div>

                               <div className="form-group mb-3 col-md-3">
                                 <FormGroup>
                                   <Label for="contactAddress">Address</Label>
                                   <input
                                     className="form-control"
                                     type="text"
                                     name="address"
                                     id="address"
                                     value={relatives.address}
                                     style={{
                                       border: "1px solid #014D88",
                                       borderRadius: "0.2rem",
                                     }}
                                     onChange={handleInputChangeRelatives}
                                   />
                                   {/* {errors.contactAddress && <p>{errors.contactAddress.message}</p>} */}
                                 </FormGroup>
                               </div>
                             </div>

                             <div className="row">
                               <div className="col-1">
                                 <MatButton
                                   type="button"
                                   variant="contained"
                                   color="primary"
                                   className={classes.button}
                                   onClick={handleSaveRelationship}
                                 >
                                   Add
                                 </MatButton>
                               </div>

                               <div className="col-1">
                                 <MatButton
                                   type="button"
                                   variant="contained"
                                   color="secondary"
                                   className={classes.button}
                                   onClick={handleCancelSaveRelationship}
                                 >
                                   Cancel
                                 </MatButton>
                               </div>
                             </div>
                           </div>
                         </div>
                       )}
                     </div>
                   </div>

                   <div className="row"></div>
                   <MatButton
                     type="button"
                     variant="contained"
                     color="primary"
                     className={classes.button}
                     startIcon={<AddIcon />}
                     onClick={handleAddRelative}
                     style={{
                       backgroundColor: "#014d88",
                       fontWeight: "bolder",
                     }}
                   >
                     Add a Relative/Next Of Kin
                   </MatButton>
                   {/* </div> */}
                 </div>
               </div>
               {/* Adding HIV ENROLLEMENT FORM HERE */}
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
                     HIV Enrollment
                   </h5>
                 </div>

                 <div className="card-body">
                   <div className="row">
                     <div className="form-group mb-3 col-md-6">
                       <FormGroup>
                         <Label for="uniqueId">
                           Unique ID No <span style={{ color: "red" }}> *</span>
                         </Label>
                         <Input
                           type="text"
                           name="uniqueId"
                           id="uniqueId"
                           onChange={handleInputChange}
                           value={objValues.uniqueId}
                           style={{
                             border: "1px solid #014D88",
                             borderRadius: "0.2rem",
                           }}
                         />
                         {errors.uniqueId !== "" ? (
                           <span className={classes.error}>
                             {errors.uniqueId}
                           </span>
                         ) : (
                           ""
                         )}
                       </FormGroup>
                     </div>

                     {objValues.entryPointId === "21" ||
                     objValues.statusAtRegistrationId === "55" ? (
                       <>
                         <div className="form-group mb-3 col-md-6">
                           <FormGroup>
                             <Label for="dateOfRegistration">
                               Date of Enrollment{" "}
                               <span style={{ color: "red" }}> *</span>
                             </Label>
                             <Input
                                type="date" onKeyPress={(e) => e.preventDefault()}
                               name="dateOfRegistration"
                               id="dateOfRegistration"
                               min="01-01-1980"
                               max={moment(new Date()).format("YYYY-MM-DD")}
                               onChange={handleInputChange}
                               value={objValues.dateOfRegistration}
                               style={{
                                 border: "1px solid #014D88",
                                 borderRadius: "0.2rem",
                               }}
                             />
                             {errors.dateOfRegistration !== "" ? (
                               <span className={classes.error}>
                                 {errors.dateOfRegistration}
                               </span>
                             ) : (
                               ""
                             )}
                           </FormGroup>
                         </div>
                       </>
                     ) : (
                       <>
                         <div className="form-group mb-3 col-md-6">
                           <FormGroup>
                             <Label for="dateOfRegistration">
                               Date of Enrollment{" "}
                               <span style={{ color: "red" }}> *</span>
                             </Label>
                             <Input
                                type="date" onKeyPress={(e) => e.preventDefault()}
                               name="dateOfRegistration"
                               id="dateOfRegistration"
                               min={basicInfo.dateOfRegistration}
                               max={moment(new Date()).format("YYYY-MM-DD")}
                               onChange={handleInputChange}
                               value={objValues.dateOfRegistration}
                               style={{
                                 border: "1px solid #014D88",
                                 borderRadius: "0.2rem",
                               }}
                             />
                             {errors.dateOfRegistration !== "" ? (
                               <span className={classes.error}>
                                 {errors.dateOfRegistration}
                               </span>
                             ) : (
                               ""
                             )}
                           </FormGroup>
                         </div>
                       </>
                     )}
                   </div>
                   <div className="row">
                     <div className="form-group mb-3 col-md-6">
                       <FormGroup>
                         <Label for="entryPointId">
                           Care Entry Point{" "}
                           <span style={{ color: "red" }}> *</span>
                         </Label>
                         <Input
                           type="select"
                           name="entryPointId"
                           id="entryPointId"
                           onChange={handleInputChange}
                           value={objValues.entryPointId}
                           style={{
                             border: "1px solid #014D88",
                             borderRadius: "0.2rem",
                           }}
                         >
                           <option value=""> </option>
                           {carePoints.map((value) => (
                             <option key={value.id} value={value.id}>
                               {value.display}
                             </option>
                           ))}
                         </Input>
                         {errors.entryPointId !== "" ? (
                           <span className={classes.error}>
                             {errors.entryPointId}
                           </span>
                         ) : (
                           ""
                         )}
                       </FormGroup>
                     </div>

                     <div className="form-group mb-3 col-md-6">
                       {objValues.entryPointId === "21" ? (
                         <FormGroup>
                           <Label>Facility Name</Label>
                           <Input
                             type="text"
                             name="facilityName"
                             id="facilityName"
                             onChange={handleInputChange}
                             value={objValues.facilityName}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           />
                         </FormGroup>
                       ) : (
                         ""
                       )}

                       {objValues.entryPointId === "24" ? (
                         <FormGroup>
                           <Label>Care Entry Point (Others)</Label>
                           <Input
                             type="text"
                             name="careEntryPointOther"
                             id="careEntryPointOther"
                             onChange={handleInputChange}
                             value={objValues.careEntryPointOther}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           />
                         </FormGroup>
                       ) : (
                         ""
                       )}
                     </div>

                     <div className="form-group mb-3 col-md-6">
                       <FormGroup>
                         <Label>
                           HIV Status at Registration{" "}
                           <span style={{ color: "red" }}> *</span>
                         </Label>
                         <Input
                           type="select"
                           name="statusAtRegistrationId"
                           id="statusAtRegistrationId"
                           onChange={handleInputChange}
                           value={objValues.statusAtRegistrationId}
                           style={{
                             border: "1px solid #014D88",
                             borderRadius: "0.2rem",
                           }}
                         >
                           <option value=""> Select</option>
                           {hivStatus.map((value) => (
                             <option key={value.id} value={value.id}>
                               {value.display}
                             </option>
                           ))}
                         </Input>
                         {errors.statusAtRegistrationId !== "" ? (
                           <span className={classes.error}>
                             {errors.statusAtRegistrationId}
                           </span>
                         ) : (
                           ""
                         )}
                       </FormGroup>
                     </div>
                     {basicInfo.dob !== "" && (
                       <div className="form-group mb-3 col-md-6">
                         <FormGroup>
                           <Label>
                             Date of Confirmed HIV Test{" "}
                             <span style={{ color: "red" }}> *</span>
                           </Label>
                           <Input
                              type="date" onKeyPress={(e) => e.preventDefault()}
                             name="dateConfirmedHiv"
                             id="dateConfirmedHiv"
                             min={basicInfo.dob}
                             max={objValues.dateOfRegistration}
                             onChange={handleInputChange}
                             value={objValues.dateConfirmedHiv}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           />
                           {errors.dateConfirmedHiv !== "" ? (
                             <span className={classes.error}>
                               {errors.dateConfirmedHiv}
                             </span>
                           ) : (
                             ""
                           )}
                         </FormGroup>
                       </div>
                     )}
                     <div className="form-group mb-3 col-md-6">
                       <FormGroup>
                         <Label>
                           Source of Referral{" "}
                           <span style={{ color: "red" }}> *</span>
                         </Label>
                         <Input
                           type="select"
                           name="sourceOfReferrerId"
                           id="sourceOfReferrerId"
                           value={objValues.sourceOfReferrerId}
                           onChange={handleInputChange}
                           style={{
                             border: "1px solid #014D88",
                             borderRadius: "0.2rem",
                           }}
                           required
                         >
                           <option value="">Select </option>
                           {sourceReferral.map((value) => (
                             <option key={value.id} value={value.id}>
                               {value.display}
                             </option>
                           ))}
                         </Input>
                         {errors.sourceOfReferrerId !== "" ? (
                           <span className={classes.error}>
                             {errors.sourceOfReferrerId}
                           </span>
                         ) : (
                           ""
                         )}
                       </FormGroup>
                     </div>
                     {objValues.sourceOfReferrerId === "870" ||
                     objValues.sourceOfReferrerId === 870 ? (
                       <div className="form-group mb-3 col-md-6">
                         <FormGroup>
                           <Label>LIP Name</Label>
                           <Input
                             type="text"
                             name="lipName"
                             id="lipName"
                             onChange={handleInputChange}
                             value={objValues.lipName}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           />
                         </FormGroup>
                       </div>
                     ) : (
                       ""
                     )}
                     <div className="form-group mb-3 col-md-6">
                       <FormGroup>
                         <Label>
                           Enrollment Setting{" "}
                           <span style={{ color: "red" }}> *</span>
                         </Label>
                         <Input
                           type="select"
                           name="enrollmentSettingId"
                           id="enrollmentSettingId"
                           value={objValues.enrollmentSettingId}
                           style={{
                             border: "1px solid #014D88",
                             borderRadius: "0.2rem",
                           }}
                           onChange={handleInputChange}
                           required
                         >
                           <option value=""> Select</option>

                           {enrollSetting.map((value) => (
                             <option key={value.id} value={value.id}>
                               {value.display}
                             </option>
                           ))}
                         </Input>
                         {errors.enrollmentSettingId !== "" ? (
                           <span className={classes.error}>
                             {errors.enrollmentSettingId}
                           </span>
                         ) : (
                           ""
                         )}
                       </FormGroup>
                     </div>

                     <div className="form-group mb-3 col-md-6">
                       <FormGroup>
                         <Label>
                           TB Status <span style={{ color: "red" }}> *</span>
                         </Label>
                         <Input
                           type="select"
                           name="tbStatusId"
                           id="tbStatusId"
                           value={objValues.tbStatusId}
                           onChange={handleInputChange}
                           style={{
                             border: "1px solid #014D88",
                             borderRadius: "0.2rem",
                           }}
                           required
                         >
                           <option value=""> Select</option>
                           {tbStatus.map((value) => (
                             <option key={value.id} value={value.id}>
                               {value.display}
                             </option>
                           ))}
                         </Input>
                         {errors.tbStatusId !== "" ? (
                           <span className={classes.error}>
                             {errors.tbStatusId}
                           </span>
                         ) : (
                           ""
                         )}
                       </FormGroup>
                     </div>
                     {hideTargetGroup === "false" ? (
                       <div className="form-group mb-3 col-md-6">
                         <FormGroup>
                           <Label>
                             Target Group{" "}
                             <span style={{ color: "red" }}> *</span>
                           </Label>
                           <Input
                             type="select"
                             name="targetGroupId"
                             id="targetGroupId"
                             value={objValues.targetGroupId}
                             onChange={handleInputChange}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           >
                             <option value=""> Select</option>
                             {(basicInfo.sexId === 377 ||
                               basicInfo.sexId === "377" ||
                               basicInfo?.gender === "Female") && (
                               <>
                                 {kP
                                   .filter((x) => x.display !== "MSM")
                                   .map((value) => (
                                     <option key={value.id} value={value.id}>
                                       {value.display}
                                     </option>
                                   ))}
                               </>
                             )}
                             {(basicInfo.sexId === 376 ||
                               basicInfo.sexId === "376" ||
                               basicInfo?.gender === "Male") && (
                               <>
                                 {kP
                                   .filter((x) => x.display !== "FSW")
                                   .map((value) => (
                                     <option key={value.id} value={value.id}>
                                       {value.display}
                                     </option>
                                   ))}
                               </>
                             )}
                           </Input>
                           {errors.targetGroupId !== "" ? (
                             <span className={classes.error}>
                               {errors.targetGroupId}
                             </span>
                           ) : (
                             ""
                           )}
                         </FormGroup>
                       </div>
                     ) : (
                       ""
                     )}
                     {basicInfo.sexId === "377" && basicInfo.age > 9 && (
                       <>
                         <div className="form-group mb-3 col-md-6">
                           <FormGroup>
                             <Label>
                               {" "}
                               Pregnancy{" "}
                               <span style={{ color: "red" }}> *</span>
                             </Label>
                             <Input
                               type="select"
                               name="pregnancyStatusId"
                               id="pregnancyStatusId"
                               value={objValues.pregnancyStatusId}
                               style={{
                                 border: "1px solid #014D88",
                                 borderRadius: "0.2rem",
                               }}
                               onChange={handleInputChange}
                             >
                               <option value="">Select </option>
                               {pregnancyStatus.map((value) => (
                                 <option key={value.id} value={value.id}>
                                   {value.display}
                                 </option>
                               ))}
                             </Input>
                             {errors.pregnancyStatusId !== "" ? (
                               <span className={classes.error}>
                                 {errors.pregnancyStatusId}
                               </span>
                             ) : (
                               ""
                             )}
                           </FormGroup>
                         </div>
                         {objValues.pregnancyStatusId === "73" && (
                           <>
                             <div className="form-group mb-3 col-md-6">
                               <FormGroup>
                                 <Label>Date of LMP </Label>
                                 <Input
                                    type="date" onKeyPress={(e) => e.preventDefault()}
                                   name="dateOfLpm"
                                   id="dateOfLpm"
                                   max={moment(new Date()).format("YYYY-MM-DD")}
                                   onChange={handleInputChange}
                                   value={objValues.dateOfLpm}
                                   style={{
                                     border: "1px solid #014D88",
                                     borderRadius: "0.2rem",
                                   }}
                                   required
                                 />
                               </FormGroup>
                             </div>
                           </>
                         )}
                       </>
                     )}
                     {/*{basicInfo.age !== "" && basicInfo.age <= 20 && (*/}
                     {/*  <div className="form-group mb-3 col-md-3">*/}
                     {/*    <div className="form-check custom-checkbox ml-1 ">*/}
                     {/*      <input*/}
                     {/*        type="checkbox"*/}
                     {/*        className="form-check-input"*/}
                     {/*        name="ovc_enrolled"*/}
                     {/*        id="ovc_enrolled"*/}
                     {/*        checked={isChecked}*/}
                     {/*        onChange={handleCheckBox}*/}
                     {/*      />*/}
                     {/*      <label*/}
                     {/*        className="form-check-label"*/}
                     {/*        htmlFor="basic_checkbox_1"*/}
                     {/*      >*/}
                     {/*        Enrolled into OVC?*/}
                     {/*      </label>*/}
                     {/*    </div>*/}
                     {/*  </div>*/}
                     {/*)}*/}

                     {basicInfo.age !== "" && basicInfo.age <= 20 && (
                         <div className="form-group mb-3 col-md-3">
                           <div className="form-check custom-checkbox ml-1 ">
                             <input
                                 type="checkbox"
                                 className="form-check-input"
                                 name="ovc_enrolled"
                                 id="ovc_enrolled"
                                 checked={ovcEnrolled}
                                 onChange={handleCheckBox}
                             />
                             <label
                                 className="form-check-label"
                                 htmlFor="basic_checkbox_1"
                             >
                               Enrolled into OVC?
                             </label>
                           </div>
                         </div>
                     )}
                     {ovcEnrolled === true && (
                       <>
                         <div className="row">
                           <div className="form-group mb-3 col-md-6">
                             <FormGroup>
                               <Label>Household Unique Number</Label>
                               <Input
                                 type="text"
                                 name="houseHoldNumber"
                                 id="houseHoldNumber"
                                 required={ovcEnrolled}
                                 // value={basicInfo.householdUniqueId}
                                   value={basicInfo.householdNumber}
                                 onChange={handleInputChange}
                                 // disabled={true}
                                 style={{
                                   border: "1px solid #014D88",
                                   borderRadius: "0.2rem",
                                 }}
                               />
                             </FormGroup>
                           </div>
                           <div className="form-group mb-3 col-md-6">
                             <FormGroup>
                               <Label>OVC Unique ID</Label>
                               <Input
                                 type="text"
                                 name="ovcNumber"
                                 id="ovcNumber"
                                 required={ovcEnrolled}
                                 value={basicInfo.ovcUniqueId}
                                 onChange={handleInputChange}
                                 // disabled={true}
                                 style={{
                                   border: "1px solid #014D88",
                                   borderRadius: "0.2rem",
                                 }}
                               />
                             </FormGroup>
                           </div>

                           <div className="form-group mb-3 col-md-6">
                             <FormGroup>
                               <Label>Referred To OVC Partner</Label>
                               <Input
                                 type="select"
                                 name="referredToOVCPartner"
                                 id="referredToOVCPartner"
                                 required={ovcEnrolled}
                                 onChange={handleInputChange}
                                 style={{
                                   border: "1px solid #014D88",
                                   borderRadius: "0.2rem",
                                 }}
                                 value={objValues.referredToOVCPartner}
                               >
                                 <option value=""> Select</option>
                                 <option value="YES"> YES</option>
                                 <option value="NO"> NO</option>
                               </Input>
                             </FormGroup>
                           </div>
                           <div className="form-group mb-3 col-md-6">
                             <FormGroup>
                               <Label>Date Referred To OVC Partner</Label>
                               <Input
                                  type="date" onKeyPress={(e) => e.preventDefault()}
                                 name="dateReferredToOVCPartner"
                                 id="dateReferredToOVCPartner"
                                 min={basicInfo.dob}
                                 max={moment(new Date()).format("YYYY-MM-DD")}
                                 onChange={handleInputChange}
                                 value={objValues.dateReferredToOVCPartner}
                                 style={{
                                   border: "1px solid #014D88",
                                   borderRadius: "0.2rem",
                                 }}
                               />
                               {/* {errors.dateConfirmedHiv !=="" ? (
                                            <span className={classes.error}>{errors.dateConfirmedHiv}</span>
                                            ) : "" }  */}
                             </FormGroup>
                           </div>
                           <div className="form-group mb-3 col-md-6">
                             <FormGroup>
                               <Label>Referred From OVC Partner</Label>
                               <Input
                                 type="select"
                                 name="referredFromOVCPartner"
                                 id="referredFromOVCPartner"
                                 required={ovcEnrolled}
                                 onChange={handleInputChange}
                                 style={{
                                   border: "1px solid #014D88",
                                   borderRadius: "0.2rem",
                                 }}
                                 value={objValues.referredFromOVCPartner}
                               >
                                 <option value=""> Select</option>
                                 <option value="YES"> YES</option>
                                 <option value="NO"> NO</option>
                               </Input>
                             </FormGroup>
                           </div>
                           <div className="form-group mb-3 col-md-6">
                             <FormGroup>
                               <Label>Date Referred From OVC Partner</Label>
                               <Input
                                  type="date" onKeyPress={(e) => e.preventDefault()}
                                 name="dateReferredFromOVCPartner"
                                 id="dateReferredFromOVCPartner"
                                 min={basicInfo.dob}
                                 max={objValues.dateOfRegistration}
                                 onChange={handleInputChange}
                                 value={objValues.dateReferredFromOVCPartner}
                                 style={{
                                   border: "1px solid #014D88",
                                   borderRadius: "0.2rem",
                                 }}
                               />
                               {/* {errors.dateConfirmedHiv !=="" ? (
                                            <span className={classes.error}>{errors.dateConfirmedHiv}</span>
                                            ) : "" }  */}
                             </FormGroup>
                           </div>
                         </div>
                       </>
                     )}
                   </div>
                 </div>
               </div>
               {/* END OF HIV ENROLLEMENT FORM */}
               {saving ? <Spinner /> : ""}

               <br />

               <MatButton
                 type="submit"
                 variant="contained"
                 color="primary"
                 className={classes.button}
                 startIcon={<SaveIcon />}
                 onClick={handleSubmit}
                 hidden={disabledAgeBaseOnAge}
                 disabled={saving}
                 style={{ backgroundColor: "#014d88", fontWeight: "bolder" }}
               >
                 {!saving ? (
                   <span style={{ textTransform: "capitalize" }}>Save</span>
                 ) : (
                   <span style={{ textTransform: "capitalize" }}>
                     Saving...
                   </span>
                 )}
               </MatButton>

               <MatButton
                 variant="contained"
                 className={classes.button}
                 startIcon={<CancelIcon />}
                 style={{ backgroundColor: "#992E62" }}
                 onClick={handleCancel}
               >
                 <span style={{ textTransform: "capitalize", color: "#fff" }}>
                   Cancel
                 </span>
               </MatButton>
             </Form>
           </div>
         </CardContent>
       </Card>
       <Modal
         show={open}
         toggle={toggle}
         className="fade"
         size="sm"
         aria-labelledby="contained-modal-title-vcenter"
         centered
         backdrop="static"
       >
         <Modal.Header>
           <Modal.Title id="contained-modal-title-vcenter">
             Notification!
           </Modal.Title>
         </Modal.Header>
         <Modal.Body>
           <h4>Are you Sure of the Age entered?</h4>
         </Modal.Body>
         <Modal.Footer>
           <Button
             onClick={toggle}
             style={{ backgroundColor: "#014d88", color: "#fff" }}
           >
             Yes
           </Button>
         </Modal.Footer>
       </Modal>
     </>
   );
};

export default UserRegistration;
