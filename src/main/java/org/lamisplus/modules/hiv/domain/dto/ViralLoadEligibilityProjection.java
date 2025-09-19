package org.lamisplus.modules.hiv.domain.dto;

import java.time.LocalDate;

public interface ViralLoadEligibilityProjection {
    Long getPatientId();
    String getPatientUuid();
    String getFirstName();
    String getLastName();
    String getOtherName();
    String getGender();
    LocalDate getDateOfBirth();
    String getHospitalNumber();
    LocalDate getArtStartDate();
    Boolean getVlEligibilityStatus();
}