package org.lamisplus.modules.hiv.domain.entity;

import lombok.*;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.domain.entity.Visit;
import org.springframework.data.domain.Persistable;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.time.LocalDate;

@Entity
@Table(name = "hiv_status_tracker")
@Builder(toBuilder = true)
@Getter
@Setter
@NoArgsConstructor(force = true)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@EqualsAndHashCode(of = "id")
public class HIVStatusTracker extends HivAuditEntity implements Persistable<Long>, Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "hiv_status", nullable = false)
    @NonNull
    private String hivStatus;

    @Column(name = "status_date", nullable = false)
    @NotNull
    private LocalDate statusDate;
    @ManyToOne
    @JoinColumn(name = "person_id", referencedColumnName = "uuid", nullable = false)
    private Person person;
    @ManyToOne
    @JoinColumn(name = "visit_id", referencedColumnName = "uuid")
    private Visit visit;

    @Column(name = "tracking_outcome")
    private String trackOutcome;


    @Column(name = "track_date")
    private LocalDate trackDate;

    @Column(name = "agreed_date")
    private LocalDate agreedDate;

    @Size(max = 100)
    @Column(name = "reason_for_interruption")
    private String reasonForInterruption;
    @Size(max = 100)
    @Column(name = "biometric_status")
    private String biometricStatus;

    @Size(max = 150)
    @Column(name = "CAUSE_OF_DEATH")
    private String causeOfDeath;
    
    
    @Size(max = 200)
    @Column(name = "VA_CAUSE_OF_DEATH")
    private String vaCauseOfDeath;
    
    @Size(max = 200)
    @Column(name = "VA_CAUSE_OF_DEATH_TYPE")
    private String vaCauseOfDeathType;

    private Boolean auto = false;
    
    @Column(name = "uuid", nullable = false, unique = true, updatable = false)
    private String uuid;

    @Basic
    @Column(name = "archived")
    private int archived;

    @Override
    public boolean isNew() {
        return id == null;
    }


}
