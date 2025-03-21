import React, { useEffect, useState } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import Import from "./Import";
import axios from "axios";

import { token as token, url as baseUrl } from "../../../api";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { MdDashboard } from "react-icons/md";
import "@reach/menu-button/styles.css";
import { Label } from "semantic-ui-react";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import IosShareIcon from "@mui/icons-material/IosShare";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import moment from "moment";
//import { FaUserPlus } from "react-icons/fa";
import { TiArrowForward } from "react-icons/ti";

//Dtate Picker package
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

const Patient = (props) => {
  const [showPPI, setShowPPI] = useState(true);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const handleCheckBox = (e) => {
    if (e.target.checked) {
      setShowPPI(false);
    } else {
      setShowPPI(true);
    }
  };

  const exportFile = async () => {
    try {
      const response = await axios
        .get(`${baseUrl}linkages/export`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((resp) => {
          toast.success(`${resp.data}`, {
            position: toast.POSITION.TOP_CENTER,
          });
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (e) {}
  };

    const formattedDate = (inputDate) => {
      const dateObject = new Date(inputDate);
      const year = dateObject.getFullYear();
      const month = String(dateObject.getMonth() + 1).padStart(2, "0");
      const day = String(dateObject.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

  return (
    <>
      <div>
        <Button
          variant="contained"
          color="primary"
          className=" float-right mr-1"
          startIcon={<IosShareIcon />}
          style={{ backgroundColor: "rgb(153, 46, 98)" }}
          onClick={exportFile}
        >
          <span style={{ textTransform: "capitalize" }}>Export </span>
        </Button>{" "}
        <Button
          variant="contained"
          color="primary"
          className=" float-right mr-1"
          startIcon={<SystemUpdateAltIcon />}
          style={{ backgroundColor: "rgb(153, 46, 98)" }}
          onClick={toggle}
        >
          <span style={{ textTransform: "capitalize" }}>Import </span>
        </Button>
        <br />
        <br />
        <MaterialTable
          icons={tableIcons}
          title="OVC Beneficiaries"
          columns={[
            {
              title: "Patient Name",
              field: "name",
              hidden: showPPI,
            },
            { title: "Art Number", field: "artNumber", filtering: false },
            {
              title: "Care giver other name",
              field: "caregiverOtherName",
              filtering: false,
            },
            {
              title: "Care giver surname",
              field: "caregiverSurname",
              filtering: false,
            },
            { title: "CBO Name", field: "cboName", filtering: false },
            //{ title: "ART Number", field: "v_status", filtering: false },
            {
              title: "Enrolled In OVC Program",
              field: "enrolledInOvcProgram",
              filtering: false,
            },
            { title: "Created Date", field: "createdDate", filtering: false },
            { title: "Actions", field: "actions", filtering: false },
          ]}
          data={(query) =>
            new Promise((resolve, reject) =>
              axios
                .get(`${baseUrl}linkages`, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => response)
                .then((result) => {
                  resolve({
                    data: result.data.map((row) => ({
                      name: row.lastName,
                      artNumber: row.artNumber,
                      caregiverOtherName: row.caregiverOtherName,
                      caregiverSurname: row.caregiverSurname,
                      cboName: row.cboName,
                      enrolledInOvcProgram: row.enrolledInOvcProgram,
                      createdDate: formattedDate(row.createdDate),
                      actions: (
                        <Link
                          to={{
                            pathname: "/register-patient",
                            state: { patientObj: row },
                          }}
                        >
                          <ButtonGroup
                            variant="contained"
                            aria-label="split button"
                            style={{
                              backgroundColor: "rgb(153, 46, 98)",
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
                                backgroundColor: "rgb(153, 46, 98)",
                              }}
                            >
                              <MdDashboard />
                            </Button>
                            <Button
                              style={{
                                backgroundColor: "rgb(153, 46, 98)",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "12px",
                                  color: "#fff",
                                  fontWeight: "bolder",
                                }}
                              >
                                Enroll Beneficiary
                              </span>
                            </Button>
                          </ButtonGroup>
                        </Link>
                      ),
                    })),
                  });
                })
            )
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
            exportButton: false,
            searchFieldAlignment: "left",
            pageSizeOptions: [10, 20, 100],
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
                    name="showPP!"
                    id="showPP"
                    value="showPP"
                    checked={showPPI === true ? false : true}
                    onChange={handleCheckBox}
                    style={{
                      border: "1px solid #014D88",
                      borderRadius: "0.25rem",
                    }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="basic_checkbox_1"
                  >
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
      <Import modal={modal} toggle={toggle} />
    </>
  );
};

export default Patient;
