import React, { useEffect, useState } from 'react'
import MaterialTable from 'material-table';
import axios from "axios";
import { url as baseUrl } from "./../../../api";
import { token as token } from "./../../../api";
import { forwardRef } from 'react';
import 'semantic-ui-css/semantic.min.css';
import "react-widgets/dist/css/react-widgets.css";
import { toast} from "react-toastify";

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import 'react-toastify/dist/ReactToastify.css';
import 'react-widgets/dist/css/react-widgets.css';
import {  Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";
//import {Menu,MenuList,MenuButton,MenuItem,} from "@reach/menu-button";
import "@reach/menu-button/styles.css";

import { Dropdown,Button, Menu, Icon } from 'semantic-ui-react'


const tableIcons = {
Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};


const PatientnHistory = (props) => {
    const [recentActivities, setRecentActivities] = useState([])
    const [loading, setLoading] = useState(true)
    let history = useHistory();
    const [notToBeUpdated, setNotToBeUpdated] = useState(['eac', 'eac-session', 'client-tracker']);
    //let patientHistoryObject = []
    const [open, setOpen] = React.useState(false)
    const [saving, setSaving] = useState(false)
    const [record, setRecord] = useState(null)
     const toggle = () => setOpen(!open);
    useEffect(() => {
        PatientHistory()
      }, [props.patientObj.id]);
        ///GET LIST OF Patients
        const PatientHistory =()=>{
            setLoading(true)
            axios
               .get(`${baseUrl}hiv/patients/${props.patientObj.id}/history/activities`,
                   { headers: {"Authorization" : `Bearer ${token}`} }
               )
               .then((response) => {
                setLoading(false)
                        // let HistoryObject= []
                        // response.data.forEach(function(value, index, array) {
                        //     const dataObj = value.activities 
                        //     console.log(dataObj)                 
                        //     if(dataObj[index]) {
                        //         dataObj.forEach(function(value, index, array) {
                        //             HistoryObject.push(value)
                        //         })                       
                        //     }                   
                        // });
                    setRecentActivities(response.data)
                })

               .catch((error) => {
               //console.log(error);
               });
           
          }
    
    const LoadViewPage =(row,action)=>{
        
        if(row.path==='Mental-health'){        
            props.setActiveContent({...props.activeContent, route:'mental-health-view', id:row.id, actionType:action})

        }else if(row.path==='Art-commence'){
            props.setActiveContent({...props.activeContent, route:'art-commencement-view', id:row.id, actionType:action})

        }else if(row.path==='Clinical-evaluation'){
            props.setActiveContent({...props.activeContent, route:'adult-clinic-eveluation-view', id:row.id, actionType:action})

        }else if(row.path==='eac1'){
            props.setActiveContent({...props.activeContent, route:'first-eac-history', id:row.id, actionType:action})
        }
        else if(row.path==='eac2'){
            props.setActiveContent({...props.activeContent, route:'second-eac-history', id:row.id, actionType:action})
        }
        else if(row.path==='eac3'){
            props.setActiveContent({...props.activeContent, route:'completed-eac-history', id:row.id, actionType:action})
        }else if(row.path==='hiv-enrollment'){
            history.push({
                pathname: '/update-patient',
                state: { id: row.id, patientObj:props.patientObj, actionType:action }
            });
            //props.setActiveContent({...props.activeContent, route:'mental-health-history', id:row.id})
        }else if(row.path==='pharmacy'){
            //props.setActiveContent({...props.activeContent, route:'mental-health-history', id:row.id})
            props.setActiveContent({...props.activeContent, route:'pharmacy-update', id:row.id, activeTab:"history", actionType:action, obj:row})

        }else if(row.path==='Laboratory'){
            props.setActiveContent({...props.activeContent, route:'mental-health-history', id:row.id, actionType:action})

        }else if(row.path==='clinic-visit'){
            props.setActiveContent({...props.activeContent, route:'consultation', id:row.id, activeTab:"history", actionType:action, })
      
        }else if(row.path==='Intensive-follow-up'){
            props.setActiveContent({...props.activeContent, route:'intensive-follow-up-update', id:row.id, activeTab:"history", actionType:action, })
      
        }else if(row.path==='Intensive-follow-up'){
            props.setActiveContent({...props.activeContent, route:'intensive-follow-up-update', id:row.id, activeTab:"history", actionType:action, })
      
        }else if(row.path==='client-tracker'){
            props.setActiveContent({...props.activeContent, route:'client-tracker', id:row.id, activeTab:"history", actionType:action, })
      
        }else if(row.path==='eac-session'){
            props.setActiveContent({...props.activeContent, route:'eac-session-update', id:row.id, activeTab:"history", actionType:action, })
      
        }else if(row.path==='Cervical-cancer'){
            props.setActiveContent({...props.activeContent, route:'cervical-cancer-update', id:row.id, activeTab:"history", actionType:action, })
      
        }else{

        }
        
    }
    const LoadDeletePage =(row)=>{
        
        if(row.path==='Mental-health'){ 
            setSaving(true)        
            //props.setActiveContent({...props.activeContent, route:'mental-health-view', id:row.id})
            axios
            .delete(`${baseUrl}observation/${row.id}`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                toast.success("Record Deleted Successfully");
                PatientHistory()
                toggle()
                setSaving(false) 
            })
            .catch((error) => {
                if(error.response && error.response.data){
                    let errorMessage = error.response.data.apierror && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
                    toast.error(errorMessage);
                  }
                  else{
                    toast.error("Something went wrong. Please try again...");
                  }
            });  
        }else if(row.path==='Art-commence'){
            setSaving(true) 
            //props.setActiveContent({...props.activeContent, route:'art-commencement-view', id:row.id})
            axios
            .delete(`${baseUrl}hiv/art/commencement/${row.id}`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                toast.success("Record Deleted Successfully");
                PatientHistory()
                toggle()
                setSaving(false) 
            })
            .catch((error) => {
                if(error.response && error.response.data){
                    let errorMessage = error.response.data.apierror && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
                    toast.error(errorMessage);
                  }
                  else{
                    toast.error("Something went wrong. Please try again...");
                  }
            });

        }else if(row.path==='Clinical-evaluation'){
            setSaving(true) 
            //props.setActiveContent({...props.activeContent, route:'adult-clinic-eveluation-view', id:row.id})
            axios
            .delete(`${baseUrl}observation/${row.id}`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                toast.success("Record Deleted Successfully");
                PatientHistory()
                toggle()
                setSaving(false) 
            })
            .catch((error) => {
                if(error.response && error.response.data){
                    let errorMessage = error.response.data.apierror && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
                    toast.error(errorMessage);
                  }
                  else{
                    toast.error("Something went wrong. Please try again...");
                  }
            });

        }else if(row.path==='eac1'){
            setSaving(true) 
            //props.setActiveContent({...props.activeContent, route:'first-eac-history', id:row.id})
            axios
            .delete(`${baseUrl}observation/eac/${row.id}`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                toast.success("Record Deleted Successfully");
                PatientHistory()
                toggle()
                setSaving(false) 
            })
            .catch((error) => {
                if(error.response && error.response.data){
                    let errorMessage = error.response.data.apierror && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
                    toast.error(errorMessage);
                  }
                  else{
                    toast.error("Something went wrong. Please try again...");
                  }
            });  
        }
        else if(row.path==='eac2'){
            setSaving(true) 
            //props.setActiveContent({...props.activeContent, route:'second-eac-history', id:row.id})
            axios
            .delete(`${baseUrl}observation/eac/${row.id}`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                toast.success("Record Deleted Successfully");
                PatientHistory()
                toggle()
                setSaving(false) 
            })
            .catch((error) => {
                if(error.response && error.response.data){
                    let errorMessage = error.response.data.apierror && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
                    toast.error(errorMessage);
                  }
                  else{
                    toast.error("Something went wrong. Please try again...");
                  }
            });  
        }
        else if(row.path==='eac3'){
            setSaving(true) 
            //props.setActiveContent({...props.activeContent, route:'completed-eac-history', id:row.id})
            axios
            .delete(`${baseUrl}observation/eac/${row.id}`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                toast.success("Record Deleted Successfully");
                PatientHistory()
                toggle()
                setSaving(false) 
            })
            .catch((error) => {
                if(error.response && error.response.data){
                    let errorMessage = error.response.data.apierror && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
                    toast.error(errorMessage);
                  }
                  else{
                    toast.error("Something went wrong. Please try again...");
                  }
            });  
        }else if(row.path==='hiv-enrollment'){
            setSaving(true) 
            axios
            .delete(`${baseUrl}hiv/enrollment/${row.id}`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                toast.success("Record Deleted Successfully");
                PatientHistory()
                toggle()
                setSaving(false) 
            })
            .catch((error) => {
                if(error.response && error.response.data){
                    let errorMessage = error.response.data.apierror && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
                    toast.error(errorMessage);
                  }
                  else{
                    toast.error("Something went wrong. Please try again...");
                  }
            });  
            //props.setActiveContent({...props.activeContent, route:'mental-health-history', id:row.id})
        }else if(row.path==='pharmacy'){
            setSaving(true) 
            //props.setActiveContent({...props.activeContent, route:'mental-health-history', id:row.id})
            //props.setActiveContent({...props.activeContent, route:'pharmacy', id:row.id, activeTab:"home", actionType:"update", obj:row})
            axios
            .delete(`${baseUrl}art/pharmacy/${row.id}`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                toast.success("Record Deleted Successfully");
                PatientHistory()
                toggle()
                setSaving(false) 
            })
            .catch((error) => {
                if(error.response && error.response.data){
                    let errorMessage = error.response.data.apierror && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
                    toast.error(errorMessage);
                  }
                  else{
                    toast.error("Something went wrong. Please try again...");
                  }
            }); 

        }else if(row.path==='clinic-visit'){
            setSaving(true) 
            //props.setActiveContent({...props.activeContent, route:'mental-health-history', id:row.id})
            axios
            .delete(`${baseUrl}hiv/art/clinic-visit/${row.id}`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                toast.success("Record Deleted Successfully");
                PatientHistory()
                toggle()
                setSaving(false) 
            })
            .catch((error) => {
                if(error.response && error.response.data){
                    let errorMessage = error.response.data.apierror && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
                    toast.error(errorMessage);
                  }
                  else{
                    toast.error("Something went wrong. Please try again...");
                  }
            }); 
        }else{

        }
        
    }
    const LoadModal =(row)=>{
        toggle()
        setRecord(row)
    }  

  return (
    <div>
        
    <br/>
       
            <MaterialTable
            icons={tableIcons}
              title="Patient History "
              columns={[
                { title: "Name", field: "name" },
                {
                  title: "Encounter Date",
                  field: "date",
                },               
                // { title: "Status", field: "status", filtering: false },        
                { title: "Actions", field: "actions", filtering: false }, 
              ]}
              isLoading={loading}
              data={recentActivities && recentActivities.map((row) => ({
                   name: row.name,
                   date: row.date,
                   actions: !notToBeUpdated.includes(row.path) ? (
                        <div>
                            <Menu.Menu position='right'  >
                            <Menu.Item >
                                <Button style={{backgroundColor:'rgb(153,46,98)'}} primary>
                                <Dropdown item text='Action'>

                                <Dropdown.Menu style={{ marginTop:"10px", }}>
                                    {row.viewable && ( <Dropdown.Item onClick={()=>LoadViewPage(row, 'view')}> <Icon name='eye' />View  </Dropdown.Item>)}
                                    {row.viewable && ( <Dropdown.Item  onClick={()=>LoadViewPage(row, 'update')}><Icon name='edit' />Edit</Dropdown.Item>)}
                                    {row.viewable && ( <Dropdown.Item  onClick={()=>LoadModal(row, 'delete')}> <Icon name='trash' /> Delete</Dropdown.Item>)} 
                                </Dropdown.Menu>
                            </Dropdown>
                                </Button>
                            </Menu.Item>
                            </Menu.Menu>
                        </div>
                   ):""
                  
                  }))}
            
                        options={{
                          headerStyle: {
                              backgroundColor: "#014d88",
                              color: "#fff",
                          },
                          searchFieldStyle: {
                              width : '200%',
                              margingLeft: '250px',
                          },
                          filtering: false,
                          exportButton: false,
                          searchFieldAlignment: 'left',
                          pageSizeOptions:[10,20,100],
                          pageSize:50,
                          debounceInterval: 400
                      }}
            />
        <Modal show={open} toggle={toggle} className="fade" size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered backdrop="static">
            <Modal.Header >
        <Modal.Title id="contained-modal-title-vcenter">
            Notification!
        </Modal.Title>
        </Modal.Header>
            <Modal.Body>
                <h4>Are you Sure you want to delete <b>{record && record.name}</b></h4>
                
            </Modal.Body>
        <Modal.Footer>
            <Button onClick={()=>LoadDeletePage(record)}  style={{backgroundColor:"red", color:"#fff"}} disabled={saving}>{saving===false ? "Yes": "Deleting..."}</Button>
            <Button onClick={toggle} style={{backgroundColor:"#014d88", color:"#fff"}} disabled={saving}>No</Button>
            
        </Modal.Footer>
        </Modal>   
    </div>
  );
}

export default PatientnHistory;


