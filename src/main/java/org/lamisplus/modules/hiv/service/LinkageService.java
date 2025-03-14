package org.lamisplus.modules.hiv.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.compress.utils.IOUtils;
import org.lamisplus.modules.hiv.domain.dto.LinkageResponse;
import org.lamisplus.modules.hiv.domain.dto.LinkageResponseInterface;
import org.lamisplus.modules.hiv.domain.entity.OvcLinkage;
import org.lamisplus.modules.hiv.repositories.LinkageRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.*;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;


@Slf4j
@Service
@RequiredArgsConstructor
public class LinkageService {
    private final LinkageRepository repository;
    private static final String ENTITY_NAME = "ovc_linkage";
    private static final String FILE_TYPE = "JSON";
    SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmm");
    private static final String LINKAGE_EXPORT = System.getProperty("user.dir") + File.separator + "export" + File.separator + "linkage";
    private static final String LINKAGE_IMPORT = System.getProperty("user.dir") + File.separator + "import" + File.separator + "linkage";
    
    public List<OvcLinkage> save(List<OvcLinkage> entities) {
        List<OvcLinkage> updateLinkage = new ArrayList<>();
        for (OvcLinkage entity : entities) {
            Optional<OvcLinkage> optionalLinkage = repository.findByOvcUniqueId(entity.getOvcUniqueId());
            if (optionalLinkage.isPresent()) {
                OvcLinkage update = optionalLinkage.get();
                entity.setId(update.getId());
                entity.setHouseholdUniqueId(update.getHouseholdUniqueId());
            } else {
                entity.setId(UUID.randomUUID());
            }
            updateLinkage.add(entity);
        }
        entities.clear();
        
        return repository.saveAll(updateLinkage);
    }
    
    
    public List<OvcLinkage> getOvcLinkageList() {
      return repository.getAllOvcLinages()
               .stream()
               .filter(o-> o.getArchived()== 0)
               .collect(Collectors.toList());
    }
    
    public Optional<OvcLinkage> findById(UUID id) {
        return repository.findById(id);
    }
    
    public List<OvcLinkage> findAll() {
        return repository.findAll().stream().sorted(Comparator.comparing(OvcLinkage::getLastModifiedDate).reversed()).collect(Collectors.toList());
    }
    
    public OvcLinkage update(OvcLinkage entity, UUID id) {
        entity.setId(id);
        
        return repository.save(entity);
    }
    
    public List<OvcLinkage> findByDatimCode(String datimCode) {
        return repository.findByDatimCode(datimCode);
    }
    
    public Optional<OvcLinkage> findByArtNumber(String artNumber) {
        return repository.findByArtNumber(artNumber);
    }
    
    public Optional<OvcLinkage> findByOvcUniqueId(String ovcUniqueId) {
        return repository.findByOvcUniqueId(ovcUniqueId);
    }
    
    public List<OvcLinkage> findByHouseholdUniqueId(String householdUniqueId) {
        return repository.findByHouseholdUniqueId(householdUniqueId);
    }

    
    public boolean importJsonFromFile(MultipartFile file) throws IOException {
        boolean result = false;
        String jsonObjectFilePath = LINKAGE_IMPORT + File.separator + file.getOriginalFilename();
        file.transferTo(new File(jsonObjectFilePath));
        List<OvcLinkage> linkageList = jsonFileToObjectList(jsonObjectFilePath);
        linkageList = save(linkageList);
        if (!linkageList.isEmpty()) {
            result = true;
        }
        return result;
    }
    
    @PostConstruct
    public void init() {
        createDirectoryIfNotExists(LINKAGE_EXPORT);
        createDirectoryIfNotExists(LINKAGE_IMPORT);
    }
    
