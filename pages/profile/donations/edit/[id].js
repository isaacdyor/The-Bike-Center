import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import PlacesAutocomplete from 'react-places-autocomplete'
import {useSession} from "next-auth/react";
import prisma from "../../../../lib/prisma";
import {useLoadScript} from "@react-google-maps/api";
import Multiselect from "multiselect-react-dropdown";

const libraries = ['places']

export const getServerSideProps = async ({ params }) => {
  const donation = await prisma.donation.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      location: true,
      volunteer: true,
    },
  });
  const locations = await prisma.location.findMany();
  return {
    props: { donation, locations}
  };
};

const Edit = ({ donation, locations }) => {
  const [bikes, setBikes] = useState(donation.bikes);
  const [hours, setHours] = useState(donation.hours);
  const [description, setDescription] = useState(donation.description);
  const [value, setValue] = useState(donation.value);
  const { data: session } = useSession();

  const sessionId = session?.user?.id


  const submitData = async (e) => {
    e.preventDefault();
    try {
      const body = { bikes, hours, value, description };
      const response = await fetch(`/api/donation/edit/${donation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json()
      await Router.push(`/profile/donations/${donation.volunteerId}`);
    } catch (error) {
      console.error(error);
    }
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
    libraries
  })

  {if (sessionId === donation?.volunteer?.userId) {
    return(
      <div>
        <form onSubmit={submitData}>
          <h1>Edit your donation</h1>

          <input
            autoFocus
            onChange={(e) => setBikes(e.target.value)}
            placeholder="Number of bikes donated"
            type="number"
            value={bikes}
          />
          <br/>
          <input
            autoFocus
            onChange={(e) => setHours(e.target.value)}
            placeholder="Number of hours volunteered"
            type="number"
            value={hours}
          />
          <input
            autoFocus
            onChange={(e) => setValue(e.target.value)}
            placeholder="Approximate value of goods donated in dollars"
            type="text"
            value={value}
          />
          <textarea
            cols={50}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description of goods donated"
            rows={8}
            value={description}
          />
          <input disabled={!bikes || !hours } type="submit" value="Create" />
          <a className="back" href="#" onClick={() => Router.push('/')}>
            or Cancel
          </a>
        </form>
      </div>
    )
  } else {
    return(
      <div>
        <p>Sorry this is not your account</p>
      </div>
    )
  }
  }

}

export default Edit;

