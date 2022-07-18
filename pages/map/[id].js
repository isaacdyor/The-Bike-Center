import React from "react";
import prisma from "../../lib/prisma";
import {useRef, useState} from "react";
import {Circle, GoogleMap, InfoWindow, Marker, useLoadScript} from "@react-google-maps/api";
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from "react-places-autocomplete";
import Link from "next/link";
import {FaLocationArrow} from "react-icons/fa";

const libraries = ["places"];

export const getServerSideProps = async ({params}) => {
  const location = await prisma.location.findUnique({
    where: {
      id: String(params?.id)
    },
    include: {
      volunteers: true,
    },
    }
  );
  return { props: { location } };
}

const containerStyle = {
  width: '70%',
  height: '100%',
};

const App = ({ location }) => {
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
  };

  const convertVolunteer = async (value) => {
    const results = await geocodeByAddress(value.address);
    const latLng = await getLatLng(results[0]);
    const volunteerData = {
      name: value.name,
      address: value.address,
      radius: value.radius,
      phone: value.phone,
      notes: value.notes,
      lat: latLng.lat,
      lng: latLng.lng
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
      lng: latLng.lng
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
    convertLocation(location)
    {location.volunteers.map(volunteer => {
      convertVolunteer(volunteer)
    })}
  }

  const panTo = React.useCallback(({lat, lng}) => {
    mapRef2.current.panTo({lat, lng});
    mapRef2.current.setZoom(11.5);
  }, [])

  if (!isLoaded) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    )
  }

  if (isLoaded) {
    console.log(coords)
    return(
      <div>
        <div id="sidebar" className="panel">
          <div id="content">
            <h2>
              {location.title}
            </h2>
            <p>{location.address}</p>
            <p>{location.phone}</p>
            <a href={location.website}>{location.website}</a>
          </div>
        </div>

        <div className="map-container">
          <GoogleMap
            zoom={9}
            center={{lat: center.lat, lng: center.lng}}
            mapContainerStyle={containerStyle}
            options={options}
            onLoad={onMapLoad}
          >
            {coords.map(coord => {
              return(
                <Marker
                  key={coord.lat}
                  position={{ lat: parseFloat(coord.lat), lng: parseFloat(coord.lng) }}
                  onClick={() => {
                    onCenterChanged()
                    setSelected(coord);
                    setVolSelected(null);
                  }}
                  icon={{
                    url: '/building-solid.svg',
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(15, 15),
                    scaledSize: new window.google.maps.Size(30, 30),
                  }}
                />
              )
            })}

            {volCoords.map(volCoord => {
              return(
                <Marker
                  key={volCoord.lat}
                  position={{ lat: parseFloat(volCoord.lat), lng: parseFloat(volCoord.lng) }}
                  onClick={() => {
                    onCenterChanged()
                    setVolSelected(volCoord);
                    setSelected(null)
                  }}
                  icon={{
                    url: '/user-solid.svg',
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(15, 15),
                    scaledSize: new window.google.maps.Size(30, 30),
                  }}
                />
              )
            })}
            {selected ? (
              <InfoWindow
                position={{ lat: selected.lat, lng: selected.lng }}
                onCloseClick={() => {
                  setSelected(null);
                  onCenterChanged();
                }}
              >
                <div>
                  <h2>{selected.title}</h2>
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
                    onCenterChanged();
                  }}
                >
                  <div>
                    <h2>
                      <Link href={`/profile/${selected.userId}`}><a>{volSelected.name}</a></Link>
                    </h2>
                    <p>{volSelected.address}</p>
                    <p>{volSelected.phone}</p>
                    <p>{volSelected.notes}</p>
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

        <div className="input-container2">
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
      </div>
    )
  }
}

export default App;
