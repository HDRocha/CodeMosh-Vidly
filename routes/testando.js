const express = require('express');
router = express.Router();
const { Rental } = require('../Models/rental');

router.get('/', async (req, res) => {
   const movies = req.body.movies;

   const rental = await Rental.findOne({
      customerId: req.body.customerId,
      'movies.movieId': movies[0].movieId,
   });
   console.log(rental);
   if (!rental) return res.status(404).send('Rental not found.');

   res.status(200).send(rental);
});

module.exports = router;
