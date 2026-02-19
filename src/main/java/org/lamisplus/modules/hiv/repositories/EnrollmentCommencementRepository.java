package org.lamisplus.modules.hiv.repositories;

import org.lamisplus.modules.hiv.domain.entity.EnrollmentCommencement;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EnrollmentCommencementRepository extends JpaRepository<EnrollmentCommencement, Long> {

    Optional<EnrollmentCommencement> findByPersonAndArchived(Person person, Integer archived);

    Optional<EnrollmentCommencement> findByUuid(String uuid);

    boolean existsByPersonAndArchived(Person person, Integer archived);
}
