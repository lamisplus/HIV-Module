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
        ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluLFVzZXIsUkRFIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzYyNDQyMjQzfQ.9BCS-nqKcHrHnly9mCNnmWTA4VMFJbP8Iz3rb8fDpd5Ck93E57P97yweE4XR0aXDq3-It5Q3XX3Tc1Q3PivVIQ":  new URLSearchParams(window.location.search).get("jwt");