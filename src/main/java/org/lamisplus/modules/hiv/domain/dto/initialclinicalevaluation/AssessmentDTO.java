package org.lamisplus.modules.hiv.domain.dto.initialclinicalevaluation;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class AssessmentDTO implements Serializable {
    private List<String> assessmentItems;
    private String whoStage;
    private List<String> whoStageCriteria;
    private List<String> enrollInItems;
    private List<String> planForArtItems;
    private String drugsInRegimen;
    private String additionalComments;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate nextAppointment;
}
