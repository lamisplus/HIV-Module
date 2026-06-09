package org.lamisplus.modules.hiv.service.activity;

import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.lamisplus.modules.hiv.domain.dto.PatientActivity;
import org.lamisplus.modules.hiv.domain.entity.AdherencePreparation;
import org.lamisplus.modules.hiv.repositories.AdherencePreparationRepository;
import org.lamisplus.modules.hiv.service.PatientActivityProvider;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AdherencePreparationActivityProvider implements PatientActivityProvider {
    private final AdherencePreparationRepository adherencePreparationRepository;

    @Override
    public List<PatientActivity> getActivitiesFor(Person person) {
        Page<AdherencePreparation> adherenceList = adherencePreparationRepository
                .findAllByPersonAndArchived(person, 0, PageRequest.of(0, 100));

        return adherenceList.getContent().stream()
                .filter(Objects::nonNull)
                .map(this::buildPatientActivity)
                .collect(Collectors.toList());
    }

    @NotNull
    private PatientActivity buildPatientActivity(AdherencePreparation adherence) {
        String name = "ART Adherence Preparation";
        return new PatientActivity(
                adherence.getId(),
                name,
                adherence.getServiceDate(),
                "",
                "adherence-preparation"
        );
    }
}
