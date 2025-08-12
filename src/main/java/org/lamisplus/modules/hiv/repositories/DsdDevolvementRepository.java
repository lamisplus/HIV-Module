package org.lamisplus.modules.hiv.repositories;

import org.lamisplus.modules.hiv.domain.dto.ClientDetailDTOForTracking;
import org.lamisplus.modules.hiv.domain.dto.PatientCurrentViralLoad;
import org.lamisplus.modules.hiv.domain.entity.ARTClinical;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.lamisplus.modules.hiv.domain.entity.DsdDevolvement;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.lang.annotation.Native;
import java.time.LocalDate;
import java.util.Optional;

public interface DsdDevolvementRepository extends JpaRepository<DsdDevolvement, Long> {
    Page<DsdDevolvement> findAllByPersonAndArchived(Person person, Integer archived, Pageable pageable);


    @Query(nativeQuery = true, value = "WITH vl_result AS (\n" +
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

    @Query(value = "SELECT COUNT(*) FROM dsd_devolvement WHERE person_uuid = ?1 AND archived = 0",
            nativeQuery = true)
    Long countByPersonId(String personId);

    @Query(value = "SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END FROM dsd_devolvement d WHERE d.person_uuid = ?1  AND d.date_devolved = ?2  AND d.archived = 0",
            nativeQuery = true)
    boolean existsByPersonIdAndDateDevolved(String personId, LocalDate dateDevolved);

    @Query(value = "SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END FROM dsd_devolvement d WHERE d.person_uuid = ?1 AND d.dsd_Type = ?2  AND d.archived = 0",
            nativeQuery = true)
    boolean existsByPersonIdAndDsdType(String personId, String dsdType);

    @Query(value = "WITH LatestDevolvement AS ( " +
            "    SELECT person_uuid, dsd_model, date_devolved " +
            "    FROM dsd_devolvement " +
            "    WHERE person_uuid = :personUuid " +
            "    ORDER BY date_devolved DESC " +
            "    FETCH FIRST 1 ROW ONLY " +
            ") " +
            "SELECT DISTINCT " +
            "    d.dsd_model AS dsdModel, " +
            "    d.date_devolved AS dateDevolved, " +
            "    CASE WHEN d.person_uuid IS NOT NULL THEN 'Yes' ELSE 'No' END AS dsdStatus, " +
            "    p.duration_in_days AS durationOnArt, " +
            "    p.date_of_last_refill AS dateOfLastRefill, " +
            "    p.dateOfMissedScheduleAppointment " +
            "FROM ( " +
            "    SELECT " +
            "        MAX(visit_date) - MIN(visit_date) + 1 AS duration_in_days, " +
            "        MAX(visit_date) AS date_of_last_refill, " +
            "        person_uuid, " +
            "        CASE " +
            "            WHEN COUNT(*) = 1 AND MAX(next_appointment) < CURRENT_DATE THEN MAX(next_appointment) " +
            "            WHEN MAX(visit_date) = ( " +
            "                SELECT MAX(next_appointment) " +
            "                FROM hiv_art_pharmacy h2 " +
            "                WHERE h2.person_uuid = h1.person_uuid " +
            "                AND next_appointment < MAX(h1.next_appointment) " +
            "            ) THEN NULL " +
            "            ELSE ( " +
            "                SELECT MAX(next_appointment) " +
            "                FROM hiv_art_pharmacy h2 " +
            "                WHERE h2.person_uuid = h1.person_uuid " +
            "                AND next_appointment < MAX(h1.next_appointment) " +
            "            ) " +
            "        END AS dateOfMissedScheduleAppointment " +
            "    FROM hiv_art_pharmacy h1 " +
            "    WHERE person_uuid = :personUuid " +
            "    GROUP BY person_uuid " +
            ") p " +
            "LEFT JOIN LatestDevolvement d ON p.person_uuid = d.person_uuid " +
            "WHERE p.person_uuid = :personUuid",
            nativeQuery = true)
    Optional<ClientDetailDTOForTracking> getClientDetailsForTracking(@Param("personUuid") String personUuid);
}
