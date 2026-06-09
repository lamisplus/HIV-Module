package org.lamisplus.modules.hiv.domain.dto;

import java.time.LocalDate;

public interface TBCompletionStatusDTO {
   Boolean getPass6Month();
   LocalDate getTbTreatmentStartDate();
   LocalDate getVisitDate();
   Boolean getShowPrompt();
}
