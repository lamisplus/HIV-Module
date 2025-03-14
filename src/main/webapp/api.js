export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8789/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzQwNzQxMzkxfQ.5tC8Ow_YcYT8R4n0Jim8r8DCMN3c3w5dhHVCRplLy1nNrrdIPbzut8Kz2cCpu8Xe_b6dsZ0WTwWpmA7EMka7gA"
    : new URLSearchParams(window.location.search).get("jwt");
