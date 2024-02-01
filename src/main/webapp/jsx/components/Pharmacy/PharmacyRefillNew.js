import React, {useState, useEffect} from 'react';
import axios from "axios";
import { Input, Label, FormGroup, CardBody, Card, InputGroupText, InputGroup } from "reactstrap";
import { Table  } from "react-bootstrap";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import MatButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'
//import CancelIcon from '@material-ui/icons/Cancel'
import "react-widgets/dist/css/react-widgets.css";
import moment from "moment";
import { Spinner } from "reactstrap";
//import Select from "react-select";
import { url as baseUrl, token } from "../../../api";
import { toast} from "react-toastify";
import {Icon, List, Label as LabelSui} from 'semantic-ui-react'
//import { Icon,Button, } from 'semantic-ui-react'


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
  root: {
    flexGrow: 1,
    "& .card-title":{
        color:'#fff',
        fontWeight:'bold'
    },
    "& .form-control":{
        borderRadius:'0.25rem',
        height:'41px'
    },
    "& .card-header:first-child": {
        borderRadius: "calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0"
    },
    "& .dropdown-toggle::after": {
        display: " block !important"
    },
    "& select":{
        "-webkit-appearance": "listbox !important"
    },
    "& p":{
        color:'red'
    },
    "& label":{
        fontSize:'14px',
        color:'#014d88',
        fontWeight:'bold'
    }
},
}))
let refillPeriodValue=null

