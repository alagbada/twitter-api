const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const tweetSchema = require('./tweet').tweetSchema;

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    password: {
        type:String,
        required:true,
    },
    followers: {
        type: Array(String),
        default: []
    },
    following: {
        type: Array(String),
        default: []
    },
    date_of_birth: {
        type: Date,
        required:true,
    },
    email: {
        type:String,
        required:true,
        unique: true
    },
    tweeter_handle: {
        type: String,
        unique: true,
        required: true
    },
    phone_number: {
        type: String,
        required: true,
        unique: true
    },
    tweets: {
        type: Array(String)
    },
    updated_at: {
        type: Date
    },
    created_at: {
        type: Date
    }
});

userSchema.index({'$**': 'text'});

userSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    if (!this.created_at) {
        this.created_at = Date.now();
    }
    next();
});

// const User = mongoose.model('user', userSchema);
// const Tweet = mongoose.model('tweet', tweetSchema)

const validateUser = user => {
    const schema= {
        firstname: Joi.string().min(3).required(),
        lastname: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        phone_number: Joi.string().required(),
        tweeter_handle: Joi.string().required(),
        date_of_birth: Joi.date().required(),
    };
    return Joi.validate(user, schema);
}

module.exports = {
    userSchema,
    validateUser
}