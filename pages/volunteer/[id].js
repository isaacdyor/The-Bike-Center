import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import PlacesAutocomplete from 'react-places-autocomplete'
import Link from 'next/link';
import {useSession} from "next-auth/react";
import Multiselect from 'multiselect-react-dropdown';
import prisma from "../../lib/prisma";
import {useLoadScript} from "@react-google-maps/api";

const libraries = ['places']

export const getServerSideProps = async ({params}) => {
  const volunteer = await prisma.volunteer.findUnique({
    where: {
      userId: String(params?.id),
    },
  });
  const locations = await prisma.location.findMany();
  const assignments = await prisma.assignment.findMany({
    where: {
      userId: String(params?.id),
      completed: false,
    },
    include: {
      location: true,
    },
  })
  if (volunteer === null) {
    return { props: {locations, assignments} }
  } else {
    return {
      props: { locations, volunteer, assignments }
    };
  }
}

const Volunteer = ({locations, volunteer, assignments}) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [radius, setRadius] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState([])
  const [isVolunteer, setIsVolunteer] = useState(false)
  const [completed, setCompleted] = useState(true)
  const { data: session, status } = useSession();

  const submitData = async (e) => {
    e.preventDefault();
    try {
      const body = { name, address, radius, phone, notes, selected };
      const response = await fetch('/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json()
      await Router.push('/volunteer/new-volunteer');
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    locations.map(prop => {
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
  async function markComplete(id) {
    await fetch(`/api/assignment/${id}`, {
      method: 'PUT',
    });
    await Router.push(`/volunteer/${volunteer.userId}`);
  }

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
    libraries
  })

  //styling
  const voluneteer_background = {
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
  const volunteer_h1 = {
    fontSize : "3vw",
    textAlign : "center",
    paddingTop:"2%",
    
  }
 
  const volunteer_entry = {
    width: "90%",
    marginBottom: "5%",
    marginLeft: "0%",
    paddingBottom: "15px",
  }
  const volunteer_submit = {
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

    const volunteer_cancel = {
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
 
      
  if (!isLoaded) return "Loading...";

  if (!session) {
    return(
      <div>
        <p>Please <Link href="/api/auth/signin"><a>log in</a></Link> to signup as a volunteer</p>
      </div>
    )
  }

  if (volunteer !== undefined && session.user.id === volunteer?.userId) {
    return(
      <div>
        <h1 style = {volunteer_h1}>Assignments</h1>
        <hr/>
        {assignments[0]?.name === undefined ? (
          <p>You currently have no assignments</p>
        ) : (
          <></>
        )}
        {assignments.map(assignment => {
          return(
            <div key={assignment.id}>
              <p>{assignment.name}</p>
              <p>{assignment.address}</p>
              <p>{assignment.email}</p>
              <p>{assignment.phone}</p>
              <p>{assignment.bikes}</p>
              <p>{assignment.notes}</p>
              <p>{assignment.location.title}</p>
              <button onClick={() => markComplete(assignment.id)}>Mark Complete</button>
              <hr/>
            </div>
          )
        })}
      </div>
    )
  }

  return(
    <div style = {voluneteer_background}>
      <form onSubmit={submitData}>
        <h1 style={volunteer_h1}>Become a Volunteer</h1>
        <input
          autoFocus
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          type="text"
          value={name}
          style =  {volunteer_entry}
        />
        <PlacesAutocomplete
          value={address}
          onChange={setAddress}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps }) => (
            <div>
              <input style =  {volunteer_entry} {...getInputProps({ placeholder: "Type address" })} />

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
          placeholder="Radius (Miles)"
          type="number"
          value={radius}
          style =  {volunteer_entry}
        />
        <input
          autoFocus
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          type="text"
          value={phone}
          style =  {volunteer_entry}
        />
        <textarea
          cols={50}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes"
          rows={8}
          value={notes}
          style =  {volunteer_entry}
        />
        <Multiselect
          displayValue="title"
          onRemove={onRemove}
          onSelect={onSelect}
          options={options}
          showCheckbox
          placeholder="Please select the locations you will be donating to"
        />

        <input disabled={!name || !address || !radius || !selected} type="submit" value="Create" style = {volunteer_submit}/>
        <a style = {volunteer_cancel} className="back" href="#" onClick={() => Router.push('/')}>
          Or Cancel
        </a>
      </form>
    </div>
  )
}

export default Volunteer;

