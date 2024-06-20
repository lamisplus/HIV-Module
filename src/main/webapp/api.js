export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzE4OTQ2OTkxfQ.z4n1hLjNz9ho8_eePLCr7zwzUjW786g2DEaxIFugKszMBQDPa9-OOVLm20htIf1HIrf7KwHF9WiMzzUOst5g4g"
    : new URLSearchParams(window.location.search).get("jwt");
