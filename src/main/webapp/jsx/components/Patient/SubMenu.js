import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown, Menu, Segment } from "semantic-ui-react";
import { url as baseUrl, token } from "../../../api";
import { YouTube } from "@material-ui/icons";
import { queryClient } from "../../../utils/queryClient";
import { GET_CURRENT_LAB_RECORD } from "../../../utils/queryKeys";
import { getCurrentLabResult } from "../../services/getCurrentLabResult";
import { useQuery} from "react-query";


function SubMenu(props) {
  //const classes = useStyles();
  const [activeItem, setActiveItem] = useState("recent-history");
  const patientObj = props.patientObj;
  const [saving, setSavings] = useState(false);
  const [isOtzEnrollementDone, setIsOtzEnrollementDone] = useState(null);
  const [labResult, setLabResult] = useState(null);
  const patientCurrentStatus =
      props.patientObj && props.patientObj.currentStatus === "Died (Confirmed)"
          ? true
          : false;

  useEffect(() => {
    if (props.patientObj && props.patientObj !== null) {
      Observation();
      getOldRecordIfExists();
    }
 
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

  

  const {refetch} = useQuery(
    [GET_CURRENT_LAB_RECORD, props?.patientObj?.id],
    () => getCurrentLabResult(props?.patientObj?.id),
    {
      onSuccess: (data) => {
        const dynamicArray = data;
        if (dynamicArray?.length > 0) {
          let lastItem = dynamicArray[dynamicArray.length - 1];
          setLabResult(lastItem);
        }
        getOldRecordIfExists()

      },
      refetchOnMount: "always",
      staleTime: 100,
      cacheTime: 100,
      onError: (error) => {
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
      },
    }
  );

  const loadEAC = (row) => {
    setActiveItem("eac");
    props.setActiveContent({ ...props.activeContent, route: "counseling", activeTab:"home" });
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
    props.setActiveContent({ ...props.activeContent, route: "consultation", activeTab:"home" });
  };
  const onClickHome = (row) => {
    setActiveItem("home");
    props.setActiveContent({ ...props.activeContent, route: "recent-history" });
  };

  const loadTrackingForm = (row) => {
    setActiveItem("tracking");
    props.setActiveContent({ ...props.activeContent, route: "tracking-form",
      activeTab: "home"
    });
  };

  //const loadMentalHealth = () => {
    //setActiveItem("health");
    //props.setActiveContent({ ...props.activeContent, route: "mhs" });
  //};

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
    props.setActiveContent({ ...props.activeContent, route: "chronic-care", activeTab:"home" });
  };
  const loadOtzServiceForm = () => {
    //Please do not remove
    queryClient.invalidateQueries()
    refetch()
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
    queryClient.invalidateQueries()
    refetch()
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

  const getOldRecordIfExists = () => {
    axios
        .get(`${baseUrl}observation/person/${props?.patientObj?.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const patientDTO = response?.data;
          const otzData =
              patientDTO?.filter?.((item) => item?.type === "Service OTZ")?.[0] ||
              null;
          if (otzData) {
            setIsOtzEnrollementDone(true);
          } else {
            setIsOtzEnrollementDone(false);
          }
        })
        .catch((error) => {
          //
          setIsOtzEnrollementDone(false);
        });
  };

  const patientIsConfirmedDeadOrIsTransfered = (patient) => {
    return false;
  };

  return (
      <div>
        {props.patientObj && props.patientObj !== null && (
            <Segment inverted>
              {/*!props.art && patientObj.commenced!==true && patientObj.enrollment.targetGroupId===473) || (!props.art && (patientObj.commenced!==true || patientObj.commenced===true)  && patientObj.mentalHealth!==true) */}
              {(patientObj.commenced === false ||
                  patientObj.createBy.toUpperCase() !==
                  "LAMIS DATA MIGRATION SYSTEM") &&
              (patientObj.commenced !== true ||
                  patientObj.clinicalEvaluation !== true ||
                  (patientObj.targetGroupId !== 473
                      ? patientObj.mentalHealth !== true
                      : false)
                      ) ? (
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
                    {/* patientObj.targetGroupId !== null &&
                        patientObj.targetGroupId !== "" &&
                        patientObj.targetGroupId !== 473 &&
                        patientObj.mentalHealth === false && (
                            <Menu.Item
                                onClick={() => loadMentalHealth(patientObj)}
                                name="health"
                                active={activeItem === "health"}
                                title="Mental Health Screening"
                            >
                              Mental Health Screening
                            </Menu.Item>
                        )*/}
                    {/* <Menu.Item onClick={() => loadStatusUpdate(patientObj)} disabled>Client Status Update</Menu.Item>                     */}
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
                    {props.patientObj.currentStatus.toLowerCase() ===
                    "died (confirmed)" ||
                    props.patientObj.currentStatus.toLowerCase() ===
                    "art transfer out" ? (
                        <Menu.Menu position="" name="lab" active={activeItem === "lab"}>
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
                            </Dropdown.Menu>
                          </Dropdown>

                          {(patientObj?.age >= 10 && patientObj?.age <= 23) ||
                          patientObj.age <= 19 ? (
                              <Dropdown item text="OTZ">
                                <Dropdown.Menu>
                                  {patientObj?.age >= 10 && patientObj?.age <= 23 && (
                                      <>
                                        {isOtzEnrollementDone === null ? (
                                            <Dropdown.Item>
                                              Checking patient enrollment...
                                            </Dropdown.Item>
                                        ) : isOtzEnrollementDone === false ? (
                                            <Dropdown.Item
                                                onClick={() => loadOtzEnrollmentForm()}
                                                name="OTZ Enrollment Form"
                                                active={activeItem === "otz-enrollment-form"}
                                                title="Enrollment Form"
                                            >
                                              OTZ Enrollment Form
                                            </Dropdown.Item>
                                        ) : null}

                                        {isOtzEnrollementDone ? (
                                            <Dropdown.Item
                                                onClick={() => loadOtzServiceForm()}
                                                name="OTZ Service Form"
                                                active={activeItem === "otz-service-form"}
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
                    ) : (
                        <>
                          {!patientObj.clinicalEvaluation &&
                              patientObj.createBy === "Lamis data migration system" && (
                                  <Menu.Item
                                      onClick={() => loadAdultEvaluation()}
                                      name="initial"
                                      active={activeItem === "initial"}
                                      title="Initial Evaluation"
                                  >
                                    Initial Evaluation
                                  </Menu.Item>
                              )}
                          <Menu.Item
                              onClick={() => loadChronicCare(patientObj)}
                              name="chronic care"
                              active={activeItem === "chronic-care"}
                          >
                            Care & Support
                          </Menu.Item>
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
                                    onClick={() => loadLaboratoryViralLoadOrderResult()}
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

                          {/*!patientObj.mentalHealth &&
                              patientObj.targetGroupId !== null &&
                              patientObj.targetGroupId !== 473 &&
                              patientObj.createBy === "Lamis data migration system" && (
                                  <Menu.Item
                                      onClick={() => loadMentalHealth(patientObj)}
                                      name="health"
                                      active={activeItem === "health"}
                                      title="Mental Health Screening"
                                  >
                                    Mental Health Screening
                                  </Menu.Item>
                              ) */}

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
                                    onClick={() => clientVerificationForm(patientObj)}
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
                                    {patientObj?.age >= 10 && patientObj?.age <= 23 && (
                                        <>
                                          {isOtzEnrollementDone === null ? (
                                              <Dropdown.Item>
                                                Checking patient enrollment...
                                              </Dropdown.Item>
                                          ) : isOtzEnrollementDone === false ? (
                                              <Dropdown.Item
                                                  onClick={() => loadOtzEnrollmentForm()}
                                                  name="OTZ Enrollment Form"
                                                  active={activeItem === "otz-enrollment-form"}
                                                  title="Enrollment Form"
                                              >
                                                OTZ Enrollment Form
                                              </Dropdown.Item>
                                          ) : null}

                                          {isOtzEnrollementDone ? (
                                              <Dropdown.Item
                                                  onClick={() => loadOtzServiceForm()}
                                                  name="OTZ Service Form"
                                                  active={activeItem === "otz-service-form"}
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
                    {/* } */}
                  </Menu>
              )}
            </Segment>
        )}
      </div>
  );
}

export default SubMenu;