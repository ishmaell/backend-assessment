const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');

const PORT = process.env.PORT || 8800;

// routers
const UserRouter = require('./routes/user/routes.config');

// middleware for Cross Origin Resource sharing
app.use(cors(corsOptions));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// route config
UserRouter.routesConfig(app);

// 404
app.use((_, res) => {
  res.status(404).send({ error: 'Invalid resource was requested' })
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));