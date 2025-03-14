import React, {useEffect, useState} from "react";
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
import {makeStyles} from "@material-ui/core/styles";
import {Card} from "@material-ui/core";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import {useHistory} from "react-router-dom";
// import {TiArrowBack} from 'react-icons/ti'
import {token, url as baseUrl} from "../../../api";
import "react-phone-input-2/lib/style.css";
import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import "react-phone-input-2/lib/style.css";
import {calculate_age_to_number} from "../../../utils";
import {Button} from "semantic-ui-react";

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

const TPT = (props) => {
    const classes = useStyles();
    const [adherence, setAdherence] = useState([]);
    const [tbTreatmentType, setTbTreatmentType] = useState([]);
    const [tptOutCome, setTptOutCome] = useState([]);
    const [contraindicationsState, setContraindicationsState] = useState("");

    const [hasMounted, setHasMounted] = useState(false);
    const [careAndSupportEncounterDate, setCareAndSupportEncounterDate] = useState("");
    const [tptCompletionDate, setTptCompletionDate] = useState("")
    const [adultArtRegimenLine, setAdultArtRegimenLine] = useState([]);
    const [oIRegimenLine, setOIRegimenLine] = useState([]);
    const [childrenOI, setChildrenOI] = useState([]);
    useEffect(() => {
        setHasMounted(true);
    }, []);


    const TB_TREATMENT_TYPE = () => {
        axios
            .get(`${baseUrl}application-codesets/v2/TB_TREATMENT_TYPE`, {
                headers: {Authorization: `Bearer ${token}`},
            })
            .then((response) => {
                setTbTreatmentType(response.data);
            })
            .catch((error) => {
            });
    };
    const TB_TREATMENT_OUTCOME = () => {
        axios
            .get(`${baseUrl}application-codesets/v2/TPT_OUTCOME`, {
                headers: {Authorization: `Bearer ${token}`},
            })
            .then((response) => {
                setTptOutCome(response.data);
            })
            .catch((error) => {
            });
    };

    const patientAge = calculate_age_to_number(props.patientObj.dateOfBirth);

    //GET ChildRegimenLine
    const ChildRegimenLine = () => {
        axios
            .get(`${baseUrl}hiv/regimen/arv/children`, {
                headers: {Authorization: `Bearer ${token}`},
            })
            .then((response) => {
                setChildrenOI(
                    response.data.filter((x) => x.id === 15)
                );
            })
            .catch((error) => {
            });
    };

    //GET AdultRegimenLinem
    const AdultRegimenLine = () => {
        axios
            .get(`${baseUrl}hiv/regimen/types/15`, {
                headers: {Authorization: `Bearer ${token}`},
            })
            .then((response) => {
                // const oIRegimen = response.data.filter(
                //     (x) => x.id === 15
                // );
                setOIRegimenLine(response.data);
            })
            .catch((error) => {
            });
    };

    useEffect(() => {
        TB_TREATMENT_TYPE();
        TB_TREATMENT_OUTCOME();
        CLINIC_VISIT_LEVEL_OF_ADHERENCE();
        AdultRegimenLine();
        ChildRegimenLine();
    }, []);



    // TPT Logic
    useEffect(() => {
        if (hasMounted) {
            if (props.tpt.everCompletedTpt === "Yes") {
                props.setTpt({
                    ...props.tpt,
                    eligibilityTpt: "No",
                    tptPreventionOutcome: "TPT Completed",
                    contractionForTpt: "",
                });
            } else if (props.tpt.currentlyOnTpt === 'Yes' && props.tpt.everCompletedTpt === "No") {
                props.setTpt({
                    ...props.tpt,
                    eligibilityTpt: "No",
                    tptPreventionOutcome: "Currently on TPT",
                    contractionForTpt: "",
                });
            } else if (props.tpt.liverSymptoms === "" &&
                props.tpt.neurologicSymptoms === "" &&
                props.tpt.chronicAlcohol === "" &&
                props.tpt.rash === "") {
                props.setTpt({
                    ...props.tpt,
                    contractionForTpt: "",
                });
            } else if (props.tpt.enrolledOnTpt === "Yes" && props.tpt.dateTptStarted !== '') {
                props.setTpt({
                    ...props.tpt,
                    eligibilityTpt: "Yes",
                    tptPreventionOutcome: "Currently on TPT",
                    // contractionForTpt: "",
                });
            } else {
                const contraindications = [
                    props.tpt.liverSymptoms !== "No",
                    props.tpt.neurologicSymptoms !== "No",
                    props.tpt.chronicAlcohol !== "No",
                    props.tpt.rash !== "No",
                ];
                const hasContraindication = contraindications.some((contraindication) => contraindication);
                const allContraindicationsNo = contraindications.every((contraindication) => !contraindication);
                if (hasContraindication) {
                    props.setTpt({
                        ...props.tpt,
                        eligibilityTpt: "No",
                        tptPreventionOutcome: "",
                        contractionForTpt: "Yes",
                    });
                } else if (allContraindicationsNo) {
                    props.setTpt({
                        ...props.tpt,
                        eligibilityTpt: "Yes",
                        tptPreventionOutcome: "",
                        contractionForTpt: "No",
                    });
                } else {
                    props.setTpt({
                        ...props.tpt,
                        eligibilityTpt: "",
                        tptPreventionOutcome: "",
                        contractionForTpt: "",
                    });
                }
            }
        }
    }, [hasMounted, props.tpt.eligibilityTpt, props.tpt.tptPreventionOutcome, props.tpt.tbTreatment,
        props.tpt.currentlyOnTpt, props.tpt.liverSymptoms, props.tpt.neurologicSymptoms,
        props.tpt.chronicAlcohol, props.tpt.rash, props.tpt.endedTpt,
        props.tpt.treatmentOutcome, props.tpt.treatmentCompletionStatus,
        props.tpt.everCompletedTpt, props.tpt.contractionForTpt,
        props.tpt.enrolledOnTpt, props.tpt.dateTptStarted
    ]);

    useEffect(() => {
        if (hasMounted) {
            if (name === 'contractionForTpt') {
                props.setTpt({
                    ...props.tpt,
                    weight: "",
                    enrolledOnTpt: ""
                });
            }
        }
    }, [hasMounted, props.tpt.contractionForTpt]);

    //Get list of CLINIC_VISIT_LEVEL_OF_ADHERENCE
    const CLINIC_VISIT_LEVEL_OF_ADHERENCE = () => {
        axios
            .get(
                `${baseUrl}application-codesets/v2/CLINIC_VISIT_LEVEL_OF_ADHERENCE`,
                {headers: {Authorization: `Bearer ${token}`}}
            )
            .then((response) => {
                setAdherence(response.data);
            })
            .catch((error) => {
            });
    };

    const handleTpt = (e) => {
        const {name, value} = e.target;


        if (name === 'everCompletedTpt') {
            if (value === "Yes") {
                if (careAndSupportEncounterDate !== "") {
                    props.setTpt({
                        ...props.tpt,
                        [name]: value,
                        dateOfTptCompleted: careAndSupportEncounterDate,
                    });
                } else {
                    props.setTpt({
                        ...props.tpt,
                        [name]: value,
                    });
                }
            } else if (value === "No") {
                props.setTpt({
                    ...props.tpt,
                    [name]: value,
                    dateOfTptCompleted: '', // Clear date if "No" is selected
                });
            }
        }
        else
            if (name === 'tbTreatment' && value === '') {
            props.setTpt({
                ...props.tpt,
                [name]: value,
                completionDate: '',
                completedTbTreatment: '',
                treatmentOutcome: '',
                everCompletedTpt: "",
                currentlyOnTpt: '',
                eligibilityTpt: "",
                tptPreventionOutcome: "",
                dateOfTptCompleted: '',
                hepatitisSymptoms: "",
                liverSymptoms: "",
                neurologicSymptoms: "",
                rash: '',
                contractionForTpt: '',
                chronicAlcohol: '',
                weight: "",
                enrolledOnTpt: "",
                outComeOfIpt: "",
                dateTptEnded: "",
                tbSideEffect: "",
                giUpsetEffect: "",
                hepatotoxicityEffect: "",
                neurologicSymptomsEffect: "",
                giUpsetEffectSeverity: "",
                dateTptStarted: "",
                tptRegimen: "",
            });
        }
        else if (name === 'everCompletedTpt' && value === '') {
            props.setTpt({
                ...props.tpt,
                [name]: value,
                currentlyOnTpt: '',
                eligibilityTpt: "",
                tptPreventionOutcome: "",
                liverSymptoms: "",
                neurologicSymptoms: "",
                rash: '',
                endedTpt:'',
                contractionForTpt: '',
                chronicAlcohol: '',
                dateOfTptCompleted: '',
                hepatotoxicityEffectSeverity:'',
                hypersensitivityReactionEffect:'',
                hypersensitivityReactionEffectSeverity:''
            });
        }
        else if (name === 'currentlyOnTpt' && value === '') {
            props.setTpt({
                ...props.tpt,
                [name]: value,
                hepatitisSymptoms: "",
                liverSymptoms: "",
                neurologicSymptoms: "",
                rash: '',
                contractionForTpt: '',
                chronicAlcohol: '',
            });
        }
        else if ((name === 'liverSymptoms' && value !== props.tpt.liverSymptoms) ||
            (name === 'neurologicSymptoms' && value !== props.tpt.neurologicSymptoms) ||
            (name === 'chronicAlcohol' && value !== props.tpt.chronicAlcohol) ||
            (name === 'rash' && value !== props.tpt.rash)) {
            props.setTpt({
                ...props.tpt,
                [name]: value,
                weight: "",
                enrolledOnTpt: ""
            });
        } else if (name === 'endedTpt' && value === '') {
            props.setTpt({
                ...props.tpt,
                [name]: value,
                outComeOfIpt: "",
                dateTptEnded: "",
                tbSideEffect: "",
            });
        } else if (name === 'tbSideEffect' && value === '') {
            props.setTpt({
                ...props.tpt,
                [name]: value,
                giUpsetEffect: "",
                hepatotoxicityEffect: "",
                neurologicSymptomsEffect: "",
                giUpsetEffectSeverity: ""
            });
        } else if (name === 'giUpsetEffect' && value === '') {
            props.setTpt({
                ...props.tpt,
                [name]: value,
                giUpsetEffectSeverity: ""
            });
        } else if (name === 'neurologicSymptomsEffect' && value === '') {
            props.setTpt({
                ...props.tpt,
                [name]: value,
                neurologicSymptomsEffectSeverity: ''
            });
        } else if (name === 'hepatotoxicityEffect' && value === '') {
            props.setTpt({
                ...props.tpt,
                [name]: value,
                hepatotoxicityEffectSeverity: ''
            });
        } else if (name === 'hypersensitivityReactionEffect' && value === '') {
            props.setTpt({
                ...props.tpt,
                [name]: value,
                hypersensitivityReactionEffectSeverity: ''
            });
        } else if (name === 'enrolledOnTpt' && value === '') {
            props.setTpt({
                ...props.tpt,
                [name]: value,
                dateTptStarted: "",
                tptRegimen: ""
            });
        } else {
            props.setTpt({...props.tpt, [name]: value});
        }
    }


    const PATIENT_ENCOUNTER = () => {
        axios
            .get(`${baseUrl}observation/person/${props.patientObj.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                const data = response.data;
                // Filter records where type is "Chronic Care" and everCompletedTpt is 'Yes', if it exists
                const filteredRecords = data.filter(
                    (item) =>
                        item.type === "Chronic Care" &&
                        item.data?.tptMonitoring?.endedTpt === 'Yes'
                );
                if (filteredRecords.length > 0) {
                    const mostRecentRecord = filteredRecords.sort(
                        (a, b) => new Date(b.dateOfObservation) - new Date(a.dateOfObservation)
                    )[0];
                    const { dateTptEnded  } = mostRecentRecord.data.tptMonitoring || {};
                    setCareAndSupportEncounterDate(dateTptEnded)
                }
            })
            .catch((error) => {
                console.error('Error fetching patient encounters:', error);
            });
    };

    useEffect(() => {
        PATIENT_ENCOUNTER();
    }, []);

    return (
        <>
            <Card className={classes.root}>
                <CardBody>
                    <h2 style={{color: "#000"}}>TB/TPT Monitoring</h2>
                    <br/>
                    <form>
                        <div className="row">
                            <br/>
                            <hr/>
                            <br/>
                            <h3>TPT Prevention Section</h3>
                            <h2>TPT Status</h2>
                            <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                    <Label>
                                        Ever completed a course of TPT {" "}
                                    </Label>
                                    <InputGroup>
                                        <Input
                                            type="select"
                                            name="everCompletedTpt"
                                            id="everCompletedTpt"
                                            onChange={handleTpt}
                                            value={props.tpt.everCompletedTpt}
                                            disabled={props.action === "view" ? true : false}
                                        >
                                            <option value="">Select</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </Input>
                                    </InputGroup>
                                </FormGroup>
                            </div>
                            {props.tpt.everCompletedTpt === 'Yes' && (<>
                                <div className="form-group mb-3 col-md-6">
                                    <FormGroup>
                                        <Label>
                                            Date of TPT Completed
                                        </Label>
                                        <InputGroup>
                                            <Input
                                                type="date"
                                                name="dateOfTptCompleted"
                                                id="dateOfTptCompleted"
                                                onChange={handleTpt}
                                                value={props.tpt.dateOfTptCompleted}
                                                min={props.patientObj.dateOfBirth}
                                                max={moment(new Date()).format("YYYY-MM-DD")}
                                                disabled={props.action === "view" || tptCompletionDate !== ""}
                                                onKeyPress={(e) => e.preventDefault()}
                                            >
                                            </Input>
                                        </InputGroup>
                                    </FormGroup>
                                </div>
                            </>)}
                            {props.tpt.everCompletedTpt === 'No' && (<>
                                <div className="form-group mb-3 col-md-6">
                                    <FormGroup>
                                        <Label>
                                            Are you currently on TPT
                                        </Label>
                                        <InputGroup>
                                            <Input
                                                type="select"
                                                name="currentlyOnTpt"
                                                id="currentlyOnTpt"
                                                onChange={handleTpt}
                                                value={props.tpt.currentlyOnTpt}
                                                disabled={props.action === "view" ? true : false}
                                            >
                                                <option value="">Select</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </Input>
                                        </InputGroup>
                                    </FormGroup>
                                </div>

                                {props.tpt.currentlyOnTpt === 'No' && (<>
                                    <div className="form-group mb-3 col-md-6">
                                        <FormGroup>
                                            <Label>
                                                liver disease (Abdominal pain, nausea, vomiting, abnormal Liver function
                                                tests, Children: persistent irritability, yellowish urine and eyes)
                                            </Label>
                                            <InputGroup>
                                                <Input
                                                    type="select"
                                                    name="liverSymptoms"
                                                    id="liverSymptoms"
                                                    onChange={handleTpt}
                                                    disabled={props.action === "view" ? true : false}
                                                    value={props.tpt.liverSymptoms}
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
                                                Neurologic Symptoms (Numbness, tingling, paresthesias)
                                            </Label>
                                            <InputGroup>
                                                <Input
                                                    type="select"
                                                    name="neurologicSymptoms"
                                                    id="neurologicSymptoms"
                                                    onChange={handleTpt}
                                                    disabled={props.action === "view" ? true : false}
                                                    value={props.tpt.neurologicSymptoms}
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
                                            <Label>Chronic alcohol consumption </Label>
                                            <InputGroup>
                                                <Input
                                                    type="select"
                                                    name="chronicAlcohol"
                                                    id="chronicAlcohol"
                                                    onChange={handleTpt}
                                                    value={props.tpt.chronicAlcohol}
                                                    disabled={props.action === "view" ? true : false}
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
                                            <Label>Rash </Label>
                                            <InputGroup>
                                                <Input
                                                    type="select"
                                                    name="rash"
                                                    id="rash"
                                                    onChange={handleTpt}
                                                    value={props.tpt.rash}
                                                    disabled={props.action === "view" ? true : false}
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
                                                Contraindications For TPT
                                            </Label>
                                            <InputGroup>
                                                <Input
                                                    type="select"
                                                    name="contractionForTpt"
                                                    id="contractionForTpt"
                                                    // onChange={handleTpt}
                                                    value={props.tpt.contractionForTpt}
                                                    disabled
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                </Input>
                                            </InputGroup>
                                        </FormGroup>
                                    </div>
                                </>)}


                            </>)}
                            {props.tpt.contractionForTpt === "No" && (
                                <>
                                    <div className="form-group mb-3 col-md-6">
                                        <FormGroup>
                                            <Label>Weight</Label>
                                            <InputGroup>
                                                <Input
                                                    type="text"
                                                    name="weight"
                                                    id="weight"
                                                    onChange={handleTpt}
                                                    value={props.tpt.weight}
                                                    disabled={props.action === "view" ? true : false}
                                                ></Input>
                                            </InputGroup>
                                        </FormGroup>
                                    </div>
                                    <div className="form-group mb-3 col-md-6">
                                        <FormGroup>
                                            <Label>Enrolled on TPT</Label>
                                            <InputGroup>
                                                <Input
                                                    type="select"
                                                    name="enrolledOnTpt"
                                                    id="enrolledOnTpt"
                                                    onChange={handleTpt}
                                                    value={props.tpt.enrolledOnTpt}
                                                    disabled={props.action === "view" ? true : false}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                </Input>
                                            </InputGroup>
                                        </FormGroup>
                                    </div>
                                    {props.tpt.enrolledOnTpt === "Yes" && (
                                        <div className="form-group mb-3 col-md-6">
                                            <FormGroup>
                                                <Label>Date TPT started </Label>
                                                <InputGroup>
                                                    <Input
                                                        type="date"
                                                        name="dateTptStarted"
                                                        id="dateTptStarted"
                                                        onChange={handleTpt}
                                                        value={props.tpt.dateTptStarted}
                                                        min={props.patientObj.dateOfBirth}
                                                        max={moment(new Date()).format("YYYY-MM-DD")}
                                                        disabled={props.action === "view" ? true : false}
                                                        onKeyPress={(e) => e.preventDefault()}
                                                    />
                                                </InputGroup>
                                            </FormGroup>
                                        </div>
                                    )}
                                    {props.tpt.enrolledOnTpt === "Yes" && <div className="form-group mb-3 col-md-6">
                                        <FormGroup>
                                            <Label>Type of TPT Regimen </Label>
                                            <InputGroup>
                                                <Input
                                                    type="select"
                                                    name="tptRegimen"
                                                    id="tptRegimen"
                                                    onChange={handleTpt}
                                                    value={props.tpt.tptRegimen}
                                                    disabled={props.action === "view" ? true : false}
                                                >
                                                    <option value="">Select</option>
                                                    {oIRegimenLine.map((value) => (
                                                        <option key={value.id} value={value.id}>
                                                            {value.description}
                                                        </option>
                                                    ))}
                                                </Input>
                                            </InputGroup>
                                        </FormGroup>
                                    </div>}
                                </>)}
                            <p style={{color: "black"}}>
                                Eligibility For TPT:
                                <b>
                                    {" " + props.tpt.eligibilityTpt === "undefined"
                                        ? ""
                                        : props.tpt.eligibilityTpt}
                                </b>
                            </p>
                            <br/>
                            <p style={{color: "black"}}>
                                TPT Prevention Outcome Status:
                                <b>
                                    {" " + props.tpt.tptPreventionOutcome === "undefined"
                                        ? ""
                                        : props.tpt.tptPreventionOutcome}
                                </b>
                            </p>
                            <br/>
                            <hr/>
                            <br/>
                            {props.tpt.everCompletedTpt === "Yes" ? <> </> : (<>
                                    <h3>TPT Monitoring</h3>
                                    <div className="form-group mb-3 col-md-6">
                                        <FormGroup>
                                            <Label>Have you ended TPT</Label>
                                            <InputGroup>
                                                <Input
                                                    type="select"
                                                    name="endedTpt"
                                                    id="endedTpt"
                                                    onChange={handleTpt}
                                                    value={props.tpt.endedTpt}
                                                    disabled={props.action === "view" ? true : false}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                </Input>
                                            </InputGroup>
                                        </FormGroup>
                                    </div>
                                    {props.tpt.endedTpt === 'Yes' && (<>
                                        <div className="form-group mb-3 col-md-6">
                                            <FormGroup>
                                                <Label>TPT Outcome</Label>
                                                <InputGroup>
                                                    <Input
                                                        type="select"
                                                        name="outComeOfIpt"
                                                        id="outComeOfIpt"
                                                        onChange={handleTpt}
                                                        value={props.tpt.outComeOfIpt}
                                                        disabled={props.action === "view" ? true : false}
                                                    >
                                                        <option value="">Select</option>
                                                        {tptOutCome.map(item => <option key={item.id}
                                                                                        value={item.display}>
                                                            {item.display}
                                                        </option>)}
                                                    </Input>
                                                </InputGroup>
                                            </FormGroup>
                                        </div>
                                        {props.tpt.outComeOfIpt === "Treatment Completed" &&
                                            <div className="form-group mb-3 col-md-6">
                                                <FormGroup>
                                                    <Label>Date TPT Ended </Label>
                                                    <InputGroup>
                                                        <Input
                                                            type="date"
                                                            name="dateTptEnded"
                                                            id="dateTptEnded"
                                                            onChange={handleTpt}
                                                            value={moment(props.tpt.dateTptEnded).format("YYYY-MM-DD")}
                                                            min={props.tpt.dateTptStarted}
                                                            max={moment(new Date()).format("YYYY-MM-DD")}
                                                            disabled={props.action === "view" ? true : false}
                                                            onKeyPress={(e) => e.preventDefault()}
                                                        ></Input>
                                                    </InputGroup>
                                                </FormGroup>
                                            </div>}
                                    </>)}
                                    {props.tpt.endedTpt === 'No' && (
                                        <div className="form-group mb-3 col-md-6">
                                            <FormGroup>
                                                <Label>Any side effects ?</Label>
                                                <InputGroup>
                                                    <Input
                                                        type="select"
                                                        name="tbSideEffect"
                                                        id="tbSideEffect"
                                                        value={props.tpt.tbSideEffect}
                                                        onChange={handleTpt}
                                                        disabled={props.action === "view" ? true : false}
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="Yes">Yes</option>
                                                        <option value="No">No</option>
                                                    </Input>
                                                </InputGroup>
                                            </FormGroup>
                                        </div>
                                    )}

                                    {props.tpt.tbSideEffect === 'Yes' && (
                                        <>
                                            <div className="form-group mb-3 col-md-6">
                                                <FormGroup>
                                                    <Label>GI Upset (Nausea, Vomiting, Abdominal pain)</Label>
                                                    <InputGroup>
                                                        <Input
                                                            type="select"
                                                            name="giUpsetEffect"
                                                            id="giUpsetEffect"
                                                            onChange={handleTpt}
                                                            value={props.tpt.giUpsetEffect}
                                                            disabled={props.action === "view" ? true : false}
                                                        >
                                                            <option value="">Select</option>
                                                            <option value="Yes">Yes</option>
                                                            <option value="No">No</option>
                                                        </Input>
                                                    </InputGroup>
                                                </FormGroup>
                                            </div>
                                            {props.tpt.giUpsetEffect === 'Yes' && (
                                                <div className="form-group mb-3 col-md-6">
                                                    <FormGroup>
                                                        <Label>Severity of side effect(GI Upset)</Label>
                                                        <InputGroup>
                                                            <Input
                                                                type="select"
                                                                name="giUpsetEffectSeverity"
                                                                id="giUpsetEffectSeverity"
                                                                value={props.tpt.giUpsetEffectSeverity}
                                                                onChange={handleTpt}
                                                                disabled={props.action === "view" ? true : false}
                                                            >
                                                                <option value="">Select</option>
                                                                <option value="Mild">Mild</option>
                                                                <option value="Moderate">Moderate</option>
                                                                <option value="Severe">Severe</option>
                                                            </Input>
                                                        </InputGroup>
                                                    </FormGroup>
                                                </div>
                                            )}
                                            <div className="form-group mb-3 col-md-6">
                                                <FormGroup>
                                                    <Label>Hepatotoxicity (Irritability, yellowish urine and
                                                        eyes)</Label>
                                                    <InputGroup>
                                                        <Input
                                                            type="select"
                                                            name="hepatotoxicityEffect"
                                                            id="hepatotoxicityEffect"
                                                            onChange={handleTpt}
                                                            value={props.tpt.hepatotoxicityEffect}
                                                            disabled={props.action === "view" ? true : false}
                                                        >
                                                            <option value="">Select</option>
                                                            <option value="Yes">Yes</option>
                                                            <option value="No">No</option>
                                                        </Input>
                                                    </InputGroup>
                                                </FormGroup>
                                            </div>
                                            {props.tpt.hepatotoxicityEffect === 'Yes' && (
                                                <div className="form-group mb-3 col-md-6">
                                                    <FormGroup>
                                                        <Label>Severity of side effect (Hepatotoxicity)</Label>
                                                        <InputGroup>
                                                            <Input
                                                                type="select"
                                                                name="hepatotoxicityEffectSeverity"
                                                                id="hepatotoxicityEffectSeverity"
                                                                value={props.tpt.hepatotoxicityEffectSeverity}
                                                                onChange={handleTpt}
                                                                disabled={props.action === "view" ? true : false}
                                                            >
                                                                <option value="">Select</option>
                                                                <option value="Mild">Mild</option>
                                                                <option value="Moderate">Moderate</option>
                                                                <option value="Severe">Severe</option>
                                                            </Input>
                                                        </InputGroup>
                                                    </FormGroup>
                                                </div>
                                            )}
                                            <div className="form-group mb-3 col-md-6">
                                                <FormGroup>
                                                    <Label> Neurologic Symptoms (Numbness, tingling,
                                                        paresthesias) </Label>
                                                    <InputGroup>
                                                        <Input
                                                            type="select"
                                                            name="neurologicSymptomsEffect"
                                                            id="neurologicSymptomsEffect"
                                                            onChange={handleTpt}
                                                            value={props.tpt.neurologicSymptomsEffect}
                                                            disabled={props.action === "view" ? true : false}
                                                        >
                                                            <option value="">Select</option>
                                                            <option value="Yes">Yes</option>
                                                            <option value="No">No</option>
                                                        </Input>
                                                    </InputGroup>
                                                </FormGroup>
                                            </div>
                                            {props.tpt.neurologicSymptomsEffect === 'Yes' && (
                                                <div className="form-group mb-3 col-md-6">
                                                    <FormGroup>
                                                        <Label>Severity of side effect(Neurologic Symptoms)</Label>
                                                        <InputGroup>
                                                            <Input
                                                                type="select"
                                                                name="neurologicSymptomsEffectSeverity"
                                                                id="neurologicSymptomsEffectSeverity"
                                                                value={props.tpt.neurologicSymptomsEffectSeverity}
                                                                onChange={handleTpt}
                                                                disabled={props.action === "view" ? true : false}
                                                            >
                                                                <option value="">Select</option>
                                                                <option value="Mild">Mild</option>
                                                                <option value="Moderate">Moderate</option>
                                                                <option value="Severe">Severe</option>
                                                            </Input>
                                                        </InputGroup>
                                                    </FormGroup>
                                                </div>
                                            )}
                                            <div className="form-group mb-3 col-md-6">
                                                <FormGroup>
                                                    <Label> Hypersensitivity reaction (Skin Rash) </Label>
                                                    <InputGroup>
                                                        <Input
                                                            type="select"
                                                            name="hypersensitivityReactionEffect"
                                                            id="hypersensitivityReactionEffect"
                                                            onChange={handleTpt}
                                                            value={props.tpt.hypersensitivityReactionEffect}
                                                            disabled={props.action === "view" ? true : false}
                                                        >
                                                            <option value="">Select</option>
                                                            <option value="Yes">Yes</option>
                                                            <option value="No">No</option>
                                                        </Input>
                                                    </InputGroup>
                                                </FormGroup>
                                            </div>
                                            {props.tpt.hypersensitivityReactionEffect === 'Yes' && (
                                                <div className="form-group mb-3 col-md-6">
                                                    <FormGroup>
                                                        <Label>Severity of side effect(Hypersensitivity)</Label>
                                                        <InputGroup>
                                                            <Input
                                                                type="select"
                                                                name="hypersensitivityReactionEffectSeverity"
                                                                id="hypersensitivityReactionEffectSeverity"
                                                                value={props.tpt.hypersensitivityReactionEffectSeverity}
                                                                onChange={handleTpt}
                                                                disabled={props.action === "view" ? true : false}
                                                            >
                                                                <option value="">Select</option>
                                                                <option value="Mild">Mild</option>
                                                                <option value="Moderate">Moderate</option>
                                                                <option value="Severe">Severe</option>
                                                            </Input>
                                                        </InputGroup>
                                                    </FormGroup>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </>
                            )}

                        </div>
                    </form>
                </CardBody>
            </Card>
        </>
    );
};

export default TPT;
