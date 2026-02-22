package org.lamisplus.modules.hiv.domain.dto.initialclinicalevaluation;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class InitialClinicalEvaluationDataDTO implements Serializable {

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate visitDate;

    private String clinicianName;

    @Valid
    private List<SymptomDTO> symptoms;

    private String otherSymptom;

    @Valid
    private TbAssessmentDTO tbAssessment;

    private List<String> knownDrugAllergies;

    @Valid
    private PregnancyDTO pregnancy;

    private List<String> currentMeds;

    private List<String> disclosure;

    @Valid
    private ArvSideEffectsDTO arvSideEffects;

    @Valid
    private ArvHistoryDTO arvHistory;

    @Valid
    private VitalsDTO vitals;

    @Valid
    private PhysicalExamDTO physicalExam;

    @Valid
    private AssessmentDTO assessment;
}
