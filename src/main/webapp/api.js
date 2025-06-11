export const url =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8789/api/v1/"
        : "/api/v1/";
export const token =
    process.env.NODE_ENV === "development"
        ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzQ5NTcxNDg1fQ.JB6w_z9Eer2rowMf8m4NssSFEWoPnDZHbMc-Ohas69r24cAAz-OMqMondm7WVy8ph3du1e_X9Rb0TRmQrvCJSw"
        : new URLSearchParams(window.location.search).get("jwt");
