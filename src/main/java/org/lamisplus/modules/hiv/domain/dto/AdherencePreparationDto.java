package org.lamisplus.modules.hiv.domain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;
import org.lamisplus.modules.hiv.utility.LocalDateConverter;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdherencePreparationDto implements Serializable {

    private Long id;

    private String uuid;

    @NotNull(message = "Person ID is required")
    private Long personId;

    private String visitId;

    private Long artClinicalId;

    @NotNull(message = "Service date is required")
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate serviceDate;

    private Long facilityId;

    @Type(type = "jsonb")
    @Column(columnDefinition = "jsonb")
    private JsonNode adherenceServices;

    @Type(type = "jsonb")
    @Column(columnDefinition = "jsonb")
    private JsonNode treatmentSupporterData;

    private Integer archived;
}
