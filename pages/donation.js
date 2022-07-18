import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import PlacesAutocomplete from 'react-places-autocomplete'
import Link from 'next/link';
import {useSession} from "next-auth/react";
import Multiselect from 'multiselect-react-dropdown';
import prisma from "../lib/prisma";
import {useLoadScript} from "@react-google-maps/api";

const libraries = ['places']

export const getServerSideProps = async (context) => {
  const locations = await prisma.location.findMany();

  return { props: { locations } }

}

const Volunteer = (props) => {
  const [bikes, setBikes] = useState('');
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState([])
  const { data: session } = useSession();

  const submitData = async (e) => {
    e.preventDefault();
    try {
      const body = { bikes, hours, description, value, selected };
      console.log(selected)
      const response = await fetch('/api/donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json()
      await Router.push('/map');
    } catch (error) {
      console.error(error);
    }
  };
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
  }, []);


  const onSelect = (e) => {
    setSelected(e)
  }

  const onRemove = (e) => {
    setSelected(e)
  }

  const { } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
    libraries
  })

  if (!session) {
    return(
      <div>
        <p>Please <Link href="/api/auth/signin"><a>log in</a></Link> to signup as a volunteer</p>
      </div>
    )
  }

  return(
    <div>
      <form onSubmit={submitData}>
        <h1>Fill out this form once you complete a donation</h1>

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
        <Multiselect
          displayValue="title"
          onRemove={onRemove}
          onSelect={onSelect}
          options={options}
          showCheckbox
          placeholder="Location that you donated the bikes to"
          selectionLimit={1}
        />

        <input disabled={!bikes || !hours } type="submit" value="Create" />
        <a className="back" href="#" onClick={() => Router.push('/')}>
          or Cancel
        </a>
      </form>
    </div>
  )
}

export default Volunteer;

