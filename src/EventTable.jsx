import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const EventTable = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    axios.get("http://localhost:3000/data").then((response) => {
      setEvents(response.data.events);
    });
  }, []);

  const filteredEvents = Array.isArray(events)
    ? events.filter((event) => {
        if (filter === "upcoming") {
          return new Date(event.date) > new Date();
        }
        return true;
      })
    : [];

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-8">
        Welcome to the Event Ticketing App
      </h1>
      <Link to="/create-event">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
          Create New Events
        </button>
      </Link>
      <Link to="/scan-ticket">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
          Scan Event Ticket
        </button>
      </Link>
      <select className="mb-4" onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All events</option>
        <option value="upcoming">Upcoming events</option>
      </select>
      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Number of Tickets</th>
            <th className="px-4 py-2">Venue</th>
            <th className="px-4 py-2">Organizer</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents.map((event) => (
            <tr key={event.id}>
              <td className="border px-4 py-2">{event.title}</td>
              <td className="border px-4 py-2">{event.description}</td>
              <td className="border px-4 py-2">
                {new Date(event.date).toLocaleString()}
              </td>
              <td className="border px-4 py-2">{event.numberoftickets}</td>
              <td className="border px-4 py-2">{event.venue}</td>
              <td className="border px-4 py-2">{event.organizer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;
