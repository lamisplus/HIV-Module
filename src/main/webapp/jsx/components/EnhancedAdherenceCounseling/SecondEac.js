import React, {useState, useEffect} from 'react';
import { Card,CardBody, FormGroup, Label, Input} from 'reactstrap';
import MatButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import axios from "axios";
import { toast} from "react-toastify";
import { url as baseUrl } from "../../../api";
import { token as token } from "../../../api";
import "react-widgets/dist/css/react-widgets.css";
import moment from "moment";
import { Spinner } from "reactstrap";
import { Icon,Button, } from 'semantic-ui-react'
import FirstEAC from './EnhancedAdherenceCounseling';
import ContinueEAC from './SecondEac';

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
        '& > *': {
            margin: theme.spacing(1)
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
    const [loading, setLoading] = useState(true)
    const [objValues, setObjValues]=useState({
                                                dateOfEac1: null,
                                                dateOfEac2: null,
                                                dateOfEac3: null,
                                                dateOfLastViralLoad: "",
                                                lastViralLoad:"",
                                                note: "",
                                                personId: props.patientObj.id,
                                                status: "",
                                                visitId:""
                                            })
    useEffect(() => {
        EACHistory()
    }, [props.patientObj.id]);
    ///GET LIST OF EAC
    const EACHistory =()=>{
        setLoading(true)
        axios
            .get(`${baseUrl}observation/eac/person/current-eac/${props.patientObj.id}`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
            setLoading(false)
            setObjValues(response.data)
            })
            .catch((error) => {
            
            });    
    }
    const handleInputChange = e => {
        setObjValues ({...objValues,  [e.target.name]: e.target.value});
    }          
    /**** Submit Button Processing  */
    const handleSubmit = (e) => {        
        e.preventDefault();        
          setSaving(true);
          objValues.status='Second'
          axios.post(`${baseUrl}observation/eac`,objValues,
           { headers: {"Authorization" : `Bearer ${token}`}},
          
          )
              .then(response => {
                  setSaving(false);
                  props.setHideSecond(false)
                  props.setHideThird(true)
                  props.setEacObj(response.data)
                  toast.success(" Save successful");
                  //props.setActiveContent('recent-history')

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
            <Card >
                <CardBody>
                <form >
                    <div className="row">
                    <h2>Enhanced Adherence Counselling </h2>
                        <br/>
                        <br/>
                        <br/>
                        <h4>First EAC Date  {objValues.dateOfEac1}</h4>
                        <br/>
                        <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label for="">Date of Second EAC </Label>
                            <Input
                                type="date"
                                name="dateOfEac2"
                                id="dateOfEac2"
                                value={objValues.dateOfEac2}
                                onChange={handleInputChange}
                                min={objValues.dateOfEac1}
                                //max= {moment(new Date()).format("YYYY-MM-DD") }
                                style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                required
                                onKeyPress={(e) => e.preventDefault()}
                            />
                            {errors.dateOfEac2 !=="" ? (
                                <span className={classes.error}>{errors.dateOfEac2}</span>
                            ) : "" }
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label for="">Date of EAC </Label>
                            <Input
                                type="date"
                                name="dateOfEac1"
                                id="dateOfEac1"
                                value={objValues.dateOfEac1}
                                onChange={handleInputChange}
                                min= {moment(objValues.dateOfLastViralLoad).format("YYYY-MM-DD") }
                                max= {moment(new Date()).format("YYYY-MM-DD") }
                                style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                required
                                onKeyPress={(e) => e.preventDefault()}
                            />
                            {errors.dateOfEac1 !=="" ? (
                                <span className={classes.error}>{errors.dateOfEac1}</span>
                            ) : "" }
                            </FormGroup>
                        </div>

                        <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                <Label >Adherence</Label>
                                <Input
                                    type="select"
                                    name="reasonForDefaulting"
                                    id="reasonForDefaulting"
                                    //value={attempt.reasonForDefaulting}
                                    //onChange={handleInputChangeAttempt}
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    
                                >
                                 <option value="">Select</option> 
                                 <option value="Good">Good</option> 
                                 <option value="Fair">Fair</option> 
                                 <option value="Poor">Poor</option> 
                                 
                                </Input>
                                 
                        </FormGroup>
                        </div>

                        <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                <Label >Any missed pharmacy drug pick-ups?</Label>
                                <Input
                                    type="select"
                                    name="reasonForDefaulting"
                                    id="reasonForDefaulting"
                                    //value={attempt.reasonForDefaulting}
                                    //onChange={handleInputChangeAttempt}
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    
                                >
                                 <option value="">Select</option> 
                                 <option value="Yes">Yes</option> 
                                 <option value="No">No</option> 
                                 
                                </Input>
                                
                        </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                <Label >Adherence</Label>
                                <Input
                                    type="select"
                                    name="reasonForDefaulting"
                                    id="reasonForDefaulting"
                                    //value={attempt.reasonForDefaulting}
                                    //onChange={handleInputChangeAttempt}
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    
                                >
                                 <option value="">Select</option> 
                                 <option value="Forgot">  Forgot</option> 
                                 <option value="Knowledge/beliefs">Knowledge/beliefs</option> 
                                 <option value="Side effects">Side effects</option> 
                                 <option value="Physical illness">Physical illness</option>
                                 <option value="Substance use">Substance use</option> 
                                 <option value="Depression">Depression</option> 
                                 <option value="Pill burden">Pill burden</option> 
                                 <option value="Lost/ran out">Lost/ran out</option> 
                                 <option value="Transport">Transport</option>
                                 <option value="Child behavior/refusing Scheduling">Child behavior/refusing Scheduling</option>
                                 <option value="Fear disclosure Family/partner Food insecurity Drug stock out Long wait Stigma">Fear disclosure Family/partner Food insecurity Drug stock out Long wait Stigma</option>
                                 <option value="Others">Others</option>

                                </Input>
                                  
                                </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                <Label >Intervention Services</Label>
                                <Input
                                    type="select"
                                    name="reasonForDefaulting"
                                    id="reasonForDefaulting"
                                    //value={attempt.reasonForDefaulting}
                                    //onChange={handleInputChangeAttempt}
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    
                                >
                                 <option value="">Select</option> 
                                 <option value="Education">  Education</option> 
                                 <option value="Counseling (ind)">Counseling (ind)</option> 
                                 <option value="Counseling (grp)">Counseling (grp)</option> 
                                 <option value="Peer support">Peer support</option>
                                 <option value="Treatment buddy"> Treatment buddy</option> 
                                 <option value="Extended Drug pick-up">Extended Drug pick-up</option> 
                                 <option value="Community ART Group">Community ART Group</option> 
                                 <option value="Directly Observed Therapy">Directly Observed Therapy</option> 
                                 <option value="Transport">Transport</option>
                                 <option value="Child behavior/refusing Scheduling">Child behavior/refusing Scheduling</option>
                                 <option value="Fear disclosure Family/partner Food insecurity Drug stock out Long wait Stigma">Fear disclosure Family/partner Food insecurity Drug stock out Long wait Stigma</option>
                                 <option value="Others">Others</option>

                                </Input>
                                  
                                </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label for="">Referrals</Label>
                            <Input
                                type="text"
                                name="note"
                                id="note"
                                value={objValues.note}
                                onChange={handleInputChange}
                                style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                            />
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label for="">Follow Up Date</Label>
                            <Input
                                type="date"
                                name="dateOfEac1"
                                id="dateOfEac1"
                                value={objValues.dateOfEac1}
                                onChange={handleInputChange}
                                min= {moment(objValues.dateOfLastViralLoad).format("YYYY-MM-DD") }
                                max= {moment(new Date()).format("YYYY-MM-DD") }
                                style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                required
                                onKeyPress={(e) => e.preventDefault()}
                            />
                            {errors.dateOfEac1 !=="" ? (
                                <span className={classes.error}>{errors.dateOfEac1}</span>
                            ) : "" }
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label for="">Comments</Label>
                            <Input
                                type="textarea"
                                name="note"
                                id="note"
                                value={objValues.note}
                                onChange={handleInputChange}
                                style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                            />
                            </FormGroup>
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
                    disabled={objValues.dateOfEac2==="" ? true : false}
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
