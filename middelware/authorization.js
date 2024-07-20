const { User } = require("../models/User.model");

const authorizeRoles = (permittedRoles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findOne({ where: { id: req.body.userId } });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const role = user.role;

      if (permittedRoles.includes(role)) {
        next();
      } else {
        res.status(403).json({ message: 'Not Authorized' });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
};

module.exports = { authorizeRoles };
