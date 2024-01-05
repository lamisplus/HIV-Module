package org.lamisplus.modules.hiv.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.Nullable;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.hiv.domain.dto.EnrollmentStatus;
import org.lamisplus.modules.hiv.domain.dto.HIVInterQuarterStatus;
import org.lamisplus.modules.hiv.domain.dto.HIVStatusDisplay;
import org.lamisplus.modules.hiv.domain.dto.Quarter;
import org.lamisplus.modules.hiv.domain.entity.ArtPharmacy;
import org.lamisplus.modules.hiv.domain.entity.HIVStatusTracker;
import org.lamisplus.modules.hiv.repositories.ArtPharmacyRepository;
import org.lamisplus.modules.hiv.repositories.HIVStatusTrackerRepository;
import org.lamisplus.modules.hiv.repositories.HivEnrollmentRepository;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.repository.PersonRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class StatusManagementService {
	
	private final ArtPharmacyRepository pharmacyRepository;
	private final HIVStatusTrackerRepository hivStatusTrackerRepository;
	
	private final HivEnrollmentRepository hivEnrollmentRepository;
	
	private final PersonRepository personRepository;
	
	
	public Quarter getPreviousQuarter(LocalDate endDate) {
		int value = endDate.getMonth().getValue();
		if (value >= 10) {
			//q1
			return getQuarter(7, endDate.getYear(), "Q4");
		}
		if (value <= 3) {
			//q2
			return getQuarter(10, endDate.getYear() - 1, "Q1");
		}
		if (value <= 6) {
			//q3
			return getQuarter(1, endDate.getYear(), "Q2");
		}
		//q4
		return getQuarter(4, endDate.getYear(), "Q3");
		
	}
	
	public Quarter getCurrentQuarter(LocalDate endDate) {
		int value = endDate.getMonth().getValue();
		if (value >= 10) {
			//q1
			return getQuarter(10, endDate.getYear(), "Q1");
		}
		if (value <= 3) {
			//q2
			return getQuarter(1, endDate.getYear(), "Q2");
		}
		if (value <= 6) {
			//q3
			return getQuarter(4, endDate.getYear(), "Q3");
		}
		//q4
		return getQuarter(7, endDate.getYear(), "Q4");
		
	}
	
	
	private Quarter getQuarter(int startMonth, int year, String quarterName) {
		LocalDate start = LocalDate.of(year, startMonth, 1);
		LocalDate end = start.plusMonths(3).minusDays(1);
		log.info("endDate:{}", end);
		return new Quarter(start, end, quarterName);
		
	}
	
	public HIVInterQuarterStatus getClientPreviousInternalQuarterStatus(LocalDate endReportPeriod, String personUuid) {
		Quarter previousQuarter = getPreviousQuarter(endReportPeriod);
		LocalDate quarterEnd = previousQuarter.getEnd();
		return getClientInternalStatusInQuarter(personUuid, quarterEnd);
	}
	
	public HIVInterQuarterStatus getClientCurrentInternalQuarterStatus(String personUuid, LocalDate endReportPeriod) {
		return getClientInternalStatusInQuarter(personUuid, endReportPeriod);
	}
	
	@Nullable
	private HIVInterQuarterStatus getClientInternalStatusInQuarter(String personUuid, LocalDate quarterEnd) {
		List<String> staticStatus =
				Arrays.asList("ART_TRANSFER_OUT",
						"ART Transfer Out",
						"KNOWN_DEATH",
						"Died (Confirmed)",
						"STOPPED_TREATMENT",
						"Stopped Treatment",
						"Interruption in Treatment",
						"Interruption in Treatment",
						"Invalid - Nonexistent",
						"Invalid – Long-term IIT",
						"Invalid - Duplicates",
						"Invalid - Biometrical Naive"
				);
		Optional<HIVStatusTracker> patientNegativeStatus = hivStatusTrackerRepository
				.getStatusByPersonUuidAndDateRange(personUuid, quarterEnd);

		if (patientNegativeStatus.isPresent() && staticStatus.contains(patientNegativeStatus.get().getHivStatus())) {
			String hivStatus = patientNegativeStatus.get().getHivStatus();
				String finalStatus = hivStatus.replaceAll("_", " ").toUpperCase();
				if(finalStatus.contains("DEATH") || finalStatus.contains("Died")) finalStatus = "DIED";
				return new HIVInterQuarterStatus(patientNegativeStatus.get().getStatusDate(), finalStatus);
		}
		Optional<ArtPharmacy> currentRefillInQuarter = pharmacyRepository
				.getCurrentPharmacyRefillWithDateRange(personUuid, quarterEnd);
		
		if (currentRefillInQuarter.isPresent()) {
			ArtPharmacy currentQuarterCurrentRefill = currentRefillInQuarter.get();
			LocalDate visitDate = currentQuarterCurrentRefill.getVisitDate();
			Integer refillPeriod = currentQuarterCurrentRefill.getRefillPeriod();
			LocalDate expectedQuarterRefillPeriodBeforeIIT = visitDate.plusDays(refillPeriod).plusDays(28);
			if (expectedQuarterRefillPeriodBeforeIIT.isBefore(quarterEnd)) {
				return new HIVInterQuarterStatus(expectedQuarterRefillPeriodBeforeIIT, "IIT");
			} else {
				return new HIVInterQuarterStatus(visitDate, "ACTIVE");
			}
		}
		return null;
	}
	
	public HIVStatusDisplay getClientReportingStatus(String personUuid, LocalDate reportingDate) {
		Quarter currentQuarter = getCurrentQuarter(reportingDate);
		HIVInterQuarterStatus clientPreviousInternalQuarterStatus =
				getClientPreviousInternalQuarterStatus(reportingDate, personUuid);
		
		EnrollmentStatus enrollmentStatus = getEnrollmentStatus(personUuid);
		//ACTIVE, IIT, null
		HIVInterQuarterStatus clientCurrentInternalQuarterStatus =
				getClientCurrentInternalQuarterStatus(personUuid, reportingDate);
		
		//ACTIVE, IIT, null
		if (clientPreviousInternalQuarterStatus == null && clientCurrentInternalQuarterStatus != null) {
//			if (isTransferIn(clientCurrentInternalQuarterStatus, enrollmentStatus)) {
//				return new HIVStatusDisplay(clientCurrentInternalQuarterStatus.getDate(),
//						"ACTIVE TRANSFER IN", currentQuarter.getEnd());
//			}
			return new HIVStatusDisplay(clientCurrentInternalQuarterStatus.getDate(),
					clientCurrentInternalQuarterStatus.getDescription(),
					currentQuarter.getEnd());
			
		}
//		if (clientPreviousInternalQuarterStatus == null && clientCurrentInternalQuarterStatus == null) {
//			Optional<EnrollmentStatus> hivEnrollmentStatus =
//					hivEnrollmentRepository.getHivEnrollmentStatusByPersonUuid(personUuid);
//
////			if (hivEnrollmentStatus.isPresent()) {
////				EnrollmentStatus status = hivEnrollmentStatus.get();
////				return new HIVStatusDisplay(status.getEnrollmentDate(), "",
////						status.getHivEnrollmentStatus());
////			}
//
//		}
		boolean isRestart = isRestart(clientPreviousInternalQuarterStatus, clientCurrentInternalQuarterStatus);
		
		if (isRestart) {
			return new HIVStatusDisplay(clientCurrentInternalQuarterStatus.getDate(), "ACTIVE RESTART", currentQuarter.getEnd());
		}
//		if (isActiveTransferIn(clientPreviousInternalQuarterStatus, clientCurrentInternalQuarterStatus, enrollmentStatus)) {
//			return new HIVStatusDisplay(clientCurrentInternalQuarterStatus.getDate(), "ACTIVE TRANSFER IN", currentQuarter.getEnd());
//		}
		return new HIVStatusDisplay(clientCurrentInternalQuarterStatus.getDate(),
				clientCurrentInternalQuarterStatus.getDescription(),
				currentQuarter.getEnd());
		
	}
	
	public HIVStatusDisplay getClientReportingStatus(Long personId) {
		Person person = personRepository.findById(personId)
				.orElseThrow(() -> new EntityNotFoundException(Person.class, "id", String.valueOf(personId)));
		LocalDate currentDate = LocalDate.now();
		String personUuid = person.getUuid();
		Quarter currentQuarter = getCurrentQuarter(currentDate);
		HIVInterQuarterStatus clientPreviousInternalQuarterStatus =
				getClientPreviousInternalQuarterStatus(currentDate, personUuid);
		
		EnrollmentStatus enrollmentStatus = getEnrollmentStatus(personUuid);
		//ACTIVE, IIT, null
		HIVInterQuarterStatus clientCurrentInternalQuarterStatus =
				getClientCurrentInternalQuarterStatus(personUuid, currentDate);
		
		//ACTIVE, IIT, null
		if (clientPreviousInternalQuarterStatus == null) {
//			if (isTransferIn(clientCurrentInternalQuarterStatus, enrollmentStatus)) {
//				return new HIVStatusDisplay(clientCurrentInternalQuarterStatus.getDate(), "ACTIVE TRANSFER IN", currentQuarter.getEnd());
//			}
			if (clientCurrentInternalQuarterStatus != null) {
				return new HIVStatusDisplay(clientCurrentInternalQuarterStatus.getDate(),
						clientCurrentInternalQuarterStatus.getDescription(),
						currentQuarter.getEnd());
			}
			
		}
		boolean isRestart = isRestart(clientPreviousInternalQuarterStatus, clientCurrentInternalQuarterStatus);
		
		if (isRestart) {
			return new HIVStatusDisplay(clientCurrentInternalQuarterStatus.getDate(), "ACTIVE RESTART", currentQuarter.getEnd());
		}
//		if (isActiveTransferIn(clientPreviousInternalQuarterStatus, clientCurrentInternalQuarterStatus, enrollmentStatus)) {
//			return new HIVStatusDisplay(clientCurrentInternalQuarterStatus.getDate(), "ACTIVE TRANSFER IN", currentQuarter.getEnd());
//		}
		if (clientCurrentInternalQuarterStatus != null) {
			return new HIVStatusDisplay(clientCurrentInternalQuarterStatus.getDate(),
					clientCurrentInternalQuarterStatus.getDescription(), currentQuarter.getEnd());
		}
		return null;
	}
	
	private static boolean isRestart(HIVInterQuarterStatus clientPreviousInternalQuarterStatus, HIVInterQuarterStatus clientCurrentInternalQuarterStatus) {
		return clientPreviousInternalQuarterStatus != null
				&& (clientPreviousInternalQuarterStatus.getDescription().contains("IIT")
				|| clientPreviousInternalQuarterStatus.getDescription().contains("STOPPED"))
				&& clientCurrentInternalQuarterStatus != null
				&& clientCurrentInternalQuarterStatus.getDescription().contains("ACTIVE");
	}
	
//	private static boolean isActiveTransferIn(
//			HIVInterQuarterStatus clientPreviousInternalQuarterStatus,
//			HIVInterQuarterStatus clientCurrentInternalQuarterStatus,
//			EnrollmentStatus enrollmentStatus) {
//		return clientPreviousInternalQuarterStatus != null
//				&& clientPreviousInternalQuarterStatus.getDescription().contains("ACTIVE")
//				&& clientCurrentInternalQuarterStatus != null
//				&& clientCurrentInternalQuarterStatus.getDescription().contains("ACTIVE")
//				&& enrollmentStatus.getHivEnrollmentStatus() != null
//				&& enrollmentStatus.getHivEnrollmentStatus().contains("In");
//	}
	
//	private static boolean isTransferIn(HIVInterQuarterStatus clientCurrentInternalQuarterStatus, EnrollmentStatus enrollmentStatus) {
//		return enrollmentStatus != null
//				&& enrollmentStatus.getHivEnrollmentStatus() != null
//				&& enrollmentStatus.getHivEnrollmentStatus().contains("In")
//				&& clientCurrentInternalQuarterStatus != null
//				&& clientCurrentInternalQuarterStatus.getDescription().contains("ACTIVE");
//	}
	
	
	public EnrollmentStatus getEnrollmentStatus(String personUuid) {
		return hivEnrollmentRepository.getHivEnrollmentStatusByPersonUuid(personUuid)
				.orElse(null);
		
	}
	
	public List<HIVStatusDisplay> getClientStatusSummary(String personUuid, LocalDate startDate, List<HIVStatusDisplay> statusSummary) {
		HIVInterQuarterStatus clientPreviousInternalQuarterStatus =
				getClientPreviousInternalQuarterStatus(startDate, personUuid);
		if (clientPreviousInternalQuarterStatus == null) {
			return statusSummary;
		}
		statusSummary.add(getClientReportingStatus(personUuid, startDate));
		return getClientStatusSummary(personUuid, getPreviousQuarter(startDate).getEnd(), statusSummary);
	}
	
	public Deque<HIVStatusDisplay> getClientStatusSummaryLimitTwo(String personUuid, LocalDate startDate, Deque<HIVStatusDisplay> statusSummary) {
		HIVInterQuarterStatus clientPreviousInternalQuarterStatus =
				getClientPreviousInternalQuarterStatus(startDate, personUuid);
		Quarter currentQuarter = getCurrentQuarter(startDate);
		if (clientPreviousInternalQuarterStatus == null) {
			HIVInterQuarterStatus clientCurrentInternalQuarterStatus =
					getClientCurrentInternalQuarterStatus(personUuid, startDate);
			if (clientCurrentInternalQuarterStatus != null) {
				statusSummary.push(new HIVStatusDisplay(clientCurrentInternalQuarterStatus.getDate(),
						clientCurrentInternalQuarterStatus.getDescription(), currentQuarter.getEnd()));
			}
			return statusSummary;
		}
		Quarter previousQuarter = getPreviousQuarter(startDate);
		HIVStatusDisplay clientPreviousReportingStatus = getClientReportingStatus(personUuid, previousQuarter.getEnd());
		HIVStatusDisplay clientCurrentReportingStatus = getClientReportingStatus(personUuid, startDate);
		statusSummary.push(clientPreviousReportingStatus);
		statusSummary.push(clientCurrentReportingStatus);
		return statusSummary;
	}
	
	
	public Deque<HIVStatusDisplay> getCurrentAndPreviousClientStatus(String personUuid, LocalDate startDate) {
		Deque<HIVStatusDisplay> result = new ArrayDeque<>();
		return getClientStatusSummaryLimitTwo(personUuid, startDate, result);
		
	}
	
	public String getCurrentStatus(Long personUuid) {
		HIVStatusDisplay clientReportingStatus = getClientReportingStatus(personUuid);
		if (clientReportingStatus != null) {
			return clientReportingStatus.getDescription();
		} else {
			Person person = personRepository.findById(personUuid)
					.orElseThrow(() -> new EntityNotFoundException(Person.class, "id", String.valueOf(personUuid)));
			Optional<EnrollmentStatus> enrollmentStatus = hivEnrollmentRepository.getHivEnrollmentStatusByPersonUuid(person.getUuid());
			if (enrollmentStatus.isPresent()) {
				return enrollmentStatus.get().getHivEnrollmentStatus();
			}
			return "UNKNOWN";
		}
		
	}
	
}
