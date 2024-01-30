import React, {useState, useEffect} from 'react';
import { Card,CardBody, FormGroup, Label, Input, Button} from 'reactstrap';
import MatButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import { Table  } from "react-bootstrap";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from "axios";
import { toast} from "react-toastify";
import { url as baseUrl } from "../../../api";
import { token as token } from "../../../api";
import "react-widgets/dist/css/react-widgets.css";
import moment from "moment";
import { Spinner } from "reactstrap";
import {Icon, List, Label as LabelSui} from 'semantic-ui-react'
import DualListBox from "react-dual-listbox";
import 'react-dual-listbox/lib/react-dual-listbox.css';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl'

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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};



  function getStyles(name, selectedOptions, theme) {
    return {
      fontWeight:
        selectedOptions.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

const ClientVerification = (props) =>{
    const theme = useTheme();
    const [selectedOptions, setSelectedOptions] = useState([]);
    const patientObj = props.patientObj;
    const [errors, setErrors] = useState({});
    let temp = { ...errors }
    const classes = useStyles()
    const [dateOfDiscontinuation, setDateOfDiscontinuation] = useState(false);
    const [saving, setSaving] = useState(false);
    const [selected, setSelected] = useState([]);
    // const [optionsForCallOutCome, setOptionsForCallOutCome] = useState([]);
    const [observation, setObservation]=useState({
            data: {},
            dateOfObservation: "",
            facilityId: null,
            personId: 0,
            type: "Client Verification",
            visitId: null
    })
    const [attempt, setAttempt] = useState({  
            dateOfAttempt:"",
            verificationStatus:"",
            outcome:"",
            comment:"",
            verificationAttempts:""
    
    });
    const [clientVerificationObj, setClientVerificationObj] = useState({
        attempt:"",
        dateOfDiscontinuation:"",
        discontinuation:"",
        returnedToCare:"",
        referredTo:"",
        serialEnrollmentNo:"",
        anyOfTheFollowing:""

    });

    const [attemptList, setAttemptList] = useState([]);
    useEffect(() => {
            if(props.activeContent.actionType==='update' || props.activeContent.actionType==='view'){
                GetFormDetail(props.activeContent.id)
            }
    }, [props.activeContent.actionType]);
    const GetFormDetail =(id)=>{
        axios
            .get(`${baseUrl}observation/${id}`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                const Obj= response.data
                setObservation({...Obj})
                setClientVerificationObj({...Obj.data})
                setAttemptList([...Obj.data.attempt]);
                setSelected([...Obj.data.anyOfTheFollowing])
            })
            .catch((error) => {
                //console.log(error);
            });
    }
    const optionsForCallOutCome = [
        'Physical document audited-Folder/register review',
        'Client contacted(Phone)',
        '1st Biometric capture',
        'Biometric recapture',
        'Facility Visit',
      ];

    const indicationForClientVerification = [
        { value: "No initial biometric capture", label: "No initial biometric capture" },
        { value: "Duplicated demographic and clinical variables", label: "Duplicated demographic and clinical variables" },
        { value: "No biometrics recapture", label: "No biometrics recapture"  },
        { value: "Last clinical visit is over 15 months prior", label:"Last clinical visit is over 15 months prior"  },
        { value: "Incomplete visit data on the care card or pharmacy forms or EMz ", label: "Incomplete visit data on the care card or pharmacy forms or EMz "},
        { value: "Records of repeated clinical encounters, with no fingerprint recapture.", label: "Records of repeated clinical encounters, with no fingerprint recapture." },
        { value: "Long intervals between ARV pick-ups (pick-ups more than one year apart in the same facility)", label:"Long intervals between ARV pick-ups (pick-ups more than one year apart in the same facility)"  },
        { value: "Same sex, DOB and ART start date", label: "Same sex, DOB and ART start date"},
        { value: "Consistently had drug pickup by proxy without viral load sample collection for two quarters" , label: "Consistently had drug pickup by proxy without viral load sample collection for two quarters"},
        { value: "Others", label: "Others"},
      ];

    const handleInputChangeAttempt = e => {
        // console.log('checking for date',e.target.value)
        setErrors({...temp, [e.target.name]:""})
        setAttempt ({...attempt,  [e.target.name]: e.target.value});
    }

    const handleChange = (event) => {
        const {
          target: { value },
        } = event;
        setSelectedOptions(
          typeof value === 'string' ? value.split(',') : value,
        );
      };

    const handleInputChange = e => {
        //console.log(e.target.value)
        setErrors({...temp, [e.target.name]:""})
        setAttempt ({...attempt,  [e.target.name]: e.target.value});
        
    }
    const handleInputChangeDiscontinuation = e => {
        //console.log(e.target.value)
        setErrors({...temp, [e.target.name]:""})
        setClientVerificationObj ({...clientVerificationObj,  [e.target.name]: e.target.value});
       
    }

    //Validations of the forms
    const validateAttempt = () => { 
        //attempt.verificationAttempts=selected
        temp.indicationForClientVerification = selected.length > 0 ? "" : "This field is required";
        temp.dateOfAttempt =attempt.dateOfAttempt?"": "This field is required"
        temp.verificationStatus = attempt.verificationStatus ? "" : "This field is required"
        temp.outcome = attempt.outcome ? "" : "This field is required"
        temp.verificationAttempts = attempt.verificationAttempts ? "" : "This field is required"
        setErrors({
            ...temp
        })
        return Object.values(temp).every(x => x === "")
    }
    const clientVerificationFormObj = () => {
        clientVerificationObj.anyOfTheFollowing=selected
        temp.serialEnrollmentNo =clientVerificationObj.serialEnrollmentNo?"": "This field is required"
        temp.discontinuation = clientVerificationObj.discontinuation ? "" : "This field is required"
        temp.anyOfTheFollowing = clientVerificationObj.anyOfTheFollowing ? "" : "This field is required"
        setErrors({
            ...temp
        })
        return Object.values(temp).every(x => x === "")
    }
    const addAttempt = e => {
        //attempt.anyOfTheFollowing=selected
        attempt.outcome = attempt.verificationStatus !=="" && attempt.verificationStatus ==="Verification Ongoing" ? "Verification Ongoing" : attempt.outcome;
        attempt.verificationAttempts = selectedOptions.join(', ');
        if(validateAttempt()){ 
            setAttemptList([...attemptList, attempt])
            setAttempt({
                verificationStatus:"",
                outcome:"",
                comment:"",
                dateOfDiscontinuation:"",
                verificationAttempts:""
            })
            setSelectedOptions([]);
        }else{
            toast.error("Please fill the required fields");
        }
      }
    /* Remove  function **/
    const removeAttempt = index => {       
        attemptList.splice(index, 1);
        setAttemptList([...attemptList]);        
    }; 
    
    /**** Submit Button Processing  */
    const handleSubmit = (e) => {        
        e.preventDefault();
        clientVerificationObj.attempt=attemptList // Assgining all the attempted list to the ClientVerifiction Object 
        observation.data=clientVerificationObj
        if(clientVerificationFormObj()) {
            if (attemptList.length > 0) {
                observation.dateOfObservation = observation.dateOfObservation !== "" ? observation.dateOfObservation : moment(new Date()).format("YYYY-MM-DD")
                observation.personId = patientObj.id
                // observation.data=attemptList        
                setSaving(true);
                if(props.activeContent && props.activeContent.actionType==='update'){//If the the action type is update
                    axios.put(`${baseUrl}observation/${props.activeContent.id}`, observation,
                        {headers: {"Authorization": `Bearer ${token}`}},
                    )
                        .then(response => {
                            setSaving(false);
                            toast.success("Client Verfication form Save successful", {position: toast.POSITION.BOTTOM_CENTER});
                            props.setActiveContent({...props.activeContent, route: 'recent-history'})

                        })
                        .catch(error => {
                            setSaving(false);
                            if (error.response && error.response.data) {
                                let errorMessage = error.response.data.apierror && error.response.data.apierror.message !== "" ? error.response.data.apierror.message : "Something went wrong, please try again";
                                if (error.response.data.apierror && error.response.data.apierror.message !== "" && error.response.data.apierror && error.response.data.apierror.subErrors[0].message !== "") {
                                    toast.error(error.response.data.apierror.message + " : " + error.response.data.apierror.subErrors[0].field + " " + error.response.data.apierror.subErrors[0].message, {position: toast.POSITION.BOTTOM_CENTER});
                                } else {
                                    toast.error(errorMessage, {position: toast.POSITION.BOTTOM_CENTER});
                                }
                            } else {
                                toast.error("Something went wrong. Please try again...", {position: toast.POSITION.BOTTOM_CENTER});
                            }
                        });
                }else{//this is to call the POST API
                    axios.post(`${baseUrl}observation`, observation,
                        {headers: {"Authorization": `Bearer ${token}`}},
                    )
                        .then(response => {
                            setSaving(false);
                            toast.success("Client Verfication form Save successful", {position: toast.POSITION.BOTTOM_CENTER});
                            props.setActiveContent({...props.activeContent, route: 'recent-history'})

                        })
                        .catch(error => {
                            setSaving(false);
                            if (error.response && error.response.data) {
                                let errorMessage = error.response.data.apierror && error.response.data.apierror.message !== "" ? error.response.data.apierror.message : "Something went wrong, please try again";
                                if (error.response.data.apierror && error.response.data.apierror.message !== "" && error.response.data.apierror && error.response.data.apierror.subErrors[0].message !== "") {
                                    toast.error(error.response.data.apierror.message + " : " + error.response.data.apierror.subErrors[0].field + " " + error.response.data.apierror.subErrors[0].message, {position: toast.POSITION.BOTTOM_CENTER});
                                } else {
                                    toast.error(errorMessage, {position: toast.POSITION.BOTTOM_CENTER});
                                }
                            } else {
                                toast.error("Something went wrong. Please try again...", {position: toast.POSITION.BOTTOM_CENTER});
                            }
                        });
                }

            } else {
                toast.error("Attempt to Contact can not be empty", {position: toast.POSITION.BOTTOM_CENTER});
            }
        }else{
            toast.error("All fields are required", {position: toast.POSITION.BOTTOM_CENTER});
        }
       
    }


  return (
    <div>
      <Card className={classes.root}>
        <CardBody>
          <form>
            <div className="row d-flex">
              <h2>Client Verification Form</h2>
              <br />
              <br />
              <div className="row">
                {/* <div className="form-group mb-3 col-md-4">        
                                <FormGroup>
                                    <Label > Date Of Verfication <span style={{ color:"red"}}> *</span></Label>
                                    <Input
                                        type="date"
                                        name="dateOfVerfication"
                                        value={attempt.dateOfVerfication}
                                        onChange={handleInputChange}
                                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                        max= {moment(new Date()).format("YYYY-MM-DD") }
                                    > 
                                    </Input>
                                    {errors.dateOfVerfication !=="" ? (
                                        <span className={classes.error}>{errors.dateOfVerfication}</span>
                                    ) : "" }
                                </FormGroup> 
                            </div> */}

                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label>
                      Serial Enrollment No{" "}
                      <span style={{ color: "red" }}> *</span>
                    </Label>
                    <Input
                      type="text"
                      name="serialEnrollmentNo"
                      id="serialEnrollmentNo"
                      value={clientVerificationObj.serialEnrollmentNo}
                      onChange={handleInputChangeDiscontinuation}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.25rem",
                      }}
                    ></Input>
                    {errors.serialEnrollmentNo !== "" ? (
                      <span className={classes.error}>
                        {errors.serialEnrollmentNo}
                      </span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </div>
              </div>
            </div>

            <div className="row">
              <hr />
              <h3>Indication For Client Verification</h3>
              <div className="form-group mb-3 col-md-12">
                <FormGroup>
                  <Label>
                    Indication For Client Verification{" "}
                    <span style={{ color: "red" }}> *</span>
                  </Label>
                  <DualListBox
                    //canFilter
                    options={indicationForClientVerification}
                    onChange={(value) => setSelected(value)}
                    selected={selected}
                  />
                  {errors.indicationForClientVerification !== "" ? (
                    <span className={classes.error}>
                      {errors.indicationForClientVerification}
                    </span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </div>

              <div>
                <hr />
                <h3> Verification Attempts </h3>

                <div className="form-group mb-3 row gap-3 p-3 ">
                  <div className="flex-lg-row mb-4 col-md-5 p-0">
                    <FormGroup>
                      <Label>
                        {" "}
                        Date Of Attempt <span style={{ color: "red" }}> *</span>
                      </Label>
                      <Input
                        type="date"
                        name="dateOfAttempt"
                        id="dateOfAttempt"
                        value={attempt.dateOfAttempt}
                        //  min={enrollDate}
                        onChange={handleInputChangeAttempt}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                        max={moment(new Date()).format("YYYY-MM-DD")}
                      />
                      {errors.dateOfAttempt !== "" ? (
                        <span className={classes.error}>
                          {errors.dateOfAttempt}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>
                  <div className="flex-lg-row mb-4 col-md-6 p-0">
                    <FormGroup>
                      <Label id="demo-multiple-name-label">
                        Verification Attempts{" "}
                        <span style={{ color: "red" }}> *</span>
                      </Label>
                      <Select
                        className="form-control  bg-white p-0"
                        labelId="demo-multiple-name-label"
                        id="demo-multiple-name"
                        multiple
                        value={selectedOptions}
                        onChange={handleChange}
                        input={<OutlinedInput label="Verification Attempts" />}
                        MenuProps={MenuProps}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                      >
                        {optionsForCallOutCome.map((option) => (
                          <MenuItem
                            key={option}
                            value={option}
                            style={getStyles(option, selectedOptions, theme)}
                          >
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.verificationAttempts !== "" ? (
                        <span className={classes.error}>
                          {errors.verificationAttempts}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>
                </div>
              </div>

              <div className="form-group mb-3 col-md-3">
                <FormGroup>
                  <Label for="">
                    {" "}
                    Verification Status <span style={{ color: "red" }}> *</span>
                  </Label>
                  <Input
                    type="select"
                    name="verificationStatus"
                    id="verificationStatus"
                    onChange={handleInputChangeAttempt}
                    value={attempt.verificationStatus}
                    style={{
                      border: "1px solid #014D88",
                      borderRadius: "0.25rem",
                    }}
                  >
                    <option value=""> Select</option>
                    <option value="Verification Ongoing">
                      Verification ongoing{" "}
                    </option>
                    <option value="Records Discontinued Archived">
                      {" "}
                      Records Discontinued & Archived{" "}
                    </option>
                    <option value="Records Verified">Records Verified</option>
                  </Input>
                  {errors.verificationStatus !== "" ? (
                    <span className={classes.error}>
                      {errors.verificationStatus}
                    </span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </div>
              {attempt.verificationStatus === "Verification Ongoing" ? (
                <>
                  <div className="form-group mb-3 col-md-3">
                    <FormGroup>
                      <Label>
                        {" "}
                        Outcome <span style={{ color: "red" }}> *</span>
                      </Label>
                      <Input
                        type="select"
                        name="outcome"
                        id="outcome"
                        value={attempt.outcome}
                        onChange={handleInputChangeAttempt}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                      >
                        <option value="Verification Ongoing">
                          {" "}
                          Verification Ongoing{" "}
                        </option>
                      </Input>
                      {errors.outcome !== "" ? (
                        <span className={classes.error}>{errors.outcome}</span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group mb-3 col-md-3">
                    <FormGroup>
                      <Label>
                        {" "}
                        Outcome <span style={{ color: "red" }}> *</span>
                      </Label>
                      <Input
                        type="select"
                        name="outcome"
                        id="outcome"
                        value={attempt.outcome}
                        onChange={handleInputChangeAttempt}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                      >
                        <option value=""> Select </option>
                        <option value="valid"> Valid </option>
                        <option value="invalid"> invalid</option>
                      </Input>
                      {errors.outcome !== "" ? (
                        <span className={classes.error}>{errors.outcome}</span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>
                </>
              )}
              <div className="form-group mb-3 col-md-4">
                <FormGroup>
                  <Label> Comment</Label>
                  <Input
                    type="text"
                    name="comment"
                    id="comment"
                    value={attempt.comment}
                    onChange={handleInputChangeAttempt}
                    style={{
                      border: "1px solid #014D88",
                      borderRadius: "0.25rem",
                    }}
                  />
                  {errors.comment !== "" ? (
                    <span className={classes.error}>{errors.comment}</span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </div>
              <div className="form-group mb-3 col-md-2 float-end">
                <LabelSui
                  as="a"
                  color="black"
                  onClick={addAttempt}
                  size="tiny"
                  style={{ marginTop: 35 }}
                >
                  <Icon name="plus" /> Add
                </LabelSui>
              </div>
              {attemptList.length > 0 ? (
                <List>
                  <Table striped responsive>
                    <thead>
                      <tr>
                        <th>Date of Attempt</th>
                        <th>Verification Attempt</th>
                        <th>Verification Status</th>
                        <th>Outcome</th>
                        <th>comment</th>
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
              ) : (
                ""
              )}
              <hr />
            </div>

            <div>
              <hr />
              <div className="row">
                <div className="form-group mb-3 col-md-4">
                  <FormGroup>
                    <Label>
                      {" "}
                      Patient Care in Facility Discontinued?{" "}
                      <span style={{ color: "red" }}> *</span>
                    </Label>
                    <Input
                      type="select"
                      name="discontinuation"
                      id="discontinuation"
                      value={clientVerificationObj.discontinuation}
                      onChange={handleInputChangeDiscontinuation}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.25rem",
                      }}
                    >
                      <option value=""> Select </option>
                      <option value="Yes"> Yes </option>
                      <option value="No"> No </option>
                    </Input>
                    {errors.discontinuation !== "" ? (
                      <span className={classes.error}>
                        {errors.discontinuation}
                      </span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </div>
                {clientVerificationObj.discontinuation === "Yes" && (
                  <div className="form-group mb-3 col-md-4">
                    <label>Date of Discontinuation </label>
                    <Input
                      type="date"
                      name="dateOfDiscontinuation"
                      id="dateOfDiscontinuation"
                      value={clientVerificationObj.dateOfDiscontinuation} //  min={enrollDate}
                      onChange={handleInputChangeDiscontinuation}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.25rem",
                      }}
                      max={moment(new Date()).format("YYYY-MM-DD")}
                    />
                  </div>
                )}

                {clientVerificationObj.discontinuation === "No" && (
                  <>
                    <div className="form-group mb-3 col-md-4">
                      <label>Date Return to Care:</label>
                      <Input
                        type="date"
                        name="returnedToCare"
                        id="returnedToCare"
                        value={clientVerificationObj.returnedToCare}
                        //  min={enrollDate}
                        onChange={handleInputChangeDiscontinuation}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                        max={moment(new Date()).format("YYYY-MM-DD")}
                      />
                    </div>

                    <div className="form-group mb-3 col-md-4">
                      <label>Refer To:</label>
                      <Input
                        type="select"
                        name="referredTo"
                        id="referredTo"
                        value={clientVerificationObj.referredTo}
                        onChange={handleInputChangeDiscontinuation}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                      >
                        <option value=""> Select </option>
                        <option value="VL"> VL </option>
                        <option value="Adherence Counselling">
                          {" "}
                          Adherence Counselling
                        </option>
                        <option value="TB Screen"> TB screen </option>
                        <option value="Others"> Others </option>
                      </Input>
                    </div>
                  </>
                )}
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
              hidden={props.activeContent.actionType === "view" ? true : false}
              onClick={handleSubmit}
              style={{ backgroundColor: "#014d88", color: "#ffffff" }}
              disabled={attemptList.length <= 0 && !saving ? true : false}
            >
              {!saving ? (
                <span style={{ textTransform: "capitalize" }}>
                  {" "}
                  {props.activeContent.actionType === "update"
                    ? "Update"
                    : "Save"}
                </span>
              ) : (
                <span style={{ textTransform: "capitalize" }}>
                  {props.activeContent.actionType === "update"
                    ? "Update..."
                    : "Save..."}
                </span>
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

                <th>{attemptObj.dateOfAttempt}</th>
                <th>{attemptObj.verificationAttempts}</th>
                <th>{attemptObj.verificationStatus}</th>
                <th>{attemptObj.outcome}</th>
                <th>{attemptObj.comment}</th>
                
                <th></th>
                <th >
                    <IconButton aria-label="delete" size="small" color="error" onClick={() =>removeAttempt(index)}>
                        <DeleteIcon fontSize="inherit" />
                    </IconButton>
                    
                </th>
            </tr> 
    );
  }
export default ClientVerification;
