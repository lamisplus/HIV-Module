package org.lamisplus.modules.hiv.service;

import com.opencsv.CSVReader;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.apache.commons.compress.compressors.CompressorInputStream;
import org.apache.commons.compress.compressors.CompressorStreamFactory;
import org.apache.commons.lang3.StringUtils;
import org.dhatim.fastexcel.*;
import org.jpmml.evaluator.Evaluator;
import org.jpmml.evaluator.EvaluatorUtil;
import org.jpmml.evaluator.LoadingModelEvaluatorBuilder;
import org.springframework.core.io.ClassPathResource;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.URL;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IITMlService {
    @Getter
    @AllArgsConstructor
    public static class IITResult {
        private boolean iit;
        private double chance;
    }

    public interface IHasCategory {
        String getCategory();
    }

    @Getter
    public enum AgeGroup implements IHasCategory {
        U_14("<14"), G_14_20("14-20"), G_21_35("20-35"), G_35(">35");
        private final String category;

        AgeGroup(String group) {
            this.category = group;
        }
    }

    @Getter
    public enum Gender implements IHasCategory {
        MALE("Male"), FEMALE("Female");
        private final String category;

        Gender(String gender) {
            this.category = gender;
        }
    }

    @Getter
    public enum MaritalStatus implements IHasCategory {
        CO_HABITING("Co-Habiting"), DIVORCED("Divorced"), MARRIED("Married"), SEPARATED("Separated"), SINGLE("Single"), WIDOWED("Widowed"), UNKNOWN("N/A");
        private final String category;

        MaritalStatus(String status) {
            this.category = status;
        }
    }

    @Getter
    public enum Education implements IHasCategory {
        JUNIOR_SECONDARY("Junior Secondary"), NONE("None"), POST_SECONDARY("Post Secondary"), PRIMARY("Primary"), QURANIC("Quranic"), SENIOR_SECONDARY("Senior Secondary"), UNKNOWN("N/A");
        private final String category;

        Education(String education) {
            this.category = education;
        }
    }

    @Getter
    public enum Occupation implements IHasCategory {
        EMPLOYED("Employed"), RETIRED("Retired"), STUDENT("Student"), UNEMPLOYED("Unemployed"), UNKNOWN("N/A");
        private final String category;

        Occupation(String occupation) {
            this.category = occupation;
        }
    }

    @Getter
    public enum ClinicStage implements IHasCategory {
        I("Stage I"), II("Stage II"), IV("Stage IV"), V("Stage V"), UNKNOWN("N/A");;
        private final String category;

        ClinicStage(String stage) {
            this.category = stage;
        }
    }

    @Getter
    public enum TBStatus implements IHasCategory {
        ON_INH("Currently on INH prophylaxis"), ON_TB_TREATMENT("Currently on TB treatment"), NO_TB_SIGNS("No sign or symptoms of TB"),
        POSITIVE_NOT_ON_DRUGS("TB positive not on TB drugs"), REFERRED("TB suspected and referred for evaluation"), UNKNOWN("N/A");
        private final String category;

        TBStatus(String status) {
            this.category = status;
        }
    }

    @Getter
    public enum EntryPoint implements IHasCategory {
        ANC("ANC/PMTCT"), CBO("CBO"), HCT("HCT"), IN_PATIENT("In-patient"), OPD("OPD"),
        OTHERS("Others"), OUTREACH("Outreach"), OVC_PARTNER("OVC partner"), STI_CLINIC("STI Clinic"),
        TB_DOTS("TB DOTS"), TRANSFER_IN("Transfer-in"), UNKNOWN("N/A");
        private final String category;

        EntryPoint(String category) {
            this.category = category;
        }
    }

    private final static List<Facility> facilities;
    private final JdbcTemplate jdbcTemplate;
    private static Evaluator evaluator;

    public IITResult evaluate(AgeGroup ageGroup,
                              Gender gender,
                              MaritalStatus maritalStatus,
                              Education education,
                              Occupation occupation,
                              ClinicStage baselineClinicStage,
                              TBStatus baselineTBStatus,
                              EntryPoint careEntryPoint,
                              Boolean domicileLGADifferentFromFacilityLGA,
                              Long facility) {
        if (Objects.isNull(ageGroup)) {
            throw new IllegalArgumentException("Age group is required");
        }
        if (Objects.isNull(gender)) {
            throw new IllegalArgumentException("Gender is required");
        }
        if (Objects.isNull(maritalStatus)) {
            throw new IllegalArgumentException("Marital status is required");
        }
        if (Objects.isNull(education)) {
            throw new IllegalArgumentException("Education is required");
        }
        if (Objects.isNull(occupation)) {
            throw new IllegalArgumentException("Occupation is required");
        }
        if (Objects.isNull(baselineClinicStage)) {
            throw new IllegalArgumentException("Baseline clinic stage is required");
        }
        if (Objects.isNull(baselineTBStatus)) {
            throw new IllegalArgumentException("Baseline TB status is required");
        }
        if (Objects.isNull(careEntryPoint)) {
            throw new IllegalArgumentException("Care entry point is required");
        }
        if (Objects.isNull(facility)) {
            throw new IllegalArgumentException("Facility is required");
        }
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("ageGroup", ageGroup.category);
        parameters.put("Gender", gender.category);
        parameters.put("Marital.Status", maritalStatus.category);
        parameters.put("Education", education.category);
        parameters.put("Occupation", occupation.category);
        parameters.put("Baseline.Clinic.Stage", baselineClinicStage.category);
        parameters.put("Baseline.TB.Status", baselineTBStatus.category);
        parameters.put("Care.Entry.Point", careEntryPoint.category);
        parameters.put("LgaDiff", Objects.isNull(domicileLGADifferentFromFacilityLGA) ? "N/A" : domicileLGADifferentFromFacilityLGA ? 1 : 0);

        Map<String, String> facilityAttributes = getFacilityAttributes(facility);
        parameters.put("Facility.Type", facilityAttributes.get("Facility.Type"));
        parameters.put("Service.Level", facilityAttributes.get("Service.Level"));
        parameters.put("ownership", facilityAttributes.get("ownership"));
        parameters.put("Population.Setting", facilityAttributes.get("Population.Setting"));
        parameters.put("State", facilityAttributes.get("State"));

        Map<String, ?> results = evaluator.evaluate(parameters);
        results = EvaluatorUtil.decodeAll(results);
        try {
            return new IITResult(StringUtils.equals(String.valueOf(results.get("IIT")), "1"),
                    Double.parseDouble(String.valueOf(results.get("probability(1)"))));
        } catch (Exception e) {
            return null;
        }
    }

    public ByteArrayOutputStream computeIITChange(Long facility, LocalDate startDate, LocalDate endDate) throws Exception {
        List<Candidate> candidates = selectCandidates(facility, startDate, endDate);
        candidates = computeCandidates(facility, candidates);
        String facilityName = getFacilityName(facility);

        return generateReport(facilityName, startDate, endDate, candidates);
    }

    public IITResult computeIITChance(Long patient) {
        Candidate candidate = patientAsCandidate(patient);
        if (candidate == null) {
            throw new IllegalArgumentException("Could not find a matching patient with the provided ID or patient has not been commenced on HIV");
        }

        return evaluate(
                fromCategory(AgeGroup.class, candidate.categorizedAge),
                fromCategory(Gender.class, candidate.gender),
                fromCategory(MaritalStatus.class, candidate.maritalStatus),
                fromCategory(Education.class, candidate.education),
                fromCategory(Occupation.class, candidate.occupation),
                fromCategory(ClinicStage.class, candidate.clinicalStage),
                fromCategory(TBStatus.class, candidate.tbStatus),
                fromCategory(EntryPoint.class, candidate.entryPoint),
                lgaDiff(candidate).equals("1") ? Boolean.TRUE : lgaDiff(candidate).equals("0") ? false : null,
                candidate.facilityId
        );
    }

    private Map<String, String> getFacilityAttributes(Long id) {
        if (!facilities.stream().map(Facility::getId).collect(Collectors.toList()).contains(id)) {
            throw new IllegalArgumentException("Could not find a matching facility with the provided ID");
        }
        Map<String, String> facilityAttributes = new HashMap<>();
        String state = getFacilityState(id);
        if (!StringUtils.equals(state, "Akwa Ibom") && !StringUtils.equals(state, "Cross River")) {
            throw new IllegalArgumentException("Only data from Akwa Ibom and Cross River are supported");
        }
        Facility facility = facilities.stream().filter(f -> f.getId().equals(id)).findFirst().get();
        facilityAttributes.put("State", state);
        facilityAttributes.put("Facility.Type", facility.type);
        facilityAttributes.put("Service.Level", facility.level);
        facilityAttributes.put("ownership", facility.ownership);
        facilityAttributes.put("Population.Setting", facility.population);

        return facilityAttributes;
    }

    private List<Candidate> computeCandidates(Long facility, List<Candidate> candidates) {
        return candidates.stream()
                .parallel()
                .map(candidate -> {
                    IITResult result = evaluate(
                            fromCategory(AgeGroup.class, candidate.categorizedAge),
                            fromCategory(Gender.class, candidate.gender),
                            fromCategory(MaritalStatus.class, candidate.maritalStatus),
                            fromCategory(Education.class, candidate.education),
                            fromCategory(Occupation.class, candidate.occupation),
                            fromCategory(ClinicStage.class, candidate.clinicalStage),
                            fromCategory(TBStatus.class, candidate.tbStatus),
                            fromCategory(EntryPoint.class, candidate.entryPoint),
                            lgaDiff(candidate).equals("1") ? Boolean.TRUE : lgaDiff(candidate).equals("0") ? false : null,
                            facility
                    );
                    if (result != null) {
                        candidate.iit = result.iit;
                        candidate.chance = result.chance;
                    }
                    return candidate;
                }).collect(Collectors.toList());
    }

    private Candidate patientAsCandidate(Long patientId) {
        String query = "" +
                "SELECT p.first_name, surname, other_name, hospital_number, gcs.display gender, mscs.display marital_status, ecs.display education, " +
                "      EXTRACT(YEAR FROM AGE(h.date_of_registration, date_of_birth)) age, date_of_birth, escs.display occupation, ou.name facility," +
                "      h.date_of_registration, tbcs.display tb_status, epcs.display entry_point, cm.first_name cm_first_name, cm.last_name cm_last_name," +
                "      cscs.display clinical_stage, (p.address->'address'->0->>'district') lga, ou.parent_organisation_unit_id flga, p.facility_id " +
                "FROM hiv_enrollment h JOIN patient_person p on person_uuid = p.uuid JOIN hiv_art_clinical c ON h.uuid = hiv_enrollment_uuid" +
                "   LEFT JOIN base_application_codeset gcs ON (gender->>'id')::int = gcs.id" +
                "   LEFT JOIN base_application_codeset mscs ON (marital_status->>'id')::int = mscs.id" +
                "   LEFT JOIN base_application_codeset ecs ON (education->>'id')::int = ecs.id" +
                "   LEFT JOIN base_application_codeset escs ON (employment_status->>'id')::int = escs.id" +
                "   LEFT JOIN base_application_codeset tbcs ON tb_status_id = tbcs.id" +
                "   LEFT JOIN base_application_codeset epcs ON entry_point_id = epcs.id" +
                "   LEFT JOIN base_application_codeset cscs ON clinical_stage_id = cscs.id" +
                "   JOIN base_organisation_unit ou ON ou.id = p.facility_id " +
                "   LEFT JOIN case_manager cm ON cm.id = case_manager_id " +
                "WHERE is_commencement = true AND p.archived = 0 AND c.archived = 0 AND h.archived = 0 AND regimen_id IS NOT NULL " +
                "   AND p.id = ?";
        try {
            return jdbcTemplate.queryForObject(query, new BeanPropertyRowMapper<>(Candidate.class), patientId);
        } catch (Exception e) {
            return null;
        }
    }

    private List<Candidate> selectCandidates(Long facility, LocalDate start, LocalDate end) {
        String query = "" +
                "WITH Candidates AS (" +
                "   SELECT p.first_name, surname, other_name, hospital_number, gcs.display gender, mscs.display marital_status, ecs.display education, " +
                "       EXTRACT(YEAR FROM AGE(h.date_of_registration, date_of_birth)) age, date_of_birth, escs.display occupation, ou.name facility," +
                "       h.date_of_registration, tbcs.display tb_status, epcs.display entry_point, cm.first_name cm_first_name, cm.last_name cm_last_name," +
                "       cscs.display clinical_stage, (p.address->'address'->0->>'district') lga, ou.parent_organisation_unit_id flga " +
                "FROM hiv_enrollment h JOIN patient_person p on person_uuid = p.uuid JOIN hiv_art_clinical c ON h.uuid = hiv_enrollment_uuid" +
                "   LEFT JOIN base_application_codeset gcs ON (gender->>'id')::int = gcs.id" +
                "   LEFT JOIN base_application_codeset mscs ON (marital_status->>'id')::int = mscs.id" +
                "   LEFT JOIN base_application_codeset ecs ON (education->>'id')::int = ecs.id" +
                "   LEFT JOIN base_application_codeset escs ON (employment_status->>'id')::int = escs.id" +
                "   LEFT JOIN base_application_codeset tbcs ON tb_status_id = tbcs.id" +
                "   LEFT JOIN base_application_codeset epcs ON entry_point_id = epcs.id" +
                "   LEFT JOIN base_application_codeset cscs ON clinical_stage_id = cscs.id" +
                "   JOIN base_organisation_unit ou ON ou.id = p.facility_id " +
                "   LEFT JOIN case_manager cm ON cm.id = case_manager_id " +
                "WHERE is_commencement = true AND p.archived = 0 AND c.archived = 0 AND h.archived = 0 AND regimen_id IS NOT NULL " +
                "   AND p.facility_id = ? AND h.date_of_registration BETWEEN ? AND ?" +
                ") " +
                "SELECT * FROM Candidates";

        return jdbcTemplate.query(query, new BeanPropertyRowMapper<>(Candidate.class), facility, start, end);
    }

    private ByteArrayOutputStream generateReport(String facility, LocalDate startDate, LocalDate endDate, List<Candidate> candidates) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (Workbook workbook = new Workbook(baos, "IIT ML Report", "1.0");) {
            Worksheet sheet = workbook.newWorksheet("Sheet 1");
            int row = 0;
            workbook.setGlobalDefaultFont("Arial", 10);
            int totalColumns = 18;

            sheet.value(row, 0, facility);
            sheet.style(row++, 0).bold().fontSize(15).horizontalAlignment("center");
            sheet.value(row, 0, "IIT ML Report");
            sheet.style(row++, 0).bold().fontSize(14).horizontalAlignment("center");
            sheet.value(row, 1, "From");
            sheet.style(row, 1).bold().fontName("Arial").fontSize(12).horizontalAlignment("right").set();
            sheet.value(row, 2, startDate.format(DateTimeFormatter.ISO_DATE));
            sheet.style(row++, 2).fontSize(11).horizontalAlignment("right").set();
            sheet.value(row, 1, "To");
            sheet.style(row, 1).bold().fontName("Arial").fontSize(12).horizontalAlignment("right").set();
            sheet.value(row, 2, endDate.format(DateTimeFormatter.ISO_DATE));
            sheet.style(row++, 2).fontSize(11).horizontalAlignment("right").set();

            //Column headers
            sheet.value(++row, 1, "S/N");
            sheet.style(row, 1).bold().fontSize(12).horizontalAlignment("center").borderStyle(BorderStyle.THIN).fillColor(Color.GRAY4).set();
            sheet.value(row, 2, "Name");
            sheet.style(row, 2).bold().fontSize(12).horizontalAlignment("center").borderStyle(BorderStyle.THIN).fillColor(Color.GRAY4).set();
            sheet.value(row, 3, "Hospital No.");
            sheet.style(row, 3).bold().fontSize(12).horizontalAlignment("center").borderStyle(BorderStyle.THIN).fillColor(Color.GRAY4).set();
            sheet.value(row, 4, "Date of Birth");
            sheet.style(row, 4).bold().fontSize(12).horizontalAlignment("center").borderStyle(BorderStyle.THIN).fillColor(Color.GRAY4).set();
            sheet.value(row, 5, "Age");
            sheet.style(row, 5).bold().fontSize(12).horizontalAlignment("center").borderStyle(BorderStyle.THIN).fillColor(Color.GRAY4).set();
            sheet.value(row, 6, "Gender");
            sheet.style(row, 6).bold().fontSize(12).horizontalAlignment("center").borderStyle(BorderStyle.THIN).fillColor(Color.GRAY4).set();
            sheet.value(row, 7, "Marital Status");
            sheet.style(row, 7).bold().fontSize(12).horizontalAlignment("center").borderStyle(BorderStyle.THIN).fillColor(Color.GRAY4).set();
            sheet.value(row, 8, "Education");
            sheet.style(row, 8).bold().fontSize(12).horizontalAlignment("center").borderStyle(BorderStyle.THIN).fillColor(Color.GRAY4).set();
            sheet.value(row, 9, "Occupation");
            sheet.style(row, 9).bold().fontSize(12).horizontalAlignment("center").borderStyle(BorderStyle.THIN).fillColor(Color.GRAY4).set();
            sheet.value(row, 10, "Date of Registration");
            sheet.style(row, 10).bold().fontSize(12).horizontalAlignment("center").borderStyle(BorderStyle.THIN).fillColor(Color.GRAY4).set();
            sheet.value(row, 11, "Care Entry Point");
            sheet.style(row, 11).bold().fontSize(12).horizontalAlignment("center").borderStyle(BorderStyle.THIN).fillColor(Color.GRAY4).set();
            sheet.value(row, 12, "Baseline TB status");
            sheet.style(row, 12).bold().fontSize(12).horizontalAlignment("center").borderStyle(BorderStyle.THIN).fillColor(Color.GRAY4).set();
            sheet.value(row, 13, "Baseline Clinical Stage");
            sheet.style(row, 13).bold().fontSize(12).horizontalAlignment("center").borderStyle(BorderStyle.THIN).fillColor(Color.GRAY4).set();
            sheet.value(row, 14, "Residence LGA status");
            sheet.style(row, 14).bold().fontSize(12).horizontalAlignment("center").borderStyle(BorderStyle.THIN).fillColor(Color.GRAY4).set();
            sheet.value(row, 15, "IIT");
            sheet.style(row, 15).bold().fontSize(12).horizontalAlignment("center").borderStyle(BorderStyle.THIN).fillColor(Color.GRAY4).set();
            sheet.value(row, 16, "IIT Chance");
            sheet.style(row, 16).bold().fontSize(12).horizontalAlignment("center").borderStyle(BorderStyle.THIN).fillColor(Color.GRAY4).set();
            sheet.value(row, 17, "Case Manager");
            sheet.style(row, 17).bold().fontSize(12).horizontalAlignment("center").borderStyle(BorderStyle.THIN).fillColor(Color.GRAY4).set();

            //Data
            for (int i = 0; i < candidates.size(); i++) {
                Candidate candidate = candidates.get(i);
                ++row;
                sheet.value(row, 1, i + 1);
                getStyleSetter(sheet, row, 1).horizontalAlignment("right").set();
                sheet.value(row, 2, candidateName(candidate));
                getStyleSetter(sheet, row, 2).set();
                sheet.value(row, 3, candidate.hospitalNumber);
                getStyleSetter(sheet, row, 3).set();
                sheet.value(row, 4, candidate.dateOfBirth.format(DateTimeFormatter.ISO_DATE));
                getStyleSetter(sheet, row, 4).horizontalAlignment("right").set();
                sheet.value(row, 5, candidate.categorizedAge);
                getStyleSetter(sheet, row, 5).horizontalAlignment("right").set();
                sheet.value(row, 6, candidate.gender);
                getStyleSetter(sheet, row, 6).set();
                sheet.value(row, 7, candidate.maritalStatus);
                getStyleSetter(sheet, row, 7).set();
                sheet.value(row, 8, candidate.education);
                getStyleSetter(sheet, row, 8).set();
                sheet.value(row, 9, candidate.occupation);
                getStyleSetter(sheet, row, 9).set();
                sheet.value(row, 10, candidate.dateOfRegistration.format(DateTimeFormatter.ISO_DATE));
                getStyleSetter(sheet, row, 10).horizontalAlignment("right").set();
                sheet.value(row, 11, candidate.entryPoint);
                getStyleSetter(sheet, row, 11).set();
                sheet.value(row, 12, candidate.tbStatus);
                getStyleSetter(sheet, row, 12).set();
                sheet.value(row, 13, candidate.clinicalStage);
                getStyleSetter(sheet, row, 13).set();
                sheet.value(row, 14, lgaDiff(candidate));
                getStyleSetter(sheet, row, 14).set();
                sheet.value(row, 15, candidate.iit);
                getStyleSetter(sheet, row, 15).horizontalAlignment("right").set();
                sheet.value(row, 16, candidate.chance);
                getStyleSetter(sheet, row, 16).horizontalAlignment("right").set();
                sheet.value(row, 17, caseManagerName(candidate));
                getStyleSetter(sheet, row, 17).set();
            }

            sheet.range(0, 0, 0, totalColumns).style().bold().fontSize(15).horizontalAlignment("center").merge().set();
            sheet.range(1, 0, 1, totalColumns).style().bold().fontSize(14).horizontalAlignment("center").merge().set();
            baos.close();
        }
        return baos;
    }

    private String candidateName(Candidate candidate) {
        return StringUtils.trimToEmpty(candidate.firstName) + " " + StringUtils.trimToEmpty(candidate.surname).trim();
    }

    private String caseManagerName(Candidate candidate) {
        return StringUtils.trimToEmpty(candidate.cmFirstName) + " " + StringUtils.trimToEmpty(candidate.cmLastName).trim();
    }

    private String lgaDiff(Candidate candidate) {
        try {
            int lga = Integer.parseInt(candidate.lga);
            return lga == candidate.flga ? "0" : "1";
        } catch (Exception e) {
            return "N/A";
        }
    }

    private StyleSetter getStyleSetter(Worksheet sheet, int row, int column) {
        return sheet.style(row, column).borderStyle(BorderStyle.THIN).fillColor(row % 2 == 1 ? Color.GRAY1 : Color.WHITE);
    }

    private String getFacilityName(Long id) {
        return jdbcTemplate.queryForObject("SELECT name FROM base_organisation_unit WHERE id = ?", String.class, id);
    }

    private String getFacilityState(Long id) {
        return jdbcTemplate.queryForObject("SELECT s.name FROM base_organisation_unit f JOIN base_organisation_unit l " +
                "ON l.id = f.parent_organisation_unit_id JOIN base_organisation_unit s" +
                " ON s.id  = l.parent_organisation_unit_id WHERE f.id = ?", String.class, id);
    }

    private <T extends Enum<T> & IHasCategory> T fromCategory(Class<T> enumClass, String category) {
        for (T enumConstant : enumClass.getEnumConstants()) {
            if (enumConstant.getCategory().equals(category)) {
                return enumConstant;
            }
        }
        throw new IllegalArgumentException("No enum constant in " + enumClass.getSimpleName() + " for category: " + category);
    }

    @Getter
    @Setter
    public static class Candidate {
        private String firstName;
        private String surname;
        private String otherName;
        private String hospitalNumber;
        private String gender;
        private String maritalStatus;
        private String education;
        private Integer age;
        private String categorizedAge;
        private LocalDate dateOfBirth;
        private String occupation;
        private String facility;
        private LocalDate dateOfRegistration;
        private String tbStatus;
        private String entryPoint;
        private String cmFirstName;
        private String cmLastName;
        private String clinicalStage;
        private String lga;
        private int flga;
        private Boolean lgaDiff;
        private Boolean iit;
        private Double chance;
        private Long facilityId;

        public void setAge(Integer age) {
            this.age = age;
            if (age != null) {
                if (age < 14) {
                    categorizedAge = "<14";
                } else if (age < 20) {
                    categorizedAge = "14-20";
                } else if (age <= 35) {
                    //Age 21 was mapped to category 20-35 in the model training; will be corrected in subsequent updates
                    categorizedAge = "20-35";
                } else {
                    categorizedAge = ">35";
                }
            }
        }

        public void setMaritalStatus(String maritalStatus) {
            if (Arrays.stream(MaritalStatus.values()).map(s -> s.category).collect(Collectors.toList()).contains(maritalStatus)) {
                this.maritalStatus = maritalStatus;
            } else {
                this.maritalStatus = "N/A";
            }
        }

        public void setEducation(String education) {
            if (Arrays.stream(Education.values()).map(s -> s.category).collect(Collectors.toList()).contains(education)) {
                this.education = education;
            } else {
                this.education = "N/A";
            }
        }

        public void setOccupation(String occupation) {
            if (Arrays.stream(Occupation.values()).map(s -> s.category).collect(Collectors.toList()).contains(occupation)) {
                this.occupation = occupation;
            } else {
                this.occupation = "N/A";
            }
        }

        public void setClinicalStage(String stage) {
            ClinicStage clinicStage = Arrays.stream(ClinicStage.values())
                    .filter(s -> StringUtils.equalsIgnoreCase(s.category, stage))
                    .findFirst().orElse(null);
            if (clinicStage != null) {
                this.clinicalStage = clinicStage.category;
            } else {
                this.clinicalStage = "N/A";
            }
        }

        public void setTbStatus(String status) {
            if (Arrays.stream(TBStatus.values()).map(s -> s.category).collect(Collectors.toList()).contains(status)) {
                this.tbStatus = status;
            } else {
                this.tbStatus = "N/A";
            }
        }

        public void setEntryPoint(String entryPoint) {
            if (Arrays.stream(EntryPoint.values()).map(s -> s.category).collect(Collectors.toList()).contains(entryPoint)) {
                this.entryPoint = entryPoint;
            } else {
                this.entryPoint = "N/A";
            }
        }
    }

    @Getter
    @Setter
    public static class Facility {
        private Long id;
        private String name;
        private String type;
        private String level;
        private String ownership;
        private String population;
    }

    static {
        new Thread(() -> {
            // model initialization
            try (InputStream in = new ClassPathResource("installers/hiv/ml/IIT.pmml.xz").getInputStream();
                 BufferedInputStream inputBuffer = new BufferedInputStream(in);
                 CompressorInputStream decompressor = new CompressorStreamFactory()
                         .createCompressorInputStream(inputBuffer)) {

                evaluator = new LoadingModelEvaluatorBuilder()
                        .load(decompressor)
                        .build();
                evaluator.verify();
                System.out.println("Evaluate initialized");
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }).start();

        CSVReader csvReader = null;
        try {
            URL url = IITMlService.class.getClassLoader().getResource("installers/hiv/ml/facilities.csv");
            assert url != null;
            csvReader = new CSVReader(new InputStreamReader(url.openStream()));
        } catch (FileNotFoundException ignored) {
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        assert csvReader != null;
        CsvToBean<Facility> cb = new CsvToBeanBuilder<Facility>(csvReader)
                .withType(Facility.class)
                .build();

        facilities = cb.parse();
        System.out.printf("Facilities loaded: %s\n", facilities);
    }
}
