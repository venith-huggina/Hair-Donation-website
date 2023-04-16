import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Add from "./Add";
import DonationContainer from "./DonationContainer";
import DonorHeader from "./DonorHeader";
import SeeRecipient from "./SeeRecipient";

function Donor() {
    const [username, setUsername] = useState('')
    const [currentForm, setCurrentForm] = useState("");
    const nav = useNavigate();

    const toggleForm = (formName) => {
        setCurrentForm(formName);
      }

    useEffect(() => {
        let fetchedData = sessionStorage.getItem("currentuser");
        let fetchedDataJson = JSON.parse(fetchedData);
        
        if (!fetchedData || fetchedDataJson.userrole !== "DONOR") {
            nav("/login/donor");
        } else {
            setUsername(`Hi, Donor ${fetchedDataJson.username} !`);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <>
            <DonorHeader onFormSwitch ={toggleForm} username={username} />
            <div className="appContentSection">
            {
                currentForm === "" ? <Add /> : currentForm === "viewDonations" ?
                <DonationContainer  /> : <SeeRecipient />
            }
      </div>
       </>
   ) 
}

export default Donor;