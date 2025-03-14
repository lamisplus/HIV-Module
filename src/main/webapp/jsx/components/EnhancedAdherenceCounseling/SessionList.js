import React, {useEffect, useState} from 'react'
import MaterialTable from 'material-table';
import axios from "axios";

import {token as token, url as baseUrl} from "./../../../api";
import {forwardRef} from 'react';
import 'semantic-ui-css/semantic.min.css';
import {Link} from 'react-router-dom'
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
import {Card, CardBody,} from 'reactstrap';
import ButtonMui from "@material-ui/core/Button";
import 'react-toastify/dist/ReactToastify.css';
import 'react-widgets/dist/css/react-widgets.css';
import {makeStyles} from '@material-ui/core/styles'
import "@reach/menu-button/styles.css";
import "@reach/menu-button/styles.css";
import 'semantic-ui-css/semantic.min.css';
import "react-widgets/dist/css/react-widgets.css";
import {toast} from "react-toastify";
import StopEac from './StopEac'
import {Dropdown, Button, Menu, Icon} from 'semantic-ui-react'

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref}/>),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref}/>),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref}/>),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref}/>),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref}/>),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref}/>),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref}/>),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref}/>),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref}/>),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref}/>),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref}/>),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref}/>),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref}/>)
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
    const [sessionList, setSessionList] = useState([])
    const [loading, setLoading] = useState(true)
    const [artModal, setArtModal] = useState(false);
    const [showOutComeButton, setShowOutComeButton] = useState(false);
    const Arttoggle = () => setArtModal(!artModal);
    useEffect(() => {
        LabOrders()
    }, [props.activeContent]);

    localStorage.removeItem("eacIc");
    const eacId = Number(props.activeContent.obj.id);
    if (!isNaN(eacId)) {
        localStorage.setItem("eacId", eacId);
    } else {
        console.error("Invalid eacId:", eacId);
    }

    const eacIdValue = localStorage.getItem("eacId");
    const eacid = Number(eacIdValue);

    async function LabOrders() {
        setLoading(true)
        axios
            .get(`${baseUrl}hiv/eac/session/eac/${eacid}`,
                {headers: {"Authorization": `Bearer ${token}`}}
            )
            .then((response) => {
                setLoading(false)
                setSessionList(response.data);
                if (sessionList.length >= 3) {
                    setShowOutComeButton(true)
                }
            })
            .catch((error) => {
                setLoading(false)
            });
    }

    const AddNewSession = () => {
        const row = props.activeContent.obj
        const actionType = "history"
        props.setActiveContent({
            ...props.activeContent,
            route: 'new-eac-session',
            id: row.id,
            activeTab: "history",
            actionType: actionType,
            obj: row
        })
    }
    const LoadEacOutCome = () => {
        const row = props.activeContent.obj
        const actionType = "history"
        props.setActiveContent({
            ...props.activeContent,
            route: 'eac-outcome',
            id: row.id,
            activeTab: "history",
            actionType: actionType,
            obj: row
        })
    }
    const loadEacStop = () => {
        setArtModal(!artModal)
    }
    const LoadViewPage = (row, action) => {
        props.setActiveContent({
            ...props.activeContent,
            route: 'eac-session-update',
            id: row.id,
            actionType: action,
            obj: row
        })
    }

    return (
        <div>
            {props.activeContent.obj.status !== 'COMPLETED' && props.activeContent.obj.status !== 'STOPPED' && sessionList.length > 0 && (
                <ButtonMui
                    variant="contained"
                    color="primary"
                    className=" float-end ms-2 mr-2 mt-2"
                    onClick={() => loadEacStop()}
                    style={{backgroundColor: "#000", color: '#fff', height: '35px'}}

                >
                    <span style={{textTransform: "capitalize"}}>Stop EAC</span>
                </ButtonMui>
            )}
            {sessionList.length >= 3 && props.activeContent.obj.status !== 'STOPPED' && props.activeContent.obj.status !== 'COMPLETED' && (
                <ButtonMui
                    variant="contained"
                    color="primary"
                    className=" float-end ms-2 mr-2 mt-2"
                    onClick={LoadEacOutCome}
                    style={{backgroundColor: "rgb(153, 46, 98)", color: '#fff', height: '35px'}}

                >
                    <span style={{textTransform: "capitalize"}}>Outcome</span>
                </ButtonMui>
            )}
            {props.activeContent.obj.status !== 'COMPLETED' && props.activeContent.obj.status !== 'STOPPED' && sessionList.length <= 5 && (
                <ButtonMui
                    variant="contained"
                    color="primary"
                    className=" float-end ms-2 mr-2 mt-2 "
                    onClick={AddNewSession}
                    style={{backgroundColor: "#014D88", color: '#fff', height: '35px'}}

                >
                    <span style={{textTransform: "capitalize"}}>Add Session</span>
                </ButtonMui>
            )}
            <br/> <br/> <br/>

            <MaterialTable
                icons={tableIcons}
                title="EAC Sessions"
                columns={[

                    {title: "Follow Up Date", field: "followupDate", filtering: false},
                    {title: " Barriers ", field: "barriers", filtering: false},
                    {title: "Interventions", field: "intervention", filtering: false},
                    {title: "Comment", field: "comment", filtering: false},
                    {title: "Status", field: "status", filtering: false},
                    {title: "Actions", field: "action", filtering: false},

                ]}
                isLoading={loading}
                data={sessionList.map((row) => ({
                    followupDate: row.followUpDate,
                    barriers: row.barriers && typeof row.barriers === 'object' && Object.keys(row.barriers).length > 0
                        ? Object.keys(row.barriers).length + " Barriers"
                        : "No Barriers",
                    intervention: row.intervention && typeof row.intervention === 'object' && Object.keys(row.intervention).length > 0
                        ? Object.keys(row.intervention).length + " Interventions"
                        : "No Interventions",
                    comment: row.comment,
                    status: row.status,
                    action: (
                        <div>
                            <Menu.Menu position='right'>
                                <Menu.Item>
                                    <Button style={{backgroundColor: 'rgb(153,46,98)'}} primary>
                                        <Dropdown item text='Action'>
                                            <Dropdown.Menu style={{marginTop: "10px"}}>
                                                <Dropdown.Item onClick={() => LoadViewPage(row, 'view')}>
                                                    <Icon name='eye'/> View
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={() => LoadViewPage(row, 'update')}>
                                                    <Icon name='edit'/> Edit
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Button>
                                </Menu.Item>
                            </Menu.Menu>
                        </div>
                    )
                }))}

                options={{
                    headerStyle: {
                        backgroundColor: "#014d88",
                        color: "#fff",
                    },
                    searchFieldStyle: {
                        width: '200%',
                        margingLeft: '250px',
                    },
                    filtering: false,
                    exportButton: false,
                    searchFieldAlignment: 'left',
                    pageSizeOptions: [10, 20, 100],
                    pageSize: 10,
                    debounceInterval: 400
                }}
            />
            <StopEac toggle={Arttoggle} showModal={artModal} eacObj={props.activeContent.obj}
                     activeContent={props.activeContent} setActiveContent={props.setActiveContent}/>
        </div>
    );
}

export default LabHistory;


