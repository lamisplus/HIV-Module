export const url =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8789/api/v1/"
        : "/api/v1/";
export const token =
    process.env.NODE_ENV === "development"
        ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzQ0OTA3NTAxfQ.69RtfCGDfEZBofWZ-QGpiXyNiUbh0yJZ32G55zBDoVmg2AjDrBltpNZQgzd0SX036VuzwuO5ONUsuq0j0gfvpQ"
        : new URLSearchParams(window.location.search).get("jwt");
