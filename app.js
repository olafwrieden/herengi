const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");

const { AuthClient, ApiClient } = require("bankengine-js-sdk");

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.static("views"));
app.set("view engine", "ejs");

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

  TOKEN = accessToken;

  // return the access token to the client
  res.redirect(`/app?accessToken=${accessToken}`);
});

app.get("/app", async (req, res) => {
  const accessToken = req.query.accessToken;
  console.log(accessToken);
  const accounts = await apiClient.getAccounts(accessToken);

  let html = "<html>";
  html += "<ul>";

  for (const account of accounts.data) {
    // query 3 months of transactions from the users account
    const balances = await apiClient.getAccounts(
      accessToken,
      account.accountId
    ); //   getBalance(accessToken, account.accountId);
    //const balances = await apiClient.getBalance(accessToken, account.accountId);

    html += `<li><a href=\"/data?accessToken=${accessToken}&accountid=${account.accountId}\">Link to account</a></li>`;
  }

  html += "</ul></html>";

  //res.send(html);
  //res.sendFile(__dirname + "/public/index.html");
  return res.render("page", {
    accounts: accounts
  });
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
  const accessToken = req.query.accessToken || TOKEN;
  // if (!id || !accessToken) {
  //   return res.send("No id or token parameter");
  // }

  let returnData = {};

  const accounts = await apiClient.getAccounts(accessToken);
  for (let i = 0; i < accounts.data.length; i++) {
    if (accounts.data[i].accountId === id) {
      Object.assign(returnData, accounts.data[i]);
      const balances = await getAccountBalance(accessToken, id);
      Object.assign(returnData, balances.data[0]);
      return res.send(returnData);
    }
  }
  return res.send(`No account with this id: ${id}`);
});

/**
 * returns accounts data
 */
app.get("/accounts", async (req, res) => {
  const accessToken = req.query.accessToken;
  let accounts = await apiClient.getAccounts(accessToken);
  return accounts ? res.send(accounts.data) : res.send(null);
});

/**
 * returns account data by id
 */
app.get("/accounts/:id", async (req, res) => {
  const id = req.params.id;
  const accessToken = req.query.accessToken || TOKEN;
  let account = await apiClient.getAccount(accessToken, id);
  return res.render("main", {
    account: account
  });
  //return account ? res.send(account.data[0]) : res.send(null);
});

/**
 * Returns the given account's balance
 */
const getAccountBalance = async (accessToken, id) => {
  let result = await apiClient.getBalance(accessToken, id);
  return result ? result : null;
};

app.listen(port, () => console.log(`Herengi API listening on port ${port}!`));
