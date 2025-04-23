export const url =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8789/api/v1/"
        : "/api/v1/";
export const token =
    process.env.NODE_ENV === "development"
        ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzQ1NDIzODcwfQ.hzD40REeGKzGo0GSkW20OGv33PfC1NdZJNwT8SAqd9QGHAFoJdr_ua8iBbaxmKyOqtrzauojFILD_Hf4PBzq7A"
        : new URLSearchParams(window.location.search).get("jwt");
