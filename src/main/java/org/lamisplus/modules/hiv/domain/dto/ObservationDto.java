package org.lamisplus.modules.hiv.domain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import javax.persistence.Basic;
import javax.validation.constraints.PastOrPresent;
import java.io.Serializable;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ObservationDto implements Serializable {
    @PastOrPresent(message = "Observation date cannot be in the future")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateOfObservation;
    @Type(type = "jsonb")
    private JsonNode data;
    private Long facilityId;
    private Long id;
    private Long personId;
    private String type;
    private Long visitId;
    @Basic
    private String source;
    @Basic
    private String longitude;
    @Basic
    private  String latitude;

}
