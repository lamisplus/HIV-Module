export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8789/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzI2NjYxOTgyfQ.6qk8sIkbaNUQKzN4kCVLfm9QXPKEmTjRAXfNj1RFAQWJMY0n5LceQ8ATEfL_WKsR69fTDohKS_LganBGXhfBNQ"  : new URLSearchParams(window.location.search).get("jwt");
