// Middleware to verify JWT token
const jwt = require("jsonwebtoken")

function authenticateToken(req, res, next) {
    console.log(req.header('Authorization'));
    const token = req.header('Authorization');

    if(!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({msg: "Unauthorized"});
    }
    
    const tokenValue = token.split(' ')[1];

    jwt.verify(tokenValue, process.env.JWT_SECRET, (err, user) => {
        if(err) {
            return res.status(403).json({msg: "Invalid token"});
        }

        req.user = user;
        next();
    })

}

module.exports = authenticateToken;