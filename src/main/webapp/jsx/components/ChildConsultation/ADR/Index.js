import React, { Fragment, useState, useEffect } from "react";
// import { Link } from 'react-router-dom';
import { Row } from "react-bootstrap";
import {  Modal, Button, Table  } from "react-bootstrap";
import { Input, Label, FormGroup, InputGroupText, InputGroup, Col , CardBody, Card } from "reactstrap";
import { Tab, Grid,} from 'semantic-ui-react'
import MatButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

import {Icon, List, Label as LabelSui} from 'semantic-ui-react'
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@material-ui/icons/Delete'

const useStyles = makeStyles(theme => ({ 
    button: {
      margin: theme.spacing(1)
    },
    error: {
      color: "#f85032",
      fontSize: "11px",
  },
  success: {
      color: "#4BB543 ",
      fontSize: "11px",
  },
}))
let adherenceLevelObj= []

const ADR = (props) => {
  const patientObj = props.patientObj;
  const classes = useStyles();

  const [prepSideEffect, setPrepSideEffect] = useState([]);
  const [adrObj, setAdrObj] = useState({adr:"", adrOnsetDate:""});
  const [adrList, setAdrList] = useState([]);
  
  const [objValues, setObjValues] = useState({
                                                adherenceLevel: "",
                                                adheres: {},
                                                adrScreened: "",
                                                adverseDrugReactions: {},
                                                artStatusId: 0,
                                                cd4: "",
                                                cd4Percentage: 0,
                                                clinicalNote: "",
                                                clinicalStageId: 0,
                                                facilityId: 0,
                                                functionalStatusId: 0,
                                                hivEnrollmentId: 0,
                                                nextAppointment: "",
                                                lmpDate:"",
                                                oiScreened: "",
                                                opportunisticInfections: {},
                                                personId: 0,
                                                stiIds: "",
                                                stiTreated: "",
                                                uuid: "",
                                                visitDate: "",
                                                
                                                whoStagingId: 0
                                              });
  const [vital, setVitalSignDto]= useState({
                                            bodyWeight: "",
                                            diastolic:"",
                                            encounterDate: "",
                                            facilityId: 1,
                                            height: "",
                                            personId: "",
                                            serviceTypeId: 1,
                                            systolic:"" 
                                            })

 

  const handAdrleInputChange = e => {
    setAdrObj ({...adrObj,  [e.target.name]: e.target.value});
  }
  const addADR = e => { 
    setAdrList([...adrList, adrObj])
  }
  /* Remove ADR  function **/
  const removeRelativeLocation = index => {       
      adrList.splice(index, 1);
      setAdrList([...adrList]);
     
  };


  return (
    <div>
        <div className="row">
        <div className="form-group mb-3 col-md-5">
            <FormGroup>
            <Label >ADR </Label>
            <Input
                type="select"
                name="adr"
                id="adr"
                value={adrObj.adr}
                onChange={handAdrleInputChange}
                required
                >
                  <option value=""> </option>

                    {prepSideEffect.map((value) => (
                        <option key={value.id} value={value.display}>
                            {value.display}
                        </option>
                    ))}
            </Input>
          
            </FormGroup>
        </div>
        <div className="form-group mb-3 col-md-5">        
        <FormGroup>
            <Label > Onset Date</Label>
            <Input
                type="date"
                name="adrOnsetDate"
                id="adrOnsetDate"
                value={adrObj.adrOnsetDate}
                onChange={handAdrleInputChange}
                required
                onKeyPress={(e) => e.preventDefault()}
                > 
            </Input>
          
            </FormGroup>
        </div>
        
        <div className="form-group mb-3 col-md-2">
        <LabelSui as='a' color='black'  onClick={addADR}  size='tiny' style={{ marginTop:35}}>
            <Icon name='plus' /> Add
        </LabelSui>
        </div>

        {adrList.length >0 
          ?
            <List>
            <Table  striped responsive>
                  <thead >
                      <tr>
                          <th>ADR</th>
                          <th>OnSetDate</th>
                          <th ></th>
                      </tr>
                  </thead>
                  <tbody>
                {adrList.map((relative, index) => (

                  <RelativeList
                      key={index}
                      index={index}
                      relative={relative}
                      removeRelativeLocation={removeRelativeLocation}
                  />
                  ))}
                  </tbody>
                  </Table>
                </List>
                :
                ""
            }       
    </div>
    </div>
     
  );
};

function RelativeList({
  relative,
  index,
  removeRelativeLocation,
}) {


  return (
          <tr>
              <th>{relative.adr}</th>
              <th>{relative.adrOnsetDate}</th>
              <th></th>
              <th >
                  <IconButton aria-label="delete" size="small" color="error" onClick={() =>removeRelativeLocation(index)}>
                      <DeleteIcon fontSize="inherit" />
                  </IconButton>
                  
              </th>
          </tr> 
  );
}


export default ADR;
