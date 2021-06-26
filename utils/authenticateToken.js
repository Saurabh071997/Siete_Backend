const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next){
  try{

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if(!token) return res.status(401).json({message:"unauthorised access"})

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user)=>{
      if (err) return res.status(403).json({message:"token no longer valid"})
      req.userId = user.userId
      next()
    })
    

    // const decode = jwt.verify(token, process.env.ACCESS_TOKEN )
    // req.userId = decode.userId
    // return next()
   
  }catch(err){
    return res.status(401).json({message:"unauthorised access "})
  }
}

module.exports = {authenticateToken} 