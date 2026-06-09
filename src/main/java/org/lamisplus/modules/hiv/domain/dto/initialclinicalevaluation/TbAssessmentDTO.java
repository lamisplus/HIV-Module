package org.lamisplus.modules.hiv.domain.dto.initialclinicalevaluation;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class TbAssessmentDTO implements Serializable {
    private String assessedForTb;
    private String tbStatus;
    private String developmentalAssessment;
    private String immunisationComplete;
    private String modeOfInfantFeeding;
    private String pastMedicalHistory;
}
