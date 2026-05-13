package org.lamisplus.modules.hiv.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * DTO representing the enrollment cycle status for a patient
 * Used to determine which menu items should be visible in the frontend
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrollmentCycleStatusDto implements Serializable {

    /**
     * The current enrollment session UUID (null if no active cycle)
     */
    private String currentEnrollmentSessionUuid;

    /**
     * Whether AdherencePreparation has been completed for current cycle
     */
    private boolean hasAdherencePreparation;

    /**
     * Whether Initial Clinical Evaluation (ICE) has been completed for current cycle
     */
    private boolean hasInitialClinicalEvaluation;

    /**
     * Whether Enrollment & Commencement has been completed for current cycle
     */
    private boolean hasEnrollmentCommencement;

    /**
     * Whether the current enrollment cycle is complete (all three forms done)
     */
    private boolean isEnrollmentCycleComplete;

    /**
     * The next form that should be filled in the enrollment sequence
     * Possible values: "AdherencePreparation", "ICE", "Enrollment", "Complete"
     */
    private String nextRequiredForm;

    /**
     * Entry point for current enrollment cycle
     * Possible values: "Part1A_PositiveHTS", "Part1B_TransferIn", "Part2_ReturningClient", "Unknown"
     */
    private String entryPoint;
}
