
import React, { useEffect, useState} from "react";
import axios from "axios";
import {FormGroup, Label , CardBody, Spinner,Input,Form, InputGroup,
    InputGroupText,

} from "reactstrap";
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
    }
}));


const BasicInfo = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const [errors, setErrors] = useState({});
    useEffect(() => { 
        
        if(props.observation.data ){
            setPlan(props.observation.data.plan) 
            setPlanArt(props.observation.data.planArt)            
            setEnrollIn(props.observation.data.enroll)  
        }
    }, [props.observation.data]);
    const [planArt, setPlanArt] = useState({previousArvExposure:"", reasonForChange:"", reasonForChangeOther:""});
    const [enroll, setEnrollIn] = useState({enrollIn:""});
    const [plan, setPlan] = useState({  lab_evaluation:"", 
                                        cd4Count:"",
                                        cd4SemiQuantitative :"",
                                        cxr:"", 
                                        lf_lam:"", 
                                        oi_prophylaxis:"", 
                                        adherence:"", 
                                        cervical:"", 
                                        cryptococcal:"",
                                        cd4FlowCytometry :"",
                                        previous_arv_exposure:"", 
                                        tb_investigation:"", 
                                        expert:"", 
                                        oi_therapy:"", 
                                        admission:"",
                                        symptomatic :"",
                                        other_referrals:"",
    });
    let temp = { ...errors }   
    const handlePlanArt =e =>{
        setPlanArt({...planArt, [e.target.name]: e.target.value})
        
    }
    const handlePlan =e =>{
        if(e.target.name==='cd4FlowCytometry' && plan.cd4SemiQuantitative!==""){ 
            plan.cd4SemiQuantitative=""
        }
        if(e.target.name==='cd4SemiQuantitative' && plan.cd4FlowCytometry!==""){          
            plan.cd4FlowCytometry=""
        }
        setPlan({...plan, [e.target.name]: e.target.value})
        
    }
    const handleEnroll =e =>{
        setEnrollIn({...enroll, [e.target.name]: e.target.value})
        
    }
    const handleItemClick =(page, completedMenu)=>{
        props.handleItemClick(page)
        if(props.completed.includes(completedMenu)) {

        }else{
            props.setCompleted([...props.completed, completedMenu])
        }
    }  
    /**** Submit Button Processing  */
    const handleSubmit = (e) => { 
        e.preventDefault(); 
        if(plan.cd4FlowCytometry!=="" && plan.cd4Count==='Flow Cyteometry'){//cleaning input field value against the correct selection
            plan.cd4SemiQuantitative=""
        }else if(plan.cd4SemiQuantitative!=="" && plan.cd4Count==='Semi-Quantitative'){
            plan.cd4FlowCytometry=""
        } 
        props.observation.data.planArt = planArt
        props.observation.data.plan = plan
        props.observation.data.enroll=enroll  
        //toast.success("Record save successful");
        handleItemClick('regimen', 'plan' )                  
    }
        
