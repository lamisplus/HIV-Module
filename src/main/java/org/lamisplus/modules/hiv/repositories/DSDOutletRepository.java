package org.lamisplus.modules.hiv.repositories;

import org.lamisplus.modules.hiv.domain.dto.DsdOutletDTO;
import org.lamisplus.modules.hiv.domain.dto.DsdOutletProjection;
import org.lamisplus.modules.hiv.domain.entity.DSDOutlet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DSDOutletRepository extends JpaRepository<DSDOutlet, Long> {

    @Query(value = "SELECT * FROM dsd_outlet WHERE lga = :lga and archived = :archived", nativeQuery = true)
    List<DSDOutlet> findByLga(String lga, int archived);

        @Query(value = "SELECT dsdo.id, dsdo.code, dsdo.dsd_type as dsdType , dsdo.hub_name as hubName, dsdo.spoke_name as spokeName" +
                " FROM base_organisation_unit_identifier boui" +
                " INNER JOIN dsd_outlet dsdo ON boui.code = dsdo.hub_datim_uid" +
                " WHERE boui.name = 'DATIM_ID'" +
                " AND boui.organisation_unit_id = ?1" +
                " AND dsdo.code = ?2" +
                " AND dsdo.archived = 0" +
                " AND dsdo.active = TRUE", nativeQuery = true)
        List<DsdOutletProjection> findDsdOutlets(Long organisationUnitId, String code);


    @Query(value = "SELECT dsdo.id, " +
            "dsdo.code, " +
            "dsdo.dsd_type AS dsdType, " +
            "dsdo.hub_name AS hubName, " +
            "dsdo.spoke_name AS spokeName " +
            "FROM dsd_outlet dsdo " +
            "WHERE dsdo.hub_name = :hubName " +
            "AND dsdo.dsd_type LIKE %:dsdType% " +
            "AND dsdo.archived = 0",
            nativeQuery = true)
    List<DsdOutletProjection> findByHubNameAndDsdType(@Param("hubName") String hubName,
                                                      @Param("dsdType") String dsdType);

}


