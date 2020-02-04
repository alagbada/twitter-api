const serviceLocator = require('servicelocator');
const TweetService = require('../services/tweet.service');
const UserSchema = require('../models/user').userSchema;
const userValidator = require('../models/user').validateUser;
const TweetSchema = require('../models/tweet').tweetSchema;
const tweetValidator = require('../models/tweet').validateTweet;

const UserController = require('../controllers/user.controller');
const UserService = require('../services/user.service');
const mongoose = require('mongoose');
const logger = require('../lib/logger');
const jwt = require('jsonwebtoken');

const userModel = mongoose.model('user', UserSchema);
const tweetModel = mongoose.model('tweet', TweetSchema);

serviceLocator.register('logger', logger);
serviceLocator.register('tweetService', new TweetService(tweetModel, logger, tweetValidator));

const tweetService = serviceLocator.get('tweetService');
serviceLocator.register('userService', new UserService(userModel, tweetService, userValidator, jwt, logger));
const userService = serviceLocator.get('userService');

serviceLocator.register('userController', new UserController(userService, logger));

module.exports = serviceLocator;