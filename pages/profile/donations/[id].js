import React from "react";
import prisma from "../../../lib/prisma";
import Router from "next/router";
import {useSession} from "next-auth/react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css'


export const getServerSideProps = async ({params}) => {
  const donations = await prisma.donation.findMany({
      where: {
        volunteerId: String(params?.id)
      },
    }
  );
  const volunteer = await prisma.volunteer.findUnique({
    where: {
      id: String(params?.id),
    },
  });
  return { props: { donations, volunteer } };
}
const Donations = ({ donations, volunteer }) => {
  const { data: session, status } = useSession();

  const donation_background = {
    backgroundSize: "100% 100%",
    marginBottom:"0px",
    paddingTop:"10px",
    paddingRight:"45px",
    paddingLeft:"45px",
    // width: "100vw",
    // height: "100vh",
  }
  const donation_button = {
    cursor: "pointer",
    borderRadius : "10px",
    marginRight : "1%",
  }

  {if (session?.user?.id === volunteer?.userId) {
    return(
      <div style={donation_background}>
        <h2>Donations</h2>
        <br/>

        <div className="container">
          <div className="row">
            {donations.map(donation => {
              return(
                <div key={donation.id} className="col-lg-6 col-md-12 centered">
                  <Card style={{ width: '35rem', marginBottom: '15px', }}>
                    <Card.Body>
                      <Card.Text>
                        <p>{donation.bikes} bikes</p>
                        <p>{donation.hours} hours</p>
                        <p>description: {donation.description}</p>
                        <p>value: {donation.value}$</p>
                        {donation.approved ? (
                          <p>Approved</p>
                        ) : (
                          <p>Pending Approval</p>
                        )}
                      </Card.Text>
                      <Button style={donation_button} variant="primary" onClick={() => Router.push(`/profile/donations/edit/${donation.id}`)}>Edit</Button>
                      <Button style={donation_button} variant="primary" onClick={async () => {
                        const result = confirm("Are you sure you want to delete your donation?");
                        if (result) {
                          try {
                            await fetch(`/api/donation/delete/${donation.volunteerId}`, {
                              method: 'DELETE',
                            });
                            await Router.push(`/profile/donations/${donation.volunteerId}`);
                          } catch (error) {
                            console.error(error);
                          }
                        }
                      }}>Delete</Button>
                    </Card.Body>
                  </Card>
                </div>
              )
            })}
          </div>
          </div>
        </div>


    )
  }}
  return(
    <div style={donation_background}>
      <h2>Donations</h2>
      <br/>
      {donations.map(donation => {
        return(
          <div key={donation.id}>
            <p>{donation.bikes} bikes</p>
            <p>{donation.hours} hours</p>
            <p>description: {donation.description}</p>
            <p>value: {donation.value}$</p>
            {donation.approved ? (
              <p>Approved</p>
            ) : (
              <p>Pending Approval</p>
            )}
            <hr/>
          </div>
        )
      })}
    </div>
  )
}

export default Donations;

