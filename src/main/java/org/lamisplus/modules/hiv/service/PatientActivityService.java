package org.lamisplus.modules.hiv.service;

import lombok.RequiredArgsConstructor;
import org.audit4j.core.util.Log;
import org.jetbrains.annotations.NotNull;
import org.lamisplus.modules.base.module.BeanProvider;
import org.lamisplus.modules.hiv.domain.dto.PatientActivity;
import org.lamisplus.modules.hiv.domain.dto.TimelineVm;
import org.lamisplus.modules.hiv.utility.Constants;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.repository.PersonRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class PatientActivityService {
	private final BeanProvider beanProvider;
	private final PersonRepository patientRepository;
	
	private List<PatientActivity> getActivitiesFor(Long patientId) {
		Person person = patientRepository.findById(patientId).orElse(null);
		if (person != null) {
			return beanProvider.getBeansOfType(PatientActivityProvider.class)
					.stream()
					.flatMap(activityProvider -> activityProvider.getActivitiesFor(person).stream())
					.collect(toList());
		}
		return Collections.emptyList();
	}
	
	
	@NotNull
	public List<TimelineVm> getTimelineVms(Long patientId, boolean full) {
		List<PatientActivity> patientActivities = getActivitiesFor(patientId);
		List<TimelineVm> timeline = new ArrayList<>();
		
		Map<String, List<PatientActivity>> activities = patientActivities
				.stream()
				.filter(Objects::nonNull)
				.sorted(Comparator.comparing(PatientActivity::getDate))
				.sorted(Comparator.comparing(PatientActivity::getName))
				.sorted((a1, a2) -> a2.getDate().compareTo(a1.getDate()))
				.collect(getPatientActivityMapCollector());
		
		activities.forEach((d, a) -> {
			TimelineVm timelineVm = new TimelineVm();
			timelineVm.setDate(d);
			timelineVm.setActivities(a);
			timeline.add(timelineVm);
		});
		return timeline.stream()
				.sorted((t1, t2) -> LocalDate.parse(t2.getDate(), DateTimeFormatter.ofPattern(Constants.DAY_MONTH_YEAR))
						.compareTo(LocalDate.parse(t1.getDate(), DateTimeFormatter.ofPattern(Constants.DAY_MONTH_YEAR)))
				)
				.skip(0)
				.limit(full ? Long.MAX_VALUE : 1)
				.collect(Collectors.toList());
	}
	
	
	@NotNull
	private static Collector<PatientActivity, ?, Map<String, List<PatientActivity>>> getPatientActivityMapCollector() {
		return Collectors.groupingBy(activity -> activity.getDate().format(DateTimeFormatter.ofPattern(Constants.DAY_MONTH_YEAR)));
	}
	
	public List<PatientActivity> getActivities(Long id) {
		return Objects.requireNonNull(getActivitiesFor(id))
				.stream()
				.filter(Objects::nonNull)
				.sorted(Comparator.comparing(PatientActivity::getName))
				.sorted((a1, a2) -> a2.getDate().compareTo(a1.getDate()))
				.collect(toList());
	}
}
