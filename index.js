const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');

const PORT = process.env.PORT || 8800;

// routers
const UserRouter = require('./routes/user/routes.config');
const AccountRouter = require('./routes/account/route.config');

// middleware for cookies
app.use(cookieParser());

// handle options credentials check - before CORS and fetch cookies credentials requirement
app.use(credentials);

// middleware for Cross Origin Resource sharing
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


// built-in middleware for json
app.use(express.json());



// route config
UserRouter.routesConfig(app);
AccountRouter.routesConfig(app);

// 404
app.use((_, res) => {
  res.status(404).send({ error: 'Invalid resource was requested' })
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));