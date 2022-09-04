const { creatNewUser } = require('./controllers/user.controller');

exports.routesConfig = function (app) {
  app.post('/users/signup', [creatNewUser]);
}