import React, {useState, useRef} from 'react';
import {GoogleMap, useLoadScript, Marker, InfoWindow, Circle, } from "@react-google-maps/api";
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from 'react-places-autocomplete'
import prisma from "../../lib/prisma";
import Link from 'next/link'

import { FaLocationArrow } from 'react-icons/fa';
import Router from "next/router";
import Button from "react-bootstrap/Button";
const libraries = ["places"];

import Image from 'next/image'
import locationIcon from '../../public/location-icon.png'
import three from "../../public/themcropped.jpg";
import Card from "react-bootstrap/Card";

export const getServerSideProps = async () => {
  const locations = await prisma.location.findMany({

  });
  const volunteers = await prisma.volunteer.findMany({
    where: {
      approved: true,
    },
    include: {
      donations: true,
    },
  });
  return { props: { locations, volunteers } };
}

const containerStyle = {
  position: 'relative',
  width: '100%',
  height: '100%',
};

const App = ({ locations, volunteers }) => {
  const [center, setCenter] = useState({
    lat: 47.606209,
    lng: -122.332069,
  });

  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState([]);
  const [volCoords, setVolCoords] = useState([]);
  const [mapRef, setMapRef] = useState(null);
  const [selected, setSelected] = useState(null);
  const [volSelected, setVolSelected] = useState(null);
  const [bikes, setBikes] = useState(0)
  const [hours, setHours] = useState(0)
  const [locationChecked, setLocationChecked] = useState(true)
  const [volunteerChecked, setVolunteerChecked] = useState(true)
  const mapRef2 = useRef();

  const options = {
    disableDefaultUI: true,
    zoomControl: true,
  }

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
    libraries
  })

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setAddress(value);
    setCenter(latLng);
    mapRef2.current.setZoom(11.5)
  };

  const convertVolunteer = async (value) => {
    const results = await geocodeByAddress(value.address);
    const latLng = await getLatLng(results[0]);
    const volunteerData = {
      name: value.name,
      userId: value.userId,
      address: value.address,
      radius: value.radius,
      phone: value.phone,
      notes: value.notes,
      lat: latLng.lat,
      lng: latLng.lng,
      donations: value.donations,
    }
    setVolCoords(volCoords => [...volCoords, volunteerData])
  };

  const convertLocation = async (value) => {
    const results = await geocodeByAddress(value.address);
    const latLng = await getLatLng(results[0]);
    const locationData = {
      id: value.id,
      title: value.title,
      address: value.address,
      website: value.website,
      phone: value.phone,
      lat: latLng.lat,
      lng: latLng.lng,
    }
    setCoords(coords => [...coords, locationData])
  };

  const onCenterChanged = () => {
    if (mapRef) {
      const newCenter = mapRef.getCenter();
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
      convertLocation(location)
    })}
    {volunteers.map(volunteer => {
      convertVolunteer(volunteer)
    })}
  }
  const panTo = React.useCallback(({lat, lng}) => {
    mapRef2.current.panTo({lat, lng});
    mapRef2.current.setZoom(11.5);
  }, [])

  const button_style = {
    textAlign: "center",
    fontSize: "15px",
    border: "none",
    borderRadius: "5px",
  }

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
        <div className="map-container col-lg-12">
          <GoogleMap
            zoom={10}
            center={{lat: center.lat, lng: center.lng}}
            mapContainerStyle={containerStyle}
            options={options}
            onLoad={onMapLoad}
          >
            {locationChecked &&
              <div>
                {coords.map(coord => {
                  return(
                    <Marker
                      key={coord.lat}
                      position={{ lat: parseFloat(coord.lat), lng: parseFloat(coord.lng) }}
                      onClick={() => {
                        onCenterChanged()
                        setSelected(coord);
                        setVolSelected(null);
                        console.log(selected)
                      }}
                      icon={{
                        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                        origin: new window.google.maps.Point(0, 0),
                        anchor: new window.google.maps.Point(10, 34),
                        scaledSize: new window.google.maps.Size(40, 40),
                      }}
                    />
                  )
                })}
              </div>
            }

            {volunteerChecked &&
              <div>
                {volCoords.map(volCoord => {
                  return(
                    <Marker
                      key={volCoord.lat}
                      position={{ lat: parseFloat(volCoord.lat), lng: parseFloat(volCoord.lng) }}
                      onClick={() => {
                        onCenterChanged()
                        setVolSelected(volCoord);
                        setSelected(null)
                        setBikes(0)
                        setHours((0))
                        volCoord.donations.forEach(donation => {
                          if (donation.approved) {
                            setBikes(bikes+parseInt(donation.bikes))
                          }
                        })
                        volCoord.donations.forEach(donation => {
                          if (donation.approved) {
                            setHours(hours+parseInt(donation.hours))
                          }
                        })
                      }}
                      icon={{
                        url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                        origin: new window.google.maps.Point(0, 0),
                        anchor: new window.google.maps.Point(10, 34),
                        scaledSize: new window.google.maps.Size(40, 40),
                      }}
                    />
                  )
                })}
              </div>
            }


            {selected ? (
              <InfoWindow
                position={{ lat: selected.lat, lng: selected.lng }}
                onCloseClick={() => {
                  setSelected(null);
                  onCenterChanged()
                }}
              >
                <div>
                  <h2>
                    Location: <Link href={`/map/${selected.id}`}><a>{selected.title}</a></Link>
                  </h2>
                  <p>{selected.address}</p>
                  <p>{selected.phone}</p>
                  <a href={selected.website}>More Info</a>

                </div>
              </InfoWindow>
            ) : null
            }
            {volSelected ? (
              <div>
                <InfoWindow
                  position={{ lat: volSelected.lat, lng: volSelected.lng }}
                  onCloseClick={() => {
                    setVolSelected(null);
                    onCenterChanged()
                  }}
                >
                  <div>
                    <h2>
                      Volunteer: <Link href={`/profile/${volSelected.userId}`}><a>{volSelected.name}</a></Link>
                    </h2>
                    <p>{volSelected.notes}</p>
                    <p>{bikes} bikes donated</p>
                    <p>{hours} hours volunteered</p>
                    <Link href={`/transport/${volSelected.userId}`}><Button style={button_style} variant="primary">Request a pickup</Button></Link>
                  </div>
                </InfoWindow>
                <Circle
                  center={{ lat: volSelected.lat, lng: volSelected.lng }}
                  radius={parseFloat(volSelected.radius) * 1609.34}
                />
              </div>
            ) : null
            }
          </GoogleMap>
        </div>
        <div className="card-container">
          <Card style={{ width: '27vw' }} className="map-card">
            <Card.Body>
              <Card.Title>Key</Card.Title>

              <input
                id="location-check"
                type="checkbox"
                checked={locationChecked}
                onChange={() => {
                  setLocationChecked(!locationChecked)
                  onCenterChanged()
                }}
              />
              <label htmlFor="location-check">
                &nbsp; Drop-off Locations:
                <Image
                  src="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                  alt="blue pin"
                  width={25}
                  height={25}
                />
              </label><br/>

              <input
                type="checkbox"
                checked={volunteerChecked}
                onChange={() => {
                  setVolunteerChecked(!volunteerChecked)
                  onCenterChanged()
                }}
              />
              <label htmlFor="location-check">
                &nbsp; Volunteers:
                <Image
                  src="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                  alt="blue pin"
                  width={25}
                  height={25}
                />
              </label><br/>
            </Card.Body>
          </Card>
        </div>

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
            }}>
            <Image
              width={40}
              height={40}
              alt="location icon"
              src={locationIcon}/>
          </button>
        </div>
      </div>
    )
  }
}

export default App;