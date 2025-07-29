export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzUzODAzOTE1fQ.0wMZzRYv_FqF62_jccCGh1l06eX-m6hoW2TU2psMZSWMRZF3H4bfccMh_JfZMASsH_t1ktQt5YiyYHKB4G0UTA"
    : new URLSearchParams(window.location.search).get("jwt");