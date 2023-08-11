// Middleware to verify JWT token
const jwt = require("jsonwebtoken")

function authenticateToken(req, res, next) {
    try {
        const token = req.cookies.token;
    
        if(!token) {
            return res.status(401).json({msg: "Unauthorized"});
        }
        
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if(err) {
                return res.status(403).json({msg: "Invalid Token"});
            }
    
            req.user = user;
            console.log(user);
            next();
        })
    }
    catch(err) {
        console.log("Error from jwtMiddleware catch block!");
        res.status(401).json({msg: "Unauthorized"})
    }
}

module.exports = authenticateToken;