import React, {useState} from "react";
import { useEffect } from "react";
import "./styles/login.css";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import CustomCard from "./CustomCard";
import  "./styles/cardContainer.css";
import { useNavigate } from "react-router-dom";

function DonationContainer() {

    const [resD, setresD] = useState([]);
    // const [isupdated, setupdate] = useState(0);
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
            
                const res = await axios.get('http://localhost:5000/api/donors/requests',  options);
        
                if (res.data.donations) {
                    if (res.data.donations.length !== 0) {
                        toast.success("Fetched the records successfully");
                        setresD(res.data.donations)   
                    } else {
                        toast.info("No donation records found!");
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
    
    // const propHandler = ()=> {
    //     setupdate(1);
    // }
    return (
        <div className="container">
            <h1 style={{ textAlign: 'center' }}>Your Submitted donations</h1>
            {resD.map((donation) => (<CustomCard key = {donation.donationid} id = {donation.donationid} donationtype={donation.donationtype } donationstatus={donation.donationstatus} hairtype={donation.hairtype} time={donation.createdat}  />))}
            <ToastContainer/>
        </div>
    );
}

export default DonationContainer;