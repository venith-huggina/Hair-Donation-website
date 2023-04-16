import React, {  useState, useEffect } from "react";
import "./styles/login.css";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";


const Add = (props) => {
    const [donation, setDonation] = useState('');
    const [hair, setHair] = useState('');
    const historyRedirect = useNavigate();

    useEffect(() => {
        let usercheck = sessionStorage.getItem("currentuser");
        let usercheckJson = JSON.parse(usercheck);
        if (!usercheckJson || usercheckJson.userrole !== "DONOR") {
            historyRedirect("/login/donor");
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const post = {
            donationtype: donation,
            hairtype :hair
        };
        try {
            let val = sessionStorage.getItem("currenttoken");
    
            const options = { headers: { Authorization: "Bearer " + val} }
            const res = await axios.post('http://localhost:5000/api/donors/requests', post, options);
    
            if (res.data.message) {
                toast.success("Donation Added successfully");
            }
            if (res.data.error) {
                toast.error(res.data.error);
            }
        } catch (e) {
            toast.error(e);   
        }
    }

    return (
        <>
        <div className="auth-form-container" style={{padding: 100}}>
            <h2>Add donation</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="donation">Donation Type</label>
                <input value={donation} onChange={(e) => setDonation(e.target.value)} type="text" placeholder = "Eg; Hair" id="donation" name="donation" required />
                <label htmlFor="hair">Hair Type</label>
                <input value={hair} onChange={(e) => setHair(e.target.value)} type="text"  id="hair" name="hair" required />
                <button type="submit" style={{marginTop: 20, borderRadius : 10}}>Submit</button>
            </form>
            </div>
            <ToastContainer />
        </>
    )
}

export default Add;