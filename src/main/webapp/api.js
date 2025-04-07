export const url =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8789/api/v1/"
        : "/api/v1/";
export const token =
    process.env.NODE_ENV === "development"
?"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzQ0MDM4NDA3fQ.tYtridAmjgQqLG8CMcvNbdyCYnme6cXHwV-PeC3PtgvJpX81U-vrXtSSpPmY82zgK-L9-mXzR7NOnd02B9X4vw"        : new URLSearchParams(window.location.search).get("jwt");
