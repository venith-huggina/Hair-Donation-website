import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

//Generate an access token and a refresh token for this database user
function jwtTokens({ uid, username, useremail, userrole }) {
  const user = { uid, username, useremail, userrole }; 
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1m' });
  return ({ accessToken, refreshToken });
}

export {jwtTokens};