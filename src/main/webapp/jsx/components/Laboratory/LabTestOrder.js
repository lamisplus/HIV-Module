import React, {useState, useEffect} from 'react';
import axios from "axios";
import { Input, Label, FormGroup,Row, Col , CardBody, Card, Table } from "reactstrap";
import MatButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import "react-widgets/dist/css/react-widgets.css";
//import moment from "moment";
import { Spinner } from "reactstrap";
import { url as baseUrl, token } from "../../../api";
import useCodesets from "../../../hooks/useCodesets";
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
}))

const CODESET_KEYS = [
  "TEST_ORDER_PRIORITY",
  "VIRAL_LOAD_INDICATION",
];

const Laboratory = (props) => {
    let visitId=""
    const classes = useStyles();
    const { getOptions } = useCodesets(CODESET_KEYS);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [buttonHidden, setButtonHidden]= useState(false);
    const [moduleStatus, setModuleStatus]= useState("0")
    const [testGroup, setTestGroup] = useState([]);
    const [test, setTest] = useState([]);
    const [testOrderList, setTestOrderList] = useState([]);//Test Order List
    const [showVLIndication, setShowVLIndication] = useState(false);
    let temp = { ...errors }
    const [objValues, setObjValues] = useState({
                                                orderDate:null,
                                                patientId: props.patientObj?props.patientObj.id:"",
                                                tests: "",
                                                visitId: ""
                                            });
    const [tests, setTests]=useState({
                                        description: "",
                                        labTestGroupId: "",
                                        labTestId: "",
                                        labTestOrderStatus: 1,
                                        orderPriority: "",
                                        viralLoadIndication:""
                                    })
    useEffect(() => {
            TestGroup();
            PatientVisit();
            CheckLabModule();
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
    //Get Patiet Visit 
    const PatientVisit =()=>{
        axios
            .get(`${baseUrl}patient/visit/visit-detail/${props.patientObj.id}`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                const lastVisit = response.data[response.data.length - 1]
                if(lastVisit.status==="PENDING"){
                    visitId= lastVisit.id
                    //setCurrentVisit(true)
                    setButtonHidden(false)
                }else{
                    toast.error("Patient do not have any active visit")
                    setButtonHidden(true)
                    //setCurrentVisit(false)
                }

            })
            .catch((error) => {
            
            });        
    }
    const handleSelectedTestGroup = e =>{
        setTests ({...tests,  labTestGroupId: e.target.value});
        const getTestList= testGroup.filter((x)=> x.id===parseInt(e.target.value))
        setTest(getTestList[0].labTests)
    }
    const handleInputChangeObject = e => {
        setErrors({...temp, [e.target.name]:""})//reset the error message to empty once the field as value
        setObjValues ({...objValues,  [e.target.name]: e.target.value});               
    }
    const handleInputChange = e => {
        setErrors({...temp, [e.target.name]:""})//reset the error message to empty once the field as value
        setTests ({...tests,  [e.target.name]: e.target.value});               
    }
    const handleInputChangeTest = e => {
        setErrors({...temp, [e.target.name]:""})//reset the error message to empty once the field as value
        if(e.target.value==="16"){
            setShowVLIndication(true)
            setTests ({...tests,  labTestId: e.target.value});
        }else{
            setShowVLIndication(false)
            setTests ({...tests,  labTestId: e.target.value});
        }
        //setObjValues ({...objValues,  [e.target.name]: e.target.value});       
    }
    const addOrder = e => { 
        
        if(validate() ){
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
        temp.orderDate = objValues.orderDate ? "" : "This field is required"
        temp.labTestGroupId = tests.labTestGroupId ? "" : "This field is required"
        temp.labTestId = tests.labTestId ? "" : "This field is required"
        temp.orderPriority = tests.orderPriority ? "" : "This field is required"
        setErrors({
            ...temp
        })
        return Object.values(temp).every(x => x == "")
    }
    const labHistory =()=>{
        props.setActiveContent('lab-history')
        
    }

    const handleSubmit = (e) => {        
        e.preventDefault();   
        objValues.tests= testOrderList
        objValues.visitId= visitId 
        setSaving(true);
        axios.post(`${baseUrl}laboratory/orders`,objValues,
            { headers: {"Authorization" : `Bearer ${token}`}},)
            .then(response => {
                setSaving(false);
                toast.success("Laboratory test order created successful");
                props.setActiveContent('recent-history')
            })
            .catch(error => {
                setSaving(false);
                if(error.apierror){
                    toast.error(error.apierror.message);
                }else{
                    toast.error("Something went wrong. Please try again...");
                }                    
            }); 
    }


  return (      
      <div >

        <div className="row">
        <div className="col-md-6">
        <h2>Laboratory Test Order</h2>
        </div>
     
        <br/>
        <br/>
        <Card >
            <CardBody>
            {moduleStatus==="1" && (
                <form >
                <div className="row">
                    
                    <Row>
                        <Col md={6} className="form-group mb-3">
                            <FormGroup>
                                <Label for="encounterDate">Encounter Date*</Label>
                                <Input
                                    type="date"
                                    name="orderDate"
                                    id="orderDate"
                                    value={objValues.orderDate}
                                    onChange={handleInputChangeObject}
                                    max= {moment(new Date()).format("YYYY-MM-DD") }
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    required
                                />
                                {errors.orderDate !=="" ? (
                                    <span className={classes.error}>{errors.orderDate}</span>
                                ) : "" }
                            </FormGroup>
                        </Col>
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
                                <Label for="priority">Select Priority*</Label>
                                <Input
                                    type="select"
                                    name="orderPriority"
                                    id="orderPriority"
                                    value={tests.orderPriority}
                                    onChange={handleInputChange}  
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}                 
                                    >
                                    <option value="">Select </option>
                                                    
                                        {getOptions("TEST_ORDER_PRIORITY").map((value) => (
                                            <option key={value.id} value={value.id}>
                                                {value.display}
                                            </option>
                                        ))}
                                </Input>
                                {errors.orderPriority !=="" ? (
                                    <span className={classes.error}>{errors.orderPriority}</span>
                                ) : "" }
                            </FormGroup>
                        </Col>
                        {showVLIndication && (
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
                                                    
                                        {getOptions("VIRAL_LOAD_INDICATION").map((value) => (
                                            <option key={value.id} value={value.id}>
                                                {value.display}
                                            </option>
                                        ))}
                                </Input>
                                </FormGroup>
                        </Col>
                        )}

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
                                        <th>Priority</th>
                                        {/* {showVLIndication ?  (<th>Vira Load Indication</th>) :""} */}
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
                                    vLIndicationObj={getOptions("VIRAL_LOAD_INDICATION")}
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
                        disabled={testOrderList.length >0 || !saving ? false : true}
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
       vLIndicationObj.find((x)=> x.id===parseInt(order.viralLoadIndication)) : ""

    return (
            <tr>
                <th>{testGroupName.groupName==='Others' && testName.labTestName==='Viral Load'?testName.labTestName: testGroupName.groupName}</th>
                <th>{testGroupName.groupName==='Others' && testName.labTestName==='Viral Load'? vLIndication.display :  testName.labTestName}</th>
               <th>{order.orderPriority}</th>
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
