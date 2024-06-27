export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
<<<<<<< Updated upstream
? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzE5NDIzMTI4fQ.CJZTzGCsQAJWVtIq73m9AjLh6IvY1A8ib7fTALfatyL60o3O68TXOUllre_V-CF8ljjHwr15Fj68SZTDAtq0gQ"  : new URLSearchParams(window.location.search).get("jwt");
=======
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzE5NTEyMjc3fQ.VQ-yr-c9K3SIqNSegJekDe64EDIqg-6Eb3Rn_KVsF-uBz2UkNVbqMKXmF1zH2eKRvlSMiIIbLBVvUt_b9X4jgw"
    : new URLSearchParams(window.location.search).get("jwt");


    /**
     * {
    "durationOnART": "<3months",
    "dsdStatus": "TRACKING_DSD_STATUS_NOT_DEVOLVED",
    "dsdModel": "",
    "reasonForTracking": "REASON_TRACKING_LOST_TO_FOLLOW-UP",
    "dateLastAppointment": "2024-06-12",
    "dateMissedAppointment": "2024-06-12",
    "careInFacilityDiscountinued": "Yes",
    "dateOfDiscontinuation": "2024-06-18",
    "reasonForDiscountinuation": "Death",
    "biometricStatus": "",
    "reasonForLossToFollowUp": "",
    "causeOfDeath": "Natural Cause",
    "dateOfDeath": "2024-06-19",
    "dateReturnToCare": "",
    "referredFor": "",
    "referredForOthers": "",
    "reasonForTrackingOthers": "",
    "causeOfDeathOthers": "rrrrr",
    "reasonForLossToFollowUpOthers": "",
    "attempts": [
        {
            "attemptDate": "2024-06-18",
            "whoAttemptedContact": "3",
            "modeOfConatct": "MODE_OF_COMMUNICATION_HOME_VISIT",
            "personContacted": "PERSON_CONTACTED_GUARDIAN",
            "reasonForDefaulting": "REASON_DEFAULTING_NOT_PERMITTED_TO_LEAVE_WORK",
            "reasonForDefaultingOthers": ""
        }
    ],
    "patientId": 2543,
    "vaCauseOfDeathType": "Neonates Causes",
    "vaCauseOfDeath": "P21 Birth asphyxia",
    "statusTracker": {
        "agreedDate": "",
        "causeOfDeath": "Natural Cause",
        "facilityId": "",
        "hivStatus": "Death",
        "personId": 2543,
        "reasonForInterruption": "Death",
        "biometricStatus": "",
        "statusDate": "2024-06-18",
        "trackDate": "2024-06-18",
        "trackOutcome": "REASON_TRACKING_LOST_TO_FOLLOW-UP",
        "visitId": "",
        "vaCauseOfDeathType": "Neonates Causes",
        "vaCauseOfDeath": "P21 Birth asphyxia"
    },
    "dateOfObservation": "2024-06-12"
}
     */
>>>>>>> Stashed changes
