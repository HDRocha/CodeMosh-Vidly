const mongoose = require('mongoose');
const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../Models/user');

let server;

beforeEach(() => {
   server = require('../../index');
});

afterEach(async () => {
   await server.close();
   await Genre.deleteMany({});
});

describe('/api/genres', () => {
   describe('GET /', () => {
      it('should return all genres', async () => {
         await Genre.collection.insertMany([{ name: 'genre1' }, { name: 'genre2' }]);

         const res = await request(server).get('/api/genres');

         expect(res.status).toBe(200);
         expect(res.body.some((g) => g.name === 'genre1')).toBeTruthy();
         expect(res.body.some((g) => g.name === 'genre2')).toBeTruthy();
      });
   });

   describe('GET /:id', () => {
      it('should return a specific genre if a valid id is passed', async () => {
         const genre1 = new Genre({ name: 'genre1' });
         genre1.save();
         const genre2 = new Genre({ name: 'genre2' });
         genre2.save();
         const res = await request(server).get('/api/genres/' + genre2._id);

         expect(res.status).toBe(200);
         expect(res.body).toHaveProperty('name', genre2.name);
      });

      it('should return 404 if invalid id is passed', async () => {
         const res = await request(server).get('/api/genres/1');

         expect(res.status).toBe(404);
      });

      it('should return 404 if no genre with the given id exists', async () => {
         const id = mongoose.Types.ObjectId();

         const res = await request(server).get('/api/genres/' + id);

         expect(res.status).toBe(404);
      });
   });

   describe('POST /', () => {
      //Define the happy path, and then in each test, we change
      //one parameter that clearly aligns with the name of the test
      let token;
      let name;

      const sendRequest = async () => {
         return await request(server).post('/api/genres').set('x-auth-token', token).send({ name });
      };

      beforeEach(() => {
         token = new User().generateAuthToken();
         name = 'genre1';
      });

      it('should return 401 if client is not logged in', async () => {
         token = '';
         name = 'genre1';

         const res = await sendRequest();

         expect(res.status).toBe(401);
      });

      it('should return 400 if the genre is invalid (name is less than 3 characters)', async () => {
         token = new User().generateAuthToken();
         name = '12';

         const res = await sendRequest();

         expect(res.status).toBe(400);
      });

      it('should return 400 if the genre is invalid (name is great than 50 characters)', async () => {
         name = 'a'.repeat(51);

         const res = await sendRequest();

         expect(res.status).toBe(400);
      });

      it('should save the genre on the database if the genre passed is valid', async () => {
         name = 'genre1';

         sendRequest();

         const genre = await Genre.find({ name });

         expect(genre).not.toBeNull();
      });

      it('should respond the request with the passed genre', async () => {
         const res = await sendRequest();

         expect(res.body).toMatchObject({ name });
         expect(res.body).toHaveProperty('_id');
      });
   });

   describe('PUT /:id', () => {
      let id;
      let newName;
      let token;
      let genre;

      const sendRequest = () => {
         return request(server)
            .put('/api/genres/' + id)
            .set('x-auth-token', token)
            .send({ name: newName });
      };

      beforeEach(async () => {
         genre = new Genre({ name: 'genre1' });
         await genre.save();
         id = genre._id.toHexString();
         token = new User().generateAuthToken();
         newName = 'updatedName';
      });

      it('should return a 401 if the client is not logged in', async () => {
         token = '';

         const res = await sendRequest();

         expect(res.status).toBe(401);
      });

      it('should return a 400 if an invalid (less than 3 characters) genre is passed', async () => {
         newName = '12';
         const res = await sendRequest();

         expect(res.status).toBe(400);
      });

      it('should return a 400 if an invalid (more than 50 characters) genre is passed', async () => {
         newName = 'x'.repeat(51);
         const res = await sendRequest();

         expect(res.status).toBe(400);
      });

      it('should return a 404 if there is no genre with the given id', async () => {
         id = mongoose.Types.ObjectId();

         const res = await sendRequest();

         expect(res.status).toBe(404);
      });

      it('should update the genre on the database if a valid genre is passed', async () => {
         await sendRequest();

         const updatedGenre = await Genre.findById(genre._id);

         expect(updatedGenre.name).toBe(newName);
      });

      it('should return the updated genre if it is valid', async () => {
         const res = await sendRequest();

         expect(res.body).toHaveProperty('_id');
         expect(res.body).toMatchObject({ name: newName });
      });
   });
});