    public Set<String> listFilesUsingDirectoryStream() throws IOException {
        final Set<String> fileList = new HashSet<>();
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(Paths.get(LINKAGE_EXPORT))) {
            for (Path path : stream) {
                if (!Files.isDirectory(path)) {
                    fileList.add(path.getFileName().toString());
                }
            }
        }
        return fileList;
    }
    
    @SneakyThrows
    public ByteArrayOutputStream downloadFile(String fileName) {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        final Optional<String> fileToDownload = listFilesUsingDirectoryStream().stream()
                .filter(f -> f.equals(fileName))
                .findFirst();
        fileToDownload.ifPresent(s -> {
            try (InputStream is = Files.newInputStream(Paths.get(s))) {
                IOUtils.copy(is, byteArrayOutputStream);
            } catch (IOException exception) {
                log.debug("An error occurred while downloading file: {}", exception.getMessage());
            }
        });
        
        return byteArrayOutputStream;
    }

    private void writeObjectToFile(String jsonObject, String jsonFilePath) throws IOException {
        try(FileWriter writer = new FileWriter(jsonFilePath)){
            writer.write(jsonObject);
        } catch (IOException exception) {
            log.debug("Exception: {}", exception.getMessage());
        }
        
    }
    
    private List<OvcLinkage> jsonFileToObjectList(String jsonFilePath){
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        objectMapper.configure(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES, false);
        objectMapper.configure(DeserializationFeature.FAIL_ON_NUMBERS_FOR_ENUMS, false);
        List<OvcLinkage> objectList = new ArrayList<>();
        try {
            if (jsonFilePath != null) {
                
                Path  path = Paths.get("json");
                File file = new File(jsonFilePath);
                if (file.exists()) {
                    CollectionType javaType =
                            objectMapper.getTypeFactory().constructCollectionType(List.class, OvcLinkage.class);
                    objectList = objectMapper.readValue(file, javaType);
                } else {
                    log.error("File " + jsonFilePath + " does not exist");
                    return new ArrayList<>();
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        
        return objectList;
    }
    
    private void createDirectoryIfNotExists(String directoryPath) {
        File directory = new File(directoryPath);
        if (!directory.exists()) {
            if (directory.mkdirs()) {
            } else {
                log.error("Failed to create the directory: " + directory.getAbsolutePath());
            }
        }
    }


    public LinkageResponse convertToLinkageResponseDto(OvcLinkage ovcLinkage) {
        LinkageResponse response = new LinkageResponse();
        response.setArtNumber(ovcLinkage.getArtNumber());
        response.setArvRegimen(ovcLinkage.getArvRegimen());
        response.setDateTested(ovcLinkage.getDateTested());
        response.setArtEnrollmentDate(ovcLinkage.getArtEnrollmentDate());
        response.setVlTestDate(ovcLinkage.getVlTestDate());
        response.setVlResult(ovcLinkage.getVlResult());
        response.setVlResultDate(ovcLinkage.getVlResultDate());
        response.setLastName(ovcLinkage.getLastName());
        response.setOtherName(ovcLinkage.getOtherName());
        response.setGender(ovcLinkage.getGender());
        response.setBirthDate(formatDate(ovcLinkage.getBirthDate()));
        response.setFacilityState(ovcLinkage.getFacilityState());
        response.setFacilityLga(ovcLinkage.getFacilityLga());
        response.setFacilityUid(ovcLinkage.getFacilityUid());
        response.setFacilityName(ovcLinkage.getFacilityName());
        response.setDatimCode(ovcLinkage.getDatimCode());
        response.setStateOfResidence(ovcLinkage.getStateOfResidence());
        response.setLgaOfResidence(ovcLinkage.getLgaOfResidence());
        response.setEntryPoint(ovcLinkage.getEntryPoint());
        response.setOfferedOvcFromFacility(ovcLinkage.getOfferedOvcFromFacility());
        response.setOfferAccepted(ovcLinkage.getOfferAccepted());
        response.setShareContactWithOvc(ovcLinkage.getShareContactWithOvc());
        response.setReasonForDecline(ovcLinkage.getReasonForDecline());
        response.setDrugRefillNotification(ovcLinkage.getDrugRefillNotification());
        response.setPhoneNumber(ovcLinkage.getPhoneNumber());
        response.setCaregiverSurname(ovcLinkage.getCaregiverSurname());
        response.setCaregiverOtherName(ovcLinkage.getCaregiverOtherName());
        response.setOfferDate(formatDate(ovcLinkage.getOfferDate()));
        response.setEnrollmentDate(formatDate(ovcLinkage.getEnrollmentDate()));
        response.setOvcUniqueId(ovcLinkage.getOvcUniqueId());
        response.setHouseholdUniqueId(ovcLinkage.getHouseholdUniqueId());
        response.setEnrolledInOvcProgram(ovcLinkage.getEnrolledInOvcProgram());
        response.setArchived(ovcLinkage.getArchived());
        response.setCboName(ovcLinkage.getCboName());
        response.setFacilityStaffName(ovcLinkage.getFacilityStaffName());

        return response;
    }

    private String formatDate(LocalDate date) {
        return date != null ? date.toString() : null;
    }


    public List<LinkageResponse> convertToResponseList(List<OvcLinkage> ovcLinkages) {
        return ovcLinkages.stream()
                .map(this::convertToLinkageResponseDto)
                .collect(Collectors.toList());
    }

    public String exportRecordsToJson() {
        try {
            List<LinkageResponseInterface> linkageList = getAllEnrolledOvcClients();
            if (!linkageList.isEmpty()) {
                String filePath = LINKAGE_EXPORT + File.separator + "ovc_linkage_" + df.format(new java.util.Date()) + ".json";
                String json = objectToJson(linkageList);
                writeObjectToFile(json, filePath);
                return "File exported successfully.";
            } else {
                return "No records found to export";
            }
        } catch (IOException exception) {
            log.error("Error exporting records to JSON: {}", exception.getMessage());
            return "Error exporting records to JSON: " + exception.getMessage();
        }
    }


    private String objectToJson(Object object) {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        objectMapper.configure(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES, false);
        objectMapper.configure(DeserializationFeature.FAIL_ON_NUMBERS_FOR_ENUMS, false);
        try {
            // Convert the object to a JSON string using the correct collection type
            CollectionType javaType = objectMapper.getTypeFactory().constructCollectionType(List.class, LinkageResponse.class);
            return objectMapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            log.error("Error converting object to JSON: {}", e.getMessage());
            return null;
        }
    }

    @Transactional(readOnly = true)
    public Page<LinkageResponseInterface> getPagedEnrolledOvcClients(Pageable pageable) {
        List<LinkageResponseInterface> enrolledClients = getAllEnrolledOvcClients();

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), enrolledClients.size());

        return new PageImpl<>(enrolledClients.subList(start, end), pageable, enrolledClients.size());
    }

    public List<LinkageResponseInterface> getAllEnrolledOvcClients() {
        return repository.findAllEnrolledOvcClients();
    }


}