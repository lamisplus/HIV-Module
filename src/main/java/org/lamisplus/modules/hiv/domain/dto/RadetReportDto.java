package org.lamisplus.modules.hiv.domain.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

public interface RadetReportDto {
	
	String getState();
	
	String getLga();
	
	String getFacilityName();
	
	String getDatimId();
	
	String getPersonUuid();
	
	String getHospitalNumber();
	
	Date getDateOfBirth();
	
	Integer getAge();
	
	String getGender();
	
	String getTargetGroup();
	
	String getEnrollmentSetting();
	
	Date getArtStartDate();
	
	String getRegimenAtStart();
	
	String getRegimenLineAtStart();
	
	//cc
	String getPregnancyStatus();
	
	String getCurrentClinicalStage();
	
	Double getCurrentWeight();
	
	
	//vl
	String getViralLoadIndication();
	
	LocalDateTime getDateOfViralLoadSampleCollection();
	
	String getCurrentViralLoad();
	
	LocalDateTime getDateOfCurrentViralLoad();
	
	//cd4
	String getLastCd4Count();
	
	LocalDateTime getDateOfLastCd4Count();
	
	//Refill
	String getCurrentRegimenLine();
	
	String getCurrentARTRegimen();
	
	Integer getMonthsOfARVRefill();
	
	LocalDate getLastPickupDate();
	
	LocalDate getNextPickupDate();
	
	// art status
	
	LocalDate getCurrentStatusDate();
	
	String getCurrentStatus();
	
	LocalDate getPreviousStatusDate();
	
	String getPreviousStatus();
	
	
	
	//Biometric status
	LocalDate getDateBiometricsEnrolled();
	
	Integer getNumberOfFingersCaptured();
	
	//eac
	LocalDate getDateOfCommencementOfEAC();
	Integer getNumberOfEACSessionCompleted();
	LocalDate	getDateOfLastEACSessionCompleted();
	LocalDate getDateOfExtendEACCompletion();
	LocalDateTime getDateOfRepeatViralLoadResult();
	LocalDateTime getDateOfRepeatViralLoadEACSampleCollection();
	String getRepeatViralLoadResult();
	String getTbStatus();
	LocalDate getDateOfTbScreened();
	LocalDate getDateOfCurrentRegimen();
	LocalDate getDateOfIptStart();
	LocalDate getIptCompletionDate();
	String getIptType();
	String getResultOfCervicalCancerScreening();
	String getCervicalCancerScreeningType();
	
	String getCervicalCancerScreeningMethod();
	LocalDate getDateOfCervicalCancerScreening();
	String getOvcNumber();
	String  getHouseholdNumber();
	
	String getCareEntry();
	
	String getCauseOfDeath();
		
	
}
	
