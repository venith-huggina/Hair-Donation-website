import React from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';


function SeeCard(props) {
    console.log(props)

    const approveHandler = async (e) =>{
        try {
            let val = sessionStorage.getItem("currenttoken");
            const post = {
                status : 1
            }
           const options = { headers: { Authorization: "Bearer " + val} }
            const res = await axios.patch(`http://localhost:5000/api/recipients/request/${e.target.id}/status`, post, options);
    
            if (res.data.message) {
                toast.success("Approved successfully");
                setTimeout(() => {
                    window.location.reload(false);
                }, 4000);
            }
            if (res.data.error) {
                toast.error(res.data.error);
            }
        } catch (e) {
            toast.error(e);   
        }
    }

    const rejectHandler = async (e) => {
        try {
            let val = sessionStorage.getItem("currenttoken");
            const post = {
                status : 2
            }
           const options = { headers: { Authorization: "Bearer " + val} }
            const res = await axios.patch(`http://localhost:5000/api/recipients/request/${e.target.id}/status`, post, options);
    
            if (res.data.message) {
                toast.success("Rejected successfully");
                setTimeout(() => {
                    window.location.reload(false);
                }, 4000);
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
                <Card.Title>Requested For : <b>{props.hairtype} Type</b></Card.Title>
                <Card.Text>
                        Donation Type : <b>{props.donationtype}</b><br></br>
                        Requested By : <b>{props.recipi}</b><br></br>
                        Recipient address : <b>{props.recipiemail}</b><br></br>
                        Recipient Number : <b>{props.recipiphn}</b><br></br>
                        Requested At : <i>{Date(props.time)}</i>
                </Card.Text>
                    <Button variant="success" id={props.id} onClick={approveHandler} style={{margin : 5}}>Approve</Button> <Button variant="danger" id={props.id} onClick={rejectHandler} style={{margin : 5}}>Reject</Button>
            </Card.Body>
            </Card>
            <ToastContainer />
        </div>
    );
}


export default SeeCard;