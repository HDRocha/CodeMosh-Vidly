const express = require('express');
const router = express.Router();
const { Rental } = require('../Models/rental');
const auth = require('../middleware/auth');

//Post request
router.post('/', auth, async (req, res) => {
   if (!req.body.customerId) return res.status(400).send('CustomerId not provided.');

   let movies = req.body.movies;

   if (movies.length === 0) return res.status(400).send('Movie not provided');
   const moviesWithoutUserId = movies.filter((m) => !m._id);
   if (moviesWithoutUserId.length >= 1) return res.status(400).send('MovieId not provided');

   let rentalNotFound = false;
   let rental;
   async function verifyRentalDontExist() {
      for (const movie of movies) {
         rental = await Rental.findOne({
            'customer._id': req.body.customerId,
            'movies._id': movie._id,
         }).exec();
         if (!rental) rentalNotFound = true;
      }
   }
   await verifyRentalDontExist();
   if (rentalNotFound) return res.status(404).send('Rental not found');

   let movieAlreadyReturned = false;
   function verifyMovieAlreadyReturned() {
      for (const movie of rental.movies) {
         if (movie.dateReturned) {
            movieAlreadyReturned = true;
         }
      }
   }
   verifyMovieAlreadyReturned();
   if (movieAlreadyReturned) return res.status(400).send('Movie already returned');

   res.status(200).send();

   movies = req.body.movies;

   async function setReturnedDate() {
      let index = 0;
      for (const movie of movies) {
         const rental = await Rental.findOne({
            'customer._id': req.body.customerId,
            'movies._id': movie._id,
         }).exec();
      }
   }
});

module.exports = router;
