const jwt = require("jsonwebtoken");
const dynamoose = require("dynamoose");

const {User} = require("../../models/user.model.js")

module.exports.Protected = async function(req,res,next){
    const authHeader = req.event.headers.Authorization;

    if ((authHeader && authHeader.split(" ")[0] === "Token") || (authHeader && authHeader.split(" ")[0] === "Bearer")) {
        const token = authHeader.split(" ")[1];

        try {
            let decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            if (!decodedToken.email) {
                return res.send(401,JSON.stringify({
                    status: 401,
                    error: true,
                    message: "Token expired",
                }));
            }

            // verify user
            const {email} = decodedToken
            const user = await User.query(new dynamoose.Condition().where("email").eq(email)).exec();

            if (user.length == 0){
                return res.send(
                  401,
                  JSON.stringify({
                    status: 401,
                    error: true,
                    message: "Account Not Found",
                  })
                );
            }


            req.event.currentUser = decodedToken;
            return next();
        } catch (error) {
            return res.send(401,JSON.stringify({
                status:401,
                error: true,
                message: "Invalid authorization header",
            }));
        }
    } else {
        return res.send(401,JSON.stringify({
            status:401,
            error: true,
            message: "Access denied! No token provided",
        }));
    }
}