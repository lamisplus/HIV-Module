package org.lamisplus.modules.hiv.domain.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.lamisplus.modules.hiv.utility.LocalDateConverter;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.springframework.data.domain.Persistable;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDate;

@Entity
@Table(name = "hiv_patient_transfer_in")
@Builder(toBuilder = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@EqualsAndHashCode(of = "id")
public class PatientTransferIn extends HivAuditEntity implements Persistable<Long>, Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @Column(name = "person_id", nullable = false)
    private Long personId;

    @Column(name = "person_uuid")
    private String personUuid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id", insertable = false, updatable = false)
    private Person person;

    @NotNull
    @Column(name = "uuid", nullable = false, unique = true, updatable = false)
    private String uuid;

    @Column(name = "archived")
    private Integer archived = 0;

    @NotNull
    @Column(name = "patient_came_with_transfer_form", nullable = false, length = 10)
    private String patientCameWithTransferForm;

    @NotNull
    @Column(name = "patient_attended_first_visit", nullable = false, length = 10)
    private String patientAttendedFirstVisit;

    @NotNull
    @Column(name = "received_date", nullable = false)
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate receivedDate;

    @NotNull
    @Column(name = "date_of_visit", nullable = false)
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateOfVisit;

    @NotNull
    @Column(name = "clinician_name", nullable = false)
    private String clinicianName;

    @NotNull
    @Column(name = "telephone_number", nullable = false, length = 20)
    private String telephoneNumber;

    @Override
    public boolean isNew() {
        return id == null;
    }

    @PrePersist
    public void prePersist() {
        if (this.archived == null) {
            this.archived = 0;
        }
    }
}
