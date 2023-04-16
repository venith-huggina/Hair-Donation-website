import React, {useState} from "react";
import { useEffect } from "react";
import "./styles/login.css";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import './styles/cardContainer.css'
import { useNavigate } from "react-router-dom";
import RequestCard from "./RequestCard";

function RequestContainer() {
    const [resD, setresD] = useState([]);
    const historyRedirect = useNavigate();

    useEffect(() => {
        let usercheck = sessionStorage.getItem("currentuser");
        let usercheckJson = JSON.parse(usercheck);
        if (!usercheckJson || usercheckJson.userrole !== "RECIPIENT") {
            historyRedirect("/login/recipient");
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    
    useEffect(() => {
        const fetchData = async () => {
            try { console.log("Inside useEffect")
                let val = sessionStorage.getItem("currenttoken");
                const options = { headers: { Authorization: "Bearer "+  val } }
                console.log('after options')
                
                const res = await axios.get('http://localhost:5000/api/recipients/requests',  options);
                if (res.data.requests.length !== 0) {
                    toast.success("Fetched the records successfully");
                    setresD(res.data.requests)   
                } else {
                    toast.info("No request records found!");
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
            <h1 style={{ textAlign: 'center' }}>Your Submitted donations</h1>
            {resD.map((request) => (<RequestCard key = {request.requestid} id = {request.requestid} donationtype={request.donationDetails[0].donationtype } requeststatus={request.request_status} hairtype={request.donationDetails[0].hairtype} time={request.requestedtime} donor = {request.donorDetails[0].username} />))}
            <ToastContainer/>
        </div>
    );
    
}

export default RequestContainer