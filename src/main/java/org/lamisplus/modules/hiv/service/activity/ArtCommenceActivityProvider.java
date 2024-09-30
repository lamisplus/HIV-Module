package org.lamisplus.modules.hiv.service.activity;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.hiv.domain.dto.PatientActivity;
import org.lamisplus.modules.hiv.domain.entity.ARTClinical;
import org.lamisplus.modules.hiv.repositories.ARTClinicalRepository;
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
public class ArtCommenceActivityProvider implements PatientActivityProvider {
    private final ARTClinicalRepository artClinicalRepository;

    @Override
    public List<PatientActivity> getActivitiesFor(Person person) {
        Optional<ARTClinical> artCommencement = artClinicalRepository.findTopByPersonAndIsCommencementIsTrueAndArchived (person, 0);
        StringBuilder name = new StringBuilder("ART Commencement");
        PatientActivity patientActivity = artCommencement
                .map (artPharmacy -> {
                    LocalDate visitDate = CustomDateTimeFormat.handleNullDateActivity(name, artPharmacy.getVisitDate());
                    return new PatientActivity (artPharmacy.getId (), name.toString(), visitDate, "", "Art-commence");
                }).orElse (null);
        ArrayList<PatientActivity> patientActivities = new ArrayList<> ();
        patientActivities.add (patientActivity);
        return patientActivities;
    }
    
    
}
