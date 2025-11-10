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
        ? "http://localhost:8383/api/v1/"
        : "/api/v1/";

// export const token =
//     process.env.NODE_ENV === "development"
//         ? process.env.REACT_APP_DEV_JWT
//         : new URLSearchParams(window.location.search).get("jwt");

export const wsUrl =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8383/websocket"
        : "/websocket";

export const audioTranscriptionUrl = process.env.NODE_ENV === "development"

    ? "http://localhost:7860/api/v1"

    : "http://localhost:7860/api/v1";

export const token =
    process.env.NODE_ENV === "development"
        ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzYyNDMyMjcxfQ.jdg_6hf8ZjGckSlophMXErypyiChSo8w_PrYrTI59aPwtTQiA84aqbw_9J8F52x38cmlC1bgGNGsI_D2eH3Leg":  new URLSearchParams(window.location.search).get("jwt");