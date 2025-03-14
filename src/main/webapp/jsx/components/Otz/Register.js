import React, { useState, useEffect} from "react";
import axios from "axios";
import MatButton from "@material-ui/core/Button";
//import Button from "@material-ui/core/Button";
import { Spinner,Form,FormGroup, Label, InputGroup, Input } from "reactstrap";
import {makeStyles} from "@material-ui/core/styles";
import {Card, CardContent} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
//import AddIcon from "@material-ui/icons/Add";
import CancelIcon from "@material-ui/icons/Cancel";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import {FaPlus, FaAngleDown} from 'react-icons/fa'
import {token, url as baseUrl } from "../../../api";
import moment from "moment";


const useStyles = makeStyles((theme) => ({
    card: {
        margin: theme.spacing(20),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
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
        '& > *': {
            margin: theme.spacing(1)
        },
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
    demo: {
        backgroundColor: theme.palette.background.default,
    },
    inline: {
        display: "inline",
    },
    error:{
        color: '#f85032',
        fontSize: '12.8px'
    },  
    success: {
        color: "#4BB543 ",
        fontSize: "11px",
    },
}));


const OtzRegister = (props) => {
    const patientObj = props.patientObj;
    const [saving, setSaving] = useState(false);
    const classes = useStyles();
    const [errors, setErrors] = useState({});
    const [disabledField, setSisabledField] = useState(false);
    let temp = { ...errors }
    const [showEligibility, setShowEligibility] = useState(false);
    const [showNutrition, setShowNutrition] = useState(false);
    const [showGenderBase, setShowGenderBase] = useState(false);
    const [showChronicCondition, setShowChronicCondition] = useState(false);
    const [showPositiveHealth, setShowPositiveHealth] = useState(false);
    const [showReproductive, setShowReproductive] = useState(false);
    const [showTb, setShowTb] = useState(false);//Tpt
    const [showTpt, setShowTpt] = useState(false);
    const [enrollDate, setEnrollDate] = useState("");
    //GenderBase Object
    const [genderBase, setGenderBase] = useState({partnerEverPhysically:"", haveBeenBeaten:"", partnerLivelihood:""});
    //Eligibility Object
    const [eligibility, setEligibility] = useState({typeOfClient:"", pregnantStatus:"", whoStaging:"", lastCd4Result:"",lastCd4ResultDate:"", lastViralLoadResult:"", lastViralLoadResultDate:"", eligibleForViralLoad:""});
    //Chronic Care Object
    const [chronicConditions, setChronicConditions]= useState({
            diastolic:"",
            systolic:"",
            pulse:"",
            increaseFood:"",
            increaseWater:"",
            frequencyUrination:"",
            hypertensive:"",
            firstTimeDiabetic:"",
            diabetic:"",
            bp:"",
            firstTimeHypertensive:""
    })
    //Nutrition Object
    const [nutrition, setNutrition]= useState({
        height:"",
        weight:"",
        support:"",
        education:"",
    })
    //Preventive Object
    const [preventive, setPreventive]= useState({
            lastAppointment:"",
            medication:"",
            cotrimoxazole:"",
            parentStatus:"",
            condoms:"",
            condomCounseling:"",
            preventDiseases:"",
            alcohol:"",
            nutrituional:"",
            wash:" ",
            phdp:""
    })
    //Reproductive Object
    const [reproductive, setReproductive] = useState({cervicalCancer:"", pregnantWithinNextYear:"",contraceptive:""});
    //TPT object 
    const [tpt, setTpt] = useState({ date:null,weight:"", referredForServices:"", adherence:"", rash:"", neurologicSymptoms:"", hepatitisSymptoms:"",tbSymptoms:"",resonForStoppingIpt:"", outComeOfIpt:""});
    const [tbObj, setTbObj] = useState({//TB and IPT Screening Object
            currentlyOnTuberculosis:"", 
            tbTreatment:"", 
            tbTreatmentStartDate:"",
            coughing:"", 
            fever:"", 
            losingWeight:"", 
            nightSweats:"", 
            poorWeightGain:"", 
            historyWithAdults:"",
            outcome:"",
            priorInh:false,
            highAlcohol:false,
            activeHepatitis:false,
            age1year:false,
            poorTreatmentAdherence:false,
            abnormalChest: false,
            activeTb:false,
            contraindications :"",
            eligibleForTPT:"",
            treatementOutcome:"",
            treatementType:"",
            completionDate:""
    });
    const [observationObj, setObservationObj]=useState({//Predefine object for chronic care DTO 
            eligibility:"",
            nutrition:"",
            genderBase:"",
            chronicCondition:"",
            positiveHealth:"",
            peproductive:"",
            tbIptScreening:"",
            tptMonitoring:""
    })
    const [observation, setObservation]=useState({
        data: {},
        dateOfObservation: "",
        facilityId: null,
        personId: 0,
        type: "Chronic Care",
        visitId: null
    })
    useEffect(() => {
        GetChronicCare();
        PatientCurrentObject();
        if(props.activeContent.id && props.activeContent.id!=="" && props.activeContent.id!==null){
            setSisabledField(props.activeContent.actionType==='view'?true : false)
        }
    }, [props.activeContent.id]);
    //GET  Patients
    async function PatientCurrentObject() {
        axios
            .get(`${baseUrl}hiv/patient/${props.patientObj.id}`,
            { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                setEnrollDate(response.data.enrollment.dateOfRegistration)
                //setPatientObject(response.data);
            })
            .catch((error) => {  
            });        
    }
    const GetChronicCare =()=>{//function to get chronic care data for edit 
        axios
           .get(`${baseUrl}observation/${props.activeContent.id}`,
               { headers: {"Authorization" : `Bearer ${token}`} }
           )
           .then((response) => {  
                observationObj.eligibility=response.data.eligibility
                observationObj.nutrition=response.data
                observationObj.genderBase=response.data.genderBase
                observationObj.chronicCondition=response.data.chronicConditions
                observationObj.positiveHealth=response.data.positiveHealth
                observationObj.peproductive=response.data.peproductive 
                observationObj.tbIptScreening=response.data.tbIptScreening
                observationObj.tptMonitoring=response.data.tptMonitoring
                setObservation(response.data)
                setObservationObj(response.data.data)
                setTpt({...tpt, ...response.data.data.tptMonitoring})
                setTbObj({...tbObj, ...response.data.data.tbIptScreening})
                setEligibility({...eligibility, ...response.data.data.eligibility})
                setGenderBase({...genderBase, ...response.data.data.genderBase})
                setChronicConditions({...chronicConditions, ...response.data.data.chronicConditions})
                setPreventive({...preventive, ...response.data.data.preventive})
                setReproductive({...reproductive, ...response.data.data.reproductive})
                setTpt({...tpt, ...response.data.data.tptMonitoring})
           })
           .catch((error) => {
           
           });
       
    }
    const handleInputChange = e => {//Handle input fields changes
        
        setErrors({...temp, [e.target.name]:""})
        setObservation ({...observation,  [e.target.name]: e.target.value});
    }
    //Validations of the forms
    const validate = () => { 
        temp.dateOfObservation = observation.dateOfObservation ? "" : "This field is required"
        tpt.outComeOfIpt!=="" && (temp.outcomeDate = tpt.date ? "" : "This field is required")
        setErrors({
            ...temp
        })
        return Object.values(temp).every(x => x === "")
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setSaving(true);
        observation.personId =patientObj.id
        observationObj.eligibility=eligibility
        observationObj.nutrition=
        observationObj.genderBase=genderBase
        observationObj.chronicCondition=chronicConditions
        observationObj.positiveHealth=preventive
        observationObj.peproductive=reproductive 
        observationObj.tbIptScreening=tbObj
        observationObj.tptMonitoring=tpt
        observation.data =observationObj        
        if(validate()){
            if(props.activeContent && props.activeContent.actionType==="update"){//Perform operation for updation action)
                axios.put(`${baseUrl}observation/${props.activeContent.id}`,observation,
                { headers: {"Authorization" : `Bearer ${token}`}},
                
                )
                .then(response => {
                    setSaving(false);
                    toast.success("Chronic Care Save successful", {position: toast.POSITION.BOTTOM_CENTER});
                    props.setActiveContent({...props.activeContent, route:'recent-history'})
                })
                .catch(error => {
                    setSaving(false);
                    if(error.response && error.response.data){
                        
                        if(error.response.data.apierror && error.response.data.apierror.message!=="" ){
                            toast.error(error.response.data.apierror.message, {position: toast.POSITION.BOTTOM_CENTER});
                        }else{
                            toast.error("Something went wrong. Please try again...", {position: toast.POSITION.BOTTOM_CENTER});
                        }
                    }
                });
            }else{
                axios.post(`${baseUrl}observation`,observation,
                { headers: {"Authorization" : `Bearer ${token}`}},
                
                )
                .then(response => {
                    setSaving(false);
                    toast.success("Chronic Care Save successful", {position: toast.POSITION.BOTTOM_CENTER});
                    props.setActiveContent({...props.activeContent, route:'recent-history'})
                })
                .catch(error => {
                    setSaving(false);
                    if(error.response && error.response.data){
                        
                        if(error.response.data.apierror && error.response.data.apierror.message!=="" ){
                            toast.error(error.response.data.apierror.message, {position: toast.POSITION.BOTTOM_CENTER});
                        }else{
                            toast.error("Something went wrong. Please try again...", {position: toast.POSITION.BOTTOM_CENTER});
                        }
                    }
                });
            }
        }else{
            toast.error("All fields are required", {position: toast.POSITION.BOTTOM_CENTER})
            setSaving(false); 
        }
    }
    
    
    const onClickEligibility =() =>{
        setShowEligibility(!showEligibility)
    }
    const onClickTb =() =>{
        setShowTb(!showTb)
    }
    const onClickNutrition =() =>{
        setShowNutrition(!showNutrition)
    }
    const onClickGenderBase =() =>{
        setShowGenderBase(!showGenderBase)
    }
    const onClickChronicCondition =() =>{
        setShowChronicCondition(!showChronicCondition)
    }
    const onClickPositiveHealth =() =>{
        setShowPositiveHealth(!showPositiveHealth)
    }
    const onClickReproductive =() =>{
        setShowReproductive(!showReproductive)
    }
    const onClickTpt =() =>{
        setShowTpt(!showTpt)
    }

    const handleCancel =()=>{
        //history.push({ pathname: '/' });
    }


    return (
        <>
        <ToastContainer autoClose={3000} hideProgressBar />
        <div className="row page-titles mx-0" style={{marginTop:"0px", marginBottom:"-10px"}}>
			<ol className="breadcrumb">
				<li className="breadcrumb-item active"><h2> OTZ Register</h2></li>
			</ol>
		  </div>

            <Card className={classes.root}>
                <CardContent>
                    
                    <div className="col-xl-12 col-lg-12">
                        <Form >
                            <div className="row">
                                <div className="form-group mb-3 col-md-4">
                                    <FormGroup>
                                    <Label >Visit Date *</Label>
                                     
                                    <Input
                                     type="date" onKeyPress={(e) => e.preventDefault()}
                                    name="dateOfObservation"
                                    id="dateOfObservation"
                                    value={observation.dateOfObservation}
                                    onChange={handleInputChange}
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    min={enrollDate}
                                    max= {moment(new Date()).format("YYYY-MM-DD") }
                                    
                                    > 
                                    </Input>                                   
                                    </FormGroup>
                                    {errors.dateOfObservation !=="" ? (
                                    <span className={classes.error}>{errors.dateOfObservation}</span>
                                    ) : "" }   
                                </div>
                            </div>
                            {/* Eligibility Assessment */}
                            <div className="card">
                                <div className="card-header" style={{backgroundColor:"#014d88",color:'#fff',fontWeight:'bolder',  borderRadius:"0.2rem"}}>
                                    <h5 className="card-title" style={{color:'#fff'}}>Eligibility Assessment</h5>
                                    {showEligibility===false  ? (<><span className="float-end" style={{cursor: "pointer"}} onClick={onClickEligibility}><FaPlus /></span></>) :  (<><span className="float-end" style={{cursor: "pointer"}} onClick={onClickEligibility}><FaAngleDown /></span> </>)}
                                </div>
                                {showEligibility && (
                                    <>Form will be here</>
                                )}
                            </div>
                            {/* End Eligibility Assessment */}
                            {/* TB & IPT  Screening  */}
                            <div className="card">
                                
                                <div className="card-header" style={{backgroundColor:"#014d88",color:'#fff',fontWeight:'bolder',  borderRadius:"0.2rem"}}>
                                    <h5 className="card-title" style={{color:'#fff'}}>TB & IPT Screening </h5>
                                    {showTb===false  ? (<><span className="float-end" style={{cursor: "pointer"}} onClick={onClickTb}><FaPlus /></span></>) :  (<><span className="float-end" style={{cursor: "pointer"}} onClick={onClickTb}><FaAngleDown /></span> </>)}
                                </div>
                                {showTb && (
                                    <>Form will be here</>
                                )}
                            </div>
                            {/* End TB & IPT  Screening  */}
                             {/* TPT MONITORING */}
                             <div className="card">
                                <div className="card-header" style={{backgroundColor:"#014d88",color:'#fff',fontWeight:'bolder',  borderRadius:"0.2rem"}}>
                                    <h5 className="card-title" style={{color:'#fff'}}>TPT Monitoring</h5>
                                    {showTpt===false  ? (<><span className="float-end" style={{cursor: "pointer"}} onClick={onClickTpt}><FaPlus /></span></>) :  (<><span className="float-end" style={{cursor: "pointer"}} onClick={onClickTpt}><FaAngleDown /></span> </>)}
                                </div>
                                {showTpt && (
                                    <>Form will be here</>
                                )}
                            </div>
                            {/* End TPT MONITORING */}
                            {/* End Nutritional Status Assessment */}
                            <div className="card">
                                <div className="card-header" style={{backgroundColor:"#014d88",color:'#fff',fontWeight:'bolder',  borderRadius:"0.2rem"}}>
                                    <h5 className="card-title" style={{color:'#fff'}}>Nutritional Status Assessment</h5>
                                    {showNutrition===false  ? (<><span className="float-end" style={{cursor: "pointer"}} onClick={onClickNutrition}><FaPlus /></span></>) :  (<><span className="float-end" style={{cursor: "pointer"}} onClick={onClickNutrition}><FaAngleDown /></span> </>)}
                                </div>
                                {showNutrition && (
                                    <>Form will be here</>
                                )}
                            </div>
                            {/* End Nutritional Status Assessment */}
                            {/* Gender Based Violence Screening */}
                            <div className="card">
                                <div className="card-header" style={{backgroundColor:"#014d88",color:'#fff',fontWeight:'bolder',  borderRadius:"0.2rem"}}>
                                    <h5 className="card-title" style={{color:'#fff'}}>Gender Based Violence Screening </h5>
                                    {showGenderBase===false  ? (<><span className="float-end" style={{cursor: "pointer"}} onClick={onClickGenderBase}><FaPlus /></span></>) :  (<><span className="float-end" style={{cursor: "pointer"}} onClick={onClickGenderBase}><FaAngleDown /></span> </>)}
                                </div>
                                {showGenderBase && (
                                <div className="card-body">
                                    <div className="row">
                                        <>Form will be here</>
                                    </div>

                                </div>
                                )}
                            </div>
                            {/* End Gender Based Violence Screening */}
                            {/* End Screening for Chronic Conditions */}
                            <div className="card">
                                <div className="card-header" style={{backgroundColor:"#014d88",color:'#fff',fontWeight:'bolder',  borderRadius:"0.2rem"}}>
                                    <h5 className="card-title" style={{color:'#fff'}}>Screening for Chronic Conditions</h5>
                                    {showChronicCondition===false  ? (<><span className="float-end" style={{cursor: "pointer"}} onClick={onClickChronicCondition}><FaPlus /></span></>) :  (<><span className="float-end" style={{cursor: "pointer"}} onClick={onClickChronicCondition}><FaAngleDown /></span> </>)}
                                </div>
                                {showChronicCondition && (
                                <div className="card-body">
                                    <div className="row">
                                       {/* <ChronicConditions chronicConditions={chronicConditions} setChronicConditions={setChronicConditions} setErrors={setErrors} errors={errors} encounterDate={observation.dateOfObservation} patientObj={patientObj}/> */}
                                    </div>

                                </div>
                                )}
                            </div>
                            {/* End Screening for Chronic Conditions */}
                            {/* Positive Health Dignity and Prevention */}
                            <div className="card">
                                <div className="card-header" style={{backgroundColor:"#014d88",color:'#fff',fontWeight:'bolder',  borderRadius:"0.2rem"}}>
                                    <h5 className="card-title" style={{color:'#fff'}}>Positive Health Dignity and Prevention(PHDP) </h5>
                                    {showPositiveHealth===false  ? (<><span className="float-end" style={{cursor: "pointer"}} onClick={onClickPositiveHealth}><FaPlus /></span></>) :  (<><span className="float-end" style={{cursor: "pointer"}} onClick={onClickPositiveHealth}><FaAngleDown /></span> </>)}
                                </div>
                                {showPositiveHealth && (
                                <div className="card-body">
                                    <div className="row">
                                       {/* <PositiveHealthDignity preventive={preventive} setPreventive={setPreventive} setErrors={setErrors} errors={errors} encounterDate={observation.dateOfObservation} patientObj={patientObj}/> */}
                                    </div>

                                </div>
                                )}
                            </div>
                            {/* End Positive Health Dignity and Prevention */} 
                            {/* Reproductive Intentions */}
                            <div className="card">
                                <div className="card-header" style={{backgroundColor:"#014d88",color:'#fff',fontWeight:'bolder',  borderRadius:"0.2rem"}}>
                                    <h5 className="card-title" style={{color:'#fff'}}>Reproductive Intentions </h5>
                                    {showReproductive===false  ? (<><span className="float-end" style={{cursor: "pointer"}} onClick={onClickReproductive}><FaPlus /></span></>) :  (<><span className="float-end" style={{cursor: "pointer"}} onClick={onClickReproductive}><FaAngleDown /></span> </>)}
                                </div>
                                {showReproductive && (
                                <div className="card-body">
                                    <div className="row">
                                        {/* <ReproductiveIntentions setReproductive={setReproductive} reproductive={reproductive} setErrors={setErrors} errors={errors} encounterDate={observation.dateOfObservation} patientObj={patientObj}/> */}
                                    </div>

                                </div>
                                )}
                            </div>
                            {/* End Reproductive Intentions */}
                            {saving ? <Spinner /> : ""}

                            <br />
                            {props.activeContent && props.activeContent.actionType? (<>
                                <MatButton
                                type="submit"
                                variant="contained"
                                color="primary"
                                hidden={disabledField}
                                className={classes.button}
                                startIcon={<SaveIcon />}
                                style={{backgroundColor:"#014d88"}}
                                onClick={handleSubmit}
                                disabled={saving}
                                >
                                    {!saving ? (
                                    <span style={{ textTransform: "capitalize" }}>Update</span>
                                    ) : (
                                    <span style={{ textTransform: "capitalize" }}>Updating...</span>
                                    )}
                                </MatButton>
                            </>):(<>
                                <MatButton
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    startIcon={<SaveIcon />}
                                    style={{backgroundColor:"#014d88"}}
                                    onClick={handleSubmit}
                                    disabled={saving}
                                    >
                                        {!saving ? (
                                        <span style={{ textTransform: "capitalize" }}>Save</span>
                                        ) : (
                                        <span style={{ textTransform: "capitalize" }}>Saving...</span>
                                        )}
                            </MatButton>
                            </>)}
                            
                        </Form>
                    </div>
                </CardContent>
            </Card>
 
        </>
    );
};

export default OtzRegister