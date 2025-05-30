const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  
  const token = req.headers["authorization"]?.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err){
          console.log("error");
            return res.status(400).json({
                msg: "Geçersiz Token"
            });
        }
        else{
            req.user = user;
            next();
        }
    });
  } else {
    console.log("else");
    return res.status(400).json({
      msg: "Token Gerekli",
    });
  }
};

module.exports = verifyToken;
