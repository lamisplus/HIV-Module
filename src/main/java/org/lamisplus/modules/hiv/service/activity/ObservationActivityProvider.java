package org.lamisplus.modules.hiv.service.activity;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.hiv.domain.dto.PatientActivity;
import org.lamisplus.modules.hiv.domain.entity.Observation;
import org.lamisplus.modules.hiv.repositories.ObservationRepository;
import org.lamisplus.modules.hiv.service.PatientActivityProvider;
import org.lamisplus.modules.hiv.utility.CustomDateTimeFormat;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class ObservationActivityProvider implements PatientActivityProvider {
    private final ObservationRepository observationRepository;

    @Override
    public List<PatientActivity> getActivitiesFor(Person person) {
        List<Observation> observations = observationRepository.getAllByPersonAndArchived (person, 0);
        return observations.stream ()
                .map (observation -> {
                    String type = observation.getType ();
                    String path = type.replaceAll (" ", "-");
                    StringBuilder sb = new StringBuilder(type);
//                    log.info ("observation-path {}", path );
                    LocalDate dateOfObservation =
                            CustomDateTimeFormat.handleNullDateActivity(sb,observation.getDateOfObservation());
                    return new PatientActivity (observation.getId (), sb.toString(), dateOfObservation, "", path);
                })
                .collect (Collectors.toList ());

    }
}
