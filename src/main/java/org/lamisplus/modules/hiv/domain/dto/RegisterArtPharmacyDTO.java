package org.lamisplus.modules.hiv.domain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.lamisplus.modules.hiv.utility.LocalDateConverter;

import javax.persistence.Basic;
import javax.persistence.Convert;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PastOrPresent;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterArtPharmacyDTO implements Serializable {
    private Long facilityId;
    private Long visitId;
    private Long id;
    private Long personId;
    @NotNull
    @PastOrPresent
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate visitDate;
    private Boolean adrScreened;
    private Boolean prescriptionError;
    private Boolean adherence;
    private String mmdType;
    private Boolean isDevolve;
    private Integer refillPeriod;
    private String deliveryPoint;
    private  String dsdModel;
    private  String dsdModelType;
    private  String refill ;
    private  String refillType ;
    private  String iptType;
    private String visitType;
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate nextAppointment;
    private JsonNode extra;
    private JsonNode adverseDrugReactions;
    private Set<RegimenRequestDto> regimen;
    @Basic
    private String source;
    @Basic
    private String longitude;
    @Basic
    private  String latitude;

}
