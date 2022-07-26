import React, {useState, useEffect} from 'react';
import Router from 'next/router';
import { useSession } from 'next-auth/react';
import prisma from '../../lib/prisma';
import Link from 'next/link'

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
  }, []);


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

  if (status === 'loading') {
    return <div>Authenticating ...</div>;
  }

  if (props?.name === undefined) {
    return(
      <p>You dont currently have a volunteer profile. Click <Link href={`/volunteer/${session.user.id}`}><a>here</a></Link> to create one.</p>
    )
  }

  {if (session.user.id === props?.userId) {
    return(
      <div>
        <h2>Name: {props?.name}</h2>
        <p>Address: {props?.address}</p>
        <p>Radius: {props?.radius}</p>
        <p>Phone: {props?.phone}</p>
        <p>Notes: {props?.notes}</p>
        <p>{bikes} bikes donated</p>
        <p>{hours} hours volunteered</p>
        {props?.approved ? (
          <p>Approved</p>
        ) : (
          <p>Pending Approval</p>
        )}
        <h5>Locations</h5>
        {props?.locations.map(location => {
          return(
            <div key={location.id}>
              <p>{location.title}</p>
            </div>
          )
        })}
        <button onClick={() => Router.push(`/profile/donations/${props.id}`)}>See donations</button>
        <button onClick={() => Router.push(`/profile/edit/${props.userId}`)}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    )
  }else {
    return(
      <div>
        <h2>Name: {props?.name}</h2>
        <p>Bikes donated: {bikes}</p>
        <p>Hours volunteered: {hours}</p>
        <p>Notes: {props?.notes}</p>
        <h5>Locations</h5>
        {props?.locations.map(location => {
          return(
            <div key={location.id}>
              <p>{location.title}</p>
            </div>
          )
        })}
        <button onClick={() => Router.push(`/profile/donations/${props.id}`)}>See donations</button>
        <button onClick={() => Router.push(`/transport/${props.userId}`)}>Request a pickup</button>
      </div>
    )
  }
  }

};

export default Profile;
