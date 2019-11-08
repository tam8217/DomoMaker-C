// Importing and setting up model
const models = require('../models');

const Account = models.Account;

// Rendering basic pages
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  // destroy old user ID
  req.session.destroy();
  res.redirect('/');
};
const userList = (req, res) => {
  res.render('users');
};
const login = (request, response) => {
  // Grab username and password from passed in data
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  // Error check
  if (!username || !password) {
    return res.status(400).json({ error: 'RAWR! All fields must be filled in' });
  }

  // Authenticating and checking user
  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) { return res.status(401).json({ error: 'Wrong username or password' }); }

    req.session.account = Account.AccountModel.toAPI(account);
    return res.json({ redirect: '/maker' });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = { csrfToken: req.csrfToken() };

  res.json(csrfJSON);
};

const signup = (request, response) => {
  // Get the user nane, and passwords from passed in data
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  // Make sure they exist
  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! All fields must be filled in' });
  }

  // Check if passwords match
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: "RAWR! Your passwords don't match!" });
  }

  // Set up account
  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = { username: req.body.username, salt, password: hash };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);
      if (err.code === 11000) { return res.status(400).json({ error: 'Username already in use' }); }

      return res.status(400).json({ error: 'An error happened' });
    });
  });
};

// Retrieves all accounts
const getAccounts = (request, response) => {
  const res = response;

  // Sending back users
  return Account.AccountModel.find((err, docs) => {
    if (err) return res.status(400).json({ err });

    return res.json({ users: docs });
  });
};

// Exports
module.exports = {
  loginPage,
  login,
  logout,
  signup,
  getToken,
  userList,
  getAccounts,
};
