const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let DomoModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const setPower = (power) => _.escape(power).trim();

const DomoSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, set: setName },
  age: { type: Number, min: 0, required: true },
  power: { type: String, required: true, trim: true, set: setPower },
  owner: { type: mongoose.Schema.ObjectId, required: true, ref: 'Account' },
  createdDate: { type: Date, default: Date.now },
});

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const searchParams = { owner: convertId(ownerId) };

  return DomoModel.find(searchParams).select('name age power').exec(callback);
};

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports = {
  DomoModel,
  DomoSchema,
};
