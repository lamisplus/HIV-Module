export const  token = (new URLSearchParams(window.location.search)).get("jwt")
export const url = '/api/v1/'

// export const url =  'http://lamisplus.org:7090/api/v1/';
// export const  token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNjg5MTg4MTIyfQ.oFk3O0651GpPcPK9BXRJ3NwZb8RPf_7UUttyuldtjF4ay4EkGBD6rEX5xm8zeLoYSSu2Si9KgRJN0noVlwKUzQ';