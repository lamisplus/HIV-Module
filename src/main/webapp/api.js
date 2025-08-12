export const url =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8789/api/v1/"
        : "/api/v1/";

export const token =
    process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_DEV_JWT
        : new URLSearchParams(window.location.search).get("jwt");