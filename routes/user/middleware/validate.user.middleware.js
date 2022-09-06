const UserModel = require('../model/User');
const utils = require('../../../utils');

exports.signUpHasValidFields = (req, res, next) => {

  let errors = {};

  if (req.body) {

    if (!req.body.firstName) {
      errors['name'] = 'First name is required';
    }

    if (!req.body.lastName) {
      errors['username'] = 'Last name is required';
    }

    if (!req.body.email) {
      errors['email'] = 'Email is required';
    }

    if (!req.body.password) {
      errors['password'] = 'Password is required';
    }

    if (Object.keys(errors).length) {
      return res.status(400).send({ errors: errors });
    } else {
      return next();
    }
  }
}

exports.checkIfEmailExist = async (req, res, next) => {

  const userEmail = req.body.email;

  try {

    const response = await UserModel.findByEmail(userEmail);

    if (response) {
      const email = response.email;

      if (userEmail === email) {
        let error = 'This email has already been used';
        return res.status(409).send({ error: error });
      }
    } else {
      next();
    }

  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}