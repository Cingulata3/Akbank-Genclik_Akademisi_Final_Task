import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useState } from "react";
import ReactMapGL, {
  Marker,
  NavigationControl,
  Source,
  Layer,
} from "react-map-gl";
import axios from "axios";
import "./App.css";
import atmData from "./data/atmData.json";
//import LoadingScreen from "./components/LoadingScreen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faPerson } from "@fortawesome/free-solid-svg-icons";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";

const TOKEN = process.env.REACT_APP_TOKEN;

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  //calculate the difference in latitude and longitude between the two points, converted from degrees to radians.
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  //calculate the square of half the chord length between the points
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); //angular distance in radians
  return R * c; //distance in kilometers
}

function App() {
  const [viewport, setViewport] = useState({
    latitude: 39.9334, //default
    longitude: 32.8597, //default
    zoom: 7,
    bearing: 0,
    pitch: 0,
    transitionDuration: 0,
  });

  const [userLocation, setUserLocation] = useState(null);
  //const [loading, setLoading] = useState(true);
  const [nearestATMs, setNearestATMs] = useState([]);
  const [recommendedATMs, setRecommendedATMs] = useState(null);
  const [route, setRoute] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setViewport((prevViewport) => ({
          ...prevViewport,
          latitude,
          longitude,
          zoom: 12,
          transitionDuration: 2300,
        }));
        //setLoading(false);
      },
      (error) => {
        console.error("Error getting user location:", error);
        //setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (userLocation) {
      const distances = atmData.map((atm) => {
        const distance = haversineDistance(
          userLocation.latitude,
          userLocation.longitude,
          atm.latitude,
          atm.longitude
        );
        return { atmId: atm.atmId, distance }; //: Math.round(distance)
      });

      distances.sort((a, b) => a.distance - b.distance);
      const nearestATMs = distances.slice(0, 10); //15-20
      setNearestATMs(nearestATMs);

      // Create CSV content
      const csvContent = [
        ["ATM ID", "Distance"],
        ...nearestATMs.map((atm) => [atm.atmId, atm.distance]),
      ]
        .map((e) => e.join(","))
        .join("\n");

      // Send CSV to endpoint using axios
      axios
        .post("/nearest-atms", csvContent, {
          headers: {
            "Content-Type": "text/csv",
          },
        })
        .then((response) => {
          console.log("Response from server:", response.data);

          const recommendedATMs = response.data.filter(
            (atm) => atm.Recommendation === 1
          );

          const recommendedAtmDetails = recommendedATMs
            .map((recAtm) => {
              const atmDetail = atmData.find(
                (atm) => atm.atmId === recAtm.atmId
              );
              if (!atmDetail) {
                console.warn(`ATM ID ${recAtm.atmId} not found in atmData`);
              }
              return atmDetail
                ? {
                    ...atmDetail,
                    Recommendation: recAtm.Recommendation,
                    Rating: recAtm.Rating,
                    Currency: recAtm.Currency,
                    distance: nearestATMs.find(
                      (atm) => atm.atmId === recAtm.atmId
                    )?.distance,
                  }
                : null;
            })
            .filter((atm) => atm !== null);
          console.log("Detailed recommended ATMs:", recommendedAtmDetails);
          setRecommendedATMs(recommendedAtmDetails);
        })

        .catch((error) => console.error("Error:", error));
    }
  }, [userLocation]);

  const getRoute = async (userLocation, atmLocation) => {
    const query = `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation.longitude},${userLocation.latitude};${atmLocation.longitude},${atmLocation.latitude}?steps=true&geometries=geojson&access_token=${TOKEN}`;
    const response = await axios.get(query);
    const data = response.data.routes[0];
    const route = data.geometry.coordinates;
    const geojson = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: route,
      },
    };
    return geojson;
  };

  useEffect(() => {
    if (userLocation && recommendedATMs && recommendedATMs.length > 0) {
      const nearestRecommendedATM = recommendedATMs[0];
      getRoute(userLocation, nearestRecommendedATM).then(setRoute);
    }
  }, [userLocation, recommendedATMs]);

  /*
  if (loading) {
    return <LoadingScreen />;
  }
*/

  const showRecommendedATMs = () => {
    if (!recommendedATMs) return null;
    return recommendedATMs.map((atm) => (
      <li key={atm.atmId}>
        <strong>{atm.name}</strong>
        <br />
        {atm.address}
        <br />
        <strong>Mesafe:</strong>{" "}
        {atm.distance ? atm.distance.toFixed(2) : "N/A"} km
        <br />
        <strong>Kullanıcı puanı:</strong> {atm.Rating}
        <br />
        <strong>Döviz Çekilebilir mi?:</strong>{" "}
        {atm.Currency ? "Evet" : "Hayır"}
      </li>
    ));
  };

  return (
    <div className="map-container">
      <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        mapboxAccessToken={TOKEN}
        transitionDuration="200"
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onMove={(evt) => setViewport(evt.viewState)}
      >
        <NavigationControl position="top-left" />
        {userLocation && (
          <Marker
            latitude={userLocation.latitude}
            longitude={userLocation.longitude}
          >
            <FontAwesomeIcon
              icon={faPerson}
              style={{ color: "blue", fontSize: "30px" }}
            />
          </Marker>
        )}
        {atmData.map((atm) => (
          <Marker
            key={atm.atmId}
            latitude={atm.latitude}
            longitude={atm.longitude}
          >
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              style={{ color: "red", fontSize: "24px" }}
            />
          </Marker>
        ))}
        {recommendedATMs &&
          recommendedATMs.map((atm) => (
            <Marker
              key={atm.atmId}
              latitude={atm.latitude}
              longitude={atm.longitude}
            >
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                style={{ color: "green", fontSize: "24px" }}
              />
            </Marker>
          ))}
        {route && (
          <Source id="route" type="geojson" data={route}>
            <Layer
              id="route"
              type="line"
              source="route"
              layout={{
                "line-join": "round",
                "line-cap": "round",
              }}
              paint={{
                "line-color": "#1da1f2",
                "line-width": 7,
              }}
            />
          </Source>
        )}
      </ReactMapGL>
      <div className="recommended-atms-list">
        <h3>Önerilen ATMler</h3>
        <ul>{showRecommendedATMs()}</ul>
      </div>
    </div>
  );
}

export default App;
