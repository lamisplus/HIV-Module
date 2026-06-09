package org.lamisplus.modules.hiv.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;

import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
@Slf4j
public class MaterializedViewInitializer {

    private final JdbcTemplate jdbcTemplate;

    @EventListener(ApplicationReadyEvent.class)
    public void initializeMaterializedView() {
        try {
            log.info("Checking if materialized view mv_viral_load_eligibility exists...");

            // Check if materialized view exists
            Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM pg_matviews WHERE matviewname = 'mv_viral_load_eligibility'",
                Integer.class
            );

            if (count != null && count > 0) {
                log.info("Materialized view mv_viral_load_eligibility already exists");
                return;
            }

            log.info("Materialized view not found. Creating indexes and materialized view...");

            // Execute the SQL from classpath resource
            ClassPathResource resource = new ClassPathResource("installers/hiv/schema/sql/viral_load_optimization.sql");
            String sql = FileCopyUtils.copyToString(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8));

            // Split by semicolon and execute each statement
            String[] statements = sql.split(";");
            for (String statement : statements) {
                String trimmed = statement.trim();
                if (!trimmed.isEmpty() && !trimmed.startsWith("--")) {
                    jdbcTemplate.execute(trimmed);
                }
            }

            log.info("Successfully created materialized view and indexes for viral load eligibility");

            // Initial refresh
            log.info("Performing initial data population...");
            jdbcTemplate.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_viral_load_eligibility");
            log.info("Materialized view populated successfully");

        } catch (Exception e) {
            log.error("Error initializing materialized view", e);
            // Don't throw exception - allow application to start even if this fails
        }
    }
}
