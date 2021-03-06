// import { format, formatDistance, formatRelative, subDays } from 'date-fns'
const { subDays, formatDistance } = require("date-fns");
const express = require("express");
const dotenv = require("dotenv");
const { AuthClient, ApiClient } = require("bankengine-js-sdk");
dotenv.config();

const app = express();
const port = process.env.PORT;
const host = process.env.HOST;
console.log(host);
app.use(express.json());
app.use(express.static("views"));
app.set("view engine", "ejs");

// BankEngine Configuration
let redirectUri;
if (process.env.NODE_ENV === "production") {
  redirectUri = `${host}/callback`;
} else {
  redirectUri = `${host}:${port}/callback`;
}
const scopes = ["userinfo", "accounts", "balance", "transactions", "payments"];
const apiClient = new ApiClient();
const authClient = new AuthClient(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  redirectUri
);

/**
 * Renders Default Route
 */
app.get("/", (req, res) => {
  const authURL = authClient.generateAuthorizationURL(scopes, "nonce", "state");
  res.redirect(authURL);
});

/**
 * BankEngine API Callback
 */
app.get("/callback", async (req, res) => {
  const code = req.query.code;

  // Exchange Code for Access Token
  const tokens = await authClient.exchangeToken(code);
  const { access_token } = tokens;

  // Redirect to Account Selector
  res.redirect(`/accounts?accessToken=${access_token}`);
});

/**
 * Renders all accounts of the user
 */
app.get("/accounts", async (req, res) => {
  const accessToken = req.query.accessToken;
  const accounts = await apiClient.getAccounts(accessToken);
  return res.render("accounts", {
    accounts: accounts.data,
    accessToken
  });
});

/**
 * Renders the given account's data.
 */
app.get("/accounts/:id", async (req, res) => {
  const id = req.params.id;
  const accessToken = req.query.accessToken;
  let account = await getAccountData(id, accessToken);
  let lastSevenTotal = await lastSevenDays(account, accessToken, id);
  Object.assign(account, { lastSeven: lastSevenTotal });
  return res.render("main", {
    account,
    accessToken
  });
});

/**
 * Returns total week change.
 * @param {Object} account given account for which to retrieve transactions
 * @param {String} accessToken access token for BankEngine API
 * @param {Number} accountID account ID for which to retrieve data
 */
const lastSevenDays = async (account, accessToken, accountID) => {
  let sevenDaysAgo = subDays(new Date(account.updatedTimestamp), 7);
  const transactions = await apiClient.getTransactions(
    accessToken,
    accountID,
    sevenDaysAgo
  );

  let total = 0;
  let change = "";
  for (let i = 0; i < transactions.data.length; i++) {
    total += transactions.data[i].amount;
  }

  switch (Math.sign(total)) {
    case 1:
      change = "increased";
      break;
    case -1:
      change = "decreased";
      break;
    default:
      change = "same";
  }

  return { total, change };
};

/**
 * Returns a given account's details (incl. balance).
 * @param {Number} accountID account ID for which to retrieve data
 * @param {String} accessToken access token for BankEngine API
 */
const getAccountData = async (accountID, accessToken) => {
  const account = await apiClient.getAccount(accessToken, accountID);
  const balance = await apiClient.getBalance(accessToken, accountID);
  return formatReturnData(account.data[0], balance.data[0]);
};
/**
 * Merges Account and Balance data into one account object representation.
 * @param {Object} account account object whose data to merge
 * @param {Object} balance balance object whose data to merge
 */
const formatReturnData = (account, balance) => {
  return {
    displayName: account.displayName,
    accountType: account.accountType,
    accountNumber: account.accountNumber,
    currency: account.currency,
    updatedTimestamp: balance.updatedTimestamp,
    provider: account.provider,
    available: balance.available,
    current: balance.current
  };
};

app.listen(port, () => console.log(`Herengi API listening on port ${port}!`));
