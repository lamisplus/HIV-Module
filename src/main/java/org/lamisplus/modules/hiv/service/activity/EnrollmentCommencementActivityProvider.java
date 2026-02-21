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
        Optional<EnrollmentCommencement> enrollmentCommencement =
                enrollmentCommencementRepository.findByPersonAndArchived(person, 0);

        StringBuilder name = new StringBuilder("Enrollment & Commencement");
        PatientActivity patientActivity = enrollmentCommencement
                .map(ec -> {
                    LocalDate visitDate = CustomDateTimeFormat.handleNullDateActivity(
                            name, ec.getDateArtStarted());
                    return new PatientActivity(
                            ec.getId(),
                            name.toString(),
                            visitDate,
                            "",
                            "enrollment-commencement"
                    );
                }).orElse(null);

        ArrayList<PatientActivity> patientActivities = new ArrayList<>();
        patientActivities.add(patientActivity);
        return patientActivities;
    }
}
