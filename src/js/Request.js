export default async function createRequest(options) {
  const baseUrl = 'https://localhost:3000/';
  const requestUrl = baseUrl + options.url;
  const response = await fetch(requestUrl, {
    method: options.method || 'GET',
    body: options.body,
  });

  return response.json();
}
