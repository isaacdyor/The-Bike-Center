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

  const donation_edit_background = {
    textAlign: "center",
    position:"relative",
    marginRight:"10%",
    marginLeft:"10%",
    marginTop: "2%",
    marginBottom:"2%",
    backgroundSize: "90% 90%",
  }
  const donation_edit_entry = {
    width: "100%",
    marginBottom: "1%",
    marginLeft: "0%",
    paddingBottom: "10px",
    borderColor: "black",
  }
  const donation_edit_submit = {
    cursor: "pointer",
    textAlign: "center",
    fontSize: "20px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#0275d8",
    color: "white",
  }

  const donation_edit_cancel = {
    backgroundSize : "100% 100%",
    backgroundRepeat: "no-repeat",
    color : "#0000EE",
    fontSize : "20px",
    border : "none",
    borderRadius : "30px",
    marginBottom: "0%",
    marginTop: "0%",
    marginRight : "10%",
    fontWeight : "bolder",
    textDecoration : "underline",
    width: "10vw",
  }
  const label_style = {
    textAlign: "left",
    marginBottom: "0%",
  }

  {if (sessionId === donation?.volunteer?.userId) {
    return(
      <div style={donation_edit_background}>
        <form onSubmit={submitData}>
          <h2>Edit your donation</h2>
          <br/>
          <p style={label_style}>Number of bikes donated:</p>
          <input
            autoFocus
            onChange={(e) => setBikes(e.target.value)}
            placeholder="Number of bikes donated"
            type="number"
            value={bikes}
            style={donation_edit_entry}
          />
          <br/>
          <p style={label_style}>Number of hours donated:</p>
          <input
            autoFocus
            onChange={(e) => setHours(e.target.value)}
            placeholder="Number of hours volunteered"
            type="number"
            value={hours}
            style={donation_edit_entry}
          />
          <p style={label_style}>Approximate value of goods donated (in dollars):</p>
          <input
            autoFocus
            onChange={(e) => setValue(e.target.value)}
            placeholder="Approximate value of goods donated in dollars"
            type="text"
            value={value}
            style={donation_edit_entry}
          />
          <p style={label_style}>Description of goods donated:</p>
          <textarea
            cols={50}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description of goods donated"
            rows={8}
            value={description}
            style={donation_edit_entry}
          />
          <input style={donation_edit_submit} disabled={!bikes || !hours } type="submit" value="Update" />
          <a style={donation_edit_cancel} className="back" href="#" onClick={() => Router.push('/')}>
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

