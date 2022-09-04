const bcrypt = require('bcrypt');
const path = require('path');
const fsPromises = require('fs').promises;
const usersDB = {
  users: require('../../../model/users.json'),
  setUsers: function (data) { this.users = data }
};

const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleSignup = async (req, res) => {
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

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ "message": "Email and password are required" });

  // check for duplicate emails in the db
  const foundUser = usersDB.users.find(user => user.email === email);
  if (!foundUser) return res.status(401).json({ "error": "Invalid credentials" }); // unauthorized

  const matchPassword = await bcrypt.compare(password, foundUser.password);

  if (matchPassword) {
    // create JWT
    const accessToken = jwt.sign(
      { "email": foundUser.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10m' }
    );
    const refreshToken = jwt.sign(
      { "email": foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '50m' }
    );
    // Saving refreshToken with current user
    const otherUsers = usersDB.users.filter(user => user.email !== foundUser.email);
    const currentUser = { ...foundUser, refreshToken };
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, '..', '..', '..', 'model', 'users.json'),
      JSON.stringify(usersDB.users)
    )
    res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.json({ accessToken });

  } else {
    res.sendStatus(401);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { "email": email, "passowrd": hashedPassword };
    usersDB.setUsers([...usersDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, '..', '..', '..', 'model', 'users.json'),
      JSON.stringify(usersDB.users)
    );

    res.status(201).json({ "success": `New user ${email} created` })
  } catch (error) {
    // res.status(500).send({ "message": error });
  }
}

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401); // unathorized

  console.log(cookies.jwt);

  const refreshToken = cookies.jwt;

  const foundUser = usersDB.users.find(user => user.refreshToken === refreshToken);
  if (!foundUser) return res.status(403); // forbidden

  // evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err || foundUser.email !== decoded.email) return res.sendStatus(403);
      const accessToken = jwt.sign(
        { "email": decoded.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30s' }
      );
      res.status(200).json({ accessToken })
    }
  );
}

module.exports = {
  handleSignup,
  handleLogin,
  handleRefreshToken
}