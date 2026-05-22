import React, { useState } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import axios from "axios";

import { token as token, url as baseUrl } from "./../../../api";
import { forwardRef } from "react";
import "semantic-ui-css/semantic.min.css";
import { Link } from "react-router-dom";
import AddBox from "@material-ui/icons/AddBox";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { MdDashboard } from "react-icons/md";
import "@reach/menu-button/styles.css";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import { calculate_age } from "../../../utils";
Moment.locale("en");
momentLocalizer();

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(20),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%",
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
    width: 350,
  },
  button: {
    margin: theme.spacing(1),
  },
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
  error: {
    color: "#f85032",
    fontSize: "11px",
  },
  success: {
    color: "#4BB543 ",
    fontSize: "11px",
  },
}));

const PEPPatients = (props) => {
  const [showPPI, setShowPPI] = useState(true);
  const userDetail = localStorage.getItem("user_account");
  const facilityId = userDetail ? JSON.parse(userDetail).currentOrganisationUnitId : null;

  const handleCheckBox = (e) => {
    if (e.target.checked) {
      setShowPPI(false);
    } else {
      setShowPPI(true);
    }
  };

  return (
    <div>
      <MaterialTable
        key={`pep-patients-${facilityId}`}
        icons={tableIcons}
        title="PEP Patients"
        columns={[
          {
            title: "Patient Name",
            field: "name",
            hidden: showPPI,
          },
          { title: "Hospital Number", field: "hospitalNumber", filtering: false },
          { title: "Age", field: "age", filtering: false },
          { title: "Date Enrolled", field: "dateEnrolled", filtering: false },
          { title: "Actions", field: "actions", filtering: false },
        ]}
        data={(query) =>
          new Promise((resolve, reject) => {
            if (!facilityId) {
              resolve({
                data: [],
                page: 0,
                totalCount: 0,
              });
              return;
            }

            const url = `${baseUrl}observation/pep-clients/facility/${facilityId}?pageSize=${query.pageSize}&pageNo=${query.page}&searchValue=${query.search || ""}`;

            axios
              .get(url, { headers: { Authorization: `Bearer ${token}` } })
              .then((response) => {
                return response;
              })
              .then((result) => {
                resolve({
                  data: result.data.records.map((row) => ({
                    name: (
                      <>
                        <Link
                          to={{
                            pathname: "/patient-history",
                            state: {
                              patientObj: {
                                id: row.id,
                                personUuid: row.personUuid,
                                hospitalNumber: row.hospitalNumber,
                                firstName: row.firstName,
                                surname: row.surname,
                                otherName: row.otherName,
                                dateOfBirth: row.dateOfBirth,
                              }
                            },
                          }}
                          title={"Click to view patient dashboard"}
                        >
                          {row.firstName} {row.surname} {row.otherName || ""}
                        </Link>
                      </>
                    ),
                    hospitalNumber: row.hospitalNumber,
                    age: calculate_age(row.dateOfBirth),
                    dateEnrolled: row.dateEnrolled ? Moment(row.dateEnrolled).format("DD-MM-YYYY") : "N/A",
                    actions: (() => {
                      const hasSample = row.hasSample;
                      const hasResult = row.hasResult;
                      const testResult = row.testResult;

                      // Helper function to check if result is positive
                      const isPositiveResult = (result) => {
                        if (!result) return false;

                        const resultStr = String(result).trim().toLowerCase();

                        // Check for "detected" or "positive"
                        if (resultStr.includes("detected") && !resultStr.includes("undetected")) {
                          return true;
                        }
                        if (resultStr.includes("positive")) {
                          return true;
                        }

                        // Check for numeric values
                        const numericValue = parseFloat(resultStr);
                        if (!isNaN(numericValue) && numericValue > 0) {
                          return true;
                        }

                        return false;
                      };

                      // Determine button state based on workflow
                      let buttonText = "Collect Sample";
                      let buttonColor = "#014d88"; // Blue for collect sample
                      let isDisabled = false;
                      let targetPath = "/patient-history";
                      let routeState = {
                        pepClient: true,
                        viralLoadForm: true,
                      };

                      if (hasResult && isPositiveResult(testResult)) {
                        // Result is positive (detected or numeric > 0) - show Enroll Patient
                        buttonText = "Enroll Patient";
                        buttonColor = "rgb(153, 46, 98)"; // Purple for enrollment
                        targetPath = "/patient-history";
                        routeState = {
                          enrollmentFlow: true,
                        };
                      } else if (hasResult && !isPositiveResult(testResult)) {
                        // Result is negative (undetected or 0) - patient remains in PEP monitoring
                        // Can view history or collect another sample if needed
                        buttonText = "View History";
                        buttonColor = "#28a745"; // Green for negative result
                        isDisabled = false;
                        targetPath = "/patient-history";
                        routeState = {
                          pepClient: true,
                          viralLoadHistory: true,
                        };
                      } else if (hasSample && !hasResult) {
                        // Sample collected but no result yet - show Awaiting Result
                        // Route to history tab so user can update the record when result is available
                        buttonText = "Awaiting Result";
                        buttonColor = "#FFA500"; // Orange for awaiting
                        isDisabled = false;  // Make it clickable
                        targetPath = "/patient-history";
                        routeState = {
                          pepClient: true,
                          viralLoadHistory: true,  // Flag to open history tab
                        };
                      } else if (!hasSample) {
                        // No sample collected - show Collect Sample
                        buttonText = "Collect Sample";
                        buttonColor = "#014d88";
                        targetPath = "/patient-history";
                        routeState = {
                          pepClient: true,
                          viralLoadForm: true,
                        };
                      }

                      return (
                        <div>
                          {isDisabled ? (
                            <ButtonGroup
                              variant="contained"
                              aria-label="split button"
                              style={{
                                backgroundColor: buttonColor,
                                height: "30px",
                                width: "215px",
                                opacity: 0.7,
                              }}
                              size="large"
                              disabled
                            >
                              <Button
                                color="primary"
                                size="small"
                                style={{
                                  backgroundColor: buttonColor,
                                }}
                                disabled
                              >
                                <MdDashboard />
                              </Button>
                              <Button
                                style={{
                                  backgroundColor: buttonColor,
                                }}
                                disabled
                              >
                                <span
                                  style={{
                                    fontSize: "12px",
                                    color: "#fff",
                                    fontWeight: "bolder",
                                  }}
                                >
                                  {buttonText}
                                </span>
                              </Button>
                            </ButtonGroup>
                          ) : (
                            <Link
                              to={{
                                pathname: targetPath,
                                state: {
                                  patientObj: {
                                    id: row.id,
                                    personUuid: row.personUuid,
                                    hospitalNumber: row.hospitalNumber,
                                    firstName: row.firstName,
                                    surname: row.surname,
                                    otherName: row.otherName,
                                    dateOfBirth: row.dateOfBirth,
                                  },
                                  ...routeState,
                                }
                              }}
                            >
                              <ButtonGroup
                                variant="contained"
                                aria-label="split button"
                                style={{
                                  backgroundColor: buttonColor,
                                  height: "30px",
                                  width: "215px",
                                }}
                                size="large"
                              >
                                <Button
                                  color="primary"
                                  size="small"
                                  aria-label="select merge strategy"
                                  aria-haspopup="menu"
                                  style={{
                                    backgroundColor: buttonColor,
                                  }}
                                >
                                  <MdDashboard />
                                </Button>
                                <Button
                                  style={{
                                    backgroundColor: buttonColor,
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      color: "#fff",
                                      fontWeight: "bolder",
                                    }}
                                  >
                                    {buttonText}
                                  </span>
                                </Button>
                              </ButtonGroup>
                            </Link>
                          )}
                        </div>
                      );
                    })(),
                  })),
                  page: query.page,
                  totalCount: result.data.totalRecords,
                });
              })
              .catch((error) => {
                console.error("PEP Patients - Error fetching:", error);
                resolve({
                  data: [],
                  page: 0,
                  totalCount: 0,
                });
              });
          })
        }
        options={{
          search: true,
          headerStyle: {
            backgroundColor: "#014d88",
            color: "#fff",
          },
          searchFieldStyle: {
            width: "200%",
            margingLeft: "250px",
          },
          filtering: false,
          exportButton: true,
          searchFieldAlignment: "left",
          pageSizeOptions: [10, 20, 50, 100],
          pageSize: 10,
          debounceInterval: 400,
        }}
        components={{
          Toolbar: (props) => (
            <div>
              <div className="form-check custom-checkbox  float-left mt-4 ml-3 ">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="showPPI"
                  id="showPPI"
                  value="showPPI"
                  checked={showPPI === true ? false : true}
                  onChange={handleCheckBox}
                  style={{
                    border: "1px solid #014D88",
                    borderRadius: "0.25rem",
                  }}
                />
                <label className="form-check-label" htmlFor="showPPI">
                  <b style={{ color: "#014d88", fontWeight: "bold" }}>
                    SHOW PII
                  </b>
                </label>
              </div>
              <MTableToolbar {...props} />
            </div>
          ),
        }}
      />
    </div>
  );
};

export default PEPPatients;
