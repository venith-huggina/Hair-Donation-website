import jwt from 'jsonwebtoken';
import express from 'express';
const router = express.Router()


function authenticateRecipientToken(req, res, next) {
  const authHeader = req.headers['authorization']; //Bearer TOKEN
    const token = authHeader && authHeader.split(' ')[1];
  //const token = req.cookies.access_token;
  if (token == null) return res.status(401).json({error:"Null token"});
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) return res.status(403).json({error : error.message});
    if (user.userrole === "RECIPIENT") {
        req.user = user;
        next();
    } else {
        return res.status(403).json({error : "Invalid recipient token"})
    }    
  });
}

function authenticateDonorToken(req, res, next) {
    const authHeader = req.headers['authorization']; //Bearer TOKEN
    const token = authHeader && authHeader.split(' ')[1];
  //console.log(req.cookies);
    //const token = req.cookies.access_token;
  
    if (token == null) return res.status(401).json({error:"Null token"});
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if (error) return res.status(403).json({error : error.message});
        if (user.userrole === "DONOR") {
            req.user = user;
            next();
        } else {
            return res.status(403).json({error : "Invalid Donor token"})
        }      
    });
}
  

router.get('/refresh_token', (req, res) => {
    try {
      const refreshToken = req.cookies.refresh_token;
      console.log(req.cookies);
      if (refreshToken === null) return res.sendStatus(401);
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
        if (error) return res.status(403).json({error:error.message});
        let tokens = jwtTokens(user);
        res.cookie('refresh_token', tokens.refreshToken, {...(process.env.COOKIE_DOMAIN && {domain: process.env.COOKIE_DOMAIN}) , httpOnly: true,sameSite: 'none', secure: true});
        return res.json(tokens);
      });
    } catch (error) {
      res.status(401).json({error: error.message});
    }
  });

export {authenticateRecipientToken, authenticateDonorToken};