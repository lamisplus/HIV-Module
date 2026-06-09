package org.lamisplus.modules.hiv.domain.dto.enrollmentcommencement;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class TbPreventiveTherapyDto {

    @JsonProperty("medication")
    private Long medication;

    @JsonProperty("dose")
    private String dose;

    @JsonProperty("start_date")
    private String startDate;

    @JsonProperty("tpt_completed")
    private String tptCompleted;

    @JsonProperty("completion_date")
    private String completionDate;
}
