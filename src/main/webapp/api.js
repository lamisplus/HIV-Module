export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzE4ODMwOTI2fQ.KHmjuckwEPf9vTtZ25cCDPwfWDSWWInFr8O015mRbN6RcYO0i00C_o7uwR7RB5Di6jdiSSSFjyhL5Y9KiIAzrg"
    : new URLSearchParams(window.location.search).get("jwt");
