const { Movie, validate } = require('../Models/movie.js')
const { Genre } = require('../Models/genre.js');
const express = require('express');
const debug = require('debug')('app:customer');
const mongoose = require('mongoose');
const router = express.Router();
const auth = require('../middleware/auth');



//GET Request
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.send(movies);
    }
    catch {

    }
});

//GET by ID Request
router.get('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send(`Id inválido: ${req.params.id}`);
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).send(`O filme com id: ${req.params.id} não existe!`);
        res.send(movie);
    }
    catch {

    }
});

//POST Request
router.post('/', auth, async (req, res) => {
    try {
        const { error } = validate(req.body);

        if (error) return res.status(400).send(error.details[0].message);

        const genre = await Genre.findById(req.body.genreId);

        if (!genre) return res.status(400).send('Invalid genre.');
        
       

        let movie = new Movie({
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        });        

        movie = await movie.save();
       
        res.send(movie);
    }
    catch (err) {
        for (field in err.errors) {
            console.log(`Error ${err.errors[field].index} :`, err.errors[field].message);
        };
    }
});

//PUT Request
router.put('/:id', auth, async (req, res) => {
    //Verifica se o ID passado é um ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).send(`Id inválido: ${req.params.id}`);

    try {
        //Valida o Schema
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const genre = await Genre.findById(req.body.genreId);
        if (!genre) return send.status(400).send('Invalid genre.');

        //Atualiza o filme        
        const movie = await Movie.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        },
            { new: true })
        if (!movie) return res.status(404).send(`O filme com id = ${req.params.id} não existe!`)
        res.send(movie);
    }
    catch (err) {
        for (field in err.errors) {
            debug(`Error ${err.errors[field].index} :`, err.errors[field].message);
        };
    }
});

router.delete('/:id', auth, async (req, res) => {
    //Valida o id enviado
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).send(`Id inválido: ${req.params.id}`);

    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) return res.status(404).send(`Filme não encontrado!`);

        res.send(movie);
    } catch (err) {
        for (field in err.errors) {
            debug(`Error: ${err.erros[field].index}: `, err.erros[field].message);
        }
    }

})


module.exports = router;