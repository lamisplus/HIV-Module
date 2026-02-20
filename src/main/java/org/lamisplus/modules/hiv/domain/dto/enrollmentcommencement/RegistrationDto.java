package org.lamisplus.modules.hiv.domain.dto.enrollmentcommencement;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class RegistrationDto {

    @JsonProperty("unique_id_no")
    private String uniqueIdNo;

    @JsonProperty("date_enrolled_in_hiv_care")
    private String dateEnrolledInHivCare;

    @JsonProperty("date_confirmed_hiv_test")
    private String dateConfirmedHivTest;

    @JsonProperty("hiv_test_location")
    private String hivTestLocation;

    @JsonProperty("mode_of_hiv_test")
    private Long modeOfHivTest;               // Changed from String to Long (codeset ID)

    @JsonProperty("care_entry_point")
    private Long careEntryPoint;              // Changed from String to Long (codeset ID)

    @JsonProperty("care_entry_point_other")
    private String careEntryPointOther;

    @JsonProperty("mother_unique_id")
    private String motherUniqueId;

    @JsonProperty("prior_art")
    private Long priorArt;                    // Changed from String to Long (codeset ID)

    @JsonProperty("is_kp")
    private String isKp;

    @JsonProperty("kp_typology")
    private Long kpTypology;                  // Changed from String to Long (codeset ID)

    @JsonProperty("date_transferred_in")
    private String dateTransferredIn;

    @JsonProperty("facility_transferred_from")
    private String facilityTransferredFrom;
}
