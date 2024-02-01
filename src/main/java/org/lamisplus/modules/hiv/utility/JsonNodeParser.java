package org.lamisplus.modules.hiv.utility;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

public class JsonNodeParser {
    private final ObjectMapper mapper = new ObjectMapper();
    public JsonNode parseJsonString(String jsonString) {
        try {
            if (jsonString != null) {
                return mapper.readTree(jsonString);
            }
            return null;
        } catch (IOException e) {
            System.err.println("Error parsing JSON string: " + e);
            return null;
        }
    }
}
