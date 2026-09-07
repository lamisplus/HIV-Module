package org.lamisplus.modules.hiv.domain.dto;

import lombok.Data;

@Data
public class HtsTestResultUpdateRequest {
    private String patientUuid;
    private String result;
    private Long htsEncounterId;
    private String dateOfFinalHivTestDone;
}
