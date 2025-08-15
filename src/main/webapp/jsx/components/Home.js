import React, { useState, Fragment, useEffect, lazy, Suspense,useMemo, memo } from "react";
import { Row, Col, Card, Tab, Tabs } from "react-bootstrap";
import LoadingSpinner from "../../reuseables/Loading";
const Dashboard = lazy(() => import("./Patient/PatientList"));
const CheckedInPatients = lazy(() => import("./Patient/CheckedInPatients"));
const ArtPatients = lazy(() => import("./Patient/ArtPatients"));
const Ovc = lazy(() => import("./Ovc/Index"));
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { FaUserPlus } from "react-icons/fa";
import { usePermissions } from "../../hooks/usePermissions";
import { useRoles } from "../../hooks/useRoles";

const divStyle = {
  borderRadius: "2px",
  fontSize: 14,
};

const Home = () => {
  const { hasPermission, loading } = usePermissions();
  const { hasRole, loading: rolesLoading } = useRoles();
  const [key, setKey] = useState("checkedIn");
  const [activeTab, setActiveTab] = useState("checkedIn");

  const handleTabSelect = (k) => {
    setKey(k);
    setActiveTab(k);
  };

  const isRDE = hasRole("RDE");

  useEffect(() => {
    if (!rolesLoading) {
      const defaultTab = isRDE ? "home" : "checkedIn";
      setKey(defaultTab);
      setActiveTab(defaultTab);
    }
  }, [rolesLoading, isRDE]);

  const permissions = useMemo(
    () => ({
      canSeeCheckedInPatients: !isRDE, // POC users see this
      canSeeFindPatients: isRDE, // RDE users see this
      canSeeArtPatients: isRDE, // RDE users see this
      canSeeOvcLinkage: isRDE, // RDE users see this
    }),
    [isRDE]
  );

  if (rolesLoading || loading) {
    return <LoadingSpinner />;
  }

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
      {isRDE && (
                <Link to={"register-patient"}>
                  <Button
                    variant="contained"
                    color="primary"
                    className="float-end mb-10"
                    startIcon={<FaUserPlus size="10" />}
                    style={{ backgroundColor: "#014d88" }}
                  >
                    <span style={{ textTransform: "capitalize" }}>New Patient</span>
                  </Button>
                </Link>
              )}
     
      <br />
      <br />
      <Row>
        <Col xl={12}>
          <Card style={divStyle}>
            <Card.Body>
              <div className="custom-tab-1">
                <Tabs
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={handleTabSelect}
                  className="mb-3"
                >
                  {permissions.canSeeCheckedInPatients && (
                    <Tab eventKey="checkedIn" title="Checked-In Patients">
                      <Suspense fallback={<LoadingSpinner />}>
                        {activeTab === "checkedIn" && <CheckedInPatients />}
                      </Suspense>
                    </Tab>
                  )}
            
                  {permissions.canSeeFindPatients && (
                    <Tab eventKey="home" title="Find Patients">
                      <Suspense fallback={<LoadingSpinner />}>
                        {activeTab === "home" && <Dashboard />}
                      </Suspense>
                    </Tab>
                  )}

                  {permissions.canSeeArtPatients && (
                    <Tab eventKey="art-patients" title="ART Patients">
                      <Suspense fallback={<LoadingSpinner />}>
                        {activeTab === "art-patients" && <ArtPatients />}
                      </Suspense>
                    </Tab>
                  )}

                  {permissions.canSeeOvcLinkage && (
                    <Tab eventKey="list" title="OVC Linkage">
                      <Suspense fallback={<LoadingSpinner />}>
                        {activeTab === "list" && <Ovc />}
                      </Suspense>
                    </Tab>
                  )}
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