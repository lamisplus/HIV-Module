import React, {useState, useEffect} from 'react';
import axios from "axios";
import { Input, Label, FormGroup,Row, Col , CardBody, Card, Table } from "reactstrap";
import MatButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'
//import CancelIcon from '@material-ui/icons/Cancel'
import "react-widgets/dist/css/react-widgets.css";
//import moment from "moment";
import { Spinner } from "reactstrap";
import { url as baseUrl, token } from "../../../../api";
import moment from "moment";
import { toast} from "react-toastify";
import Select from 'react-select'
import {TiArrowBack} from 'react-icons/ti'
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({ 
    button: {
      margin: theme.spacing(1)
    },
    error: {
      color: "#f85032",
      fontSize: "11px",
  },
  success: {
      color: "#4BB543 ",
      fontSize: "11px",
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
}))

const Laboratory = (props) => {
    let visitId=""
    const patientObj = props.patientObj;
    const [enrollDate, setEnrollDate] = useState("");
    const classes = useStyles();
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    let fieldHidden=props.activeContent.actionType==='update' ? false : true;
    const [testGroup, setTestGroup] = useState([]);
    const [test, setTest] = useState([]);
    const [vLIndication, setVLIndication] = useState([]);
    const [eacStatusObj, setEacStatusObj] = useState()
    const [labNumbers, setLabNumbers] = useState([]);//
    const [selectedOption, setSelectedOption] = useState([]);
    const [defaultSelectedOption, setDefaultSelectedOption] = useState([]);
    const [labTestOptions, setLabTestOptions] = useState([]);
    let testsOptions=[]
    let temp = { ...errors }
    const [tests, setTests]=useState({

                                        comments: "",
                                        dateAssayed: "",
                                        labNumber: "",
                                        labTestGroupId: "",
                                        labTestId: "",
                                        dateResultReceived:"",
                                        patientId:props.patientObj?props.patientObj.id:"",
                                        result: "",
                                        sampleCollectionDate: null,
                                        viralLoadIndication: 0,
                                        visitId:"" ,
                                        checkedBy: "",
                                        clinicianName: "",
                                        dateChecked: "",
                                        dateResultReported: "",
                                        id: "",
                                        orderId: "",
                                        resultReportedBy: "",
                                        sampleNumber:""
    })
useEffect(() => {
        TestGroup();
        ViraLoadIndication();
        CheckEACStatus();
        GetPatientDTOObj();
        LabNumbers();
        setTests({...props.activeContent.obj})
        tests.sampleCollectionDate=moment(props.activeContent.obj.sampleCollectionDate).format("YYYY-MM-DD HH:MM:SS")
        tests.dateResultReceived=moment(props.activeContent.obj.dateResultReceived).format("YYYY-MM-DD HH:MM:SS")
        tests.dateResultReported=moment(props.activeContent.obj.dateResultReported).format("YYYY-MM-DD HH:MM:SS")
        //dateResultReported
    }, [props.patientObj.id, props.activeContent.obj]);
     //Get list of LabNumbers
     const LabNumbers =()=>{
        axios
            .get(`${baseUrl}laboratory/lab-numbers`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                setLabNumbers(response.data);
            })
            .catch((error) => {
            
            });
        
    }
    const GetPatientDTOObj =()=>{
        axios
           .get(`${baseUrl}hiv/patient/${props.patientObj.id}`,
               { headers: {"Authorization" : `Bearer ${token}`} }
           )
           .then((response) => {
               const patientDTO= response.data.enrollment
               setEnrollDate (patientDTO && patientDTO.dateOfRegistration ? patientDTO.dateOfRegistration :"")
               //setEacStatusObj(response.data);
               //
           })
           .catch((error) => {
           
           });
       
    }
     //Get EAC Status
     const CheckEACStatus =()=>{
        axios
           .get(`${baseUrl}hiv/eac/open/patient/${props.patientObj.id}`,
               { headers: {"Authorization" : `Bearer ${token}`} }
           )
           .then((response) => {
               setEacStatusObj(response.data);
           })
           .catch((error) => {
           
           });
       
    }
    //Get list of Test Group
    const TestGroup =()=>{
        axios
            .get(`${baseUrl}laboratory/labtestgroups`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                setTestGroup(response.data);
                const getTestList= response.data.filter((x)=> x.id===parseInt(props.activeContent.obj.labTestGroupId))
                setTest(getTestList[0].labTests)
                //Tests
                response.data.map((x)=> {
                    x.labTests.map((x2)=>{
                        
                        testsOptions.push({ value: x2.id, label: x2.labTestName,testGroupId:x.id, testGroupName:x.groupName, sampleType:x2.sampleType },)
                    })
                  
                })
                setLabTestOptions(testsOptions)
                setSelectedOption(
                    testsOptions.filter((y)=> y.value===props.activeContent.obj.labTestId) 
                   
                )
                setDefaultSelectedOption(testsOptions.filter((y)=> y.value===props.activeContent.obj.labTestId))
            })
            .catch((error) => {
            
            }); 
    }
   
    const ViraLoadIndication =()=>{
        axios
            .get(`${baseUrl}application-codesets/v2/VIRAL_LOAD_INDICATION`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                setVLIndication(response.data);
            })
            .catch((error) => {
            
            });        
    }
    const handleInputChange = e => {
        setErrors({...temp, [e.target.name]:""})//reset the error message to empty once the field as value
        setTests ({...tests,  [e.target.name]: e.target.value});               
    }

    const handleInputChangeObject = e => {
        setSelectedOption(e)
      
        tests.labTestGroupId=e.testGroupId
        tests.labTestId = e.value 
        tests.labTestName=e.label
        test.testGroupName=e.testGroupName              
    }

      //Validations of the forms
      const validate = () => {        
        //temp.dateAssayed = tests.dateAssayed ? "" : "This field is required"
        temp.labTestGroupId = tests.labTestGroupId ? "" : "This field is required"
        temp.labTestId = tests.labTestId ? "" : "This field is required"
        temp.sampleNumber = tests.sampleNumber ? "" : "This field is required"
        temp.sampleCollectionDate =  tests.sampleCollectionDate ? "" : "This field is required"
        //tests.labTestId==='16' && (temp.viralLoadIndication = tests.viralLoadIndication ? "" : "This field is required")
        {tests.dateResultReceived!=="" && (temp.result = tests.result ? "" : "This field is required")}
        {tests.result!=="" && (temp.dateResultReceived = tests.dateResultReceived ? "" : "This field is required")}
        setErrors({
            ...temp
        })
        return Object.values(temp).every(x => x == "")
    }
    
    const handleSubmit = (e) => {        
        e.preventDefault();            
        setSaving(true);
        if(validate()){
        tests.sampleCollectionDate = moment(tests.sampleCollectionDate).format("YYYY-MM-DD HH:MM:SS") 
        tests.dateResultReceived = moment(tests.dateResultReceived).format("YYYY-MM-DD HH:MM:SS")
        
        axios.put(`${baseUrl}laboratory/rde-orders/tests/${props.activeContent.obj.id}`,tests,
            { headers: {"Authorization" : `Bearer ${token}`}},)
            .then(response => {
                setSaving(false);
                toast.success("Laboratory order & result updated successful",  {position: toast.POSITION.BOTTOM_CENTER});
                setTests({
                    comments: "",
                    dateAssayed: "",
                    labNumber: "",
                    labTestGroupId: "",
                    labTestId: "",
                    dateResultReceived:"",
                    patientId:props.patientObj?props.patientObj.id:"",
                    result: "",
                    sampleCollectionDate: "",
                    viralLoadIndication: "",
                    visitId:"" ,
                    checkedBy: "",
                    clinicianName: "",
                    dateChecked: "",
                    dateResultReported: "",
                    id: "",
                    orderId: "",
                    resultReportedBy: "",
                })
                setTestOrderList([])
                props.setActiveContent({...props.activeContent, route:'laboratoryOrderResult', id:props.activeContent.obj.id, activeTab:"history", actionType:"update", obj:props.activeContent.obj})
            })
            .catch(error => {
                setSaving(false);
                if(error.response && error.response.data){
                    let errorMessage = error.response.data && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
                    toast.error(errorMessage,  {position: toast.POSITION.BOTTOM_CENTER}); 
                }else{
                    toast.error("Something went wrong. Please try again...",  {position: toast.POSITION.BOTTOM_CENTER}); 
                }                  
            });
        }else{
            setSaving(false);
            toast.error("All field are required" ,  {position: toast.POSITION.BOTTOM_CENTER}); 
        } 
    }
    const Back = (row, actionType) =>{  
        // props.setActiveContent({...props.activeContent, route:'pharmacy', activeTab:"hsitory"})
        
        props.setActiveContent({...props.activeContent, route:'laboratoryOrderResult', id:row.id, activeTab:"history", actionType:"", obj:{}})
     }

  

  return (      
      <div >

        <div className="row">
        <div className="col-md-12">
        <h2>Laboratory Order & Result 
        <Button
            variant="contained"
            color="primary"
            className=" float-end ms-1"
            style={{backgroundColor:'#014d88',fontWeight:"bolder"}}
            startIcon={<TiArrowBack />}
            onClick={()=>Back(props.activeContent.obj, 'view')}
        >
            <span style={{ textTransform: "capitalize", color:'#fff' }}>Back </span>
        </Button>
        </h2>
        </div>
        <br/>
        <br/>
        <Card className={classes.root}>
            <CardBody>
            {/* {moduleStatus==="1" && ( */}
                <form >
                <div className="row">
                    
                    <Row>
                    <Col md={4} className="form-group mb-3">
                            <FormGroup>
                                <Label for="encounterDate">laboratory Number</Label>                                
                                <Input
                                    type="select"
                                    name="labNumber"
                                    id="labNumber"
                                    value={tests.labNumber}
                                    onChange={handleInputChange}
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    disabled={fieldHidden}
                                >
                                     <option value="">Select </option>
                                        
                                        {labNumbers.map((value) => (
                                            <option key={value.id} value={value.id}>
                                                {value.labNumber}
                                            </option>
                                        ))}

                                </Input>
                                
                            </FormGroup>
                    </Col>
                        <Col md={4} className="form-group mb-3">
                            <FormGroup>
                                <Label for="encounterDate">Sample Number <span style={{ color:"red"}}> *</span></Label>
                                <Input
                                    type="text"
                                    name="sampleNumber"
                                    id="sampleNumber"
                                    value={tests.sampleNumber}
                                    onChange={handleInputChange}
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    disabled={fieldHidden}
                                />
                                {errors.sampleNumber !=="" ? (
                                    <span className={classes.error}>{errors.sampleNumber}</span>
                                ) : "" }
                            </FormGroup>
                        </Col>
                        {/* <Col md={4} className="form-group mb-3">
                            <FormGroup>
                                <Label for="testGroup">Select Test Group*</Label>
                                <Input
                                    type="select"
                                    name="labTestGroupId"
                                    id="labTestGroupId"
                                    value={tests.labTestGroupId}
                                    onChange={handleSelectedTestGroup} 
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}                  
                                    >
                                    <option value="">Select </option>
                                                    
                                        {testGroup.map((value) => (
                                            <option key={value.id} value={value.id}>
                                                {value.groupName}
                                            </option>
                                        ))}
                                </Input>
                                {errors.labTestGroupId !=="" ? (
                                    <span className={classes.error}>{errors.labTestGroupId}</span>
                                ) : "" }
                            </FormGroup>
                        </Col> */}
                        <Col md={4} className="form-group mb-3">
                            <FormGroup>
                                <Label for="testGroup">Select Test <span style={{ color:"red"}}> *</span></Label>
                                {/* <Input
                                    type="select"
                                    name="labTestId"
                                    id="labTestId"
                                    value={tests.labTestId}
                                    onChange={handleInputChangeTest} 
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}                  
                                    >
                                    <option value="">Select </option>
                                                    
                                        {test.map((value) => (
                                            <option key={value.id} value={value.id}>
                                                {value.labTestName}
                                            </option>
                                        ))}
                                </Input> */}
                                <Select
                                    defaultValue={defaultSelectedOption}
                                    value={selectedOption}
                                    onChange={handleInputChangeObject}
                                    options={labTestOptions}
                                    disabled={fieldHidden}
                                    
                                />
                                {errors.labTestId !=="" ? (
                                    <span className={classes.error}>{errors.labTestId}</span>
                                ) : "" }
                            </FormGroup>
                        </Col>
                        <Col md={4} className="form-group mb-3">
                            <FormGroup>
                                <Label for="encounterDate"> Date Sample Collected <span style={{ color:"red"}}> *</span></Label>
                                <Input
                                    type="datetime-local"
                                    name="sampleCollectionDate"
                                    id="sampleCollectionDate"
                                    value={tests.sampleCollectionDate}
                                    onChange={handleInputChange}
                                    //min={eacStatusObj && eacStatusObj.eacsession && eacStatusObj.eacsession!=='Default' ? eacStatusObj.eacsessionDate :enrollDate}
                                    min={enrollDate}
                                    max= {moment(new Date()).format("YYYY-MM-DD") }
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    disabled={fieldHidden}
                                />
                                {errors.sampleCollectionDate !=="" ? (
                                    <span className={classes.error}>{errors.sampleCollectionDate}</span>
                                ) : "" }
                            </FormGroup>
                        </Col>
                        <Col md={4} className="form-group mb-3">
                            <FormGroup>
                                <Label for="encounterDate">Date Result Received {tests.result!==""? (<span style={{ color:"red"}}> *</span> ) : "" }</Label>
                                <Input
                                    type="datetime-local"
                                    name="dateResultReceived"
                                    id="dateResultReceived"
                                    value={tests.dateResultReceived}
                                    onChange={handleInputChange}
                                    min={tests.sampleCollectionDate}
                                    max= {moment(new Date()).format("YYYY-MM-DD") }
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    disabled={fieldHidden}
                                />
                                {errors.dateResultReceived !=="" ? (
                                    <span className={classes.error}>{errors.dateResultReceived}</span>
                                ) : "" }
                            </FormGroup>
                        </Col>                       
                        { tests.labTestId===50 ? 
                        (<>
                            <div className="form-group  col-md-3">
                                <FormGroup>
                                    <Label>Result {tests.dateResultReceived!==""? (<span style={{ color:"red"}}> *</span> ) : "" }</Label>
                                    <select
                                        className="form-control"
                                        name="result"
                                        id="result"
                                        value={tests.result}
                                        onChange={handleInputChange}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}>Select</option>
                                        <option value="<200">{"<200"}</option>
                                        <option value=">=200">{">=200"}</option>
                                        
                                    </select>
                                    {errors.result !=="" ? (
                                        <span className={classes.error}>{errors.result}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>
                        </>)
                        :
                        (<>
                            <Col md={4} className="form-group mb-3">
                                <FormGroup>
                                    <Label for="priority">Result {tests.dateResultReceived!==""? (<span style={{ color:"red"}}> *</span> ) : "" }</Label>
                                    
                                    <Input
                                        type="text"
                                        name="result"
                                        id="result"
                                        value={tests.result}
                                        onChange={handleInputChange}  
                                        style={{border: "1px solid #014D88", borderRadius:"0rem"}}
                                        disabled={fieldHidden}                 
                                    />
                                    {errors.result !=="" ? (
                                        <span className={classes.error}>{errors.result}</span>
                                    ) : "" }
                                </FormGroup>
                            </Col>
                        </>)
                    }
                       {tests.labTestId==='16' || tests.labTestId===16 && (
                        <Col md={4} className="form-group mb-3">
                                <FormGroup>
                                    <Label for="vlIndication">VL Indication <span style={{ color:"red"}}> *</span></Label>
                                    <Input
                                    type="select"
                                    name="viralLoadIndication"
                                    id="viralLoadIndication"
                                    value={tests.viralLoadIndication}
                                    onChange={handleInputChange}  
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}} 
                                    disabled={fieldHidden}                
                                    >
                                    <option value="">Select </option>
                                                    
                                        {vLIndication.map((value) => (
                                            <option key={value.id} value={value.id}>
                                                {value.display}
                                            </option>
                                        ))}
                                </Input>
                                {errors.viralLoadIndication !=="" ? (
                                    <span className={classes.error}>{errors.viralLoadIndication}</span>
                                ) : "" }
                                </FormGroup>
                        </Col>
                        )}
                        <Col md={4} className="form-group mb-3">
                            <FormGroup>
                                <Label for="encounterDate">Reported by</Label>
                                <Input
                                    type="text"
                                    name="resultReportedBy"
                                    id="resultReportedBy"
                                    value={tests.resultReportedBy}
                                    onChange={handleInputChange}
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    disabled={fieldHidden}
                                />
                                {errors.resultReportedBy !=="" ? (
                                    <span className={classes.error}>{errors.resultReportedBy}</span>
                                ) : "" }
                            </FormGroup>
                        </Col>
                        <Col md={4} className="form-group mb-3">
                            <FormGroup>
                                <Label for="encounterDate">Reported Date</Label>
                                <Input
                                    type="date"
                                    name="dateResultReported"
                                    id="dateResultReported"
                                    value={tests.dateResultReported}
                                    min={moment(tests.sampleCollectionDate).format("YYYY-MM-DD")}
                                    max= {moment(new Date()).format("YYYY-MM-DD") }
                                    onChange={handleInputChange}
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    disabled={fieldHidden}
                                />
                                {errors.dateResultReported !=="" ? (
                                    <span className={classes.error}>{errors.dateResultReported}</span>
                                ) : "" }
                            </FormGroup>
                        </Col>
                        <Col md={4} className="form-group mb-3">
                            <FormGroup>
                                <Label for="encounterDate">Checked by</Label>
                                <Input
                                    type="text"
                                    name="checkedBy"
                                    id="checkedBy"
                                    value={tests.checkedBy}
                                    onChange={handleInputChange}
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    disabled={fieldHidden}
                                />
                                {errors.checkedBy !=="" ? (
                                    <span className={classes.error}>{errors.checkedBy}</span>
                                ) : "" }
                            </FormGroup>
                        </Col>
                        <Col md={4} className="form-group mb-3">
                            <FormGroup>
                                <Label for="encounterDate">Checked Date</Label>
                                <Input
                                    type="date"
                                    name="dateChecked"
                                    id="dateChecked"
                                    value={tests.dateChecked}
                                    onChange={handleInputChange}
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    disabled={fieldHidden}
                                />
                                {errors.dateChecked !=="" ? (
                                    <span className={classes.error}>{errors.dateChecked}</span>
                                ) : "" }
                            </FormGroup>
                        </Col>
                        <Col md={4} className="form-group mb-3">
                            <FormGroup>
                                <Label for="encounterDate">Clinician Name</Label>
                                <Input
                                    type="text"
                                    name="clinicianName"
                                    id="clinicianName"
                                    value={tests.clinicianName}
                                    onChange={handleInputChange}
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    disabled={fieldHidden}
                                />
                                {errors.clinicianName !=="" ? (
                                    <span className={classes.error}>{errors.clinicianName}</span>
                                ) : "" }
                            </FormGroup>
                        </Col> 
                    </Row>
                       
                    </div>

                    
                    {saving ? <Spinner /> : ""}
                    <br />
                    {props.activeContent.actionType==='update' ? (
                        <MatButton
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            startIcon={<SaveIcon />}
                            hidden={fieldHidden}
                            style={{backgroundColor:"#014d88"}}
                            disabled={ !saving ? false : true}
                            onClick={handleSubmit}
                            >
                            {!saving ? (
                            <span style={{ textTransform: "capitalize" }}>Update</span>
                            ) : (
                            <span style={{ textTransform: "capitalize" }}>Updating...</span>
                            )}
                        </MatButton>
                        )
                        :""
                    }
                
                </form>
            {/* )}
            {moduleStatus==="2" && (
            <>
            <Alert
                variant="warning"
                className="alert-dismissible solid fade show"
            >
                <p>Laboratory Module is not install</p>
            </Alert>
           
            </>
            )}  */}
            </CardBody>
        </Card> 
        </div>             
    </div>
  );
}


export default Laboratory;
