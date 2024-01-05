import React, { useState, useEffect } from "react";
import { Spinner, Form, FormGroup, Label, Input } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent } from "@material-ui/core";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { FaPlus } from "react-icons/fa";
import { useServiceFormValidationSchema } from "../../formValidationSchema/ServiceFormValidationSchema";
import { Collapse, IconButton } from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import MatButton from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import moment from "moment";
import axios from "axios";
import { url as baseUrl } from "./../../../api";
import { token as token } from "./../../../api";
import CustomFormGroup from "./CustomFormGroup";

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

const ServiceForm = (props) => {
  const [saving, setSavings] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [otzOutcomesArray, setOtzOutcomes] = useState([]);

  const submitNewRecord = (values, param) => {
    const observation = {
      data: values,
      dateOfObservation:
        values.dateDone != ""
          ? values.dateDone
          : moment(new Date()).format("YYYY-MM-DD"),
      facilityId: null,
      personId: props?.patientObj?.id,
      type: "Service OTZ",
      visitId: null,
    };
    axios
      .post(`${baseUrl}observation`, observation, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setSavings(false);
        toast.success("Service OTZ enrollment save successful.");
        props.setActiveContent({
          ...props?.activeContent,
          route: "otz-service-form",
        });
      })
      .catch((error) => {
        setSavings(false);
        let errorMessage =
          error?.response?.data &&
          error?.response?.data?.apierror?.message !== ""
            ? error?.response?.data?.apierror?.message
            : "Something went wrong, please try again";
        toast.error(errorMessage);
      });
  };

  const getOtzOutomes = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/OTZ_OUTCOME`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setOtzOutcomes(response.data);
      });
  };

  const updateOldRecord = (values) => {
    const observation = {
      data: values,
      dateOfObservation:
        values.dateDone != ""
          ? values.dateDone
          : moment(new Date()).format("YYYY-MM-DD"),
      facilityId: null,
      personId: currentRecord?.id,
      type: "Service OTZ",
      visitId: null,
    };
    axios
      .put(`${baseUrl}observation/${currentRecord?.id}`, observation, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setSavings(false);

        toast.success("Service OTZ enrollment update successful.");

        props.setActiveContent({
          ...props?.activeContent,
          route: "otz-service-form",
        });
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

  const handleSubmit = (values, param) => {
    if (currentRecord?.id || props?.activeContent?.patientId || props?.activeContent?.id) {
      updateOldRecord(values, param);
      return;
    } else {
      submitNewRecord(values, param);
    }
  };

  const handleSubmitAdherence = (values, param) => {
    if (currentRecord?.id || props?.activeContent?.patientId || props?.activeContent?.id) {
      updateOldRecord(values, param);
      return;
    } else {
      submitNewRecord(values, param);
    }
  };

  const { formik } = useServiceFormValidationSchema(handleSubmit);
  

  function calculateMonthsFromDate(dateString) {
    // Parse the input date string
    const inputDate = new Date(dateString);

    // Get the current date
    const currentDate = new Date();

    // Calculate the difference in milliseconds
    const timeDifference = currentDate - inputDate;

    // Calculate the number of months (assuming 30 days per month)
    const months = Math.floor(timeDifference / (30 * 24 * 60 * 60 * 1000));

    return months;
  }

  const getOldRecordIfExists = () => {
    
    axios
      .get(`${baseUrl}observation/person/${props?.activeContent?.patientId || props?.activeContent?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const patientDTO = response?.data;
        const otzData =
          patientDTO?.filter?.((item) => item?.type === "Service OTZ")?.[0] ||
          {};
        formik.setValues(otzData?.data);
        setCurrentRecord(otzData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getOldRecordIfExists();
    getOtzOutomes();
    
  }, []);

  const classes = useStyles();

  const [isDropdownsOpen, setIsDropdownsOpen] = useState({
    monthOneAdherenceCounselling: true,
    monthTwoAdherenceCounselling: true,
    monthThreeAdherenceCounselling: true,
    monthOneViralLoad: true,
    monthTwoViralLoad: true,
    monthThreeViralLoad: true,

    monthOneModulesActivities: true,
    monthTwoModulesActivities: true,
    monthThreeModulesActivities: true,

    sixMonthsPEVLM: true,
    twelveMonthsPEVLM: true,
    eighteenMonthsPEVLM: true,
    twentyFourMonthsPEVLM: true,
    thirtyMonthsPEVLM: true,
    thirtySixMonthsPEVLM: true,
  });

  const setCustomDate = (e) => {
    formik.setValues({
      ...formik.values,
      dateEnrolledIntoOtz: e?.target?.value,
      dateDone: "",
      acMonth1EacDate1: "",
      acMonth1EacDate2: "",
      acMonth1EacDate3: "",
      acMonth2EacDate1: "",
      acMonth2EacDate2: "",
      acMonth2EacDate3: "",
      acMonth3EacDate1: "",
      acMonth3EacDate2: "",
      acMonth3EacDate3: "",
      vlMonth1Date: "",
      vlMonth2Date: "",
      vlMonth3Date: "",
      maMonth1PositiveLivingDate: "",
      maMonth1LiteracyTreatmentDate: "",
      maMonth1AdolescentsParticipationDate: "",
      maMonth1leadershipTrainingDate: "",
      maMonth1PeerToPeerDate: "",
      maMonth1RoleOfOtzDate: "",
      maMonth1OtzChampionOrientationDate: "",
      maMonth2PositiveLivingDate: "",
      maMonth2LiteracyTreatmentDate: "",
      maMonth2AdolescentsParticipationDate: "",
      maMonth2leadershipTrainingDate: "",
      maMonth2PeerToPeerDate: "",
      maMonth2RoleOfOtzDate: "",
      maMonth2OtzChampionOrientationDate: "",
      maMonth3PositiveLivingDate: "",
      maMonth3LiteracyTreatmentDate: "",
      maMonth3AdolescentsParticipationDate: "",
      maMonth3leadershipTrainingDate: "",
      maMonth3PeerToPeerDate: "",
      maMonth3RoleOfOtzDate: "",
      maMonth3OtzChampionOrientationDate: "",
      sixMonthsDate: "",
      twelveMonthsDate: "",
      eighteenMonthsDate: "",
      twentyFourMonthsDate: "",
      thirtyMonthsDate: "",
      thirtySixMonthsDate: "",
      transitionDate: "",
      dateOfAssessmentDone: "",
      exitedByDate: "",
    });
  };

  const handleFilterNumber = (e, setFieldValue) => {
    // Apply your regex to filter out numbers
    const newValue = e.target.value.replace(/\d/g, "");
    setFieldValue(e.target.name, newValue);
  };
  
