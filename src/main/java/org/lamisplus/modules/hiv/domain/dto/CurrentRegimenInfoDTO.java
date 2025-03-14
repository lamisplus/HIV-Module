package org.lamisplus.modules.hiv.domain.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
@Setter
@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
public class CurrentRegimenInfoDTO {
    @JsonProperty("person_uuid40")
    private String personUuid40;

    @JsonProperty("dsdmodel")
    private String dsdModel;

    @JsonProperty("lastpickupdate")
    private String lastPickupDate;

    @JsonProperty("currentartregimen")
    private String currentArtRegimen;

    @JsonProperty("currentregimenline")
    private String currentRegimenLine;

    @JsonProperty("nextpickupdate")
    private String nextPickupDate;

    @JsonProperty("monthsofarvrefill")
    private BigDecimal monthsOfArvRefill;
}
