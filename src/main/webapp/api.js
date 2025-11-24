
export const url =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8383/api/v1/"
        : "/api/v1/";

export const wsUrl =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8383/websocket"
        : "/websocket";

export const audioTranscriptionUrl = process.env.NODE_ENV === "development"

    ? "http://100.24.122.103:7860/api/v1"

    : "http://100.24.122.103:7860/api/v1";

export const token =
    process.env.NODE_ENV === "development"
        ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJyZGUtdXNlciIsImF1dGgiOiJTdXBlciBBZG1pbixVc2VyLFJERSIsIm5hbWUiOiJyZGUtdXNlciBsYXN0bmFtZSIsImV4cCI6MTc2Mzk5NjA4N30.6HOjG3JhLoeR8A13lBmNbFnd3I3UHJasRF9DoGDIQMuQEZaDioburJsR2Bwfp7lAU3teh6mhYICKay7RGLfnFg":  
        new URLSearchParams(window.location.search).get("jwt");




        