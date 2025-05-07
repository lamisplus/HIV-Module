export const url =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8789/api/v1/"
        : "/api/v1/";
export const token =
    process.env.NODE_ENV === "development"
        ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzQ2NjMyODk2fQ.Jl0W1t1cTPgA-cCsiykroefds-083p9OFcRhLO5T51TwzJhqR3WYlg73UDEy7bYhOG_QyogtuBTFh4m6ZViAyQ"
        : new URLSearchParams(window.location.search).get("jwt");
