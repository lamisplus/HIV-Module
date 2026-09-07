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

    ? "http://13.245.108.34:7860/api/v1"

    : "http://96.0.47.224:7860/api/v1";

export const token =
    process.env.NODE_ENV === "development"
        ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluLFJERSIsImV4cCI6MTc4NjEzNDU4NSwibmFtZSI6Ikd1ZXN0IEd1ZXN0In0.dj2weoI9MqIfYahRHAjFvMK_j3_r60tJVY8brvxER2v40ts2zZmu3DsrDRj0ZFfGx9y8uVM_NvbJ2wBLqPGb4Q" : new URLSearchParams(window.location.search).get("jwt");