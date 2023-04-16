import React , {  useState, useEffect }from "react";
import "./styles/login.css";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import SearchCard from "./SearchCard";

function Search() {
    const [search, setSearch] = useState('');
    const [resD, setresD] = useState([]);
    const historyRedirect = useNavigate();

    useEffect(() => {
        let usercheck = sessionStorage.getItem("currentuser");
        let usercheckJson = JSON.parse(usercheck);
        if (!usercheckJson || usercheckJson.userrole !== "RECIPIENT") {
            historyRedirect("/login/recipient");
        } 
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let val = sessionStorage.getItem("currenttoken");
    
            const options = { headers: { Authorization: "Bearer "+ val} }
            const res = await axios.get(`http://localhost:5000/api/recipients/fetchdonations?type=${search}`, options);
    
            if (res.data.response) {
                if (res.data.response.length !== 0) {
                    toast.success("Results Fetched successfully");
                    setresD(res.data.response);
                } else {
                    toast.info("No results found!");
                }
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
            <h2>Search For Donors</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="search">Hair Type</label>
                <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder = "Search with hair type" id="search" name="search" required />
                <button type="submit" style={{marginTop: 20, borderRadius : 10}}>Search</button>
            </form>
            </div>
            <div className="container">
                {resD && resD.map((item) => (<SearchCard hair={item.donationDeatils.hairtype} donation={item.donationDeatils.donationtype}
                    name={item.donorDeatils.username} mail={item.donorDeatils.mail} phn={item.donorDeatils.phone_number} id={item.donationDeatils.donationid}
                    status={item.donationDeatils.donationstatus} country={item.donorDeatils.country}
                    city={item.donorDeatils.city} address={item.donorDeatils.address} />))}
            </div>
            <ToastContainer />
        </>
    );
}

export default Search;