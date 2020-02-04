'use strict';

const config = {
    token: {
        key: process.env.SECRET_KEY,
        expiration_time: '24h'
    },
    mongodb: {
        url: process.env.MONGODB_URL,
        user: process.env.MONGODB_USER,
        password: process.env.MONGODB_PASSWORD
    }
};

module.exports = config;