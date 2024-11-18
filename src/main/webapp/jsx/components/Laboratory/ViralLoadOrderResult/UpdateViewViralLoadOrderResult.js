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
import { toast} from "react-toastify";

import { Button, } from 'semantic-ui-react'
import {TiArrowBack} from 'react-icons/ti'
import { queryClient } from '../../../../utils/queryClient';

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
    const [disabledField, setDisabledField] = useState(false);
    //const [currentVisit, setCurrentVisit]=useState(true)
    const [vLIndication, setVLIndication] = useState([]);
    const [labTestDetail, setLabTestDetail]=useState([])
    const [labNumberOption, setLabNumberOption] = useState("")
    const [showResult, setShowResult]=useState(false)
    const [showPcrLabDetail, setShowPcrLabDetail]=useState(false)
    const [labNumbers, setLabNumbers] = useState([]);//
    const [pcrs, setPcrs] = useState([]);//
    let temp = { ...errors }
    const [showObj, setShowObj] = useState(
        {
            hasResult:false,
            isPcr:false
        }
    )
    const [tests, setTests]=useState({
            approvedBy: "",
            assayedBy: "",
            checkedBy: "",
            comments: "",
            dateApproved: "",
            dateAssayedBy: "",
            dateCheckedBy: "",
            dateCollectedBy: "",
            dateOrderBy: "",
            dateReceivedAtPcrLab: "",
            dateResultReceived: "",
            dateSampleLoggedRemotely: "",
            id: "",
            labNumber: "",
            labTestGroupId: "",
            labTestId: "",
            orderBy: "",
            patientId: props.patientObj?props.patientObj.id:"",
            pcrLabName: "",
            pcrLabSampleNumber: "",
            result: "",
            sampleCollectedBy: "",
            sampleCollectionDate: "",
            sampleLoggedRemotely: "",
            sampleTypeId: "",
            viralLoadIndication: ""
    })

    useEffect(() => {
           
        CheckLabModule();
        ViraLoadIndication();
        LabTestDetail();
        PCRLabList();
        setTests(props.activeContent.obj) 
        tests.sampleCollectionDate=moment(props.activeContent.obj.sampleCollectionDate).format("YYYY-MM-DD HH:MM:SS")
        tests.dateResultReceived=props.activeContent.obj.dateResultReceived!==null && props.activeContent.obj.dateResultReceived!=="" ? moment(props.activeContent.obj.dateResultReceived).format("YYYY-MM-DD HH:MM:SS")  : ""
        showObj.isPcr=props.activeContent.obj.pcrLabName!==null && props.activeContent.obj.pcrLabName!=="" ? true :false
        showObj.hasResult=props.activeContent.obj.result!=="" && props.activeContent.obj.dateResultReceived!==null ? true :false
        tests.dateResultReceived=moment(props.activeContent.obj.dateResultReceived).format("YYYY-MM-DD HH:MM:SS")
        if(props.activeContent.obj.pcrLabName!==null && props.activeContent.obj.pcrLabName!==""){
            setShowPcrLabDetail(true)
        }else{
            setShowPcrLabDetail(false) 
        } 
        if(props.activeContent.obj.result!=="" && props.activeContent.obj.dateResultReceived!==null){
            setShowResult(true)
        }else{
            setShowResult(false)  
        } 
        if(props.activeContent && props.activeContent.actionType==='view'){
            setDisabledField(true)
        } 
    }, [props.patientObj.id, props.activeContent.obj]);
    
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

    useEffect(() => {
        const fetchTestResult = (sampleNumber) => {
            if (!sampleNumber) return;
            const modifiedSampleNumber = sampleNumber.replace(/\//g, "_");
            axios.get(`${baseUrl}lims/sample/result/${modifiedSampleNumber}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
      .then((response) => {
          const data = response.data
          const formatttedResultDate = data?.resultDate ? moment(data.resultDate).format('YYYY-MM-DDTHH:mm'): '';
            setTests((prevTests) => ({
                ...prevTests,
                result: data?.testResult || '',
                dateAssayedBy: data?.assayDate || '',
                dateResultReceived: formatttedResultDate || '',
                assayedBy: data?.testedBy || ''
            }));
        })
            .catch((error) => {
                console.error("Error fetching test result:", error); // Log any errors
            });
    };
    // Make sure activeContent.obj is available before making the API call
    if (props.activeContent?.obj?.sampleNumber) {
        setShowResult(true)
        fetchTestResult(props.activeContent.obj.sampleNumber); // Call the API with sampleNumber
    }
    console.log("Active Content Object:", props.activeContent?.obj);
}, [props.activeContent]);


    //Get list of LabNumbers
    const PCRLabList =()=>{
        axios
            .get(`${baseUrl}laboratory/get-prclabs/`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                setPcrs(response.data);
            })
            .catch((error) => {
            
            });
        
    }
    const LabTestDetail =()=>{
        axios
            .get(`${baseUrl}laboratory/labtests/viral%20load`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
    
                setLabTestDetail(response.data.sampleType);
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
    
      //Validations of the forms
      const validate = () => {  
        temp.sampleTypeId = tests.sampleTypeId ? "" : "This field is required"
        temp.sampleCollectionDate =  tests.sampleCollectionDate ? "" : "This field is required"
        temp.viralLoadIndication = tests.viralLoadIndication ? "" : "This field is required"
        temp.sampleNumber = tests.sampleNumber ? "" : "This field is required"
        temp.sampleCollectedBy = tests.sampleCollectedBy ? "" : "This field is required"
        temp.dateOrderBy = tests.dateOrderBy ? "" : "This field is required"
        temp.orderBy = tests.orderBy ? "" : "This field is required"
        showResult && (temp.dateResultReceived = tests.dateResultReceived ? "" : "This field is required")
        showResult && (temp.assayedBy = tests.assayedBy ? "" : "This field is required")
        showResult && (temp.result = tests.result ? "" : "This field is required")
        showResult && (temp.dateAssayedBy = tests.dateAssayedBy ? "" : "This field is required")


        showPcrLabDetail && ( temp.dateCheckedBy = tests.dateCheckedBy ? "" : "This field is required")
        //showPcrLabDetail && (temp.dateCollectedBy =  tests.dateCollectedBy ? "" : "This field is required")
        //showPcrLabDetail && (temp.orderBy = tests.orderBy ? "" : "This field is required")
        showPcrLabDetail && (tests.sampleLoggedRemotely ==='1'  || tests.sampleLoggedRemotely ===1 ) && (temp.dateSampleLoggedRemotely = tests.dateSampleLoggedRemotely ? "" : "This field is required")
        showPcrLabDetail && (temp.dateReceivedAtPcrLab = tests.dateReceivedAtPcrLab ? "" : "This field is required")
        //showPcrLabDetail && (temp.dateOrderBy = tests.dateOrderBy ? "" : "This field is required")
        showPcrLabDetail && (temp.pcrLabSampleNumber = tests.pcrLabSampleNumber ? "" : "This field is required")
        showPcrLabDetail && (temp.pcrLabName =  tests.pcrLabName ? "" : "This field is required")
        showPcrLabDetail && (temp.dateApproved = tests.dateApproved ? "" : "This field is required")
        showPcrLabDetail && (temp.sampleLoggedRemotely = tests.sampleLoggedRemotely ? "" : "This field is required")
        showPcrLabDetail &&  (temp.checkedBy = tests.checkedBy ? "" : "This field is required")
        showPcrLabDetail && (temp.approvedBy = tests.approvedBy ? "" : "This field is required")
        //showPcrLabDetail && (temp.sampleCollectedBy = tests.sampleCollectedBy ? "" : "This field is required")
        setErrors({
            ...temp
        })
        return Object.values(temp).every(x => x == "")
    }

    const handleSubmit = (e) => {        
        e.preventDefault();
        
        if(validate()){
            setSaving(true);
            tests.labTestGroupId= labTestDetail.labTestGroupId
            tests.labTestId= labTestDetail.id   
            //tests.pcrLabSampleNumber=tests.pcrLabName              
            
            tests.sampleCollectionDate = moment(tests.sampleCollectionDate).format("YYYY-MM-DD HH:MM:SS")
            tests.dateResultReceived =tests.dateResultReceived!==null && tests.dateResultReceived!=="" ? moment(tests.dateResultReceived).format("YYYY-MM-DD HH:MM:SS") : ""
            tests.dateReceivedAtPcrLab =tests.dateReceivedAtPcrLab!==null && tests.dateReceivedAtPcrLab!=="" ? moment(tests.dateReceivedAtPcrLab).format("YYYY-MM-DD HH:MM:SS") : ""
            axios.put(`${baseUrl}laboratory/vl-results/${props.activeContent.obj.id}`,tests,
            { headers: {"Authorization" : `Bearer ${token}`}},)
            .then(response => {
                //Please do not remove
                queryClient.invalidateQueries()
                setSaving(false);
                toast.success("Viral Load order & result updated successful!",  {position: toast.POSITION.BOTTOM_CENTER});
                //props.LabOrders();
                props.setActiveContent({...props.activeContent, route:'laboratoryViralLoadOrderResult', activeTab:"history"})
                //props.LabOrders();
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
        }
    }
    const handleCheckBox =e =>{
        if(e.target.checked){
            setShowResult(true)
            setShowObj({...showObj, hasResult:true})
        }else{
            setShowResult(false)
            setShowObj({...showObj, hasResult:false})
            setShowPcrLabDetail(false)
        }
    }
    const handleCheckBoxPCR =e =>{
        if(e.target.checked){
            setShowPcrLabDetail(true)
            setShowObj({...showObj, isPcr:true})
        }else{
            setShowPcrLabDetail(false)
            setShowObj({...showObj, isPcr:false})
        }
    }

    const Back = (row, actionType) =>{
        props.setActiveContent({...props.activeContent, route:'laboratoryViralLoadOrderResult', id:row.id, activeTab:"history", actionType:"", obj:{}})
     }
  
  return (      
      <div >

        <div className="row">
        <div className="col-md-12">
        <h2>Viral Load Order and Result
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
                    <Col md={6} className="form-group mb-3">
                        <FormGroup>
                            <Label for="encounterDate">laboratory Number</Label>                                
                            <Input
                                type="select"
                                name="labNumber"
                                id="labNumber"
                                value={tests.labNumber}
                                onChange={handleInputChange}
                                style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                disabled={disabledField}
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
                    <Col md={6} className="form-group mb-3">
                            <FormGroup>
                                <Label for="labNumber">Sample Number <span style={{ color:"red"}}> *</span></Label>
                                <Input
                                type="text"
                                name="sampleNumber"
                                id="sampleNumber"
                                value={tests.sampleNumber}
                                onChange={handleInputChange}  
                                style={{border: "1px solid #014D88", borderRadius:"0.25rem"}} 
                                disabled={disabledField}                
                                >
                                
                            </Input>
                            {errors.sampleNumber !=="" ? (
                                <span className={classes.error}>{errors.sampleNumber}</span>
                            ) : "" }
                            </FormGroup>
                    </Col>
                    <Col md={6} className="form-group mb-3">
                            <FormGroup>
                                <Label for="vlIndication">VL Indication <span style={{ color:"red"}}> *</span></Label>
                                <Input
                                type="select"
                                name="viralLoadIndication"
                                id="viralLoadIndication"
                                value={tests.viralLoadIndication}
                                onChange={handleInputChange}  
                                style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}   
                                disabled={disabledField}              
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
                    <Col md={6} className="form-group mb-3">
                            <FormGroup>
                                <Label for="encounterDate">Sample Type <span style={{ color:"red"}}> *</span></Label>
                                <Input
                                    type="select"
                                    name="sampleTypeId"
                                    id="sampleTypeId"
                                    //min={0}
                                    value={tests.sampleTypeId}
                                    onChange={handleInputChange}
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    disabled={disabledField}
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
                            <Label for="encounterDate">Order by <span style={{ color:"red"}}> *</span></Label>
                            <Input
                                type="text"
                                name="orderBy"
                                id="orderBy"
                                value={tests.orderBy}
                                
                                onChange={handleInputChange}
                                
                                style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                disabled={disabledField}
                            />
                            {errors.orderBy !=="" ? (
                                <span className={classes.error}>{errors.orderBy}</span>
                            ) : "" }
                        </FormGroup>
                    </Col>
                    <Col md={6} className="form-group mb-3">
                                <FormGroup>
                                    <Label for="encounterDate">Date Ordered  <span style={{ color:"red"}}> *</span></Label>
                                    <Input
                                        type="date"
                                        name="dateOrderBy"
                                        id="dateOrderBy"
                                        value={tests.dateOrderBy}
                                        min={enrollDate}
                                        onChange={handleInputChange}
                                        //min={tests.sampleCollectionDate}
                                        max= {moment(new Date()).format("YYYY-MM-DD") }
                                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                        disabled={disabledField}
                                        onKeyPress={(e) => e.preventDefault()}
                                    />
                                    {errors.dateOrderBy !=="" ? (
                                        <span className={classes.error}>{errors.dateOrderBy}</span>
                                    ) : "" }
                                </FormGroup>
                    </Col>
                    <Col md={6} className="form-group mb-3">
                        <FormGroup>
                            <Label for="encounterDate">Collected by <span style={{ color:"red"}}> *</span></Label>
                            <Input
                                type="text"
                                name="sampleCollectedBy"
                                id="sampleCollectedBy"
                                value={tests.sampleCollectedBy}
                                
                                onChange={handleInputChange}
                                
                                style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                disabled={disabledField}
                            />
                            {errors.sampleCollectedBy !=="" ? (
                                <span className={classes.error}>{errors.sampleCollectedBy}</span>
                            ) : "" }
                        </FormGroup>
                    </Col>
                    <Col md={6} className="form-group mb-3">
                        <FormGroup>
                            <Label for="encounterDate"> Date Sample Collected <span style={{ color:"red"}}> *</span></Label>
                            <Input
                                type="datetime-local"
                                name="sampleCollectionDate"
                                id="sampleCollectionDate"
                                value={tests.sampleCollectionDate}
                                onChange={handleInputChange}
                                
                                min={tests.dateOrderBy!==null && tests.dateOrderBy!==''? moment(tests.dateOrderBy).format("YYYY-MM-DD HH:MM:SS") :moment(enrollDate).format("YYYY-MM-DD HH:MM:SS")}
                                max= {moment(new Date()).format("YYYY-MM-DD") }
                                style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                disabled={disabledField}
                                onKeyPress={(e) => e.preventDefault()}
                            />
                            {errors.sampleCollectionDate !=="" ? (
                                <span className={classes.error}>{errors.sampleCollectionDate}</span>
                            ) : "" }
                        </FormGroup>
                    </Col>
                    
                    <Col md={6} className="mt-4 mb-3">
                        <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                       
                                name="hasResult"
                                id="hasResult"
                                value="hasResult"
                                onChange={handleCheckBox}
                                checked={showObj.hasResult}
                                style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                disabled={disabledField}
                                />
                                <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Has Result ?
                                </label>
                        </div>
                    </Col>
                    <hr/>
                    </Row>
                    {showResult && (<>
                        <Row>
                            <Col md={6} className="form-group mb-3">
                                <FormGroup>
                                    <Label for="encounterDate">Assayed by <span style={{ color:"red"}}> *</span></Label>
                                    <Input
                                        type="text"
                                        name="assayedBy"
                                        id="assayedBy"
                                        value={tests.assayedBy}                              
                                        onChange={handleInputChange}
                                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                        disabled={disabledField}
                                    />
                                    {errors.assayedBy !=="" ? (
                                        <span className={classes.error}>{errors.assayedBy}</span>
                                    ) : "" }
                                </FormGroup>
                            </Col>
                            <Col md={6} className="form-group mb-3">
                                <FormGroup>
                                    <Label for="encounterDate">Date Assayed <span style={{ color:"red"}}> *</span></Label>
                                    <Input
                                        type="date"
                                        name="dateAssayedBy"
                                        id="dateAssayedBy"
                                        value={tests.dateAssayedBy}
                                        min={moment(tests.sampleCollectionDate).format("YYYY-MM-DD")}
                                        onChange={handleInputChange}
                                        //min={tests.sampleCollectionDate}
                                        max= {moment(new Date()).format("YYYY-MM-DD") }
                                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                        disabled={disabledField}
                                        onKeyPress={(e) => e.preventDefault()}
                                    />
                                    {errors.dateAssayedBy !=="" ? (
                                        <span className={classes.error}>{errors.dateAssayedBy}</span>
                                    ) : "" }
                                </FormGroup>
                            </Col>
                            <Col md={6} className="form-group mb-3">
                                <FormGroup>
                                    <Label for="encounterDate">Date Result Received <span style={{ color:"red"}}> *</span></Label>
                                    <Input
                                        type="datetime-local"
                                        name="dateResultReceived"
                                        id="dateResultReceived"
                                        value={tests.dateResultReceived}
                                        min={moment(tests.sampleCollectionDate).format("YYYY-MM-DD HH:MM:SS")}
                                        onChange={handleInputChange}
                                        //min={tests.sampleCollectionDate}
                                        max= {moment(new Date()).format("YYYY-MM-DD HH:MM:SS")}
                                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                        disabled={disabledField}
                                        onKeyPress={(e) => e.preventDefault()}
                                    />
                                    {errors.dateResultReceived !=="" ? (
                                        <span className={classes.error}>{errors.dateResultReceived}</span>
                                    ) : "" }
                                </FormGroup>
                            </Col>
                            <Col md={6} className="form-group mb-3">
                                <FormGroup>
                                    <Label for="priority">Result <span style={{ color:"red"}}> *</span></Label>
                                    <InputGroup>
                                    <Input
                                        type="number"
                                        name="result"
                                        id="result"
                                        value={tests.result}
                                        onChange={handleInputChange}  
                                        style={{border: "1px solid #014D88", borderRadius:"0rem"}} 
                                        disabled={disabledField}                
                                    />

                                    {/* <InputGroupText addonType="append" style={{ backgroundColor:"#014D88", color:"#fff", border: "1px solid #014D88", borderRadius:"0rem"}}>
                                        
                                    </InputGroupText> */}
                                    </InputGroup>
                                    {errors.result !=="" ? (
                                        <span className={classes.error}>{errors.result}</span>
                                    ) : "" }
                                </FormGroup>
                            </Col>
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
                                        disabled={disabledField}               
                                        >
                                        
                                    </Input>
                                    
                                </FormGroup>
                            </Col>
                        </Row>
                    <Row>
                        <Col md={6} className="mt-4 mb-3">
                            <div className="form-check custom-checkbox ml-1 ">
                                    <input
                                    type="checkbox"
                                    className="form-check-input"                       
                                    name="asResultPCR"
                                    id="asResultPCR"
                                    value="asResultPCR"
                                    checked={showObj.isPcr}
                                    onChange={handleCheckBoxPCR}
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    disabled={disabledField}
                                    />
                                    <label
                                    className="form-check-label"
                                    htmlFor="basic_checkbox_1"
                                    >
                                    Has PCR Lab Details ?
                                    </label>
                            </div>
                        </Col>
                    </Row>
                    <br/>
                    <br/>
                    <hr/>
                    </>)} 
                    {showPcrLabDetail && (<>
                    <Row>
                    <Col md={6} className="form-group mb-3">
                            <FormGroup>
                                <Label for="vlIndication">PCR Lab Name <span style={{ color:"red"}}> *</span></Label>
                                <Input
                                type="select"
                                name="pcrLabName"
                                id="pcrLabName"
                                value={tests.pcrLabName}
                                onChange={handleInputChange}  
                                style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                disabled={disabledField}                 
                                >
                                <option value="">Select </option>
                                {pcrs.map((value) => (
                                        <option key={value.labNo} value={value.labNo}>
                                            {value.name}
                                        </option>
                                    ))}               
                                    
                            </Input>
                            {errors.pcrLabName !=="" ? (
                                <span className={classes.error}>{errors.pcrLabName}</span>
                            ) : "" }
                            </FormGroup>
                    </Col>
                    <Col md={6} className="form-group mb-3">
                    {tests.pcrLabName!=="" && (
                        <FormGroup>
                            <Label for="encounterDate">PCR Sample No.</Label>
                            <Input
                                type="text"
                                name="pcrLabSampleNumber"
                                id="pcrLabSampleNumber"
                                //min={0}
                                value={tests.pcrLabSampleNumber}
                                onChange={handleInputChange}
                                style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                disabled={disabledField}
                            />
                            
                        </FormGroup>
                    )}
                    </Col>
                    
                    {/* <Col md={6} className="form-group mb-3">
                                <FormGroup>
                                    <Label for="encounterDate">Date Collected *</Label>
                                    <Input
                                        type="date"
                                        name="dateCollectedBy"
                                        id="dateCollectedBy"
                                        value={tests.dateCollectedBy}
                                        min={tests.sampleCollectionDate!==''? tests.sampleCollectionDate :moment(new Date()).format("YYYY-MM-DD")}
                                        onChange={handleInputChange}
                                        //min={tests.sampleCollectionDate}
                                        max= {tests.dateResultReceived!==''? tests.dateResultReceived :moment(new Date()).format("YYYY-MM-DD") }
                                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                        required
                                    />
                                    {errors.dateCollectedBy !=="" ? (
                                        <span className={classes.error}>{errors.dateCollectedBy}</span>
                                    ) : "" }
                                </FormGroup>
                    </Col> */}
                    <Col md={6} className="form-group mb-3">
                        <FormGroup>
                            <Label for="encounterDate">Sample logged remotely </Label>
                            <Input
                                type="select"
                                name="sampleLoggedRemotely"
                                id="sampleLoggedRemotely"
                                //min={0}
                                value={tests.sampleLoggedRemotely}
                                onChange={handleInputChange}
                                style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                disabled={disabledField}
                                >
                                <option value="">Select </option>
                                <option value="1">Yes </option>
                                <option value="0">No </option>
                            </Input>
                        </FormGroup>
                    </Col>
                    {tests.sampleLoggedRemotely ==='1' && (
                    <Col md={6} className="form-group mb-3">
                        <FormGroup>
                            <Label for="encounterDate">Date Sample logged remotely <span style={{ color:"red"}}> *</span></Label>
                            <Input
                                type="date"
                                name="dateSampleLoggedRemotely"
                                id="dateSampleLoggedRemotely"
                                //min={0}
                                value={tests.dateSampleLoggedRemotely}
                                onChange={handleInputChange}
                                style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                disabled={disabledField}
                                onKeyPress={(e) => e.preventDefault()}
                            />
                            {errors.dateSampleLoggedRemotely !=="" ? (
                                <span className={classes.error}>{errors.dateSampleLoggedRemotely}</span>
                            ) : "" }
                        </FormGroup>
                    </Col>
                    )}
                    <Col md={6} className="form-group mb-3">
                        <FormGroup>
                            <Label for="encounterDate">Date Sample Received at PCR Lab <span style={{ color:"red"}}> *</span></Label>
                            <Input
                                type="datetime-local"
                                name="dateReceivedAtPcrLab"
                                id="dateReceivedAtPcrLab"
                                value={tests.dateReceivedAtPcrLab}
                                min={tests.dateReceivedAtPcrLab}
                                onChange={handleInputChange}
                                //min={moment(tests.sampleCollectionDate).format("YYYY-MM-DD") }
                                max= {moment(new Date()).format("YYYY-MM-DD") }
                                style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                disabled={disabledField}
                                onKeyPress={(e) => e.preventDefault()}
                            />
                            {errors.dateReceivedAtPcrLab !=="" ? (
                                <span className={classes.error}>{errors.dateReceivedAtPcrLab}</span>
                            ) : "" }
                        </FormGroup>
                    </Col>
                    
                    <Col md={6} className="form-group mb-3">
                        <FormGroup>
                            <Label for="encounterDate">Checked by <span style={{ color:"red"}}> *</span> </Label>
                            <Input
                                type="text"
                                name="checkedBy"
                                id="checkedBy"
                                value={tests.checkedBy}
                               
                                onChange={handleInputChange}
                               
                                style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                disabled={disabledField}
                            />
                            {errors.checkedBy !=="" ? (
                                <span className={classes.error}>{errors.checkedBy}</span>
                            ) : "" }
                        </FormGroup>
                    </Col>
                    <Col md={6} className="form-group mb-3">
                        <FormGroup>
                            <Label for="encounterDate">Date Checked <span style={{ color:"red"}}> *</span></Label>
                            <Input
                                type="date"
                                name="dateCheckedBy"
                                id="dateCheckedBy"
                                value={tests.dateCheckedBy}
                                min={tests.sampleCollectionDate!==''? tests.sampleCollectionDate :moment(new Date()).format("YYYY-MM-DD")}
                                onChange={handleInputChange}
                                //min={tests.sampleCollectionDate}
                                max= {moment(new Date()).format("YYYY-MM-DD") }
                                style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                disabled={disabledField}
                                onKeyPress={(e) => e.preventDefault()}
                            />
                            {errors.dateCheckedBy !=="" ? (
                                <span className={classes.error}>{errors.dateCheckedBy}</span>
                            ) : "" }
                        </FormGroup>
                    </Col>
                    <Col md={6} className="form-group mb-3">
                        <FormGroup>
                            <Label for="encounterDate">Approved by <span style={{ color:"red"}}> *</span></Label>
                            <Input
                                type="text"
                                name="approvedBy"
                                id="approvedBy"
                                value={tests.approvedBy}
                               
                                onChange={handleInputChange}
                                
                                style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                disabled={disabledField}
                            />
                            {errors.approvedBy !=="" ? (
                                <span className={classes.error}>{errors.approvedBy}</span>
                            ) : "" }
                        </FormGroup>
                    </Col>
                    <Col md={6} className="form-group mb-3">
                        <FormGroup>
                            <Label for="encounterDate">Date Approved <span style={{ color:"red"}}> *</span></Label>
                            <Input
                                type="date"
                                name="dateApproved"
                                id="dateApproved"
                                value={tests.dateApproved}
                                min={tests.sampleCollectionDate!==''? tests.sampleCollectionDate :moment(new Date()).format("YYYY-MM-DD")}
                                onChange={handleInputChange}
                                //min={tests.sampleCollectionDate}
                                max= {moment(new Date()).format("YYYY-MM-DD") }
                                style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                disabled={disabledField}
                                onKeyPress={(e) => e.preventDefault()}
                            />
                            {errors.dateApproved !=="" ? (
                                <span className={classes.error}>{errors.dateApproved}</span>
                            ) : "" }
                        </FormGroup>
                    </Col>
                    </Row>           
                    </>)}   
                    
                </div>
                    
                    {saving ? <Spinner /> : ""}
                    <br />
                
                    <MatButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        startIcon={<SaveIcon />}
                        hidden={disabledField}
                        style={{backgroundColor:"#014d88"}}
                        disabled={saving}
                        onClick={handleSubmit}
                        >
                        {!saving ? (
                        <span style={{ textTransform: "capitalize" }}>Update</span>
                        ) : (
                        <span style={{ textTransform: "capitalize" }}>Updating...</span>
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


export default Laboratory;
