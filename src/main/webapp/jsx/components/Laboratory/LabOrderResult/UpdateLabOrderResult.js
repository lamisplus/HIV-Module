import React, {useState, useEffect} from "react";
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
} from "reactstrap";
import MatButton from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";
//import CancelIcon from '@material-ui/icons/Cancel'
import "react-widgets/dist/css/react-widgets.css";
//import moment from "moment";
import {Spinner} from "reactstrap";
import {url as baseUrl, token} from "../../../../api";
import moment from "moment";
import {toast} from "react-toastify";
import Select from "react-select";
import {TiArrowBack} from "react-icons/ti";
import Button from "@material-ui/core/Button";

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
    const patientObj = props.patientObj;
    const [enrollDate, setEnrollDate] = useState("");
    const classes = useStyles();
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    let fieldHidden = props.activeContent.actionType === "update" ? false : true;
    const [testGroup, setTestGroup] = useState([]);
    const [test, setTest] = useState([]);
    const [vLIndication, setVLIndication] = useState([]);
    const [eacStatusObj, setEacStatusObj] = useState();
    const [labNumbers, setLabNumbers] = useState([]); //
    const [selectedOption, setSelectedOption] = useState([]);
    const [defaultSelectedOption, setDefaultSelectedOption] = useState([]);
    const [labTestOptions, setLabTestOptions] = useState([]);
    let testsOptions = [];
    let temp = {...errors};
    const [cd4CountObj, setCd4CountObj] = useState({cd4CountType: "", SQC4CountValue: "", FCCd4CountValue: ""})
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
        viralLoadIndication: 0,
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
        TestGroup();
        ViraLoadIndication();
        CheckEACStatus();
        GetPatientDTOObj();
        LabNumbers();
        setTests({...props.activeContent.obj});
        tests.sampleCollectionDate = moment(
            props.activeContent.obj.sampleCollectionDate
        ).format("YYYY-MM-DD HH:MM:SS");
        tests.dateResultReceived = moment(
            props.activeContent.obj.dateResultReceived
        ).format("YYYY-MM-DD HH:MM:SS");
        tests.dateResultReported = moment(
            props.activeContent.obj.dateResultReported
        ).format("YYYY-MM-DD HH:MM:SS");
        //dateResultReported
    }, [props.patientObj.id, props.activeContent.obj]);


    useEffect(() => {
        if(props.activeContent.obj.labTestId === 1){
            if(props.activeContent.obj.result=== ">=200" || props.activeContent.obj.result=== "<200" ){
               setCd4CountObj({...cd4CountObj, cd4CountType: "Semi-Quantitative", SQC4CountValue: props.activeContent.obj.result})
            }else {
                setCd4CountObj({...cd4CountObj, cd4CountType: "Flow Cyteometry", FCCd4CountValue: props.activeContent.obj.result})
            }
        }
    }, [props.activeContent.obj]);

    useEffect(()=>{
        if(tests.labTestId === 1){
            setTests({...tests, result: cd4CountObj.FCCd4CountValue !== "" ? cd4CountObj.FCCd4CountValue : cd4CountObj.SQC4CountValue })
        }
    },[test, cd4CountObj])

    //Get list of LabNumbers
    const LabNumbers = () => {
        axios
            .get(`${baseUrl}laboratory/lab-numbers`, {
                headers: {Authorization: `Bearer ${token}`},
            })
            .then((response) => {
                setLabNumbers(response.data);
            })
            .catch((error) => {
            });
    };

    const GetPatientDTOObj = () => {
        axios
            .get(`${baseUrl}hiv/patient/${props.patientObj.id}`, {
                headers: {Authorization: `Bearer ${token}`},
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
            .catch((error) => {
            });
    };
    //Get EAC Status
    const CheckEACStatus = () => {
        axios
            .get(`${baseUrl}hiv/eac/open/patient/${props.patientObj.id}`, {
                headers: {Authorization: `Bearer ${token}`},
            })
            .then((response) => {
                setEacStatusObj(response.data);
            })
            .catch((error) => {
            });
    };
    //Get list of Test Group
    const TestGroup = () => {
        axios
            .get(`${baseUrl}laboratory/labtestgroups`, {
                headers: {Authorization: `Bearer ${token}`},
            })
            .then((response) => {
                setTestGroup(response.data);
                const getTestList = response.data.filter(
                    (x) => x.id === parseInt(props.activeContent.obj.labTestGroupId)
                );
                setTest(getTestList[0].labTests);
                //Tests
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
                setSelectedOption(
                    testsOptions.filter(
                        (y) => y.value === props.activeContent.obj.labTestId
                    )
                );
                setDefaultSelectedOption(
                    testsOptions.filter(
                        (y) => y.value === props.activeContent.obj.labTestId
                    )
                );
            })
            .catch((error) => {
            });
    };

    const ViraLoadIndication = () => {
        axios
            .get(`${baseUrl}application-codesets/v2/VIRAL_LOAD_INDICATION`, {
                headers: {Authorization: `Bearer ${token}`},
            })
            .then((response) => {
                setVLIndication(response.data);
            })
            .catch((error) => {
            });
    };
    const handleInputChange = (e) => {
        setErrors({...temp, [e.target.name]: ""}); //reset the error message to empty once the field as value
        // setTests({...tests, [e.target.name]: e.target.value});
        if(e.target.name === "cd4CountType"){
            setCd4CountObj({...cd4CountObj, [e.target.name]: e.target.value})
        } else if(e.target.name === "SQC4CountValue"){
            setCd4CountObj({...cd4CountObj, SQC4CountValue:e.target.value, FCCd4CountValue: ""})
        }else if(e.target.name === "FCCd4CountValue"){
            setCd4CountObj({...cd4CountObj,SQC4CountValue:"", FCCd4CountValue: e.target.value})
        }
        else {
            setTests({ ...tests, [e.target.name]: e.target.value });
        }
    };
    const handleInputChangeObject = (e) => {
        setSelectedOption(e);

        tests.labTestGroupId = e.testGroupId;
        tests.labTestId = e.value;
        tests.labTestName = e.label;
        test.testGroupName = e.testGroupName;
    };

    useEffect(() => {
        if (selectedOption && selectedOption.value) {
            if (selectedOption.value !== 1) {
                setCd4CountObj({
                    cd4CountType: "",
                    SQC4CountValue: "",
                    FCCd4CountValue: ""
                });
            }
        }
    }, [selectedOption]);

    //Validations of the forms
    const validate = () => {
        //temp.dateAssayed = tests.dateAssayed ? "" : "This field is required"
        temp.labTestGroupId = tests.labTestGroupId ? "" : "This field is required";
        temp.labTestId = tests.labTestId ? "" : "This field is required";
        temp.labOrderIndication = tests.labOrderIndication ? "" : "This field is required";
        temp.orderedDate = tests.orderedDate ? "" : "This field is required";
        temp.sampleNumber = tests.sampleNumber ? "" : "This field is required";
        temp.sampleCollectionDate = tests.sampleCollectionDate
            ? ""
            : "This field is required";
        //tests.labTestId==='16' && (temp.viralLoadIndication = tests.viralLoadIndication ? "" : "This field is required")
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

    const handleSubmit = (e) => {
        e.preventDefault();
        setSaving(true);
        if (validate()) {
            tests.sampleCollectionDate = moment(tests.sampleCollectionDate).format(
                "YYYY-MM-DD HH:MM:SS"
            );
            tests.dateResultReceived = moment(tests.dateResultReceived).format(
                "YYYY-MM-DD HH:MM:SS"
            );

            axios
                .put(
                    `${baseUrl}laboratory/rde-orders/tests/${props.activeContent.obj.id}`,
                    tests,
                    {headers: {Authorization: `Bearer ${token}`}}
                )
                .then((response) => {


                    toast.success("Laboratory order & result updated successful", {
                        position: toast.POSITION.BOTTOM_CENTER,
                    });

                    setSaving(false);

                    setTests({
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
                        id: props.activeContent.obj.id,
                        activeTab: "history",
                        actionType: "update",
                        obj: props.activeContent.obj,
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
                    }
                    // else {
                    //   toast.error("Something went wrong. Please try again...", {
                    //     position: toast.POSITION.BOTTOM_CENTER,
                    //   });
                    // }
                });
        } else {
            setSaving(false);
            toast.error("All field are required", {
                position: toast.POSITION.BOTTOM_CENTER,
            });
        }
    };
    const Back = (row, actionType) => {
        // props.setActiveContent({...props.activeContent, route:'pharmacy', activeTab:"hsitory"})

        props.setActiveContent({
            ...props.activeContent,
            route: "laboratoryOrderResult",
            id: row.id,
            activeTab: "history",
            actionType: "",
            obj: {},
        });
    };

    return (
        <div>
            <div className="row">
                <div className="col-md-12">
                    <h2>
                        Laboratory Order & Result
                        <Button
                            variant="contained"
                            color="primary"
                            className=" float-end ms-1"
                            style={{backgroundColor: "#014d88", fontWeight: "bolder"}}
                            startIcon={<TiArrowBack/>}
                            onClick={() => Back(props.activeContent.obj, "view")}
                        >
              <span style={{textTransform: "capitalize", color: "#fff"}}>
                Back{" "}
              </span>
                        </Button>
                    </h2>
                </div>
                <br/>
                <br/>
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
                                                disabled={fieldHidden}
                                            >
                                                <option value="">Select</option>

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
                                                Sample Number <span style={{color: "red"}}> *</span>
                                            </Label>
                                            <Input
                                                type="text"
                                                name="sampleNumber"
                                                id="sampleNumber"
                                                value={tests.sampleNumber}
                                                onChange={handleInputChange}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.25rem",
                                                }}
                                                disabled={fieldHidden}
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
                                                Select Test <span style={{color: "red"}}> *</span>
                                            </Label>
                                            <Select
                                                defaultValue={defaultSelectedOption}
                                                value={selectedOption}
                                                onChange={handleInputChangeObject}
                                                options={labTestOptions}
                                                disabled={fieldHidden}
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
                                    {tests.labTestId === 1 && <>
                                        <Col md={4} className="form-group mb-3">
                                            <FormGroup>
                                                <Label>CD4 Count (Type)</Label>
                                                <select
                                                    className="form-control"
                                                    name="cd4CountType"
                                                    id="cd4CountType"
                                                    value={cd4CountObj.cd4CountType}
                                                    onChange={handleInputChange}
                                                    style={{
                                                        border: "1px solid #014D88",
                                                        borderRadius: "0.2rem",
                                                    }}
                                                >
                                                    <option value={""}></option>
                                                    <option value="Semi-Quantitative">Semi-Quantitative</option>
                                                    <option value="Flow Cyteometry">Flow Cytometry</option>
                                                </select>
                                            </FormGroup>
                                            {/* </div> */}
                                        </Col>
                                    </>}
                                    {cd4CountObj.cd4CountType === "Semi-Quantitative" && (
                                        <Col md={4} className="form-group mb-3">
                                            <FormGroup>
                                                <Label>CD4 Count Value(Semi-Quantitative)</Label>
                                                <select
                                                    className="form-control"
                                                    name="SQC4CountValue"
                                                    id="SQC4CountValue"
                                                    value={cd4CountObj.SQC4CountValue}
                                                    onChange={handleInputChange}
                                                    style={{
                                                        border: "1px solid #014D88",
                                                        borderRadius: "0.2rem",
                                                    }}
                                                >
                                                    <option value={""}></option>
                                                    <option value="<200">{"<200"}</option>
                                                    <option value=">=200">{">=200"}</option>
                                                </select>
                                            </FormGroup>
                                        </Col>)}
                                    {cd4CountObj.cd4CountType === "Flow Cyteometry" && (
                                        <Col md={4} className="form-group mb-3">
                                            <FormGroup>
                                                <Label for="">CD4 Count Value (Flow Cytometry)</Label>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    name="FCCd4CountValue"
                                                    id="FCCd4CountValue"
                                                    value={cd4CountObj.FCCd4CountValue}
                                                    onChange={handleInputChange}
                                                    style={{
                                                        border: "1px solid #014D88",
                                                        borderRadius: "0.25rem",
                                                    }}
                                                />
                                            </FormGroup>
                                        </Col>)}
                                    {/* Indications */}
                                    <>
                                        <Col md={4} className="form-group mb-3">
                                            {/* <div className="form-group col-md-3"> */}
                                            <FormGroup>
                                                <Label>
                                                    Lab Order Indication{" "}
                                                    <span style={{color: "red"}}> *</span>
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
                                                    <option value={""}>Select</option>
                                                    <option value="Routine">Routine</option>
                                                    <option value="AHD Screening">AHD Screening</option>
                                                    <option value="Other OI Screening">
                                                        Other OI Screening
                                                    </option>
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

                                    <Col md={4} className="form-group mb-3">
                                        <FormGroup>
                                            <Label for="encounterDate">
                                                {" "}
                                                Date Sample Collected{" "}
                                                <span style={{color: "red"}}> *</span>
                                            </Label>
                                            <Input
                                                type="datetime-local"
                                                name="sampleCollectionDate"
                                                id="sampleCollectionDate"
                                                value={tests.sampleCollectionDate}
                                                onChange={handleInputChange}
                                                //min={eacStatusObj && eacStatusObj.eacsession && eacStatusObj.eacsession!=='Default' ? eacStatusObj.eacsessionDate :enrollDate}
                                                min={enrollDate}
                                                max={moment(new Date()).format("YYYY-MM-DD")}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.25rem",
                                                }}
                                                disabled={fieldHidden}
                                                onKeyPress={(e) => e.preventDefault()}
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
                                            <Label for="encounterDate">
                                                Date Result Received{" "}
                                                {tests.result !== "" ? (
                                                    <span style={{color: "red"}}> *</span>
                                                ) : (
                                                    ""
                                                )}
                                            </Label>
                                            <Input
                                                type="datetime-local"
                                                name="dateResultReceived"
                                                id="dateResultReceived"
                                                value={tests.dateResultReceived}
                                                onChange={handleInputChange}
                                                min={tests.sampleCollectionDate}
                                                max={moment(new Date()).format("YYYY-MM-DD")}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.25rem",
                                                }}
                                                disabled={fieldHidden}
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

                                    {tests.labTestId === 73 ? (
                                        <>
                                            <div className="form-group col-md-3">
                                                <FormGroup>
                                                    <Label>
                                                        Result{" "}
                                                        {tests.dateResultReceived !== "" ? (
                                                            <span style={{color: "red"}}> *</span>
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
                                            </div>
                                        </>
                                    ) : tests.labTestId === 72 ? (
                                        <>
                                            <div className="form-group col-md-3">
                                                <FormGroup>
                                                    <Label>
                                                        Result{" "}
                                                        {tests.dateResultReceived !== "" ? (
                                                            <span style={{color: "red"}}> *</span>
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
                                                        <option value="Detected">Detected</option>
                                                        <option value="Not Detected">Not Detected</option>
                                                    </select>
                                                </FormGroup>
                                            </div>
                                        </>
                                    ) : tests.labTestId === 71 ? (
                                        <>
                                            <div className="form-group col-md-3">
                                                <FormGroup>
                                                    <Label>
                                                        Result{" "}
                                                        {tests.dateResultReceived !== "" ? (
                                                            <span style={{color: "red"}}> *</span>
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
                                            </div>
                                        </>
                                    ) : tests.labTestId === 70 ? (
                                        <>
                                            <div className="form-group col-md-3">
                                                <FormGroup>
                                                    <Label>
                                                        Result{" "}
                                                        {tests.dateResultReceived !== "" ? (
                                                            <span style={{color: "red"}}> *</span>
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
                                            </div>
                                        </>
                                    ) :
                                        tests.labTestId === 50 ? (
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
                                                                <option value={""}></option>
                                                                <option value="<200">{"<200"}</option>
                                                                <option value=">=200">{">=200"}</option>
                                                            </select>
                                                        </FormGroup>
                                                    </Col>
                                                </>
                                            )
                                        : tests.labTestId === 69 ? (
                                        <>
                                            <div className="form-group col-md-3">
                                                <FormGroup>
                                                    <Label>
                                                        Result{" "}
                                                        {tests.dateResultReceived !== "" ? (
                                                            <span style={{color: "red"}}> *</span>
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
                                            </div>
                                        </>
                                    ) : tests.labTestId === 66 ? (
                                        <>
                                            <div className="form-group col-md-3">
                                                <FormGroup>
                                                    <Label>
                                                        Result{" "}
                                                        {tests.dateResultReceived !== "" ? (
                                                            <span style={{color: "red"}}> *</span>
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
                                                        <option value="X-ray suggestive">
                                                            X-ray suggestive
                                                        </option>
                                                        <option value="X-ray not suggestive">
                                                            X-ray not suggestive
                                                        </option>
                                                    </select>
                                                </FormGroup>
                                            </div>
                                        </>
                                    ) : tests.labTestId === 64 ? (
                                        <>
                                            <div className="form-group col-md-3">
                                                <FormGroup>
                                                    <Label>
                                                        Result{" "}
                                                        {tests.dateResultReceived !== "" ? (
                                                            <span style={{color: "red"}}> *</span>
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
                                            </div>
                                        </>
                                    ) : tests.labTestId === 52 ? (
                                        <>
                                            <div className="form-group col-md-3">
                                                <FormGroup>
                                                    <Label>
                                                        Result{" "}
                                                        {tests.dateResultReceived !== "" ? (
                                                            <span style={{color: "red"}}> *</span>
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
                                            </div>
                                        </>
                                    ) : tests.labTestId === 51 ? (
                                        <>
                                            <div className="form-group col-md-3">
                                                <FormGroup>
                                                    <Label>
                                                        Result{" "}
                                                        {tests.dateResultReceived !== "" ? (
                                                            <span style={{color: "red"}}> *</span>
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
                                            </div>
                                        </>
                                    ) : tests.labTestId === 37 ? (
                                        <>
                                            <div className="form-group col-md-3">
                                                <FormGroup>
                                                    <Label>
                                                        Result{" "}
                                                        {tests.dateResultReceived !== "" ? (
                                                            <span style={{color: "red"}}> *</span>
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
                                            </div>
                                        </>
                                    ) : tests.labTestId === 36 ? (
                                        <>
                                            <div className="form-group col-md-3">
                                                <FormGroup>
                                                    <Label>
                                                        Result{" "}
                                                        {tests.dateResultReceived !== "" ? (
                                                            <span style={{color: "red"}}> *</span>
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
                                            </div>
                                        </>
                                    ) : tests.labTestId === 34 ? (
                                        <>
                                            <div className="form-group col-md-3">
                                                <FormGroup>
                                                    <Label>
                                                        Result{" "}
                                                        {tests.dateResultReceived !== "" ? (
                                                            <span style={{color: "red"}}> *</span>
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
                                            </div>
                                        </>
                                    ) : tests.labTestId === 32 ? (
                                        <>
                                            <div className="form-group col-md-3">
                                                <FormGroup>
                                                    <Label>
                                                        Result{" "}
                                                        {tests.dateResultReceived !== "" ? (
                                                            <span style={{color: "red"}}> *</span>
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
                                            </div>
                                        </>
                                    ) : tests.labTestId === 30 ? (
                                        <>
                                            <div className="form-group col-md-3">
                                                <FormGroup>
                                                    <Label>
                                                        Result{" "}
                                                        {tests.dateResultReceived !== "" ? (
                                                            <span style={{color: "red"}}> *</span>
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
                                            </div>
                                        </>
                                    ) : tests.labTestId === 29 ? (
                                        <>
                                            <div className="form-group col-md-3">
                                                <FormGroup>
                                                    <Label>
                                                        Result{" "}
                                                        {tests.dateResultReceived !== "" ? (
                                                            <span style={{color: "red"}}> *</span>
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
                                            </div>
                                        </>
                                    ) : tests.labTestId === 28 ? (
                                        <>
                                            <div className="form-group col-md-3">
                                                <FormGroup>
                                                    <Label>
                                                        Result{" "}
                                                        {tests.dateResultReceived !== "" ? (
                                                            <span style={{color: "red"}}> *</span>
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
                                            </div>
                                        </>
                                    ) : tests.labTestId === 27 ? (
                                        <>
                                            <div className="form-group col-md-3">
                                                <FormGroup>
                                                    <Label>
                                                        Result{" "}
                                                        {tests.dateResultReceived !== "" ? (
                                                            <span style={{color: "red"}}> *</span>
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
                                            </div>
                                        </>
                                    ) : tests.labTestId === 65 ? (
                                            <>
                                                <div className="form-group col-md-3">
                                                    <FormGroup>
                                                        <Label>
                                                            Result{" "}
                                                            {tests.dateResultReceived !== "" ? (
                                                                <span style={{color: "red"}}> *</span>
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
                                                            <option value="MTB Detected (Rifampicin not Resistance)">
                                                                {"MTB Detected (Rifampicin not Resistance)"}
                                                            </option>
                                                            <option value="MTB Detected (Rifampicin Resistance Detected)">
                                                                {"MTB Detected (Rifampicin Resistance Detected)"}
                                                            </option>
                                                            <option value="MTb Not Detected">
                                                                MTb Not Detected
                                                            </option>
                                                        </select>
                                                    </FormGroup>
                                                </div>
                                            </>
                                        )
                                        : tests.labTestId === 1 ? (
                                            <>
                                                <Col md={4} className="form-group mb-3">
                                                    <FormGroup>
                                                        <Label>
                                                            Result{" "}
                                                            {tests.dateResultReceived !== "" ? (
                                                                <span style={{color: "red"}}> *</span>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </Label>
                                                        <Input
                                                            className="form-control"
                                                            type="text"
                                                            name="result"
                                                            id="result"
                                                            value={tests.result}
                                                            onChange={handleInputChange}
                                                            style={{
                                                                border: "1px solid #014D88",
                                                                borderRadius: "0.25rem",
                                                            }}
                                                            required
                                                        />
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
                                                                <span style={{color: "red"}}> *</span>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </Label>

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
                                                            disabled={fieldHidden}
                                                        />
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

                                    {tests.labTestId === "16" ||
                                        (tests.labTestId === 16 && (
                                            <Col md={4} className="form-group mb-3">
                                                <FormGroup>
                                                    <Label for="vlIndication">
                                                        VL Indication{" "}
                                                        <span style={{color: "red"}}> *</span>
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
                                                        disabled={fieldHidden}
                                                    >
                                                        <option value="">Select</option>

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
                                        ))}
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
                                                disabled={fieldHidden}
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
                                            <span style={{color: "red"}}> *</span>
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
                                                required
                                                onKeyPress={(e) => e.preventDefault()}
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
                                                min={moment(tests.dateResultReported).format(
                                                    "YYYY-MM-DD"
                                                )}
                                                max={moment(new Date()).format("YYYY-MM-DD")}
                                                onChange={handleInputChange}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.25rem",
                                                }}
                                                disabled={fieldHidden}
                                                onKeyPress={(e) => e.preventDefault()}
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
                                                disabled={fieldHidden}
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
                                                onChange={handleInputChange}
                                                style={{
                                                    border: "1px solid #014D88",
                                                    borderRadius: "0.25rem",
                                                }}
                                                disabled={fieldHidden}
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
                                                disabled={fieldHidden}
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
                                                disabled={fieldHidden}
                                                style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}
                                            >

                                            </Input>

                                        </FormGroup>
                                    </Col>
                                </Row>
                            </div>

                            {saving ? <Spinner/> : ""}
                            <br/>
                            {props.activeContent.actionType === "update" ? (
                                <MatButton
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    startIcon={<SaveIcon/>}
                                    hidden={fieldHidden}
                                    style={{backgroundColor: "#014d88"}}
                                    disabled={!saving ? false : true}
                                    onClick={handleSubmit}
                                >
                                    {!saving ? (
                                        <span style={{textTransform: "capitalize"}}>Update</span>
                                    ) : (
                                        <span style={{textTransform: "capitalize"}}>
                      Updating...
                    </span>
                                    )}
                                </MatButton>
                            ) : (
                                ""
                            )}
                        </form>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default Laboratory;
