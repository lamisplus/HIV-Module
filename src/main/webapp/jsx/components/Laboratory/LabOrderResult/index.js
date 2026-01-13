import React, {useState, Fragment, useEffect } from "react";
import axios from "axios";
import { Row, Col, Card,  Tab, Tabs, } from "react-bootstrap";
import LabOrderResult from './LabOrderResult';
import LabOrderResultHistory from "./LabOrderResultHistory";
import { url as baseUrl, token } from "../../../../api";
//import LaboratoryRDE from "./LaboratoryRDE";

const divStyle = {
  borderRadius: "2px",
  fontSize: 14,
};

const LaboratoryModule = (props) => {
    const [key, setKey] = useState('labOrder');
    const [orderList, setOrderList] = useState([])
    const [loading, setLoading] = useState(false)
    const patientObj = props.patientObj
    useEffect ( () => {
      LabOrders();
      setKey(props.activeContent.activeTab)
    }, [props.activeContent.id, props.activeContent.activeTab]);
    //GET Patient Lab order history
    async function LabOrders() {
      setLoading(true)
      axios
          .get(`${baseUrl}laboratory/rde-orders/patients/${props.patientObj.id}`,
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
              {/* <!-- Nav tabs --> */}
              <div className="custom-tab-1">
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-3"
                >
                  {/* <Tab eventKey="checked-in" title="Checked In Patients">                   
                    <CheckedInPatients />
                  </Tab> */}
                  <Tab eventKey="labOrder" title="LAB ORDER & RESULT">                   
                    <LabOrderResult patientObj={patientObj} setActiveContent={props.setActiveContent} LabOrders={LabOrders}/>
                  </Tab>
                  
                  <Tab eventKey="history" title=" HISTORY">
                   <LabOrderResultHistory patientObj={patientObj} setActiveContent={props.setActiveContent} orderList={orderList} LabOrders={LabOrders} loading={loading}/>
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
