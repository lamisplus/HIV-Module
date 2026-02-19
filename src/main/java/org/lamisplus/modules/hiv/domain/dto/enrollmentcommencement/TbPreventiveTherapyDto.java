package org.lamisplus.modules.hiv.domain.dto.enrollmentcommencement;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class TbPreventiveTherapyDto {

    @JsonProperty("medication")
    private String medication;

    @JsonProperty("code")
    private String code;

    @JsonProperty("dose")
    private String dose;

    @JsonProperty("start_date")
    private String startDate;

    @JsonProperty("completion_date")
    private String completionDate;
}
