package org.lamisplus.modules.hiv.domain.dto.enrollmentcommencement;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class EnrollmentCommencementRequestDto {

    @JsonProperty("dateOfObservation")
    private String dateOfObservation;

    @JsonProperty("personId")
    private Long personId;

    @JsonProperty("type")
    private String type;

    @JsonProperty("data")
    private EnrollmentCommencementData data;

    @Data
    public static class EnrollmentCommencementData {

        @JsonProperty("registration")
        private RegistrationDto registration;

        @JsonProperty("commencement")
        private CommencementDto commencement;
    }
}
