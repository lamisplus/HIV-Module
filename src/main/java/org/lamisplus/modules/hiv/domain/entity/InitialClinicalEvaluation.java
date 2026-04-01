package org.lamisplus.modules.hiv.domain.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.*;
import org.hibernate.annotations.Type;
import org.lamisplus.modules.hiv.utility.LocalDateConverter;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.domain.entity.Visit;
import org.springframework.data.domain.Persistable;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDate;

/**
 * Entity for Initial Clinical Evaluation (ICE) - One-off form
 * This table stores BOTH:
 * 1. Old "Clinical evaluation" records migrated from hiv_observation
 * 2. New "Initial Clinical evaluation" records with structured regimen fields
 */
@Entity
@Table(name = "hiv_initial_clinical_evaluation")
@Builder(toBuilder = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@EqualsAndHashCode(of = "id")
public class InitialClinicalEvaluation extends HivAuditEntity implements Persistable<Long>, Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @Column(name = "person_id", nullable = false)
    private Long personId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id", insertable = false, updatable = false)
    private Person person;

    @Column(name = "visit_id")
    private Long visitId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "visit_id", insertable = false, updatable = false)
    private Visit visit;

    @NotNull
    @Column(name = "uuid", nullable = false, unique = true, updatable = false)
    private String uuid;

    @Column(name = "archived")
    private Integer archived = 0;

    // ========================================================================
    // Basic ICE Fields
    // ========================================================================

    @NotNull
    @Column(name = "visit_date", nullable = false)
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate visitDate;

    @Column(name = "clinician_name")
    private String clinicianName;

    // ========================================================================
    // Regimen Fields (Structured columns)
    // These are extracted from JSONB for better querying
    // Old format: data.regimen.regimen & data.regimen.regimenLine
    // New format: data.assessment.regimenId & data.assessment.regimenLineId
    // Note: Using VARCHAR to match enrollment_commencement table structure
    // ========================================================================

    @Column(name = "regimen_line_id", length = 255)
    private String regimenLineId;

    @Column(name = "regimen_id", length = 255)
    private String regimenId;

    // ========================================================================
    // WHO Staging
    // Old format: data.who.stage
    // New format: data.assessment.whoStage
    // ========================================================================

    @Column(name = "who_stage_id")
    private Long whoStageId;

    // ========================================================================
    // Complex Nested Data (JSONB)
    // These remain as JSONB for flexibility and to preserve all data
    // ========================================================================

    @Type(type = "jsonb")
    @Column(name = "symptoms", columnDefinition = "jsonb")
    private JsonNode symptoms;

    @Column(name = "other_symptom", length = 500)
    private String otherSymptom;

    @Type(type = "jsonb")
    @Column(name = "tb_assessment", columnDefinition = "jsonb")
    private JsonNode tbAssessment;

    @Type(type = "jsonb")
    @Column(name = "known_drug_allergies", columnDefinition = "jsonb")
    private JsonNode knownDrugAllergies;

    @Type(type = "jsonb")
    @Column(name = "pregnancy", columnDefinition = "jsonb")
    private JsonNode pregnancy;

    @Type(type = "jsonb")
    @Column(name = "current_medications", columnDefinition = "jsonb")
    private JsonNode currentMedications;

    @Type(type = "jsonb")
    @Column(name = "disclosure", columnDefinition = "jsonb")
    private JsonNode disclosure;

    @Column(name = "disclosure_other_text", length = 500)
    private String disclosureOtherText;

    @Type(type = "jsonb")
    @Column(name = "arv_side_effects", columnDefinition = "jsonb")
    private JsonNode arvSideEffects;

    @Type(type = "jsonb")
    @Column(name = "arv_history", columnDefinition = "jsonb")
    private JsonNode arvHistory;

    @Type(type = "jsonb")
    @Column(name = "vitals", columnDefinition = "jsonb")
    private JsonNode vitals;

    @Type(type = "jsonb")
    @Column(name = "physical_exam", columnDefinition = "jsonb")
    private JsonNode physicalExam;

    @Type(type = "jsonb")
    @Column(name = "assessment", columnDefinition = "jsonb")
    private JsonNode assessment;

    @Column(name = "next_appointment")
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate nextAppointment;

    // ========================================================================
    // Metadata
    // ========================================================================

    @Column(name = "source")
    private String source;

    @Column(name = "latitude")
    private String latitude;

    @Column(name = "longitude")
    private String longitude;

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    // ========================================================================
    // Persistable Implementation
    // ========================================================================

    @Override
    public boolean isNew() {
        return id == null;
    }

    // ========================================================================
    // Helper Methods
    // ========================================================================

    @PrePersist
    public void prePersist() {
        if (this.archived == null) {
            this.archived = 0;
        }
    }
}
