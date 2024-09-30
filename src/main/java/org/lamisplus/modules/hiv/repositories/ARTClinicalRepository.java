package org.lamisplus.modules.hiv.repositories;

import org.lamisplus.modules.hiv.domain.dto.FlagPatientDto;
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

    @Query("SELECT ac.person.uuid AS personUuid, MAX(ac.visitDate) AS maxVisitDate " +
            "FROM ARTClinical ac WHERE ac.archived = 0 " +
            "GROUP BY ac.person.uuid")
    List<Object[]> findMaxVisitDateAndPersonUuid();

    @Query(value = "WITH patientMeta AS (\n" +
            "SELECT p.uuid, p.id, p.facility_id, currentVl.currentViralLoad,\n" +
            "CASE WHEN currentVl.currentViralLoad >= ?3 THEN 'HIGH SURPRESSION RATE' \n" +
            "WHEN currentVl.currentViralLoad IS NULL THEN 'NO VIRAL LOAD RESULT YET'\n" +
            "ELSE 'LOW SURPRESSION RATE' END AS vlSurpression,\n" +
            "CASE \n" +
            "    WHEN  (CAST ( NOW() AS DATE) > pharmacy.nextPickupDate1) AND currentStatus.status ='Active'\n" +
            "    THEN EXTRACT(DAY FROM AGE(NOW(), pharmacy.nextPickupDate1))\n" +
            "    ELSE 0\n" +
            "END AS daysMissedAppointment,\n" +
            "CASE \n" +
            "    WHEN  (CAST ( NOW() AS DATE) > pharmacy.nextPickupDate1) AND currentStatus.status ='Active'\n" +
            "    THEN 'Missed Appointment'\n" +
            "    ELSE 'NOT YET MISSED APPOINTMENT'\n" +
            "END AS missedAppointment,\n" +
            "\n" +
            "COALESCE(pharmacy.nextPickupDate1, pharmacy.nextPickupDate)  AS nextAppointmentDate,\n" +
            "CAST ( NOW() AS DATE),\n" +
            "currentStatus.status, currentVl.currentViralLoad AS currentViralLoadResult\n" +
            "FROM patient_person p\n" +
            "INNER JOIN\n" +
            "(SELECT TRUE as commenced, hac.person_uuid, hac.visit_date FROM hiv_art_clinical hac WHERE hac.archived=0 AND hac.is_commencement is true\n" +
            "GROUP BY hac.person_uuid, hac.visit_date)ca ON p.uuid = ca.person_uuid\n" +
            "LEFT JOIN (\n" +
            "SELECT CAST(vl_result.currentViralLoad AS DECIMAL), vl_result.person_uuid FROM (\n" +
            "         SELECT CAST(ls.date_sample_collected AS DATE ) AS dateOfCurrentViralLoadSample, sm.patient_uuid as person_uuid , sm.facility_id as vlFacility, sm.archived as vlArchived, acode.display as viralLoadIndication, sm.result_reported  as currentViralLoad,CAST(sm.date_result_reported AS DATE) as dateOfCurrentViralLoad,\n" +
            "     ROW_NUMBER () OVER (PARTITION BY sm.patient_uuid ORDER BY date_result_reported DESC) as rank2\n" +
            "         FROM public.laboratory_result  sm\n" +
            "      INNER JOIN public.laboratory_test  lt on sm.test_id = lt.id\n" +
            "  INNER JOIN public.laboratory_sample ls on ls.test_id = lt.id\n" +
            "      INNER JOIN public.base_application_codeset  acode on acode.id =  lt.viral_load_indication\n" +
            "         WHERE lt.lab_test_id = 16\n" +
            "           AND  lt.viral_load_indication !=719\n" +
            "           AND sm. date_result_reported IS NOT NULL\n" +
            "           AND sm.date_result_reported <= CAST ( NOW() AS DATE)\n" +
            "           AND sm.result_reported is NOT NULL\n" +
            "     )as vl_result\n" +
            "   WHERE vl_result.rank2 = 1\n" +
            "     AND (vl_result.vlArchived = 0 OR vl_result.vlArchived is null)\n" +
            "     AND  vl_result.vlFacility = ?2\n" +
            ") currentVl ON currentVl.person_uuid = p.uuid\n" +
            "LEFT JOIN (select * from (\n" +
            "   select *, ROW_NUMBER() OVER (PARTITION BY pr1.person_uuid1 ORDER BY pr1.lastPickupDate DESC) as rnk3\n" +
            "   from (\n" +
            "SELECT p.person_uuid as person_uuid1, p.visit_date as lastPickupDate,    \n" +
            "       p.next_appointment as nextPickupDate, p.refill_period, CAST(COALESCE(p.visit_date + p.refill_period,  p.next_appointment) AS DATE) AS nextPickupDate1\n" +
            "from public.hiv_art_pharmacy p\n" +
            "         INNER JOIN public.hiv_art_pharmacy_regimens pr\n" +
            "        ON pr.art_pharmacy_id = p.id\n" +
            "         INNER JOIN public.hiv_regimen r on r.id = pr.regimens_id\n" +
            "         INNER JOIN public.hiv_regimen_type rt on rt.id = r.regimen_type_id\n" +
            "left JOIN base_application_codeset ds_model on ds_model.code = p.dsd_model_type \n" +
            "WHERE r.regimen_type_id in (1,2,3,4,14)\n" +
            "  AND  p.archived = 0\n" +
            "  AND  p.facility_id = ?2\n" +
            "  AND  p.visit_date  < CAST (NOW() AS DATE)\n" +
            "        ) as pr1\n" +
            "           ) as pr2\n" +
            "         where pr2.rnk3 = 1 ) pharmacy ON pharmacy.person_uuid1 = p.uuid\n" +
            "LEFT JOIN (\n" +
            "SELECT  DISTINCT ON (pharmacy.person_uuid) pharmacy.person_uuid AS cuPersonUuid,\n" +
            "        (\n" +
            "CASE\n" +
            "    WHEN stat.hiv_status ILIKE '%DEATH%' OR stat.hiv_status ILIKE '%Died%' THEN 'Died'\n" +
            "    WHEN( stat.status_date > pharmacy.maxdate AND (stat.hiv_status ILIKE '%stop%' OR stat.hiv_status ILIKE '%out%' OR stat.hiv_status ILIKE '%Invalid %'))\n" +
            "        THEN stat.hiv_status\n" +
            "    ELSE pharmacy.status\n" +
            "    END\n" +
            ") AS status,\n" +
            "        (\n" +
            "CASE\n" +
            "    WHEN stat.hiv_status ILIKE '%DEATH%' OR stat.hiv_status ILIKE '%Died%'  THEN stat.status_date\n" +
            "    WHEN(stat.status_date > pharmacy.maxdate AND (stat.hiv_status ILIKE '%stop%' OR stat.hiv_status ILIKE '%out%' OR stat.hiv_status ILIKE '%Invalid %')) THEN stat.status_date\n" +
            "    ELSE pharmacy.visit_date\n" +
            "    END\n" +
            ") AS status_date\n" +
            "\n" +
            " FROM\n" +
            "     (\n" +
            "         SELECT\n" +
            " (\n" +
            "     CASE\n" +
            "         WHEN hp.visit_date + hp.refill_period + INTERVAL '29 day' < CAST ( NOW() AS DATE) THEN 'IIT'\n" +
            "         ELSE 'Active'\n" +
            "         END\n" +
            "     ) status,\n" +
            " (\n" +
            "     CASE\n" +
            "         WHEN hp.visit_date + hp.refill_period + INTERVAL '29 day' < CAST ( NOW() AS DATE) THEN hp.visit_date + hp.refill_period + INTERVAL '?4 day'\n" +
            "         ELSE hp.visit_date\n" +
            "         END\n" +
            "     ) AS visit_date,\n" +
            " hp.person_uuid, MAXDATE \n" +
            "         FROM\n" +
            " hiv_art_pharmacy hp\n" +
            "     INNER JOIN (\n" +
            "         SELECT hap.person_uuid, hap.visit_date AS  MAXDATE, ROW_NUMBER() OVER (PARTITION BY hap.person_uuid ORDER BY hap.visit_date DESC) as rnkkk3\n" +
            "           FROM public.hiv_art_pharmacy hap \n" +
            "                    INNER JOIN public.hiv_art_pharmacy_regimens pr \n" +
            "                    ON pr.art_pharmacy_id = hap.id \n" +
            "            INNER JOIN hiv_enrollment h ON h.person_uuid = hap.person_uuid AND h.archived = 0 \n" +
            "            INNER JOIN public.hiv_regimen r on r.id = pr.regimens_id \n" +
            "            INNER JOIN public.hiv_regimen_type rt on rt.id = r.regimen_type_id \n" +
            "            WHERE r.regimen_type_id in (1,2,3,4,14) \n" +
            "            AND hap.archived = 0                \n" +
            "            AND hap.visit_date < CAST ( NOW() AS DATE)\n" +
            "             ) MAX ON MAX.MAXDATE = hp.visit_date AND MAX.person_uuid = hp.person_uuid \n" +
            "      AND MAX.rnkkk3 = 1\n" +
            "     WHERE\n" +
            "     hp.archived = 0\n" +
            "     AND hp.visit_date < CAST ( NOW() AS DATE)\n" +
            "     ) pharmacy\n" +
            "\n" +
            "         LEFT JOIN (\n" +
            "         SELECT\n" +
            " hst.hiv_status,\n" +
            " hst.person_id,\n" +
            " hst.status_date\n" +
            "         FROM\n" +
            " (\n" +
            "     SELECT * FROM (SELECT DISTINCT (person_id) person_id, status_date, cause_of_death, va_cause_of_death,\n" +
            "hiv_status, ROW_NUMBER() OVER (PARTITION BY person_id ORDER BY status_date DESC)\n" +
            "        FROM hiv_status_tracker WHERE archived=0 AND status_date <= CAST ( NOW() AS DATE) )s\n" +
            "     WHERE s.row_number=1\n" +
            " ) hst\n" +
            "     INNER JOIN hiv_enrollment he ON he.person_uuid = hst.person_id\n" +
            "         WHERE hst.status_date < CAST ( NOW() AS DATE)\n" +
            "     ) stat ON stat.person_id = pharmacy.person_uuid\n" +
            ") currentStatus ON currentStatus.cuPersonUuid = p.uuid\n" +
            "\n" +
            ")\n" +
            "SELECT id, vlSurpression, daysMissedAppointment, missedAppointment, nextAppointmentDate, currentViralLoadResult,\n" +
            "CASE WHEN (nextAppointmentDate - CAST ( NOW() AS DATE)) BETWEEN 1 AND 7 THEN (nextAppointmentDate - CAST ( NOW() AS DATE)) ELSE NULL END AS dateDiff\n" +
            "FROM patientMeta\n" +
            "WHERE \n" +
            "id =?1\n" +
            "AND facility_id =?2", nativeQuery = true)
    FlagPatientDto getPatientMetaData (Long id, Long facilityId, Integer vlSurpression);

}
