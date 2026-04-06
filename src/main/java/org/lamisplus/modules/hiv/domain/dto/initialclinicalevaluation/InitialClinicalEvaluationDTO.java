package org.lamisplus.modules.hiv.domain.dto.initialclinicalevaluation;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PastOrPresent;
import java.io.Serializable;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class InitialClinicalEvaluationDTO implements Serializable {

    private Long id;

    @NotNull(message = "Date of observation is required")
    @PastOrPresent(message = "Date of observation cannot be in the future")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateOfObservation;

    @NotNull(message = "Person ID is required")
    private Long personId;

    @Valid
    @NotNull(message = "Data is required")
    private InitialClinicalEvaluationDataDTO data;

    @Valid
    @NotNull(message = "Transfer-in  is required")
    private boolean transferIn;
    // Visit information
    private Long visitId;
    private Long facilityId;
    private String comment;
    private String source;
    private String longitude;
    private String latitude;
}
