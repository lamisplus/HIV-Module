import { useFormik } from "formik";
import * as yup from "yup";

export const useServiceFormValidationSchema = (onSubmit) => {
  const serviceFormInitialValues = {
    // artStartDate: "",
    dateEnrolledIntoOtz: "",
    otzPlus: "",
    // baselineViralLoadAtEnrollment: "",
    dateDone: "",
  };

  const ServiceFormValidationSchema = yup.object().shape({
    // artStartDate: yup.date().when("question", {
    //   is: "yes",
    //   then: yup.date().required("Date is required"),
    // }),
    dateEnrolledIntoOtz: yup.date().required("This field is required"),
    otzPlus: yup.string(),
    // baselineViralLoadAtEnrollment: yup
    //   .number(),
    dateDone: yup.date().required("This field is required"),

    
  });

  const formik = useFormik({
    initialValues: serviceFormInitialValues,
    onSubmit,
    validationSchema: ServiceFormValidationSchema,
  });
  return { formik };
};
