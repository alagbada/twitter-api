require('express-async-errors');
const { createLogger, transports } = require('winston');

const logger = module.exports = createLogger({
    transports: [
      new transports.File({ filename: 'logs.log' }),
      new transports.Console( {colorize:true, prettyPrint:true}),
    ],
    exceptionHandlers: [
      new transports.File({ filename: 'exceptions.log' }),
      new transports.Console( {colorize:true, prettyPrint:true})
    ]
  });
  // logging unhandled promiseexception errors
  process.on('unhandledException', (ex) => {
      throw ex;
  });
