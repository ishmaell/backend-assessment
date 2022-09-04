const { creatNewUser, findByCredentials } = require('./controllers/user.controller');

exports.routesConfig = function (app) {
  app.post('/auth/signup', [creatNewUser]);
  app.post('/auth', [findByCredentials]);
}