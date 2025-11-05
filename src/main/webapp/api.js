// xport const url =
//     process.env.NODE_ENV === "development"
//         ? "http://localhost:8789/api/v1/"
//         : "/api/v1/";
//
// export const token =
//     process.env.NODE_ENV === "development"
//         ? process.env.REACT_APP_DEV_JWT
//         : new URLSearchParams(window.location.search).get("jwt");
//
// console.log("Environment:", process.env.NODE_ENV);
// console.log("Token:", token);
// console.log("API URL:", url);
// export const wsUrl =
//     process.env.NODE_ENV === "development"
//         ? "http://localhost:8789/websocket"
//         : "/websocket";e



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

export const token =
    process.env.NODE_ENV === "development"
        ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluLFVzZXIsUkRFIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzYyMzQxNzE2fQ.i0F2icPqvS4aqYFa8eTAiJmKW_6k7gb4tnZnGjXMnKoX66qDc8BXbLRNxuh3KoEWJ05gxz4xaoxH6TdMQnALpw":  new URLSearchParams(window.location.search).get("jwt");