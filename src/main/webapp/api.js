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

    ? "http://13.245.108.34:7860/api/v1"

    : "http://13.245.108.34:7860/api/v1";

export const token =
    process.env.NODE_ENV === "development"
        ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJyZGUtdXNlciIsImF1dGgiOiJTdXBlciBBZG1pbixVc2VyLFJERSIsImV4cCI6MTc4NTc3MzgyNywibmFtZSI6InJkZS11c2VyIGxhc3RuYW1lIn0.hMd8nF6xuzk0YEzsBlHX4-6vW4ZpjyOkC_dvLRHKLvKJLUB5BVqLN-gbtc09LqZy7FVhivlIVsXaMd93wR7vqA" : new URLSearchParams(window.location.search).get("jwt");