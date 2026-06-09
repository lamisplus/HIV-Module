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
public class VitalsDTO implements Serializable {

    private String temperature;
    private String bpSystolic;
    private String bpDiastolic;
    private String pulse;
    private String weight;
    private String height;
    private String headCircumference;
    private String surfaceArea;
    private String bmi;
}
