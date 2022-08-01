import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import {useSession} from "next-auth/react";
import Multiselect from 'multiselect-react-dropdown';
import prisma from "../../lib/prisma";
import {useLoadScript} from "@react-google-maps/api";
import Button from "react-bootstrap/Button";

const libraries = ['places']

export const getServerSideProps = async ({params}) => {
  const locations = await prisma.location.findMany();
  const volunteer = await prisma.volunteer.findUnique({
    where: {
      userId: String(params?.id),
    },
  });

  return { props: { locations, volunteer } }

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
      await Router.push(`/profile/donations/${props.volunteer.id}`);
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

  //styling
  const donation_background = {
    textAlign: "center",
    position:"relative",
    marginRight:"15%",
    marginLeft:"15%",
    marginTop: "2%",
    marginBottom:"2%",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
  }
  const donation_h1 = {
    fontSize : "3.5vw",
    textAlign : "center",
    paddingTop:"0%"
  }
  const donation_frame =  {


  }
  const donation_entry = {
    width: "100%",
    marginBottom: "1%",
    marginLeft: "0%",
    paddingBottom: "10px",
    borderColor: "black",
  }
  const multiselect = {
    searchBox: {
      'border': '2px solid black',
      'borderRadius': '0px',
    }
  }

  const donation_submit = {
    cursor: "pointer",
    textAlign: "center",
    fontSize: "20px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#0275d8",
    color: "white",
  }

  const donation_cancel = {
    backgroundSize : "100% 100%",
    backgroundRepeat: "no-repeat",
    color : "#0000EE",
    fontSize : "1.5vw",
    border : "none",
    borderRadius : "30px",
    marginBottom: "0%",
    marginTop: "0%",
    marginRight : "10%",
    fontWeight : "bolder",
    textDecoration : "underline",
    width: "10vw",
  }


  if (!session) {
    return(
      <div>
        <p>Please <Link href="/api/auth/signin"><a>log in</a></Link> to signup as a volunteer</p>
      </div>
    )
  }

  return(
    <div style={donation_background}>
      <form style={donation_frame} onSubmit={submitData}>
        <h1 style = {donation_h1}>Fill Out This Form Once You Complete A Donation</h1><br/>

        <input
          autoFocus
          onChange={(e) => setBikes(e.target.value)}
          placeholder="Number of bikes donated"
          type="number"
          value={bikes}
          style={donation_entry}
        />

        <input
          // autoFocus
          onChange={(e) => setHours(e.target.value)}
          placeholder="Number of hours volunteered"
          type="number"
          value={hours}
          style={donation_entry}
        />
        <input
          // autoFocus
          onChange={(e) => setValue(e.target.value)}
          placeholder="Approximate value of goods donated in dollars"
          type="number"
          value={value}
          style={donation_entry}
        />
        <Multiselect
          displayValue="title"
          onRemove={onRemove}
          onSelect={onSelect}
          options={options}
          showCheckbox
          placeholder="Location that you donated the bikes to"
          selectionLimit={1}
          style={multiselect}
        />
        <br/>
        <textarea
          cols={50}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description of goods donated"
          rows={8}
          value={description}
          style={donation_entry}
        />

        <input disabled={!bikes || !hours } type="submit" value="Submit" style={donation_submit}/>
        <a style = {donation_cancel} className="back" href="#" onClick={() => Router.push('/')}>
          Or Cancel
        </a>
      </form>
    </div>
  )
}

export default Volunteer;

