export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzE4NjYzOTMwfQ.ZiSOCZptkOttaftaFIafi2_pZ0pVb25aMFqHGNbUi7CU50tIIy6y9zJJxpP0eQYb8zum81ojpboDnmDyj7l4fg"
    : new URLSearchParams(window.location.search).get("jwt");
