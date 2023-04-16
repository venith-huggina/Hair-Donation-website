import React, {useState} from "react";
import { useEffect } from "react";
import "./styles/login.css";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import './styles/cardContainer.css'
import { useNavigate } from "react-router-dom";
import SeeCard from "./SeeCard";

function SeeRecipient() {
    const [resD, setresD] = useState([]);
    const historyRedirect = useNavigate();
    useEffect(() => {
        let usercheck = sessionStorage.getItem("currentuser");
        let usercheckJson = JSON.parse(usercheck);
        if (!usercheckJson || usercheckJson.userrole !== "DONOR") {
            historyRedirect("/login/donor");
        } 
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        const fetchData = async () => {
            try { 
                let val = sessionStorage.getItem("currenttoken");
                const options = { headers: { Authorization: "Bearer "+ val } }
        
                
                const res = await axios.get('http://localhost:5000/api/donors/showrecipientrequests',  options);
        
                if (res.data.recipientRequests) {
                    console.log(res.data.recipientRequests)
                    if (res.data.recipientRequests.length !== 0) {
                        toast.success("Fetched the records successfully");
                        
                        setresD(res.data.recipientRequests);
                    } else {
                        toast.info("No recipient requests found!");
                    }
                }
                if (res.data.error) {
                    toast.error(res.data.error);
                }
            } catch (e) {
                toast.error(e);   
            }
        }
    

        fetchData();

    }, []); 
    console.log(resD);
    return (
        <div className="container">
            <h1 style={{ textAlign: 'center' }}>Requests from Recipients</h1>
            {resD.map((request) => (<SeeCard key={request.requestid} id = {request.requestid} donationtype={request.donationDetails[0].donationtype} hairtype={request.donationDetails[0].hairtype} time={request.requestedtime} recipi={request.recipientDetails[0].username} recipiemail={request.recipientDetails[0].useremail} recipiphn={ request.recipientDetails[0].phone_number} />))}
            <ToastContainer/>
        </div>
    );
}

export default SeeRecipient;