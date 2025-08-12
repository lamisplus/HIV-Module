import React, {useState, useEffect} from 'react';
import { Card,CardBody, FormGroup, Label, Input} from 'reactstrap';
import MatButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import { Table  } from "react-bootstrap";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from "axios";
import { toast} from "react-toastify";
import { url as baseUrl } from "./../../../api";
import { token as token } from "./../../../api";
import "react-widgets/dist/css/react-widgets.css";
import moment from "moment";
import { Spinner } from "reactstrap";
import {Icon, List, Label as LabelSui} from 'semantic-ui-react'
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
    } ,
    error: {
        color: "#f85032",
        fontSize: "11px",
      },
}))

const Tracking = (props) => {
    const patientObj = props.patientObj;
    const [errors, setErrors] = useState({});
    let temp = { ...errors }
    const [enrollDate, setEnrollDate] = useState("");
    const classes = useStyles()
    const [saving, setSaving] = useState(false);
    const [selected, setSelected] = useState([]);
    const [optionsForSelection, setOptionsForSelection] = useState([]);
    const [optionsForCallOutCome, setOptionsForCallOutCome] = useState([]);
    const [observation, setObservation]=useState({
        data: {},
        dateOfObservation: "",
        facilityId: null,
        personId: 0,
        type: "Intensive follow up",
        visitId: null
    })

    const [attempt, setAttempt] = useState({  
            caller:"", 
            callOutcome:"",
            comment:"",
            missedMedication:"",
            howDoYouFeelGenerally:"",
            anyOfTheFollowing:"",
            callDate:"",
    });
    const [attemptList, setAttemptList] = useState([])  
    const [prepSideEffect, setPrepSideEffect] = useState([]);
    useEffect(() => {
        GENERAL_FEELING();
        CALL_OUTCOME();
        PrepSideEffect();
        GetPatientDTOObj();
    }, []); 
    const GetPatientDTOObj =()=>{
        axios
           .get(`${baseUrl}hiv/patient/${props.patientObj.id}`,
               { headers: {"Authorization" : `Bearer ${token}`} }
           )
           .then((response) => {
               const patientDTO= response.data.enrollment
               setEnrollDate (patientDTO.dateOfRegistration)
               //setEacStatusObj(response.data);
               //
           })
           .catch((error) => {
           
           });
          
    } 
    const GENERAL_FEELING =()=>{
        axios
            .get(`${baseUrl}application-codesets/v2/GENERAL_FEELING`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                setOptionsForSelection(response.data);
            })
            .catch((error) => {
            
            });        
    }
    const CALL_OUTCOME =()=>{
        axios
            .get(`${baseUrl}application-codesets/v2/CALL_OUTCOME`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                setOptionsForCallOutCome(response.data);
            })
            .catch((error) => {
            
            });        
    }  
    //Get list of PrepSideEffect
    const PrepSideEffect =()=>{
        axios
            .get(`${baseUrl}application-codesets/v2/DO_YOU_HAVE_THE_FOLLOWING`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {

                setPrepSideEffect(Object.entries(response.data).map(([key, value]) => ({
                    label: value.display,
                    value: value.display,
                })));
            })
            .catch((error) => {
            
            });
        
    }     
    const handleInputChangeAttempt = e => {
        
        setErrors({...temp, [e.target.name]:""})
        setAttempt ({...attempt,  [e.target.name]: e.target.value});
    }
    const handleInputChange = e => {
        
        setErrors({...temp, [e.target.name]:""})
        setObservation ({...observation,  [e.target.name]: e.target.value});
    }
    const onSelect = (selectedValues) => {
        setSelected(selectedValues);

    };
    //Validations of the forms
    const validateAttempt = () => { 
    attempt.anyOfTheFollowing=selected       
    temp.caller = attempt.caller ? "" : "This field is required"
    temp.callOutcome = attempt.callOutcome ? "" : "This field is required"
    temp.comment = attempt.comment ? "" : "This field is required"
    temp.missedMedication = attempt.missedMedication ? "" : "This field is required"
    temp.howDoYouFeelGenerally = attempt.howDoYouFeelGenerally ? "" : "This field is required"
    temp.anyOfTheFollowing = attempt.anyOfTheFollowing ? "" : "This field is required"
    temp.callDate = attempt.callDate ? "" : "This field is required"
    setErrors({
        ...temp
    })
    return Object.values(temp).every(x => x === "")
  }
    const addAttempt = e => {
        attempt.anyOfTheFollowing=selected
        if(validateAttempt()){ 
            setAttemptList([...attemptList, attempt])
            setAttempt({caller:"", 
            callOutcome:"",
            comment:"",
            missedMedication:"",
            howDoYouFeelGenerally:"",
            anyOfTheFollowing:"",
            callDate:"",
            })
        }else{
            toast.error("Please fill the required fields");
        }
      }
    /* Remove ADR  function **/
    const removeAttempt = index => {       
        attemptList.splice(index, 1);
        setAttemptList([...attemptList]);        
    }; 
    
    /**** Submit Button Processing  */
    const handleSubmit = (e) => {        
        e.preventDefault();
            if(attemptList.length >0){
                observation.dateOfObservation= observation.dateOfObservation !=="" ? observation.dateOfObservation : moment(new Date()).format("YYYY-MM-DD")       
                observation.personId =patientObj.id
                observation.data=attemptList        
                setSaving(true);
                axios.post(`${baseUrl}observation`,observation,
                { headers: {"Authorization" : `Bearer ${token}`}},
                
                )
                    .then(response => {
                        setSaving(false);
                        toast.success("Intensive follow up form Save successful", {position: toast.POSITION.BOTTOM_CENTER});
                        props.setActiveContent({...props.activeContent, route:'recent-history'})
                        //props.setActiveContent('recent-history')

                    })
                    .catch(error => {
                        setSaving(false);
                        if(error.response && error.response.data){
                            let errorMessage = error.response.data.apierror && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
                            if(error.response.data.apierror && error.response.data.apierror.message!=="" && error.response.data.apierror && error.response.data.apierror.subErrors[0].message!==""){
                                toast.error(error.response.data.apierror.message + " : " + error.response.data.apierror.subErrors[0].field + " " + error.response.data.apierror.subErrors[0].message, {position: toast.POSITION.BOTTOM_CENTER});
                            }else{
                                toast.error(errorMessage, {position: toast.POSITION.BOTTOM_CENTER});
                            }
                        }
                        else{
                            toast.error("Something went wrong. Please try again...", {position: toast.POSITION.BOTTOM_CENTER});
                        }
                    });
                }else{
                    toast.error("Attempt to Contact can not be empty", {position: toast.POSITION.BOTTOM_CENTER});
                }
       
    }

  return (      
        <div>                   
            <Card className={classes.root}>
                <CardBody>
                <form >
                    <div className="row">
                    <h2>Intensive Follow Up Form</h2>
                        <br/>
                        <br/>
                        <div className="row">
                        <div className="form-group mb-3 col-md-4">        
                            <FormGroup>
                                <Label >Date of Observation <span style={{ color:"red"}}> *</span></Label>
                                <Input
                                    type="date"
                                    name="dateOfObservation"
                                    id="dateOfObservation"
                                    value={observation.dateOfObservation}
                                    min={enrollDate}
                                    onChange={handleInputChange}
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    max= {moment(new Date()).format("YYYY-MM-DD") }
                                    onKeyPress={(e) => e.preventDefault()}
                                    > 
                                </Input>
                                {errors.dateOfObservation !=="" ? (
                                    <span className={classes.error}>{errors.dateOfObservation}</span>
                                ) : "" }
                                </FormGroup> 
                        </div>
                        </div>
                        <div className="row">
                        <hr/>
                        <h3>Attempted to Contact</h3>
                        <div className="form-group mb-3 col-md-4">        
                            <FormGroup>
                                <Label >Date of call <span style={{ color:"red"}}> *</span></Label>
                                <Input
                                    type="date"
                                    name="callDate"
                                    id="callDate"
                                    value={attempt.callDate}
                                    min={enrollDate}
                                    onChange={handleInputChangeAttempt}
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    max= {moment(new Date()).format("YYYY-MM-DD") }
                                    onKeyPress={(e) => e.preventDefault()}
                                    > 
                                </Input>
                                {errors.callDate !=="" ? (
                                    <span className={classes.error}>{errors.callDate}</span>
                                ) : "" }
                                </FormGroup> 
                            </div>
                            <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                <Label >How do you feel generally? <span style={{ color:"red"}}> *</span></Label>
                                <Input
                                    type="select"
                                    name="howDoYouFeelGenerally"
                                    id="howDoYouFeelGenerally"
                                    value={attempt.howDoYouFeelGenerally}
                                    onChange={handleInputChangeAttempt}
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    
                                >
                                    <option value="">Select</option> 
                                    {optionsForSelection.map((value) => (
                                        <option key={value.code} value={value.display}>
                                            {value.display}
                                        </option>
                                    ))}
                                </Input> 
                                {errors.howDoYouFeelGenerally !=="" ? (
                                    <span className={classes.error}>{errors.howDoYouFeelGenerally}</span>
                                ) : "" }   
                                </FormGroup>
                            </div>
                            
                            <div className="form-group mb-3 col-md-12">
                                <FormGroup>
                                <Label >Do you have any of the following <span style={{ color:"red"}}> *</span></Label>
                                <DualListBox
                                //canFilter
                                    options={prepSideEffect}
                                    onChange={onSelect}
                                    selected={selected}
                                /> 
                                
                                {errors.anyOfTheFollowing !=="" ? (
                                    <span className={classes.error}>{errors.anyOfTheFollowing}</span>
                                ) : "" }   
                                </FormGroup>
                            </div>
                            <div className="row">
                                <div className="form-group mb-3 col-md-4">
                                    <FormGroup>
                                    <Label >Have you missed any doses of your medications in the past 7 days <span style={{ color:"red"}}> *</span></Label>
                                    <Input
                                        type="select"
                                        name="missedMedication"
                                        id="missedMedication"
                                        value={attempt.missedMedication}
                                        onChange={handleInputChangeAttempt}
                                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                        
                                    >
                                    <option value="">Select</option> 
                                    <option value="Yes">Yes</option> 
                                    <option value="No">No</option> 
                                    </Input> 
                                    {errors.missedMedication !=="" ? (
                                        <span className={classes.error}>{errors.missedMedication}</span>
                                    ) : "" }   
                                    </FormGroup>
                                </div>
                                <div className="form-group mb-3 col-md-4">
                                    <FormGroup>
                                    <Label >Comment <span style={{ color:"red"}}> *</span></Label>
                                    <Input
                                        type="text"
                                        name="comment"
                                        id="comment"
                                        value={attempt.comment}
                                        onChange={handleInputChangeAttempt}
                                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                        
                                    />
                                    {errors.comment !=="" ? (
                                    <span className={classes.error}>{errors.comment}</span>
                                    ) : "" }
                                    </FormGroup>
                                </div>
                                <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                <Label for="">Outcome of the call <span style={{ color:"red"}}> *</span></Label>

                                    <Input 
                                        type="select"
                                        name="callOutcome"
                                        id="callOutcome"
                                        onChange={handleInputChangeAttempt}
                                        value={attempt.callOutcome}  
                                    >
                                        <option value="">Select</option>
                                        {optionsForCallOutCome.map((value) => (
                                        <option key={value.code} value={value.display}>
                                            {value.display}
                                        </option>
                                    ))}
                                    </Input>
                                    {errors.callOutcome !=="" ? (
                                    <span className={classes.error}>{errors.callOutcome}</span>
                                    ) : "" }
                                </FormGroup>
                                </div>
                            </div>
                            <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                <Label >Initials of the caller <span style={{ color:"red"}}> *</span></Label>
                                <Input
                                    type="text"
                                    name="caller"
                                    id="caller"
                                    value={attempt.caller}
                                    onChange={handleInputChangeAttempt}
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    
                                />
                                {errors.caller !=="" ? (
                                <span className={classes.error}>{errors.caller}</span>
                                ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-2 float-end">
                            <LabelSui as='a' color='black'  onClick={addAttempt}  size='tiny' style={{ marginTop:35}}>
                                <Icon name='plus' /> Add
                            </LabelSui>
                            </div>

                            {attemptList.length >0 
                            ?
                                <List>
                                <Table  striped responsive>
                                    <thead >
                                        <tr>
                                            <th>call Date</th>
                                            <th>How Do you Fell</th>
                                            <th>Do you have any of the following</th>
                                            <th>Missed medication in the last 7days</th>
                                            <th>comment</th>
                                            <th>call outcome</th>
                                            <th>Initial call Name</th>
                                            <th ></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {attemptList.map((attemptObj, index) => (

                                    <AttemptedLists
                                        key={index}
                                        index={index}
                                        attemptObj={attemptObj}
                                        removeAttempt={removeAttempt}
                                    />
                                    ))}
                                    </tbody>
                                </Table>
                                </List>
                                :
                                ""
                            }       
                        <hr/>
                        </div>
                        

                    </div>
                    
                    {saving ? <Spinner /> : ""}
                    <br />
                
                    <MatButton
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    startIcon={<SaveIcon />}
                    onClick={handleSubmit}
                    style={{backgroundColor:"#014d88"}}
                    disabled={attemptList.length <=0 && !saving ? true : false}
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

function AttemptedLists({
    attemptObj,
    index,
    removeAttempt,
  }) {
   
    return (
            <tr>
                <th>{attemptObj.callDate}</th>
                <th>{attemptObj.howDoYouFeelGenerally}</th>
                <th>{(attemptObj.anyOfTheFollowing).toString()}</th>
                <th>{attemptObj.missedMedication}</th>
                <th>{attemptObj.comment}</th>
                <th>{attemptObj.callOutcome}</th>
                <th>{attemptObj.caller}</th>
                <th></th>
                <th >
                    <IconButton aria-label="delete" size="small" color="error" onClick={() =>removeAttempt(index)}>
                        <DeleteIcon fontSize="inherit" />
                    </IconButton>
                    
                </th>
            </tr> 
    );
  }
export default Tracking;
