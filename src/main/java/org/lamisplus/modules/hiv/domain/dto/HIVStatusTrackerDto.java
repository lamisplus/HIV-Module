package org.lamisplus.modules.hiv.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PastOrPresent;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HIVStatusTrackerDto implements Serializable {
    private Long facilityId;
    private Long id;
    private String hivStatus;
    @PastOrPresent
    @NotNull
    private LocalDate statusDate;
    @NotNull
    private Long personId;
    @NotNull
    private Long visitId;
    private String trackOutcome;
    @PastOrPresent
    private LocalDate trackDate;
    private LocalDate agreedDate;
    @Size(max = 100)
    private String reasonForInterruption;
    @Size(max = 100)
    private String biometricStatus;
    @Size(max = 100)
    private String causeOfDeath;
    @Size(max = 200)
    private String vaCauseOfDeath;
    @Size(max = 200)
    private String vaCauseOfDeathType;

}
