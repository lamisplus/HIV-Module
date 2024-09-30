package org.lamisplus.modules.hiv.domain.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.lamisplus.modules.hiv.utility.Constants;
import org.lamisplus.modules.hiv.utility.LocalDateConverter;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.domain.entity.Visit;
import org.springframework.data.domain.Persistable;

import javax.persistence.*;
import javax.validation.constraints.PastOrPresent;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.ZonedDateTime;

@Entity
@Table(name = "hiv_enrollment")
@Builder(toBuilder = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@EqualsAndHashCode(of = "id")
public class HivEnrollment extends HivAuditEntity implements Persistable<Long>, Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;
    @Column(name = "unique_id")
    private String uniqueId;
    @Column(name = "entry_point_id")
    private Long entryPointId;
    @Column(name = "target_group_id")
    private Long targetGroupId;
    @Column(name = "date_confirmed_hiv")
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateConfirmedHiv;
    @Column(name = "date_enrolled_pmtct")
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateEnrolledPMTCT;
    @Column(name = "source_of_referrer_id")
    private Long sourceOfReferrerId;
    @Column(name = "time_hiv_diagnosis")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSZ")
    private ZonedDateTime timeHivDiagnosis;
    @Column(name = "pregnant")
    private Boolean pregnant;
    @Column(name = "breastfeeding")
    private Boolean breastfeeding;
    @Column(name = "date_of_registration")
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateOfRegistration;

    @Column(name = "status_at_registration_id")
    private Long statusAtRegistrationId;
    @Column(name = "enrollment_setting_id")

    private Long enrollmentSettingId;
    @Column(name = "date_started")
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateStarted;
    @Column(name = "send_message")
    private Boolean sendMessage;
    @OneToOne
    @JoinColumn(name = "person_uuid", referencedColumnName = "uuid", nullable = false)
    private Person person;

    @ManyToOne
    @JoinColumn(name = "visit_id", referencedColumnName = "uuid", nullable = false)
    private Visit visit;

    @Column(name = "uuid", nullable = false, unique = true, updatable = false)
    private String uuid;
    @Basic
    @Column(name = "archived")
    private int archived;

    @Basic
    @Column(name = "facility_name")
    private String facilityName;
    @Basic
    @Column(name = "ovc_number")
    private String ovcNumber;

    @Basic
    @Column(name = "house_hold_number")
    private String houseHoldNumber;

    @Basic
    @Column(name = "care_entry_point_other")
    private String careEntryPointOther;

    @Basic
    @Column(name = "referred_to_OVCPartner")
    private String referredToOVCPartner;

    @Basic
    @Column(name = "referred_from_OVCPartner")
    private String referredFromOVCPartner;

    @PastOrPresent
    @Column(name = "date_referred_to_OVCPartner")
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateReferredToOVCPartner;

    @Basic
    @Column(name = "date_referred_from_OVCPartner")
    @PastOrPresent
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateReferredFromOVCPartner;

    @Basic
    @Column(name = "date_of_lpm")
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateOfLpm;
    @Basic
    @Column(name = "pregnancy_status_id")
    private Long pregnancyStatusId;

    @Basic
    @Column(name = "tb_status_id")
    private Long tbStatusId;

    @Basic
    @Column(name = "source")
    private String source;

    @Basic
    @Column(name = "longitude")
    private String longitude;

    @Basic
    @Column(name = "latitude")
    private  String latitude;

    @Basic
    @Column(name = "lip_name")
    private String lipName;
    
    @Override
    public boolean isNew() {

        return id == null;
    }


}
