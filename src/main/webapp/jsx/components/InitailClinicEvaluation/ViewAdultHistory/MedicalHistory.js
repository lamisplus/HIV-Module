
import React, { useEffect, useState} from "react";
import axios from "axios";
import {FormGroup, Label , CardBody, Spinner,Input,Form, InputGroup} from "reactstrap";
import * as moment from 'moment';
import {makeStyles} from "@material-ui/core/styles";
import {Card, CardContent} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
// import AddIcon from "@material-ui/icons/Add";
// import CancelIcon from "@material-ui/icons/Cancel";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { useHistory, } from "react-router-dom";
// import {TiArrowBack} from 'react-icons/ti'
import {token, url as baseUrl } from "../../../../api";
import 'react-phone-input-2/lib/style.css'
import 'semantic-ui-css/semantic.min.css';
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { Button} from 'semantic-ui-react'
import {  Modal } from "react-bootstrap";


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
        },
        
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
    }
}));


const MedicalHistory = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const [errors, setErrors] = useState({});
    const [enrollDate, setEnrollDate] = useState("");
    const [visit, setVisit] = useState({visitDate:""})
    const [allergies, setAllergies]= useState([])
    useEffect(() => {
        PrepSideEffect();
      }, []);
        //Get list of PrepSideEffect
        const PrepSideEffect =()=>{
        axios
            .get(`${baseUrl}application-codesets/v2/PREP_SIDE_EFFECTS`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                
                setAllergies(response.data);
            })
            .catch((error) => {
            
            });
        
        }
    useEffect(() => { 
        GetPatientDTOObj()
        if(props.observation.data && props.observation.data.medicalHistory){
            setobjValues(props.observation.data.medicalHistory) 
            visit.visitDate=moment(props.observation.dateOfObservation).format("YYYY-MM-DD")          
        }
        
    }, [props.observation.data, props.patientObj]);
    const GetPatientDTOObj =()=>{
        axios
           .get(`${baseUrl}hiv/patient/${props.patientObj.id}`,
               { headers: {"Authorization" : `Bearer ${token}`} }
           )
           .then((response) => {
               const patientDTO= response.data.enrollment
            //    setEnrollDate (patientDTO.dateOfRegistration)
               setEnrollDate(patientDTO.entryPointId===21 ? patientDTO.dateConfirmedHiv : patientDTO.dateOfRegistration)
           })
           .catch((error) => {
           
           });          
    }
    const [objValues, setobjValues] = useState({Nausea:"", 
                                                Nausea_fever:"",
                                                as_never_receive_arvs:"",
                                                chronic:"",
                                                chronic_duration:"",
                                                cough:"",
                                                cough_duration:"",
                                                drug_allergies:"",
                                                duration_of_care_from:"",
                                                early_arv_but_not_transfer_in:"",
                                                fever:"",
                                                fever_duration:"",
                                                genital:"",
                                                genital_duration :"",
                                                genital_score:"",
                                                genital_score_duration:"",
                                                headache:"",
                                                headache_duration:"",
                                                hospitalization:"",
                                                itching:"",
                                                itching_duration:"",
                                                name_of_the_facility:"",
                                                new_visual:"",
                                                new_visual_duration:"",
                                                night_duration:"",
                                                numbness:"",
                                                numbness_duration:"",
                                                pain:"",
                                                pain_duration:"",
                                                past_medical_history:"",
                                                previous_arv_exposure:"",
                                                rash:"",
                                                rash_duration:"",
                                                recent:"",
                                                recent_duration:"",
                                                relevant_family_history:"",
                                                screen_for_tb:"",
                                                shortness_of_breath:"",
                                                shortness_of_breath_duration:"",
                                                duration_of_care_to:"",
                                                disclosureNoOne:"",  
                                                familyMember:"", 
                                                friend:"", 
                                                spouse:"", 
                                                spiritualLeader:"", 
                                                disclosureOthers:"", 
                                                HivStatusCanBeDiscussed:"",
                                                CurrentMedicationNone :"",
                                                currentART :"",
                                                currentCTX:"", 
                                                currentAntiTbDdrugs :"",
                                                currentOthers:"",
                                                childMotherAlive:"", 
                                                motherName:"", 
                                                motherAddress:"", 
                                                childFatherAlive:"", 
                                                // immunisationComplete:"",
                                                fatherName:"", 
                                                fatherAddress:"", 
                                                parentChildMarriageStatus:"",  
                                                howManySibiling:"", 
                                                immunisationComplete:"",
                                                modeOfInfantFeeding:""
                                                });
    let temp = { ...errors }
    const [hideOtherPatientDisclosure, setHideOtherPatientDisclosure]=useState(false)
    const [hideOtherCurrentMedication, setHideOtherCurrentMedication]=useState(false)
    //Handle CheckBox 
    const handleMedicalHistory =e =>{
        if(e.target.name==='disclosureNoOne'){
            if(e.target.checked){
            setHideOtherPatientDisclosure(true)
                }else{
                    setHideOtherPatientDisclosure(false)
                }
        }
        if(e.target.name==='CurrentMedicationNone'){
            if(e.target.checked){
                setHideOtherCurrentMedication(true)

                }else{
                    setHideOtherCurrentMedication(false)
                }
        } 
        if(e.target.name==='previous_arv_exposure' && e.target.value==='No'){
            objValues.name_of_the_facility=""
            objValues.duration_of_care_from=""
            objValues.duration_of_care_to=""  
            setobjValues({...objValues, [e.target.name]: e.target.value})
        }         
        setobjValues({...objValues, [e.target.name]: e.target.value})
    }
    const handleInputChangeobjValues = e => {            
        setVisit ({...visit,  [e.target.name]: e.target.value});
    }
    const handleItemClick =(page, completedMenu)=>{
        props.handleItemClick(page)
        if(props.completed.includes(completedMenu)) {

        }else{
            props.setCompleted([...props.completed, completedMenu])
        }
    } 
    //Validations of the forms
  const validate = () => {        
    temp.screen_for_tb = objValues.screen_for_tb ? "" : "This field is required"
    //temp.past_medical_history = objValues.past_medical_history ? "" : "This field is required"
    //temp.relevant_family_history = objValues.relevant_family_history ? "" : "This field is required"
    temp.drug_allergies = objValues.drug_allergies ? "" : "This field is required"
    temp.visitDate = visit.visitDate ? "" : "This field is required"

    setErrors({
        ...temp
    })
    return Object.values(temp).every(x => x == "")
  } 
     /**** Submit Button Processing  */
     const handleSubmit = (e) => { 
        e.preventDefault(); 
        if(validate()){
            props.observation.dateOfObservation= visit.visitDate 
            props.observation.dateOfObservation= visit.visitDate
            props.observation.data.medicalHistory=objValues   
            //toast.success("Medical history save successful");
            handleItemClick('past-arv', 'medical-history' ) 
        }                 
    }


    return (
        <>  
        
            <Card className={classes.root}>
                <CardBody>   
                <h2 style={{color:'#000'}}>Medical History</h2>
                <br/>
                    <form >
     
                    <div className="row">
                    <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                            <Label >Visit Date <span style={{ color:"red"}}> *</span></Label>
                            <InputGroup> 
                                <Input 
                                    type="date"
                                    min={enrollDate}
                                    max= {moment(new Date()).format("YYYY-MM-DD") }
                                    name="visitDate"
                                    id="visitDate"
                                    value={visit.visitDate}
                                    onChange={handleInputChangeobjValues} 
                                />
                            </InputGroup>                                        
                            </FormGroup>
                            {errors.visitDate !=="" ? (
                                <span className={classes.error}>{errors.visitDate}</span>
                            ) : "" }
                    </div>
                    <div className="form-group mb-3 col-md-8"></div>   
                    </div>
                    {props.patientAge<=14 && (
                    <div className="row">
                    <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                            <Label >Is mother of the child alive ?</Label>
                            <Input 
                                    type="select"
                                    name="childMotherAlive"
                                    id="childMotherAlive"
                                    onChange={handleMedicalHistory}  
                                    value={objValues.childMotherAlive} 
                                >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                </Input>
                               
                                                                  
                            </FormGroup>
                            
                    </div>
                    {objValues.childMotherAlive==='Yes' && (
                        <>
                    <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Mother Name</Label>
                            <Input 
                                    type="text"
                                    name="motherName"
                                    id="motherName"
                                    value={visit.motherName}
                                    onChange={handleMedicalHistory} 
                                />
                            </FormGroup>
                           
                     </div>
                     <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                        <Label >Mother Address</Label>
                        <Input 
                                type="text"
                                name="motherAddress"
                                id="motherAddress"
                                value={objValues.motherAddress}
                                onChange={handleMedicalHistory} 
                            />
                        </FormGroup>
                        
                        </div>
                    </> 
                     )}
                     <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                            <Label >Is father of the child alive ?</Label>
                            <Input 
                                    type="select"
                                    name="childFatherAlive"
                                    id="childFatherAlive"
                                    onChange={handleMedicalHistory}  
                                    value={objValues.childFatherAlive} 
                                >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                </Input> 
                                                                  
                            </FormGroup>
                            
                    </div> 
                    {objValues.childFatherAlive==='Yes' && (
                        <>
                    <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Father Name</Label>
                            <Input 
                                    type="text"
                                    name="fatherName"
                                    id="fatherName"
                                    value={objValues.fatherName}
                                    onChange={handleMedicalHistory} 
                                />
                            </FormGroup>
                           
                     </div>
                     <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Father Address</Label>
                            <Input 
                                    type="text"
                                    name="fatherAddress"
                                    id="fatherAddress"
                                    value={objValues.fatherAddress}
                                    onChange={handleMedicalHistory} 
                                />
                            </FormGroup>
                            
                    </div>
                        </>
                     )}

                    <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                            <Label >Child's parents/caregivers are</Label>
                            <Input 
                                    type="select"
                                    name="parentChildMarriageStatus"
                                    id="parentChildMarriageStatus"
                                    onChange={handleMedicalHistory}  
                                    value={objValues.parentChildMarriageStatus} 
                                >
                                <option value="">Select</option>
                                <option value="Married">Married</option>
                                <option value="Co-habiting">Co-habiting</option>
                                <option value="Single">Single</option>
                                </Input> 
                                                                  
                            </FormGroup>
                            
                    </div>
                    <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >How many sibiling does the child have ?</Label>
                            <Input 
                                    type="number"
                                    name="howManySibiling"
                                    id="howManySibiling"
                                    value={objValues.howManySibiling}
                                    onChange={handleMedicalHistory} 
                                />
                            </FormGroup>
                            
                    </div>
                    <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                            <Label >Immunisation: Complete for Age</Label>
                            <Input 
                                    type="select"
                                    name="immunisationComplete"
                                    id="immunisationComplete"
                                    onChange={handleMedicalHistory}  
                                    value={objValues.immunisationComplete} 
                                >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                </Input> 
                                                                  
                            </FormGroup>
                            
                    </div>
                    <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                            <Label >Mode of infant({"<=6"} months) feeding </Label>
                            <Input 
                                    type="select"
                                    name="modeOfInfantFeeding"
                                    id="modeOfInfantFeeding"
                                    onChange={handleMedicalHistory}  
                                    value={objValues.modeOfInfantFeeding} 
                                >
                                <option value="">Select</option>
                                <option value="EBF">EBF</option>
                                <option value="EBMS">EBMS</option>
                                <option value="Mixed">Mixed</option>
                                </Input> 
                                                                  
                            </FormGroup>
                            
                    </div>
                    </div>
                    )}
                    <h4>Medical History</h4>
                    {/* Medical History form inputs */}
                    <div className="row">
                        <div className="form-group mb-3 col-md-2"> 
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Fever/Chills
                            </label>                                      
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                                
                                name="fever"
                                id="fever"
                                value={objValues.fever} 
                                onChange={handleMedicalHistory}
                                />
                                
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                            <Label >Duration (Days)</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="fever_duration"
                                    id="fever_duration"
                                    onChange={handleMedicalHistory}
                                    value={objValues.fever_duration} 
                                />

                            </InputGroup>
                        
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-2"> 
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Nausea/Vomitiing
                            </label>                                      
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                                
                                name="Nausea"
                                id="Nausea"
                                value={objValues.Nausea} 
                                onChange={handleMedicalHistory}
                                />
                                
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                            <Label >Duration (Days)</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="Nausea_fever"
                                    id="Nausea_fever"
                                    onChange={handleMedicalHistory}
                                    value={objValues.Nausea_fever} 
                                />

                            </InputGroup>
                        
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-2"> 
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Night Sweats
                            </label>                                      
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                                
                                name="night_sweats"
                                id="night_sweats"
                                value={objValues.night_sweats}
                                onChange={handleMedicalHistory}
                                />
                                
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                            <Label >Duration (Days)</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="night_duration"
                                    id="night_duration"
                                    value={objValues.night_duration}
                                    onChange={handleMedicalHistory} 
                                />

                            </InputGroup>
                        
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-2"> 
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Recent Weight Loss
                            </label>                                      
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                                
                                name="recent"
                                id="recent"
                                onChange={handleMedicalHistory}
                                value={objValues.recent}
                                />
                                
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                            
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="recent_duration"
                                    id="recent_duration"
                                    onChange={handleMedicalHistory}
                                    value={objValues.recent_duration}
                                />

                            </InputGroup>
                        
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-2"> 
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Cough
                            </label>                                      
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                                
                                name="cough"
                                id="cough"
                                onChange={handleMedicalHistory}
                                value={objValues.cough}
                                />
                                
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                           
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="cough_duration"
                                    id="cough_duration"
                                    onChange={handleMedicalHistory}
                                    value={objValues.cough_duration}
                                   
                                />

                            </InputGroup>
                        
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-2"> 
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Headache
                            </label>                                      
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                                
                                name="headache"
                                id="headache"
                                onChange={handleMedicalHistory}
                                value={objValues.headache}
                                />
                                
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                           
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="headache_duration"
                                    id="headache_duration"
                                    onChange={handleMedicalHistory} 
                                    value={objValues.headache_duration}
                                />

                            </InputGroup>
                        
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-2"> 
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                New Visual imparity
                            </label>                                      
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                                
                                name="new_visual"
                                id="new_visual"
                                onChange={handleMedicalHistory} 
                                value={objValues.new_visual}
                                />
                                
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                           
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="new_visual_duration"
                                    id="new_visual_duration"
                                    onChange={handleMedicalHistory}  
                                    value={objValues.new_visual_duration}
                                />

                            </InputGroup>
                        
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-2"> 
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Pain & Difficulty when swallowing 
                            </label>                                      
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                                
                                name="pain"
                                id="pain"
                                onChange={handleMedicalHistory} 
                                value={objValues.pain}
                                />
                                
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                            
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="pain_duration"
                                    id="pain_duration"
                                    onChange={handleMedicalHistory} 
                                    value={objValues.pain_duration} 
                                />

                            </InputGroup>
                        
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-2"> 
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Rash
                            </label>                                      
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                                
                                name="rash"
                                id="rash"
                                onChange={handleMedicalHistory} 
                                value={objValues.rash} 
                                />
                                
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                            
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="rash_duration"
                                    id="rash_duration"
                                    onChange={handleMedicalHistory} 
                                    value={objValues.rash_duration}  
                                />

                            </InputGroup>
                        
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-2"> 
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Itching
                            </label>                                      
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                                
                                name="itching"
                                id="itching"
                                onChange={handleMedicalHistory} 
                                value={objValues.itching}  
                                />
                                
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                           
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="itching_duration"
                                    id="itching_duration"
                                    onChange={handleMedicalHistory}  
                                    value={objValues.itching_duration}
                                />

                            </InputGroup>
                        
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-2"> 
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Chronic Diarrhea
                            </label>                                      
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                                
                                name="chronic"
                                id="chronic"
                                onChange={handleMedicalHistory} 
                                value={objValues.chronic}
                                />
                                
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                           
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="chronic_duration"
                                    id="chronic_duration"
                                    onChange={handleMedicalHistory} 
                                    value={objValues.chronic_duration} 
                                />

                            </InputGroup>
                        
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-2"> 
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Genital itching
                            </label>                                      
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                                
                                name="genital"
                                id="genital"
                                onChange={handleMedicalHistory} 
                                value={objValues.genital} 
                                />
                                
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                           
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="genital_duration"
                                    id="genital_duration"
                                    onChange={handleMedicalHistory} 
                                    value={objValues.genital_duration} 
                                />

                            </InputGroup>
                        
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-2"> 
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Genital Sores
                            </label>                                      
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                                
                                name="genital_score"
                                id="genital_score"
                                onChange={handleMedicalHistory} 
                                value={objValues.genital_score} 
                                />
                                
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                           
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="genital_score_duration"
                                    id="genital_score_duration"
                                    onChange={handleMedicalHistory} 
                                    value={objValues.genital_score_duration}  
                                />

                            </InputGroup>
                        
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-2"> 
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Shortness of breath
                            </label>                                      
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                                
                                name="shortness_of_breath"
                                id="shortness_of_breath"
                                onChange={handleMedicalHistory} 
                                value={objValues.shortness_of_breath}  
                                />
                                
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                            
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="shortness_of_breath_duration"
                                    id="shortness_of_breath_duration"
                                    onChange={handleMedicalHistory} 
                                    value={objValues.shortness_of_breath_duration}  
                                />

                            </InputGroup>
                        
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-2"> 
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Numbness/tingling
                            </label>                                      
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                                
                                name="numbness"
                                id="numbness"
                                onChange={handleMedicalHistory} 
                                value={objValues.numbness} 
                                />
                                
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                          
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="numbness_duration"
                                    id="numbness_duration"
                                    onChange={handleMedicalHistory}
                                    value={objValues.numbness_duration}  
                                />

                            </InputGroup>
                        
                            </FormGroup>
                        </div>
                    </div>
                    {/* end of medical form inputs */}
                    <br/>
                     {/* TB Screening section */}
                     <div className="row">
                     <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Patient Screen for TB <span style={{ color:"red"}}> *</span></Label>
                            <InputGroup> 
                                <Input 
                                    type="select"
                                    name="screen_for_tb"
                                    id="screen_for_tb"
                                    onChange={handleMedicalHistory}  
                                    value={objValues.screen_for_tb} 
                                >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                </Input>
                               
                            </InputGroup>
                            </FormGroup>
                            {errors.screen_for_tb !=="" ? (
                                <span className={classes.error}>{errors.screen_for_tb}</span>
                            ) : "" }
                     </div>
                     </div>
                    {/* end of TB Screening section */}
                    <div className="row">
                    {/* Past medical history */}
                    <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Past Medical History </Label>
                            <InputGroup> 
                                <Input 
                                    type="textarea"
                                    name="past_medical_history"
                                    id="past_medical_history"
                                    onChange={handleMedicalHistory} 
                                    value={objValues.past_medical_history}   
                                />
                                
                            </InputGroup>
                            </FormGroup>
                          
                    </div>
                    {/* end of Past medical history  */}
                    {/* Past Family medical history */}
                    <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Relevant Family History</Label>
                            <InputGroup> 
                                <Input 
                                    type="textarea"
                                    name="relevant_family_history"
                                    id="relevant_family_history"
                                    onChange={handleMedicalHistory}
                                    value={objValues.relevant_family_history}    
                                />
                                
                            </InputGroup>
                            </FormGroup>
                          
                    </div>
                    {/* end of FamilyPast medical history  */}
                    {/* hospitalization */}
                    <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Hospitalization</Label>
                            <InputGroup> 
                                <Input 
                                    type="textarea"
                                    name="hospitalization"
                                    id="hospitalization"
                                    onChange={handleMedicalHistory} 
                                    value={objValues.hospitalization}   
                                />

                            </InputGroup>
                        
                            </FormGroup>
                    </div>
                    {/* end of hosiptalization */}
                    {/* Drug Allergies */}
                    <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Drug Allergies <span style={{ color:"red"}}> *</span></Label>
                            <InputGroup> 
                            <Input
                                type="select"
                                name="drug_allergies"
                                id="drug_allergies"
                                value={objValues.drug_allergies}
                                onChange={handleMedicalHistory}
                                style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                required
                                >
                                <option value=""> Select</option>
                                    {allergies.map((value) => (
                                        <option key={value.id} value={value.display}>
                                            {value.display}
                                        </option>
                                    ))}
                            </Input>   
                                 
                            </InputGroup>
                        
                            </FormGroup>
                            {errors.drug_allergies !=="" ? (
                                <span className={classes.error}>{errors.drug_allergies}</span>
                            ) : "" }
                    </div>
                    </div>
                    {/* end of Drug Allergies  */}
                    <div className="row">
                    {(props.patientObj.sex==='Female' || props.patientObj.sex==='FEMALE' || props.patientObj.sex==='female')  && (<>
                        {props.patientAge>14 && (
                        <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                <Label >Currently Pregnant</Label>
                                <InputGroup> 
                                    <Input 
                                        type="select"
                                        name="current_pregnant"
                                        id="current_pregnant"
                                        onChange={handleMedicalHistory} 
                                        value={objValues.current_pregnant} 
                                    >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                    <option value="Uncertain">Uncertain</option>
                                    </Input>

                                </InputGroup>
                            
                                </FormGroup>
                        </div>
                        )}
                        {objValues.current_pregnant==='Yes' && (<>
                        <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                <Label >Last menstrual period</Label>
                                <InputGroup> 
                                    <Input 
                                        type="date"
                                        name="last_menstrual_period"
                                        id="last_menstrual_period"
                                        onChange={handleMedicalHistory}
                                        value={objValues.last_menstrual_period}   
                                    />

                                </InputGroup>
                            
                                </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                <Label >Gestational Age (weeks)</Label>
                                <InputGroup> 
                                    <Input 
                                        type="text"
                                        name="gestational_age"
                                        id="gestational_age"
                                        onChange={handleMedicalHistory} 
                                        value={objValues.gestational_age}  
                                    />

                                </InputGroup>
                            
                                </FormGroup>
                        </div>
                        </>
                        )}
                        {objValues.current_pregnant!=='Yes' && objValues.current_pregnant!=='' && (
                        <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                <Label >Current BreastFeeding</Label>
                                <InputGroup> 
                                    <Input 
                                        type="select"
                                        name="current_breastfeeding"
                                        id="current_breastfeeding"
                                        onChange={handleMedicalHistory} 
                                        value={objValues.current_breastfeeding}  
                                    >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                    <option value="Uncertain">Uncertain</option>
                                    </Input>

                                </InputGroup>
                            
                                </FormGroup>
                        </div>
                        )}
                    </>)}
                    </div>
                    <div className="row">
                     <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Previous ARV exposure</Label>
                            <InputGroup> 
                                <Input 
                                    type="select"
                                    name="previous_arv_exposure"
                                    id="previous_arv_exposure"
                                    onChange={handleMedicalHistory} 
                                    value={objValues.previous_arv_exposure}  
                                >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                <option value="Uncertain">Uncertain</option>
                                </Input>

                            </InputGroup>
                        
                            </FormGroup>
                     </div>
                     <div className="form-group mb-3 col-md-6"></div>
                     </div>
                     <div className="row">
                     <div className="form-group mb-3 col-md-6">
                                    
                        <div className="form-check custom-checkbox ml-1 ">
                        
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="early_arv_but_not_transfer_in"
                            id="early_arv_but_not_transfer_in"
                            onChange={handleMedicalHistory} 
                            value={objValues.early_arv_but_not_transfer_in}  
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Early ARV but not transfer in
                        </label>
                        </div>
                    </div>
                    {props.patientObj.sex==='Female' && (
                    <div className="form-group mb-3 col-md-4">
                                    
                        <div className="form-check custom-checkbox ml-1 ">
                        
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="pmtct_only"
                            id="pmtct_only"
                            onChange={handleMedicalHistory} 
                            value={objValues.pmtct_only} 
                            />
                           <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            PMTCT only
                        </label> 
                        </div>
                    </div>
                    )}
                     <div className="row">
                    <div className="form-group mb-3 col-md-4">
                                    
                        <div className="form-check custom-checkbox ml-1 ">
                       
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="as_never_receive_arvs"
                            id="as_never_receive_arvs"
                            onChange={handleMedicalHistory} 
                            value={objValues.as_never_receive_arvs} 
                            />
                             <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Has never received ARVs
                            </label>
                        </div>
                    </div>
                    </div>
                    {objValues.previous_arv_exposure==='Yes' &&  objValues.previous_arv_exposure!=='' && (
                    <>
                         <div className="row">
                        <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                <Label >Name of the Facility</Label>
                                <InputGroup> 
                                    <Input 
                                        type="text"
                                        name="name_of_the_facility"
                                        id="name_of_the_facility"
                                        onChange={handleMedicalHistory} 
                                        value={objValues.name_of_the_facility}
                                    />

                                </InputGroup>
                            
                                </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                <Label >Duration of care from</Label>
                                <InputGroup> 
                                    <Input 
                                        type="Date"
                                        name="duration_of_care_from"
                                        id="duration_of_care_from"
                                        onChange={handleMedicalHistory} 
                                        value={objValues.duration_of_care_from}
                                    />

                                </InputGroup>
                            
                                </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                <Label >To</Label>
                                <InputGroup> 
                                    <Input 
                                        type="date"
                                        name="duration_of_care_to"
                                        id="duration_of_care_to"
                                        onChange={handleMedicalHistory}
                                        value={objValues.duration_of_care_to} 
                                    />

                                </InputGroup>
                            
                                </FormGroup>
                        </div>
                        </div>
                    </>
                    )}
                    </div>
                    <h3>Current Medications(Caregiver should be prob ) if yes </h3>
                    <hr/>
                    <div className="row">
                    <div className="form-group mb-3 col-md-2">
                    <div className="form-check custom-checkbox ml-1 ">
                        
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="CurrentMedicationNone"
                            id="CurrentMedicationNone"
                            value={objValues.CurrentMedicationNone} 
                            onChange={handleMedicalHistory} 
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            None
                        </label>
                        </div>
                    </div>
                    {!hideOtherCurrentMedication && ( 
                    <>
                    <div className="form-group mb-3 col-md-2">
                    <div className="form-check custom-checkbox ml-1 ">
                       
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="currentART"
                            id="currentART"
                            onChange={handleMedicalHistory} 
                            value={objValues.currentART} 
                            />
                             <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            ART
                        </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">
                    <div className="form-check custom-checkbox ml-1 ">
                        
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="currentCTX"
                            id="currentCTX"
                            onChange={handleMedicalHistory} 
                            value={objValues.currentCTX} 
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            CTX
                        </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">
                    <div className="form-check custom-checkbox ml-1 ">
                        
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="currentAntiTbDdrugs"
                            id="currentAntiTbDdrugs"
                            onChange={handleMedicalHistory} 
                            value={objValues.currentAntiTbDdrugs} 
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Anti-TB drugs
                        </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                            <Label >Others</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="currentOthers"
                                    id="currentOthers"
                                    onChange={handleMedicalHistory} 
                                    value={objValues.currentOthers}  
                                />

                            </InputGroup>
                        
                            </FormGroup>
                    </div>
                    </>
                    )}
                    </div>
                   <h3>Patient has disclosed status to:</h3>
                   <hr/>
                   <div className="row">
                   <div className="form-group mb-3 col-md-2">
                    <div className="form-check custom-checkbox ml-1 ">
                       
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="disclosureNoOne"
                            id="disclosureNoOne"
                            onChange={handleMedicalHistory}
                            value={objValues.disclosureNoOne}
                            />
                             <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            No one
                            </label>
                        </div>
                    </div>
                    {!hideOtherPatientDisclosure && ( 
                    <>
                    <div className="form-group mb-3 col-md-2">
                    <div className="form-check custom-checkbox ml-1 ">
                        
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="familyMember"
                            id="familyMember"
                            onChange={handleMedicalHistory}
                            value={objValues.familyMember}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Family member
                        </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">
                    <div className="form-check custom-checkbox ml-1 ">
                        
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="friend"
                            id="friend"
                            onChange={handleMedicalHistory}
                            value={objValues.friend}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Friend
                        </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">
                    <div className="form-check custom-checkbox ml-1 ">
                        
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="spouse"
                            id="spouse"
                            onChange={handleMedicalHistory}
                            value={objValues.spouse}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Spouse
                        </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">
                    <div className="form-check custom-checkbox ml-1 ">
                        
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="spiritualLeader"
                            id="spiritualLeader"
                            onChange={handleMedicalHistory}
                            value={objValues.spiritualLeader}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Spiritual leader
                        </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-3">
                            <FormGroup>
                            <Label >Others</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="disclosureOthers"
                                    id="disclosureOthers"
                                    onChange={handleMedicalHistory}
                                    value={objValues.disclosureOthers} 
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                    </>
                    )}
                    </div> 
                    <hr/>
                    <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >HIV Status can be discussed with (Record reported person, if any):</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="HivStatusCanBeDiscussed"
                                    id="HivStatusCanBeDiscussed"
                                    onChange={handleMedicalHistory}
                                    value={objValues.HivStatusCanBeDiscussed}
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6"></div>
                    <br/>
                    <Button content='Next' type="submit" icon='right arrow' labelPosition='right' style={{backgroundColor:"#014d88", color:'#fff'}} onClick={handleSubmit}/>
                    </form>
                    
                </CardBody>
            </Card> 
                                     
        </>
    );
};

export default MedicalHistory