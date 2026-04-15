package org.lamisplus.modules.hiv.domain.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PatientDTO {
	private String hospitalNumber;
	private String surname;
	private String otherName;
	private String firstName;
	private String uniqueId;
	private String sex;
	private String personUuid;
	private String currentStatus;
	private String createBy;
	private boolean clinicalEvaluation;
	private boolean mentalHealth;
	private  Boolean biometricStatus;
	private Boolean isEnrolled;
	private Boolean commenced;
	private Boolean isDobEstimated;
	private Long id;
	private Integer age;
	private Long facilityId;
	private Long targetGroupId;
	private Long enrollmentId;
	private LocalDate dateOfBirth;
	private LocalDate dateOfRegistration;

	private Boolean hasiceform;
	private Boolean hasenrollmentform;
	private String hivTestResult;
	private boolean hasTransferIn;
}
