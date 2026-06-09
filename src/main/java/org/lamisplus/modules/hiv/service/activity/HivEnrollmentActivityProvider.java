package org.lamisplus.modules.hiv.service.activity;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.hiv.domain.dto.PatientActivity;
import org.lamisplus.modules.hiv.domain.entity.HivEnrollment;
import org.lamisplus.modules.hiv.repositories.HivEnrollmentRepository;
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
public class HivEnrollmentActivityProvider implements PatientActivityProvider {

    private final HivEnrollmentRepository hivEnrollmentRepository;

    @Override
    public List<PatientActivity> getActivitiesFor(Person person) {
//        Optional<HivEnrollment> hivEnrollmentOptional = hivEnrollmentRepository.getHivEnrollmentByPersonAndArchived (person, 0);
//        List<PatientActivity> patientActivities = new ArrayList<> ();
//        StringBuilder name = new StringBuilder("HIV Enrollment");
//        PatientActivity patientActivity = hivEnrollmentOptional
//                .map (hivEnrollment -> {
//                    LocalDate dateOfRegistration =
//                            CustomDateTimeFormat.handleNullDateActivity(name, hivEnrollment.getDateOfRegistration());
//                    return new PatientActivity (hivEnrollment.getId (), name.toString(), dateOfRegistration, "", "hiv-enrollment");
//                })
//                .orElse (null);
//        patientActivities.add (patientActivity);
//        return patientActivities;
        return new ArrayList<>();
    }

}
