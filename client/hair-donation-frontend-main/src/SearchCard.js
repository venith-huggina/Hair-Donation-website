import React from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';


function SearchCard(props) {

    const requestHandler = async (e) =>{
        try {
            let val = sessionStorage.getItem("currenttoken");
            const post = {
                donationid : e.target.id
            }
           const options = { headers: { Authorization: "Bearer " + val} }
            const res = await axios.post('http://localhost:5000/api/recipients/requests', post, options);
    
            if (res.data.message) {
                toast.success("Request Added successfully");
            }
            if (res.data.error) {
                toast.error(res.data.error);
            }
        } catch (e) {
            toast.error(e);   
        }
    }
    return (
        <div>
            <Card style={{ width: '18rem', margin:20 }}>
            <Card.Body>
                <Card.Title>Hair Type : <b>{props.hair}</b></Card.Title>
                <Card.Text>
                        Donation Type : <b>{props.donation}</b><br></br>
                        Donor name : <b>{props.name}</b><br></br>
                        Donor email : <b>{props.mail}</b><br></br>
                        Donor address : <b>{props.address}</b><br></br>
                        Donor City, Country : <b>{props.city}, {props.country}</b><br></br>
                        Donor phone number: <b>{props.phn}</b>
                </Card.Text>
                    {props.status === 0 ? <Button variant="primary" id={props.id} onClick={requestHandler}>Request</Button> : <Button variant="secondary" disabled = {true}>Not available</Button>}
            </Card.Body>
            </Card>
            <ToastContainer />
        </div>
    );
}


export default SearchCard;