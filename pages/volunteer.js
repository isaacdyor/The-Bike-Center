import React, { useState } from 'react';
import Router from 'next/router';
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from 'react-places-autocomplete'
import Script from "next/script";

const Volunteer = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [radius, setRadius] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const submitData = async (e) => {
    e.preventDefault();
    try {
      const body = { name, address, radius, phone, notes };
      const response = await fetch('/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json()
      console.log(data)
      await Router.push('/map');
    } catch (error) {
      console.error(error);
    }
  };
  return(
    <div>
      <form onSubmit={submitData}>
        <h1>Become a Volunteer</h1>
        <input
          autoFocus
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          type="text"
          value={name}
        />
        <PlacesAutocomplete
          value={address}
          onChange={setAddress}
          // onSelect={handleSelect}
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
        <input disabled={!name || !address} type="submit" value="Create" />
        <a className="back" href="#" onClick={() => Router.push('/')}>
          or Cancel
        </a>
      </form>
      <Script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBMePTwqFO2xPCaxUYqq0Vq4JQc631jo0o&libraries=places"
        strategy="beforeInteractive"
      ></Script>
    </div>
  )
}

export default Volunteer;

