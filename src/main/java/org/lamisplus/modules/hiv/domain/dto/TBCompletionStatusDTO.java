package org.lamisplus.modules.hiv.domain.dto;

import java.time.LocalDate;

public interface TBCompletionStatusDTO {
   boolean getPass6Month();
   LocalDate getTbTreatmentStartDate();
   LocalDate getVisitDate();
}
