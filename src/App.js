import CitySearch from "./components/CitySearch";
import EventList from "./components/EventList";
import NumberOfEvents from "./components/NumberOfEvents";

import { useEffect, useState } from "react";
import { extractLocations, getEvents } from "./api";

import './App.css';


const App = () => {

  const [events, setEvents] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState("See all cities");

  useEffect(() => {
    fetchData();
  }, [currentCity]);

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


  return (
    <div className="App">
      <NumberOfEvents />
      <CitySearch allLocations={allLocations} setCurrentCity={setCurrentCity} />
      <EventList events={events} />
    </div>
  );
};

export default App;