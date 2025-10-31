const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');


// Sign up: create user and apiKey
router.post('/signup', async (req, res) => {
try {
const { email } = req.body;
if (!email) return res.status(400).json({ error: 'Email required' });


let existing = await User.findOne({ email });
if (existing) return res.status(400).json({ error: 'Email already registered' });


const apiKey = crypto.randomBytes(24).toString('hex');
const user = new User({ email, apiKey });
await user.save();
return res.json({ email: user.email, apiKey: user.apiKey, plan: user.plan });
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Server error' });
}
});


module.exports = router;