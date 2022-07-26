import React, { useState, useEffect } from 'react';
import Router from 'next/router';
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
  });


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
    marginRight:"10%",
    marginLeft:"10%",
    marginTop: "2%",
    marginBottom:"2%",
    backgroundImage: "url('https://c4.wallpaperflare.com/wallpaper/963/87/601/light-blue-background-hd-wallpaper-wallpaper-preview.jpg')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
  }
  const donation_h1 = {
    fontSize : "3vw",
    textAlign : "center",
    paddingTop:"2%"
  }
  const donation_frame =  {
    

  }
  const donation_entry = {
    width: "90%",
    marginBottom: "5%",
    marginLeft: "0%",
    paddingBottom: "15px",
  }
  const donation_submit = {
    backgroundImage : "url(https://www.xmple.com/wallpaper/sunburst-burst-green-rays-white-1920x1080-c2-32cd32-ffffff-k2-50-50-l2-30-0-a-6-f-22.svg)",
    backgroundSize : "100% 100%",
    backgroundRepeat: "no-repeat",
    color : "Black",
    fontSize : "1.5vw",
    border : "none",
    borderRadius : "30px",
    marginBottom: "1%",
    marginTop: "1%",
    marginRight : "3%",
    fontWeight : "bolder",
    width: "10vw",
    }

    const donation_cancel = {
      backgroundSize : "100% 100%",
      backgroundRepeat: "no-repeat",
      color : "#ff7373",
      fontSize : "1.5vw",
      border : "none",
      borderRadius : "30px",
      marginBottom: "1%",
      marginTop: "1%",
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
        <h1 style = {donation_h1}>Fill Out This Form <br/>Once You Complete A Donation</h1><br/>

        <input
          autoFocus
          onChange={(e) => setBikes(e.target.value)}
          placeholder="Number of bikes donated"
          type="number"
          value={bikes}
          style={donation_entry}
        />
        <br/>
        
        <input
          autoFocus
          onChange={(e) => setHours(e.target.value)}
          placeholder="Number of hours volunteered"
          type="number"
          value={hours}
          style={donation_entry}
        />
        <br/>
        <input
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          placeholder="Approximate value of goods donated in dollars"
          type="number"
          value={value}
          style={donation_entry}
        />
        <textarea
          cols={50}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description of goods donated"
          rows={8}
          value={description}
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
        />

        <input disabled={!bikes || !hours } type="submit" value="Create" style={donation_submit}/>
        <a style = {donation_cancel} className="back" href="#" onClick={() => Router.push('/')}>
          Or Cancel
        </a>
      </form>
    </div>
  )
}

export default Volunteer;

