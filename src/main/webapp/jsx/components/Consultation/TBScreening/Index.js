import React, { useState, useEffect } from "react";
import { Input, Label, FormGroup } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { token, url as baseUrl } from "./../../../../api";
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
    // console.log(e.target.value)
  };

// console.log("props.careSupportTb", props.careSupportTb)
//  console.log("obj in tbscreen", props.tbObj)
  return (
      <div>
        <div className="row">
          <div className="form-group mb-3 col-md-6">
            <FormGroup>
              <Label>Patient TB Status</Label>
              <span style={{color: "red"}}> *</span>
              <Input
                  type="select"
                  name="tbStatusId"
                  id="tbStatusId"
                  // value={props.tbObj.tbStatusId}
                  onChange={handleInputChange}
                  style={{border: "1px solid #014D88", borderRadius: "0.25rem"}}
                  // required
              >
                <option value="">Select</option>
                {tbStatus &&
                    tbStatus.map((tb) => (
                        <option key={tb.id} value={tb.id}>
                          {tb.display}
                        </option>
                    ))}
              </Input>
            </FormGroup>
            {props.errors.tbStatusId !== "" ? (
                <span className={classes.error}>{props.errors.tbStatusId}</span>
            ) : (
                ""
            )}
          </div>
        </div>
      </div>
  );
};

export default TBScreeningForm;