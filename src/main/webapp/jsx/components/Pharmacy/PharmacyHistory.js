import React, {useEffect, useState} from 'react'
import MaterialTable from 'material-table';
import axios from "axios";
import "react-widgets/dist/css/react-widgets.css";
import {toast} from "react-toastify";
import {token as token, url as baseUrl} from "./../../../api";
import {forwardRef} from 'react';
import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-widgets/dist/css/react-widgets.css';
import "@reach/menu-button/styles.css";
import 'semantic-ui-css/semantic.min.css';
import {Dropdown, Button, Menu, Icon} from 'semantic-ui-react'

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
import {Modal} from "react-bootstrap";


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

const PharmacyHistory = (props) => {

    const [open, setOpen] = React.useState(false)
    const [saving, setSaving] = useState(false)
    const [record, setRecord] = useState(null)
    const toggle = () => setOpen(!open);
    useEffect(() => {

    }, [props.patientObj.id, props.refillList]);

    const onClickHome = (row, actionType) => {
        props.setActiveContent({
            ...props.activeContent,
            route: 'pharmacy-update',
            id: row.id,
            activeTab: "history",
            actionType: actionType,
            obj: row
        })
    }
    const LoadDeletePage = (row) => {
        setSaving(true)
        axios.delete(`${baseUrl}hiv/art/pharmacy/${row.id}`,
            {headers: {"Authorization": `Bearer ${token}`}}
        )
            .then((response) => {
                toast.success("Record Deleted Successfully");
                props.PharmacyList()
                toggle()
                setSaving(false)
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    let errorMessage = error.response.data.apierror && error.response.data.apierror.message !== "" ? error.response.data.apierror.message : "Something went wrong, please try again";
                    toast.error(errorMessage);
                } else {
                    toast.error("Something went wrong. Please try again...");
                }
            });
    }

    const LoadModal = (row) => {
        toggle()
        setRecord(row)
    }

    const calculateRegimenPillBalance = (regimen, visitDate) => {
        const currentDate = new Date();
        const parsedVisitDate = new Date(visitDate);
        const daysDifference = Math.ceil((currentDate - parsedVisitDate) / (1000 * 60 * 60 * 24));
        const duration = parseInt(regimen.duration, 10) || 0;
        const frequency = parseInt(regimen.frequency, 10) || 0;
        const prescribed = parseInt(regimen.prescribed, 10) || 0;
        const dispensed = parseInt(regimen.dispense, 10) || 0;
        const pillsTaken = Math.min(daysDifference - 1, duration) * frequency;
        let pillBalance;
        if (dispensed > prescribed) {
            pillBalance = 0;
        } else {
            pillBalance = prescribed - pillsTaken;
        }
        return pillBalance;
    }

    return (
        <div>
            <br/>
            <MaterialTable
                icons={tableIcons}
                title="Pharmacy History"
                columns={[
                    {
                        title: "Visit Date",
                        field: "visitDate",
                    },
                    {title: "Refill Period", field: "refillPeriod", filtering: false},
                    {title: "Next Appointment", field: "nextAppointment", filtering: false},
                    {title: "Drug Name", field: "regimenName", filtering: false},
                    {
                        title: "Pill Balance",
                        field: "pillBalance",
                        filtering: false,
                    },
                    {title: "Action", field: "Action", filtering: false},

                ]}
                isLoading={props.loading}
                data={props.refillList.flatMap((parent, index) =>
                    parent.extra.regimens.map((regimen) => ({
                        ...regimen,
                        visitDate: parent.visitDate,
                        refillPeriod: parent.refillPeriod,
                        nextAppointment: parent.nextAppointment,
                        parentData: parent,
                        pillBalance: calculateRegimenPillBalance(regimen, parent.visitDate),
                        Action: (
                            <div>
                                <Menu.Menu position="right">
                                    <Menu.Item>
                                        <Button style={{backgroundColor: "rgb(153,46,98)"}} primary>
                                            <Dropdown item text="Action">
                                                <Dropdown.Menu style={{marginTop: "10px"}}>
                                                    <Dropdown.Item onClick={() => onClickHome(parent, "update")}>
                                                        <Icon name="edit"/> Update
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => LoadModal(parent)}>
                                                        <Icon name="trash"/> Delete
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </Button>
                                    </Menu.Item>
                                </Menu.Menu>
                            </div>
                        ),
                    }))
                )}
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
            <Modal show={open} toggle={toggle} className="fade" size="md"
                   aria-labelledby="contained-modal-title-vcenter"
                   centered backdrop="static">
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Notification!
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Are you Sure you want to delete - <b>{record && record.visitDate}</b></h4>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => LoadDeletePage(record)} style={{backgroundColor: "red", color: "#fff"}}
                            disabled={saving}>{saving === false ? "Yes" : "Deleting..."}</Button>
                    <Button onClick={toggle} style={{backgroundColor: "#014d88", color: "#fff"}}
                            disabled={saving}>No</Button>

                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default PharmacyHistory;


