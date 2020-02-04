const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());
const serviceLocator = require('./config/di');
const logger = serviceLocator.get('logger');
require('./lib/routes')(app);
require('./config/db')();
require('./lib/validation')();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const port = process.env.PORT;
app.listen(port, () => logger.info(`Listening on port ${port}`))

