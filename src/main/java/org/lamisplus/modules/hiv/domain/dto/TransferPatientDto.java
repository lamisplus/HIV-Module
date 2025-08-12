package org.lamisplus.modules.hiv.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransferPatientDto {
    private String Id;
    private Long patientId;
    private String personUuid;
    private Long facilityId;
    private String currentStatus;
    private String facilityName;
    private String lga;
    private String state;
    private String lgaTransferTo;
    private String stateTransferTo;
    private String facilityTransferTo;
    private Double weight;
    private Double height;
    private String pregnancyStatus;
    private String dateConfirmedHiv;
    private String dateEnrolledInCare;
    private String dateEnrolledInTreatment;
    private String adherenceLevel;
    private String currentWhoClinical;
    private String currentCD4Count;
    private Integer baselineCD4;
    private Integer viralLoad;
    private String currentRegimenLine;
    private String firstLineArtRegimen;
    private Long hivStatusId;
    private String hivStatus;
    private String gaInWeeks;
    private String bmi;
    private String clinicalNote;
    private String modeOfHIVTest;
    private List<ConcreteMedicationInfo> currentMedication;
    private List<ConcreteLabReport> labResult;
    private String reasonForTransfer;
    private String nameOfTreatmentSupporter;
    private String contactAddressOfTreatmentSupporter;
    private String phoneNumberOfTreatmentSupporter;
    private String relationshipWithClients;
    private String recommendations;
    private String cliniciansName;
    private String dateOfClinicVisitAtTransferringSite;
    private String dateOfFirstConfirmedScheduleApp;
    private String personEffectingTheTransfer;
    private String acknowlegdeReceiveDate;
    private String acknowlegdeTelephoneNumber;
    private String acknowledgementReceivedDate;
    private String nameOfClinicianReceivingTheTransfer;
    private String clinicianTelephoneNumber;
    private String patientCameWithTransferForm;
    private String patientAttendedHerFirstVisit;
    private String encounterDate;
}