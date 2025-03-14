export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8789/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzM3NjgzNDc1fQ.bG0qKq00QP1TH_xzHIIZL9H9zMGAQmja7h_juSkucvOqH2z2mnsliHTrApFeuC_h0sXBc-ARJ_OsQ1BMWcUxLA"
    : new URLSearchParams(window.location.search).get("jwt");
