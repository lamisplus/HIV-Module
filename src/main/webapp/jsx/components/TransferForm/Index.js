import React, { useState, useEffect } from "react";
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
import { useRowState } from "react-table";

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

const Tracking = (props) => {
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
    const [facId, setFacId] = useState(localStorage.getItem("facId"))
    const [attemptList, setAttemptList] = useState([]);
    // const [selectedLga, setSelectedLga] = useState("");
    const [reasonForTransfer, setReasonForTransfer] = useState([
        "Relocating",
        "Closeness to new facility",
        "Self Transfer",
        "Stigma",
        "PMTCT",
    ]);
    const [isPatientTransferredOut, setIsPatientTransferredOut] = useState(false);

    const [currentMedication, setCurrentMedication] = useState([]);
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

    });


    const [states1, setStates1] = useState([])
    const [lgas1, setLGAs1] = useState([])
    const [facilities1, setFacilities1] = useState([])
    const [selectedState, setSelectedState] = useState({})
    const [selectedFacility, setSelectedFacility] = useState({});
    const [selectedLga, setSelectedLga] = useState({});

    useEffect(() => {
        getPatientActivities()
    }, []);

    const getPatientActivities = async () => {
        try {
            const response = await axios.get(
                `${baseUrl}hiv/patients/${patientObj.id}/history/activities`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const activities = response.data;
            // check each activities in th response data if there is an activity.name that is equal to "ART Transfer Out", if yes set isPatientTransferredOut to true
            const isPatientTransferredOut = activities.some(
                (activity) => activity.name === "ART Transfer Out"
            );
            setIsPatientTransferredOut(isPatientTransferredOut);
        } catch (error) {
            toast.error("Fill DSD Form", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };

    const loadStates1 = () => {
        axios.get(`${baseUrl}organisation-units/parent-organisation-units/1`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
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
        axios.get(`${baseUrl}organisation-units/parent-organisation-units/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
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
        axios.get(`${baseUrl}organisation-units/parent-organisation-units/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.data) {
                    setFacilities1(response.data);
                    // const selectedFacility = response.data.find(facility => facility.id === id);
                    // setPayload(prevPayload => ({ ...prevPayload, facilityTransferTo: selectedFacility ? selectedFacility.name : "" }));
                }
            })
            .catch((e) => {
                // console.log("Fetch Facilities error" + e);
            });
    };

    // useEffect(() => {
    //     console.log("State Transfer To:", payload.stateTransferTo);
    //     console.log("LGA Transfer To:", payload.lgaTransferTo);
    //     console.log("Facility Transfer To:", payload.facilityTransferTo);
    // }, [payload.facilityTransferTo, payload.stateTransferTo, payload.lgaTransferTo]);

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++




    const checkNumberLimit = (e) => {
        const limit = 11;
        const acceptedNumber = e.slice(0, limit);
        return acceptedNumber;
    };

    const handleInputChangePhoneNumber = (e, inputName) => {
        const limit = 11;
        const NumberValue = checkNumberLimit(e.target.value.replace(/\D/g, ""));
        setPayload({ ...payload, [inputName]: NumberValue });
    };

    const getTreatmentInfo = () => {
        // let facId = localStorage.getItem("faciltyId");

        axios
            .get(`${baseUrl}treatment-transfers/info/${facId}/${patientObj.personUuid}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {

                setTransferInfo(response.data);
            })
            .catch((error) => { });
    };

    // get current Medication dose
    const getCurrentMedication = () => {
        axios
            .get(`${baseUrl}treatment-transfers/${patientObj.personUuid}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setCurrentMedication(response.data);
            })
            .catch((error) => { });
    };
    //
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
                setLabResult(response.data);
            })
            .catch((error) => { });
    };

    const postTransferForm = (load) => {
        axios
            .post(`${baseUrl}treatment-transfers/save`, load, {
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
    }




    // when component mounts

    useEffect(() => {
        loadStates1();
        getTreatmentInfo();
        getLabResult();
        getCurrentMedication();
    }, []);

    useEffect(() => {
        setPayload({ ...payload, ...transferInfo });
        calculateBMI();
    }, [transferInfo]);

    const handleInputChange = (e) => {
        setErrors({ ...temp, [e.target.name]: "" });
        setPayload({ ...payload, [e.target.name]: e.target.value });
    };

    // handle Facility Name to slect drop down
    // const handleInputChangeObject = (e) => {
    //     setPayload({
    //         ...payload,
    //         facilityTransferTo: e.name,
    //         stateTransferTo: e.parentParentOrganisationUnitName,
    //         lgaTransferTo: e.parentOrganisationUnitName,
    //     });
    //     setErrors({ ...errors, facilityTransferTo: "" });
    //     setSelectedState(e.parentParentOrganisationUnitName);
    //     setSelectedLga(e.parentOrganisationUnitName);
    // };
    const [attempt, setAttempt] = useState({
        attemptDate: "",
        whoAttemptedContact: "",
        modeOfConatct: "",
        personContacted: "",
        reasonForDefaulting: "",
        reasonForDefaultingOthers: "",
    });


    const handleInputChangeAttempt = (e) => {

        setErrors({ ...temp, [e.target.name]: "" });
        setAttempt({ ...attempt, [e.target.name]: e.target.value });
    };
    //Validations of the forms
    const validate = () => {
        // new error validaqtion
        temp.facilityTransferTo = payload.facilityTransferTo
            ? ""
            : "This field is required";
        temp.reasonForTransfer = payload.reasonForTransfer
            ? ""
            : "This field is required";
        temp.modeOfHIVTest = payload.modeOfHIVTest ? "" : "This field is required";
        temp.stateTransferTo = payload.stateTransferTo ? "" : "This field is required";
        temp.lgaTransferTo = payload.lgaTransferTo ? "" : "This field is required";
        temp.facilityTransferTo = payload.facilityTransferTo ? "" : "This field is required";

        setErrors({
            ...temp,
        });
        return Object.values(temp).every((x) => x == "");
    };
    //Validations of the forms
    const validateAttempt = () => {
        temp.attemptDate = attempt.attemptDate ? "" : "This field is required";
        temp.whoAttemptedContact = attempt.whoAttemptedContact
            ? ""
            : "This field is required";
        temp.modeOfConatct = attempt.modeOfConatct ? "" : "This field is required";
        temp.personContacted = attempt.personContacted
            ? ""
            : "This field is required";
        temp.reasonForDefaulting = attempt.reasonForDefaulting
            ? ""
            : "This field is required";
        setErrors({
            ...temp,
        });
        return Object.values(temp).every((x) => x == "");
    };
    const addAttempt = (e) => {
        if (validateAttempt()) {
            setAttemptList([...attemptList, attempt]);
            setAttempt({
                attemptDate: "",
                whoAttemptedContact: "",
                modeOfConatct: "",
                personContacted: "",
                reasonForDefaulting: "",
                reasonForDefaultingOthers: "",
            });
        } else {
            toast.error("Please fill the required fields");
        }
    };

    /* Remove ADR  function **/
    const removeAttempt = (index) => {
        attemptList.splice(index, 1);
        setAttemptList([...attemptList]);
    };

    /**** Submit Button Processing  */
    const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
            payload.bmi = BMI;
            payload.currentMedication = currentMedication;
            payload.labResult = labResult;
            if (isPatientTransferredOut) {
                toast.error("A transfer-out form has already been filled for this patient", {
                    position: toast.POSITION.BOTTOM_CENTER,
                });
                setSaving(false);
                return;
            }
            postTransferForm(payload);
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
                            <h2>Transfer Form</h2>
                            <br />
                            <br />
                            <div className="row">

                                <div className="form-group mb-3 col-md-4">
                                    <FormGroup>
                                        <Label for=""> State Transfer From</Label>
                                        <Input
                                            type="text"
                                            name="state"
                                            id="state"
                                            disabled={true}
                                            onChange={handleInputChange}
                                            value={payload?.state}
                                        ></Input>
                                    </FormGroup>
                                </div>
                                <div className="form-group mb-3 col-md-4">
                                    <FormGroup>
                                        <Label for="">LGA Transfer From</Label>
                                        <Input
                                            type="text"
                                            name="lga"
                                            id="lga"
                                            onChange={handleInputChange}
                                            disabled={true}
                                            value={payload?.lga}
                                        ></Input>
                                    </FormGroup>
                                </div>
                                <div className="form-group mb-3 col-md-4">
                                    <FormGroup>
                                        <Label for="">Facility Name From</Label>
                                        <Input
                                            type="text"
                                            name="facilityName"
                                            id="facilityName"
                                            onChange={handleInputChange}
                                            disabled={true}
                                            value={payload?.facilityName}
                                        ></Input>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group mb-3 col-md-4">
                                    <FormGroup>
                                        <Label for="" style={{ color: '#014d88', fontWeight: 'bolder' }}>State Transfer To <span style={{ color: "red" }}> *</span> </Label>
                                        <Input
                                            type="select"
                                            name="stateTransferTo"
                                            style={{ height: "40px", border: 'solid 1px #014d88', borderRadius: '5px', fontWeight: 'bolder', appearance: 'auto' }}
                                            required
                                            // onChange={loadLGA1}
                                            onChange={(e) => {
                                                if (e.target.value !== "") {
                                                    const filterState = states1.filter(st => {
                                                        return Number(st.id) === Number(e.target.value)
                                                    }
                                                    )
                                                    setSelectedState(filterState)

                                                    setPayload(prevPayload => ({ ...prevPayload, stateTransferTo: filterState[0].name }));
                                                }
                                                loadLGA1(e.target.value);
                                            }}

                                        >
                                            <option>Select State</option>
                                            {states1.map((state) => (
                                                <option key={state.id} value={state.id}>
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
                                <div className="form-group mb-3 col-md-4">
                                    <FormGroup>
                                        <Label for="" style={{ color: '#014d88', fontWeight: 'bolder' }}>LGA Transfer To <span style={{ color: "red" }}> *</span></Label>
                                        <Input
                                            type="select"
                                            name="lgaTransferTo"
                                            style={{ height: "40px", border: 'solid 1px #014d88', borderRadius: '5px', fontWeight: 'bolder', appearance: 'auto' }}
                                            required
                                            // onChange={loadFacilities1}
                                            onChange={(e) => {
                                                if (e.target.value !== "") {
                                                    const filterlga = lgas1.filter(lg => {
                                                        return Number(lg.id) === Number(e.target.value)
                                                    }
                                                    )
                                                    setSelectedLga(filterlga)

                                                    setPayload(prevPayload => ({ ...prevPayload, lgaTransferTo: filterlga[0].name }));
                                                }
                                                loadFacilities1(e.target.value);

                                            }}

                                        >
                                            <option>Select LGA</option>
                                            {lgas1.map((lga) => (
                                                <option key={lga.id} value={lga.id}>
                                                    {lga.name}
                                                </option>
                                            ))}
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
                                <div className="form-group mb-3 col-md-4">
                                    <FormGroup>
                                        <Label for="" style={{ color: '#014d88', fontWeight: 'bolder' }}>Facility Transfer To <span style={{ color: "red" }}> *</span> </Label>
                                        <Input
                                            type="select"
                                            name="facilityTransferTo"
                                            style={{ height: "40px", border: 'solid 1px #014d88', borderRadius: '5px', fontWeight: 'bolder', appearance: 'auto' }}
                                            required
                                            onChange={(e) => {
                                                // setPayload(prevPayload => ({ ...prevPayload, facilityTransferTo: e.target.value }));
                                                if (e.target.value !== "") {
                                                    const filterFacility = facilities1.filter(fa => {
                                                        return Number(fa.id) === Number(e.target.value)
                                                    }
                                                    )
                                                    setSelectedFacility(filterFacility)
                                                    setPayload(prevPayload => ({ ...prevPayload, facilityTransferTo: filterFacility[0].name }));
                                                }
                                            }}
                                        >
                                            <option>Select Facility</option>
                                            {facilities1.map((facility) => (
                                                <option key={facility.id} value={facility.id}>
                                                    {facility.name}
                                                </option>
                                            ))}
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
                            {/* <div className="row"> */}
                            {/* <div className="form-group mb-3 col-md-4">
                                    <FormGroup>
                                        <Label for="testGroup">
                                            Facility Name To <span style={{ color: "red" }}> *</span>
                                        </Label>

                                        <Select
                                            //value={selectedOption}
                                            onChange={handleInputChangeObject}
                                            name="facilityTransferTo"
                                            options={allFacilities}
                                            theme={(theme) => ({
                                                ...theme,
                                                borderRadius: "0.25rem",
                                                border: "1px solid #014D88",
                                                colors: {
                                                    ...theme.colors,
                                                    primary25: "#014D88",
                                                    primary: "#014D88",
                                                },
                                            })}
                                        />
                                        {errors.facilityTransferTo !== "" ? (
                                            <span className={classes.error}>
                                                {errors.facilityTransferTo}
                                            </span>
                                        ) : (
                                            ""
                                        )}
                                    </FormGroup>
                                </div> */}

                            {/* <div className="form-group mb-3 col-md-4">
                                    <FormGroup>
                                        <Label for=""> State Transfer To</Label>
                                        <Input
                                            type="text"
                                            name="stateTransferTo"
                                            id="stateTransferTo"
                                            disabled={true}
                                            // onChange={handleInputChange}
                                            value={selectedState}
                                        ></Input>
                                    </FormGroup>
                                </div> */}
                            {/* <div className="form-group mb-3 col-md-4">
                                    <FormGroup>
                                        <Label for="">LGA Transfer To</Label>

                                        <Input
                                            type="text"
                                            name="lgaTransferTo"
                                            id="lgaTransferTo"
                                            disabled={true}
                                            // onChange={handleInputChange}
                                            value={selectedLga}
                                        ></Input>
                                    </FormGroup>
                                </div> */}
                            {/* </div>  */}
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
                                            style={{ height: "70px" }}
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
                                            Mode of HIV Test <span style={{ color: "red" }}> *</span>
                                        </Label>

                                        <Input
                                            type="select"
                                            name="modeOfHIVTest"
                                            id="modeOfHIVTest"
                                            onChange={handleInputChange}
                                            value={payload.modeOfHIVTest}
                                        >
                                            <option value="">Select Mode of HIV </option>

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
                                            value={BMI}
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
                                        <thead class="table-dark" style={{ background: "#014d88" }}>
                                            <tr>
                                                <th scope="col" style={{ fontSize: "14px" }}>
                                                    Regimen Name
                                                </th>
                                                <th scope="col" style={{ fontSize: "14px" }}>
                                                    Frequency
                                                </th>
                                                <th scope="col" style={{ fontSize: "14px" }}>
                                                    Duration
                                                </th>
                                                <th scope="col" style={{ fontSize: "14px" }}>
                                                    Quantity Prescribed
                                                </th>
                                                <th scope="col" style={{ fontSize: "14px" }}>
                                                    Dispense
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentMedication &&
                                                currentMedication?.slice?.(0, 5)?.map?.((each, index) => {
                                                    return (
                                                        <tr key={index}>
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

                                    <br />
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
                                        <thead class="table-dark" style={{ background: "#014d88" }}>
                                            <tr>
                                                <th scope="col" style={{ fontSize: "14px" }}>
                                                    Date
                                                </th>
                                                <th scope="col" style={{ fontSize: "14px" }}>
                                                    Test
                                                </th>
                                                <th scope="col" style={{ fontSize: "14px" }}>
                                                    Value
                                                </th>
                                                <th scope="col" style={{ fontSize: "14px" }}>
                                                    When next due
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {labResult?.slice?.(0, 5)?.map?.((each, index) => {
                                                return (
                                                    <tr>
                                                        <td scope="row">{new Date(each.dateReported).toISOString().split('T')[0]}</td>
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
                                            <span style={{ color: "red" }}> *</span>
                                        </Label>
                                        <Input
                                            type="select"
                                            name="reasonForTransfer"
                                            id="reasonForTransfer"
                                            onChange={handleInputChange}
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
                                            type="text"
                                            name="phoneNumberOfTreatmentSupporter"
                                            id="phoneNumberOfTreatmentSupporter"
                                            value={payload.phoneNumberOfTreatmentSupporter}
                                            onChange={(e) => {
                                                handleInputChangePhoneNumber(e, "phoneNumberOfTreatmentSupporter");
                                            }}
                                            style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                            }}
                                        />
                                        {errors.phoneNumberOfTreatmentSupporter !== "" ? (
                                            <span className={classes.error}>
                                                {errors.phoneNumberOfTreatmentSupporter}
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
                                            Name of the Clinician receiving the transfer
                                        </Label>
                                        <Input
                                            type="text"
                                            name="nameOfClinicianReceivingTheTransfer"
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
                                            type="text"
                                            name="clinicianTelephoneNumber"
                                            id="clinicianTelephoneNumber"
                                            onChange={(e) => {
                                                handleInputChangePhoneNumber(e, "clinicianTelephoneNumber");
                                            }}
                                            value={payload.clinicianTelephoneNumber}
                                            style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                            }}
                                        />
                                        {errors.clinicianTelephoneNumber !== "" ? (
                                            <span className={classes.error}>
                                                {errors.clinicianTelephoneNumber}
                                            </span>
                                        ) : (
                                            ""
                                        )}
                                    </FormGroup>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div>
                        {saving ? <Spinner /> : ""}
                        <br />

                        <MatButton
                            type="button"
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            startIcon={<SaveIcon />}
                            onClick={handleSubmit}
                            style={{ backgroundColor: "#014d88" }}
                        // disabled={objValues.dateOfEac1 === "" ? true : false}
                        >
                            {!saving ? (
                                <span style={{ textTransform: "capitalize" }}>Save</span>
                            ) : (
                                <span style={{ textTransform: "capitalize" }}>Saving...</span>
                            )}
                        </MatButton>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

function AttemptedLists({ attemptObj, index, removeAttempt }) {
    return (
        <tr>
            <th>{attemptObj.attemptDate}</th>
            <th>{attemptObj.whoAttemptedContact}</th>
            <th>{attemptObj.modeOfConatct}</th>
            <th>{attemptObj.personContacted}</th>
            <th>
                {attemptObj.reasonForDefaulting === ""
                    ? attemptObj.reasonForDefaultingOthers
                    : attemptObj.reasonForDefaulting}
            </th>
            <th></th>
            <th>
                <IconButton
                    aria-label="delete"
                    size="small"
                    color="error"
                    onClick={() => removeAttempt(index)}
                >
                    <DeleteIcon fontSize="inherit" />
                </IconButton>
            </th>
        </tr>
    );
}
export default Tracking;