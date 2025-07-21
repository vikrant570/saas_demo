const jwt = require('jsonwebtoken');

const tokenAuth = async (req, res, next) =>{
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Authorization Revoked !' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.tenant = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}

module.exports = tokenAuth