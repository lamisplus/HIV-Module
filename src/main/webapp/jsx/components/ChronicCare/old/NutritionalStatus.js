
import React, { useEffect, useState} from "react";
import axios from "axios";
import {FormGroup, Label , CardBody, Spinner,Input,Form, InputGroup,
    InputGroupText,

} from "reactstrap";
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
import {token, url as baseUrl } from "../../../api";
import 'react-phone-input-2/lib/style.css'
import 'semantic-ui-css/semantic.min.css';
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import 'react-phone-input-2/lib/style.css'
import { Button} from 'semantic-ui-react'
import {  Message} from 'semantic-ui-react'
import DualListBox from "react-dual-listbox";
import 'react-dual-listbox/lib/react-dual-listbox.css';

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
        maxWidth: 752,
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
    const [selectedOptions1,setSelectedOptions1] = useState([]);
    const [selectedOptions2,setSelectedOptions2] = useState([]);
    let temp = { ...errors }   
    useEffect(() => { 
        if(props.observation.data ){
            setVitalSignDto(props.observation.data.physicalExamination)           
        }
    }, [props.observation.data]); 
    const [vital, setVitalSignDto]= useState({
        bodyWeight: "",
        diastolic:"",
        encounterDate: "",
        facilityId: 1,
        height: "",
        personId: props.patientObj.id,
        serviceTypeId: 1,
        systolic:"",
        pulse:"",
        temperature:"",
        respiratoryRate:"" 
    })
    //Vital signs clinical decision support 
    const [vitalClinicalSupport, setVitalClinicalSupport] = useState({
                                bodyWeight: "",
                                diastolic: "",
                                height: "",
                                systolic: "",
                                pulse:"",
                                temperature:"",
                                respiratoryRate:""
                            })
    const handleInputChangeVitalSignDto = e => {
        setVitalSignDto({ ...vital, [e.target.name]: e.target.value });
    }
    //to check the input value for clinical decision 
    const handleInputValueCheckHeight =(e)=>{
        if(e.target.name==="height" && (e.target.value < 48.26 || e.target.value>216.408)){
        const message ="Height cannot be greater than 216.408 and less than 48.26"
        setVitalClinicalSupport({...vitalClinicalSupport, height:message})
        }else{
        setVitalClinicalSupport({...vitalClinicalSupport, height:""})
        }
        BmiCal()
    }
    const handleInputValueCheckBodyWeight =(e)=>{
        if(e.target.name==="bodyWeight" && (e.target.value < 3 || e.target.value>150)){      
        const message ="Body weight must not be greater than 150 and less than 3"
        setVitalClinicalSupport({...vitalClinicalSupport, bodyWeight:message})
        }else{

        setVitalClinicalSupport({...vitalClinicalSupport, bodyWeight:""})
        }
        BmiCal()
    }
    const handleItemClick =(page, completedMenu)=>{
        props.handleItemClick(page)
        if(props.completed.includes(completedMenu)) {

        }else{
            props.setCompleted([...props.completed, completedMenu])
        }
    } 
    const onSelectedOption = (selectedValues) => {
        //setWho({...who, stage2ValueOption: selectedValues})
        setSelectedOptions1(selectedValues);
    }; 
    const onSelectedOption2 = (selectedValues) => {
        //setWho({...who, stage2ValueOption: selectedValues})
        setSelectedOptions2(selectedValues);
    }; 
    /**** Submit Button Processing  */
    const handleSubmit = (e) => { 
        e.preventDefault();  
        props.observation.data.physicalExamination=vital   
        toast.success("Medical history save successful");
        handleItemClick('appearance', 'physical-examination' )                  
    }
    function BmiCal (){
        
        const bmi = ((vital.bodyWeight/(((vital.height/100) * (vital.height/100)))).toFixed(2))
        if(bmi < 18.5){
            return (
            <Message        
                size='mini'
                color='brown'
                content='Underweight'
            />
            )      
        }else if( bmi >= 25){
            //console.log("test")
            <Message        
                size='mini'
                color='blue'
                content='Overweight/Obese'
            />
        }else if((bmi > 18.4 && bmi <=24.9)){
            <Message        
                size='mini'
                color='olive'
                content='Well nourished'
            />
        }
        
    }
    const options1 = [
        { value: 'Nutrition Education', label: 'Nutrition Education' },
        { value: 'Nutrition Counseling', label: 'Nutrition Counseling' },
        { value: 'Client agreed to action plan', label: 'Client agreed to action plan' },
        
    ];
    const options2 = [
        { value: 'Nutrition Supplement', label: 'Nutrition Supplement' },
        { value: 'Referred to Other clinical services', label: 'Referred to Other clinical services' },
        { value: 'Referred to community support', label: 'Referred to community support' },
        
    ];
    
    return (
        <>  
        
            <Card >
                <CardBody>   
                <h2 style={{color:'#000'}}>Nutritional Status Assessment Using Body Mass Index</h2>
                <br/>
                    <form >
                    <div className="row">
                    <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                            <Label >Visit Date *</Label>
                            <InputGroup> 
                                <Input 
                                    type="date"
                                    
                                    name="visitDate"
                                    id="visitDate"
                                    
                                />
                            </InputGroup>                                        
                            </FormGroup>
                           
                    </div>
                    <div className="form-group mb-3 col-md-8"></div>   
                    </div>
                    <div className="row">
                  
                    <div className="row">
                    <div className=" mb-3 col-md-4">
                        <FormGroup>
                        <Label >Body Weight</Label>
                        <InputGroup> 
                            <Input 
                                type="number"
                                name="bodyWeight"
                                id="bodyWeight"
                                onChange={handleInputChangeVitalSignDto}
                                min="3"
                                max="150"
                                value={vital.bodyWeight}
                                onKeyUp={handleInputValueCheckBodyWeight} 
                                style={{border: "1px solid #014D88", borderRadius:"0rem"}}
                            />
                            <InputGroupText addonType="append" style={{ backgroundColor:"#014D88", color:"#fff", border: "1px solid #014D88", borderRadius:"0rem"}}>
                                kg
                            </InputGroupText>
                        </InputGroup>
                        {vitalClinicalSupport.bodyWeight !=="" ? (
                                <span className={classes.error}>{vitalClinicalSupport.bodyWeight}</span>
                        ) : ""}
                        {errors.bodyWeight !=="" ? (
                            <span className={classes.error}>{errors.bodyWeight}</span>
                        ) : "" }
                        </FormGroup>
                    </div>                                   
                    <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                        <Label >Height</Label>
                        <InputGroup> 
                        <InputGroupText
                                addonType="append"
                                
                                style={{ backgroundColor:"#014D88", color:"#fff", border: "1px solid #014D88", borderRadius:"0rem"}}
                                >
                                cm
                        </InputGroupText>
                            <Input 
                                type="number"
                                name="height"
                                id="height"
                                onChange={handleInputChangeVitalSignDto}
                                value={vital.height}
                                min="48.26"
                                max="216.408"
                                onKeyUp={handleInputValueCheckHeight} 
                                style={{border: "1px solid #014D88", borderRadius:"0rem"}}
                            />
                                <InputGroupText

                                style={{ backgroundColor:"#992E62", color:"#fff", border: "1px solid #992E62", borderRadius:"0rem"}}
                                >
                                {vital.height!=='' && vital.height!==undefined ? (vital.height/100).toFixed(2) + "m" : "m"}
                            </InputGroupText>
                        </InputGroup>
                        {vitalClinicalSupport.height !=="" ? (
                            <span className={classes.error}>{vitalClinicalSupport.height}</span>
                        ) : ""}
                        {errors.height !=="" ? (
                            <span className={classes.error}>{errors.height}</span>
                        ) : "" }
                        </FormGroup>
                    </div>
                    <div className="form-group mb-3 mt-2 col-md-4">
                        {vital.bodyWeight!==undefined && vital.height!==undefined &&(
                            <FormGroup>
                            <Label > {" "}</Label>
                            <InputGroup> 
                            <InputGroupText addonType="append" style={{ backgroundColor:"#014D88", color:"#fff", border: "1px solid #014D88", borderRadius:"0rem"}}>
                                BMI : {(vital.bodyWeight/(((vital.height/100) * (vital.height/100)))).toFixed(2)}
                            </InputGroupText>                   
                           
                            </InputGroup>                
                            </FormGroup>
                        )}
                    </div>
                    </div>
                    {vital.bodyWeight!=='' && vital.height!=='' && (
                      <div className="form-group mb-3 mt-2 col-md-12">
                            {
                              BmiCal((vital.bodyWeight/(((vital.height/100) * (vital.height/100)))).toFixed(2))
                            }
                      </div>
                     )}
                    <br/>
                    <div className="form-group mb-3 col-md-12">                                    
                        <FormGroup>
                        <Label >Nutrition Education and Counselled</Label>
                        <DualListBox
                            //canFilter
                            options={options1}
                            onChange={onSelectedOption}
                            selected={selectedOptions1}
                        />
                        </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-12">                                    
                        <FormGroup>
                        <Label >Nutrition Support</Label>
                        <DualListBox
                            //canFilter
                            options={options2}
                            onChange={onSelectedOption2}
                            selected={selectedOptions2}
                        />
                        </FormGroup>
                    </div>
                    </div>
                    <br/>
                    <Button content='Back' icon='left arrow' labelPosition='left' style={{backgroundColor:"#992E62", color:'#fff'}} onClick={()=>handleItemClick('past-arv', 'past-arv')}/>
                    <Button content='Next' type="submit" icon='right arrow' labelPosition='right' style={{backgroundColor:"#014d88", color:'#fff'}} onClick={handleSubmit}/>
                    
                    </form>
                    
                </CardBody>
            </Card> 
                                     
        </>
    );
};

export default BasicInfo