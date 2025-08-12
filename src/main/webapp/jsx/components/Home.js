import React, { useState, Fragment, useEffect } from "react";
import { Row, Col, Card, Tab, Tabs } from "react-bootstrap";
import Dashboard from "./Patient/PatientList";
import ArtPatients from "./Patient/ArtPatients";
import Ovc from "./Ovc/Index";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { url as baseUrl } from "../../api";
import { FaUserPlus } from "react-icons/fa";
import { token } from "../../api";
import axios from "axios";
const divStyle = {
  borderRadius: "2px",
  fontSize: 14,
};

const Home = () => {
  const [key, setKey] = useState("home");
  // tab

  const fetchFacilityId = () => {
    axios
      .get(`${baseUrl}account`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const organisationUnitId = response.data.currentOrganisationUnitId;
        localStorage.setItem("facId", organisationUnitId);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    fetchFacilityId();
  }, []);

  return (
    <Fragment>
      <div
        className="row page-titles mx-0"
        style={{ marginTop: "0px", marginBottom: "-10px" }}
      >
        <ol className="breadcrumb">
          <li className="breadcrumb-item active">
            <h4>ART</h4>
          </li>
        </ol>
      </div>
      <Link to={"register-patient"}>
        <Button
          variant="contained"
          color="primary"
          className=" float-end mb-10"
          startIcon={<FaUserPlus size="10" />}
          style={{ backgroundColor: "#014d88" }}
        >
          <span style={{ textTransform: "capitalize" }}>New Patient</span>
        </Button>
      </Link>
      <br />
      <br />
      <Row>
        <Col xl={12}>
          <Card style={divStyle}>
            <Card.Body>
              {/* <!-- Nav tabs --> */}
              <div className="custom-tab-1">
                <Tabs
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                  className="mb-3"
                >
                  <Tab eventKey="home" title="Find Patients">
                    <Dashboard />
                  </Tab>
                  <Tab eventKey="art-patients" title="ART Patients">
                    <ArtPatients />
                  </Tab>
                  <Tab eventKey="list" title="OVC Linkage">
                    <Ovc />
                  </Tab>
                </Tabs>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default Home;
