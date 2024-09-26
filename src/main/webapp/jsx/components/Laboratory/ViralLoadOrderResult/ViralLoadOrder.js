import React, {useState, useEffect} from 'react';
import axios from "axios";
import { Input, Label, FormGroup,Row, Col , CardBody, Card, Table, InputGroupText, InputGroup } from "reactstrap";
import MatButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import "react-widgets/dist/css/react-widgets.css";
//import moment from "moment";
import { Spinner } from "reactstrap";
import { url as baseUrl, token } from "../../../../api";
import moment from "moment";
import { List, Label as LabelSui} from 'semantic-ui-react'
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { toast} from "react-toastify";
import {Alert } from "react-bootstrap";
import { Icon,Button, } from 'semantic-ui-react'


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
    //const enrollDate = patientObj && patientObj.artCommence ? patientObj.artCommence.visitDate : null
    const classes = useStyles();
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [buttonHidden, setButtonHidden]= useState(false);
    const [moduleStatus, setModuleStatus]= useState("0")
    const [labNumber, setLabNum] = useState([]);
    const [enrollDate, setEnrollDate] = useState("");
    const [test, setTest] = useState([]);
    const [vlRequired, setVlRequired]=useState(false)
    const [labTestDetail, setLabTestDetail]=useState([])
    //const [currentVisit, setCurrentVisit]=useState(true)
    const [vLIndication, setVLIndication] = useState([]);
    const [testOrderList, setTestOrderList] = useState([]);//Test Order List
    const [showVLIndication, setShowVLIndication] = useState(false);
    let temp = { ...errors }
    const [tests, setTests]=useState({

                                        comments: "",
                                        labNumber: "",
                                        labTestGroupId: "",
                                        labTestId: "",
                                        dateCollectedBy:"",
                                        patientId:props.patientObj?props.patientObj.id:"",
                                        sampleCollectedBy:"",
                                        sampleTypeId:"",
                                        result: "",
                                        sampleCollectionDate: null,
                                        viralLoadIndication: 0,
                                        visitId:"" 
                                    })
                                    
    useEffect(() => {           
        CheckLabModule();
        LabTestDetail();
        ViraLoadIndication();
        GetPatientDTOObj();  
        }, [props.patientObj.id]);
        
        const GetPatientDTOObj =()=>{
            axios
               .get(`${baseUrl}hiv/patient/${props.patientObj.id}`,
                   { headers: {"Authorization" : `Bearer ${token}`} }
               )
               .then((response) => {
                   const patientDTO= response.data.enrollment
                   setEnrollDate (patientDTO && patientDTO.dateOfRegistration ? patientDTO.dateOfRegistration :"")
                   //setEacStatusObj(response.data);
                   
               })
               .catch((error) => {
               
               });
           
        } 
    //Get list of Test Group
    const LabTestDetail =()=>{
        axios
            .get(`${baseUrl}laboratory/labtests/viral load`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                setLabTestDetail(response.data.sampleType);
                tests.labTestGroupId= response.data.labTestGroupId
                tests.labTestId= response.data.id 
            })
            .catch((error) => {
            
            });
        
    }

    //Check if Module Exist
    const CheckLabModule =()=>{
        axios
            .get(`${baseUrl}modules/check?moduleName=laboratory`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                if(response.data===true){
                setModuleStatus("1")
                setButtonHidden(false)
                }
                else{
                    setModuleStatus("2")
                    //toast.error("Laboratory module is not install")
                    setButtonHidden(true)
                }
            }).catch((error) => {
            
            });
        
    }
    //Get list of Test Group
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
   
    const handleInputChangeObject = e => {
        setErrors({...temp, [e.target.name]:""})//reset the error message to empty once the field as value
        setTests ({...tests,  [e.target.name]: e.target.value});               
    }
    const handleInputChange = e => {
        setErrors({...temp, [e.target.name]:""})//reset the error message to empty once the field as value
        //tests.labNumber
        if(e.target.name==='labNumber'){
            const onlyPositiveNumber = e.target.value //Math.abs(e.target.value)
            setTests ({...tests,  [e.target.name]: onlyPositiveNumber});
        }else{
            setTests ({...tests,  [e.target.name]: e.target.value}); 
        }
                      
    }
   
    const addOrder = e => {  
        if(validate()){
        tests.sampleCollectionDate = moment(tests.sampleCollectionDate).format("YYYY-MM-DD HH:MM:SS")
        tests.sampleCollectionDate = moment(tests.sampleCollectionDate).format("YYYY-MM-DD HH:MM:SS") 
            tests.visitId=visitId
            setTestOrderList([...testOrderList, tests])
        }
      }
      /* Remove ADR  function **/
      const removeOrder = index => {       
        testOrderList.splice(index, 1);
        setTestOrderList([...testOrderList]);
         
      };
      //Validations of the forms
      const validate = () => {        
        temp.sampleCollectedBy = tests.sampleCollectedBy ? "" : "This field is required"
        temp.labNumber = tests.labNumber ? "" : "This field is required"
        //temp.labTestId = tests.labTestId ? "" : "This field is required"
        temp.sampleTypeId = tests.sampleTypeId ? "" : "This field is required"
        temp.sampleCollectionDate = tests.sampleCollectionDate ? "" : "This field is required"
        //temp.dateCollectedBy =  tests.dateCollectedBy ? "" : "This field is required"
        temp.viralLoadIndication = tests.viralLoadIndication ? "" : "This field is required"
       
        setErrors({
            ...temp
        })
        return Object.values(temp).every(x => x == "")
    }
    
    const handleSubmit = (e) => {        
        e.preventDefault();
        if(validate()){         
        setSaving(true);
        
        axios.post(`${baseUrl}laboratory/vl-orders`,tests,
            { headers: {"Authorization" : `Bearer ${token}`}},)
            .then(response => {
                setSaving(false);
                props.LabOrders();
                
                toast.success("Viral load order created successful");
                props.setActiveContent({...props.activeContent, route:'laboratoryViralLoadOrderResult', activeTab:"history"})
            })
            .catch(error => {
                setSaving(false);
                if(error.response && error.response.data){
                    let errorMessage = error.response.data && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
                    toast.error(errorMessage); 
                }                  
            }); 
        }  
    }


  return (      
      <div >

        <div className="row">
        <div className="col-md-6">
        <h2>Viral Load Order </h2>
        </div>
     
        <br/>
        <br/>
        <Card className={classes.root}>
            <CardBody>
            {/* {moduleStatus==="1" && ( */}
                <form >
                <div className="row">
                    
                    <Row>
                    <Col md={6} className="form-group mb-3">
                            <FormGroup>
                                <Label for="encounterDate"> Lab Number(Sample Number )*</Label>
                                <Input
                                    type="text"
                                    name="labNumber"
                                    id="labNumber"
                                    value={tests.labNumber}
                                    onChange={handleInputChange}
                                   
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    required
                                />
                                {errors.labNumber !=="" ? (
                                    <span className={classes.error}>{errors.labNumber}</span>
                                ) : "" }
                            </FormGroup>
                    </Col>
                    
                    <Col md={6} className="form-group mb-3">
                            <FormGroup>
                                <Label for="vlIndication">VL Indication*</Label>
                                <Input
                                type="select"
                                name="viralLoadIndication"
                                id="viralLoadIndication"
                                value={tests.viralLoadIndication}
                                onChange={handleInputChange}  
                                style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}                 
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
                             <Input
                                type="text"
                                name="labTestGroupId"
                                id="labTestGroupId"
                                hidden
                                value={tests.labTestGroupId}
                                                
                            />
                            <Input
                                type="text"
                                name="labTestId"
                                id="labTestId"
                                hidden
                                value={tests.labTestId}
                                                
                            />
                            </FormGroup>
                    </Col>
                    
                    <Col md={6} className="form-group mb-3">
                            <FormGroup>
                                <Label for="encounterDate">Sample Type</Label>
                                <Input
                                    type="select"
                                    name="sampleTypeId"
                                    id="sampleTypeId"
                                    //min={0}
                                    value={tests.sampleTypeId}
                                    onChange={handleInputChange}
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    required
                                >
                                    <option value="">Select </option>
                                    {labTestDetail.map((value) => (
                                        <option key={value.id} value={value.id}>
                                            {value.sampleTypeName}
                                        </option>
                                    ))}
                                </Input>
                                {errors.sampleTypeId !=="" ? (
                                    <span className={classes.error}>{errors.sampleTypeId}</span>
                                ) : "" }
                            </FormGroup>
                    </Col>
                    <Col md={6} className="form-group mb-3">
                            <FormGroup>
                                <Label for="encounterDate"> Date Sample Collected*</Label>
                                <Input
                                    type="datetime-local"
                                    name="sampleCollectionDate"
                                    id="sampleCollectionDate"
                                    value={tests.sampleCollectionDate}
                                    onChange={handleInputChange}
                                    min={enrollDate}
                                    max= {moment(new Date()).format("YYYY-MM-DD") }
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    required
                                    onKeyPress={(e) => e.preventDefault()}
                                />
                                {errors.sampleCollectionDate !=="" ? (
                                    <span className={classes.error}>{errors.sampleCollectionDate}</span>
                                ) : "" }
                            </FormGroup>
                    </Col>
                    <Col md={6} className="form-group mb-3">
                        <FormGroup>
                            <Label for="sampleCollectedBy">Collected by *</Label>
                            <Input
                                type="text"
                                name="sampleCollectedBy"
                                id="sampleCollectedBy"
                                value={tests.sampleCollectedBy}                                
                                onChange={handleInputChange}
                                style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                required
                            />
                            {errors.sampleCollectedBy !=="" ? (
                                <span className={classes.error}>{errors.sampleCollectedBy}</span>
                            ) : "" }
                        </FormGroup>
                    </Col>
                    {/* <Col md={6} className="form-group mb-3">
                        <FormGroup>
                            <Label for="encounterDate">Date Collected by *</Label>
                            <Input
                                type="date"
                                name="dateCollectedBy"
                                id="dateCollectedBy"
                                value={tests.dateCollectedBy}
                                min={tests.sampleCollectionDate!==''? tests.sampleCollectionDate :moment(new Date()).format("YYYY-MM-DD")}
                                onChange={handleInputChange}
                                //min={tests.sampleCollectionDate}
                                max= {moment(new Date()).format("YYYY-MM-DD") }
                                style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                required
                            />
                            {errors.dateCollectedBy !=="" ? (
                                <span className={classes.error}>{errors.dateCollectedBy}</span>
                            ) : "" }
                        </FormGroup>
                    </Col> */}

                    </Row>
                </div>
                    
                    {saving ? <Spinner /> : ""}
                    <br />
                
                    <MatButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        startIcon={<SaveIcon />}
                        hidden={buttonHidden}
                        style={{backgroundColor:"#014d88"}}
                        //disabled={testOrderList.length >0 ? false : true}
                        onClick={handleSubmit}
                        >
                        {!saving ? (
                        <span style={{ textTransform: "capitalize" }}>Save</span>
                        ) : (
                        <span style={{ textTransform: "capitalize" }}>Saving...</span>
                        )}
                    </MatButton>
                
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
function TestOrdersList({
    order,
    index,
    removeOrder,
    testGroupObj,
    vLIndicationObj,
  }) {
    
    const testGroupName= testGroupObj.find((x)=> x.id===parseInt(order.labTestGroupId))
    const testName= testGroupName.labTests.find((x)=> x.id===parseInt(order.labTestId))
    const vLIndication=vLIndicationObj.length>0 ?
    vLIndicationObj.find((x)=> x.id===parseInt(order.viralLoadIndication)) : {}

    return (
            <tr>
                <th>{testGroupName.groupName=='Others' && testName.labTestName==='Viral Load'?testName.labTestName: testGroupName.groupName}</th>
                <th>{testGroupName.groupName==='Others' && testName.labTestName==='Viral Load'? vLIndication.display :  testName.labTestName}</th>
                <th>{order.sampleCollectionDate}</th>
                <th>{order.dateAssayed}</th>
                <th>{order.dateResultReceived}</th>
                <th>{vLIndication && vLIndication.display ? vLIndication.display : ""}</th>
                <th>{order.result}</th>
                <th></th>
                <th >
                    <IconButton aria-label="delete" size="small" color="error" onClick={() =>removeOrder(index)}>
                        <DeleteIcon fontSize="inherit" />
                    </IconButton>
                    
                </th>
            </tr> 
    );
  }

export default Laboratory;
