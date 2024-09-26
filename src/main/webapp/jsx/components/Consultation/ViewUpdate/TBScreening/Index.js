import React, { useState, useEffect } from "react";
import { Input, Label, FormGroup } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { token, url as baseUrl } from "./../../../../../api";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(20),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
    width: 350,
  },
  button: {
    margin: theme.spacing(1),
  },

  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
    "& .card-title": {
      color: "#fff",
      fontWeight: "bold",
    },
    "& .form-control": {
      borderRadius: "0.25rem",
      height: "41px",
    },
    "& .card-header:first-child": {
      borderRadius: "calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0",
    },
    "& .dropdown-toggle::after": {
      display: " block !important",
    },
    "& select": {
      "-webkit-appearance": "listbox !important",
    },
    "& p": {
      color: "red",
    },
    "& FormLabelName": {
      fontSize: "14px",
      color: "#014d88",
      fontWeight: "bold",
    },
    "& label": {
      fontSize: "14px",
      color: "#014d88",
      fontWeight: "bold",
    },
  },
  input: {
    display: "none",
  },
  error: {
    color: "#f85032",
    fontSize: "11px",
  },
  success: {
    color: "#4BB543 ",
    fontSize: "11px",
  },
}));

const TBScreeningForm = (props) => {
  const classes = useStyles();
  const [tbStatus, setTbStatus] = useState([]);
  // useEffect(() => {
  //   TBStatus();
  //   if (
  //     (props.tbObj.currentOnIpt !== "" && props.tbObj.coughing === "YES") ||
  //     props.tbObj.nightSweat === "YES" ||
  //     props.tbObj.fever === "YES" ||
  //     props.tbObj.contactWithTBCase === "YES" ||
  //     props.tbObj.lethergy === "YES"
  //   ) {
  //     props.tbObj.tbStatusId = 68; //for any option with YES
  //   } else if (
  //     props.tbObj.currentOnIpt !== "" &&
  //     props.tbObj.coughing === "NO" &&
  //     props.tbObj.nightSweat === "NO" &&
  //     props.tbObj.fever === "NO" &&
  //     props.tbObj.contactWithTBCase === "NO" &&
  //     props.tbObj.lethergy === "NO"
  //   ) {
  //     props.tbObj.tbStatusId = 67;
  //   } else if (
  //     props.tbObj.tbStatusId === "" ||
  //     props.tbObj.tbStatusId === null
  //   ) {
  //     props.tbObj.tbStatusId = "";
  //   }
  // }, [props.tbObj]);
  useEffect(() => {
    TBStatus()
  }, []);
  ///GET LIST OF FUNCTIONAL%20_STATUS
  // TB STATUS
  const TBStatus = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/TB_STATUS`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
       
        setTbStatus(response.data);
       
      })
      .catch((error) => {
        
      });
  };
  const handleInputChange = (e) => {
    
    props.setTbObj({ ...props.tbObj, [e.target.name]: e.target.value });
  };
  

  return (
    <div>
      <div className="row">
        {/* <div className="form-group mb-3 col-md-6">
          <FormGroup>
              <Label >Patient on Anti TB Drugs?</Label>
              <Input
                  type="select"
                  name="antiTBDrug"
                  id="antiTBDrug"
                  value={props.tbObj.antiTBDrug}
                  onChange={handleInputChange}
                  style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                  required
                  >
                    <option value="">Select </option>
                    <option value="YES"> YES</option>
                    <option value="NO">NO </option>

              </Input>
              
            </FormGroup>
            {props.errors.antiTBDrug !=="" ? (
                      <span className={classes.error}>{props.errors.antiTBDrug}</span>
                  ) : "" }
          </div>
          {props.tbObj.antiTBDrug==='NO' && (
            <>
              <div className="form-group mb-3 col-md-6">
              <FormGroup>
                <Label >Patient Currently on IPT?</Label>
                <Input
                    type="select"
                    name="currentOnIpt"
                    id="currentOnIpt"
                    value={props.tbObj.currentOnIpt}
                    onChange={handleInputChange}
                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                    required
                    >
                      <option value=""> Select</option>
                      <option value="YES"> YES</option>
                        <option value="NO">NO </option>
                </Input>
              </FormGroup>
              {props.errors.currentOnIpt !=="" ? (
                      <span className={classes.error}>{props.errors.currentOnIpt}</span>
                  ) : "" }
              </div>
              <div className="form-group mb-3 col-md-4">
              <FormGroup>
                <Label >coughing?</Label>
                <Input
                    type="select"
                    name="coughing"
                    id="coughing"
                    value={props.tbObj.coughing}
                    onChange={handleInputChange}
                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                    required
                    >
                      <option value=""> Select</option>
                      <option value="YES"> YES</option>
                      <option value="NO">NO </option>
                </Input>
              </FormGroup>
              {props.errors.coughing !=="" ? (
                      <span className={classes.error}>{props.errors.coughing}</span>
                  ) : "" }
              </div>
              <div className="form-group mb-3 col-md-4">
              <FormGroup>
                <Label >Night Sweat?</Label>
                <Input
                    type="select"
                    name="nightSweat"
                    id="nightSweat"
                    value={props.tbObj.nightSweat}
                    onChange={handleInputChange}
                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                    required
                    >
                      <option value=""> Select</option>
                      <option value="YES"> YES</option>
                      <option value="NO">NO </option>
                </Input>
              </FormGroup>
              {props.errors.nightSweat !=="" ? (
                      <span className={classes.error}>{props.errors.nightSweat}</span>
                  ) : "" }
              </div>
              <div className="form-group mb-3 col-md-4">
              <FormGroup>
                <Label >Fever</Label>
                <Input
                    type="select"
                    name="fever"
                    id="fever"
                    value={props.tbObj.fever}
                    onChange={handleInputChange}
                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                    required
                    >
                      <option value="">Select </option>
                      <option value="YES"> YES</option>
                      <option value="NO">NO </option>
                </Input>
              </FormGroup>
              {props.errors.fever !=="" ? (
                      <span className={classes.error}>{props.errors.fever}</span>
                  ) : "" }
              </div>
              <div className="form-group mb-3 col-md-4">
              <FormGroup>
                <Label >Contact with TB Case?</Label>
                <Input
                    type="select"
                    name="contactWithTBCase"
                    id="contactWithTBCase"
                    value={props.tbObj.contactWithTBCase}
                    onChange={handleInputChange}
                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                    required
                    >
                      <option value=""> Select</option>
                      <option value="YES"> YES</option>
                      <option value="NO">NO </option>
                </Input>
              </FormGroup>
              {props.errors.contactWithTBCase !=="" ? (
                      <span className={classes.error}>{props.errors.contactWithTBCase}</span>
                  ) : "" }
              </div>
              <div className="form-group mb-3 col-md-4">
              <FormGroup>
                <Label >Lethergy</Label>
                <Input
                    type="select"
                    name="lethergy"
                    id="lethergy"
                    value={props.tbObj.lethergy}
                    onChange={handleInputChange}
                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                    required
                    >
                      <option value="">Select </option>
                      <option value="YES"> YES</option>
                    <option value="NO">NO </option>
                </Input>
              </FormGroup>
              {props.errors.lethergy !=="" ? (
                      <span className={classes.error}>{props.errors.lethergy}</span>
                  ) : "" }
              </div>

          </>
          )} */}
        {/* <div className="form-group mb-3 col-md-6">
          <FormGroup>
            <Label>TB Status</Label>
            <Input
              type="select"
              name="tbStatusId"
              id="tbStatusId"
              value={props.tbObj.tbStatusId}
              onChange={handleInputChange}
              style={{ border: "1px solid #014D88", borderRadius: "0.25rem" }}
              disabled={props.tbObj.tbStatusId === 67 ? false : true}
            >
              <option value=""></option>
              {props.tbObj.tbStatusId === 67 ? (
                <>
                  {tbStatus
                    .filter((x) => x.id === 67 || x.id === 633)
                    .map((value) => (
                      <option key={value.id} value={value.id}>
                        {value.display}
                      </option>
                    ))}
                </>
              ) : (
                <>
                  <option value=""></option>
                  {tbStatus.map((value) => (
                    <option key={value.id} value={value.id}>
                      {value.display}
                    </option>
                  ))}
                </>
              )}
            </Input>
          </FormGroup>
          {props.errors.tbStatusId !== "" ? (
            <span className={classes.error}>{props.errors.tbStatusId}</span>
          ) : (
            ""
          )}
        </div> */}

        <div className="form-group mb-3 col-md-6">
          <FormGroup>
            <Label>Patient TB Status</Label>
            <Input
              type="select"
              // name="tcareCardPatientTbStatus"
              // id="careCardPatientTbStatus"
              name="tbStatusId"
              id="tbStatusId"
              value={props.tbObj.tbStatusId}
              // value={props.tbObj.careCardPatientTbStatus}
              onChange={handleInputChange}
              style={{ border: "1px solid #014D88", borderRadius: "0.25rem" }}
              disabled={!props.enableUpdate}
            >
              <option value="">Select </option>
              {tbStatus &&
                tbStatus.map((tb) => (
                  <option key={tb.id} value={tb.id}>
                    {tb.display}
                  </option>
                ))}
            </Input>
          </FormGroup>
          {/*{props.errors.careCardPatientTbStatus !== "" ? (*/}
          {/*  <span className={classes.error}>{props.errors.careCardPatientTbStatus}</span>*/}
          {/*) : (*/}
          {/*  ""*/}
          {/*)}*/}
        </div>
      </div>
    </div>
  );
};

export default TBScreeningForm;
