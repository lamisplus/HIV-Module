export const url =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8789/api/v1/"
        : "/api/v1/";
export const token =
    process.env.NODE_ENV === "development"
        ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzQ3OTI1MDI5fQ.CXhq2C35trnZBP_n4fYMM76r-OWmhi6CscXloxQAN-fCXAxBBkfuoZ5Pa2BGfnGRpnVqL0tqmgflBREtzHghCA"
        : new URLSearchParams(window.location.search).get("jwt");
