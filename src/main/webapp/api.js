export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzE4NzIwNDgxfQ.EI7gTn0WJhI8dyrd-Ry0MSFYy_M98bH67Y1b95AsY7CBeEM6bcyZcgKd2WvwI-97PHmzwRUQ8osG3Vp9GxAuoQ"
    : new URLSearchParams(window.location.search).get("jwt");
