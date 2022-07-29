import React from "react";
import prisma from "../../lib/prisma";
import Multiselect from "multiselect-react-dropdown";
import Router from "next/router";
import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import Link from "next/link";
import PlacesAutocomplete from "react-places-autocomplete";
import {useLoadScript} from "@react-google-maps/api";
const libraries = ['places']
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const getServerSideProps = async ({params}) => {
  const volunteer = await prisma.volunteer.findUnique({
    where: {
      userId: String(params?.id),
    },
    include: {
      locations: true,
      user: true,
    },
  })
  return {
    props: {volunteer},
  };
}

const Transport = ({volunteer}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [bikes, setBikes] = useState('');
  const [notes, setNotes] = useState('');
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState([])
  const [preSelected, setPreSelected] = useState([])
  const [id, setId] = useState(volunteer.userId)
  const [volEmail, setVolEmail] = useState(volunteer.user.email)
  const { data: session } = useSession();

  useEffect(() => {
    volunteer.locations.map(prop => {
      const optionData = {
        id: prop.id,
        title: prop.title,
        address: prop.address,
        website: prop.website,
        phone: prop.phone,
      }
      setOptions(options => [...options, optionData])
    })
    if (volunteer.locations.length === 1) {
      const preSelectedData = {
        id: volunteer.locations[0].id,
        title: volunteer.locations[0].title,
        address: volunteer.locations[0].address,
        website: volunteer.locations[0].website,
        phone: volunteer.locations[0].phone,
      }
      setPreSelected(preSelected => [...preSelected, preSelectedData])
      setSelected(selected => [...selected, preSelectedData])
    }
  }, []);

  const onSelect = (e) => {
    setSelected(e)
  }

  const onRemove = (e) => {
    setSelected(e)
  }
  const sendMail = async () => {


  }

  const submitData = async (e) => {
    e.preventDefault();
    try {
      const body = { name, email, address, phone, bikes, notes, selected, id };
      const response = await fetch('/api/assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json()
      await Router.push('/');
    } catch (error) {
      console.error(error);
    }
    try {
      const body = { name, email, address, phone, bikes, notes, selected, volEmail };
      await fetch("/api/email", {
        "method": "POST",
        "headers": { "content-type": "application/json" },
        "body": JSON.stringify(body)
      })
    } catch (error) {
      console.log(error)
    }
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
    libraries
  })

  //styling
  const transport_background = {
    textAlign: "center",
    position:"relative",
    marginRight:"10%",
    marginLeft:"10%",
    marginTop: "2%",
    marginBottom:"2%",
    backgroundSize: "100% 100%",
  }
  const transport_h1 = {
    fontSize : "3vw",
    textAlign : "center",
    paddingTop:"0%",
    paddingBottom:"2%",

  }

  const transport_entry = {
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
  const transport_submit = {
    cursor: "pointer",
    color : "Black",
    fontSize : "1.5vw",
    border : "none",
    borderRadius : "30px",
    marginBottom: "0%",
    marginTop: "0%",
    // marginRight : "3%",
    fontWeight : "bolder",
    width: "10vw",
  }

  const transport_cancel = {
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

  if (!isLoaded) return "Loading...";

  return(
    <div style = {transport_background}>
      <h1 style={transport_h1}>Request a pickup from {volunteer.name}</h1>

      <form onSubmit={submitData}>
        <input
          autoFocus
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          type="text"
          value={name}
          style =  {transport_entry}
        />
        <br/>
        <input
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="text"
          value={email}
          style =  {transport_entry}
        />
        <br/>

        <PlacesAutocomplete
          value={address}
          onChange={setAddress}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps }) => (
            <div>
              <input style =  {transport_entry} {...getInputProps({ placeholder: "Address" })} />

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
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          type="text"
          value={phone}
          style =  {transport_entry}
        />
        <input
          onChange={(e) => setBikes(e.target.value)}
          placeholder="Number of bikes being donated"
          type="number"
          value={bikes}
          style =  {transport_entry}
        />
        <Multiselect
          displayValue="title"
          onRemove={onRemove}
          onSelect={onSelect}
          options={options}
          showCheckbox
          placeholder="Location you want to donate to"
          selectionLimit={1}
          selectedValues={preSelected}
          style =  {multiselect}
        />
        <br/>
        <textarea
          cols={50}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes"
          rows={8}
          value={notes}
          style =  {transport_entry}
        />

        <br/>

        <p>If you are donating to bike works you can fill out <Link href="https://bikeworks.org/donate/used-bicycle/#receipt"><a> this form</a></Link> for a tax receipt</p>


        <input disabled={!name || !email || !address || !bikes} type="submit" value="Submit" style = {transport_submit}/>
        <a className="back" href="#" onClick={() => Router.push('/')} style = {transport_cancel}>
          or Cancel
        </a>
      </form>
    </div>
  )
}

export default Transport;

