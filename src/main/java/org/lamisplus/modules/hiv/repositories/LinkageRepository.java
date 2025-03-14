package org.lamisplus.modules.hiv.repositories;

import org.lamisplus.modules.hiv.domain.dto.LinkageResponseInterface;
import org.lamisplus.modules.hiv.domain.entity.OvcLinkage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LinkageRepository extends JpaRepository<OvcLinkage, UUID> {
    List<OvcLinkage> findByDatimCode(String datimCode);
    Optional<OvcLinkage> findByArtNumber(String artNumber);
    Optional<OvcLinkage> findByOvcUniqueId(String ovcUniqueId);
    List<OvcLinkage> findByHouseholdUniqueId(String householdUniqueId);


    @Query(value = "SELECT\n" +
            "     e.unique_id AS artNumber,\n" +
            "\t pharmacy.arvRegimen AS arvRegimen,\n" +
            "\t e.date_confirmed_hiv AS dateTested,\n" +
            "\t hac.visit_date AS artEnrollmentDate,\n" +
            "\t CAST(lo.order_date AS DATE) AS vlTestDate,\n" +
            "\t lr.result_reported AS vlResult,\n" +
            "\t CAST(lr.date_result_reported AS DATE) AS vlResultDate,\n" +
            "     e.date_of_registration AS offerDate,\n" +
            "     l.last_name AS lastName,\n" +
            "     l.other_name AS otherName,\n" +
            "     l.gender,\n" +
            "     (p.contact_point->'contactPoint'->1->>'value') AS phoneNumber,\n" +
            "     f.name AS facilityName,\n" +
            "     l.state_of_residence AS stateOfResidence,\n" +
            "     l.lga_of_residence AS lgaOfResidence,\n" +
            "     l.entry_point AS entryPoint,\n" +
            "\t l.offered_ovc_from_facility AS offeredOvcFromFacility,\n" +
            "\t l.offer_accepted AS offerAccepted,\n" +
            "     l.share_contact_with_ovc AS shareContactWithOvc,\n" +
            "     l.reason_for_decline AS reasonForDecline,\n" +
            "     l.drug_refill_notification AS drugRefillNotification,\n" +
            "     l.caregiver_surname AS caregiverSurname,\n" +
            "     l.caregiver_other_name AS caregiverOtherName,\n" +
            "     l.enrollment_date AS enrollmentDate,\n" +
            "     l.ovc_unique_id AS ovcUniqueId,\n" +
            "     p.date_of_birth AS birthDate,\n" +
            "     boui.code AS datimCode,\n" +
            "     l.cbo_name AS cboName,\n" +
            "     l.facility_staff_name AS facilityStaffName,\n" +
            "     l.household_unique_id AS householdUniqueId,\n" +
            "     l.enrolled_in_ovc_program AS enrolledInOvcProgram,\n" +
            "     e.archived\n" +
            " FROM\n" +
            "     patient_person AS p\n" +
            " INNER JOIN base_organisation_unit f ON f.id = p.facility_id\n" +
            " INNER JOIN base_organisation_unit_identifier boui ON boui.organisation_unit_id = p.facility_id\n" +
            " AND boui.name = 'DATIM_ID'\n" +
            " JOIN hiv_enrollment AS e ON e.person_uuid = p.uuid\n" +
            " JOIN hiv_ovc_linkage AS l ON l.ovc_unique_id = e.ovc_number\n" +
            " JOIN hiv_art_clinical AS hac ON hac.person_uuid = e.person_uuid AND is_commencement IS TRUE\n" +
            " JOIN laboratory_result AS lr ON lr.patient_uuid = p.uuid\n" +
            " JOIN laboratory_order AS lo ON lo.patient_uuid = p.uuid\n" +
            " JOIN (\n" +
            " select * from (\n" +
            "   select *, ROW_NUMBER() OVER (PARTITION BY pr1.person_id ORDER BY pr1.visit_date DESC) as rnk3\n" +
            "   from (\n" +
            "SELECT p.person_uuid as person_id,\n" +
            "       r.description as arvRegimen, visit_date\n" +
            "from public.hiv_art_pharmacy p\n" +
            "         INNER JOIN public.hiv_art_pharmacy_regimens pr\n" +
            "        ON pr.art_pharmacy_id = p.id\n" +
            "         INNER JOIN public.hiv_regimen r on r.id = pr.regimens_id\n" +
            "         INNER JOIN public.hiv_regimen_type rt on rt.id = r.regimen_type_id\n" +
            "WHERE r.regimen_type_id in (1,2,3,4,14,16)\n" +
            "  AND  p.archived = 0\n" +
            "        ) as pr1\n" +
            "           ) as pr2\n" +
            "         where pr2.rnk3 = 1) pharmacy ON pharmacy.person_id = e.person_uuid", nativeQuery = true)
    List<LinkageResponseInterface> findAllEnrolledOvcClients();


    @Query(value = "SELECT l.* FROM hiv_ovc_linkage AS l\n" +
            "LEFT JOIN hiv_enrollment h ON l.ovc_unique_id = h.ovc_number\n" +
            "WHERE h.ovc_number IS NULL", nativeQuery = true)
    List<OvcLinkage> getAllOvcLinages();
}
