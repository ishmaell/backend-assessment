const { handleSignup, handleLogin, handleRefreshToken } = require('./controllers/user.controller');

exports.routesConfig = function (app) {
  app.post('/auth/signup', [handleSignup]);
  app.post('/auth', [handleLogin]);
  app.get('/refresh', [handleRefreshToken]);
}