package org.lamisplus.modules.hiv.domain.dto;

import lombok.Data;

@Data
public class CurrentMedication {
    private String name;
    private String dosage;
    private String dispense;
    private String duration;
    private String frequency;
    private int regimenId;
    private int prescribed;
    private String regimenName;
}
