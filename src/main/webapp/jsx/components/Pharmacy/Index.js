import React, { useState, Fragment, useEffect } from "react";
import { Row, Col, Card, Tab, Tabs } from "react-bootstrap";
//import PharmacyRefill from './PharmacyRefill';
import axios from "axios";
import PharmacyRefillUpdate from "./PharmacyRefillViewUpdate";
import PharmacyHistory from "./PharmacyHistory";
import PharmacyRefillNew from "./PharmacyRefillNew";
import { token as token, url as baseUrl } from "./../../../api";

const divStyle = {
  borderRadius: "2px",
  fontSize: 14,
};

const PharmacyModule = (props) => {
  const [key, setKey] = useState("drug-refill");
  const patientObj = props.patientObj;
  const [loading, setLoading] = useState(true);
  const [refillList, setRefillList] = useState([]);
  useEffect(() => {
    PharmacyList();
    setKey(props.activeContent.activeTab);
  }, [props.activeContent.id, props.activeContent.activeTab]);

  const PharmacyList = () => {
    setLoading(true);
    axios
      .get(
        `${baseUrl}hiv/art/pharmacy/patient?pageNo=0&pageSize=10&personId=${props.patientObj.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setLoading(false);
        setRefillList(response.data);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const handleTabSelect = (k) => {
    setKey(k);
    // Reset actionType when navigating to drug-refill tab to show clean form
    if (k === "drug-refill" && props.activeContent.actionType === "update") {
      props.setActiveContent({
        ...props.activeContent,
        actionType: null,
        id: null,
        obj: null
      });
    }
  };

  return (
    <Fragment>
      <Row>
        <Col xl={12}>
          <Card style={divStyle}>
            <Card.Body>
              {/* <!-- Nav tabs --> */}
              <div className="custom-tab-1">
                <Tabs
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={handleTabSelect}
                  className="mb-3"
                >

                  <Tab eventKey="drug-refill" title="Pharmacy Drug Refill ">
                    {props.activeContent.actionType === "update" ? (
                      <PharmacyRefillUpdate
                        patientObj={patientObj}
                        setActiveContent={props.setActiveContent}
                        activeContent={props.activeContent}
                        PharmacyList={PharmacyList}
                      />
                    ) : (
                      <PharmacyRefillNew
                        patientObj={patientObj}
                        setActiveContent={props.setActiveContent}
                        activeContent={props.activeContent}
                        PharmacyList={PharmacyList}
                      />
                    )}
                  </Tab>
                  <Tab eventKey="history" title=" History">
                    <PharmacyHistory
                      patientObj={patientObj}
                      setActiveContent={props.setActiveContent}
                      activeContent={props.activeContent}
                      PharmacyList={PharmacyList}
                      refillList={refillList}
                      loading={loading}
                    />
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

export default PharmacyModule;
