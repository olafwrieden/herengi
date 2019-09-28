const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.static("public"));

/**
 * Default Route, Render Client Page
 */
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

/**
 * Dummy Data
 */
app.get("/dummy-data", (req, res) => {
  let data = {
    total: 24.75,
    this_week: 3.55
  };
  res.send(data);
});

app.listen(port, () => console.log(`Herengi API listening on port ${port}!`));
