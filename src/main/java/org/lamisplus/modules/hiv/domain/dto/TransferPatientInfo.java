package org.lamisplus.modules.hiv.domain.dto;

import java.time.LocalDate;
public interface TransferPatientInfo {
    Long getPatientId();
    String getPersonUuid();
    Long getFacilityId();
    Double getWeight();
    Double getHeight();
    String getPregnancyStatus();
    LocalDate getDateConfirmedHiv();
    LocalDate getDateEnrolledInCare();
    LocalDate getDateEnrolledInTreatment();
    String getAdherenceLevel();
    String getCurrentWhoClinical();
    String getCurrentCD4Count();
    Integer getBaselineCD4();
    String getViralLoad();  // Changed from Double to String to handle viral load values
    String getCurrentRegimenLine();
    String getFirstLineArtRegimen();
    Long getHivStatusId();
    String getHivStatus();
}