function roleMiddleware(...allowedRoles) {
  return function checkRole(req, res, next) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User belum login'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak'
      });
    }

    next();
  };
}

module.exports = roleMiddleware;
