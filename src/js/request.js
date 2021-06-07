export default async function createRequest(user) {
  const baseUrl = 'https://deizee-chat-backend.herokuapp.com/newuser';
  // const baseUrl = 'http://localhost:3000/newuser';
  const request = await fetch(baseUrl, {
    method: 'POST',
    body: user,
  });

  return request.json();
}
