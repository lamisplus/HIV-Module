package org.lamisplus.modules.hiv.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.hiv.domain.dto.PatientFlagConfigsDto;
import org.lamisplus.modules.hiv.domain.dto.PatientFlagDto;
import org.lamisplus.modules.hiv.domain.entity.PatientFlag;
import org.lamisplus.modules.hiv.repositories.PatientFlagRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import reactor.util.UUIDUtils;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatientFlagService {
    private final PatientFlagRepository patientFlagRepository;
    private final CurrentUserOrganizationService currentUserOrganizationService;
    private static final int UN_ARCHIVED = 0;
    private static final int ARCHIVED = 1;

    public PatientFlagDto createOrUpdatePatientFlag(PatientFlagDto patientFlagDto) {
        PatientFlag patientFlag;
        if (patientFlagDto.getId() != null) {
            Optional<PatientFlag> existingPatientFlagOpt = patientFlagRepository.findById(patientFlagDto.getId());
            if (existingPatientFlagOpt.isPresent()) {
                patientFlag = existingPatientFlagOpt.get();
                BeanUtils.copyProperties(patientFlagDto, patientFlag, "id", "uuid", "facilityId");
            } else {
                patientFlag = new PatientFlag();
                BeanUtils.copyProperties(patientFlagDto, patientFlag);
                patientFlag.setFacilityId(currentUserOrganizationService.getCurrentUserOrganization());
                patientFlag.setUuid(UUIDUtils.random().toString());
            }
        } else {
            patientFlag = new PatientFlag();
            BeanUtils.copyProperties(patientFlagDto, patientFlag);
            patientFlag.setFacilityId(currentUserOrganizationService.getCurrentUserOrganization());
            patientFlag.setUuid(UUIDUtils.random().toString());
        }
        return convertPatientFlagToDto(patientFlagRepository.save(patientFlag));
    }


    private PatientFlagDto convertPatientFlagToDto(PatientFlag patientFlag) {
        return PatientFlagDto.builder()
                .id(patientFlag.getId())
                .surpressionValue(patientFlag.getSurpressionValue())
                .uuid(patientFlag.getUuid())
                .build();
    }

    public String deleteFlag (Long id) {
        PatientFlag patientFlag = patientFlagRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException(PatientFlag.class, "id", String.valueOf(id)));
        patientFlag.setArchived(ARCHIVED);
        patientFlagRepository.save(patientFlag);
        return "Successfully deleted ...";
    }

    public List<PatientFlagConfigsDto> getPatientFlagsConfigs (Long facilityId) {
        facilityId = currentUserOrganizationService.getCurrentUserOrganization();
       List <PatientFlagConfigsDto> configs = patientFlagRepository.getAllConfigs(facilityId);
       return configs;
    }
}
