package org.lamisplus.modules.hiv.service.activity;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.hiv.domain.dto.PatientActivity;
import org.lamisplus.modules.hiv.domain.entity.InitialClinicalEvaluation;
import org.lamisplus.modules.hiv.repositories.InitialClinicalEvaluationRepository;
import org.lamisplus.modules.hiv.service.CurrentUserOrganizationService;
import org.lamisplus.modules.hiv.service.PatientActivityProvider;
import org.lamisplus.modules.hiv.utility.CustomDateTimeFormat;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class InitialClinicalEvaluationActivityProvider implements PatientActivityProvider {
    private final InitialClinicalEvaluationRepository initialClinicalEvaluationRepository;
    private final CurrentUserOrganizationService currentUserOrganizationService;

    @Override
    public List<PatientActivity> getActivitiesFor(Person person) {
        Long orgId = currentUserOrganizationService.getCurrentUserOrganization();

        Optional<InitialClinicalEvaluation> evaluationOpt = initialClinicalEvaluationRepository
                .findByPersonAndFacilityIdAndArchived(person, orgId, 0);

        ArrayList<PatientActivity> patientActivities = new ArrayList<>();

        if (evaluationOpt.isPresent()) {
            InitialClinicalEvaluation evaluation = evaluationOpt.get();
            StringBuilder name = new StringBuilder("Initial Clinical Evaluation");
            LocalDate visitDate = CustomDateTimeFormat.handleNullDateActivity(
                    name, evaluation.getVisitDate());

            PatientActivity patientActivity = new PatientActivity(
                    evaluation.getId(),
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
