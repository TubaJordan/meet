import React from "react";
import CitySearch from "./components/CitySearch";
import EventList from "./components/EventList";
import NumberOfEvents from "./components/NumberOfEvents";

import { useEffect, useState } from "react";
import { extractLocations, getEvents } from "./api";

import { InfoAlert, ErrorAlert, WarningAlert } from "./components/Alert";

import './App.css';
import CityEventsChart from "./components/CityEventsChart";
import EventGenresChart from "./components/EventGenresChart";



const App = () => {

  const [events, setEvents] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState("See all cities");

  const [infoAlert, setInfoAlert] = useState("");
  const [errorAlert, setErrorAlert] = useState("");
  const [warningAlert, setWarningAlert] = useState("");

  const fetchData = async () => {
    const allEvents = await getEvents();

    const filteredEvents = currentCity === "See all cities" ?
      allEvents :
      allEvents.filter(event => event.location === currentCity)

    if (filteredEvents) {
      setEvents(filteredEvents.slice(0, currentNOE));
    }

    if (allEvents) {
      setAllLocations(extractLocations(allEvents));
    }

  };


  useEffect(() => {

    let infoText;

    if (navigator.onLine) {
      infoText = ""
    } else {
      infoText = "The app is currently in offline mode, please reconnect to the internet"
    }
    setWarningAlert(infoText);
    fetchData();
  }, [currentCity, currentNOE]);


  return (
    <div className="App">
      <div className="alerts-container">
        {infoAlert.length ? <InfoAlert text={infoAlert} /> : null}
        {errorAlert.length ? <ErrorAlert text={errorAlert} /> : null}
        {warningAlert.length ? <WarningAlert text={warningAlert} /> : null}
      </div>

      <div className="logo-container">
        <p className="logo">Meet App</p>
        <div className="city-events">
          <CitySearch allLocations={allLocations} setCurrentCity={setCurrentCity} setInfoAlert={setInfoAlert} className="city-search-bar" />
          <NumberOfEvents setCurrentNOE={setCurrentNOE} setErrorAlert={setErrorAlert} className="number-of-events-bar" />
        </div>
      </div>
      <div className="charts-container">

        <EventGenresChart events={events} />
        <CityEventsChart allLocations={allLocations} events={events} />

      </div>
      <EventList events={events} />

    </div>
  );
};

export default App;