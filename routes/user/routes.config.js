const { handleSignup, handleLogin, handleRefreshToken, handleLogout } = require('./controllers/user.controller');

exports.routesConfig = function (app) {
  app.post('/auth/signup', [handleSignup]);
  app.post('/auth', [handleLogin]);
  app.get('/auth/refresh', [handleRefreshToken]);
  app.get('/auth/signout', [handleLogout])
} 