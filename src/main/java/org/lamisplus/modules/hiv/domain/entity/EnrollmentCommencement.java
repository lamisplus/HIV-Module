package org.lamisplus.modules.hiv.domain.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.lamisplus.modules.hiv.utility.LocalDateConverter;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.domain.entity.Visit;
import org.springframework.data.domain.Persistable;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;

@Entity
@Table(name = "enrollment_commencement")
@Builder(toBuilder = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@EqualsAndHashCode(of = "id")
public class EnrollmentCommencement extends HivAuditEntity implements Persistable<Long>, Serializable {

    // ── Infrastructure ────────────────────────────────────────────────────────
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "uuid", nullable = false, unique = true, updatable = false)
    private String uuid;

    @Column(name = "unique_id_no")
    private String uniqueIdNo;

    @OneToOne
    @JoinColumn(name = "person_uuid", referencedColumnName = "uuid", nullable = false)
    private Person person;

    @ManyToOne
    @JoinColumn(name = "visit_id", referencedColumnName = "uuid", nullable = false)
    private Visit visit;

    @Column(name = "vital_sign_uuid")
    private String vitalSignUuid;

    @Column(name = "is_commencement")
    private Boolean isCommencement;

    @Column(name = "art_status_id")
    private Long artStatusId;

    @Column(name = "status_at_registration_id")
    private Long statusAtRegistrationId;

    @Column(name = "source")
    private String source;

    @Column(name = "latitude")
    private String latitude;

    @Column(name = "longitude")
    private String longitude;

    @Column(name = "archived")
    private Integer archived;

    // ── Registration — HIV Care & Identification ──────────────────────────────
    @Column(name = "date_enrolled_in_hiv_care", nullable = false)
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateEnrolledInHivCare;

    @Column(name = "date_confirmed_hiv_test")
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateConfirmedHivTest;

    @Column(name = "hiv_test_location")
    private String hivTestLocation;

    @Column(name = "mode_of_hiv_test")
    private String modeOfHivTest;

    @Column(name = "care_entry_point_id")
    private Long careEntryPointId;

    @Column(name = "care_entry_point_other")
    private String careEntryPointOther;

    @Column(name = "mother_unique_id")
    private String motherUniqueId;

    // ── Registration — Demographics ───────────────────────────────────────────
    @Column(name = "occupation")
    private String occupation;

    @Column(name = "marital_status")
    private String maritalStatus;

    @Column(name = "educational_level")
    private String educationalLevel;

    // ── Registration — Next of Kin ────────────────────────────────────────────
    @Column(name = "nok_name")
    private String nokName;

    @Column(name = "nok_relationship")
    private String nokRelationship;

    @Column(name = "nok_telephone")
    private String nokTelephone;

    // ── Registration — Prior ART & Key Population ─────────────────────────────
    @Column(name = "prior_art_code")
    private String priorArtCode;

    @Column(name = "is_kp")
    private Boolean isKp;

    @Column(name = "kp_typology")
    private String kpTypology;

    // ── Registration — Transfer Details ──────────────────────────────────────
    @Column(name = "date_transferred_in")
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateTransferredIn;

    @Column(name = "facility_transferred_from")
    private String facilityTransferredFrom;

    // ── Commencement — Clinical Status ────────────────────────────────────────
    @Column(name = "clinical_stage_id")
    private Long clinicalStageId;

    @Column(name = "cd4_at_art_start")
    private Long cd4AtArtStart;

    @Column(name = "cd4_lf")
    private String cd4Lf;

    // ── Commencement — ART Dates & Regimen ───────────────────────────────────
    @Column(name = "date_adherence_counseling_completed")
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateAdherenceCounselingCompleted;

    @Column(name = "date_art_started", nullable = false)
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateArtStarted;

    @Column(name = "regimen_id")
    private Long regimenId;

    // ── Commencement — Vitals ─────────────────────────────────────────────────
    @Column(name = "weight_kg")
    private Double weightKg;

    @Column(name = "height_cm")
    private Double heightCm;

    @Column(name = "bmi")
    private Double bmi;

    @Column(name = "muac")
    private Double muac;

    @Column(name = "muac_indication")
    private String muacIndication;

    @Column(name = "pregnancy_status")
    private String pregnancyStatus;

    // ── Commencement — TB Preventive Therapy ─────────────────────────────────
    @Column(name = "tpt_medication")
    private String tptMedication;

    @Column(name = "tpt_code")
    private String tptCode;

    @Column(name = "tpt_dose")
    private String tptDose;

    @Column(name = "tpt_start_date")
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate tptStartDate;

    @Column(name = "tpt_completion_date")
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate tptCompletionDate;

    @Override
    public boolean isNew() {
        return id == null;
    }
}
