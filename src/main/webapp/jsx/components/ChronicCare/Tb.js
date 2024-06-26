import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FormGroup,
  Label,
  CardBody,
  Spinner,
  Input,
  Form,
  InputGroup,
} from "reactstrap";
import * as moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import { Card } from "@material-ui/core";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { useHistory } from "react-router-dom";
// import {TiArrowBack} from 'react-icons/ti'
import { token, url as baseUrl } from "../../../api";
import "react-phone-input-2/lib/style.css";
import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import "react-phone-input-2/lib/style.css";
import { Button } from "semantic-ui-react";
import { calculate_age_to_number } from "../../../utils";
import { fi } from "date-fns/locale";

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
    width: 300,
  },
  button: {
    margin: theme.spacing(1),
  },
  root: {
    flexGrow: 1,
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
    "& label": {
      fontSize: "14px",
      color: "#014d88",
      fontWeight: "bold",
    },
  },
  demo: {
    backgroundColor: theme.palette.background.default,
  },
  inline: {
    display: "inline",
  },
  error: {
    color: "#f85032",
    fontSize: "12.8px",
  },
}));

const TbScreening = (props) => {
  let age = props.patientObj.age;
  const classes = useStyles();
  const [contraindicationDisplay, setcontraindicationDisplay] = useState(false);
  const [tbTreatmentType, setTbTreatmentType] = useState([]);
  const [tbTreatmentOutCome, setTbTreatmentOutCome] = useState([]);
  const [tbScreeningType, setTbScreeningType] = useState([]);
  const [tbScreeningType2, setTbScreeningType2] = useState([]);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const patientAge = calculate_age_to_number(props.patientObj.dateOfBirth);
  // props.tbObj.historyWithAdults === "No" &&
  //   props.tbObj.poorWeightGain === "No";
  //Above 14 years Old
  useEffect(() => {
    //First Logic 1 Solved

    if (
      props.tbObj.tbTreatment === "No" &&
      props.tbObj.tbScreeningType === "Symptom screen (alone)"
    ) {
      if (
        props.tbObj.coughing === "No" &&
        props.tbObj.fever === "No" &&
        props.tbObj.nightSweats === "No" &&
        props.tbObj.losingWeight === "No"
      ) {
        props.setTbObj({
          ...props.tbObj,
          outcome: "Not Presumptive",
          status: "No signs or symptoms of TB",
          eligibleForTPT: "",
        });
      }
    }

    if (
      props.tbObj.tbTreatment === "No" &&
      props.tbObj.tbScreeningType === "Symptom screen (alone)" &&
      props.tbObj.currentlyOnTuberculosis === "No" &&
      props.tbObj.previouslyCompletedTPT === "No"
    ) {
      if (
        props.tbObj.coughing === "No" &&
        props.tbObj.fever === "No" &&
        props.tbObj.nightSweats === "No" &&
        props.tbObj.losingWeight === "No"
      ) {
        props.setTbObj({
          ...props.tbObj,
          outcome: "Not Presumptive",
          status: "No signs or symptoms of TB",
          eligibleForTPT: "Yes",
        });
      }
    }

    if (
      props.tbObj.tbTreatment === "No" &&
      props.tbObj.tbScreeningType === "Chest X-ray" &&
      props.tbObj.chestXray === "X-ray not suggestive" &&
      props.tbObj.currentlyOnTuberculosis === "No" &&
      props.tbObj.previouslyCompletedTPT === "No"
    ) {
      props.setTbObj({
        ...props.tbObj,
        outcome: "Not Presumptive",
        status: "No signs or symptoms of TB",
        eligibleForTPT: "Yes",
      });
    }

    if (
      props.tbObj.tbTreatment === "No" &&
      props.tbObj.tbScreeningType === "Symptom screen (alone)"
    ) {
      if (
        props.tbObj.coughing === "Yes" ||
        props.tbObj.fever === "Yes" ||
        props.tbObj.nightSweats === "Yes" ||
        props.tbObj.losingWeight === "Yes"
      ) {
        props.setTbObj({
          ...props.tbObj,
          outcome: "Presumptive TB",
          status: "Presumptive TB and referred for evaluation",
          eligibleForTPT: "",
        });
      }
    }

    //First Logic 2
    if (
      props.tbObj.tbTreatment === "No" &&
      props.tbObj.tbScreeningType === "Chest X-ray" &&
      props.tbObj.chestXray === "X-ray suggestive"
    ) {
      props.setTbObj({
        ...props.tbObj,
        outcome: "",
        status: "Presumptive TB",
        eligibleForTPT: "",
      });
    }

    if (
      props.tbObj.tbTreatment === "No" &&
      props.tbObj.tbScreeningType === "Chest X-ray" &&
      props.tbObj.chestXray === "X-ray not suggestive"
    ) {
      props.setTbObj({
        ...props.tbObj,
        outcome: "",
        status: "No signs or symptoms of TB",
        eligibleForTPT: "",
      });
    }

    //Second Logic
    if (props.tbObj.tbTreatment === "Yes") {
      props.setTbObj({
        ...props.tbObj,
        outcome: "Not Presumptive",
        status: "Currently on TB treatment",
        activeTb: true,
      });
    }

    //Third Logic
    if (
      props.tbObj.tbTreatment === "No" &&
      props.tbObj.currentlyOnTuberculosis === "No" &&
      props.tbObj.previouslyCompletedTPT === "No" &&
      props.tbObj.tbScreeningType === "Symptom screen (alone)"
    ) {
      if (
        props.tbObj.coughing === "Yes" ||
        props.tbObj.fever === "Yes" ||
        props.tbObj.nightSweats === "Yes" ||
        props.tbObj.losingWeight === "Yes"
      ) {
        props.setTbObj({
          ...props.tbObj,
          outcome: "Presumptive",
          status: "Presumptive TB and referred for evaluation",
          eligibleForTPT: "No",
        });
      }
    }

    if (
      props.tbObj.tbTreatment === "No" &&
      props.tbObj.currentlyOnTuberculosis === "No" &&
      props.tbObj.previouslyCompletedTPT === "Yes" &&
      props.tbObj.tbScreeningType === "Symptom screen (alone)"
    ) {
      if (
        props.tbObj.coughing === "Yes" ||
        props.tbObj.fever === "Yes" ||
        props.tbObj.nightSweats === "Yes" ||
        props.tbObj.losingWeight === "Yes"
      ) {
        props.setTbObj({
          ...props.tbObj,
          outcome: "Presumptive",
          status: "Presumptive TB and referred for evaluation",
          eligibleForTPT: "No",
        });
      }
    }

    if (
      props.tbObj.tbTreatment === "No" &&
      props.tbObj.currentlyOnTuberculosis === "No" &&
      props.tbObj.previouslyCompletedTPT === "No" &&
      props.tbObj.tbScreeningType === "Chest X-ray" &&
      props.tbObj.chestXray === "X-ray not suggestive"
    ) {
      {
        props.setTbObj({
          ...props.tbObj,
          outcome: "Not Presumptive",
          status: "No signs or symptoms of TB",
          eligibleForTPT: "Yes",
        });
      }
    }

    if (
      props.tbObj.tbTreatment === "No" &&
      props.tbObj.currentlyOnTuberculosis === "No" &&
      props.tbObj.previouslyCompletedTPT === "No" &&
      props.tbObj.tbScreeningType === "Chest X-ray" &&
      props.tbObj.chestXray === "X-ray suggestive"
    ) {
      {
        props.setTbObj({
          ...props.tbObj,
          outcome: "Presumptive",
          status: "Presumptive TB and referred for evaluation",
          eligibleForTPT: "No",
        });
      }
    }

    if (
      props.tbObj.tbTreatment === "No" &&
      props.tbObj.currentlyOnTuberculosis === "No" &&
      props.tbObj.previouslyCompletedTPT === "Yes" &&
      props.tbObj.tbScreeningType === "Symptom screen (alone)"
    ) {
      if (
        props.tbObj.coughing === "No" &&
        props.tbObj.fever === "No" &&
        props.tbObj.nightSweats === "No" &&
        props.tbObj.losingWeight === "No"
      ) {
        props.setTbObj({
          ...props.tbObj,
          outcome: "Not Presumptive",
          status: "No signs or symptoms of TB",
          eligibleForTPT: "No",
        });
      }
    }

    if (
      props.tbObj.tbTreatment === "No" &&
      props.tbObj.currentlyOnTuberculosis === "No" &&
      props.tbObj.previouslyCompletedTPT === "Yes" &&
      props.tbObj.tbScreeningType === "Chest X-ray" &&
      props.tbObj.chestXray === "X-ray suggestive"
    ) {
      {
        props.setTbObj({
          ...props.tbObj,
          outcome: "Presumptive",
          status: "Presumptive TB and referred for evaluation",
          eligibleForTPT: "No",
        });
      }
    }

    if (
      props.tbObj.tbTreatment === "No" &&
      props.tbObj.currentlyOnTuberculosis === "No" &&
      props.tbObj.previouslyCompletedTPT === "Yes" &&
      props.tbObj.tbScreeningType === "Chest X-ray" &&
      props.tbObj.chestXray === "X-ray not suggestive"
    ) {
      {
        props.setTbObj({
          ...props.tbObj,
          outcome: "Not Presumptive",
          status: "No signs or symptoms of TB",
          eligibleForTPT: "No",
        });
      }
    }

    //Fourth Logic
    if (
      props.tbObj.tbTreatment === "No" &&
      props.tbObj.currentlyOnTuberculosis === "Yes" &&
      props.tbObj.previouslyCompletedTPT === "No" &&
      props.tbObj.tbScreeningType === "Symptom screen (alone)"
    ) {
      if (
        props.tbObj.coughing === "No" &&
        props.tbObj.fever === "No" &&
        props.tbObj.nightSweats === "No" &&
        props.tbObj.losingWeight === "No"
      ) {
        props.setTbObj({
          ...props.tbObj,
          outcome: "Not Presumptive",
          status: "Currently on TPT",
          eligibleForTPT: "No",
        });
      }
    }

    if (
      props.tbObj.tbTreatment === "No" &&
      props.tbObj.currentlyOnTuberculosis === "Yes" &&
      props.tbObj.previouslyCompletedTPT === "No" &&
      props.tbObj.tbScreeningType === "Symptom screen (alone)"
    ) {
      if (
        props.tbObj.coughing === "Yes" ||
        props.tbObj.fever === "Yes" ||
        props.tbObj.nightSweats === "Yes" ||
        props.tbObj.losingWeight === "Yes"
      ) {
        props.setTbObj({
          ...props.tbObj,
          outcome: "Presumptive",
          status: "Currently on TPT",
          eligibleForTPT: "No",
        });
      }
    }

    //Fourth Logic
    if (
      props.tbObj.tbTreatment === "No" &&
      props.tbObj.currentlyOnTuberculosis === "Yes" &&
      props.tbObj.previouslyCompletedTPT === "Yes" &&
      props.tbObj.tbScreeningType === "Chest X-ray" &&
      props.tbObj.chestXray === "X-ray not suggestive"
    ) {
      props.setTbObj({
        ...props.tbObj,
        outcome: "Not Presumptive",
        status: "Currently on TPT",
        eligibleForTPT: "No",
      });
    }

    if (
      props.tbObj.tbTreatment === "No" &&
      props.tbObj.currentlyOnTuberculosis === "Yes" &&
      props.tbObj.previouslyCompletedTPT === "No" &&
      props.tbObj.tbScreeningType === "Chest X-ray" &&
      props.tbObj.chestXray === "X-ray not suggestive"
    ) {
      props.setTbObj({
        ...props.tbObj,
        outcome: "Not Presumptive",
        status: "Currently on TPT",
        eligibleForTPT: "No",
      });
    }

    if (
      props.tbObj.tbTreatment === "No" &&
      props.tbObj.currentlyOnTuberculosis === "Yes" &&
      props.tbObj.previouslyCompletedTPT === "No" &&
      props.tbObj.tbScreeningType === "Chest X-ray" &&
      props.tbObj.chestXray === "X-ray suggestive"
    ) {
      props.setTbObj({
        ...props.tbObj,
        outcome: "Presumptive",
        status: "Currently on TPT",
        eligibleForTPT: "No",
      });
    }

    //Fifth Logic
    if (
      props.tbObj.tbTreatment === "No" &&
      props.tbObj.currentlyOnTuberculosis === "No" &&
      props.tbObj.tbScreeningType === "Chest X-ray" &&
      props.tbObj.previouslyCompletedTPT === "Yes" &&
      props.tbObj.chestXray === "X-ray not suggestive"
    ) {
      props.setTbObj({
        ...props.tbObj,
        outcome: "Not Presumptive",
        status: "No signs or symptoms of TB",
        eligibleForTPT: "No",
      });
    }

    //Sixth Logic
    if (
      props.tbObj.tbTreatment === "No" &&
      props.tbObj.currentlyOnTuberculosis === "Yes" &&
      props.tbObj.tbScreeningType === "Symptom screen (alone)" &&
      props.tbObj.previouslyCompletedTPT === "No"
    ) {
      if (
        props.tbObj.coughing === "Yes" ||
        props.tbObj.fever === "Yes" ||
        props.tbObj.nightSweats === "Yes" ||
        props.tbObj.losingWeight === "Yes"
      ) {
        props.setTbObj({
          ...props.tbObj,
          outcome: "Presumptive",
          status: "Currently on TPT",
          eligibleForTPT: "No",
        });
      }
    }

    //Seventh Logic
    if (
      props.tbObj.tbTreatment === "No" &&
      props.tbObj.currentlyOnTuberculosis === "Yes" &&
      props.tbObj.tbScreeningType === "Chest X-ray" &&
      props.tbObj.chestXray === "X-ray suggestive"
    ) {
      props.setTbObj({
        ...props.tbObj,
        outcome: "Presumptive",
        status: "Currently on TPT",
        eligibleForTPT: "No",
      });
    }

    //Eighth Logic
    if (
      props.tbObj.coughing === "No" &&
      props.tbObj.fever === "No" &&
      props.tbObj.nightSweats === "No" &&
      props.tbObj.losingWeight === "No"
    ) {
      if (props.tbObj.isTbTestConfirmed === "Yes") {
        props.setTbObj({
          ...props.tbObj,
          outcome: "Not Presumptive",
          status: "Confirmed TB",
          eligibleForTPT: "",
        });
      }
    }

    //Nineth Logic
    if (
      props.tbObj.coughing === "Yes" ||
      props.tbObj.fever === "Yes" ||
      props.tbObj.nightSweats === "Yes" ||
      props.tbObj.losingWeight === "Yes"
    ) {
      if (props.tbObj.isTbTestConfirmed === "Yes") {
        props.setTbObj({
          ...props.tbObj,
          outcome: "Presumptive",
          status: "Confirmed TB",
          eligibleForTPT: "No",
        });
      }
    }
  }, [
    patientAge,
    props.tbObj.tbTreatment,
    props.tbObj.coughing,
    props.tbObj.fever,
    props.tbObj.nightSweats,
    props.tbObj.tbScreeningType,
    props.tbObj.eligibleForTPT,
    props.tbObj.outcome,
    props.tbObj.status,
    props.tbObj.losingWeight,
    props.tbObj.chestXray,
    props.tbObj.completionDate,
    props.tbObj.treatementType,
    props.tbObj.tbTreatmentStartDate,
    props.tbObj.treatmentOutcome,
    props.tbObj.treatmentCompletionResult,
    props.tbObj.isTbTestConfirmed,
  ]);

  //Logic for Less than 14 years
  if (age < 14) {
    useEffect(() => {
      //First Logic 1 Solved

      if (
        props.tbObj.tbTreatment === "No" &&
        props.tbObj.tbScreeningType === "Symptom screen (alone)"
      ) {
        if (
          props.tbObj.coughing === "No" &&
          props.tbObj.fever === "No" &&
          props.tbObj.nightSweats === "No" &&
          props.tbObj.losingWeight === "No" &&
          props.tbObj.historyWithAdults === "No" &&
          props.tbObj.poorWeightGain === "No"
        ) {
          props.setTbObj({
            ...props.tbObj,
            outcome: "Not Presumptive",
            status: "No signs or symptoms of TB",
            eligibleForTPT: "",
          });
        }
      }

      if (
        props.tbObj.tbTreatment === "No" &&
        props.tbObj.tbScreeningType === "Symptom screen (alone)" &&
        props.tbObj.currentlyOnTuberculosis === "No" &&
        props.tbObj.previouslyCompletedTPT === "No"
      ) {
        if (
          props.tbObj.coughing === "No" &&
          props.tbObj.fever === "No" &&
          props.tbObj.nightSweats === "No" &&
          props.tbObj.losingWeight === "No" &&
          props.tbObj.historyWithAdults === "No" &&
          props.tbObj.poorWeightGain === "No"
        ) {
          props.setTbObj({
            ...props.tbObj,
            outcome: "Not Presumptive",
            status: "No signs or symptoms of TB",
            eligibleForTPT: "Yes",
          });
        }
      }

      if (
        props.tbObj.tbTreatment === "No" &&
        props.tbObj.tbScreeningType === "Chest X-ray" &&
        props.tbObj.chestXray === "X-ray not suggestive" &&
        props.tbObj.currentlyOnTuberculosis === "No" &&
        props.tbObj.previouslyCompletedTPT === "No"
      ) {
        props.setTbObj({
          ...props.tbObj,
          outcome: "Not Presumptive",
          status: "No signs or symptoms of TB",
          eligibleForTPT: "Yes",
        });
      }

      if (
        props.tbObj.tbTreatment === "No" &&
        props.tbObj.tbScreeningType === "Symptom screen (alone)"
      ) {
        if (
          props.tbObj.coughing === "Yes" ||
          props.tbObj.fever === "Yes" ||
          props.tbObj.nightSweats === "Yes" ||
          props.tbObj.losingWeight === "Yes" ||
          props.tbObj.historyWithAdults === "Yes" ||
          props.tbObj.poorWeightGain === "Yes"
        ) {
          props.setTbObj({
            ...props.tbObj,
            outcome: "Presumptive TB",
            status: "Presumptive TB and referred for evaluation",
            eligibleForTPT: "",
          });
        }
      }

      //First Logic 2
      if (
        props.tbObj.tbTreatment === "No" &&
        props.tbObj.tbScreeningType === "Chest X-ray" &&
        props.tbObj.chestXray === "X-ray suggestive"
      ) {
        props.setTbObj({
          ...props.tbObj,
          outcome: "",
          status: "Presumptive TB",
          eligibleForTPT: "",
        });
      }

      if (
        props.tbObj.tbTreatment === "No" &&
        props.tbObj.tbScreeningType === "Chest X-ray" &&
        props.tbObj.chestXray === "X-ray not suggestive"
      ) {
        props.setTbObj({
          ...props.tbObj,
          outcome: "",
          status: "No signs or symptoms of TB",
          eligibleForTPT: "",
        });
      }

      //Second Logic
      if (props.tbObj.tbTreatment === "Yes") {
        props.setTbObj({
          ...props.tbObj,
          outcome: "Not Presumptive",
          status: "Currently on TB treatment",
          activeTb: true,
        });
      }

      //Third Logic
      if (
        props.tbObj.tbTreatment === "No" &&
        props.tbObj.currentlyOnTuberculosis === "No" &&
        props.tbObj.previouslyCompletedTPT === "No" &&
        props.tbObj.tbScreeningType === "Symptom screen (alone)"
      ) {
        if (
          props.tbObj.coughing === "Yes" ||
          props.tbObj.fever === "Yes" ||
          props.tbObj.nightSweats === "Yes" ||
          props.tbObj.losingWeight === "Yes" ||
          props.tbObj.historyWithAdults === "Yes" ||
          props.tbObj.poorWeightGain === "Yes"
        ) {
          props.setTbObj({
            ...props.tbObj,
            outcome: "Presumptive",
            status: "Presumptive TB and referred for evaluation",
            eligibleForTPT: "No",
          });
        }
      }

      if (
        props.tbObj.tbTreatment === "No" &&
        props.tbObj.currentlyOnTuberculosis === "No" &&
        props.tbObj.previouslyCompletedTPT === "Yes" &&
        props.tbObj.tbScreeningType === "Symptom screen (alone)"
      ) {
        if (
          props.tbObj.coughing === "Yes" ||
          props.tbObj.fever === "Yes" ||
          props.tbObj.nightSweats === "Yes" ||
          props.tbObj.losingWeight === "Yes" ||
          props.tbObj.historyWithAdults === "Yes" ||
          props.tbObj.poorWeightGain === "Yes"
        ) {
          props.setTbObj({
            ...props.tbObj,
            outcome: "Presumptive",
            status: "Presumptive TB and referred for evaluation",
            eligibleForTPT: "No",
          });
        }
      }

      if (
        props.tbObj.tbTreatment === "No" &&
        props.tbObj.currentlyOnTuberculosis === "No" &&
        props.tbObj.previouslyCompletedTPT === "No" &&
        props.tbObj.tbScreeningType === "Chest X-ray" &&
        props.tbObj.chestXray === "X-ray not suggestive"
      ) {
        {
          props.setTbObj({
            ...props.tbObj,
            outcome: "Not Presumptive",
            status: "No signs or symptoms of TB",
            eligibleForTPT: "Yes",
          });
        }
      }

      if (
        props.tbObj.tbTreatment === "No" &&
        props.tbObj.currentlyOnTuberculosis === "No" &&
        props.tbObj.previouslyCompletedTPT === "No" &&
        props.tbObj.tbScreeningType === "Chest X-ray" &&
        props.tbObj.chestXray === "X-ray suggestive"
      ) {
        {
          props.setTbObj({
            ...props.tbObj,
            outcome: "Presumptive",
            status: "Presumptive TB and referred for evaluation",
            eligibleForTPT: "No",
          });
        }
      }

      if (
        props.tbObj.tbTreatment === "No" &&
        props.tbObj.currentlyOnTuberculosis === "No" &&
        props.tbObj.previouslyCompletedTPT === "Yes" &&
        props.tbObj.tbScreeningType === "Symptom screen (alone)"
      ) {
        if (
          props.tbObj.coughing === "No" &&
          props.tbObj.fever === "No" &&
          props.tbObj.nightSweats === "No" &&
          props.tbObj.losingWeight === "No" &&
          props.tbObj.historyWithAdults === "No" &&
          props.tbObj.poorWeightGain === "No"
        ) {
          props.setTbObj({
            ...props.tbObj,
            outcome: "Not Presumptive",
            status: "No signs or symptoms of TB",
            eligibleForTPT: "No",
          });
        }
      }

      if (
        props.tbObj.tbTreatment === "No" &&
        props.tbObj.currentlyOnTuberculosis === "No" &&
        props.tbObj.previouslyCompletedTPT === "Yes" &&
        props.tbObj.tbScreeningType === "Chest X-ray" &&
        props.tbObj.chestXray === "X-ray suggestive"
      ) {
        {
          props.setTbObj({
            ...props.tbObj,
            outcome: "Presumptive",
            status: "Presumptive TB and referred for evaluation",
            eligibleForTPT: "No",
          });
        }
      }

      if (
        props.tbObj.tbTreatment === "No" &&
        props.tbObj.currentlyOnTuberculosis === "No" &&
        props.tbObj.previouslyCompletedTPT === "Yes" &&
        props.tbObj.tbScreeningType === "Chest X-ray" &&
        props.tbObj.chestXray === "X-ray not suggestive"
      ) {
        {
          props.setTbObj({
            ...props.tbObj,
            outcome: "Not Presumptive",
            status: "No signs or symptoms of TB",
            eligibleForTPT: "No",
          });
        }
      }

      //Fourth Logic
      if (
        props.tbObj.tbTreatment === "No" &&
        props.tbObj.currentlyOnTuberculosis === "Yes" &&
        props.tbObj.previouslyCompletedTPT === "No" &&
        props.tbObj.tbScreeningType === "Symptom screen (alone)"
      ) {
        if (
          props.tbObj.coughing === "No" &&
          props.tbObj.fever === "No" &&
          props.tbObj.nightSweats === "No" &&
          props.tbObj.losingWeight === "No" &&
          props.tbObj.historyWithAdults === "No" &&
          props.tbObj.poorWeightGain === "No"
        ) {
          props.setTbObj({
            ...props.tbObj,
            outcome: "Not Presumptive",
            status: "Currently on TPT",
            eligibleForTPT: "No",
          });
        }
      }

      if (
        props.tbObj.tbTreatment === "No" &&
        props.tbObj.currentlyOnTuberculosis === "Yes" &&
        props.tbObj.previouslyCompletedTPT === "No" &&
        props.tbObj.tbScreeningType === "Symptom screen (alone)"
      ) {
        if (
          props.tbObj.coughing === "Yes" ||
          props.tbObj.fever === "Yes" ||
          props.tbObj.nightSweats === "Yes" ||
          props.tbObj.losingWeight === "Yes" ||
          props.tbObj.historyWithAdults === "Yes" ||
          props.tbObj.poorWeightGain === "Yes"
        ) {
          props.setTbObj({
            ...props.tbObj,
            outcome: "Presumptive",
            status: "Currently on TPT",
            eligibleForTPT: "No",
          });
        }
      }

      //Fourth Logic
      if (
        props.tbObj.tbTreatment === "No" &&
        props.tbObj.currentlyOnTuberculosis === "Yes" &&
        props.tbObj.previouslyCompletedTPT === "Yes" &&
        props.tbObj.tbScreeningType === "Chest X-ray" &&
        props.tbObj.chestXray === "X-ray not suggestive"
      ) {
        props.setTbObj({
          ...props.tbObj,
          outcome: "Not Presumptive",
          status: "Currently on TPT",
          eligibleForTPT: "No",
        });
      }

      if (
        props.tbObj.tbTreatment === "No" &&
        props.tbObj.currentlyOnTuberculosis === "Yes" &&
        props.tbObj.previouslyCompletedTPT === "No" &&
        props.tbObj.tbScreeningType === "Chest X-ray" &&
        props.tbObj.chestXray === "X-ray not suggestive"
      ) {
        props.setTbObj({
          ...props.tbObj,
          outcome: "Not Presumptive",
          status: "Currently on TPT",
          eligibleForTPT: "No",
        });
      }

      if (
        props.tbObj.tbTreatment === "No" &&
        props.tbObj.currentlyOnTuberculosis === "Yes" &&
        props.tbObj.previouslyCompletedTPT === "No" &&
        props.tbObj.tbScreeningType === "Chest X-ray" &&
        props.tbObj.chestXray === "X-ray suggestive"
      ) {
        props.setTbObj({
          ...props.tbObj,
          outcome: "Presumptive",
          status: "Currently on TPT",
          eligibleForTPT: "No",
        });
      }

      //Fifth Logic
      if (
        props.tbObj.tbTreatment === "No" &&
        props.tbObj.currentlyOnTuberculosis === "No" &&
        props.tbObj.tbScreeningType === "Chest X-ray" &&
        props.tbObj.previouslyCompletedTPT === "Yes" &&
        props.tbObj.chestXray === "X-ray not suggestive"
      ) {
        props.setTbObj({
          ...props.tbObj,
          outcome: "Not Presumptive",
          status: "No signs or symptoms of TB",
          eligibleForTPT: "No",
        });
      }

      //Sixth Logic
      if (
        props.tbObj.tbTreatment === "No" &&
        props.tbObj.currentlyOnTuberculosis === "Yes" &&
        props.tbObj.tbScreeningType === "Symptom screen (alone)" &&
        props.tbObj.previouslyCompletedTPT === "No"
      ) {
        if (
          props.tbObj.coughing === "Yes" ||
          props.tbObj.fever === "Yes" ||
          props.tbObj.nightSweats === "Yes" ||
          props.tbObj.losingWeight === "Yes" ||
          props.tbObj.historyWithAdults === "Yes" ||
          props.tbObj.poorWeightGain === "Yes"
        ) {
          props.setTbObj({
            ...props.tbObj,
            outcome: "Presumptive",
            status: "Currently on TPT",
            eligibleForTPT: "No",
          });
        }
      }

      //Seventh Logic
      if (
        props.tbObj.tbTreatment === "No" &&
        props.tbObj.currentlyOnTuberculosis === "Yes" &&
        props.tbObj.tbScreeningType === "Chest X-ray" &&
        props.tbObj.chestXray === "X-ray suggestive"
      ) {
        props.setTbObj({
          ...props.tbObj,
          outcome: "Presumptive",
          status: "Currently on TPT",
          eligibleForTPT: "No",
        });
      }

      //Eighth Logic
      if (
        props.tbObj.coughing === "No" &&
        props.tbObj.fever === "No" &&
        props.tbObj.nightSweats === "No" &&
        props.tbObj.losingWeight === "No" &&
        props.tbObj.historyWithAdults === "No" &&
        props.tbObj.poorWeightGain === "No"
      ) {
        if (props.tbObj.isTbTestConfirmed === "Yes") {
          props.setTbObj({
            ...props.tbObj,
            outcome: "Not Presumptive",
            status: "Confirmed TB",
            eligibleForTPT: "",
          });
        }
      }

      //Nineth Logic
      if (
        props.tbObj.coughing === "Yes" ||
        props.tbObj.fever === "Yes" ||
        props.tbObj.nightSweats === "Yes" ||
        props.tbObj.losingWeight === "Yes" ||
        props.tbObj.historyWithAdults === "Yes" ||
        props.tbObj.poorWeightGain === "Yes"
      ) {
        if (props.tbObj.isTbTestConfirmed === "Yes") {
          props.setTbObj({
            ...props.tbObj,
            outcome: "Presumptive ",
            status: "Confirmed TB",
            eligibleForTPT: "No",
          });
        }
      }
    }, [
      patientAge,
      props.tbObj.tbTreatment,
      props.tbObj.coughing,
      props.tbObj.fever,
      props.tbObj.nightSweats,
      props.tbObj.tbScreeningType,
      props.tbObj.eligibleForTPT,
      props.tbObj.outcome,
      props.tbObj.status,
      props.tbObj.losingWeight,
      props.tbObj.chestXray,
      props.tbObj.completionDate,
      props.tbObj.treatementType,
      props.tbObj.tbTreatmentStartDate,
      props.tbObj.treatmentOutcome,
      props.tbObj.treatmentCompletionResult,
      props.tbObj.isTbTestConfirmed,
      props.tbObj.historyWithAdults,
      props.tbObj.poorWeightGain,
    ]);
  }

  useEffect(() => {
    TB_TREATMENT_OUTCOME();
    TB_TREATMENT_TYPE();
    TB_SCREENING_TYPE();
    // CXR_SCREENING_TYPE();
  }, []);
  const TB_TREATMENT_TYPE = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/TB_TREATMENT_TYPE`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTbTreatmentType(response.data);
      })
      .catch((error) => {});
  };
  const TB_TREATMENT_OUTCOME = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/TB_TREATMENT_OUTCOME`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTbTreatmentOutCome(response.data);
      })
      .catch((error) => {});
  };

  const TB_SCREENING_TYPE = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/TB_SCREENING_TYPE`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTbScreeningType(response.data);
      })
      .catch((error) => {});
  };
  // const CXR_SCREENING_TYPE = () => {
  //   axios
  //     .get(`${baseUrl}application-codesets/v2/LAB_ORDER_INDICATION`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     .then((response) => {
  //       setTbScreeningType2(response.data);
  //     })
  //     .catch((error) => {});
  // };

  //   TB_SCREENING_TYPE	Care and Support form/TB/IPT Screening	Symptom screen (alone)
  // TB_SCREENING_TYPE	Care and Support form/TB/IPT Screening	Chest X-ray
  // CXR_SCREENING_TYPE	Care and Support form/TB/IPT Screening	X-ray suggestive
  // CXR_SCREENING_TYPE	Care and Support form/TB/IPT Screening	X-ray not suggestive

  // console.log("tbScreeningType", tbScreeningType);
  console.log("tbScreeningType2", tbScreeningType2);

  const handleInputChange = (e) => {
    props.setTbObj({ ...props.tbObj, [e.target.name]: e.target.value });
  };

  const handleInputChangeContrain = (e) => {
    if (e.target.checked) {
      props.setTbObj({ ...props.tbObj, [e.target.name]: e.target.checked });
    } else {
      props.setTbObj({ ...props.tbObj, [e.target.name]: false });
    }
  };

  return (
    <>
      <Card className={classes.root}>
        <CardBody>
          <h2 style={{ color: "#000" }}>TB & IPT Screening </h2>
          <br />
          <form>
            <div className="row">
              <div className="form-group mb-3 col-md-6">
                <FormGroup>
                  <Label>
                    Are you currently on TB treatment?{" "}
                    <span style={{ color: "red" }}> *</span>
                  </Label>
                  <InputGroup>
                    <Input
                      type="select"
                      name="tbTreatment"
                      id="tbTreatment"
                      onChange={handleInputChange}
                      value={props.tbObj.tbTreatment}
                      disabled={props.action === "view" ? true : false}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Input>
                  </InputGroup>
                </FormGroup>
              </div>
              {props.tbObj.tbTreatment === "Yes" && (
                <div className="form-group mb-3 col-md-6">
                  <FormGroup>
                    <Label>
                      TB treatment start date{" "}
                      <span style={{ color: "red" }}> *</span>
                    </Label>
                    <InputGroup>
                      <Input
                        type="date"
                        name="tbTreatmentStartDate"
                        id="tbTreatmentStartDate"
                        onChange={handleInputChange}
                        value={props.tbObj.tbTreatmentStartDate}
                        // min={props.encounterDate}
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        disabled={props.action === "view" ? true : false}
                        required
                      ></Input>
                    </InputGroup>
                  </FormGroup>
                  {props.errors.tbTreatmentStartDate !== "" ? (
                    <span className={classes.error}>
                      {props.errors.tbTreatmentStartDate}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              )}

              {props.tbObj.tbTreatment === "No" && (
                <>
                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label>
                        Are you currently on Tuberculosis Preventive Therapy (
                        TPT ) <span style={{ color: "red" }}> *</span>
                      </Label>
                      <InputGroup>
                        <Input
                          type="select"
                          name="currentlyOnTuberculosis"
                          id="currentlyOnTuberculosis"
                          onChange={handleInputChange}
                          value={props.tbObj.currentlyOnTuberculosis}
                          disabled={props.action === "view" ? true : false}
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Input>
                      </InputGroup>
                    </FormGroup>
                  </div>

                  {/* SCREENING TYPE OPTIONS */}
                  <div className="form-group  mb-3 col-md-6">
                    <FormGroup>
                      <Label>Screening Type</Label>
                      <InputGroup>
                        <Input
                          type="select"
                          name="tbScreeningType"
                          id="tbScreeningType"
                          onChange={handleInputChange}
                          disabled={props.action === "view" ? true : false}
                          value={props.tbObj.tbScreeningType}
                        >
                          <option value="">Select</option>
                          {tbScreeningType.map((value) => (
                            <option key={value.id} value={value.display}>
                              {value.display}
                            </option>
                          ))}
                        </Input>
                      </InputGroup>
                    </FormGroup>
                  </div>

                  {/* PREVIOUSLY  ON TPT */}
                  <div className="form-group  mb-3 col-md-6">
                    {/* (props.tbObj.currentlyOnTuberculosis === "Yes" */}
                    {props.tbObj.currentlyOnTuberculosis === "No" && (
                      <FormGroup>
                        <Label>
                          Have you previously completed TPT?{" "}
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="select"
                            name="previouslyCompletedTPT"
                            id="previouslyCompletedTPT"
                            onChange={handleInputChange}
                            value={props.tbObj.previouslyCompletedTPT}
                            disabled={props.action === "view" ? true : false}
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </Input>
                        </InputGroup>
                      </FormGroup>
                    )}
                    {props.tbObj.currentlyOnTuberculosis === "Yes" && (
                      <FormGroup>
                        <Label>
                          Have you previously completed TPT?{" "}
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="select"
                            name="previouslyCompletedTPT"
                            id="previouslyCompletedTPT"
                            onChange={handleInputChange}
                            value={props.tbObj.previouslyCompletedTPT}
                            disabled={props.action === "view" ? true : false}
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </Input>
                        </InputGroup>
                      </FormGroup>
                    )}
                  </div>

                  {/* SCREENING QUESTIONS */}
                  {props.tbObj.tbScreeningType === "Symptom screen (alone)" && (
                    <>
                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>
                            Are you coughing?{" "}
                            <span style={{ color: "red" }}> *</span>
                          </Label>
                          <InputGroup>
                            <Input
                              type="select"
                              name="coughing"
                              id="coughing"
                              onChange={handleInputChange}
                              value={props.tbObj.coughing}
                              disabled={props.action === "view" ? true : false}
                            >
                              <option value="">Select</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </Input>
                          </InputGroup>
                        </FormGroup>
                      </div>

                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>
                            Do you have fever for 2 weeks or more? (Unexplained
                            fever) <span style={{ color: "red" }}> *</span>
                          </Label>
                          <InputGroup>
                            <Input
                              type="select"
                              name="fever"
                              id="fever"
                              onChange={handleInputChange}
                              value={props.tbObj.fever}
                              disabled={props.action === "view" ? true : false}
                            >
                              <option value="">Select</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </Input>
                          </InputGroup>
                        </FormGroup>
                      </div>

                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>
                            Are you having night sweats? (drenching or excessive
                            night sweats)
                            <span style={{ color: "red" }}> *</span>
                          </Label>
                          <InputGroup>
                            <Input
                              type="select"
                              name="nightSweats"
                              id="nightSweats"
                              onChange={handleInputChange}
                              value={props.tbObj.nightSweats}
                              disabled={props.action === "view" ? true : false}
                            >
                              <option value="">Select</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </Input>
                          </InputGroup>
                        </FormGroup>
                      </div>

                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>
                            Are you losing weight? (Unplanned weight loss)
                            <span style={{ color: "red" }}> *</span>
                          </Label>
                          <InputGroup>
                            <Input
                              type="select"
                              name="losingWeight"
                              id="losingWeight"
                              onChange={handleInputChange}
                              value={props.tbObj.losingWeight}
                              disabled={props.action === "view" ? true : false}
                            >
                              <option value="">Select</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </Input>
                          </InputGroup>
                        </FormGroup>
                      </div>
                      {props.tbObj.tbScreeningType ===
                        "Symptom screen (alone)" &&
                        patientAge <= 14 && (
                          <>
                            <div className="form-group mb-3 col-md-6">
                              <FormGroup>
                                <Label>
                                  History of contacts with TB adults
                                  (Paediatrics clients {"<"} 12 months){" "}
                                </Label>
                                <InputGroup>
                                  <Input
                                    type="select"
                                    name="historyWithAdults"
                                    id="historyWithAdults"
                                    onChange={handleInputChange}
                                    value={props.tbObj.historyWithAdults}
                                    disabled={
                                      props.action === "view" ? true : false
                                    }
                                  >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </Input>
                                </InputGroup>
                              </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-6">
                              <FormGroup>
                                <Label>
                                  Poor weight gain (Paediatrics clients {"<"}12
                                  months){" "}
                                </Label>
                                <InputGroup>
                                  <Input
                                    type="select"
                                    name="poorWeightGain"
                                    id="poorWeightGain"
                                    onChange={handleInputChange}
                                    value={props.tbObj.poorWeightGain}
                                    disabled={
                                      props.action === "view" ? true : false
                                    }
                                  >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </Input>
                                </InputGroup>
                              </FormGroup>
                            </div>
                          </>
                        )}

                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>
                            Is TB test confirmed positive?{" "}
                            <span style={{ color: "red" }}> *</span>
                          </Label>
                          <InputGroup>
                            <Input
                              type="select"
                              name="isTbTestConfirmed"
                              id="isTbTestConfirmed"
                              onChange={handleInputChange}
                              value={props.tbObj.isTbTestConfirmed}
                              disabled={props.action === "view" ? true : false}
                            >
                              <option value="">Select</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </Input>
                          </InputGroup>
                        </FormGroup>
                      </div>
                    </>
                  )}

                  {/* TB SCREENING TYPE === Chest X-ray*/}

                  {props.tbObj.tbScreeningType === "Chest X-ray" && (
                    <>
                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>Chest X-ray</Label>
                          <InputGroup>
                            <Input
                              type="select"
                              name="chestXray"
                              id="chestXray"
                              onChange={handleInputChange}
                              disabled={props.action === "view" ? true : false}
                              value={props.tbObj.chestXray}
                            >
                              <option value="">Select</option>
                              <option value="X-ray suggestive">
                                X-ray suggestive
                              </option>
                              <option value="X-ray not suggestive">
                                X-ray not suggestive
                              </option>
                            </Input>
                          </InputGroup>
                        </FormGroup>
                      </div>

                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>
                            Is TB test confirmed positive?{" "}
                            {/* <span style={{ color: "red" }}> *</span> */}
                          </Label>
                          <InputGroup>
                            <Input
                              type="select"
                              name="isTbTestConfirmed"
                              id="isTbTestConfirmed"
                              onChange={handleInputChange}
                              value={props.tbObj.isTbTestConfirmed}
                              disabled={props.action === "view" ? true : false}
                            >
                              <option value="">Select</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </Input>
                          </InputGroup>
                        </FormGroup>
                      </div>
                    </>
                  )}
                </>
              )}

              <hr />

              <br />
              <p style={{ color: "black" }}>
                Eligible for IPT:<b>{" " + props.tbObj.eligibleForTPT}</b>
              </p>

              <br />
              <hr />

              <p style={{ color: "black" }}>
                TB Screening Outcome:<b>{" " + props.tbObj.outcome}</b>
              </p>
              <p style={{ color: "black" }}>
                TB Screening Status:
                <b>
                  {" " + props.tbObj.status === "undefined"
                    ? ""
                    : props.tbObj.status}
                </b>
              </p>
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
};

export default TbScreening;
