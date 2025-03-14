package org.lamisplus.modules.hiv.controller;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.hiv.service.IITMlService;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/hiv/iit-ml/")
public class IITMLController {
    private final IITMlService mlService;

    @GetMapping("/iit-report")
    public IITMlService.IITResult getIITReport(
            @RequestParam IITMlService.AgeGroup ageGroup,
            @RequestParam IITMlService.Gender gender,
            @RequestParam IITMlService.MaritalStatus maritalStatus,
            @RequestParam IITMlService.Education education,
            @RequestParam IITMlService.Occupation occupation,
            @RequestParam IITMlService.ClinicStage baselineClinicStage,
            @RequestParam IITMlService.TBStatus baselineTBStatus,
            @RequestParam IITMlService.EntryPoint careEntryPoint,
            @RequestParam(required = false) Boolean domicileLGADifferentFromFacilityLGA,
            @RequestParam Long facility
    ) {
        return mlService.evaluate(ageGroup, gender, maritalStatus, education, occupation, baselineClinicStage, baselineTBStatus, careEntryPoint, domicileLGADifferentFromFacilityLGA, facility);
    }

    @GetMapping("/patient/{patientId}/iit-report")
    public IITMlService.IITResult getPatientIITReport(@PathVariable Long patientId) {
        return mlService.computeIITChance(patientId);
    }

    @GetMapping("/download-report")
    public void iitReport(@RequestParam LocalDate startDate, @RequestParam LocalDate endDate, @RequestParam Long facility, HttpServletResponse response) throws Exception {
        ByteArrayOutputStream out = mlService.computeIITChange(facility, startDate, endDate);
        setStream(out, response);
    }

    private void setStream(ByteArrayOutputStream baos, HttpServletResponse response) throws IOException {
        response.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Length", Integer.valueOf(baos.size()).toString());
        response.setHeader("Content-Disposition", "attachment; filename=\"ML IIT Report.xlsx\"");
        OutputStream outputStream = response.getOutputStream();
        outputStream.write(baos.toByteArray());
        outputStream.close();
        response.flushBuffer();
    }
}
