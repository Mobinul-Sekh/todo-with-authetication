// Middleware to verify JWT token
const jwt = require("jsonwebtoken")

function authenticateToken(req, res, next) {
    try {
        const token = req.cookies.token;
    
        if(!token) {
            res.render("error", { errorMsg: "Unauthorized", errorCode: 401, redirectPage: '/signin'});
        }
        else {
            jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
                if(err) {
                    res.render("error", { errorMsg: "Invalid Token", errorCode: 401, redirectPage: '/signin'});
                }
                else {
                    req.user = user;
                    next();
                }
            })
        }
    }
    catch(err) {
        console.log("Error from jwtMiddleware catch block!");
        res.render("error", { errorMsg: "Unauthorized", errorCode: 401, redirectPage: '#'});
    }
}

module.exports = authenticateToken;