const getToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  try {
    req.token = token;
    next();
  } catch (err) {
   
    res.status(401).json({ error: 'Invalid token.' });
  }
};
module.exports = getToken;  
