const jwt = require('jsonwebtoken');
const secretKey = '24059414';

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(403).send('A token is required for authentication');
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.userId;
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
  return next();
};

module.exports = { verifyToken };