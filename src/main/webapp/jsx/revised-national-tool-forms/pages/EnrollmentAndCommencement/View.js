import React from "react";
import EnrollmentAndCommencementForm from "./Index";

/**
 * View wrapper for Enrollment & Commencement Form
 * This component uses the main Index.js component with mode="view"
 */
const EnrollmentAndCommencementView = (props) => {
  return <EnrollmentAndCommencementForm {...props} mode="view" />;
};

export default EnrollmentAndCommencementView;