const isViewActionType = props?.activeContent?.actionType === "view"



  return (
    <>
      <ToastContainer autoClose={3000} hideProgressBar />
      <div
        className="row page-titles mx-0"
        style={{ marginTop: "0px", marginBottom: "-10px" }}
      >
        <ol className="breadcrumb">
          <li className="breadcrumb-item active">
            <h2> OTZ Service Form</h2>
          </li>
        </ol>
      </div>

      <Card className={classes.root}>
        <CardContent>
          <div className="col-xl-12 col-lg-12">
            <Form>
            

              {formik?.values?.baselineViralLoadAtEnrollment >= 1000 && (
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
                      Adherence Counselling & Modules Activity/Date Of
                      Completion
                    </h5>

                    <>
                      <span className="float-end" style={{ cursor: "pointer" }}>
                        <FaPlus />
                      </span>
                    </>
                  </div>

                  <div
                    className="card"
                    style={{
                      margin: "20px",
                    }}
                  >
                    <h5
                      style={{
                        color: "black",
                        fontSize: "20px",
                        fontWeight: "600",
                        marginLeft: "10px",
                        marginTop: "10px",
                      }}
                    >
                      Month 1
                    </h5>

                    <div>
                      <div
                        style={{
                          backgroundColor: "#d8f6ff",
                          width: "95%",
                          margin: "auto",
                          marginTop: "5rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <p
                          style={{
                            color: "black",
                            fontSize: "15px",
                            fontWeight: "600",
                            marginLeft: "10px",
                            marginTop: "10px",
                          }}
                        >
                          Adherence Counselling
                        </p>
                        <IconButton
                          onClick={() =>
                            setIsDropdownsOpen((prevState) => {
                              return {
                                ...prevState,
                                monthOneAdherenceCounselling:
                                  !prevState.monthOneAdherenceCounselling,
                              };
                            })
                          }
                          aria-expanded={
                            isDropdownsOpen.monthOneAdherenceCounselling
                          }
                          aria-label="Expand"
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                      </div>
                      <div className="card-body">
                        <Collapse
                          in={isDropdownsOpen.monthOneAdherenceCounselling}
                        >
                          <div
                            className="basic-form"
                            style={{ padding: "0 50px 0 50px" }}
                          >
                            <div className="row">
                              <div className="form-group mb-3 col-md-4">
                                <CustomFormGroup
                                  formik={formik}
                                  name="acMonth1EacDate1"
                                >
                                  <Label for="acMonth1EacDate1">
                                    EAC 1 date
                                    <span style={{ color: "red" }}>
                                      {" "}
                                      *
                                    </span>{" "}
                                  </Label>
                                  <Input
                                  readOnly={isViewActionType}
                                    className="form-control"
                                    type="date"
                                    {...{
                                      min: moment(
                                        new Date(
                                          formik?.values?.dateEnrolledIntoOtz
                                        )
                                      ).format("YYYY-MM-DD"),
                                    }}
                                    {...{
                                      max: moment(new Date()).format(
                                        "YYYY-MM-DD"
                                      ),
                                    }}
                                    disabled={
                                      !formik?.values?.dateEnrolledIntoOtz
                                    }
                                    name="acMonth1EacDate1"
                                    id="acMonth1EacDate1"
                                    value={formik?.values?.acMonth1EacDate1}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{
                                      border: "1px solid #014D88",
                                      borderRadius: "0.2rem",
                                    }}
                                    
                                  />
                                  {formik?.touched?.acMonth1EacDate1 &&
                                  formik.errors.acMonth1EacDate1 !== "" ? (
                                    <span className={classes.error}>
                                      {formik?.errors?.acMonth1EacDate1}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </CustomFormGroup>
                              </div>

                              {formik?.values?.acMonth1EacDate1 && (
                                <div className="form-group mb-3 col-md-4">
                                  <CustomFormGroup
                                    formik={formik}
                                    name="acMonth1EacDate2"
                                  >
                                    <Label for="acMonth1EacDate2">
                                      EAC 2 date
                                      <span style={{ color: "red" }}>
                                        {" "}
                                        *
                                      </span>{" "}
                                    </Label>
                                    <Input
                                    readOnly={isViewActionType}
                                      className="form-control"
                                      type="date"
                                      {...{
                                        min: moment(
                                          new Date(
                                            formik?.values?.dateEnrolledIntoOtz
                                          )
                                        ).format("YYYY-MM-DD"),
                                      }}
                                      {...{
                                        max: moment(new Date()).format(
                                          "YYYY-MM-DD"
                                        ),
                                      }}
                                      disabled={
                                        !formik?.values?.dateEnrolledIntoOtz
                                      }
                                      name="acMonth1EacDate2"
                                      id="acMonth1EacDate2"
                                      value={formik.values.acMonth1EacDate2}
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      style={{
                                        border: "1px solid #014D88",
                                        borderRadius: "0.2rem",
                                      }}
                                    />
                                    {formik?.touched?.acMonth1EacDate2 &&
                                    formik.errors.acMonth1EacDate2 !== "" ? (
                                      <span className={classes.error}>
                                        {formik?.errors?.acMonth1EacDate2}
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </CustomFormGroup>
                                </div>
                              )}

                              {formik?.values?.acMonth1EacDate2 && (
                                <div className="form-group mb-3 col-md-4">
                                  <CustomFormGroup
                                    formik={formik}
                                    name="acMonth1EacDate3"
                                  >
                                    <Label for="acMonth1EacDate3">
                                      EAC 3 date
                                    </Label>
                                    <Input
                                    readOnly={isViewActionType}
                                      type="date"
                                      {...{
                                        min: moment(
                                          new Date(
                                            formik?.values?.dateEnrolledIntoOtz
                                          )
                                        ).format("YYYY-MM-DD"),
                                      }}
                                      {...{
                                        max: moment(new Date()).format(
                                          "YYYY-MM-DD"
                                        ),
                                      }}
                                      disabled={
                                        !formik?.values?.dateEnrolledIntoOtz
                                      }
                                      className="form-control"
                                      name="acMonth1EacDate3"
                                      id="acMonth1EacDate3"
                                      value={formik.values.acMonth1EacDate3}
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      style={{
                                        border: "1px solid #014D88",
                                        borderRadius: "0.2rem",
                                      }}
                                    ></Input>
                                    {formik?.touched?.acMonth1EacDate3 &&
                                    formik.errors.acMonth1EacDate3 !== "" ? (
                                      <span className={classes.error}>
                                        {formik?.errors?.acMonth1EacDate3}
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </CustomFormGroup>
                                </div>
                              )}
                            </div>

                            <div className="row">
                              {formik?.values?.acMonth1EacDate3 && (
                                <>
                                  <div className="form-group mb-3 col-md-4">
                                    <CustomFormGroup
                                      formik={formik}
                                      name="dateViralLoadAssesmentMonth1"
                                    >
                                      <Label for="dateViralLoadAssesmentMonth1">
                                        Date of viral load assessment
                                        <span style={{ color: "red" }}>
                                          {" "}
                                          *
                                        </span>{" "}
                                      </Label>
                                      <Input
                                      readOnly={isViewActionType}
                                        className="form-control"
                                        type="date"
                                        {...{
                                          min: moment(
                                            new Date(
                                              formik?.values?.dateEnrolledIntoOtz
                                            )
                                          ).format("YYYY-MM-DD"),
                                        }}
                                        {...{
                                          max: moment(new Date()).format(
                                            "YYYY-MM-DD"
                                          ),
                                        }}
                                        disabled={
                                          !formik?.values?.dateEnrolledIntoOtz
                                        }
                                        name="dateViralLoadAssesmentMonth1"
                                        id="dateViralLoadAssesmentMonth1"
                                        value={
                                          formik?.values
                                            ?.dateViralLoadAssesmentMonth1
                                        }
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        style={{
                                          border: "1px solid #014D88",
                                          borderRadius: "0.2rem",
                                        }}
                                      />
                                      {formik?.touched
                                        ?.dateViralLoadAssesmentMonth1 &&
                                      formik.errors
                                        .dateViralLoadAssesmentMonth1 !== "" ? (
                                        <span className={classes.error}>
                                          {
                                            formik?.errors
                                              ?.dateViralLoadAssesmentMonth1
                                          }
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </CustomFormGroup>
                                  </div>

                                  <div className="form-group mb-3 col-md-4">
                                    <CustomFormGroup
                                      formik={formik}
                                      name="viralLoadMonth1"
                                    >
                                      <Label for="viralLoadMonth1">
                                        Viral load
                                        <span style={{ color: "red" }}>
                                          {" "}
                                          *
                                        </span>{" "}
                                      </Label>
                                      <Input
                                      readOnly={isViewActionType}
                                        className="form-control"
                                        type="number"
                                        
                                        name="viralLoadMonth1"
                                        id="viralLoadMonth1"
                                        value={formik?.values?.viralLoadMonth1}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        style={{
                                          border: "1px solid #014D88",
                                          borderRadius: "0.2rem",
                                        }}
                                      />
                                      {formik?.touched?.viralLoadMonth1 &&
                                      formik.errors.viralLoadMonth1 !== "" ? (
                                        <span className={classes.error}>
                                          {formik.errors.viralLoadMonth1}
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </CustomFormGroup>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </Collapse>
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          backgroundColor: "#d8f6ff",
                          width: "95%",
                          margin: "auto",
                          marginTop: "5rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <p
                          style={{
                            color: "black",
                            fontSize: "15px",
                            fontWeight: "600",
                            marginLeft: "10px",
                            marginTop: "10px",
                          }}
                        >
                          Modules activity/date of completion
                        </p>
                        <IconButton
                          onClick={() =>
                            setIsDropdownsOpen((prevState) => {
                              return {
                                ...prevState,
                                monthOneModulesActivities:
                                  !prevState.monthOneModulesActivities,
                              };
                            })
                          }
                          aria-expanded={
                            isDropdownsOpen.monthOneModulesActivities
                          }
                          aria-label="Expand"
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                      </div>

                      <div className="card-body">
                        <Collapse
                          in={isDropdownsOpen.monthOneModulesActivities}
                        >
                          <div
                            className="basic-form"
                            style={{ padding: "0 50px 0 50px" }}
                          >
                            <div className="row">
                              <div className="form-group mb-3 col-md-6">
                                <CustomFormGroup
                                  formik={formik}
                                  name="maMonth1PositiveLivingChoice"
                                >
                                  <Label for="maMonth1PositiveLivingChoice">
                                    Positive Living
                                    <span style={{ color: "red" }}>
                                      {" "}
                                      *
                                    </span>{" "}
                                  </Label>
                                  <Input
                                  readOnly={isViewActionType}
                                    className="form-control"
                                    type="select"
                                    name="maMonth1PositiveLivingChoice"
                                    id="maMonth1PositiveLivingChoice"
                                    value={
                                      formik.values.maMonth1PositiveLivingChoice
                                    }
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{
                                      border: "1px solid #014D88",
                                      borderRadius: "0.2rem",
                                    }}
                                  >
                                    <option value="">Select</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                  </Input>
                                  {formik?.touched
                                    ?.maMonth1PositiveLivingChoice &&
                                  formik.errors.maMonth1PositiveLivingChoice !==
                                    "" ? (
                                    <span className={classes.error}>
                                      {
                                        formik?.errors
                                          ?.maMonth1PositiveLivingChoice
                                      }
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </CustomFormGroup>
                              </div>
                              {formik.values.maMonth1PositiveLivingChoice ===
                                "yes" && (
                                <div className="form-group mb-3 col-md-6">
                                  <CustomFormGroup
                                    formik={formik}
                                    name="maMonth1PositiveLivingDate"
                                  >
                                    <Label for="maMonth1PositiveLivingDate">
                                      Date for positive living
                                      <span style={{ color: "red" }}>
                                        {" "}
                                        *
                                      </span>{" "}
                                    </Label>
                                    <Input
                                    readOnly={isViewActionType}
                                      className="form-control"
                                      type="date"
                                      {...{
                                        min: moment(
                                          new Date(
                                            props?.activeContent?.artCommence?.visitDate
                                          )
                                        ).format("YYYY-MM-DD"),
                                      }}
                                      {...{
                                        max: moment(new Date()).format(
                                          "YYYY-MM-DD"
                                        ),
                                      }}
                                      disabled={
                                        !props?.activeContent?.enrollment
                                          ?.dateOfRegistration
                                      }
                                      name="maMonth1PositiveLivingDate"
                                      id="maMonth1PositiveLivingDate"
                                      value={
                                        formik.values.maMonth1PositiveLivingDate
                                      }
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      style={{
                                        border: "1px solid #014D88",
                                        borderRadius: "0.2rem",
                                      }}
                                    />
                                    {formik?.touched
                                      ?.maMonth1PositiveLivingDate &&
                                    formik.errors.maMonth1PositiveLivingDate !==
                                      "" ? (
                                      <span className={classes.error}>
                                        {
                                          formik?.errors
                                            ?.maMonth1PositiveLivingDate
                                        }
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </CustomFormGroup>
                                </div>
                              )}

                              <div className="form-group mb-3 col-md-6">
                                <CustomFormGroup
                                  formik={formik}
                                  name="maMonth1LiteracyTreatmentChoice"
                                >
                                  <Label for="maMonth1LiteracyTreatmentChoice">
                                    Literacy Treatment
                                    <span style={{ color: "red" }}>
                                      {" "}
                                      *
                                    </span>{" "}
                                  </Label>
                                  <Input
                                  readOnly={isViewActionType}
                                    className="form-control"
                                    type="select"
                                    name="maMonth1LiteracyTreatmentChoice"
                                    id="maMonth1LiteracyTreatmentChoice"
                                    value={
                                      formik.values
                                        .maMonth1LiteracyTreatmentChoice
                                    }
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{
                                      border: "1px solid #014D88",
                                      borderRadius: "0.2rem",
                                    }}
                                  >
                                    <option value="">Select</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                  </Input>
                                  {formik?.touched
                                    ?.maMonth1LiteracyTreatmentChoice &&
                                  formik.errors
                                    .maMonth1LiteracyTreatmentChoice !== "" ? (
                                    <span className={classes.error}>
                                      {
                                        formik?.errors
                                          ?.maMonth1LiteracyTreatmentChoice
                                      }
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </CustomFormGroup>
                              </div>

                              {formik.values.maMonth1LiteracyTreatmentChoice ===
                                "yes" && (
                                <div className="form-group mb-3 col-md-6">
                                  <CustomFormGroup
                                    formik={formik}
                                    name="maMonth1LiteracyTreatmentDate"
                                  >
                                    <Label for="maMonth1LiteracyTreatmentDate">
                                      Date for literacy training
                                      <span style={{ color: "red" }}>
                                        {" "}
                                        *
                                      </span>{" "}
                                    </Label>
                                    <Input
                                    readOnly={isViewActionType}
                                      className="form-control"
                                      type="date"
                                      {...{
                                        min: moment(
                                          new Date(
                                            props?.activeContent?.artCommence?.visitDate
                                          )
                                        ).format("YYYY-MM-DD"),
                                      }}
                                      {...{
                                        max: moment(new Date()).format(
                                          "YYYY-MM-DD"
                                        ),
                                      }}
                                      disabled={
                                        !props?.activeContent?.enrollment
                                          ?.dateOfRegistration
                                      }
                                      name="maMonth1LiteracyTreatmentDate"
                                      id="maMonth1LiteracyTreatmentDate"
                                      value={
                                        formik.values
                                          .maMonth1LiteracyTreatmentDate
                                      }
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      style={{
                                        border: "1px solid #014D88",
                                        borderRadius: "0.2rem",
                                      }}
                                    />
                                    {formik?.touched
                                      ?.maMonth1LiteracyTreatmentDate &&
                                    formik.errors
                                      .maMonth1LiteracyTreatmentDate !== "" ? (
                                      <span className={classes.error}>
                                        {
                                          formik?.errors
                                            ?.maMonth1LiteracyTreatmentDate
                                        }
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </CustomFormGroup>
                                </div>
                              )}

                              <div className="form-group mb-3 col-md-6">
                                <CustomFormGroup
                                  formik={formik}
                                  name="maMonth1AdolescentsParticipationChoice"
                                >
                                  <Label for="maMonth1AdolescentsParticipationChoice">
                                    Adolescents Participation
                                    <span style={{ color: "red" }}>
                                      {" "}
                                      *
                                    </span>{" "}
                                  </Label>
                                  <Input
                                  readOnly={isViewActionType}
                                    className="form-control"
                                    type="select"
                                    name="maMonth1AdolescentsParticipationChoice"
                                    id="maMonth1AdolescentsParticipationChoice"
                                    value={
                                      formik.values
                                        .maMonth1AdolescentsParticipationChoice
                                    }
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{
                                      border: "1px solid #014D88",
                                      borderRadius: "0.2rem",
                                    }}
                                  >
                                    <option value="">Select</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                  </Input>
                                  {formik?.touched
                                    ?.maMonth1AdolescentsParticipationChoice &&
                                  formik?.errors
                                    ?.maMonth1AdolescentsParticipationChoice !==
                                    "" ? (
                                    <span className={classes.error}>
                                      {
                                        formik?.errors
                                          ?.maMonth1AdolescentsParticipationChoice
                                      }
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </CustomFormGroup>
                              </div>

                              {formik.values
                                .maMonth1AdolescentsParticipationChoice ===
                                "yes" && (
                                <div className="form-group mb-3 col-md-6">
                                  <CustomFormGroup
                                    formik={formik}
                                    name="maMonth1AdolescentsParticipationDate"
                                  >
                                    <Label for="maMonth1AdolescentsParticipationDate">
                                      Date for adolescent participation
                                      <span style={{ color: "red" }}>
                                        {" "}
                                        *
                                      </span>{" "}
                                    </Label>
                                    <Input
                                    readOnly={isViewActionType}
                                      className="form-control"
                                      type="date"
                                      {...{
                                        min: moment(
                                          new Date(
                                            props?.activeContent?.artCommence?.visitDate
                                          )
                                        ).format("YYYY-MM-DD"),
                                      }}
                                      {...{
                                        max: moment(new Date()).format(
                                          "YYYY-MM-DD"
                                        ),
                                      }}
                                      disabled={
                                        !props?.activeContent?.enrollment
                                          ?.dateOfRegistration
                                      }
                                      name="maMonth1AdolescentsParticipationDate"
                                      id="maMonth1AdolescentsParticipationDate"
                                      value={
                                        formik.values
                                          .maMonth1AdolescentsParticipationDate
                                      }
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      style={{
                                        border: "1px solid #014D88",
                                        borderRadius: "0.2rem",
                                      }}
                                    />
                                    {formik?.touched
                                      ?.maMonth1AdolescentsParticipationDate &&
                                    formik.errors
                                      .maMonth1AdolescentsParticipationDate !==
                                      "" ? (
                                      <span className={classes.error}>
                                        {
                                          formik?.errors
                                            ?.maMonth1AdolescentsParticipationDate
                                        }
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </CustomFormGroup>
                                </div>
                              )}

                              <div className="form-group mb-3 col-md-6">
                                <CustomFormGroup
                                  formik={formik}
                                  name="maMonth1leadershipTrainingChoice"
                                >
                                  <Label for="maMonth1leadershipTrainingChoice">
                                    Leadership participation
                                    <span style={{ color: "red" }}>
                                      {" "}
                                      *
                                    </span>{" "}
                                  </Label>
                                  <Input
                                  readOnly={isViewActionType}
                                    className="form-control"
                                    type="select"
                                    name="maMonth1leadershipTrainingChoice"
                                    id="maMonth1leadershipTrainingChoice"
                                    value={
                                      formik.values
                                        .maMonth1leadershipTrainingChoice
                                    }
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{
                                      border: "1px solid #014D88",
                                      borderRadius: "0.2rem",
                                    }}
                                  >
                                    <option value="">Select</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                  </Input>
                                  {formik?.touched
                                    ?.maMonth1leadershipTrainingChoice &&
                                  formik?.errors
                                    ?.maMonth1leadershipTrainingChoice !==
                                    "" ? (
                                    <span className={classes.error}>
                                      {
                                        formik?.errors
                                          ?.maMonth1leadershipTrainingChoice
                                      }
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </CustomFormGroup>
                              </div>

                              {formik.values
                                .maMonth1leadershipTrainingChoice === "yes" && (
                                <div className="form-group mb-3 col-md-6">
                                  <CustomFormGroup
                                    formik={formik}
                                    name="maMonth1leadershipTrainingDate"
                                  >
                                    <Label for="maMonth1leadershipTrainingDate">
                                      Date for Leadership participation
                                      <span style={{ color: "red" }}>
                                        {" "}
                                        *
                                      </span>{" "}
                                    </Label>
                                    <Input
                                    readOnly={isViewActionType}
                                      className="form-control"
                                      type="date"
                                      {...{
                                        min: moment(
                                          new Date(
                                            props?.activeContent?.artCommence?.visitDate
                                          )
                                        ).format("YYYY-MM-DD"),
                                      }}
                                      {...{
                                        max: moment(new Date()).format(
                                          "YYYY-MM-DD"
                                        ),
                                      }}
                                      disabled={
                                        !props?.activeContent?.enrollment
                                          ?.dateOfRegistration
                                      }
                                      name="maMonth1leadershipTrainingDate"
                                      id="maMonth1leadershipTrainingDate"
                                      value={
                                        formik.values
                                          .maMonth1leadershipTrainingDate
                                      }
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      style={{
                                        border: "1px solid #014D88",
                                        borderRadius: "0.2rem",
                                      }}
                                    />
                                    {formik?.touched
                                      ?.maMonth1leadershipTrainingDate &&
                                    formik?.errors
                                      ?.maMonth1leadershipTrainingDate !==
                                      "" ? (
                                      <span className={classes.error}>
                                        {
                                          formik?.errors
                                            ?.maMonth1leadershipTrainingDate
                                        }
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </CustomFormGroup>
                                </div>
                              )}

                              <div className="form-group mb-3 col-md-6">
                                <CustomFormGroup
                                  formik={formik}
                                  name="maMonth1PeerToPeerChoice"
                                >
                                  <Label for="maMonth1PeerToPeerChoice">
                                    Peer to Peer Mentorship
                                    <span style={{ color: "red" }}>
                                      {" "}
                                      *
                                    </span>{" "}
                                  </Label>
                                  <Input
                                  readOnly={isViewActionType}
                                    className="form-control"
                                    type="select"
                                    name="maMonth1PeerToPeerChoice"
                                    id="maMonth1PeerToPeerChoice"
                                    value={
                                      formik.values.maMonth1PeerToPeerChoice
                                    }
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{
                                      border: "1px solid #014D88",
                                      borderRadius: "0.2rem",
                                    }}
                                  >
                                    <option value="">Select</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                  </Input>
                                  {formik?.touched?.maMonth1PeerToPeerChoice &&
                                  formik?.errors?.maMonth1PeerToPeerChoice !==
                                    "" ? (
                                    <span className={classes.error}>
                                      {formik?.errors?.maMonth1PeerToPeerChoice}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </CustomFormGroup>
                              </div>

                              {formik.values.maMonth1PeerToPeerChoice ===
                                "yes" && (
                                <div className="form-group mb-3 col-md-6">
                                  <CustomFormGroup
                                    formik={formik}
                                    name="maMonth1PeerToPeerDate"
                                  >
                                    <Label for="maMonth1PeerToPeerDate">
                                      Date for peer to peer mentorship
                                      <span style={{ color: "red" }}>
                                        {" "}
                                        *
                                      </span>{" "}
                                    </Label>
                                    <Input
                                    readOnly={isViewActionType}
                                      className="form-control"
                                      type="date"
                                      {...{
                                        min: moment(
                                          new Date(
                                            props?.activeContent?.artCommence?.visitDate
                                          )
                                        ).format("YYYY-MM-DD"),
                                      }}
                                      {...{
                                        max: moment(new Date()).format(
                                          "YYYY-MM-DD"
                                        ),
                                      }}
                                      disabled={
                                        !props?.activeContent?.enrollment
                                          ?.dateOfRegistration
                                      }
                                      name="maMonth1PeerToPeerDate"
                                      id="maMonth1PeerToPeerDate"
                                      value={
                                        formik.values.maMonth1PeerToPeerDate
                                      }
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      style={{
                                        border: "1px solid #014D88",
                                        borderRadius: "0.2rem",
                                      }}
                                    />
                                    {formik?.touched?.maMonth1PeerToPeerDate &&
                                    formik.errors.maMonth1PeerToPeerDate !==
                                      "" ? (
                                      <span className={classes.error}>
                                        {formik?.errors?.maMonth1PeerToPeerDate}
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </CustomFormGroup>
                                </div>
                              )}

                              <div className="form-group mb-3 col-md-6">
                                <CustomFormGroup
                                  formik={formik}
                                  name="maMonth1RoleOfOtzChoice"
                                >
                                  <Label for="maMonth1RoleOfOtzChoice">
                                    Role of OTZ in 95-95-95
                                    <span style={{ color: "red" }}>
                                      {" "}
                                      *
                                    </span>{" "}
                                  </Label>
                                  <Input
                                  readOnly={isViewActionType}
                                    className="form-control"
                                    type="select"
                                    name="maMonth1RoleOfOtzChoice"
                                    id="maMonth1RoleOfOtzChoice"
                                    value={
                                      formik.values.maMonth1RoleOfOtzChoice
                                    }
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{
                                      border: "1px solid #014D88",
                                      borderRadius: "0.2rem",
                                    }}
                                  >
                                    <option value="">Select</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                  </Input>
                                  {formik?.touched?.maMonth1RoleOfOtzChoice &&
                                  formik?.errors?.maMonth1RoleOfOtzChoice !==
                                    "" ? (
                                    <span className={classes.error}>
                                      {formik?.errors?.maMonth1RoleOfOtzChoice}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </CustomFormGroup>
                              </div>

                              {formik.values.maMonth1RoleOfOtzChoice ===
                                "yes" && (
                                <div className="form-group mb-3 col-md-6">
                                  <CustomFormGroup
                                    formik={formik}
                                    name="maMonth1RoleOfOtzDate"
                                  >
                                    <Label for="maMonth1RoleOfOtzDate">
                                      Date for role of OTZ in 95-95-95
                                      <span style={{ color: "red" }}>
                                        {" "}
                                        *
                                      </span>{" "}
                                    </Label>
                                    <Input
                                    readOnly={isViewActionType}
                                      className="form-control"
                                      type="date"
                                      {...{
                                        min: moment(
                                          new Date(
                                            props?.activeContent?.artCommence?.visitDate
                                          )
                                        ).format("YYYY-MM-DD"),
                                      }}
                                      {...{
                                        max: moment(new Date()).format(
                                          "YYYY-MM-DD"
                                        ),
                                      }}
                                      disabled={
                                        !props?.activeContent?.enrollment
                                          ?.dateOfRegistration
                                      }
                                      name="maMonth1RoleOfOtzDate"
                                      id="maMonth1RoleOfOtzDate"
                                      value={
                                        formik.values.maMonth1RoleOfOtzDate
                                      }
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      style={{
                                        border: "1px solid #014D88",
                                        borderRadius: "0.2rem",
                                      }}
                                    />
                                    {formik?.touched?.maMonth1RoleOfOtzDate &&
                                    formik?.errors?.maMonth1RoleOfOtzDate !==
                                      "" ? (
                                      <span className={classes.error}>
                                        {formik?.errors?.maMonth1RoleOfOtzDate}
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </CustomFormGroup>
                                </div>
                              )}

                              <div className="form-group mb-3 col-md-6">
                                <CustomFormGroup
                                  formik={formik}
                                  name="maMonth1OtzChampionOrientationChoice"
                                >
                                  <Label for="maMonth1OtzChampionOrientationChoice">
                                    OTZ champion orientation
                                    <span style={{ color: "red" }}>
                                      {" "}
                                      *
                                    </span>{" "}
                                  </Label>
                                  <Input
                                  readOnly={isViewActionType}
                                    className="form-control"
                                    type="select"
                                    name="maMonth1OtzChampionOrientationChoice"
                                    id="maMonth1OtzChampionOrientationChoice"
                                    value={
                                      formik.values
                                        .maMonth1OtzChampionOrientationChoice
                                    }
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{
                                      border: "1px solid #014D88",
                                      borderRadius: "0.2rem",
                                    }}
                                  >
                                    <option value="">Select</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                  </Input>
                                  {formik?.touched
                                    ?.maMonth1OtzChampionOrientationChoice &&
                                  formik?.errors
                                    ?.maMonth1OtzChampionOrientationChoice !==
                                    "" ? (
                                    <span className={classes.error}>
                                      {
                                        formik?.errors
                                          ?.maMonth1OtzChampionOrientationChoice
                                      }
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </CustomFormGroup>
                              </div>

                              {formik.values
                                .maMonth1OtzChampionOrientationChoice ===
                                "yes" && (
                                <div className="form-group mb-3 col-md-6">
                                  <CustomFormGroup
                                    formik={formik}
                                    name="maMonth1OtzChampionOrientationDate"
                                  >
                                    <Label for="maMonth1OtzChampionOrientationDate">
                                      Date for OTZ Champion Orientation
                                      <span style={{ color: "red" }}>
                                        {" "}
                                        *
                                      </span>{" "}
                                    </Label>
                                    <Input
                                    readOnly={isViewActionType}
                                      className="form-control"
                                      type="date"
                                      {...{
                                        min: moment(
                                          new Date(
                                            props?.activeContent?.artCommence?.visitDate
                                          )
                                        ).format("YYYY-MM-DD"),
                                      }}
                                      {...{
                                        max: moment(new Date()).format(
                                          "YYYY-MM-DD"
                                        ),
                                      }}
                                      disabled={
                                        !props?.activeContent?.enrollment
                                          ?.dateOfRegistration
                                      }
                                      name="maMonth1OtzChampionOrientationDate"
                                      id="maMonth1OtzChampionOrientationDate"
                                      value={
                                        formik.values
                                          .maMonth1OtzChampionOrientationDate
                                      }
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      style={{
                                        border: "1px solid #014D88",
                                        borderRadius: "0.2rem",
                                      }}
                                    />
                                    {formik?.touched
                                      ?.maMonth1OtzChampionOrientationDate &&
                                    formik?.errors
                                      ?.maMonth1OtzChampionOrientationDate !==
                                      "" ? (
                                      <span className={classes.error}>
                                        {
                                          formik?.errors
                                            ?.maMonth1OtzChampionOrientationDate
                                        }
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </CustomFormGroup>
                                </div>
                              )}
                            </div>
                          </div>
                        </Collapse>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end">
                      <MatButton
                        type="button"
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        style={{ backgroundColor: "#014d88" }}
                        startIcon={<SaveIcon />}
                        disabled={saving}
                        onClick={() =>
                          handleSubmitAdherence(formik.values, {
                            reroute: false,
                            monthOfData: 1,
                          })
                        }
                      >
                        {!saving ? (
                          <span style={{ textTransform: "capitalize" }}>
                            Submit month 1
                          </span>
                        ) : (
                          <span style={{ textTransform: "capitalize" }}>
                            Submitting...
                          </span>
                        )}
                      </MatButton>
                    </div>
                  </div>

                  {formik?.values?.acMonth1EacDate1 &&
                    formik?.values?.acMonth1EacDate2 &&
                    formik?.values?.acMonth1EacDate3 &&
                    formik?.values?.maMonth1PositiveLivingChoice &&
                    formik?.values?.maMonth1PositiveLivingDate &&
                    formik?.values?.maMonth1LiteracyTreatmentChoice &&
                    formik?.values?.maMonth1LiteracyTreatmentDate &&
                    formik?.values?.maMonth1AdolescentsParticipationChoice &&
                    formik?.values?.maMonth1AdolescentsParticipationDate &&
                    formik?.values?.maMonth1leadershipTrainingChoice &&
                    formik?.values?.maMonth1leadershipTrainingDate &&
                    formik?.values?.maMonth1PeerToPeerChoice &&
                    formik?.values?.maMonth1PeerToPeerDate &&
                    formik?.values?.maMonth1RoleOfOtzChoice &&
                    formik?.values?.maMonth1RoleOfOtzDate &&
                    formik?.values?.maMonth1OtzChampionOrientationChoice &&
                    formik?.values?.maMonth1OtzChampionOrientationDate && (
                      <div
                        className="card"
                        style={{
                          margin: "20px",
                        }}
                      >
                        <h5
                          style={{
                            color: "black",
                            fontSize: "20px",
                            fontWeight: "600",
                            marginLeft: "10px",
                            marginTop: "10px",
                          }}
                        >
                          Month 2
                        </h5>
                        {formik?.values?.acMonth1EacDate1 &&
                          formik?.values?.acMonth1EacDate2 &&
                          formik?.values?.acMonth1EacDate3 && (
                            <div>
                              <div
                                style={{
                                  backgroundColor: "#d8f6ff",
                                  width: "95%",
                                  margin: "auto",
                                  marginTop: "5rem",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <p
                                  style={{
                                    color: "black",
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    marginLeft: "10px",
                                    marginTop: "10px",
                                  }}
                                >
                                  Adherence Counselling
                                </p>
                                <IconButton
                                  onClick={() =>
                                    setIsDropdownsOpen((prevState) => {
                                      return {
                                        ...prevState,
                                        monthTwoAdherenceCounselling:
                                          !prevState.monthTwoAdherenceCounselling,
                                      };
                                    })
                                  }
                                  aria-expanded={
                                    isDropdownsOpen.monthTwoAdherenceCounselling
                                  }
                                  aria-label="Expand"
                                >
                                  <ExpandMoreIcon />
                                </IconButton>
                              </div>
                              <div className="card-body">
                                <Collapse
                                  in={
                                    isDropdownsOpen.monthTwoAdherenceCounselling
                                  }
                                >
                                  <div
                                    className="basic-form"
                                    style={{ padding: "0 50px 0 50px" }}
                                  >
                                    <div className="row">
                                      <div className="form-group mb-3 col-md-4">
                                        <CustomFormGroup
                                          formik={formik}
                                          name="acMonth2EacDate1"
                                        >
                                          <Label for="acMonth2EacDate1">
                                            EAC 1 dateccc
                                            <span style={{ color: "red" }}>
                                              {" "}
                                              *
                                            </span>{" "}
                                          </Label>
                                          <Input
                                          readOnly={isViewActionType}
                                            className="form-control"
                                            type="date"
                                            {...{
                                              min: moment(
                                                new Date(
                                                  formik?.values?.dateEnrolledIntoOtz
                                                )
                                              ).format("YYYY-MM-DD"),
                                            }}
                                            {...{
                                              max: moment(new Date()).format(
                                                "YYYY-MM-DD"
                                              ),
                                            }}
                                            disabled={
                                              !formik?.values?.dateEnrolledIntoOtz
                                            }
                                            name="acMonth2EacDate1"
                                            id="acMonth2EacDate1"
                                            value={
                                              formik.values.acMonth2EacDate1
                                            }
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            style={{
                                              border: "1px solid #014D88",
                                              borderRadius: "0.2rem",
                                            }}
                                          />
                                          {formik?.touched?.acMonth2EacDate1 &&
                                          formik.errors.acMonth2EacDate1 !==
                                            "" ? (
                                            <span className={classes.error}>
                                              {formik?.errors?.acMonth2EacDate1}
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </CustomFormGroup>
                                      </div>
                                      {formik?.values?.acMonth2EacDate1 && (
                                        <div className="form-group mb-3 col-md-4">
                                          <CustomFormGroup
                                            formik={formik}
                                            name="acMonth2EacDate2"
                                          >
                                            <Label for="acMonth2EacDate2">
                                              EAC 2 date
                                              <span style={{ color: "red" }}>
                                                {" "}
                                                *
                                              </span>{" "}
                                            </Label>
                                            <Input
                                            readOnly={isViewActionType}
                                              className="form-control"
                                              type="date"
                                              {...{
                                                min: moment(
                                                  new Date(
                                                    formik?.values?.dateEnrolledIntoOtz
                                                  )
                                                ).format("YYYY-MM-DD"),
                                              }}
                                              {...{
                                                max: moment(new Date()).format(
                                                  "YYYY-MM-DD"
                                                ),
                                              }}
                                              disabled={
                                                !formik?.values
                                                  ?.dateEnrolledIntoOtz
                                              }
                                              name="acMonth2EacDate2"
                                              id="acMonth2EacDate2"
                                              value={
                                                formik.values.acMonth2EacDate2
                                              }
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                              }}
                                            />
                                            {formik?.touched
                                              ?.acMonth2EacDate2 &&
                                            formik?.errors?.acMonth2EacDate2 !==
                                              "" ? (
                                              <span className={classes.error}>
                                                {
                                                  formik?.errors
                                                    ?.acMonth2EacDate2
                                                }
                                              </span>
                                            ) : (
                                              ""
                                            )}
                                          </CustomFormGroup>
                                        </div>
                                      )}

                                      {formik?.values?.acMonth2EacDate2 && (
                                        <div className="form-group mb-3 col-md-4">
                                          <CustomFormGroup
                                            formik={formik}
                                            name="acMonth2EacDate3"
                                          >
                                            <Label for="acMonth2EacDate3">
                                              EAC 3 date
                                            </Label>
                                            <Input
                                            readOnly={isViewActionType}
                                              type="date"
                                              {...{
                                                min: moment(
                                                  new Date(
                                                    formik?.values?.dateEnrolledIntoOtz
                                                  )
                                                ).format("YYYY-MM-DD"),
                                              }}
                                              {...{
                                                max: moment(new Date()).format(
                                                  "YYYY-MM-DD"
                                                ),
                                              }}
                                              disabled={
                                                !formik?.values
                                                  ?.dateEnrolledIntoOtz
                                              }
                                              className="form-control"
                                              name="acMonth2EacDate3"
                                              id="acMonth2EacDate3"
                                              value={
                                                formik.values.acMonth2EacDate3
                                              }
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                              }}
                                            ></Input>
                                            {formik?.touched
                                              ?.acMonth2EacDate3 &&
                                            formik?.errors?.acMonth2EacDate3 !==
                                              "" ? (
                                              <span className={classes.error}>
                                                {formik.errors.acMonth2EacDate3}
                                              </span>
                                            ) : (
                                              ""
                                            )}
                                          </CustomFormGroup>
                                        </div>
                                      )}

                                      {formik?.values?.acMonth2EacDate3 && (
                                        <>
                                          <div className="form-group mb-3 col-md-4">
                                            <CustomFormGroup
                                              formik={formik}
                                              name="dateViralLoadAssesmentMonth2"
                                            >
                                              <Label for="dateViralLoadAssesmentMonth2">
                                                Date of viral load assessment
                                                <span style={{ color: "red" }}>
                                                  {" "}
                                                  *
                                                </span>{" "}
                                              </Label>
                                              <Input
                                              readOnly={isViewActionType}
                                                className="form-control"
                                                type="date"
                                                {...{
                                                  min: moment(
                                                    new Date(
                                                      formik?.values?.dateEnrolledIntoOtz
                                                    )
                                                  ).format("YYYY-MM-DD"),
                                                }}
                                                {...{
                                                  max: moment(
                                                    new Date()
                                                  ).format("YYYY-MM-DD"),
                                                }}
                                                disabled={
                                                  !formik?.values
                                                    ?.dateEnrolledIntoOtz
                                                }
                                                name="dateViralLoadAssesmentMonth2"
                                                id="dateViralLoadAssesmentMonth2"
                                                value={
                                                  formik?.values
                                                    ?.dateViralLoadAssesmentMonth2
                                                }
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                style={{
                                                  border: "1px solid #014D88",
                                                  borderRadius: "0.2rem",
                                                }}
                                                Date
                                                enrolled
                                                into
                                                OTZ
                                              />
                                              {formik?.touched
                                                ?.dateViralLoadAssesmentMonth2 &&
                                              formik.errors
                                                .dateViralLoadAssesmentMonth2 !==
                                                "" ? (
                                                <span className={classes.error}>
                                                  {
                                                    formik?.errors
                                                      ?.dateViralLoadAssesmentMonth2
                                                  }
                                                </span>
                                              ) : (
                                                ""
                                              )}
                                            </CustomFormGroup>
                                          </div>

                                          <div className="form-group mb-3 col-md-4">
                                            <CustomFormGroup
                                              formik={formik}
                                              name="viralLoadMonth2"
                                            >
                                              <Label for="viralLoadMonth2">
                                                Viral load
                                                <span style={{ color: "red" }}>
                                                  {" "}
                                                  *
                                                </span>{" "}
                                              </Label>
                                              <Input
                                              readOnly={isViewActionType}
                                                className="form-control"
                                                type="number"
                                                name="viralLoadMonth2"
                                                id="viralLoadMonth2"
                                                value={
                                                  formik?.values
                                                    ?.viralLoadMonth2
                                                }
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                style={{
                                                  border: "1px solid #014D88",
                                                  borderRadius: "0.2rem",
                                                }}
                                              />
                                              {formik?.touched
                                                ?.viralLoadMonth2 &&
                                              formik.errors.viralLoadMonth2 !==
                                                "" ? (
                                                <span className={classes.error}>
                                                  {
                                                    formik?.errors
                                                      ?.viralLoadMonth2
                                                  }
                                                </span>
                                              ) : (
                                                ""
                                              )}
                                            </CustomFormGroup>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </Collapse>
                              </div>
                            </div>
                          )}

                        {formik?.values?.maMonth1PositiveLivingChoice &&
                          formik?.values?.maMonth1PositiveLivingDate &&
                          formik?.values?.maMonth1LiteracyTreatmentChoice &&
                          formik?.values?.maMonth1LiteracyTreatmentDate &&
                          formik?.values
                            ?.maMonth1AdolescentsParticipationChoice &&
                          formik?.values
                            ?.maMonth1AdolescentsParticipationDate &&
                          formik?.values?.maMonth1leadershipTrainingChoice &&
                          formik?.values?.maMonth1leadershipTrainingDate &&
                          formik?.values?.maMonth1PeerToPeerChoice &&
                          formik?.values?.maMonth1PeerToPeerDate &&
                          formik?.values?.maMonth1RoleOfOtzChoice &&
                          formik?.values?.maMonth1RoleOfOtzDate &&
                          formik?.values
                            ?.maMonth1OtzChampionOrientationChoice &&
                          formik?.values
                            ?.maMonth1OtzChampionOrientationDate && (
                            <div>
                              <div
                                style={{
                                  backgroundColor: "#d8f6ff",
                                  width: "95%",
                                  margin: "auto",
                                  marginTop: "5rem",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <p
                                  style={{
                                    color: "black",
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    marginLeft: "10px",
                                    marginTop: "10px",
                                  }}
                                >
                                  Modules activity/date of completion
                                </p>
                                <IconButton
                                  onClick={() =>
                                    setIsDropdownsOpen((prevState) => {
                                      return {
                                        ...prevState,
                                        monthTwoModulesActivities:
                                          !prevState.monthTwoModulesActivities,
                                      };
                                    })
                                  }
                                  aria-expanded={
                                    isDropdownsOpen.monthTwoModulesActivities
                                  }
                                  aria-label="Expand"
                                >
                                  <ExpandMoreIcon />
                                </IconButton>
                              </div>

                              <div className="card-body">
                                <Collapse
                                  in={isDropdownsOpen.monthTwoModulesActivities}
                                >
                                  <div
                                    className="basic-form"
                                    style={{ padding: "0 50px 0 50px" }}
                                  >
                                    <div className="row">
                                      <div className="form-group mb-3 col-md-6">
                                        <CustomFormGroup
                                          formik={formik}
                                          name="maMonth2PositiveLivingChoice"
                                        >
                                          <Label for="maMonth2PositiveLivingChoice">
                                            Positive Living
                                            <span style={{ color: "red" }}>
                                              {" "}
                                              *
                                            </span>{" "}
                                          </Label>
                                          <Input
                                          readOnly={isViewActionType}
                                            className="form-control"
                                            type="select"
                                            name="maMonth2PositiveLivingChoice"
                                            id="maMonth2PositiveLivingChoice"
                                            value={
                                              formik.values
                                                .maMonth2PositiveLivingChoice
                                            }
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            style={{
                                              border: "1px solid #014D88",
                                              borderRadius: "0.2rem",
                                            }}
                                          >
                                            <option value="">Select</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                          </Input>
                                          {formik?.touched
                                            ?.maMonth2PositiveLivingChoice &&
                                          formik?.errors
                                            ?.maMonth2PositiveLivingChoice !==
                                            "" ? (
                                            <span className={classes.error}>
                                              {
                                                formik?.errors
                                                  ?.maMonth2PositiveLivingChoice
                                              }
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </CustomFormGroup>
                                      </div>
                                      {formik.values
                                        .maMonth2PositiveLivingChoice ===
                                        "yes" && (
                                        <div className="form-group mb-3 col-md-6">
                                          <CustomFormGroup
                                            formik={formik}
                                            name="maMonth2PositiveLivingDate"
                                          >
                                            <Label for="maMonth2PositiveLivingDate">
                                              Date for positive living
                                              <span style={{ color: "red" }}>
                                                {" "}
                                                *
                                              </span>{" "}
                                            </Label>
                                            <Input
                                            readOnly={isViewActionType}
                                              className="form-control"
                                              type="date"
                                              {...{
                                                min: moment(
                                                  new Date(
                                                    props?.activeContent?.artCommence?.visitDate
                                                  )
                                                ).format("YYYY-MM-DD"),
                                              }}
                                              {...{
                                                max: moment(new Date()).format(
                                                  "YYYY-MM-DD"
                                                ),
                                              }}
                                              disabled={
                                                !props?.activeContent
                                                  ?.enrollment
                                                  ?.dateOfRegistration
                                              }
                                              name="maMonth2PositiveLivingDate"
                                              id="maMonth2PositiveLivingDate"
                                              value={
                                                formik.values
                                                  .maMonth2PositiveLivingDate
                                              }
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                              }}
                                            />
                                            {formik?.touched
                                              ?.maMonth2PositiveLivingDate &&
                                            formik.errors
                                              .maMonth2PositiveLivingDate !==
                                              "" ? (
                                              <span className={classes.error}>
                                                {
                                                  formik.errors
                                                    .maMonth2PositiveLivingDate
                                                }
                                              </span>
                                            ) : (
                                              ""
                                            )}
                                          </CustomFormGroup>
                                        </div>
                                      )}

                                      <div className="form-group mb-3 col-md-6">
                                        <CustomFormGroup
                                          formik={formik}
                                          name="maMonth2LiteracyTreatmentChoice"
                                        >
                                          <Label for="maMonth2LiteracyTreatmentChoice">
                                            Literacy Treatment
                                            <span style={{ color: "red" }}>
                                              {" "}
                                              *
                                            </span>{" "}
                                          </Label>
                                          <Input
                                          readOnly={isViewActionType}
                                            className="form-control"
                                            type="select"
                                            name="maMonth2LiteracyTreatmentChoice"
                                            id="maMonth2LiteracyTreatmentChoice"
                                            value={
                                              formik.values
                                                .maMonth2LiteracyTreatmentChoice
                                            }
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            style={{
                                              border: "1px solid #014D88",
                                              borderRadius: "0.2rem",
                                            }}
                                          >
                                            <option value="">Select</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                          </Input>
                                          {formik?.touched
                                            ?.maMonth2LiteracyTreatmentChoice &&
                                          formik.errors
                                            .maMonth2LiteracyTreatmentChoice !==
                                            "" ? (
                                            <span className={classes.error}>
                                              {
                                                formik?.errors
                                                  ?.maMonth2LiteracyTreatmentChoice
                                              }
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </CustomFormGroup>
                                      </div>

                                      {formik.values
                                        .maMonth2LiteracyTreatmentChoice ===
                                        "yes" && (
                                        <div className="form-group mb-3 col-md-6">
                                          <CustomFormGroup
                                            formik={formik}
                                            name="maMonth2LiteracyTreatmentDate"
                                          >
                                            <Label for="maMonth2LiteracyTreatmentDate">
                                              Date for literacy training
                                              <span style={{ color: "red" }}>
                                                {" "}
                                                *
                                              </span>{" "}
                                            </Label>
                                            <Input
                                            readOnly={isViewActionType}
                                              className="form-control"
                                              type="date"
                                              {...{
                                                min: moment(
                                                  new Date(
                                                    props?.activeContent?.artCommence?.visitDate
                                                  )
                                                ).format("YYYY-MM-DD"),
                                              }}
                                              {...{
                                                max: moment(new Date()).format(
                                                  "YYYY-MM-DD"
                                                ),
                                              }}
                                              disabled={
                                                !props?.activeContent
                                                  ?.enrollment
                                                  ?.dateOfRegistration
                                              }
                                              name="maMonth2LiteracyTreatmentDate"
                                              id="maMonth2LiteracyTreatmentDate"
                                              value={
                                                formik.values
                                                  .maMonth2LiteracyTreatmentDate
                                              }
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                              }}
                                            />
                                            {formik?.touched
                                              ?.maMonth2LiteracyTreatmentDate &&
                                            formik?.errors
                                              ?.maMonth2LiteracyTreatmentDate !==
                                              "" ? (
                                              <span className={classes.error}>
                                                {
                                                  formik?.errors
                                                    ?.maMonth2LiteracyTreatmentDate
                                                }
                                              </span>
                                            ) : (
                                              ""
                                            )}
                                          </CustomFormGroup>
                                        </div>
                                      )}

                                      <div className="form-group mb-3 col-md-6">
                                        <CustomFormGroup
                                          formik={formik}
                                          name="maMonth2AdolescentsParticipationChoice"
                                        >
                                          <Label for="maMonth2AdolescentsParticipationChoice">
                                            Adolescents Participation
                                            <span style={{ color: "red" }}>
                                              {" "}
                                              *
                                            </span>{" "}
                                          </Label>
                                          <Input
                                          readOnly={isViewActionType}
                                            className="form-control"
                                            type="select"
                                            name="maMonth2AdolescentsParticipationChoice"
                                            id="maMonth2AdolescentsParticipationChoice"
                                            value={
                                              formik.values
                                                .maMonth2AdolescentsParticipationChoice
                                            }
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            style={{
                                              border: "1px solid #014D88",
                                              borderRadius: "0.2rem",
                                            }}
                                          >
                                            <option value="">Select</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                          </Input>
                                          {formik?.touched
                                            ?.maMonth2AdolescentsParticipationChoice &&
                                          formik.errors
                                            .maMonth2AdolescentsParticipationChoice !==
                                            "" ? (
                                            <span className={classes.error}>
                                              {
                                                formik.errors
                                                  .maMonth2AdolescentsParticipationChoice
                                              }
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </CustomFormGroup>
                                      </div>

                                      {formik.values
                                        .maMonth2AdolescentsParticipationChoice ===
                                        "yes" && (
                                        <div className="form-group mb-3 col-md-6">
                                          <CustomFormGroup
                                            formik={formik}
                                            name="maMonth2AdolescentsParticipationDate"
                                          >
                                            <Label for="maMonth2AdolescentsParticipationDate">
                                              Date for adolescent participation
                                              <span style={{ color: "red" }}>
                                                {" "}
                                                *
                                              </span>{" "}
                                            </Label>
                                            <Input
                                            readOnly={isViewActionType}
                                              className="form-control"
                                              type="date"
                                              {...{
                                                min: moment(
                                                  new Date(
                                                    props?.activeContent?.artCommence?.visitDate
                                                  )
                                                ).format("YYYY-MM-DD"),
                                              }}
                                              {...{
                                                max: moment(new Date()).format(
                                                  "YYYY-MM-DD"
                                                ),
                                              }}
                                              disabled={
                                                !props?.activeContent
                                                  ?.enrollment
                                                  ?.dateOfRegistration
                                              }
                                              name="maMonth2AdolescentsParticipationDate"
                                              id="maMonth2AdolescentsParticipationDate"
                                              value={
                                                formik.values
                                                  .maMonth2AdolescentsParticipationDate
                                              }
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                              }}
                                            />
                                            {formik?.touched
                                              ?.maMonth2AdolescentsParticipationDate &&
                                            formik.errors
                                              .maMonth2AdolescentsParticipationDate !==
                                              "" ? (
                                              <span className={classes.error}>
                                                {
                                                  formik?.errors
                                                    ?.maMonth2AdolescentsParticipationDate
                                                }
                                              </span>
                                            ) : (
                                              ""
                                            )}
                                          </CustomFormGroup>
                                        </div>
                                      )}

                                      <div className="form-group mb-3 col-md-6">
                                        <CustomFormGroup
                                          formik={formik}
                                          name="maMonth2leadershipTrainingChoice"
                                        >
                                          <Label for="maMonth2leadershipTrainingChoice">
                                            Leadership participation
                                            <span style={{ color: "red" }}>
                                              {" "}
                                              *
                                            </span>{" "}
                                          </Label>
                                          <Input
                                          readOnly={isViewActionType}
                                            className="form-control"
                                            type="select"
                                            name="maMonth2leadershipTrainingChoice"
                                            id="maMonth2leadershipTrainingChoice"
                                            value={
                                              formik.values
                                                .maMonth2leadershipTrainingChoice
                                            }
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            style={{
                                              border: "1px solid #014D88",
                                              borderRadius: "0.2rem",
                                            }}
                                          >
                                            <option value="">Select</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                          </Input>
                                          {formik?.touched
                                            ?.maMonth2leadershipTrainingChoice &&
                                          formik?.errors
                                            ?.maMonth2leadershipTrainingChoice !==
                                            "" ? (
                                            <span className={classes.error}>
                                              {
                                                formik?.errors
                                                  ?.maMonth2leadershipTrainingChoice
                                              }
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </CustomFormGroup>
                                      </div>

                                      {formik.values
                                        .maMonth2leadershipTrainingChoice ===
                                        "yes" && (
                                        <div className="form-group mb-3 col-md-6">
                                          <CustomFormGroup
                                            formik={formik}
                                            name="maMonth2leadershipTrainingDate"
                                          >
                                            <Label for="maMonth2leadershipTrainingDate">
                                              Date for Leadership participation
                                              <span style={{ color: "red" }}>
                                                {" "}
                                                *
                                              </span>{" "}
                                            </Label>
                                            <Input
                                            readOnly={isViewActionType}
                                              className="form-control"
                                              type="date"
                                              {...{
                                                min: moment(
                                                  new Date(
                                                    props?.activeContent?.artCommence?.visitDate
                                                  )
                                                ).format("YYYY-MM-DD"),
                                              }}
                                              {...{
                                                max: moment(new Date()).format(
                                                  "YYYY-MM-DD"
                                                ),
                                              }}
                                              disabled={
                                                !props?.activeContent
                                                  ?.enrollment
                                                  ?.dateOfRegistration
                                              }
                                              name="maMonth2leadershipTrainingDate"
                                              id="maMonth2leadershipTrainingDate"
                                              value={
                                                formik.values
                                                  .maMonth2leadershipTrainingDate
                                              }
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                              }}
                                            />
                                            {formik?.touched
                                              ?.maMonth2leadershipTrainingDate &&
                                            formik.errors
                                              .maMonth2leadershipTrainingDate !==
                                              "" ? (
                                              <span className={classes.error}>
                                                {
                                                  formik?.errors
                                                    ?.maMonth2leadershipTrainingDate
                                                }
                                              </span>
                                            ) : (
                                              ""
                                            )}
                                          </CustomFormGroup>
                                        </div>
                                      )}

                                      <div className="form-group mb-3 col-md-6">
                                        <CustomFormGroup
                                          formik={formik}
                                          name="maMonth2PeerToPeerChoice"
                                        >
                                          <Label for="maMonth2PeerToPeerChoice">
                                            Peer to Peer Mentorship
                                            <span style={{ color: "red" }}>
                                              {" "}
                                              *
                                            </span>{" "}
                                          </Label>
                                          <Input
                                          readOnly={isViewActionType}
                                            className="form-control"
                                            type="select"
                                            name="maMonth2PeerToPeerChoice"
                                            id="maMonth2PeerToPeerChoice"
                                            value={
                                              formik.values
                                                .maMonth2PeerToPeerChoice
                                            }
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            style={{
                                              border: "1px solid #014D88",
                                              borderRadius: "0.2rem",
                                            }}
                                          >
                                            <option value="">Select</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                          </Input>
                                          {formik?.touched
                                            ?.maMonth2PeerToPeerChoice &&
                                          formik?.errors
                                            ?.maMonth2PeerToPeerChoice !==
                                            "" ? (
                                            <span className={classes.error}>
                                              {
                                                formik?.errors
                                                  ?.maMonth2PeerToPeerChoice
                                              }
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </CustomFormGroup>
                                      </div>

                                      {formik.values
                                        .maMonth2PeerToPeerChoice === "yes" && (
                                        <div className="form-group mb-3 col-md-6">
                                          <CustomFormGroup
                                            formik={formik}
                                            name="maMonth2PeerToPeerDate"
                                          >
                                            <Label for="maMonth2PeerToPeerDate">
                                              Date for peer to peer mentorship
                                              <span style={{ color: "red" }}>
                                                {" "}
                                                *
                                              </span>{" "}
                                            </Label>
                                            <Input
                                            readOnly={isViewActionType}
                                              className="form-control"
                                              type="date"
                                              {...{
                                                min: moment(
                                                  new Date(
                                                    props?.activeContent?.artCommence?.visitDate
                                                  )
                                                ).format("YYYY-MM-DD"),
                                              }}
                                              {...{
                                                max: moment(new Date()).format(
                                                  "YYYY-MM-DD"
                                                ),
                                              }}
                                              disabled={
                                                !props?.activeContent
                                                  ?.enrollment
                                                  ?.dateOfRegistration
                                              }
                                              name="maMonth2PeerToPeerDate"
                                              id="maMonth2PeerToPeerDate"
                                              value={
                                                formik.values
                                                  .maMonth2PeerToPeerDate
                                              }
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                              }}
                                            />
                                            {formik?.touched
                                              ?.maMonth2PeerToPeerDate &&
                                            formik?.errors
                                              ?.maMonth2PeerToPeerDate !==
                                              "" ? (
                                              <span className={classes.error}>
                                                {
                                                  formik?.errors
                                                    ?.maMonth2PeerToPeerDate
                                                }
                                              </span>
                                            ) : (
                                              ""
                                            )}
                                          </CustomFormGroup>
                                        </div>
                                      )}

                                      <div className="form-group mb-3 col-md-6">
                                        <CustomFormGroup
                                          formik={formik}
                                          name="maMonth2RoleOfOtzChoice"
                                        >
                                          <Label for="maMonth2RoleOfOtzChoice">
                                            Role of OTZ in 95-95-95
                                            <span style={{ color: "red" }}>
                                              {" "}
                                              *
                                            </span>{" "}
                                          </Label>
                                          <Input
                                          readOnly={isViewActionType}
                                            className="form-control"
                                            type="select"
                                            name="maMonth2RoleOfOtzChoice"
                                            id="maMonth2RoleOfOtzChoice"
                                            value={
                                              formik.values
                                                .maMonth2RoleOfOtzChoice
                                            }
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            style={{
                                              border: "1px solid #014D88",
                                              borderRadius: "0.2rem",
                                            }}
                                          >
                                            <option value="">Select</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                          </Input>
                                          {formik?.touched
                                            ?.maMonth2RoleOfOtzChoice &&
                                          formik?.errors
                                            ?.maMonth2RoleOfOtzChoice !== "" ? (
                                            <span className={classes.error}>
                                              {
                                                formik?.errors
                                                  ?.maMonth2RoleOfOtzChoice
                                              }
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </CustomFormGroup>
                                      </div>

                                      {formik.values.maMonth2RoleOfOtzChoice ===
                                        "yes" && (
                                        <div className="form-group mb-3 col-md-6">
                                          <CustomFormGroup
                                            formik={formik}
                                            name="maMonth2RoleOfOtzDate"
                                          >
                                            <Label for="maMonth2RoleOfOtzDate">
                                              Date for role of OTZ in 95-95-95
                                              <span style={{ color: "red" }}>
                                                {" "}
                                                *
                                              </span>{" "}
                                            </Label>
                                            <Input
                                            readOnly={isViewActionType}
                                              className="form-control"
                                              type="date"
                                              {...{
                                                min: moment(
                                                  new Date(
                                                    props?.activeContent?.artCommence?.visitDate
                                                  )
                                                ).format("YYYY-MM-DD"),
                                              }}
                                              {...{
                                                max: moment(new Date()).format(
                                                  "YYYY-MM-DD"
                                                ),
                                              }}
                                              disabled={
                                                !props?.activeContent
                                                  ?.enrollment
                                                  ?.dateOfRegistration
                                              }
                                              name="maMonth2RoleOfOtzDate"
                                              id="maMonth2RoleOfOtzDate"
                                              value={
                                                formik.values
                                                  .maMonth2RoleOfOtzDate
                                              }
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                              }}
                                            />
                                            {formik?.touched
                                              ?.maMonth2RoleOfOtzDate &&
                                            formik?.errors
                                              ?.maMonth2RoleOfOtzDate !== "" ? (
                                              <span className={classes.error}>
                                                {
                                                  formik?.errors
                                                    ?.maMonth2RoleOfOtzDate
                                                }
                                              </span>
                                            ) : (
                                              ""
                                            )}
                                          </CustomFormGroup>
                                        </div>
                                      )}

                                      <div className="form-group mb-3 col-md-6">
                                        <CustomFormGroup
                                          formik={formik}
                                          name="maMonth2OtzChampionOrientationChoice"
                                        >
                                          <Label for="maMonth2OtzChampionOrientationChoice">
                                            OTZ champion orientation
                                            <span style={{ color: "red" }}>
                                              {" "}
                                              *
                                            </span>{" "}
                                          </Label>
                                          <Input
                                          readOnly={isViewActionType}
                                            className="form-control"
                                            type="select"
                                            name="maMonth2OtzChampionOrientationChoice"
                                            id="maMonth2OtzChampionOrientationChoice"
                                            value={
                                              formik.values
                                                .maMonth2OtzChampionOrientationChoice
                                            }
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            style={{
                                              border: "1px solid #014D88",
                                              borderRadius: "0.2rem",
                                            }}
                                          >
                                            <option value="">Select</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                          </Input>
                                          {formik?.touched
                                            ?.maMonth2OtzChampionOrientationChoice &&
                                          formik?.errors
                                            ?.maMonth2OtzChampionOrientationChoice !==
                                            "" ? (
                                            <span className={classes.error}>
                                              {
                                                formik?.errors
                                                  ?.maMonth2OtzChampionOrientationChoice
                                              }
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </CustomFormGroup>
                                      </div>

                                      {formik.values
                                        .maMonth2OtzChampionOrientationChoice ===
                                        "yes" && (
                                        <div className="form-group mb-3 col-md-6">
                                          <CustomFormGroup
                                            formik={formik}
                                            name="maMonth2OtzChampionOrientationDate"
                                          >
                                            <Label for="maMonth2OtzChampionOrientationDate">
                                              Date for OTZ Champion Orientation
                                              <span style={{ color: "red" }}>
                                                {" "}
                                                *
                                              </span>{" "}
                                            </Label>
                                            <Input
                                            readOnly={isViewActionType}
                                              className="form-control"
                                              type="date"
                                              {...{
                                                min: moment(
                                                  new Date(
                                                    props?.activeContent?.artCommence?.visitDate
                                                  )
                                                ).format("YYYY-MM-DD"),
                                              }}
                                              {...{
                                                max: moment(new Date()).format(
                                                  "YYYY-MM-DD"
                                                ),
                                              }}
                                              disabled={
                                                !props?.activeContent
                                                  ?.enrollment
                                                  ?.dateOfRegistration
                                              }
                                              name="maMonth2OtzChampionOrientationDate"
                                              id="maMonth2OtzChampionOrientationDate"
                                              value={
                                                formik.values
                                                  .maMonth2OtzChampionOrientationDate
                                              }
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                              }}
                                            />
                                            {formik?.touched
                                              ?.maMonth2OtzChampionOrientationDate &&
                                            formik.errors
                                              .maMonth2OtzChampionOrientationDate !==
                                              "" ? (
                                              <span className={classes.error}>
                                                {
                                                  formik?.errors
                                                    ?.maMonth2OtzChampionOrientationDate
                                                }
                                              </span>
                                            ) : (
                                              ""
                                            )}
                                          </CustomFormGroup>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </Collapse>
                              </div>
                            </div>
                          )}

                        <div className="d-flex justify-content-end">
                          <MatButton
                            type="button"
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            style={{ backgroundColor: "#014d88" }}
                            startIcon={<SaveIcon />}
                            disabled={saving}
                            onClick={() =>
                              handleSubmitAdherence(formik.values, {
                                reroute: false,
                                monthOfData: 2,
                              })
                            }
                          >
                            {!saving ? (
                              <span style={{ textTransform: "capitalize" }}>
                                Submit month 2
                              </span>
                            ) : (
                              <span style={{ textTransform: "capitalize" }}>
                                Submitting...
                              </span>
                            )}
                          </MatButton>
                        </div>
                      </div>
                    )}

                  {formik?.values?.acMonth2EacDate1 &&
                    formik?.values?.acMonth2EacDate2 &&
                    formik?.values?.acMonth2EacDate3 &&
                    formik?.values?.maMonth2PositiveLivingChoice &&
                    formik?.values?.maMonth2PositiveLivingDate &&
                    formik?.values?.maMonth2LiteracyTreatmentChoice &&
                    formik?.values?.maMonth2LiteracyTreatmentDate &&
                    formik?.values?.maMonth2AdolescentsParticipationChoice &&
                    formik?.values?.maMonth2AdolescentsParticipationDate &&
                    formik?.values?.maMonth2leadershipTrainingChoice &&
                    formik?.values?.maMonth2leadershipTrainingDate &&
                    formik?.values?.maMonth2PeerToPeerChoice &&
                    formik?.values?.maMonth2PeerToPeerDate &&
                    formik?.values?.maMonth2RoleOfOtzChoice &&
                    formik?.values?.maMonth2RoleOfOtzDate &&
                    formik?.values?.maMonth2OtzChampionOrientationChoice &&
                    formik?.values?.maMonth2OtzChampionOrientationDate && (
                      <div
                        className="card"
                        style={{
                          margin: "20px",
                        }}
                      >
                        <h5
                          style={{
                            color: "black",
                            fontSize: "20px",
                            fontWeight: "600",
                            marginLeft: "10px",
                            marginTop: "10px",
                          }}
                        >
                          Month 3
                        </h5>

                        {formik?.values?.acMonth2EacDate1 &&
                          formik?.values?.acMonth2EacDate2 &&
                          formik?.values?.acMonth2EacDate3 && (
                            <div>
                              <div
                                style={{
                                  backgroundColor: "#d8f6ff",
                                  width: "95%",
                                  margin: "auto",
                                  marginTop: "5rem",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <p
                                  style={{
                                    color: "black",
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    marginLeft: "10px",
                                    marginTop: "10px",
                                  }}
                                >
                                  Adherence Counselling
                                </p>
                                <IconButton
                                  onClick={() =>
                                    setIsDropdownsOpen((prevState) => {
                                      return {
                                        ...prevState,
                                        monthThreeAdherenceCounselling:
                                          !prevState.monthThreeAdherenceCounselling,
                                      };
                                    })
                                  }
                                  aria-expanded={
                                    isDropdownsOpen.monthThreeAdherenceCounselling
                                  }
                                  aria-label="Expand"
                                >
                                  <ExpandMoreIcon />
                                </IconButton>
                              </div>
                              <div className="card-body">
                                <Collapse
                                  in={
                                    isDropdownsOpen.monthThreeAdherenceCounselling
                                  }
                                >
                                  <div
                                    className="basic-form"
                                    style={{ padding: "0 50px 0 50px" }}
                                  >
                                    <div className="row">
                                      <div className="form-group mb-3 col-md-4">
                                        <CustomFormGroup
                                          formik={formik}
                                          name="acMonth3EacDate1"
                                        >
                                          <Label for="acMonth3EacDate1">
                                            EAC 1 date
                                            <span style={{ color: "red" }}>
                                              {" "}
                                              *
                                            </span>{" "}
                                          </Label>
                                          <Input
                                          readOnly={isViewActionType}
                                            className="form-control"
                                            type="date"
                                            {...{
                                              min: moment(
                                                new Date(
                                                  formik?.values?.dateEnrolledIntoOtz
                                                )
                                              ).format("YYYY-MM-DD"),
                                            }}
                                            {...{
                                              max: moment(new Date()).format(
                                                "YYYY-MM-DD"
                                              ),
                                            }}
                                            disabled={
                                              !formik?.values
                                                ?.dateEnrolledIntoOtz
                                            }
                                            name="acMonth3EacDate1"
                                            id="acMonth3EacDate1"
                                            value={
                                              formik.values.acMonth3EacDate1
                                            }
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            style={{
                                              border: "1px solid #014D88",
                                              borderRadius: "0.2rem",
                                            }}
                                          />
                                          {formik?.touched?.acMonth3EacDate1 &&
                                          formik.errors.acMonth3EacDate1 !==
                                            "" ? (
                                            <span className={classes.error}>
                                              {formik?.errors?.acMonth3EacDate1}
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </CustomFormGroup>
                                      </div>

                                      {formik?.values?.acMonth3EacDate1 && (
                                        <div className="form-group mb-3 col-md-4">
                                          <CustomFormGroup
                                            formik={formik}
                                            name="acMonth3EacDate2"
                                          >
                                            <Label for="acMonth3EacDate2">
                                              EAC 2 date
                                              <span style={{ color: "red" }}>
                                                {" "}
                                                *
                                              </span>{" "}
                                            </Label>
                                            <Input
                                            readOnly={isViewActionType}
                                              className="form-control"
                                              type="date"
                                              {...{
                                                min: moment(
                                                  new Date(
                                                    formik?.values?.dateEnrolledIntoOtz
                                                  )
                                                ).format("YYYY-MM-DD"),
                                              }}
                                              {...{
                                                max: moment(new Date()).format(
                                                  "YYYY-MM-DD"
                                                ),
                                              }}
                                              disabled={
                                                !formik?.values
                                                  ?.dateEnrolledIntoOtz
                                              }
                                              name="acMonth3EacDate2"
                                              id="acMonth3EacDate2"
                                              value={
                                                formik.values.acMonth3EacDate2
                                              }
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                              }}
                                            />
                                            {formik?.touched
                                              ?.acMonth3EacDate2 &&
                                            formik?.errors?.acMonth3EacDate2 !==
                                              "" ? (
                                              <span className={classes.error}>
                                                {
                                                  formik?.errors
                                                    ?.acMonth3EacDate2
                                                }
                                              </span>
                                            ) : (
                                              ""
                                            )}
                                          </CustomFormGroup>
                                        </div>
                                      )}

                                      {formik?.values?.acMonth3EacDate2 && (
                                        <div className="form-group mb-3 col-md-4">
                                          <CustomFormGroup
                                            formik={formik}
                                            name="acMonth3EacDate3"
                                          >
                                            <Label for="acMonth3EacDate3">
                                              EAC 3 date
                                            </Label>
                                            <Input
                                            readOnly={isViewActionType}
                                              type="date"
                                              {...{
                                                min: moment(
                                                  new Date(
                                                    formik?.values?.dateEnrolledIntoOtz
                                                  )
                                                ).format("YYYY-MM-DD"),
                                              }}
                                              {...{
                                                max: moment(new Date()).format(
                                                  "YYYY-MM-DD"
                                                ),
                                              }}
                                              disabled={
                                                !formik?.values
                                                  ?.dateEnrolledIntoOtz
                                              }
                                              className="form-control"
                                              name="acMonth3EacDate3"
                                              id="acMonth3EacDate3"
                                              value={
                                                formik.values.acMonth3EacDate3
                                              }
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                              }}
                                            ></Input>
                                            {formik?.touched
                                              ?.acMonth3EacDate3 &&
                                            formik.errors.acMonth3EacDate3 !==
                                              "" ? (
                                              <span className={classes.error}>
                                                {formik.errors.acMonth3EacDate3}
                                              </span>
                                            ) : (
                                              ""
                                            )}
                                          </CustomFormGroup>
                                        </div>
                                      )}

                                      {formik?.values?.acMonth3EacDate3 && (
                                        <div className="row">
                                          <div className="form-group mb-3 col-md-4">
                                            <CustomFormGroup
                                              formik={formik}
                                              name="dateViralLoadAssesmentMonth3"
                                            >
                                              <Label for="dateViralLoadAssesmentMonth3">
                                                Date of viral load assessment
                                                <span style={{ color: "red" }}>
                                                  {" "}
                                                  *
                                                </span>{" "}
                                              </Label>
                                              <Input
                                              readOnly={isViewActionType}
                                                className="form-control"
                                                type="date"
                                                {...{
                                                  min: moment(
                                                    new Date(
                                                      formik?.values?.dateEnrolledIntoOtz
                                                    )
                                                  ).format("YYYY-MM-DD"),
                                                }}
                                                {...{
                                                  max: moment(
                                                    new Date()
                                                  ).format("YYYY-MM-DD"),
                                                }}
                                                disabled={
                                                  !formik?.values
                                                    ?.dateEnrolledIntoOtz
                                                }
                                                name="dateViralLoadAssesmentMonth3"
                                                id="dateViralLoadAssesmentMonth3"
                                                value={
                                                  formik?.values
                                                    ?.dateViralLoadAssesmentMonth3
                                                }
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                style={{
                                                  border: "1px solid #014D88",
                                                  borderRadius: "0.2rem",
                                                }}
                                              />
                                              {formik?.touched
                                                ?.dateViralLoadAssesmentMonth3 &&
                                              formik?.errors
                                                ?.dateViralLoadAssesmentMonth3 !==
                                                "" ? (
                                                <span className={classes.error}>
                                                  {
                                                    formik?.errors
                                                      ?.dateViralLoadAssesmentMonth3
                                                  }
                                                </span>
                                              ) : (
                                                ""
                                              )}
                                            </CustomFormGroup>
                                          </div>

                                          <div className="form-group mb-3 col-md-4">
                                            <CustomFormGroup
                                              formik={formik}
                                              name="viralLoadMonth3"
                                            >
                                              <Label for="viralLoadMonth3">
                                                Viral load
                                                <span style={{ color: "red" }}>
                                                  {" "}
                                                  *
                                                </span>{" "}
                                              </Label>
                                              <Input
                                              readOnly={isViewActionType}
                                                className="form-control"
                                                type="number"
                                                name="viralLoadMonth3"
                                                id="viralLoadMonth3"
                                                value={
                                                  formik?.values
                                                    ?.viralLoadMonth3
                                                }
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                style={{
                                                  border: "1px solid #014D88",
                                                  borderRadius: "0.2rem",
                                                }}
                                              />
                                              {formik?.touched
                                                ?.viralLoadMonth3 &&
                                              formik.errors.viralLoadMonth3 !==
                                                "" ? (
                                                <span className={classes.error}>
                                                  {
                                                    formik.errors
                                                      .viralLoadMonth3
                                                  }
                                                </span>
                                              ) : (
                                                ""
                                              )}
                                            </CustomFormGroup>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </Collapse>
                              </div>
                            </div>
                          )}

                        {formik?.values?.maMonth2PositiveLivingChoice &&
                          formik?.values?.maMonth2PositiveLivingDate &&
                          formik?.values?.maMonth2LiteracyTreatmentChoice &&
                          formik?.values?.maMonth2LiteracyTreatmentDate &&
                          formik?.values
                            ?.maMonth2AdolescentsParticipationChoice &&
                          formik?.values
                            ?.maMonth2AdolescentsParticipationDate &&
                          formik?.values?.maMonth2leadershipTrainingChoice &&
                          formik?.values?.maMonth2leadershipTrainingDate &&
                          formik?.values?.maMonth2PeerToPeerChoice &&
                          formik?.values?.maMonth2PeerToPeerDate &&
                          formik?.values?.maMonth2RoleOfOtzChoice &&
                          formik?.values?.maMonth2RoleOfOtzDate &&
                          formik?.values
                            ?.maMonth2OtzChampionOrientationChoice &&
                          formik?.values
                            ?.maMonth2OtzChampionOrientationDate && (
                            <div>
                              <div
                                style={{
                                  backgroundColor: "#d8f6ff",
                                  width: "95%",
                                  margin: "auto",
                                  marginTop: "5rem",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <p
                                  style={{
                                    color: "black",
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    marginLeft: "10px",
                                    marginTop: "10px",
                                  }}
                                >
                                  Modules activity/date of completion
                                </p>
                                <IconButton
                                  onClick={() =>
                                    setIsDropdownsOpen((prevState) => {
                                      return {
                                        ...prevState,
                                        monthThreeModulesActivities:
                                          !prevState.monthThreeModulesActivities,
                                      };
                                    })
                                  }
                                  aria-expanded={
                                    isDropdownsOpen.monthThreeModulesActivities
                                  }
                                  aria-label="Expand"
                                >
                                  <ExpandMoreIcon />
                                </IconButton>
                              </div>

                              <div className="card-body">
                                <Collapse
                                  in={
                                    isDropdownsOpen.monthThreeModulesActivities
                                  }
                                >
                                  <div
                                    className="basic-form"
                                    style={{ padding: "0 50px 0 50px" }}
                                  >
                                    <div className="row">
                                      <div className="form-group mb-3 col-md-6">
                                        <CustomFormGroup
                                          formik={formik}
                                          name="maMonth3PositiveLivingChoice"
                                        >
                                          <Label for="maMonth3PositiveLivingChoice">
                                            Positive Living
                                            <span style={{ color: "red" }}>
                                              {" "}
                                              *
                                            </span>{" "}
                                          </Label>
                                          <Input
                                          readOnly={isViewActionType}
                                            className="form-control"
                                            type="select"
                                            name="maMonth3PositiveLivingChoice"
                                            id="maMonth3PositiveLivingChoice"
                                            value={
                                              formik.values
                                                .maMonth3PositiveLivingChoice
                                            }
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            style={{
                                              border: "1px solid #014D88",
                                              borderRadius: "0.2rem",
                                            }}
                                          >
                                            <option value="">Select</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                          </Input>
                                          {formik?.touched
                                            ?.maMonth3PositiveLivingChoice &&
                                          formik.errors
                                            .maMonth3PositiveLivingChoice !==
                                            "" ? (
                                            <span className={classes.error}>
                                              {
                                                formik.errors
                                                  .maMonth3PositiveLivingChoice
                                              }
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </CustomFormGroup>
                                      </div>
                                      {formik?.values
                                        ?.maMonth3PositiveLivingChoice ===
                                        "yes" && (
                                        <div className="form-group mb-3 col-md-6">
                                          <CustomFormGroup
                                            formik={formik}
                                            name="maMonth3PositiveLivingDate"
                                          >
                                            <Label for="maMonth3PositiveLivingDate">
                                              Date for positive living
                                              <span style={{ color: "red" }}>
                                                {" "}
                                                *
                                              </span>{" "}
                                            </Label>
                                            <Input
                                            readOnly={isViewActionType}
                                              className="form-control"
                                              type="date"
                                              {...{
                                                min: moment(
                                                  new Date(
                                                    props?.activeContent?.artCommence?.visitDate
                                                  )
                                                ).format("YYYY-MM-DD"),
                                              }}
                                              {...{
                                                max: moment(new Date()).format(
                                                  "YYYY-MM-DD"
                                                ),
                                              }}
                                              disabled={
                                                !props?.activeContent
                                                  ?.enrollment
                                                  ?.dateOfRegistration
                                              }
                                              name="maMonth3PositiveLivingDate"
                                              id="maMonth3PositiveLivingDate"
                                              value={
                                                formik.values
                                                  .maMonth3PositiveLivingDate
                                              }
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                              }}
                                            />
                                            {formik?.touched
                                              ?.maMonth3PositiveLivingDate &&
                                            formik.errors
                                              .maMonth3PositiveLivingDate !==
                                              "" ? (
                                              <span className={classes.error}>
                                                {
                                                  formik.errors
                                                    .maMonth3PositiveLivingDate
                                                }
                                              </span>
                                            ) : (
                                              ""
                                            )}
                                          </CustomFormGroup>
                                        </div>
                                      )}

                                      <div className="form-group mb-3 col-md-6">
                                        <CustomFormGroup
                                          formik={formik}
                                          name="maMonth3LiteracyTreatmentChoice"
                                        >
                                          <Label for="maMonth3LiteracyTreatmentChoice">
                                            Literacy Treatment
                                            <span style={{ color: "red" }}>
                                              {" "}
                                              *
                                            </span>{" "}
                                          </Label>
                                          <Input
                                          readOnly={isViewActionType}
                                            className="form-control"
                                            type="select"
                                            name="maMonth3LiteracyTreatmentChoice"
                                            id="maMonth3LiteracyTreatmentChoice"
                                            value={
                                              formik.values
                                                .maMonth3LiteracyTreatmentChoice
                                            }
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            style={{
                                              border: "1px solid #014D88",
                                              borderRadius: "0.2rem",
                                            }}
                                          >
                                            <option value="">Select</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                          </Input>
                                          {formik?.touched
                                            ?.maMonth3LiteracyTreatmentChoice &&
                                          formik.errors
                                            .maMonth3LiteracyTreatmentChoice !==
                                            "" ? (
                                            <span className={classes.error}>
                                              {
                                                formik.errors
                                                  .maMonth3LiteracyTreatmentChoice
                                              }
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </CustomFormGroup>
                                      </div>

                                      {formik.values
                                        .maMonth3LiteracyTreatmentChoice ===
                                        "yes" && (
                                        <div className="form-group mb-3 col-md-6">
                                          <CustomFormGroup
                                            formik={formik}
                                            name="maMonth3LiteracyTreatmentDate"
                                          >
                                            <Label for="maMonth3LiteracyTreatmentDate">
                                              Date for literacy training
                                              <span style={{ color: "red" }}>
                                                {" "}
                                                *
                                              </span>{" "}
                                            </Label>
                                            <Input
                                            readOnly={isViewActionType}
                                              className="form-control"
                                              type="date"
                                              {...{
                                                min: moment(
                                                  new Date(
                                                    props?.activeContent?.artCommence?.visitDate
                                                  )
                                                ).format("YYYY-MM-DD"),
                                              }}
                                              {...{
                                                max: moment(new Date()).format(
                                                  "YYYY-MM-DD"
                                                ),
                                              }}
                                              disabled={
                                                !props?.activeContent
                                                  ?.enrollment
                                                  ?.dateOfRegistration
                                              }
                                              name="maMonth3LiteracyTreatmentDate"
                                              id="maMonth3LiteracyTreatmentDate"
                                              value={
                                                formik.values
                                                  .maMonth3LiteracyTreatmentDate
                                              }
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                              }}
                                            />
                                            {formik?.touched
                                              ?.maMonth3LiteracyTreatmentDate &&
                                            formik.errors
                                              .maMonth3LiteracyTreatmentDate !==
                                              "" ? (
                                              <span className={classes.error}>
                                                {
                                                  formik.errors
                                                    .maMonth3LiteracyTreatmentDate
                                                }
                                              </span>
                                            ) : (
                                              ""
                                            )}
                                          </CustomFormGroup>
                                        </div>
                                      )}

                                      <div className="form-group mb-3 col-md-6">
                                        <CustomFormGroup
                                          formik={formik}
                                          name="maMonth3AdolescentsParticipationChoice"
                                        >
                                          <Label for="maMonth3AdolescentsParticipationChoice">
                                            Adolescents Participation
                                            <span style={{ color: "red" }}>
                                              {" "}
                                              *
                                            </span>{" "}
                                          </Label>
                                          <Input
                                          readOnly={isViewActionType}
                                            className="form-control"
                                            type="select"
                                            name="maMonth3AdolescentsParticipationChoice"
                                            id="maMonth3AdolescentsParticipationChoice"
                                            value={
                                              formik.values
                                                .maMonth3AdolescentsParticipationChoice
                                            }
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            style={{
                                              border: "1px solid #014D88",
                                              borderRadius: "0.2rem",
                                            }}
                                          >
                                            <option value="">Select</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                          </Input>
                                          {formik?.touched
                                            ?.maMonth3AdolescentsParticipationChoice &&
                                          formik.errors
                                            .maMonth3AdolescentsParticipationChoice !==
                                            "" ? (
                                            <span className={classes.error}>
                                              {
                                                formik.errors
                                                  .maMonth3AdolescentsParticipationChoice
                                              }
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </CustomFormGroup>
                                      </div>

                                      {formik.values
                                        .maMonth3AdolescentsParticipationChoice ===
                                        "yes" && (
                                        <div className="form-group mb-3 col-md-6">
                                          <CustomFormGroup
                                            formik={formik}
                                            name="maMonth3AdolescentsParticipationDate"
                                          >
                                            <Label for="maMonth3AdolescentsParticipationDate">
                                              Date for adolescent participation
                                              <span style={{ color: "red" }}>
                                                {" "}
                                                *
                                              </span>{" "}
                                            </Label>
                                            <Input
                                            readOnly={isViewActionType}
                                              className="form-control"
                                              type="date"
                                              {...{
                                                min: moment(
                                                  new Date(
                                                    props?.activeContent?.artCommence?.visitDate
                                                  )
                                                ).format("YYYY-MM-DD"),
                                              }}
                                              {...{
                                                max: moment(new Date()).format(
                                                  "YYYY-MM-DD"
                                                ),
                                              }}
                                              disabled={
                                                !props?.activeContent
                                                  ?.enrollment
                                                  ?.dateOfRegistration
                                              }
                                              name="maMonth3AdolescentsParticipationDate"
                                              id="maMonth3AdolescentsParticipationDate"
                                              value={
                                                formik.values
                                                  .maMonth3AdolescentsParticipationDate
                                              }
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                              }}
                                            />
                                            {formik?.touched
                                              ?.maMonth3AdolescentsParticipationDate &&
                                            formik.errors
                                              .maMonth3AdolescentsParticipationDate !==
                                              "" ? (
                                              <span className={classes.error}>
                                                {
                                                  formik.errors
                                                    .maMonth3AdolescentsParticipationDate
                                                }
                                              </span>
                                            ) : (
                                              ""
                                            )}
                                          </CustomFormGroup>
                                        </div>
                                      )}

                                      <div className="form-group mb-3 col-md-6">
                                        <CustomFormGroup
                                          formik={formik}
                                          name="maMonth3leadershipTrainingChoice"
                                        >
                                          <Label for="maMonth3leadershipTrainingChoice">
                                            Leadership participation
                                            <span style={{ color: "red" }}>
                                              {" "}
                                              *
                                            </span>{" "}
                                          </Label>
                                          <Input
                                          readOnly={isViewActionType}
                                            className="form-control"
                                            type="select"
                                            name="maMonth3leadershipTrainingChoice"
                                            id="maMonth3leadershipTrainingChoice"
                                            value={
                                              formik.values
                                                .maMonth3leadershipTrainingChoice
                                            }
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            style={{
                                              border: "1px solid #014D88",
                                              borderRadius: "0.2rem",
                                            }}
                                          >
                                            <option value="">Select</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                          </Input>
                                          {formik?.touched
                                            ?.maMonth3leadershipTrainingChoice &&
                                          formik.errors
                                            .maMonth3leadershipTrainingChoice !==
                                            "" ? (
                                            <span className={classes.error}>
                                              {
                                                formik.errors
                                                  .maMonth3leadershipTrainingChoice
                                              }
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </CustomFormGroup>
                                      </div>

                                      {formik.values
                                        .maMonth3leadershipTrainingChoice ===
                                        "yes" && (
                                        <div className="form-group mb-3 col-md-6">
                                          <CustomFormGroup
                                            formik={formik}
                                            name="maMonth3leadershipTrainingDate"
                                          >
                                            <Label for="maMonth3leadershipTrainingDate">
                                              Date for Leadership participation
                                              <span style={{ color: "red" }}>
                                                {" "}
                                                *
                                              </span>{" "}
                                            </Label>
                                            <Input
                                            readOnly={isViewActionType}
                                              className="form-control"
                                              type="date"
                                              {...{
                                                min: moment(
                                                  new Date(
                                                    props?.activeContent?.artCommence?.visitDate
                                                  )
                                                ).format("YYYY-MM-DD"),
                                              }}
                                              {...{
                                                max: moment(new Date()).format(
                                                  "YYYY-MM-DD"
                                                ),
                                              }}
                                              disabled={
                                                !props?.activeContent
                                                  ?.enrollment
                                                  ?.dateOfRegistration
                                              }
                                              name="maMonth3leadershipTrainingDate"
                                              id="maMonth3leadershipTrainingDate"
                                              value={
                                                formik.values
                                                  .maMonth3leadershipTrainingDate
                                              }
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                              }}
                                            />
                                            {formik?.touched
                                              ?.maMonth3leadershipTrainingDate &&
                                            formik.errors
                                              .maMonth3leadershipTrainingDate !==
                                              "" ? (
                                              <span className={classes.error}>
                                                {
                                                  formik.errors
                                                    .maMonth3leadershipTrainingDate
                                                }
                                              </span>
                                            ) : (
                                              ""
                                            )}
                                          </CustomFormGroup>
                                        </div>
                                      )}

                                      <div className="form-group mb-3 col-md-6">
                                        <CustomFormGroup
                                          formik={formik}
                                          name="maMonth3PeerToPeerChoice"
                                        >
                                          <Label for="maMonth3PeerToPeerChoice">
                                            Peer to Peer Mentorship
                                            <span style={{ color: "red" }}>
                                              {" "}
                                              *
                                            </span>{" "}
                                          </Label>
                                          <Input
                                          readOnly={isViewActionType}
                                            className="form-control"
                                            type="select"
                                            name="maMonth3PeerToPeerChoice"
                                            id="maMonth3PeerToPeerChoice"
                                            value={
                                              formik.values
                                                .maMonth3PeerToPeerChoice
                                            }
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            style={{
                                              border: "1px solid #014D88",
                                              borderRadius: "0.2rem",
                                            }}
                                          >
                                            <option value="">Select</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                          </Input>
                                          {formik?.touched
                                            ?.maMonth3PeerToPeerChoice &&
                                          formik.errors
                                            .maMonth3PeerToPeerChoice !== "" ? (
                                            <span className={classes.error}>
                                              {
                                                formik.errors
                                                  .maMonth3PeerToPeerChoice
                                              }
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </CustomFormGroup>
                                      </div>

                                      {formik.values
                                        .maMonth3PeerToPeerChoice === "yes" && (
                                        <div className="form-group mb-3 col-md-6">
                                          <CustomFormGroup
                                            formik={formik}
                                            name="maMonth3PeerToPeerDate"
                                          >
                                            <Label for="maMonth3PeerToPeerDate">
                                              Date for peer to peer mentorship
                                              <span style={{ color: "red" }}>
                                                {" "}
                                                *
                                              </span>{" "}
                                            </Label>
                                            <Input
                                            readOnly={isViewActionType}
                                              className="form-control"
                                              type="date"
                                              {...{
                                                min: moment(
                                                  new Date(
                                                    props?.activeContent?.artCommence?.visitDate
                                                  )
                                                ).format("YYYY-MM-DD"),
                                              }}
                                              {...{
                                                max: moment(new Date()).format(
                                                  "YYYY-MM-DD"
                                                ),
                                              }}
                                              disabled={
                                                !props?.activeContent
                                                  ?.enrollment
                                                  ?.dateOfRegistration
                                              }
                                              name="maMonth3PeerToPeerDate"
                                              id="maMonth3PeerToPeerDate"
                                              value={
                                                formik.values
                                                  .maMonth3PeerToPeerDate
                                              }
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                              }}
                                            />
                                            {formik?.touched
                                              ?.maMonth3PeerToPeerDate &&
                                            formik.errors
                                              .maMonth3PeerToPeerDate !== "" ? (
                                              <span className={classes.error}>
                                                {
                                                  formik.errors
                                                    .maMonth3PeerToPeerDate
                                                }
                                              </span>
                                            ) : (
                                              ""
                                            )}
                                          </CustomFormGroup>
                                        </div>
                                      )}

                                      <div className="form-group mb-3 col-md-6">
                                        <CustomFormGroup
                                          formik={formik}
                                          name="maMonth3RoleOfOtzChoice"
                                        >
                                          <Label for="maMonth3RoleOfOtzChoice">
                                            Role of OTZ in 95-95-95
                                            <span style={{ color: "red" }}>
                                              {" "}
                                              *
                                            </span>{" "}
                                          </Label>
                                          <Input
                                          readOnly={isViewActionType}
                                            className="form-control"
                                            type="select"
                                            name="maMonth3RoleOfOtzChoice"
                                            id="maMonth3RoleOfOtzChoice"
                                            value={
                                              formik.values
                                                .maMonth3RoleOfOtzChoice
                                            }
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            style={{
                                              border: "1px solid #014D88",
                                              borderRadius: "0.2rem",
                                            }}
                                          >
                                            <option value="">Select</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                          </Input>
                                          {formik?.touched
                                            ?.maMonth3RoleOfOtzChoice &&
                                          formik.errors
                                            .maMonth3RoleOfOtzChoice !== "" ? (
                                            <span className={classes.error}>
                                              {
                                                formik.errors
                                                  .maMonth3RoleOfOtzChoice
                                              }
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </CustomFormGroup>
                                      </div>

                                      {formik.values.maMonth3RoleOfOtzChoice ===
                                        "yes" && (
                                        <div className="form-group mb-3 col-md-6">
                                          <CustomFormGroup
                                            formik={formik}
                                            name="maMonth3RoleOfOtzDate"
                                          >
                                            <Label for="maMonth3RoleOfOtzDate">
                                              Date for role of OTZ in 95-95-95
                                              <span style={{ color: "red" }}>
                                                {" "}
                                                *
                                              </span>{" "}
                                            </Label>
                                            <Input
                                            readOnly={isViewActionType}
                                              className="form-control"
                                              type="date"
                                              {...{
                                                min: moment(
                                                  new Date(
                                                    props?.activeContent?.artCommence?.visitDate
                                                  )
                                                ).format("YYYY-MM-DD"),
                                              }}
                                              {...{
                                                max: moment(new Date()).format(
                                                  "YYYY-MM-DD"
                                                ),
                                              }}
                                              disabled={
                                                !props?.activeContent
                                                  ?.enrollment
                                                  ?.dateOfRegistration
                                              }
                                              name="maMonth3RoleOfOtzDate"
                                              id="maMonth3RoleOfOtzDate"
                                              value={
                                                formik.values
                                                  .maMonth3RoleOfOtzDate
                                              }
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                              }}
                                            />
                                            {formik?.touched
                                              ?.maMonth3RoleOfOtzDate &&
                                            formik.errors
                                              .maMonth3RoleOfOtzDate !== "" ? (
                                              <span className={classes.error}>
                                                {
                                                  formik.errors
                                                    .maMonth3RoleOfOtzDate
                                                }
                                              </span>
                                            ) : (
                                              ""
                                            )}
                                          </CustomFormGroup>
                                        </div>
                                      )}

                                      <div className="form-group mb-3 col-md-6">
                                        <CustomFormGroup
                                          formik={formik}
                                          name="maMonth3OtzChampionOrientationChoice"
                                        >
                                          <Label for="maMonth3OtzChampionOrientationChoice">
                                            OTZ champion orientation
                                            <span style={{ color: "red" }}>
                                              {" "}
                                              *
                                            </span>{" "}
                                          </Label>
                                          <Input
                                          readOnly={isViewActionType}
                                            className="form-control"
                                            type="select"
                                            name="maMonth3OtzChampionOrientationChoice"
                                            id="maMonth3OtzChampionOrientationChoice"
                                            value={
                                              formik.values
                                                .maMonth3OtzChampionOrientationChoice
                                            }
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            style={{
                                              border: "1px solid #014D88",
                                              borderRadius: "0.2rem",
                                            }}
                                          >
                                            <option value="">Select</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                          </Input>
                                          {formik?.touched
                                            ?.maMonth3OtzChampionOrientationChoice &&
                                          formik.errors
                                            .maMonth3OtzChampionOrientationChoice !==
                                            "" ? (
                                            <span className={classes.error}>
                                              {
                                                formik.errors
                                                  .maMonth3OtzChampionOrientationChoice
                                              }
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </CustomFormGroup>
                                      </div>

                                      {formik.values
                                        .maMonth3OtzChampionOrientationChoice ===
                                        "yes" && (
                                        <div className="form-group mb-3 col-md-6">
                                          <CustomFormGroup
                                            formik={formik}
                                            name="maMonth3OtzChampionOrientationDate"
                                          >
                                            <Label for="maMonth3OtzChampionOrientationDate">
                                              Date for OTZ Champion Orientation
                                              <span style={{ color: "red" }}>
                                                {" "}
                                                *
                                              </span>{" "}
                                            </Label>
                                            <Input
                                            readOnly={isViewActionType}
                                              className="form-control"
                                              type="date"
                                              {...{
                                                min: moment(
                                                  new Date(
                                                    props?.activeContent?.artCommence?.visitDate
                                                  )
                                                ).format("YYYY-MM-DD"),
                                              }}
                                              {...{
                                                max: moment(new Date()).format(
                                                  "YYYY-MM-DD"
                                                ),
                                              }}
                                              disabled={
                                                !props?.activeContent
                                                  ?.enrollment
                                                  ?.dateOfRegistration
                                              }
                                              name="maMonth3OtzChampionOrientationDate"
                                              id="maMonth3OtzChampionOrientationDate"
                                              value={
                                                formik.values
                                                  .maMonth3OtzChampionOrientationDate
                                              }
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              style={{
                                                border: "1px solid #014D88",
                                                borderRadius: "0.2rem",
                                              }}
                                            />
                                            {formik?.touched
                                              ?.maMonth3OtzChampionOrientationDate &&
                                            formik.errors
                                              .maMonth3OtzChampionOrientationDate !==
                                              "" ? (
                                              <span className={classes.error}>
                                                {
                                                  formik.errors
                                                    .maMonth3OtzChampionOrientationDate
                                                }
                                              </span>
                                            ) : (
                                              ""
                                            )}
                                          </CustomFormGroup>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </Collapse>
                              </div>
                            </div>
                          )}

                        <div className="d-flex justify-content-end">
                          <MatButton
                            type="button"
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            style={{ backgroundColor: "#014d88" }}
                            startIcon={<SaveIcon />}
                            disabled={saving}
                            onClick={() =>
                              handleSubmitAdherence(formik.values, {
                                reroute: false,
                                monthOfData: 3,
                              })
                            }
                          >
                            {!saving ? (
                              <span style={{ textTransform: "capitalize" }}>
                                Submit month 3
                              </span>
                            ) : (
                              <span style={{ textTransform: "capitalize" }}>
                                Submitting...
                              </span>
                            )}
                          </MatButton>
                        </div>
                      </div>
                    )}
                </div>
              )}

              {!formik?.values?.baselineViralLoadAtEnrollment ||
                (formik?.values?.baselineViralLoadAtEnrollment < 1000 && (
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
                        Modules activity/date of completion
                      </h5>

                      <>
                        <span
                          className="float-end"
                          style={{ cursor: "pointer" }}
                        >
                          <FaPlus />
                        </span>
                      </>
                    </div>

                    <div>
                      <div
                        style={{
                          backgroundColor: "#d8f6ff",
                          width: "95%",
                          margin: "auto",
                          marginTop: "5rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <p
                          style={{
                            color: "black",
                            fontSize: "15px",
                            fontWeight: "600",
                            marginLeft: "10px",
                            marginTop: "10px",
                          }}
                        >
                          Month 1
                        </p>
                        <IconButton
                          onClick={() =>
                            setIsDropdownsOpen((prevState) => {
                              return {
                                ...prevState,
                                monthOneModulesActivities:
                                  !prevState.monthOneModulesActivities,
                              };
                            })
                          }
                          aria-expanded={
                            isDropdownsOpen.monthOneModulesActivities
                          }
                          aria-label="Expand"
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                      </div>

                      <div className="card-body">
                        <Collapse
                          in={isDropdownsOpen.monthOneModulesActivities}
                        >
                          <div
                            className="basic-form"
                            style={{ padding: "0 50px 0 50px" }}
                          >
                            <div className="row">
                              <div className="form-group mb-3 col-md-6">
                                <CustomFormGroup
                                  formik={formik}
                                  name="maMonth1PositiveLivingChoice"
                                >
                                  <Label for="maMonth1PositiveLivingChoice">
                                    Positive Living
                                    <span style={{ color: "red" }}>
                                      {" "}
                                      *
                                    </span>{" "}
                                  </Label>
                                  <Input
                                  readOnly={isViewActionType}
                                    className="form-control"
                                    type="select"
                                    name="maMonth1PositiveLivingChoice"
                                    id="maMonth1PositiveLivingChoice"
                                    value={
                                      formik.values.maMonth1PositiveLivingChoice
                                    }
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{
                                      border: "1px solid #014D88",
                                      borderRadius: "0.2rem",
                                    }}
                                  >
                                    <option value="">Select</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                  </Input>
                                  {formik?.touched
                                    ?.maMonth1PositiveLivingChoice &&
                                  formik.errors.maMonth1PositiveLivingChoice !==
                                    "" ? (
                                    <span className={classes.error}>
                                      {
                                        formik.errors
                                          .maMonth1PositiveLivingChoice
                                      }
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </CustomFormGroup>
                              </div>
                              {formik.values.maMonth1PositiveLivingChoice ===
                                "yes" && (
                                <div className="form-group mb-3 col-md-6">
                                  <CustomFormGroup
                                    formik={formik}
                                    name="maMonth1PositiveLivingDate"
                                  >
                                    <Label for="maMonth1PositiveLivingDate">
                                      Date for positive living
                                      <span style={{ color: "red" }}>
                                        {" "}
                                        *
                                      </span>{" "}
                                    </Label>
                                    <Input
                                    readOnly={isViewActionType}
                                      className="form-control"
                                      type="date"
                                      {...{
                                        min: moment(
                                          new Date(
                                            props?.activeContent?.artCommence?.visitDate
                                          )
                                        ).format("YYYY-MM-DD"),
                                      }}
                                      {...{
                                        max: moment(new Date()).format(
                                          "YYYY-MM-DD"
                                        ),
                                      }}
                                      disabled={
                                        !props?.activeContent?.enrollment
                                          ?.dateOfRegistration
                                      }
                                      name="maMonth1PositiveLivingDate"
                                      id="maMonth1PositiveLivingDate"
                                      value={
                                        formik.values.maMonth1PositiveLivingDate
                                      }
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      style={{
                                        border: "1px solid #014D88",
                                        borderRadius: "0.2rem",
                                      }}
                                    />
                                    {formik?.touched
                                      ?.maMonth1PositiveLivingDate &&
                                    formik.errors.maMonth1PositiveLivingDate !==
                                      "" ? (
                                      <span className={classes.error}>
                                        {
                                          formik.errors
                                            .maMonth1PositiveLivingDate
                                        }
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </CustomFormGroup>
                                </div>
                              )}

                              <div className="form-group mb-3 col-md-6">
                                <CustomFormGroup
                                  formik={formik}
                                  name="maMonth1LiteracyTreatmentChoice"
                                >
                                  <Label for="maMonth1LiteracyTreatmentChoice">
                                    Literacy Treatment
                                    <span style={{ color: "red" }}>
                                      {" "}
                                      *
                                    </span>{" "}
                                  </Label>
                                  <Input
                                  readOnly={isViewActionType}
                                    className="form-control"
                                    type="select"
                                    name="maMonth1LiteracyTreatmentChoice"
                                    id="maMonth1LiteracyTreatmentChoice"
                                    value={
                                      formik.values
                                        .maMonth1LiteracyTreatmentChoice
                                    }
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{
                                      border: "1px solid #014D88",
                                      borderRadius: "0.2rem",
                                    }}
                                  >
                                    <option value="">Select</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                  </Input>
                                  {formik?.touched
                                    ?.maMonth1LiteracyTreatmentChoice &&
                                  formik.errors
                                    .maMonth1LiteracyTreatmentChoice !== "" ? (
                                    <span className={classes.error}>
                                      {
                                        formik.errors
                                          .maMonth1LiteracyTreatmentChoice
                                      }
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </CustomFormGroup>
                              </div>

                              {formik.values.maMonth1LiteracyTreatmentChoice ===
                                "yes" && (
                                <div className="form-group mb-3 col-md-6">
                                  <CustomFormGroup
                                    formik={formik}
                                    name="maMonth1LiteracyTreatmentDate"
                                  >
                                    <Label for="maMonth1LiteracyTreatmentDate">
                                      Date for literacy training
                                      <span style={{ color: "red" }}>
                                        {" "}
                                        *
                                      </span>{" "}
                                    </Label>
                                    <Input
                                    readOnly={isViewActionType}
                                      className="form-control"
                                      type="date"
                                      {...{
                                        min: moment(
                                          new Date(
                                            props?.activeContent?.artCommence?.visitDate
                                          )
                                        ).format("YYYY-MM-DD"),
                                      }}
                                      {...{
                                        max: moment(new Date()).format(
                                          "YYYY-MM-DD"
                                        ),
                                      }}
                                      disabled={
                                        !props?.activeContent?.enrollment
                                          ?.dateOfRegistration
                                      }
                                      name="maMonth1LiteracyTreatmentDate"
                                      id="maMonth1LiteracyTreatmentDate"
                                      value={
                                        formik.values
                                          .maMonth1LiteracyTreatmentDate
                                      }
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      style={{
                                        border: "1px solid #014D88",
                                        borderRadius: "0.2rem",
                                      }}
                                    />
                                    {formik?.touched
                                      ?.maMonth1LiteracyTreatmentDate &&
                                    formik.errors
                                      .maMonth1LiteracyTreatmentDate !== "" ? (
                                      <span className={classes.error}>
                                        {
                                          formik.errors
                                            .maMonth1LiteracyTreatmentDate
                                        }
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </CustomFormGroup>
                                </div>
                              )}

                              <div className="form-group mb-3 col-md-6">
                                <CustomFormGroup
                                  formik={formik}
                                  name="maMonth1AdolescentsParticipationChoice"
                                >
                                  <Label for="maMonth1AdolescentsParticipationChoice">
                                    Adolescents Participation
                                    <span style={{ color: "red" }}>
                                      {" "}
                                      *
                                    </span>{" "}
                                  </Label>
                                  <Input
                                  readOnly={isViewActionType}
                                    className="form-control"
                                    type="select"
                                    name="maMonth1AdolescentsParticipationChoice"
                                    id="maMonth1AdolescentsParticipationChoice"
                                    value={
                                      formik.values
                                        .maMonth1AdolescentsParticipationChoice
                                    }
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{
                                      border: "1px solid #014D88",
                                      borderRadius: "0.2rem",
                                    }}
                                  >
                                    <option value="">Select</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                  </Input>
                                  {formik?.touched
                                    ?.maMonth1AdolescentsParticipationChoice &&
                                  formik.errors
                                    .maMonth1AdolescentsParticipationChoice !==
                                    "" ? (
                                    <span className={classes.error}>
                                      {
                                        formik.errors
                                          .maMonth1AdolescentsParticipationChoice
                                      }
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </CustomFormGroup>
                              </div>

                              {formik.values
                                .maMonth1AdolescentsParticipationChoice ===
                                "yes" && (
                                <div className="form-group mb-3 col-md-6">
                                  <CustomFormGroup
                                    formik={formik}
                                    name="maMonth1AdolescentsParticipationDate"
                                  >
                                    <Label for="maMonth1AdolescentsParticipationDate">
                                      Date for adolescent participation
                                      <span style={{ color: "red" }}>
                                        {" "}
                                        *
                                      </span>{" "}
                                    </Label>
                                    <Input
                                    readOnly={isViewActionType}
                                      className="form-control"
                                      type="date"
                                      {...{
                                        min: moment(
                                          new Date(
                                            props?.activeContent?.artCommence?.visitDate
                                          )
                                        ).format("YYYY-MM-DD"),
                                      }}
                                      {...{
                                        max: moment(new Date()).format(
                                          "YYYY-MM-DD"
                                        ),
                                      }}
                                      disabled={
                                        !props?.activeContent?.enrollment
                                          ?.dateOfRegistration
                                      }
                                      name="maMonth1AdolescentsParticipationDate"
                                      id="maMonth1AdolescentsParticipationDate"
                                      value={
                                        formik.values
                                          .maMonth1AdolescentsParticipationDate
                                      }
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      style={{
                                        border: "1px solid #014D88",
                                        borderRadius: "0.2rem",
                                      }}
                                    />
                                    {formik?.touched
                                      ?.maMonth1AdolescentsParticipationDate &&
                                    formik.errors
                                      .maMonth1AdolescentsParticipationDate !==
                                      "" ? (
                                      <span className={classes.error}>
                                        {
                                          formik.errors
                                            .maMonth1AdolescentsParticipationDate
                                        }
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </CustomFormGroup>
                                </div>
                              )}

                              <div className="form-group mb-3 col-md-6">
                                <CustomFormGroup
                                  formik={formik}
                                  name="maMonth1leadershipTrainingChoice"
                                >
                                  <Label for="maMonth1leadershipTrainingChoice">
                                    Leadership participation
                                    <span style={{ color: "red" }}>
                                      {" "}
                                      *
                                    </span>{" "}
                                  </Label>
                                  <Input
                                  readOnly={isViewActionType}
                                    className="form-control"
                                    type="select"
                                    name="maMonth1leadershipTrainingChoice"
                                    id="maMonth1leadershipTrainingChoice"
                                    value={
                                      formik.values
                                        .maMonth1leadershipTrainingChoice
                                    }
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{
                                      border: "1px solid #014D88",
                                      borderRadius: "0.2rem",
                                    }}
                                  >
                                    <option value="">Select</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                  </Input>
                                  {formik?.touched
                                    ?.maMonth1leadershipTrainingChoice &&
                                  formik.errors
                                    .maMonth1leadershipTrainingChoice !== "" ? (
                                    <span className={classes.error}>
                                      {
                                        formik.errors
                                          .maMonth1leadershipTrainingChoice
                                      }
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </CustomFormGroup>
                              </div>

                              {formik.values
                                .maMonth1leadershipTrainingChoice === "yes" && (
                                <div className="form-group mb-3 col-md-6">
                                  <CustomFormGroup
                                    formik={formik}
                                    name="maMonth1leadershipTrainingDate"
                                  >
                                    <Label for="maMonth1leadershipTrainingDate">
                                      Date for Leadership participation
                                      <span style={{ color: "red" }}>
                                        {" "}
                                        *
                                      </span>{" "}
                                    </Label>
                                    <Input
                                    readOnly={isViewActionType}
                                      className="form-control"
                                      type="date"
                                      {...{
                                        min: moment(
                                          new Date(
                                            props?.activeContent?.artCommence?.visitDate
                                          )
                                        ).format("YYYY-MM-DD"),
                                      }}
                                      {...{
                                        max: moment(new Date()).format(
                                          "YYYY-MM-DD"
                                        ),
                                      }}
                                      disabled={
                                        !props?.activeContent?.enrollment
                                          ?.dateOfRegistration
                                      }
                                      name="maMonth1leadershipTrainingDate"
                                      id="maMonth1leadershipTrainingDate"
                                      value={
                                        formik.values
                                          .maMonth1leadershipTrainingDate
                                      }
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      style={{
                                        border: "1px solid #014D88",
                                        borderRadius: "0.2rem",
                                      }}
                                    />
                                    {formik?.touched
                                      ?.maMonth1leadershipTrainingDate &&
                                    formik.errors
                                      .maMonth1leadershipTrainingDate !== "" ? (
                                      <span className={classes.error}>
                                        {
                                          formik.errors
                                            .maMonth1leadershipTrainingDate
                                        }
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </CustomFormGroup>
                                </div>
                              )}

                              <div className="form-group mb-3 col-md-6">
                                <CustomFormGroup
                                  formik={formik}
                                  name="maMonth1PeerToPeerChoice"
                                >
                                  <Label for="maMonth1PeerToPeerChoice">
                                    Peer to Peer Mentorship
                                    <span style={{ color: "red" }}>
                                      {" "}
                                      *
                                    </span>{" "}
                                  </Label>
                                  <Input
                                  readOnly={isViewActionType}
                                    className="form-control"
                                    type="select"
                                    name="maMonth1PeerToPeerChoice"
                                    id="maMonth1PeerToPeerChoice"
                                    value={
                                      formik.values.maMonth1PeerToPeerChoice
                                    }
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{
                                      border: "1px solid #014D88",
                                      borderRadius: "0.2rem",
                                    }}
                                  >
                                    <option value="">Select</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                  </Input>
                                  {formik?.touched?.maMonth1PeerToPeerChoice &&
                                  formik.errors.maMonth1PeerToPeerChoice !==
                                    "" ? (
                                    <span className={classes.error}>
                                      {formik.errors.maMonth1PeerToPeerChoice}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </CustomFormGroup>
                              </div>

                              {formik.values.maMonth1PeerToPeerChoice ===
                                "yes" && (
                                <div className="form-group mb-3 col-md-6">
                                  <CustomFormGroup
                                    formik={formik}
                                    name="maMonth1PeerToPeerDate"
                                  >
                                    <Label for="maMonth1PeerToPeerDate">
                                      Date for peer to peer mentorship
                                      <span style={{ color: "red" }}>
                                        {" "}
                                        *
                                      </span>{" "}
                                    </Label>
                                    <Input
                                    readOnly={isViewActionType}
                                      className="form-control"
                                      type="date"
                                      {...{
                                        min: moment(
                                          new Date(
                                            props?.activeContent?.artCommence?.visitDate
                                          )
                                        ).format("YYYY-MM-DD"),
                                      }}
                                      {...{
                                        max: moment(new Date()).format(
                                          "YYYY-MM-DD"
                                        ),
                                      }}
                                      disabled={
                                        !props?.activeContent?.enrollment
                                          ?.dateOfRegistration
                                      }
                                      name="maMonth1PeerToPeerDate"
                                      id="maMonth1PeerToPeerDate"
                                      value={
                                        formik.values.maMonth1PeerToPeerDate
                                      }
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      style={{
                                        border: "1px solid #014D88",
                                        borderRadius: "0.2rem",
                                      }}
                                    />
                                    {formik?.touched?.maMonth1PeerToPeerDate &&
                                    formik.errors.maMonth1PeerToPeerDate !==
                                      "" ? (
                                      <span className={classes.error}>
                                        {formik.errors.maMonth1PeerToPeerDate}
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </CustomFormGroup>
                                </div>
                              )}

                              <div className="form-group mb-3 col-md-6">
                                <CustomFormGroup
                                  formik={formik}
                                  name="maMonth1RoleOfOtzChoice"
                                >
                                  <Label for="maMonth1RoleOfOtzChoice">
                                    Role of OTZ in 95-95-95
                                    <span style={{ color: "red" }}>
                                      {" "}
                                      *
                                    </span>{" "}
                                  </Label>
                                  <Input
                                  readOnly={isViewActionType}
                                    className="form-control"
                                    type="select"
                                    name="maMonth1RoleOfOtzChoice"
                                    id="maMonth1RoleOfOtzChoice"
                                    value={
                                      formik.values.maMonth1RoleOfOtzChoice
                                    }
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{
                                      border: "1px solid #014D88",
                                      borderRadius: "0.2rem",
                                    }}
                                  >
                                    <option value="">Select</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                  </Input>
                                  {formik?.touched?.maMonth1RoleOfOtzChoice &&
                                  formik.errors.maMonth1RoleOfOtzChoice !==
                                    "" ? (
                                    <span className={classes.error}>
                                      {formik.errors.maMonth1RoleOfOtzChoice}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </CustomFormGroup>
                              </div>

                              {formik.values.maMonth1RoleOfOtzChoice ===
                                "yes" && (
                                <div className="form-group mb-3 col-md-6">
                                  <CustomFormGroup
                                    formik={formik}
                                    name="maMonth1RoleOfOtzDate"
                                  >
                                    <Label for="maMonth1RoleOfOtzDate">
                                      Date for role of OTZ in 95-95-95
                                      <span style={{ color: "red" }}>
                                        {" "}
                                        *
                                      </span>{" "}
                                    </Label>
                                    <Input
                                    readOnly={isViewActionType}
                                      className="form-control"
                                      type="date"
                                      {...{
                                        min: moment(
                                          new Date(
                                            props?.activeContent?.artCommence?.visitDate
                                          )
                                        ).format("YYYY-MM-DD"),
                                      }}
                                      {...{
                                        max: moment(new Date()).format(
                                          "YYYY-MM-DD"
                                        ),
                                      }}
                                      disabled={
                                        !props?.activeContent?.enrollment
                                          ?.dateOfRegistration
                                      }
                                      name="maMonth1RoleOfOtzDate"
                                      id="maMonth1RoleOfOtzDate"
                                      value={
                                        formik.values.maMonth1RoleOfOtzDate
                                      }
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      style={{
                                        border: "1px solid #014D88",
                                        borderRadius: "0.2rem",
                                      }}
                                    />
                                    {formik?.touched?.maMonth1RoleOfOtzDate &&
                                    formik.errors.maMonth1RoleOfOtzDate !==
                                      "" ? (
                                      <span className={classes.error}>
                                        {formik.errors.maMonth1RoleOfOtzDate}
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </CustomFormGroup>
                                </div>
                              )}

                              <div className="form-group mb-3 col-md-6">
                                <CustomFormGroup
                                  formik={formik}
                                  name="maMonth1OtzChampionOrientationChoice"
                                >
                                  <Label for="maMonth1OtzChampionOrientationChoice">
                                    OTZ champion orientation
                                    <span style={{ color: "red" }}>
                                      {" "}
                                      *
                                    </span>{" "}
                                  </Label>
                                  <Input
                                  readOnly={isViewActionType}
                                    className="form-control"
                                    type="select"
                                    name="maMonth1OtzChampionOrientationChoice"
                                    id="maMonth1OtzChampionOrientationChoice"
                                    value={
                                      formik.values
                                        .maMonth1OtzChampionOrientationChoice
                                    }
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{
                                      border: "1px solid #014D88",
                                      borderRadius: "0.2rem",
                                    }}
                                  >
                                    <option value="">Select</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                  </Input>
                                  {formik?.touched
                                    ?.maMonth1OtzChampionOrientationChoice &&
                                  formik.errors
                                    .maMonth1OtzChampionOrientationChoice !==
                                    "" ? (
                                    <span className={classes.error}>
                                      {
                                        formik.errors
                                          .maMonth1OtzChampionOrientationChoice
                                      }
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </CustomFormGroup>
                              </div>

                              {formik.values
                                .maMonth1OtzChampionOrientationChoice ===
                                "yes" && (
                                <div className="form-group mb-3 col-md-6">
                                  <CustomFormGroup
                                    formik={formik}
                                    name="maMonth1OtzChampionOrientationDate"
                                  >
                                    <Label for="maMonth1OtzChampionOrientationDate">
                                      Date for OTZ Champion Orientation
                                      <span style={{ color: "red" }}>
                                        {" "}
                                        *
                                      </span>{" "}
                                    </Label>
                                    <Input
                                    readOnly={isViewActionType}
                                      className="form-control"
                                      type="date"
                                      {...{
                                        min: moment(
                                          new Date(
                                            props?.activeContent?.artCommence?.visitDate
                                          )
                                        ).format("YYYY-MM-DD"),
                                      }}
                                      {...{
                                        max: moment(new Date()).format(
                                          "YYYY-MM-DD"
                                        ),
                                      }}
                                      disabled={
                                        !props?.activeContent?.enrollment
                                          ?.dateOfRegistration
                                      }
                                      name="maMonth1OtzChampionOrientationDate"
                                      id="maMonth1OtzChampionOrientationDate"
                                      value={
                                        formik.values
                                          .maMonth1OtzChampionOrientationDate
                                      }
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      style={{
                                        border: "1px solid #014D88",
                                        borderRadius: "0.2rem",
                                      }}
                                    />
                                    {formik?.touched
                                      ?.maMonth1OtzChampionOrientationDate &&
                                    formik.errors
                                      .maMonth1OtzChampionOrientationDate !==
                                      "" ? (
                                      <span className={classes.error}>
                                        {
                                          formik.errors
                                            .maMonth1OtzChampionOrientationDate
                                        }
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </CustomFormGroup>
                                </div>
                              )}
                            </div>
                          </div>
                        </Collapse>
                      </div>
                    </div>

                    {formik?.values &&
                    formik.values.maMonth1PositiveLivingDate &&
                    formik.values.maMonth1PositiveLivingChoice &&
                    formik.values.maMonth1LiteracyTreatmentDate &&
                    formik.values.maMonth1LiteracyTreatmentChoice &&
                    formik.values.maMonth1AdolescentsParticipationDate &&
                    formik.values.maMonth1AdolescentsParticipationChoice &&
                    formik.values.maMonth1leadershipTrainingDate &&
                    formik.values.maMonth1leadershipTrainingChoice &&
                    formik.values.maMonth1PeerToPeerDate &&
                    formik.values.maMonth1PeerToPeerChoice &&
                    formik.values.maMonth1RoleOfOtzDate &&
                    formik.values.maMonth1RoleOfOtzChoice &&
                    formik.values.maMonth1OtzChampionOrientationDate &&
                    formik.values.maMonth1OtzChampionOrientationChoice ? (
                      <div>
                        <div
                          style={{
                            backgroundColor: "#d8f6ff",
                            width: "95%",
                            margin: "auto",
                            marginTop: "5rem",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <p
                            style={{
                              color: "black",
                              fontSize: "15px",
                              fontWeight: "600",
                              marginLeft: "10px",
                              marginTop: "10px",
                            }}
                          >
                            Month 2
                          </p>
                          <IconButton
                            onClick={() =>
                              setIsDropdownsOpen((prevState) => {
                                return {
                                  ...prevState,
                                  monthTwoModulesActivities:
                                    !prevState.monthTwoModulesActivities,
                                };
                              })
                            }
                            aria-expanded={
                              isDropdownsOpen.monthTwoModulesActivities
                            }
                            aria-label="Expand"
                          >
                            <ExpandMoreIcon />
                          </IconButton>
                        </div>

                        <div className="card-body">
                          <Collapse
                            in={isDropdownsOpen.monthTwoModulesActivities}
                          >
                            <div
                              className="basic-form"
                              style={{ padding: "0 50px 0 50px" }}
                            >
                              <div className="row">
                                <div className="form-group mb-3 col-md-6">
                                  <CustomFormGroup
                                    formik={formik}
                                    name="maMonth2PositiveLivingChoice"
                                  >
                                    <Label for="maMonth2PositiveLivingChoice">
                                      Positive Living
                                      <span style={{ color: "red" }}>
                                        {" "}
                                        *
                                      </span>{" "}
                                    </Label>
                                    <Input
                                    readOnly={isViewActionType}
                                      className="form-control"
                                      type="select"
                                      name="maMonth2PositiveLivingChoice"
                                      id="maMonth2PositiveLivingChoice"
                                      value={
                                        formik.values
                                          .maMonth2PositiveLivingChoice
                                      }
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      style={{
                                        border: "1px solid #014D88",
                                        borderRadius: "0.2rem",
                                      }}
                                    >
                                      <option value="">Select</option>
                                      <option value="yes">Yes</option>
                                      <option value="no">No</option>
                                    </Input>
                                    {formik?.touched
                                      ?.maMonth2PositiveLivingChoice &&
                                    formik.errors
                                      .maMonth2PositiveLivingChoice ? (
                                      <span className={classes.error}>
                                        {
                                          formik.errors
                                            .maMonth2PositiveLivingChoice
                                        }
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </CustomFormGroup>
                                </div>
                                {formik.values.maMonth2PositiveLivingChoice ===
                                  "yes" && (
                                  <div className="form-group mb-3 col-md-6">
                                    <CustomFormGroup
                                      formik={formik}
                                      name="maMonth2PositiveLivingDate"
                                    >
                                      <Label for="maMonth2PositiveLivingDate">
                                        Date for positive living
                                        <span style={{ color: "red" }}>
                                          {" "}
                                          *
                                        </span>{" "}
                                      </Label>
                                      <Input
                                      readOnly={isViewActionType}
                                        className="form-control"
                                        type="date"
                                        {...{
                                          min: moment(
                                            new Date(
                                              props?.activeContent?.artCommence?.visitDate
                                            )
                                          ).format("YYYY-MM-DD"),
                                        }}
                                        {...{
                                          max: moment(new Date()).format(
                                            "YYYY-MM-DD"
                                          ),
                                        }}
                                        disabled={
                                          !props?.activeContent?.enrollment
                                            ?.dateOfRegistration
                                        }
                                        name="maMonth2PositiveLivingDate"
                                        id="maMonth2PositiveLivingDate"
                                        value={
                                          formik.values
                                            .maMonth2PositiveLivingDate
                                        }
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        style={{
                                          border: "1px solid #014D88",
                                          borderRadius: "0.2rem",
                                        }}
                                      />
                                      {formik?.touched
                                        ?.maMonth2PositiveLivingDate &&
                                      formik.errors
                                        .maMonth2PositiveLivingDate !== "" ? (
                                        <span className={classes.error}>
                                          {
                                            formik.errors
                                              .maMonth2PositiveLivingDate
                                          }
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </CustomFormGroup>
                                  </div>
                                )}

                                <div className="form-group mb-3 col-md-6">
                                  <CustomFormGroup
                                    formik={formik}
                                    name="maMonth2LiteracyTreatmentChoice"
                                  >
                                    <Label for="maMonth2LiteracyTreatmentChoice">
                                      Literacy Treatment
                                      <span style={{ color: "red" }}>
                                        {" "}
                                        *
                                      </span>{" "}
                                    </Label>
                                    <Input
                                    readOnly={isViewActionType}
                                      className="form-control"
                                      type="select"
                                      name="maMonth2LiteracyTreatmentChoice"
                                      id="maMonth2LiteracyTreatmentChoice"
                                      value={
                                        formik.values
                                          .maMonth2LiteracyTreatmentChoice
                                      }
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      style={{
                                        border: "1px solid #014D88",
                                        borderRadius: "0.2rem",
                                      }}
                                    >
                                      <option value="">Select</option>
                                      <option value="yes">Yes</option>
                                      <option value="no">No</option>
                                    </Input>
                                    {formik?.touched
                                      ?.maMonth2LiteracyTreatmentChoice &&
                                    formik.errors
                                      .maMonth2LiteracyTreatmentChoice !==
                                      "" ? (
                                      <span className={classes.error}>
                                        {
                                          formik.errors
                                            .maMonth2LiteracyTreatmentChoice
                                        }
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </CustomFormGroup>
                                </div>

                                {formik.values
                                  .maMonth2LiteracyTreatmentChoice ===
                                  "yes" && (
                                  <div className="form-group mb-3 col-md-6">
                                    <CustomFormGroup
                                      formik={formik}
                                      name="maMonth2LiteracyTreatmentDate"
                                    >
                                      <Label for="maMonth2LiteracyTreatmentDate">
                                        Date for literacy training
                                        <span style={{ color: "red" }}>
                                          {" "}
                                          *
                                        </span>{" "}
                                      </Label>
                                      <Input
                                      readOnly={isViewActionType}
                                        className="form-control"
                                        type="date"
                                        {...{
                                          min: moment(
                                            new Date(
                                              props?.activeContent?.artCommence?.visitDate
                                            )
                                          ).format("YYYY-MM-DD"),
                                        }}
                                        {...{
                                          max: moment(new Date()).format(
                                            "YYYY-MM-DD"
                                          ),
                                        }}
                                        disabled={
                                          !props?.activeContent?.enrollment
                                            ?.dateOfRegistration
                                        }
                                        name="maMonth2LiteracyTreatmentDate"
                                        id="maMonth2LiteracyTreatmentDate"
                                        value={
                                          formik.values
                                            .maMonth2LiteracyTreatmentDate
                                        }
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        style={{
                                          border: "1px solid #014D88",
                                          borderRadius: "0.2rem",
                                        }}
                                      />
                                      {formik?.touched
                                        ?.maMonth2LiteracyTreatmentDate &&
                                      formik.errors
                                        .maMonth2LiteracyTreatmentDate !==
                                        "" ? (
                                        <span className={classes.error}>
                                          {
                                            formik.errors
                                              .maMonth2LiteracyTreatmentDate
                                          }
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </CustomFormGroup>
                                  </div>
                                )}

                                <div className="form-group mb-3 col-md-6">
                                  <CustomFormGroup
                                    formik={formik}
                                    name="maMonth2AdolescentsParticipationChoice"
                                  >
                                    <Label for="maMonth2AdolescentsParticipationChoice">
                                      Adolescents Participation
                                      <span style={{ color: "red" }}>
                                        {" "}
                                        *
                                      </span>{" "}
                                    </Label>
                                    <Input
                                    readOnly={isViewActionType}
                                      className="form-control"
                                      type="select"
                                      name="maMonth2AdolescentsParticipationChoice"
                                      id="maMonth2AdolescentsParticipationChoice"
                                      value={
                                        formik.values
                                          .maMonth2AdolescentsParticipationChoice
                                      }
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      style={{
                                        border: "1px solid #014D88",
                                        borderRadius: "0.2rem",
                                      }}
                                    >
                                      <option value="">Select</option>
                                      <option value="yes">Yes</option>
                                      <option value="no">No</option>
                                    </Input>
                                    {formik?.touched
                                      ?.maMonth2AdolescentsParticipationChoice &&
                                    formik.errors
                                      .maMonth2AdolescentsParticipationChoice !==
                                      "" ? (
                                      <span className={classes.error}>
                                        {
                                          formik.errors
                                            .maMonth2AdolescentsParticipationChoice
                                        }
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </CustomFormGroup>
                                </div>

                                {formik.values
                                  .maMonth2AdolescentsParticipationChoice ===
                                  "yes" && (
                                  <div className="form-group mb-3 col-md-6">
                                    <CustomFormGroup
                                      formik={formik}
                                      name="maMonth2AdolescentsParticipationDate"
                                    >
                                      <Label for="maMonth2AdolescentsParticipationDate">
                                        Date for adolescent participation
                                        <span style={{ color: "red" }}>
                                          {" "}
                                          *
                                        </span>{" "}
                                      </Label>
                                      <Input
                                      readOnly={isViewActionType}
                                        className="form-control"
                                        type="date"
                                        {...{
                                          min: moment(
                                            new Date(
                                              props?.activeContent?.artCommence?.visitDate
                                            )
                                          ).format("YYYY-MM-DD"),
                                        }}
                                        {...{
                                          max: moment(new Date()).format(
                                            "YYYY-MM-DD"
                                          ),
                                        }}
                                        disabled={
                                          !props?.activeContent?.enrollment
                                            ?.dateOfRegistration
                                        }
                                        name="maMonth2AdolescentsParticipationDate"
                                        id="maMonth2AdolescentsParticipationDate"
                                        value={
                                          formik.values
                                            .maMonth2AdolescentsParticipationDate
                                        }
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        style={{
                                          border: "1px solid #014D88",
                                          borderRadius: "0.2rem",
                                        }}
                                      />
                                      {formik?.touched
                                        ?.maMonth2AdolescentsParticipationDate &&
                                      formik.errors
                                        .maMonth2AdolescentsParticipationDate !==
                                        "" ? (
                                        <span className={classes.error}>
                                          {
                                            formik.errors
                                              .maMonth2AdolescentsParticipationDate
                                          }
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </CustomFormGroup>
                                  </div>
                                )}

                                <div className="form-group mb-3 col-md-6">
                                  <CustomFormGroup
                                    formik={formik}
                                    name="maMonth2leadershipTrainingChoice"
                                  >
                                    <Label for="maMonth2leadershipTrainingChoice">
                                      Leadership participation
                                      <span style={{ color: "red" }}>
                                        {" "}
                                        *
                                      </span>{" "}
                                    </Label>
                                    <Input
                                    readOnly={isViewActionType}
                                      className="form-control"
                                      type="select"
                                      name="maMonth2leadershipTrainingChoice"
                                      id="maMonth2leadershipTrainingChoice"
                                      value={
                                        formik.values
                                          .maMonth2leadershipTrainingChoice
                                      }
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      style={{
                                        border: "1px solid #014D88",
                                        borderRadius: "0.2rem",
                                      }}
                                    >
                                      <option value="">Select</option>
                                      <option value="yes">Yes</option>
                                      <option value="no">No</option>
                                    </Input>
                                    {formik?.touched
                                      ?.maMonth2leadershipTrainingChoice &&
                                    formik.errors
                                      .maMonth2leadershipTrainingChoice !==
                                      "" ? (
                                      <span className={classes.error}>
                                        {
                                          formik.errors
                                            .maMonth2leadershipTrainingChoice
                                        }
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </CustomFormGroup>
                                </div>

                                {formik.values
                                  .maMonth2leadershipTrainingChoice ===
                                  "yes" && (
                                  <div className="form-group mb-3 col-md-6">
                                    <CustomFormGroup
                                      formik={formik}
                                      name="maMonth2leadershipTrainingDate"
                                    >
                                      <Label for="maMonth2leadershipTrainingDate">
                                        Date for Leadership participation
                                        <span style={{ color: "red" }}>
                                          {" "}
                                          *
                                        </span>{" "}
                                      </Label>
                                      <Input
                                      readOnly={isViewActionType}
                                        className="form-control"
                                        type="date"
                                        {...{
                                          min: moment(
                                            new Date(
                                              props?.activeContent?.artCommence?.visitDate
                                            )
                                          ).format("YYYY-MM-DD"),
                                        }}
                                        {...{
                                          max: moment(new Date()).format(
                                            "YYYY-MM-DD"
                                          ),
                                        }}
                                        disabled={
                                          !props?.activeContent?.enrollment
                                            ?.dateOfRegistration
                                        }
                                        name="maMonth2leadershipTrainingDate"
                                        id="maMonth2leadershipTrainingDate"
                                        value={
                                          formik.values
                                            .maMonth2leadershipTrainingDate
                                        }
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        style={{
                                          border: "1px solid #014D88",
                                          borderRadius: "0.2rem",
                                        }}
                                      />
                                      {formik?.touched
                                        ?.maMonth2leadershipTrainingDate &&
                                      formik.errors
                                        .maMonth2leadershipTrainingDate !==
                                        "" ? (
                                        <span className={classes.error}>
                                          {
                                            formik.errors
                                              .maMonth2leadershipTrainingDate
                                          }
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </CustomFormGroup>
                                  </div>
                                )}

                                <div className="form-group mb-3 col-md-6">
                                  <CustomFormGroup
                                    formik={formik}
                                    name="maMonth2PeerToPeerChoice"
                                  >
                                    <Label for="maMonth2PeerToPeerChoice">
                                      Peer to Peer Mentorship
                                      <span style={{ color: "red" }}>
                                        {" "}
                                        *
                                      </span>{" "}
                                    </Label>
                                    <Input
                                    readOnly={isViewActionType}
                                      className="form-control"
                                      type="select"
                                      name="maMonth2PeerToPeerChoice"
                                      id="maMonth2PeerToPeerChoice"
                                      value={
                                        formik.values.maMonth2PeerToPeerChoice
                                      }
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      style={{
                                        border: "1px solid #014D88",
                                        borderRadius: "0.2rem",
                                      }}
                                    >
                                      <option value="">Select</option>
                                      <option value="yes">Yes</option>
                                      <option value="no">No</option>
                                    </Input>
                                    {formik?.touched
                                      ?.maMonth2PeerToPeerChoice &&
                                    formik.errors.maMonth2PeerToPeerChoice !==
                                      "" ? (
                                      <span className={classes.error}>
                                        {formik.errors.maMonth2PeerToPeerChoice}
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </CustomFormGroup>
                                </div>

                                {formik.values.maMonth2PeerToPeerChoice ===
                                  "yes" && (
                                  <div className="form-group mb-3 col-md-6">
                                    <CustomFormGroup
                                      formik={formik}
                                      name="maMonth2PeerToPeerDate"
                                    >
                                      <Label for="maMonth2PeerToPeerDate">
                                        Date for peer to peer mentorship
                                        <span style={{ color: "red" }}>
                                          {" "}
                                          *
                                        </span>{" "}
                                      </Label>
                                      <Input
                                      readOnly={isViewActionType}
                                        className="form-control"
                                        type="date"
                                        {...{
                                          min: moment(
                                            new Date(
                                              props?.activeContent?.artCommence?.visitDate
                                            )
                                          ).format("YYYY-MM-DD"),
                                        }}
                                        {...{
                                          max: moment(new Date()).format(
                                            "YYYY-MM-DD"
                                          ),
                                        }}
                                        disabled={
                                          !props?.activeContent?.enrollment
                                            ?.dateOfRegistration
                                        }
                                        name="maMonth2PeerToPeerDate"
                                        id="maMonth2PeerToPeerDate"
                                        value={
                                          formik.values.maMonth2PeerToPeerDate
                                        }
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        style={{
                                          border: "1px solid #014D88",
                                          borderRadius: "0.2rem",
                                        }}
                                      />
                                      {formik?.touched
                                        ?.maMonth2PeerToPeerDate &&
                                      formik.errors.maMonth2PeerToPeerDate !==
                                        "" ? (
                                        <span className={classes.error}>
                                          {formik.errors.maMonth2PeerToPeerDate}
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </CustomFormGroup>
                                  </div>
                                )}

                                <div className="form-group mb-3 col-md-6">
                                  <CustomFormGroup
                                    formik={formik}
                                    name="maMonth2RoleOfOtzChoice"
                                  >
                                    <Label for="maMonth2RoleOfOtzChoice">
                                      Role of OTZ in 95-95-95
                                      <span style={{ color: "red" }}>
                                        {" "}
                                        *
                                      </span>{" "}
                                    </Label>
                                    <Input
                                    readOnly={isViewActionType}
                                      className="form-control"
                                      type="select"
                                      name="maMonth2RoleOfOtzChoice"
                                      id="maMonth2RoleOfOtzChoice"
                                      value={
                                        formik.values.maMonth2RoleOfOtzChoice
                                      }
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      style={{
                                        border: "1px solid #014D88",
                                        borderRadius: "0.2rem",
                                      }}
                                    >
                                      <option value="">Select</option>
                                      <option value="yes">Yes</option>
                                      <option value="no">No</option>
                                    </Input>
                                    {formik?.touched?.maMonth2RoleOfOtzChoice &&
                                    formik.errors.maMonth2RoleOfOtzChoice !==
                                      "" ? (
                                      <span className={classes.error}>
                                        {formik.errors.maMonth2RoleOfOtzChoice}
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </CustomFormGroup>
                                </div>

                                {formik.values.maMonth2RoleOfOtzChoice ===
                                  "yes" && (
                                  <div className="form-group mb-3 col-md-6">
                                    <CustomFormGroup
                                      formik={formik}
                                      name="maMonth2RoleOfOtzDate"
                                    >
                                      <Label for="maMonth2RoleOfOtzDate">
                                        Date for role of OTZ in 95-95-95
                                        <span style={{ color: "red" }}>
                                          {" "}
                                          *
                                        </span>{" "}
                                      </Label>
                                      <Input
                                      readOnly={isViewActionType}
                                        className="form-control"
                                        type="date"
                                        {...{
                                          min: moment(
                                            new Date(
                                              props?.activeContent?.artCommence?.visitDate
                                            )
                                          ).format("YYYY-MM-DD"),
                                        }}
                                        {...{
                                          max: moment(new Date()).format(
                                            "YYYY-MM-DD"
                                          ),
                                        }}
                                        disabled={
                                          !props?.activeContent?.enrollment
                                            ?.dateOfRegistration
                                        }
                                        name="maMonth2RoleOfOtzDate"
                                        id="maMonth2RoleOfOtzDate"
                                        value={
                                          formik.values.maMonth2RoleOfOtzDate
                                        }
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        style={{
                                          border: "1px solid #014D88",
                                          borderRadius: "0.2rem",
                                        }}
                                      />
                                      {formik?.touched?.maMonth2RoleOfOtzDate &&
                                      formik.errors.maMonth2RoleOfOtzDate !==
                                        "" ? (
                                        <span className={classes.error}>
                                          {formik.errors.maMonth2RoleOfOtzDate}
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </CustomFormGroup>
                                  </div>
                                )}

                                <div className="form-group mb-3 col-md-6">
                                  <CustomFormGroup
                                    formik={formik}
                                    name="maMonth2OtzChampionOrientationChoice"
                                  >
                                    <Label for="maMonth2OtzChampionOrientationChoice">
                                      OTZ champion orientation
                                      <span style={{ color: "red" }}>
                                        {" "}
                                        *
                                      </span>{" "}
                                    </Label>
                                    <Input
                                    readOnly={isViewActionType}
                                      className="form-control"
                                      type="select"
                                      name="maMonth2OtzChampionOrientationChoice"
                                      id="maMonth2OtzChampionOrientationChoice"
                                      value={
                                        formik.values
                                          .maMonth2OtzChampionOrientationChoice
                                      }
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      style={{
                                        border: "1px solid #014D88",
                                        borderRadius: "0.2rem",
                                      }}
                                    >
                                      <option value="">Select</option>
                                      <option value="yes">Yes</option>
                                      <option value="no">No</option>
                                    </Input>
                                    {formik?.touched
                                      ?.maMonth2OtzChampionOrientationChoice &&
                                    formik.errors
                                      .maMonth2OtzChampionOrientationChoice !==
                                      "" ? (
                                      <span className={classes.error}>
                                        {
                                          formik.errors
                                            .maMonth2OtzChampionOrientationChoice
                                        }
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </CustomFormGroup>
                                </div>

                                {formik.values
                                  .maMonth2OtzChampionOrientationChoice ===
                                  "yes" && (
                                  <div className="form-group mb-3 col-md-6">
                                    <CustomFormGroup
                                      formik={formik}
                                      name="maMonth2OtzChampionOrientationDate"
                                    >
                                      <Label for="maMonth2OtzChampionOrientationDate">
                                        Date for OTZ Champion Orientation
                                        <span style={{ color: "red" }}>
                                          {" "}
                                          *
                                        </span>{" "}
                                      </Label>
                                      <Input
                                      readOnly={isViewActionType}
                                        className="form-control"
                                        type="date"
                                        {...{
                                          min: moment(
                                            new Date(
                                              props?.activeContent?.artCommence?.visitDate
                                            )
                                          ).format("YYYY-MM-DD"),
                                        }}
                                        {...{
                                          max: moment(new Date()).format(
                                            "YYYY-MM-DD"
                                          ),
                                        }}
                                        disabled={
                                          !props?.activeContent?.enrollment
                                            ?.dateOfRegistration
                                        }
                                        name="maMonth2OtzChampionOrientationDate"
                                        id="maMonth2OtzChampionOrientationDate"
                                        value={
                                          formik.values
                                            .maMonth2OtzChampionOrientationDate
                                        }
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        style={{
                                          border: "1px solid #014D88",
                                          borderRadius: "0.2rem",
                                        }}
                                      />
                                      {formik?.touched
                                        ?.maMonth2OtzChampionOrientationDate &&
                                      formik.errors
                                        .maMonth2OtzChampionOrientationDate !==
                                        "" ? (
                                        <span className={classes.error}>
                                          {
                                            formik.errors
                                              .maMonth2OtzChampionOrientationDate
                                          }
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </CustomFormGroup>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Collapse>
                        </div>
                      </div>
                    ) : null}

                    {formik?.values?.maMonth2PositiveLivingChoice &&
                      formik?.values?.maMonth2PositiveLivingDate &&
                      formik?.values?.maMonth2LiteracyTreatmentChoice &&
                      formik?.values?.maMonth2LiteracyTreatmentDate &&
                      formik?.values?.maMonth2AdolescentsParticipationChoice &&
                      formik?.values?.maMonth2AdolescentsParticipationDate &&
                      formik?.values?.maMonth2leadershipTrainingChoice &&
                      formik?.values?.maMonth2leadershipTrainingDate &&
                      formik?.values?.maMonth2PeerToPeerChoice &&
                      formik?.values?.maMonth2PeerToPeerDate &&
                      formik?.values?.maMonth2RoleOfOtzChoice &&
                      formik?.values?.maMonth2RoleOfOtzDate &&
                      formik?.values?.maMonth2OtzChampionOrientationChoice &&
                      formik?.values?.maMonth2OtzChampionOrientationDate && (
                        <div>
                          <div
                            style={{
                              backgroundColor: "#d8f6ff",
                              width: "95%",
                              margin: "auto",
                              marginTop: "5rem",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <p
                              style={{
                                color: "black",
                                fontSize: "15px",
                                fontWeight: "600",
                                marginLeft: "10px",
                                marginTop: "10px",
                              }}
                            >
                              Month 3
                            </p>
                            <IconButton
                              onClick={() =>
                                setIsDropdownsOpen((prevState) => {
                                  return {
                                    ...prevState,
                                    monthThreeModulesActivities:
                                      !prevState.monthThreeModulesActivities,
                                  };
                                })
                              }
                              aria-expanded={
                                isDropdownsOpen.monthThreeModulesActivities
                              }
                              aria-label="Expand"
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </div>

                          <div className="card-body">
                            <Collapse
                              in={isDropdownsOpen.monthThreeModulesActivities}
                            >
                              <div
                                className="basic-form"
                                style={{ padding: "0 50px 0 50px" }}
                              >
                                <div className="row">
                                  <div className="form-group mb-3 col-md-6">
                                    <CustomFormGroup
                                      formik={formik}
                                      name="maMonth3PositiveLivingChoice"
                                    >
                                      <Label for="maMonth3PositiveLivingChoice">
                                        Positive Living
                                        <span style={{ color: "red" }}>
                                          {" "}
                                          *
                                        </span>{" "}
                                      </Label>
                                      <Input
                                      readOnly={isViewActionType}
                                        className="form-control"
                                        type="select"
                                        name="maMonth3PositiveLivingChoice"
                                        id="maMonth3PositiveLivingChoice"
                                        value={
                                          formik.values
                                            .maMonth3PositiveLivingChoice
                                        }
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        style={{
                                          border: "1px solid #014D88",
                                          borderRadius: "0.2rem",
                                        }}
                                      >
                                        <option value="">Select</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                      </Input>
                                      {formik?.touched
                                        ?.maMonth3PositiveLivingChoice &&
                                      formik.errors
                                        .maMonth3PositiveLivingChoice !== "" ? (
                                        <span className={classes.error}>
                                          {
                                            formik.errors
                                              .maMonth3PositiveLivingChoice
                                          }
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </CustomFormGroup>
                                  </div>
                                  {formik?.values
                                    ?.maMonth3PositiveLivingChoice ===
                                    "yes" && (
                                    <div className="form-group mb-3 col-md-6">
                                      <CustomFormGroup
                                        formik={formik}
                                        name="maMonth3PositiveLivingDate"
                                      >
                                        <Label for="maMonth3PositiveLivingDate">
                                          Date for positive living
                                          <span style={{ color: "red" }}>
                                            {" "}
                                            *
                                          </span>{" "}
                                        </Label>
                                        <Input
                                        readOnly={isViewActionType}
                                          className="form-control"
                                          type="date"
                                          {...{
                                            min: moment(
                                              new Date(
                                                props?.activeContent?.artCommence?.visitDate
                                              )
                                            ).format("YYYY-MM-DD"),
                                          }}
                                          {...{
                                            max: moment(new Date()).format(
                                              "YYYY-MM-DD"
                                            ),
                                          }}
                                          disabled={
                                            !props?.activeContent?.enrollment
                                              ?.dateOfRegistration
                                          }
                                          name="maMonth3PositiveLivingDate"
                                          id="maMonth3PositiveLivingDate"
                                          value={
                                            formik.values
                                              .maMonth3PositiveLivingDate
                                          }
                                          onChange={formik.handleChange}
                                          onBlur={formik.handleBlur}
                                          style={{
                                            border: "1px solid #014D88",
                                            borderRadius: "0.2rem",
                                          }}
                                        />
                                        {formik?.touched
                                          ?.maMonth3PositiveLivingDate &&
                                        formik.errors
                                          .maMonth3PositiveLivingDate !== "" ? (
                                          <span className={classes.error}>
                                            {
                                              formik.errors
                                                .maMonth3PositiveLivingDate
                                            }
                                          </span>
                                        ) : (
                                          ""
                                        )}
                                      </CustomFormGroup>
                                    </div>
                                  )}

                                  <div className="form-group mb-3 col-md-6">
                                    <CustomFormGroup
                                      formik={formik}
                                      name="maMonth3LiteracyTreatmentChoice"
                                    >
                                      <Label for="maMonth3LiteracyTreatmentChoice">
                                        Literacy Treatment
                                        <span style={{ color: "red" }}>
                                          {" "}
                                          *
                                        </span>{" "}
                                      </Label>
                                      <Input
                                      readOnly={isViewActionType}
                                        className="form-control"
                                        type="select"
                                        name="maMonth3LiteracyTreatmentChoice"
                                        id="maMonth3LiteracyTreatmentChoice"
                                        value={
                                          formik.values
                                            .maMonth3LiteracyTreatmentChoice
                                        }
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        style={{
                                          border: "1px solid #014D88",
                                          borderRadius: "0.2rem",
                                        }}
                                      >
                                        <option value="">Select</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                      </Input>
                                      {formik?.touched
                                        ?.maMonth3LiteracyTreatmentChoice &&
                                      formik.errors
                                        .maMonth3LiteracyTreatmentChoice !==
                                        "" ? (
                                        <span className={classes.error}>
                                          {
                                            formik.errors
                                              .maMonth3LiteracyTreatmentChoice
                                          }
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </CustomFormGroup>
                                  </div>

                                  {formik.values
                                    .maMonth3LiteracyTreatmentChoice ===
                                    "yes" && (
                                    <div className="form-group mb-3 col-md-6">
                                      <CustomFormGroup
                                        formik={formik}
                                        name="maMonth3LiteracyTreatmentDate"
                                      >
                                        <Label for="maMonth3LiteracyTreatmentDate">
                                          Date for literacy training
                                          <span style={{ color: "red" }}>
                                            {" "}
                                            *
                                          </span>{" "}
                                        </Label>
                                        <Input
                                        readOnly={isViewActionType}
                                          className="form-control"
                                          type="date"
                                          {...{
                                            min: moment(
                                              new Date(
                                                props?.activeContent?.artCommence?.visitDate
                                              )
                                            ).format("YYYY-MM-DD"),
                                          }}
                                          {...{
                                            max: moment(new Date()).format(
                                              "YYYY-MM-DD"
                                            ),
                                          }}
                                          disabled={
                                            !props?.activeContent?.enrollment
                                              ?.dateOfRegistration
                                          }
                                          name="maMonth3LiteracyTreatmentDate"
                                          id="maMonth3LiteracyTreatmentDate"
                                          value={
                                            formik.values
                                              .maMonth3LiteracyTreatmentDate
                                          }
                                          onChange={formik.handleChange}
                                          onBlur={formik.handleBlur}
                                          style={{
                                            border: "1px solid #014D88",
                                            borderRadius: "0.2rem",
                                          }}
                                        />
                                        {formik?.touched
                                          ?.maMonth3LiteracyTreatmentDate &&
                                        formik.errors
                                          .maMonth3LiteracyTreatmentDate !==
                                          "" ? (
                                          <span className={classes.error}>
                                            {
                                              formik.errors
                                                .maMonth3LiteracyTreatmentDate
                                            }
                                          </span>
                                        ) : (
                                          ""
                                        )}
                                      </CustomFormGroup>
                                    </div>
                                  )}

                                  <div className="form-group mb-3 col-md-6">
                                    <CustomFormGroup
                                      formik={formik}
                                      name="maMonth3AdolescentsParticipationChoice"
                                    >
                                      <Label for="maMonth3AdolescentsParticipationChoice">
                                        Adolescents Participation
                                        <span style={{ color: "red" }}>
                                          {" "}
                                          *
                                        </span>{" "}
                                      </Label>
                                      <Input
                                      readOnly={isViewActionType}
                                        className="form-control"
                                        type="select"
                                        name="maMonth3AdolescentsParticipationChoice"
                                        id="maMonth3AdolescentsParticipationChoice"
                                        value={
                                          formik.values
                                            .maMonth3AdolescentsParticipationChoice
                                        }
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        style={{
                                          border: "1px solid #014D88",
                                          borderRadius: "0.2rem",
                                        }}
                                      >
                                        <option value="">Select</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                      </Input>
                                      {formik?.touched
                                        ?.maMonth3AdolescentsParticipationChoice &&
                                      formik.errors
                                        .maMonth3AdolescentsParticipationChoice !==
                                        "" ? (
                                        <span className={classes.error}>
                                          {
                                            formik.errors
                                              .maMonth3AdolescentsParticipationChoice
                                          }
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </CustomFormGroup>
                                  </div>

                                  {formik.values
                                    .maMonth3AdolescentsParticipationChoice ===
                                    "yes" && (
                                    <div className="form-group mb-3 col-md-6">
                                      <CustomFormGroup
                                        formik={formik}
                                        name="maMonth3AdolescentsParticipationDate"
                                      >
                                        <Label for="maMonth3AdolescentsParticipationDate">
                                          Date for adolescent participation
                                          <span style={{ color: "red" }}>
                                            {" "}
                                            *
                                          </span>{" "}
                                        </Label>
                                        <Input
                                        readOnly={isViewActionType}
                                          className="form-control"
                                          type="date"
                                          {...{
                                            min: moment(
                                              new Date(
                                                props?.activeContent?.artCommence?.visitDate
                                              )
                                            ).format("YYYY-MM-DD"),
                                          }}
                                          {...{
                                            max: moment(new Date()).format(
                                              "YYYY-MM-DD"
                                            ),
                                          }}
                                          disabled={
                                            !props?.activeContent?.enrollment
                                              ?.dateOfRegistration
                                          }
                                          name="maMonth3AdolescentsParticipationDate"
                                          id="maMonth3AdolescentsParticipationDate"
                                          value={
                                            formik.values
                                              .maMonth3AdolescentsParticipationDate
                                          }
                                          onChange={formik.handleChange}
                                          onBlur={formik.handleBlur}
                                          style={{
                                            border: "1px solid #014D88",
                                            borderRadius: "0.2rem",
                                          }}
                                        />
                                        {formik?.touched
                                          ?.maMonth3AdolescentsParticipationDate &&
                                        formik.errors
                                          .maMonth3AdolescentsParticipationDate !==
                                          "" ? (
                                          <span className={classes.error}>
                                            {
                                              formik.errors
                                                .maMonth3AdolescentsParticipationDate
                                            }
                                          </span>
                                        ) : (
                                          ""
                                        )}
                                      </CustomFormGroup>
                                    </div>
                                  )}

                                  <div className="form-group mb-3 col-md-6">
                                    <CustomFormGroup
                                      formik={formik}
                                      name="maMonth3leadershipTrainingChoice"
                                    >
                                      <Label for="maMonth3leadershipTrainingChoice">
                                        Leadership participation
                                        <span style={{ color: "red" }}>
                                          {" "}
                                          *
                                        </span>{" "}
                                      </Label>
                                      <Input
                                      readOnly={isViewActionType}
                                        className="form-control"
                                        type="select"
                                        name="maMonth3leadershipTrainingChoice"
                                        id="maMonth3leadershipTrainingChoice"
                                        value={
                                          formik.values
                                            .maMonth3leadershipTrainingChoice
                                        }
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        style={{
                                          border: "1px solid #014D88",
                                          borderRadius: "0.2rem",
                                        }}
                                      >
                                        <option value="">Select</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                      </Input>
                                      {formik?.touched
                                        ?.maMonth3leadershipTrainingChoice &&
                                      formik.errors
                                        .maMonth3leadershipTrainingChoice !==
                                        "" ? (
                                        <span className={classes.error}>
                                          {
                                            formik.errors
                                              .maMonth3leadershipTrainingChoice
                                          }
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </CustomFormGroup>
                                  </div>

                                  {formik.values
                                    .maMonth3leadershipTrainingChoice ===
                                    "yes" && (
                                    <div className="form-group mb-3 col-md-6">
                                      <CustomFormGroup
                                        formik={formik}
                                        name="maMonth3leadershipTrainingDate"
                                      >
                                        <Label for="maMonth3leadershipTrainingDate">
                                          Date for Leadership participation
                                          <span style={{ color: "red" }}>
                                            {" "}
                                            *
                                          </span>{" "}
                                        </Label>
                                        <Input
                                        readOnly={isViewActionType}
                                          className="form-control"
                                          type="date"
                                          {...{
                                            min: moment(
                                              new Date(
                                                props?.activeContent?.artCommence?.visitDate
                                              )
                                            ).format("YYYY-MM-DD"),
                                          }}
                                          {...{
                                            max: moment(new Date()).format(
                                              "YYYY-MM-DD"
                                            ),
                                          }}
                                          disabled={
                                            !props?.activeContent?.enrollment
                                              ?.dateOfRegistration
                                          }
                                          name="maMonth3leadershipTrainingDate"
                                          id="maMonth3leadershipTrainingDate"
                                          value={
                                            formik.values
                                              .maMonth3leadershipTrainingDate
                                          }
                                          onChange={formik.handleChange}
                                          onBlur={formik.handleBlur}
                                          style={{
                                            border: "1px solid #014D88",
                                            borderRadius: "0.2rem",
                                          }}
                                        />
                                        {formik.errors
                                          .maMonth3leadershipTrainingDate !==
                                        "" ? (
                                          <span className={classes.error}>
                                            {
                                              formik.errors
                                                .maMonth3leadershipTrainingDate
                                            }
                                          </span>
                                        ) : (
                                          ""
                                        )}
                                      </CustomFormGroup>
                                    </div>
                                  )}

                                  <div className="form-group mb-3 col-md-6">
                                    <CustomFormGroup
                                      formik={formik}
                                      name="maMonth3PeerToPeerChoice"
                                    >
                                      <Label for="maMonth3PeerToPeerChoice">
                                        Peer to Peer Mentorship
                                        <span style={{ color: "red" }}>
                                          {" "}
                                          *
                                        </span>{" "}
                                      </Label>
                                      <Input
                                      readOnly={isViewActionType}
                                        className="form-control"
                                        type="select"
                                        name="maMonth3PeerToPeerChoice"
                                        id="maMonth3PeerToPeerChoice"
                                        value={
                                          formik.values.maMonth3PeerToPeerChoice
                                        }
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        style={{
                                          border: "1px solid #014D88",
                                          borderRadius: "0.2rem",
                                        }}
                                      >
                                        <option value="">Select</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                      </Input>
                                      {formik?.touched
                                        ?.maMonth3PeerToPeerChoice &&
                                      formik.errors.maMonth3PeerToPeerChoice !==
                                        "" ? (
                                        <span className={classes.error}>
                                          {
                                            formik.errors
                                              .maMonth3PeerToPeerChoice
                                          }
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </CustomFormGroup>
                                  </div>

                                  {formik.values.maMonth3PeerToPeerChoice ===
                                    "yes" && (
                                    <div className="form-group mb-3 col-md-6">
                                      <CustomFormGroup
                                        formik={formik}
                                        name="maMonth3PeerToPeerDate"
                                      >
                                        <Label for="maMonth3PeerToPeerDate">
                                          Date for peer to peer mentorship
                                          <span style={{ color: "red" }}>
                                            {" "}
                                            *
                                          </span>{" "}
                                        </Label>
                                        <Input
                                        readOnly={isViewActionType}
                                          className="form-control"
                                          type="date"
                                          {...{
                                            min: moment(
                                              new Date(
                                                props?.activeContent?.artCommence?.visitDate
                                              )
                                            ).format("YYYY-MM-DD"),
                                          }}
                                          {...{
                                            max: moment(new Date()).format(
                                              "YYYY-MM-DD"
                                            ),
                                          }}
                                          disabled={
                                            !props?.activeContent?.enrollment
                                              ?.dateOfRegistration
                                          }
                                          name="maMonth3PeerToPeerDate"
                                          id="maMonth3PeerToPeerDate"
                                          value={
                                            formik.values.maMonth3PeerToPeerDate
                                          }
                                          onChange={formik.handleChange}
                                          onBlur={formik.handleBlur}
                                          style={{
                                            border: "1px solid #014D88",
                                            borderRadius: "0.2rem",
                                          }}
                                        />
                                        {formik?.touched
                                          ?.maMonth3PeerToPeerDate &&
                                        formik.errors.maMonth3PeerToPeerDate !==
                                          "" ? (
                                          <span className={classes.error}>
                                            {
                                              formik.errors
                                                .maMonth3PeerToPeerDate
                                            }
                                          </span>
                                        ) : (
                                          ""
                                        )}
                                      </CustomFormGroup>
                                    </div>
                                  )}

                                  <div className="form-group mb-3 col-md-6">
                                    <CustomFormGroup
                                      formik={formik}
                                      name="maMonth3RoleOfOtzChoice"
                                    >
                                      <Label for="maMonth3RoleOfOtzChoice">
                                        Role of OTZ in 95-95-95
                                        <span style={{ color: "red" }}>
                                          {" "}
                                          *
                                        </span>{" "}
                                      </Label>
                                      <Input
                                      readOnly={isViewActionType}
                                        className="form-control"
                                        type="select"
                                        name="maMonth3RoleOfOtzChoice"
                                        id="maMonth3RoleOfOtzChoice"
                                        value={
                                          formik.values.maMonth3RoleOfOtzChoice
                                        }
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        style={{
                                          border: "1px solid #014D88",
                                          borderRadius: "0.2rem",
                                        }}
                                      >
                                        <option value="">Select</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                      </Input>
                                      {formik?.touched
                                        ?.maMonth3RoleOfOtzChoice &&
                                      formik.errors.maMonth3RoleOfOtzChoice !==
                                        "" ? (
                                        <span className={classes.error}>
                                          {
                                            formik.errors
                                              .maMonth3RoleOfOtzChoice
                                          }
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </CustomFormGroup>
                                  </div>

                                  {formik.values.maMonth3RoleOfOtzChoice ===
                                    "yes" && (
                                    <div className="form-group mb-3 col-md-6">
                                      <CustomFormGroup
                                        formik={formik}
                                        name="maMonth3RoleOfOtzDate"
                                      >
                                        <Label for="maMonth3RoleOfOtzDate">
                                          Date for role of OTZ in 95-95-95
                                          <span style={{ color: "red" }}>
                                            {" "}
                                            *
                                          </span>{" "}
                                        </Label>
                                        <Input
                                        readOnly={isViewActionType}
                                          className="form-control"
                                          type="date"
                                          {...{
                                            min: moment(
                                              new Date(
                                                props?.activeContent?.artCommence?.visitDate
                                              )
                                            ).format("YYYY-MM-DD"),
                                          }}
                                          {...{
                                            max: moment(new Date()).format(
                                              "YYYY-MM-DD"
                                            ),
                                          }}
                                          disabled={
                                            !props?.activeContent?.enrollment
                                              ?.dateOfRegistration
                                          }
                                          name="maMonth3RoleOfOtzDate"
                                          id="maMonth3RoleOfOtzDate"
                                          value={
                                            formik.values.maMonth3RoleOfOtzDate
                                          }
                                          onChange={formik.handleChange}
                                          onBlur={formik.handleBlur}
                                          style={{
                                            border: "1px solid #014D88",
                                            borderRadius: "0.2rem",
                                          }}
                                        />
                                        {formik?.touched
                                          ?.maMonth3RoleOfOtzDate &&
                                        formik.errors.maMonth3RoleOfOtzDate !==
                                          "" ? (
                                          <span className={classes.error}>
                                            {
                                              formik.errors
                                                .maMonth3RoleOfOtzDate
                                            }
                                          </span>
                                        ) : (
                                          ""
                                        )}
                                      </CustomFormGroup>
                                    </div>
                                  )}

                                  <div className="form-group mb-3 col-md-6">
                                    <CustomFormGroup
                                      formik={formik}
                                      name="maMonth3OtzChampionOrientationChoice"
                                    >
                                      <Label for="maMonth3OtzChampionOrientationChoice">
                                        OTZ champion orientation
                                        <span style={{ color: "red" }}>
                                          {" "}
                                          *
                                        </span>{" "}
                                      </Label>
                                      <Input
                                      readOnly={isViewActionType}
                                        className="form-control"
                                        type="select"
                                        name="maMonth3OtzChampionOrientationChoice"
                                        id="maMonth3OtzChampionOrientationChoice"
                                        value={
                                          formik.values
                                            .maMonth3OtzChampionOrientationChoice
                                        }
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        style={{
                                          border: "1px solid #014D88",
                                          borderRadius: "0.2rem",
                                        }}
                                      >
                                        <option value="">Select</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                      </Input>
                                      {formik?.touched
                                        ?.maMonth3OtzChampionOrientationChoice &&
                                      formik.errors
                                        .maMonth3OtzChampionOrientationChoice !==
                                        "" ? (
                                        <span className={classes.error}>
                                          {
                                            formik.errors
                                              .maMonth3OtzChampionOrientationChoice
                                          }
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </CustomFormGroup>
                                  </div>

                                  {formik.values
                                    .maMonth3OtzChampionOrientationChoice ===
                                    "yes" && (
                                    <div className="form-group mb-3 col-md-6">
                                      <CustomFormGroup
                                        formik={formik}
                                        name="maMonth3OtzChampionOrientationDate"
                                      >
                                        <Label for="maMonth3OtzChampionOrientationDate">
                                          Date for OTZ Champion Orientation
                                          <span style={{ color: "red" }}>
                                            {" "}
                                            *
                                          </span>{" "}
                                        </Label>
                                        <Input
                                        readOnly={isViewActionType}
                                          className="form-control"
                                          type="date"
                                          {...{
                                            min: moment(
                                              new Date(
                                                props?.activeContent?.artCommence?.visitDate
                                              )
                                            ).format("YYYY-MM-DD"),
                                          }}
                                          {...{
                                            max: moment(new Date()).format(
                                              "YYYY-MM-DD"
                                            ),
                                          }}
                                          disabled={
                                            !props?.activeContent?.enrollment
                                              ?.dateOfRegistration
                                          }
                                          name="maMonth3OtzChampionOrientationDate"
                                          id="maMonth3OtzChampionOrientationDate"
                                          value={
                                            formik.values
                                              .maMonth3OtzChampionOrientationDate
                                          }
                                          onChange={formik.handleChange}
                                          onBlur={formik.handleBlur}
                                          style={{
                                            border: "1px solid #014D88",
                                            borderRadius: "0.2rem",
                                          }}
                                        />
                                        {formik?.touched
                                          ?.maMonth3OtzChampionOrientationDate &&
                                        formik.errors
                                          .maMonth3OtzChampionOrientationDate !==
                                          "" ? (
                                          <span className={classes.error}>
                                            {
                                              formik.errors
                                                .maMonth3OtzChampionOrientationDate
                                            }
                                          </span>
                                        ) : (
                                          ""
                                        )}
                                      </CustomFormGroup>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Collapse>
                          </div>
                        </div>
                      )}
                  </div>
                ))}

              {calculateMonthsFromDate(formik?.values?.dateDone) >= 6 && (
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
                      Post Enrolment Viral Load Monitoring
                    </h5>

                    <>
                      <span className="float-end" style={{ cursor: "pointer" }}>
                        <FaPlus />
                      </span>
                    </>
                  </div>

                  {calculateMonthsFromDate(formik?.values?.dateDone) >= 6 && (
                    <div>
                      <div
                        style={{
                          backgroundColor: "#d8f6ff",
                          width: "95%",
                          margin: "auto",
                          marginTop: "5rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <p
                          style={{
                            color: "black",
                            fontSize: "15px",
                            fontWeight: "600",
                            marginLeft: "10px",
                            marginTop: "10px",
                          }}
                        >
                          6 months
                        </p>
                        <IconButton
                          onClick={() =>
                            setIsDropdownsOpen((prevState) => {
                              return {
                                ...prevState,
                                sixMonthsPEVLM: !prevState.sixMonthsPEVLM,
                              };
                            })
                          }
                          aria-expanded={isDropdownsOpen.sixMonthsPEVLM}
                          aria-label="Expand"
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                      </div>

                      <div className="card-body">
                        <Collapse in={isDropdownsOpen.sixMonthsPEVLM}>
                          <div
                            className="basic-form"
                            style={{ padding: "0 50px 0 50px" }}
                          >
                            <div className="row">
                              <div className="form-group mb-3 col-md-6">
                                <CustomFormGroup
                                  formik={formik}
                                  name="sixMonthsResult"
                                >
                                  <Label for="sixMonthsResult">
                                    Result
                                    <span style={{ color: "red" }}>
                                      {" "}
                                      *
                                    </span>{" "}
                                  </Label>
                                  <Input
                                  readOnly={isViewActionType}
                                    className="form-control"
                                    type="text"
                                    name="sixMonthsResult"
                                    id="sixMonthsResult"
                                    value={formik.values.sixMonthsResult}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{
                                      border: "1px solid #014D88",
                                      borderRadius: "0.2rem",
                                    }}
                                  ></Input>
                                  {formik?.touched?.sixMonthsResult &&
                                  formik.errors.sixMonthsResult !== "" ? (
                                    <span className={classes.error}>
                                      {formik.errors.sixMonthsResult}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </CustomFormGroup>
                              </div>

                              <div className="form-group mb-3 col-md-6">
                                <CustomFormGroup
                                  formik={formik}
                                  name="sixMonthsDate"
                                >
                                  <Label for="sixMonthsDate">
                                    Date
                                    <span style={{ color: "red" }}>
                                      {" "}
                                      *
                                    </span>{" "}
                                  </Label>
                                  <Input
                                  readOnly={isViewActionType}
                                    className="form-control"
                                    type="date"
                                    {...{
                                      min: moment(
                                        new Date(
                                          props?.activeContent?.artCommence?.visitDate
                                        )
                                      ).format("YYYY-MM-DD"),
                                    }}
                                    {...{
                                      max: moment(new Date()).format(
                                        "YYYY-MM-DD"
                                      ),
                                    }}
                                    disabled={
                                      !props?.activeContent?.enrollment
                                        ?.dateOfRegistration
                                    }
                                    name="sixMonthsDate"
                                    id="sixMonthsDate"
                                    value={formik.values.sixMonthsDate}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{
                                      border: "1px solid #014D88",
                                      borderRadius: "0.2rem",
                                    }}
                                  />
                                  {formik?.touched?.sixMonthsDate &&
                                  formik.errors.sixMonthsDate !== "" ? (
                                    <span className={classes.error}>
                                      {formik.errors.sixMonthsDate}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </CustomFormGroup>
                              </div>
                            </div>
                          </div>
                        </Collapse>
                      </div>
                    </div>
                  )}

                  {calculateMonthsFromDate(formik?.values?.dateDone) >= 12 && (
                    <div>
                      <div
                        style={{
                          backgroundColor: "#d8f6ff",
                          width: "95%",
                          margin: "auto",
                          marginTop: "5rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <p
                          style={{
                            color: "black",
                            fontSize: "15px",
                            fontWeight: "600",
                            marginLeft: "10px",
                            marginTop: "10px",
                          }}
                        >
                          12 months
                        </p>
                        <IconButton
                          onClick={() =>
                            setIsDropdownsOpen((prevState) => {
                              return {
                                ...prevState,
                                twelveMonthsPEVLM: !prevState.twelveMonthsPEVLM,
                              };
                            })
                          }
                          aria-expanded={isDropdownsOpen.twelveMonthsPEVLM}
                          aria-label="Expand"
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                      </div>

                      <div className="card-body">
                        <Collapse in={isDropdownsOpen.twelveMonthsPEVLM}>
                          <div
                            className="basic-form"
                            style={{ padding: "0 50px 0 50px" }}
                          >
                            <div className="row">
                              <div className="form-group mb-3 col-md-6">
                                <CustomFormGroup
                                  formik={formik}
                                  name="twelveMonthsResult"
                                >
                                  <Label for="twelveMonthsResult">
                                    Result
                                    <span style={{ color: "red" }}>
                                      {" "}
                                      *
                                    </span>{" "}
                                  </Label>
                                  <Input
                                  readOnly={isViewActionType}
                                    className="form-control"
                                    type="text"
                                    name="twelveMonthsResult"
                                    id="twelveMonthsResult"
                                    value={formik.values.twelveMonthsResult}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{
                                      border: "1px solid #014D88",
                                      borderRadius: "0.2rem",
                                    }}
                                  ></Input>
                                  {formik?.touched?.twelveMonthsResult &&
                                  formik.errors.twelveMonthsResult !== "" ? (
                                    <span className={classes.error}>
                                      {formik.errors.twelveMonthsResult}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </CustomFormGroup>
                              </div>

                              <div className="form-group mb-3 col-md-6">
                                <CustomFormGroup
                                  formik={formik}
                                  name="twelveMonthsDate"
                                >
                                  <Label for="twelveMonthsDate">
                                    Date
                                    <span style={{ color: "red" }}>
                                      {" "}
                                      *
                                    </span>{" "}
                                  </Label>
                                  <Input
                                  readOnly={isViewActionType}
                                    className="form-control"
                                    type="date"
                                    {...{
                                      min: moment(
                                        new Date(
                                          props?.activeContent?.artCommence?.visitDate
                                        )
                                      ).format("YYYY-MM-DD"),
                                    }}
                                    {...{
                                      max: moment(new Date()).format(
                                        "YYYY-MM-DD"
                                      ),
                                    }}
                                    disabled={
                                      !props?.activeContent?.enrollment
                                        ?.dateOfRegistration
                                    }
                                    name="twelveMonthsDate"
                                    id="twelveMonthsDate"
                                    value={formik.values.twelveMonthsDate}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{
                                      border: "1px solid #014D88",
                                      borderRadius: "0.2rem",
                                    }}
                                  />
                                  {formik?.touched?.twelveMonthsDate &&
                                  formik.errors.twelveMonthsDate !== "" ? (
                                    <span className={classes.error}>
                                      {formik.errors.twelveMonthsDate}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </CustomFormGroup>
                              </div>
                            </div>
                          </div>
                        </Collapse>
                      </div>
                    </div>
                  )}

                  {calculateMonthsFromDate(formik?.values?.dateDone) >= 18 && (
                    <div>
                      <div
                        style={{
                          backgroundColor: "#d8f6ff",
                          width: "95%",
                          margin: "auto",
                          marginTop: "5rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <p
                          style={{
                            color: "black",
                            fontSize: "15px",
                            fontWeight: "600",
                            marginLeft: "10px",
                            marginTop: "10px",
                          }}
                        >
                          18 months
                        </p>
                        <IconButton
                          onClick={() =>
                            setIsDropdownsOpen((prevState) => {
                              return {
                                ...prevState,
                                eighteenMonthsPEVLM:
                                  !prevState.eighteenMonthsPEVLM,
                              };
                            })
                          }
                          aria-expanded={isDropdownsOpen.eighteenMonthsPEVLM}
                          aria-label="Expand"
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                      </div>

                      <div className="card-body">
                        <Collapse in={isDropdownsOpen.eighteenMonthsPEVLM}>
                          <div
                            className="basic-form"
                            style={{ padding: "0 50px 0 50px" }}
                          >
                            <div className="row">
                              <div className="form-group mb-3 col-md-6">
                                <CustomFormGroup
                                  formik={formik}
                                  name="eighteenMonthsResult"
                                >
                                  <Label for="eighteenMonthsResult">
                                    Result
                                    <span style={{ color: "red" }}>
                                      {" "}
                                      *
                                    </span>{" "}
                                  </Label>
                                  <Input
                                  readOnly={isViewActionType}
                                    className="form-control"
                                    type="text"
                                    name="eighteenMonthsResult"
                                    id="eighteenMonthsResult"
                                    value={formik.values.eighteenMonthsResult}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{
                                      border: "1px solid #014D88",
                                      borderRadius: "0.2rem",
                                    }}
                                  ></Input>
                                  {formik?.touched?.eighteenMonthsResult &&
                                  formik.errors.eighteenMonthsResult !== "" ? (
                                    <span className={classes.error}>
                                      {formik.errors.eighteenMonthsResult}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </CustomFormGroup>
                              </div>

                              <div className="form-group mb-3 col-md-6">
                                <CustomFormGroup
                                  formik={formik}
                                  name="eighteenMonthsDate"
                                >
                                  <Label for="eighteenMonthsDate">
                                    Date
                                    <span style={{ color: "red" }}>
                                      {" "}
                                      *
                                    </span>{" "}
                                  </Label>
                                  <Input
                                  readOnly={isViewActionType}
                                    className="form-control"
                                    type="date"
                                    {...{
                                      min: moment(
                                        new Date(
                                          props?.activeContent?.artCommence?.visitDate
                                        )
                                      ).format("YYYY-MM-DD"),
                                    }}
                                    {...{
                                      max: moment(new Date()).format(
                                        "YYYY-MM-DD"
                                      ),
                                    }}
                                    disabled={
                                      !props?.activeContent?.enrollment
                                        ?.dateOfRegistration
                                    }
                                    name="eighteenMonthsDate"
                                    id="eighteenMonthsDate"
                                    value={formik.values.eighteenMonthsDate}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{
                                      border: "1px solid #014D88",
                                      borderRadius: "0.2rem",
                                    }}
                                  ></Input>
                                  {formik?.touched?.eighteenMonthsDate &&
                                  formik.errors.eighteenMonthsDate !== "" ? (
                                    <span className={classes.error}>
                                      {formik.errors.eighteenMonthsDate}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </CustomFormGroup>
                              </div>
                            </div>
                          </div>
                        </Collapse>
                      </div>
                    </div>
                  )}

                  {calculateMonthsFromDate(formik?.values?.dateDone) >= 24 && (
                    <div>
                      <div
                        style={{
                          backgroundColor: "#d8f6ff",
                          width: "95%",
                          margin: "auto",
                          marginTop: "5rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <p
                          style={{
                            color: "black",
                            fontSize: "15px",
                            fontWeight: "600",
                            marginLeft: "10px",
                            marginTop: "10px",
                          }}
                        >
                          24 months
                        </p>
                        <IconButton
                          onClick={() =>
                            setIsDropdownsOpen((prevState) => {
                              return {
                                ...prevState,
                                twentyFourMonthsPEVLM:
                                  !prevState.twentyFourMonthsPEVLM,
                              };
                            })
                          }
                          aria-expanded={isDropdownsOpen.twentyFourMonthsPEVLM}
                          aria-label="Expand"
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                      </div>

                      <div className="card-body">
                        <Collapse in={isDropdownsOpen.twentyFourMonthsPEVLM}>
                          <div
                            className="basic-form"
                            style={{ padding: "0 50px 0 50px" }}
                          >
                            <div className="row">
                              <div className="form-group mb-3 col-md-6">
                                <CustomFormGroup
                                  formik={formik}
                                  name="twentyFourMonthsResult"
                                >
                                  <Label for="twentyFourMonthsResult">
                                    Result
                                    <span style={{ color: "red" }}>
                                      {" "}
                                      *
                                    </span>{" "}
                                  </Label>
                                  <Input
                                  readOnly={isViewActionType}
                                    className="form-control"
                                    type="text"
                                    name="twentyFourMonthsResult"
                                    id="twentyFourMonthsResult"
                                    value={formik.values.twentyFourMonthsResult}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{
                                      border: "1px solid #014D88",
                                      borderRadius: "0.2rem",
                                    }}
                                  ></Input>
                                  {formik?.touched?.twentyFourMonthsResult &&
                                  formik.errors.twentyFourMonthsResult !==
                                    "" ? (
                                    <span className={classes.error}>
                                      {formik.errors.twentyFourMonthsResult}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </CustomFormGroup>
                              </div>

                              <div className="form-group mb-3 col-md-6">
                                <CustomFormGroup
                                  formik={formik}
                                  name="maMonth3LiteracyTreatmentChoice"
                                >
                                  <Label for="maMonth3LiteracyTreatmentChoice">
                                    Date
                                    <span style={{ color: "red" }}>
                                      {" "}
                                      *
                                    </span>{" "}
                                  </Label>
                                  <Input
                                  readOnly={isViewActionType}
                                    className="form-control"
                                    type="date"
                                    {...{
                                      min: moment(
                                        new Date(
                                          props?.activeContent?.artCommence?.visitDate
                                        )
                                      ).format("YYYY-MM-DD"),
                                    }}
                                    {...{
                                      max: moment(new Date()).format(
                                        "YYYY-MM-DD"
                                      ),
                                    }}
                                    disabled={
                                      !props?.activeContent?.enrollment
                                        ?.dateOfRegistration
                                    }
                                    name="twentyFourMonthsDate"
                                    id="twentyFourMonthsDate"
                                    value={formik.values.twentyFourMonthsDate}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{
                                      border: "1px solid #014D88",
                                      borderRadius: "0.2rem",
                                    }}
                                  ></Input>
                                  {formik?.touched?.twentyFourMonthsDate &&
                                  formik.errors.twentyFourMonthsDate !== "" ? (
                                    <span className={classes.error}>
                                      {formik.errors.twentyFourMonthsDate}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </CustomFormGroup>
                              </div>
                            </div>
                          </div>
                        </Collapse>
                      </div>
                    </div>
                  )}

                  {calculateMonthsFromDate(formik?.values?.dateDone) >= 30 && (
                    <div>
                      <div
                        style={{
                          backgroundColor: "#d8f6ff",
                          width: "95%",
                          margin: "auto",
                          marginTop: "5rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <p
                          style={{
                            color: "black",
                            fontSize: "15px",
                            fontWeight: "600",
                            marginLeft: "10px",
                            marginTop: "10px",
                          }}
                        >
                          30 months
                        </p>
                        <IconButton
                          onClick={() =>
                            setIsDropdownsOpen((prevState) => {
                              return {
                                ...prevState,
                                thirtyMonthsPEVLM: !prevState.thirtyMonthsPEVLM,
                              };
                            })
                          }
                          aria-expanded={isDropdownsOpen.thirtyMonthsPEVLM}
                          aria-label="Expand"
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                      </div>

                      <div className="card-body">
                        <Collapse in={isDropdownsOpen.thirtyMonthsPEVLM}>
                          <div
                            className="basic-form"
                            style={{ padding: "0 50px 0 50px" }}
                          >
                            <div className="row">
                              <div className="form-group mb-3 col-md-6">
                                <CustomFormGroup
                                  formik={formik}
                                  name="thirtyMonthsResult"
                                >
                                  <Label for="thirtyMonthsResult">
                                    Result
                                    <span style={{ color: "red" }}>
                                      {" "}
                                      *
                                    </span>{" "}
                                  </Label>
                                  <Input
                                  readOnly={isViewActionType}
                                    className="form-control"
                                    type="text"
                                    name="thirtyMonthsResult"
                                    id="thirtyMonthsResult"
                                    value={formik.values.thirtyMonthsResult}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{
                                      border: "1px solid #014D88",
                                      borderRadius: "0.2rem",
                                    }}
                                  ></Input>
                                  {formik?.touched?.thirtyMonthsResult &&
                                  formik.errors.thirtyMonthsResult !== "" ? (
                                    <span className={classes.error}>
                                      {formik.errors.thirtyMonthsResult}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </CustomFormGroup>
                              </div>

                              <div className="form-group mb-3 col-md-6">
                                <CustomFormGroup
                                  formik={formik}
                                  name="thirtyMonthsDate"
                                >
                                  <Label for="thirtyMonthsDate">
                                    Date
                                    <span style={{ color: "red" }}>
                                      {" "}
                                      *
                                    </span>{" "}
                                  </Label>
                                  <Input
                                  readOnly={isViewActionType}
                                    className="form-control"
                                    type="date"
                                    {...{
                                      min: moment(
                                        new Date(
                                          props?.activeContent?.artCommence?.visitDate
                                        )
                                      ).format("YYYY-MM-DD"),
                                    }}
                                    {...{
                                      max: moment(new Date()).format(
                                        "YYYY-MM-DD"
                                      ),
                                    }}
                                    disabled={
                                      !props?.activeContent?.enrollment
                                        ?.dateOfRegistration
                                    }
                                    name="thirtyMonthsDate"
                                    id="thirtyMonthsDate"
                                    value={formik.values.thirtyMonthsDate}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{
                                      border: "1px solid #014D88",
                                      borderRadius: "0.2rem",
                                    }}
                                  ></Input>
                                  {formik?.touched?.thirtyMonthsDate &&
                                  formik.errors.thirtyMonthsDate !== "" ? (
                                    <span className={classes.error}>
                                      {formik.errors.thirtyMonthsDate}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </CustomFormGroup>
                              </div>
                            </div>
                          </div>
                        </Collapse>
                      </div>
                    </div>
                  )}

                  {calculateMonthsFromDate(formik?.values?.dateDone) >= 36 && (
                    <div>
                      <div
                        style={{
                          backgroundColor: "#d8f6ff",
                          width: "95%",
                          margin: "auto",
                          marginTop: "5rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <p
                          style={{
                            color: "black",
                            fontSize: "15px",
                            fontWeight: "600",
                            marginLeft: "10px",
                            marginTop: "10px",
                          }}
                        >
                          36 months
                        </p>
                        <IconButton
                          onClick={() =>
                            setIsDropdownsOpen((prevState) => {
                              return {
                                ...prevState,
                                thirtySixMonthsPEVLM:
                                  !prevState.thirtySixMonthsPEVLM,
                              };
                            })
                          }
                          aria-expanded={isDropdownsOpen.thirtySixMonthsPEVLM}
                          aria-label="Expand"
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                      </div>

                      <div className="card-body">
                        <Collapse in={isDropdownsOpen.thirtySixMonthsPEVLM}>
                          <div
                            className="basic-form"
                            style={{ padding: "0 50px 0 50px" }}
                          >
                            <div className="row">
                              <div className="form-group mb-3 col-md-6">
                                <CustomFormGroup
                                  formik={formik}
                                  name="thirtySixMonthsResult"
                                >
                                  <Label for="thirtySixMonthsResult">
                                    Result
                                    <span style={{ color: "red" }}>
                                      {" "}
                                      *
                                    </span>{" "}
                                  </Label>
                                  <Input
                                  readOnly={isViewActionType}
                                    className="form-control"
                                    type="text"
                                    name="thirtySixMonthsResult"
                                    id="thirtySixMonthsResult"
                                    value={formik.values.thirtySixMonthsResult}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{
                                      border: "1px solid #014D88",
                                      borderRadius: "0.2rem",
                                    }}
                                  ></Input>
                                  {formik?.touched?.thirtySixMonthsResult &&
                                  formik.errors.thirtySixMonthsResult !== "" ? (
                                    <span className={classes.error}>
                                      {formik.errors.thirtySixMonthsResult}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </CustomFormGroup>
                              </div>

                              <div className="form-group mb-3 col-md-6">
                                <CustomFormGroup
                                  formik={formik}
                                  name="thirtySixMonthsDate"
                                >
                                  <Label for="thirtySixMonthsDate">
                                    Date
                                    <span style={{ color: "red" }}>
                                      {" "}
                                      *
                                    </span>{" "}
                                  </Label>
                                  <Input
                                  readOnly={isViewActionType}
                                    className="form-control"
                                    type="date"
                                    {...{
                                      min: moment(
                                        new Date(
                                          props?.activeContent?.artCommence?.visitDate
                                        )
                                      ).format("YYYY-MM-DD"),
                                    }}
                                    {...{
                                      max: moment(new Date()).format(
                                        "YYYY-MM-DD"
                                      ),
                                    }}
                                    disabled={
                                      !props?.activeContent?.enrollment
                                        ?.dateOfRegistration
                                    }
                                    name="thirtySixMonthsDate"
                                    id="thirtySixMonthsDate"
                                    value={formik.values.thirtySixMonthsDate}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{
                                      border: "1px solid #014D88",
                                      borderRadius: "0.2rem",
                                    }}
                                  ></Input>
                                  {formik?.touched?.thirtySixMonthsDate &&
                                  formik.errors.thirtySixMonthsDate !== "" ? (
                                    <span className={classes.error}>
                                      {formik.errors.thirtySixMonthsDate}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </CustomFormGroup>
                              </div>
                            </div>
                          </div>
                        </Collapse>
                      </div>
                    </div>
                  )}
                </div>
              )}

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
                    Outcome
                  </h5>

                  <>
                    <span className="float-end" style={{ cursor: "pointer" }}>
                      <FaPlus />
                    </span>
                  </>
                </div>

                <div
                  className="basic-form"
                  style={{ padding: "50px 50px 50px 50px" }}
                >
                  <div className="row">
                    <div className="form-group mb-3 col-md-4">
                      <CustomFormGroup formik={formik} name="outcomes">
                        <Label for="outcomes">
                          Outcome
                          <span style={{ color: "red" }}> *</span>{" "}
                        </Label>
                        <Input
                        readOnly={isViewActionType}
                          className="form-control"
                          type="select"
                          name="outcomes"
                          id="outcomes"
                          value={formik.values.outcomes}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        >
                          <option value="">Select</option>
                          {otzOutcomesArray?.map?.((item, index) => (
                            <>
                              <option value={item?.id}>{item?.display}</option>
                            </>
                          ))}
                        </Input>
                        {formik?.touched?.outcomes &&
                        formik.errors.outcomes !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.outcomes}
                          </span>
                        ) : (
                          ""
                        )}
                      </CustomFormGroup>
                    </div>

                    <div className="form-group mb-3 col-md-4">
                      <CustomFormGroup formik={formik} name="exitedOtz">
                        <Label for="exitedOtz">
                          Exited OTZ
                          <span style={{ color: "red" }}> *</span>{" "}
                        </Label>
                        <Input
                        readOnly={isViewActionType}
                          className="form-control"
                          type="select"
                          name="exitedOtz"
                          id="exitedOtz"
                          value={formik.values.exitedOtz}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Input>
                        {formik?.touched?.exitedOtz &&
                        formik.errors.exitedOtz !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.exitedOtz}
                          </span>
                        ) : (
                          ""
                        )}
                      </CustomFormGroup>
                    </div>

                    {formik?.values?.exitedOtz === "yes" && (
                      <>
                        <div className="form-group mb-3 col-md-4">
                          <CustomFormGroup
                            formik={formik}
                            name="viralLoadOnOtzExit"
                          >
                            <Label for="viralLoadOnOtzExit">
                              Viral load on OTZ exit
                              <span style={{ color: "red" }}> *</span>{" "}
                            </Label>
                            <Input
                            readOnly={isViewActionType}
                              className="form-control"
                              type="text"
                              name="viralLoadOnOtzExit"
                              id="viralLoadOnOtzExit"
                              value={formik.values.viralLoadOnOtzExit}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {formik?.touched?.viralLoadOnOtzExit &&
                            formik.errors.viralLoadOnOtzExit !== "" ? (
                              <span className={classes.error}>
                                {formik.errors.viralLoadOnOtzExit}
                              </span>
                            ) : (
                              ""
                            )}
                          </CustomFormGroup>
                        </div>

                        <div className="form-group mb-3 col-md-4">
                          <CustomFormGroup formik={formik} name="exitedByName">
                            <Label for="exitedByName">
                              Exited by (Name)
                              <span style={{ color: "red" }}> *</span>{" "}
                            </Label>
                            <Input
                            readOnly={isViewActionType}
                              className="form-control"
                              type="text"
                              name="exitedByName"
                              id="exitedByName"
                              value={formik.values.exitedByName}
                              onChange={(e) =>
                                handleFilterNumber(e, formik.setFieldValue)
                              }
                              onBlur={formik.handleBlur}
                              pattern="^[^0-9]+$"
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {formik?.touched?.exitedByName &&
                            formik.errors.exitedByName !== "" ? (
                              <span className={classes.error}>
                                {formik.errors.exitedByName}
                              </span>
                            ) : (
                              ""
                            )}
                          </CustomFormGroup>
                        </div>

                        <div className="form-group mb-3 col-md-4">
                          <CustomFormGroup
                            formik={formik}
                            name="exitedByDesignation"
                          >
                            <Label for="exitedByDesignation">
                              Exited by (Designation)
                              <span style={{ color: "red" }}> *</span>{" "}
                            </Label>
                            <Input
                            readOnly={isViewActionType}
                              className="form-control"
                              type="text"
                              name="exitedByDesignation"
                              id="exitedByDesignation"
                              value={formik.values.exitedByDesignation}
                              onChange={(e) =>
                                handleFilterNumber(e, formik.setFieldValue)
                              }
                              onBlur={formik.handleBlur}
                              pattern="^[^0-9]+$"
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {formik?.touched?.exitedByDesignation &&
                            formik.errors.exitedByDesignation !== "" ? (
                              <span className={classes.error}>
                                {formik.errors.exitedByDesignation}
                              </span>
                            ) : (
                              ""
                            )}
                          </CustomFormGroup>
                        </div>

                        <div className="form-group mb-3 col-md-4">
                          <CustomFormGroup formik={formik} name="exitedByDate">
                            <Label for="exitedByDate">
                              Exited by (Date)
                              <span style={{ color: "red" }}> *</span>{" "}
                            </Label>
                            <Input
                            readOnly={isViewActionType}
                              className="form-control"
                              type="date"
                              {...{
                                min: moment(
                                  new Date(
                                    props?.activeContent?.artCommence?.visitDate
                                  )
                                ).format("YYYY-MM-DD"),
                              }}
                              {...{
                                max: moment(new Date()).format("YYYY-MM-DD"),
                              }}
                              disabled={
                                !props?.activeContent?.enrollment
                                  ?.dateOfRegistration
                              }
                              name="exitedByDate"
                              id="exitedByDate"
                              value={formik.values.exitedByDate}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {formik?.touched?.exitedByDate &&
                            formik.errors.exitedByDate !== "" ? (
                              <span className={classes.error}>
                                {formik.errors.exitedByDate}
                              </span>
                            ) : (
                              ""
                            )}
                          </CustomFormGroup>
                        </div>

                        <div className="form-group mb-3 col-md-4">
                          <CustomFormGroup
                            formik={formik}
                            name="exitedBySignature"
                          >
                            <Label for="exitedBySignature">
                              Exited by (Signature)
                              <span style={{ color: "red" }}> *</span>{" "}
                            </Label>
                            <Input
                            readOnly={isViewActionType}
                              className="form-control"
                              type="text"
                              name="exitedBySignature"
                              id="exitedBySignature"
                              value={formik.values.exitedBySignature}
                              onChange={(e) =>
                                handleFilterNumber(e, formik.setFieldValue)
                              }
                              onBlur={formik.handleBlur}
                              pattern="^[^0-9]+$"
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {formik?.touched?.exitedBySignature &&
                            formik.errors.exitedBySignature !== "" ? (
                              <span className={classes.error}>
                                {formik.errors.exitedBySignature}
                              </span>
                            ) : (
                              ""
                            )}
                          </CustomFormGroup>
                        </div>

                        <div className="form-group mb-3 col-md-4">
                          <CustomFormGroup
                            formik={formik}
                            name="dateOfAssessmentDone"
                          >
                            <Label for="dateOfAssessmentDone">
                              Viral load assessment date
                              <span style={{ color: "red" }}> *</span>{" "}
                            </Label>
                            <Input
                            readOnly={isViewActionType}
                              className="form-control"
                              type="date"
                              {...{
                                min: moment(
                                  new Date(
                                    props?.activeContent?.artCommence?.visitDate
                                  )
                                ).format("YYYY-MM-DD"),
                              }}
                              {...{
                                max: moment(new Date()).format("YYYY-MM-DD"),
                              }}
                              disabled={
                                !props?.activeContent?.enrollment
                                  ?.dateOfRegistration
                              }
                              name="dateOfAssessmentDone"
                              id="dateOfAssessmentDone"
                              value={formik.values.dateOfAssessmentDone}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {formik?.touched?.dateOfAssessmentDone &&
                            formik.errors.dateOfAssessmentDone !== "" ? (
                              <span className={classes.error}>
                                {formik.errors.dateOfAssessmentDone}
                              </span>
                            ) : (
                              ""
                            )}
                          </CustomFormGroup>
                        </div>
                      </>
                    )}

                    {formik?.values?.outcomes === "1138" && (
                      <div className="form-group mb-3 col-md-4">
                        <CustomFormGroup formik={formik} name="transitionDate">
                          <Label for="transitionDate">
                            Transition Date
                            <span style={{ color: "red" }}> *</span>{" "}
                          </Label>
                          <Input
                          readOnly={isViewActionType}
                            className="form-control"
                            type="date"
                            {...{
                              min: moment(
                                new Date(
                                  props?.activeContent?.artCommence?.visitDate
                                )
                              ).format("YYYY-MM-DD"),
                            }}
                            {...{
                              max: moment(new Date()).format("YYYY-MM-DD"),
                            }}
                            disabled={
                              !props?.activeContent?.enrollment
                                ?.dateOfRegistration
                            }
                            name="transitionDate"
                            id="transitionDate"
                            value={formik.values.transitionDate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                          {formik?.touched?.transitionDate &&
                          formik.errors.transitionDate !== "" ? (
                            <span className={classes.error}>
                              {formik.errors.transitionDate}
                            </span>
                          ) : (
                            ""
                          )}
                        </CustomFormGroup>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <MatButton
                  type="button"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  style={{ backgroundColor: "#014d88" }}
                  startIcon={<SaveIcon />}
                  disabled={saving}
                  onClick={formik?.handleSubmit}
                >
                  {!saving ? (
                    <span style={{ textTransform: "capitalize" }}>Submit</span>
                  ) : (
                    <span style={{ textTransform: "capitalize" }}>
                      Submitting...
                    </span>
                  )}
                </MatButton>
              </div>

              {saving && <Spinner />}
              <br />
            </Form>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ServiceForm;
