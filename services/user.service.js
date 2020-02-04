const bcrypt = require('bcrypt');
const logger = require('../lib/logger');
const config = require('../config/config');

class UserService {
    constructor(userModel, tweetService, userValidator, jwt, logger) {
        this.userModel = userModel;
        this.tweetService = tweetService;
        this.userValidator = userValidator;
        this.jwt = jwt;
        this.logger = logger;
    }

    async signup(data) {
        const saltRounds = 10;
        if (!data) {
            throw new Exception('Data is Unavailable');
        }
        let hashPassword = await bcrypt.hash(data.password, saltRounds);
        let userDataForRegistration = {
            firstname: data.firstname,
            lastname: data.lastname,
            password: hashPassword,
            date_of_birth: data.date_of_birth,
            email: data.email,
            tweeter_handle: data.tweeter_handle,
            phone_number: data.phone_number
        }
        const validationStatus = this.userValidator(userDataForRegistration);
        if (validationStatus.error) {
            this.logger.error('validation error occured for the user during registration');
            throw validationStatus.error;
        }
        const result = await this.userModel.create(userDataForRegistration);
        this.logger.info('user has been registered successfully');
        let tokenData = {
            email: result.email,
            _id: result._id,
            phone_number: result.phone_number
        };
        let token = this.jwt.sign({ user: tokenData }, 
            config.token.key, { expiresIn: config.token.expiration_time });

        return {result, token};
    }

    async login(username, password) {
        const user = await this.userModel.findOne({email: username});
        const match = await bcrypt.compare(password, user.password);
        if (!user || !match) {
            throw Error('No user record was found!');
        }
        let tokenData = {
            email: user.email,
            _id: user._id,
            phone_number: user.phone_number
        };
        let token = this.jwt.sign({user: tokenData}, 
            config.token.key, {expiresIn: config.token.expiration_time});
        return {
            token,
            data: user
        }
    }

    async postTweet(userId, content) {
        const reply = await this.tweetService.postTweet(userId, content);
        const user = await this.userModel.findById({_id: userId});
        user.tweets.push(reply._id);
        await user.save();
        return reply;
    }

    async replyTweet(userId, tweetId, content) { // consider using the @mention of the tweet author
        const reply = await this.tweetService.replyTweet(userId, tweetId, content); 
        const user = await this.userModel.findById({_id: userId});
        user.tweets.push(reply._id);
        await user.save();
        return reply;
    }

    async followUser(userId, userToFollowId) {
        let user = await this.userModel.findById({_id: userId});
        user.following.push(userToFollowId);
        await user.save()
        return await this.userModel.findById({_id: userToFollowId});
    }

    async getOwnTimeLine(userId, pagination) {
        const user = await this.userModel.findById({_id: userId});
        let followingList = user.following;
        const tweets = await this.tweetService.getAllOwnTimeLineTweets(userId, pagination, followingList);
        return {
            user,
            tweets
        };
    }

    async searchTweets(query, pagination) {
        const searchResult = await this.tweetService.searchTweets(query, pagination);
        return searchResult;
    }

    async searchUsers(query, pagination) {
        const searchResult = await this.userModel.find({$text: {$search: query}})
            .sort([['updated_at', -1]])
            .skip(pagination.page * pagination.limit)
            .limit(pagination.limit)
        return searchResult;
    }

}

module.exports = UserService;