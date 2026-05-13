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

@Entity
@Table(name = "hiv_adherence_preparation")
@Builder(toBuilder = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@EqualsAndHashCode(of = "id")
public class AdherencePreparation extends HivAuditEntity implements Serializable, Persistable<Long> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "uuid", nullable = false, unique = true, updatable = false)
    private String uuid;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "person_uuid", referencedColumnName = "uuid", nullable = false)
    private Person person;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "visit_id", referencedColumnName = "uuid", nullable = false)
    private Visit visit;

    @NotNull
    @Column(name = "service_date", nullable = false)
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate serviceDate;

    @Type(type = "jsonb")
    @Column(columnDefinition = "jsonb", name = "adherence_services", nullable = false)
    private JsonNode adherenceServices;

    @Type(type = "jsonb")
    @Column(columnDefinition = "jsonb", name = "treatment_supporter_data")
    private JsonNode treatmentSupporterData;

    @Column(name = "archived")
    private Integer archived = 0;

    @Column(name = "enrollment_session_uuid")
    private String enrollmentSessionUuid;

    @Override
    public boolean isNew() {
        return id == null;
    }
}
