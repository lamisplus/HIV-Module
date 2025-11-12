
import React, { useEffect, useState} from "react";
import axios from "axios";
import {FormGroup, Label , CardBody, Spinner,Input,Form, InputGroup} from "reactstrap";
import * as moment from 'moment';
import {makeStyles} from "@material-ui/core/styles";
import {Card, } from "@material-ui/core";
import { toast} from "react-toastify";
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
import useCodesets from "../../../hooks/useCodesets";


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
const CODESET_KEYS = ["TB_TREATMENT_TYPE", "TB_TREATMENT_OUTCOME"];


const TbScreening = (props) => {
    const { getOptions } = useCodesets(CODESET_KEYS);
    const classes = useStyles();
    const [contraindicationDisplay, setcontraindicationDisplay]=useState(false)
    const [tbTreatmentType, setTbTreatmentType]= useState([])
    const [tbTreatmentOutCome, setTbTreatmentOutCome]= useState([])
    useEffect(() => {
        //End of Eligible for TPT logic
        if(props.tbObj.currentlyOnTuberculosis!=="" && props.tbObj.currentlyOnTuberculosis==="No"){
            props.tbObj.eligibleForTPT="No"
        }else if(props.tbObj.currentlyOnTuberculosis!=="" && props.tbObj.currentlyOnTuberculosis==="Yes"){
            //props.tbObj.eligibleForTPT="No"
            props.setTbObj({...props.tbObj, ['eligibleForTPT']: "No"})
        }else{
            props.tbObj.eligibleForTPT=""
        }
        //End of Eligible for TPT logic
        // Start of contraindications logic 
        if((props.tbObj.priorInh!=="" && props.tbObj.priorInh===true )
         || (props.tbObj.highAlcohol!=="" && props.tbObj.highAlcohol===true) 
         || (props.tbObj.activeHepatitis!=="" && props.tbObj.activeHepatitis===true)
         || (props.tbObj.age1year!=="" && props.tbObj.age1year===true)
         || (props.tbObj.poorTreatmentAdherence!=="" && props.tbObj.poorTreatmentAdherence===true)
         || (props.tbObj.abnormalChest!=="" && props.tbObj.abnormalChest===true)
         || (props.tbObj.activeTb!=="" && props.tbObj.activeTb===true))
         {
            props.tbObj.contraindications="Yes"
            //props.setTbObj({...props.tbObj, ['contraindications']: "Yes"})
        }else if((props.tbObj.priorInh!=="" && props.tbObj.priorInh===false )
        && (props.tbObj.highAlcohol!=="" && props.tbObj.highAlcohol===false) 
        && (props.tbObj.activeHepatitis!=="" && props.tbObj.activeHepatitis===false)
        && (props.tbObj.age1year!=="" && props.tbObj.age1year===false)
        && (props.tbObj.poorTreatmentAdherence!=="" && props.tbObj.poorTreatmentAdherence===false)
        && (props.tbObj.abnormalChest!=="" && props.tbObj.abnormalChest===false)
        && (props.tbObj.activeTb!=="" && props.tbObj.activeTb===false)){
            props.tbObj.contraindications="No"
            //props.setTbObj({...props.tbObj, ['contraindications']: "No"})
        }
        //End of contraindications logic

        // Start of Outcome logic 
        if(   props.tbObj.coughing==="Yes" 
            || props.tbObj.fever==="Yes" 
            ||  props.tbObj.losingWeight==="Yes" 
            ||  props.tbObj.nightSweats==="Yes"
            ||  props.tbObj.poorWeightGain==="Yes"
            ||  props.tbObj.historyWithAdults==="Yes"
          )
         {
            //props.tbObj.outcome="Presumptive TB case (TB suspect)"
            //props.tbObj.eligibleForTPT="No"
            setcontraindicationDisplay(false)
            props.setTbObj({...props.tbObj, ['outcome']: "Presumptive TB case (TB suspect)"})
            props.tbObj.eligibleForTPT="No"
            
            
            
        }else if(  props.tbObj.coughing==="No" 
                &&  props.tbObj.fever==="No"
                &&  props.tbObj.losingWeight==="No"
                &&  props.tbObj.nightSweats==="No"
                &&  props.tbObj.poorWeightGain==="No"
                &&  props.tbObj.historyWithAdults==="No"){
                    //The logic 
                    //props.tbObj.outcome="No TB sign (not a suspect)"
                    setcontraindicationDisplay(true)
                    props.setTbObj({...props.tbObj, ['outcome']: "No TB sign (not a suspect)"})
                    //setcontraindicationDisplay(true)
                    //props.tbObj.eligibleForTPT="No"
        }
        if(
                    props.tbObj.tbTreatment==="No"
                &&  props.tbObj.currentlyOnTuberculosis==="No"

                &&  props.tbObj.coughing==="No" 
                &&  props.tbObj.fever==="No"
                &&  props.tbObj.losingWeight==="No"
                &&  props.tbObj.nightSweats==="No"
                &&  props.tbObj.poorWeightGain==="No"
                &&  props.tbObj.historyWithAdults==="No"
                
                &&  props.tbObj.priorInh===false 
                &&  props.tbObj.highAlcohol===false
                && props.tbObj.activeHepatitis===false
                &&  props.tbObj.age1year===false
                &&  props.tbObj.abnormalChest===false
                &&  props.tbObj.abnormalChest===false
                &&  props.tbObj.poorTreatmentAdherence===false

                ){
                props.setTbObj({...props.tbObj, ['eligibleForTPT']: "Yes"})
                //props.tbObj.eligibleForTPT="Yes"
            }else if(props.tbObj.currentlyOnTuberculosis==="No" && props.tbObj.tbTreatment==="Yes"){
                props.setTbObj({...props.tbObj, ['outcome']: "TB/HIV co-infected"})
            }else{

            }
            //End of Outcome logic

        }, [props.tbObj.priorInh,props.tbObj.highAlcohol,props.tbObj.activeHepatitis,props.tbObj.age1year,props.tbObj.poorTreatmentAdherence,props.tbObj.abnormalChest,props.tbObj.activeTb,props.tbObj.contraindications,
            props.tbObj.coughing, 
            props.tbObj.fever, 
            props.tbObj.losingWeight, 
            props.tbObj.nightSweats, 
            props.tbObj.poorWeightGain, 
            props.tbObj.historyWithAdults,
            props.tbObj.outcome,
            props.tbObj.eligibleForTPT,
            props.tbObj.currentlyOnTuberculosis
    ]);
    useEffect(() => {
        TB_TREATMENT_OUTCOME();
        TB_TREATMENT_TYPE();
    }, []);
    // const TB_TREATMENT_TYPE =()=>{
    //     axios
    //         .get(`${baseUrl}application-codesets/v2/TB_TREATMENT_TYPE`,
    //             { headers: {"Authorization" : `Bearer ${token}`} }
    //         )
    //         .then((response) => {
                
    //             setTbTreatmentType(response.data);
    //         })
    //         .catch((error) => {
           
    //         });
        
    // }
    // const TB_TREATMENT_OUTCOME =()=>{
    //     axios
    //         .get(`${baseUrl}application-codesets/v2/TB_TREATMENT_OUTCOME`,
    //             { headers: {"Authorization" : `Bearer ${token}`} }
    //         )
    //         .then((response) => {
                
    //             setTbTreatmentOutCome(response.data);
    //         })
    //         .catch((error) => {
           
    //         });
        
    // }
    const handleInputChange =e =>{
        props.setTbObj({...props.tbObj, [e.target.name]: e.target.value})
        
        //making some fields to be empty once the selection logic is apply(skip logic) 
        if(e.target.name==='currentlyOnTuberculosis' && e.target.value==='Yes'){
            props.tbObj.tbTreatment=""
            props.tbObj.tbTreatmentStartDate=""
            props.setTbObj({...props.tbObj, ['tbTreatment']: ''})
            props.setTbObj({...props.tbObj, ['tbTreatmentStartDate']: ''})
            props.setTbObj({...props.tbObj, [e.target.name]: e.target.value})
        }
        if(e.target.name==='currentlyOnTuberculosis' && e.target.value==='No'){
            props.tbObj.coughing="" 
            props.tbObj.fever=""
            props.tbObj.losingWeight=""
            props.tbObj.nightSweats=""
            props.tbObj.poorWeightGain=""
            props.tbObj.historyWithAdults=""
            props.setTbObj({...props.tbObj, ['coughing']: ""})
            props.setTbObj({...props.tbObj, ['fever']: ''})
            props.setTbObj({...props.tbObj, ['losingWeight']: ''})
            props.setTbObj({...props.tbObj, ['nightSweats']: ''})
            props.setTbObj({...props.tbObj, ['poorWeightGain']: ''})
            props.setTbObj({...props.tbObj, ['historyWithAdults']: ''})
            props.setTbObj({...props.tbObj, [e.target.name]: e.target.value})
        }
        if(e.target.name==='tbTreatment' && e.target.value==='Yes'){
            props.tbObj.tbTreatmentStartDate=""
            setcontraindicationDisplay(true)
            props.tbObj.coughing="" 
            props.tbObj.fever=""
            props.tbObj.losingWeight=""
            props.tbObj.nightSweats=""
            props.tbObj.poorWeightGain=""
            props.tbObj.historyWithAdults=""
            props.setTbObj({...props.tbObj, ['coughing']: ""})
            props.setTbObj({...props.tbObj, ['fever']: ''})
            props.setTbObj({...props.tbObj, ['losingWeight']: ''})
            props.setTbObj({...props.tbObj, ['nightSweats']: ''})
            props.setTbObj({...props.tbObj, ['poorWeightGain']: ''})
            props.setTbObj({...props.tbObj, ['historyWithAdults']: ''})
            props.setTbObj({...props.tbObj, [e.target.name]: e.target.value})
           
        }
        if(e.target.name==='tbTreatment' && e.target.value==='No'){

            props.tbObj.tbTreatmentStartDate=""
            props.tbObj.treatementType="" 
            props.tbObj.treatmentOutcome=""
            props.tbObj.completionDate=""
            props.setTbObj({...props.tbObj, ['tbTreatmentStartDate']: ""})
            props.setTbObj({...props.tbObj, ['treatementType']: ''})
            props.setTbObj({...props.tbObj, ['treatmentOutcome']: ''})
            props.setTbObj({...props.tbObj, ['completionDate']: ''})
            props.setTbObj({...props.tbObj, [e.target.name]: e.target.value})
           
        }
        
        
    }

    const handleInputChangeContrain =e =>{
       if(e.target.checked){ 
        props.setTbObj({...props.tbObj, [e.target.name]: e.target.checked})
        }else{
            props.setTbObj({...props.tbObj, [e.target.name]: false})
        }

    }


    return (
      <>
        <Card className={classes.root}>
          <CardBody>
            <h2 style={{ color: "#000" }}>TB & IPT Screening </h2>
            <br />
            <form>
              <div className="row">
                <div className="form-group mb-3 col-md-6">
                  <FormGroup>
                    <Label>
                      Are you currently on Tuberculosis Preventive Therapy ( TPT
                      )
                    </Label>
                    <InputGroup>
                      <Input
                        type="select"
                        name="currentlyOnTuberculosis"
                        id="currentlyOnTuberculosis"
                        onChange={handleInputChange}
                        value={props.tbObj.currentlyOnTuberculosis}
                      >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </Input>
                    </InputGroup>
                  </FormGroup>
                </div>
                {props.tbObj.currentlyOnTuberculosis !== "" &&
                  props.tbObj.currentlyOnTuberculosis === "No" && (
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>Are you currently on TB treatment?</Label>
                        <InputGroup>
                          <Input
                            type="select"
                            name="tbTreatment"
                            id="tbTreatment"
                            onChange={handleInputChange}
                            value={props.tbObj.tbTreatment}
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </Input>
                        </InputGroup>
                      </FormGroup>
                    </div>
                  )}
                {props.tbObj.tbTreatment !== "" &&
                  props.tbObj.tbTreatment === "Yes" && (
                    <>
                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>TB treatment start date </Label>
                          <InputGroup>
                            <Input
                              type="date"
                              name="tbTreatmentStartDate"
                              id="tbTreatmentStartDate"
                              onChange={handleInputChange}
                              value={props.tbObj.tbTreatmentStartDate}
                              min={props.encounterDate}
                              max={moment(new Date()).format("YYYY-MM-DD")}
                            ></Input>
                          </InputGroup>
                        </FormGroup>
                      </div>
                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>Treatment Type </Label>
                          <InputGroup>
                            <Input
                              type="select"
                              name="treatementType"
                              id="treatementType"
                              onChange={handleInputChange}
                              value={props.tbObj.treatementType}
                            >
                              <option value="">Select</option>
                              {getOptions("TB_TREATMENT_TYPE").map((value) => (
                                <option key={value.id} value={value.display}>
                                  {value.display}
                                </option>
                              ))}
                            </Input>
                          </InputGroup>
                        </FormGroup>
                      </div>
                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>Treatment Outcome </Label>
                          <InputGroup>
                            <Input
                              type="select"
                              name="treatmentOutcome"
                              id="treatmentOutcome"
                              onChange={handleInputChange}
                              value={props.tbObj.treatmentOutcome}
                            >
                              <option value="">Select</option>
                              {getOptions("TB_TREATMENT_OUTCOME").map(
                                (value) => (
                                  <option key={value.id} value={value.display}>
                                    {value.display}
                                  </option>
                                )
                              )}
                            </Input>
                          </InputGroup>
                        </FormGroup>
                      </div>
                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>Completion Date </Label>
                          <InputGroup>
                            <Input
                              type="date"
                              name="completionDate"
                              id="completionDate"
                              onChange={handleInputChange}
                              value={props.tbObj.completionDate}
                              min={props.encounterDate}
                              max={moment(new Date()).format("YYYY-MM-DD")}
                            ></Input>
                          </InputGroup>
                        </FormGroup>
                      </div>
                    </>
                  )}
                {(props.tbObj.currentlyOnTuberculosis === "Yes" ||
                  props.tbObj.tbTreatment === "No") && (
                  <>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>Are you coughing currently? </Label>
                        <InputGroup>
                          <Input
                            type="select"
                            name="coughing"
                            id="coughing"
                            onChange={handleInputChange}
                            value={props.tbObj.coughing}
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
                          Do you have fever for 2 weeks or more? (Unexplained
                          fever){" "}
                        </Label>
                        <InputGroup>
                          <Input
                            type="select"
                            name="fever"
                            id="fever"
                            onChange={handleInputChange}
                            value={props.tbObj.fever}
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
                          Are you losing weight? (Unplanned weight loss)
                        </Label>
                        <InputGroup>
                          <Input
                            type="select"
                            name="losingWeight"
                            id="losingWeight"
                            onChange={handleInputChange}
                            value={props.tbObj.losingWeight}
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
                          Are you having night sweats? (drenching or excessive
                          night sweats)
                        </Label>
                        <InputGroup>
                          <Input
                            type="select"
                            name="nightSweats"
                            id="nightSweats"
                            onChange={handleInputChange}
                            value={props.tbObj.nightSweats}
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </Input>
                        </InputGroup>
                      </FormGroup>
                    </div>
                    {props.patientObj && props.patientObj <= 5 && (
                      <>
                        <div className="form-group mb-3 col-md-6">
                          <FormGroup>
                            <Label>
                              Poor weight gain (Paediatrics clients {"<"}12
                              months){" "}
                            </Label>
                            <InputGroup>
                              <Input
                                type="select"
                                name="poorWeightGain"
                                id="poorWeightGain"
                                onChange={handleInputChange}
                                value={props.tbObj.poorWeightGain}
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
                              History of contacts with adults with TB
                              (Paediatrics clients {"<"} months){" "}
                            </Label>
                            <InputGroup>
                              <Input
                                type="select"
                                name="historyWithAdults"
                                id="historyWithAdults"
                                onChange={handleInputChange}
                                value={props.tbObj.historyWithAdults}
                              >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </Input>
                            </InputGroup>
                          </FormGroup>
                        </div>
                      </>
                    )}
                  </>
                )}
                <br />
                {contraindicationDisplay === true && (
                  <>
                    <hr />

                    <h3>Contraindications for TPT</h3>
                    {(props.tbObj.currentlyOnTuberculosis === "Yes" ||
                      props.tbObj.tbTreatment === "No") && (
                      <>
                        <div className="form-group mb-3 col-md-12">
                          <div className="form-check custom-checkbox ml-1 ">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              name="activeTb"
                              id="activeTb"
                              value={props.tbObj.activeTb}
                              onChange={handleInputChangeContrain}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="basic_checkbox_1"
                            >
                              Active TB
                            </label>
                          </div>
                        </div>
                        <div className="form-group mb-3 col-md-12">
                          <div className="form-check custom-checkbox ml-1 ">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              name="abnormalChest"
                              id="abnormalChest"
                              value={props.tbObj.abnormalChest}
                              onChange={handleInputChangeContrain}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="basic_checkbox_1"
                            >
                              Abnormal Chest X-Ray
                            </label>
                          </div>
                        </div>
                        <div className="form-group mb-3 col-md-12">
                          <div className="form-check custom-checkbox ml-1 ">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              name="poorTreatmentAdherence"
                              id="poorTreatmentAdherence"
                              value={props.tbObj.poorTreatmentAdherence}
                              onChange={handleInputChangeContrain}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="basic_checkbox_1"
                            >
                              History of poor treatment adherence
                            </label>
                          </div>
                        </div>
                        <div className="form-group mb-3 col-md-12">
                          <div className="form-check custom-checkbox ml-1 ">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              name="age1year"
                              id="age1year"
                              value={props.tbObj.age1year}
                              onChange={handleInputChangeContrain}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="basic_checkbox_1"
                            >
                              Age {"<"}1 year without history of close contact
                              with TB patient
                            </label>
                          </div>
                        </div>
                        <div className="form-group mb-3 col-md-12">
                          <div className="form-check custom-checkbox ml-1 ">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              name="activeHepatitis"
                              id="activeHepatitis"
                              value={props.tbObj.activeHepatitis}
                              onChange={handleInputChangeContrain}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="basic_checkbox_1"
                            >
                              Active hepatitis (clinical or lab)
                            </label>
                          </div>
                        </div>
                        <div className="form-group mb-3 col-md-12">
                          <div className="form-check custom-checkbox ml-1 ">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              name="highAlcohol"
                              id="highAlcohol"
                              value={props.tbObj.highAlcohol}
                              onChange={handleInputChangeContrain}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="basic_checkbox_1"
                            >
                              High alcohol consumption
                            </label>
                          </div>
                        </div>
                        <div className="form-group mb-3 col-md-12">
                          <div className="form-check custom-checkbox ml-1 ">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              name="priorInh"
                              id="priorInh"
                              value={props.tbObj.priorInh}
                              onChange={handleInputChangeContrain}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="basic_checkbox_1"
                            >
                              Prior allergy to INH
                            </label>
                          </div>
                        </div>
                      </>
                    )}
                    <h4>Result :{props.tbObj.contraindications} </h4>
                  </>
                )}
                <hr />
                <br />
                <h2>Outcome :{props.tbObj.outcome}</h2>
                <br />
                <h2>Eligible for IPT :{props.tbObj.eligibleForTPT}</h2>
                {props.tbObj.eligibleForTPT === "Yes" && (
                  <>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>Date TPT start </Label>
                        <InputGroup>
                          <Input
                            type="date"
                            name="dateTPTStart"
                            id="dateTPTStart"
                            onChange={handleInputChange}
                            min={props.encounterDate}
                            max={moment(new Date()).format("YYYY-MM-DD")}
                            value={props.tbObj.dateTPTStart}
                          ></Input>
                        </InputGroup>
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>Weight at start of TPT</Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="weightAtStartTPT"
                            id="weightAtStartTPT"
                            onChange={handleInputChange}
                            value={props.tbObj.weightAtStartTPT}
                          ></Input>
                        </InputGroup>
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>INH daily dose </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="inhDailyDose"
                            id="inhDailyDose"
                            onChange={handleInputChange}
                            value={props.tbObj.inhDailyDose}
                          ></Input>
                        </InputGroup>
                      </FormGroup>
                    </div>
                  </>
                )}
              </div>
            </form>
          </CardBody>
        </Card>
      </>
    );
};

export default TbScreening