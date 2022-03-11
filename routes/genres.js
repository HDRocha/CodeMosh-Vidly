//const asyncMiddleware = require("../middleware/async"); Essa opção foi desativada porque estamos utilizando express-async-erros
const debug = require("debug")("app:genre");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Genre, validate } = require("../Models/genre.js");
const auth = require("../middleware/auth");

//Get request
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send(`Id inválido: ${req.params.id}`);
  //Verifica existência
  try {
    const genre = await Genre.findById(req.params.id);

    if (!genre)
      return res
        .status(404)
        .send(`O gênero com id = ${req.params.id} não existe!`);
    res.send(genre);
  } catch (err) {
    for (field in err.errors) {
      debug(`Error ${err.errors[field].index}:`, err.errors[fiel].message);
    }
  }
});

router.post("/", auth, async (req, res) => {
  //Valida a mensagem utilizando o schema
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });

  try {
    genre = await genre.save();
    res.send(genre);
  } catch (err) {
    for (field in err.errors) {
      debug(`Error ${err.errors[field].index}:`, err.errors[field].message);
    }
  }
});

router.put("/:id", auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send(`Id inválido: ${req.params.id}`);
  //Verifica existência
  try {
    //Valida a mensagem utilizando o schema
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Realiza o update
    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );

    if (!genre)
      return res
        .status(404)
        .send(`O gênero com id = ${req.params.id} não existe!`);

    res.send(genre);
  } catch (err) {
    for (field in err.errors) {
      debug(`Error ${err.errors[field].index}:`, err.errors[fiel].message);
    }
  }
});

router.delete("/:id", auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send(`Id inválido: ${req.params.id}`);
  try {
    const genre = await Genre.findByIdAndDelete(req.params.id);

    if (!genre)
      return res
        .status(404)
        .send(`O gênero com id = ${req.params.id} não existe!`);

    res.send(genre);
  } catch (err) {
    for (field in err.errors) {
      debug(`Error ${err.errors[field].index}:`, err.errors[fiel].message);
    }
  }
});

module.exports = router;
