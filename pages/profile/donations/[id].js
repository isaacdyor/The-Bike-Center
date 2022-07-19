import React from "react";
import prisma from "../../../lib/prisma";
import Router from "next/router";
import {useSession} from "next-auth/react";


export const getServerSideProps = async ({params}) => {
  const donations = await prisma.donation.findMany({
      where: {
        volunteerId: String(params?.id)
      },
    }
  );
  return { props: { donations } };
}
const Donations = ({ donations }) => {
  const { data: session, status } = useSession();

  return(
    <div>
      <h1>Donations</h1>
      <br/>
      <hr/>
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
            <button onClick={() => Router.push(`/profile/donations/edit/${donation.id}`)}>Edit</button>
            <button onClick={async () => {
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
            }}>Delete</button>
            <hr/>
          </div>
        )
      })}
    </div>
  )
}

export default Donations;

