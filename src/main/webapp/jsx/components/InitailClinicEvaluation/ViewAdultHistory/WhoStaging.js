// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Input,
//   Label,
//   FormGroup,
//   Row,
//   Col,
//   CardBody,
//   Card,
//   Table,
//   InputGroupText,
//   InputGroup,
// } from "reactstrap";
// import MatButton from "@material-ui/core/Button";
// import { makeStyles } from "@material-ui/core/styles";
// import SaveIcon from "@material-ui/icons/Save";
// import CancelIcon from "@material-ui/icons/Cancel";
// import "react-widgets/dist/css/react-widgets.css";
// //import moment from "moment";
// import { Spinner } from "reactstrap";
// import { url as baseUrl, token } from "../../../../api";
// import moment from "moment";
// import { List, Label as LabelSui } from "semantic-ui-react";
// import IconButton from "@mui/material/IconButton";
// import DeleteIcon from "@material-ui/icons/Delete";
// import { toast } from "react-toastify";
// import { Alert } from "react-bootstrap";
// import { Icon, Button } from "semantic-ui-react";
//
// const useStyles = makeStyles((theme) => ({
//   button: {
//     margin: theme.spacing(1),
//   },
//   error: {
//     color: "#f85032",
//     fontSize: "11px",
//   },
//   success: {
//     color: "#4BB543 ",
//     fontSize: "11px",
//   },
//   root: {
//     flexGrow: 1,
//     "& .card-title": {
//       color: "#fff",
//       fontWeight: "bold",
//     },
//     "& .form-control": {
//       borderRadius: "0.25rem",
//       height: "41px",
//     },
//     "& .card-header:first-child": {
//       borderRadius: "calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0",
//     },
//     "& .dropdown-toggle::after": {
//       display: " block !important",
//     },
//     "& select": {
//       "-webkit-appearance": "listbox !important",
//     },
//     "& p": {
//       color: "red",
//     },
//     "& label": {
//       fontSize: "14px",
//       color: "#014d88",
//       fontWeight: "bold",
//     },
//   },
// }));
//
// const Laboratory = (props) => {
//   let visitId = "";
//   const patientObj = props.patientObj;
//   const enrollDate =
//     patientObj && patientObj.artCommence
//       ? patientObj.artCommence.visitDate
//       : null;
//   const classes = useStyles();
//   const [saving, setSaving] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [buttonHidden, setButtonHidden] = useState(false);
//   const [moduleStatus, setModuleStatus] = useState("0");
//   const [testGroup, setTestGroup] = useState([]);
//   const [test, setTest] = useState([]);
//   const [vlRequired, setVlRequired] = useState(false);
//   const [priority, setPriority] = useState([]);
//   const [vLIndication, setVLIndication] = useState([]);
//   const [testOrderList, setTestOrderList] = useState([]); //Test Order List
//   const [showVLIndication, setShowVLIndication] = useState(false);
//   let temp = { ...errors };
//   const [tests, setTests] = useState({
//     testOrder: "",
//     dateAssayed: "",
//     labNumber: "",
//     labTestGroupId: "",
//     labTestId: "",
//     dateResultReceived: "",
//     patientId: props.patientObj ? props.patientObj.id : "",
//     result: "",
//     sampleCollectionDate: null,
//     viralLoadIndication: 0,
//     visitId: "",
//   });
//   useEffect(() => {
//     CheckLabModule();
//
//     TestGroup();
//     PriorityOrder();
//     ViraLoadIndication();
//   }, [props.patientObj.id]);
//
//   const TestGroup = () => {
//     axios
//       .get(`${baseUrl}laboratory/labtestgroups`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((response) => {
//         setTestGroup(response.data);
//       })
//       .catch((error) => {});
//   };
//
//   const PriorityOrder = () => {
//     axios
//       .get(`${baseUrl}application-codesets/v2/TEST_ORDER_PRIORITY`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((response) => {
//         setPriority(response.data);
//       })
//       .catch((error) => {});
//   };
//
//   const CheckLabModule = () => {
//     axios
//       .get(`${baseUrl}modules/check?moduleName=laboratory`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((response) => {
//         if (response.data === true) {
//           setModuleStatus("1");
//           setButtonHidden(false);
//         } else {
//           setModuleStatus("2");
//           setButtonHidden(true);
//         }
//       })
//       .catch((error) => {});
//   };
//
//   const ViraLoadIndication = () => {
//     axios
//       .get(`${baseUrl}application-codesets/v2/VIRAL_LOAD_INDICATION`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((response) => {
//         setVLIndication(response.data);
//       })
//       .catch((error) => {});
//   };
//   const handleSelectedTestGroup = (e) => {
//     setTests({ ...tests, labTestGroupId: e.target.value });
//     const getTestList = testGroup.filter(
//       (x) => x.id === parseInt(e.target.value)
//     );
//     setTest(getTestList[0].labTests);
//   };
//   const handleInputChangeObject = (e) => {
//     setErrors({ ...temp, [e.target.name]: "" }); //reset the error message to empty once the field as value
//     setTests({ ...tests, [e.target.name]: e.target.value });
//   };
//   const handleInputChange = (e) => {
//     setErrors({ ...temp, [e.target.name]: "" }); //reset the error message to empty once the field as value
//     if (e.target.name === "labNumber") {
//       const onlyPositiveNumber = e.target.value; //Math.abs(e.target.value)
//       setTests({ ...tests, [e.target.name]: onlyPositiveNumber });
//     } else {
//       setTests({ ...tests, [e.target.name]: e.target.value });
//     }
//   };
//   const handleInputChangeTest = (e) => {
//     setErrors({ ...temp, [e.target.name]: "" }); //reset the error message to empty once the field as value
//
//     if (e.target.value === "16") {
//       setShowVLIndication(true);
//       setVlRequired(true);
//       setErrors({ ...temp, viralLoadIndication: "" });
//
//       setTests({ ...tests, labTestId: e.target.value });
//     } else {
//       setShowVLIndication(false);
//       setVlRequired(false);
//       setTests({ ...tests, labTestId: e.target.value });
//     }
//   };
//
//   const addOrder = (e) => {
//     if (validate()) {
//       tests.visitId = visitId;
//       setTestOrderList([...testOrderList, tests]);
//     }
//   };
//   /* Remove ADR  function **/
//   const removeOrder = (index) => {
//     testOrderList.splice(index, 1);
//     setTestOrderList([...testOrderList]);
//   };
//   //Validations of the forms
//   const validate = () => {
//     //temp.dateAssayed = tests.dateAssayed ? "" : "This field is required"
//     temp.labTestGroupId = tests.labTestGroupId ? "" : "This field is required";
//     temp.labTestId = tests.labTestId ? "" : "This field is required";
//     //temp.labNumber = tests.labNumber ? "" : "This field is required"
//     //temp.dateResultReceived =  tests.dateResultReceived ? "" : "This field is required"
//     vlRequired &&
//       (temp.viralLoadIndication = tests.viralLoadIndication
//         ? ""
//         : "This field is required");
//     if (tests.dateResultReceived !== "") {
//       temp.result = tests.result ? "" : "This field is required";
//     }
//     if (tests.dateResultReceived !== "") {
//       temp.dateAssayed = tests.dateAssayed ? "" : "This field is required";
//     }
//
//     setErrors({
//       ...temp,
//     });
//     return Object.values(temp).every((x) => x == "");
//   };
//
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setSaving(true);
//     axios
//       .post(`${baseUrl}laboratory/rde-orders`, testOrderList, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((response) => {
//         setSaving(false);
//         setTestOrderList([]);
//         toast.success("Laboratory test order created successful");
//         props.setActiveContent({
//           ...props.activeContent,
//           route: "recent-history",
//         });
//       })
//       .catch((error) => {
//         setSaving(false);
//         if (error.response && error.response.data) {
//           let errorMessage =
//             error.response.data && error.response.data.apierror.message !== ""
//               ? error.response.data.apierror.message
//               : "Something went wrong, please try again";
//           toast.error(errorMessage);
//         }
//       });
//   };
//
//   return (
//     <div>
//       <div className="row">
//         <div className="col-md-6">
//           <h2>Laboratory Order and Result Form</h2>
//         </div>
//
//         <br />
//         <br />
//         <Card className={classes.root}>
//           <CardBody>
//             {moduleStatus === "1" && (
//               <form>
//                 <div className="row">
//                   <Col md={6} className="form-group mb-3">
//                     <FormGroup>
//                       <Label for="">Test Order*</Label>
//                       <Input
//                         type="select"
//                         name="testOrder"
//                         id="testOrder"
//                         value={tests.testOrder}
//                         onChange={handleSelectedTestGroup}
//                         style={{
//                           border: "1px solid #014D88",
//                           borderRadius: "0.25rem",
//                         }}
//                       >
//                         <option value="">Select </option>
//
//                         {testGroup.map((value) => (
//                           <option key={value.id} value={value.id}>
//                             {value.groupName}
//                           </option>
//                         ))}
//                       </Input>
//                       {errors.testOrder !== "" ? (
//                         <span className={classes.error}>
//                           {errors.testOrder}
//                         </span>
//                       ) : (
//                         ""
//                       )}
//                     </FormGroup>
//                   </Col>
//                   <Col md={6} className="form-group mb-3">
//                     <FormGroup>
//                       <Label for="encounterDate"> Date Sample Collected*</Label>
//                       <Input
//                         type="date"
//                         name="sampleCollectionDate"
//                         id="sampleCollectionDate"
//                         value={tests.sampleCollectionDate}
//                         onChange={handleInputChange}
//                         min={enrollDate}
//                         max={moment(new Date()).format("YYYY-MM-DD")}
//                         style={{
//                           border: "1px solid #014D88",
//                           borderRadius: "0.25rem",
//                         }}
//                         required
//                         onKeyPress={(e) => e.preventDefault()}
//                       />
//                       {errors.sampleCollectionDate !== "" ? (
//                         <span className={classes.error}>
//                           {errors.sampleCollectionDate}
//                         </span>
//                       ) : (
//                         ""
//                       )}
//                     </FormGroup>
//                   </Col>
//                   <Col md={6} className="form-group mb-3">
//                     <FormGroup>
//                       <Label for="testGroup">Result*</Label>
//                       <Input
//                         type="select"
//                         name="result"
//                         id="result"
//                         value={tests.result}
//                         onChange={handleSelectedTestGroup}
//                         style={{
//                           border: "1px solid #014D88",
//                           borderRadius: "0.25rem",
//                         }}
//                       >
//                         <option value="">Select </option>
//
//                         {testGroup.map((value) => (
//                           <option key={value.id} value={value.id}>
//                             {value.groupName}
//                           </option>
//                         ))}
//                       </Input>
//                       {errors.result !== "" ? (
//                         <span className={classes.error}>{errors.result}</span>
//                       ) : (
//                         ""
//                       )}
//                     </FormGroup>
//                   </Col>
//                   <Col md={6} className="form-group mb-3">
//                     <FormGroup>
//                       <Label for="encounterDate"> Date Result Received*</Label>
//                       <Input
//                         type="date"
//                         name="resultDate"
//                         id="resultDate"
//                         value={tests.resultDate}
//                         onChange={handleInputChange}
//                         min={enrollDate}
//                         max={moment(new Date()).format("YYYY-MM-DD")}
//                         style={{
//                           border: "1px solid #014D88",
//                           borderRadius: "0.25rem",
//                         }}
//                         required
//                         onKeyPress={(e) => e.preventDefault()}
//                       />
//                       {errors.resultDate !== "" ? (
//                         <span className={classes.error}>
//                           {errors.resultDate}
//                         </span>
//                       ) : (
//                         ""
//                       )}
//                     </FormGroup>
//                   </Col>
//
//                   <Col md={12}>
//                     <LabelSui
//                       as="a"
//                       color="black"
//                       className="float-end"
//                       onClick={addOrder}
//                       size="tiny"
//                       style={{ marginTop: 20, marginBottom: 20 }}
//                     >
//                       <Icon name="plus" /> Add Test
//                     </LabelSui>
//                   </Col>
//                   <hr />
//                   {/* List of Test Order */}
//                   {testOrderList.length > 0 ? (
//                     <List>
//                       <Table striped responsive>
//                         <thead>
//                           <tr>
//                             <th>Test Order</th>
//                             <th>Date Sample Collected</th>
//                             <th>Result</th>
//                             <th>Date Result Received</th>
//                             <th></th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {testOrderList.map((tests, index) => (
//                             <TestOrdersList
//                               key={index}
//                               index={index}
//                               order={tests}
//                               testGroupObj={testGroup}
//                               vLIndicationObj={vLIndication}
//                               removeOrder={removeOrder}
//                             />
//                           ))}
//                         </tbody>
//                       </Table>
//                     </List>
//                   ) : (
//                     ""
//                   )}
//                 </div>
//                 <div className="row">
//                   <Col md={6} className="form-group mb-3">
//                     <FormGroup>
//                       <Label for="encounterDate">Reported by</Label>
//                       <Input
//                         type="text"
//                         name="reportedBy"
//                         id="reportedBy"
//                         value={tests.reportedBy}
//                         onChange={handleInputChange}
//                         style={{
//                           border: "1px solid #014D88",
//                           borderRadius: "0.25rem",
//                         }}
//                         required
//                       />
//                       {errors.reportedBy !== "" ? (
//                         <span className={classes.error}>
//                           {errors.reportedBy}
//                         </span>
//                       ) : (
//                         ""
//                       )}
//                     </FormGroup>
//                   </Col>
//                   <Col md={6} className="form-group mb-3">
//                     <FormGroup>
//                       <Label for="encounterDate">Reported Date</Label>
//                       <Input
//                         type="date"
//                         name="clinicianName"
//                         id="clinicianName"
//                         value={tests.clinicianName}
//                         onChange={handleInputChange}
//                         style={{
//                           border: "1px solid #014D88",
//                           borderRadius: "0.25rem",
//                         }}
//                         required
//                         onKeyPress={(e) => e.preventDefault()}
//                       />
//                       {errors.clinicianName !== "" ? (
//                         <span className={classes.error}>
//                           {errors.clinicianName}
//                         </span>
//                       ) : (
//                         ""
//                       )}
//                     </FormGroup>
//                   </Col>
//                   <Col md={6} className="form-group mb-3">
//                     <FormGroup>
//                       <Label for="encounterDate">Checked by</Label>
//                       <Input
//                         type="text"
//                         name="reportedBy"
//                         id="reportedBy"
//                         value={tests.reportedBy}
//                         onChange={handleInputChange}
//                         style={{
//                           border: "1px solid #014D88",
//                           borderRadius: "0.25rem",
//                         }}
//                         required
//                       />
//                       {errors.reportedBy !== "" ? (
//                         <span className={classes.error}>
//                           {errors.reportedBy}
//                         </span>
//                       ) : (
//                         ""
//                       )}
//                     </FormGroup>
//                   </Col>
//                   <Col md={6} className="form-group mb-3">
//                     <FormGroup>
//                       <Label for="encounterDate">Checked Date</Label>
//                       <Input
//                         type="date"
//                         name="clinicianName"
//                         id="clinicianName"
//                         value={tests.clinicianName}
//                         onChange={handleInputChange}
//                         style={{
//                           border: "1px solid #014D88",
//                           borderRadius: "0.25rem",
//                         }}
//                         required
//                         onKeyPress={(e) => e.preventDefault()}
//                       />
//                       {errors.clinicianName !== "" ? (
//                         <span className={classes.error}>
//                           {errors.clinicianName}
//                         </span>
//                       ) : (
//                         ""
//                       )}
//                     </FormGroup>
//                   </Col>
//                   <Col md={6} className="form-group mb-3">
//                     <FormGroup>
//                       <Label for="encounterDate">Clinician Name</Label>
//                       <Input
//                         type="date"
//                         name="clinicianName"
//                         id="clinicianName"
//                         value={tests.clinicianName}
//                         onChange={handleInputChange}
//                         style={{
//                           border: "1px solid #014D88",
//                           borderRadius: "0.25rem",
//                         }}
//                         required
//                         onKeyPress={(e) => e.preventDefault()}
//                       />
//                       {errors.clinicianName !== "" ? (
//                         <span className={classes.error}>
//                           {errors.clinicianName}
//                         </span>
//                       ) : (
//                         ""
//                       )}
//                     </FormGroup>
//                   </Col>
//                   <Col md={6} className="form-group mb-3">
//                     <FormGroup>
//                       <Label for="priority">Comment</Label>
//                       <Input
//                         type="textarea"
//                         name="comments"
//                         id="comments"
//                         value={tests.comments}
//                         onChange={handleInputChange}
//                         style={{
//                           border: "1px solid #014D88",
//                           borderRadius: "0.25rem",
//                         }}
//                       ></Input>
//                     </FormGroup>
//                   </Col>
//                 </div>
//
//                 {saving ? <Spinner /> : ""}
//                 <br />
//
//                 <MatButton
//                   type="submit"
//                   variant="contained"
//                   color="primary"
//                   className={classes.button}
//                   startIcon={<SaveIcon />}
//                   hidden={buttonHidden}
//                   style={{ backgroundColor: "#014d88" }}
//                   disabled={testOrderList.length > 0 ? false : true}
//                   onClick={handleSubmit}
//                 >
//                   {!saving ? (
//                     <span style={{ textTransform: "capitalize" }}>Save</span>
//                   ) : (
//                     <span style={{ textTransform: "capitalize" }}>
//                       Saving...
//                     </span>
//                   )}
//                 </MatButton>
//               </form>
//             )}
//             {moduleStatus === "2" && (
//               <>
//                 <Alert
//                   variant="warning"
//                   className="alert-dismissible solid fade show"
//                 >
//                   <p>Laboratory Module is not install</p>
//                 </Alert>
//               </>
//             )}
//           </CardBody>
//         </Card>
//       </div>
//     </div>
//   );
// };
// function TestOrdersList({
//   order,
//   index,
//   removeOrder,
//   testGroupObj,
//   vLIndicationObj,
// }) {
//   const testGroupName = testGroupObj.find(
//     (x) => x.id === parseInt(order.labTestGroupId)
//   );
//   const testName = testGroupName.labTests.find(
//     (x) => x.id === parseInt(order.labTestId)
//   );
//   const vLIndication =
//     vLIndicationObj.length > 0
//       ? vLIndicationObj.find(
//           (x) => x.id === parseInt(order.viralLoadIndication)
//         )
//       : {};
//
//   return (
//     <tr>
//       <th>
//         {testGroupName.groupName == "Others" &&
//         testName.labTestName === "Viral Load"
//           ? testName.labTestName
//           : testGroupName.groupName}
//       </th>
//       <th>
//         {testGroupName.groupName === "Others" &&
//         testName.labTestName === "Viral Load"
//           ? vLIndication.display
//           : testName.labTestName}
//       </th>
//       <th>{order.sampleCollectionDate}</th>
//       <th>{order.dateAssayed}</th>
//       <th>{order.dateResultReceived}</th>
//       <th>
//         {vLIndication && vLIndication.display ? vLIndication.display : ""}
//       </th>
//       <th>{order.result}</th>
//       <th></th>
//       <th>
//         <IconButton
//           aria-label="delete"
//           size="small"
//           color="error"
//           onClick={() => removeOrder(index)}
//         >
//           <DeleteIcon fontSize="inherit" />
//         </IconButton>
//       </th>
//     </tr>
//   );
// }
//
// export default Laboratory;