return (
        <>  
        
            <Card className={classes.root}>
                <CardBody>   
                <h2 style={{color:'#000'}}>Enroll In & Plan</h2>
                <br/>
                    <form >
                    {/* Medical History form inputs */}
                    <div className="row">
                    <h3>Enroll in</h3>
                    <div className="form-group mb-3 col-md-5">                                    
                            <Input 
                                type="select"
                                name="enrollIn"
                                id="enrollIn"
                                value={enroll.enrollIn}
                                onChange={handleEnroll}  
                            >
                            <option value="">Select</option>
                            <option value="General medical follow-up">General medical follow-up</option>
                            <option value="ARV therapy">ARV therapy</option>
                            <option value="AHD management">AHD management</option>
                            <option value="Pending lab results">Pending lab results</option>
                            </Input>
                    </div>
                    <div className="form-group mb-3 col-md-7">  </div>
                    <hr/>
                    <h3>Plan for Antiretroviral Therapy (ART)</h3>
                    <div className="form-group mb-3 col-md-6">                                    
                        <FormGroup>
                            <Label>Ongoing Monitoring </Label>
                            <Input 
                                    type="select"
                                    name="previousArvExposure"
                                    id="previousArvExposure"
                                    value={planArt.previousArvExposure}
                                    onChange={handlePlanArt}  
                                >
                                <option value="">Select</option>
                                <option value="Restart treatment">Restart treatment</option>
                                <option value="Start new treatment">Start new treatment</option>
                                <option value="Stop treatment">Stop treatment </option>
                                <option value="Change treatment">Change treatment </option>
                                <option value="ARV TX postponed for clinical reason">ARV TX postponed for clinical reason</option>
                                </Input>
                        </FormGroup>
                    </div>
                    {props.patientAge<=14 && (
                    <>
                        {planArt.previousArvExposure==='Stop treatment' || planArt.previousArvExposure ==='Change treatment' && (
                        <div className="form-group mb-3 col-md-6">                                    
                            <FormGroup>
                                <Label>Code for reason for change/stop ART</Label>
                                <Input 
                                        type="select"
                                        name="reasonForChange"
                                        id="reasonForChange"
                                        value={planArt.reasonForChange}
                                        onChange={handlePlanArt}  
                                    >
                                    <option value="">Select</option>
                                    <option value="Can't adhere to schedule"> Can't adhere to schedule</option>
                                    <option value="Patient refusal/preference">Patient refusal/preference</option>
                                    <option value="Doctor's Instruction">Doctor's Instruction </option>
                                    <option value="Ran out of medicine">Ran out of medicine</option>
                                    <option value="Drugs not available">Drugs not available</option>
                                    <option value="Toxicity">Toxicity</option>
                                    <option value="Virologic failure"> Virologic failure</option>
                                    <option value="Clinical failure">Clinical failure </option>
                                    <option value="Drug interaction">Drug interaction</option>
                                    <option value="Immunologic failure">Immunologic failure</option>
                                    <option value="Other">Other</option>
                                    </Input>
                            </FormGroup>
                        </div>
                        )}
                        {planArt.reasonForChange ==='other' && (
                        <div className="form-group mb-3 col-md-6">                                    
                            <FormGroup>
                                <Label>Code for reason for change/stop ART</Label>
                                <Input 
                                        type="text"
                                        name="reasonForChangeOther"
                                        id="reasonForChangeOther"
                                        value={planArt.reasonForChangeOther}
                                        onChange={handlePlanArt}  
                                />

                            </FormGroup>
                        </div>
                        )}
                    </>
                    )}
                    <div className="form-group mb-3 col-md-6"> </div>
                    <h3> Plan (specify orders on requisition)</h3>
                    <h3>Lab evaluation :</h3>
                    {/* <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Lab evaluation</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="lab_evaluation"
                                    id="lab_evaluation"
                                    value={plan.lab_evaluation}
                                    onChange={handlePlan} 
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div> */}
                   <div className="form-group  col-md-5">
                                <FormGroup>
                                    <Label>CD4 Count </Label>
                                    <select
                                        className="form-control"
                                        name="cd4Type"
                                        id="cd4Type"
                                        value={plan.cd4Type}
                                        onChange={handlePlan}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="Semi-Quantitative">Semi-Quantitative</option>
                                        <option value="Flow Cyteometry">Flow Cytometry</option>
                                        
                                    </select>
                                    
                                </FormGroup>
                    </div> 
                    {plan.cd4Type ==='Semi-Quantitative' && (
                    <div className="form-group  col-md-5">
                        <FormGroup>
                            <Label>CD4 Count Value</Label>
                            <select
                                className="form-control"
                                name="cd4Count"
                                id="cd4Count"
                                value={plan.cd4Count}
                                onChange={handlePlan}
                                style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                            >
                                <option value={""}></option>
                                <option value="<200">{"<200"}</option>
                                <option value=">=200">{">=200"}</option>
                                
                            </select>
                            
                        </FormGroup>
                    </div>
                    )}
                    {plan.cd4Type ==='Flow Cyteometry' && (
                    <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                        <Label for="">CD4 Count Value</Label>
                        <Input
                            type="number"
                            min={1}
                            name="cd4Count"
                            id="cd4Count"
                            value={plan.cd4Count}
                            onChange={handlePlan}
                            style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                            
                        />
                            
                        </FormGroup>
                    </div>
                    )}
                    {/* <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >CD4 count evaluation</Label>                       
                            <InputGroup> 
                                <Input 
                                    type="select"
                                    name="previous_arv_exposure"
                                    id="previous_arv_exposure"
                                    value={plan.previous_arv_exposure}
                                    onChange={handlePlan}  
                                >
                                <option value="">Select</option>
                                <option value="CD4 LFA">CD4 LFA</option>
                                <option value="less than 200">{"<"}200</option>
                                <option value="greater than and equal to 200">  ≥200</option>
                               
                                </Input>

                            </InputGroup>                                      
                            </FormGroup>
                    </div> */}
                    <hr/>
                    <div className="form-group mb-3 col-md-4">                                                          
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            <h3>TB Investigations :</h3>
                            </label>                       
                    </div>
                    <div className="form-group mb-3 col-md-3">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="expert"
                            id="expert"
                            value={plan.expert}
                            onChange={handlePlan} 
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Xpert MTB/RIF
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="cxr"
                            id="cxr"
                            value={plan.cxr}
                            onChange={handlePlan} 
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            CXR
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="lf_lam"
                            id="lf_lam"
                            value={plan.lf_lam}
                            onChange={handlePlan} 
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            LF_LAM
                            </label>
                        </div>
                    </div>
                   
                    <hr/>
                    <div className="form-group mb-3 col-md-6">
                            
                            <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="oi_prophylaxis"
                            id="oi_prophylaxis"
                            value={plan.oi_prophylaxis}
                            onChange={handlePlan} 
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            OI Prophylaxis
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                           
                            <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="oi_therapy"
                            id="oi_therapy"
                            value={plan.oi_therapy}
                            onChange={handlePlan} 
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            OI therapy
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Adherence counseling</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="adherence"
                                    id="adherence"
                                    value={plan.adherence}
                                    onChange={handlePlan} 
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Admission</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="admission"
                                    id="admission"
                                    value={plan.admission}
                                    onChange={handlePlan} 
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Cervical cancer screening</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="cervical"
                                    id="cervical" 
                                    value={plan.cervical}
                                    onChange={handlePlan} 
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Symptomatic treatment/pain control (specify)</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="symptomatic"
                                    id="symptomatic" 
                                    value={plan.symptomatic}
                                    onChange={handlePlan} 
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Cryptococcal antigen test</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="cryptococcal"
                                    id="cryptococcal"
                                    value={plan.cryptococcal}
                                    onChange={handlePlan} 
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Other referrals (specify)</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="other_referrals"
                                    id="other_referrals" 
                                    value={plan.other_referrals}
                                    onChange={handlePlan} 
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                    </div>
                    <br/>
                    <Button content='Back' icon='left arrow' labelPosition='left' style={{backgroundColor:"#992E62", color:'#fff'}} onClick={()=>handleItemClick('who', 'who')}/>
                    <Button content='Next' type="submit" icon='right arrow' labelPosition='right' style={{backgroundColor:"#014d88", color:'#fff'}} onClick={handleSubmit}/>
                    
                    </form>
                    
                </CardBody>
            </Card> 
                                     
        </>
    );
};

export default BasicInfo