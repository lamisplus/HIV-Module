
import React, { useEffect, useState} from "react";
import axios from "axios";
import {FormGroup, Label , CardBody, Spinner,Input,Form, InputGroup,
    InputGroupText,

} from "reactstrap";
import * as moment from 'moment';
import {makeStyles} from "@material-ui/core/styles";
import {Card, CardContent} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
// import AddIcon from "@material-ui/icons/Add";
// import CancelIcon from "@material-ui/icons/Cancel";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { useHistory, } from "react-router-dom";
// import {TiArrowBack} from 'react-icons/ti'
import {token, url as baseUrl } from "../../../api";
import 'react-phone-input-2/lib/style.css'
import 'semantic-ui-css/semantic.min.css';
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { Button} from 'semantic-ui-react'
import {  Modal } from "react-bootstrap";


const useStyles = makeStyles((theme) => ({
    card: {
        margin: theme.spacing(20),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    cardBottom: {
        marginBottom: 20,
    },
    Select: {
        height: 45,
        width: 300,
    },
    button: {
        margin: theme.spacing(1),
    },
    root: {
        flexGrow: 1,
        maxWidth: 752,
    },
    demo: {
        backgroundColor: theme.palette.background.default,
    },
    inline: {
        display: "inline",
    },
    error:{
        color: '#f85032',
        fontSize: '12.8px'
    }
}));


const GenderBase = (props) => {
    
    const handleGenderBase =e =>{
        props.setGenderBase({...props.genderBase, [e.target.name]: e.target.value})        
    }

        
return (
        <>  
        
            <Card >
                <CardBody>   
                <h2 style={{color:'#000'}}>Intimate Partner Violence Form</h2>
                <br/>
                    <form >
                    <div className="row">
                    <div className="form-group mb-3 col-md-8"></div>   
                    </div>
                    <div className="row">
                    <div className="form-group mb-3 col-md-6">                                    
                            <FormGroup>
                            <Label>Has your partner ever hit, kicked, slapped, or otherwise physically hurt you</Label>
                                    <Input 
                                        type="select"
                                        name="partnerEverPhysically"
                                        id="partnerEverPhysically"
                                        onChange={handleGenderBase} 
                                        value={props.genderBase.partnerEverPhysically} 
                                    >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                   
                                    </Input>

                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-6">                                    
                            <FormGroup>
                            <Label>Have you been beaten, sexually coerced, raped or threathened by your partner or anyone else</Label>
                                    <Input 
                                        type="select"
                                        name="haveBeenBeaten"
                                        id="haveBeenBeaten"
                                        onChange={handleGenderBase} 
                                        value={props.genderBase.haveBeenBeaten} 
                                    >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                   
                                    </Input>

                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-6">                                    
                            <FormGroup>
                            <Label>Does Your partner/family deny you food, shelter, freedom of movement livelihood or finance to access health care</Label>
                                    <Input 
                                        type="select"
                                        name="partnerLivelihood"
                                        id="partnerLivelihood"
                                        onChange={handleGenderBase} 
                                        value={props.genderBase.partnerLivelihood} 
                                    >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                    </Input>

                            </FormGroup>
                        </div>
                    </div>
                    <br/>
                    
                    </form>
                    
                </CardBody>
            </Card> 
                                     
        </>
    );
};

export default GenderBase