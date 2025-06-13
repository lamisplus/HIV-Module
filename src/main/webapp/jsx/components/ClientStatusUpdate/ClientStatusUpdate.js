import React, {useState, useEffect} from 'react';
import { Form,Row, Card,CardBody, FormGroup, Label, Input} from 'reactstrap';
import MatButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import axios from "axios";
import { toast} from "react-toastify";
import "react-widgets/dist/css/react-widgets.css";
import moment from "moment";
import { Spinner } from "reactstrap";
import { url as baseUrl, token } from "../../../api";
import { Icon,Button, } from 'semantic-ui-react'
import useCodesets from '../../../hooks/useCodesets';

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
    input: {
        display: 'none'
    } 
}))

const CODESET_KEYS = ["HIV_STATUS", "REASON_INTERRUPTION", "CAUSE_DEATH"];
const ClientStatusUpdate = (props) => {
    const { getOptions } = useCodesets(CODESET_KEYS);
    const patientObj = props.patientObj;

     const {
       currentStatus,
     } = usePatientStatus(patientObj?.id, patientObj?.commenced);

    const enrollDate = patientObj && patientObj.enrollment ? patientObj.enrollment.dateOfRegistration : null
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    let temp = { ...errors }
    const classes = useStyles()
    const [hivStatus, setHivStatus] = useState([]);
    const [reasonForInteruption, setReasonForInteruption] = useState([]);
    const [causeDeath, setCauseDeath] = useState([]);
    const [values, setValues] = useState([]);
    const [objValues, setObjValues] = useState({ agreedDate: null,
                                                causeOfDeath: null,
                                                facilityId: "",
                                                hivStatus: "",
                                                personId: "",
                                                reasonForInterruption: "",
                                                statusDate: null,
                                                dateConfirmedDied:"",
                                                reasonForStoppingTreatment:"",
                                                dateStopped:"",
                                                dateArtTransferOut:"",
                                                datePreArtTransferOut:"",
                                                visitId: null
                                            });

    // useEffect(() => {
    //     CauseDeath();
    //     ReasonForInteruption();
    //     HIVStatus();
    //     //TrackingOutcome();
    //   }, []);

    //Get list of HIV_STATUS
    // const HIVStatus =()=>{
    //     axios
    //        .get(`${baseUrl}application-codesets/v2/HIV_STATUS`,
    //            { headers: {"Authorization" : `Bearer ${token}`} }
    //        )
    //        .then((response) => {
               
    //            setHivStatus(
    //              response.data.filter(
    //                (x) =>
    //                  x.display !== "Lost to Follow Up" &&
    //                  x.display !== "ART Transfer In" &&
    //                  x.display !== "ART Start" &&
    //                  x.display !== "ART Restart" &&
    //                  x.display !== "Pre-ART Transfer In" &&
    //                  x.display !== currentStatus &&
    //                  x.display !== "HIV Exposed Status Unknown" &&
    //                  x.display !== "HIV Negative" &&
    //                  x.display !== "HIV+ non ART"
    //              )
    //            );
    //        })
    //        .catch((error) => {
           
    //        });
       
    // }
    // REASON_INTERRUPTION
    // const ReasonForInteruption =()=>{
    //     axios
    //        .get(`${baseUrl}application-codesets/v2/REASON_INTERRUPTION`,
    //            { headers: {"Authorization" : `Bearer ${token}`} }
    //        )
    //        .then((response) => {
               
    //            setReasonForInteruption(response.data);
    //        })
    //        .catch((error) => {
           
    //        });
       
    // }
    // CAUSE_DEATH
    // const CauseDeath =()=>{
    //     axios
    //        .get(`${baseUrl}application-codesets/v2/CAUSE_DEATH`,
    //            { headers: {"Authorization" : `Bearer ${token}`} }
    //        )
    //        .then((response) => {
               
    //            setCauseDeath(response.data);
    //        })
    //        .catch((error) => {
           
    //        });
       
    // }
    const handleInputChange = e => {
        setErrors({...temp, [e.target.name]:""})
        setObjValues ({...objValues,  [e.target.name]: e.target.value});
    }
    //Validations of the forms
    const validate = () => {        
        temp.hivStatus = objValues.hivStatus ? "" : "This field is required"
        temp.statusDate = objValues.statusDate ? "" : "This field is required"
        
        setErrors({
            ...temp
        })
        return Object.values(temp).every(x => x == "")
        }     
    /**** Submit Button Processing  */
    const handleSubmit = (e) => {        
        e.preventDefault(); 
        if(validate()){       
          objValues.personId= patientObj.id
          setSaving(true);
          axios.post(`${baseUrl}hiv/status/`,objValues,
           { headers: {"Authorization" : `Bearer ${token}`}},
          
          )
              .then(response => {
                  setSaving(false);                  
                  toast.success("Client Status Update Successfully!");
                  props.setActiveContent({...props.activeContent, route:'recent-history'})

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
    }

  return (
    <div>
      <Card className={classes.root}>
        <CardBody>
          <form>
            <div className="row">
              <div className="col-md-6">
                <h2> Client Status Update </h2>
              </div>

              <br />
              <br />
              <br />
              <div className="form-group mb-3 col-md-6"></div>
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>New Status</Label>
                  <Input
                    type="select"
                    name="hivStatus"
                    id="hivStatus"
                    value={objValues.hivStatus}
                    onChange={handleInputChange}
                    style={{
                      border: "1px solid #014D88",
                      borderRadius: "0.25rem",
                    }}
                    required
                  >
                    <option value="">Select</option>
                    {getOptions("HIV_STATUS").map((value) => (
                      <option key={value.id} value={value.display}>
                        {value.display}
                      </option>
                    ))}
                  </Input>
                  {errors.hivStatus !== "" ? (
                    <span className={classes.error}>{errors.hivStatus}</span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </div>
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label for="participant_id">Date of New Status </Label>
                  <Input
                    type="date"
                    name="statusDate"
                    id="statusDate"
                    value={objValues.statusDate}
                    onChange={handleInputChange}
                    min={enrollDate}
                    max={moment(new Date()).format("YYYY-MM-DD")}
                    style={{
                      border: "1px solid #014D88",
                      borderRadius: "0.25rem",
                    }}
                    required
                  />
                  {errors.statusDate !== "" ? (
                    <span className={classes.error}>{errors.statusDate}</span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </div>

              {objValues.hivStatus === "ART Transfer Out" && (
                <>
                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label for="">Date Transfer Out</Label>
                      <Input
                        type="date"
                        name="dateArtTransferOut"
                        id="dateArtTransferOut"
                        value={objValues.dateArtTransferOut}
                        onChange={handleInputChange}
                        min={enrollDate}
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                        required
                      />
                    </FormGroup>
                  </div>
                </>
              )}
              {objValues.hivStatus === "Pre-ART Transfer Out" && (
                <>
                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label for="">Date Transfer Out</Label>
                      <Input
                        type="date"
                        name="datePreArtTransferOut"
                        id="datePreArtTransferOut"
                        value={objValues.datePreArtTransferOut}
                        onChange={handleInputChange}
                        min={enrollDate}
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                        required
                      />
                    </FormGroup>
                  </div>
                </>
              )}
              {objValues.hivStatus === "Stopped Treatment" && (
                <>
                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label for="">Date Stopped</Label>

                      <Input
                        type="date"
                        name="dateStopped"
                        id="dateStopped"
                        value={objValues.dateStopped}
                        onChange={handleInputChange}
                        min={enrollDate}
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                        required
                      />
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label>Reason For Stopping Treatment</Label>
                      <Input
                        type="select"
                        name="reasonForStoppingTreatment"
                        id="reasonForStoppingTreatment"
                        value={objValues.reasonForStoppingTreatment}
                        onChange={handleInputChange}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                        required
                      >
                        <option value=""> Select</option>
                        {getOptions("CAUSE_DEATH").map((value) => (
                          <option key={value.id} value={value.display}>
                            {value.display}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </div>
                </>
              )}
              {objValues.hivStatus === "Died (Confirmed)" && (
                <>
                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label>Cause of Death</Label>
                      <Input
                        type="select"
                        name="causeOfDeath"
                        id="causeOfDeath"
                        value={objValues.causeOfDeath}
                        onChange={handleInputChange}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                        required
                      >
                        <option value=""> Select</option>
                        {getOptions("CAUSE_DEATH").map((value) => (
                          <option key={value.id} value={value.display}>
                            {value.display}
                          </option>
                        ))}
                      </Input>
                      {errors.trackOutcome !== "" ? (
                        <span className={classes.error}>
                          {errors.trackOutcome}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label for="participant_id">Date Confirmed Died</Label>

                      <Input
                        type="date"
                        name="dateConfirmedDied"
                        id="dateConfirmedDied"
                        value={objValues.dateConfirmedDied}
                        onChange={handleInputChange}
                        min={enrollDate}
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                        required
                      />
                    </FormGroup>
                  </div>
                </>
              )}
            </div>

            {saving ? <Spinner /> : ""}
            <br />

            <MatButton
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<SaveIcon />}
              style={{ backgroundColor: "#014d88" }}
              onClick={handleSubmit}
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

export default ClientStatusUpdate;
