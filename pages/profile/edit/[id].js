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

  const sessionId = session?.user?.id

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
      const response = await fetch(`/api/volunteer/edit/${id}`, {
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

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
    libraries
  })

  const edit_profile_background = {
    textAlign: "center",
    position:"relative",
    marginRight:"10%",
    marginLeft:"10%",
    marginTop: "2%",
    marginBottom:"2%",
    backgroundSize: "100% 100%",
  }
  const edit_profile_h1 = {
    fontSize : "3vw",
    textAlign : "center",
    paddingTop:"0%",
    paddingBottom:"2%",

  }

  const edit_profile_entry = {
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
  const edit_profile_submit = {
    cursor: "pointer",
    textAlign: "center",
    fontSize: "20px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#0275d8",
    color: "white",
  }

  const edit_profile_cancel = {
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

  if (!isLoaded) return "Loading...";

  {if (sessionId === props?.volunteer?.userId) {
    return(
      <div style={edit_profile_background}>
        <form onSubmit={submitData}>
          <h2>Edit your profile</h2>
          <p style={label_style}>Name:</p>
          <input
            autoFocus
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Name"
            value={name}
            style={edit_profile_entry}
          />
          <p style={label_style}>Address:</p>
          <PlacesAutocomplete
            value={address}
            onChange={setAddress}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps }) => (
              <div>
                <input {...getInputProps({ placeholder: "Type address" })} style={edit_profile_entry}/>

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
          <p style={label_style}>How many miles you are willing to drive to pick up a bike:</p>
          <input
            autoFocus
            onChange={(e) => setRadius(e.target.value)}
            placeholder="Radius (miles)"
            type="number"
            value={radius}
            style={edit_profile_entry}
          />
          <p style={label_style}>Phone Number:</p>
          <input
            autoFocus
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
            type="text"
            value={phone}
            style={edit_profile_entry}
          />
          <Multiselect
            displayValue="title"
            onRemove={onRemove}
            onSelect={onSelect}
            options={options}
            showCheckbox
            placeholder="Please select the locations you will be donating to"
            selectedValues={preselected}
            style={multiselect}
          />

          <input style = {edit_profile_submit} disabled={!name || !address || !selected} type="submit" value="Update" />
          <a style = {edit_profile_cancel} className="back" href="#" onClick={() => Router.push(`/profile/${props.volunteer.userId}`)}>
            or Cancel
          </a>
        </form>
      </div>
    )
  } else {
    return(
      <div>
        <h2>Sorry this is not your account</h2>
      </div>
    )
  }
  }

}

export default Edit;

