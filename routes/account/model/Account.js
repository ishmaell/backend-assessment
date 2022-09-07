const mongoose = require('../../../services/mongoose.service').mongoose;
const Schema = mongoose.Schema;


const accountSchema = new Schema({
  accountName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    required: true,
  },
  accountBalance: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  bvn: {
    type: String,
  },
  bankName: {
    type: String,
    required: true,
  },
  bankCode: {
    type: String,
    required: true,
  },
  bankType: {
    type: String,
    required: true,
  },
  accountHolder: {
    type: String,
    required: true,
    ref: 'users'
  }
}, { timestamps: true });


accountSchema.methods.toJSON = function () {
  const account = this;
  const accountObject = account.toObject();

  delete accountObject._id;
  delete accountObject.__v;

  return accountObject;
}


const Account = mongoose.model('accounts', accountSchema);

exports.saveLinkedAccount = data => {
  const account = new Account(data);
  return account.save();
}

exports.getAccountsByUser = ({ email }) => {
  return Account.find({ accountHolder: email });
}