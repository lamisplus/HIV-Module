package org.lamisplus.modules.hiv.domain.dto;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;
import org.lamisplus.modules.hiv.utility.LocalDateConverter;

import javax.persistence.Convert;
import java.time.LocalDate;


@Data
public class PatientTrackingDto {
	private String dsdStatus;
	private String dsdModel;
	private String reasonForTracking;
	private String careInFacilityDiscountinued;
	private String reasonForDiscountinuation;
	@Convert(converter = LocalDateConverter.class)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate dateOfDeath;
	private String biometricStatus;
	private String causeOfDeath;
	private String reasonForLossToFollowUp;
	private String referredFor;
	private String referredForOthers;
	private String reasonForTrackingOthers;
	private String causeOfDeathOthers;
	private String reasonForLossToFollowUpOthers;
	private JsonNode attempts;
	private String  durationOnART;
	private Long id;
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
	private Long facilityId;
	private Long patientId;
	private HIVStatusTrackerDto  statusTracker;
	private LocalDate dateOfObservation;

	// New fields added
	@Convert(converter = LocalDateConverter.class)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate artStartDate;

	private String currentArvRegimen;
	private String regimenAtStartOfArt;

	@Convert(converter = LocalDateConverter.class)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate nextAgreedClinicAppointmentDate;

	@Convert(converter = LocalDateConverter.class)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate datePatientReturned;

	private String referredForSpecify;
	private String completedBy;

	@Convert(converter = LocalDateConverter.class)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate date;

}
