const bcryptjs = require('bcryptjs');

/**
 * @description hashes a password
 * @param {String} password 
 * @returns encryped password
 */
exports.hashPassword = async (password) => {
  try {
    const hashPassword = await bcryptjs.hash(password, 10);
    return hashPassword;
  } catch (error) {
    return error;
  }
}
