const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, '133a889e51573dae5d1f527089e91a3c3c4d547490c4e762bd6a3416905a11c811e8c93bdf9a2cac853ae8c6ed89890deff99826d67b469d758667bc26d9df45');

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
