package org.lamisplus.modules.hiv.domain.dto;

import java.time.LocalDateTime;

public class ConcreteLabReport implements LabReport{
    private Long facilityId;
    private String facility;
    private String datimId;
    private String patientId;
    private String hospitalNum;
    private String test;
    private String result;
    private LocalDateTime sampleCollectionDate;
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
    public String getDatimId() {
        return datimId;
    }

    @Override
    public String getPatientId() {
        return patientId;
    }

    @Override
    public String getHospitalNum() {
        return hospitalNum;
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
    public LocalDateTime getSampleCollectionDate() {
        return sampleCollectionDate;
    }

    @Override
    public LocalDateTime getDateReported() {
        return dateReported;
    }
}

