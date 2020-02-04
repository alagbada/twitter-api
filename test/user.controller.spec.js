const sinon = require('sinon');
const chai = require('chai');
chai.should();
var expect = chai.expect;

const TweetService = require('../services/tweet.service');
const UserService = require('../services/user.service');
const UserController = require('../controllers/user.controller');

describe('User Controller', function () {
    const userModel = sinon.spy();
    const tweetModel = sinon.spy();
    let jwt = {};
    let logger = {
        error: sinon.stub().returns({}),
        info: sinon.stub().returns({})
    };
    let tweetValidator = sinon.spy()
    let userValidator = sinon.spy()

    let tweetService;
    let userService;
    let userController;

    let req = {
        body: {}
    }
    let res={}, json, status, mockSignup, mockResponse, error = new Error(), expectedResult, next;
    

    describe('register', () => {
        beforeEach(() => {
            tweetService = new TweetService(tweetModel, logger, tweetValidator);
            userService = new UserService(userModel, tweetService, userValidator, jwt, logger);
            userController = new UserController(userService, logger);
            mockResponse = () => {
                let res = {};
                res.status = sinon.stub().returns(res);
                res.json = sinon.stub().returns(res);
                return res;
            };
              
            next = sinon.spy();
            sandbox         = sinon.createSandbox();
            mockSignup = sandbox.stub(userService, 'signup').returns(expectedResult);

            expectedResult = {
                "token": "test_token",
                "result": {
                }
            };
        })
        after(function () {
            sandbox.restore(); // Unwraps the spy
        });
        
        it ('should call the user service during signup/registration', function(done){
            
            userController.registration(req, res, next);
            userService.signup.calledWith(req.body).should.be.ok;
            done();
        });

        it ('status should return 200 during signup/registration when the right response is got from service', async function(){
            const res = mockResponse();
            await userController.registration(req, res, next);
            expect(res.status.calledOnce).to.equal(true);
            res.status.calledWith(200).should.be.true;
            res.json.calledWith({ success: true, token: expectedResult.token, data: expectedResult.result}).should.be.ok
        });

    })

    describe('register (Unsuccessful)', () => {
        beforeEach(() => {
            tweetService = new TweetService(tweetModel, logger, tweetValidator);
            userService = new UserService(userModel, tweetService, userValidator, jwt, logger);
            userController = new UserController(userService, logger);
            mockResponse = () => {
                let res = {};
                res.status = sinon.stub().returns(res);
                res.json = sinon.stub().returns(res);
                return res;
            };
              
            next = sinon.spy();
            sandbox         = sinon.createSandbox();

            expectedResult = {
            };
            mockSignup = sandbox.stub(userService, 'signup').returns(expectedResult);

        })
        after(function () {
            sandbox.restore(); // Unwraps the spy
        });

        it ('status should return 500 during signup/registration when unexpected response is got from service', async function(){
            const res = mockResponse();
            await userController.registration(req, res, next);
            expect(res.status.calledOnce).to.equal(true);
            res.status.calledWith(500).should.be.true;
            res.json.calledWith({ success: false, message: 'Unable to save data'}).should.be.ok
        });
    })

    describe('login', () => {
        beforeEach(() => {
            tweetService = new TweetService(tweetModel, logger, tweetValidator);
            userService = new UserService(userModel, tweetService, userValidator, jwt, logger);
            userController = new UserController(userService, logger);
            mockResponse = () => {
                let res = {};
                res.status = sinon.stub().returns(res);
                res.json = sinon.stub().returns(res);
                return res;
            };

            req = {
                body: {
                    email: 'email@softcom.ng',
                    password: '123ertop'
                }
            }
              
            next = sinon.spy();
            sandbox         = sinon.createSandbox();
            mockSignup = sandbox.stub(userService, 'login').returns(expectedResult);

            expectedResult = {
                "token": "test_token",
                "data": {
                }
            };
        })
        after(function () {
            sandbox.restore(); // Unwraps the spy
        });
        
        it ('should call the user service during login', function(done){
            
            userController.login(req, res, next);
            userService.login.calledWith(req.body.email, req.body.password).should.be.ok;
            done();
        });

        it ('status should return 200 during login when the right response is got from service', async function(){
            const res = mockResponse();
            await userController.login(req, res, next);
            expect(res.status.calledOnce).to.equal(true);
            res.status.calledWith(200).should.be.true;
            res.json.calledWith({ success: true, message: 'successful login', token: expectedResult.token, data: expectedResult.data}).should.be.ok
        });

    })

    describe('login (Unsuccessful)', () => {
        beforeEach(() => {
            tweetService = new TweetService(tweetModel, logger, tweetValidator);
            userService = new UserService(userModel, tweetService, userValidator, jwt, logger);
            userController = new UserController(userService, logger);
            mockResponse = () => {
                let res = {};
                res.status = sinon.stub().returns(res);
                res.json = sinon.stub().returns(res);
                return res;
            };
              
            next = sinon.spy();
            sandbox         = sinon.createSandbox();

            expectedResult = null;
            mockSignup = sandbox.stub(userService, 'login').returns(expectedResult);

        })
        after(function () {
            sandbox.restore(); // Unwraps the spy
        });

        it ('status should return 403 during signup/registration when unexpected response is got from service', async function(){
            const res = mockResponse();
            await userController.login(req, res, next);
            expect(res.status.calledOnce).to.equal(true);
            res.status.calledWith(403).should.be.true;
            res.json.calledWith({ success: false, message: 'Incorrect username or password'}).should.be.ok
        });
    })

    describe('Post Tweet', () => {
        beforeEach(() => {
            tweetService = new TweetService(tweetModel, logger, tweetValidator);
            userService = new UserService(userModel, tweetService, userValidator, jwt, logger);
            userController = new UserController(userService, logger);
            mockResponse = () => {
                let res = {};
                res.status = sinon.stub().returns(res);
                res.json = sinon.stub().returns(res);
                return res;
            };
            
            req = {
                decoded: {
                    user: {
                        _id: '12tyeub78nbb7828'
                    }
                },
                body: {
                    content: "hurray, my first tweet"
                }
            }
              
            next = sinon.spy();
            sandbox = sinon.createSandbox();
            mockSignup = sandbox.stub(userService, 'postTweet').returns(expectedResult);

            expectedResult = {
                "content": "hurray, my first tweet"
            };
        })
        after(function () {
            sandbox.restore(); // Unwraps the spy
        });
        
        it ('should call the user service during posting Tweet', function(done){
            
            userController.postTweet(req, res, next);
            userService.postTweet.calledWith(req.decoded.user._id, req.body.content).should.be.ok;
            done();
        });

        it ('status should return 200 during login when the right response is got from service', async function(){
            const res = mockResponse();
            await userController.postTweet(req, res, next);
            expect(res.status.calledOnce).to.equal(true);
            res.status.calledWith(200).should.be.true;
            res.json.calledWith({ success: true, data: expectedResult}).should.be.ok
        });

    })

    describe('postTweet (Unsuccessful)', () => {
        beforeEach(() => {
            tweetService = new TweetService(tweetModel, logger, tweetValidator);
            userService = new UserService(userModel, tweetService, userValidator, jwt, logger);
            userController = new UserController(userService, logger);
            mockResponse = () => {
                let res = {};
                res.status = sinon.stub().returns(res);
                res.json = sinon.stub().returns(res);
                return res;
            };
              
            next = sinon.spy();
            sandbox         = sinon.createSandbox();
            req = {
                decoded: {
                    user: {
                        _id: '12tyeub78nbb7828'
                    }
                },
                body: {
                    content: "hurray, my first tweet"
                }
            }

            expectedResult = null;
            mockSignup = sandbox.stub(userService, 'postTweet').returns(expectedResult);

        })
        after(function () {
            sandbox.restore(); // Unwraps the spy
        });

        it ('status should return 500 when posting tweet and gets unexpected response from service', async function(){
            const res = mockResponse();
            await userController.postTweet(req, res, next);
            expect(res.status.calledOnce).to.equal(true);
            res.status.calledWith(500).should.be.true;
            res.json.calledWith({ success: false, message: 'Unable to post tweet'}).should.be.ok
        });

        it ('status should return 401 when user is unauthenticated', async function(){
            const res = mockResponse();
            req = {
                decoded: {
                    user: {
                        _id: null
                    }
                },
                body: {
                    content: "hurray, my first tweet"
                }
            }
            await userController.postTweet(req, res, next);
            expect(res.status.calledOnce).to.equal(true);
            res.status.calledWith(401).should.be.true;
            res.json.calledWith({ success: false, message: 'user not authorized'}).should.be.ok
        });
    })

    describe('Post Reply to Tweet', () => {
        beforeEach(() => {
            tweetService = new TweetService(tweetModel, logger, tweetValidator);
            userService = new UserService(userModel, tweetService, userValidator, jwt, logger);
            userController = new UserController(userService, logger);
            mockResponse = () => {
                let res = {};
                res.status = sinon.stub().returns(res);
                res.json = sinon.stub().returns(res);
                return res;
            };
            
            req = {
                params:{
                    id: 'tweet_to_reply_id6627276167'
                },
                decoded: {
                    user: {
                        _id: '12tyeub78nbb7828'
                    }
                },
                body: {
                    content: "hurray, my first tweet"
                }
            }
              
            next = sinon.spy();
            sandbox = sinon.createSandbox();
            mockSignup = sandbox.stub(userService, 'replyTweet').returns(expectedResult);

            expectedResult = {
                "content": "hurray, my first tweet"
            };
        })
        after(function () {
            sandbox.restore(); // Unwraps the spy
        });
        
        it ('should call the user service during posting Tweet', function(done){
            
            userController.replyTweet(req, res, next);
            userService.replyTweet.calledWith(req.decoded.user._id, req.params.id, req.body.content).should.be.ok;
            done();
        });

        it ('status should return 200 during login when the right response from service', async function(){
            const res = mockResponse();
            await userController.replyTweet(req, res, next);
            expect(res.status.calledOnce).to.equal(true);
            res.status.calledWith(200).should.be.true;
            res.json.calledWith({ success: true, data: expectedResult}).should.be.ok
        });

    })

    describe('Reply to Tweet (Unsuccessful)', () => {
        beforeEach(() => {
            tweetService = new TweetService(tweetModel, logger, tweetValidator);
            userService = new UserService(userModel, tweetService, userValidator, jwt, logger);
            userController = new UserController(userService, logger);
            mockResponse = () => {
                let res = {};
                res.status = sinon.stub().returns(res);
                res.json = sinon.stub().returns(res);
                return res;
            };
              
            next = sinon.spy();
            sandbox         = sinon.createSandbox();
            req = {
                params:{
                    id: 'tweet_to_reply_id6627276167'
                },
                decoded: {
                    user: {
                        _id: '12tyeub78nbb7828'
                    }
                },
                body: {
                    content: "hurray, my first tweet"
                }
            }

            expectedResult = null;
            mockSignup = sandbox.stub(userService, 'replyTweet').returns(expectedResult);

        })
        after(function () {
            sandbox.restore(); // Unwraps the spy
        });

        it ('status should return 500 when replying tweet and gets unexpected response from service', async function(){
            const res = mockResponse();
            await userController.replyTweet(req, res, next);
            expect(res.status.calledOnce).to.equal(true);
            res.status.calledWith(500).should.be.true;
            res.json.calledWith({ success: false, message: 'Unable to reply tweet'}).should.be.ok
        });

        it ('status should return 401 when user is unauthenticated', async function(){
            const res = mockResponse();
            req = {
                params:{
                    id: 'tweet_to_reply_id6627276167'
                },
                decoded: {
                    user: {
                        _id: null
                    }
                },
                body: {
                    content: "hurray, my first tweet"
                }
            }
            await userController.replyTweet(req, res, next);
            expect(res.status.calledOnce).to.equal(true);
            res.status.calledWith(401).should.be.true;
            res.json.calledWith({ success: false, message: 'user not authorized'}).should.be.ok
        });
    })

    describe('Get follow Another User', () => {
        beforeEach(() => {
            tweetService = new TweetService(tweetModel, logger, tweetValidator);
            userService = new UserService(userModel, tweetService, userValidator, jwt, logger);
            userController = new UserController(userService, logger);
            mockResponse = () => {
                let res = {};
                res.status = sinon.stub().returns(res);
                res.json = sinon.stub().returns(res);
                return res;
            };
            
            req = {
                params:{
                    id: 'tweet_to_reply_id6627276167'
                },
                decoded: {
                    user: {
                        _id: '12tyeub78nbb7828'
                    }
                }
            }
              
            next = sinon.spy();
            sandbox = sinon.createSandbox();
            mockSignup = sandbox.stub(userService, 'followUser').returns(expectedResult);

            expectedResult = {
                "_id": "12tyeub78nbb7828",
                "tweeter_handle": "@softcom"
            };
        })
        after(function () {
            sandbox.restore(); // Unwraps the spy
        });
        
        it ('should call the user service during posting Tweet', function(done){
            
            userController.followAnotherUser(req, res, next);
            userService.followUser.calledWith(req.decoded.user._id, req.params.id).should.be.ok;
            done();
        });

        it ('status should return 200 during login when the right response from service', async function(){
            const res = mockResponse();
            await userController.followAnotherUser(req, res, next);
            expect(res.status.calledOnce).to.equal(true);
            res.status.calledWith(200).should.be.true;
            res.json.calledWith({ success: true, 
                message: `you are now following, ${expectedResult.tweeter_handle}`}).should.be.ok
        });

    })

    describe('Get follow Another User (Unsuccessful)', () => {
        beforeEach(() => {
            tweetService = new TweetService(tweetModel, logger, tweetValidator);
            userService = new UserService(userModel, tweetService, userValidator, jwt, logger);
            userController = new UserController(userService, logger);
            mockResponse = () => {
                let res = {};
                res.status = sinon.stub().returns(res);
                res.json = sinon.stub().returns(res);
                return res;
            };
              
            next = sinon.spy();
            sandbox         = sinon.createSandbox();
            req = {
                params:{
                    id: 'tweet_to_reply_id6627276167'
                },
                decoded: {
                    user: {
                        _id: '12tyeub78nbb7828'
                    }
                }
            }

            expectedResult = null;
            mockSignup = sandbox.stub(userService, 'followUser').returns(expectedResult);

        })
        after(function () {
            sandbox.restore(); // Unwraps the spy
        });

        it ('status should return 500 when unexpected response is gotten from service', async function(){
            const res = mockResponse();
            await userController.followAnotherUser(req, res, next);
            expect(res.status.calledOnce).to.equal(true);
            res.status.calledWith(500).should.be.true;
            res.json.calledWith({ success: false, message: 'Unable to fetch result'}).should.be.ok
        });

        it ('status should return 401 when user is unauthenticated', async function(){
            const res = mockResponse();
            req = {
                params:{
                    id: 'tweet_to_reply_id6627276167'
                },
                decoded: {
                    user: {
                        _id: null
                    }
                }
            }
            await userController.followAnotherUser(req, res, next);
            expect(res.status.calledOnce).to.equal(true);
            res.status.calledWith(401).should.be.true;
            res.json.calledWith({ success: false, message: 'user not authorized'}).should.be.ok
        });
    })

    describe('GET getOwnTimeLine', () => {
        beforeEach(() => {
            tweetService = new TweetService(tweetModel, logger, tweetValidator);
            userService = new UserService(userModel, tweetService, userValidator, jwt, logger);
            userController = new UserController(userService, logger);
            mockResponse = () => {
                let res = {};
                res.status = sinon.stub().returns(res);
                res.json = sinon.stub().returns(res);
                return res;
            };
            
            req = {
                query: {
                    page: 0,
                    limit: 10
                },
                params:{
                    id: 'tweet_to_reply_id6627276167'
                },
                decoded: {
                    user: {
                        _id: '12tyeub78nbb7828'
                    }
                }
            }
              
            next = sinon.spy();
            sandbox = sinon.createSandbox();
            mockSignup = sandbox.stub(userService, 'getOwnTimeLine').returns(expectedResult);

            expectedResult = [{
                "_id": "12tyeub78nbb7828",
                "tweeter_handle": "@softcom"
            }];
        })
        after(function () {
            sandbox.restore(); // Unwraps the spy
        });
        
        it ('should call the user service during posting Tweet', function(done){
            const pageOptions = {
                page: 0,
                limit: 10
            }
            userController.getOwnTimeLine(req, res, next);
            userService.getOwnTimeLine.calledWith(req.decoded.user._id, pageOptions).should.be.ok;
            done();
        });

        it ('status should return 200 during login when the right response from service', async function(){
            const res = mockResponse();
            await userController.getOwnTimeLine(req, res, next);
            expect(res.status.calledOnce).to.equal(true);
            res.status.calledWith(200).should.be.true;
            res.json.calledWith({ success: true, data: expectedResult}).should.be.ok
        });

    })

    describe('GET getOwnTimeLine(Unsuccessful)', () => {
        beforeEach(() => {
            tweetService = new TweetService(tweetModel, logger, tweetValidator);
            userService = new UserService(userModel, tweetService, userValidator, jwt, logger);
            userController = new UserController(userService, logger);
            mockResponse = () => {
                let res = {};
                res.status = sinon.stub().returns(res);
                res.json = sinon.stub().returns(res);
                return res;
            };
              
            next = sinon.spy();
            sandbox         = sinon.createSandbox();
            req = {
                query: {
                    page: 0,
                    limit: 10
                },
                params:{
                    id: 'tweet_to_reply_id6627276167'
                },
                decoded: {
                    user: {
                        _id: '12tyeub78nbb7828'
                    }
                }
            }

            expectedResult = null;
            mockSignup = sandbox.stub(userService, 'getOwnTimeLine').returns(expectedResult);

        })
        after(function () {
            sandbox.restore(); // Unwraps the spy
        });

        it ('status should return 500 when unexpected response is gotten from service', async function(){
            const res = mockResponse();
            await userController.getOwnTimeLine(req, res, next);
            expect(res.status.calledOnce).to.equal(true);
            res.status.calledWith(500).should.be.true;
            res.json.calledWith({ success: false, message: 'Unable to get timeline'}).should.be.ok
        });

        it ('status should return 401 when user is unauthenticated', async function(){
            const res = mockResponse();
            req = {
                query: {
                    page: 0,
                    limit: 10
                },
                params:{
                    id: 'tweet_to_reply_id6627276167'
                },
                decoded: {
                    user: {
                        _id: null
                    }
                }
            }
            await userController.getOwnTimeLine(req, res, next);
            expect(res.status.calledOnce).to.equal(true);
            res.status.calledWith(401).should.be.true;
            res.json.calledWith({ success: false, message: 'user not authorized'}).should.be.ok
        });
    })

    describe('GET searchTweets', () => {
        beforeEach(() => {
            tweetService = new TweetService(tweetModel, logger, tweetValidator);
            userService = new UserService(userModel, tweetService, userValidator, jwt, logger);
            userController = new UserController(userService, logger);
            mockResponse = () => {
                let res = {};
                res.status = sinon.stub().returns(res);
                res.json = sinon.stub().returns(res);
                return res;
            };
            
            req = {
                query: {
                    page: 0,
                    limit: 10,
                    search: "tweet"
                },
                decoded: {
                    user: {
                        _id: '12tyeub78nbb7828'
                    }
                }
            }
              
            next = sinon.spy();
            sandbox = sinon.createSandbox();
            mockSignup = sandbox.stub(userService, 'searchTweets').returns(expectedResult);

            expectedResult = [{
                "_id": "12tyeub78nbb7828",
                "content": "@softcom we are going forward"
            }];
        })
        after(function () {
            sandbox.restore(); // Unwraps the spy
        });
        
        it ('should call the user service during posting Tweet', function(done){
            const pageOptions = {
                page: 0,
                limit: 10
            }
            userController.searchTweets(req, res, next);
            userService.searchTweets.calledWith(req.query.search, pageOptions).should.be.ok;
            done();
        });

        it ('status should return 200 during login when the right response from service', async function(){
            const res = mockResponse();
            await userController.searchTweets(req, res, next);
            expect(res.status.calledOnce).to.equal(true);
            res.status.calledWith(200).should.be.true;
            res.json.calledWith({ success: true, data: expectedResult}).should.be.ok
        });

    })

    describe('GET Search Tweets (Unsuccessful)', () => {
        beforeEach(() => {
            tweetService = new TweetService(tweetModel, logger, tweetValidator);
            userService = new UserService(userModel, tweetService, userValidator, jwt, logger);
            userController = new UserController(userService, logger);
            mockResponse = () => {
                let res = {};
                res.status = sinon.stub().returns(res);
                res.json = sinon.stub().returns(res);
                return res;
            };
              
            next = sinon.spy();
            sandbox         = sinon.createSandbox();
            req = {
                query: {
                    page: 0,
                    limit: 10,
                    search: "ann"
                },
                params:{
                    id: 'tweet_to_reply_id6627276167'
                },
                decoded: {
                    user: {
                        _id: '12tyeub78nbb7828'
                    }
                }
            }

            expectedResult = null;
            mockSignup = sandbox.stub(userService, 'searchTweets').returns(expectedResult);

        })
        after(function () {
            sandbox.restore(); // Unwraps the spy
        });

        it ('status should return 500 when unexpected response is gotten from service', async function(){
            const res = mockResponse();
            await userController.searchTweets(req, res, next);
            expect(res.status.calledOnce).to.equal(true);
            res.status.calledWith(500).should.be.true;
            res.json.calledWith({ success: false, message: 'Unable to get tweet to match result'}).should.be.ok
        });

        it ('status should return 400 when search query string is not passed', async function(){
            req = {
                query: {
                    page: 0,
                    limit: 10,
                    search: null
                },
                params:{
                    id: 'tweet_to_reply_id6627276167'
                },
                decoded: {
                    user: {
                        _id: '12tyeub78nbb7828'
                    }
                }
            }
            const res = mockResponse();
            await userController.searchTweets(req, res, next);
            expect(res.status.calledOnce).to.equal(true);
            res.status.calledWith(400).should.be.true;
            res.json.calledWith({ success: false, message: 'no search query was passed'}).should.be.ok
        });

        it ('status should return 401 when user is unauthenticated', async function(){
            const res = mockResponse();
            req = {
                query: {
                    page: 0,
                    limit: 10,
                    search: "ann"
                },
                params:{
                    id: 'tweet_to_reply_id6627276167'
                },
                decoded: {
                    user: {
                        _id: null
                    }
                }
            }
            await userController.searchTweets(req, res, next);
            expect(res.status.calledOnce).to.equal(true);
            res.status.calledWith(401).should.be.true;
            res.json.calledWith({ success: false, message: 'user not authorized'}).should.be.ok
        });
    })

    describe('GET searchUsers', () => {
        beforeEach(() => {
            tweetService = new TweetService(tweetModel, logger, tweetValidator);
            userService = new UserService(userModel, tweetService, userValidator, jwt, logger);
            userController = new UserController(userService, logger);
            mockResponse = () => {
                let res = {};
                res.status = sinon.stub().returns(res);
                res.json = sinon.stub().returns(res);
                return res;
            };
            
            req = {
                query: {
                    page: 0,
                    limit: 10,
                    user: "tweet"
                },
                decoded: {
                    user: {
                        _id: '12tyeub78nbb7828'
                    }
                }
            }
              
            next = sinon.spy();
            sandbox = sinon.createSandbox();
            mockSignup = sandbox.stub(userService, 'searchUsers').returns(expectedResult);

            expectedResult = [{
                "_id": "12tyeub78nbb7828"
            }];
        })
        after(function () {
            sandbox.restore(); // Unwraps the spy
        });
        
        it ('should call the user service during posting Tweet', function(done){
            const pageOptions = {
                page: 0,
                limit: 10
            }
            userController.searchUsers(req, res, next);
            userService.searchUsers.calledWith(req.query.user, pageOptions).should.be.ok;
            done();
        });

        it ('status should return 200 during login when the right response from service', async function(){
            const res = mockResponse();
            await userController.searchUsers(req, res, next);
            expect(res.status.calledOnce).to.equal(true);
            res.status.calledWith(200).should.be.true;
            res.json.calledWith({ success: true, data: expectedResult}).should.be.ok
        });

    })

    describe('GET Search Users (Unsuccessful)', () => {
        beforeEach(() => {
            tweetService = new TweetService(tweetModel, logger, tweetValidator);
            userService = new UserService(userModel, tweetService, userValidator, jwt, logger);
            userController = new UserController(userService, logger);
            mockResponse = () => {
                let res = {};
                res.status = sinon.stub().returns(res);
                res.json = sinon.stub().returns(res);
                return res;
            };
              
            next = sinon.spy();
            sandbox         = sinon.createSandbox();
            req = {
                query: {
                    page: 0,
                    limit: 10,
                    user: "ann"
                },
                params:{
                    id: 'tweet_to_reply_id6627276167'
                },
                decoded: {
                    user: {
                        _id: '12tyeub78nbb7828'
                    }
                }
            }

            expectedResult = null;
            mockSignup = sandbox.stub(userService, 'searchUsers').returns(expectedResult);

        })
        after(function () {
            sandbox.restore(); // Unwraps the spy
        });

        it ('status should return 500 when unexpected response is gotten from service', async function(){
            const res = mockResponse();
            await userController.searchUsers(req, res, next);
            expect(res.status.calledOnce).to.equal(true);
            res.status.calledWith(500).should.be.true;
            res.json.calledWith({ success: false, message: 'Unable to get users to match query'}).should.be.ok
        });

        it ('status should return 400 when search query string is not passed', async function(){
            req = {
                query: {
                    page: 0,
                    limit: 10,
                    search: null
                },
                params:{
                    id: 'tweet_to_reply_id6627276167'
                },
                decoded: {
                    user: {
                        _id: '12tyeub78nbb7828'
                    }
                }
            }
            const res = mockResponse();
            await userController.searchUsers(req, res, next);
            expect(res.status.calledOnce).to.equal(true);
            res.status.calledWith(400).should.be.true;
            res.json.calledWith({ success: false, message: 'no search query was passed'}).should.be.ok
        });

        it ('status should return 401 when user is unauthenticated', async function(){
            const res = mockResponse();
            req = {
                query: {
                    page: 0,
                    limit: 10,
                    search: "ann"
                },
                params:{
                    id: 'tweet_to_reply_id6627276167'
                },
                decoded: {
                    user: {
                        _id: null
                    }
                }
            }
            await userController.searchUsers(req, res, next);
            expect(res.status.calledOnce).to.equal(true);
            res.status.calledWith(401).should.be.true;
            res.json.calledWith({ success: false, message: 'user not authorized'}).should.be.ok
        });
    })
})