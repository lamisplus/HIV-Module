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
        ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluLFVzZXIsUkRFIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzU5ODI1MDg5fQ.kRDMsO2oxYj83cITMUCFKgBQc3cJqzCzg_r5JmD_Gjf_okOkhdY2vbm-SypfJ11Nk0VFKoB4xgDpTiN1xZuMPw"  : new URLSearchParams(window.location.search).get("jwt");