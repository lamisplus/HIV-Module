export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8789/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzUwODk2NTI2fQ.37pUBwTlqR56NhC0N2lHBTyFSqul0-P4lF-9rgYadbmvsqPKIr4SjzOYTMnwt2ulzjl39E1ZakKVnmR2v1k91A"
    : new URLSearchParams(window.location.search).get("jwt");
