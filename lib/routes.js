const express = require('express');
const user = require('../routes/user');

function routes(app){
    app.use(express.json());
    app.use('/api/v1', user);
}

module.exports = routes;