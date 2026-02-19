package org.lamisplus.modules.hiv.domain.dto.enrollmentcommencement;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class RegistrationDto {

    @JsonProperty("unique_id_no")
    private String uniqueIdNo;             // patient's hospital unique ID number

    @JsonProperty("date_enrolled_in_hiv_care")
    private String dateEnrolledInHivCare;

    @JsonProperty("date_confirmed_hiv_test")
    private String dateConfirmedHivTest;

    @JsonProperty("hiv_test_location")
    private String hivTestLocation;

    @JsonProperty("mode_of_hiv_test")
    private String modeOfHivTest;

    @JsonProperty("care_entry_point")
    private String careEntryPoint;          // "1"–"9" — resolved to ID in service

    @JsonProperty("care_entry_point_other")
    private String careEntryPointOther;

    @JsonProperty("mother_unique_id")
    private String motherUniqueId;

    @JsonProperty("occupation")
    private String occupation;

    @JsonProperty("marital_status")
    private String maritalStatus;

    @JsonProperty("educational_status")
    private String educationalStatus;

    @JsonProperty("next_of_kin")
    private String nextOfKin;

    @JsonProperty("next_of_kin_relationship")
    private String nextOfKinRelationship;

    @JsonProperty("next_of_kin_telephone")
    private String nextOfKinTelephone;

    @JsonProperty("prior_art")
    private String priorArt;               // "1"–"4"

    @JsonProperty("is_kp")
    private String isKp;                   // "Yes" | "No"

    @JsonProperty("kp_typology")
    private String kpTypology;

    @JsonProperty("date_transferred_in")
    private String dateTransferredIn;

    @JsonProperty("facility_transferred_from")
    private String facilityTransferredFrom;
}
