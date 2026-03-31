package org.lamisplus.modules.hiv.service.activity;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.hiv.domain.dto.PatientActivity;
import org.lamisplus.modules.hiv.domain.entity.Observation;
import org.lamisplus.modules.hiv.repositories.ObservationRepository;
import org.lamisplus.modules.hiv.service.CurrentUserOrganizationService;
import org.lamisplus.modules.hiv.service.PatientActivityProvider;
import org.lamisplus.modules.hiv.utility.CustomDateTimeFormat;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class InitialClinicalEvaluationActivityProvider implements PatientActivityProvider {
    private final ObservationRepository observationRepository;
    private final CurrentUserOrganizationService currentUserOrganizationService;

    private static final String OBSERVATION_TYPE = "Initial Clinical evaluation";

    @Override
    public List<PatientActivity> getActivitiesFor(Person person) {
        Long orgId = currentUserOrganizationService.getCurrentUserOrganization();

        List<Observation> observations = observationRepository
                .getAllByTypeAndPersonAndFacilityIdAndArchived(OBSERVATION_TYPE, person, orgId, 0);

        ArrayList<PatientActivity> patientActivities = new ArrayList<>();

        for (Observation observation : observations) {
            StringBuilder name = new StringBuilder("Initial Clinical Evaluation");
            LocalDate visitDate = CustomDateTimeFormat.handleNullDateActivity(
                    name, observation.getDateOfObservation());

            PatientActivity patientActivity = new PatientActivity(
                    observation.getId(),
                    name.toString(),
                    visitDate,
                    "",
                    "Initial-Clinical-evaluation"
            );
            patientActivities.add(patientActivity);
        }

        return patientActivities;
    }
}
