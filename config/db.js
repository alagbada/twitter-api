const mongoose = require('mongoose');
const logger = require('../lib/logger');

const config = require('./config');

module.exports =  function  () {
    const url = `mongodb+srv://${config.mongodb.user}:${config.mongodb.password}@cluster0-ngms3.mongodb.net/test?retryWrites=true&w=majority`;
    mongoose.connect(url, {useNewUrlParser: true})
        .then(() => logger.info(`Connected to database...`));
}