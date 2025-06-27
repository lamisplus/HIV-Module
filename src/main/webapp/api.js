export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8789/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzUxMDIwOTgzfQ.5Xz7kODPQR2Vd_MI_y7p7KxRKkwmDa2Msb2qUthCRIDNymfLo1iXl8wPfYlc8UE1AowVSR8RS-RhBCLID225og"
    : new URLSearchParams(window.location.search).get("jwt");