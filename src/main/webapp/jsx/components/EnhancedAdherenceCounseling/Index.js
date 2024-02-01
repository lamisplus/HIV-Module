import React, {useState, Fragment, useEffect } from "react";
import { Row, Col, Card,  Tab, Tabs, } from "react-bootstrap";
import ViralLoadList from "./ViralLoadList";

const divStyle = {
  borderRadius: "2px",
  fontSize: 14,
};

const LaboratoryModule = (props) => {
    const [key, setKey] = useState('home');
    const patientObj = props.patientObj
    useEffect ( () => {
      setKey(props.activeContent.activeTab)
    }, [props.activeContent.id]);
// console.log(props)
    
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
                 
                  <Tab eventKey="home" title="EAC LIST">                   
                    <ViralLoadList patientObj={patientObj} setActiveContent={props.setActiveContent} activeContent={props.activeContent}/>
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
