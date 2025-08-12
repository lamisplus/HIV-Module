package org.lamisplus.modules.hiv.repositories;

import org.lamisplus.modules.hiv.domain.dto.PatientFlagConfigsDto;
import org.lamisplus.modules.hiv.domain.entity.PatientFlag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface PatientFlagRepository extends JpaRepository<PatientFlag, Long> {

    @Query(nativeQuery = true, value = "SELECT surpression_value FROM base_application_flag_config WHERE facility_id = ?1 AND archived = 0")
    Optional<Integer> getPatientFlagsParameter (Long facilityId);

    @Query(value = "SELECT id, grace_period AS gracePeriod, surpression_value AS surpressionValue, api, message FROM base_application_flag_config\n" +
            "WHERE facility_id = ?1 AND archived = 0", nativeQuery = true)
    List<PatientFlagConfigsDto> getAllConfigs (Long facilityId);

}
