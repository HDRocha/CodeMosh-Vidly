const { Rental } = require('../../Models/rental');
const { User } = require('../../Models/user');
const mongoose = require('mongoose');
const request = require('supertest');
const moment = require('moment');

describe('/api/returns', () => {
   let server;
   let customerId;
   let movieId1;
   let movieId2;
   let rental;
   let token;
   let movies;

   const sendRequest = () => {
      return request(server).post('/api/returns').set('x-auth-token', token).send({
         customerId,
         movies,
      });
   };

   beforeEach(async () => {
      server = require('../../index');

      customerId = mongoose.Types.ObjectId();
      movieId1 = mongoose.Types.ObjectId();
      movieId2 = mongoose.Types.ObjectId();
      movies = [
         {
            _id: movieId1,
            title: '12345',
            expectedReturnDate: Date.now(),
            dailyRentalRate: 2,
         },
         {
            _id: movieId2,
            title: '12345',
            expectedReturnDate: Date.now(),
            dailyRentalRate: 2,
         },
      ];
      token = new User().generateAuthToken();

      rental = new Rental({
         customer: {
            _id: customerId,
            name: '12345',
            phone: '12345',
         },
         movies,
      });

      await rental.save();
   });

   afterEach(async () => {
      await server.close();
      await Rental.deleteMany({});
   });

   it('should return 401 if client is not logged in', async () => {
      token = '';
      const res = await sendRequest();

      expect(res.status).toBe(401);
   });

   it('should return 400 if customerId is not provided', async () => {
      customerId = '';

      const res = await sendRequest();

      expect(res.status).toBe(400);
   });

   it('should return 400 if movies are not provided', async () => {
      movies = [];

      const res = await sendRequest();

      expect(res.status).toBe(400);
   });

   it('should return 400 if movieId is not provided', async () => {
      movies[1]._id = '';

      const res = await sendRequest();

      expect(res.status).toBe(400);
   });

   it('should return 404 if no rental found for this customer/movies', async () => {
      await Rental.deleteMany({});

      const res = await sendRequest();

      expect(res.status).toBe(404);
   });

   it('should return 400 if the rental is already processed (movies[].dateReturned is not empty', async () => {
      const rental = await Rental.findOne({ 'customer._id': customerId });
      rental.movies[0].dateReturned = Date.now();
      await rental.save();

      const res = await sendRequest();

      expect(res.status).toBe(400);
   });

   it('should return 200 if a valid request is received', async () => {
      const res = await sendRequest();

      expect(res.status).toBe(200);
   });

   // it('should set the return date', async () => {
   //    const res = await sendRequest();

   //    const rentalInDb = await Rental.findById(rental._id)

   //    expect(rentalInDb.).toBe(200);
   // });
});
