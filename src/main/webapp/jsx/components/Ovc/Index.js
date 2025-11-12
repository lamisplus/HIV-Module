import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Card, CardBody } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { token, url as baseUrl } from "../../../api";
import { Tab } from "semantic-ui-react";
import List from "./List";
import Patient from "./Patient";
import {  getPermissions } from "../../../utils/localstorage";
// import LoadingSpinner from "../../../reuseables/Loading";

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
    "& a": {
      textDecoration: "none !important",
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



function Index(props) {
  const classes = useStyles();
  const [patients, setPatients] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState("");
  const [modal, setModal] = useState(false);
  const [patient, setPatient] = useState(false);
  const [enablePPI, setEnablePPI] = useState(true);
  const toggle = (id) => {
    const patient = patients.find((obj) => obj.id == id);
    setPatient(patient);
    setModal(!modal);
  };


  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const perms = await getPermissions();
        setPermissions(Array.isArray(perms) ? perms : []);
      } catch (error) {
        console.error("Error loading permissions:", error);
        setPermissions([]);
      }
    };
    loadPermissions();
  }, []);


  const enablePPIColumns = () => {
    setEnablePPI(!enablePPI);
  };
  const panes = [
    {
      menuItem: "OVC Beneficiary",
      render: () => (
        <Tab.Pane>
          <Patient permissions={permissions} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "OVC Treatment",
      render: () => (
        <Tab.Pane>
          <List permissions={permissions} />
        </Tab.Pane>
      ),
    },
  ];

  return (
    <div className={classes.root}>
      <ToastContainer autoClose={3000} hideProgressBar />
      {permissions.length > 0 && (
        <Card>
          <CardBody>
            <div className="row mb-12 col-md-12"></div>

            <Tab panes={panes} />
          </CardBody>
        </Card>
      )}
    </div>
  );
}

export default Index
