const jwt = require('jsonwebtoken');
const secretKey = '24059414';

const generateToken = (userId) => {
  return jwt.sign({ userId }, secretKey);
};

module.exports = { generateToken };
