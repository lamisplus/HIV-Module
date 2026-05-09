package org.lamisplus.modules.hiv.repositories;

import org.lamisplus.modules.hiv.domain.entity.EnrollmentCommencement;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface EnrollmentCommencementRepository extends JpaRepository<EnrollmentCommencement, Long> {

    // Legacy method - kept for backward compatibility, returns first record found
    @Deprecated
    Optional<EnrollmentCommencement> findByPersonAndArchived(Person person, Integer archived);

    // NEW: Get all enrollment commencement records for a person
    List<EnrollmentCommencement> findAllByPersonAndArchivedOrderByDateArtStartedDesc(Person person, Integer archived);

    // NEW: Get latest enrollment commencement by ART start date
    // Using native query because JPQL doesn't support LIMIT keyword
    // Orders by date_art_started DESC and id DESC to ensure the most recent enrollment is returned
    // This prevents NonUniqueResultException for returning clients with multiple enrollments
    @Query(value = "SELECT * FROM hiv_enrollment_commencement e WHERE e.person_uuid = " +
            "(SELECT p.uuid FROM patient_person p WHERE p.id = :personId) " +
            "AND e.archived = :archived ORDER BY e.date_art_started DESC, e.id DESC LIMIT 1", nativeQuery = true)
    Optional<EnrollmentCommencement> findLatestByPersonIdAndArchived(@Param("personId") Long personId, @Param("archived") Integer archived);

    // NEW: Get first/earliest enrollment commencement by ART start date
    // Using native query because JPQL doesn't support LIMIT keyword
    @Query(value = "SELECT * FROM hiv_enrollment_commencement e WHERE e.person_uuid = " +
            "(SELECT p.uuid FROM patient_person p WHERE p.id = :personId) " +
            "AND e.archived = :archived ORDER BY e.date_art_started ASC, e.id ASC LIMIT 1", nativeQuery = true)
    Optional<EnrollmentCommencement> findFirstByPersonIdAndArchived(@Param("personId") Long personId, @Param("archived") Integer archived);

    // NEW: Check if enrollment exists for person on specific ART start date
    boolean existsByPersonAndArchivedAndDateArtStarted(Person person, Integer archived, LocalDate dateArtStarted);

    Optional<EnrollmentCommencement> findByIdAndArchived(Long id, Integer archived);

    Optional<EnrollmentCommencement> findByUuid(String uuid);

    // Keep this - it just checks if ANY records exist (still useful)
    boolean existsByPersonAndArchived(Person person, Integer archived);

    Optional<EnrollmentCommencement> findByUniqueIdAndArchived(String uniqueId, Integer archived);

    Optional<EnrollmentCommencement> findByUniqueIdAndArchivedAndPersonNot(String uniqueId, Integer archived, Person person);

    @Query(value = "SELECT hc.hiv_test_result FROM hts_client hc " +
            "WHERE hc.person_uuid = :personUuid " +
            "AND hc.archived = 0 " +
            "ORDER BY hc.date_created DESC LIMIT 1", nativeQuery = true)
    String getLatestHivTestResultByPersonUuid(@Param("personUuid") String personUuid);
}
