package org.lamisplus.modules.hiv.domain.dto.enrollmentcommencement;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class OvcDataDto {

    @JsonProperty("household_unique_number")
    private String householdUniqueNumber;

    @JsonProperty("ovc_unique_id")
    private String ovcUniqueId;

    @JsonProperty("referred_to_ovc_partner")
    private String referredToOvcPartner;

    @JsonProperty("date_referred_to_ovc_partner")
    private String dateReferredToOvcPartner;

    @JsonProperty("referred_from_ovc_partner")
    private String referredFromOvcPartner;

    @JsonProperty("date_referred_from_ovc_partner")
    private String dateReferredFromOvcPartner;
}
