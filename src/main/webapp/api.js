export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8789/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzMxOTQ1MDAzfQ.68jM6k85W2ZZRaPxUILcIorpcBgO2TgSex8clNdm3kOE-SQ1mApIG2A9UzVQgGQZqU8fsuvwmQ3768QtuUcYrA"  : new URLSearchParams(window.location.search).get("jwt");
