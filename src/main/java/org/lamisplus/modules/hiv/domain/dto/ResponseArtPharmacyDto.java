package org.lamisplus.modules.hiv.domain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.lamisplus.modules.patient.utility.LocalDateConverter;

import javax.persistence.Convert;
import javax.validation.constraints.Future;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PastOrPresent;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResponseArtPharmacyDto implements Serializable {
    private Long facilityId;
    private Long visitId;
    private Long id;
    private Long personId;
    private Long enrollmentId;
    private JsonNode personGender;
    private String personFirstName;
    private String personSurname;
    private String personOtherName;
    @PastOrPresent
    @NotNull
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate visitDate;
    private Boolean adrScreened;
    private Boolean prescriptionError;
    private Boolean adherence;
    private String mmdType;
    private  String dsdModelType;
    private  String refill ;
    private  String refillType ;
    @Future
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate nextAppointment;
    private JsonNode extra;
    private JsonNode adverseDrugReactions;
    private Set<RegimenDto> regimens;
    private String dispensedByUserUuid;

    @Data
    @AllArgsConstructor
    @Builder
    @NoArgsConstructor
    public static class RegimenDto implements Serializable {
        private Long id;
        @NotNull
        @Size(min = 1, max = 100)
        private String description;
        @NotNull
        @Size(min = 1, max = 100)
        private String composition;
    }
}
