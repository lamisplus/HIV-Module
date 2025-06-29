export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8789/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzUxMjI5NTg0fQ.jiBDEjdJrMpiqRmTo_vNJIRgrvTtzRZ0V5HALqGfWDq2BbkBWDiNai6cx3c2nZtB3oZHdmeVcTar7spFVsRPtQ"
    : new URLSearchParams(window.location.search).get("jwt");