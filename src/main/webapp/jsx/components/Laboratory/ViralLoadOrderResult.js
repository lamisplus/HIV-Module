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
import { url as baseUrl, token } from "../../../api";
import moment from "moment";
import { List, Label as LabelSui} from 'semantic-ui-react'
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { toast} from "react-toastify";
import {Alert } from "react-bootstrap";
import { Icon,Button, } from 'semantic-ui-react'
import { queryClient } from '../../../utils/queryClient';


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
    const enrollDate = patientObj && patientObj.artCommence ? patientObj.artCommence.visitDate : null
    const classes = useStyles();
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [buttonHidden, setButtonHidden]= useState(false);
    const [moduleStatus, setModuleStatus]= useState("0")
    const [testGroup, setTestGroup] = useState([]);
    const [test, setTest] = useState([]);
    const [vlRequired, setVlRequired]=useState(false)
    const [priority, setPriority]=useState([])
    //const [currentVisit, setCurrentVisit]=useState(true)
    const [vLIndication, setVLIndication] = useState([]);
    const [testOrderList, setTestOrderList] = useState([]);//Test Order List
    const [showVLIndication, setShowVLIndication] = useState(false);
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
                                        visitId:"" 
                                    })
    useEffect(() => {
           
            CheckLabModule();
         
                TestGroup();
                PriorityOrder();
                ViraLoadIndication();
                //PatientVisit();
            
        }, [props.patientObj.id]);
        
    //Get list of Test Group
    const TestGroup =()=>{
        axios
            .get(`${baseUrl}laboratory/labtestgroups`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                setTestGroup(response.data);
            })
            .catch((error) => {
            
            });
        
    }
    //Get list of Test Group
    const PriorityOrder =()=>{
        axios
            .get(`${baseUrl}application-codesets/v2/TEST_ORDER_PRIORITY`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                setPriority(response.data);
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
    const handleSelectedTestGroup = e =>{
        setTests ({...tests,  labTestGroupId: e.target.value});
        const getTestList= testGroup.filter((x)=> x.id===parseInt(e.target.value))
        setTest(getTestList[0].labTests)
        // if(e.target.value==='4'){            
        //     setVlRequired(true)
        // }else{
        //     setVlRequired(false) 
        // }
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
    const handleInputChangeTest = e => {
        setErrors({...temp, [e.target.name]:""})//reset the error message to empty once the field as value
        
        if(e.target.value==="16"){
            setShowVLIndication(true)
            setVlRequired(true)
            setErrors({...temp, viralLoadIndication:""})
            
            setTests ({...tests,  labTestId: e.target.value});
        }else{
            setShowVLIndication(false)
            setVlRequired(false) 
            setTests ({...tests,  labTestId: e.target.value});
        }
        //setObjValues ({...objValues,  [e.target.name]: e.target.value});       
    }

    const addOrder = e => {  
         
        if(validate()){
            
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
        //temp.dateAssayed = tests.dateAssayed ? "" : "This field is required"
        temp.labTestGroupId = tests.labTestGroupId ? "" : "This field is required"
        temp.labTestId = tests.labTestId ? "" : "This field is required"
        //temp.labNumber = tests.labNumber ? "" : "This field is required"
        //temp.dateResultReceived =  tests.dateResultReceived ? "" : "This field is required"
        vlRequired && (temp.viralLoadIndication = tests.viralLoadIndication ? "" : "This field is required")
        if(tests.dateResultReceived!==""){
            temp.result = tests.result ? "" : "This field is required"
        }
        if(tests.dateResultReceived!==""){
            temp.dateAssayed = tests.dateAssayed ? "" : "This field is required"
        }
        
        setErrors({
            ...temp
        })
        return Object.values(temp).every(x => x == "")
    }
    
    const handleSubmit = (e) => {        
        e.preventDefault();            
        setSaving(true);
        axios.post(`${baseUrl}laboratory/rde-orders`,testOrderList,
            { headers: {"Authorization" : `Bearer ${token}`}},)
            .then(response => {
                 //Please do not remove
                 queryClient.invalidateQueries()
                setSaving(false);
                toast.success("Laboratory test order created successful");
                props.setActiveContent({...props.activeContent, route:'recent-history'})
            })
            .catch(error => {
                setSaving(false);
                if(error.response && error.response.data){
                    let errorMessage = error.response.data && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
                    toast.error(errorMessage); 
                }                  
            }); 
    }


  return (      
      <div >

        <div className="row">
        <div className="col-md-6">
        <h2>Viral Load Order and Result</h2>
        </div>
     
        <br/>
        <br/>
        <Card className={classes.root}>
            <CardBody>
            {moduleStatus==="1" && (
                <form >
                <div className="row">
                    
                    <Row>
                    <Col md={6} className="form-group mb-3">
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
                        </Col>
                        <Col md={6} className="form-group mb-3">
                            <FormGroup>
                                <Label for="testGroup">Select Test*</Label>
                                <Input
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
                                </Input>
                                {errors.labTestId !=="" ? (
                                    <span className={classes.error}>{errors.labTestId}</span>
                                ) : "" }
                            </FormGroup>
                        </Col>
                        <Col md={6} className="form-group mb-3">
                            <FormGroup>
                                <Label for="encounterDate"> Date Sample Collected*</Label>
                                <Input
                                    type="date"
                                    name="sampleCollectionDate"
                                    id="sampleCollectionDate"
                                    value={tests.sampleCollectionDate}
                                    onChange={handleInputChange}
                                    min={enrollDate}
                                    max= {moment(new Date()).format("YYYY-MM-DD") }
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    required
                                />
                                {errors.sampleCollectionDate !=="" ? (
                                    <span className={classes.error}>{errors.sampleCollectionDate}</span>
                                ) : "" }
                            </FormGroup>
                        </Col>
                        <Col md={6} className="form-group mb-3">
                            <FormGroup>
                                <Label for="encounterDate">PCR Sample No.</Label>
                                <Input
                                    type="text"
                                    name="labNumber"
                                    id="labNumber"
                                    //min={0}
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
                                <Label for="encounterDate">Sample Type</Label>
                                <Input
                                    type="text"
                                    name="labNumber"
                                    id="labNumber"
                                    //min={0}
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
                                <Label for="encounterDate">Sample logged remotely</Label>
                                <Input
                                    type="text"
                                    name="labNumber"
                                    id="labNumber"
                                    //min={0}
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
                                <Label for="encounterDate">Date Sample logged remotely</Label>
                                <Input
                                    type="date"
                                    name="labNumber"
                                    id="labNumber"
                                    //min={0}
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
                                <Label for="encounterDate">Date Sample Received at PCR Lab</Label>
                                <Input
                                    type="date"
                                    name="dateResultReceived"
                                    id="dateResultReceived"
                                    value={tests.dateResultReceived}
                                    min={tests.sampleCollectionDate}
                                    onChange={handleInputChange}
                                    //min={moment(tests.sampleCollectionDate).format("YYYY-MM-DD") }
                                    max= {moment(new Date()).format("YYYY-MM-DD") }
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    required
                                />
                                {errors.dateResultReceived !=="" ? (
                                    <span className={classes.error}>{errors.dateResultReceived}</span>
                                ) : "" }
                            </FormGroup>
                        </Col>
                        <Col md={6} className="form-group mb-3">
                            <FormGroup>
                                <Label for="encounterDate">Result </Label>
                                <Input
                                    type="date"
                                    name="dateAssayed"
                                    id="dateAssayed"
                                    value={tests.dateAssayed}
                                    min={tests.sampleCollectionDate!==''? tests.sampleCollectionDate :moment(new Date()).format("YYYY-MM-DD")}
                                    onChange={handleInputChange}
                                    //min={tests.sampleCollectionDate}
                                    max= {tests.dateResultReceived!==''? tests.dateResultReceived :moment(new Date()).format("YYYY-MM-DD") }
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    required
                                />
                                {errors.dateAssayed !=="" ? (
                                    <span className={classes.error}>{errors.dateAssayed}</span>
                                ) : "" }
                            </FormGroup>
                        </Col>
                        <Col md={6} className="form-group mb-3">
                            <FormGroup>
                                <Label for="encounterDate">Date Result Received </Label>
                                <Input
                                    type="date"
                                    name="dateAssayed"
                                    id="dateAssayed"
                                    value={tests.dateAssayed}
                                    min={tests.sampleCollectionDate!==''? tests.sampleCollectionDate :moment(new Date()).format("YYYY-MM-DD")}
                                    onChange={handleInputChange}
                                    //min={tests.sampleCollectionDate}
                                    max= {tests.dateResultReceived!==''? tests.dateResultReceived :moment(new Date()).format("YYYY-MM-DD") }
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    required
                                />
                                {errors.dateAssayed !=="" ? (
                                    <span className={classes.error}>{errors.dateAssayed}</span>
                                ) : "" }
                            </FormGroup>
                        </Col>
                        <Col md={6} className="form-group mb-3">
                            <FormGroup>
                                <Label for="encounterDate">Order by </Label>
                                <Input
                                    type="date"
                                    name="dateAssayed"
                                    id="dateAssayed"
                                    value={tests.dateAssayed}
                                    min={tests.sampleCollectionDate!==''? tests.sampleCollectionDate :moment(new Date()).format("YYYY-MM-DD")}
                                    onChange={handleInputChange}
                                    //min={tests.sampleCollectionDate}
                                    max= {tests.dateResultReceived!==''? tests.dateResultReceived :moment(new Date()).format("YYYY-MM-DD") }
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    required
                                />
                                {errors.dateAssayed !=="" ? (
                                    <span className={classes.error}>{errors.dateAssayed}</span>
                                ) : "" }
                            </FormGroup>
                        </Col>
                        <Col md={6} className="form-group mb-3">
                            <FormGroup>
                                <Label for="encounterDate">Date Order by</Label>
                                <Input
                                    type="date"
                                    name="dateAssayed"
                                    id="dateAssayed"
                                    value={tests.dateAssayed}
                                    min={tests.sampleCollectionDate!==''? tests.sampleCollectionDate :moment(new Date()).format("YYYY-MM-DD")}
                                    onChange={handleInputChange}
                                    //min={tests.sampleCollectionDate}
                                    max= {tests.dateResultReceived!==''? tests.dateResultReceived :moment(new Date()).format("YYYY-MM-DD") }
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    required
                                />
                                {errors.dateAssayed !=="" ? (
                                    <span className={classes.error}>{errors.dateAssayed}</span>
                                ) : "" }
                            </FormGroup>
                        </Col>
                        <Col md={6} className="form-group mb-3">
                            <FormGroup>
                                <Label for="encounterDate">Collected by </Label>
                                <Input
                                    type="date"
                                    name="dateAssayed"
                                    id="dateAssayed"
                                    value={tests.dateAssayed}
                                    min={tests.sampleCollectionDate!==''? tests.sampleCollectionDate :moment(new Date()).format("YYYY-MM-DD")}
                                    onChange={handleInputChange}
                                    //min={tests.sampleCollectionDate}
                                    max= {tests.dateResultReceived!==''? tests.dateResultReceived :moment(new Date()).format("YYYY-MM-DD") }
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    required
                                />
                                {errors.dateAssayed !=="" ? (
                                    <span className={classes.error}>{errors.dateAssayed}</span>
                                ) : "" }
                            </FormGroup>
                        </Col>
                        <Col md={6} className="form-group mb-3">
                            <FormGroup>
                                <Label for="encounterDate">Date Collected by</Label>
                                <Input
                                    type="date"
                                    name="dateAssayed"
                                    id="dateAssayed"
                                    value={tests.dateAssayed}
                                    min={tests.sampleCollectionDate!==''? tests.sampleCollectionDate :moment(new Date()).format("YYYY-MM-DD")}
                                    onChange={handleInputChange}
                                    //min={tests.sampleCollectionDate}
                                    max= {tests.dateResultReceived!==''? tests.dateResultReceived :moment(new Date()).format("YYYY-MM-DD") }
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    required
                                />
                                {errors.dateAssayed !=="" ? (
                                    <span className={classes.error}>{errors.dateAssayed}</span>
                                ) : "" }
                            </FormGroup>
                        </Col>
                        <Col md={6} className="form-group mb-3">
                            <FormGroup>
                                <Label for="encounterDate">Asseyed by </Label>
                                <Input
                                    type="date"
                                    name="dateAssayed"
                                    id="dateAssayed"
                                    value={tests.dateAssayed}
                                    min={tests.sampleCollectionDate!==''? tests.sampleCollectionDate :moment(new Date()).format("YYYY-MM-DD")}
                                    onChange={handleInputChange}
                                    //min={tests.sampleCollectionDate}
                                    max= {tests.dateResultReceived!==''? tests.dateResultReceived :moment(new Date()).format("YYYY-MM-DD") }
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    required
                                />
                                {errors.dateAssayed !=="" ? (
                                    <span className={classes.error}>{errors.dateAssayed}</span>
                                ) : "" }
                            </FormGroup>
                        </Col>
                        <Col md={6} className="form-group mb-3">
                            <FormGroup>
                                <Label for="encounterDate">Date Asseyed by</Label>
                                <Input
                                    type="date"
                                    name="dateAssayed"
                                    id="dateAssayed"
                                    value={tests.dateAssayed}
                                    min={tests.sampleCollectionDate!==''? tests.sampleCollectionDate :moment(new Date()).format("YYYY-MM-DD")}
                                    onChange={handleInputChange}
                                    //min={tests.sampleCollectionDate}
                                    max= {tests.dateResultReceived!==''? tests.dateResultReceived :moment(new Date()).format("YYYY-MM-DD") }
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    required
                                />
                                {errors.dateAssayed !=="" ? (
                                    <span className={classes.error}>{errors.dateAssayed}</span>
                                ) : "" }
                            </FormGroup>
                        </Col>
                        <Col md={6} className="form-group mb-3">
                            <FormGroup>
                                <Label for="encounterDate">Checked by </Label>
                                <Input
                                    type="date"
                                    name="dateAssayed"
                                    id="dateAssayed"
                                    value={tests.dateAssayed}
                                    min={tests.sampleCollectionDate!==''? tests.sampleCollectionDate :moment(new Date()).format("YYYY-MM-DD")}
                                    onChange={handleInputChange}
                                    //min={tests.sampleCollectionDate}
                                    max= {tests.dateResultReceived!==''? tests.dateResultReceived :moment(new Date()).format("YYYY-MM-DD") }
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    required
                                />
                                {errors.dateAssayed !=="" ? (
                                    <span className={classes.error}>{errors.dateAssayed}</span>
                                ) : "" }
                            </FormGroup>
                        </Col>
                        <Col md={6} className="form-group mb-3">
                            <FormGroup>
                                <Label for="encounterDate">Date Checked by</Label>
                                <Input
                                    type="date"
                                    name="dateAssayed"
                                    id="dateAssayed"
                                    value={tests.dateAssayed}
                                    min={tests.sampleCollectionDate!==''? tests.sampleCollectionDate :moment(new Date()).format("YYYY-MM-DD")}
                                    onChange={handleInputChange}
                                    //min={tests.sampleCollectionDate}
                                    max= {tests.dateResultReceived!==''? tests.dateResultReceived :moment(new Date()).format("YYYY-MM-DD") }
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    required
                                />
                                {errors.dateAssayed !=="" ? (
                                    <span className={classes.error}>{errors.dateAssayed}</span>
                                ) : "" }
                            </FormGroup>
                        </Col>
                        <Col md={6} className="form-group mb-3">
                            <FormGroup>
                                <Label for="encounterDate">Approved by </Label>
                                <Input
                                    type="date"
                                    name="dateAssayed"
                                    id="dateAssayed"
                                    value={tests.dateAssayed}
                                    min={tests.sampleCollectionDate!==''? tests.sampleCollectionDate :moment(new Date()).format("YYYY-MM-DD")}
                                    onChange={handleInputChange}
                                    //min={tests.sampleCollectionDate}
                                    max= {tests.dateResultReceived!==''? tests.dateResultReceived :moment(new Date()).format("YYYY-MM-DD") }
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    required
                                />
                                {errors.dateAssayed !=="" ? (
                                    <span className={classes.error}>{errors.dateAssayed}</span>
                                ) : "" }
                            </FormGroup>
                        </Col>
                        <Col md={6} className="form-group mb-3">
                            <FormGroup>
                                <Label for="encounterDate">Date Approved by</Label>
                                <Input
                                    type="date"
                                    name="dateAssayed"
                                    id="dateAssayed"
                                    value={tests.dateAssayed}
                                    min={tests.sampleCollectionDate!==''? tests.sampleCollectionDate :moment(new Date()).format("YYYY-MM-DD")}
                                    onChange={handleInputChange}
                                    //min={tests.sampleCollectionDate}
                                    max= {tests.dateResultReceived!==''? tests.dateResultReceived :moment(new Date()).format("YYYY-MM-DD") }
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    required
                                />
                                {errors.dateAssayed !=="" ? (
                                    <span className={classes.error}>{errors.dateAssayed}</span>
                                ) : "" }
                            </FormGroup>
                        </Col>

                        {tests.dateResultReceived!=="" ? (
                        <Col md={6} className="form-group mb-3">
                            <FormGroup>
                                <Label for="priority">Result *</Label>
                                <InputGroup>
                                <Input
                                    type="text"
                                    name="result"
                                    id="result"
                                    value={tests.result}
                                    onChange={handleInputChange}  
                                    style={{border: "1px solid #014D88", borderRadius:"0rem"}}                 
                                />

                                {/* <InputGroupText addonType="append" style={{ backgroundColor:"#014D88", color:"#fff", border: "1px solid #014D88", borderRadius:"0rem"}}>
                                   
                                </InputGroupText> */}
                                </InputGroup>
                                {errors.result !=="" ? (
                                    <span className={classes.error}>{errors.result}</span>
                                ) : "" }
                            </FormGroup>
                        </Col>
                       ):""
                    }
                    {vlRequired && (
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
                                </FormGroup>
                        </Col>
                        )}
                        <Col md={6} className="form-group mb-3">
                            <FormGroup>
                                <Label for="priority">Comment</Label>
                                <Input
                                    type="textarea"
                                    name="comments"
                                    id="comments"
                                    value={tests.comments}
                                    onChange={handleInputChange}  
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}                 
                                    >
                                    
                                </Input>
                                
                            </FormGroup>
                        </Col>
                        <Col md={12}>                  
                            <LabelSui as='a' color='black'  className="float-end" onClick={addOrder}  size='tiny' style={{ marginTop:20, marginBottom:20}}>
                                <Icon name='plus' /> Add Test
                            </LabelSui>
                            
                        </Col>
                        <hr/>
                        {/* List of Test Order */}
                        {testOrderList.length >0 
                            ?
                            
                            <List>
                            <Table  striped responsive>
                                <thead >
                                    <tr>
                                        <th>Test Group</th>
                                        <th>Test</th>
                                        <th>Date Sample Collected</th>
                                        <th>Date Asseyed</th>
                                        <th>Date Result Received</th>
                                        <th>VL Indication</th>
                                        <th>Result</th>                                        
                                        <th ></th>
                                    </tr>
                                </thead>
                                <tbody>
                                {testOrderList.map((tests,index) => (

                                <TestOrdersList
                                    key={index}
                                    index={index}
                                    order={tests}
                                    testGroupObj={testGroup}
                                    vLIndicationObj={vLIndication}
                                    removeOrder={removeOrder}
                                />
                                ))}
                                </tbody>
                                </Table>
                            </List>
                            :
                            ""
                        } 
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
                        disabled={testOrderList.length >0 ? false : true}
                        onClick={handleSubmit}
                        >
                        {!saving ? (
                        <span style={{ textTransform: "capitalize" }}>Save</span>
                        ) : (
                        <span style={{ textTransform: "capitalize" }}>Saving...</span>
                        )}
                    </MatButton>
                
                </form>
            )}
            {moduleStatus==="2" && (
            <>
            <Alert
                variant="warning"
                className="alert-dismissible solid fade show"
            >
                <p>Laboratory Module is not install</p>
            </Alert>
           
            </>
            )} 
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
