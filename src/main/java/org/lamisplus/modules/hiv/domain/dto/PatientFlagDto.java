package org.lamisplus.modules.hiv.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PatientFlagDto {


    private Long id;
    private Integer surpressionValue;
    private String uuid;
//    private Integer gracePeriod;
//    private String message;
//    private String api;


}
