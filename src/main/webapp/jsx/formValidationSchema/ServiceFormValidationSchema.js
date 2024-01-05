import { useFormik } from "formik";
import * as yup from "yup";

export const useServiceFormValidationSchema = (onSubmit) => {
  const serviceFormInitialValues = {
    // facilityName: "",
    // lga: "",
    // state: "",
    // clientName: "",
    // patienttId: "",
    // sex: "",
    // artStartDate: "",
    // ageAtArtStart: "",
    // telephone: "",
    dateEnrolledIntoOtz: "",
    OtzPlus: "",
    baselineViralLoadAtEnrollment: "",
    dateDone: "",
    acMonth1EacDate1: "",
    acMonth1EacDate2: "",
    acMonth1EacDate3: "",
    dateViralLoadAssesmentMonth1: "",
    viralLoadMonth1: "",

    acMonth2EacDate1: "",
    acMonth2EacDate2: "",
    acMonth2EacDate3: "",
    dateViralLoadAssesmentMonth2: "",
    viralLoadMonth2: "",

    acMonth3EacDate1: "",
    acMonth3EacDate2: "",
    acMonth3EacDate3: "",
    dateViralLoadAssesmentMonth3: "",
    viralLoadMonth3: "",

    vlMonth1Date: "",
    vlMonth1Result: "",
    vlMonth2Date: "",
    vlMonth2Result: "",
    vlMonth3Date: "",
    vlMonth3Result: "",

    maMonth1PositiveLivingDate: "",
    maMonth1PositiveLivingChoice: "",
    maMonth1LiteracyTreatmentDate: "",
    maMonth1LiteracyTreatmentChoice: "",
    maMonth1AdolescentsParticipationDate: "",
    maMonth1AdolescentsParticipationChoice: "",
    maMonth1leadershipTrainingDate: "",
    maMonth1leadershipTrainingChoice: "",
    maMonth1PeerToPeerDate: "",
    maMonth1PeerToPeerChoice: "",
    maMonth1RoleOfOtzDate: "",
    maMonth1RoleOfOtzChoice: "",
    maMonth1OtzChampionOrientationDate: "",
    maMonth1OtzChampionOrientationChoice: "",

    maMonth2PositiveLivingDate: "",
    maMonth2PositiveLivingChoice: "",
    maMonth2LiteracyTreatmentDate: "",
    maMonth2LiteracyTreatmentChoice: "",
    maMonth2AdolescentsParticipationDate: "",
    maMonth2AdolescentsParticipationChoice: "",
    maMonth2leadershipTrainingDate: "",
    maMonth2leadershipTrainingChoice: "",
    maMonth2PeerToPeerDate: "",
    maMonth2PeerToPeerChoice: "",
    maMonth2RoleOfOtzDate: "",
    maMonth2RoleOfOtzChoice: "",
    maMonth2OtzChampionOrientationDate: "",
    maMonth2OtzChampionOrientationChoice: "",

    maMonth3PositiveLivingDate: "",
    maMonth3PositiveLivingChoice: "",
    maMonth3LiteracyTreatmentDate: "",
    maMonth3LiteracyTreatmentChoice: "",
    maMonth3AdolescentsParticipationDate: "",
    maMonth3AdolescentsParticipationChoice: "",
    maMonth3leadershipTrainingDate: "",
    maMonth3leadershipTrainingChoice: "",
    maMonth3PeerToPeerDate: "",
    maMonth3PeerToPeerChoice: "",
    maMonth3RoleOfOtzDate: "",
    maMonth3RoleOfOtzChoice: "",
    maMonth3OtzChampionOrientationDate: "",
    maMonth3OtzChampionOrientationChoice: "",

    sixMonthsResult: "",
    sixMonthsDate: "",
    twelveMonthsResult: "",
    twelveMonthsDate: "",
    eighteenMonthsResult: "",
    eighteenMonthsDate: "",
    twentyFourMonthsResult: "",
    twentyFourMonthsDate: "",
    thirtyMonthsResult: "",
    thirtyMonthsDate: "",
    thirtySixMonthsResult: "",
    thirtySixMonthsDate: "",

    outcomes: "",
    exitedOtz: "",
    transitionDate: "",

    viralLoadOnOtzExit: "",
    dateOfAssessmentDone: "",
    exitedByName: "",
    exitedByDesignation: "",
    exitedByDate: "",
    exitedBySignature: "",
  };

  const ServiceFormValidationSchema = yup.object().shape({
    // facilityName: yup.string(),
    // lga: yup.string(),
    // state: yup.string(),
    // clientName: yup.string(),
    // patienttId: yup.string(),
    // sex: yup.string(),
    artStartDate: yup.date().when("question", {
      is: "yes",
      then: yup.date().required("Date is required"),
    }),
    // ageAtArtStart: yup.string(),
    // telephone: yup.string(),
    dateEnrolledIntoOtz: yup.date().required("This field is required"),
    OtzPlus: yup.string(),
    baselineViralLoadAtEnrollment: yup.number().required("This field is required"),
    dateDone: yup.date().required("This field is required"),

    acMonth1EacDate1: yup.date(),
    acMonth1EacDate2: yup.date(),
    acMonth1EacDate3: yup.date(),
    dateViralLoadAssesmentMonth1: yup.date(),
    viralLoadMonth1: yup.number(),

    acMonth2EacDate1: yup.date(),
    acMonth2EacDate2: yup.date(),
    acMonth2EacDate3: yup.date(),
    dateViralLoadAssesmentMonth2: yup.date(),
    viralLoadMonth2: yup.number(),

    acMonth3EacDate1: yup.date(),
    acMonth3EacDate2: yup.date(),
    acMonth3EacDate3: yup.date(),
    dateViralLoadAssesmentMonth3: yup.date(),
    viralLoadMonth3: yup.number(),


    vlMonth1Date: yup.date(),
    vlMonth1Result: yup.string(),
    vlMonth2Date: yup.date(),
    vlMonth2Result: yup.string(),
    vlMonth3Date: yup.date(),
    vlMonth3Result: yup.string(),

    maMonth1PositiveLivingChoice: yup.string(),
    maMonth1PositiveLivingDate: yup
      .date()
      .when("maMonth1PositiveLivingChoice", {
        is: "yes",
        then: yup.date().required("Date is required"),
      }),

    maMonth1LiteracyTreatmentChoice: yup.string(),
    maMonth1LiteracyTreatmentDate: yup
      .date()
      .when("maMonth1LiteracyTreatmentChoice", {
        is: "yes",
        then: yup.date().required("Date is required"),
      }),

    maMonth1AdolescentsParticipationChoice: yup.string(),
    maMonth1AdolescentsParticipationDate: yup
      .date()
      .when("maMonth1AdolescentsParticipationChoice", {
        is: "yes",
        then: yup.date().required("Date is required"),
      }),

    maMonth1leadershipTrainingChoice: yup.string(),
    maMonth1leadershipTrainingDate: yup
      .date()
      .when("maMonth1leadershipTrainingChoice", {
        is: "yes",
        then: yup.date().required("Date is required"),
      }),

    maMonth1PeerToPeerChoice: yup.string(),
    maMonth1PeerToPeerDate: yup.date().when("maMonth1PeerToPeerChoice", {
      is: "yes",
      then: yup.date().required("Date is required"),
    }),

    maMonth1RoleOfOtzChoice: yup.string(),
    maMonth1RoleOfOtzDate: yup.date().when("maMonth1RoleOfOtzChoice", {
      is: "yes",
      then: yup.date().required("Date is required"),
    }),

    maMonth1OtzChampionOrientationChoice: yup.string(),
    maMonth1OtzChampionOrientationDate: yup
      .date()
      .when("maMonth1OtzChampionOrientationChoice", {
        is: "yes",
        then: yup.date().required("Date is required"),
      }),

    maMonth2PositiveLivingChoice: yup.string(),
    maMonth2PositiveLivingDate: yup
      .date()
      .when("maMonth2PositiveLivingChoice", {
        is: "yes",
        then: yup.date().required("Date is required"),
      }),

    maMonth2LiteracyTreatmentChoice: yup.string(),
    maMonth2LiteracyTreatmentDate: yup
      .date()
      .when("maMonth2LiteracyTreatmentChoice", {
        is: "yes",
        then: yup.date().required("Date is required"),
      }),

    maMonth2AdolescentsParticipationChoice: yup.string(),
    maMonth2AdolescentsParticipationDate: yup
      .date()
      .when("maMonth2AdolescentsParticipationChoice", {
        is: "yes",
        then: yup.date().required("Date is required"),
      }),

    maMonth2leadershipTrainingChoice: yup.string(),
    maMonth2leadershipTrainingDate: yup
      .date()
      .when("maMonth2leadershipTrainingChoice", {
        is: "yes",
        then: yup.date().required("Date is required"),
      }),

    maMonth2PeerToPeerChoice: yup.string(),
    maMonth2PeerToPeerDate: yup.date().when("maMonth2PeerToPeerChoice", {
      is: "yes",
      then: yup.date().required("Date is required"),
    }),

    maMonth2RoleOfOtzChoice: yup.string(),
    maMonth2RoleOfOtzDate: yup.date().when("maMonth2RoleOfOtzChoice", {
      is: "yes",
      then: yup.date().required("Date is required"),
    }),

    maMonth2OtzChampionOrientationChoice: yup.string(),
    maMonth2OtzChampionOrientationDate: yup
      .date()
      .when("maMonth2OtzChampionOrientationChoice", {
        is: "yes",
        then: yup.date().required("Date is required"),
      }),

    maMonth3PositiveLivingChoice: yup.string(),
    maMonth3PositiveLivingDate: yup
      .date()
      .when("maMonth3PositiveLivingChoice", {
        is: "yes",
        then: yup.date().required("Date is required"),
      }),

    maMonth3LiteracyTreatmentChoice: yup.string(),
    maMonth3LiteracyTreatmentDate: yup
      .date()
      .when("maMonth3LiteracyTreatmentChoice", {
        is: "yes",
        then: yup.date().required("Date is required"),
      }),

    maMonth3AdolescentsParticipationChoice: yup.string(),
    maMonth3AdolescentsParticipationDate: yup
      .date()
      .when("maMonth3AdolescentsParticipationChoice", {
        is: "yes",
        then: yup.date().required("Date is required"),
      }),

    maMonth3leadershipTrainingChoice: yup.string(),
    maMonth3leadershipTrainingDate: yup
      .date()
      .when("maMonth3leadershipTrainingChoice", {
        is: "yes",
        then: yup.date().required("Date is required"),
      }),

    maMonth3PeerToPeerChoice: yup.string(),
    maMonth3PeerToPeerDate: yup
      .date()
      .when("questmaMonth3PeerToPeerChoiceion", {
        is: "yes",
        then: yup.date().required("Date is required"),
      }),

    maMonth3RoleOfOtzChoice: yup.string(),
    maMonth3RoleOfOtzDate: yup.date().when("maMonth3RoleOfOtzChoice", {
      is: "yes",
      then: yup.date().required("Date is required"),
    }),

    maMonth3OtzChampionOrientationChoice: yup.string(),
    maMonth3OtzChampionOrientationDate: yup
      .date()
      .when("maMonth3OtzChampionOrientationChoice", {
        is: "yes",
        then: yup.date().required("Date is required"),
      }),

    sixMonthsResult: yup.string(),
    sixMonthsDate: yup.date().when("sixMonthsResult", {
      is: (sixMonthsResult) => sixMonthsResult && sixMonthsResult.trim() !== "",
      then: yup.date().required("Date is required"),
    }),

    twelveMonthsResult: yup.string(),
    twelveMonthsDate: yup.date().when("twelveMonthsResult", {
      is: (twelveMonthsDate) =>
        twelveMonthsDate && twelveMonthsDate.trim() !== "",
      then: yup.date().required("Date is required"),
    }),

    eighteenMonthsResult: yup.string(),
    eighteenMonthsDate: yup.date().when("eighteenMonthsResult", {
      is: (eighteenMonthsResult) =>
        eighteenMonthsResult && eighteenMonthsResult.trim() !== "",
      then: yup.date().required("Date is required"),
    }),

    twentyFourMonthsResult: yup.string(),
    twentyFourMonthsDate: yup.date().when("twentyFourMonthsResult", {
      is: (twentyFourMonthsResult) =>
        twentyFourMonthsResult && twentyFourMonthsResult.trim() !== "",
      then: yup.date().required("Date is required"),
    }),

    thirtyMonthsResult: yup.string(),
    thirtyMonthsDate: yup.date().when("thirtyMonthsResult", {
      is: (thirtyMonthsResult) =>
        thirtyMonthsResult && thirtyMonthsResult.trim() !== "",
      then: yup.date().required("Date is required"),
    }),

    thirtySixMonthsResult: yup.string(),
    thirtySixMonthsDate: yup.date().when("thirtySixMonthsResult", {
      is: (thirtySixMonthsResult) =>
        thirtySixMonthsResult && thirtySixMonthsResult.trim() !== "",
      then: yup.date().required("Date is required"),
    }),

    outcomes: yup.number("Wrong field type").required("This field is required"),
    exitedOtz: yup.string(),
    transitionDate: yup.date(),

    viralLoadOnOtzExit: yup.string(),
    dateOfAssessmentDone: yup.string(),
    exitedByName: yup.string().matches(/^[^0-9]*$/, "Numbers are not allowed"),
    exitedByDesignation: yup.string().matches(/^[^0-9]*$/, "Numbers are not allowed"),
    exitedByDate: yup.date(),
    exitedBySignature: yup.string().matches(/^[^0-9]*$/, "Numbers are not allowed"),
  });

  const formik = useFormik({
    initialValues: serviceFormInitialValues,
    onSubmit,
    validationSchema: ServiceFormValidationSchema,
  });
  return { formik };
};
