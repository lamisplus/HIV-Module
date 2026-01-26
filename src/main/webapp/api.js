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
        ? "" : new URLSearchParams(window.location.search).get("jwt");