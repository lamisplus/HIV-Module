package org.lamisplus.modules.hiv.controller;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.hibernate.annotations.GeneratorType;
import org.lamisplus.modules.hiv.apiError.ApiError;
import org.lamisplus.modules.hiv.domain.dto.*;
import org.lamisplus.modules.hiv.service.DsdDevolvementService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.*;



@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/hiv/art/pharmacy/devolve")
public class DsdDevolvementController {
    private final DsdDevolvementService devolvementService;

//    @PostMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
//    ResponseEntity<DsdDevolvementDTO> saveDsdDevolvement(@RequestBody  DsdDevolvementDTO  dto) throws IOException {
//        try {
//            return new ResponseEntity<>(devolvementService.saveDsdDevolvement(dto), HttpStatus.OK);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//
//    }

    @GetMapping(value = "/patient/{personId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> checkIfPatientHasBeenDevolved(@PathVariable("personId") String personId) {
        boolean result = devolvementService.checkIfPatientHasBeenDevolved(personId);
        return ResponseEntity.ok(result);
    }

    @PostMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> saveDsdDevolvement(@RequestBody DsdDevolvementDTO dto) {
        try {
            return new ResponseEntity<>(devolvementService.saveDsdDevolvement(dto), HttpStatus.OK);
        } catch (RuntimeException e) {
            ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, e.getMessage());
            return new ResponseEntity<>(apiError, apiError.getStatus());
        } catch (Exception e) {
            e.printStackTrace();
            ApiError apiError = new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
            return new ResponseEntity<>(apiError, apiError.getStatus());
        }
    }

    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<DsdDevolvementDTO> updateDsdDevolvement(@PathVariable("id") Long id, @RequestBody DsdDevolvementDTO dto) throws IOException{
        try{
            return ResponseEntity.ok (devolvementService.updateDsdDevolvement(id, dto));
        }catch(Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value="/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<DsdDevolvementDTO> getDevolvementById(@PathVariable("id") Long id){
        try {
            return ResponseEntity.ok (devolvementService.getDevolvementById(id));
        } catch (Exception e) {
           e.printStackTrace();
           return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/devolvements", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<DsdDevolvementDTO>> getDsdDevolvementByPersonId(@RequestParam(defaultValue = "0") Integer pageNo, @RequestParam(defaultValue = "10") Integer pageSize, @RequestParam Long personId) {
        try {
            return ResponseEntity.ok (devolvementService.getDsdDevolvementByPersonId(personId, pageNo, pageSize));
        }catch (Exception e){
            e.printStackTrace();
            return  new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value="/current-viral-load", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Optional<CurrentViralLoadDTO>> getCurrentViralLoadByPersonId(@RequestParam Long personId){
        Optional<CurrentViralLoadDTO> currentViralLoad = devolvementService.getCurrentViralLoadByPersonId(personId);

        if(currentViralLoad.isPresent()) {
            return new ResponseEntity<>(currentViralLoad, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<String> deleteDevolvementById(@PathVariable("id") Long id){
        try {
            return ResponseEntity.ok(devolvementService.deleteById(id));
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping(value = "/get-patient-current-viral-load/{personUuid}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getPatientCurrentViralLoadByPersonUuid(@PathVariable("personUuid") String personUuid) {
        try {
            Optional<PatientCurrentViralLoad> patientCurrentViralLoad = devolvementService.getPatientCurrentViralLoadByPersonUuid(personUuid);
            if (patientCurrentViralLoad.isPresent()) {
                return new ResponseEntity<>(patientCurrentViralLoad, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Patient's current viral load not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("An error occurred while retrieving patient's current viral load", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/client-tracking-details", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Optional<ClientDetailDTOForTracking>> getClientTrackingdetails(@RequestParam String personUuid) {
        return ResponseEntity.ok(devolvementService.getClientDetailDTOForTracking(personUuid));
    }

}
