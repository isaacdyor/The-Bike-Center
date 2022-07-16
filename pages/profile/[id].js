import React from 'react';
import Router from 'next/router';
import { useSession } from 'next-auth/react';
import prisma from '../../lib/prisma';

export const getServerSideProps = async ({ params }) => {
  const volunteer = await prisma.volunteer.findUnique({
    where: {
      userId: String(params?.id),
    },
  });
  return {
    props: volunteer,
  };
};

const Profile = (props) => {
  const { data: session, status } = useSession();

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

  if (status === 'loading') {
    return <div>Authenticating ...</div>;
  }

  return (
    <div>
      <h2>{props?.name}</h2>
      <p>{props?.address}</p>
      <p>{props?.radius}</p>
      <p>{props?.phone}</p>
      <p>{props?.notes}</p>
      <button onClick={() => Router.push(`/profile/edit/${props.userId}`)}>Edit</button>
      <button onClick={() => deleteData()}>Delete</button>
    </div>
  );
};

export default Profile;
