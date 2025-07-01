// backend/middlewares/adminMiddleware.js
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next(); // ✅ admin allowed
    } else {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
  };
  