import React, { useState, useEffect, useRef } from "react";
import { Card, CardBody, FormGroup, Label, Input } from "reactstrap";
import MatButton from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { Table } from "react-bootstrap";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import axios from "axios";
import { toast } from "react-toastify";
import { url as baseUrl } from "./../../../api";
import { token as token } from "./../../../api";
import "react-widgets/dist/css/react-widgets.css";
import moment from "moment";
import { Spinner } from "reactstrap";
import { Icon, List, Label as LabelSui } from "semantic-ui-react";
import Select from "react-select";

// import moment from "moment";

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
}));

const DashboardFilledTransferForm = (props) => {
  const patientObj = props.patientObj;
  const [errors, setErrors] = useState({});
  let temp = { ...errors };
  const enrollDate =
    patientObj && patientObj.enrollment
      ? patientObj.enrollment.dateOfRegistration
      : null;
  const classes = useStyles();
  const [saving, setSaving] = useState(false);
  const [eacObj, setEacObj] = useState([]);
  const [transferInfo, setTransferInfo] = useState({});
  const [allFacilities, setAllFacilities] = useState([]);
  const [labResult, setLabResult] = useState([]);
  const [baselineCDCount, setBaselineCDCount] = useState("");
  const [currentCD4, setCurrentCD4] = useState("");
  const [BMI, setBMI] = useState("");
  const [showSelectdropdown, setShowSelectdropdown] = useState(false);

  const [currentMedication, setCurrentMedication] = useState([]);
  const [facId, setFacId] = useState(localStorage.getItem("facId"));
  const [attemptList, setAttemptList] = useState([]);
  const[observationType, setObservationType] = useState("")
  // const [selectedLga, setSelectedLga] = useState("");
  const [reasonForTransfer, setReasonForTransfer] = useState([
    "Relocating",
    "Closeness to new facility",
    "Self Transfer",
    "Stigma",
    "PMTCT",
  ]);

  const [info, setInfo] = useState({});

  const [payload, setPayload] = useState({
    height: "",
    weight: "",
    lga: "",
    viralLoad: null,
    adherenceLevel: null,
    dateEnrolledInCare: "",
    dateOfEnrollment: "",
    dateEnrolledInTreatment: "",
    dateConfirmedHiv: "",
    baselineCD4: "",
    currentCD4Count: "",
    currentWhoClinical: "",
    currentRegimenLine: "",
    firstLineArtRegimen: "",
    facilityName: "",
    state: "",
    facilityTransferTo: "",
    stateTransferTo: "",
    lgaTransferTo: "",
    clinicalNote: "",
    modeOfHIVTest: "",
    gaInWeeks: "",
    bmi: "",
    pregnancyStatus: "",
    currentMedication: [],
    labResult: [],
    reasonForTransfer: "",
    nameOfTreatmentSupporter: "",
    contactAddressOfTreatmentSupporter: "",
    phoneNumberOfTreatmentSupporter: "",
    relationshipWithClients: "",
    recommendations: "",
    cliniciansName: "",
    dateOfClinicVisitAtTransferringSite: "",
    dateOfFirstConfirmedScheduleApp: "",
    personEffectingTheTransfer: "",
    // acknowledgementReceivedDate: "",
    acknowledgementDateOfVisit: "",
    nameOfClinicianReceivingTheTransfer: "",
    clinicianTelephoneNumber: "",
    patientCameWithTransferForm: "",
    patientAttendedHerFirstVisit: "",
    acknowlegdeReceiveDate: "",
    type:"",
    // acknowlegdeTelephoneNumber: "",
  });
  const [defaultFacility, setDefaultFacility] = useState({
    value: "",
    label: "",
  });

  const [states1, setStates1] = useState([]);
  const [lgas1, setLGAs1] = useState([]);
  const [facilities1, setFacilities1] = useState([]);
  const [selectedState, setSelectedState] = useState({});
  const [selectedFacility, setSelectedFacility] = useState({});
  const [selectedLga, setSelectedLga] = useState({});

  const loadStates1 = () => {
    axios
      .get(`${baseUrl}organisation-units/parent-organisation-units/1`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data) {
          setStates1(response.data);
        }
      })
      .catch((e) => {
        // console.log("Fetch states error" + e);
      });
  };

  const loadLGA1 = (id) => {
    axios
      .get(`${baseUrl}organisation-units/parent-organisation-units/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data) {
          setLGAs1(response.data);
          // const selectedLga = response.data.find(lga => lga.id === id);
          // setPayload(prevPayload => ({ ...prevPayload, lgaTransferTo: selectedLga ? selectedLga.name : "" }));
        }
      })
      .catch((e) => {
        // console.log("Fetch LGA error" + e);
      });
  };

  const loadFacilities1 = (id) => {
    axios
      .get(`${baseUrl}organisation-units/parent-organisation-units/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data) {
          setFacilities1(response.data);
        }
      })
      .catch((e) => {
        // console.log("Fetch Facilities error" + e);
      });
  };

  const getTransferFormInfo = () => {
    axios
      .get(`${baseUrl}observation/${props.activeContent.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setObservationType(response.data.type)
        setPayload({ ...response.data.data });
        console.log("observation", response.data.data)
        console.log("observation type", response.data.type)
        setDefaultFacility({
          value: "",
          label: response.data.data.facilityTransferTo,
        });
        //   setPatientObj1(response.data);
      })
      .catch((error) => {});
  };
  // fetch info for the form
  const getTreatmentInfo = () => {
    axios
      .get(`${baseUrl}treatment-transfers/info/${patientObj.personUuid}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTransferInfo(response.data);
        //   setPatientObj1(response.data);
      })
      .catch((error) => {});
  };

  // get current Medication dose
  const getCurrentMedication = () => {
    axios
      .get(`${baseUrl}treatment-transfers/${patientObj.personUuid}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // setTransferInfo(response.data);

        setCurrentMedication(response.data);
      })
      .catch((error) => {});
  };

  // get Lab Result
  const getLabResult = () => {
    axios
      .get(
        `${baseUrl}treatment-transfers/patient_result/${facId}/${patientObj.personUuid}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        // setTransferInfo(response.data);
        setLabResult(response.data);
      })
      .catch((error) => {});
  };

  const getBasedlineCD4Count = () => {
    // let facId = localStorage.getItem("faciltyId");
    // /patient_baseline_cd4/{facilityId}/{patientUuid
    axios
      .get(`${baseUrl}patient_baseline_cd4/${facId}/${patientObj.personUuid}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setBaselineCDCount(response.data);
        // setLabResult(response.data);
      })
      .catch((error) => {});
  };

  const getCurrentCD4Count = () => {
    // let facId = localStorage.getItem("faciltyId");
    //    treatment-transfers/patient_current_cd4/{facilityId}/{patientUuid}
    axios
      .get(
        `${baseUrl}treatment-transfers/patient_current_cd4/${facId}/${patientObj.personUuid}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        setCurrentCD4(response.data);
      })
      .catch((error) => {});
  };

  const postTransferForm = (load) => {
    axios
      .put(`${baseUrl}observation/${props.activeContent.id}`, load, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setSaving(false);
        toast.success("Transfer Form Submitted Successfully");
        props.setActiveContent({
          ...props.activeContent,
          route: "recent-history",
        });
      })
      .catch((error) => {
        setSaving(false);
        if (error.response && error.response.data) {
          let errorMessage =
            error.response.data && error.response.data.apierror.message !== ""
              ? error.response.data.apierror.message
              : "Something went wrong, please try again";
          toast.error(errorMessage);
        }
      });
  };

  // get all facilities
  const getAllFacilities = () => {
    axios
      .get(
        `${baseUrl}organisation-units/parent-organisation-units/1/organisation-units-level/5/hierarchy`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        let updatedFacilities = response.data.map((each, id) => {
          return {
            ...each,
            value: each.id,
            label: each.name,
          };
        });
        setAllFacilities(updatedFacilities);
      })
      .catch((error) => {
        // Handle error of Request A
        toast.error("Request A failed. Trying Request B...");
        // Attempt Request B
        axios
          .get(
            `${baseUrl}organisation-units/parent-organisation-units/1/organisation-units-level/4/hierarchy`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then((response) => {
            let updatedFacilities = response.data.map((each, id) => {
              return {
                ...each,
                value: each.id,
                label: each.name,
              };
            });
            setAllFacilities(updatedFacilities);
          })
          .catch((error) => {
            // console.error("Both requests failed.");
          });
      });
  };

  const calculateBMI = () => {
    const weight = Number(transferInfo?.weight);
    const height = Number(transferInfo?.height);

    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
      setBMI("");
    } else {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      setBMI(Math.round(bmi));
    }
  };
  useEffect(() => {
    loadStates1();
    getTreatmentInfo();
    getLabResult();
    getCurrentMedication();
    getTransferFormInfo();
  }, []);

  useEffect(() => {
    calculateBMI();
  }, [transferInfo.height, transferInfo.weight]);

  const handleInputChange = (e) => {
    setErrors({ ...temp, [e.target.name]: "" });
    setPayload({ ...payload, [e.target.name]: e.target.value });
  };

  const handleInputChangeLocation = (e) => {
    setErrors({ ...temp, [e.target.name]: "" });
    if (e.target.name === "stateTransferTo") {
      let filteredState = states1.filter((each) => {
        return each.name.toLowerCase() === e.target.value.toLowerCase();
      });
      setPayload({ ...payload, [e.target.name]: e.target.value });
      loadLGA1(filteredState[0].id);
    }
    if (e.target.name === "lgaTransferTo") {
      let filteredState = lgas1.filter((each) => {
        return each.name.toLowerCase() === e.target.value.toLowerCase();
      });
      setPayload({ ...payload, [e.target.name]: e.target.value });
      loadFacilities1(filteredState[0].id);
    }
    if (e.target.name === "state") {
      let filteredState = states1.filter((each) => {
        return each.name.toLowerCase() === e.target.value.toLowerCase();
      });
      setPayload({ ...payload, [e.target.name]: e.target.value });
      loadLGA1(filteredState[0].id);
    }
    if (e.target.name === "lga") {
      let filteredState = states1.filter((each) => {
        return each.name.toLowerCase() === e.target.value.toLowerCase();
      });
      setPayload({ ...payload, [e.target.name]: e.target.value });
      loadFacilities1(filteredState[0].id);
    }
  };


  const [attempt, setAttempt] = useState({
    attemptDate: "",
    whoAttemptedContact: "",
    modeOfConatct: "",
    personContacted: "",
    reasonForDefaulting: "",
    reasonForDefaultingOthers: "",
  });
