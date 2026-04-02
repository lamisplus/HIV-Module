import React from "react";
import InitialClinicalEvaluationForm from "./Index";

/**
 * Update wrapper for Initial Clinical Evaluation Form
 * This component uses the main Index.js component with mode="edit"
 */
const InitialClinicalEvaluationUpdate = (props) => {
  return <InitialClinicalEvaluationForm {...props} mode="edit" />;
};

export default InitialClinicalEvaluationUpdate;
