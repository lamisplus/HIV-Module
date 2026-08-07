package org.lamisplus.modules.hiv.domain.dto;

import java.time.LocalDate;

public interface PEPClientProjection {
    Long getId();
    String getUniqueId();
    String getHospitalNumber();
    String getSurname();
    String getFirstName();
    String getOtherName();
    LocalDate getDateEnrolled();
    LocalDate getDateOfBirth();
    String getPersonUuid();
    Boolean getHasSample();
    Boolean getHasResult();
    String getTestResult();
    Long getHtsEncounterId();

}
