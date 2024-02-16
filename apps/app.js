const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
app.use(cors({
    origin: 'https://registration-client-react.vercel.app',
    credentials: true
}));


app.use(bodyParser.json());

module.exports = app;
