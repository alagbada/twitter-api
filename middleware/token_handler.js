const jwt = require('jsonwebtoken');
const config = require('../config/config');

const tokenHandler = (req, res, next) => {
    let token = req.headers['x-user-token'];
    if (token) {
        jwt.verify(token, config.token.key, function(err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'token is invalid'
                })
            } else {
                req.decoded = decoded;
                next();
            }
        });
        
    } else {
        return res.json({
            success: false,
            message: 'Authentication not supplied'
        })
    }
}

module.exports = tokenHandler;