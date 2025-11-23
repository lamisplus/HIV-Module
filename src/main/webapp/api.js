
export const url =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8383/api/v1/"
        : "/api/v1/";

export const wsUrl =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8383/websocket"
        : "/websocket";

export const audioTranscriptionUrl = process.env.NODE_ENV === "development"

    ? "http://35.173.36.230:7860/api/v1"

    : "http://35.173.36.230:7860/api/v1";

export const token =
    process.env.NODE_ENV === "development"
        ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJyZGUtdXNlciIsImF1dGgiOiJTdXBlciBBZG1pbixVc2VyLFJERSIsIm5hbWUiOiJyZGUtdXNlciBsYXN0bmFtZSIsImV4cCI6MTc2MzkzMDU3M30.nOiqf-niaRzRakBwMON3eUWAFNhKgzwc1e6BOIU2W6Kw6nfc2cYNfmbRGBNivGVXr69t7ID29Kc6iAL3lC8NPg":  
        new URLSearchParams(window.location.search).get("jwt");




        