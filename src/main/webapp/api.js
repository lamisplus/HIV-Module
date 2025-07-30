export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzUzOTAwMjY0fQ.vPTFWEhaqfDuZlH48gKNfkva3GA1OcQ5GLl4iLXAQ1O6IjcEGOGyD9BBgAGxiD_iJ-pXNdrD4yYG4EN5PWGs1w"
    : new URLSearchParams(window.location.search).get("jwt");