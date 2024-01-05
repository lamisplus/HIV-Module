import { useFormik } from "formik";
import * as yup from "yup";

export const usePeadiatricFormValidationSchema = (onSubmit) => {
  const peadiatricFormIntialValues = {
    // facilityName: "",
    childName: "",
    dob: "",
    caregiverName: "",
    sex: "",
    cccNumber: "",
    encounterDate:"",
    dateTask1Executed: "",
    task1HCW: "",
    task1Comments: "",
    task1ChildMetCriteria: "",
    task1ChildAndCaregiverKnowledgeable: "",
    task1CaregiverWilling: "",

    dateTask2Executed: "",
    task2HCW: "",
    task2Comments: "",
    task2FreeFromPhysicalIllness: "",
    task2ChildConsisitentFamilyPeer: "",
    task2ChildDemostrateInEnvAndPlaying: "",
    task2AssessedWhatChildAlreadyKnows: "",
    taskAssessedFunctionalSchoolEngagement: "",
    task2assessedCaregiverReadinessForDisclosureToChild: "",
    task2AssessedCaregiverCommunicatedToChild: "",
    task2DiscussedManagementOfConfidentiality: "",

    dateTask3Executed:"",
    task3HCW:"",
    task3Comments:"",
    task3ReassuredTheCaregiverAndChild: "",
    task3AssessedChildAndCaregiverComfort: "",
    task3AssessedSafety: "",
    task3AssessedTheDepthOfChildKnowledge: "",
    task3SupportedCaregiverToDisclose: "",
    task3ObservedTheImmediateReactionOfChildAndCaregiver: "",
    task3InvitedQuestionsFromChild: "",
    task3RevistedBenefitsOfDisclosureWithChild: "",
    task3ExplainedCareOptionsAvailable: "",
    task3ConcludedSessionWithReassurance: "",


    dateTask4Executed:"",
    task4HCW:"",
    task4Comments:"",

    task4AssessedFunctionalSchoolEngagement: "",
    task4AssessedFamilySocialAndPeerRelationship: "",
    task4AssessedInterestAndEngagementOfChild: "",
    task4AllowedQuestionsFromChild: "",
    task4AddressedNegativeBodyOrSelfImageIssues: "",
    task4AssessedChildForMoodiness: "",
    task4ReferredAppropriately: "",
    task4GivenAppropriateAdherenceInformation: "",
    finalComments: ""

  };

  const PeadiatricFormInitialSchema = yup.object({
    // facilityName: yup.string(),
    childName: yup.string().matches(/^[^0-9]*$/, 'Numbers are not allowed'),
    dob: yup.string(),
    caregiverName: yup.string().matches(/^[^0-9]*$/, 'Numbers are not allowed'),
    sex: yup.string(),
    cccNumber: yup.number(),

    dateTask1Executed: yup.date(),
    task1HCW: yup.string().matches(/^[^0-9]*$/, 'Numbers are not allowed'),
    task1Comments: yup.string(),
    task1ChildMetCriteria: yup.string(),
    task1ChildAndCaregiverKnowledgeable: yup.string(),
    task1CaregiverWilling: yup.string(),
    encounterDate: yup.date(),
    dateTask2Executed: yup.date(),
    task2HCW: yup.string().matches(/^[^0-9]*$/, 'Numbers are not allowed'),
    task2Comments: yup.string(),
    task2FreeFromPhysicalIllness: yup.string(),
    task2ChildConsisitentFamilyPeer: yup.string(),
    task2ChildDemostrateInEnvAndPlaying: yup.string(),
    task2AssessedWhatChildAlreadyKnows: yup.string(),
    taskAssessedFunctionalSchoolEngagement: yup.string(),
    task2assessedCaregiverReadinessForDisclosureToChild: yup.string(),
    task2AssessedCaregiverCommunicatedToChild: yup.string(),
    task2DiscussedManagementOfConfidentiality: yup.string(),

    dateTask3Executed: yup.date(),
    task3HCW: yup.string().matches(/^[^0-9]*$/, 'Numbers are not allowed'),
    task3Comments: yup.string(),
    task3ReassuredTheCaregiverAndChild: yup.string(),
    task3AssessedChildAndCaregiverComfort: yup.string(),
    task3AssessedSafety: yup.string(),
    task3AssessedTheDepthOfChildKnowledge: yup.string(),
    task3SupportedCaregiverToDisclose: yup.string(),
    task3ObservedTheImmediateReactionOfChildAndCaregiver: yup.string(),
    task3InvitedQuestionsFromChild: yup.string(),
    task3RevistedBenefitsOfDisclosureWithChild: yup.string(),
    task3ExplainedCareOptionsAvailable: yup.string(),
    task3ConcludedSessionWithReassurance: yup.string(),


    dateTask4Executed:yup.date(),
    task4HCW:yup.string().matches(/^[^0-9]*$/, 'Numbers are not allowed'),
    task4Comments:yup.string(),
    task4AssessedFunctionalSchoolEngagement: yup.string(),
    task4AssessedFamilySocialAndPeerRelationship: yup.string(),
    task4AssessedInterestAndEngagementOfChild: yup.string(),
    task4AllowedQuestionsFromChild: yup.string(),
    task4AddressedNegativeBodyOrSelfImageIssues: yup.string(),
    task4AssessedChildForMoodiness: yup.string(),
    task4ReferredAppropriately: yup.string(),
    task4GivenAppropriateAdherenceInformation: yup.string(),
    finalComments: yup.string()

    
  });

  const formik = useFormik({
    initialValues:  peadiatricFormIntialValues,
    onSubmit,
    validationSchema: PeadiatricFormInitialSchema,
  });
   return { formik };;
};



