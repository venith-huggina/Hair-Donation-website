import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/donation.css";
import Button from 'react-bootstrap/Button';

function RecipientHeader(props) {
    const nav = useNavigate();

    const deleteHandler = () => {
        sessionStorage.clear()
        nav("/");
    }
    
    return(
        <header className="headerSection">
        <div className = "iconSection">
           <img src={ require('./images/headerIcon.png')} alt="Icon" height={60} width={80} />
        </div>
        <div className ="logoSection">
                <h4>{ props.username }</h4>
        </div>
        <div className="iconSection">
           <nav className="loginSection">
             <div className="a">
               <Button variant="info" className ="headerButtons" onClick={() => props.onFormSwitch("search")} >Search</Button>
             </div>
             <div className="a">
               <Button variant="primary" className ="headerButtons" onClick={() => props.onFormSwitch("")}>View your requests</Button>
             </div>
             <div className="a">
               <Button variant="danger"  className ="headerButtons" onClick={deleteHandler} >Log Out</Button>
             </div>  
           </nav>  
        </div>
       </header>
 
     );
}

export default RecipientHeader;