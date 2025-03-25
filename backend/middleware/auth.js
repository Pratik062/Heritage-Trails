const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization');

    console.log("🔹 Incoming Token:", token); // Debugging log

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = decoded; // Attach user info (including role) to request object
        console.log("✅ Decoded Token:", decoded); // Debugging log to check user details
        next();
    } catch (error) {
        console.error("❌ Token Verification Failed:", error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

const authorizeAdmin = (req, res, next) => {
    console.log("🔹 Checking Admin Access for:", req.user?.email);

    if (req.user && req.user.role === 'admin') {
        console.log("✅ Admin Access Granted to:", req.user.email);
        next(); // Allow access
    } else {
        console.log("❌ Unauthorized Access Attempt by:", req.user?.email);
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};

module.exports = { authenticateUser, authorizeAdmin };
