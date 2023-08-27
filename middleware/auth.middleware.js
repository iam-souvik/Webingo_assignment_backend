const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const authCheck = (req, res, next) => {
     const token = req.headers.authorization;

     if (!token) return res.status(401).send({ message: "Please Login!" })

     

     try {
          jwt.verify(token, 'secretKey', async function (err, decoded) {
               if (err) {
                    return res.status(401).send({ message: "JWT verification error", error: err })
               }

               const matchedUser = await User.findById(decoded.userId);
               if (!matchedUser) {
                    return res.status(401).send({ message: "User doesn't exist!" });
               }

               req.userId = decoded.userId;
               req.role = matchedUser.role;
               next();
          })
     } catch (error) {
          console.log('error in auth.middleware:', error)
          res.status(500).send({ message: error.message, error })
     }

}

module.exports = authCheck;