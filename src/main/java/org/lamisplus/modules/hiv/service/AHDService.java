package org.lamisplus.modules.hiv.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.hiv.domain.dto.AHDInterface;
import org.lamisplus.modules.hiv.repositories.HivEnrollmentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.List;

import static org.lamisplus.modules.hiv.utility.Constants.UNARCHIVED;

@RequiredArgsConstructor
@Service
@Slf4j
public class AHDService {

    private final HivEnrollmentRepository hivEnrollmentRepository;

    public Page<AHDInterface> getAHDFlagByArchivedAndFacilityId(Long facilityId, Integer page, Integer size) {

        List<AHDInterface> ahdInterfaceList = hivEnrollmentRepository.getAHDFlagByArchivedAndFacilityId(UNARCHIVED, facilityId);
        if (CollectionUtils.isEmpty(ahdInterfaceList)) {
            return Page.empty();
        }

        int pageNumber = page != null ? page : 0;
        int pageSize = size != null ? size : ahdInterfaceList.size();


        Pageable pageable = PageRequest.of(pageNumber, pageSize);


        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), ahdInterfaceList.size());


        List<AHDInterface> paginatedList = ahdInterfaceList.subList(start, end);

        return new PageImpl<>(paginatedList, pageable, ahdInterfaceList.size());
    }

}
