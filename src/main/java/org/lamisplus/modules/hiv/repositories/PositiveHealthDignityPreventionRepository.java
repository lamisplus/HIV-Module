package org.lamisplus.modules.hiv.repositories;

import org.lamisplus.modules.hiv.domain.entity.PositiveHealthDignityPrevention;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.domain.entity.Visit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PositiveHealthDignityPreventionRepository extends JpaRepository<PositiveHealthDignityPrevention, Long> {
    List<PositiveHealthDignityPrevention> findByPersonAndArchived(Person person, Integer archived);
    Page<PositiveHealthDignityPrevention> findAllByPersonAndArchived(Person person, Integer archived, Pageable pageable);
    Optional<PositiveHealthDignityPrevention> findByVisitAndArchived(Visit visit, Integer archived);
    List<PositiveHealthDignityPrevention> findByArchived(Integer archived);
    Optional<PositiveHealthDignityPrevention> findByUuid(String uuid);
}
