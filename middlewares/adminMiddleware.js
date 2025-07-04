// backend/middlewares/adminMiddleware.js

/**
 * 🛡️ Middleware: Allow access only to users with isAdmin = true
 * This should be placed after the `protect` middleware in routes.
 * 
 * ✅ Example usage:
 *   router.get('/admin-route', protect, adminOnly, handler);
 */

export const adminOnly = (req, res, next) => {
  try {
    // Check if user exists and is admin
    if (req.user && req.user.isAdmin === true) {
      return next(); // ✅ Allow access
    } else {
      return res.status(403).json({ message: 'Admin access only ❌' });
    }
  } catch (err) {
    console.error('Admin Middleware Error:', err);
    return res.status(500).json({ message: 'Server error in admin middleware' });
  }
};
