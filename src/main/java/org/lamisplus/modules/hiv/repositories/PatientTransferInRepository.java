package org.lamisplus.modules.hiv.repositories;

import org.lamisplus.modules.hiv.domain.entity.PatientTransferIn;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PatientTransferInRepository extends JpaRepository<PatientTransferIn, Long> {
    Optional<PatientTransferIn> findByPersonIdAndArchived(Long personId, Integer archived);
    Optional<PatientTransferIn> findByPersonAndArchived(Person person, Integer archived);
    Optional<PatientTransferIn> findByIdAndArchived(Long id, Integer archived);
    Optional<PatientTransferIn> findByUuid(String uuid);
    boolean existsByPersonIdAndArchived(Long personId, Integer archived);
    boolean existsByPersonAndArchived(Person person, Integer archived);
    boolean existsByPersonUuidAndArchived(String personUuid, Integer archived);
    List<PatientTransferIn> findAllByFacilityIdAndArchived(Long facilityId, Integer archived);

    List<PatientTransferIn> findAllByPersonIdOrderByReceivedDateDesc(Long personId);
    @Query("SELECT ti FROM PatientTransferIn ti " +
           "WHERE ti.personId = :personId " +
           "AND ti.facilityId = :facilityId " +
           "AND ti.archived = :archived")
    Optional<PatientTransferIn> findByPersonIdAndFacilityIdAndArchived(
            @Param("personId") Long personId,
            @Param("facilityId") Long facilityId,
            @Param("archived") Integer archived
    );


    @Query("SELECT ti FROM PatientTransferIn ti " +
           "WHERE ti.person = :person " +
           "AND ti.facilityId = :facilityId " +
           "AND ti.archived = :archived")
    Optional<PatientTransferIn> findByPersonAndFacilityIdAndArchived(
            @Param("person") Person person,
            @Param("facilityId") Long facilityId,
            @Param("archived") Integer archived
    );
    long countByFacilityIdAndArchived(Long facilityId, Integer archived);
    @Query("SELECT ti FROM PatientTransferIn ti " +
           "WHERE ti.personId = :personId " +
           "AND ti.archived = :archived " +
           "ORDER BY ti.receivedDate DESC")
    Optional<PatientTransferIn> findMostRecentByPersonId(
            @Param("personId") Long personId,
            @Param("archived") Integer archived
    );

    /**
     * Session-based queries for enrollment cycle tracking
     * Find PatientTransferIn by enrollment session UUID and archived status
     */
    Optional<PatientTransferIn> findByEnrollmentSessionUuidAndArchived(String enrollmentSessionUuid, Integer archived);

    /**
     * Check if PatientTransferIn exists for a specific enrollment session
     */
    boolean existsByEnrollmentSessionUuidAndArchived(String enrollmentSessionUuid, Integer archived);
}
