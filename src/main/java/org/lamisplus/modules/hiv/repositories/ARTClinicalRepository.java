package org.lamisplus.modules.hiv.repositories;

import org.lamisplus.modules.hiv.domain.entity.ARTClinical;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ARTClinicalRepository extends JpaRepository<ARTClinical, Long> {
    List<ARTClinical> findByArchivedAndIsCommencementIsTrue(int i);

    List<ARTClinical> findByArchivedAndIsCommencementIsFalse(int i);

    Optional<ARTClinical> findByPersonAndIsCommencementIsTrueAndArchived(Person person, Integer archived);
    
    Optional<ARTClinical> findTopByPersonAndIsCommencementIsTrueAndArchived(Person person, Integer archived);

    List<ARTClinical> findAllByPersonAndIsCommencementIsFalseAndArchived(Person person, Integer archived);
    Page<ARTClinical> findAllByPersonAndIsCommencementIsFalseAndArchived(Person person, Integer archived, Pageable pageable);
    Page<ARTClinical> findAllByPersonAndArchived(Person person, Integer archived, Pageable pageable);
    
    List<ARTClinical> findAllByPersonAndArchived(Person person, Integer archived);

    //For central sync
    List<ARTClinical> findAllByFacilityId(Long facilityId);

    @Query(value = "SELECT * FROM hiv_art_clinical WHERE last_modified_date > ?1 AND facility_id=?2 ",
            nativeQuery = true
    )
    List<ARTClinical> getAllDueForServerUpload(LocalDateTime dateLastSync, Long facilityId);

    Optional<ARTClinical> findByUuid(String uuid);

}
