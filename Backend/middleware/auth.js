const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const auth = async(req,res,next) => {
    const token = req.header("authToken");
    if(!token){
        return res.status(401).send({error:"Please authenticate using a vaild token"});
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