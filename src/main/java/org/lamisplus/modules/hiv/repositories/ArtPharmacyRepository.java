package org.lamisplus.modules.hiv.repositories;

import org.lamisplus.modules.hiv.domain.dto.PharmacyReport;
import org.lamisplus.modules.hiv.domain.entity.ArtPharmacy;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.domain.entity.Visit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


public interface ArtPharmacyRepository extends JpaRepository<ArtPharmacy, Long> {
	List<ArtPharmacy> getArtPharmaciesByVisitAndPerson(Visit visit, Person person);
	
	@Query(value = "SELECT p.id FROM hiv_art_pharmacy p " +
			"INNER join hiv_art_pharmacy_regimens ap ON ap.id = p.id " +
			"INNER join hiv_regimen r ON r.id = ap.regimens_id " +
			"WHERE person_uuid = ?1 " +
			"AND r.id = ?2 " +
			"AND visit_date = ?3 "+
			"AND archived = 0 ",
			nativeQuery = true)
    Long getCountForAnAlreadyDispenseRegimen(String personUuid, Long regimenId, LocalDate visitDate);
	
	Page<ArtPharmacy> getArtPharmaciesByPersonAndArchived(Person person, Integer archived, Pageable pageable);
	
	List<ArtPharmacy> getArtPharmaciesByPersonAndArchived(Person person, Integer archived);
	
	@Query(value = "SELECT sum(refill_Period) " +
			"from hiv_art_pharmacy  " +
			"where person_uuid = ?1  " +
			"and archived = 0  " +
			"and visit_date BETWEEN ?2 and ?3 ", nativeQuery = true)
	Integer sumRefillPeriodsByPersonAndDateRange(String personUuid, LocalDate startDate, LocalDate endDate);

	@Query(nativeQuery = true, value = "SELECT DISTINCT ON (p.uuid, result.next_appointment) " +
			"    result.id, " +
			"    result.facility_id AS facilityId, " +
			"    oi.code AS datimId, " +
			"    org.name AS facilityName, " +
			"    p.uuid AS patientId, " +
			"    p.hospital_number AS hospitalNum, " +
			"    hrt.description AS regimenLine, " +
			"    result.mmd_type AS mmdType, " +
			"    result.next_appointment AS nextAppointment, " +
			"    result.dsd_model AS dsdModel, " +
			"    result.visit_date AS dateVisit, " +
			"    result.duration AS refillPeriod, " +
			"    result.regimen_name AS regimens " +
			"FROM ( " +
			"    SELECT " +
			"        h.*, " +
			"        pharmacy_object ->> 'duration' AS duration, " +
			"        CAST (pharmacy_object ->> 'regimenName' AS VARCHAR) AS regimen_name " +
//			"        pharmacy_object ->> 'regimenName'::VARCHAR AS regimen_name " +
			"    FROM hiv_art_pharmacy h, " +
			"        jsonb_array_elements(h.extra->'regimens') WITH ORDINALITY p(pharmacy_object) " +
			") AS result " +
			"INNER JOIN patient_person p ON p.uuid = result.person_uuid " +
			"INNER JOIN base_organisation_unit org ON org.id = result.facility_id " +
			"INNER JOIN base_organisation_unit_identifier oi ON oi.organisation_unit_id = result.facility_id " +
			"INNER JOIN hiv_regimen hr ON hr.description = result.regimen_name " +
			"INNER JOIN hiv_regimen_type hrt ON hrt.id = hr.regimen_type_id " +
			"WHERE result.facility_id = :facilityId " +
			"ORDER BY p.uuid, result.next_appointment, result.visit_date DESC;")
	List<PharmacyReport> getArtPharmacyReport(Long facilityId);
	
	@Query(value = "SELECT * FROM hiv_art_pharmacy p inner join hiv_art_pharmacy_regimens pr On p.id = pr.art_pharmacy_id " +
			"INNER JOIN hiv_regimen r ON r.id = pr.regimens_id WHERE visit_date <=  ?2  " +
			"AND r.regimen_type_id IN (1,2,3,4,14) AND person_uuid = ?1 " +
			"AND archived = 0 ORDER BY visit_date DESC LIMIT 1" ,
			nativeQuery = true)
	Optional<ArtPharmacy> getCurrentPharmacyRefillWithDateRange(String personUuid, LocalDate endDate);
	@Query(value = "SELECT * FROM hiv_art_pharmacy WHERE person_uuid = ?1 " +
			" AND ipt ->>'type' ILIKE'%initia%'AND ipt ->>'dateCompleted' IS NULL " +
			" ORDER BY visit_date DESC LIMIT 1 ", nativeQuery = true)
    Optional<ArtPharmacy> getInitialIPTWithoutCompletionDate(String personUuid);
	
	
	@Query(value = "SELECT * FROM hiv_art_pharmacy WHERE person_uuid = ?1 " +
			" AND ipt  IS NOT NULL " +
			" ORDER BY visit_date DESC LIMIT 1 ", nativeQuery = true)
	Optional<ArtPharmacy> getPharmacyIpt(String personUuid);

	//For central sync
	List<ArtPharmacy> findAllByFacilityId(Long facilityId);

	@Query(value = "SELECT * FROM hiv_art_pharmacy WHERE last_modified_date > ?1 AND facility_id=?2 ",
			nativeQuery = true
	)
	List<ArtPharmacy> getAllDueForServerUpload(LocalDateTime dateLastSync, Long facilityId);

	Optional<ArtPharmacy> findByUuid(String uuid);

	Optional<ArtPharmacy> findByUuidAndFacilityId(String uuid, Long facilityId);
}

