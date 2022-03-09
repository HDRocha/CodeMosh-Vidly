const mongoose = require('mongoose');
const express = require('express');
const debug = require('debug')('app:rental');
const { Rental, validate } = require('../Models/rental.js');
const { Customer } = require('../Models/customer.js');
const { Movie } = require('../Models/movie.js');
const router = express.Router();
const auth = require('../middleware/auth');

//GET request
router.get('/', async (req, res) => {
    try {
        const rentals = await Rental.find().sort('-dateOut');
        if (!rentals) return res.status(404).send('Rentals not found');
        res.send(rentals);
    } catch (err) {
        for (field in err.erros) {
            debug(`Error ${err.erros[field].index}: `, err.erros[fiel].message);
        }
    }
});

//POST request
router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    try {
        const customer = await Customer.findById(req.body.customerId);

        if (!customer) return res.status(404).send('Invalid customer id.');

        let movies = [];
        let rentalFee = 0;
        for (const m of req.body.movies) {
            const movie = await Movie.findById(m.movieId);
            if (!movie) return res.status(404).send('Invalid movie id.');
            if (movie.numberInStock === 0) return res.status(400).send(`Movie ${movie.title} is not in stock.`)
            movies.push({
                _id: movie.id,
                title: movie.title,
                expectedReturnDate: m.expectedReturnDate,
                dailyRentalRate: movie.dailyRentalRate
            })
            rentalFee = rentalFee + (movie.dailyRentalRate * 5)//(m.expectedReturnDate.getTime() - Date.now().getTime())/(1000*60*60*24))            
        };


        let rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name,
                isGold: customer.isGold,
                phone: customer.phone
            },
            movies: movies,
            rentalFee: rentalFee
        });


        rental = await rental.save();
        res.send(rental);
    } catch (err) {
        for (field in err.erros) {
            // debug(`Error ${err.erros[field].index}: `, err.erros[field].message);
            console.log(`Error ${err.erros[field].index}: `, err.erros[field].message);
        }
    }
});

module.exports = router;