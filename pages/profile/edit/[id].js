import React, { useState } from 'react';
import Router from 'next/router';
import PlacesAutocomplete from 'react-places-autocomplete'
import Script from "next/script";
import Link from 'next/link';
import {useSession} from "next-auth/react";
import prisma from "../../../lib/prisma";
import {useLoadScript} from "@react-google-maps/api";

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

const libraries = ['places']

const Edit = (props) => {
  const [name, setName] = useState(props.name);
  const [address, setAddress] = useState(props.address);
  const [radius, setRadius] = useState(props.radius);
  const [phone, setPhone] = useState(props.phone);
  const [notes, setNotes] = useState(props.notes);
  const [id, setId] = useState(props.userId);
  const { data: session, status } = useSession();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
    libraries,
  })

  const submitData = async (e) => {
    e.preventDefault();
    try {
      const body = { name, address, radius, phone, notes, id };
      const response = await fetch(`/api/edit/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json()
      await Router.push(`/profile/${props.userId}`);
    } catch (error) {
      console.error(error);
    }
  };
  if (session?.user?.id !== props.userId) {
    return(
      <div>
        <p>This is not your account</p>

      </div>
    )
  }

  return(
    <div>
      <form onSubmit={submitData}>
        <h1>Become a Volunteer</h1>
        <input
          autoFocus
          onChange={(e) => setName(e.target.value)}
          type="text"
          value={name}
        />
        <PlacesAutocomplete
          value={address}
          onChange={setAddress}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps }) => (
            <div>
              <input {...getInputProps({ placeholder: "Type address" })} />

              <div>
                {suggestions.map(suggestion => {
                  const style = {
                    backgroundColor: suggestion.active ? "#41b6e6" : "#fff"
                  };

                  return (
                    <div key={suggestion.description}
                         {...getSuggestionItemProps(suggestion, { style })}>
                      {suggestion.description}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
        <input
          autoFocus
          onChange={(e) => setRadius(e.target.value)}
          placeholder="Radius"
          type="number"
          value={radius}
        />
        <input
          autoFocus
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          type="text"
          value={phone}
        />
        <textarea
          cols={50}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes"
          rows={8}
          value={notes}
        />
        <input disabled={!name || !address} type="submit" value="Edit" />
        <a className="back" href="#" onClick={() => Router.push(`/profile/${props.userId}`)}>
          or Cancel
        </a>
      </form>
    </div>
  )
}

export default Edit;

