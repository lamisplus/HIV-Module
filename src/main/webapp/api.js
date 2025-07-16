export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8789/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzUyNjY0MTcwfQ.xFetsoUIogVBi0cEKH9jYHws3HnTbw9bLLdeUGU7CwsdxQsQFKqkLLnKk-m68tp6_h6eBVJ5wA7p_YKuJxmPbA"
    : new URLSearchParams(window.location.search).get("jwt");