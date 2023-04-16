import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import axios from 'axios';
import {authenticateDonorToken, authenticateRecipientToken} from '../middleware/authorization.js';


const router = express.Router();



async function getUserLocationFromAxios(latitude, longitude) {
    let res = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
    //console.log(typeof res);
    return res;
        
}
    

    router.get('/donors',authenticateDonorToken, async (req, res) => {
    try {
        const users = await pool.query('SELECT * FROM dbo.users_tbl where userrole = $1', ['DONOR']);
        res.status(200).json({users : users.rows});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.get('/recipients',authenticateRecipientToken, async (req, res) => {
    try {
      const users = await pool.query('SELECT * FROM dbo.users_tbl where userrole = $1', ['RECIPIENT']);
      res.status(200).json({users : users.rows});
    } catch (error) {
      res.status(500).json({error: error.message});
    }
});
  

router.get('/donor/:id',authenticateDonorToken, async (req, res) => {
    try {
        if (req.params.id === req.user.uid) {
            const users = await pool.query('SELECT * FROM dbo.users_tbl where uid = $1 and userrole = $2', [req.user.uid, 'DONOR']);
            res.status(200).json({ users: users.rows });
        } else {
            throw new Error('uid is not matching');
        }
    } catch (error) {
      res.status(500).json({error: error.message});
    }
});
  
router.patch('/donor/:id',authenticateDonorToken, async (req, res) => {
    try {
        if (req.params.id === req.user.uid) {
            if (!req.body.country && !req.body.address && !req.body.city && !req.body.number) {
                throw new Error('Atleast pass one value');
            }
            let i = 1;
            let queryString = '';
            let resArray = [];
            if (req.body.country) {
                queryString += `country = $${i}`;
                i++; 
                resArray.push(req.body.country)
            }
            if (req.body.address) {
                if (i != 1) {
                    queryString += `, address = $${i}`; 
                    i++; 
                    resArray.push(req.body.address)
                } else {
                    queryString += `address = $${i}`; 
                    i++;
                    resArray.push(req.body.address)
                }  
            }
            if (req.body.city) {
                if (i != 1) {
                    queryString += `, city = $${i}`; 
                    i++; 
                    resArray.push(req.body.city)
                } else {
                    queryString += `city = $${i}`; 
                    i++;
                    resArray.push(req.body.city)
                }  
            }
            if (req.body.number) {
                if (i != 1) {
                    queryString += `, phone_number = $${i}`; 
                    i++; 
                    resArray.push(req.body.number)
                } else {
                    queryString += `phone_number = $${i}`; 
                    i++;
                    resArray.push(req.body.number)
                }  
            }
            resArray.push(req.user.uid);
            resArray.push('DONOR');
            const users = await pool.query(`UPDATE dbo.users_tbl SET `+queryString+ ` where uid = $${i} and userrole = $${++i} RETURNING *`, resArray);
            res.status(200).json({ message: "Successfully updated the details" });
        } else {
            throw new Error('uid is not matching');
        }
    } catch (error) {
      res.status(500).json({error: error.message});
    }
});



router.patch('/recipient/:id',authenticateRecipientToken, async (req, res) => {
    try {
        if (req.params.id === req.user.uid) {
            if (!req.body.country && !req.body.address && !req.body.city && !req.body.number) {
                throw new Error('Atleast pass one value');
            }
            let i = 1;
            let queryString = '';
            let resArray = [];
            if (req.body.country) {
                queryString += `country = $${i}`;
                i++; 
                resArray.push(req.body.country)
            }
            if (req.body.address) {
                if (i != 1) {
                    queryString += `, address = $${i}`; 
                    i++; 
                    resArray.push(req.body.address)
                } else {
                    queryString += `address = $${i}`; 
                    i++;
                    resArray.push(req.body.address)
                }  
            }
            if (req.body.city) {
                if (i != 1) {
                    queryString += `, city = $${i}`; 
                    i++; 
                    resArray.push(req.body.city)
                } else {
                    queryString += `city = $${i}`; 
                    i++;
                    resArray.push(req.body.city)
                }  
            }
            if (req.body.number) {
                if (i != 1) {
                    queryString += `, phone_number = $${i}`; 
                    i++; 
                    resArray.push(req.body.number)
                } else {
                    queryString += `phone_number = $${i}`; 
                    i++;
                    resArray.push(req.body.number)
                }  
            }
            resArray.push(req.user.uid);
            resArray.push('RECIPIENT');
            const users = await pool.query(`UPDATE dbo.users_tbl SET `+queryString+ ` where uid = $${i} and userrole = $${++i} RETURNING *`, resArray);
            res.status(200).json({ message: "Successfully updated the details" });
        } else {
            throw new Error('uid is not matching');
        }
    } catch (error) {
      res.status(500).json({error: error.message});
    }
});


router.get('/showdonor/:id',authenticateRecipientToken, async (req, res) => {
    try {
            const users = await pool.query('SELECT * FROM dbo.users_tbl where uid = $1 and userrole = $2', [req.params.id, 'DONOR']);
            res.status(200).json({ users: users.rows });
        
    } catch (error) {
      res.status(500).json({error: error.message});
    }
});
  

router.get('/showdonors',authenticateRecipientToken, async (req, res) => {
    try {
            const users = await pool.query('SELECT * FROM dbo.users_tbl where userrole = $1', ['DONOR']);
            res.status(200).json({ users: users.rows });
        
    } catch (error) {
      res.status(500).json({error: error.message});
    }
  });
  
  router.get('/recipient/:id',authenticateRecipientToken, async (req, res) => {
      try {
            if (req.params.id === req.user.uid) {
              const users = await pool.query('SELECT * FROM dbo.users_tbl where uid = $1 and userrole = $2', [req.user.uid, 'RECIPIENT']);
              res.status(200).json({ users: users.rows });
            } else {
                throw new Error('uid is not matching');
            }
      } catch (error) {
        res.status(500).json({error: error.message});
      }
  });
   
  router.get('/showrecipient/:id',authenticateDonorToken, async (req, res) => {
    try {
            const users = await pool.query('SELECT * FROM dbo.users_tbl where uid = $1 and userrole = $2', [req.params.id, 'RECIPIENT']);
            res.status(200).json({ users: users.rows });
        
    } catch (error) {
      res.status(500).json({error: error.message});
    }
  });

  router.get('/showrecipients',authenticateDonorToken, async (req, res) => {
    try {
            const users = await pool.query('SELECT * FROM dbo.users_tbl where userrole = $1', ['RECIPIENT']);
            res.status(200).json({ users: users.rows });
        
    } catch (error) {
      res.status(500).json({error: error.message});
    }
  });

router.post('/register', async (req, res) => {
    try {
        if (!req.body.latitude && !req.body.longitude && !req.body.country && !req.body.city && !req.body.address) {
            throw new Error('Atleast pass (latitude, longitude), country, city, address');
        }
        const checkUser = await pool.query('SELECT * from dbo.users_tbl where username = $1 and userrole = $2', [req.body.name, req.body.role]);
        if (checkUser.rows.length === 0) {
            if (req.body.latitude && req.body.longitude) {
                const apiRes = await getUserLocationFromAxios(req.body.latitude, req.body.longitude); 
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                const newUser = await pool.query('INSERT INTO dbo.users_tbl(username, useremail, password, userrole, latitude, longitude, phone_number, country, city, address, continent) VALUES ($1,$2,$3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING uid, username, useremail, userrole, phone_number',
                                 [req.body.name, req.body.email, hashedPassword, req.body.role, req.body.latitude, req.body.longitude, req.body.number,apiRes.data.countryName, apiRes.data.city, apiRes.data.locality, apiRes.data.continent]);
                res.status(200).json({
                   message: "Registered successfully",
                   user : newUser.rows[0]});
            } else {
                throw new Error('Please allow location(latitude, longitude) to continue further');
            }
             
            //res.status(200).json(newUser.rows[0]);
        } else {
            throw new Error('Username already exists with specified role')
        }

  } catch (error) {
    res.status(200).json({error: error.message});
  }
});

router.delete('/donor/:id', authenticateDonorToken, async (req, res) => {
    try {
        if (req.params.id === req.user.uid) {
            const users = await pool.query('DELETE FROM dbo.users_tbl where uid = $1 and userrole = $2', [req.user.uid, "DONOR"]);
            res.status(200).json({message : "Deleted successfully"});
        }
        else {
            throw new Error('uid is not matching');
        }
    
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/recipient/:id', authenticateRecipientToken, async (req, res) => {
    try {
        if (req.params.id === req.user.uid) {
            const users = await pool.query('DELETE FROM dbo.users_tbl where uid = $1 and userrole = $2', [req.user.uid, "RECIPIENT"]);
            res.status(200).json({message : "Deleted successfully"});
        }
        else {
            throw new Error('uid is not matching')
        }
    
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default router;