import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import "./styles/login.css";
import { useNavigate } from "react-router-dom";
import Header from "./Header";



function Msg({ m, r }) {
    return (
        <div>
            <span>{m}! </span>
        </div>
    );
}

function Register(props){
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [pass, setPass] = useState('');
    const [pass2, setPass2] = useState('');
    const [phone, setPhone] = useState('');
    const [lat, setLat] = useState({});    
    const historyRedirect = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();
     
        if (pass !== pass2) {
            toast.error('Password doesn not match');
        } else {
            const post = { name: username, email: email, password: pass, role: role, latitude: lat.lat, longitude: lat.long, number: phone };
            try {
                const res = await axios.post('http://localhost:5000/api/users/register', post)
                if (res.data.message === "Registered successfully") {
                    //toast.success('Registered successfully');
                    toast.success(<Msg m={"Successfully Registered"} r={role} />);
                    if (role === "DONOR") {
                        setTimeout(() => {
                            historyRedirect("/login/donor");
                        }, 10000)
                    } else {
                        setTimeout(() => {
                            historyRedirect("/login/recipient");
                        }, 10000)
                       
                    }
                }
                if(res.data.error){
                    toast.error(res.data.error);
                }
            } catch (e) {
                toast.error(e);
            }
        }
    }

    function showPosition(position) {
        let ob = {
            lat: position.coords.latitude,
            long : position.coords.longitude
        }
        setLat(ob);
    }

  
    

    useEffect(() => {
        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                alert('Your browser does not support geoloaction api');
            }
        }
        getLocation()
    }, []);

    return (
        <>
        <Header />
        <div className="auth-form-container" >
            <h2 style={{marginTop : 20}}>Register</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" id="username" name="username"  required/>
                <label htmlFor="email">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" id="email" name="email" required />
                <label htmlFor="role">Role</label>
                <input value={role} onChange={(e) => setRole(e.target.value)} type="text"  placeholder= "DONOR, RECIPIENT" id="role" name="role" required />
                <label htmlFor="password">Password</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" required />
                <label htmlFor="password2">Confirm Password</label>
                <input value={pass2} onChange={(e) => setPass2(e.target.value)} type="password" placeholder="********" id="password2" name="password2" required />
                <label htmlFor="phone">Phone number</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} type="phone"  id="phone" name="phone" required />
               
                <button type="submit" style={{marginTop : 20, borderRadius :10, width : 100, marginBottom: 20}}>Register</button>
            </form>
           
            </div>
            <ToastContainer />
            </>
    )
}


export default Register;