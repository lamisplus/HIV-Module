package org.lamisplus.modules.hiv.domain.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class RegimenRequestDto implements Serializable {
    private Long regimenId;
    private Integer dispense;
    private String regimenName;
    private String prescribed;
    private Integer duration;
    private Integer dosage;
    private String frequency;
}
