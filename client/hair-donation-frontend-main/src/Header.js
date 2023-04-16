import React from "react";
import "./styles/styles.css";
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";



function Header(props){
  let nav = useNavigate();
    return(
       <header className="headerSection">
       <div className = "iconSection">
          <img src={ require('./images/headerIcon.png')} alt="Icon" height={60} width={80} />
       </div>
       <div className ="logoSection">
         <h4>Hair Donation Website</h4>
       </div>
       <div className="iconSection">
          <nav className="loginSection">
            <div className="a">
              <Button variant="info" className ="headerButtons" onClick={() => nav("/home")} >Home</Button>
            </div>
            <div className="a">
              <Button variant="primary" className ="headerButtons" onClick={() => nav("/login/donor")}>LogIn as Donor</Button>
            </div>
            <div className="a">
            <Button variant="secondary"  className ="headerButtons" onClick={() => nav("/login/recipient")}>LogIn as Recipient</Button>
            </div>
            <div className="a">
              <Button variant="success"  className ="headerButtons" onClick={() => nav("/register")} >Register</Button>
            </div>  
          </nav>  
       </div>
      </header>

    );
}

export default Header;