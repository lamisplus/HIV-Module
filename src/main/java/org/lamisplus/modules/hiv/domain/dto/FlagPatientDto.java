package org.lamisplus.modules.hiv.domain.dto;

import java.time.LocalDate;

public interface FlagPatientDto {

    String getId();
    String getVlSurpression();
    Integer getDaysMissedAppointment();
    String getMissedAppointment();
    LocalDate getNextAppointmentDate();
    Integer getCurrentViralLoadResult();
    Integer getDateDiff();
}
