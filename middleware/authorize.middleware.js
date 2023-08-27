const authorize = (permittedRole) => {
     return (req, res, next) => {

          if (!permittedRole.includes(req.role)) {
               
               return res.status(401).send({ message: `You're not ${permittedRole.join("/")} so you're not authorized for this request!` });
          }

          next()
     }
}

module.exports = { authorize };