package org.lamisplus.modules.hiv.repositories;

import org.lamisplus.modules.hiv.domain.entity.AdherencePreparation;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdherencePreparationRepository extends JpaRepository<AdherencePreparation, Long> {

    Page<AdherencePreparation> findAllByPersonAndArchived(Person person, Integer archived, Pageable pageable);

    List<AdherencePreparation> findByArchived(Integer archived);

    boolean existsByPersonAndArchived(Person person, Integer archived);

    // Session-based queries for enrollment cycle tracking
    Optional<AdherencePreparation> findByEnrollmentSessionUuidAndArchived(String enrollmentSessionUuid, Integer archived);

    boolean existsByEnrollmentSessionUuidAndArchived(String enrollmentSessionUuid, Integer archived);

    // Get latest adherence preparation for a person
    Optional<AdherencePreparation> findTopByPersonAndArchivedOrderByIdDesc(Person person, Integer archived);
}
