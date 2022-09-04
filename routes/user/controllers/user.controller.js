const bcrypt = require('bcrypt');
const path = require('path');
const fsPromises = require('fs').promises;
const usersDB = {
  users: require('../../../model/users.json'),
  setUsers: function (data) { this.users = data }
};

const jwt = require('jsonwebtoken');
require('dotenv').config();

const creatNewUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ "message": "Email and password is required" });

  // check for duplicate emails in the db
  const duplicate = usersDB.users.find(user => user.email === email);
  if (duplicate) return res.status(409).json({ "error": "An account with this email already exists" }); // conflict

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { "email": email, "password": hashedPassword };
    usersDB.setUsers([...usersDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, '..', '..', '..', 'model', 'users.json'),
      JSON.stringify(usersDB.users)
    );

    res.status(201).json({ "success": `New user ${email} created` })
  } catch (error) {
    res.status(500).send({ "message": error });
  }
}

module.exports = {
  creatNewUser
}