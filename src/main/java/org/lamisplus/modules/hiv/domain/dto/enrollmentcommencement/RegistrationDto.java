package org.lamisplus.modules.hiv.domain.dto.enrollmentcommencement;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import javax.persistence.Column;

@Data
public class RegistrationDto {

    @JsonProperty("unique_id")
    private String uniqueId;

    @JsonProperty("date_enrolled_in_hiv_care")
    private String dateEnrolledInHivCare;

    @JsonProperty("date_confirmed_hiv_test")
    private String dateConfirmedHivTest;

    @JsonProperty("status_at_registration_id")
    private Long statusAtRegistrationId;

    @JsonProperty("hiv_test_location")
    private String hivTestLocation;

    @JsonProperty("mode_of_hiv_test")
    private String modeOfHivTest;

    @JsonProperty("enrollment_setting")
    private String enrollmentSetting;

    @JsonProperty("care_entry_point")
    private String careEntryPoint;

    @JsonProperty("care_entry_point_other")
    private String careEntryPointOther;

    @JsonProperty("mother_unique_id")
    private String motherUniqueId;

    @JsonProperty("prior_art")
    private String priorArt;

    @JsonProperty("is_kp")
    private String isKp;

    @JsonProperty("kp_typology")
    private String kpTypology;

    @JsonProperty("date_transferred_in")
    private String dateTransferredIn;

    @JsonProperty("facility_transferred_from")
    private String facilityTransferredFrom;
}
