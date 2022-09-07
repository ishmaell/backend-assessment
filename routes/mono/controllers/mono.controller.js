const mongoose = require('../../../services/mongoose.service').mongoose;
const MonoModel = require('../model/Mono');


const insert = async (req, res) => {
  try {
    const { firstName, lastName, email } = await UserModel.insert(req.body);

    // create JWT
    const accessToken = jwt.sign(
      { "email": email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10m' }
    );
    const refreshToken = jwt.sign(
      { "email": email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '50m' }
    );

    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
    res.status(201).json({ firstName, lastName, email, accessToken });

  } catch (error) {
    let errorMessage = error.message;
    if (error instanceof mongoose.Document.ValidationError) {
      errorMessage = (error.message.split(":")[2]).trim();
      res.status(403).send({ error: errorMessage });
    } else {
      res.status(500).send({ error: errorMessage });
    }
  }
}

const findByCredentials = async (req, res) => {
  try {
    const { firstName, lastName, email } = await UserModel.findByCredentials(req.body.email, req.body.password);

    // create JWT
    const accessToken = jwt.sign(
      { "email": email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10m' }
    );
    const refreshToken = jwt.sign(
      { "email": email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '50m' }
    );

    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
    res.status(200).json({ firstName, lastName, email, accessToken });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}


// const handleRefreshToken = (req, res) => {
//   const cookies = req.cookies;
//   if (!cookies?.jwt) return res.status(401); // unathorized

//   const refreshToken = cookies.jwt;

//   const foundUser = usersDB.users.find(user => user.refreshToken === refreshToken);
//   if (!foundUser) return res.status(403); // forbidden

//   // evaluate jwt
//   jwt.verify(
//     refreshToken,
//     process.env.REFRESH_TOKEN_SECRET,
//     (err, decoded) => {
//       if (err || foundUser.email !== decoded.email) return res.sendStatus(403);
//       const accessToken = jwt.sign(
//         { "email": decoded.email },
//         process.env.ACCESS_TOKEN_SECRET,
//         { expiresIn: '30s' }
//       );
//       res.status(200).json({ accessToken })
//     }
//   );
// }

// const handleLogout = async (req, res) => {

//   const cookies = req.cookies;
//   if (!cookies?.jwt) return res.status(204); // no content

//   const refreshToken = cookies.jwt;
//   // check if refreshToken is in db
//   const foundUser = usersDB.users.find(user => user.refreshToken === refreshToken);

//   if (!foundUser) {
//     res.clearCookie('jwt', { httpOnly: true });
//     return res.status(204);
//   }

//   // delete refreshToken from db
//   const otherUsers = usersDB.users.filter(user => user.refreshToken !== foundUser.refreshToken);
//   const currentUser = { ...foundUser, refreshToken: '' };
//   usersDB.setUsers([...otherUsers, currentUser]);
//   await fsPromises.writeFile(
//     path.join(__dirname, '..', '..', '..', 'model', 'users.json'),
//     JSON.stringify(usersDB.users)
//   );

//   res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true, });
//   res.status(204);
// }

module.exports = {
  insert,
  findByCredentials
}