console.log("payload", payload)

  //Validations of the forms
  const validate = () => {
    // new error validaqtion
    // temp.facilityTransferTo = payload.facilityTransferTo
    //   ? ""
    //   : "This field is required";
    temp.reasonForTransfer = payload.reasonForTransfer
      ? ""
      : "This field is required";
    temp.modeOfHIVTest = payload.modeOfHIVTest ? "" : "This field is required";
    // temp.stateTransferTo = payload.stateTransferTo
    //   ? ""
    //   : "This field is required";
    // temp.lgaTransferTo = payload.lgaTransferTo ? "" : "This field is required";
    // temp.facilityTransferTo = payload.facilityTransferTo
    //   ? ""
    //   : "This field is required";

    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x == "");
  };


  /**** Submit Button Processing  */
  const handleSubmit = (e) => {
    let facId = localStorage.getItem("faciltyId");

    e.preventDefault();

    if (validate()) {
      payload.bmi = BMI;
      payload.currentMedication = currentMedication;
      payload.labResult = labResult;
     payload.currentStatus = ""
      let today = moment().format("YYYY-MM-DD");
      let updatePayload = {
        data: payload,
        dateOfObservation: today,
        facilityId: facId,
        personId: patientObj.id,
        type: "ART Transfer Out",
        visitId: "",
      };
      postTransferForm(updatePayload);
    } else {
      window.scroll(0, 0);
    }
  };

  return (
    <div>
      <Card className={classes.root}>
        <CardBody>
          <form>

            <div className="row">
              <h2>Transfer {observationType === "ART Transfer Out" ? "Out" : "In"} Form</h2>
              <br/>
              <br/>
              {observationType !== "ART Transfer Out" ?
                  (
                      <div className="row">
                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label
                                for=""
                                style={{color: "#014d88", fontWeight: "bolder"}}
                            >
                              State Transfer From <span style={{color: "red"}}> *</span>{" "}
                            </Label>
                            <Input
                                type="select"
                                name="state"
                                style={{
                                  height: "40px",
                                  border: "solid 1px #014d88",
                                  borderRadius: "5px",
                                  fontWeight: "bolder",
                                  appearance: "auto",
                                }}
                                required
                                disabled={
                                  props.activeContent.actionType === "view" ? true : false
                                }
                                value={payload?.state}
                                // onChange={loadLGA1}
                                onChange={handleInputChangeLocation}
                            >
                              <option>Select State</option>
                              {states1.map((state) => (
                                  <option key={state.id} value={state.name}>
                                    {state.name}
                                  </option>
                              ))}
                            </Input>
                            {/*{errors.stateTransferTo !== "" ? (*/}
                            {/*    <span className={classes.error}>*/}
                            {/*      {errors.stateTransferTo}*/}
                            {/*    </span>*/}
                            {/*) : (*/}
                            {/*    ""*/}
                            {/*)}*/}
                          </FormGroup>
                        </div>

                        {/* LOCAL GOVERNMENT TARNASFER TO  */}

                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="testGroup">
                              Lga Transfer From <span style={{color: "red"}}> *</span>
                            </Label>

                            <Input
                                type="select"
                                name="lga"
                                style={{
                                  height: "40px",
                                  border: "solid 1px #014d88",
                                  borderRadius: "5px",
                                  fontWeight: "bolder",
                                  appearance: "auto",
                                }}
                                required
                                disabled={
                                  props.activeContent.actionType === "view" ? true : false
                                }
                                value={payload?.lga}
                                onChange={handleInputChangeLocation}
                            >
                              <option>Select Lga</option>
                              {lgas1.length > 0 &&
                                  lgas1.map((lga) => (
                                      <option key={lga.id} value={lga.name}>
                                        {lga.name}
                                      </option>
                                  ))}
                              {lgas1.length < 1 && (
                                  <option key={3} value={payload?.lga}>
                                    {payload?.lga}
                                  </option>
                              )}
                            </Input>
                          </FormGroup>
                        </div>

                        {/* FACILITY TRANSFER TO   */}

                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="testGroup">
                              Facility Transfer From{" "}
                              <span style={{color: "red"}}> *</span>
                            </Label>
                            <Input
                                type="select"
                                name="facilityTransferTo"
                                style={{
                                  height: "40px",
                                  border: "solid 1px #014d88",
                                  borderRadius: "5px",
                                  fontWeight: "bolder",
                                  appearance: "auto",
                                }}
                                required
                                disabled={
                                  props.activeContent.actionType === "view" ? true : false
                                }
                                value={payload.facilityTransferTo}
                                // onChange={loadLGA1}
                                onChange={handleInputChange}
                            >
                              <option>Select State</option>
                              {facilities1.length > 0 &&
                                  facilities1.map((fa) => (
                                      <option key={fa.id} value={fa.name}>
                                        {fa.name}
                                      </option>
                                  ))}

                              {facilities1.length < 1 && (
                                  <option key={3} value={payload?.facilityName}>
                                    {payload?.facilityName}
                                  </option>
                              )}
                            </Input>

                          </FormGroup>
                        </div>
                      </div>
                  ) : (
                      <div className="row">
                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label
                                for=""
                                style={{color: "#014d88", fontWeight: "bolder"}}
                            >
                              State Transfer To <span style={{color: "red"}}> *</span>{" "}
                            </Label>
                            <Input
                                type="select"
                                name="stateTransferTo"
                                style={{
                                  height: "40px",
                                  border: "solid 1px #014d88",
                                  borderRadius: "5px",
                                  fontWeight: "bolder",
                                  appearance: "auto",
                                }}
                                required
                                disabled={
                                  props.activeContent.actionType === "view" ? true : false
                                }
                                value={payload?.stateTransferTo}
                                // onChange={loadLGA1}
                                onChange={handleInputChangeLocation}
                            >
                              <option>Select State</option>
                              {states1.map((state) => (
                                  <option key={state.id} value={state.name}>
                                    {state.name}
                                  </option>
                              ))}
                            </Input>
                            {errors.stateTransferTo !== "" ? (
                                <span className={classes.error}>
                        {errors.stateTransferTo}
                      </span>
                            ) : (
                                ""
                            )}
                          </FormGroup>
                        </div>

                        {/* LOCAL GOVERNMENT TARNASFER TO  */}

                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="testGroup">
                              Lga Transfer To <span style={{color: "red"}}> *</span>
                            </Label>

                            <Input
                                type="select"
                                name="lgaTransferTo"
                                style={{
                                  height: "40px",
                                  border: "solid 1px #014d88",
                                  borderRadius: "5px",
                                  fontWeight: "bolder",
                                  appearance: "auto",
                                }}
                                required
                                disabled={
                                  props.activeContent.actionType === "view" ? true : false
                                }
                                value={payload?.lgaTransferTo}
                                onChange={handleInputChangeLocation}
                            >
                              <option>Select Lga</option>
                              {lgas1.length > 0 &&
                                  lgas1.map((lga) => (
                                      <option key={lga.id} value={lga.name}>
                                        {lga.name}
                                      </option>
                                  ))}
                              {lgas1.length < 1 && (
                                  <option key={3} value={payload?.lgaTransferTo}>
                                    {payload?.lgaTransferTo}
                                  </option>
                              )}
                            </Input>
                            {errors.lgaTransferTo !== "" ? (
                                <span className={classes.error}>
                        {errors.lgaTransferTo}
                      </span>
                            ) : (
                                ""
                            )}
                          </FormGroup>
                        </div>

                        {/* FACILITY TRANSFER TO   */}

                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="testGroup">
                              Facility Transfer To{" "}
                              <span style={{color: "red"}}> *</span>
                            </Label>
                            <Input
                                type="select"
                                name="facilityTransferTo"
                                style={{
                                  height: "40px",
                                  border: "solid 1px #014d88",
                                  borderRadius: "5px",
                                  fontWeight: "bolder",
                                  appearance: "auto",
                                }}
                                required
                                disabled={
                                  props.activeContent.actionType === "view" ? true : false
                                }
                                value={payload.facilityTransferTo}
                                // onChange={loadLGA1}
                                onChange={handleInputChange}
                            >
                              <option>Select State</option>
                              {facilities1.length > 0 &&
                                  facilities1.map((fa) => (
                                      <option key={fa.id} value={fa.name}>
                                        {fa.name}
                                      </option>
                                  ))}

                              {facilities1.length < 1 && (
                                  <option key={3} value={payload?.facilityTransferTo}>
                                    {payload?.facilityTransferTo}
                                  </option>
                              )}
                            </Input>
                            {errors.facilityTransferTo !== "" ? (
                                <span className={classes.error}>
                        {errors.facilityTransferTo}
                      </span>
                            ) : (
                                ""
                            )}
                          </FormGroup>
                        </div>
                      </div>
                  )}
              <div className="row">
                <div className="form-group mb-3 col-md-12">
                  <FormGroup>
                    <Label for="">Clinical Note</Label>

                    <Input
                        type="textarea"
                        name="clinicalNote"
                        id="clinicalNote"
                        onChange={handleInputChange}
                        value={payload?.clinicalNote}
                        style={{height: "70px"}}
                        disabled={
                          props.activeContent.actionType === "view" ? true : false
                        }
                    ></Input>
                    {/* {errors.reasonForTracking !== "" ? (
                      <span className={classes.error}>
                        {errors.reasonForTracking}
                      </span>
                    ) : (
                      ""
                    )} */}
                  </FormGroup>
                </div>
              </div>
              <div className="row">
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label>Date Confirmed HIV Positive </Label>
                    <input
                        className="form-control"
                        type="date"
                        name="dateConfirmed_Hiv"
                        // min="1940-01-01"
                        id="dob"
                        disabled={true}
                        //   max={basicInfo.dateOfRegistration}
                        value={payload.dateConfirmedHiv}
                        //   onChange={handleDobChange}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                    />
                  </FormGroup>
                </div>

                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="">
                      Mode of HIV Test <span style={{color: "red"}}> *</span>
                    </Label>

                    <Input
                        type="select"
                        name="modeOfHIVTest"
                        id="modeOfHIVTest"
                        onChange={handleInputChange}
                        disabled={
                          props.activeContent.actionType === "view" ? true : false
                        }
                        value={payload.modeOfHIVTest}
                    >
                      <option value="">Select Mode of HIV</option>

                      <option value="HIV-Ab">HIV-Ab</option>
                      <option value="PCR">PCR</option>
                    </Input>
                    {errors.modeOfHIVTest !== "" ? (
                        <span className={classes.error}>
                        {errors.modeOfHIVTest}
                      </span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>

                {patientObj.sex.toLowerCase() === "female" && (
                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="">Pregnancy Status</Label>

                        <Input
                            type="text"
                            name="pregnancyStatus"
                            id="pregnancyStatus"
                            // onChange={handleInputChange}
                            disabled={true}
                            value={payload.pregnancyStatus}
                        />
                        {/* {errors.reasonForTracking !== "" ? (
                      <span className={classes.error}>
                        {errors.reasonForTracking}
                      </span>
                    ) : (
                      ""
                    )} */}
                      </FormGroup>
                    </div>
                )}
                {patientObj.sex.toLowerCase() === "female" && (
                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="">Gestational Age in weeks</Label>

                        <Input
                            type="number"
                            name="gaInWeeks"
                            id="gaInWeeks"
                            onChange={handleInputChange}
                            value={payload?.gaInWeeks}
                        />
                        {errors.reasonForTrackingOthers !== "" ? (
                            <span className={classes.error}>
                          {errors.reasonForTrackingOthers}
                        </span>
                        ) : (
                            ""
                        )}
                      </FormGroup>
                    </div>
                )}
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="">Date Enroll in Care</Label>

                    <Input
                        type="date"
                        name="dateEnrolledInCare"
                        id="dateEnrolledInCare"
                        // onChange={handleInputChange}
                        disabled={true}
                        value={payload.dateEnrolledInCare}
                    />
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="">Date Enroll in Treatment</Label>

                    <Input
                        type="date"
                        name="dateEnrolledInTreatment"
                        id="dateEnrolledInTreatment"
                        // onChange={handleInputChange}
                        disabled={true}
                        value={payload.dateEnrolledInTreatment}
                    />
                    {/* {errors.reasonForTrackingOthers !== "" ? (
                      <span className={classes.error}>
                        {errors.reasonForTrackingOthers}
                      </span>
                    ) : (
                      ""
                    )} */}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="">Current WHO Clinical Stage</Label>

                    <Input
                        type="text"
                        name="currentWhoStage"
                        id="currentWhoStage"
                        // onChange={handleInputChange}
                        disabled={true}
                        value={payload.currentWhoClinical}
                    />
                    {/* {errors.reasonForTracking !== "" ? (
                      <span className={classes.error}>
                        {errors.reasonForTracking}
                      </span>
                    ) : (
                      ""
                    )} */}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for=""> Baseline CD4 Counts(mm3 )</Label>

                    <Input
                        type="text"
                        name="baselineCD4Count"
                        id="baselineCD4Count"
                        onChange={handleInputChange}
                        disabled={true}
                        value={payload.baselineCD4}
                    />
                    {/* {errors.reasonForTrackingOthers !== "" ? (
                      <span className={classes.error}>
                        {errors.reasonForTrackingOthers}
                      </span>
                    ) : (
                      ""
                    )} */}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="">Current CD4</Label>

                    <Input
                        type="text"
                        name="reasonForTrackingOthers"
                        id="reasonForTrackingOthers"
                        onChange={handleInputChange}
                        value={payload.currentCD4Count}
                        disabled={true}
                    />
                    {/* {errors.reasonForTrackingOthers !== "" ? (
                      <span className={classes.error}>
                        {errors.reasonForTrackingOthers}
                      </span>
                    ) : (
                      ""
                    )} */}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for=""> Current viral load (copies/ml)</Label>

                    <Input
                        type="text"
                        name="viralLoad"
                        id="viralLoad"
                        // onChange={handleInputChange}
                        disabled={true}
                        value={payload.viralLoad}
                    />
                    {/* {errors.reasonForTrackingOthers !== "" ? (
                      <span className={classes.error}>
                        {errors.reasonForTrackingOthers}
                      </span>
                    ) : (
                      ""
                    )} */}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="">Height/length (m/cm)</Label>

                    <Input
                        type="text"
                        name="height"
                        id="height"
                        onChange={handleInputChange}
                        disabled={true}
                        value={payload?.height}
                    />
                    {/* {errors.reasonForTracking !== "" ? (
                      <span className={classes.error}>
                        {errors.reasonForTracking}
                      </span>
                    ) : (
                      ""
                    )} */}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for=""> Weight (kg)</Label>

                    <Input
                        type="text"
                        name="weight"
                        id="weight"
                        // onChange={handleInputChange}
                        disabled={true}
                        value={payload?.weight}
                    />
                    {/* {errors.reasonForTrackingOthers !== "" ? (
                      <span className={classes.error}>
                        {errors.reasonForTrackingOthers}
                      </span>
                    ) : (
                      ""
                    )} */}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="">BMI/MUAC </Label>

                    <Input
                        type="text"
                        disabled={true}
                        name="bmi"
                        id="bmi"
                        onChange={handleInputChange}
                        value={payload.bmi}
                    />
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="">Original first line ART regimen</Label>

                    <Input
                        type="text"
                        name="firstLineArtRegimen"
                        id="firstLineArtRegimen"
                        onChange={handleInputChange}
                        disabled={true}
                        value={payload?.firstLineArtRegimen}
                    />
                    {errors.reasonForTracking !== "" ? (
                        <span className={classes.error}>
                        {errors.reasonForTracking}
                      </span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="">Current Regimen Line</Label>

                    <Input
                        type="text"
                        name="currentRegimenLine"
                        id="currentRegimenLine"
                        onChange={handleInputChange}
                        disabled={true}
                        value={payload?.currentRegimenLine}
                    />
                    {errors.reasonForTrackingOthers !== "" ? (
                        <span className={classes.error}>
                        {errors.reasonForTrackingOthers}
                      </span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>
              </div>

              <div className="row">
                <div className="form-group mb-1 col-md-12 ">
                  <h3>Current Medications/ Dose </h3>
                  <table
                      class="table px-5 pt-2 mt-3 pb-0 table-bordered"
                      style={{
                        border: "2px solid #e9ecef",
                        borderRadius: "0.25rem",
                      }}
                  >
                    <thead class="table-dark" style={{background: "#014d88"}}>
                    <tr>
                      <th scope="col" style={{fontSize: "14px"}}>
                        Regimen Name
                      </th>
                      <th scope="col" style={{fontSize: "14px"}}>
                        Frequency
                      </th>
                      <th scope="col" style={{fontSize: "14px"}}>
                        Duration
                      </th>
                      <th scope="col" style={{fontSize: "14px"}}>
                        Quantity Prescribed
                      </th>
                      <th scope="col" style={{fontSize: "14px"}}>
                        Dispense
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentMedication &&
                        currentMedication.slice(0, 5).map((each, index) => {
                          return (
                              <tr>
                                <td scope="row">{each?.regimenName}</td>
                                <td>{each?.frequency}</td>
                                <td>{each?.duration}</td>
                                <td>{each?.prescribed}</td>
                                <td>{each?.dispense}</td>
                              </tr>
                          );
                        })}
                    </tbody>
                  </table>

                  <br/>
                  {/* <p>Medications list will be here </p> */}
                  {/* </FormGroup> */}
                </div>
              </div>
              <div className="row">
                <div className="mb-5 col-md-12 mt-0">
                  <h3>Latest lab results </h3>
                  <table
                      class="table px-5 pt-2 mt-3 pb-0 table-bordered"
                      style={{
                        border: "2px solid #e9ecef",
                        borderRadius: "0.25rem",
                      }}
                  >
                    <thead class="table-dark" style={{background: "#014d88"}}>
                    <tr>
                      <th scope="col" style={{fontSize: "14px"}}>
                        Date
                      </th>
                      <th scope="col" style={{fontSize: "14px"}}>
                        Test
                      </th>
                      <th scope="col" style={{fontSize: "14px"}}>
                        Value
                      </th>
                      <th scope="col" style={{fontSize: "14px"}}>
                        When next due
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                    {labResult.slice(0, 5).map((each, index) => {
                      return (
                          <tr>
                            <td scope="row">
                              {
                                new Date(each.dateReported)
                                    .toISOString()
                                    .split("T")[0]
                              }
                            </td>
                            <td>{each.test}</td>
                            <td>{each.result}</td>
                            <td className="row">
                              {" "}
                              <FormGroup className="col-md-6">
                                <Input
                                    type="text"
                                    // name="facilityName"
                                    // id="facilityName"
                                    // onChange={handleInputChange}
                                    // disabled={true}
                                    // value={payload?.facilityName}
                                ></Input>
                              </FormGroup>
                            </td>
                          </tr>
                      );
                    })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* <div className="row">
                <div className="form-group mb-3 col-md-12">
                  <FormGroup>
                    <Label for=""></Label>
                    <br />
                    <p>Lab list will be here </p>
                  </FormGroup>
                </div>
              </div> */}
              <div className="row">
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for=""> Adherence Measure </Label>
                    <Input
                        type="text"
                        name="adherenceLevel"
                        id="adherenceLevel"
                        onChange={handleInputChange}
                        disabled={true}
                        value={payload.adherenceLevel}
                    />
                  </FormGroup>
                </div>

                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="">
                      Reason for Transfer{" "}
                      <span style={{color: "red"}}> *</span>
                    </Label>
                    <Input
                        type="select"
                        name="reasonForTransfer"
                        id="reasonForTransfer"
                        onChange={handleInputChange}
                        disabled={
                          props.activeContent.actionType === "view" ? true : false
                        }
                        value={payload.reasonForTransfer}
                        //min= {moment(payload.dateOfLastViralLoad).format("YYYY-MM-DD") }
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                    >
                      <option value="">Select reason for transfer</option>

                      {reasonForTransfer.map((each, index) => {
                        return (
                            <option value={each} key={each}>
                              {each}
                            </option>
                        );
                      })}
                    </Input>
                    {errors.reasonForTransfer !== "" ? (
                        <span className={classes.error}>
                        {errors.reasonForTransfer}
                      </span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="">Name of Treatment supporter</Label>
                    <Input
                        type="text"
                        name="nameOfTreatmentSupporter"
                        id="nameOfTreatmentSupporter"
                        disabled={
                          props.activeContent.actionType === "view" ? true : false
                        }
                        onChange={handleInputChange}
                        value={payload.nameOfTreatmentSupporter}
                        //min= {moment(payload.dateOfLastViralLoad).format("YYYY-MM-DD") }
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                    />
                    {errors.dateLastAppointment !== "" ? (
                        <span className={classes.error}>
                        {errors.dateLastAppointment}
                      </span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="">
                      Contact Address(Home/Office) of Treatment supporter
                    </Label>
                    <Input
                        type="text"
                        disabled={
                          props.activeContent.actionType === "view" ? true : false
                        }
                        name="contactAddressOfTreatmentSupporter"
                        id="contactAddressOfTreatmentSupporter"
                        onChange={handleInputChange}
                        value={payload.contactAddressOfTreatmentSupporter}
                        //min= {moment(payload.dateOfLastViralLoad).format("YYYY-MM-DD") }
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                    />
                    {errors.dateLastAppointment !== "" ? (
                        <span className={classes.error}>
                        {errors.dateLastAppointment}
                      </span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>

                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="">Phone Number of Treatment supporter </Label>
                    <Input
                        type="number"
                        name="phoneNumberOfTreatmentSupporter"
                        disabled={
                          props.activeContent.actionType === "view" ? true : false
                        }
                        id="phoneNumberOfTreatmentSupporter"
                        onChange={handleInputChange}
                        value={payload.phoneNumberOfTreatmentSupporter}
                        //min= {moment(payload.dateOfLastViralLoad).format("YYYY-MM-DD") }
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                    />
                    {errors.dateLastAppointment !== "" ? (
                        <span className={classes.error}>
                        {errors.dateLastAppointment}
                      </span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>

                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="">Relationship with Clients</Label>
                    <Input
                        type="text"
                        name="relationshipWithClients"
                        id="relationshipWithClients"
                        disabled={
                          props.activeContent.actionType === "view" ? true : false
                        }
                        onChange={handleInputChange}
                        value={payload.relationshipWithClients}
                        //min= {moment(payload.dateOfLastViralLoad).format("YYYY-MM-DD") }
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                    />
                    {errors.dateLastAppointment !== "" ? (
                        <span className={classes.error}>
                        {errors.dateLastAppointment}
                      </span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>

                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="">
                      Additional Notes and/or Recommendations
                    </Label>
                    <Input
                        type="textarea"
                        name="recommendations"
                        id="recommendations"
                        disabled={
                          props.activeContent.actionType === "view" ? true : false
                        }
                        onChange={handleInputChange}
                        value={payload.recommendations}
                        //min= {moment(payload.dateOfLastViralLoad).format("YYYY-MM-DD") }
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                          // height: "70px",
                        }}
                    />
                    {errors.dateMissedAppointment !== "" ? (
                        <span className={classes.error}>
                        {errors.dateMissedAppointment}
                      </span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="">Clinicians's Name </Label>
                    <Input
                        type="text"
                        name="cliniciansName"
                        id="cliniciansName"
                        disabled={
                          props.activeContent.actionType === "view" ? true : false
                        }
                        onChange={handleInputChange}
                        value={payload.cliniciansName}
                        //min= {moment(payload.dateOfLastViralLoad).format("YYYY-MM-DD") }
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                    />
                    {errors.dateLastAppointment !== "" ? (
                        <span className={classes.error}>
                        {errors.dateLastAppointment}
                      </span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>

                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="">
                      Date of last clinical visit at transferring site
                    </Label>
                    <Input
                        type="date"
                        name="dateOfClinicVisitAtTransferringSite"
                        id="dateOfClinicVisitAtTransferringSite"
                        disabled={
                          props.activeContent.actionType === "view" ? true : false
                        }
                        onChange={handleInputChange}
                        value={payload.dateOfClinicVisitAtTransferringSite}
                        //min= {moment(payload.dateOfLastViralLoad).format("YYYY-MM-DD") }
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                    />
                    {errors.dateLastAppointment !== "" ? (
                        <span className={classes.error}>
                        {errors.dateLastAppointment}
                      </span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="">
                      Date of first confirmed scheduled appointment at receiving
                      site
                    </Label>
                    <Input
                        type="date"
                        name="dateOfFirstConfirmedScheduleApp"
                        id="dateOfFirstConfirmedScheduleApp"
                        disabled={
                          props.activeContent.actionType === "view" ? true : false
                        }
                        onChange={handleInputChange}
                        value={payload.dateOfFirstConfirmedScheduleApp}
                        //min= {moment(payload.dateOfLastViralLoad).format("YYYY-MM-DD") }
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                    />
                    {errors.dateLastAppointment !== "" ? (
                        <span className={classes.error}>
                        {errors.dateLastAppointment}
                      </span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="">
                      Name of the person effecting the transfer
                    </Label>
                    <Input
                        type="text"
                        name="personEffectingTheTransfer"
                        id="personEffectingTheTransfer"
                        disabled={
                          props.activeContent.actionType === "view" ? true : false
                        }
                        onChange={handleInputChange}
                        value={payload.personEffectingTheTransfer}
                        //min= {moment(objValues.dateOfLastViralLoad).format("YYYY-MM-DD") }
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                    />
                    {errors.dateLastAppointment !== "" ? (
                        <span className={classes.error}>
                        {errors.dateLastAppointment}
                      </span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>
              </div>
              <h3 className="mb-4 mt-5">
                ACKNOWLEDGEMENT OF TRANSFER (to be completed by receiving ART
                service point)
              </h3>
              <div className="row">
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for=""> Patient came with Transfer form</Label>

                    <Input
                        type="select"
                        name="patientCameWithTransferForm"
                        id="patientCameWithTransferForm"
                        disabled={
                          props.activeContent.actionType === "view" ? true : false
                        }
                        onChange={handleInputChange}
                        value={payload.patientCameWithTransferForm}
                        //min= {moment(objValues.dateOfLastViralLoad).format("YYYY-MM-DD") }
                    >
                      <option value=""></option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Input>
                    {errors.reasonForTrackingOthers !== "" ? (
                        <span className={classes.error}>
                        {errors.reasonForTrackingOthers}
                      </span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="">
                      Patient has attended his/her first visit at our ART site
                    </Label>
                    <Input
                        type="select"
                        name="patientAttendedHerFirstVisit"
                        disabled={
                          props.activeContent.actionType === "view" ? true : false
                        }
                        id="patientAttendedHerFirstVisit"
                        onChange={handleInputChange}
                        value={payload.patientAttendedHerFirstVisit}
                        //min= {moment(objValues.dateOfLastViralLoad).format("YYYY-MM-DD") }
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                    >
                      <option value=""></option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Input>
                    {errors.dateLastAppointment !== "" ? (
                        <span className={classes.error}>
                        {errors.dateLastAppointment}
                      </span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="">Received date</Label>
                    <Input
                        type="date"
                        name="acknowlegdeReceiveDate"
                        disabled={
                          props.activeContent.actionType === "view" ? true : false
                        }
                        id="acknowlegdeReceiveDate"
                        onChange={handleInputChange}
                        value={payload.acknowlegdeReceiveDate}
                        //min= {moment(objValues.dateOfLastViralLoad).format("YYYY-MM-DD") }
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                    />
                    {errors.dateLastAppointment !== "" ? (
                        <span className={classes.error}>
                        {errors.dateLastAppointment}
                      </span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="">Date of visit</Label>
                    <Input
                        type="date"
                        name="acknowledgementDateOfVisit"
                        disabled={
                          props.activeContent.actionType === "view" ? true : false
                        }
                        id="acknowledgementDateOfVisit"
                        onChange={handleInputChange}
                        value={payload.acknowledgementDateOfVisit}
                        //min= {moment(objValues.dateOfLastViralLoad).format("YYYY-MM-DD") }
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                    />
                    {errors.dateLastAppointment !== "" ? (
                        <span className={classes.error}>
                        {errors.dateLastAppointment}
                      </span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="">
                      Name of the Clinician receiving the transfere
                    </Label>
                    <Input
                        type="text"
                        name="nameOfClinicianReceivingTheTransfer"
                        disabled={
                          props.activeContent.actionType === "view" ? true : false
                        }
                        id="nameOfClinicianReceivingTheTransfer"
                        onChange={handleInputChange}
                        value={payload.nameOfClinicianReceivingTheTransfer}
                        //min= {moment(objValues.dateOfLastViralLoad).format("YYYY-MM-DD") }
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                    />
                    {errors.dateLastAppointment !== "" ? (
                        <span className={classes.error}>
                        {errors.dateLastAppointment}
                      </span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label for="">Telephone Number</Label>
                    <Input
                        type="number"
                        name="clinicianTelephoneNumber"
                        id="clinicianTelephoneNumber"
                        onChange={handleInputChange}
                        disabled={
                          props.activeContent.actionType === "view" ? true : false
                        }
                        value={payload.clinicianTelephoneNumber}
                        //min= {moment(objValues.dateOfLastViralLoad).format("YYYY-MM-DD") }
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                    />
                    {errors.dateLastAppointment !== "" ? (
                        <span className={classes.error}>
                        {errors.dateLastAppointment}
                      </span>
                    ) : (
                        ""
                    )}
                  </FormGroup>
                </div>
              </div>
            </div>
          </form>
          {props.activeContent.actionType === "update" && (
              <div>
                {saving ? <Spinner/> : ""}
                <br/>

                <MatButton
                    type="button"
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    startIcon={<SaveIcon/>}
                    onClick={handleSubmit}
                    style={{backgroundColor: "#014d88"}}
                    // disabled={objValues.dateOfEac1 === "" ? true : false}
                >
                  {!saving ? (
                      <span style={{textTransform: "capitalize"}}>Update</span>
                  ) : (
                      <span style={{textTransform: "capitalize"}}>Saving...</span>
                  )}
                </MatButton>
              </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default DashboardFilledTransferForm;

/**
 * {
 "eye": {
 "nsf": "",
 "oral": "",
 "other": "",
 "thrush": "",
 "icterus": "",
 "abnormal": ""
 },
 "who": {
 "stage": "119"
 },
 "plan": {
 "cd4Type": "Semi-Quantitative",
 "cd4Count": ">=200"
 },
 "skin": {
 "nsf": "",
 "other": "",
 "fungal": "",
 "herpes": "",
 "kaposi": "",
 "pruritic": "",
 "abscesses": "",
 "suborrheic": ""
 },
 "breast": {
 "nsf": "",
 "lumps": "",
 "other": "",
 "discharge": ""
 },
 "enroll": {
 "enrollIn": "ARV therapy"
 },
 "planArt": {
 "previousArvExposure": "Start new treatment"
 },
 "regimen": {
 "regimen": "122",
 "regimenLine": "3"
 },
 "assesment": {
 "assessment": "Asymptomatic"
 },
 "genitalia": {
 "nsf": "",
 "other": "",
 "inguinal": "",
 "genital_ulcer": "",
 "genital_discharge": ""
 },
 "visitDate": "",
 "respiratory": {
 "nsf": "",
 "rate": "",
 "other": "",
 "labored": "",
 "cyanosis": "",
 "wheezing": "",
 "intercostal": "",
 "auscultation_finding": ""
 },
 "mentalstatus": {
 "nsf": "",
 "other": "",
 "anxiety": "",
 "ideation": "",
 "mentation": "",
 "depression": "",
 "memoryloss": "",
 "moodSwings": "",
 "tenderness": ""
 },
 "neurological": {
 "nsf": "",
 "other": "",
 "paresis": "",
 "numbness": "",
 "blindness": "",
 "orientation": "",
 "speechSlurs": "",
 "neckStiffness": ""
 },
 "cardiovascular": {
 "nsf": "",
 "other": "",
 "abnormal_heart_rate": ""
 },
 "currentMedical": "",
 "medicalHistory": {
 "pain": "",
 "rash": "",
 "cough": "",
 "fever": "",
 "Nausea": "",
 "friend": "",
 "recent": "",
 "spouse": "",
 "chronic": "",
 "genital": "",
 "itching": "",
 "headache": "",
 "numbness": "",
 "currentART": "",
 "currentCTX": "",
 "fatherName": "",
 "motherName": "",
 "new_visual": "",
 "Nausea_fever": "",
 "familyMember": "",
 "currentOthers": "",
 "fatherAddress": "",
 "genital_score": "",
 "motherAddress": "",
 "pain_duration": "",
 "rash_duration": "",
 "screen_for_tb": "Yes",
 "cough_duration": "",
 "drug_allergies": "No side effects",
 "fever_duration": "",
 "night_duration": "",
 "disclosureNoOne": "",
 "hospitalization": "",
 "howManySibiling": "",
 "recent_duration": "",
 "spiritualLeader": "",
 "childFatherAlive": "No",
 "childMotherAlive": "No",
 "chronic_duration": "",
 "disclosureOthers": "",
 "genital_duration": "",
 "itching_duration": "",
 "headache_duration": "",
 "numbness_duration": "",
 "currentAntiTbDdrugs": "",
 "duration_of_care_to": "",
 "modeOfInfantFeeding": "",
 "new_visual_duration": "",
 "shortness_of_breath": "",
 "immunisationComplete": "",
 "name_of_the_facility": "",
 "past_medical_history": "",
 "CurrentMedicationNone": "",
 "as_never_receive_arvs": "",
 "duration_of_care_from": "",
 "previous_arv_exposure": "",
 "genital_score_duration": "",
 "HivStatusCanBeDiscussed": "",
 "relevant_family_history": "",
 "parentChildMarriageStatus": "Married",
 "shortness_of_breath_duration": "",
 "early_arv_but_not_transfer_in": ""
 },
 "pastArvMedical": {
 "none": "on"
 },
 "nextAppointment": "2024-02-28",
 "gastrointestinal": {
 "nsf": "",
 "other": "",
 "distention": "",
 "tenderness": "",
 "spenomegaly": "",
 "hepatomegaly": ""
 },
 "generalApperance": {
 "nsf": "",
 "other": "",
 "pallor": "",
 "febrile": "",
 "dehydrated": "",
 "peripheral": ""
 },
 "patientDisclosure": "",
 "physicalExamination": {
 "height": "135",
 "bodyWeight": "35"
 }
 }
 */
