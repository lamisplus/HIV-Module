import React, { useState, useEffect } from "react";
import { Spinner, Form, FormGroup, Label, Input } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent } from "@material-ui/core";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { FaPlus } from "react-icons/fa";
import { useServiceFormValidationSchema } from "../../formValidationSchema/OtzEnrollmentValidationSchema";
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

const EnrollmentOtz = (props) => {
  const [saving, setSavings] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [otzOutcomesArray, setOtzOutcomes] = useState([]);
  const [otzPlusCapture, setOtzCapture] = useState("");
  const [labResult, setLabResult] = useState(null);

  const submitNewRecord = (values) => {
    const observation = {
      data: values,
      dateOfObservation:
        values?.dateDone != ""
          ? values?.dateDone
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
          route: "recent-history",
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

  const handleSubmit = async () => {
    const artStartDate = props?.activeContent?.artCommence?.visitDate;
    const baselineViralLoadAtEnrollment = Number(
      props?.activeContent?.currentLabResult?.result
    );

    if (!artStartDate || !baselineViralLoadAtEnrollment) {
      toast.error(
        "Ensure ART start date and Baseline viral load are prefilled"
      );
      return;
    }

    if (
      (props?.activeContent?.enrollment?.pregnancyStatusId === 73 ||
        props?.activeContent?.enrollment?.pregnancyStatusId === 75) &&
      otzPlusCapture === ""
    ) {
      toast.error("Otz Plus field is required prefilled");
      return;
    }

    Object.keys(formik?.initialValues).forEach((fieldName) => {
      formik?.setFieldTouched(fieldName, true);
    });
    const errorObj = await formik.validateForm();
    const isValid = Object.keys(errorObj).length === 0;
    if (isValid) {
      submitNewRecord({
        ...formik?.values,
        artStartDate,
        baselineViralLoadAtEnrollment,
        otzPlus: otzPlusCapture !== "" ? otzPlusCapture : undefined,
      });
    }
  };

  const { formik } = useServiceFormValidationSchema(handleSubmit);

  useEffect(() => {
    getOtzOutomes();

    formik.setValues({
      ...formik?.values,
      artStartDate: props?.activeContent?.artCommence?.visitDate,
      baselineViralLoadAtEnrollment: Number(
        props?.activeContent?.currentLabResult?.result
      ),
    });
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
      ...formik?.values,
      dateEnrolledIntoOtz: e?.target?.value,
      dateDone: "",
    });
  };

  const handleFilterNumber = (e, setFieldValue) => {
    // Apply your regex to filter out numbers
    const newValue = e.target.value.replace(/\d/g, "");
    setFieldValue(e.target.name, newValue);
  };

  return (
    <>
      <ToastContainer autoClose={3000} hideProgressBar />
      <div
        className="row page-titles mx-0"
        style={{ marginTop: "0px", marginBottom: "-10px" }}
      ></div>

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
                    OTZ enrollment form
                  </h5>
                  <>
                    <span className="float-end" style={{ cursor: "pointer" }}>
                      <FaPlus />
                    </span>
                  </>
                </div>

                <div className="row p-4">
                  <div className="form-group mb-3 col-md-4">
                    {/* <CustomFormGroup formik={formik} name="artStartDate"> */}
                    <Label>ART start date</Label>
                    <Input
                      name="artStartDate"
                      id="artStartDate"
                      type="date"
                      value={formik?.values?.artStartDate}
                      disabled
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.25rem",
                      }}
                      readOnly
                      {...{
                        max: moment(
                          new Date(props?.activeContent?.artCommence?.visitDate)
                        ).format("YYYY-MM-DD"),
                      }}
                    />
                    {/* </CustomFormGroup> */}
                  </div>

                  <div className="form-group mb-3 col-md-4">
                    {/* <CustomFormGroup formik={formik} name="dateEnrolledIntoOtz"> */}
                    <Label>Date enrolled into OTZ</Label>
                    <Input
                      name="dateEnrolledIntoOtz"
                      id="dateEnrolledIntoOtz"
                      type="date"
                      value={formik?.values?.dateEnrolledIntoOtz}
                      onChange={setCustomDate}
                      onBlur={formik.handleBlur}
                      // disabled={!!currentRecord?.dateEnrolledIntoOtz}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.25rem",
                      }}
                      {...{
                        min: moment(
                          new Date(props?.activeContent?.artCommence?.visitDate)
                        ).format("YYYY-MM-DD"),
                      }}
                      {...{
                        max: moment(Date.now()).format("YYYY-MM-DD"),
                      }}
                    />
                    {/* </CustomFormGroup> */}
                    {formik?.touched?.dateEnrolledIntoOtz &&
                    formik?.errors?.dateEnrolledIntoOtz !== "" ? (
                      <span className={classes.error}>
                        {formik?.errors?.dateEnrolledIntoOtz}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  {props?.activeContent?.enrollment?.pregnancyStatusId === 73 ||
                  props?.activeContent?.enrollment?.pregnancyStatusId === 75 ? (
                    <div className="form-group mb-3 col-md-4">
                      {/* <CustomFormGroup formik={formik} name="otzPlus"> */}
                      <Label>OTZ plus</Label>
                      <Input
                        name="otzPlus"
                        id="otzPlus"
                        type="select"
                        // disabled={!!currentRecord?.otzPlus}
                        value={otzPlusCapture}
                        onChange={(e) => setOtzCapture(e.target.value)}
                        // onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.25rem",
                        }}
                      >
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </Input>
                      {/* </CustomFormGroup> */}
                      {formik?.touched?.otzPlus &&
                      formik?.errors?.otzPlus !== "" ? (
                        <span className={classes.error}>
                          {formik?.errors?.otzPlus}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : null}

                  <div className="form-group mb-3 col-md-4">
                    {/* <CustomFormGroup
                      formik={formik}
                      name="baselineViralLoadAtEnrollment"
                    > */}
                    <Label>
                      Baseline Viral Load At Enrollment into OTZ (copies/ml)
                    </Label>
                    <Input
                      name="baselineViralLoadAtEnrollment"
                      id="baselineViralLoadAtEnrollment"
                      type="number"
                      value={Number(
                        props?.activeContent?.currentLabResult?.result
                      )}
                      // onChange={formik.handleChange}
                      // onBlur={formik.handleBlur}
                      readOnly
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.25rem",
                      }}
                    ></Input>
                    {/* </CustomFormGroup> */}
                    {formik?.errors?.baselineViralLoadAtEnrollment !== "" ? (
                      <span className={classes.error}>
                        {formik?.errors?.baselineViralLoadAtEnrollment}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="form-group mb-3 col-md-6">
                    {/* <CustomFormGroup formik={formik} name="dateDone"> */}
                    <Label>Date viral load test done</Label>
                    <Input
                      name="dateDone"
                      id="dateDone"
                      type="date"
                      {...{
                        min: moment(
                          new Date(props?.activeContent?.artCommence?.visitDate)
                        ).format("YYYY-MM-DD"),
                      }}
                      {...{
                        max: moment(Date.now()).format("YYYY-MM-DD"),
                      }}
                      value={formik?.values?.dateDone}
                      onChange={formik?.handleChange}
                      onBlur={formik?.handleBlur}
                      disabled={!formik?.values?.dateEnrolledIntoOtz}
                      style={{
                        border: "1px solid #014D88",
                        borderRadius: "0.25rem",
                      }}
                    />
                    {/* </CustomFormGroup> */}
                    {formik?.touched?.dateDone &&
                    formik?.errors?.dateDone !== "" ? (
                      <span className={classes.error}>
                        {formik?.errors?.dateDone}
                      </span>
                    ) : (
                      ""
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
                  onClick={handleSubmit}
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

export default EnrollmentOtz;
