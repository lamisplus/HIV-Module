package org.lamisplus.modules.hiv.repositories;

import org.lamisplus.modules.hiv.domain.entity.EnrollmentCommencement;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface EnrollmentCommencementRepository extends JpaRepository<EnrollmentCommencement, Long> {

    Optional<EnrollmentCommencement> findByPersonAndArchived(Person person, Integer archived);

    Optional<EnrollmentCommencement> findByIdAndArchived(Long id, Integer archived);

    Optional<EnrollmentCommencement> findByUuid(String uuid);

    boolean existsByPersonAndArchived(Person person, Integer archived);

    Optional<EnrollmentCommencement> findByUniqueIdAndArchived(String uniqueId, Integer archived);

    Optional<EnrollmentCommencement> findByUniqueIdAndArchivedAndPersonNot(String uniqueId, Integer archived, Person person);

    @Query(value = "SELECT hc.hiv_test_result FROM hts_client hc " +
            "WHERE hc.person_uuid = :personUuid " +
            "AND hc.archived = 0 " +
            "ORDER BY hc.date_created DESC LIMIT 1", nativeQuery = true)
    String getLatestHivTestResultByPersonUuid(@Param("personUuid") String personUuid);
}
