const UserMiddleware = require('./middleware/validate.user.middleware');
const UserController = require('./controllers/user.controller');
const verifyJWT = require('../../middleware/verifyJWT');

exports.routesConfig = function (app) {
  app.post('/auth/signup', [UserMiddleware.signUpHasValidFields, UserMiddleware.checkIfEmailExist, UserController.insert]);
  app.post('/auth', [UserController.findByCredentials]);
  app.get('/auth/refresh', [UserController.refresh]);
} 