package org.lamisplus.modules.hiv.repositories;

import org.lamisplus.modules.hiv.domain.dto.EacOutComeDto;
import org.lamisplus.modules.hiv.domain.entity.EacOutCome;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface EacOutComeRepository extends JpaRepository<EacOutCome, Long> {
    //For central sync
    List<EacOutCome> findAllByFacilityId(Long facilityId);

    @Query(value = "SELECT * FROM hiv_eac_out_come WHERE last_modified_date > ?1 AND facility_id=?2",
            nativeQuery = true
    )
    List<EacOutCome> getAllDueForServerUpload(LocalDateTime dateLastSync, Long facilityId);

    Optional<EacOutCome> findByUuid(String uuid);

    List<EacOutCome> findByPerson(Person person);
}