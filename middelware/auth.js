const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken= (req, res, next)=>{
  const token = req.headers.authorization
  if(token){
      try{
          const decoded = jwt.verify(token.split(' ')[1],process.env.SECRET_KEY)
          if(decoded){
            req.body.userId = decoded.id
            req.body.role = decoded.role
            console.log(req.body)

              next()
          }else{
              res.send({'msg':'Please Login!'})
          }
      }catch(err){
          res.send({'err':err.message})
      }
  }else{
      res.send('Please Login!')
  }
}
module.exports = { authenticateToken };
