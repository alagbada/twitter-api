// const logger = require('../lib/logger');

class TweetService {
    constructor(model, logger, tweetValidator) {
        this.tweetModel = model;
        this.logger = logger;
        this.tweetValidator = tweetValidator;
    }

    /**
     * 
     * @param {string} userId 
     * @param {string} content 
     */
    async postTweet(userId, content) {
        const tweetData = {
            content,
            created_by: userId
        }
        const validationStatus = this.tweetValidator(tweetData);
        if (validationStatus.error) {
            throw validationStatus.error;
        }
        const tweet = await this.tweetModel.create(tweetData);
        if (!tweet) throw new Error('unable to post tweet')
        return tweet;
    }
    
    /**
     * 
     * @param {string} userId 
     * @param {string} tweetId 
     * @param {string} content 
     * @returns {object}
     */
    async replyTweet(userId, tweetId, content) {
        const tweetData = {
            content,
            created_by: userId,
            parent: tweetId
        }
        const validationStatus = this.tweetValidator(tweetData);
        if (validationStatus.error) {
            throw validationStatus.error;
        }
        const tweet = await this.tweetModel.create(tweetData);
        // this.tweetModel.findById // will look into how to embed the tweet into the parent reference if it is worth it.
        return tweet;
    }


    async searchTweets(query, pagination) {
        const searchResult = await this.tweetModel.find({$text: {$search: query}})
            .sort([['updated_at', -1]])
            .skip(pagination.page * pagination.limit)
            .limit(pagination.limit)
        return searchResult;
    }

    /**
     * 
     * @param {string} userId 
     * @param {object} pagination
     * @param {Array} followingList
     * pagination contains page and limit properties
     * @returns {object}
     */
    async getAllOwnTimeLineTweets(userId, pagination, followingList) {
        followingList.push(userId);
        const allTweets = await this.tweetModel.find({created_by: {$in: followingList}})
            .sort([['updated_at', -1]])
            .skip(pagination.page * pagination.limit)
            .limit(pagination.limit)
        return allTweets;
    }
}

module.exports = TweetService;