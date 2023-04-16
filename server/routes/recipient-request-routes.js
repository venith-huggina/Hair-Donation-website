import express from 'express';
import pool from '../db.js';
import {authenticateDonorToken, authenticateRecipientToken} from '../middleware/authorization.js';

const router = express.Router();


router.get('/fetchdonations', authenticateRecipientToken, async (req, res) =>{
    try {

        if (req.user.uid) {
            const fetchedUser = await pool.query('SELECT country, city, address, continent FROM dbo.users_tbl where uid = $1', [req.user.uid]);
            let resultJson = {};
            resultJson.response = [];
            if (fetchedUser.rows[0]) {
                const fetchedData = await pool.query('SELECT * from dbo.get_near_donor_details($1, $2, $3, $4, $5)',
    
                    [req.query.type, fetchedUser.rows[0].country, fetchedUser.rows[0].city, fetchedUser.rows[0].address, fetchedUser.rows[0].continent]);
                    let innerData = {};
                for (let i = 0; i < fetchedData.rows.length; i++){
              
                    const dontiondetails = await pool.query('SELECT * from dbo.hair_donations_tbl where donationid = $1', [fetchedData.rows[i].donationid]);
                    if (dontiondetails.rows[i]) {
                        innerData.donationDeatils = dontiondetails.rows[i];
                    }
                    const donordetails = await pool.query('SELECT * from dbo.users_tbl where uid = $1', [fetchedData.rows[i].donor_id]);
                    if (donordetails.rows[i]) {
                        innerData.donorDeatils = donordetails.rows[i];
                    }
                    resultJson.response.push(innerData);
                    delete innerData.donationDetails;
                    delete innerData.donorDetails;
                }
                res.status(200).json({ response : resultJson.response});     
            } else {
                throw new Error(`uid - ${req.user.uid} doesn't exist`);
            }
        } else {
            throw new Error('uid is not matching or incorrect');
        }
    } catch (error) {
      res.status(500).json({error: error.message});
    }
});

router.get('/requests', authenticateRecipientToken, async (req, res) =>{
        try {
            if (req.user.uid) {
                const requests = await pool.query('SELECT * FROM dbo.recipient_requests_tbl where userid = $1 and donationid is not null'
                    , [req.user.uid]);
                
                for (let i = 0; i < requests.rows.length; i++){
                    const donationDetails = await pool.query('SELECT * FROM dbo.hair_donations_tbl where donationid = $1'
                        , [requests.rows[i].donationid]);
                    const donorDetails = await pool.query('SELECT * FROM dbo.users_tbl where uid = $1'
                    , [donationDetails.rows[0].userid]);
                    requests.rows[i].donorDetails = donorDetails.rows
                    requests.rows[i].donationDetails = donationDetails.rows
                }
                res.status(200).json({ requests : requests.rows});                
            } else {
                throw new Error('uid is not matching or incorrect');
            }
        } catch (error) {
          res.status(500).json({error: error.message});
        }
});

router.post('/requests', authenticateRecipientToken, async (req, res) =>{
    try {
        if (req.user.uid) {
            if (req.body.donationid) {
                const donor_id = await pool.query('SELECT userid FROM dbo.hair_donations_tbl where donationid = $1'
                    , [req.body.donationid]);
                if (donor_id.rows[0]) {
                    const request = await pool.query('INSERT INTO dbo.recipient_requests_tbl(donationid, userid, donation_owner) VALUES($1, $2, $3) RETURNING requestid'
                    , [req.body.donationid, req.user.uid, donor_id.rows[0].userid]);
                    res.status(200).json({ message : `Request created successfully with id - ${request.rows[0].requestid}`});   
        
                } else {
                    throw new Error(`donationid - ${req.body.donationid} doesn't exist`);
                }
               } else {
                throw new Error('Please pass the donationid');
            }
                         
        } else {
            throw new Error('uid is not matching or incorrect');
        }
    } catch (error) {
      res.status(500).json({error: error.message});
    }
});

