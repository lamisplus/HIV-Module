import React, { Fragment, useState, useEffect } from "react";
// BS
import { Dropdown } from "react-bootstrap";
/// Scroll
import { makeStyles } from "@material-ui/core/styles";
import PerfectScrollbar from "react-perfect-scrollbar";
//import { Link } from "react-router-dom";
import axios from "axios";
import { url as baseUrl, token } from "../../../api";
import { Alert } from "react-bootstrap";
import { Card, Accordion } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import "react-widgets/dist/css/react-widgets.css";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import { Button } from "semantic-ui-react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: "bolder",
  },
}));
const RecentHistory = (props) => {
  const classes = useStyles();
  const [vitaLoad, setViralLoad] = useState([]);
  const [refillList, setRefillList] = useState([]);
  const [clinicVisitList, setClinicVisitList] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [loadingLab, setLoadingLab] = useState(true);
  const [toggleFacSelect, settoggleFacSelect] = useState(false);

  const [loadingPharmacy, setLoadingPharmacy] = useState(true);
  const [notToBeUpdated, setNotToBeUpdated] = useState([
    "eac",
    "eac-session",
    "client-tracker",
  ]);
  let history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = useState(false);
  const [record, setRecord] = useState(null);
  const toggle = () => setOpen(!open);
  const [activeAccordionHeaderShadow, setActiveAccordionHeaderShadow] =
    useState(0);

  useEffect(() => {
    if (props.patientObj && props.patientObj !== null) {
      LaboratoryHistory();
      PharmacyList();
      ClinicVisitList();
      RecentActivities();
    }
  }, [props.patientObj]);

  //Get list of LaboratoryHistory
  const RecentActivities = () => {
    axios
      .get(
        `${baseUrl}hiv/patients/${props.patientObj.id}/activities?full=false`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setLoadingRecent(false);
        setRecentActivities(response.data);
      })
      .catch((error) => {
        setLoadingRecent(false);
        //console.log(error);
      });
  };
  //Get list of LaboratoryHistory
  const LaboratoryHistory = () => {
    axios
      .get(
        `${baseUrl}laboratory/rde-all-orders/patients/${props.patientObj.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        //console.log(response.data)
        setLoadingLab(false);
        //  let LabObject= []
        //       response.data.forEach(function(value, index, array) {
        //           const dataOrders = value.labOrder.tests
        //           if(dataOrders[index]) {
        //               dataOrders.forEach(function(value, index, array) {
        //                   LabObject.push(value)
        //               })
        //           }
        //       });
        setViralLoad(response.data);
      })
      .catch((error) => {
        setLoadingLab(false);
        //console.log(error);
      });
  };
  //GET LIST Drug Refill
  const PharmacyList = () => {
    setLoading(true);
    axios
      .get(
        `${baseUrl}hiv/art/pharmacy/patient?pageNo=0&pageSize=10&personId=${props.patientObj.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        //console.log(response.data)
        setLoading(false);
        setLoadingPharmacy(false);
        setRefillList(response.data);
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  //GET LIST Drug Refill
  const ClinicVisitList = () => {
    setLoading(true);
    axios
      .get(
        `${baseUrl}hiv/art/clinic-visit/person?pageNo=0&pageSize=10&personId=${props.patientObj.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setLoading(false);
        setClinicVisitList(response.data);
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  const labStatus = (status) => {
    const orderStatus = parseInt(status);
    if (orderStatus === 0) {
      return "timeline-badge info";
    } else if (orderStatus === 1) {
      return "timeline-badge warning";
    } else if (orderStatus === 2) {
      return "timeline-badge success";
    } else if (orderStatus === 3) {
      return "timeline-badge danger";
    } else if (orderStatus === 4) {
      return "timeline-badge primary";
    } else if (orderStatus === 5) {
      return "timeline-badge info";
    } else {
      return "timeline-badge secondary";
      //return "timeline-badge info"
    }
  };
  const ActivityName = (name) => {
    if (name === "HIV Enrollment") {
      return "HE";
    } else if (name === "Pharmacy refill") {
      return "PR";
    } else if (name === "Clinical evaluation") {
      return "CE";
    } else if (name === "Clinic visit follow up") {
      return "CV";
    } else if (name === "ART Commencement") {
      return "AC";
    } else {
      return "RA";
    }
  };
  const regimenName = (regimenObj) => {
    //console.log(regimenObj)
    let regimenArr = [];
    regimenObj &&
      regimenObj.forEach(function (value, index, array) {
        //console.log(value)
        regimenArr.push(value["name"]);
      });
    return regimenArr.toString();
  };
  const LoadViewPage = (row, action) => {
    if (row.path === "Mental-health") {
      props.setActiveContent({
        ...props.activeContent,
        route: "mental-health-view",
        id: row.id,
        actionType: action,
      });
    } else if (row.path === "Art-commence") {
      props.setActiveContent({
        ...props.activeContent,
        route: "art-commencement-view",
        id: row.id,
        actionType: action,
      });
    } else if (row.path === "Clinical-evaluation") {
      props.setActiveContent({
        ...props.activeContent,
        route: "adult-clinic-eveluation-view",
        id: row.id,
        actionType: action,
      });
    } else if (row.path === "eac1") {
      props.setActiveContent({
        ...props.activeContent,
        route: "first-eac-history",
        id: row.id,
        actionType: action,
      });
    } else if (row.path === "eac2") {
      props.setActiveContent({
        ...props.activeContent,
        route: "second-eac-history",
        id: row.id,
        actionType: action,
      });
    } else if (row.path === "eac3") {
      props.setActiveContent({
        ...props.activeContent,
        route: "completed-eac-history",
        id: row.id,
        actionType: action,
      });
    } else if (row.path === "hiv-enrollment") {
      history.push({
        pathname: "/update-patient",
        state: { id: row.id, patientObj: props.patientObj, actionType: action },
      });
      //props.setActiveContent({...props.activeContent, route:'mental-health-history', id:row.id})
    } else if (row.path === "pharmacy") {
      //props.setActiveContent({...props.activeContent, route:'mental-health-history', id:row.id})
      props.setActiveContent({
        ...props.activeContent,
        route: "pharmacy-update",
        id: row.id,
        activeTab: "history",
        actionType: action,
        obj: row,
      });
    } else if (row.path === "Laboratory") {
      props.setActiveContent({
        ...props.activeContent,
        route: "mental-health-history",
        id: row.id,
        actionType: action,
      });
    } else if (row.path === "clinic-visit") {
      props.setActiveContent({
        ...props.activeContent,
        route: "consultation",
        id: row.id,
        activeTab: "history",
        actionType: action,
      });
    } else if (row.path === "Intensive-follow-up") {
      props.setActiveContent({
        ...props.activeContent,
        route: "intensive-follow-up-update",
        id: row.id,
        activeTab: "history",
        actionType: action,
      });
    } else if (row.path === "Client-verfication-form") {
      props.setActiveContent({
        ...props.activeContent,
        route: "client-verfication-form-update",
        id: row.id,
        activeTab: "history",
        actionType: action,
      });
    } else if (row.path === "client-tracker") {
      props.setActiveContent({
        ...props.activeContent,
        route: "client-tracker",
        id: row.id,
        activeTab: "history",
        actionType: action,
      });
    } else if (row.path === "eac-session") {
      props.setActiveContent({
        ...props.activeContent,
        route: "eac-session-update",
        id: row.id,
        activeTab: "history",
        actionType: action,
      });
    } else if (row.path === "Cervical-cancer") {
      props.setActiveContent({
        ...props.activeContent,
        route: "cervical-cancer-update",
        id: row.id,
        activeTab: "history",
        actionType: action,
      });
    } else if (row.path === "Client-Verification") {
      props.setActiveContent({
        ...props.activeContent,
        route: "client-verfication-form",
        id: row.id,
        activeTab: "history",
        actionType: action,
      });
    } else if (row.path === "Chronic-Care") {
      props.setActiveContent({
        ...props.activeContent,
        route: "chronic-care",
        id: row.id,
        activeTab: "home",
        actionType: action,
      });
    } else if (row.path === "Transfer") {
      props.setActiveContent({
        ...props.activeContent,
        route: "filled-transferForm",
        id: row.id,
        activeTab: "home",
        actionType: action,
      });
    } else {
    }
  };
  const LoadDeletePage = (row) => {
    if (row.path === "Mental-health") {
      setSaving(true);
      //props.setActiveContent({...props.activeContent, route:'mental-health-view', id:row.id})
      axios
        .delete(`${baseUrl}observation/${row.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          toast.success("Record Deleted Successfully");
          RecentActivities();
          toggle();
          setSaving(false);
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            let errorMessage =
              error.response.data.apierror &&
              error.response.data.apierror.message !== ""
                ? error.response.data.apierror.message
                : "Something went wrong, please try again";
            toast.error(errorMessage);
          } else {
            toast.error("Something went wrong. Please try again...");
          }
        });
    } else if (row.path === "Art-commence") {
      setSaving(true);
      //props.setActiveContent({...props.activeContent, route:'art-commencement-view', id:row.id})
      axios
        .delete(`${baseUrl}hiv/art/commencement/${row.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          toast.success("Record Deleted Successfully");
          RecentActivities();
          toggle();
          setSaving(false);
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            let errorMessage =
              error.response.data.apierror &&
              error.response.data.apierror.message !== ""
                ? error.response.data.apierror.message
                : "Something went wrong, please try again";
            toast.error(errorMessage);
          } else {
            toast.error("Something went wrong. Please try again...");
          }
        });
    } else if (row.path === "Clinical-evaluation") {
      setSaving(true);
      //props.setActiveContent({...props.activeContent, route:'adult-clinic-eveluation-view', id:row.id})
      axios
        .delete(`${baseUrl}observation/${row.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          toast.success("Record Deleted Successfully");
          RecentActivities();
          toggle();
          setSaving(false);
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            let errorMessage =
              error.response.data.apierror &&
              error.response.data.apierror.message !== ""
                ? error.response.data.apierror.message
                : "Something went wrong, please try again";
            toast.error(errorMessage);
          } else {
            toast.error("Something went wrong. Please try again...");
          }
        });
    } else if (row.path === "eac1") {
      setSaving(true);
      //props.setActiveContent({...props.activeContent, route:'first-eac-history', id:row.id})
      axios
        .delete(`${baseUrl}observation/eac/${row.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          toast.success("Record Deleted Successfully");
          RecentActivities();
          toggle();
          setSaving(false);
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            let errorMessage =
              error.response.data.apierror &&
              error.response.data.apierror.message !== ""
                ? error.response.data.apierror.message
                : "Something went wrong, please try again";
            toast.error(errorMessage);
          } else {
            toast.error("Something went wrong. Please try again...");
          }
        });
    } else if (row.path === "eac2") {
      setSaving(true);
      //props.setActiveContent({...props.activeContent, route:'second-eac-history', id:row.id})
      axios
        .delete(`${baseUrl}observation/eac/${row.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          toast.success("Record Deleted Successfully");
          RecentActivities();
          toggle();
          setSaving(false);
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            let errorMessage =
              error.response.data.apierror &&
              error.response.data.apierror.message !== ""
                ? error.response.data.apierror.message
                : "Something went wrong, please try again";
            toast.error(errorMessage);
          } else {
            toast.error("Something went wrong. Please try again...");
          }
        });
    } else if (row.path === "eac3") {
      setSaving(true);
      //props.setActiveContent({...props.activeContent, route:'completed-eac-history', id:row.id})
      axios
        .delete(`${baseUrl}observation/eac/${row.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          toast.success("Record Deleted Successfully");
          RecentActivities();
          toggle();
          setSaving(false);
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            let errorMessage =
              error.response.data.apierror &&
              error.response.data.apierror.message !== ""
                ? error.response.data.apierror.message
                : "Something went wrong, please try again";
            toast.error(errorMessage);
          } else {
            toast.error("Something went wrong. Please try again...");
          }
        });
    } else if (row.path === "hiv-enrollment") {
      setSaving(true);
      axios
        .delete(`${baseUrl}hiv/enrollment/${row.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          toast.success("Record Deleted Successfully");
          RecentActivities();
          toggle();
          setSaving(false);
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            let errorMessage =
              error.response.data.apierror &&
              error.response.data.apierror.message !== ""
                ? error.response.data.apierror.message
                : "Something went wrong, please try again";
            toast.error(errorMessage);
          } else {
            toast.error("Something went wrong. Please try again...");
          }
        });
      //props.setActiveContent({...props.activeContent, route:'mental-health-history', id:row.id})
    } else if (row.path === "pharmacy") {
      setSaving(true);
      //props.setActiveContent({...props.activeContent, route:'mental-health-history', id:row.id})
      //props.setActiveContent({...props.activeContent, route:'pharmacy', id:row.id, activeTab:"home", actionType:"update", obj:row})
      axios
        .delete(`${baseUrl}hiv/art/pharmacy/${row.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          toast.success("Record Deleted Successfully");
          RecentActivities();
          toggle();
          setSaving(false);
        })
        .catch((error) => {
          setSaving(false);
          if (error.response && error.response.data) {
            let errorMessage =
              error.response.data.apierror &&
              error.response.data.apierror.message !== ""
                ? error.response.data.apierror.message
                : "Something went wrong, please try again";
            toast.error(errorMessage);
          } else {
            toast.error("Something went wrong. Please try again...");
          }
        });
    } else if (row.path === "clinic-visit") {
      setSaving(true);
      //props.setActiveContent({...props.activeContent, route:'mental-health-history', id:row.id})
      axios
        .delete(`${baseUrl}hiv/art/clinic-visit/${row.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          toast.success("Record Deleted Successfully");
          RecentActivities();
          toggle();
          setSaving(false);
        })
        .catch((error) => {
          setSaving(false);
          if (error.response && error.response.data) {
            let errorMessage =
              error.response.data.apierror &&
              error.response.data.apierror.message !== ""
                ? error.response.data.apierror.message
                : "Something went wrong, please try again";
            toast.error(errorMessage);
          } else {
            toast.error("Something went wrong. Please try again...");
          }
        });
    } else if (row.path === "Client-Verification") {
      //Client-Verification
      setSaving(true);
      //props.setActiveContent({...props.activeContent, route:'mental-health-history', id:row.id})
      axios
        .delete(`${baseUrl}observation/${row.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          toast.success("Record Deleted Successfully");
          RecentActivities();
          toggle();
          setSaving(false);
        })
        .catch((error) => {
          setSaving(false);
          if (error.response && error.response.data) {
            let errorMessage =
              error.response.data.apierror &&
              error.response.data.apierror.message !== ""
                ? error.response.data.apierror.message
                : "Something went wrong, please try again";
            toast.error(errorMessage);
          } else {
            toast.error("Something went wrong. Please try again...");
          }
        });
    } else if (row.path === "Chronic-Care") {
      setSaving(true);
      //props.setActiveContent({...props.activeContent, route:'mental-health-history', id:row.id})
      axios
        .delete(`${baseUrl}observation/${row.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          toast.success("Record Deleted Successfully");
          RecentActivities();
          toggle();
          setSaving(false);
        })
        .catch((error) => {
          setSaving(false);
          if (error.response && error.response.data) {
            let errorMessage =
              error.response.data.apierror &&
              error.response.data.apierror.message !== ""
                ? error.response.data.apierror.message
                : "Something went wrong, please try again";
            toast.error(errorMessage);
          } else {
            toast.error("Something went wrong. Please try again...");
          }
        });
    } else if (row.path === "Cervical-cancer") {
      setSaving(true);
      //props.setActiveContent({...props.activeContent, route:'mental-health-history', id:row.id})
      axios
        .delete(`${baseUrl}observation/${row.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          toast.success("Record Deleted Successfully");
          RecentActivities();
          toggle();
          setSaving(false);
        })
        .catch((error) => {
          setSaving(false);
          if (error.response && error.response.data) {
            let errorMessage =
              error.response.data.apierror &&
              error.response.data.apierror.message !== ""
                ? error.response.data.apierror.message
                : "Something went wrong, please try again";
            toast.error(errorMessage);
          } else {
            toast.error("Something went wrong. Please try again...");
          }
        });
    } else if (row.path === "Transfer") {
      setSaving(true);
      //props.setActiveContent({...props.activeContent, route:'mental-health-history', id:row.id})
      axios
        .delete(`${baseUrl}observation/${row.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          toast.success("Record Deleted Successfully");
          RecentActivities();
          toggle();
          setSaving(false);
        })
        .catch((error) => {
          setSaving(false);
          if (error.response && error.response.data) {
            let errorMessage =
              error.response.data.apierror &&
              error.response.data.apierror.message !== ""
                ? error.response.data.apierror.message
                : "Something went wrong, please try again";
            toast.error(errorMessage);
          } else {
            toast.error("Something went wrong. Please try again...");
          }
        });
    } else {
    }
  };
  const redirectLink = () => {
    props.setActiveContent({ ...props.activeContent, route: "recent-history" });
  };
  const LoadModal = (row) => {
    toggle();
    setRecord(row);
  };

  return (
    <Fragment>
      {/* <Ext /> */}

      <div className="row">
        <div className="col-xl-4 col-xxl-4 col-lg-4">
          <div className="card">
            <div className="card-header  border-0 pb-0">
              <h4 className="card-title">
                <b>Recent Activities</b>{" "}
              </h4>
            </div>
            <div className="card-body">
              {loadingRecent === false ? (
                <>
                  <PerfectScrollbar
                    style={{ height: "370px" }}
                    id="DZ_W_Todo1"
                    className="widget-media dz-scroll ps ps--active-y"
                  >
                    <Accordion
                      className="accordion accordion-header-bg accordion-header-shadow accordion-rounded "
                      defaultActiveKey="0"
                    >
                      <>
                        {recentActivities.map((data, i) => (
                          <div className="accordion-item" key={i}>
                            <Accordion.Toggle
                              as={Card.Text}
                              eventKey={`${i}`}
                              className={`accordion-header ${
                                activeAccordionHeaderShadow === 1
                                  ? ""
                                  : "collapsed"
                              } accordion-header-info`}
                              onClick={() =>
                                setActiveAccordionHeaderShadow(
                                  activeAccordionHeaderShadow === 1 ? -1 : i
                                )
                              }
                            >
                              <span className="accordion-header-icon"></span>
                              <span className="accordion-header-text">
                                Visit Date :{" "}
                                <span className="">{data.date}</span>{" "}
                              </span>
                              <span className="accordion-header-indicator"></span>
                            </Accordion.Toggle>
                            <Accordion.Collapse
                              eventKey={`${i}`}
                              className="accordion__body"
                            >
                              <div className="accordion-body-text">
                                <ul className="timeline">
                                  {data.activities &&
                                    data.activities.map((activity, index) => (
                                      <>
                                        <li>
                                          <div className="timeline-panel">
                                            <div
                                              className={
                                                index % 2 == 0
                                                  ? "media me-2 media-info"
                                                  : "media me-2 media-success"
                                              }
                                            >
                                              {ActivityName(activity.name)}
                                            </div>
                                            <div className="media-body">
                                              <h5 className="mb-1">
                                                {activity.name ===
                                                "Chronic Care"
                                                  ? "Care and Support"
                                                  : activity.name}
                                              </h5>
                                              <small className="d-block">
                                                {activity.date}
                                              </small>
                                            </div>
                                            {!notToBeUpdated.includes(
                                              activity.path
                                            ) ? (
                                              <Dropdown className="dropdown">
                                                <Dropdown.Toggle
                                                  variant=" light"
                                                  className="i-false p-0 btn-info sharp"
                                                >
                                                  <svg
                                                    width="18px"
                                                    height="18px"
                                                    viewBox="0 0 24 24"
                                                    version="1.1"
                                                  >
                                                    <g
                                                      stroke="none"
                                                      strokeWidth="1"
                                                      fill="none"
                                                      fillRule="evenodd"
                                                    >
                                                      <rect
                                                        x="0"
                                                        y="0"
                                                        width="24"
                                                        height="24"
                                                      />
                                                      <circle
                                                        fill="#000000"
                                                        cx="5"
                                                        cy="12"
                                                        r="2"
                                                      />
                                                      <circle
                                                        fill="#000000"
                                                        cx="12"
                                                        cy="12"
                                                        r="2"
                                                      />
                                                      <circle
                                                        fill="#000000"
                                                        cx="19"
                                                        cy="12"
                                                        r="2"
                                                      />
                                                    </g>
                                                  </svg>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu className="dropdown-menu">
                                                  {activity.viewable && (
                                                    <Dropdown.Item
                                                      className="dropdown-item"
                                                      onClick={() =>
                                                        LoadViewPage(
                                                          activity,
                                                          "view"
                                                        )
                                                      }
                                                    >
                                                      View
                                                    </Dropdown.Item>
                                                  )}
                                                  {activity.viewable && (
                                                    <Dropdown.Item
                                                      className="dropdown-item"
                                                      onClick={() =>
                                                        LoadViewPage(
                                                          activity,
                                                          "update"
                                                        )
                                                      }
                                                    >
                                                      Update
                                                    </Dropdown.Item>
                                                  )}
                                                  {activity.deletable && (
                                                    <Dropdown.Item
                                                      className="dropdown-item"
                                                      to="/widget-basic"
                                                      onClick={() =>
                                                        LoadModal(
                                                          activity,
                                                          "delete"
                                                        )
                                                      }
                                                    >
                                                      Delete
                                                    </Dropdown.Item>
                                                  )}
                                                </Dropdown.Menu>
                                              </Dropdown>
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                        </li>
                                      </>
                                    ))}
                                </ul>
                              </div>
                            </Accordion.Collapse>
                          </div>
                        ))}
                      </>
                    </Accordion>
                  </PerfectScrollbar>
                </>
              ) : (
                <>
                  <p>Loading please wait...</p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-xxl-4 col-lg-4">
          <div className="card">
            <div className="card-header border-0 pb-0">
              <h4 className="card-title">
                <b>Laboratory Orders</b>
              </h4>
            </div>
            <div className="card-body">
              {loadingLab === false ? (
                <>
                  <PerfectScrollbar
                    style={{ height: "370px" }}
                    id="DZ_W_TimeLine"
                    className="widget-timeline dz-scroll height370 ps ps--active-y"
                  >
                    <ul className="timeline">
                      {vitaLoad.length > 0 ? (
                        <>
                          {vitaLoad.map((test, index) => (
                            <>
                              <li key={index}>
                                <div
                                  className={labStatus(test.labTestOrderStatus)}
                                ></div>
                                <span
                                  className="timeline-panel text-muted"
                                  onClick={() => redirectLink()}
                                  //to=""
                                >
                                  <h6 className="mb-0">
                                    Test Order Date <br />
                                    <strong className="text-primary">
                                      {test.dateOrderBy}
                                    </strong>
                                  </h6>
                                  {test.labTestGroupName !== "others" && (
                                    <h6 className="mb-0">
                                      Test Order <br />
                                      <strong className="text-primary">
                                        {test.labTestGroupName +
                                          " - " +
                                          test.labTestName}
                                      </strong>
                                      .
                                    </h6>
                                  )}
                                  {test.labTestGroupName === "others" && (
                                    <h6 className="mb-0">
                                      Test Order <br />
                                      <strong className="text-primary">
                                        {test.labTestName +
                                          " - " +
                                          test.viralLoadIndicationName}
                                      </strong>
                                      .
                                    </h6>
                                  )}

                                  <h6 className="mb-0">
                                    Status <br />
                                    <strong className="text-primary">
                                      {test.labTestOrderStatusName}
                                    </strong>
                                    .
                                  </h6>
                                  {test.labTestOrderStatusName ===
                                    "Result Reported" && (
                                    <>
                                      <h6 className="mb-0">
                                        Date Result Reported <br />
                                        <strong className="text-primary">
                                          {test.dateResultReported}
                                        </strong>
                                        .
                                      </h6>
                                      <h6 className="mb-0">
                                        Result <br />
                                        <strong className="text-primary">
                                          {test.result}
                                        </strong>
                                        .
                                      </h6>
                                    </>
                                  )}
                                </span>
                              </li>
                            </>
                          ))}
                        </>
                      ) : (
                        <Alert
                          variant="info"
                          className="alert-dismissible solid fade show"
                        >
                          <p>No Laboratory Test Order Yet</p>
                        </Alert>
                      )}
                    </ul>
                  </PerfectScrollbar>
                </>
              ) : (
                <>
                  <p>Loading please wait...</p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-xxl-4 col-lg-4">
          <div className="card">
            <div className="card-header border-0 pb-0">
              <h3 className="card-title">
                <b>Refill Summary</b>
              </h3>
            </div>
            <div className="card-body">
              {loadingPharmacy === false ? (
                <>
                  <PerfectScrollbar
                    style={{ height: "370px" }}
                    id="DZ_W_TimeLine1"
                    className="widget-timeline dz-scroll style-1 height370 ps ps--active-y"
                  >
                    <ul className="timeline">
                      {refillList && refillList.length > 0 ? (
                        <>
                          {refillList.map((regimen, index) => (
                            <>
                              <li key={index}>
                                <div
                                  className={
                                    index % 2 == 0
                                      ? "timeline-badge info"
                                      : "timeline-badge success"
                                  }
                                ></div>
                                <span
                                  className="timeline-panel text-muted"
                                  onClick={() => redirectLink()}
                                  //to=""
                                >
                                  <h6 className="mb-0">
                                    Regimen
                                    {regimenName(
                                      regimen && regimen.extra
                                        ? regimen.extra.regimens
                                        : null
                                    )}
                                  </h6>
                                  <strong className="text-teal">
                                    Refill Duration
                                    <br />
                                    {regimen.refillPeriod}
                                  </strong>
                                  <br />
                                  <strong className="text-black">
                                    Visit Date
                                    <br />
                                    {regimen.visitDate}
                                  </strong>
                                  <br />
                                  <strong className="text-warning">
                                    Next Appointment
                                    <br />
                                    {regimen.nextAppointment}
                                  </strong>
                                </span>
                              </li>
                            </>
                          ))}
                        </>
                      ) : (
                        <Alert
                          variant="info"
                          className="alert-dismissible solid fade show"
                        >
                          <p>No Pharmacy Drug Refill</p>
                        </Alert>
                      )}
                    </ul>
                  </PerfectScrollbar>
                </>
              ) : (
                <>
                  <p>Loading please wait...</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={open}
        toggle={toggle}
        className="fade"
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Notification!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>
            Are you Sure you want to delete{" "}
            <b>
              {record && record.name === "Chronic Care"
                ? "Care and Support"
                : record && record.name}
            </b>
          </h4>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => LoadDeletePage(record)}
            style={{ backgroundColor: "red", color: "#fff" }}
            disabled={saving}
          >
            {saving === false ? "Yes" : "Deleting..."}
          </Button>
          <Button
            onClick={toggle}
            style={{ backgroundColor: "#014d88", color: "#fff" }}
            disabled={saving}
          >
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default RecentHistory;
