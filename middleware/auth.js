const User = require('../models/User');


async function apiKeyAuth(req, res, next) {
const key = req.header('x-api-key');
if (!key) return res.status(401).json({ error: 'Missing API key' });


const user = await User.findOne({ apiKey: key });
if (!user) return res.status(401).json({ error: 'Invalid API key' });


req.user = user;
next();
}


module.exports = { apiKeyAuth };