router.patch('/request/:id/status', authenticateDonorToken, async (req, res) => {
    try {
        if (req.user.uid) {
            if (req.body.status) {
                    if (req.body.status == 1) {
                        const requestStatus = await pool.query('UPDATE dbo.recipient_requests_tbl SET request_status = $1, lastupdatedat = NOW() where requestid = $2 RETURNING requestid, donationid'
                            , [req.body.status,  req.params.id]);
                        console.log(requestStatus)
                            const donStatus = await pool.query('UPDATE dbo.hair_donations_tbl SET donationstatus = 1, lastupdatedat = NOW() where donationid = $1 '
                            , [ requestStatus.rows[0].donationid]);
                         
                            res.status(200).json({ message : `Status updated successfully for requestid - ${requestStatus.rows[0].requestid}`});
                    } else if (req.body.status == 2) {
                        const requestStatus = await pool.query('UPDATE dbo.recipient_requests_tbl SET request_status = $1, lastupdatedat = NOW() where requestid = $2 RETURNING requestid, donationid'
                            , [req.body.status, req.params.id]);
                         
                        res.status(200).json({ message : `Status updated successfully for requestid - ${requestStatus.rows[0].requestid}`});
            
                    } else {
                        throw new Error('Unexpected Status');
                    }
                } else {
                throw new Error('Please pass the status');
            }
                           
        } else {
            throw new Error('uid is not matching or incorrect');
        }
    } catch (error) {
        console.log(error);
      res.status(500).json({error: error.message});
    }
});

router.get('/request/:id/status', authenticateRecipientToken, async (req, res) =>{
    try {
        if (req.user.uid) {
            
            const request = await pool.query('SELECT request_status FROM dbo.recipient_requests_tbl where userid = $1 and requestid = $2'
                , [req.user.uid, req.params.id]);
            if (request.rows[0]) {
                res.status(200).json({ status : request.rows[0].request_status}); 
            } else {
                throw new Error(`Requestid - ${req.params.id} doesn't exist for userid - ${req.user.uid}`);
            }
                           
        } else {
            throw new Error('uid is not matching or incorrect');
        }
    } catch (error) {
      res.status(500).json({error: error.message});
    }
});

router.get('/request/:id', authenticateRecipientToken, async (req, res) =>{
    try {
        if (req.user.uid) {
            const request = await pool.query('SELECT * FROM dbo.recipient_requests_tbl where userid = $1 and requestid = $2'
                , [req.user.uid, req.params.id]);
            if (request.rows) {
                const donationDetails = await pool.query('SELECT * FROM dbo.hair_donations_tbl where donationid = $1'
                    , [request.rows[0].donationid]);
                const donorDetails = await pool.query('SELECT * FROM dbo.users_tbl where uid = $1'
                    , [donationDetails.rows[0].userid]);
                request.rows[0].donorDetails = donorDetails.rows
                request.rows[0].donationDetails = donationDetails.rows
                res.status(200).json({ request: request.rows });
            } else {
                throw new Error(`Requestid - ${req.params.id} doesn't exist`)
            }    
        } else {
            throw new Error('uid is not matching or incorrect');
        }
    } catch (error) {
      res.status(500).json({error: error.message});
    }
});

router.delete('/request/:id', authenticateRecipientToken, async (req, res) =>{
    try {
        if (req.user.uid) {
            const request = await pool.query('SELECT requestid FROM dbo.recipient_requests_tbl where userid = $1 and requestid = $2'
                , [req.user.uid, req.params.id]);
            if (request.rows[0]) {
                const request = await pool.query('DELETE FROM dbo.recipient_requests_tbl where userid = $1 and requestid = $2 RETURNING requestid'
                    , [req.user.uid, req.params.id]);
                res.status(200).json({ message: `requestid - ${request.rows[0].requestid} deleted successfully` });
            }
            else {
                throw new Error(`Requestid - ${req.params.id} doesn't exist for userid - ${req.user.uid}`);       
            }
        } else {
            throw new Error('uid is not matching or incorrect');
        }
    } catch (error) {
      res.status(500).json({error: error.message});
    }
});

export default router;