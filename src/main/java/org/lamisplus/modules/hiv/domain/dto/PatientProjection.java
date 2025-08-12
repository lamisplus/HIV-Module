package org.lamisplus.modules.hiv.domain.dto;


import java.time.LocalDate;

public interface PatientProjection {
	String getHospitalNumber();
	String getFirstName();
	String getSurname();
	String getOtherName();
	String getGender();
	String getUniqueId();
	
	String getBiometricStatus();
	String getEnrollmentStatus();
	String getPersonUuid();
	String getCreateBy();
	Boolean getIsEnrolled();
	Boolean getCommenced();
	Boolean getIsDobEstimated();
	Integer getAge();
	Long getId();
	Long getFacility();
	Long getTargetGroupId();
	Long getEnrollmentId();
	LocalDate getDateOfBirth();
	LocalDate getDateOfRegistration();
	String getStatus();
	
	
}
