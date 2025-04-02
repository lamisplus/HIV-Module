export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8789/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzQzNjE5Njk2fQ.ai6t2gj2CBnLrSrllyEn1ayue-8oJwocnmGpBBgPyxxnSk9Z4xjJe62kAsPCpxXKGITv_hzqEiY52l6hO6sDMA"
    : new URLSearchParams(window.location.search).get("jwt");
