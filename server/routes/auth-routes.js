import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import { jwtTokens } from '../utils/jwt-helpers.js';

const router = express.Router();

router.post('/donor/login', async (req, res) => {
  try {
    const { name , password } = req.body;
    const users = await pool.query('SELECT * FROM dbo.users_tbl WHERE username = $1 and userrole =$2', [name, "DONOR"]);
    if (users.rows.length === 0) return res.status(200).json({error:"Donor username doesn't exist"});
    const validPassword = await bcrypt.compare(password, users.rows[0].password);
    if (!validPassword) return res.status(200).json({error: "Incorrect password"});
    let tokens = jwtTokens(users.rows[0]);
    //res.cookie('refresh_token', tokens.refreshToken, {...(process.env.COOKIE_DOMAIN && {domain: process.env.COOKIE_DOMAIN}) , httpOnly: true,sameSite: 'none', secure: true});
    res.cookie('access_token', tokens.accessToken, { httpOnly: true });
    const userlogin = await pool.query(`UPDATE dbo.users_tbl SET lastlogin = now() where uid = $1 and userrole = $2 RETURNING *`, [users.rows[0].uid, 'DONOR']); 
    res.status(200).json({ user : users.rows[0], tokens : tokens.accessToken });
  } catch (error) {
    res.status(200).json({error: error.message});
  }
});


router.post('/recipient/login', async (req, res) => {
    try {
      const { name , password } = req.body;
      const users = await pool.query('SELECT * FROM dbo.users_tbl WHERE username = $1 and userrole =$2', [name, "RECIPIENT"]);
      if (users.rows.length === 0) return res.status(200).json({error:"Recipient username doesn't exist"});
      const validPassword = await bcrypt.compare(password, users.rows[0].password);
      if (!validPassword) return res.status(200).json({error: "Incorrect password"});
      let tokens = jwtTokens(users.rows[0]);
      //res.cookie('refresh_token', tokens.refreshToken, {...(process.env.COOKIE_DOMAIN && {domain: process.env.COOKIE_DOMAIN}) , httpOnly: true,sameSite: 'none', secure: true});
      res.cookie('access_token', tokens.accessToken, { httpOnly: true });
      const userlogin = await pool.query(`UPDATE dbo.users_tbl SET lastlogin = now() where uid = $1 and userrole = $2 RETURNING *`, [users.rows[0].uid, 'RECIPIENT']); 
      res.status(200).json({ user : users.rows[0], tokens : tokens.accessToken });
    } catch (error) {
      res.status(200).json({error: error.message});
    }
  });

export default router;