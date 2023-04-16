import React from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';


function RequestCard(props) {
    const deleteHandler = async(e) => {
        try { 
            let val = sessionStorage.getItem("currenttoken");
            const options = { headers: { Authorization: "Bearer "+ val } }
            const res = await axios.delete(`http://localhost:5000/api/recipients/request/${e.target.id}`,  options);
            console.log(res);
            if (res.data.message) {
                toast.success("Deleted successfully");
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
            <Card style={{ width: '15rem', margin:20 }}>
            <Card.Body>
                <Card.Title>Requested For : <b>{props.hairtype}</b></Card.Title>
                <Card.Text>
                        Donation Type : <b>{props.donationtype}</b><br />
                        Donor : <b>{ props.donor}</b> <br></br>
                        Request Status : {props.requeststatus === 0 ? <b>Open</b> : props.requeststatus === 1 ? <p style={{color:'green'}}><b>Approved</b></p> : <p style={{color:'red'}}><b>Rejected</b></p> } <br></br>
                        Requested Time: <i>{Date(props.time)}</i>
                </Card.Text>
                <Button variant="danger" id = {props.id} onClick={deleteHandler}>Delete Request</Button>
            </Card.Body>
            </Card>
            <ToastContainer />
        </div>
    );
}


export default RequestCard;