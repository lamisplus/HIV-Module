package org.lamisplus.modules.hiv.repositories;

import org.lamisplus.modules.hiv.domain.dto.PatientCurrentViralLoad;
import org.lamisplus.modules.hiv.domain.entity.ARTClinical;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.lamisplus.modules.hiv.domain.entity.DsdDevolvement;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface DsdDevolvementRepository extends JpaRepository<DsdDevolvement, Long> {
    Page<DsdDevolvement> findAllByPersonAndArchived(Person person, Integer archived, Pageable pageable);


    @Query(nativeQuery = true, value ="WITH vl_result AS (\n" +
            "    SELECT \n" +
            "        CAST(ls.date_sample_collected AS DATE) AS dateOfCurrentViralLoadSample, \n" +
            "        sm.patient_uuid AS personUuid, \n" +
            "        sm.facility_id AS vlFacility, \n" +
            "        sm.archived AS vlArchived, \n" +
            "        acode.display AS viralLoadIndication, \n" +
            "        sm.result_reported AS resultReported,\n" +
            "\t    sm.id as lastResultId,\n" +
            "\t       CAST(sm.date_result_reported AS DATE) AS dateResultReported,\n" +
            "        ROW_NUMBER() OVER (PARTITION BY sm.patient_uuid ORDER BY date_result_reported DESC) AS rank2\n" +
            "    FROM \n" +
            "        public.laboratory_result sm\n" +
            "    INNER JOIN \n" +
            "        public.laboratory_test lt ON sm.test_id = lt.id\n" +
            "    INNER JOIN \n" +
            "        public.laboratory_sample ls ON ls.test_id = lt.id\n" +
            "    INNER JOIN \n" +
            "        public.base_application_codeset acode ON acode.id = lt.viral_load_indication\n" +
            "    WHERE \n" +
            "        lt.lab_test_id = 16\n" +
            "        AND lt.viral_load_indication != 719\n" +
            "        AND sm.date_result_reported IS NOT NULL\n" +
            "        AND sm.result_reported IS NOT NULL\n" +
            "        AND sm.patient_uuid = :personUuid \n" +
            ")\n" +
            "SELECT \n" +
            "    * \n" +
            "FROM \n" +
            "    vl_result\n" +
            "WHERE \n" +
            "    vl_result.rank2 = 1\n" +
            "    AND (vl_result.vlArchived = 0 OR vl_result.vlArchived IS NULL)")
    Optional<PatientCurrentViralLoad> findViralLoadByPersonUuid(String personUuid);
}
