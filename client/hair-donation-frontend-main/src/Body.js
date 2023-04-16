import React from "react";
import Card from 'react-bootstrap/Card';
import './styles/body.css';
import Footer from "./Footer";
import Header from "./Header"

function Body() {
    return (
        <React.Fragment>
        <Header />
        <div className="containerSection" style={{backgroundColor: 'rgb(250, 245, 245)'}}>
            <div className="contentSection">
                <h3>BLEED TO SAVE</h3>
                <p><i>Bleed To Save is intended to help people in the need of hair, find the required hair by connecting with donors online.</i></p>
            </div>
            <div className="cardsContainer">
            <div className="cardItem">
            {[
                'Secondary',
            ].map((variant) => (
                <Card
                bg={variant.toLowerCase()}
                key={variant}
                text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
                style={{ width: '18rem', height: '14rem' }}
                className="mb-2"
                >
                <Card.Header>NEED hair</Card.Header>
                <Card.Body>
                    <Card.Text>
                    If you are in need of hair donor, then you have come to the right place. We can help you search for donors.
                    </Card.Text>
                </Card.Body>
                </Card>
            ))}
                </div>
            <div className="cardItem">
            {[
                'Secondary',
            ].map((variant) => (
                <Card
                bg={variant.toLowerCase()}
                key={variant}
                text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
                style={{ width: '18rem', height: '14rem' }}
                className="mb-2"
                >
                <Card.Header>FIND DONOR</Card.Header>
                <Card.Body>
                        <Card.Text>
                        You can find hair donors in your area and can also place hair requests to find the required donor.
                    </Card.Text>
                </Card.Body>
                </Card>
            ))}
                </div>

                
                <div className="cardItem">
            {[
                'Secondary',
            ].map((variant) => (
                <Card
                bg={variant.toLowerCase()}
                key={variant}
                text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
                style={{ width: '18rem', height: '14rem' }}
                className="mb-2"
                >
                <Card.Header>SAVE LIFE</Card.Header>
                <Card.Body>
                        <Card.Text>
                        You can help save someone's life by logging in as a donor and accepting their hair requests.
                    </Card.Text>
                </Card.Body>
                </Card>
            ))}
                    </div>
            </div>
            <div className="contentSection">
                <h3 style={{
                    marginTop : 15
                }}>Hair Requests</h3>
                <div>
                <p><i>You can help the people in search of a donor by accepting their request. Register now to help save precious lives.</i></p>
                </div>
            </div>
          
        </div>   
          <Footer /> 
          </React.Fragment>
    )
}

export default Body;