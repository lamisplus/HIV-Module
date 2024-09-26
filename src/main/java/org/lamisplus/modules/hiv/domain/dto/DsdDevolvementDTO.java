package org.lamisplus.modules.hiv.domain.dto;

import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.Basic;
import javax.persistence.Convert;
import javax.validation.constraints.PastOrPresent;
import org.lamisplus.modules.hiv.utility.LocalDateConverter;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DsdDevolvementDTO implements Serializable {
    private Long facilityId;
    private Long id;
    private Long personId;
    private String viralLoadTestResult;
    private LocalDate viralLoadTestResultDate;
    private String dsdEligible;
    private String dsdAccept;
    private String dsdModel;
    private Integer score;
    private String clientReturnToSite;
    @PastOrPresent
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateReturnToSite;
    private JsonNode serviceProvided;
    private String dsdType;
    private String outletName;
    private String comment;
    private String completedBy;
    private String designation;
    @PastOrPresent
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateDevolved;
    private JsonNode dsdEligibilityAssessment;
    @Basic
    private String source;
    @Basic
    private String longitude;
    @Basic
    private  String latitude;
}
