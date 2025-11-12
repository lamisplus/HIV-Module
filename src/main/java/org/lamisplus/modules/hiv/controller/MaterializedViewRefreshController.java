package org.lamisplus.modules.hiv.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.hiv.service.MaterializedViewRefreshService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/hiv/materialized-view")
@RequiredArgsConstructor
@Slf4j
public class MaterializedViewRefreshController {

    private final MaterializedViewRefreshService materializedViewRefreshService;

    /**
     * Initialize (create) the materialized view if it doesn't exist
     * POST /api/hiv/materialized-view/initialize
     */
    @PostMapping("/initialize")
    public ResponseEntity<Map<String, String>> initializeViralLoadView() {
        try {
            log.info("Initializing viral load eligibility materialized view via API");
            materializedViewRefreshService.initializeMaterializedView();

            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Viral load eligibility materialized view initialized successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error initializing materialized view via API", e);

            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Failed to initialize materialized view: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Manually trigger refresh of viral load eligibility materialized view
     * POST /api/hiv/materialized-view/refresh
     */
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refreshViralLoadView() {
        try {
            log.info("Manual refresh of viral load eligibility view triggered via API");
            materializedViewRefreshService.manualRefreshViralLoadEligibilityView();

            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Viral load eligibility materialized view refreshed successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error refreshing materialized view via API", e);

            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Failed to refresh materialized view: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get the last refresh time of the materialized view
     * GET /api/hiv/materialized-view/last-refresh
     */
    @GetMapping("/last-refresh")
    public ResponseEntity<Map<String, String>> getLastRefreshTime() {
        try {
            String lastRefreshTime = materializedViewRefreshService.getLastRefreshTime();

            Map<String, String> response = new HashMap<>();
            response.put("lastRefresh", lastRefreshTime);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting last refresh time", e);

            Map<String, String> response = new HashMap<>();
            response.put("error", "Unable to retrieve last refresh time");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
