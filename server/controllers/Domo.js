// Import the models
const models = require('../models');

// set up the model
const Domo = models.Domo;

const Account = models.Account;

// Page for making Domos
const makerPage = (req, res) => {
  // Load in all the Domos of the specific user
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) { return res.status(400).json({ error: 'An error occured!' }); }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

// Making a new domo
const makeDomo = (req, res) => {
  // Error check
  if (!req.body.name || !req.body.age || !req.body.power) {
    return res.status(400).json({
      error: 'RAWR! A name, power, and age are required' });
  }

  // Creating the data
  const domoData = { name: req.body.name,
    age: req.body.age,
    power: req.body.power, // Added attribute
    owner: req.session.account._id,
  };


  // Creating the domo object
  const newDomo = new Domo.DomoModel(domoData);

  // Handling the promise
  const domoPromise = newDomo.save();

  domoPromise.then(() => {
    res.json({ redirect: '/maker' });

    // Used to increment the amount of domos created by one person
    Account.AccountModel.findByUsername(req.session.account.username, (err, doc) => {
      // Error check
      if (err) return res.json({ err });

      // If no error, create a temp variable to store changes
      const foundUser = doc;

      // Increasing their amount of domos
      foundUser.domosMade++;

      // Handling promise to reassign the user's info
      const updatePromise = foundUser.save();

      updatePromise.then(() => res.json({
        username: foundUser.username, salt: foundUser.salt, password: foundUser.password,
        domosMade: foundUser.domosMade, createdDate: foundUser.createdDate }));

      updatePromise.catch((err2) => res.json({ err2 }));
      return true;
    });
  });

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) { return res.status(400).json({ error: 'Domo already exists!' }); }

    return res.status(400).json({ error: 'An error occured!' });
  });

  return domoPromise;
};


const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ domos: docs });
  });
};

// Exports
module.exports.makerPage = makerPage;
module.exports.make = makeDomo;
module.exports.getDomos = getDomos;
