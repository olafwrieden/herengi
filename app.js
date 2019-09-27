const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const port = process.env.PORT

app.use(express.json());
app.use(express.static('public'))

/**
 * Default Route, Render Client Page
 */
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => console.log(`Herengi API listening on port ${port}!`))