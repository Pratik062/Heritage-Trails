const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { createUser } = require('../models/user');
const { authenticateUser, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await new Promise((resolve, reject) => {
            db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const role = 'user'; // Default role

        await createUser(username, email, hashedPassword, role);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// User Login (Improved Error Handling)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = await new Promise((resolve, reject) => {
            db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Ensure role is included
        const token = jwt.sign(
            { userId: user.user_id, email: user.email, role: user.role || 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get User Profile
router.get('/profile', authenticateUser, async (req, res) => {
    try {
        const user = await new Promise((resolve, reject) => {
            db.get("SELECT user_id, username, email, full_name, profile_picture, role FROM users WHERE user_id = ?", 
                [req.user.userId], 
                (err, row) => {
                    if (err) return reject(err);
                    resolve(row);
                }
            );
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error("Profile error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Assign Role (Improved Validation)
router.put('/assign-role', authenticateUser, authorizeAdmin, async (req, res) => {
    const { email, newRole } = req.body;

    if (!email || !newRole) {
        return res.status(400).json({ message: 'Email and new role are required' });
    }

    if (!['admin', 'user'].includes(newRole)) {
        return res.status(400).json({ message: 'Invalid role. Allowed roles: admin, user' });
    }

    try {
        const result = await new Promise((resolve, reject) => {
            db.run("UPDATE users SET role = ? WHERE email = ?", [newRole, email], function (err) {
                if (err) return reject(err);
                resolve(this.changes);
            });
        });

        if (result === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: `User role updated to ${newRole}` });
    } catch (error) {
        console.error("Assign role error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin Check Route
router.get('/admin-only', authenticateUser, authorizeAdmin, (req, res) => {
    console.log("✅ Admin-only route accessed by:", req.user);
    res.json({ message: 'Welcome, Admin!' });
});

module.exports = router;
