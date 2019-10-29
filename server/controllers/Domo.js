// Import the models
const models = require('../models');

// set up the model
const Domo = models.Domo;

// Page for making Domos
const makerPage = (req, res) => {
  // Load in all the Domos of the specific user
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) { return res.status(400).json({ error: 'An error occured!' }); }

    return res.render('app', { domos: docs });
  });
};

// Making a new domo
const makeDomo = (req, res) => {
  // Error check
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({
      error: 'RAWR! Both a name and age are required' });
  }

  // Creating the data
  const domoData = { name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
  };

  // Creating the domo object
  const newDomo = new Domo.DomoModel(domoData);

  // Handling the promise
  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) { return res.status(400).json({ error: 'Domo already exists!' }); }

    return res.status(400).json({ error: 'An error occured!' });
  });

  return domoPromise;
};

// Exports
module.exports.makerPage = makerPage;
module.exports.make = makeDomo;
