export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzE4MjgxODYwfQ.8FOQyjRiF6iZ3NHt8sh3mLaaOwghRw9lsMUaf7mjDdveejOh6O7RRXCmJN2I9jrjLGq78gtu9rjZSLC6UeJj1Q"
    : new URLSearchParams(window.location.search).get("jwt");
