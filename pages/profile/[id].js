import React from 'react';
import Router from 'next/router';
import { useSession } from 'next-auth/react';
import prisma from '../../lib/prisma';
import Link from 'next/link'

export const getServerSideProps = async (context) => {
  try {
    const volunteer = await prisma.volunteer.findUnique({
      where: {
        userId: String(params?.id),
      },
    });
    return {
      props: volunteer,
    };
  } catch {
    return { props: {} }
  }
}

const Profile = (props) => {
  const { data: session, status } = useSession();

  console.log(props?.name === undefined)

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
    const result = confirm("Are you sure you want to delete your volunteer profile?");
    if (result) {
      deleteData()
    }
  }

  if (status === 'loading') {
    return <div>Authenticating ...</div>;
  }

  if (props?.name === undefined) {
    return(
      <p>You dont currently have a volunteer profile. Click <Link href="/volunteer"><a>here</a></Link> to create one.</p>
    )
  }

  return (
    <div>
      <h2>{props?.name}</h2>
      <p>{props?.address}</p>
      <p>{props?.radius}</p>
      <p>{props?.phone}</p>
      <p>{props?.notes}</p>
      <button onClick={() => Router.push(`/profile/edit/${props.userId}`)}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default Profile;
