const bcrypt = require('bcrypt');
const debug = require('debug')('app:user');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { User, validate } = require('../Models/user.js');
const _ = require('lodash');

router.post('/', async (req, res) => {
    //Valida a mensagem utilizando o schema
    const { error } = validate(req.body);    

    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email })

    if (user) return res.status(400).send('User already registered');

    user = new User(_.pick(req.body, ["name", "email", "password"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);


    try {
        await user.save();        
        const token = user.generateAuthToken();
       
        res.header('x-auth-token',token).send(_.pick(user, ["_id", "name", "email"]));
    }
    catch (err) {
        for (field in err.errors) {
            console.log(`Error ${err.errors[field].index}:`, err.errors[field].message);
        };
    };
});

module.exports = router;