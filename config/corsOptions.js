const whitelist = ['http://127.0.0.1:8800', 'http://localhost:8800', 'https://www.google.com'];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
}

module.exports = corsOptions;