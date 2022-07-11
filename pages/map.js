import React, {useState, useRef} from 'react';
import {GoogleMap, useLoadScript, Marker, InfoWindow,} from "@react-google-maps/api";
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from 'react-places-autocomplete'

import Script from "next/script";
import prisma from "../lib/prisma";

import { FaLocationArrow } from 'react-icons/fa';

const libraries = ['places']

export const getServerSideProps = async () => {
  const locations = await prisma.location.findMany();
  return { props: { locations } };
}

const App = ({ locations }) => {

  const [center, setCenter] = useState({
    lat: 47.606209,
    lng: -122.332069,
  });

  const [address, setAddress] = useState("");

  const [coords, setCoords] = useState([]);

  const [mapRef, setMapRef] = useState(null);

  const [selected, setSelected] = useState(null);

  const mapRef2 = useRef();

  const options = {
    disableDefaultUI: true,
    zoomControl: true,
  }

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
    libraries,
  })

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setAddress(value);
    setCenter(latLng);
  };

  const convertAddress = async (value) => {
    const results = await geocodeByAddress(value.address);
    const latLng = await getLatLng(results[0]);
    const locationData = {
      title: value.title,
      address: value.address,
      website: value.website,
      phone: value.phone,
      lat: latLng.lat,
      lng: latLng.lng
    }
    setCoords(coords => [...coords, locationData])
  };

  const onCenterChanged = () => {
    if (mapRef) {
      const newCenter = mapRef.getCenter();
      console.log(newCenter);
      setCenter({
        lat: mapRef.getCenter().lat(),
        lng: mapRef.getCenter().lng()
      })
    }
  }



  const onMapLoad = (map) => {
    mapRef2.current = map
    setMapRef(map);
    {locations.map(location => {
      convertAddress(location)
    })}
  }

  const panTo = React.useCallback(({lat, lng}) => {
    mapRef2.current.panTo({lat, lng});
  }, [])

  if (!isLoaded) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    )
  }

  if (isLoaded) {
    return(
      <div>
        <GoogleMap
          zoom={9}
          center={{lat: center.lat, lng: center.lng}}
          mapContainerClassName='map-container'
          options={options}
          onLoad={onMapLoad}
          // onBoundsChanged={onCenterChanged}
        >
          {coords.map(coord => {
            return(
              <Marker
                key={coord.lat}
                position={{ lat: parseFloat(coord.lat), lng: parseFloat(coord.lng) }}
                onClick={() => {
                  onCenterChanged()
                  setSelected(coord);
                }}
              />
            )
          })}
          {selected ? (
            <InfoWindow
              position={{ lat: selected.lat, lng: selected.lng }}
              onCloseClick={() => {
                setSelected(null);
              }}
            >
              <div>
                <h2>
                  {selected.title}
                </h2>
                <p>{selected.address}</p>
              </div>
            </InfoWindow>
          ) : null
          }

        </GoogleMap>

        <div className="input-container">


          <PlacesAutocomplete
            value={address}
            onChange={setAddress}
            onSelect={handleSelect}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps }) => (
              <div className="search">
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
          <button
            className="locate"
            onClick={() => {
              setAddress('')
              navigator.geolocation.getCurrentPosition((position) => {
                panTo({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                })
                setCenter({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                })
              }, () => null);
            }}><FaLocationArrow /></button>

        </div>

        <Script
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBMePTwqFO2xPCaxUYqq0Vq4JQc631jo0o&libraries=places"
          strategy="beforeInteractive"
        ></Script>
      </div>
    )
  }
}


export default App;