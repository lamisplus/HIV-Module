import React from "react";
import InitialClinicalEvaluationForm from "./Index";

/**
 * View wrapper for Initial Clinical Evaluation Form
 * This component uses the main Index.js component with mode="edit"
 * Note: Using the same form UI for both view and update
 */
const InitialClinicalEvaluationView = (props) => {
  return <InitialClinicalEvaluationForm {...props} mode="edit" />;
};

export default InitialClinicalEvaluationView;
