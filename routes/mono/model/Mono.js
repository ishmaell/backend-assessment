const mongoose = require('../../../services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
const validator = require('validator');
const utils = require('../../../utils');
const bcryptjs = require('bcryptjs');

const monoSchema = new Schema({
  accountId: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });


monoSchema.methods.toJSON = function () {
  const mono = this;
  const momoObject = mono.toObject();

  delete momoObject._id;
  delete momoObject.__v;

  return momoObject;
}


const Mono = mongoose.model('mono', monoSchema);

exports.insert = data => {
  const mono = new Mono(data);
  return mono.save();
}
