package org.lamisplus.modules.hiv.domain.entity;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.*;
import org.hibernate.annotations.Type;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.domain.entity.Visit;
import org.lamisplus.modules.triage.domain.entity.VitalSign;
import org.springframework.data.domain.Persistable;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.time.LocalDate;

@Entity
@Table(name = "hiv_art_clinical")
@Builder(toBuilder = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@EqualsAndHashCode(of = "id")
public class ARTClinical extends HivAuditEntity implements Serializable, Persistable<Long> {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	private Long id;

	@Column(name = "visit_date")
	private LocalDate visitDate;
	
	@Column(name = "cd_4")
	private Long cd4;
	
	@Column(name = "cd_4_percentage")
	private Long cd4Percentage;
	
	@Column(name = "is_commencement")
	private Boolean isCommencement;
	
	@Column(name = "functional_status_id")
	private Long functionalStatusId;
	
	private Long clinicalStageId;
	
	@Column(name = "clinical_note")
	private String clinicalNote;
	@Column(name = "uuid", nullable = false, unique = true, updatable = false)
	private String uuid;
	@ManyToOne
	@JoinColumn(name = "hiv_enrollment_uuid", referencedColumnName = "uuid", nullable = false)
	private HivEnrollment hivEnrollment;
	private long regimenId;
	private long regimenTypeId;
	@Column(name = "art_status_id", nullable = false, updatable = false)
	private Long artStatusId;
	@Column(name = "archived")
	private Integer archived;
	@ManyToOne
	@JoinColumn(name = "vital_sign_uuid", referencedColumnName = "uuid", nullable = false)
	private VitalSign vitalSign;
	@Column(name = "who_staging_id")
	private Long whoStagingId;
	@Type(type = "jsonb")
	@Column(name="who", columnDefinition = "jsonb")
	JsonNode who;
	@ManyToOne
	@JoinColumn(name = "person_uuid", referencedColumnName = "uuid", nullable = false)
	private Person person;
	@ManyToOne
	@JoinColumn(name = "visit_id", referencedColumnName = "uuid", nullable = false)
	private Visit visit;
	@Size(max = 5)
	@Column(name = "oi_screened")
	private String oiScreened;
	@Size(max = 50)
	@Column(name = "sti_ids")
	private String stiIds;
	
	@Size(max = 5)
	@Column(name = "sti_treated")
	private String stiTreated;
	
	@Type(type = "jsonb")
	@Column(columnDefinition = "jsonb")
	JsonNode opportunisticInfections;
	
	@Size(max = 5)
	@Column(name = "adr_screened")
	private String adrScreened;
	
	@Type(type = "jsonb")
	@Column(columnDefinition = "jsonb")
	JsonNode adverseDrugReactions;
	
	@Size(max = 15)
	@Column(name = "adherence_level")
	private String adherenceLevel;
	
	@Type(type = "jsonb")
	@Column(columnDefinition = "jsonb")
	JsonNode adheres;
	
	@Column(name = "next_appointment")
	private LocalDate nextAppointment;
	
	@Column(name = "lmp_date")
	private LocalDate lmpDate;
	
	@Type(type = "jsonb")
	@Column(columnDefinition = "jsonb", name = "tb_screen")
	private JsonNode tbScreen;
	
	@Column(name = "is_viral_load_at_start_of_art")
	private Boolean isViralLoadAtStartOfArt;
	
	@Column(name = "viral_load_at_start_of_art")
	private Double viralLoadAtStartOfArt;
	
	@Column(name = "date_of_viral_load_at_start_of_art")
	private LocalDate dateOfViralLoadAtStartOfArt;
	private String cryptococcalScreeningStatus;
	private String cervicalCancerScreeningStatus;
	private String cervicalCancerTreatmentProvided;
	private String hepatitisScreeningResult;
	private String familyPlaning;
	private String onFamilyPlaning;
	private String levelOfAdherence;
	private String tbStatus;
	private String tbPrevention;
	@Type(type = "jsonb")
	@Column(columnDefinition = "jsonb")
	private JsonNode aRVDrugsRegimen;
	@Type(type = "jsonb")
	@Column(columnDefinition = "jsonb")
	private JsonNode viralLoadOrder;
	@Type(type = "jsonb")
	@Column(columnDefinition = "jsonb")
	private JsonNode extra;
	@Column(name = "cd4_count")
	private String  cd4Count;
	@Column(name = "cd4_semi_quantitative")
	private String  cd4SemiQuantitative;
	@Column(name = "cd4_flow_cytometry")
	private Integer  cd4FlowCytometry;
	@Column(name = "pregnancy_status")
	private String  pregnancyStatus;
	@Column(name = "cd4_type")
	private String  cd4Type;
	@Column(name = "reason")
	private String reason;
	@Override
	public boolean isNew() {
		return id == null;
	}
	
	
}