export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8789/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzQwNjc0OTI1fQ.rQG8lJIb7JWArS_-hbq4_6fTCDzFmeOFW7iq2OvNJGVlpTq9cXmyBOGD_GIrh9nlh9i1mjw2mAV1egwsB6mUDQ"
    : new URLSearchParams(window.location.search).get("jwt");
