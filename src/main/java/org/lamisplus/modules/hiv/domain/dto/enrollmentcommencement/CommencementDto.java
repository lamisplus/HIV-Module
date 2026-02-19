package org.lamisplus.modules.hiv.domain.dto.enrollmentcommencement;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CommencementDto {

    @JsonProperty("clinical_stage_at_art_start")
    private String clinicalStageAtArtStart;   // "Stage 1"–"Stage 4" — resolved to ID in service

    @JsonProperty("cd4_at_art_start")
    private String cd4AtArtStart;             // numeric string — cast to Long in service

    @JsonProperty("cd4_lf")
    private String cd4Lf;                     // "<200" | ">=200"

    @JsonProperty("date_adherence_counseling_completed")
    private String dateAdherenceCounselingCompleted;

    @JsonProperty("date_art_started")
    private String dateArtStarted;

    @JsonProperty("first_art_regimen")
    private String firstArtRegimen;           // regimen name — resolved to ID in service

    @JsonProperty("weight_kg")
    private String weightKg;

    @JsonProperty("height_cm")
    private String heightCm;

    @JsonProperty("bmi")
    private String bmi;                       // pre-calculated by frontend

    @JsonProperty("muac")
    private String muac;                      // pediatric only

    @JsonProperty("muac_indication")
    private String muacIndication;            // auto-derived on frontend

    @JsonProperty("pregnancy_status")
    private String pregnancyStatus;           // adult females only

    @JsonProperty("tb_preventive_therapy")
    private TbPreventiveTherapyDto tbPreventiveTherapy;
}
