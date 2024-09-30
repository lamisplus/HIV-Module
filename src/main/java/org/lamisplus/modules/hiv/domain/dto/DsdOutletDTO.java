package org.lamisplus.modules.hiv.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DsdOutletDTO {
    private Long id;
    private String state;
    private String lga;
    private String name;
    private String outletDsdType;
    private String code;
}
