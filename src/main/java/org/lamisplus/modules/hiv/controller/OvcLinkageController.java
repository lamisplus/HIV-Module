package org.lamisplus.modules.hiv.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.util.PaginationUtil;
import org.lamisplus.modules.hiv.domain.dto.LinkageResponseInterface;
import org.lamisplus.modules.hiv.domain.entity.OvcLinkage;
import org.lamisplus.modules.hiv.service.LinkageService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.util.List;

@RequestMapping("/api/v1/linkages")
@RestController
@RequiredArgsConstructor
@Api
@Slf4j
public class OvcLinkageController {
    private final LinkageService linkageService;

    @PostMapping("/import")
    @ApiOperation(value = "Import an existing linkage from a file")
    public ResponseEntity<String> importFile(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw  new IllegalArgumentException("File cannot be empty");
        }
        String msg = "file not imported successfully";
        if(linkageService.importJsonFromFile(file)) {
            msg = "File imported successfully";
        }
        return ResponseEntity.ok().body(msg);
    }

    @GetMapping ("")
    @ApiOperation(value = "return a list of imported OVC clients")
    public ResponseEntity<List<OvcLinkage>> importFile(){
        return ResponseEntity.ok(linkageService.getOvcLinkageList());
    }

    @GetMapping("/export")
    @ApiOperation(value = "export ovc linkage clients records")
    public ResponseEntity<String> exportOvcJson() {
        String message = linkageService.exportRecordsToJson();
        HttpStatus status = message.equals("None") ? HttpStatus.NO_CONTENT : HttpStatus.OK;
        return new ResponseEntity<>(message, status);
    }

    @GetMapping(value = "/enrolled_ovc_clients",  produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Generate enrolled ovc clients")
    public ResponseEntity<List<LinkageResponseInterface>> getEnrolledOvcClients(Pageable pageable) {
        final Page<LinkageResponseInterface> page = linkageService.getPagedEnrolledOvcClients(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }
}
