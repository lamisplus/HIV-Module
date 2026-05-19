import React from "react";
import AdherencePreparationIndex from "./Index";

/**
 * Update wrapper for Adherence Preparation Form
 * This component uses the main Index.js component with mode="edit"
 */
const AdherencePreparationUpdate = (props) => {
  return <AdherencePreparationIndex {...props} mode="edit" />;
};

export default AdherencePreparationUpdate;
