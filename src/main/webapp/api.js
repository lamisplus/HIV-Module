export const url =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8789/api/v1/"
        : "/api/v1/";
export const token =
    process.env.NODE_ENV === "development"
        ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzQ2NzI2MTAwfQ.XwflWxpmuby1EofNHteAzA_8S6LCVsY3CGXICgCGMXBbgBQeI4JeWhekHd09ACVpVfj53sAeHjamEXw5a-Galg"
        : new URLSearchParams(window.location.search).get("jwt");
