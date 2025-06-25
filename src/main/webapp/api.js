export const url =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8789/api/v1/"
        : "/api/v1/";
export const token =
    process.env.NODE_ENV === "development"
        ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzUwODY3MjE4fQ.6pCDFAE25ToIdY9jxTYcDEA0A0HKH3NWnozlIlkDY9rZO6T8Y6Ia3-bN5YLfdJPQJh0p6IoyURKEDIBf1c1x5Q"
        : new URLSearchParams(window.location.search).get("jwt");
