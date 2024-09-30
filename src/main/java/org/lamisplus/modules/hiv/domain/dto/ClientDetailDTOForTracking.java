package org.lamisplus.modules.hiv.domain.dto;
import java.time.LocalDate;

public interface ClientDetailDTOForTracking {
    String getDsdModel();
    String getDsdStatus();
    Integer getDurationOnArt();
    LocalDate getDateOfMissedScheduleAppointment();
    LocalDate getDateOfLastRefill();
}
