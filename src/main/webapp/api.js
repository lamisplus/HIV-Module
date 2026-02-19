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
        ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlY2V3c0FDRTUiLCJhdXRoIjoiU3VwZXIgQWRtaW4sUkRFIiwiZXhwIjoxNzcxNDkxMjUwLCJuYW1lIjoiRUNFV1MgQUNFNSJ9.tHe5Y3DqTbyJlOY2TxOOuuk2UyrgJNPsZ3o5DRzYs1EMECUpMiWGdmELqaRzhuhUHfgMk9De4jbjD8ioAgScjA" : new URLSearchParams(window.location.search).get("jwt");