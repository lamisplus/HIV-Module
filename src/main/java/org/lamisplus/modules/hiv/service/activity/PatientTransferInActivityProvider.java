package org.lamisplus.modules.hiv.service.activity;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.hiv.domain.dto.PatientActivity;
import org.lamisplus.modules.hiv.domain.entity.PatientTransferIn;
import org.lamisplus.modules.hiv.repositories.PatientTransferInRepository;
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
public class PatientTransferInActivityProvider implements PatientActivityProvider {
    private final PatientTransferInRepository patientTransferInRepository;

    @Override
    public List<PatientActivity> getActivitiesFor(Person person) {
        Optional<PatientTransferIn> transferIn =
                patientTransferInRepository.findByPersonAndArchived(person, 0);

        StringBuilder name = new StringBuilder("Transfer-In Acknowledgement");
        PatientActivity patientActivity = transferIn
                .map(ti -> {
                    LocalDate visitDate = CustomDateTimeFormat.handleNullDateActivity(
                            name, ti.getReceivedDate());
                    return new PatientActivity(
                            ti.getId(),
                            name.toString(),
                            visitDate,
                            "",
                            "Transfer-In-Acknowledgement"
                    );
                }).orElse(null);

        ArrayList<PatientActivity> patientActivities = new ArrayList<>();
        patientActivities.add(patientActivity);
        return patientActivities;
    }
}
