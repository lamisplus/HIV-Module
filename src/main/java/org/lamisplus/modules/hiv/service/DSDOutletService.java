package org.lamisplus.modules.hiv.service;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.hiv.domain.dto.DsdOutletDTO;
import org.lamisplus.modules.hiv.domain.entity.DSDOutlet;
import org.lamisplus.modules.hiv.repositories.DSDOutletRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DSDOutletService {

    private final DSDOutletRepository dsdOutletRepository;

    public List<DsdOutletDTO>  getByLga(String lga) {
        List<DSDOutlet> dsdOutlets = dsdOutletRepository.findByLga(lga, 0);
        if(dsdOutlets.isEmpty()){
            return new ArrayList<>();
        }
        return dsdOutlets.stream().map(this::mapToDto).collect(Collectors.toList());
    }
    private DsdOutletDTO mapToDto(DSDOutlet dsdOutlet) {
        DsdOutletDTO dto = new DsdOutletDTO();
        dto.setId(dsdOutlet.getId());
        dto.setIm(dsdOutlet.getIm());
        dto.setState(dsdOutlet.getState());
        dto.setLga(dsdOutlet.getLga());
        dto.setName(dsdOutlet.getName());
        dto.setOutletDsdType(dsdOutlet.getOutletDsdType());
        dto.setCode(dsdOutlet.getCode());
        return dto;
    }

    public List<DsdOutletDTO> getAll() {
        List<DSDOutlet> dsdOutlets = dsdOutletRepository.findAll();
        if(dsdOutlets.isEmpty()){
            return new ArrayList<>();
        }
        return dsdOutlets.stream().map(this::mapToDto).collect(Collectors.toList());
    }
}
