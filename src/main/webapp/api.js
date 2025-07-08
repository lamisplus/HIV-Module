export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8789/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzUxMjk3MTAyfQ.sqcA5f3seJHHfEyG3r7yXFCuO3XKNX9XEv8s3isT8w9BoJCENOPOuPN1EnSFlFkzastcFQ7QINkbo4xqRWjm8w"
    : new URLSearchParams(window.location.search).get("jwt");