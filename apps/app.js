require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const SERVER_PORT = process.env.SERVER_PORT;
const CLIENT_PORT = process.env.CLIENT_PORT;
const url = 'http://localhost:'
app.listen(SERVER_PORT, () => {
    console.log(`Server is running on ${url}${SERVER_PORT}`);
});

app.use(cors({origin: 'http://localhost:3000', credentials: true}));

app.use(bodyParser.json());

module.exports = app;
