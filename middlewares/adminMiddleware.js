// backend/middlewares/adminMiddleware.js

/**
 * 🛡️ Middleware: Allow access only to users with isAdmin = true
 * This should be placed after the `protect` middleware in routes.
 * Example usage:
 *   router.get('/admin-route', protect, adminOnly, handler);
 */

export const adminOnly = (req, res, next) => {
  // Check if user is authenticated and is admin
  if (req.user && req.user.isAdmin) {
    next(); // ✅ Allow access
  } else {
    // ❌ Deny access
    res.status(403).json({ message: 'Admin access only' });
  }
};
