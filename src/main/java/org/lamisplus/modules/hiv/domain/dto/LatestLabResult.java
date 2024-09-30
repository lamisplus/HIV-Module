package org.lamisplus.modules.hiv.domain.dto;

import java.time.LocalDateTime;

public interface LatestLabResult {
    Long getFacilityId();
    String getFacility();
    String getPatientId();
    String getTest();
    String getResult();
    LocalDateTime getDateReported();
}
