export const url =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8789/api/v1/"
        : "/api/v1/";
export const token =
    process.env.NODE_ENV === "development"
        ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzUwNDQzMTc1fQ.7610C5kCM0CwuXIAtxjr8L0OZoW9irBy9v--UnMw7a9kE2lBXdw-uUuemiLKyezncC2NuMa0LISdzi98P3rz2w"
        : new URLSearchParams(window.location.search).get("jwt");
