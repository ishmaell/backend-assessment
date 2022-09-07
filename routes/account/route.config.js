const AccountController = require('./controllers/account.controller');
const verifyJWT = require('../../middleware/verifyJWT');

exports.routesConfig = function (app) {
  app.post('/get-account-id', [verifyJWT, AccountController.getAccountId]);
  app.post('/save-linked-account', [verifyJWT, AccountController.saveLinkedAccount]);
  app.get('/linked-accounts', [verifyJWT, AccountController.getLinkedAccounts]);
} 