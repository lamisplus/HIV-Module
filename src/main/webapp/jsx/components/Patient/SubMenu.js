import { useState, useEffect, useMemo, memo } from "react";
import axios from "axios";
import { Dropdown, Menu, Segment } from "semantic-ui-react";
import { url as baseUrl, token } from "../../../api";
import { queryClient } from "../../../utils/queryClient";
import ButtonMui from "@material-ui/core/Button";
import { TiArrowBack } from "react-icons/ti";
import { makeStyles } from "@material-ui/core";
import { toast } from "react-toastify";
import { Button } from "semantic-ui-react";
import { usePermissions } from "../../../hooks/usePermissions";
import { useRoles } from "../../../hooks/useRoles";
import { MenuItem } from "../../../reuseables/MenuItem";

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

const SubMenu = (props) => {
  const { hasPermission, hasAnyPermission, loading } = usePermissions();
  const { hasRole } = useRoles();
  const [activeItem, setActiveItem] = useState("recent-history");
  const patientObj = props.patientObj;
  // console.log("props.patientObj", props.patientObj)
  // console.log("props.expandable", props.expandedPatientObj)
  // Check if this is a PEP client
  const isPepClient = props.pepClient || false;
  const [pepHasPositiveResult, setPepHasPositiveResult] = useState(false);

  const [isOtzEnrollementDone, setIsOtzEnrollementDone] = useState(null);
  // NEW: Enrollment cycle status from backend API
  const [enrollmentCycleStatus, setEnrollmentCycleStatus] = useState(null);
  const [labResult, setLabResult] = useState(null);
  const [hasPharmacyRecords, setHasPharmacyRecords] = useState(false);

  // Fetch enrollment cycle status from backend
  const fetchEnrollmentCycleStatus = async () => {
    if (!patientObj?.id) return;
    try {
      const response = await axios.get(
        `${baseUrl}adherence-preparation/enrollment-cycle-status/${patientObj.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEnrollmentCycleStatus(response.data);
    } catch (error) {
      console.error("Error fetching enrollment cycle status:", error);
      // Set default empty status on error
      // Note: Use enrollmentCycleComplete (not isEnrollmentCycleComplete) to match JSON serialization
      setEnrollmentCycleStatus({
        currentEnrollmentSessionUuid: null,
        hasAdherencePreparation: false,
        hasInitialClinicalEvaluation: false,
        hasEnrollmentCommencement: false,
        enrollmentCycleComplete: false,
        nextRequiredForm: "AdherencePreparation",
        entryPoint: "Unknown"
      });
    }
  };

  // Fetch enrollment status on mount and when patient changes
  useEffect(() => {
    fetchEnrollmentCycleStatus();
  }, [patientObj?.id]);

  // Refresh enrollment status when forms are submitted or routes change
  useEffect(() => {
    if (props.activeContent?.route === 'recent-history' ||
        props.activeContent?.refreshPatient === true) {
      fetchEnrollmentCycleStatus();
    }
  }, [props.activeContent?.route, props.activeContent?.refreshPatient, props.activeContent?.refreshTimestamp]);
  const patientCurrentStatus = patientObj?.currentStatus === "Died (Confirmed)";
  const [currentStatus, setCurrentStatus] = useState(() => {
    const savedStatus = localStorage.getItem("currentStatus") || "";
    return savedStatus;
  });
  const [statusLoading, setStatusLoading] = useState(false);
  const [isPatientActive, setIsPatientActive] = useState(() => {
    const savedStatus = localStorage.getItem("currentStatus");
    return !savedStatus?.toLowerCase()?.includes("stopped");
  });

  const [artCommencement, setArtCommencement] = useState(() => {
    return localStorage.getItem("artCommencement") || null;
  });

  const getCurrentStatus = async () => {
    if (!patientObj?.id) return;
    setStatusLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}hiv/patient-current/${patientObj.id}?commenced=${patientObj.commenced}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const status = response.data || "";
     

      localStorage.setItem("currentStatus", status);
      setCurrentStatus(status);
      setIsPatientActive(!status?.toLowerCase()?.includes("stopped"));
      setStatusLoading(false);
    } catch (error) {
      console.error("Error fetching patient status:", error);
      setStatusLoading(false);
    }
  };

  // Effect to check art commencement and status
  useEffect(() => {
    const savedArt = localStorage.getItem("artCommencement");
    if (savedArt) {
      setArtCommencement(savedArt);
      getCurrentStatus();
    }
  }, []); // Initial check

  // Effect to watch for art commencement changes
  useEffect(() => {
    if (artCommencement) {
      getCurrentStatus();
    }
  }, [artCommencement]); // Run when art commencement changes

  // Effect to watch for patient changes
  useEffect(() => {
    if (patientObj?.id && patientObj?.commenced !== undefined) {
      getCurrentStatus();
    }
  }, [patientObj?.id, patientObj?.commenced]);

  useEffect(() => {
    // getartCommencement from local storage
    const savedArt = localStorage.getItem("artCommencement");
    if (savedArt) {
      getCurrentStatus();
    }
  }, []);

  // Effect to refresh status when navigating to enrollment-and-commencement route
  // This ensures the menu updates after Transfer IN submission (Part 2 flow)
  // IMPORTANT: Do NOT call getCurrentStatus() for Part 2 returning clients,
  // as it will overwrite the correct "Transfer-in not active" status from Transfer IN
  useEffect(() => {
    if (props.activeContent?.route === "enrollment-and-commencement") {
      const currentStatusFromLocalStorage = localStorage.getItem("currentStatus");
      const isReturningClient = currentStatusFromLocalStorage?.toUpperCase() === "TRANSFER-IN NOT ACTIVE";

      // For Part 2 returning clients: skip getCurrentStatus but refresh enrollmentCycleStatus
      // This ensures the menu shows "Enrollment & Commencement" instead of "Adherence Preparation"
      if (isReturningClient) {
        fetchEnrollmentCycleStatus();
      } else {
        // For other clients, fetch status from backend
        getCurrentStatus();
      }
    }
  }, [props.activeContent?.route]);

  // Effect to refresh status when patient is refreshed (after form submissions)
  // This ensures the menu updates immediately after Enrollment form submission
  // IMPORTANT: Skip getCurrentStatus for Part 2 returning clients before Enrollment is submitted
  useEffect(() => {
    if (props.activeContent?.refreshPatient === true) {
      const currentStatusFromLocalStorage = localStorage.getItem("currentStatus");
      const isReturningClient = currentStatusFromLocalStorage?.toUpperCase() === "TRANSFER-IN NOT ACTIVE";

      // Only skip getCurrentStatus if coming from Transfer IN (before Enrollment submission)
      // After Enrollment submission, we SHOULD fetch the updated status
      const comingFromEnrollment = props.activeContent?.route === "recent-history";

      if (isReturningClient && !comingFromEnrollment) {
        fetchEnrollmentCycleStatus(); // Always refresh enrollment cycle status to update menu
      } else {
        getCurrentStatus();
        // Also fetch enrollment cycle status when patient is refreshed
        fetchEnrollmentCycleStatus();
      }
    }
  }, [props.activeContent?.refreshPatient, props.activeContent?.refreshTimestamp]);



    if (patientObj.commenced === true) {
      localStorage.removeItem("artCommencement");
    }

  const permissions = useMemo(
    () => {
      // RDE takes precedence - if user has RDE role, grant full access except Patient Visits
      if (hasRole("RDE")) {
        return {
          canSeeInitialEvaluation: !patientObj?.clinicalEvaluation,
          canSeeCareAndSupport: true,
          canSeeLaboratory: true,
          canSeeCareCard: true,
          canSeePharmacy: true,
          canSeeEAC: true,
          canSeeCervicalCancer: patientObj.sex?.toUpperCase() === "FEMALE",
          canSeeTracking: true,
          canSeeTransfer: true,
          canSeePatientVisit: false,
        };
      }

      // For non-RDE users (POC), use permission-based access
      return {
        canSeeInitialEvaluation:
          hasAnyPermission(
            "adult_initial_clinical_evaluation",
            "pediatric_initial_clinical_evaluation_form"
          ) && !patientObj?.clinicalEvaluation,

        canSeeCareAndSupport: hasAnyPermission(
          "care_and_support_register",
          "care_and_support_checklist"
        ),

        canSeeLaboratory: hasAnyPermission(
          "laboratory_order_and_results_form",
          "viral_load_order_and_result_form",
          "viral_load_monitoring_register"
        ),

        canSeeCareCard: hasPermission("care_card"),

        canSeePharmacy: hasPermission("combined_pharmacy_order_form"),

        canSeeEAC: hasPermission("eac_monitoring_register"),

        canSeeCervicalCancer:
          patientObj.sex?.toUpperCase() === "FEMALE" &&
          hasAnyPermission(
            "cervical_cancer_screening_form",
            "cervical_cancer_care_register",
            "cervical_cancer_consent_form",
            "cervical_cancer_care_card"
          ),

        canSeeTracking: hasPermission("client_tracking_and_discontinuation_form"),

        canSeeTransfer: hasPermission("hiv_care_and_treatment_transfer_form"),
        canSeePatientVisit: hasAnyPermission("view_patient", "all_permissions"),
      };
    },
    [hasPermission, hasAnyPermission, hasRole, patientObj?.clinicalEvaluation, patientObj?.sex, patientObj?.age]
  );

  const menuConditions = useMemo(
    () => {
      // NEW SIMPLIFIED LOGIC: Use enrollmentCycleStatus from backend API
      // If enrollmentCycleStatus is still loading (null), show full menu as fallback (backwards compatible)
      if (!enrollmentCycleStatus) {
        return {
          isPreAdherencePreparation: false,
          isPostAdherencePreICE: false,
          isPostICEPreEnrollment: false,
          isTransferInPendingEnrollment: false,
          showFullMenu: true, // Show full menu while loading
          isDeadOrTransferred:
            currentStatus?.toUpperCase() === "DIED (CONFIRMED)" ||
            currentStatus?.toUpperCase() === "ART TRANSFER OUT",
          canShowOTZ:
            (patientObj?.age >= 10 && patientObj?.age <= 23) ||
            patientObj?.age <= 19,
          canShowOTZEnrollment: patientObj?.age >= 10 && patientObj?.age <= 23,
          showPediatricChecklist: patientObj?.age <= 19,
        };
      }

      const nextForm = enrollmentCycleStatus.nextRequiredForm || "AdherencePreparation";
      // Note: Jackson serializes boolean fields with "is" prefix by stripping the "is"
      // So isEnrollmentCycleComplete becomes enrollmentCycleComplete in JSON
      const isComplete = enrollmentCycleStatus.enrollmentCycleComplete || false;

      // Determine menu states based on nextRequiredForm
      const isPreAdherencePreparation = nextForm === "AdherencePreparation";
      const isPostAdherencePreICE = nextForm === "ICE";
      const isPostICEPreEnrollment = nextForm === "Enrollment";

      // Transfer IN Pending Enrollment: Returning client (Part 2) needs to complete enrollment cycle
      // Only true if status is "Transfer-in not active" AND enrollment cycle is NOT complete
      const isTransferInPendingEnrollment =
        currentStatus?.toUpperCase() === "TRANSFER-IN NOT ACTIVE" && !isComplete;

      // Show full menu when enrollment cycle is complete
      const showFullMenu = isComplete;

      const conditions = {
        isPreAdherencePreparation,
        isPostAdherencePreICE,
        isPostICEPreEnrollment,
        isTransferInPendingEnrollment,
        showFullMenu,

        isDeadOrTransferred:
          currentStatus?.toUpperCase() === "DIED (CONFIRMED)" ||
          currentStatus?.toUpperCase() === "ART TRANSFER OUT",

        canShowOTZ:
          (patientObj?.age >= 10 && patientObj?.age <= 23) ||
          patientObj?.age <= 19,

        canShowOTZEnrollment: patientObj?.age >= 10 && patientObj?.age <= 23,

        showPediatricChecklist: patientObj?.age <= 19,
      };

      return conditions;
    },
    [patientObj?.age, currentStatus, enrollmentCycleStatus]
  );

  // Check if PEP client has positive result
  useEffect(() => {
    const checkPepResult = async () => {
      if (isPepClient && patientObj?.id) {
        try {
          const response = await axios.get(
            `${baseUrl}laboratory/vl-results/patients/${patientObj.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          // Check if there's a PEP viral load result that is positive
          const pepResults = response.data.filter(
            result => result.patientCategory?.toUpperCase() === 'PEP'
          );

          if (pepResults.length > 0) {
            const latestResult = pepResults[pepResults.length - 1];
            const isPositive = latestResult.result &&
              latestResult.result.toLowerCase().includes('positive');
            setPepHasPositiveResult(isPositive);
          }
        } catch (error) {
          console.error("Error checking PEP result:", error);
          setPepHasPositiveResult(false);
        }
      }
    };
    checkPepResult();
  }, [isPepClient, patientObj?.id]);

  useEffect(() => {
    const initializeData = async () => {
      if (patientObj?.id) {
        await Promise.all([
          getOldRecordIfExists(),
          getCurrentLabResult(patientObj.id),
          Observation(),
          checkPharmacyRecords(),
        ]);
      }
    };
    initializeData();
  }, [patientObj?.id]);

  // Re-check enrollment status removed - values come from expandedPatientObj
  // useEffect(() => {
  //   if (props.activeContent?.route === 'recent-history' && patientObj?.id) {
  //     checkEnrollmentCommencement();
  //     checkICEExists();
  //   }
  // }, [props.activeContent?.route, patientObj?.id]);

  const Observation = async () => {
    try {
      await axios.get(`${baseUrl}observation/person/${patientObj.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Observation error:", error);
    }
  };

  const getCurrentLabResult = async (id) => {
    try {
      const { data } = await axios.get(
        `${baseUrl}laboratory/vl-results/patients/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.length > 0) {
        setLabResult(data[data.length - 1]);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.apierror?.message ||
        "Something went wrong, please try again";
      toast.error(errorMessage);
    }
  };

  const checkPharmacyRecords = async () => {
    if (!patientObj?.id) return;
    try {
      const response = await axios.get(
        `${baseUrl}hiv/art/pharmacy/patient?pageNo=0&pageSize=10&personId=${patientObj.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHasPharmacyRecords(response.data && response.data.length > 0);
    } catch (error) {
      console.error("Error checking pharmacy records:", error);
      setHasPharmacyRecords(false);
    }
  };

  // checkAdherencePreparation removed - now using enrollmentCycleStatus from API

  const getOldRecordIfExists = async () => {
    try {
      const { data: patientDTO } = await axios.get(
        `${baseUrl}observation/person/${patientObj?.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const otzData = patientDTO?.find?.(
        (item) => item?.type === "Service OTZ"
      );
      setIsOtzEnrollementDone(!!otzData);
    } catch (error) {
      setIsOtzEnrollementDone(false);
    }
  };

  // checkEnrollmentCommencement and checkICEExists functions removed
  // These values are now sourced directly from expandedPatientObj (hasiceform, hasenrollmentform)
  // which are populated by the backend queries in HivEnrollmentRepository.java

  const updateCurrentEnrollmentStatus = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}hiv/status/activate-stop_status/${patientObj.personUuid}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 204) {
        setIsPatientActive(true);
        toast.success("Patient reactivated successfully");
        props.setActiveContent({
          ...props.activeContent,
          route: "recent-history",
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.apierror?.message ||
        "Something went wrong, please try again";
      toast.error(errorMessage);
    }
  };

  // prevent unnecessary re-renders
  const menuHandlers = useMemo(
    () => ({
      onClickHome: () => {
        setActiveItem("home");
        props.setActiveContent({
          ...props.activeContent,
          route: "recent-history",
        });
      },

      loadAdultEvaluation: () => {
        setActiveItem("initial");
        props.setActiveContent({
          ...props.activeContent,
          route: "adult-evaluation",
        });
      },

      loadAdherencePreparation: () => {
        setActiveItem("adherence-preparation");
        props.setActiveContent({
          ...props.activeContent,
          route: "adherence-preparation",
        });
      },

      loadInitializationEvaluation: () => {
        setActiveItem("initial-clinical-evaluation");
        props.setActiveContent({
          ...props.activeContent,
          route: "initial-clinical-evaluation",
        });
      },

      loadEnrollmentAndCommencement: () => {
        setActiveItem("enrollment-and-commencement");
        props.setActiveContent({
          ...props.activeContent,
          route: "enrollment-and-commencement",
        });
      },

      loadCareCardFollowUp: () => {
        setActiveItem("care-card-follow-up");
        props.setActiveContent({
          ...props.activeContent,
          route: "care-card-follow-up",
        });
      },

      loadHealthServices: () => {
        setActiveItem("health-services");
        props.setActiveContent({
          ...props.activeContent,
          route: "health-services",
        });
      },

      loadSubstitutionSwitch: async () => {
        // Re-check pharmacy records before validating
        try {
          const response = await axios.get(
            `${baseUrl}hiv/art/pharmacy/patient?pageNo=0&pageSize=10&personId=${patientObj.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const hasRecords = response.data && response.data.length > 0;

          if (!hasRecords) {
            toast.error("Patient must have pharmacy records before accessing Substitution/Switch form");
            return;
          }

          setHasPharmacyRecords(hasRecords);
          setActiveItem("substitution-switch");
          props.setActiveContent({
            ...props.activeContent,
            route: "substitution-switch",
          });
        } catch (error) {
          console.error("Error checking pharmacy records:", error);
          toast.error("Patient must have pharmacy records before accessing Substitution/Switch form");
        }
      },

      loadIntegratedLabOrder: () => {
        setActiveItem("integrated-lab-order");
        props.setActiveContent({
          ...props.activeContent,
          route: "integrated-lab-order",
        });
      },

      loadArtCommencement: () => {
        setActiveItem("art");
        props.setActiveContent({
          ...props.activeContent,
          route: "art-commencementPage",
        });
      },

      loadPatientHistory: () => {
        setActiveItem("history");
        props.setActiveContent({
          ...props.activeContent,
          route: "patient-history",
        });
      },

      loadChronicCare: () => {
        setActiveItem("chronic-care");
        props.setActiveContent({
          ...props.activeContent,
          route: "chronic-care",
          activeTab: "home",
        });
      },

      loadPatientVisits: () => {
        setActiveItem("patient-visit");
        props.setActiveContent({
          ...props.activeContent,
          route: "patient-visit",
          activeTab: "home",
        });
      },

      onClickConsultation: () => {
        setActiveItem("visit");
        props.setActiveContent({
          ...props.activeContent,
          route: "consultation",
          activeTab: "home",
        });
      },

      loadPharmacyModal: () => {
        setActiveItem("pharmacy");
        props.setActiveContent({
          ...props.activeContent,
          route: "pharmacy",
          activeTab: "drug-refill",
        });
      },

      loadLaboratoryOrderResult: () => {
        setActiveItem("lab");
        props.setActiveContent({
          ...props.activeContent,
          route: "laboratoryOrderResult",
          activeTab: "labOrder",
        });
      },

      loadLaboratoryViralLoadOrderResult: () => {
        setActiveItem("lab");
        props.setActiveContent({
          ...props.activeContent,
          route: "laboratoryViralLoadOrderResult",
          activeTab: "viralLoad",
        });
      },

      loadEAC: () => {
        setActiveItem("eac");
        props.setActiveContent({
          ...props.activeContent,
          route: "counseling",
          activeTab: "home",
        });
      },

      loadCervicalCancer: () => {
        setActiveItem("cancer");
        props.setActiveContent({
          ...props.activeContent,
          route: "cervical-cancer",
        });
      },

      loadTrackingForm: async () => {
        // Re-check pharmacy records before validating
        try {
          const response = await axios.get(
            `${baseUrl}hiv/art/pharmacy/patient?pageNo=0&pageSize=10&personId=${patientObj.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const hasRecords = response.data && response.data.length > 0;

          if (!hasRecords) {
            toast.error("Patient must have pharmacy records before accessing Client Tracking form");
            return;
          }

          setHasPharmacyRecords(hasRecords);
          setActiveItem("tracking");
          props.setActiveContent({
            ...props.activeContent,
            route: "tracking-form",
            activeTab: "home",
          });
        } catch (error) {
          console.error("Error checking pharmacy records:", error);
          toast.error("Patient must have pharmacy records before accessing Client Tracking form");
        }
      },

      loadTransferForm: () => {
        setActiveItem("transfer");
        props.setActiveContent({
          ...props.activeContent,
          route: "transfer-form",
        });
      },

      loadIntensiveForm: () => {
        setActiveItem("intensive");
        props.setActiveContent({
          ...props.activeContent,
          route: "intensive-followup",
        });
      },

      clientVerificationForm: () => {
        setActiveItem("client-verfication-form");
        props.setActiveContent({
          ...props.activeContent,
          route: "client-verfication-form",
        });
      },

      DsdServiceForm: () => {
        setActiveItem("dsd-service-form");
        props.setActiveContent({
          ...props.activeContent,
          route: "dsd-service-form",
        });
      },

      loadOtzServiceForm: () => {
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
      },

      loadOtzEnrollmentForm: () => {
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
      },

      loadOtzCheckList: () => {
        setActiveItem("otz-peadiatric-disclosure-checklist");
        props.setActiveContent({
          ...props.activeContent,
          route: "otz-peadiatric-disclosure-checklist",
          actionType: "create",
        });
      },
    }),
    [props.activeContent, props.expandedPatientObj, labResult, hasPharmacyRecords]
  );

  return (
    <div>
      {patientObj && (
        <Segment inverted>
          {/* PEP CLIENT WITHOUT POSITIVE RESULT - Show only Viral Load */}
          {isPepClient && !pepHasPositiveResult ? (
            <>
              <Menu size="tiny" color="blue" inverted pointing>
                <MenuItem
                  onClick={menuHandlers.onClickHome}
                  name="home"
                  active={activeItem === "recent-history"}
                  title="Home"
                >
                  Home
                </MenuItem>

                <MenuItem
                  onClick={menuHandlers.loadLaboratoryViralLoadOrderResult}
                  name="lab"
                  active={activeItem === "lab"}
                  title="Viral Load Order & Result"
                >
                  Viral Load Order & Result
                </MenuItem>

                <MenuItem
                  onClick={menuHandlers.loadPatientHistory}
                  name="history"
                  active={activeItem === "history"}
                  title="History"
                >
                  History
                </MenuItem>
              </Menu>
            </>
          ) : menuConditions.isPreAdherencePreparation || menuConditions.isPostAdherencePreICE || menuConditions.isPostICEPreEnrollment || menuConditions.isTransferInPendingEnrollment ? (
            <>
              {/* LIMITED MENU - Sequential enrollment flow using enrollmentCycleStatus from backend */}
              <Menu size="tiny" color="blue" inverted pointing>
              <MenuItem
                onClick={menuHandlers.onClickHome}
                name="home"
                active={activeItem === "recent-history"}
                title="Home"
              >
                Home
              </MenuItem>

              {/* Show AdherencePreparation form link when in Pre-Adherence state (NEW PATIENTS ONLY - Part 1) */}
              {menuConditions.isPreAdherencePreparation && (
                <MenuItem
                  onClick={menuHandlers.loadAdherencePreparation}
                  name="adherence-preparation"
                  active={activeItem === "adherence-preparation"}
                  title="Adherence Preparation"
                >
                  Adherence Preparation
                </MenuItem>
              )}

              {/* Show ICE form link when AdherencePreparation is done but ICE is not */}
              {menuConditions.isPostAdherencePreICE && (
                <MenuItem
                  onClick={menuHandlers.loadInitializationEvaluation}
                  name="initial-clinical-evaluation"
                  active={activeItem === "initial-clinical-evaluation"}
                  title="Initial Clinical Evaluation"
                >
                  Initial Clinical Evaluation
                </MenuItem>
              )}

              {/* Show Enrollment form link when in Post-ICE Pre-Enrollment state */}
              {/* The sequential logic for Part 2 (Transfer IN) is handled by enrollment cycle status */}
              {menuConditions.isPostICEPreEnrollment && (
                <MenuItem
                  onClick={menuHandlers.loadEnrollmentAndCommencement}
                  name="enrollment-and-commencement"
                  active={activeItem === "enrollment-and-commencement"}
                  title="Enrollment & ART Commencement"
                >
                  Enrollment &amp; Commencement
                </MenuItem>
              )}

              <MenuItem
                onClick={menuHandlers.loadPatientHistory}
                name="history"
                active={activeItem === "history"}
                title="History"
              >
                History
              </MenuItem>

              {permissions.canSeePatientVisit && (
                <MenuItem
                  onClick={menuHandlers.loadPatientVisits}
                  name="patient-visit"
                  active={activeItem === "patient-visit"}
                  title="Patient Visits"
                >
                  Patient Visits
                </MenuItem>
              )}
            </Menu>
            </>
          ) : (
            <>
              {menuConditions.isDeadOrTransferred ? (
                <>
                  <Menu
                    size="tiny"
                    style={{
                      backgroundColor: "rgb(153, 46, 98)",
                      color: "#fff",
                    }}
                    inverted
                  >
                  <MenuItem
                    onClick={menuHandlers.onClickHome}
                    name="home"
                    active={activeItem === "recent-history"}
                    title="Home"
                  >
                    Home
                  </MenuItem>

                  {currentStatus?.toUpperCase() === "DIED (CONFIRMED)" &&
                    permissions.canSeeTracking && (
                      <MenuItem
                        onClick={menuHandlers.loadTrackingForm}
                        name="tracking"
                        active={activeItem === "tracking"}
                        title="Tracking Form"
                      />
                    )}

                  <MenuItem
                    onClick={menuHandlers.loadPatientHistory}
                    name="history"
                    active={activeItem === "history"}
                    title="History"
                  >
                    History
                  </MenuItem>

                  {currentStatus?.toUpperCase() === "ART TRANSFER OUT" &&
                      permissions.canSeeTracking && (
                          <MenuItem
                        onClick={menuHandlers.loadTransferForm}
                        name="transfer"
                        active={activeItem === "transfer"}
                        title="Transfer"
                      >
                        <Button
                          size="mini"
                          style={{
                            backgroundColor: "green",
                            color: "#fff",
                            marginRight: "10px",
                          }}
                        >
                          Activate
                        </Button>
                      </MenuItem>
                    )}
                </Menu>
                </>
              ) :
              (
                <>
                  <Menu size="tiny" color="black" inverted>
                  <MenuItem
                    onClick={menuHandlers.onClickHome}
                    disabled={patientCurrentStatus}
                    name="home"
                    active={activeItem === "recent-history"}
                    title="Home"
                  >
                    Home
                  </MenuItem>

                  {isPatientActive && (
                    <>
                      {/* OLD INITIAL EVALUATION (ADULT/PEDIATRIC) - COMMENTED OUT FOR NEW ENROLLMENT FLOW */}
                      {/* {permissions.canSeeInitialEvaluation &&
                        patientObj?.createBy?.toUpperCase() ===
                          "LAMIS DATA MIGRATION SYSTEM" && (
                          <MenuItem
                            onClick={menuHandlers.loadAdultEvaluation}
                            name="initial"
                            active={activeItem === "initial"}
                            title="Initial Evaluation"
                          >
                            Initial Evaluation
                          </MenuItem>
                        )} */}

                      {permissions.canSeeCareAndSupport && (
                        <MenuItem
                          onClick={menuHandlers.loadChronicCare}
                          name="chronic care"
                          active={activeItem === "chronic-care"}
                        >
                          Care & Support
                        </MenuItem>
                      )}

                      <MenuItem
                        onClick={menuHandlers.loadCareCardFollowUp}
                        disabled={patientCurrentStatus}
                        name="care-card-follow-up"
                        active={activeItem === "care-card-follow-up"}
                        title="Care Card Follow Up"
                      >
                        Care Card Follow Up
                      </MenuItem>

                      {permissions.canSeeLaboratory && (
                        <Menu.Menu
                          position=""
                          name="lab"
                          active={activeItem === "lab"}
                        >
                          <Dropdown item text="Laboratory">
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={menuHandlers.loadLaboratoryOrderResult}
                                disabled={patientCurrentStatus}
                                title="Laboratory Order & Result"
                              >
                                Laboratory Order & Result
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={
                                  menuHandlers.loadLaboratoryViralLoadOrderResult
                                }
                                disabled={patientCurrentStatus}
                                title="Viral Load Order & Result"
                              >
                                Viral Load Order & Result
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </Menu.Menu>
                      )}

                      {permissions.canSeePharmacy && (
                        <MenuItem
                          onClick={menuHandlers.loadPharmacyModal}
                          disabled={patientCurrentStatus}
                          name="pharmacy"
                          active={activeItem === "pharmacy"}
                          title="Pharmacy"
                        >
                          Pharmacy
                        </MenuItem>
                      )}

                      {permissions.canSeeEAC && (
                        <MenuItem
                          onClick={menuHandlers.loadEAC}
                          disabled={patientCurrentStatus}
                          name="eac"
                          active={activeItem === "eac"}
                          title="EAC"
                        >
                          EAC
                        </MenuItem>
                      )}

                      {/* {permissions.canSeeCervicalCancer && (
                        <MenuItem
                          onClick={menuHandlers.loadCervicalCancer}
                          name="cancer"
                          active={activeItem === "cancer"}
                          title="Cervical Cancer"
                        >
                          Cervical Cancer
                        </MenuItem>
                      )} */}

                      {permissions.canSeeTracking && (
                        <Menu.Menu
                          position=""
                          name="lab"
                          active={activeItem === "lab"}
                        >
                          <Dropdown item text="Other Forms">
                            <Dropdown.Menu>
                              {/* Initial Clinical Evaluation removed from full menu - only available during enrollment flow */}
                              {!enrollmentCycleStatus?.hasEnrollmentCommencement && (
                                <Dropdown.Item
                                  onClick={menuHandlers.loadEnrollmentAndCommencement}
                                  name="enrollment-and-commencement"
                                  active={activeItem === "enrollment-and-commencement"}
                                  title="Enrollment & ART Commencement"
                                >
                                  Enrollment &amp; Commencement
                                </Dropdown.Item>
                              )}
                              {/* <Dropdown.Item
                                onClick={menuHandlers.loadHealthServices}
                                name="health-services"
                                active={activeItem === "health-services"}
                                title="Health Services (Adherence & PHDP)"
                              >
                                Health Services
                              </Dropdown.Item> */}
                              <Dropdown.Item
                                onClick={menuHandlers.loadSubstitutionSwitch}
                                name="substitution-switch"
                                active={activeItem === "substitution-switch"}
                                title="Substitutions / Switches"
                              >
                                Substitution / Switch
                              </Dropdown.Item>
                              {/*<Dropdown.Item*/}
                              {/*  onClick={menuHandlers.loadIntegratedLabOrder}*/}
                              {/*  name="integrated-lab-order"*/}
                              {/*  active={activeItem === "integrated-lab-order"}*/}
                              {/*  title="Integrated Lab Order & Result"*/}
                              {/*>*/}
                              {/*  Integrated Lab Order & Result*/}
                              {/*</Dropdown.Item>*/}
                              <Dropdown.Item
                                onClick={menuHandlers.loadTrackingForm}
                                name="tracking"
                                active={activeItem === "tracking"}
                                title="Tracking Form"
                              >
                                Tracking Form
                              </Dropdown.Item>
                              {/* <Dropdown.Item
                                onClick={menuHandlers.loadIntensiveForm}
                                name="intensive"
                                active={activeItem === "intensive"}
                                title="Intensive Follow Up"
                              >
                                Intensive Follow Up
                              </Dropdown.Item> */}
                              <Dropdown.Item
                                onClick={menuHandlers.clientVerificationForm}
                                name="clientVerificationForm"
                                active={activeItem === "clientVerificationForm"}
                                title="Client Verification Form"
                              >
                                Client Verification Form
                              </Dropdown.Item>
                              {/*<Dropdown.Item*/}
                              {/*  onClick={menuHandlers.DsdServiceForm}*/}
                              {/*  name="DsdServiceForm"*/}
                              {/*  active={activeItem === "DsdServiceForm"}*/}
                              {/*  title="DSD ASSESSMENT AND ACCEPTANCE FORM"*/}
                              {/*>*/}
                              {/*  Dsd Service Form*/}
                              {/*</Dropdown.Item>*/}
                            </Dropdown.Menu>
                          </Dropdown>

                          {/* {menuConditions.canShowOTZ && (
                            <Dropdown item text="OTZ">
                              <Dropdown.Menu>
                                {menuConditions.canShowOTZEnrollment && (
                                  <>
                                    {isOtzEnrollementDone === null ? (
                                      <Dropdown.Item>
                                        Checking patient enrollment...
                                      </Dropdown.Item>
                                    ) : !isOtzEnrollementDone ? (
                                      <Dropdown.Item
                                        onClick={
                                          menuHandlers.loadOtzEnrollmentForm
                                        }
                                        name="OTZ Enrollment Form"
                                        active={
                                          activeItem === "otz-enrollment-form"
                                        }
                                        title="Enrollment Form"
                                      >
                                        OTZ Enrollment Form
                                      </Dropdown.Item>
                                    ) : (
                                      <Dropdown.Item
                                        onClick={
                                          menuHandlers.loadOtzServiceForm
                                        }
                                        name="OTZ Service Form"
                                        active={
                                          activeItem === "otz-service-form"
                                        }
                                        title="Tracking Form"
                                      >
                                        OTZ Service Form
                                      </Dropdown.Item>
                                    )}
                                  </>
                                )}

                                {menuConditions.showPediatricChecklist && (
                                  <Dropdown.Item
                                    onClick={menuHandlers.loadOtzCheckList}
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
                          )} */}
                        </Menu.Menu>
                      )}

                      {permissions.canSeeTransfer && (
                        <MenuItem
                          onClick={menuHandlers.loadTransferForm}
                          name="transfer"
                          active={activeItem === "transfer"}
                          title="Transfer"
                        >
                          Transfer
                        </MenuItem>
                      )}

                      {permissions.canSeePatientVisit && (
                        <MenuItem
                          onClick={menuHandlers.loadPatientVisits}
                          name="patient-visit"
                          active={activeItem === "patient-visit"}
                          title="Patient Visits"
                        >
                          Patient Visits
                        </MenuItem>
                      )}
                    </>
                  )}

                  <MenuItem
                    onClick={menuHandlers.loadPatientHistory}
                    name="history"
                    active={activeItem === "history"}
                    title="History"
                  >
                    History
                  </MenuItem>

                  {!isPatientActive && (
                    <ButtonMui
                      onClick={updateCurrentEnrollmentStatus}
                      variant="contained"
                      color="primary"
                      className="float-end ms-2 mr-2 mt-2"
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
                </Menu>
                </>
              )}
            </>
          )}
        </Segment>
      )}
    </div>
  );
};
export default memo(SubMenu);