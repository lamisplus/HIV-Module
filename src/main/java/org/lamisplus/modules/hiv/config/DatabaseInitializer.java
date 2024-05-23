package org.lamisplus.modules.hiv.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.AllArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;


@Component
@AllArgsConstructor
public class DatabaseInitializer  {

    private final JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void populateDatabase() {
        // Check if data already exists in the database
        Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM dsd_outlet", Integer.class);
        if (count != null && count > 0) {
            // Data already exists, return immediately
            return;
        }
        ObjectMapper mapper = new ObjectMapper();
        TypeReference<List<Map<String,Object>>> typeReference = new TypeReference<List<Map<String,Object>>>(){};
        InputStream inputStream = TypeReference.class.getResourceAsStream("/json/outlet.json");
        try {
            List<Map<String,Object>> data = mapper.readValue(inputStream,typeReference);
            data.forEach(item -> {
                jdbcTemplate.update(
                        "INSERT INTO dsd_outlet (im, state, lga, name, dsd_type, archived, created_date, created_by, last_modified_date, last_modified_by) VALUES (?, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP, 'guest@lamisplus.org', CURRENT_TIMESTAMP, 'guest@lamisplus.org')",
                        item.get("IM"), item.get("State"), item.get("LGA"), item.get("Name of Community outlet"), item.get("DSD Type")
                );
            });
        } catch (IOException e){
            System.out.println("Unable to save data: " + e.getMessage());
        }
    }
}