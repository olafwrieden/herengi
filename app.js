const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");

const { AuthClient, ApiClient } = require("bankengine-js-sdk");

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
//app.use(express.static("public"));

const clientId = "hackathon2019";
const clientSecret = "secret";
const redirectUri = "http://localhost:5000/callback";

const authClient = new AuthClient(clientId, clientSecret, redirectUri);
const apiClient = new ApiClient();

let TOKEN = null;

const scopes = ["userinfo", "accounts", "balance", "transactions", "payments"];

/**
 * Default Route, Render Client Page
 */
app.get("/", (req, res) => {
  console.log("test");
  const authURL = authClient.generateAuthorizationURL(scopes, "nonce", "state");
  res.redirect(authURL);
});

app.get("/callback", async (req, res) => {
  const code = req.query.code;

  // should validate state
  // const state = req.query.state;

  // exchange code for access token and optionaly redirect token
  const tokens = await authClient.exchangeToken(code);
  const accessToken = tokens.access_token;

  // return the access token to the client
  res.redirect(`/app?accessToken=${accessToken}`);
});

app.get("/app", async (req, res) => {
  const accessToken = req.query.accessToken;
  const accounts = await apiClient.getAccounts(accessToken);

  let html = "<html>";
  html += "<ul>";

  for (const account of accounts.data) {
    // query 3 months of transactions from the users account
    console.log("account", account);
    const balances = await apiClient.getAccounts(
      accessToken,
      account.accountId
    ); //   getBalance(accessToken, account.accountId);
    //const balances = await apiClient.getBalance(accessToken, account.accountId);

    html += `<li><a href=\"/data?accessToken=${accessToken}&accountid=${account.accountId}\">Link to account</a></li>`;
  }

  html += "</ul></html>";

  //res.send(html);
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

/**
 * returns accounts data
 */
app.get("/data", async (req, res) => {
  const id = req.query.accountId;
  const accessToken = req.query.accessToken;
  if (!id || !accessToken) {
    return res.send("No id or token parameter");
  }

  let returnData = {};

  const accounts = await apiClient.getAccounts(accessToken);
  for (let i = 0; i < accounts.data.length; i++) {
    if (accounts.data[i].accountId === id) {
      Object.assign(returnData, accounts.data[i]);
      const balances = await apiClient.getBalance(accessToken, id);
      Object.assign(returnData, balances.data[0]);
      return res.send(returnData);
    }
  }
  return res.send(`No account with this id: ${id}`);
});

app.listen(port, () => console.log(`Herengi API listening on port ${port}!`));
