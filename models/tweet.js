const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    content: {
        type: String,
        maxlength: 280
    },
    thread: {
        type: Array(this.tweetSchema),
        default: []
    },
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date
    },
    created_by: {
        type: String,
        required: true
    },
    is_promoted: {
        type: Boolean,
        default: false
    },
    hashtags: {
        type: Array(String)
    },
    mentions: {
        type: Array(String)
    },
    urls: {
        type: Array(String)
    },    
    parent: {
        type: String,
        default: null,
        index: true
    },
    children: {
        type: Array(String),
        index: true
    },
    interaction_details: {
        like: {
            type: Number,
            default: 0
        },
        retweet: {
            type: Number,
            default: 0
        },
        share: {
            type: Number,
            default: 0
        },
        comment: {
            type: Array(this.tweetSchema)
        }
    }
});
tweetSchema.index({'$**': 'text'});

tweetSchema.pre('save', function (next) {
    this.hashtags = getAllHashTagsInTweet(this.content);
    this.mentions = getAllMentionsInTweet(this.content);
    this.urls = getAllUrlsInTweet(this.content);
    this.updated_at = Date.now();
    if (!this.created_at) {
        this.created_at = Date.now();
    }
    next();
});

function getAllHashTagsInTweet(content) {
    let contentArray = content.split(' ');
    let allTags = contentArray.filter(eachWord => {
        if (eachWord.startsWith('#')) {
            return eachWord;
        }
    })
    return allTags;
}

function getAllMentionsInTweet(content) {
    let contentArray = content.split(' ');
    let allTags = contentArray.filter(eachWord => {
        if (eachWord.startsWith('@')) {
            return eachWord;
        }
    })
    return allTags;
}

function getAllUrlsInTweet(content) {
    let contentArray = content.split(' ');
    let allTags = contentArray.filter(eachWord => {
        const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
        const regex = new RegExp(expression);
        if (eachWord.match(regex)) {
            return eachWord;
        }
    })
    return allTags;
}


// const User = mongoose.model('user', userSchema);
// const Tweet = mongoose.model('tweet', tweetSchema)

const validateTweet = tweet => {
    const schema= {
        content: Joi.string().max(280).required(),
        created_by: Joi.string().required(),
        parent: Joi.string().allow(null)
    };
    return  Joi.validate(tweet, schema);
}

module.exports = {
    tweetSchema,
    validateTweet
}
