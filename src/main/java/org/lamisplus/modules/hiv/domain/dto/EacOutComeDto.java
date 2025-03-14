package org.lamisplus.modules.hiv.domain.dto;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.hibernate.annotations.Type;

import javax.persistence.Column;
import java.io.Serializable;
import java.time.LocalDate;

/**
 * A DTO for the {@link org.lamisplus.modules.hiv.domain.entity.EacOutCome} entity
 */
@Data
@Builder
@AllArgsConstructor
public class EacOutComeDto implements Serializable {
	private final Long id;
	private final Long eacId;
	private final Long personId;
	private final Long visitId;
	private final Double repeatViralLoader;
	private final String outcome;
	private final String plan;
	private final String currentRegimen;
	private final String switchRegimen;
	private final  LocalDate outComeDate;
	@Type(type = "jsonb")
	@Column(columnDefinition = "jsonb")
	private JsonNode planAction;
	private final String substituteRegimen;
}