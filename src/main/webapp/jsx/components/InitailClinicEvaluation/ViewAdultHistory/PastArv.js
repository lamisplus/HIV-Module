
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
    // console.log(props.observation)
    const classes = useStyles();
    const history = useHistory();
    const [errors, setErrors] = useState({});
    let temp = { ...errors }
    useEffect(() => { 
        //console.log(props.observation.data.pastArvMedical)
        if(props.observation.data ){
            setPastArvMedicalMedical(props.observation.data.pastArvMedical)           
        }
        if(props.observation.data.pastArvMedical.none==='on'){
            setHideOtherPastArv(true)
        }
    }, [props.observation.data]);   
    const [hideOtherPastArv, setHideOtherPastArv]=useState(false)
    const [pastArvMedical, setPastArvMedicalMedical] = useState({
                                                                none:"",
                                                                vomit: "",
                                                                diarrhea: "",
                                                                headache: "",
                                                                pain_in_abdomen: "",
                                                                jaundice: "",
                                                                insomnia: "",
                                                                dizzy: "",
                                                                tingling: "",
                                                                rash: "",
                                                                pancreatities: "",
                                                                steven_johnson_syndrome: "",
                                                                itching: "",
                                                                anemia: "",
                                                                weekness: "",
                                                                loss: "",
                                                                hyperglycemia: "",
                                                                kidney_problem: "",
                                                                liver_problem: "",
                                                                others: "",
                                                                if_yes_past_current_arv: ""
                                                            });
    const handlePastArv =e =>{
        if(e.target.name==='none'){
            if(e.target.checked){
                setHideOtherPastArv(true)
                }else{
                    setHideOtherPastArv(false)
                }
        }
        setPastArvMedicalMedical({...pastArvMedical, [e.target.name]: e.target.value})
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
        props.observation.data.pastArvMedical=pastArvMedical   
        //toast.success("Medical history save successful");
        handleItemClick('physical-examination', 'past-arv' )                  
    }
        
    return (
        <>  
        
            <Card className={classes.root}>
                <CardBody>   
                <h2 style={{color:'#000'}}>Past or current ARV or other medication's side effect</h2>
                <br/>
                    <form >
                    {/* Medical History form inputs */}
                    <div className="row">
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="none"
                            checked={props.observation.data.pastArvMedical.none==='on' ? true : false}
                            id="none"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            None
                            </label>
                        </div>
                    </div>
                    {!hideOtherPastArv && (
                        <>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="vomit"
                            id="vomit"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Signif.nausea/vomit
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="diarrhea"
                            id="diarrhea"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Diarrhea
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="headache"
                            id="headache"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Headache
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="pain_in_abdomen"
                            id="pain_in_abdomen"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Pain in abdomen or muscle
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="jaundice"
                            id="jaundice"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Jaundice
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="insomnia"
                            id="insomnia"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Insomnia/bad dreams
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="dizzy"
                            id="dizzy"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Confussion/Dizzy
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="tingling"
                            id="tingling"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Tingling of extremities
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="rash"
                            id="rash"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Rash
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="pancreatities"
                            id="pancreatities"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Pancreatities
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="steven_johnson_syndrome"
                            id="steven_johnson_syndrome"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Steven Johnson Syndrome
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="itching"
                            id="itching"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Itching
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="anemia"
                            id="anemia"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Anemia
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="weekness"
                            id="weekness"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Weekness/Fatigue
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="loss"
                            id="loss"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Fat accumulation or loss
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="hyperglycemia"
                            id="hyperglycemia"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Hyperglycemia
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="kidney_problem"
                            id="kidney_problem"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Kidney Problem
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="liver_problem"
                            id="liver_problem"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Liver Problem
                            </label>
                        </div>
                    </div>

                    <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Others(Specify)</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="others"
                                    id="others"
                                    onChange={handlePastArv} 
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-12">
                            <FormGroup>
                            <Label >If yes to past or current ARV or other medication's side effect, specify medication(s) </Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="if_yes_past_current_arv"
                                    id="if_yes_past_current_arv"
                                    onChange={handlePastArv}
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                    </>
                    )}
                    </div>
                    <br/>
                    <Button content='Back' icon='left arrow' labelPosition='left' style={{backgroundColor:"#992E62", color:'#fff'}} onClick={()=>handleItemClick('medical-history', 'medical-history')}/>
                    <Button content='Next' type="submit" icon='right arrow' labelPosition='right' style={{backgroundColor:"#014d88", color:'#fff'}} onClick={handleSubmit}/>
                    </form>
                    
                </CardBody>
            </Card> 
                                     
        </>
    );
};

export default BasicInfo