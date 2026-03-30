package org.lamisplus.modules.hiv.domain.dto.enrollmentcommencement;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

@Data
public class EnrollmentCommencementRequestDto {

    @JsonProperty("dateOfObservation")
    private String dateOfObservation;

    @NotNull(message = "Person ID is required")
    @JsonProperty("personId")
    private Long personId;

    @JsonProperty("type")
    private String type;

    @Valid
    @NotNull(message = "Data is required")
    @JsonProperty("data")
    private EnrollmentCommencementData data;

    @Data
    public static class EnrollmentCommencementData {

        @Valid
        @NotNull(message = "Registration data is required")
        @JsonProperty("registration")
        private RegistrationDto registration;

        @Valid
        @NotNull(message = "Commencement data is required")
        @JsonProperty("commencement")
        private CommencementDto commencement;
    }
}
