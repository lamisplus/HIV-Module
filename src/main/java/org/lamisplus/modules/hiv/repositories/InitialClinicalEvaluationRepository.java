package org.lamisplus.modules.hiv.repositories;

import org.lamisplus.modules.hiv.domain.entity.InitialClinicalEvaluation;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InitialClinicalEvaluationRepository extends JpaRepository<InitialClinicalEvaluation, Long> {

    /**
     * Find ICE by person and archived status
     * Since ICE is a one-off form, there should only be one per person
     */
    Optional<InitialClinicalEvaluation> findByPersonIdAndArchived(Long personId, Integer archived);

    /**
     * Find ICE by person entity and archived status
     */
    Optional<InitialClinicalEvaluation> findByPersonAndArchived(Person person, Integer archived);

    /**
     * Find ICE by ID and archived status
     */
    Optional<InitialClinicalEvaluation> findByIdAndArchived(Long id, Integer archived);

    /**
     * Find ICE by UUID
     */
    Optional<InitialClinicalEvaluation> findByUuid(String uuid);

    /**
     * Check if ICE exists for a person
     */
    boolean existsByPersonIdAndArchived(Long personId, Integer archived);

    /**
     * Check if ICE exists for a person entity
     */
    boolean existsByPersonAndArchived(Person person, Integer archived);

    /**
     * Find all ICE records by facility ID
     */
    List<InitialClinicalEvaluation> findAllByFacilityIdAndArchived(Long facilityId, Integer archived);

    /**
     * Find all ICE records for a person (including archived if needed)
     */
    List<InitialClinicalEvaluation> findAllByPersonIdOrderByVisitDateDesc(Long personId);

    /**
     * Get ICE by person and facility (for multi-facility scenarios)
     */
    @Query("SELECT ice FROM InitialClinicalEvaluation ice " +
           "WHERE ice.personId = :personId " +
           "AND ice.facilityId = :facilityId " +
           "AND ice.archived = :archived")
    Optional<InitialClinicalEvaluation> findByPersonIdAndFacilityIdAndArchived(
            @Param("personId") Long personId,
            @Param("facilityId") Long facilityId,
            @Param("archived") Integer archived
    );

    /**
     * Get ICE by person entity and facility
     */
    @Query("SELECT ice FROM InitialClinicalEvaluation ice " +
           "WHERE ice.person = :person " +
           "AND ice.facilityId = :facilityId " +
           "AND ice.archived = :archived")
    Optional<InitialClinicalEvaluation> findByPersonAndFacilityIdAndArchived(
            @Param("person") Person person,
            @Param("facilityId") Long facilityId,
            @Param("archived") Integer archived
    );

    /**
     * Count total ICE records by facility
     */
    long countByFacilityIdAndArchived(Long facilityId, Integer archived);
}
