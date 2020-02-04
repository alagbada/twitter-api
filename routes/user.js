const express = require('express');
const router = express.Router();
const tokenHandler = require('../middleware/token_handler');
const serviceLocator = require('servicelocator');
const userController = serviceLocator.get('userController');

router.post('/user/registration', (req, res, next) => userController.registration(req, res, next));
router.post('/user/login', (req, res, next) => userController.login(req, res, next));
router.post('/user/tweet', tokenHandler, (req, res, next) => userController.postTweet(req, res, next));
router.post('/user/reply/:id', tokenHandler, (req, res, next) => userController.replyTweet(req, res, next));
router.get('/user/search', tokenHandler, (req, res, next) => userController.searchUsers(req, res, next));
router.get('/user/tweet', tokenHandler, (req, res, next) => userController.searchTweets(req, res, next));
router.get('/user/follow/:id', tokenHandler, (req, res, next) => userController.followAnotherUser(req, res, next));
router.get('/user/timeline', tokenHandler, (req, res, next) => userController.getOwnTimeLine(req, res, next));


module.exports = router;