import React, { useState, useEffect } from "react";
import { Card, CardBody, FormGroup, Label, Input } from "reactstrap";
import MatButton from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import axios from "axios";
import { toast } from "react-toastify";
import { url as baseUrl, token as authToken } from "./../../../../api";
import "react-widgets/dist/css/react-widgets.css";
import moment from "moment";
import { Spinner } from "reactstrap";
import { getFacilityId } from "../../../../utils/localstorage";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        "& .form-control": {
            borderRadius: "0.25rem",
            height: "45px",
            border: "1px solid #ced4da",
            fontSize: "14px",
        },
        "& label": {
            fontSize: "14px",
            color: "#014d88",
            fontWeight: "600",
            marginBottom: "8px",
        },
    },
    error: {
        color: "#f85032",
        fontSize: "12px",
        marginTop: "5px",
        display: "block",
    },
    button: {
        margin: theme.spacing(1),
    },
}));

const TransferInForm = (props) => {
    const classes = useStyles();
    const patientObj = props.patientObj;
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [facilityId, setFacilityId] = useState(null);

    const [formData, setFormData] = useState({
        patientCameWithTransferForm: "",
        patientAttendedFirstVisit: "",
        receivedDate: "",
        dateOfVisit: "",
        clinicianName: "",
        telephoneNumber: "",
    });

    useEffect(() => {
        const init = async () => {
            const facId = getFacilityId();
            setFacilityId(facId);
        };
        init();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const validate = () => {
        let tempErrors = {};

        if (!formData.patientCameWithTransferForm)
            tempErrors.patientCameWithTransferForm = "This field is required";
        if (!formData.patientAttendedFirstVisit)
            tempErrors.patientAttendedFirstVisit = "This field is required";
        if (!formData.receivedDate)
            tempErrors.receivedDate = "Received date is required";
        if (!formData.dateOfVisit)
            tempErrors.dateOfVisit = "Date of visit is required";
        if (!formData.clinicianName)
            tempErrors.clinicianName = "Clinician name is required";
        if (!formData.telephoneNumber)
            tempErrors.telephoneNumber = "Telephone number is required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error("Please fill all required fields");
            return;
        }

        setSaving(true);

        const payload = {
            ...formData,
            personId: patientObj.id,
            personUuid: patientObj.personUuid,
            facilityId: facilityId,
            currentStatus: "ART TRANSFER IN",
        };

        try {
            await axios.post(`${baseUrl}hiv/transfer-acknowledgement/save`, payload, {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            toast.success("Client Transfer-In Acknowledge Form Submitted Successfully");
            setSaving(false);

            // Route to ICE form after successful save
            if (props.setActiveContent) {
                props.setActiveContent({
                    ...props.activeContent,
                    route: "recent-history",
                });
            }
        } catch (error) {
            setSaving(false);
            const errorMessage =
                error.response?.data?.apierror?.message ||
                "Something went wrong, please try again";
            toast.error(errorMessage);
        }
    };

    const handleCancel = () => {
        // 👇 Call parent's onClose if provided (for navigation)
        if (props.onClose) {
            props.onClose();
            return;
        }
        // Fallback to old behavior
        if (props.setActiveContent) {
            props.setActiveContent({
                ...props.activeContent,
                route: "recent-history",
            });
        }
    };

    return (
        <div>
            <Card className={classes.root}>
                <CardBody style={{ padding: "30px" }}>
                    <form onSubmit={handleSubmit}>
                        {/* Row 1: Patient came with Transfer form, Patient attended first visit, Received date */}
                        <div className="row mb-3">
                            <div className="col-md-4">
                                <FormGroup>
                                    <Label>Patient came with Transfer form</Label>
                                    <Input
                                        type="select"
                                        name="patientCameWithTransferForm"
                                        value={formData.patientCameWithTransferForm}
                                        onChange={handleInputChange}
                                    >
                                        <option value=""></option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </Input>
                                    {errors.patientCameWithTransferForm && (
                                        <span className={classes.error}>
                                            {errors.patientCameWithTransferForm}
                                        </span>
                                    )}
                                </FormGroup>
                            </div>

                            <div className="col-md-4">
                                <FormGroup>
                                    <Label>Patient has attended his/her first visit at our ART site</Label>
                                    <Input
                                        type="select"
                                        name="patientAttendedFirstVisit"
                                        value={formData.patientAttendedFirstVisit}
                                        onChange={handleInputChange}
                                    >
                                        <option value=""></option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </Input>
                                    {errors.patientAttendedFirstVisit && (
                                        <span className={classes.error}>
                                            {errors.patientAttendedFirstVisit}
                                        </span>
                                    )}
                                </FormGroup>
                            </div>

                            <div className="col-md-4">
                                <FormGroup>
                                    <Label>Received date</Label>
                                    <Input
                                        type="date"
                                        name="receivedDate"
                                        value={formData.receivedDate}
                                        onChange={handleInputChange}
                                        max={moment().format("YYYY-MM-DD")}
                                        placeholder="dd/mm/yyyy"
                                    />
                                    {errors.receivedDate && (
                                        <span className={classes.error}>{errors.receivedDate}</span>
                                    )}
                                </FormGroup>
                            </div>
                        </div>

                        {/* Row 2: Date of visit, Clinician name, Telephone Number */}
                        <div className="row mb-4">
                            <div className="col-md-4">
                                <FormGroup>
                                    <Label>Date of visit</Label>
                                    <Input
                                        type="date"
                                        name="dateOfVisit"
                                        value={formData.dateOfVisit}
                                        onChange={handleInputChange}
                                        max={moment().format("YYYY-MM-DD")}
                                        placeholder="dd/mm/yyyy"
                                    />
                                    {errors.dateOfVisit && (
                                        <span className={classes.error}>{errors.dateOfVisit}</span>
                                    )}
                                </FormGroup>
                            </div>

                            <div className="col-md-4">
                                <FormGroup>
                                    <Label>Name of the Clinician receiving the transfer</Label>
                                    <Input
                                        type="text"
                                        name="clinicianName"
                                        value={formData.clinicianName}
                                        onChange={handleInputChange}
                                    />
                                    {errors.clinicianName && (
                                        <span className={classes.error}>{errors.clinicianName}</span>
                                    )}
                                </FormGroup>
                            </div>

                            <div className="col-md-4">
                                <FormGroup>
                                    <Label>Telephone Number</Label>
                                    <Input
                                        type="text"
                                        name="telephoneNumber"
                                        value={formData.telephoneNumber}
                                        onChange={handleInputChange}
                                        maxLength="11"
                                    />
                                    {errors.telephoneNumber && (
                                        <span className={classes.error}>{errors.telephoneNumber}</span>
                                    )}
                                </FormGroup>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="row mt-5">
                            <div className="col-md-12 text-center">
                                {saving && <Spinner color="primary" style={{ marginBottom: "10px" }} />}

                                <MatButton
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    startIcon={<SaveIcon />}
                                    disabled={saving}
                                    style={{
                                        backgroundColor: "#014d88",
                                        padding: "10px 30px",
                                        fontSize: "14px",
                                        fontWeight: "600",
                                        marginRight: "15px",
                                    }}
                                >
                                    {saving ? "Saving..." : "Save"}
                                </MatButton>

                                <MatButton
                                    type="button"
                                    variant="outlined"
                                    className={classes.button}
                                    startIcon={<CancelIcon />}
                                    onClick={handleCancel}
                                    disabled={saving}
                                    style={{
                                        borderColor: "#dc3545",
                                        color: "#dc3545",
                                        padding: "10px 30px",
                                        fontSize: "14px",
                                        fontWeight: "600",
                                    }}
                                >
                                    Cancel
                                </MatButton>
                            </div>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
};

export default TransferInForm;
