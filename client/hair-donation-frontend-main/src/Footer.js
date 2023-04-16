import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';

export default function Footer() {
  return (
    <MDBFooter bgColor='light' className='text-center text-lg-start text-muted' >
    

      <section className=''>
        <MDBContainer className='text-center text-md-start mt-5'>
          <MDBRow className='mt-3'>
            <MDBCol md='3' lg='4' xl='3' className='mx-auto mb-4'>
              <h5 className='text-uppercase fw-bold mb-4'>
                <MDBIcon color='secondary' icon='gem' className='me-3' />
                About Us
              </h5>
              <h6>
               We are helping out people by providing them a plaform to find the hair donors
              </h6>
            </MDBCol>

            <MDBCol md='2' lg='2' xl='2' className='mx-auto mb-4'>
              <h5 className='text-uppercase fw-bold mb-4'>Registered Users</h5>
              <h6>
                Counting...
              </h6>
            </MDBCol>

            <MDBCol md='3' lg='2' xl='2' className='mx-auto mb-4'>
              <h5 className='text-uppercase fw-bold mb-4'>Successful Cases</h5>
              <h6>
                Counting...
              </h6>
            </MDBCol>

            <MDBCol md='4' lg='3' xl='3' className='mx-auto mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Contact</h6>
              <p>
                <MDBIcon color='secondary' icon='home' className='me-2' />
                Hyderabad, India
              </p>
              <p>
                <MDBIcon color='secondary' icon='envelope' className='me-3' />
                hairdonation@example.com
              </p>
              <p>
                <MDBIcon color='secondary' icon='phone' className='me-3' /> + 01 234 567 88
              </p>
              <p>
                <MDBIcon color='secondary' icon='print' className='me-3' /> + 01 234 567 89
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)', paddingBottom :100 }}>
        © 2023 Copyright:
        <a className='text-reset fw-bold' href='https://github.com/venith-huggina/venith-huggina.git'>
         hairdonation.com
        </a>
      </div>
      </MDBFooter>
   
  );
}