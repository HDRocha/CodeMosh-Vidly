const debug = require('debug')('app:customers');
const { Customer, validate } = require('../Models/customer.js')
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const auth = require('../middleware/auth');



//GET Request
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.send(customers);
    }
    catch {

    }
});

//GET by ID Request
router.get('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send(`Id inválido: ${req.params.id}`);
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).send(`O cliente com id= ${req.params.id} não existe!`);
        res.send(customer);
    }
    catch {

    }
});

//POST Request
router.post('/', auth, async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let customer = new Customer({
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
        });
        customer = await customer.save();
        res.send(customer);
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send(`Id inválido: ${req.params.id}`);

    try {
        //Valida o Schema
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        //Atualiza o cliente        
        const customer = await Customer.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
        },
            { new: true })
        if (!customer) return res.status(404).send(`O cliente com id = ${req.params.id} não existe!`)
        res.send(customer);
    }
    catch (err) {
        for (field in err.errors) {
            debug(`Error ${err.errors[field].index} :`, err.errors[field].message);
        };
    }
});

router.delete('/:id', auth, async (req, res) => {
    //Valida o id enviado
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send(`Id inválido: ${req.params.id}`);

    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) return res.status(404).send(`Cliente não encontrado!`);

        res.send(customer);
    } catch (err) {
        for (field in err.errors) {
            debug(`Error: ${err.erros[field].index}: `, err.erros[field].message);
        }
    }

})


module.exports = router;