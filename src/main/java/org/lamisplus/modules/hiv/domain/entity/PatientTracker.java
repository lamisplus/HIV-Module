package org.lamisplus.modules.hiv.domain.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.*;
import org.hibernate.Hibernate;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.Type;
import org.lamisplus.modules.hiv.utility.LocalDateConverter;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.springframework.data.domain.Persistable;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "hiv_patient_tracker")
@Builder(toBuilder = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@DynamicInsert
public class PatientTracker extends HivAuditEntity implements Serializable, Persistable<Long> {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	private Long id;
	private String dsdStatus;
	private String dsdModel;
	private String reasonForTracking;
	private String careInFacilityDiscountinued;
	private String reasonForDiscountinuation;
	@Convert(converter = LocalDateConverter.class)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	@Column(name = "date_of_death")
	private LocalDate dateOfDeath;
	private String biometricStatus;
	private String causeOfDeath;
	private String reasonForLossToFollowUp;
	private String referredFor;
	private String referredForOthers;
	private String reasonForTrackingOthers;
	private String causeOfDeathOthers;
	private String reasonForLossToFollowUpOthers;
	@ManyToOne
	@JoinColumn(name = "status_uuid", referencedColumnName = "uuid")
	private HIVStatusTracker statusTracker;
	private Integer archived;
	@Column(name = "uuid", nullable = false, unique = true, updatable = false)
	private String uuid;
	@Type(type = "jsonb")
	@Column(columnDefinition = "jsonb", name = "attempts")
	private JsonNode attempts;
	private String durationOnART;
	@Convert(converter = LocalDateConverter.class)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate dateLastAppointment;
	@Convert(converter = LocalDateConverter.class)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate dateReturnToCare;
	@Convert(converter = LocalDateConverter.class)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate dateOfDiscontinuation;
	@Convert(converter = LocalDateConverter.class)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate dateMissedAppointment;
	@ManyToOne
	@JoinColumn(name = "person_uuid", referencedColumnName = "uuid", nullable = false)
	private Person person;
	@Column(name = "date_of_observation")
	private LocalDate dateOfObservation;

	// New fields added
	@Convert(converter = LocalDateConverter.class)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	@Column(name = "art_start_date")
	private LocalDate artStartDate;

	@Column(name = "current_arv_regimen")
	private String currentArvRegimen;

	@Column(name = "regimen_at_start_of_art")
	private String regimenAtStartOfArt;

	@Convert(converter = LocalDateConverter.class)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	@Column(name = "next_agreed_clinic_appointment_date")
	private LocalDate nextAgreedClinicAppointmentDate;

	@Convert(converter = LocalDateConverter.class)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	@Column(name = "date_patient_returned")
	private LocalDate datePatientReturned;

	@Column(name = "referred_for_specify")
	private String referredForSpecify;

	@Column(name = "completed_by")
	private String completedBy;

	@Convert(converter = LocalDateConverter.class)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	@Column(name = "date")
	private LocalDate date;

	public boolean isNew() {
		return id == null;
	}
	
	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
		PatientTracker that = (PatientTracker) o;
		return id != null && Objects.equals(id, that.id);
	}
	
	@Override
	public int hashCode() {
		return getClass().hashCode();
	}
}