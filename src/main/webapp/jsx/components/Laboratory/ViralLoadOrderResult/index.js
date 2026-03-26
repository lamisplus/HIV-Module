import React, {useState, Fragment, useEffect } from "react";
import axios from "axios";
import { Row, Col, Card,  Tab, Tabs, } from "react-bootstrap";
import { Spinner } from "reactstrap";
import MatButton from "@material-ui/core/Button";
import { toast } from "react-toastify";
import ViralLoadOrderResult from './ViralLoadOrderResult';
import ViralLoadOrderResultHistory from "./ViralLoadOrderResultHistory";
import { url as baseUrl, token } from "../../../../api";
//import LaboratoryRDE from "./LaboratoryRDE";

const divStyle = {
  borderRadius: "2px",
  fontSize: 14,
};

const LaboratoryModule = (props) => {
    const [key, setKey] = useState('home');
    const [orderList, setOrderList] = useState([])
    const [loading, setLoading] = useState(false)
    const [initializing, setInitializing] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const patientObj = props.patientObj

    const initializeView = () => {
        setInitializing(true);
        axios
            .post(`${baseUrl}hiv/materialized-view/initialize`, {},
                { headers: { "Authorization": `Bearer ${token}` } }
            )
            .then((response) => {
                setInitializing(false);
                toast.success(response.data.message || "Viral load eligibility view initialized successfully", { position: toast.POSITION.BOTTOM_CENTER });
            })
            .catch((error) => {
                setInitializing(false);
                const msg = error.response?.data?.message || "Failed to initialize materialized view. Please try again.";
                toast.error(msg, { position: toast.POSITION.BOTTOM_CENTER });
            });
    };

    const refreshView = () => {
        setRefreshing(true);
        axios
            .post(`${baseUrl}hiv/materialized-view/refresh`, {},
                { headers: { "Authorization": `Bearer ${token}` } }
            )
            .then((response) => {
                setRefreshing(false);
                toast.success(response.data.message || "Viral load eligibility view refreshed successfully", { position: toast.POSITION.BOTTOM_CENTER });
            })
            .catch((error) => {
                setRefreshing(false);
                const msg = error.response?.data?.message || "Failed to refresh materialized view. Please try again.";
                toast.error(msg, { position: toast.POSITION.BOTTOM_CENTER });
            });
    };

    useEffect ( () => {
      LabOrders();
      setKey(props.activeContent.activeTab)
    }, [props.activeContent.id, props.activeContent.activeTab]);
    //GET Patient Lab order history
    const  LabOrders=()=> {
      setLoading(true)
      axios
          .get(`${baseUrl}laboratory/vl-results/patients/${props.patientObj.id}`,
          { headers: {"Authorization" : `Bearer ${token}`} }
          )
          .then((response) => {
              setLoading(false)
              setOrderList(response.data);
          })
          .catch((error) => {
              setLoading(false)
          });
    }

  return (
    <Fragment>  
      <Row>       
        <Col xl={12}>
          <Card style={divStyle}>            
            <Card.Body>
              {/* <!-- Materialized View Actions --> */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "10px" }}>
                {initializing && <Spinner />}
                <MatButton
                    variant="contained"
                    color="primary"
                    style={{ backgroundColor: "#014d88", textTransform: "capitalize" }}
                    disabled={initializing || refreshing}
                    onClick={initializeView}
                >
                    {initializing ? "Initializing..." : "Initialize View"}
                </MatButton>
                {refreshing && <Spinner />}
                <MatButton
                    variant="contained"
                    color="primary"
                    style={{ backgroundColor: "#992E62", textTransform: "capitalize" }}
                    disabled={initializing || refreshing}
                    onClick={refreshView}
                >
                    {refreshing ? "Refreshing..." : "Refresh View"}
                </MatButton>
              </div>
              {/* <!-- Nav tabs --> */}
              <div className="custom-tab-1">
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-3"
                >
                 
                  <Tab eventKey="viralLoad" title="VIRAL LOAD ORDER & RESULT">                   
                    <ViralLoadOrderResult patientObj={patientObj} setActiveContent={props.setActiveContent} activeContent={props.activeContent} LabOrders={LabOrders}/>
                  </Tab>
                  <Tab eventKey="history" title=" HISTORY">
                    <ViralLoadOrderResultHistory patientObj={patientObj} setActiveContent={props.setActiveContent} orderList={orderList} LabOrders={LabOrders} loading={loading}/>
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

export default LaboratoryModule;
