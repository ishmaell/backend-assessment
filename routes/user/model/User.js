const mongoose = require('../../../services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
const validator = require('validator');
const utils = require('../../../utils');
const bcryptjs = require('bcryptjs');

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        let error = new Error();
        throw error;
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password cannot contain password');
      }
    }
  },
  refreshToken: {
    type: String,
  },
}, { timestamps: true });


userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject._id;
  delete userObject.password;
  delete userObject.createdAt;
  delete userObject.updatedAt;
  delete userObject.__v;

  return userObject;
}

userSchema.pre('save', async function (next) {

  const user = this;

  if (user.password) {
    user.password = await utils.hashPassword(user.password);
  }

  next();

});

const User = mongoose.model('users', userSchema);

exports.insert = data => {
  const user = new User(data);
  return user.save();
}

exports.findByEmail = (email) => {
  return User.findOne({ email: email });
};

exports.findByCredentials = async (email, password) => {

  const user = await User.findOne({ email: email });

  if (user) {
    const isMatch = await bcryptjs.compare(password, user.password);
    if (isMatch)
      return user;
    else
      throw new Error('Invalid email and/or password');
  } else {
    throw new Error('Invalid email and/or password');
  }

}