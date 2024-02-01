package org.lamisplus.modules.hiv.domain.dto;

public class ConcreteMedicationInfo implements MedicationInfo {
    private String regimenName;
    private String dosage;
    private String prescribed;
    private String dispense;
    private String duration;
    private String frequency;

    @Override
    public String getRegimenName() {
        return regimenName;
    }

    @Override
    public String getDosage() {
        return dosage;
    }

    @Override
    public String getPrescribed() {
        return prescribed;
    }

    @Override
    public String getDispense() {
        return dispense;
    }

    @Override
    public String getDuration() {
        return duration;
    }

    @Override
    public String getFrequency() {
        return frequency;
    }
}