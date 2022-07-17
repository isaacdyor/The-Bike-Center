import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import PlacesAutocomplete from 'react-places-autocomplete'
import {useSession} from "next-auth/react";
import prisma from "../../../lib/prisma";
import {useLoadScript} from "@react-google-maps/api";
import Multiselect from "multiselect-react-dropdown";

const libraries = ['places']

export const getServerSideProps = async ({ params }) => {
  const volunteer = await prisma.volunteer.findUnique({
    where: {
      userId: String(params?.id),
    },
    include: {
      locations: true,
    },
  });
  const locations = await prisma.location.findMany();
  return {
    props: { volunteer, locations}
  };
};

const Edit = (props) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
    libraries
  })

  const [name, setName] = useState(props.volunteer.name);
  const [address, setAddress] = useState(props.volunteer.address);
  const [radius, setRadius] = useState(props.volunteer.radius);
  const [phone, setPhone] = useState(props.volunteer.phone);
  const [notes, setNotes] = useState(props.volunteer.notes);
  const [id, setId] = useState(props.volunteer.userId);
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState([])
  const [preselected, setPreselected] = useState([])
  const { data: session } = useSession();

  useEffect(() => {
    props.locations.map(prop => {
      const optionData = {
        id: prop.id,
        title: prop.title,
        address: prop.address,
        website: prop.website,
        phone: prop.phone,
      }
      setOptions(options => [...options, optionData])
    })
    props.volunteer.locations.map(prop => {
      const preselectedData = {
        id: prop.id,
        title: prop.title,
        address: prop.address,
        website: prop.website,
        phone: prop.phone,
      }
      setPreselected(preselected => [...preselected, preselectedData])
    })
  }, []);

  const onSelect = (e) => {
    setSelected(e)
  }

  const onRemove = (e) => {
    setSelected(e)
  }

  const submitData = async (e) => {
    e.preventDefault();
    try {
      const body = { name, address, radius, phone, notes, id, selected };
      const response = await fetch(`/api/edit/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json()
      await Router.push(`/profile/${props.volunteer.userId}`);
    } catch (error) {
      console.error(error);
    }
  };
  if (session?.user?.id !== props.volunteer.userId) {
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
        <Multiselect
          displayValue="title"
          onRemove={onRemove}
          onSelect={onSelect}
          options={options}
          showCheckbox
          placeholder="Please select the locations you will be donating to"
          selectedValues={preselected}
        />
        <input disabled={!name || !address} type="submit" value="Edit" />
        <a className="back" href="#" onClick={() => Router.push(`/profile/${props.volunteer.userId}`)}>
          or Cancel
        </a>
      </form>
    </div>
  )
}

export default Edit;

