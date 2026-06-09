import React from "react";
import AdherencePreparationIndex from "./Index";

/**
 * View wrapper for Adherence Preparation Form
 * This component uses the main Index.js component with mode="edit"
 * Note: Using the same form UI for both view and update
 */
const AdherencePreparationView = (props) => {
  return <AdherencePreparationIndex {...props} mode="edit" />;
};

export default AdherencePreparationView;
