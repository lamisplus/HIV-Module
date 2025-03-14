import React, {useState, useEffect} from 'react';
import {Card, CardBody, FormGroup, Label, Input} from 'reactstrap';
import MatButton from '@material-ui/core/Button'
import {makeStyles} from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import axios from "axios";
import {toast} from "react-toastify";
import {url as baseUrl} from "../../../api";
import {token as token} from "../../../api";
import "react-widgets/dist/css/react-widgets.css";
import moment from "moment";
import {Spinner} from "reactstrap";
import {Icon, Button,} from 'semantic-ui-react'
import Select from "react-select";
import ButtonMui from "@material-ui/core/Button";
import DualListBox from "react-dual-listbox";
import 'react-dual-listbox/lib/react-dual-listbox.css';


const useStyles = makeStyles(theme => ({
    card: {
        margin: theme.spacing(20),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    cardBottom: {
        marginBottom: 20
    },
    Select: {
        height: 45,
        width: 350
    },
    button: {
        margin: theme.spacing(1)
    },

    root: {
        flexGrow: 1,
        "& .card-title": {
            color: '#fff',
            fontWeight: 'bold'
        },
        "& .form-control": {
            borderRadius: '0.25rem',
            height: '41px'
        },
        "& .card-header:first-child": {
            borderRadius: "calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0"
        },
        "& .dropdown-toggle::after": {
            display: " block !important"
        },
        "& select": {
            "-webkit-appearance": "listbox !important"
        },
        "& p": {
            color: 'red'
        },
        "& label": {
            fontSize: '14px',
            color: '#014d88',
            fontWeight: 'bold'
        }
    },
    input: {
        display: 'none'
    }
}))

const NEWEACSESSION = (props) => {
    const classes = useStyles()
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true)
    const [lastEACDate, setLastEACDate] = useState(null)
    const [eacStatusObj, setEacStatusObj] = useState()
    const [selectedBarriers, setSelectedBarriers] = useState([]);
    const [selectedInterventions, setSelectedInterventions] = useState([]);
    const [enrollDate, setEnrollDate] = useState("");
    const [objValues, setObjValues] = useState({
        barriers: null,
        barriersOthers: "",
        intervention: null,
        interventionOthers: "",
        comment: null,
        followUpDate: null,
        referral: "",
        adherence: "",
        personId: props.patientObj.id,
        status: "",
        visitId: "",
        eacId: "",
        sessionDate: "",
        missedDrug: ""
    })
    const optionsForBarriers = [
        {value: 'Forgot', label: 'Forgot'},
        {value: 'Knowledge/beliefs', label: 'Knowledge/beliefs'},
        {value: 'Side effects', label: 'Side effects'},
        {value: 'Physical illness', label: 'Physical illness'},
        {value: 'Substance use', label: 'Substance use'},
        {value: 'Depression', label: 'Depression'},
        {value: 'Pill burden', label: 'Pill burden'},
        {value: 'Lost/ran out', label: 'Lost/ran out'},
        {value: 'Transport', label: 'Transport'},
        {value: 'Child behavior/refusing Scheduling', label: 'Child behavior/refusing Scheduling'},
        {
            value: 'Fear disclosure Family/partner Food insecurity Drug stock out Long wait Stigma',
            label: 'Fear disclosure Family/partner Food insecurity Drug stock out Long wait Stigma'
        },
        {value: 'Others', label: 'Others'},
    ];
    const optionsForInterventions = [
        {value: 'Education', label: 'Education'},
        {value: 'Counseling (ind)', label: 'Counseling (ind)'},
        {value: 'Counseling (grp)', label: 'Counseling (grp)'},
        {value: 'Peer support', label: 'Peer support'},
        {value: 'Treatment buddy', label: 'Treatment buddy'},
        {value: 'Extended Drug pick-up', label: 'Extended Drug pick-up'},
        {value: 'Community ART Group', label: 'Community ART Group'},
        {value: 'Directly Observed Therapy', label: 'Directly Observed Therapy'},
        {value: 'Transport', label: 'Transport'},
        {value: 'Child behavior/refusing Scheduling', label: 'Child behavior/refusing Scheduling'},
        {
            value: 'Fear disclosure Family/partner Food insecurity Drug stock out Long wait Stigma',
            label: 'Fear disclosure Family/partner Food insecurity Drug stock out Long wait Stigma'
        },
        {value: 'Tools Pill box Calendar', label: 'Tools Pill box Calendar'},
        {
            value: 'Incentive calendar (peds) ARV swallowing instruction Written instructions Phone calls SMS',
            label: 'Incentive calendar (peds) ARV swallowing instruction Written instructions Phone calls SMS'
        },
        {value: 'Others', label: 'Others'},
    ];


    useEffect(() => {
        GetPatientDTOObj();
        CheckEACStatus();
        // GetFormDetail();
        if (props.activeContent && props.activeContent.obj) {
            setObjValues({...props.activeContent.obj});
            // Check if barriers is an object before using Object.values
            const barriers = props.activeContent.obj.barriers;
            if (barriers && typeof barriers === 'object') {
                setSelectedBarriers(Object.values(barriers));
            } else {
                setSelectedBarriers([]);
            }
            // Check if intervention is an object before using Object.values
            const interventions = props.activeContent.obj.intervention;
            if (interventions && typeof interventions === 'object') {
                setSelectedInterventions(Object.values(interventions));
            } else {
                setSelectedInterventions([]); // Or handle the default case
            }
        }
        minDate();
    }, [props.activeContent, props.patientObj.id]);

    //Get EAC Status
    const CheckEACStatus = () => {
        axios
            .get(`${baseUrl}hiv/eac/open/patient/${props.patientObj.id}`,
                {headers: {"Authorization": `Bearer ${token}`}}
            )
            .then((response) => {
                setEacStatusObj(response.data);
                const newEacDate = response.data && response.data.eacsession && response.data.eacsession !== 'Default' ? response.data.eacsessionDate : null
                setLastEACDate(newEacDate)
            })
            .catch((error) => {

            });

    }
    const GetPatientDTOObj = () => {
        axios
            .get(`${baseUrl}hiv/patient/${props.patientObj.id}`,
                {headers: {"Authorization": `Bearer ${token}`}}
            )
            .then((response) => {
                const patientDTO = response.data.enrollment
                setEnrollDate(patientDTO && patientDTO.dateOfRegistration ? patientDTO.dateOfRegistration : "")

            })
            .catch((error) => {

            });

    }
    const handleInputChange = e => {
        setObjValues({...objValues, [e.target.name]: e.target.value});
    }
    const onBarriersSelect = (selectedValues) => {
        setSelectedBarriers(selectedValues);
    };

    const minDate = () => {
        if (objValues.sessionDate) {
            const sessionDate = new Date(objValues.sessionDate);
            sessionDate.setDate(sessionDate.getDate() + 1);
            return sessionDate.toISOString().split('T')[0];
        }
        return '';
    };
    const onInterventionsSelect = (selectedValues) => {
        setSelectedInterventions(selectedValues);
    };
    const BackToSession = (row, actionType) => {
        props.setActiveContent({
            ...props.activeContent,
            route: 'eac-session',
            id: row.id,
            activeTab: "history",
            actionType: actionType,
            obj: row
        })
    }
    localStorage.removeItem("eacIc");
    const eacId = Number(props.activeContent.obj.eacId);
    if (!isNaN(eacId)) {
        localStorage.setItem("eacId", eacId);
    } else {
        console.error("Invalid eacId:", eacId);
    }

    const eacIdValue = localStorage.getItem("eacId");
    const eacid = Number(eacIdValue);
    const handleSubmit = (e) => {
            e.preventDefault();
            setSaving(true);

            // Validate eacId
            const eacId = props.activeContent.obj.eacId;
            if (!eacId) {
                toast.error("EAC ID is missing or undefined.");
                setSaving(false);
                return;
            }

            objValues.barriers = Object.assign({}, selectedBarriers);
            objValues.intervention = Object.assign({}, selectedInterventions);
            objValues.eacId = props.activeContent.obj.id;

            axios.put(`${baseUrl}hiv/eac/session/edit/${props.activeContent.obj.id}`,
                objValues,
                { headers: { "Authorization": `Bearer ${token}` } }
            )
                .then(response => {
                    setSaving(false);
                    toast.success("EAC session updated successful");

                    // Fetch updated EAC data
                    axios.get(
                        `${baseUrl}hiv/eac/session/eac/${eacid}`,
                        { headers: { "Authorization": `Bearer ${token}` } }
                    )
                        .then(res => {
                            props.setActiveContent({
                                ...props.activeContent,
                                route: 'eac-session',
                                id: eacid,
                                obj: res.data
                            });
                        })
                        .catch(err => {
                            console.error("Error fetching updated EAC:", err);
                            toast.error("Failed to fetch updated EAC.");
                        });
                })
                .catch(error => {
                    setSaving(false);
                    if (error.response && error.response.data) {
                        const errorMessage = error.response.data.apierror?.message || "Something went wrong, please try again.";
                        toast.error(errorMessage);
                    } else {
                        toast.error("Something went wrong. Please try again...");
                    }
                });
        };


    return (
        <div>
            <Card className={classes.root}>
                <CardBody>
                    <form>
                        <div className="row">
                            <h2>EAC Session ({props.activeContent.obj.status})
                                - {props.activeContent.actionType === 'update' ? "Update " : "View"}
                            </h2>
                            <br/>
                            <br/>
                            <br/>

                            <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                    <Label>Session Date</Label>
                                    <Input
                                        type="date"
                                        name="sessionDate"
                                        id="sessionDate"
                                        min={lastEACDate !== null ? moment(lastEACDate).format("YYYY-MM-DD") : enrollDate}
                                        value={objValues.sessionDate}
                                        max={moment(new Date()).format("YYYY-MM-DD")}
                                        onChange={handleInputChange}
                                        style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}
                                        onKeyPress={(e) => e.preventDefault()}
                                    />
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                    <Label>Adherence</Label>
                                    <Input
                                        type="select"
                                        name="adherence"
                                        id="adherence"
                                        value={objValues.adherence}
                                        onChange={handleInputChange}
                                        style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}

                                    >
                                        <option value="">Select</option>
                                        <option value="Good">Good</option>
                                        <option value="Fair">Fair</option>
                                        <option value="Poor">Poor</option>

                                    </Input>

                                </FormGroup>
                            </div>

                            <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                    <Label>Any missed pharmacy drug pick-ups?</Label>
                                    <Input
                                        type="select"
                                        name="missedDrug"
                                        id="missedDrug"
                                        value={objValues.missedDrug}
                                        onChange={handleInputChange}
                                        style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}

                                    >
                                        <option value="">Select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>

                                    </Input>

                                </FormGroup>
                            </div>
                            <div className="form-group mb-12 col-md-12">
                                <FormGroup>
                                    <Label for="permissions"
                                           style={{color: '#014d88', fontWeight: 'bolder'}}>Barriers</Label>
                                    <DualListBox
                                        //canFilter
                                        options={optionsForBarriers}
                                        onChange={onBarriersSelect}
                                        selected={selectedBarriers}
                                    />
                                </FormGroup>
                            </div>
                            {selectedBarriers.includes('Others') && (<>
                                <div className="form-group mb-3 col-md-6">
                                    <FormGroup>
                                        <Label>Barriers - Others</Label>
                                        <Input
                                            type="text"
                                            name="barriersOthers"
                                            id="barriersOthers"
                                            value={objValues.barriersOthers}
                                            onChange={handleInputChange}
                                            style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}

                                        >

                                        </Input>

                                    </FormGroup>
                                </div>

                            </>)}
                            <div className="form-group mb-12 col-md-12">
                                <FormGroup>
                                    <Label for="permissions"
                                           style={{color: '#014d88', fontWeight: 'bolder'}}>Intervention</Label>
                                    <DualListBox
                                        //canFilter
                                        options={optionsForInterventions}
                                        onChange={onInterventionsSelect}
                                        selected={selectedInterventions}
                                    />
                                </FormGroup>
                            </div>
                            {selectedInterventions.includes('Others') && (<>
                                <div className="form-group mb-3 col-md-6">
                                    <FormGroup>
                                        <Label>Intervention - Others</Label>
                                        <Input
                                            type="text"
                                            name="interventionOthers"
                                            id="interventionOthers"
                                            value={objValues.interventionOthers}
                                            onChange={handleInputChange}
                                            style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}

                                        >
                                        </Input>
                                    </FormGroup>
                                </div>
                                <div className="form-group mb-3 col-md-6"></div>
                            </>)}
                            <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                    <Label for="">Referrals</Label>
                                    <Input
                                        type="text"
                                        name="referral"
                                        id="referral"
                                        value={objValues.referral}
                                        onChange={handleInputChange}
                                        style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}
                                    />
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                    <Label for="">Follow Up Date</Label>
                                    <Input
                                        type="date"
                                        name="followUpDate"
                                        id="followUpDate"
                                        value={objValues.followUpDate}
                                        onChange={handleInputChange}
                                        min={minDate()}
                                        max={moment(new Date()).format("YYYY-MM-DD")}
                                        style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}
                                        required
                                        onKeyPress={(e) => e.preventDefault()}
                                    />

                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                    <Label for="">Comments</Label>
                                    <Input
                                        type="textarea"
                                        name="comment"
                                        id="comment"
                                        value={objValues.comment}
                                        onChange={handleInputChange}
                                        style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}
                                    />
                                </FormGroup>
                            </div>

                        </div>

                        {saving ? <Spinner/> : ""}
                        <br/>
                        {props.activeContent.actionType === 'update' ? (
                                <MatButton
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    startIcon={<SaveIcon/>}
                                    onClick={handleSubmit}
                                    style={{backgroundColor: "#014d88"}}
                                    disabled={saving}
                                >
                                    {!saving ? (
                                        <span style={{textTransform: "capitalize"}}>Update</span>
                                    ) : (
                                        <span style={{textTransform: "capitalize"}}>Updating...</span>
                                    )}
                                </MatButton>
                            ) :
                            ""
                        }
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}

export default NEWEACSESSION;
