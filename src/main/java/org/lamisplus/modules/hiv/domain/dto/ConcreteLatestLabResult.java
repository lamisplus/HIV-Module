package org.lamisplus.modules.hiv.domain.dto;

import java.time.LocalDateTime;

public class ConcreteLatestLabResult implements  LatestLabResult {
    private Long facilityId;
    private String facility;
    private String patientId;
    private String test;
    private String result;
    private LocalDateTime dateReported;


    @Override
    public Long getFacilityId() {
        return facilityId;
    }

    @Override
    public String getFacility() {
        return facility;
    }

    @Override
    public String getPatientId() {
        return patientId;
    }


    @Override
    public String getTest() {
        return test;
    }

    @Override
    public String getResult() {
        return result;
    }


    @Override
    public LocalDateTime getDateReported() {
        return dateReported;
    }
}
