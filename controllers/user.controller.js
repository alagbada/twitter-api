
class UserController {
    constructor(userService, logger) {
        this.userService = userService;
        this.logger = logger;
    }

    async registration (req, res, next) {
        const body = req.body;
        try {
            const data = await this.userService.signup(body);
            if (data.hasOwnProperty('result')) {
                return res.status(200).json({
                    success: true,
                    token: data.token,
                    data: data.result
                })
            } else {
                return res.status(500).json({
                    success: false,
                    message: 'Unable to save data'
                });
            }
        } catch (error) {
            return next(error);
        }
    }

    async login (req, res, next) {
        const email = req.body.email;
        const password = req.body.password;
        try {
            let response = await this.userService.login(email, password);
            if (response) {  
                return res.status(200).json({
                    success: true,
                    message: 'successful login',
                    token: response.token,
                    data: response.data
                });
            } else {
                return res.status(403).json({
                    success: false,
                    message: 'Incorrect username or password'
                })
            }
        } catch (error) {
            this.logger.error('Unable to login with the details,username: %s, password: %s', email, password);
            return next(error);
        }
    }

    async postTweet (req, res, next) {
        const _id = req.decoded.user._id;
        const content = req.body.content;
        try {
            if (!_id) {
                return res.status(401).json({
                    success: false,
                    message: 'user not authorized'
                })
            }
            let tweet = await this.userService.postTweet(_id, content);
            if (tweet) {
                return res.status(200).json({
                    success: true,
                    data: tweet
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: 'Unable to post tweet'
                })
            }
           
        } catch (error) {
            this.logger.error('error occured while posting tweet', error.message);
            return next(error);
        }
    }

    async replyTweet (req, res, next) {
        const _id = req.decoded.user._id;
        const tweetId = req.params.id;
        const content = req.body.content;
        
        try {
            if (!_id) {
                return res.status(401).json({
                    success: false,
                    message: 'user not authorized'
                })
            }
            let tweet = await this.userService.replyTweet(_id, tweetId, content);
            if (!tweet) {
                return res.status(500).json({
                    success: false,
                    message: 'Unable to reply tweet'
                })
            }
            return res.status(200).json({
                success: true,
                data: tweet
            });
        } catch (error) {
            this.logger.error('error occured while posting tweet', error.message);
            return next(error);
        }
    }

    async followAnotherUser (req, res, next) {
        const _id = req.decoded.user._id;
        const friendId = req.params.id;
        
        try {
            if (!_id) {
                return res.status(401).json({
                    success: false,
                    message: 'user not authorized'
                })
            }
            const friend = await this.userService.followUser(_id, friendId);
            if (!friend) {
                return res.status(500).json({
                    success: false,
                    message: 'Unable to fetch result'
                })
            }
            return res.status(200).json({
                success: true,
                message: `you are now following, ${friend.tweeter_handle}`
            });
        } catch (error) {
            this.logger.error('error occured while trying to follow user', error.message);
            return next(error);
        }
    }

    async getOwnTimeLine (req, res, next) {
        const _id = req.decoded.user._id;
        const pageOptions = {
            page: parseInt(req.query.page, 10) || 0,
            limit: parseInt(req.query.limit, 10) || 10
        }
        
        try {
            if (!_id) {
                return res.status(401).json({
                    success: false,
                    message: 'user not authorized'
                })
            }
            const allTweets = await this.userService.getOwnTimeLine(_id, pageOptions);
            if (!allTweets) {
                return res.status(500).json({
                    success: false,
                    message: 'Unable to get timeline'
                })
            }
            return res.status(200).json({
                success: true,
                data: allTweets
            });
        } catch (error) {
            this.logger.error('error occured fetching timelines', error.message);
            return next(error);
        }
    }

    async searchTweets (req, res, next) {
        const _id = req.decoded.user._id;
        const searchQuery = req.query.search;
        const pageOptions = {
            page: parseInt(req.query.page, 10) || 0,
            limit: parseInt(req.query.limit, 10) || 10
        }
        
        try {
            if (!_id) {
                return res.status(401).json({
                    success: false,
                    message: 'user not authorized'
                })
            }
            if (!searchQuery) {
                return res.status(400).json({
                    success: false,
                    message: 'no search query was passed'
                })
            }
            const searchResult = await this.userService.searchTweets(searchQuery, pageOptions);
            if (!searchResult) {
                return res.status(500).json({
                    success: false,
                    message: 'Unable to get tweet to match result'
                })
            }
            return res.status(200).json({
                success: true,
                data: searchResult
            });
        } catch (error) {
            this.logger.error(`error occured while searching for ${query}`, error.message);
            return next(error);
        }
    }

    async searchUsers (req, res, next) {
        const _id = req.decoded.user._id;
        const searchQuery = req.query.user;

        const pageOptions = {
            page: parseInt(req.query.page, 10) || 0,
            limit: parseInt(req.query.limit, 10) || 10
        }
        
        try {
            if (!_id) {
                return res.status(401).json({
                    success: false,
                    message: 'user not authorized'
                });
            }

            if (!searchQuery) {
                return res.status(400).json({
                    success: false,
                    message: 'no search query was passed'
                })
            }
            const searchResult = await this.userService.searchUsers(searchQuery, pageOptions);
            if (!searchResult) {
                return res.status(500).json({
                    success: false,
                    message: 'Unable to get users to match query'
                })
            }
            return res.status(200).json({
                success: true,
                data: searchResult
            });
        } catch (error) {
            this.logger.error(`error occured while searching for ${query}`, error.message);
            return next(error);
        }
    }
    
}

module.exports = UserController;