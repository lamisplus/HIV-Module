import React, { useState, useEffect } from "react";
import axios from "axios";
import MatButton from "@material-ui/core/Button";
//import Button from "@material-ui/core/Button";
import { Spinner, Form, FormGroup, Label, InputGroup, Input } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
//import AddIcon from "@material-ui/icons/Add";
import CancelIcon from "@material-ui/icons/Cancel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { FaPlus, FaAngleDown } from "react-icons/fa";
import moment from "moment";
import { url as baseUrl, token as token } from "./../../../api";
import { usePeadiatricFormValidationSchema } from "../../formValidationSchema/PeadiatricDisclosureChecklistValidationSchema";

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(20),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
    "& > *": {
      margin: theme.spacing(1),
    },
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
  demo: {
    backgroundColor: theme.palette.background.default,
  },
  inline: {
    display: "inline",
  },
  error: {
    color: "#f85032",
    fontSize: "12.8px",
  },
  success: {
    color: "#4BB543 ",
    fontSize: "11px",
  },
}));

const EditAndViewPeadiatricDisclosureChecklist = (props) => {
  const [saving, setSavings] = useState(false);

  const PatientObject =
    props.patientObj && props.patientObj ? props.patientObj : null;
  const submitNewRecord = (values) => {
    const observation = {
      data: values,
      dateOfObservation:
        values.encounterDate === ""
          ? moment(new Date()).format("YYYY-MM-DD")
          : values.encounterDate,
      facilityId: null,
      personId: props.patientObj.id,
      type: "Paediatric OTZ",
      visitId: null,
    };
    axios
      .post(`${baseUrl}observation`, observation, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setSavings(false);
        // props.patientObj.mentalHealth = true;
        toast.success("Paediatric OTZ screening save successful.");
        props.setActiveContent({
          ...props.activeContent,
          route: "recent-history",
        }); //Redirect to patient home page
      })
      .catch((error) => {
        setSavings(false);
        let errorMessage =
          error.response.data && error.response.data.apierror.message !== ""
            ? error.response.data.apierror.message
            : "Something went wrong, please try again";
        toast.error(errorMessage);
      });
  };

  const handleFilterNumber = (e, setFieldValue) => {
    // Apply your regex to filter out numbers
    const newValue = e.target.value.replace(/\d/g, "");
    setFieldValue(e.target.name, newValue);
  };

  const updateOldRecord = (values) => {
    const observation = {
      data: values,
      dateOfObservation:
        values.encounterDate === ""
          ? moment(new Date()).format("YYYY-MM-DD")
          : values.encounterDate,
      facilityId: null,
      personId: props.patientObj.id,
      type: "Paediatric OTZ",
      visitId: null,
    };
    axios
      .put(`${baseUrl}observation/${props.activeContent.id}`, observation, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setSavings(false);
        // props.patientObj.mentalHealth = true;
        toast.success("Paediatric OTZ screening save successful.");
        props.setActiveContent({
          ...props.activeContent,
          route: "recent-history",
        }); //Redirect to patient home page
      })
      .catch((error) => {
        setSavings(false);
        let errorMessage =
          error.response.data && error.response.data.apierror.message !== ""
            ? error.response.data.apierror.message
            : "Something went wrong, please try again";
        toast.error(errorMessage);
      });
  };

  const handleSubmit = (values) => {
    if (props?.activeContent?.actionType !== "create") {
      updateOldRecord(values);
      return;
    }
    submitNewRecord(values);
  };

  const classes = useStyles();
  const [
    {
      generalInformationSection,
      task1Section,
      task2Section,
      task3Section,
      task4Section,
    },
    setSectionControls,
  ] = useState({
    generalInformationSection: false,
    task1Section: false,
    task2Section: false,
    task3Section: false,
    task4Section: false,
  });

  const { formik } = usePeadiatricFormValidationSchema(handleSubmit);

  const getOldRecordIfExists = () => {
    axios
      .get(`${baseUrl}observation/${props?.activeContent?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const patientDTO = response.data.data;
        formik.setValues(patientDTO);
        //props.setActiveContent({...props.activeContent, route:'recent-history'})//Redirect to patient home page
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getOldRecordIfExists();
  }, []);

  const isViewActionType = props?.activeContent?.actionType === "view";

  return (
    <>
      <ToastContainer autoClose={3000} hideProgressBar />
      <div
        className="row page-titles mx-0"
        style={{ marginTop: "0px", marginBottom: "-10px" }}
      >
        <ol className="breadcrumb">
          <li className="breadcrumb-item active">
            <h2> OTZ Peadiatric Disclosure Checklist</h2>
          </li>
        </ol>
      </div>

      <Card className={classes.root}>
        <CardContent>
          <div className="col-xl-12 col-lg-12">
            <Form>
              <div className="card">
                <div
                  className="card-header"
                  style={{
                    backgroundColor: "#014d88",
                    color: "#fff",
                    fontWeight: "bolder",
                    borderRadius: "0.2rem",
                  }}
                >
                  <h5 className="card-title" style={{ color: "#fff" }}>
                    General Information
                  </h5>
                  {generalInformationSection === false ? (
                    <>
                      <span
                        className="float-end"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setSectionControls((prevState) => {
                            return {
                              ...prevState,
                              generalInformationSection:
                                !prevState.generalInformationSection,
                            };
                          })
                        }
                      >
                        <FaPlus />
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        className="float-end"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setSectionControls((prevState) => {
                            return {
                              ...prevState,
                              generalInformationSection:
                                !prevState.generalInformationSection,
                            };
                          })
                        }
                      >
                        <FaAngleDown />
                      </span>{" "}
                    </>
                  )}
                </div>

                {generalInformationSection && (
                  <div className="row p-4">
                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label>Encounter Date</Label>
                        <Input
                          readOnly={isViewActionType}
                          name="encounterDate"
                          id="encounterDate"
                           type="date" onKeyPress={(e) => e.preventDefault()}
                          value={formik.values.encounterDate}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          max={moment(new Date()).format("YYYY-MM-DD")}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                          }}
                        ></Input>
                      </FormGroup>
                      {formik.errors.encounterDate !== "" ? (
                        <span className={classes.error}>
                          {formik.errors.encounterDate}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label>Caregiver's Name</Label>
                        <Input
                          readOnly={isViewActionType}
                          name="caregiverName"
                          id="caregiverName"
                          type="text"
                          value={formik.values.caregiverName}
                          onChange={(e) =>
                            handleFilterNumber(e, formik?.setFieldValue)
                          }
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                          }}
                        ></Input>
                      </FormGroup>
                      {formik.errors.caregiverName !== "" ? (
                        <span className={classes.error}>
                          {formik.errors.caregiverName}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label>CCC Number</Label>
                        <Input
                          readOnly={isViewActionType}
                          name="cccNumber"
                          id="cccNumber"
                          type="text"
                          value={formik.values.cccNumber}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                          }}
                        ></Input>
                      </FormGroup>
                      {formik.errors.cccNumber !== "" ? (
                        <span className={classes.error}>
                          {formik.errors.cccNumber}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="card">
                <div
                  className="card-header"
                  style={{
                    backgroundColor: "#014d88",
                    color: "#fff",
                    fontWeight: "bolder",
                    borderRadius: "0.2rem",
                  }}
                >
                  <h5 className="card-title" style={{ color: "#fff" }}>
                    Task 1 (Assess the child for disclosure eligibility)
                  </h5>
                  {task1Section === false ? (
                    <>
                      <span
                        className="float-end"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setSectionControls((prevState) => {
                            return {
                              ...prevState,
                              task1Section: !prevState.task1Section,
                            };
                          })
                        }
                      >
                        <FaPlus />
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        className="float-end"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setSectionControls((prevState) => {
                            return {
                              ...prevState,
                              task1Section: !prevState.task1Section,
                            };
                          })
                        }
                      >
                        <FaAngleDown />
                      </span>{" "}
                    </>
                  )}
                </div>

                {task1Section && (
                  <div className="row p-4">
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>Date Task 1 executed</Label>

                        <Input
                          readOnly={isViewActionType}
                           type="date" onKeyPress={(e) => e.preventDefault()}
                          name="dateTask1Executed"
                          id="dateTask1Executed"
                          value={formik.values.dateTask1Executed}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          max={moment(new Date()).format("YYYY-MM-DD")}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                          }}
                        ></Input>
                      </FormGroup>
                      {formik.errors.dateTask1Executed !== "" ? (
                        <span className={classes.error}>
                          {formik.errors.dateTask1Executed}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>Task facilitator name</Label>

                        <Input
                          readOnly={isViewActionType}
                          type="text"
                          name="task1HCW"
                          id="task1HCW"
                          value={formik.values.task1HCW}
                          onChange={(e) =>
                            handleFilterNumber(e, formik?.setFieldValue)
                          }
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                          }}
                        ></Input>
                      </FormGroup>
                      {formik.errors.task1HCW !== "" ? (
                        <span className={classes.error}>
                          {formik.errors.task1HCW}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Child met the age criteria (between 6 and 10 years)
                        </Label>
                        <Input
                          readOnly={isViewActionType}
                          name="task1ChildMetCriteria"
                          id="task1ChildMetCriteria"
                          type="select"
                          value={formik.values.task1ChildMetCriteria}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                          }}
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Input>
                      </FormGroup>
                      {formik.errors.task1ChildMetCriteria !== "" ? (
                        <span className={classes.error}>
                          {formik.errors.task1ChildMetCriteria}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Child and caregiver knowledgeable on the benefits of
                          disclosure
                        </Label>
                        <Input
                          readOnly={isViewActionType}
                          name="task1ChildAndCaregiverKnowledgeable"
                          id="task1ChildAndCaregiverKnowledgeable"
                          type="select"
                          value={
                            formik.values.task1ChildAndCaregiverKnowledgeable
                          }
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                          }}
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Input>
                      </FormGroup>
                      {formik.errors.task1ChildAndCaregiverKnowledgeable !==
                      "" ? (
                        <span className={classes.error}>
                          {formik.errors.task1ChildAndCaregiverKnowledgeable}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="form-group mb-3 col-md-12">
                      <FormGroup>
                        <Label>
                          Caregiver willing to disclose to the child
                        </Label>
                        <Input
                          readOnly={isViewActionType}
                          name="task1CaregiverWilling"
                          id="task1CaregiverWilling"
                          type="select"
                          value={formik.values.task1CaregiverWilling}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                          }}
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Input>
                      </FormGroup>
                      {formik.errors.task1CaregiverWilling !== "" ? (
                        <span className={classes.error}>
                          {formik.errors.task1CaregiverWilling}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="form-group mb-3 col-md-12">
                      <FormGroup>
                        <Label>Task 1 comments</Label>
                        <Input
                          readOnly={isViewActionType}
                          name="task1Comments"
                          id="task1Comments"
                          type="textarea"
                          value={formik.values.task1Comments}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                            height: "100px",
                          }}
                        ></Input>
                      </FormGroup>
                      {formik.errors.task1Comments !== "" ? (
                        <span className={classes.error}>
                          {formik.errors.task1Comments}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="card">
                <div
                  className="card-header"
                  style={{
                    backgroundColor: "#014d88",
                    color: "#fff",
                    fontWeight: "bolder",
                    borderRadius: "0.2rem",
                  }}
                >
                  <h5 className="card-title" style={{ color: "#fff" }}>
                    Task 2 (Assess the child and caregiver for readiness)
                  </h5>
                  {task2Section === false ? (
                    <>
                      <span
                        className="float-end"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setSectionControls((prevState) => {
                            return {
                              ...prevState,
                              task2Section: !prevState.task2Section,
                            };
                          })
                        }
                      >
                        <FaPlus />
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        className="float-end"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setSectionControls((prevState) => {
                            return {
                              ...prevState,
                              task2Section: !prevState.task2Section,
                            };
                          })
                        }
                      >
                        <FaAngleDown />
                      </span>{" "}
                    </>
                  )}
                </div>

                {task2Section && (
                  <div className="row p-4">
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>Date Task 2 executed</Label>

                        <Input
                          readOnly={isViewActionType}
                           type="date" onKeyPress={(e) => e.preventDefault()}
                          name="dateTask2Executed"
                          id="dateTask2Executed"
                          value={formik.values.dateTask2Executed}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          max={moment(new Date()).format("YYYY-MM-DD")}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                          }}
                        ></Input>
                      </FormGroup>
                      {formik.errors.dateTask2Executed !== "" ? (
                        <span className={classes.error}>
                          {formik.errors.dateTask2Executed}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>Task 2 facilitator name</Label>

                        <Input
                          readOnly={isViewActionType}
                          type="text"
                          name="task2HCW"
                          id="task2HCW"
                          value={formik.values.task2HCW}
                          onChange={(e) =>
                            handleFilterNumber(e, formik?.setFieldValue)
                          }
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                          }}
                        ></Input>
                      </FormGroup>
                      {formik.errors.task2HCW !== "" ? (
                        <span className={classes.error}>
                          {formik.errors.task2HCW}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Child or caregiver free from severe physical illness,
                          trauma, psychological illness or physical illness
                        </Label>
                        <Input
                          readOnly={isViewActionType}
                          name="task2FreeFromPhysicalIllness"
                          id="task2FreeFromPhysicalIllness"
                          type="select"
                          value={formik.values.task2FreeFromPhysicalIllness}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                          }}
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Input>
                      </FormGroup>
                      {formik.errors.task2FreeFromPhysicalIllness !== "" ? (
                        <span className={classes.error}>
                          {formik.errors.task2FreeFromPhysicalIllness}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Child have consisitent family, peer support or social
                          support
                        </Label>
                        <Input
                          readOnly={isViewActionType}
                          name="task2ChildConsisitentFamilyPeer"
                          id="task2ChildConsisitentFamilyPeer"
                          type="select"
                          value={formik.values.task2ChildConsisitentFamilyPeer}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                            marginTop: "20px",
                          }}
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Input>
                      </FormGroup>
                      {formik.errors.task2ChildConsisitentFamilyPeer !== "" ? (
                        <span className={classes.error}>
                          {formik.errors.task2ChildConsisitentFamilyPeer}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Child demostrates interest in the environment and
                          playing activites
                        </Label>
                        <Input
                          readOnly={isViewActionType}
                          name="task2ChildDemostrateInEnvAndPlaying"
                          id="task2ChildDemostrateInEnvAndPlaying"
                          type="select"
                          value={
                            formik.values.task2ChildDemostrateInEnvAndPlaying
                          }
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                            marginTop: "20px",
                          }}
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Input>
                      </FormGroup>
                      {formik.errors.task2ChildDemostrateInEnvAndPlaying !==
                      "" ? (
                        <span className={classes.error}>
                          {formik.errors.task2ChildDemostrateInEnvAndPlaying}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Assess what the child knows about the medicines and
                          illness and addressed needs and concerns
                        </Label>
                        <Input
                          readOnly={isViewActionType}
                          name="task2AssessedWhatChildAlreadyKnows"
                          id="task2AssessedWhatChildAlreadyKnows"
                          type="select"
                          value={
                            formik.values.task2AssessedWhatChildAlreadyKnows
                          }
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                            // height: "100px"
                          }}
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Input>
                      </FormGroup>
                      {formik.errors.task2AssessedWhatChildAlreadyKnows !==
                      "" ? (
                        <span className={classes.error}>
                          {formik.errors.task2AssessedWhatChildAlreadyKnows}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Assessed functional school engagement by the child
                          (consistent attendance, interacts well with the school
                          community, able to freely discuss school activities)
                        </Label>
                        <Input
                          readOnly={isViewActionType}
                          name="taskAssessedFunctionalSchoolEngagement"
                          id="taskAssessedFunctionalSchoolEngagement"
                          type="select"
                          value={
                            formik.values.taskAssessedFunctionalSchoolEngagement
                          }
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                            // height: "100px"
                          }}
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Input>
                      </FormGroup>
                      {formik.errors.taskAssessedFunctionalSchoolEngagement !==
                      "" ? (
                        <span className={classes.error}>
                          {formik.errors.taskAssessedFunctionalSchoolEngagement}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Assessed caregiver readiness for disclosure to the
                          child
                        </Label>
                        <Input
                          readOnly={isViewActionType}
                          name="task2assessedCaregiverReadinessForDisclosureToChild"
                          id="task2assessedCaregiverReadinessForDisclosureToChild"
                          type="select"
                          value={
                            formik.values
                              .task2assessedCaregiverReadinessForDisclosureToChild
                          }
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                            marginTop: "20px",
                          }}
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Input>
                      </FormGroup>
                      {formik.errors
                        .task2assessedCaregiverReadinessForDisclosureToChild !==
                      "" ? (
                        <span className={classes.error}>
                          {
                            formik.errors
                              .task2assessedCaregiverReadinessForDisclosureToChild
                          }
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                 
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Discussed management of confidentiality of information
                          regarding one's health with the child and caregiver
                        </Label>
                        <Input
                          readOnly={isViewActionType}
                          name="task2DiscussedManagementOfConfidentiality"
                          id="task2DiscussedManagementOfConfidentiality"
                          type="select"
                          value={
                            formik.values
                              .task2DiscussedManagementOfConfidentiality
                          }
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                            // height: "100px"
                          }}
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Input>
                      </FormGroup>
                      {formik.errors
                        .task2DiscussedManagementOfConfidentiality !== "" ? (
                        <span className={classes.error}>
                          {
                            formik.errors
                              .task2DiscussedManagementOfConfidentiality
                          }
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="form-group mb-3 col-md-12">
                      <FormGroup>
                        <Label>Task 2 comments</Label>
                        <Input
                          readOnly={isViewActionType}
                          name="task2Comments"
                          id="task2Comments"
                          type="textarea"
                          value={formik.values.task2Comments}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                            height: "100px",
                          }}
                        ></Input>
                      </FormGroup>
                      {formik.errors.task2Comments !== "" ? (
                        <span className={classes.error}>
                          {formik.errors.task2Comments}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="card">
                <div
                  className="card-header"
                  style={{
                    backgroundColor: "#014d88",
                    color: "#fff",
                    fontWeight: "bolder",
                    borderRadius: "0.2rem",
                  }}
                >
                  <h5 className="card-title" style={{ color: "#fff" }}>
                    Task 3 (Execute disclosure: done guided by caregiver and
                    supported by health care worker in the clinic)
                  </h5>
                  {task3Section === false ? (
                    <>
                      <span
                        className="float-end"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setSectionControls((prevState) => {
                            return {
                              ...prevState,
                              task3Section: !prevState.task3Section,
                            };
                          })
                        }
                      >
                        <FaPlus />
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        className="float-end"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setSectionControls((prevState) => {
                            return {
                              ...prevState,
                              task3Section: !prevState.task3Section,
                            };
                          })
                        }
                      >
                        <FaAngleDown />
                      </span>{" "}
                    </>
                  )}
                </div>

                {task3Section && (
                  <div className="row p-4">
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>Date Task 3 executed</Label>

                        <Input
                          readOnly={isViewActionType}
                           type="date" onKeyPress={(e) => e.preventDefault()}
                          name="dateTask3Executed"
                          id="dateTask3Executed"
                          value={formik.values.dateTask3Executed}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          max={moment(new Date()).format("YYYY-MM-DD")}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                          }}
                        ></Input>
                      </FormGroup>
                      {formik.errors.dateTask3Executed !== "" ? (
                        <span className={classes.error}>
                          {formik.errors.dateTask3Executed}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>Task 3 facilitator name</Label>

                        <Input
                          readOnly={isViewActionType}
                          type="text"
                          name="task3HCW"
                          id="task3HCW"
                          value={formik.values.task3HCW}
                          onChange={(e) =>
                            handleFilterNumber(e, formik?.setFieldValue)
                          }
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                          }}
                        ></Input>
                      </FormGroup>
                      {formik.errors.task3HCW !== "" ? (
                        <span className={classes.error}>
                          {formik.errors.task3HCW}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>Reassured the caregiver and the child</Label>
                        <Input
                          readOnly={isViewActionType}
                          name="task3ReassuredTheCaregiverAndChild"
                          id="task3ReassuredTheCaregiverAndChild"
                          type="select"
                          value={
                            formik.values.task3ReassuredTheCaregiverAndChild
                          }
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                          }}
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Input>
                      </FormGroup>
                      {formik.errors.task3ReassuredTheCaregiverAndChild !==
                      "" ? (
                        <span className={classes.error}>
                          {formik.errors.task3ReassuredTheCaregiverAndChild}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>Assessed child and caregiver comfort</Label>
                        <Input
                          readOnly={isViewActionType}
                          name="task3AssessedChildAndCaregiverComfort"
                          id="task3AssessedChildAndCaregiverComfort"
                          type="select"
                          value={
                            formik.values.task3AssessedChildAndCaregiverComfort
                          }
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                          }}
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Input>
                      </FormGroup>
                      {formik.errors.task3AssessedChildAndCaregiverComfort !==
                      "" ? (
                        <span className={classes.error}>
                          {formik.errors.task3AssessedChildAndCaregiverComfort}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>Assessed safety (environment and timing)</Label>
                        <Input
                          readOnly={isViewActionType}
                          name="task3AssessedSafety"
                          id="task3AssessedSafety"
                          type="select"
                          value={formik.values.task3AssessedSafety}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                            // marginTop: "20px",
                          }}
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Input>
                      </FormGroup>
                      {formik.errors.task3AssessedSafety !== "" ? (
                        <span className={classes.error}>
                          {formik.errors.task3AssessedSafety}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>Assessed the depth of Child's knowledge</Label>
                        <Input
                          readOnly={isViewActionType}
                          name="task3AssessedTheDepthOfChildKnowledge"
                          id="task3AssessedTheDepthOfChildKnowledge"
                          type="select"
                          value={
                            formik.values.task3AssessedTheDepthOfChildKnowledge
                          }
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                            // height: "100px"
                          }}
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Input>
                      </FormGroup>
                      {formik.errors.task3AssessedTheDepthOfChildKnowledge !==
                      "" ? (
                        <span className={classes.error}>
                          {formik.errors.task3AssessedTheDepthOfChildKnowledge}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Supported caregiver to disclose using the simplest
                          language the child can understand
                        </Label>
                        <Input
                          readOnly={isViewActionType}
                          name="task3SupportedCaregiverToDisclose"
                          id="task3SupportedCaregiverToDisclose"
                          type="select"
                          value={
                            formik.values.task3SupportedCaregiverToDisclose
                          }
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                            // marginTop: "20px"
                          }}
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Input>
                      </FormGroup>
                      {formik.errors.task3SupportedCaregiverToDisclose !==
                      "" ? (
                        <span className={classes.error}>
                          {formik.errors.task3SupportedCaregiverToDisclose}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Observed the immediate reactions of both the child and
                          caregiver and addressed concerns or negative reactions
                        </Label>
                        <Input
                          readOnly={isViewActionType}
                          name="task3ObservedTheImmediateReactionOfChildAndCaregiver"
                          id="task3ObservedTheImmediateReactionOfChildAndCaregiver"
                          type="select"
                          value={
                            formik.values
                              .task3ObservedTheImmediateReactionOfChildAndCaregiver
                          }
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                            // marginTop: "20px"
                          }}
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Input>
                      </FormGroup>
                      {formik.errors
                        .task3ObservedTheImmediateReactionOfChildAndCaregiver !==
                      "" ? (
                        <span className={classes.error}>
                          {
                            formik.errors
                              .task3ObservedTheImmediateReactionOfChildAndCaregiver
                          }
                        </span>
                      ) : (
                        ""
                      )}
                    </div>


                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>Invited questions from the child</Label>
                        <Input
                          readOnly={isViewActionType}
                          name="task3InvitedQuestionsFromChild"
                          id="task3InvitedQuestionsFromChild"
                          type="select"
                          value={formik.values.task3InvitedQuestionsFromChild}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                            // height: "100px"
                          }}
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Input>
                      </FormGroup>
                      {formik.errors.task3InvitedQuestionsFromChild !== "" ? (
                        <span className={classes.error}>
                          {formik.errors.task3InvitedQuestionsFromChild}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Revisited/reviewed the benefits of disclosure with the
                          child and caregiver
                        </Label>
                        <Input
                          readOnly={isViewActionType}
                          name="task3RevistedBenefitsOfDisclosureWithChild"
                          id="task3RevistedBenefitsOfDisclosureWithChild"
                          type="select"
                          value={
                            formik.values
                              .task3RevistedBenefitsOfDisclosureWithChild
                          }
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                            // height: "100px"
                          }}
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Input>
                      </FormGroup>
                      {formik.errors
                        .task3RevistedBenefitsOfDisclosureWithChild !== "" ? (
                        <span className={classes.error}>
                          {
                            formik.errors
                              .task3RevistedBenefitsOfDisclosureWithChild
                          }
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Explained care options available to the child and
                          caregiver
                        </Label>
                        <Input
                          readOnly={isViewActionType}
                          name="task3ExplainedCareOptionsAvailable"
                          id="task3ExplainedCareOptionsAvailable"
                          type="select"
                          value={
                            formik.values.task3ExplainedCareOptionsAvailable
                          }
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                            // marginTop: "40px"
                          }}
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Input>
                      </FormGroup>
                      {formik.errors.task3ExplainedCareOptionsAvailable !==
                      "" ? (
                        <span className={classes.error}>
                          {formik.errors.task3ExplainedCareOptionsAvailable}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="form-group mb-3 col-md-12">
                      <FormGroup>
                        <Label>
                          Concluded the session with reassurance to both the
                          child and caregiver? reiterating importance of
                          confidentiality of information of one's health with
                          the child's caregiver
                        </Label>
                        <Input
                          readOnly={isViewActionType}
                          name="task3ConcludedSessionWithReassurance"
                          id="task3ConcludedSessionWithReassurance"
                          type="select"
                          value={
                            formik.values.task3ConcludedSessionWithReassurance
                          }
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                            // height: "100px"
                          }}
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Input>
                      </FormGroup>
                      {formik.errors.task3ConcludedSessionWithReassurance !==
                      "" ? (
                        <span className={classes.error}>
                          {formik.errors.task3ConcludedSessionWithReassurance}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="form-group mb-3 col-md-12">
                      <FormGroup>
                        <Label>Task 3 comments</Label>
                        <Input
                          readOnly={isViewActionType}
                          name="task3Comments"
                          id="task3Comments"
                          type="textarea"
                          value={formik.values.task3Comments}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.25rem",
                            height: "100px",
                          }}
                        ></Input>
                      </FormGroup>
                      {formik.errors.task3Comments !== "" ? (
                        <span className={classes.error}>
                          {formik.errors.task3Comments}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="card">
                <div
                  className="card-header"
                  style={{
                    backgroundColor: "#014d88",
                    color: "#fff",
                    fontWeight: "bolder",
                    borderRadius: "0.2rem",
                  }}
                >
                  <h5 className="card-title" style={{ color: "#fff" }}>
                    Task 4: Post disclosure assessment (During the subsequent
                    visits assess the post disclosure outcomes)
                  </h5>
                  {task4Section === false ? (
                    <>
                      <span
                        className="float-end"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setSectionControls((prevState) => {
                            return {
                              ...prevState,
                              task4Section: !prevState.task4Section,
                            };
                          })
                        }
                      >
                        <FaPlus />
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        className="float-end"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setSectionControls((prevState) => {
                            return {
                              ...prevState,
                              task4Section: !prevState.task4Section,
                            };
                          })
                        }
                      >
                        <FaAngleDown />
                      </span>{" "}
                    </>
                  )}
                </div>

                { task4Section && <div className="row p-4">
                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label>Date Task 4 executed</Label>

                      <Input
                        readOnly={isViewActionType}
                         type="date" onKeyPress={(e) => e.preventDefault()}
                        name="dateTask4Executed"
                        id="dateTask4Executed"
                        value={formik.values.dateTask4Executed}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                      ></Input>
                    </FormGroup>
                    {formik.errors.dateTask4Executed !== "" ? (
                      <span className={classes.error}>
                        {formik.errors.dateTask4Executed}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label>Task 4 facilitator name</Label>

                      <Input
                        readOnly={isViewActionType}
                        type="text"
                        name="task4HCW"
                        id="task4HCW"
                        value={formik.values.task4HCW}
                        onChange={(e) =>
                          handleFilterNumber(e, formik?.setFieldValue)
                        }
                        onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                      ></Input>
                    </FormGroup>
                    {formik.errors.task4HCW !== "" ? (
                      <span className={classes.error}>
                        {formik.errors.task4HCW}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label>Assessed functional school engagement</Label>
                      <Input
                        readOnly={isViewActionType}
                        name="task4AssessedFunctionalSchoolEngagement"
                        id="task4AssessedFunctionalSchoolEngagement"
                        type="select"
                        value={
                          formik.values.task4AssessedFunctionalSchoolEngagement
                        }
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                      >
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </Input>
                    </FormGroup>
                    {formik.errors.task4AssessedFunctionalSchoolEngagement !==
                    "" ? (
                      <span className={classes.error}>
                        {formik.errors.task4AssessedFunctionalSchoolEngagement}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label>
                        Assessed family, social and peer relationship and
                        support after disclosure
                      </Label>
                      <Input
                        readOnly={isViewActionType}
                        name="task4AssessedFamilySocialAndPeerRelationship"
                        id="task4AssessedFamilySocialAndPeerRelationship"
                        type="select"
                        value={
                          formik.values
                            .task4AssessedFamilySocialAndPeerRelationship
                        }
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                      >
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </Input>
                    </FormGroup>
                    {formik.errors
                      .task4AssessedFamilySocialAndPeerRelationship !== "" ? (
                      <span className={classes.error}>
                        {
                          formik.errors
                            .task4AssessedFamilySocialAndPeerRelationship
                        }
                      </span>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label>
                        Assessed the child's interest and engagement in
                        children's activities like playing
                      </Label>
                      <Input
                        readOnly={isViewActionType}
                        name="task4AssessedInterestAndEngagementOfChild"
                        id="task4AssessedInterestAndEngagementOfChild"
                        type="select"
                        value={
                          formik.values
                            .task4AssessedInterestAndEngagementOfChild
                        }
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                          // marginTop: "20px",
                        }}
                      >
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </Input>
                    </FormGroup>
                    {formik.errors.task4AssessedInterestAndEngagementOfChild !==
                    "" ? (
                      <span className={classes.error}>
                        {
                          formik.errors
                            .task4AssessedInterestAndEngagementOfChild
                        }
                      </span>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label>
                        Alllowed questions from the child and assessed
                        self-perception and outlook
                      </Label>
                      <Input
                        readOnly={isViewActionType}
                        name="task4AllowedQuestionsFromChild"
                        id="task4AllowedQuestionsFromChild"
                        type="select"
                        value={formik.values.task4AllowedQuestionsFromChild}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                          // height: "100px"
                        }}
                      >
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </Input>
                    </FormGroup>
                    {formik.errors.task4AllowedQuestionsFromChild !== "" ? (
                      <span className={classes.error}>
                        {formik.errors.task4AllowedQuestionsFromChild}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label>
                        Addressed negative body or self-image issues
                      </Label>
                      <Input
                        readOnly={isViewActionType}
                        name="task4AddressedNegativeBodyOrSelfImageIssues"
                        id="task4AddressedNegativeBodyOrSelfImageIssues"
                        type="select"
                        value={
                          formik.values
                            .task4AddressedNegativeBodyOrSelfImageIssues
                        }
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                          // marginTop: "20px"
                        }}
                      >
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </Input>
                    </FormGroup>
                    {formik.errors
                      .task4AddressedNegativeBodyOrSelfImageIssues !== "" ? (
                      <span className={classes.error}>
                        {
                          formik.errors
                            .task4AddressedNegativeBodyOrSelfImageIssues
                        }
                      </span>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label>
                        Have you assessed the child for moodiness and negative
                        behaviors
                      </Label>
                      <Input
                        readOnly={isViewActionType}
                        name="task4AssessedChildForMoodiness"
                        id="task4AssessedChildForMoodiness"
                        type="select"
                        value={formik.values.task4AssessedChildForMoodiness}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                          // marginTop: "20px"
                        }}
                      >
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </Input>
                    </FormGroup>
                    {formik.errors.task4AssessedChildForMoodiness !== "" ? (
                      <span className={classes.error}>
                        {formik.errors.task4AssessedChildForMoodiness}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label>
                        Referred appropriately for psychiatric and other
                        complications developed post disclosure if indicated
                      </Label>
                      <Input
                        readOnly={isViewActionType}
                        name="task4ReferredAppropriately"
                        id="task4ReferredAppropriately"
                        type="select"
                        value={formik.values.task4ReferredAppropriately}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                          // marginTop: "20px"
                        }}
                      >
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </Input>
                    </FormGroup>
                    {formik.errors.task4ReferredAppropriately !== "" ? (
                      <span className={classes.error}>
                        {formik.errors.task4ReferredAppropriately}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label>Given age-appropriate adherence information</Label>
                      <Input
                        readOnly={isViewActionType}
                        name="task4GivenAppropriateAdherenceInformation"
                        id="task4GivenAppropriateAdherenceInformation"
                        type="select"
                        value={
                          formik.values
                            .task4GivenAppropriateAdherenceInformation
                        }
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                          marginTop: "20px",
                        }}
                      >
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </Input>
                    </FormGroup>
                    {formik.errors.task4GivenAppropriateAdherenceInformation !==
                    "" ? (
                      <span className={classes.error}>
                        {
                          formik.errors
                            .task4GivenAppropriateAdherenceInformation
                        }
                      </span>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="form-group mb-3 col-md-12">
                    <FormGroup>
                      <Label>Task 4 comments</Label>
                      <Input
                        readOnly={isViewActionType}
                        name="task4Comments"
                        id="task4Comments"
                        type="textarea"
                        value={formik.values.task4Comments}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                          height: "100px",
                        }}
                      ></Input>
                    </FormGroup>
                    {formik.errors.task4Comments !== "" ? (
                      <span className={classes.error}>
                        {formik.errors.task4Comments}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="form-group mb-3 col-md-12">
                    <FormGroup>
                      <Label>Final comments</Label>
                      <Input
                        readOnly={isViewActionType}
                        name="finalComments"
                        id="finalComments"
                        type="textarea"
                        value={formik.values.finalComments}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                          height: "100px",
                        }}
                      ></Input>
                    </FormGroup>
                    {formik.errors.finalComments !== "" ? (
                      <span className={classes.error}>
                        {formik.errors.finalComments}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </div> }
              </div>

              {props?.activeContent?.actionType === "create" && (
                <div className="d-flex justify-content-end">
                  <MatButton
                    type="button"
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    style={{ backgroundColor: "#014d88" }}
                    startIcon={<SaveIcon />}
                    disabled={saving}
                    onClick={() => handleSubmit(formik.values)}
                  >
                    {!saving ? (
                      <span style={{ textTransform: "capitalize" }}>
                        {props?.activeContent?.actionType === "create"
                          ? "Submit"
                          : "Update"}
                      </span>
                    ) : (
                      <span style={{ textTransform: "capitalize" }}>
                        Submitting...
                      </span>
                    )}
                  </MatButton>
                </div>
              )}

              {props?.activeContent?.actionType === "update" && (
                <div className="d-flex justify-content-end">
                  <MatButton
                    type="button"
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    style={{ backgroundColor: "#014d88" }}
                    startIcon={<SaveIcon />}
                    disabled={saving}
                    onClick={() => handleSubmit(formik.values)}
                  >
                    {!saving ? (
                      <span style={{ textTransform: "capitalize" }}>
                        {props?.activeContent?.actionType === "create"
                          ? "Submit"
                          : "Update"}
                      </span>
                    ) : (
                      <span style={{ textTransform: "capitalize" }}>
                        Submitting...
                      </span>
                    )}
                  </MatButton>
                </div>
              )}

              {saving && <Spinner />}
            </Form>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default EditAndViewPeadiatricDisclosureChecklist;
