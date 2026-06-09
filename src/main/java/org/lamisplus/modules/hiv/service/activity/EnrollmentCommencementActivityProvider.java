package org.lamisplus.modules.hiv.service.activity;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.hiv.domain.dto.PatientActivity;
import org.lamisplus.modules.hiv.domain.entity.EnrollmentCommencement;
import org.lamisplus.modules.hiv.repositories.EnrollmentCommencementRepository;
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
public class EnrollmentCommencementActivityProvider implements PatientActivityProvider {
    private final EnrollmentCommencementRepository enrollmentCommencementRepository;

    @Override
    public List<PatientActivity> getActivitiesFor(Person person) {
        // Get ALL enrollment commencement records for this person
        List<EnrollmentCommencement> enrollmentCommencements =
                enrollmentCommencementRepository.findAllByPersonAndArchivedOrderByDateArtStartedDesc(person, 0);

        List<PatientActivity> patientActivities = new ArrayList<>();

        // Create a PatientActivity for each enrollment commencement
        for (int i = 0; i < enrollmentCommencements.size(); i++) {
            EnrollmentCommencement ec = enrollmentCommencements.get(i);

            // Add numbering if multiple enrollments exist
            StringBuilder name = new StringBuilder("Enrollment & Commencement");
            if (enrollmentCommencements.size() > 1) {
                name.append(" #").append(enrollmentCommencements.size() - i);
            }

            LocalDate visitDate = CustomDateTimeFormat.handleNullDateActivity(
                    name, ec.getDateArtStarted());

            PatientActivity activity = new PatientActivity(
                    ec.getId(),
                    name.toString(),
                    visitDate,
                    "",
                    "enrollment-commencement"
            );
            patientActivities.add(activity);
        }

        return patientActivities;
    }
}
