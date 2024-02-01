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
    const [pillBalances, setPillBalances] = useState([]);
    const toggle = () => setOpen(!open);
    useEffect(() => {

    }, [props.patientObj.id, props.refillList]);


    useEffect(() => {
        const calculatePillBalances = (currentDate, refillList) => {
            return refillList.map((refill) => {
                return refill.extra.regimens.map((prescription) => {
                    const daysDifference = Math.ceil((currentDate - new Date(refill.visitDate)) / (1000 * 60 * 60 * 24) );
                    const expectedQuantity = Math.min(prescription.dispense, daysDifference * prescription.frequency);
                    const pillBalance = prescription.dispense - expectedQuantity;
                    return pillBalance;
                });
            });
        };

        const getCurrentDate = () => new Date();
        const currentDate = getCurrentDate();
        // Calculate pill balances for each row in the refillList
        const calculatedPillBalances = calculatePillBalances(currentDate, props.refillList);
        // Update the state with the calculated pill balances
        setPillBalances(calculatedPillBalances);
        // Log the pillBalances array
        console.log('Pill Balances:', calculatedPillBalances);
    }, [props.refillList]);

    const onClickHome = (row, actionType) => {
        // props.setActiveContent({...props.activeContent, route:'pharmacy', activeTab:"hsitory"})
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
    const regimenName = (regimenObj) => {
        let regimenArr = []
        regimenObj.forEach(function (value, index, array) {
            regimenArr.push(<li key={index}>{value['name']}</li>)
        })
        return regimenArr;
    }
    const LoadModal = (row) => {
        toggle()
        setRecord(row)
    }

    return (
        <div>

            <br/>

            <MaterialTable
                icons={tableIcons}
                title="Pharmacy History"
                columns={[
                    // { title: " ID", field: "Id" },
                    {
                        title: "Visit Date",
                        field: "visitDate",
                    },
                    {title: "Refill Period", field: "refillPeriod", filtering: false},
                    {title: "Next Appointment", field: "nextAppointment", filtering: false},
                    {title: "Regimen Name", field: "regimenName", filtering: false},
                    {
                        title: "Pill Balance",
                        field: "pillBalance",
                        render: rowData => (
                            <span>{Array.isArray(rowData.pillBalance) ? rowData.pillBalance.join(', ') : rowData.pillBalance}</span>
                        ),
                        filtering: false,
                    },
                    // { title: "Quantity", field: "regimenQuantity", filtering: false },
                    // { title: "isDevolve", field: "isDevolve", filtering: false },
                    // { title: "DSDModel", field: "dsdModel", filtering: false },
                    // { title: "MMD Type", field: "mmdType", filtering: false },
                    // { title: "Prescription Error", field: "prescriptionError", filtering: false },
                    // { title: "ADR Screened", field: "adverseDrugReactions", filtering: false },
                    {title: "Action", field: "Action", filtering: false},

                ]}
                isLoading={props.loading}
                data={props.refillList.map((row, index) => ({
                    //Id: manager.id,
                    visitDate: row.visitDate,
                    refillPeriod: row.refillPeriod,
                    pillBalance: pillBalances[index],
                    nextAppointment: row.nextAppointment,
                    regimenName: (
                        <ul>
                            {regimenName(row.extra.regimens)}

                        </ul>

                    ),
                    regimenQuantity: "",
                    //   isDevolve: row.isDevolve,
                    //   mmdType: row.mmdType,
                    //   prescriptionError: row.prescriptionError===false? "NO":"YES",
                    //   adverseDrugReactions: row.adrScreened===false? "NO":"YES",
                    Action: <div>
                        <Menu.Menu position='right'>
                            <Menu.Item>
                                <Button style={{backgroundColor: 'rgb(153,46,98)'}} primary>
                                    <Dropdown item text='Action'>

                                        <Dropdown.Menu style={{marginTop: "10px",}}>
                                            <Dropdown.Item onClick={() => onClickHome(row, 'update')}><Icon
                                                name='edit'/>Update</Dropdown.Item>
                                            <Dropdown.Item onClick={() => LoadModal(row)}> <Icon
                                                name='trash'/> Delete</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Button>
                            </Menu.Item>
                        </Menu.Menu>
                    </div>

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


