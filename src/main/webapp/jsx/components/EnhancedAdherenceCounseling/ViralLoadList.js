import React, { useEffect, useState } from 'react'
import MaterialTable from 'material-table';
import axios from "axios";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { token as token, url as baseUrl } from "./../../../api";
import { forwardRef } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Link } from 'react-router-dom'
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
import {  Card,CardBody,} from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';
import 'react-widgets/dist/css/react-widgets.css';
import { makeStyles } from '@material-ui/core/styles'
import "@reach/menu-button/styles.css";
import "@reach/menu-button/styles.css";
import 'semantic-ui-css/semantic.min.css';
import "react-widgets/dist/css/react-widgets.css";
import { toast} from "react-toastify";
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

const useStyles = makeStyles(theme => ({
    card: {
        margin: theme.spacing(20),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    cardBottom: {
        marginBottom: 20
    },
    Select: {
        height: 45,
        width: 350
    },
    button: {
        margin: theme.spacing(1)
    },

    root: {
        '& > *': {
            margin: theme.spacing(1)
        }
    },
    input: {
        display: 'none'
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


const LabHistory = (props) => {    
    const [orderList, setOrderList] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        LabOrders()
      }, [props.patientObj.id]);
    //GET LIST OF Patients
    async function LabOrders() {
        setLoading(true)
        axios
            .get(`${baseUrl}hiv/eac/patient/${props.patientObj.id}`,
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


    const onClickHome = (row, actionType) =>{  
        // props.setActiveContent({...props.activeContent, route:'pharmacy', activeTab:"hsitory"})
         props.setActiveContent({...props.activeContent, route:'eac-session', id:row.id, activeTab:"history", actionType:actionType, obj:row})
     }

    const LoadEacOutCome = (row, actionType) =>{
        // const row= props.activeContent.obj
        // const actionType ="history"
        props.setActiveContent({...props.activeContent, route:'eac-outcome', id:row.id, activeTab:"history", actionType:actionType, obj:row})
    }

     const LoadDeletePage = (row) =>{  
      axios.delete(`${baseUrl}laboratory/rde-orders/tests/${row.id}`,
              { headers: {"Authorization" : `Bearer ${token}`} }
          )
          .then((response) => {
              toast.success("Record Deleted Successfully");
              LabOrders()
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

   //const LabObj = [{"id":16,"orderId":13,"patientId":9,"visitId":0,"labTestGroupId":4,"labTestGroupName":"Others","labTestId":16,"labTestName":"Viral Load","labNumber":"788","sampleCollectionDate":"2022-09-08","dateAssayed":"2022-09-09","result":"78","dateResultReceived":"2022-09-09","comments":"good","viralLoadIndication":297,"viralLoadIndicationName":"Targeted Monitoring"}]


  return (
    <div>
            <br/>
        
            <MaterialTable
            icons={tableIcons}
              title="EAC LIST"
              columns={[
                { title: "Test Name", field: "testName", filtering: false },
                { title: "Lab Number", field: "labNumber", filtering: false },
                { title: "Viral Load", field: "lastViralLoad", filtering: false },
                { title: "Result Date", field: "dateOfLastViralLoad", filtering: false },
                { title: "Status", field: "status", filtering: false },              
                { title: "Action", field: "Action", filtering: false },

              ]}
              isLoading={loading}
              data={ orderList.map((row) => ({
                  //Id: manager.id,
                  //testGroup:row.testGroup,
                  testName: row.testName,
                  labNumber: row.labNumber,
                  lastViralLoad: row.lastViralLoad,    
                  dateOfLastViralLoad: row.dateOfLastViralLoad,
                  status: row.status, 
                  viralLoadIndication: row.viralLoadIndicationName,
                  Action: 
                  (
                    <ButtonGroup variant="contained" 
                        aria-label="split button"
                                 style={{
                                     backgroundColor:'rgb(153, 46, 98)',
                                     height:'30px',
                                     whiteSpace: 'nowrap',
                                     overflow: 'hidden',
                                     textOverflow: 'ellipsis'
                                 }}
                                 size="large"
                        // onClick={()=>onClickHome(row, 'view')}
                    >
                    <Button
                    color="primary"
                    size="small"
                    aria-label="select merge strategy"
                    aria-haspopup="menu"
                    style={{
                        backgroundColor:'rgb(153, 46, 98)',
                        height:'30px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}

                    onClick={()=>onClickHome(row, 'view')}
                    >
                       Eac Session
                    </Button>
                        { row?.status === "COMPLETED" && <Button
                            color="primary"
                            size="small"
                            aria-label="select merge strategy"
                            aria-haspopup="menu"
                            style={{backgroundColor:'rgb(153, 46, 98)'}}
                            onClick={()=>LoadEacOutCome(row, 'view')}
                        >
                            Outcome
                        </Button>
                        }
                    </ButtonGroup>
                  ),
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
                          pageSize:10,
                          debounceInterval: 400
                      }}
            />
       
    </div>
  );
}

export default LabHistory;


