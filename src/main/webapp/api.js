export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8789/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzUzODIwMzMzfQ.Fzq9w5uROrxh2cUUyKCMQdrrGaw4JMLhQMBd2Mi37ZTsMhvJIVftlnaIAyOpArPG0n1KXrVdG40LzGwuN-A1_A"
    : new URLSearchParams(window.location.search).get("jwt");