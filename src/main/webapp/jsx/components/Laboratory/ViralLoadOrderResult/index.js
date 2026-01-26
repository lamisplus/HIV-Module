import React, {useState, Fragment, useEffect } from "react";
import axios from "axios";
import { Row, Col, Card,  Tab, Tabs, } from "react-bootstrap";
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
    const patientObj = props.patientObj
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
