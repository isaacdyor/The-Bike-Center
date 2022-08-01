import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import PlacesAutocomplete from 'react-places-autocomplete'
import Link from 'next/link';
import {useSession} from "next-auth/react";
import Multiselect from 'multiselect-react-dropdown';
import prisma from "../../lib/prisma";
import {useLoadScript} from "@react-google-maps/api";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

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
  const volunteer_background = {
    textAlign: "center",
    position:"relative",
    marginRight:"10%",
    marginLeft:"10%",
    marginTop: "2%",
    marginBottom:"2%",
    backgroundSize: "90% 90%",
  }

  const volunteer_entry = {
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
  const volunteer_submit = {
    cursor: "pointer",
    textAlign: "center",
    fontSize: "20px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#0275d8",
    color: "white",
  }
  const assignment_submit = {
    cursor: "pointer",
    borderRadius : "10px",
    marginRight : "1%",
  }

  const volunteer_cancel = {
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

  const title_style = {
    marginBottom: "2.5%",
    marginTop: "1%",
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
        <h2 style={title_style}>Assignments</h2>

        {assignments[0]?.name === undefined ? (
          <p>You currently have no assignments</p>
        ) : (
          <></>
        )}

        <div className="container">
          <div className="row">
            {assignments.map(assignment => {
              return(
                <div key={assignment.id} className="col-lg-6 col-md-12 centered">
                  <Card style={{ width: '35rem', marginBottom: '15px', }}>
                    <Card.Body>
                      <Card.Text>
                        <p>Name: {assignment.name}</p>
                        <p>Address: {assignment.address}</p>
                        <p>Email: {assignment.email}</p>
                        <p>Phone Number: {assignment.phone}</p>
                        <p>Number of Bikes: {assignment.bikes}</p>
                        <p>Notes: {assignment.notes}</p>
                        <p>Location: {assignment.location.title}</p>

                      </Card.Text>
                      <Button style = {assignment_submit} variant="primary" onClick={() => markComplete(assignment.id)}>Mark Complete</Button>

                    </Card.Body>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
  return(
    <div style = {volunteer_background}>
      <form onSubmit={submitData}>
        <h2>Become a Volunteer</h2>
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
          onChange={(e) => setRadius(e.target.value)}
          placeholder="Radius (Miles)"
          type="number"
          value={radius}
          style =  {volunteer_entry}
        />
        <input
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          type="text"
          value={phone}
          style =  {volunteer_entry}
        />
        <Multiselect
          displayValue="title"
          onRemove={onRemove}
          onSelect={onSelect}
          options={options}
          showCheckbox
          placeholder="Please select the locations you will be donating to"
          style =  {multiselect}
        />
        <br/>
        <textarea
          cols={50}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes"
          rows={8}
          value={notes}
          style =  {volunteer_entry}
        />

        <input disabled={!name || !address || !radius || !selected} type="submit" value="Create" style = {volunteer_submit} />

        <a style = {volunteer_cancel} className="back" href="#" onClick={() => Router.push('/')}>
          Or Cancel
        </a>
      </form>
    </div>
  )
}

export default Volunteer;

