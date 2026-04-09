package org.lamisplus.modules.hiv.domain.dto;

import lombok.Data;
import org.lamisplus.modules.hiv.domain.dto.enrollmentcommencement.EnrollmentCommencementRequestDto;
import org.lamisplus.modules.hiv.domain.dto.initialclinicalevaluation.InitialClinicalEvaluationDTO;
import org.lamisplus.modules.patient.domain.dto.PersonResponseDto;

import java.io.Serializable;
import java.util.List;

@Data
public class HivPatientDto extends PersonResponseDto  implements Serializable {
    private boolean isEnrolled;
    private boolean isCommenced;
    private boolean hasenrollmentform;
    private boolean  hasiceform;
    private boolean isClinicalEvaluation;
    private boolean isMentalHealth;
    private String currentStatus;
    // Updated to use new table structure
    private InitialClinicalEvaluationDTO initialClinicalEvaluation;
    private EnrollmentCommencementRequestDto enrollmentCommencement;
    private PatientTransferInDTO transferIn;
    // Keep old fields for backward compatibility (deprecated)
    @Deprecated
    private HivEnrollmentDTO enrollment;
    @Deprecated
    private ARTClinicalCommenceDto artCommence;
    private List<ARTClinicVisitDto> artClinicVisits;
    private List<ResponseArtPharmacyDto> artPharmacyRefills;
    private  String createBy;
}
