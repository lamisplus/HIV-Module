package org.lamisplus.modules.hiv.service.activity;

import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.lamisplus.modules.hiv.domain.dto.PatientActivity;
import org.lamisplus.modules.hiv.domain.entity.HIVEac;
import org.lamisplus.modules.hiv.repositories.HIVEacRepository;
import org.lamisplus.modules.hiv.service.PatientActivityProvider;
import org.lamisplus.modules.hiv.utility.CustomDateTimeFormat;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class EACActivityProvider implements PatientActivityProvider {
	
	private final HIVEacRepository hivEacRepository;
	
	
	@Override
	public List<PatientActivity> getActivitiesFor(Person person) {
		
		List<HIVEac> hivEacList = hivEacRepository.getAllByPersonAndArchived(person, 0);
		return hivEacList.stream()
				.filter(Objects::nonNull)
				.map(this::buildPatientActivity).collect(Collectors.toList());
		
	}
	
	@NotNull
	private PatientActivity buildPatientActivity(HIVEac e) {
		StringBuilder name = new StringBuilder("EAC");
		assert e.getId() != null;
		LocalDate dateOfLastViralLoad =
				CustomDateTimeFormat.handleNullDateActivity(name, e.getDateOfLastViralLoad());
		return new PatientActivity(e.getId(), name.toString(), dateOfLastViralLoad, "", "eac");
	}
}
