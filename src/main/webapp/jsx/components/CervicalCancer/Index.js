import React, {useState, useEffect} from 'react';
import { Form,Row, Card,CardBody, FormGroup, Label, Input, InputGroup,InputGroupText} from 'reactstrap';
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
import 'react-summernote/dist/react-summernote.css'; // import styles
import { Spinner } from "reactstrap";

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
    }, 
    error: {
        color: "#f85032",
        fontSize: "11px",
    },
    success: {
        color: "#4BB543 ",
        fontSize: "11px",
    },
}))

const CervicalCancer = (props) => {
    const patientObj = props.patientObj;
    //let history = useHistory();
    const classes = useStyles();
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [result, setResult] = useState([]);
    const [method, setMethod] = useState([]);
    const [areas, setAreas] = useState([]);
    const [gross, setGross] = useState([]);
    const [visible, setVisible] = useState([]);
    const [referrals, setReferrals] = useState([]);
    const [type, setType] = useState([]);
    const [screeningType, setScreeningType] = useState([]);
    const [enrollDate, setEnrollDate] = useState("");
    const [objValues, setObjValues] = useState({
                                                    personId:patientObj.id,
                                                    screeningResult:"",
                                                    screenMethod:"",
                                                    screenType:"",
                                                    dateOfScreening:"", 
                                                    screeningArea:"",
                                                    screeningGross:"",
                                                    screeningRefferal:"",
                                                    screeningVisible:"",
                                                    screenTreatment:"",
                                                    papPendingingResult:"",
                                                    papGettingResult:"",                                                 
                                                    screenTreatmentMethodDate:""
                                                });
    const [observation, setObservation]=useState({
            data: {},
            dateOfObservation: "",
            facilityId: null,
            personId: patientObj.id,
            type: "Cervical cancer",
            visitId: null
    })

    useEffect(() => {
        //FunctionalStatus();
        Result();
        Type();
        Method();
        Gross();
        Referrals();
        Areas();
        Visible();
        GetPatientDTOObj();
        CERVICAL_CANCER_SCREENING_TYPE();
    }, []);
    const GetPatientDTOObj =()=>{
        axios
           .get(`${baseUrl}hiv/patient/${props.patientObj.id}`,
               { headers: {"Authorization" : `Bearer ${token}`} }
           )
           .then((response) => {
               const patientDTO= response.data.enrollment
               setEnrollDate (patientDTO && patientDTO.dateOfRegistration ? patientDTO.dateOfRegistration :"")
             
           })
           .catch((error) => {

           });
       
    }
    const Method =()=>{
    axios
        .get(`${baseUrl}application-codesets/v2/CERVICAL_CANCER_SCREENING_METHOD`,
            { headers: {"Authorization" : `Bearer ${token}`} }
        )
        .then((response) => {
            setMethod(response.data);
        })
        .catch((error) => {
        });
    
    }
    const CERVICAL_CANCER_SCREENING_TYPE =()=>{
        axios
            .get(`${baseUrl}application-codesets/v2/CERVICAL_CANCER_SCREENING_TYPE`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {

                setScreeningType(response.data);
            })
            .catch((error) => {

            });
        
    }
    const Gross =()=>{
        axios
            .get(`${baseUrl}application-codesets/v2/GROSS_CERVICAL_LESIONS`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {

                setGross(response.data);
            })
            .catch((error) => {

            });
        
    }
    const Areas =()=>{
        axios
            .get(`${baseUrl}application-codesets/v2/CERVICAL_CANCER_POSITIVE`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {

                setAreas(response.data);
            })
            .catch((error) => {

            });
        
    }
    const Visible =()=>{
        axios
            .get(`${baseUrl}application-codesets/v2/NEW_SQUAMOCOLUMNAR_JUNCTION_VISIBLE`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {

                setVisible(response.data);
            })
            .catch((error) => {

            });
        
    }
    const Referrals =()=>{
        axios
            .get(`${baseUrl}application-codesets/v2/REASON_FOR_CERVICAL_CANCER_REFERRAL`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {

                setReferrals(response.data);
            })
            .catch((error) => {

            });
        
    }
    const Type =()=>{
        axios
            .get(`${baseUrl}application-codesets/v2/CERVICAL_CANCER_TREATMENT`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {

                setType(response.data);
            })
            .catch((error) => {

            });
        
    }
    const Result =()=>{
        axios
            .get(`${baseUrl}application-codesets/v2/CERVICAL_CANCER_RESULT`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {

                setResult(response.data);
            })
            .catch((error) => {

            });
        
    }

    const handleInputChange = e => {
        setObjValues ({...objValues,  [e.target.name]: e.target.value});
        if(e.target.name==='screeningResult' && e.target.value!=='CERVICAL_CANCER_RESULT_POSITIVE'){
            objValues.screeningArea=""
            objValues.screeningVisible=""
            setObjValues ({...objValues,  ["screeningArea"]: " " });
            setObjValues ({...objValues,  ["screeningVisible"]: " " });
            setObjValues ({...objValues,  [e.target.name]: e.target.value});
        }
        if(e.target.name==='screenTreatment' && e.target.value===''){
            objValues.screenTreatmentMethodDate=""
            objValues.screenTreatmentMethodDate=""
            setObjValues ({...objValues,  ["screenTreatmentMethodDate"]: " " });
            setObjValues ({...objValues,  ["screescreenTreatmentMethodDateningVisible"]: " " });
            setObjValues ({...objValues,  [e.target.name]: e.target.value});
        }
        //objValues.screeningResult ==='CERVICAL_CANCER_RESULT_POSITIVE'
        //screeningArea screeningVisible
    }

    //FORM VALIDATION
    // const validate = () => {
    //     let temp = { ...errors }
    //     //temp.name = details.name ? "" : "This field is required"
    //     //temp.description = details.description ? "" : "This field is required"
    //     setErrors({
    //         ...temp
    //         })    
    //     return Object.values(temp).every(x => x == "")
    // }
        
    /**** Submit Button Processing  */
    const handleSubmit = (e) => {                  
        e.preventDefault();                     
        setSaving(true);
        observation.dateOfObservation= objValues.dateOfScreening       
        observation.personId =patientObj.id
        observation.data=objValues
        axios.post(`${baseUrl}observation`,observation,
        { headers: {"Authorization" : `Bearer ${token}`}},
        
        )
            .then(response => {
                setSaving(false);
                toast.success("Record save successful");
                props.setActiveContent({...props.activeContent, route:'recent-history'})
            })
            .catch(error => {
            setSaving(false);
            let errorMessage = error.response.data && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
            toast.error(errorMessage);
            });
        
    }

  return (      
         <div>                 
            <Card className={classes.root}>
                <CardBody>
                    <form >
                        <div className="row">
                            <h2> Cervical Cancer </h2>
                            <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                <Label for="artDate">Date of Screening <span style={{ color:"red"}}> *</span></Label>
                                <Input
                                     type="date" onKeyPress={(e) => e.preventDefault()}
                                    name="dateOfScreening"
                                    id="dateOfScreening"
                                    onChange={handleInputChange}
                                    min={enrollDate}
                                    max= {moment(new Date()).format("YYYY-MM-DD") }
                                    value={objValues.dateOfScreening}
                                    required
                                />
                                {errors.dateOfScreening !=="" ? (
                                    <span className={classes.error}>{errors.dateOfScreening}</span>
                                ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Screening Method <span style={{ color:"red"}}> *</span></Label>
                            <Input
                                    type="select"
                                    name="screenMethod"
                                    id="screenMethod"
                                    value={objValues.screenMethod}
                                    onChange={handleInputChange}
                                    required
                                    >
                                        <option value=""> Select</option>
                
                                        {method.map((value) => (
                                            <option key={value.id} value={value.code}>
                                                {value.display}
                                            </option>
                                        ))}
                                </Input> 
                           
                            </FormGroup>
                            </div>
                            {/* {objValues.screenMethod==='CERVICAL_CANCER_SCREENING_METHOD_PAP_SMEAR' && (
                                <>
                                <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                <Label >PAP Smear Pending Result <span style={{ color:"red"}}> *</span></Label>
                                <Input
                                        type="text"
                                        name="papPendingingResult"
                                        id="papPendingingResult"
                                        value={objValues.papPendingingResult}
                                        onChange={handleInputChange}
                                        required
                                        >
                                          
                                    </Input> 
                               
                                </FormGroup>
                                </div>
                                <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                <Label >PAP Smear Getting Result <span style={{ color:"red"}}> *</span></Label>
                                <Input
                                        type="input"
                                        name="papGettingResult"
                                        id="papGettingResult"
                                        value={objValues.papGettingResult}
                                        onChange={handleInputChange}
                                        required
                                        >
                                           
                                    </Input> 
                               
                                </FormGroup>
                                </div>
                                </>
                            )} */}
                            <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Screening Type <span style={{ color:"red"}}> *</span></Label>
                            <Input
                                    type="select"
                                    name="screenType"
                                    id="screenType"
                                    value={objValues.screenType}
                                    onChange={handleInputChange}
                                    required
                                    >
                                        <option value=""> Select</option>
                
                                        {screeningType.map((value) => (
                                            <option key={value.id} value={value.code}>
                                                {value.display}
                                            </option>
                                        ))}
                                </Input> 
                            {errors.screenType !=="" ? (
                                    <span className={classes.error}>{errors.screenType}</span>
                                ) : "" }
                            </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                <Label >Screening Result </Label>
                                <Input
                                    type="select"
                                    name="screeningResult"
                                    id="screeningResult"
                                    value={objValues.screeningResult}
                                    onChange={handleInputChange}
                                    required
                                    >
                                        <option value=""> </option>
                
                                        {result.map((value) => (
                                            <option key={value.id} value={value.code}>
                                                {value.display}
                                            </option>
                                        ))}
                                </Input>
                                {errors.screeningResult !=="" ? (
                                    <span className={classes.error}>{errors.screeningResult}</span>
                                ) : "" }
                                </FormGroup>
                            </div>
                            {objValues.screeningResult ==='CERVICAL_CANCER_RESULT_POSITIVE' && (
                            <>
                            <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                <Label >Size of an acetowhite  area </Label>
                                <Input
                                    type="select"
                                    name="screeningArea"
                                    id="screeningArea"
                                    value={objValues.screeningArea}
                                    onChange={handleInputChange}
                                    required
                                    >
                                        <option value=""> </option>
                
                                        {areas.map((value) => (
                                            <option key={value.id} value={value.code}>
                                                {value.display}
                                            </option>
                                        ))}
                                </Input>
                                {errors.screeningArea !=="" ? (
                                    <span className={classes.error}>{errors.screeningArea}</span>
                                ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >New Squamocolumnar junction visible </Label>
                            <Input
                                type="select"
                                name="screeningVisible"
                                id="screeningVisible"
                                value={objValues.screeningVisible}
                                onChange={handleInputChange}
                                required
                                >
                                    <option value=""> </option>
            
                                    {visible.map((value) => (
                                        <option key={value.id} value={value.code}>
                                            {value.display}
                                        </option>
                                    ))}
                            </Input>
                            {errors.screeningVisible !=="" ? (
                                <span className={classes.error}>{errors.screeningVisible}</span>
                            ) : "" }
                            </FormGroup>
                            </div>
                            </>
                            )} 
                            <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                <Label >Gross Cervical Lesions seen </Label>
                                <Input
                                    type="select"
                                    name="screeningGross"
                                    id="screeningGross"
                                    value={objValues.screeningGross}
                                    onChange={handleInputChange}
                                    required
                                    >
                                        <option value=""> </option>
                
                                        {gross.map((value) => (
                                            <option key={value.id} value={value.code}>
                                                {value.display}
                                            </option>
                                        ))}
                                </Input>
                                {errors.screeningGross !=="" ? (
                                    <span className={classes.error}>{errors.screeningGross}</span>
                                ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Screening Treatment </Label>
                            <Input
                                    type="select"
                                    name="screenTreatment"
                                    id="screenTreatment"
                                    value={objValues.screenTreatment}
                                    onChange={handleInputChange}
                                    required
                                    >
                                        <option value=""> Select</option>
                
                                        {type.map((value) => (
                                            <option key={value.id} value={value.code}>
                                                {value.display}
                                            </option>
                                        ))}
                                </Input>
                                {errors.screenTreatment !=="" ? (
                                    <span className={classes.error}>{errors.screenTreatment}</span>
                                ) : "" }
                            </FormGroup>
                            </div>
                            {objValues.screenTreatment!=="" && (
                            <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Screening Treatment Method Date</Label>
                            <Input
                                     type="date" onKeyPress={(e) => e.preventDefault()}
                                    name="screenTreatmentMethodDate"
                                    id="screenTreatmentMethodDate"
                                    value={objValues.screenTreatmentMethodDate}
                                    onChange={handleInputChange}
                                    min={enrollDate}
                                    max= {moment(new Date()).format("YYYY-MM-DD") }
                                    required
                                    >
                                </Input>
                                {errors.screenTreatmentMethodDate !=="" ? (
                                    <span className={classes.error}>{errors.screenTreatmentMethodDate}</span>
                                ) : "" }
                            </FormGroup>
                            </div>
                            )}                         
                            <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                <Label >Referral </Label>
                                <Input
                                    type="select"
                                    name="screeningRefferal"
                                    id="screeningRefferal"
                                    value={objValues.screeningRefferal}
                                    onChange={handleInputChange}
                                    required
                                    >
                                        <option value=""> </option>
                
                                        {referrals.map((value) => (
                                            <option key={value.id} value={value.code}>
                                                {value.display}
                                            </option>
                                        ))}
                                </Input>
                                {errors.screeningRefferal !=="" ? (
                                    <span className={classes.error}>{errors.screeningRefferal}</span>
                                ) : "" }
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
                        //disabled={objValues.screeningResult==="" || objValues.screenMethod==="" || objValues.screenType==="" || objValues.visible==="" || objValues.screeningResult===""  || objValues.gross==="" || objValues.referrals==="" || objValues.screenTreatment==="" ? true : false}
                        disabled={objValues.dateOfScreening==="" || objValues.screenMethod==="" || objValues.screenType==="" ? true : false}
                        onClick={handleSubmit}
                    >
                        {!saving ? (
                        <span style={{ textTransform: "capitalize" }}>Save</span>
                        ) : (
                        <span style={{ textTransform: "capitalize" }}>Saving...</span>
                        )}
                    </MatButton>
                    
                    <MatButton
                        variant="contained"
                        className={classes.button}
                        startIcon={<CancelIcon />}
                        
                    >
                        <span style={{ textTransform: "capitalize" }}>Cancel</span>
                    </MatButton>
                    
                    </form>
                </CardBody>
            </Card>                     
        </div>
  );
}

export default CervicalCancer;
