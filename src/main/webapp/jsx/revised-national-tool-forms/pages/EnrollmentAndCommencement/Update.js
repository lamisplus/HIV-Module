import React from "react";
import EnrollmentAndCommencementForm from "./Index";

/**
 * Update wrapper for Enrollment & Commencement Form
 * This component uses the main Index.js component with mode="edit"
 */
const EnrollmentAndCommencementUpdate = (props) => {
  return <EnrollmentAndCommencementForm {...props} mode="edit" />;
};

export default EnrollmentAndCommencementUpdate;
