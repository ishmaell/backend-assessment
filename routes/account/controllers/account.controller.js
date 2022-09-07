const mongoose = require('../../../services/mongoose.service').mongoose;
const AccountModel = require('../model/Account');
const UserModel = require('../../user/model/User');
const axios = require('axios');
const { MONO_BASE_URL, LINK_ACCOUNT_PATH, GET_ACCOUNT_DETAILS_PATH } = require('../../../constants')


const getAccountId = async (req, res) => {
  try {
    const { code } = req.body

    let data = JSON.stringify({ code });

    let config = {
      method: 'post',
      url: `${MONO_BASE_URL}/${LINK_ACCOUNT_PATH}`,
      headers: {
        'mono-sec-key': process.env.MONO_SECRET_KEY,
        'Content-Type': 'application/json'
      },
      data: data
    };

    const response = await axios(config);
    res.status(200).send(response.data);


  } catch (error) {
    res.status(500).send(error.message);
  }
}

const saveLinkedAccount = async (req, res) => {
  try {
    const { id } = req.body;
    const email = req.user;


    let config = {
      method: 'get',
      url: `${MONO_BASE_URL}/${GET_ACCOUNT_DETAILS_PATH}/${id}`,
      headers: {
        'mono-sec-key': process.env.MONO_SECRET_KEY,
        'Content-Type': 'application/json'
      }
    };

    const response = await axios(config);

    const accountObj = {};
    accountObj['accountHolder'] = email;
    accountObj['accountName'] = response.data.account.name;
    accountObj['accountNumber'] = response.data.account.accountNumber;
    accountObj['accountType'] = response.data.account.type;
    accountObj['accountBalance'] = response.data.account.balance;
    accountObj['currency'] = response.data.account.currency;
    accountObj['bvn'] = response.data.account.bvn;
    accountObj['bankName'] = response.data.account.institution.name;
    accountObj['bankCode'] = response.data.account.institution.bankCode;
    accountObj['bankType'] = response.data.account.institution.type;

    await AccountModel.saveLinkedAccount(accountObj);
    const { _id } = await UserModel.findByEmail(email);
    await UserModel.updateHasLinkedAccount({ _id, hasLinkedAccount: true });
    res.status(200).send(accountObj);


  } catch (error) {
    res.status(500).send(error.message);
  }
}

const getLinkedAccounts = async (req, res) => {

  try {
    const email = req.user;
    const accounts = await AccountModel.getAccountsByUser({ email });
    res.status(200).send(accounts);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = {
  getAccountId,
  saveLinkedAccount,
  getLinkedAccounts
}