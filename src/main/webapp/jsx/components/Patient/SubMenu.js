import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown, Menu, Segment } from "semantic-ui-react";
import { url as baseUrl, token } from "../../../api";
import { queryClient } from "../../../utils/queryClient";
import ButtonMui from "@material-ui/core/Button";
import { TiArrowBack } from "react-icons/ti";
import { makeStyles } from "@material-ui/core";
import { toast } from "react-toastify";
import { Button } from "semantic-ui-react";
import { fas } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  transferOut: {
    pointerEvents: "none",
    opacity: 0.88,
  },
  disabled: {
    cursor: "not-allowed",
  },
}));

function SubMenu(props) {
  const [activeItem, setActiveItem] = useState("recent-history");
  const patientObj = props.patientObj;
  const [currentStatus, setCurrentStatus] = useState("");
  const [isOtzEnrollementDone, setIsOtzEnrollementDone] = useState(null);
  const [labResult, setLabResult] = useState(null);
  const patientCurrentStatus =
    props.patientObj && currentStatus === "Died (Confirmed)" ? true : false;
  const { transferOut } = useStyles();
  const [shouldDeactivateButton, setShouldDeactivateButton] = useState(false);
  const [isPatientActive, setIsPatientActive] = useState(true);
  const getCurrentStatus = () => {
    localStorage.removeItem("currentStatus")
    axios
      .get(
        `${baseUrl}hiv/patient-current/${props.patientObj.id}?commenced=${props.patientObj.commenced}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((resp) => {
        localStorage.setItem("currentStatus", resp.data);
        setCurrentStatus(resp.data);
        setIsPatientActive(
          resp?.data?.toLocaleLowerCase()?.includes("stopped") ? false : true
        );
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getCurrentStatus();
  }, []);

  //Get list
  const Observation = () => {
    axios
      .get(`${baseUrl}observation/person/${props.patientObj.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {})
      .catch((error) => {});
  };
  const loadEAC = (row) => {
    setActiveItem("eac");
    props.setActiveContent({
      ...props.activeContent,
      route: "counseling",
      activeTab: "home",
    });
  };

  const loadPharmacyModal = (row) => {
    setActiveItem("pharmacy");
    props.setActiveContent({
      ...props.activeContent,
      route: "pharmacy",
      activeTab: "drug-refill",
    });
  };

  const loadLaboratoryOrderResult = (row) => {
    setActiveItem("lab");
    props.setActiveContent({
      ...props.activeContent,
      route: "laboratoryOrderResult",
      activeTab: "labOrder",
    });
  };

  const loadLaboratoryViralLoadOrderResult = (row) => {
    setActiveItem("lab");
    props.setActiveContent({
      ...props.activeContent,
      route: "laboratoryViralLoadOrderResult",
      activeTab: "viralLoad",
    });
  };

  const loadCervicalCancer = (row) => {
    setActiveItem("cancer");
    props.setActiveContent({
      ...props.activeContent,
      route: "cervical-cancer",
    });
  };

  const onClickConsultation = (row) => {
    setActiveItem("visit");
    props.setActiveContent({
      ...props.activeContent,
      route: "consultation",
      activeTab: "home",
    });
  };
  const onClickHome = (row) => {
    setActiveItem("home");
    props.setActiveContent({ ...props.activeContent, route: "recent-history" });
  };

  const loadTrackingForm = (row) => {
    setActiveItem("tracking");
    props.setActiveContent({
      ...props.activeContent,
      route: "tracking-form",
      activeTab: "home",
    });
  };
  const loadAdultEvaluation = (row) => {
    setActiveItem("initial");
    props.setActiveContent({
      ...props.activeContent,
      route: "adult-evaluation",
    });
  };
  const loadPatientHistory = () => {
    setActiveItem("history");
    props.setActiveContent({
      ...props.activeContent,
      route: "patient-history",
    });
  };
  const loadIntensiveForm = () => {
    setActiveItem("intensive");
    props.setActiveContent({
      ...props.activeContent,
      route: "intensive-followup",
    });
  };

  const clientVerificationForm = () => {
    setActiveItem("client-verfication-form");
    props.setActiveContent({
      ...props.activeContent,
      route: "client-verfication-form",
    });
  };

  const DsdServiceForm = () => {
    setActiveItem("dsd-service-form");
    props.setActiveContent({
      ...props.activeContent,
      route: "dsd-service-form",
    });
  };

  const loadTransferForm = () => {
    setActiveItem("transfer");
    props.setActiveContent({ ...props.activeContent, route: "transfer-form" });
  };
  const loadArtCommencement = () => {
    setActiveItem("art");
    props.setActiveContent({
      ...props.activeContent,
      route: "art-commencementPage",
    });
  };
  const loadChronicCare = () => {
    setActiveItem("chronic-care");
    props.setActiveContent({
      ...props.activeContent,
      route: "chronic-care",
      activeTab: "home",
    });
  };
  const loadOtzServiceForm = () => {
    //Please do not remove
    queryClient.invalidateQueries();
    // refetch();
    setActiveItem("otz-service-form");
    props.setActiveContent({
      ...props.activeContent,
      ...props.expandedPatientObj,
      route: "otz-service-form",
      actionType: "create",
    });
  };
  const loadOtzEnrollmentForm = () => {
    //Please do not remove
    queryClient.invalidateQueries();
    // refetch();
    setActiveItem("otz-enrollment-form");
    props.setActiveContent({
      ...props.activeContent,
      ...props.expandedPatientObj,
      currentLabResult: labResult,
      route: "otz-enrollment-form",
      actionType: "create",
    });
  };

  const loadOtzCheckList = () => {
    setActiveItem("otz-peadiatric-disclosure-checklist");
    props.setActiveContent({
      ...props.activeContent,
      route: "otz-peadiatric-disclosure-checklist",
      actionType: "create",
    });
  };
  const loadOtzRegister = () => {
    setActiveItem("otz-register");
    props.setActiveContent({ ...props.activeContent, route: "otz-register" });
  };

  const fetchObservationData = async (id) => {
    try {
      const response = await axios.get(`${baseUrl}observation/person/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const patientDTO = response?.data;
      const otzData =
        patientDTO?.filter?.((item) => item?.type === "Service OTZ")?.[0] ||
        null;
      if (otzData) {
        setIsOtzEnrollementDone(true);
      } else {
        setIsOtzEnrollementDone(false);
      }
    } catch (error) {
      setIsOtzEnrollementDone(false);
      throw error; // Re-throw the error to be caught in the calling function
    }
  };

  useEffect(() => {
    const getCurrentLabResult = async (id) => {
      try {
        const response = await axios.get(
          `${baseUrl}laboratory/vl-results/patients/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = response.data;
        if (data.length > 0) {
          const lastItem = data[data.length - 1];
          setLabResult(lastItem);
        }
        await fetchObservationData(id);
      } catch (error) {
        if (error.response && error.response.data) {
          const errorMessage =
            error.response.data.apierror &&
            error.response.data.apierror.message !== ""
              ? error.response.data.apierror.message
              : "Something went wrong, please try again";
          toast.error(errorMessage);
        } else {
          toast.error("Something went wrong. Please try again...");
        }
      }
    };

    if (props?.patientObj?.id) {
      getCurrentLabResult(props.patientObj.id);
    }
  }, [props?.patientObj?.id]);

  useEffect(() => {
    if (props.patientObj && props.patientObj !== null) {
      fetchObservationData(props.patientObj.id);
    }
  }, [props.patientObj]);

  const updateCurrentEnrollmentStatus = () => {
    axios
      .post(
        `${baseUrl}hiv/status/activate-stop_status/${props.patientObj.personUuid}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        if (response.status === 204) {
          setIsPatientActive(true);
          toast.success("Patient reactivated succesfully");
        }
        props.setActiveContent({
          ...props.activeContent,
          route: "recent-history",
        });
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          let errorMessage =
            error.response.data && error.response.data.apierror.message !== ""
              ? error.response.data.apierror.message
              : "Something went wrong, please try again";
          toast.error(errorMessage);
        }
      });
  };

  const getPatientActivities = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}hiv/patients/${patientObj.id}/history/activities`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const activities = response.data;
      const lastActivity = activities.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      )[0];

      const isRecentActivityTransfer =
        lastActivity?.name === "ART Transfer In" ||
        lastActivity?.name === "ART Transfer Out";

      const isToday =
        new Date(lastActivity?.date).toDateString() ===
        new Date().toDateString();

      return isRecentActivityTransfer && isToday;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  useEffect(() => {
    const checkPatientActivities = async () => {
      const result = await getPatientActivities();
      setShouldDeactivateButton(result);
    };
    checkPatientActivities();
  }, []);

  return (
    <div>
      <div>
        {props.patientObj && props.patientObj !== null && (
          <Segment inverted>
            {(patientObj.commenced === false ||
              patientObj.createBy.toUpperCase() !==
                "LAMIS DATA MIGRATION SYSTEM") &&
            (patientObj.commenced !== true ||
              patientObj.clinicalEvaluation !== true) ? (
              <Menu size="tiny" color={"blue"} inverted pointing>
                <Menu.Item
                  onClick={() => onClickHome()}
                  name="home"
                  active={activeItem === "recent-history"}
                  title="Home"
                >
                  {" "}
                  Home
                </Menu.Item>

                {!patientObj.clinicalEvaluation && (
                  <Menu.Item
                    onClick={() => loadAdultEvaluation()}
                    name="initial"
                    active={activeItem === "initial"}
                    title="Initial Evaluation"
                  >
                    {" "}
                    Initial Evaluation
                  </Menu.Item>
                )}
                {!patientObj.commenced && (
                  <Menu.Item
                    onClick={() => loadArtCommencement()}
                    name="art"
                    active={activeItem === "art"}
                    title="Art Commencement"
                  >
                    Art Commencement
                  </Menu.Item>
                )}

                <Menu.Item
                  onClick={() => loadPatientHistory(patientObj)}
                  name="history"
                  active={activeItem === "history"}
                  title="History"
                >
                  History
                </Menu.Item>
              </Menu>
            ) : (
              <>
                {currentStatus === "DIED (CONFIRMED)" ||
                  currentStatus === "ART TRANSFER OUT" ? (
                  <Menu
                    size="tiny"
                    style={{
                      backgroundColor: "rgb(153, 46, 98)",
                      color: "#fff",
                    }}
                    inverted
                  >
                    <Menu.Item
                      onClick={() => onClickHome()}
                      name="home"
                      active={activeItem === "recent-history"}
                      title="Home"
                    >
                      Home
                    </Menu.Item>
                    {currentStatus === "DIED (CONFIRMED)" && (
                      <Menu.Item
                        onClick={() => loadTrackingForm(patientObj)}
                        name="tracking"
                        active={activeItem === "tracking"}
                        title="Tracking Form"
                      ></Menu.Item>
                    )}
                    <Menu.Item
                      onClick={() => loadPatientHistory(patientObj)}
                      name="history"
                      active={activeItem === "history"}
                      title="History"
                    >
                      History
                    </Menu.Item>
                    {currentStatus === "ART TRANSFER OUT" && (
                      <Menu.Item
                        onClick={() => loadTransferForm(patientObj)}
                        name="transfer"
                        active={activeItem === "transfer"}
                        title="Transfer"
                        disabled={shouldDeactivateButton}
                      >
                        <Button
                          disabled={shouldDeactivateButton}
                          size="mini"
                          style={{
                            backgroundColor: "green",
                            color: "#fff",
                            marginRight: "10px",
                          }}
                        >
                          Activate
                        </Button>
                      </Menu.Item>
                    )}
                  </Menu>
                ) : (
                  <Menu size="tiny" color={"black"} inverted>
                    <Menu.Item
                      onClick={() => onClickHome()}
                      disabled={patientCurrentStatus}
                      name="home"
                      active={activeItem === "recent-history"}
                      title="Home"
                    >
                      {" "}
                      Home
                    </Menu.Item>

                    {isPatientActive && (
                      <>
                        {!patientObj.clinicalEvaluation &&
                          patientObj.createBy.toUpperCase() ===
                            "LAMIS DATA MIGRATION SYSTEM" && (
                            <Menu.Item
                              onClick={() => loadAdultEvaluation()}
                              name="initial"
                              active={activeItem === "initial"}
                              title="Initial Evaluation"
                            >
                              Initial Evaluation
                            </Menu.Item>
                          )}
                        {
                          <Menu.Item
                            onClick={() => loadChronicCare(patientObj)}
                            name="chronic care"
                            active={activeItem === "chronic-care"}
                          >
                            Care & Support
                          </Menu.Item>
                        }
                        <Menu.Item
                          onClick={() => onClickConsultation()}
                          disabled={patientCurrentStatus}
                          name="visit"
                          active={activeItem === "visit"}
                          title="Care Card"
                        >
                          Care Card
                        </Menu.Item>

                        <Menu.Menu
                          position=""
                          name="lab"
                          active={activeItem === "lab"}
                        >
                          <Dropdown item text="Laboratory">
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() => loadLaboratoryOrderResult()}
                                disabled={patientCurrentStatus}
                                title="Laboratory Order & Result"
                              >
                                Laboratory Order & Result
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() =>
                                  loadLaboratoryViralLoadOrderResult()
                                }
                                disabled={patientCurrentStatus}
                                title="Viral Load Order & Result"
                              >
                                Viral Load Order & Result
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </Menu.Menu>
                        <Menu.Item
                          onClick={() => loadPharmacyModal()}
                          disabled={patientCurrentStatus}
                          name="pharmacy"
                          active={activeItem === "pharmacy"}
                          title="Pharmacy"
                        >
                          Pharmacy
                        </Menu.Item>
                        <Menu.Item
                          onClick={() => loadEAC(patientObj)}
                          disabled={patientCurrentStatus}
                          name="eac"
                          active={activeItem === "eac"}
                          title="EAC"
                        >
                          EAC
                        </Menu.Item>

                        {(props.patientObj.sex === "Female" ||
                          props.patientObj.sex === "FEMALE" ||
                          props.patientObj.sex === "female") && (
                          <Menu.Item
                            onClick={() => loadCervicalCancer(patientObj)}
                            name="cancer"
                            active={activeItem === "cancer"}
                            title="Cervical Cancer"
                          >
                            Cervical Cancer
                          </Menu.Item>
                        )}

                        <Menu.Menu
                          position=""
                          name="lab"
                          active={activeItem === "lab"}
                        >
                          <Dropdown item text="Other Forms">
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() => loadTrackingForm(patientObj)}
                                name="tracking"
                                active={activeItem === "tracking"}
                                title="Tracking Form"
                              >
                                Tracking Form
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => loadIntensiveForm(patientObj)}
                                name="intensive"
                                active={activeItem === "intensive"}
                                title="Intensive Follow Up"
                              >
                                Intensive Follow Up
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() =>
                                  clientVerificationForm(patientObj)
                                }
                                name="clientVerificationForm"
                                active={activeItem === "clientVerificationForm"}
                                title="Client Verification Form"
                              >
                                Client Verification Form
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => DsdServiceForm(patientObj)}
                                name="DsdServiceForm"
                                active={activeItem === "DsdServiceForm"}
                                title="DSD ASSESSMENT AND ACCEPTANCE FORM"
                              >
                                Dsd Service Form
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>

                          {(patientObj?.age >= 10 && patientObj?.age <= 23) ||
                          patientObj.age <= 19 ? (
                            <Dropdown item text="OTZ">
                              <Dropdown.Menu>
                                {patientObj?.age >= 10 &&
                                  patientObj?.age <= 23 && (
                                    <>
                                      {isOtzEnrollementDone === null ? (
                                        <Dropdown.Item>
                                          Checking patient enrollment...
                                        </Dropdown.Item>
                                      ) : isOtzEnrollementDone === false ? (
                                        <Dropdown.Item
                                          onClick={() =>
                                            loadOtzEnrollmentForm()
                                          }
                                          name="OTZ Enrollment Form"
                                          active={
                                            activeItem === "otz-enrollment-form"
                                          }
                                          title="Enrollment Form"
                                        >
                                          OTZ Enrollment Form
                                        </Dropdown.Item>
                                      ) : null}

                                      {isOtzEnrollementDone ? (
                                        <Dropdown.Item
                                          onClick={() => loadOtzServiceForm()}
                                          name="OTZ Service Form"
                                          active={
                                            activeItem === "otz-service-form"
                                          }
                                          title="Tracking Form"
                                        >
                                          OTZ Service Form
                                        </Dropdown.Item>
                                      ) : null}
                                    </>
                                  )}

                                {patientObj.age <= 19 && (
                                  <Dropdown.Item
                                    onClick={() => loadOtzCheckList()}
                                    name="Peadiatric Disclosure Checklist"
                                    active={
                                      activeItem ===
                                      "otz-peadiatric-disclosure-checklist"
                                    }
                                    title="Peadiatric Disclosure Checklist"
                                  >
                                    Peadiatric Disclosure Checklist
                                  </Dropdown.Item>
                                )}
                              </Dropdown.Menu>
                            </Dropdown>
                          ) : null}
                        </Menu.Menu>

                        <Menu.Item
                          onClick={() => loadTransferForm(patientObj)}
                          name="transfer"
                          active={activeItem === "transfer"}
                          title="Transfer"
                          disabled={shouldDeactivateButton}
                        >
                          Transfer
                        </Menu.Item>
                      </>
                    )}
                    <Menu.Item
                      onClick={() => loadPatientHistory(patientObj)}
                      name="history"
                      active={activeItem === "history"}
                      title="History"
                    >
                      History
                    </Menu.Item>
                    {!isPatientActive && (
                      <ButtonMui
                        onClick={() => {
                          updateCurrentEnrollmentStatus();
                        }}
                        variant="contained"
                        color="primary"
                        className=" float-end ms-2 mr-2 mt-2"
                        startIcon={<TiArrowBack />}
                        style={{
                          backgroundColor: "green",
                          color: "#fff",
                          height: "35px",
                        }}
                      >
                        <span style={{ textTransform: "capitalize" }}>
                          Reactivate
                        </span>
                      </ButtonMui>
                    )}
                    {/* } */}
                  </Menu>
                )}
              </>
            )}
          </Segment>
        )}
      </div>
    </div>
  );
}

export default SubMenu;
