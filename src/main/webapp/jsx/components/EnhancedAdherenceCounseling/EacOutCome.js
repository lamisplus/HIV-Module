import React, {useState, useEffect} from 'react';
import { Card,CardBody, FormGroup, Label, Input} from 'reactstrap';
import MatButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'
import ButtonMui from "@material-ui/core/Button";
import axios from "axios";
import { toast} from "react-toastify";
import { url as baseUrl } from "../../../api";
import { token as token } from "../../../api";
import "react-widgets/dist/css/react-widgets.css";
import moment from "moment";
import { Spinner } from "reactstrap";


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
        "& .card-title":{
            color:'#fff',
            fontWeight:'bold'
        },
        "& .form-control":{
            borderRadius:'0.25rem',
            height:'41px'
        },
        "& .card-header:first-child": {
            borderRadius: "calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0"
        },
        "& .dropdown-toggle::after": {
            display: " block !important"
        },
        "& select":{
            "-webkit-appearance": "listbox !important"
        },
        "& p":{
            color:'red'
        },
        "& label":{
            fontSize:'14px',
            color:'#014d88',
            fontWeight:'bold'
        }
    },
    input: {
        display: 'none'
    }
}))

const EAC = (props) => {
    //const patientObj = props.patientObj;
    const classes = useStyles()
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [currentViralLoad, setCurrentViralLoad] = useState({});
    const [allViralLoad, setAllViralLoad] = useState([]);
    const [ eacSession, setEacSession] = useState([]);
    const[postViralLoadObj, setPostViralLoadObj] = useState(null);
    const [postViralLoadResult, setPostViralLoadResult] = useState("");
    const [currentRegimen, setCurrentRegimen] = useState({});
    const [loading, setLoading] = useState(true)
    const [regimenType, setRegimenType] = useState([]);
    const [regimenLine, setRegimenLine] = useState([]);
    const [regimenLineLineType, setRegimenLineLineType] = useState([]);
    const [patientRegimenInfo, setPatientRegimenInfo] = useState(null)
    const [objValues, setObjValues]=useState({
        currentRegimen: "",
        planAction:"",
        eacId: props.activeContent.obj.id,
        id: "",
        outComeDate: "",
        outcome: "",
        repeatViralLoader:"",
        personId: props.patientObj.id,
        plan: "",
        visitId: "",
        switchRegimen:"",
        comment:""
    })
    const [switchs, setSwitchs]=useState({
        currentRegimen: "",
        dateSwitched: "",
        reasonSwitched: "",
        switchRegimenLine:"",
        switchRegimenLineType:""

    })
    const [Substitutes, setSubstitutes]=useState({
        currentRegimen: "",
        substituteRegimen: "",
        dateSubstituted: "",
        reasonSubstituted: "",
        substituteRegimenLineType:'',

    })
    useEffect(() => {
        //EACHistory()
        // CurrentLabResult()
        CurrentRegimen()
        getPatientCurrentRegimen()
        RegimenLine()
        getAllViralLoadLabResult()
        getEacSessions();
    }, [props.patientObj.id]);

    ///GET CURRENT LAB RESULT
    // const CurrentLabResult =()=>{
    //     setLoading(true)
    //     axios
    //         .get(`${baseUrl}laboratory/rde-orders/latest-viral-loads/${props.patientObj.id}`,
    //             { headers: {"Authorization" : `Bearer ${token}`} }
    //         )
    //         .then((response) => {
    //             setLoading(false)
    //             setCurrentViralLoad(response.data)
    //         })
    //         .catch((error) => {
    //
    //         });
    // }

    useEffect(() => {
        axios
            .get(`${baseUrl}laboratory/vl-results/patients/${props.patientObj.id}`, {
                headers: { "Authorization": `Bearer ${token}`},
            })
            .then((response) => {
                setLoading(false);
                const viralLoads = response.data;

                const earliestViralLoad = viralLoads
                    .filter(vl => vl.result !== null && vl.result >= 1000)
                    .reduce((earliest, current) => {
                        const currentDate = new Date(current.dateResultReceived);
                        const earliestDate = new Date(earliest.dateResultReceived);
                        return currentDate < earliestDate ? current : earliest;
                    });

                setCurrentViralLoad(earliestViralLoad);
            })
            .catch((error) => {
                setLoading(false);
                console.error(error);
            });
    }, [props.patientObj.id]);



    const getAllViralLoadLabResult =()=>{
        setLoading(true)
        axios
            .get(`${baseUrl}laboratory/vl-results/patients/${props.patientObj.id}`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                setLoading(false)
                setAllViralLoad(response.data)
            })
            .catch((error) => {

            });
    }

    const getEacSessions =()=>{
        setLoading(true)
        axios
            .get(`${baseUrl}hiv/eac/session/eac/${props.activeContent.obj.id}`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                setLoading(false)
                setEacSession(response.data)
            })
            .catch((error) => {
            });
    }

    useEffect(() => {
        if (allViralLoad.length >= 2 && eacSession.length >= 3) {
            const mostRecentViralLoad = allViralLoad.reduce((mostRecent, current) => {
                const mostRecentDate = mostRecent?.dateResultReceived ? new Date(mostRecent.dateResultReceived) : null;
                const currentDate = current?.dateResultReceived ? new Date(current.dateResultReceived) : null;
                // console.log("Comparing Viral Load Dates:", { mostRecentDate, currentDate });
                return currentDate && (!mostRecentDate || currentDate > mostRecentDate) ? current : mostRecent;
            });

            const mostRecentEacSession = eacSession.reduce((mostRecent, current) => {
                const mostRecentDate = mostRecent?.sessionDate ? new Date(mostRecent.sessionDate) : null;
                const currentDate = current?.sessionDate ? new Date(current.sessionDate) : null;
                // console.log("Comparing EAC Session Dates:", { mostRecentDate, currentDate });
                return currentDate && (!mostRecentDate || currentDate > mostRecentDate) ? current : mostRecent;
            });

            const dateA = mostRecentViralLoad?.dateResultReceived ? new Date(mostRecentViralLoad.dateResultReceived) : null;
            const dateB = mostRecentEacSession?.sessionDate ? new Date(mostRecentEacSession.sessionDate) : null;
            if (dateB && (!dateA || dateB > dateA)) {
                setPostViralLoadObj(null)
            } else if (dateA) {
                setPostViralLoadObj(mostRecentViralLoad)
            } else {
                setPostViralLoadObj(null)
            }
        }
    }, [allViralLoad, eacSession]);

    // AUTO POPULATE THE OUTCOME FILED
    useEffect(() =>{
        if(postViralLoadObj && postViralLoadObj.result != null){
            const outcome = postViralLoadObj.result < 1000 ? "Suppressed" : "Unsuppressed"
            setObjValues((prevState) => (
                {
                    ...prevState,
                    outcome: outcome
                }
            ))
        }
    },[postViralLoadObj])

    const RegimenLine = () => {
        setLoading(true);
        axios
            .get(`${baseUrl}hiv/regimen/types`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            .then((response) => {
                // Filter regimen based on patient's age
                const filterRegimen = response.data.filter(item => {
                    if (props.patientObj.age >= 15) {
                        return [1,2,14].includes(item.id);
                    } else {
                        return [3,4].includes(item.id);
                    }
                });
                setRegimenLine(filterRegimen);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error ", error);
            });
    };

    ///GET CURRENT Regimen
    const CurrentRegimen =()=>{
        setLoading(true)
        axios
            .get(`${baseUrl}hiv/art/pharmacy/patient/current-regimen/${props.patientObj.id}`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                setLoading(false)
                setCurrentRegimen(response.data)
                if(response.data){
                    const regimenTypeID=response.data && response.data.regimenType ? response.data.regimenType.id :""
                    axios
                        .get(`${baseUrl}hiv/regimen/types/${regimenTypeID}`,
                            { headers: {"Authorization" : `Bearer ${token}`} }
                        )
                        .then((response) => {
                            setLoading(false)
                            // console.log("Regimen type **** ", response.data)
                            setRegimenType(response.data)
                        })
                        .catch((error) => {

                        });
                }
            })
            .catch((error) => {
            });
    }

    // GET CURRENT REGIMEN INFORMATION
    const getPatientCurrentRegimen =()=>{
        setLoading(true)
        axios
            .get(`${baseUrl}hiv/art/pharmacy/get-current-regimen-info?personUuid=${props.patientObj.personUuid}`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                // console.log("RESPONSE **** ", response.data)
                setLoading(false)
                setPatientRegimenInfo(response.data)
                setObjValues({
                    ...objValues,
                    currentRegimen: response.data?.currentartregimen
                })
            })
            .catch((error) => {
                console.log("Error ", error)
            });
    }

    const handleInputSwitchChange = e => {//this function is to handle form input

        setSwitchs ({...switchs,  [e.target.name]: e.target.value});
    }
    // const handleInputSubstituteChange = e => {//this function is to handle form input
    //     setSubstitutes ({...Substitutes,  [e.target.name]: e.target.value});
    // }

    const handleSelectedSubstituteRegimen = e => {
        const regimenId = e.target.value;
        setSubstitutes({ ...Substitutes, [e.target.name]: e.target.value });
        if (regimenId !== "") {
            RegimenType(regimenId);
        } else {
            setRegimenType([]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setObjValues({ ...objValues, [name]: value });

        if (name === "plan") {
            switch (value) {
                case "Remain on current regimen":
                    setSwitchs({
                        currentRegimen: "",
                        dateSwitched: "",
                        reasonSwitched: "",
                        switchRegimenLine:"",
                        switchRegimenLineType:""
                    });
                    setSubstitutes({
                        currentRegimen: "",
                        substituteRegimen: "",
                        dateSubstituted: "",
                        reasonSubstituted: "",
                        substituteRegimenLineType:'',
                    });
                    // setObjValues({
                    //     ...objValues,
                    //     outComeDate: "",
                    // })
                    break;
                case "Switch regimen":
                    setSubstitutes({
                        currentRegimen: "",
                        substituteRegimen: "",
                        dateSubstituted: "",
                        reasonSubstituted: "",
                        substituteRegimenLineType:'',
                    });
                    // setObjValues({
                    //     ...objValues,
                    //     outComeDate: "",
                    // })
                    break;
                case "Substitute regimen":
                    setSwitchs({
                        currentRegimen: "",
                        dateSwitched: "",
                        reasonSwitched: "",
                        switchRegimenLine:"",
                        switchRegimenLineType:""
                    });
                    break;
                case "Refer to doctor for further management":
                    setSwitchs({
                        currentRegimen: "",
                        dateSwitched: "",
                        reasonSwitched: "",
                        switchRegimenLine:"",
                        switchRegimenLineType:""
                    });
                    setSubstitutes({
                        currentRegimen: "",
                        substituteRegimen: "",
                        dateSubstituted: "",
                        reasonSubstituted: "",
                        substituteRegimenLineType:'',
                    });
                    // setObjValues({
                    //     ...objValues,
                    //     outComeDate: "",
                    // })
                    break;
                default:
                    break;
            }
        }
    };


    const BackToSession = (row, actionType) =>{  //this function is to handle back button
        // props.setActiveContent({...props.activeContent, route:'pharmacy', activeTab:"hsitory"})

        props.setActiveContent({...props.activeContent, route:'eac-session', id:row.id, activeTab:"history", actionType:actionType, obj:row})
    }
    const handleSelectedRegimen = e => {//this function is to handle form input
        const regimenId= e.target.value
        setSwitchs ({...switchs,  [e.target.name]: e.target.value});
        if(regimenId!==""){
            RegimenType(regimenId)
            //setShowRegimen(true)
        }else{
            setRegimenType([])
            //setShowRegimen(false)
        }
    }

    function RegimenType(id) {//Get Regimen by regimen ID
        async function getCharacters() {
            try{
                const response = await axios.get(`${baseUrl}hiv/regimen/types/${id}`,
                    { headers: {"Authorization" : `Bearer ${token}`} })
                if(response.data.length >0){
                    setRegimenLineLineType(response.data)
                }
            }catch(e) {

            }
        }
        getCharacters();
    }

    /**** Submit Button Processing  */
    const handleSubmit = (e) => {
        e.preventDefault();
        setSaving(true);
        // objValues.currentRegimen=currentRegimen && currentRegimen.description ? currentRegimen.description :""
        objValues.currentRegimen = patientRegimenInfo && patientRegimenInfo.currentartregimen ? patientRegimenInfo.currentartregimen : ""
        if(objValues.plan==='Substitute regimen'){
            objValues.planAction=Substitutes
        }
        if(objValues.plan==='Switch regimen'){
            objValues.planAction=switchs
        }
        axios.post(`${baseUrl}hiv/eac/out-come?eacId=${props.activeContent.obj.id}`,objValues,
            { headers: {"Authorization" : `Bearer ${token}`}},

        )
            .then(response => {
                setSaving(false);
                toast.success("EAC outcome Save successful");
                props.setActiveContent({...props.activeContent, route:'counseling', activeTab:"home"})

            })
            .catch(error => {
                setSaving(false);
                if(error.response && error.response.data){
                    let errorMessage = error.response.data.apierror && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
                    toast.error(errorMessage);
                }
                else{
                    toast.error("Something went wrong. Please try again...");
                }
            });

    }


    return (
        <div>

            <Card className={classes.root}>
                <CardBody>

                    <form >
                        <div className="row">
                            <h2>EAC - Outcome
                                <ButtonMui
                                    variant="contained"
                                    color="primary"
                                    className=" float-end ms-2 mr-2 mt-2 "
                                    onClick={() => BackToSession(props.activeContent.obj, 'view')}
                                    style={{backgroundColor: "#014D88", color: '#fff', height: '35px'}}

                                >
                                    <span style={{textTransform: "capitalize"}}>Back To EAC Session</span>
                                </ButtonMui>
                            </h2>
                            <br/>
                            <br/>
                            <br/>

                            <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                    <Label>Pre Viral Load Result</Label>
                                    <Input
                                        type="text"
                                        name="viralLoadResult"
                                        id="viralLoadResult"
                                        style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}
                                        value={currentViralLoad && currentViralLoad.result ? currentViralLoad.result : ""}
                                        disabled
                                    />

                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                    <Label for="">Pre Viral Load Result Date </Label>
                                    <Input
                                        type="datetime-local"
                                        name="dateResultReceived"
                                        id="dateResultReceived"
                                        //value={objValues.dateResultReceived}
                                        value={currentViralLoad && currentViralLoad.dateResultReceived ? currentViralLoad.dateResultReceived : ""}
                                        //onChange={handleInputChange}
                                        //min={objValues.dateOfEac2}
                                        //max= {moment(new Date()).format("YYYY-MM-DD") }
                                        style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}
                                        disabled
                                        onKeyPress={(e) => e.preventDefault()}
                                    />
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                    <Label>Post Viral Load Result</Label>
                                    <Input
                                        type="text"
                                        name="viralLoadResult"
                                        id="viralLoadResult"
                                        style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}
                                        // value={currentViralLoad && currentViralLoad.result ? currentViralLoad.result : ""}
                                        value = {postViralLoadObj?.result}
                                        disabled
                                        onKeyPress={(e) => e.preventDefault()}
                                    />

                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                    <Label for="">Post Viral Load Result Date </Label>
                                    <Input
                                        type="datetime-local"
                                        name="dateResultReceived"
                                        id="dateResultReceived"
                                        value = {postViralLoadObj && postViralLoadObj.dateResultReceived ?  postViralLoadObj.dateResultReceived :"" }
                                        style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}
                                        disabled
                                        onKeyPress={(e) => e.preventDefault()}
                                    />
                                </FormGroup>
                            </div>
                            <hr/>
                            <h2>Outcome</h2>
                            <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                    <Label>Outcome </Label>
                                    <Input
                                        type="select"
                                        name="outcome"
                                        id="outcome"
                                        value={objValues.outcome}
                                        onChange={handleInputChange}
                                        style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}
                                        disabled
                                    >
                                        <option value="">Select</option>
                                        <option value="Suppressed">Suppressed</option>
                                        <option value="Unsuppressed">Unsuppressed</option>
                                    </Input>

                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                    <Label>Plan </Label>
                                    <Input
                                        type="select"
                                        name="plan"
                                        id="plan"
                                        value={objValues.plan}
                                        onChange={handleInputChange}
                                        style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}

                                    >
                                        <option value="">Select</option>
                                        <option value="Remain on current regimen">Remain on current regimen</option>
                                        <option value="Switch regimen">Switch regimen</option>
                                        <option value="Substitute regimen">Substitute regimen</option>
                                        <option value="Refer to doctor for further management">Refer to doctor for further
                                            management
                                        </option>
                                    </Input>
                                </FormGroup>
                            </div>
                            {objValues.plan === 'Switch regimen' && (<>
                                <div className="row">
                                    <h4>Switch Regimen</h4>
                                    <div className="form-group mb-3 col-md-6">
                                        <FormGroup>
                                            <Label>Current Regimen </Label>
                                            <Input
                                                type="text"
                                                name="currentRegimen"
                                                id="currentRegimen"
                                                // value={currentRegimen && currentRegimen.description ? currentRegimen.description : ""}
                                                value={patientRegimenInfo && patientRegimenInfo.currentartregimen ? patientRegimenInfo.currentartregimen : ""}
                                                onChange={handleInputChange}
                                                disabled
                                                style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}

                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="form-group mb-3 col-md-6">
                                        <FormGroup>
                                            <Label>Current Regimen Line </Label>
                                            <Input
                                                type="text"
                                                name="currentRegimenLine"
                                                id="currentRegimenLine"
                                                // value={currentRegimen && currentRegimen.description ? currentRegimen.description : ""}
                                                value={patientRegimenInfo && patientRegimenInfo.currentregimenline? patientRegimenInfo.currentregimenline : ""}
                                                onChange={handleInputChange}
                                                disabled
                                                style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}

                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="form-group mb-3 col-md-6">
                                        <FormGroup>
                                            <Label>Switch Regimen Line </Label>
                                            <Input
                                                type="select"
                                                name="switchRegimenLine"
                                                id="switchRegimenLine"
                                                value={switchs.switchRegimenLine}
                                                onChange={handleSelectedRegimen}
                                                style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}

                                            >
                                                <option value="">Select</option>
                                                {regimenLine.map((value) => (
                                                    <option key={value.id} value={value.id}>
                                                        {value.description}
                                                    </option>
                                                ))}
                                            </Input>

                                        </FormGroup>
                                    </div>
                                    <div className="form-group mb-3 col-md-6">
                                        <FormGroup>
                                            <Label>Switch Regimen Type</Label>
                                            <Input
                                                type="select"
                                                name="switchRegimenLineType"
                                                id="switchRegimenLineType"
                                                value={switchs.switchRegimenLineType}
                                                onChange={handleInputSwitchChange}

                                                style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}

                                            >
                                                <option value="">Select</option>
                                                {regimenLineLineType.map((value) => (
                                                    <option key={value.id} value={value.id}>
                                                        {value.description}
                                                    </option>
                                                ))}
                                            </Input>

                                        </FormGroup>
                                    </div>

                                    <div className="form-group mb-3 col-md-6">
                                        <FormGroup>
                                            <Label for="">Switch Date</Label>
                                            <Input
                                                type="date"
                                                name="dateSwitched"
                                                id="dateSwitched"
                                                value={switchs.dateSwitched}
                                                onChange={handleInputSwitchChange}
                                                min={moment(currentViralLoad && currentViralLoad.dateResultReceived ? currentViralLoad.dateResultReceived : "").format("YYYY-MM-DD")}
                                                max={moment(new Date()).format("YYYY-MM-DD")}
                                                style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}
                                                required
                                                onKeyPress={(e) => e.preventDefault()}
                                            />
                                            {errors.dateSwitched !== "" ? (
                                                <span className={classes.error}>{errors.dateSwitched}</span>
                                            ) : ""}
                                        </FormGroup>
                                    </div>
                                    <div className="form-group mb-3 col-md-6">
                                        <FormGroup>
                                            <Label for="">Reason for switching Regimen</Label>
                                            <Input
                                                type="textarea"
                                                name="reasonSwitched"
                                                id="reasonSwitched"
                                                value={switchs.reasonSwitched}
                                                onChange={handleInputSwitchChange}
                                                style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}
                                            />
                                        </FormGroup>
                                    </div>

                                </div>
                            </>)}
                            {objValues.plan === 'Substitute regimen' && (<>
                                <div className="row">
                                    <h4>Substitute Regimen</h4>
                                    <div className="form-group mb-3 col-md-6">
                                        <FormGroup>
                                            <Label>Current Regimen </Label>
                                            <Input
                                                type="text"
                                                name="currentRegimen"
                                                id="currentRegimen"
                                                // value={currentRegimen && currentRegimen.description ? currentRegimen.description : ""}
                                                value={patientRegimenInfo && patientRegimenInfo.currentartregimen ? patientRegimenInfo.currentartregimen : ""}
                                                onChange={handleInputChange}
                                                disabled
                                                style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}

                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="form-group mb-3 col-md-6">
                                        <FormGroup>
                                            <Label>Current Regimen Line </Label>
                                            <Input
                                                type="text"
                                                name="currentRegimenLine"
                                                id="currentRegimenLine"
                                                // value={currentRegimen && currentRegimen.description ? currentRegimen.description : ""}
                                                value={patientRegimenInfo && patientRegimenInfo.currentregimenline ? patientRegimenInfo.currentregimenline : ""}
                                                onChange={handleInputChange}
                                                disabled
                                                style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}

                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="form-group mb-3 col-md-6">
                                        <FormGroup>
                                            <Label>Substitute Regimen Line </Label>
                                            <Input
                                                type="select"
                                                name="substituteRegimen"
                                                id="substituteRegimen"
                                                value={Substitutes.substituteRegimen}
                                                // onChange={handleInputSubstituteChange}
                                                onChange={handleSelectedSubstituteRegimen}
                                                style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}

                                            >
                                                <option value="">Select</option>
                                                {regimenLine.map((value) => (
                                                    <option key={value.id} value={value.id}>
                                                        {value.description}
                                                    </option>
                                                ))}

                                            </Input>
                                        </FormGroup>
                                    </div>
                                    <div className="form-group mb-3 col-md-6">
                                        <FormGroup>
                                            <Label> Substitute Regimen Type</Label>
                                            <Input
                                                type="select"
                                                name="substituteRegimenLineType"
                                                id="substituteRegimenLineType"
                                                value={Substitutes.substituteRegimenLineType}
                                                onChange={handleSelectedSubstituteRegimen}
                                                style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}

                                            >
                                                <option value="">Select</option>
                                                {regimenLineLineType.map((value) => (
                                                    <option key={value.id} value={value.id}>
                                                        {value.description}
                                                    </option>
                                                ))}
                                            </Input>

                                        </FormGroup>
                                    </div>
                                    <div className="form-group mb-3 col-md-6">
                                        <FormGroup>
                                            <Label for="">Substitute Date</Label>
                                            <Input
                                                type="date"
                                                name="dateSubstituted"
                                                id="dateSubstituted"
                                                value={Substitutes.dateSubstituted}
                                                onChange={handleSelectedSubstituteRegimen}
                                                min={moment(currentViralLoad && currentViralLoad.dateResultReceived ? currentViralLoad.dateResultReceived : "").format("YYYY-MM-DD")}
                                                max={moment(new Date()).format("YYYY-MM-DD")}
                                                style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}
                                                required
                                                onKeyPress={(e) => e.preventDefault()}
                                            />
                                            {errors.dateSubstituted !== "" ? (
                                                <span className={classes.error}>{errors.dateSubstituted}</span>
                                            ) : ""}
                                        </FormGroup>
                                    </div>
                                    <div className="form-group mb-3 col-md-6">
                                        <FormGroup>
                                            <Label for="">Reason for Substitute Regimen</Label>
                                            <Input
                                                type="textarea"
                                                name="reasonSubstituted"
                                                id="reasonSubstituted"
                                                value={Substitutes.reasonSubstituted}
                                                // onChange={handleInputSubstituteChange}
                                                onChange={handleSelectedSubstituteRegimen}
                                                style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}
                                            />
                                        </FormGroup>
                                    </div>

                                </div>
                            </>)}
                            <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                    <Label for="">Outcome Date</Label>
                                    <Input
                                        type="date"
                                        name="outComeDate"
                                        id="outComeDate"
                                        value={objValues.outComeDate}
                                        onChange={handleInputChange}
                                        min={moment(currentViralLoad && currentViralLoad.dateResultReceived ? currentViralLoad.dateResultReceived : "").format("YYYY-MM-DD")}
                                        max={moment(new Date()).format("YYYY-MM-DD")}
                                        style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}
                                        required
                                        onKeyPress={(e) => e.preventDefault()}
                                    />
                                    {errors.outComeDate !== "" ? (
                                        <span className={classes.error}>{errors.outComeDate}</span>
                                    ) : ""}
                                </FormGroup>
                            </div>
                        </div>
                        <div className="row">
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

                        <MatButton
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            startIcon={<SaveIcon/>}
                            onClick={handleSubmit}
                            style={{backgroundColor:"#014d88"}}
                            disabled={objValues.dateOfEac3==="" ? true : false}
                        >
                            {!saving ? (
                                <span style={{ textTransform: "capitalize" }}>Save</span>
                            ) : (
                                <span style={{ textTransform: "capitalize" }}>Saving...</span>
                            )}
                        </MatButton>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}

export default EAC;