const Pharmacy = (props) => {
    const patientObj = props.patientObj;
    const [selectedCombinedRegimen, setSelectedCombinedRegimen] = useState([]);
    const [enrollDate, setEnrollDate] = useState("");
    const classes = useStyles();
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    let temp = { ...errors }
    const [selectedOption, setSelectedOption] = useState([]);
    const [selectedOptionAdr, setSelectedOptionAdr] = useState();
    const [prepSideEffect, setPrepSideEffect] = useState([]);
    const [dsdModelType, setDsdModelType] = useState([]);
    const [mmdType, setmmdType]=useState();
    const [showmmdType, setShowmmdType]=useState(false);
    const [showIptType, setIptType] = useState(false);
    //const [showAdr, setShowAdr] = useState(false);
    const [showRegimen, setShowRegimen] = useState(false);
    const [showRegimenOI, setShowRegimenOI] = useState(false);
    const [showRegimenTB, setShowRegimenTB] = useState(false);
    const [showRegimenOthers, setShowRegimenOthers] = useState(false);
    
    const [regimen, setRegimen] = useState([]);
    const [regimenList, setRegimenList] = useState([]);
    const [eacStatusObj, setEacStatusObj] = useState()
    const [regimenType, setRegimenType] = useState([]);
    const [regimenTypeOI, setRegimenTypeOI] = useState([]);
    const [regimenTypeTB, setRegimenTypeTB] = useState([]);
    const [regimenDrug, setRegimenDrug] = useState([]);
    const [regimenDrugList, setRegimenDrugList] = useState([]);
    const [showCurrentVitalSigns, setShowCurrentVitalSigns] = useState(false)
    // const [currentVitalSigns, setcurrentVitalSigns] = useState({})
    // const [adultRegimenLine, setAdultRegimenLine] = useState([]);
    const [adultArtRegimenLine, setAdultArtRegimenLine] = useState([]);
    const [oIRegimenLine, setOIRegimenLine] = useState([]);
    const [tbRegimenLine, setTbRegimenLine] = useState([]);
    //const [othersRegimenLine, setOthersRegimenLine] = useState([]);
    const [childRegimenLine, setChildRegimenLine] = useState([]);
    const [childrenOI, setChildrenOI] = useState([]);
    const [childrenTB, setChildrenTB] = useState([]);
    const [otherDrugs, setOtherDrugs] = useState([]);
    const [iptType, setIPT_TYPE] = useState([]);
    const [regimenTypeOther, setRegimenTypeOther] = useState([]);
    const [iptEligibilty, setIptEligibilty] = useState("");
    const [lastChronicCare, setLastChronicCare] = useState(null);
    //const [currentRegimenValue, setCurrentRegimenValue] = useState("");//this is to get the current regimen value/ID the patient is on 
    //IPT_TYPE
    const [objValues, setObjValues] = useState({
            adherence: "",
            adrScreened: "",
            adverseDrugReactions: {},
            dsdModel:"",
            isDevolve:"",
            extra: {},
            facilityId: 2,
            mmdType:null,
            nextAppointment: null,
            personId: props.patientObj.id,
            refillPeriod:null,
            prescriptionError: null,
            regimenId: [],
            regimenTypeId:"",
            visitDate: null,
            visitId: 0,
            refill:"",
            refillType:"",
            switch:"",
            substitute:"",
            dsdModelType:"",
            iptType:"",
            visitType:"",
            //drugName:""
    });
    const [vital, setVitalSignDto]= useState({
        bodyWeight: "",
        diastolic:"",
        encounterDate: "",
        facilityId: 1,
        height: "",
        personId: props.patientObj.id,
        serviceTypeId: 1,
        systolic:"",
        pulse:"",
        temperature:"",
        respiratoryRate:"" 
    })
    useEffect(() => {
        RegimenLine();
        PrepSideEffect();
        VitalSigns();
        AdultRegimenLine();
        IPT_TYPE();
        PatientCurrentRegimen();
        OtherDrugs();
        setRegimenList(
            Object.entries(selectedOption && selectedOption.length>0? selectedOption : []).map(([key, value]) => ({
                id: value.value,
                name: value.label,
                dispenseQuantity:objValues.refillPeriod!==null ? objValues.refillPeriod: ""
              })))
        CheckEACStatus();
        VitalSigns();
        ChildRegimenLine();
        ChronicCare();
        GetPatientDTOObj();
        GetIptEligibilty();
    }, [selectedOption, regimenType.length>0, objValues.refillPeriod]);
    const GetPatientDTOObj =()=>{
        axios
           .get(`${baseUrl}hiv/patient/${props.patientObj.id}`,
               { headers: {"Authorization" : `Bearer ${token}`} }
           )
           .then((response) => {
               const patientDTO= response.data.enrollment
               setEnrollDate (patientDTO && patientDTO.dateOfRegistration ? patientDTO.dateOfRegistration :"")
           })
           .catch((error) => {
           //console.log(error);
           });
       
    }
    //
    const ChronicCare =()=>{
        axios
        .get(`${baseUrl}observation/person/${props.patientObj.id}`,
            { headers: {"Authorization" : `Bearer ${token}`} }
        )
        .then((response) => {

                const obj1 =response.data.filter(x=> x.type==='Chronic Care')
                //const lastArryObj=obj1.slice(-1)
                setLastChronicCare(obj1)
                //const lastobj;
        })
        .catch((error) => {
        //console.log(error);
        });       
    }
    const GetIptEligibilty =()=>{
        axios
        .get(`${baseUrl}observation/check-ipt-eligible/${props.patientObj.id}`,
            { headers: {"Authorization" : `Bearer ${token}`} }
        )
        .then((response) => {
            setIptEligibilty(response.data)
        })
        .catch((error) => {
        //console.log(error);
        });
    
    }
    //Get the patient current regimen
    const PatientCurrentRegimen =()=>{
        axios
        .get(`${baseUrl}hiv/art/pharmacy/patient/current-regimen/${props.patientObj.id}`,
            { headers: {"Authorization" : `Bearer ${token}`} }
        )
        .then((response) => {
            const currentRegimenObj= response.data
            //setCurrentRegimenValue(currentRegimenObj.regimenType.id)
            objValues.regimen=currentRegimenObj.regimenType.id
            RegimenType(currentRegimenObj.regimenType.id)
            objValues.regimenId=currentRegimenObj.id
            //regimenName
            RegimenDrug(currentRegimenObj.id)
            //RegimenDrug(regimenId)
            setShowRegimen(true)
            //regimenDrug
        })
        .catch((error) => {
        //console.log(error);
        });
    
    }
    const calculate_age = dob => {
        var today = new Date();
        var dateParts = dob.split("-");
        var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        var birthDate = new Date(dateObject); // create a date object directlyfrom`dob1`argument
        var age_now = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age_now--;
                }
            if (age_now === 0) {
                    return m;
                }
                return age_now;
    };
    const patientAge=calculate_age(moment(patientObj.dateOfBirth).format("DD-MM-YYYY"));//Age calculation
    //GET ChildRegimenLine 
    const ChildRegimenLine =()=>{
        axios
            .get(`${baseUrl}hiv/regimen/arv/children`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
  
              setChildRegimenLine(response.data.filter((x)=> (x.id===3 || x.id===4 )));
              setChildrenOI(response.data.filter((x)=> (x.id===15 || x.id===9 || x.id===8)))
              setChildrenTB(response.data.filter((x)=> (x.id===11 )))
            })
            .catch((error) => {
            //console.log(error);
            });        
    }
    //GET Other Drugd 
    const OtherDrugs =()=>{
        axios
            .get(`${baseUrl}hiv/regimen/other/drugs`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
              setOtherDrugs(Object.entries(response.data).map(([key, value]) => ({
                label: value.description,
                value: value.id,
                })));
            })
            .catch((error) => {
            //console.log(error);
            });        
    }
    const IPT_TYPE =()=>{
        axios
            .get(`${baseUrl}application-codesets/v2/IPT_TYPE`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                //console.log(response.data);
                setIPT_TYPE(response.data);
            })
            .catch((error) => {
            //console.log(error);
            });
        
    }
    //IPT_TYPE
    //GET AdultRegimenLine 
    const AdultRegimenLine =()=>{
    axios
        .get(`${baseUrl}hiv/regimen/arv/adult`,
            { headers: {"Authorization" : `Bearer ${token}`} }
        )
        .then((response) => {
            
            //const filterRegimen=response.data.filter((x)=> (x.id===1 || x.id===2 || x.id===3 || x.id===4 || x.id===14))
            const artRegimen=response.data.filter((x)=> (x.id===1 || x.id===2 || x.id===14))
            const tbRegimen=response.data.filter((x)=> (x.id===10 ))
            const oIRegimen=response.data.filter((x)=> (x.id===9 || x.id===15 || x.id===8))
            //const othersRegimen=response.data.filter((x)=> (x.id!==1 && x.id!==2 && x.id!==14 && x.id!==10 && x.id!==9 && x.id!==15 && x.id!==8 ))
            //console.log(othersRegimen)
            setAdultArtRegimenLine(artRegimen);
            setTbRegimenLine(tbRegimen);
            setOIRegimenLine(oIRegimen);
        })
        .catch((error) => {
        //console.log(error);
        });        
    }
    
    //Check for the last Vital Signs
    const VitalSigns = () => {
        axios
          .get(`${baseUrl}patient/vital-sign/person/${props.patientObj.id}`,
            { headers: { "Authorization": `Bearer ${token}` } }
          )
          .then((response) => {
             const lastVitalSigns = response.data[response.data.length - 1]
             //console.log(lastVitalSigns)
            if (lastVitalSigns.captureDate >= moment(new Date()).format("YYYY-MM-DD")) {
                setVitalSignDto(lastVitalSigns)
              setShowCurrentVitalSigns(true)
            }
          })
          .catch((error) => {
            //console.log(error);
          });
    }
    //Get EAC Status
    const CheckEACStatus =()=>{
        axios
           .get(`${baseUrl}hiv/eac/open/patient/${props.patientObj.id}`,
               { headers: {"Authorization" : `Bearer ${token}`} }
           )
           .then((response) => {
               setEacStatusObj(response.data);
           })
           .catch((error) => {
           //console.log(error);
           });
       
    }
    //Get list of RegimenLine
    const RegimenLine =()=>{
    axios
        .get(`${baseUrl}hiv/regimen/types`,
            { headers: {"Authorization" : `Bearer ${token}`} }
        )
        .then((response) => {
            
            setRegimen(response.data);
        })
        .catch((error) => {
        //console.log(error);
        });
    
    }
    //Get list of PrepSideEffect
    const PrepSideEffect =()=>{
        axios
           .get(`${baseUrl}application-codesets/v2/PREP_SIDE_EFFECTS`,
               { headers: {"Authorization" : `Bearer ${token}`} }
           )
           .then((response) => {
               //console.log(response.data);
               setPrepSideEffect(Object.entries(response.data).map(([key, value]) => ({
                label: value.display,
                value: value.id,
              })));
           })
           .catch((error) => {
           //console.log(error);
           });
       
    }
    //Get list of DSD Model Type
    function DsdModelType (dsdmodel) {
        const dsd = dsdmodel ==='Facility' ? 'DSD_MODEL_FACILITY' : 'DSD_MODEL_COMMUNITY'
        axios
           .get(`${baseUrl}application-codesets/v2/${dsd}`,
               { headers: {"Authorization" : `Bearer ${token}`} }
           )
           .then((response) => {
               console.log(response.data);
               setDsdModelType(response.data);
           })
           .catch((error) => {
           //console.log(error);
           });
       
    }
    function RegimenType(id) {
        async function getCharacters() {
            try{
            const response = await axios.get(`${baseUrl}hiv/regimen/types/${id}`,
            { headers: {"Authorization" : `Bearer ${token}`} })
            if(response.data.length >0){
                setRegimenType(
                    Object.entries(response.data).map(([key, value]) => ({
                    label: value.description,
                    value: value.id,
                    })))
            }
            }catch(e) {

            }
        }
        getCharacters();
    }
    function RegimenTypeOI(id) {
        async function getCharacters() {
            try{
            const response = await axios.get(`${baseUrl}hiv/regimen/types/${id}`,
            { headers: {"Authorization" : `Bearer ${token}`} })
            if(response.data.length >0){
                setRegimenTypeOI(
                    Object.entries(response.data).map(([key, value]) => ({
                    label: value.description,
                    value: value.id,
                    })))
            }
            }catch(e) {

            }
        }
        getCharacters();
    }
    function RegimenTypeTB(id) {
        async function getCharacters() {
            try{
            const response = await axios.get(`${baseUrl}hiv/regimen/types/${id}`,
            { headers: {"Authorization" : `Bearer ${token}`} })
            if(response.data.length >0){
                setRegimenTypeTB(
                    Object.entries(response.data).map(([key, value]) => ({
                    label: value.description,
                    value: value.id,
                    })))
            }
            }catch(e) {

            }
        }
        getCharacters();
    }
    function RegimenDrug(id) {        
        let drugId = id
        //console.log("The regimen drug ID -- "+  drugId)
        async function getCharacters(drugId) {            
            try{
            const response = await axios.get(`${baseUrl}hiv/regimen/drugs/${id}`,
            { headers: {"Authorization" : `Bearer ${token}`} })
                //console.log("The API to get Drug name "+ response.data)
            if(response.data.length >0){                   
                setSelectedCombinedRegimen(response.data)         
                const regimenName = regimenType.find((x) => { 
                    if(x.value==parseInt(drugId)){
                        return x
                    }
                })                           
                
                const drugObj=[{
                    dispense:"",
                    prescribed:"",
                    dosage:"",
                    freqency:"",
                    duration:objValues.refillPeriod,
                    name:regimenName.label,
                    regimenId:regimenName.value,
                    regimenName:regimenName.label,

                }]                
                setRegimenDrug(drugObj)
            }
            }catch(e) {

            }
        }
        getCharacters(drugId);
    }
    function RegimenDrugOI(id) {        
        let drugId = id
        if(drugId!==""  || drugId !==null){
            setShowRegimenOI(true)    
            async function getCharacters(drugId) {            
                try{
                const response = await axios.get(`${baseUrl}hiv/regimen/drugs/${id}`,
                { headers: {"Authorization" : `Bearer ${token}`} })
                if(response.data){                   
                    setSelectedCombinedRegimen(response.data)         
                    const regimenName = regimenTypeOI.find((x) => { 
                        if(x.value==parseInt(drugId)){
                            // console.log(x)
                            return x
                        }
                    })                           
                    
                    const drugObj=[{
                        dispense:"",
                        prescribed:"",
                        dosage:"",
                        freqency:"",
                        duration:objValues.refillPeriod,
                        name:regimenName.label,
                        regimenId:regimenName.value,
                        regimenName:regimenName.label,

                    }]                
                    setRegimenDrug(drugObj)
                }
                }catch(e) {

                }
            }
            getCharacters(drugId);
        }else{
            setShowRegimenOI(false) 
        }
    }
    function RegimenDrugTB(id) {        
        let drugId = id
        async function getCharacters(drugId) {            
            try{
            const response = await axios.get(`${baseUrl}hiv/regimen/drugs/${id}`,
            { headers: {"Authorization" : `Bearer ${token}`} })
            if(response.data){                   
                setSelectedCombinedRegimen(response.data)         
                const regimenName = regimenTypeTB.find((x) => { 
                    if(x.value==parseInt(drugId)){
                        // console.log(x)
                        return x
                    }
                })                           
                
                const drugObj=[{
                    dispense:"",
                    prescribed:"",
                    dosage:"",
                    freqency:"",
                    duration:objValues.refillPeriod,
                    name:regimenName.label,
                    regimenId:regimenName.value,
                    regimenName:regimenName.label,

                }]                
                setRegimenDrug(drugObj)
            }
            }catch(e) {

            }
        }
        getCharacters(drugId);
    }
    function RegimenTypeOther(id) {
        async function getCharacters() {
            try{
            const response = await axios.get(`${baseUrl}hiv/regimen/types/${id}`,
            { headers: {"Authorization" : `Bearer ${token}`} })
            if(response.data.length >0){
                setRegimenTypeOther(
                    Object.entries(response.data).map(([key, value]) => ({
                    label: value.description,
                    value: value.id,
                    })))
            }
            }catch(e) {

            }
        }
        getCharacters();
    }
    function RegimenDrugOther(id) {        
        let drugId = id
        async function getCharacters(drugId) {            
            try{
            const response = await axios.get(`${baseUrl}hiv/regimen/drugs/${id}`,
            { headers: {"Authorization" : `Bearer ${token}`} })
            if(response.data){ 
                // console.log(response.data)                 
                setSelectedCombinedRegimen(response.data)         
                const regimenName = regimenTypeOther.find((x) => { 
                    if(x.value==parseInt(drugId)){
                        //console.log(x)
                        return x
                    }
                })                           
                
                const drugObj=[{
                    dispense:"",
                    prescribed:"",
                    dosage:"",
                    freqency:"",
                    duration:objValues.refillPeriod,
                    name:regimenName.label,
                    regimenId:regimenName.value,
                    regimenName:regimenName.label,

                }]                
                setRegimenDrug(drugObj)
            }
            }catch(e) {

            }
        }
        getCharacters(drugId);
    }
    const handleInputChange = e => {
        if(e.target.name==='dsdModel' && e.target.value!==''){
            DsdModelType(e.target.value)
            setObjValues ({...objValues,  [e.target.name]: e.target.value});
        }
        setObjValues ({...objValues,  [e.target.name]: e.target.value});
       
    }
    const handleSelectedRegimen = e => {
        const regimenId= e.target.value
        setObjValues ({...objValues,  [e.target.name]: e.target.value});
        if(regimenId!==""){
            RegimenType(regimenId)
            //setShowRegimen(true)
        }else{
            setRegimenType([])
            setShowRegimen(false)
        }
    }
    const handleSelectedRegimenOI = e => {
        const regimenId= e.target.value
        if(regimenId!==""){
            RegimenTypeOI(regimenId)
            if(regimenId==='15'){
                setIptType(true)
            }else{
                setIptType(false)
            }
        }else{
            setRegimenTypeOI([])
        }
    }
    const handleSelectedRegimenTB = e => {
        const regimenId= e.target.value
        
        if(regimenId!==""){
            RegimenTypeTB(regimenId)
        }else{
            setRegimenTypeTB([])
        }
    }
    const handleSelectedRegimenOther = e => {
        const regimenId= e.target.value
        //console.log(regimenId)
        if(regimenId!==""){
            RegimenTypeOther(regimenId)
        }else{
            setRegimenTypeTB([])
        }
    }
    const handleSelectedRegimenCombination = e => {
        const regimenId= e.target.value
        //console.log(regimenId)
        if(regimenId!==""){
            RegimenDrug(regimenId)
            setShowRegimen(true)
            
        }else{
            setRegimenType([])
            RegimenDrug("")
            setShowRegimen(false)
        }
        setObjValues ({...objValues,  [e.target.name]: e.target.value});
    }
    const handleSelectedRegimenCombinationOI = e => {
        const regimenId= e.target.value
        if(regimenId!==""){
            RegimenDrugOI(regimenId)
            setShowRegimenOI(true)
        }else{
            setRegimenTypeOI([])
            setShowRegimenOI(false)
        }
        setObjValues ({...objValues,  [e.target.name]: e.target.value});
    }
    const handleSelectedRegimenCombinationTB = e => {
        const regimenId= e.target.value
        if(regimenId!==""){
            RegimenDrugTB(regimenId)
            setShowRegimenTB(true)
        }else{
            setRegimenTypeTB([])
            setShowRegimenTB(false)
        }
        setObjValues ({...objValues,  [e.target.name]: e.target.value});
    }
    const handleSelectedRegimenCombinationOthers = e => {
        const regimenId= e.target.value
        if(regimenId!==""){
            RegimenDrugOther(regimenId)
            setShowRegimenOthers(true)
        }else{
            setRegimenTypeOther([])
            setShowRegimenOthers(false)
        }
        setObjValues ({...objValues,  [e.target.name]: e.target.value});
    }

    const handleCheckBoxRegimen =e =>{
        const originalCombination=regimenDrug
        //console.log(selectedCombinedRegimen)
        if(e.target.checked){
            const newObjCombination = selectedCombinedRegimen.map(x => {
                x['dispense']=""
                x['prescribed']=""
                x['dosage']=""
                //x['freqency']=""
                x['duration']=objValues.refillPeriod
                x['regimenId']=regimenDrug[0].regimenId
                x['regimenName']= regimenDrug[0].name
                return x;
            })
            setRegimenDrug(newObjCombination)
            
        }else{
          
            RegimenDrug(objValues.regimenId)
        } 
    } 
    
    const handlRefillPeriod = e =>{
        let refillcount= ""
        if(e.target.value==="30"){
             refillcount= e.target.value 
        }else if(e.target.value==="60"){
            refillcount= e.target.value 
        }else if(e.target.value==="90"){
        refillcount= e.target.value 
        }else if(e.target.value==="120"){
            refillcount= e.target.value 
        }else if(e.target.value==="160"){
            refillcount= e.target.value 
        }else if(e.target.value==="180"){
            refillcount= e.target.value 
        }else{
            refillcount= e.target.value
        }
        
        refillPeriodValue=e.target.value
        const visitDate = objValues.visitDate
        const nextrefillDate= moment(visitDate, "YYYY-MM-DD").add(refillcount, 'days').toDate();
        const nextDate =moment(nextrefillDate).format("YYYY-MM-DD")
        objValues.refillPeriod= e.target.value
        setObjValues ({...objValues,  refillPeriod: e.target.value})
        setObjValues ({...objValues,  nextAppointment: nextDate})
        
        if(refillcount==="90"){
            setShowmmdType(true)
            setmmdType("MMD-3")
        }else if(refillcount==="120"){
            setShowmmdType(true)
            setmmdType("MMD-4")
        }else if(refillcount==="150"){
            setShowmmdType(true)
            setmmdType("MMD-5")
        }else if(refillcount==="180"){
            setShowmmdType(true)
            setmmdType("MMD-6")
        }else{
            setShowmmdType(false)
            setmmdType("")
        }

    }
    const handleCheckBox =e =>{
        
        if(e.target.checked){
            setObjValues ({...objValues,  [e.target.name] :true});
        }
    } 
    const handleFormChange = (index, event) => {
        let data = [...regimenDrug];
        data[index][event.target.name] = event.target.value;
        data[index]['prescribed'] = data[index]['frequency'] * data[index]['duration']
        setRegimenDrug (data);
    }
     //Validations of the forms
     const validateDrugDispense = () => {        
        temp.dispense = regimenDrug[0].dispense ? "" : "This field is required"
        temp.frequency = regimenDrug[0].frequency ? "" : "This field is required"
        
        setErrors({
            ...temp
        })
        return Object.values(temp).every(x => x == "")
    }
    const addDrug = e => {
           if(validateDrugDispense()){
            //console.log(regimenDrug)
            setRegimenDrugList([...regimenDrugList, ...regimenDrug]) 
            const drugObj=[{
                dispense:"",
                prescribed:"",
                dosage:"",
                freqency:"",
                duration:"",
                name:"",
                regimenId:"",
                regimenName:"",

            }]                
            setRegimenDrug([])
            setShowRegimen(false)
        }else{
            toast.error("All fields are required")
        }
                     
    }
    const addDrugTB = e => {
        if(validateDrugDispense()){
         //console.log(regimenDrug)
         setRegimenDrugList([...regimenDrugList, ...regimenDrug]) 
         const drugObj=[{
             dispense:"",
             prescribed:"",
             dosage:"",
             freqency:"",
             duration:"",
             name:"",
             regimenId:"",
             regimenName:"",

         }]                
         setRegimenDrug([])
         setShowRegimenTB(false)
     }else{
         toast.error("All fields are required")
     }
                  
    }

    const addDrugOI = e => {
        if(validateDrugDispense()){
         //console.log(regimenDrug)
         setRegimenDrugList([...regimenDrugList, ...regimenDrug]) 
         const drugObj=[{
             dispense:"",
             prescribed:"",
             dosage:"",
             freqency:"",
             duration:"",
             name:"",
             regimenId:"",
             regimenName:"",

         }]                
         setRegimenDrug([])
         setShowRegimenOI(false)
     }else{
         toast.error("All fields are required")
     }
                  
    }
    const addDrugOthers = e => {
        if(validateDrugDispense()){
         //console.log(regimenDrug)
         setRegimenDrugList([...regimenDrugList, ...regimenDrug]) 
         const drugObj=[{
             dispense:"",
             prescribed:"",
             dosage:"",
             freqency:"",
             duration:"",
             name:"",
             regimenId:"",
             regimenName:"",

         }]                
         setRegimenDrug([])
         setShowRegimenOthers(false)
     }else{
         toast.error("All fields are required")
     }
                  
    }
    
    /* Remove ADR  function **/
    const removeAttempt = index => {       
        regimenDrugList.splice(index, 1);
        setRegimenDrugList([...regimenDrugList]);        
    }; 
    const handleSubmit = (e) => {        
        e.preventDefault();
        setSaving(true);
        const observeDate =lastChronicCare.find(x=> x.dateOfObservation===objValues.visitDate)
        
            if(observeDate){
                //if(iptEligibilty.IPTEligibility!==true && objValues.visitType===""){
                objValues.adverseDrugReactions=selectedOptionAdr
                objValues.personId=props.patientObj.id
                objValues.extra['regimens']=regimenDrugList 
                objValues.mmdType=mmdType
                //delete regimenList['name']
                objValues.regimen=regimenDrugList
                axios.post(`${baseUrl}hiv/art/pharmacy`,objValues,
                { headers: {"Authorization" : `Bearer ${token}`}},)
                .then(response => {
                    setSaving(false);
                    //props.PharmacyList();
                    objValues.visitDate=""
                    objValues.refillPeriod=""
                    objValues.nextAppointment=""
                    objValues.adherence=""
                    objValues.adrScreened= ""
                    objValues.dsdModel=""
                    objValues.isDevolve=""
                    objValues.mmdType=""
                    objValues.prescriptionError=""
                    objValues.visitId=""
                    objValues.refill=""
                    objValues.refillType=""
                    objValues.switch=""
                    objValues.substitute=""
                    objValues.dsdModelType=""
                    objValues.iptType=""
                    objValues.visitType=""
                    //props.PatientCurrentObject();
                    toast.success("Pharmacy drug refill successful", {position: toast.POSITION.BOTTOM_CENTER});           
                    props.setActiveContent({...props.activeContent, route:'pharmacy', activeTab:"history" })  
                    setRegimenDrugList([]);
                    
                })
                .catch(error => {
                    setSaving(false);
                    if(error.response && error.response.data){
                        let errorMessage = error.response.data.apierror && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
                        //console.log(errorMessage)
                        if(errorMessage!==""){
                            toast.error(errorMessage, {position: toast.POSITION.BOTTOM_CENTER});
                        }else if(error.response.data.apierror && error.response.data.apierror.message!=="" && error.response.data.apierror && error.response.data.apierror.subErrors[0].message!==""){
                          toast.error(error.response.data.apierror.message + " : " + error.response.data.apierror.subErrors[0].field + " " + error.response.data.apierror.subErrors[0].message, {position: toast.POSITION.BOTTOM_CENTER});
                        }else{
                          toast.error(errorMessage, {position: toast.POSITION.BOTTOM_CENTER});
                        }
                    }else{
                        toast.error("Something went wrong, please try again...", {position: toast.POSITION.BOTTOM_CENTER});
                    }
                               
                });
                // }else{
                //     toast.error("Please visit type is required", {position: toast.POSITION.BOTTOM_CENTER});  
                //     setSaving(false); 
                // }
                }else{
                    toast.error("No Chronic Care filled for this Encounter Date, please try again...", {position: toast.POSITION.BOTTOM_CENTER});  
                    setSaving(false); 
                } 
        
       
    }

    let TotalDispensed = regimenDrug.reduce(function(prev, current) {
        return prev + +current.dispense
      }, 0);
      let TotalPrescribed = regimenDrug.reduce(function(prev, current) {
        const duration = (current && current.frequency ? current.frequency : "") * current.duration
        return prev + +duration
      }, 0);



  return (      
      <div>
 
        <div className="row">
        <div className="col-md-6">
        <h2>Pharmacy Drug Refill</h2> 
        </div>

        <Card className={classes.root}>
            <CardBody>
            <form >
            <div className="row">
            <div className="row">
                
            </div>
            {vital.bodyWeight!=='' && vital.height!=='' && (<>
                <div className="row">
                <div className=" mb-3 col-md-3">
                    <FormGroup>
                    <Label >Body Weight</Label>
                    <InputGroup> 
                        <Input 
                            type="text"
                            name="bodyWeight"
                            id="bodyWeight"
                            min="3"
                            value={vital.bodyWeight}
                            max="150"
                            disabled
                            style={{border: "1px solid #014D88", borderRadius:"0rem"}}
                        />
                        <InputGroupText addonType="append" style={{ backgroundColor:"#014D88", color:"#fff", border: "1px solid #014D88", borderRadius:"0rem"}}>
                            kg
                        </InputGroupText>
                    </InputGroup>
                    
                    </FormGroup>
                </div>                                   
                <div className="form-group mb-3 col-md-3">
                    <FormGroup>
                    <Label >Height</Label>
                    <InputGroup> 
                    <InputGroupText
                            addonType="append"
                            
                            style={{ backgroundColor:"#014D88", color:"#fff", border: "1px solid #014D88", borderRadius:"0rem"}}
                            >
                            cm
                    </InputGroupText>
                        <Input 
                            type="text"
                            name="height"
                            id="height"
                            disabled
                            value={vital.height}
                            min="48.26"
                            max="216.408"
                            style={{border: "1px solid #014D88", borderRadius:"0rem"}}
                        />
                            <InputGroupText
                            addonType="append"
                            
                            style={{ backgroundColor:"#992E62", color:"#fff", border: "1px solid #992E62", borderRadius:"0rem"}}
                            >
                            {vital.height!=='' ? (vital.height/100).toFixed(2) + "m" : "m"}
                        </InputGroupText>
                    </InputGroup>
                    
                    </FormGroup>
                </div>
                <div className="form-group mb-3 mt-2 col-md-3">
                    {vital.bodyWeight!=="" && vital.height!=='' && (
                        <FormGroup>
                        <Label> </Label>
                        <InputGroup> 
                        <InputGroupText addonType="append" style={{ backgroundColor:"#014D88", color:"#fff", border: "1px solid #014D88", borderRadius:"0rem"}}>
                            BMI : {(vital.bodyWeight/((vital.height/100) * (vital.height/100))).toFixed(2)}
                        </InputGroupText>                   
                        
                        </InputGroup>                
                        </FormGroup>
                    )}
                </div>
                {/* <div className="form-group mb-3 mt-2 col-md-3">
                    <FormGroup>
                        <Label >Pregnant Status  : Yes</Label>                                    
                    </FormGroup>
                </div> */}
                </div>
            </>)}
            <div className="row">
                <div className="form-group mb-3 col-md-3">
                <FormGroup>
                    <Label >Visit Type</Label>
                    <Input
                        type="select"
                        name="visitType"
                        id="visitType"
                        value={objValues.visitType}
                        onChange={handleInputChange}   
                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}                 
                        >
                        <option value="">Select </option>
                        <option value="Initial Visit">Initial Visit</option>
                        <option value="Follow Up Visit">Follow Up Visit </option>
                    
                    </Input>
                    
                    </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-3">
                <FormGroup>
                    <Label >Refill</Label>
                    <Input
                        type="select"
                        name="refill"
                        id="refill"
                        value={objValues.refill}
                        onChange={handleInputChange}   
                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}                 
                        >
                        <option value="">Select </option>
                        <option value="Yes">Yes</option>
                        <option value="No">No </option>
                    
                    </Input>
                    
                    </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                    <Label for="artDate">Encounter Date <span style={{ color:"red"}}> *</span> </Label>
                    <Input
                        type="date"
                        name="visitDate"
                        id="visitDate"
                        onChange={handleInputChange}
                        value={objValues.visitDate}
                        min={enrollDate!=='' ? enrollDate : ""}
                        max= {moment(new Date()).format("YYYY-MM-DD") }
                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                        required
                    />
                    </FormGroup>
                </div>
                {/* <div className="mt-4 col-md-2" > 
                      
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="radio"
                            className="form-check-input"                       
                            name="switch"
                            id="switch"
                            value="switch"
                            onChange={handleCheckBox}
                            style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Switch
                            </label>
                        </div>
                   
                </div>
                <div className="mt-4 col-md-2">        
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="radio"
                            className="form-check-input"                       
                            name="switch"
                            id="switch"
                            value="Substitution"
                            onChange={handleCheckBox}
                            style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Substitution
                            </label>
                        </div>
                </div> */}
                <div className="form-group mb-3 col-md-4">
                <FormGroup>
                    <Label >Substitution/Switch </Label>
                    <Input
                        type="select"
                        name="refillType"
                        id="refillType"
                        value={objValues.refillType}
        
                        onChange={handleInputChange}   
                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}                 
                        >
                        <option value="">Select </option>
                        
                        <option value="Switch">Switch</option>
                        <option value="Substitution">Substitution </option>
                        <option value="None">None </option>
                        
                    </Input>
                    
                    </FormGroup>
                </div>
            </div>
            <div className="row">
                <div className="form-group mb-3 col-md-4">
                <FormGroup>
                    <Label >Refill Period(days) *</Label>
                    <Input
                        type="select"
                        name="refillPeriod"
                        id="refillPeriod"
                        value={objValues.refillPeriod}
                        disabled={objValues.visitDate!==null? false : true}
                        onChange={handlRefillPeriod}   
                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}                 
                        >
                        <option value="">Select </option>
                        <option value="15">15</option>
                        <option value="30">30 </option>
                        <option value="60">60 </option>
                        <option value="90">90 </option>
                        <option value="120">120 </option>
                        <option value="150">150 </option>
                        <option value="180">180 </option>
                    </Input>
                    
                    </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-4">
                <FormGroup>
                    <Label for="artDate"> Date of Next Appointment <span style={{ color:"red"}}> *</span> </Label>
                    <Input
                        type="date"
                        name="nextAppointment"
                        id="nextAppointment"
                        min={enrollDate}
                        disabled={objValues.refillPeriod!==null? false : true}
                        onChange={handleInputChange}
                        value={objValues.nextAppointment}
                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                        required
                    />
                    </FormGroup>
                </div>
                {showmmdType &&(
                    <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                    <Label >MMD Type</Label>
                    <Input
                        type="text"
                        name="mmdType"
                        id="mmdType"
                        disabled="true"
                        value={mmdType}
                        onChange={handleInputChange}
                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                    />
                     
                    </FormGroup>
                </div>
            )}
            </div>
            
            <div className="form-group mb-3 col-md-6">
                <FormGroup>
                    <Label >DSD Model</Label>
                    <Input
                        type="select"
                        name="dsdModel"
                        id="dsdModel"
                        value={objValues.dsdModel}
                        onChange={handleInputChange} 
                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}                   
                        >
                        <option value="">Select </option>
                        <option value="Facility">Facility </option>
                        <option value="Community">Community </option>
                        
                    </Input>
                    
                </FormGroup>
            </div>
            <div className="form-group mb-3 col-md-6">
                <FormGroup>
                    <Label >DSD Model Type</Label>
                    <Input
                        type="select"
                        name="dsdModelType"
                        id="dsdModelType"
                        value={objValues.dsdModelType}
                        onChange={handleInputChange} 
                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}                   
                        >
                        <option value="">Select </option>
                        {dsdModelType.map((value) => (
                            <option key={value.code} value={value.code}>
                                {value.display}
                            </option>
                        ))}
                        
                    </Input>
                    
                </FormGroup>
            </div>
           
             {eacStatusObj && eacStatusObj.eacsession && eacStatusObj.eacsession!=='Default' && (//This is to display current EAC of a patient if they have a session that is currently opened
            <>
                <h3>Ehanced Adherance Counseling</h3>
                <div className="row">
                <div className="form-group mb-3 col-md-3">
                    <FormGroup>
                        <Label >Viral Load Result</Label>
                        <Input
                            type="text"
                            name="viralLoad"
                            id="viralLoad"
                            disabled
                            value={eacStatusObj.viralLoad}
                            
                        />
                        
                    </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-3">
                    <FormGroup>
                        <Label >Date of Last Viral Load</Label>
                        <Input
                            type="date"
                            name="dateOfViralLoad"
                            id="dateOfViralLoad"
                            disabled
                            value={eacStatusObj.dateOfViralLoad}
                    />
                        
                    </FormGroup>
                </div>
                
                <div className="form-group mb-3 col-md-3">
                    <FormGroup>
                        <Label >EAC Status</Label>
                        <p>{eacStatusObj.eacsession}</p>
                        
                    </FormGroup>
                </div>
                <div className="form-group mb-3 col-md-3">
                    <FormGroup>
                        <Label >Date of EAC</Label>
                        <Input
                            type="date"
                            name="eacsessionDate"
                            id="eacsessionDate"
                            disabled
                            value={eacStatusObj.eacsessionDate}
                        />
                        
                    </FormGroup>
                </div>
                </div>
            </>)}
            <hr/>
            <LabelSui as='a' color='teal' style={{width:'106%', height:'35px'}} ribbon>
              <h4 style={{color:'#fff'}}>ART DRUGS</h4>
            </LabelSui>
            <br/>
            <div className="form-group mb-3 col-xs-5 col-sm-5 col-md-5 col-lg-5">
                <FormGroup>
                <Label >Select Regimen Line </Label>
                <Input
                    type="select"
                    name="regimen"
                    id="regimen"
                    value={objValues.regimen}
                    onChange={handleSelectedRegimen}  
                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                    disabled={objValues.refillPeriod!==null? false : true}                 
                    >
                    <option value="">Select </option>
                                    
                    {patientAge >15 &&  (
                          <>
                            {adultArtRegimenLine.map((value) => (
                              <option key={value.id} value={value.id}>
                                {value.description}
                              </option>
                            ))}
                          </>
                    )}
                    {patientAge <=17 &&  (
                        <>
                        {childRegimenLine.map((value) => (
                            <option key={value.id} value={value.id}>
                            {value.description}
                            </option>
                        ))}
                        </>
                    )}
                </Input>
                
                </FormGroup>
            </div>

            <div className="form-group mb-3 col-xs-5 col-sm-5 col-md-5 col-lg-5">
                <FormGroup>
                <Label >Regimen </Label>
                
                <Input
                    type="select"
                    name="regimenId"
                    id="regimenId"
                    value={objValues.regimenId}
                    onChange={handleSelectedRegimenCombination}  
                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                    disabled={objValues.refillPeriod!==null? false : true}                 
                    >
                    <option value="">Select </option>
                                    
                        {regimenType.map((value) => (
                            <option key={value.id} value={value.value}>
                                {value.label}
                            </option>
                        ))}
                </Input>
                
                </FormGroup>
            </div>
            
            {/* List of Regimen Drug selected  */}
            {showRegimen   ? 
                (
                    <>
                        <Card>
                        <CardBody>
                        <h4>Drugs Information </h4>
                        <div className="form-check custom-checkbox ml-1 ">
                        <input
                        type="checkbox"
                        className="form-check-input"                       
                        name="noCombination"
                        id="noCombination"
                        onChange={handleCheckBoxRegimen}
                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                        />
                        <label
                        className="form-check-label"
                        htmlFor="basic_checkbox_1"
                        >
                        Has no combination
                        </label>
                    </div>
                        <div className="row">
                            <div className="form-group mb-3 col-md-4"  >Regimen Name </div>
                            <div className="form-group mb-3 col-md-2"  >Frequency </div>
                            <div className="form-group mb-3 col-md-2"  >Duration </div>
                            <div className="form-group mb-3 col-md-2"  >Quantity Prescribed</div>
                            <div className="form-group mb-3 col-md-2"  >Quantity Dispensed</div>
                        </div>
                        {regimenDrug.map((input, index) => (
                            <>
                                <div className="row">
                                <div className="form-group mb-3 col-md-4"  >
                                    <FormGroup>
                                    <Label ><b>{input.name } {input.strength!=="" ? input.strength :""}</b></Label>
                                    <Input
                                        type="hidden"
                                        name="id"
                                        id="id"
                                        value={input.id}  
                                        onChange={event => handleFormChange(index, event)}                                    
                                        required
                                        >                                       
                                    </Input>
                                    </FormGroup>
                                </div>

                                <div className="form-group mb-3 col-md-2">
                                    <FormGroup>
                                    <Input
                                        type="select"
                                        name="frequency"
                                        id="frequency"
                                        //value={input.frequency}
                                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                        onChange={event => handleFormChange(index, event)}
                                        required
                                    >
                                        <option value='' selected>Select</option>
                                        <option value='1'>OD</option>
                                        <option value='2'>BD</option>
                                        <option value='4'>2BD</option>
                                        <option value='6'>OD/BD</option>
                                        <option value='8'>QDS</option>
                                        <option value='10'>3ce/Week</option>
                                    </Input>
                                    {errors.frequency !=="" ? (
                                    <span className={classes.error}>{errors.frequency}</span>
                                    ) : "" }
                                    </FormGroup>
                                </div>
                                <div className="form-group mb-3 col-md-2">
                                    <FormGroup>
                                    <Input
                                        type="number"
                                        name="duration"
                                        id="duration"
                                        value={input.duration}
                                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                        onChange={event => handleFormChange(index, event)}
                                        //disabled
                                        >
                                        
                                    </Input>
                                    
                                    </FormGroup>
                                </div>
                                <div className="form-group mb-3 col-md-2">
                                    <FormGroup>
                                    <Input
                                        type="text"
                                        name="prescribed"
                                        id="prescribed"
                                        value={(input.frequency && input.frequency!==""? input.frequency * input.duration : 0)}
                                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                        onChange={event => handleFormChange(index, event)}
                                        disabled
                                        >
                                        
                                    </Input>
                                    
                                    </FormGroup>
                                </div>
                                <div className="form-group mb-3 col-md-2">
                                    <FormGroup>
                                    <Input
                                        type="number"
                                        name="dispense"
                                        id="dispense"
                                        value={input.dispense}
                                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                        onChange={event => handleFormChange(index, event)}
                                        required
                                        >
                                        
                                    </Input>
                                    {errors.dispense !=="" ? (
                                    <span className={classes.error}>{errors.dispense}</span>
                                    ) : "" }
                                    </FormGroup>
                                </div>
                                </div>
                                
                            </>
                        ))}
                        <div className="row">
                            <div className="form-group mb-3 col-md-4"  ></div>
                            
                            <div className="form-group mb-3 col-md-2"  ></div>
                            <div className="form-group mb-3 col-md-2"  ></div>
                            <div className="form-group mb-3 col-md-2"  ><b>Total : {TotalPrescribed}</b></div>
                            <div className="form-group mb-3 col-md-2"  ><b>Total : {TotalDispensed}</b></div>
                        </div>
                        <div className="row">
                        <div className="form-group mb-3 col-md-2 float-end">
                            <LabelSui as='a' color='black'  onClick={addDrug}  size='small' style={{ marginTop:35}}>
                                <Icon name='plus' /> Add
                            </LabelSui>
                        </div>
                        
                        </div>
                        
                        </CardBody>
                        </Card>
                        <br/>
                        <br/>
                    </>                  
                )
                :
                ""
                }
            {/* End of List of Regimen Drug selected  */}
            <LabelSui as='a' color='teal' style={{width:'106%', height:'35px'}} ribbon>
              <h4 style={{color:'#fff'}}>OI DRUGS</h4>
            </LabelSui>
            <br/>
            <div className="form-group mb-3 col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <FormGroup>
                <Label >OI's </Label>
                <Input
                    type="select"
                    name="regimen"
                    id="regimen"
                    value={objValues.drugName}
                    onChange={handleSelectedRegimenOI}  
                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                    disabled={objValues.refillPeriod!==null? false : true}                 
                    >
                    <option value="">Select </option>
                    {patientAge >15 &&  (
                        <>  
                        {iptEligibilty.IPTEligibility===true ? //Logic to check for TPT eligibility to filter TPT drugs
                        (<>
                            {oIRegimenLine.map((value) => (
                            <option key={value.id} value={value.id}>
                                {value.description}
                            </option>
                        ))}
                        </>)
                        :
                        (<>
                            {oIRegimenLine.filter((x)=> x.id!==15).map((value) => (
                            <option key={value.id} value={value.id}>
                                {value.description}
                            </option>
                        ))}
                        </>)
                       }             
                        
                      </>
                    )}
                    {patientAge <=15 &&  (
                    <>
                    {iptEligibilty.IPTEligibility===true ? //Logic to check for TPT eligibility to filter TPT drugs for children
                        (<>
                            {oIRegimenLine.map((value) => (
                            <option key={value.id} value={value.id}>
                                {value.description}
                            </option>
                        ))}
                        </>)
                        :
                        (<>
                            {oIRegimenLine.filter((x)=> x.id!==15).map((value) => (
                            <option key={value.id} value={value.id}>
                                {value.description}
                            </option>
                        ))}
                        </>)
                       }   
                    </>
                    )}
                </Input>
                
                </FormGroup>
            </div>

            <div className="form-group mb-3 col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <FormGroup>
                <Label >Drugs</Label>
                
                <Input
                    type="select"
                    name="regimenId"
                    id="regimenId"
                    value={objValues.regimenId}
                    onChange={handleSelectedRegimenCombinationOI}  
                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                    disabled={objValues.refillPeriod!==null? false : true}                 
                    >
                    <option value="">Select </option>
                    {regimenTypeOI.map((value) => (
                        <option key={value.id} value={value.value}>
                            {value.label}
                        </option>
                    ))}
                                
                        
                </Input>
                
                </FormGroup>
            </div>
            
            { iptEligibilty.IPTEligibility===true  && ( //iptEligibilty check to display Visit type
            <div className="form-group mb-3 col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <FormGroup>
                <Label >Visit Type</Label>
                
                <Input
                    type="select"
                    name="iptType"
                    id="iptType"
                    value={objValues.iptType}
                    onChange={handleInputChange} 
                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                   
                    >
                    <option value="">Select </option>
                    
                    {iptType.map((value) => (
                        <option key={value.id} value={value.code}>
                            {value.display}
                        </option>
                    ))}
                      
                </Input>
                
                </FormGroup>
            </div>
            )}
            {/* Display List of the OI drugs selected */}
            {showRegimenOI  ? 
                (
                    <>
                        <Card>
                        <CardBody>
                        <h4>Drugs Information </h4>
                        <div className="form-check custom-checkbox ml-1 ">
                        <input
                        type="checkbox"
                        className="form-check-input"                       
                        name="noCombination"
                        id="noCombination"
                        onChange={handleCheckBoxRegimen}
                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                        />
                        <label
                        className="form-check-label"
                        htmlFor="basic_checkbox_1"
                        >
                        Has no combination
                        </label>
                    </div>
                        <div className="row">
                            <div className="form-group mb-3 col-md-4"  >Regimen Name </div>
                            <div className="form-group mb-3 col-md-2"  >Frequency </div>
                            <div className="form-group mb-3 col-md-2"  >Duration </div>
                            <div className="form-group mb-3 col-md-2"  >Quantity Prescribed</div>
                            <div className="form-group mb-3 col-md-2"  >Quantity Dispensed</div>
                        </div>
                        {regimenDrug.map((input, index) => (
                            <>
                                <div className="row">
                                <div className="form-group mb-3 col-md-4"  >
                                    <FormGroup>
                                    <Label ><b>{input.name } {input.strength!=="" ? input.strength :""}</b></Label>
                                    <Input
                                        type="hidden"
                                        name="id"
                                        id="id"
                                        value={input.id}  
                                        onChange={event => handleFormChange(index, event)}                                    
                                        required
                                        >                                       
                                    </Input>
                                    </FormGroup>
                                </div>

                                <div className="form-group mb-3 col-md-2">
                                    <FormGroup>
                                    <Input
                                        type="select"
                                        name="frequency"
                                        id="frequency"
                                        //value={input.frequency}
                                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                        onChange={event => handleFormChange(index, event)}
                                        required
                                    >
                                        <option value='' selected>Select</option>
                                        <option value='1'>OD</option>
                                        <option value='2'>BD</option>
                                        <option value='4'>2BD</option>
                                        <option value='6'>OD/BD</option>
                                        <option value='8'>QDS</option>
                                        <option value='10'>3ce/Week</option>
                                    </Input>
                                    {errors.frequency !=="" ? (
                                    <span className={classes.error}>{errors.frequency}</span>
                                    ) : "" }
                                    </FormGroup>
                                </div>
                                <div className="form-group mb-3 col-md-2">
                                    <FormGroup>
                                    <Input
                                        type="number"
                                        name="duration"
                                        id="duration"
                                        value={input.duration}
                                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                        onChange={event => handleFormChange(index, event)}
                                        //disabled
                                        >
                                        
                                    </Input>
                                    
                                    </FormGroup>
                                </div>
                                <div className="form-group mb-3 col-md-2">
                                    <FormGroup>
                                    <Input
                                        type="text"
                                        name="prescribed"
                                        id="prescribed"
                                        value={(input.frequency && input.frequency!==""? input.frequency * input.duration : 0)}
                                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                        onChange={event => handleFormChange(index, event)}
                                        disabled
                                        >
                                        
                                    </Input>
                                    
                                    </FormGroup>
                                </div>
                                <div className="form-group mb-3 col-md-2">
                                    <FormGroup>
                                    <Input
                                        type="number"
                                        name="dispense"
                                        id="dispense"
                                        value={input.dispense}
                                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                        onChange={event => handleFormChange(index, event)}
                                        required
                                        >
                                        
                                    </Input>
                                    {errors.dispense !=="" ? (
                                    <span className={classes.error}>{errors.dispense}</span>
                                    ) : "" }
                                    </FormGroup>
                                </div>
                                </div>
                                
                            </>
                        ))}
                        <div className="row">
                            <div className="form-group mb-3 col-md-4"  ></div>
                            
                            <div className="form-group mb-3 col-md-2"  ></div>
                            <div className="form-group mb-3 col-md-2"  ></div>
                            <div className="form-group mb-3 col-md-2"  ><b>Total : {TotalPrescribed}</b></div>
                            <div className="form-group mb-3 col-md-2"  ><b>Total : {TotalDispensed}</b></div>
                        </div>
                        <div className="row">
                        <div className="form-group mb-3 col-md-2 float-end">
                            <LabelSui as='a' color='black'  onClick={addDrugOI}  size='small' style={{ marginTop:35}}>
                                <Icon name='plus' /> Add
                            </LabelSui>
                        </div>
                        
                        </div>
                        
                        </CardBody>
                        </Card>
                        <br/>
                        <br/>
                    </>                  
                )
                :
                ""
                }
            {/* End of List of OI Drug selected  */}
            
            <LabelSui as='a' color='blue' style={{width:'106%', height:'35px'}} ribbon>
              <h4 style={{color:'#fff'}}>TB DRUG</h4>
            </LabelSui>
            <br/>
            <div className="form-group mb-3 col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <FormGroup>
                <Label >TB Treatment </Label>
                <Input
                    type="select"
                    name="regimen"
                    id="regimen"
                    value={objValues.drugName}
                    onChange={handleSelectedRegimenTB}  
                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                    disabled={objValues.refillPeriod!==null? false : true}                 
                    >
                    <option value="">Select </option>
                    {patientAge >15 &&  (
                        <>            
                        {tbRegimenLine.map((value) => (
                            <option key={value.id} value={value.id}>
                                {value.description}
                            </option>
                        ))}
                      </>
                    )}
                    {patientAge <=15 &&  (
                    <>
                    {childrenTB.map((value) => (
                        <option key={value.id} value={value.id}>
                        {value.description}
                        </option>
                    ))}
                    </>
                    )}
                
                </Input>
                
                </FormGroup>
            </div>
            <div className="form-group mb-3 col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <FormGroup>
                <Label >Drugs </Label>
                
                <Input
                    type="select"
                    name="regimenId"
                    id="regimenId"
                    value={objValues.regimenId}
                    onChange={handleSelectedRegimenCombinationTB} 
                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                    disabled={objValues.refillPeriod!==null? false : true}                 
                    >
                    <option value="">Select </option>
                                    
                        {regimenTypeTB.map((value) => (
                            <option key={value.id} value={value.value}>
                                {value.label}
                            </option>
                        ))}
                </Input>
                
                </FormGroup>
            </div>
            {showRegimenTB && regimenDrug && regimenDrug.length >0 ? 
                (
                    <>
                        <Card>
                        <CardBody>
                        <h4>Drugs Information </h4>
                        <div className="form-check custom-checkbox ml-1 ">
                        <input
                        type="checkbox"
                        className="form-check-input"                       
                        name="noCombination"
                        id="noCombination"
                        onChange={handleCheckBoxRegimen}
                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                        />
                        <label
                        className="form-check-label"
                        htmlFor="basic_checkbox_1"
                        >
                        Has no combination
                        </label>
                    </div>
                        <div className="row">
                            <div className="form-group mb-3 col-md-4"  >Regimen Name </div>
                            <div className="form-group mb-3 col-md-2"  >Frequency </div>
                            <div className="form-group mb-3 col-md-2"  >Duration </div>
                            <div className="form-group mb-3 col-md-2"  >Quantity Prescribed</div>
                            <div className="form-group mb-3 col-md-2"  >Quantity Dispensed</div>
                        </div>
                        {regimenDrug.map((input, index) => (
                            <>
                                <div className="row">
                                <div className="form-group mb-3 col-md-4"  >
                                    <FormGroup>
                                    <Label ><b>{input.name } {input.strength!=="" ? input.strength :""}</b></Label>
                                    <Input
                                        type="hidden"
                                        name="id"
                                        id="id"
                                        value={input.id}  
                                        onChange={event => handleFormChange(index, event)}                                    
                                        required
                                        >                                       
                                    </Input>
                                    </FormGroup>
                                </div>

                                <div className="form-group mb-3 col-md-2">
                                    <FormGroup>
                                    <Input
                                        type="select"
                                        name="frequency"
                                        id="frequency"
                                        //value={input.frequency}
                                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                        onChange={event => handleFormChange(index, event)}
                                        required
                                    >
                                        <option value='' selected>Select</option>
                                        <option value='1'>OD</option>
                                        <option value='2'>BD</option>
                                        <option value='4'>2BD</option>
                                        <option value='6'>OD/BD</option>
                                        <option value='8'>QDS</option>
                                        <option value='10'>3ce/Week</option>
                                    </Input>
                                    {errors.frequency !=="" ? (
                                    <span className={classes.error}>{errors.frequency}</span>
                                    ) : "" }
                                    </FormGroup>
                                </div>
                                <div className="form-group mb-3 col-md-2">
                                    <FormGroup>
                                    <Input
                                        type="number"
                                        name="duration"
                                        id="duration"
                                        value={input.duration}
                                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                        onChange={event => handleFormChange(index, event)}
                                        //disabled
                                        >
                                        
                                    </Input>
                                    
                                    </FormGroup>
                                </div>
                                <div className="form-group mb-3 col-md-2">
                                    <FormGroup>
                                    <Input
                                        type="text"
                                        name="prescribed"
                                        id="prescribed"
                                        value={(input.frequency && input.frequency!==""? input.frequency * input.duration : 0)}
                                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                        onChange={event => handleFormChange(index, event)}
                                        disabled
                                        >
                                        
                                    </Input>
                                    
                                    </FormGroup>
                                </div>
                                <div className="form-group mb-3 col-md-2">
                                    <FormGroup>
                                    <Input
                                        type="number"
                                        name="dispense"
                                        id="dispense"
                                        value={input.dispense}
                                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                        onChange={event => handleFormChange(index, event)}
                                        required
                                        >
                                        
                                    </Input>
                                    {errors.dispense !=="" ? (
                                    <span className={classes.error}>{errors.dispense}</span>
                                    ) : "" }
                                    </FormGroup>
                                </div>
                                </div>
                                
                            </>
                        ))}
                        <div className="row">
                            <div className="form-group mb-3 col-md-4"  ></div>
                            
                            <div className="form-group mb-3 col-md-2"  ></div>
                            <div className="form-group mb-3 col-md-2"  ></div>
                            <div className="form-group mb-3 col-md-2"  ><b>Total : {TotalPrescribed}</b></div>
                            <div className="form-group mb-3 col-md-2"  ><b>Total : {TotalDispensed}</b></div>
                        </div>
                        <div className="row">
                        <div className="form-group mb-3 col-md-2 float-end">
                            <LabelSui as='a' color='black'  onClick={addDrugTB}  size='small' style={{ marginTop:35}}>
                                <Icon name='plus' /> Add
                            </LabelSui>
                        </div>
                        
                        </div>
                        
                        </CardBody>
                        </Card>
                        <br/>
                        <br/>
                    </>                  
                )
                :
                ""
                }
                        
            <LabelSui as='a' color='blue' style={{width:'106%', height:'35px'}} ribbon>
              <h4 style={{color:'#fff'}}>OTHER DRUG</h4>
            </LabelSui>
            <br/>
            <div className="form-group mb-3 col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <FormGroup>
                <Label >Other Drugs </Label>
                
                <Input
                    type="select"
                    name="regimen"
                    id="regimen"
                    value={objValues.drugName}
                    onChange={handleSelectedRegimenOther} 
                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                    disabled={objValues.refillPeriod!==null? false : true}                 
                    >
                    <option value="">Select </option>
                                    
                        {otherDrugs.map((value) => (
                            <option key={value.id} value={value.value}>
                                {value.label}
                            </option>
                        ))}
                </Input>
                
                </FormGroup>
            </div>
            <div className="form-group mb-3 col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <FormGroup>
                <Label >Drug</Label>
                <Input
                    type="select"
                    name="regimenId"
                    id="regimenId"
                    value={objValues.regimenId}
                    onChange={handleSelectedRegimenCombinationOthers}   
                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                    disabled={objValues.refillPeriod!==null? false : true}                 
                    >
                    <option value="" >Select </option>
                    {regimenTypeOther.map((value) => (
                            <option key={value.id} value={value.value}>
                                {value.label}
                            </option>
                        ))}
                </Input>
                
                </FormGroup>
            </div>
            
            {showRegimenOthers && regimenDrug && regimenDrug.length >0 ? 
                (
                    <>
                        <Card>
                        <CardBody>
                        <h4>Drugs Information </h4>
                        <div className="form-check custom-checkbox ml-1 ">
                        <input
                        type="checkbox"
                        className="form-check-input"                       
                        name="noCombination"
                        id="noCombination"
                        onChange={handleCheckBoxRegimen}
                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                        />
                        <label
                        className="form-check-label"
                        htmlFor="basic_checkbox_1"
                        >
                        Has no combination
                        </label>
                    </div>
                        <div className="row">
                            <div className="form-group mb-3 col-md-4"  >Regimen Name </div>
                            <div className="form-group mb-3 col-md-2"  >Frequency </div>
                            <div className="form-group mb-3 col-md-2"  >Duration </div>
                            <div className="form-group mb-3 col-md-2"  >Quantity Prescribed</div>
                            <div className="form-group mb-3 col-md-2"  >Quantity Dispensed</div>
                        </div>
                        {regimenDrug.map((input, index) => (
                            <>
                                <div className="row">
                                <div className="form-group mb-3 col-md-4"  >
                                    <FormGroup>
                                    <Label ><b>{input.name } {input.strength!=="" ? input.strength :""}</b></Label>
                                    <Input
                                        type="hidden"
                                        name="id"
                                        id="id"
                                        value={input.id}  
                                        onChange={event => handleFormChange(index, event)}                                    
                                        required
                                        >                                       
                                    </Input>
                                    </FormGroup>
                                </div>

                                <div className="form-group mb-3 col-md-2">
                                    <FormGroup>
                                    <Input
                                        type="select"
                                        name="frequency"
                                        id="frequency"
                                        //value={input.frequency}
                                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                        onChange={event => handleFormChange(index, event)}
                                        required
                                    >
                                        <option value='' selected>Select</option>
                                        <option value='1'>OD</option>
                                        <option value='2'>BD</option>
                                        <option value='4'>2BD</option>
                                        <option value='6'>OD/BD</option>
                                        <option value='8'>QDS</option>
                                        <option value='10'>3ce/Week</option>
                                    </Input>
                                    {errors.frequency !=="" ? (
                                    <span className={classes.error}>{errors.frequency}</span>
                                    ) : "" }
                                    </FormGroup>
                                </div>
                                <div className="form-group mb-3 col-md-2">
                                    <FormGroup>
                                    <Input
                                        type="number"
                                        name="duration"
                                        id="duration"
                                        value={input.duration}
                                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                        onChange={event => handleFormChange(index, event)}
                                        //disabled
                                        >
                                        
                                    </Input>
                                    
                                    </FormGroup>
                                </div>
                                <div className="form-group mb-3 col-md-2">
                                    <FormGroup>
                                    <Input
                                        type="text"
                                        name="prescribed"
                                        id="prescribed"
                                        value={(input.frequency && input.frequency!==""? input.frequency * input.duration : 0)}
                                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                        onChange={event => handleFormChange(index, event)}
                                        disabled
                                        >
                                        
                                    </Input>
                                    
                                    </FormGroup>
                                </div>
                                <div className="form-group mb-3 col-md-2">
                                    <FormGroup>
                                    <Input
                                        type="number"
                                        name="dispense"
                                        id="dispense"
                                        value={input.dispense}
                                        style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                        onChange={event => handleFormChange(index, event)}
                                        required
                                        >
                                        
                                    </Input>
                                    {errors.dispense !=="" ? (
                                    <span className={classes.error}>{errors.dispense}</span>
                                    ) : "" }
                                    </FormGroup>
                                </div>
                                </div>
                                
                            </>
                        ))}
                        <div className="row">
                            <div className="form-group mb-3 col-md-4"  ></div>
                            
                            <div className="form-group mb-3 col-md-2"  ></div>
                            <div className="form-group mb-3 col-md-2"  ></div>
                            <div className="form-group mb-3 col-md-2"  ><b>Total : {TotalPrescribed}</b></div>
                            <div className="form-group mb-3 col-md-2"  ><b>Total : {TotalDispensed}</b></div>
                        </div>
                        <div className="row">
                        <div className="form-group mb-3 col-md-2 float-end">
                            <LabelSui as='a' color='black'  onClick={addDrugOthers}  size='small' style={{ marginTop:35}}>
                                <Icon name='plus' /> Add
                            </LabelSui>
                        </div>
                        
                        </div>
                        
                        </CardBody>
                        </Card>
                        <br/>
                        <br/>
                    </>                  
                )
                :
                ""
                }
            {/* End of List of Regimen Drug selected  */}

                 {regimenDrugList.length >0 
                    ?
                    <List>
                    <Table  striped responsive>
                        <thead >
                            <tr>
                                <th>Regimen Drug</th>
                                <th>Frequency</th>
                                <th>Duration</th>
                                <th>Quantity Prescribed</th>
                                <th>Quantity Dispensed </th>
                                
                                <th ></th>
                            </tr>
                        </thead>
                        <tbody>
                        {regimenDrugList.map((regimenDrugObj, index) => (

                        <DrugDispensedLists
                            key={index}
                            index={index}
                            regimenDrugObj={regimenDrugObj}
                            removeAttempt={removeAttempt}
                        />
                        ))}
                        </tbody>
                    </Table>
                    </List>
                    :
                    ""
                }    
            </div>                              
            {saving ? <Spinner /> : ""}
            <br />
                {regimenDrugList.length >0 && (
                <MatButton
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    startIcon={<SaveIcon />}
                    onClick={handleSubmit}
                    style={{backgroundColor:"#014d88"}}
                    disabled={saving}
                    
                    >
                    {!saving ? (
                    <span style={{ textTransform: "capitalize" }}>Save</span>
                    ) : (
                    <span style={{ textTransform: "capitalize" }}>Saving...</span>
                    )}
                </MatButton>
                )}
                </form>
            </CardBody>
        </Card> 
    </div>
    </div>
  );
}

function DrugDispensedLists({
    regimenDrugObj,
    index,
    removeAttempt,
  }) {
   function FrequencyLabel(count){
            if(count==='1'){
                return 'OD'
            }else if(count==='2'){
                return 'BD'
            }else if(count==='4'){
                return '2BD'
            }else if(count==='6'){
                return 'OD/BD'
            }else if(count==='8'){
                return 'QDS'
            }else if(count==='10'){
                return '3ce/Week'
            }else{
                return ''
            }
   }
    return (
            <tr>
                <th>{regimenDrugObj.name} {regimenDrugObj.strength!==""? regimenDrugObj.strength :""}</th>
                <th>{FrequencyLabel(regimenDrugObj.frequency)}</th>
                <th>{regimenDrugObj.duration}</th>
                <th>{regimenDrugObj.frequency * regimenDrugObj.duration}</th>
                <th>{regimenDrugObj.dispense}</th>
                <th></th>
                <th >
                    <IconButton aria-label="delete" size="small" color="error" onClick={() =>removeAttempt(index)}>
                        <DeleteIcon fontSize="inherit" />
                    </IconButton>
                    
                </th>
            </tr> 
    );
  }
export default Pharmacy;
