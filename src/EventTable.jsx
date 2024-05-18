import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const EventTable = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

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

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (a[sortField] < b[sortField]) {
      return sortDirection === "asc" ? -1 : 1;
    }
    if (a[sortField] > b[sortField]) {
      return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (field) => {
    setSortField(field);
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

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
            <th className="px-4 py-2" onClick={() => handleSort("title")}>
              Title
            </th>
            <th className="px-4 py-2" onClick={() => handleSort("description")}>
              Description
            </th>
            <th className="px-4 py-2" onClick={() => handleSort("date")}>
              Date
            </th>
            <th
              className="px-4 py-2"
              onClick={() => handleSort("numberoftickets")}
            >
              Total Number of Tickets
            </th>
            <th
              className="px-4 py-2"
              onClick={() => handleSort("numberofavailabletickets")}
            >
              Number of Tickets Available
            </th>
            <th
              className="px-4 py-2"
              onClick={() => handleSort("ticketprices")}
            >
              Ticket Prices
            </th>
            <th className="px-4 py-2" onClick={() => handleSort("venue")}>
              Venue
            </th>
            <th className="px-4 py-2" onClick={() => handleSort("organizer")}>
              Organizer
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedEvents.map((event) => (
            <tr key={event.id}>
              <td className="border px-4 py-2">{event.title}</td>
              <td className="border px-4 py-2">{event.description}</td>
              <td className="border px-4 py-2">
                {new Date(event.date).toLocaleString()}
              </td>
              <td className="border px-4 py-2">{event.numberoftickets}</td>
              <td className="border px-4 py-2">
                {event.numberofavailabletickets}
              </td>
              <td className="border px-4 py-2">{event.ticketprices}</td>
              <td className="border px-4 py-2">{event.venue}</td>
              <td className="border px-4 py-2">{event.organizer}</td>
              <td>
                <Link to={`/reserve/${event.id}`}>{`Reserve Event`}</Link>
              </td>
              <td>
                <Link to={`/edit-event/${event.id}`}>Edit Event</Link>
              </td>
              <td>
                <Link to="#" onClick={() => handleDelete(event.id)}>
                  Delete Event
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const handleDelete = async (id) => {
  if (window.confirm("Are you sure you want to delete this event?")) {
    try {
      const response = await axios.delete(`http://localhost:3000/data/${id}`);
      if (response.status === 200) {
        alert("Event deleted successfully");
        window.location.reload(); // Refresh the page
      } else {
        alert("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event");
    }
  }
};

export default EventTable;
