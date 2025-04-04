export const url =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8789/api/v1/"
        : "/api/v1/";
export const token =
    process.env.NODE_ENV === "development"
        ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzQzNzg3MTk2fQ.8Wm_DUtr25xyXygLbjj5QwCDRqwZL5fh2qLC1sJ63v8KGmY6HECsR-GWqfDJHUuO0vkYrcupkvC8tJZN0Jo95Q" : new URLSearchParams(window.location.search).get("jwt");
