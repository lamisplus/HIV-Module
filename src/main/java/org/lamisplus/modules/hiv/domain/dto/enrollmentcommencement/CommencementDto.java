package org.lamisplus.modules.hiv.domain.dto.enrollmentcommencement;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CommencementDto {

    @JsonProperty("visit_date")
    private String visitDate;

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
    private Long regimenLineId;

    @JsonProperty("first_art_regimen")
    private Long firstArtRegimen;

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

    @JsonProperty("is_breast_feeding")
    private String isBreastFeeding;

    @JsonProperty("tb_preventive_therapy")
    private TbPreventiveTherapyDto tbPreventiveTherapy;

    @JsonProperty("has_ovc_information")
    private Boolean hasOvcInformation;

    @JsonProperty("ovc_data")
    private OvcDataDto ovcData;
}
