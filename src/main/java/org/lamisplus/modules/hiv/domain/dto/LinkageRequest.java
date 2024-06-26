package org.lamisplus.modules.hiv.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.lamisplus.modules.hiv.domain.dto.YesNo;

import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LinkageRequest {
    private String artNumber;
    // added variables on ovc
    private String arvRegimen;
    private LocalDate dateTested;
    private LocalDate artEnrollmentDate;
    private LocalDate vlTestDate;
    private String vlResult;
    private LocalDate vlResultDate;

    private String lastName;
    private String otherName;
    private String gender;
    private LocalDate birthDate;
    private String facilityState;
    private String facilityLga;
    private String facilityUid;
    private String facilityName;
    private String datimCode;
    private String stateOfResidence;
    private String lgaOfResidence;
    private String entryPoint;
    //recent added entities
    private String offeredOvcFromFacility;
    private String offerAccepted;

    private YesNo shareContactWithOvc;
    private String reasonForDecline;
    private YesNo drugRefillNotification;
    private String phoneNumber;
    private String caregiverSurname;
    private String caregiverOtherName;
    private LocalDate offerDate;
    private LocalDate enrollmentDate;
    private String ovcUniqueId;
    private String householdUniqueId;
    private YesNo enrolledInOvcProgram;
    private int archived;
    private String cboName;
    private String facilityStaffName;

    public LinkageRequest(String artNumber, String ovcUniqueId, String lastName, String otherName) {
        this.artNumber = artNumber;
        this.lastName = lastName;
        this.otherName = otherName;
        this.ovcUniqueId = ovcUniqueId;
    }




}
