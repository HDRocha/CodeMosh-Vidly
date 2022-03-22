const request = require('supertest');
const { User } = require('../../Models/user');

let server;

beforeEach(() => (server = require('../../index')));
afterEach(async () => await server.close());

describe('auth middleware', () => {
   let token;

   const sendRequest = () => {
      return request(server).post('/api/genres').set('x-auth-token', token).send({ name: 'genre1' });
   };

   beforeEach(async () => (token = await new User().generateAuthToken()));

   it('should return a 401 response if no token is provided', async () => {
      token = '';
      const res = await sendRequest();

      expect(res.status).toBe(401);
   });

   it('should return a 400 response if the token is invalid', async () => {
      token = 'a';
      const res = await sendRequest();

      expect(res.status).toBe(400);
   });

   it('should return a 200 response if the token is valid', async () => {
      const res = await sendRequest();

      expect(res.status).toBe(200);
   });
});
