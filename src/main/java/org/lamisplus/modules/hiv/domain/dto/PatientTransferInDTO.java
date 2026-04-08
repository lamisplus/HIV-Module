package org.lamisplus.modules.hiv.domain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class PatientTransferInDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    @NotNull(message = "Person ID is required")
    private Long personId;

    private String personUuid;

    private String uuid;

    private Integer archived;

    @NotBlank(message = "Patient came with transfer form field is required")
    private String patientCameWithTransferForm;

    @NotBlank(message = "Patient attended first visit field is required")
    private String patientAttendedFirstVisit;

    @NotNull(message = "Received date is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate receivedDate;

    @NotNull(message = "Date of visit is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateOfVisit;

    @NotBlank(message = "Clinician name is required")
    private String clinicianName;

    @NotBlank(message = "Telephone number is required")
    private String telephoneNumber;

    private Long facilityId;

    private LocalDateTime createdDate;

    private String createdBy;

    private LocalDateTime lastModifiedDate;

    private String lastModifiedBy;
}
