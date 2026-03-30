package org.lamisplus.modules.hiv.domain.dto.enrollmentcommencement;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CommencementDto {

    @JsonProperty("clinical_stage_at_art_start")
    private String clinicalStageAtArtStart;

    @JsonProperty("cd4_at_art_start")
    private String cd4AtArtStart;

    @JsonProperty("cd4_percentage")
    private String cd4Percentage;

    @JsonProperty("cd4_lf")
    private String cd4Lf;

    @JsonProperty("date_adherence_counseling_completed")
    private String dateAdherenceCounselingCompleted;

    @JsonProperty("date_art_started")
    private String dateArtStarted;

    @JsonProperty("regimen_line_id")
    private String regimenLineId;

    @JsonProperty("first_art_regimen")
    private String firstArtRegimen;

    @JsonProperty("weight_kg")
    private String weightKg;

    @JsonProperty("height_cm")
    private String heightCm;

    @JsonProperty("bmi")
    private String bmi;

    @JsonProperty("muac")
    private String muac;

    @JsonProperty("muac_indication")
    private String muacIndication;

    @JsonProperty("is_pregnant")
    private String isPregnant;

    @JsonProperty("pregnancy_status")
    private String pregnancyStatus;

    @JsonProperty("tb_preventive_therapy")
    private TbPreventiveTherapyDto tbPreventiveTherapy;
}
