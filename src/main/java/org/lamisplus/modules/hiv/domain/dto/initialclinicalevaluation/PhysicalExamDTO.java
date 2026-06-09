package org.lamisplus.modules.hiv.domain.dto.initialclinicalevaluation;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class PhysicalExamDTO implements Serializable {

    @Valid
    private BodySystemDTO generalAppearance;

    @Valid
    private BodySystemDTO headEyeEnt;

    @Valid
    private BodySystemDTO cardiovascular;

    @Valid
    private BodySystemDTO respiratory;

    @Valid
    private BodySystemDTO gastrointestinal;

    @Valid
    private BodySystemDTO genitalia;

    @Valid
    private BodySystemDTO breastGlands;

    @Valid
    private BodySystemDTO skin;

    @Valid
    private BodySystemDTO neurological;

    @Valid
    private BodySystemDTO mentalStatus;

    private String additionalFindings;
}
