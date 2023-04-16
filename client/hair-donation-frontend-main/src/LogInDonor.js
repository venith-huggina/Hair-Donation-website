import React, { useEffect, useState } from "react";
import "./styles/login.css";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import Header from "./Header";


const LogInDonor = (props) => {
    const [username, setUsername] = useState('');
    const [pass, setPass] = useState('');
    const historyRedirect = useNavigate();

    useEffect(() => {
        let usercheck = sessionStorage.getItem("currentuser");
        let usercheckJson = JSON.parse(usercheck);
        if (usercheckJson) {
            historyRedirect("/users/donor");
        } 

     
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
  

    const handleSubmit = async (e) => {
        e.preventDefault();
        const post = { name: username, password: pass};
        try {
            const res = await axios.post('http://localhost:5000/api/auth/donor/login', post)
            if (res.data.user) {
                toast.success("Successfully LoggedIn!");
                sessionStorage.setItem("currenttoken", res.data.tokens);
                let payload = Buffer.from(res.data.tokens.split(".")[1], "base64");
                let jsonpayload = JSON.parse(payload.toString());
                sessionStorage.setItem("currentuser", JSON.stringify(jsonpayload));
                
                setTimeout(() => {
                    historyRedirect("/users/donor")
                }, 1500);
                   
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
        <Header />
        <div className="auth-form-container" style={{padding: 100}}>
            <h2>Login As Donor</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" id="username" name="username" required />
                <label htmlFor="password">Password</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" required />
                <button type="submit" style={{
                    marginTop: 20, borderRadius : 10}}>Log In As Donor</button>
            </form>
            </div>
            <ToastContainer />
        </>
    )
}

export default LogInDonor;