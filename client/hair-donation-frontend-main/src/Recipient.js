import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RecipientHeader from "./RecipientHeader";
import RequestContainer from "./RequestContainer";
import Search from "./Search";



function Recipient() {
    const [username, setUsername] = useState('')
    const [currentForm, setCurrentForm] = useState("search");
    const nav = useNavigate();

    const toggleForm = (formName) => {
        setCurrentForm(formName);
      }

    useEffect(() => {
        let fetchedData = sessionStorage.getItem("currentuser");
        let fetchedDataJson = JSON.parse(fetchedData);
        console.log(fetchedDataJson)
        if (!fetchedData || fetchedDataJson.userrole !== "RECIPIENT") {
            nav("/login/recipient");
        } else {
            setUsername(`Hi, Recipient ${fetchedDataJson.username} !`);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <>
            <RecipientHeader onFormSwitch ={toggleForm} username={username} />
            <div className="appContentSection">
            {
                currentForm === "search" ? <Search /> : <RequestContainer/>
            }
      </div>
       </>
   ) 

}

export default Recipient;