import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Input,
  Label,
  FormGroup,
  Row,
  Col,
  CardBody,
  Card,
  Table,
  InputGroupText,
  InputGroup,
} from "reactstrap";
import MatButton from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";
import Edit from "@material-ui/icons/Edit";
import "react-widgets/dist/css/react-widgets.css";
//import moment from "moment";
import { Spinner } from "reactstrap";
import { url as baseUrl, token } from "../../../../api";
import moment from "moment";
import { List, Label as LabelSui } from "semantic-ui-react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { toast } from "react-toastify";
import { Icon } from "semantic-ui-react";
import Select from "react-select";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
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
    "& .card-title": {
      color: "#fff",
      fontWeight: "bold",
    },
    "& .form-control": {
      borderRadius: "0.25rem",
      height: "41px",
    },
    "& .card-header:first-child": {
      borderRadius: "calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0",
    },
    "& .dropdown-toggle::after": {
      display: " block !important",
    },
    "& select": {
      "-webkit-appearance": "listbox !important",
    },
    "& p": {
      color: "red",
    },
    "& label": {
      fontSize: "14px",
      color: "#014d88",
      fontWeight: "bold",
    },
  },
}));

const Laboratory = (props) => {
  let visitId = "";
  //let =""
  const patientObj = props.patientObj;
  //const enrollDate = patientObj && patientObj.artCommence ? patientObj.artCommence.visitDate : null
  const [enrollDate, setEnrollDate] = useState("");
  const classes = useStyles();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [buttonHidden, setButtonHidden] = useState(false);
  const [moduleStatus, setModuleStatus] = useState("0");
  const [testGroup, setTestGroup] = useState([]);
  //const [test, setTest] = useState([]);
  //const [vlRequired, setVlRequired]=useState(false)
  const [priority, setPriority] = useState([]);
  const [eacStatusObj, setEacStatusObj] = useState();
  //const [labNumberOption, setLabNumberOption] = useState("")
  //const [currentVisit, setCurrentVisit]=useState(true)
  const [vLIndication, setVLIndication] = useState([]);
  const [testOrderList, setTestOrderList] = useState([]); //Test Order List
  //const [showVLIndication, setShowVLIndication] = useState(false);
  const [labNumbers, setLabNumbers] = useState([]); //
  const [selectedOption, setSelectedOption] = useState([]);
  const [labTestOptions, setLabTestOptions] = useState([]);
  const [labOrderIndication, setLabOrderIndication] = useState([]);
  let testsOptions = [];
  let temp = { ...errors };
  const [tests, setTests] = useState({
    comments: "",
    dateAssayed: "",
    labNumber: "",
    labTestGroupId: "",
    labTestId: "",
    labOrderIndication: "",
    dateResultReceived: "",
    orderedDate: "",
    patientId: props.patientObj ? props.patientObj.id : "",
    result: "",
    sampleCollectionDate: null,
    viralLoadIndication: "",
    visitId: "",
    checkedBy: "",
    clinicianName: "",
    dateChecked: "",
    dateResultReported: "",
    id: "",
    orderId: "",
    resultReportedBy: "",
    sampleNumber: "",
  });

  useEffect(() => {
    CheckLabModule();
    TestGroup();
    PriorityOrder();
    ViraLoadIndication();
    GetPatientDTOObj();
    CheckEACStatus();
    LabNumbers();
    LAB_ORDER_INDICATION();
  }, [props.patientObj.id, tests.labTestId]);
  const GetPatientDTOObj = () => {
    axios
      .get(`${baseUrl}hiv/patient/${props.patientObj.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const patientDTO = response.data.enrollment;
        setEnrollDate(
          patientDTO && patientDTO.dateOfRegistration
            ? patientDTO.dateOfRegistration
            : ""
        );
        //setEacStatusObj(response.data);
        //
      })
      .catch((error) => {});
  };
  //Get list of LabNumbers
  const LabNumbers = () => {
    axios
      .get(`${baseUrl}laboratory/lab-numbers`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setLabNumbers(response.data);
      })
      .catch((error) => {});
  };
  //Get EAC Status
  const CheckEACStatus = () => {
    axios
      .get(`${baseUrl}hiv/eac/open/patient/${props.patientObj.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setEacStatusObj(response.data);
      })
      .catch((error) => {});
  };
  //Get list of Test Group
  const TestGroup = () => {
    axios
      .get(`${baseUrl}laboratory/labtestgroups`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTestGroup(response.data);
        response.data.map((x) => {
          x.labTests.map((x2) => {
            testsOptions.push({
              value: x2.id,
              label: x2.labTestName,
              testGroupId: x.id,
              testGroupName: x.groupName,
              sampleType: x2.sampleType,
            });
          });
        });
        setLabTestOptions(testsOptions);
      })
      .catch((error) => {});
  };

  //Load the tests of all Laboratory
  //Get list of Test Group
  const PriorityOrder = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/TEST_ORDER_PRIORITY`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setPriority(response.data);
      })
      .catch((error) => {});
  };
  //Check if Module Exist
  const CheckLabModule = () => {
    axios
      .get(`${baseUrl}modules/check?moduleName=laboratory`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data === true) {
          setModuleStatus("1");
          setButtonHidden(false);
        } else {
          setModuleStatus("2");
          //toast.error("Laboratory module is not install")
          setButtonHidden(true);
        }
      })
      .catch((error) => {});
  };

  //Get list of Test Group
  const ViraLoadIndication = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/VIRAL_LOAD_INDICATION`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setVLIndication(response.data);
      })
      .catch((error) => {});
  };

  const handleInputChangeObject = (e) => {
    console.log(e);
    setSelectedOption(e);
    setTests((prevObject) => ({
      ...prevObject,
      labTestGroupId: e.testGroupId,
      labTestId: e.value,
    }));
  };

  useEffect(() => {
    // Clear result when labTestId changes
    if (tests.labTestId !== 65 && tests.labTestId !== 50) {
      setTests((prevTests) => ({ ...prevTests, result: "" }));
    }
  }, [tests.labTestId]);

  const handleInputChange = (e) => {
    setErrors({ ...temp, [e.target.name]: "" });
    if (e.target.name === "labNumber") {
      const onlyPositiveNumber = e.target.value; //Math.abs(e.target.value)
      setTests({ ...tests, [e.target.name]: onlyPositiveNumber });
    } else {
      setTests({ ...tests, [e.target.name]: e.target.value });
    }
  };

  const addOrder = (e) => {
    if (validate()) {
      tests.sampleCollectionDate = moment(tests.sampleCollectionDate).format(
        "YYYY-MM-DD HH:MM:SS"
      );
      tests.dateResultReceived =
        tests.dateResultReceived !== ""
          ? moment(tests.dateResultReceived).format("YYYY-MM-DD HH:MM:SS")
          : "";

      tests.visitId = visitId;

      setTestOrderList([...testOrderList, tests]);
      setTests({
        comments: "",
        dateAssayed: "",
        labNumber: "",
        sampleNumber: "",
        labTestGroupId: "",
        labTestId: "",
        labOrderIndication: "",
        dateResultReceived: "",
        orderedDate: "",
        patientId: props.patientObj ? props.patientObj.id : "",
        result: "",
        sampleCollectionDate: "",
        viralLoadIndication: "",
        visitId: "",
        checkedBy: "",
        clinicianName: "",
        dateChecked: "",
        dateResultReported: "",
        id: "",
        orderId: "",
        resultReportedBy: "",
      });
      setSelectedOption([]);
    }
  };
  /* Remove ADR  function **/
  const removeOrder = (index) => {
    testOrderList.splice(index, 1);
    setTestOrderList([...testOrderList]);
  };
  /* Remove ADR  function **/
  const editTestOrder = (order, index) => {
    setTests({ ...order });
    testOrderList.splice(index, 1);
    setTestOrderList([...testOrderList]);
  };
  //Validations of the forms
  const validate = () => {
    //temp.dateAssayed = tests.dateAssayed ? "" : "This field is required"
    temp.labTestGroupId = tests.labTestGroupId ? "" : "This field is required";
    temp.labTestId = tests.labTestId ? "" : "This field is required";
    temp.labOrderIndication = tests.labOrderIndication
      ? ""
      : "This field is required";
    temp.orderedDate = tests.orderedDate ? "" : "This field is required";
    temp.sampleNumber = tests.sampleNumber ? "" : "This field is required";
    temp.sampleCollectionDate = tests.sampleCollectionDate
      ? ""
      : "This field is required";
    tests.labTestId === "16" &&
      (temp.viralLoadIndication = tests.viralLoadIndication
        ? ""
        : "This field is required");
    {
      tests.dateResultReceived !== "" &&
        (temp.result = tests.result ? "" : "This field is required");
    }
    {
      tests.result !== "" &&
        (temp.dateResultReceived = tests.dateResultReceived
          ? ""
          : "This field is required");
    }

    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x == "");
  };

  const LAB_ORDER_INDICATION = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/LAB_ORDER_INDICATION`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setLabOrderIndication(response.data);
      })
      .catch((error) => {});
  };

  

   const handleSubmit = (e) => {
     e.preventDefault();
     setSaving(true);
     tests.sampleCollectionDate = moment(tests.sampleCollectionDate).format(
       "YYYY-MM-DD HH:MM:SS"
     );
     tests.dateResultReceived =
       tests.dateResultReceived !== ""
         ? moment(tests.dateResultReceived).format("YYYY-MM-DD HH:MM:SS")
         : "";
     axios
       .post(`${baseUrl}laboratory/rde-orders`, testOrderList, {
         headers: { Authorization: `Bearer ${token}` },
       })
       .then((response) => {
         setSaving(false);
         props.LabOrders();
         toast.success("Laboratory order & result created successful!", {
           position: toast.POSITION.BOTTOM_CENTER,
         });
         setTests({
           comments: "",
           dateAssayed: "",
           labNumber: "",
           sampleNumber: "",
           labTestGroupId: "",
           labTestId: "",
           labOrderIndication: "",
           orderedDate: "",
           dateResultReceived: "",
           patientId: props.patientObj ? props.patientObj.id : "",
           result: "",
           sampleCollectionDate: "",
           viralLoadIndication: "",
           visitId: "",
           checkedBy: "",
           clinicianName: "",
           dateChecked: "",
           dateResultReported: "",
           id: "",
           orderId: "",
           resultReportedBy: "",
         });
         setTestOrderList([]);
         props.setActiveContent({
           ...props.activeContent,
           route: "laboratoryOrderResult",
           activeTab: "history",
         });
       })
       .catch((error) => {
         setSaving(false);
         if (error.response && error.response.data) {
           let errorMessage =
             error.response.data && error.response.data.apierror.message !== ""
               ? error.response.data.apierror.message
               : "Something went wrong, please try again";
           toast.error(errorMessage, {
             position: toast.POSITION.BOTTOM_CENTER,
           });
         } else {
           toast.error("Something went wrong, please try again...", {
             position: toast.POSITION.BOTTOM_CENTER,
           });
         }
       });
   };

   return (
     <div>
       <div className="row">
         <div className="col-md-6">
           <h2>Laboratory Order and Result </h2>
         </div>

         <br />
         <br />
         <Card className={classes.root}>
           <CardBody>
             {/* {moduleStatus==="1" && ( */}
             <form>
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
                         style={{
                           border: "1px solid #014D88",
                           borderRadius: "0.25rem",
                         }}
                         required
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
                       <Label for="encounterDate">
                         Sample Number <span style={{ color: "red" }}> *</span>
                       </Label>
                       <Input
                         type="text"
                         name="sampleNumber"
                         id="sampleNumber"
                         //min={0}
                         value={tests.sampleNumber}
                         onChange={handleInputChange}
                         style={{
                           border: "1px solid #014D88",
                           borderRadius: "0.25rem",
                         }}
                         required
                       />
                       {errors.sampleNumber !== "" ? (
                         <span className={classes.error}>
                           {errors.sampleNumber}
                         </span>
                       ) : (
                         ""
                       )}
                     </FormGroup>
                   </Col>

                   <Col md={4} className="form-group mb-3">
                     <FormGroup>
                       <Label for="testGroup">
                         Select Test <span style={{ color: "red" }}> *</span>
                       </Label>

                       <Select
                         value={selectedOption}
                         onChange={handleInputChangeObject}
                         options={labTestOptions}
                         theme={(theme) => ({
                           ...theme,
                           borderRadius: "0.25rem",
                           border: "1px solid #014D88",
                           colors: {
                             ...theme.colors,
                             primary25: "#014D88",
                             primary: "#014D88",
                           },
                         })}
                       />
                       {errors.labTestId !== "" ? (
                         <span className={classes.error}>
                           {errors.labTestId}
                         </span>
                       ) : (
                         ""
                       )}
                     </FormGroup>
                   </Col>
                   {/* Indications */}
                   <>
                     <Col md={4} className="form-group mb-3">
                       {/* <div className="form-group col-md-3"> */}
                       <FormGroup>
                         <Label>
                           Lab Order Indication{" "}
                           <span style={{ color: "red" }}> *</span>
                         </Label>
                         <select
                           className="form-control"
                           name="labOrderIndication"
                           id="labOrderIndication"
                           value={tests.labOrderIndication}
                           onChange={handleInputChange}
                           style={{
                             border: "1px solid #014D88",
                             borderRadius: "0.2rem",
                           }}
                         >
                           <option value="">Select</option>
                           {labOrderIndication.map((value) => (
                             <option key={value.id} value={value.display}>
                               {value.display}
                             </option>
                           ))}
                         </select>
                         {errors.labOrderIndication !== "" ? (
                           <span className={classes.error}>
                             {errors.labOrderIndication}
                           </span>
                         ) : (
                           ""
                         )}
                       </FormGroup>
                       {/* </div> */}
                     </Col>
                   </>
                   {tests.labTestId === "16" && (
                     <Col md={4} className="form-group mb-3">
                       <FormGroup>
                         <Label for="vlIndication">
                           VL Indication{" "}
                           <span style={{ color: "red" }}> *</span>
                         </Label>
                         <Input
                           type="select"
                           name="viralLoadIndication"
                           id="viralLoadIndication"
                           value={tests.viralLoadIndication}
                           onChange={handleInputChange}
                           style={{
                             border: "1px solid #014D88",
                             borderRadius: "0.25rem",
                           }}
                         >
                           <option value="">Select </option>

                           {vLIndication.map((value) => (
                             <option key={value.id} value={value.id}>
                               {value.display}
                             </option>
                           ))}
                         </Input>
                         {errors.viralLoadIndication !== "" ? (
                           <span className={classes.error}>
                             {errors.viralLoadIndication}
                           </span>
                         ) : (
                           ""
                         )}
                       </FormGroup>
                     </Col>
                   )}
                   <Col md={4} className="form-group mb-3">
                     <FormGroup>
                       <Label for="encounterDate">
                         {" "}
                         Date Sample Collected{" "}
                         <span style={{ color: "red" }}> *</span>
                       </Label>
                       <Input
                         type="datetime-local"
                         name="sampleCollectionDate"
                         id="sampleCollectionDate"
                         value={tests.sampleCollectionDate}
                         onChange={handleInputChange}
                         //min={eacStatusObj && eacStatusObj.eacsession && eacStatusObj.eacsession!=='Default' ? eacStatusObj.eacsessionDate :enrollDate}
                         min={moment(enrollDate).format("YYYY-MM-DDTHH:mm")}
                         max={moment(new Date()).format("YYYY-MM-DDTHH:mm")}
                         style={{
                           border: "1px solid #014D88",
                           borderRadius: "0.25rem",
                         }}
                         required
                         onKeyDown={(e) => e.preventDefault()}
                       />
                       {errors.sampleCollectionDate !== "" ? (
                         <span className={classes.error}>
                           {errors.sampleCollectionDate}
                         </span>
                       ) : (
                         ""
                       )}
                     </FormGroup>
                   </Col>
                   <Col md={4} className="form-group mb-3">
                     <FormGroup>
                       <Label for="">
                         Date Result Received{" "}
                         {tests.result !== "" ? (
                           <span style={{ color: "red" }}> *</span>
                         ) : (
                           ""
                         )}
                       </Label>
                       <Input
                         type="datetime-local"
                         name="dateResultReceived"
                         id="dateResultReceived"
                         value={tests.dateResultReceived}
                         //min={tests.sampleCollectionDate}
                         min={moment(tests.sampleCollectionDate).format(
                           "YYYY-MM-DDTHH:mm"
                         )}
                         onChange={handleInputChange}
                         max={moment(new Date()).format("YYYY-MM-DDTHH:mm")}
                         style={{
                           border: "1px solid #014D88",
                           borderRadius: "0.25rem",
                         }}
                         required
                         onKeyPress={(e) => e.preventDefault()}
                       />
                       {errors.dateResultReceived !== "" ? (
                         <span className={classes.error}>
                           {errors.dateResultReceived}
                         </span>
                       ) : (
                         ""
                       )}
                     </FormGroup>
                   </Col>

                   {tests.labTestId === 73 ||
                   tests.labTestId === 75 ||
                   tests.labTestId === 78 ||
                   tests.labTestId === 67 ||
                   tests.labTestId === 79 ||
                   tests.labTestId === 80 ? (
                     <>
                       <Col md={4} className="form-group mb-3">
                         <FormGroup>
                           <Label>
                             Result{" "}
                             {tests.dateResultReceived !== "" ? (
                               <span style={{ color: "red" }}> *</span>
                             ) : (
                               ""
                             )}
                           </Label>
                           <select
                             className="form-control"
                             name="result"
                             id="result"
                             value={tests.result}
                             onChange={handleInputChange}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           >
                             <option value={""}>Select</option>
                             <option value="Positive">Positive</option>
                             <option value="Negative">Negative</option>
                           </select>
                         </FormGroup>
                       </Col>
                     </>
                   ) : tests.labTestId === 72 ? (
                     <>
                       <Col md={4} className="form-group mb-3">
                         <FormGroup>
                           <Label>
                             Result{" "}
                             {tests.dateResultReceived !== "" ? (
                               <span style={{ color: "red" }}> *</span>
                             ) : (
                               ""
                             )}
                           </Label>
                           <select
                             className="form-control"
                             name="result"
                             id="result"
                             value={tests.result}
                             onChange={handleInputChange}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           >

                           //start
                          <option value={""}>Select</option>
                          <option value="MTB not detected">
                             {"MTB not detected"}
                          </option>
                          <option value="MTB detected RR not detected">
                             {"MTB detected RR not detected"}
                          </option>
                          <option value="MTB detected RR detected">
                           {"MTB detected RR detected"}
                          </option>
                          <option value="MTB detected RR indeterminate">
                           {"MTB detected RR indeterminate"}
                          </option>
                          <option value="Error">
                            {"Error"}
                          </option>
                          <option value="Invalid ">
                            {"Invalid "}
                          </option>
                          <option value="Incomplete">
                             {"Incomplete"}
                          </option>
                          //end
                           </select>
                         </FormGroup>
                       </Col>
                     </>
                   ) : tests.labTestId === 71 ? (
                     <>
                       <Col md={4} className="form-group mb-3">
                         <FormGroup>
                           <Label>
                             Result{" "}
                             {tests.dateResultReceived !== "" ? (
                               <span style={{ color: "red" }}> *</span>
                             ) : (
                               ""
                             )}
                           </Label>
                           <select
                             className="form-control"
                             name="result"
                             id="result"
                             value={tests.result}
                             onChange={handleInputChange}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           >
                             <option value={""}>Select</option>
                             <option value="Positive">Positive</option>
                             <option value="Negative">Negative</option>
                           </select>
                         </FormGroup>
                       </Col>
                     </>
                   ) : tests.labTestId === 70 ? (
                     <>
                       <Col md={4} className="form-group mb-3">
                         <FormGroup>
                           <Label>
                             Result{" "}
                             {tests.dateResultReceived !== "" ? (
                               <span style={{ color: "red" }}> *</span>
                             ) : (
                               ""
                             )}
                           </Label>
                           <select
                             className="form-control"
                             name="result"
                             id="result"
                             value={tests.result}
                             onChange={handleInputChange}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           >
                             <option value={""}>Select</option>
                             <option value="Positive">Positive</option>
                             <option value="Negative">Negative</option>
                           </select>
                         </FormGroup>
                       </Col>
                     </>
                   )

                   //start
                   : tests.labTestId === 82 ||
                     tests.labTestId === 83 ||
                     tests.labTestId === 84 ||
                     tests.labTestId === 85 ? (
                    <>
                      <Col md={4} className="form-group mb-3">
                        <FormGroup>
                          <Label>
                            Result{" "}
                            {tests.dateResultReceived !== "" ? (
                              <span style={{ color: "red" }}> *</span>
                            ) : (
                              ""
                            )}
                          </Label>
                          <select
                            className="form-control"
                            name="result"
                            id="result"
                            value={tests.result}
                            onChange={handleInputChange}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          >
                            <option value={""}>Select</option>
                            <option value="Normal">Normal</option>
                            <option value="Deranged">Deranged</option>
                          </select>
                        </FormGroup>
                      </Col>
                    </>
                  )
               //end

                   : tests.labTestId === 69 ? (
                     <>
                       <Col md={4} className="form-group mb-3">
                         <FormGroup>
                           <Label>
                             Result{" "}
                             {tests.dateResultReceived !== "" ? (
                               <span style={{ color: "red" }}> *</span>
                             ) : (
                               ""
                             )}
                           </Label>
                           <select
                             className="form-control"
                             name="result"
                             id="result"
                             value={tests.result}
                             onChange={handleInputChange}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           >
                             <option value={""}>Select</option>
                             <option value="Positive">Positive</option>
                             <option value="Negative">Negative</option>
                           </select>
                         </FormGroup>
                       </Col>
                     </>
                   ) : tests.labTestId === 66 ? (
                     <>
                       <Col md={4} className="form-group mb-3">
                         <FormGroup>
                           <Label>
                             Result{" "}
                             {tests.dateResultReceived !== "" ? (
                               <span style={{ color: "red" }}> *</span>
                             ) : (
                               ""
                             )}
                           </Label>
                           <select
                             className="form-control"
                             name="result"
                             id="result"
                             value={tests.result}
                             onChange={handleInputChange}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           >
                             <option value={""}>Select</option>
                             <option value="Suggestive for TB">
                               {"Suggestive for TB"}
                             </option>
                             <option value="Not suggestive for TB">
                               {"Not suggestive for TB"}
                             </option>
                           </select>
                         </FormGroup>
                       </Col>
                     </>
                   ) : tests.labTestId === 64 ? (
                     <>
                       <Col md={4} className="form-group mb-3">
                         <FormGroup>
                           <Label>
                             Result{" "}
                             {tests.dateResultReceived !== "" ? (
                               <span style={{ color: "red" }}> *</span>
                             ) : (
                               ""
                             )}
                           </Label>
                           <select
                             className="form-control"
                             name="result"
                             id="result"
                             value={tests.result}
                             onChange={handleInputChange}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           >
                             <option value={""}>Select</option>
                             <option value="AFB Positive">AFB Positive</option>
                             <option value="AFB Negative">AFB Negative</option>
                           </select>
                         </FormGroup>
                       </Col>
                     </>
                   ) : tests.labTestId === 52 ? (
                     <>
                       <Col md={4} className="form-group mb-3">
                         <FormGroup>
                           <Label>
                             Result{" "}
                             {tests.dateResultReceived !== "" ? (
                               <span style={{ color: "red" }}> *</span>
                             ) : (
                               ""
                             )}
                           </Label>
                           <select
                             className="form-control"
                             name="result"
                             id="result"
                             value={tests.result}
                             onChange={handleInputChange}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           >
                             <option value={""}>Select</option>
                             <option value="Positive">Positive</option>
                             <option value="Negative">Negative</option>
                           </select>
                         </FormGroup>
                       </Col>
                     </>
                   ) : tests.labTestId === 51 ? (
                     <>
                       <Col md={4} className="form-group mb-3">
                         <FormGroup>
                           <Label>
                             Result{" "}
                             {tests.dateResultReceived !== "" ? (
                               <span style={{ color: "red" }}> *</span>
                             ) : (
                               ""
                             )}
                           </Label>
                           <select
                             className="form-control"
                             name="result"
                             id="result"
                             value={tests.result}
                             onChange={handleInputChange}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           >
                             <option value={""}>Select</option>
                             <option value="Positive">Positive</option>
                             <option value="Negative">Negative</option>
                           </select>
                         </FormGroup>
                       </Col>
                     </>
                   ) : tests.labTestId === 37 ? (
                     <>
                       <Col md={4} className="form-group mb-3">
                         <FormGroup>
                           <Label>
                             Result{" "}
                             {tests.dateResultReceived !== "" ? (
                               <span style={{ color: "red" }}> *</span>
                             ) : (
                               ""
                             )}
                           </Label>
                           <select
                             className="form-control"
                             name="result"
                             id="result"
                             value={tests.result}
                             onChange={handleInputChange}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           >
                             <option value={""}>Select</option>
                             <option value="Seen">Seen</option>
                             <option value="Not seen">Not seen</option>
                           </select>
                         </FormGroup>
                       </Col>
                     </>
                   ) : tests.labTestId === 36 ? (
                     <>
                       <Col md={4} className="form-group mb-3">
                         <FormGroup>
                           <Label>
                             Result{" "}
                             {tests.dateResultReceived !== "" ? (
                               <span style={{ color: "red" }}> *</span>
                             ) : (
                               ""
                             )}
                           </Label>
                           <select
                             className="form-control"
                             name="result"
                             id="result"
                             value={tests.result}
                             onChange={handleInputChange}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           >
                             <option value={""}>Select</option>
                             <option value="Reactive">Reactive</option>
                             <option value="Non-reactive">Non-reactive</option>
                           </select>
                         </FormGroup>
                       </Col>
                     </>
                   ) : tests.labTestId === 34 ? (
                     <>
                       <Col md={4} className="form-group mb-3">
                         <FormGroup>
                           <Label>
                             Result{" "}
                             {tests.dateResultReceived !== "" ? (
                               <span style={{ color: "red" }}> *</span>
                             ) : (
                               ""
                             )}
                           </Label>
                           <select
                             className="form-control"
                             name="result"
                             id="result"
                             value={tests.result}
                             onChange={handleInputChange}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           >
                             <option value={""}>Select</option>
                             <option value="Normal">Normal</option>
                             <option value="Deranged">Deranged</option>
                           </select>
                         </FormGroup>
                       </Col>
                     </>
                   )

                   //start
                    : tests.labTestId === 33 ? (
                        <>
                          <Col md={4} className="form-group mb-3">
                            <FormGroup>
                              <Label>
                                Result{" "}
                                {tests.dateResultReceived !== "" ? (
                                  <span style={{ color: "red" }}> *</span>
                                ) : (
                                  ""
                                )}
                              </Label>
                              <select
                                className="form-control"
                                name="result"
                                id="result"
                                value={tests.result}
                                onChange={handleInputChange}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              >
                                <option value={""}>Select</option>
                                <option value="Normal">Normal</option>
                                <option value="Deranged">Deranged</option>
                              </select>
                            </FormGroup>
                          </Col>
                        </>
                      )

                    //end
                    : tests.labTestId === 32 ? (
                     <>
                       <Col md={4} className="form-group mb-3">
                         <FormGroup>
                           <Label>
                             Result{" "}
                             {tests.dateResultReceived !== "" ? (
                               <span style={{ color: "red" }}> *</span>
                             ) : (
                               ""
                             )}
                           </Label>
                           <select
                             className="form-control"
                             name="result"
                             id="result"
                             value={tests.result}
                             onChange={handleInputChange}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           >
                             <option value={""}>Select</option>
                             <option value="Reactive">Reactive</option>
                             <option value="Non-reactive">Non-reactive</option>
                           </select>
                         </FormGroup>
                       </Col>
                     </>
                   ) : tests.labTestId === 30 ? (
                     <>
                       <Col md={4} className="form-group mb-3">
                         <FormGroup>
                           <Label>
                             Result{" "}
                             {tests.dateResultReceived !== "" ? (
                               <span style={{ color: "red" }}> *</span>
                             ) : (
                               ""
                             )}
                           </Label>
                           <select
                             className="form-control"
                             name="result"
                             id="result"
                             value={tests.result}
                             onChange={handleInputChange}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           >
                             <option value={""}>Select</option>
                             <option value="Positive">Positive</option>
                             <option value="Negative">Negative</option>
                           </select>
                         </FormGroup>
                       </Col>
                     </>
                   ) : tests.labTestId === 29 ? (
                     <>
                       <Col md={4} className="form-group mb-3">
                         <FormGroup>
                           <Label>
                             Result{" "}
                             {tests.dateResultReceived !== "" ? (
                               <span style={{ color: "red" }}> *</span>
                             ) : (
                               ""
                             )}
                           </Label>
                           <select
                             className="form-control"
                             name="result"
                             id="result"
                             value={tests.result}
                             onChange={handleInputChange}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           >
                             <option value={""}>Select</option>
                             <option value="Positive">Positive</option>
                             <option value="Negative">Negative</option>
                           </select>
                         </FormGroup>
                       </Col>
                     </>
                   ) : tests.labTestId === 28 ? (
                     <>
                       <Col md={4} className="form-group mb-3">
                         <FormGroup>
                           <Label>
                             Result{" "}
                             {tests.dateResultReceived !== "" ? (
                               <span style={{ color: "red" }}> *</span>
                             ) : (
                               ""
                             )}
                           </Label>
                           <select
                             className="form-control"
                             name="result"
                             id="result"
                             value={tests.result}
                             onChange={handleInputChange}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           >
                             <option value={""}>Select</option>
                             <option value="Positive">Positive</option>
                             <option value="Negative">Negative</option>
                           </select>
                         </FormGroup>
                       </Col>
                     </>
                   ) : tests.labTestId === 27 ? (
                     <>
                       <Col md={4} className="form-group mb-3">
                         <FormGroup>
                           <Label>
                             Result{" "}
                             {tests.dateResultReceived !== "" ? (
                               <span style={{ color: "red" }}> *</span>
                             ) : (
                               ""
                             )}
                           </Label>
                           <select
                             className="form-control"
                             name="result"
                             id="result"
                             value={tests.result}
                             onChange={handleInputChange}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           >
                             <option value={""}>Select</option>
                             <option value="Positive">Positive</option>
                             <option value="Negative">Negative</option>
                           </select>
                         </FormGroup>
                       </Col>
                     </>
                   )

                //start
               : tests.labTestId === 21 ? (
                   <>
                     <Col md={4} className="form-group mb-3">
                       <FormGroup>
                         <Label>
                           Result{" "}
                           {tests.dateResultReceived !== "" ? (
                             <span style={{ color: "red" }}> *</span>
                           ) : (
                             ""
                           )}
                         </Label>
                         <select
                           className="form-control"
                           name="result"
                           id="result"
                           value={tests.result}
                           onChange={handleInputChange}
                           style={{
                             border: "1px solid #014D88",
                             borderRadius: "0.2rem",
                           }}
                         >
                           <option value={""}>Select</option>
                           <option value="Normal">Normal</option>
                           <option value="Deranged">Deranged</option>
                         </select>
                       </FormGroup>
                     </Col>
                   </>
                 )
                   : tests.labTestId === 65 ? (
                     <>
                       <Col md={4} className="form-group mb-3">
                         <FormGroup>
                           <Label>
                             Result{" "}
                             {tests.dateResultReceived !== "" ? (
                               <span style={{ color: "red" }}> *</span>
                             ) : (
                               ""
                             )}
                           </Label>
                           <select
                             className="form-control"
                             name="result"
                             id="result"
                             value={tests.result}
                             onChange={handleInputChange}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           >
                             //start
                             <option value={""}>Select</option>
                             <option value="MTB not detected">
                                {"MTB not detected"}
                             </option>
                             <option value="MTB detected RIF resistance not detected">
                                {"MTB detected RIF resistance not detected"}
                             </option>
                             <option value="MTB detected RIF resistance detected">
                              {"MTB detected RIF resistance detected"}
                             </option>
                             <option value="MTB trace RIF resistance indeterminate">
                              {"MTB trace RIF resistance indeterminate"}
                             </option>
                             <option value="Error">
                               {"Error"}
                             </option>
                             <option value="Invalid">
                               {"Invalid"}
                             </option>
                             <option value="Incomplete">
                                {"Incomplete"}
                             </option>
                             //end

                           </select>
                         </FormGroup>
                       </Col>
                     </>
                   )
                    : tests.labTestId === 86 ? (
                        <>
                          <Col md={4} className="form-group mb-3">
                            <FormGroup>
                              <Label>
                                Result{" "}
                                {tests.dateResultReceived !== "" ? (
                                  <span style={{ color: "red" }}> *</span>
                                ) : (
                                  ""
                                )}
                              </Label>
                              <select
                                className="form-control"
                                name="result"
                                id="result"
                                value={tests.result}
                                onChange={handleInputChange}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              >
                                //start
                                <option value={""}>Select</option>
                                <option value="MTB not detected">
                                   {"MTB not detected"}
                                </option>
                                <option value="MTB detected RIF/INH not detected">
                                   {"MTB detected RIF/INH not detected"}
                                </option>
                                <option value="MTB detected RIF detected">
                                 {"MTB detected RIF detected"}
                                </option>
                                <option value="MTB detected INH detected">
                                 {"MTB detected INH detected"}
                                </option>
                                <option value="MTB detected RIF&INH detected">
                                  {"MTB detected RIF&INH detected"}
                                </option>
                                <option value="Invalid">
                                  {"Invalid"}
                                </option>
                                <option value="No result">
                                   {"No result"}
                                </option>
                                //end

                              </select>
                            </FormGroup>
                          </Col>
                        </>
                      )

                   : tests.labTestId === 50 ? (
                     <>
                       <Col md={4} className="form-group mb-3">
                         <FormGroup>
                           <Label>
                             Result{" "}
                             {tests.dateResultReceived !== "" ? (
                               <span style={{ color: "red" }}> *</span>
                             ) : (
                               ""
                             )}
                           </Label>
                           <select
                             className="form-control"
                             name="result"
                             id="result"
                             value={tests.result}
                             onChange={handleInputChange}
                             style={{
                               border: "1px solid #014D88",
                               borderRadius: "0.2rem",
                             }}
                           >
                             <option value={""}>Select</option>
                             <option value="<200">{"<200"}</option>
                             <option value=">=200">{">=200"}</option>
                           </select>
                         </FormGroup>
                       </Col>
                     </>
                   ) : (
                     <>
                       <Col md={4} className="form-group mb-3">
                         <FormGroup>
                           <Label for="priority">
                             Result{" "}
                             {tests.dateResultReceived !== "" ? (
                               <span style={{ color: "red" }}> *</span>
                             ) : (
                               "test"
                             )}
                           </Label>
                           <InputGroup>
                             <Input
                               type="text"
                               name="result"
                               id="result"
                               value={tests.result}
                               onChange={handleInputChange}
                               style={{
                                 border: "1px solid #014D88",
                                 borderRadius: "0rem",
                               }}
                             />
                           </InputGroup>

                           {errors.result !== "" ? (
                             <span className={classes.error}>
                               {errors.result}
                             </span>
                           ) : (
                             ""
                           )}
                         </FormGroup>
                       </Col>
                     </>
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
                         style={{
                           border: "1px solid #014D88",
                           borderRadius: "0.25rem",
                         }}
                         required
                       />
                       {errors.resultReportedBy !== "" ? (
                         <span className={classes.error}>
                           {errors.resultReportedBy}
                         </span>
                       ) : (
                         ""
                       )}
                     </FormGroup>
                   </Col>
                   {/* Date Ordered */}
                   <Col md={4} className="form-group mb-3">
                     <FormGroup>
                       <Label for="encounterDate">Date Ordered</Label>
                       {""}
                       <span style={{ color: "red" }}> *</span>
                       <Input
                         type="date"
                         name="orderedDate"
                         id="orderedDate"
                         value={tests.orderedDate}
                         min={moment(tests.orderedDate).format("YYYY-MM-DD")}
                         max={moment(new Date()).format("YYYY-MM-DD")}
                         onChange={handleInputChange}
                         style={{
                           border: "1px solid #014D88",
                           borderRadius: "0.25rem",
                         }}
                         onKeyPress={(e) => e.preventDefault()}
                         required
                       />
                       {errors.orderedDate !== "" ? (
                         <span className={classes.error}>
                           {errors.orderedDate}
                         </span>
                       ) : (
                         ""
                       )}
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
                         min={moment(tests.sampleCollectionDate).format(
                           "YYYY-MM-DD"
                         )}
                         max={moment(new Date()).format("YYYY-MM-DD")}
                         onChange={handleInputChange}
                         style={{
                           border: "1px solid #014D88",
                           borderRadius: "0.25rem",
                         }}
                         required
                       />
                       {errors.dateResultReported !== "" ? (
                         <span className={classes.error}>
                           {errors.dateResultReported}
                         </span>
                       ) : (
                         ""
                       )}
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
                         style={{
                           border: "1px solid #014D88",
                           borderRadius: "0.25rem",
                         }}
                         required
                       />
                       {errors.checkedBy !== "" ? (
                         <span className={classes.error}>
                           {errors.checkedBy}
                         </span>
                       ) : (
                         ""
                       )}
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
                         min={moment(tests.sampleCollectionDate).format(
                           "YYYY-MM-DD"
                         )}
                         max={moment(new Date()).format("YYYY-MM-DD")}
                         onChange={handleInputChange}
                         style={{
                           border: "1px solid #014D88",
                           borderRadius: "0.25rem",
                         }}
                         required
                         onKeyPress={(e) => e.preventDefault()}
                       />
                       {errors.dateChecked !== "" ? (
                         <span className={classes.error}>
                           {errors.dateChecked}
                         </span>
                       ) : (
                         ""
                       )}
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
                         style={{
                           border: "1px solid #014D88",
                           borderRadius: "0.25rem",
                         }}
                         required
                       />
                       {errors.clinicianName !== "" ? (
                         <span className={classes.error}>
                           {errors.clinicianName}
                         </span>
                       ) : (
                         ""
                       )}
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
                       >

                       </Input>

                     </FormGroup>
                   </Col>

                   <Col md={12}>
                     <LabelSui
                       as="a"
                       color="black"
                       className="float-end"
                       onClick={addOrder}
                       size="small"
                       style={{ marginTop: 20, marginBottom: 20 }}
                     >
                       <Icon name="plus" /> Add Test
                     </LabelSui>
                   </Col>
                   <hr />
                   <br />
                   {/* List of Test Order */}
                   {testOrderList.length > 0 ? (
                     <List>
                       <Table striped responsive>
                         <thead>
                           <tr>
                             <th>Test Group</th>
                             <th>Test</th>
                             <th>Date Sample Collected</th>
                             <th>Date Result Received</th>
                             <th>Result</th>
                             <th></th>
                           </tr>
                         </thead>
                         <tbody>
                           {testOrderList.map((tests, index) => (
                             <TestOrdersList
                               key={index}
                               index={index}
                               order={tests}
                               testGroupObj={testGroup}
                               removeOrder={removeOrder}
                               editTestOrder={editTestOrder}
                             />
                           ))}
                         </tbody>
                       </Table>
                       <br />
                       <br />
                     </List>
                   ) : (
                     ""
                   )}
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
                 style={{ backgroundColor: "#014d88" }}
                 disabled={testOrderList.length > 0 && !saving ? false : true}
                 onClick={handleSubmit}
               >
                 {!saving ? (
                   <span style={{ textTransform: "capitalize" }}>Save</span>
                 ) : (
                   <span style={{ textTransform: "capitalize" }}>
                     Saving...
                   </span>
                 )}
               </MatButton>
             </form>
             {/* )} */}
             {/* {moduleStatus==="2" && (
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
};
function TestOrdersList({
  order,
  index,
  removeOrder,
  testGroupObj,
  editTestOrder,
}) {
  const testGroupName = testGroupObj.find(
    (x) => x.id === parseInt(order.labTestGroupId)
  );
  const testName = testGroupName.labTests.find(
    (x) => x.id === parseInt(order.labTestId)
  );

  return (
    <tr>
      <th>
        {testGroupName.groupName == "Others" &&
        testName.labTestName === "Viral Load"
          ? testName.labTestName
          : testGroupName.groupName}
      </th>
      <th>
        {testGroupName.groupName === "Others" &&
        testName.labTestName === "Viral Load"
          ? testName.labTestName
          : testName.labTestName}
      </th>
      <th>{order.sampleCollectionDate}</th>
      {/* <th>{order.dateAssayed}</th> */}
      <th>
        {order.dateResultReceived !== "" &&
        order.dateResultReceived !== "Invalid date"
          ? order.dateResultReceived
          : ""}
      </th>

      <th>{order.result !== "" ? order.result : ""}</th>
      <th></th>
      <th>
        <IconButton
          aria-label="delete"
          size="small"
          color="error"
          onClick={() => removeOrder(index)}
        >
          <DeleteIcon fontSize="inherit" />
        </IconButton>
        <IconButton
          aria-label="delete"
          size="small"
          color="info"
          onClick={() => editTestOrder(order, index)}
        >
          <Edit fontSize="inherit" />
        </IconButton>
      </th>
    </tr>
  );
}

export default Laboratory;
