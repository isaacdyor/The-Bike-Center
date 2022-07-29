import React, {useState, useEffect} from 'react';
import Router from 'next/router';
import { useSession } from 'next-auth/react';
import prisma from '../../lib/prisma';
import Link from 'next/link'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

export const getServerSideProps = async ({params}) => {
  const volunteer = await prisma.volunteer.findUnique({
    where: {
      userId: String(params?.id),
    },
    include: {
      locations: true,
      donations: true,
    },
  })
  if (volunteer === null) {
    return { props: {} }
  } else {
    return {
      props: volunteer,
    };
  }
}

const Profile = (props) => {
  const [bikes, setBikes] = useState(0)
  const [hours, setHours] = useState(0)
  const { data: session, status } = useSession();

  useEffect(() => {
    props?.volunteer?.donations.forEach(donation => {
      if (donation.approved) {
        setBikes(bikes+parseInt(donation.bikes))
      }
    })
    props?.volunteer?.donations.forEach(donation => {
      if (donation.approved) {
        setHours(hours+parseInt(donation.hours))
      }
    })
  });


  const deleteData = async (e) => {
    // e.preventDefault();
    try {
      await fetch(`/api/delete/${props.userId}`, {
        method: 'DELETE',
      });
      await Router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = () => {
    const result = confirm("Are you sure you want to delete your volunteer donations?");
    if (result) {
      deleteData()
    }
  }

  const profile_background = {
    backgroundSize: "100% 100%",
    marginBottom:"0px",
    paddingTop:"10px",
    paddingRight:"45px",
    paddingLeft:"45px",
    // width: "100vw",
    // height: "100vh",
  }
  const profile_button = {
    cursor: "pointer",
    borderRadius : "10px",
    marginRight : "1%",
  }
  const profile_buttons = {
    display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center',
  }

  if (status === 'loading') {
    return <div>Authenticating ...</div>;
  }

  if (props?.name === undefined) {
    return(
      <p>You dont currently have a volunteer profile. Click <Link href={`/volunteer/${session.user.id}`}><a>here</a></Link> to create one.</p>
    )
  }

  {if (session?.user?.id === props?.userId) {
    return(
      <div style={profile_background}>
        <h2>Name: {props?.name}</h2>
        <br/>
        <Card style={{ width: '35rem' }}>
          <Card.Body>
            <Card.Title>Name: {props?.name}</Card.Title>
            <Card.Text>
              <p>Address: {props?.address}</p>
              <p>Radius: {props?.radius}</p>
              <p>Phone Number: {props?.phone}</p>
              <p>Notes: {props?.notes}</p>
              <p>Number of bikes donated: {bikes}</p>
              <p>Number of hours volunteered: {hours}</p>
              {props?.approved ? (
                <p>Account approval status: Approved</p>
              ) : (
                <p>Account approval status: Pending Approval</p>
              )}
              <h5>Locations user will donate bikes to:</h5>
              {props?.locations.map(location => {
                return(
                  <div key={location.id}>
                    <p>-{location.title}</p>
                  </div>
                )
              })}
            </Card.Text>
            <Button style={profile_button} variant="primary" onClick={() => Router.push(`/profile/donations/${props.id}`)}>See donations</Button>
            <Button style={profile_button} variant="primary" onClick={() => Router.push(`/profile/edit/${props.userId}`)}>Edit</Button>
            <Button style={profile_button} variant="primary" onClick={handleDelete}>Delete</Button>
          </Card.Body>
        </Card>
      </div>
    )
  }else {
    return(
      <div style={profile_background}>
        <h2>Name: {props?.name}</h2>
        <br/>
        <Card style={{ width: '35rem' }}>
          <Card.Body>
            <Card.Title>Name: {props?.name}</Card.Title>
            <Card.Text>

              <p>Number of bikes donated: {bikes}</p>
              <p>Number of hours volunteered: {hours}</p>
              <p>Notes: {props?.notes}</p>
              <h5>Locations user will donate bikes to:</h5>
              {props?.locations.map(location => {
                return(
                  <div key={location.id}>
                    <p>-{location.title}</p>
                  </div>
                )
              })}
            </Card.Text>
            <Button style={profile_button} variant="primary" onClick={() => Router.push(`/profile/donations/${props.id}`)}>See donations</Button>
            <Button style={profile_button} variant="primary" onClick={() => Router.push(`/transport/${props.userId}`)}>Request pickup</Button>
          </Card.Body>
        </Card>
      </div>
    )
  }
  }

};

export default Profile;
