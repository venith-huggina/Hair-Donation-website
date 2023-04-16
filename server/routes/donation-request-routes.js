import express from 'express';
import pool from '../db.js';
import {authenticateDonorToken} from '../middleware/authorization.js';

const router = express.Router();

router.get('/requests', authenticateDonorToken, async (req, res) =>{
    try {
        if (req.user.uid) {
            const donations = await pool.query('SELECT * FROM dbo.hair_donations_tbl where userid = $1'
                        , [req.user.uid]);
            res.status(200).json({ donations : donations.rows});                
        } else {
            throw new Error('uid is not matching or incorrect');
        }
    } catch (error) {
      res.status(500).json({error: error.message});
    }
});


router.get('/showrecipientrequests', authenticateDonorToken, async (req, res) =>{
    try {
        if (req.user.uid) {
            const donations = await pool.query('SELECT * FROM dbo.recipient_requests_tbl where donation_owner = $1 and donationid is not null and donation_owner is not null and request_status = 0'
                , [req.user.uid]);
            for (let i = 0; i < donations.rows.length; i++){
                const donationDetails = await pool.query('SELECT * from dbo.hair_donations_tbl where donationid = $1',
                    [donations.rows[i].donationid]);
                if (donationDetails.rows) {
                    donations.rows[i].donationDetails = donationDetails.rows;
                    const recipientDetails = await pool.query('SELECT * FROM dbo.users_tbl where uid = $1'
                        , [donations.rows[i].userid]);
                    donations.rows[i].recipientDetails = recipientDetails.rows;
                }
            }
            res.status(200).json({ recipientRequests : donations.rows});                
        } else {
            throw new Error('uid is not matching or incorrect');
        }
    } catch (error) {
      res.status(500).json({error: error.message});
    }
});


router.get('/showrecipientrequest/:id', authenticateDonorToken, async (req, res) =>{
    try {
        if (req.user.uid) {
            const donation = await pool.query('SELECT * FROM dbo.recipient_requests_tbl where donation_owner = $1 and requestid = $2'
                , [req.user.uid, req.params.id]);
            if (donation.rows) {
                const donationDetails = await pool.query('SELECT * from dbo.hair_donations_tbl where donationid = $1',
                    [donation.rows[0].donationid]);
                if (donationDetails.rows) {
                    donation.rows[0].donationDetails = donationDetails.rows;
                    const recipientDetails = await pool.query('SELECT * FROM dbo.users_tbl where uid = $1'
                    , [donation.rows[0].userid]);
                    donation.rows[0].recipientDetails = recipientDetails.rows;
                    res.status(200).json({ recipientRequest : donation.rows}); 
                } else {
                    throw new Error(`donationid - ${donation.rows[0].donationid} doesn't exist`);
                }
            
            } else {
                throw new Error(`Requestid - ${req.params.id} doesn't exist`);
            }
                 
        } else {
            throw new Error('uid is not matching or incorrect');
        }
    } catch (error) {
      res.status(500).json({error: error.message});
    }
});

router.post('/requests', authenticateDonorToken, async (req, res) => {
    try {
        if (req.user.uid) {
            if (!req.body.donationtype || !req.body.hairtype) {
                throw new Error('Please pass both the donationtype and hairtype');
            } else {
                if (req.file) {
                    const donationWithImage = await pool.query('INSERT INTO dbo.hair_donations_tbl(userid, donationtype, hairtype, imagename, imageurl) values($1, $2, $3, $4 ,$5) RETURNING donationid, imageurl'
                        , [req.user.uid, req.body.donationtype, req.body.hairtype, req.file.name, url]);
                    res.status(200).json({ message: `Entry inserted successfully with id ${users.rows.donationid} and image url ${donationWithImage.rows.imageurl}` });
                } else {
                    const donation = await pool.query('INSERT INTO dbo.hair_donations_tbl(userid, donationtype, hairtype) values($1, $2, $3) RETURNING donationid'
                        , [req.user.uid, req.body.donationtype, req.body.hairtype]);
                    res.status(200).json({ message: `Entry inserted successfully with donationId = ${donation.rows[0].donationid}` });
                }
            }
        } else {
            throw new Error('uid is not matching or incorrect');
        }
    } catch (error) {
      res.status(500).json({error: error.message});
    }

});


