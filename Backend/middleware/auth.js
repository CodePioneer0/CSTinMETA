const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const auth = async (req, res, next) => {
    // Check for token in 'authToken' header or 'Authorization' header (Bearer token)
    let token = req.header("authToken");
    if (!token && req.header("Authorization")) {
        const parts = req.header("Authorization").split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            token = parts[1];
        }
    }

    if (!token) {
        return res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).send({ error: "Please authenticate using a valid token" });
    }
}
module.exports = auth;