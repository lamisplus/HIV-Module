package org.lamisplus.modules.hiv.domain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;
import org.lamisplus.modules.hiv.utility.LocalDateConverter;

import javax.persistence.Basic;
import javax.persistence.Convert;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PastOrPresent;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.ZonedDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HivEnrollmentDTO implements Serializable {
    private Long facilityId;
    private Long id;
    private String uniqueId;
    private Long entryPointId;
    private Long targetGroupId;
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateConfirmedHiv;
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateEnrolledPMTCT;
    private Long sourceOfReferrerId;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSZ")
    private ZonedDateTime timeHivDiagnosis;
    private Boolean pregnant;
    private Boolean breastfeeding;
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateOfRegistration;
    private Long statusAtRegistrationId;
    private Long enrollmentSettingId;
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateStarted;
    private Long personId;
    private String facilityName;
    private String ovcNumber;
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateOfLpm;
    private Long pregnancyStatusId;
    private Long tbStatusId;
    @NotNull
    private Long visitId;

    //new
    private String houseHoldNumber;
    private String careEntryPointOther;
    @Basic
    private String referredToOVCPartner;
    @Basic
    private String referredFromOVCPartner;
    @PastOrPresent
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateReferredToOVCPartner;
    @Basic
    @PastOrPresent
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateReferredFromOVCPartner;
    private String lipName;
    //new Lagos
    @Type(type = "jsonb")
    private JsonNode ovcServiceProvided;
    @Basic
    private String source;
    @Basic
    private String longitude;
    @Basic
    private  String latitude;
}