import React, { useEffect, useState} from "react";
import axios from "axios";
import {FormGroup, Label , CardBody, Spinner,Input,Form, InputGroup,
} from "reactstrap";
//import * as moment from 'moment';
import {makeStyles} from "@material-ui/core/styles";
import {Card, CardContent} from "@material-ui/core";

import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { useHistory, } from "react-router-dom";
// import {TiArrowBack} from 'react-icons/ti'
import {token, url as baseUrl } from "../../../../api";
import 'react-phone-input-2/lib/style.css'
import 'semantic-ui-css/semantic.min.css';
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
//import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { Button} from 'semantic-ui-react'
//import {  Modal } from "react-bootstrap";
import DualListBox from "react-dual-listbox";
import 'react-dual-listbox/lib/react-dual-listbox.css';

const useStyles = makeStyles((theme) => ({
    card: {
        margin: theme.spacing(20),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    cardBottom: {
        marginBottom: 20,
    },
    Select: {
        height: 45,
        width: 300,
    },
    button: {
        margin: theme.spacing(1),
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
    demo: {
        backgroundColor: theme.palette.background.default,
    },
    inline: {
        display: "inline",
    },
    error:{
        color: '#f85032',
        fontSize: '12.8px'
    }
}));


const BasicInfo = (props) => {
    const classes = useStyles()
    const [errors, setErrors] = useState({});
    const [selectedOptions1,setSelectedOptions1] = useState([]);
    const [selectedOptions2,setSelectedOptions2] = useState([]);
    const [selectedOptions3,setSelectedOptions3] = useState([]);
    const [selectedOptions4,setSelectedOptions4] = useState([]);
    const [clinicalStage, setClinicalStage] = useState([])
    let temp = { ...errors }
    useEffect(() => {
        WhoStaging();
        if(props.observation.data ){
            setAssesment(props.observation.data.assesment)
            setWho(props.observation.data.who)
            setSelectedOptions1(props.observation.data.who.stage1ValueOption)
            setSelectedOptions2(props.observation.data.who.stage2ValueOption)
            setSelectedOptions3(props.observation.data.who.stage3ValueOption)
            setSelectedOptions4(props.observation.data.who.stage4ValueOption)
        }
    }, [props.observation.data]);
    const WhoStaging =()=>{
        axios
            .get(`${baseUrl}application-codesets/v2/CLINICAL_STAGE`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {

                setClinicalStage(response.data);
            })
            .catch((error) => {

            });

    }
    const [who, setWho] = useState({stage:"", stage1Value:"",stage2Value:"", stage3Value:"",stage4Value:"", stage1ValueOption:"",stage2ValueOption:"", stage3ValueOption:"",stage4ValueOption:""});

    const [assesment, setAssesment] = useState({assessment:""});
    const handleAssessment =e =>{
        setAssesment({...assesment, [e.target.name]: e.target.value})

    }
    const handleWho =e =>{

        setWho({...who, [e.target.name]: e.target.value})
    }
    const handleItemClick =(page, completedMenu)=>{
        props.handleItemClick(page)
        if(props.completed.includes(completedMenu)) {

        }else{
            props.setCompleted([...props.completed, completedMenu])
        }
    }
    const validate = () => {
        temp.stage = who.stage ? "" : "This field is required"
        temp.assessment = assesment.assessment ? "" : "This field is required"

        setErrors({
            ...temp
        })
        return Object.values(temp).every(x => x == "")
    }
    /**** Submit Button Processing  */
    const handleSubmit = (e) => {
        e.preventDefault();
        if(validate()){
            props.observation.data.assesment = assesment
            props.observation.data.who=who
            handleItemClick('plan', 'who' )
        }
    }
    const onSelectedOption1 = (selectedValues) => {
        setWho({...who, stage1ValueOption: selectedValues})
        setSelectedOptions1(selectedValues);
    };
    const onSelectedOption2 = (selectedValues) => {
        setWho({...who, stage2ValueOption: selectedValues})
        setSelectedOptions2(selectedValues);
    };
    const onSelectedOption3 = (selectedValues) => {
        setSelectedOptions3(selectedValues);
        setWho({...who, stage3ValueOption: selectedValues})
    };
    const onSelectedOption4 = (selectedValues) => {
        setWho({...who, stage4ValueOption: selectedValues})
        setSelectedOptions4(selectedValues);
    };
    const options1 = [
        { value: 'Asymptomatic', label: 'Asymptomatic' },
        { value: 'Persistent generalized lymphadenopathy', label: 'Persistent generalized lymphadenopathy' },
        { value: 'Herpes Zoster (within last 5 years)', label: 'Performance scale: 1 asymptomatic, normal activity' },

    ];
    const options2 = [
        { value: 'Weight loss less than 10% of body weight', label: 'Weight loss less than 10% of body weight' },
        { value: 'Minor Mucocutaneous Manifestations', label: 'Minor Mucocutaneous Manifestations' },
        { value: 'Herpes Zoster (within last 5 years)', label: 'Herpes Zoster (within last 5 years)' },
        { value: 'Recurrent Upper Respiratory Tract Infections', label: 'Recurrent Upper Respiratory Tract Infections' },
        { value: 'Performance scale: 2 symptomatic, normal activity', label: 'Performance scale: 2 symptomatic, normal activity' },

    ];
    const options3 = [
        { value: 'Weight loss greater than 10% of body weight', label: 'Weight loss greater than 10% of body weight' },
        { value: 'Unexplained Chronic Diarrhea less than 1 month', label: 'Unexplained Chronic Diarrhea less than 1 month' },
        { value: 'Unexplained Prolonged Fever', label: 'Unexplained Prolonged Fever' },
        { value: 'Oral Candidiasis', label: 'Oral Candidiasis' },
        { value: 'Oral Hairy Leukoplakia', label: 'Oral Hairy Leukoplakia' },

        { value: 'TB, Pulmonary (within previous year)', label: 'TB, Pulmonary (within previous year)' },
        { value: 'Severe Bacterial Infections', label: 'Severe Bacterial Infections' },
        { value: 'Performance scale: 3 bedridden  less than 50% of day in last month', label: 'Performance scale: 3 bedridden  less than 50% of day in last month' },

    ];
    const options4 = [
        { value: 'HIV Wasting syndrome', label: 'HIV Wasting syndrome' },
        { value: 'PCP', label: 'PCP' },
        { value: 'Toxoplasmosis, CNS', label: 'Toxoplasmosis, CNS' },

        { value: 'Cryptosporidiosis with Diarrhea greater than 1 month', label: 'Cryptosporidiosis with Diarrhea greater than 1 month' },
        { value: 'Cryptococcosis, Extrapulmonary', label: 'Cryptococcosis, Extrapulmonary' },
        { value: 'Cytomegalovirus disease', label: 'Cytomegalovirus disease' },
        { value: 'Herpes Simplex (mucotaneous greater than 1 month)', label: 'Herpes Simplex (mucotaneous greater than 1 month)' },
        { value: 'Progressive Multifocal Leukoencephalopathy', label: 'Progressive Multifocal Leukoencephalopathy' },
        { value: 'Mycosis, disseminated', label: 'Mycosis, disseminated' },
        { value: 'Oesophageal Candidiasis', label: 'Oesophageal Candidiasis' },
        { value: 'Atypical Mycobacteriosis, disseminated', label: 'Atypical Mycobacteriosis, disseminated' },
        { value: 'Salmonella Septicemia, Non-typhoid', label: 'Salmonella Septicemia, Non-typhoid' },


        { value: 'TB, Extrapulmonary', label: 'TB, Extrapulmonary' },
        { value: 'Lymphoma', label: 'Lymphoma' },
        { value: "Kaposi's Sarcoma", label: "Kaposi's Sarcoma" },
        { value: 'HIV encephalopathy', label: 'HIV encephalopathy' },
        { value: 'Performance scale: 4 bedridden greater than 50% of the day in last month', label: 'Performance scale: 4 bedridden greater than 50% of the day in last month' },

    ];


    return (
        <>

            <Card className={classes.root}>
                <CardBody>
                    <h2 style={{color:'#000'}}>Physical Examination</h2>
                    <br/>
                    <form >
                        {/* Medical History form inputs */}
                        <div className="row">
                            <h3>Assessment <span style={{ color:"red"}}> *</span></h3>
                            <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                    <InputGroup>
                                        <Input
                                            type="select"
                                            name="assessment"
                                            id="assessment"
                                            onChange={handleAssessment}
                                            value={assesment.assessment}
                                        >
                                            <option value="">Select</option>
                                            <option value="Asymptomatic">Asymptomatic</option>
                                            <option value="Symptomatic">Symptomatic</option>
                                            <option value="AIDS defining illness">AIDS defining illness</option>
                                        </Input>

                                    </InputGroup>
                                    {errors.assessment !=="" ? (
                                        <span className={classes.error}>{errors.assessment}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-6"> </div>
                            <hr/>
                            <h3>WHO staging criteria (History of any of the following)</h3>
                            <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                    <Label >WHO STAGE <span style={{ color:"red"}}> *</span></Label>
                                    <InputGroup>
                                        <Input
                                            type="select"
                                            name="stage"
                                            id="stage"
                                            value={who.stage}
                                            onChange={handleWho}
                                        >
                                            <option value=""> Select</option>
                                            {clinicalStage.map((value) => (
                                                <option key={value.id} value={value.id}>
                                                    {value.display}
                                                </option>
                                            ))}
                                        </Input>

                                    </InputGroup>
                                    {errors.stage !=="" ? (
                                        <span className={classes.error}>{errors.stage}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>
                            {who.stage==='119' && (
                                <div className="form-group mb-3 col-md-12">
                                    <FormGroup>
                                        <Label >Stage 1 options</Label>
                                        <DualListBox
                                            //canFilter
                                            options={options1}
                                            onChange={onSelectedOption1}
                                            selected={selectedOptions1}
                                        />
                                    </FormGroup>
                                </div>
                            )}
                            {who.stage==='120' && (
                                <div className="form-group mb-3 col-md-12">
                                    <FormGroup>
                                        <Label >Stage 2 options</Label>
                                        <DualListBox
                                            //canFilter
                                            options={options2}
                                            onChange={onSelectedOption2}
                                            selected={selectedOptions2}
                                        />
                                    </FormGroup>
                                </div>
                            )}
                            {who.stage==='121' && (
                                <>
                                    <div className="form-group mb-3 col-md-12">
                                        <FormGroup>
                                            <Label >Stage 3 options</Label>
                                            <DualListBox
                                                //canFilter
                                                options={options3}
                                                onChange={onSelectedOption3}
                                                selected={selectedOptions3}
                                            />
                                        </FormGroup>
                                    </div>
                                </>
                            )}
                            {who.stage==='122' && (
                                <div className="form-group mb-3 col-md-12">
                                    <FormGroup>
                                        <Label >Stage 4 options</Label>
                                        <DualListBox
                                            //canFilter
                                            options={options4}
                                            onChange={onSelectedOption4}
                                            selected={selectedOptions4}
                                        />
                                    </FormGroup>
                                </div>
                            )}

                        </div>
                        <br/>
                        <Button content='Back' icon='left arrow' labelPosition='left' style={{backgroundColor:"#992E62", color:'#fff'}} onClick={()=>handleItemClick('appearance', 'appearance')}/>
                        <Button content='Next' type="submit" icon='right arrow' labelPosition='right' style={{backgroundColor:"#014d88", color:'#fff'}} onClick={handleSubmit}/>

                    </form>

                </CardBody>
            </Card>

        </>
    );
};

export default BasicInfo
