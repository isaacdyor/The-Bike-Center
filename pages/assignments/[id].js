import React from 'react';
import Router from 'next/router';
import { useSession } from 'next-auth/react';
import prisma from '../../lib/prisma';
import Link from 'next/link'

export const getServerSideProps = async ({params}) => {
  const assignments = await prisma.assignment.findMany({
    where: {
      volunteerId: String(params?.id),
    },
    include: {
      locations: true,
    },
  })
  const volunteer = await prisma.volunteer.findUnique({
    where: {
      id: String(params?.id),
    },
  })
  if (volunteer === null) {
    return { props: {assignments} }
  } else {
    return {
      props: { props: {assignments, volunteer} },
    };
  }
}

const Profile = (props) => {

  const { data: session, status } = useSession();



  if (status === 'loading') {
    return <div>Authenticating ...</div>;
  }

  if (props?.volunteer?.name === undefined) {
    return(
      <p>You dont currently have a volunteer profile. Click <Link href="/volunteer"><a>here</a></Link> to create one.</p>
    )
  }

  {if (session.user.id === props?.volunteer?.userId) {
    return(
      <div>
        <h1>Authenticated</h1>
      </div>
    )
  } else {
    return(
      <div>
        <h1>Not yos hoe</h1>
        <h2>{props?.name}</h2>
        <p>{props?.address}</p>
        <p>{props?.radius}</p>
        <p>{props?.phone}</p>
        <p>{props?.notes}</p>
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
