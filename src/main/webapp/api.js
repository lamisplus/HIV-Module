export const url =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8789/api/v1/"
        : "/api/v1/";

// export const token =
//     process.env.NODE_ENV === "development"
//         ? process.env.REACT_APP_DEV_JWT
//         : new URLSearchParams(window.location.search).get("jwt");

export const wsUrl =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8789/websocket"
        : "/websocket";

export const audioTranscriptionUrl = process.env.NODE_ENV === "development"

    ? "http://96.0.47.224:7860/api/v1"

    : "http://96.0.47.224:7860/api/v1";

export const token =
    process.env.NODE_ENV === "development"
        ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlY2V3c0FDRTUiLCJhdXRoIjoiU3VwZXIgQWRtaW4sUkRFIiwiZXhwIjoxNzcxMzkzOTIwLCJuYW1lIjoiRUNFV1MgQUNFNSJ9.7BjfwWOtVSTc-1adKa0txavF4XAJ1V4k9ICBoFVTX9CP-MIGaM_a9E5QCt7Ca3E6FvKybJok_QcFf9ypDrJiYw" : new URLSearchParams(window.location.search).get("jwt");