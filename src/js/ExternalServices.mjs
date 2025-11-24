const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  const body = await res.json();

  if (res.ok) {
    return body;
  } 
  
  throw {
    name : 'service error',
    message : jsonResponse
  }
}

export default class ExternalServices {
  constructor () {}

  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category} `);
    const data = await convertToJson(response);
    return data.Result;
  }
  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    console.log(data.Result);
    return data.Result;
  }
}