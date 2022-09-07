const MonoController = require('./controllers/mono.controller');

exports.routesConfig = function (app) {
  app.get('/get-account-id', [MonoController.insert]);
} 