router.patch('/request/:id', authenticateDonorToken, async (req, res) =>{
    try {
        if (req.user.uid) {
            if (!req.body.hairtype) {
                throw new Error('Please provide hairtype to update');
            } else {
                const donations = await pool.query('UPDATE dbo.hair_donations_tbl SET hairtype = $1 , lastupdatedat = NOW() where userid = $2 and donationid = $3'
                    , [req.body.hairtype, req.user.uid, req.params.id]);
                res.status(200).json({ message: 'Updated successfully' });
            }    
        } else {
            throw new Error('uid is not matching or incorrect');
        }
    } catch (error) {
      res.status(500).json({error: error.message});
    }
});

router.get('/request/:id', authenticateDonorToken, async (req, res) =>{
    try {
        if (req.user.uid) {
            const donations = await pool.query('SELECT * FROM dbo.hair_donations_tbl where userid = $1 and donationid = $2'
                        , [req.user.uid, req.params.id]);
            res.status(200).json({ donation : donations.rows});                
        } else {
            throw new Error('uid is not matching or incorrect');
        }
    } catch (error) {
      res.status(500).json({error: error.message});
    }
});

router.get('/request/:id/status', authenticateDonorToken, async (req, res) =>{
    try {
        if (req.user.uid) {
            const donationStatus = await pool.query('SELECT donationstatus FROM dbo.hair_donations_tbl where userid = $1 and donationid = $2'
                , [req.user.uid, req.params.id]);
            if (donationStatus.rows[0]) {
                res.status(200).json({ status : donationStatus.rows[0].donationstatus});   
            } else {
                throw new Error(`donationid - ${req.params.id} doesn't exist for userid - ${req.user.uid}`);
            }
                         
        } else {
            throw new Error('uid is not matching or incorrect');
        }
    } catch (error) {
      res.status(500).json({error: error.message});
    }
});

router.patch('/request/:id/status', authenticateDonorToken, async (req, res) =>{
    try {
        if (req.user.uid) {
            if (req.body.status) {
                const request = await pool.query('SELECT donationstatus FROM dbo.hair_donations_tbl where userid = $1 and donationid = $2'
                , [req.user.uid, req.params.id]);
                if (request.rows[0]) { 
                    const donationStatus = await pool.query('UPDATE dbo.hair_donations_tbl SET donationstatus = $1, lastupdatedat = NOW() where userid = $2 and donationid = $3 RETURNING donationid'
                    , [req.body.status, req.user.uid, req.params.id]);
                    res.status(200).json({ message : `Status updated successfully for donationid - ${donationStatus.rows[0].donationid}`});    
                } else {
                    throw new Error(`donationid - ${req.params.id} doesn't exist for userid - ${req.user.uid}`);
                }
                } else {
                throw new Error('Please pass the status');
            }
                            
        } else {
            throw new Error('uid is not matching or incorrect');
        }
    } catch (error) {
      res.status(500).json({error: error.message});
    }
});

router.delete('/request/:id', authenticateDonorToken,async (req, res) =>{
    try {
        if (req.user.uid) {
            const request = await pool.query('SELECT donationid FROM dbo.hair_donations_tbl where userid = $1 and donationid = $2'
            , [req.user.uid, req.params.id]);
            if (request.rows[0]) {
                const donations = await pool.query('DELETE FROM dbo.hair_donations_tbl where userid = $1 and donationid = $2 RETURNING donationid'
                        , [req.user.uid, req.params.id]);
                 res.status(200).json({ message : `donationid - ${donations.rows[0].donationid} deleted successfully` });                
            } else {
                throw new Error(`donationid - ${req.params.id} doesn't exist for userid - ${req.user.uid}`); 
             }
             } else {
            throw new Error('uid is not matching or incorrect');
        }
    } catch (error) {
      res.status(500).json({error: error.message});
    }
});

export default router;