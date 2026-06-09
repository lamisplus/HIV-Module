package org.lamisplus.modules.hiv.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Generic DTO for checking if a form exists for a patient
 * Used for one-time forms like ICE, Enrollment, etc.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FormExistsResponseDto implements Serializable {

    private boolean exists;
    private String formType;
    private Long formId;
    private String message;

    /**
     * Simple constructor for when we only need to know if form exists
     */
    public FormExistsResponseDto(boolean exists) {
        this.exists = exists;
    }

    /**
     * Constructor with message
     */
    public FormExistsResponseDto(boolean exists, String message) {
        this.exists = exists;
        this.message = message;
    }
}
