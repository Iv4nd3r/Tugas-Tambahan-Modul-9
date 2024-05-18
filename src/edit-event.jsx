import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const EditEvent = () => {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [numberOfTickets, setNumberOfTickets] = useState("");
  const [venue, setVenue] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [time, setTime] = useState("");
  const [ticketPrices, setTicketPrices] = useState("");
  const [numberOfAvailableTickets, setNumberOfAvailableTickets] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:3000/data/${id}`)
      .then((response) => {
        const event = response.data.events[0];
        setTitle(event.title);
        setDescription(event.description);
        const [eventDate, eventTime] = event.date.split("T");
        setDate(eventDate);
        setTime(eventTime);
        setTime(event.time);
        setNumberOfTickets(Number(event.numberoftickets));
        setNumberOfAvailableTickets(event.numberofavailabletickets);
        setVenue(event.venue);
        setOrganizer(event.organizer);
        setTicketPrices(Number(event.ticketprices));
      })
      .catch((error) => {
        console.error("Error fetching event data:", error);
      });
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const eventData = {
      title,
      description,
      date: `${date}T${time}`,
      numberOfTickets,
      numberOfAvailableTickets,
      ticketPrices,
      venue,
      organizer,
    };

    await axios
      .put(`http://localhost:3000/data/${id}`, eventData)
      .then((response) => {
        console.log(response.data);
        alert(response.data);
        window.location.href = "/"; // Redirect to the startup page
      })
      .catch((error) => {
        console.error("Error updating event:", error);
        alert("Failed to update event");
      });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4">
      <label className="flex flex-col">
        Title
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 p-2 border rounded"
          required
        />
      </label>
      <label className="flex flex-col">
        Description
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 p-2 border rounded"
          required
        />
      </label>
      <label className="flex flex-col">
        Date
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 p-2 border rounded"
          required
        />
      </label>
      <label className="flex flex-col">
        Time
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="mt-1 p-2 border rounded"
          required
        />
      </label>
      <label className="flex flex-col">
        Number of tickets
        <input
          type="number"
          value={numberOfTickets}
          onChange={(e) => setNumberOfTickets(e.target.value)}
          className="mt-1 p-2 border rounded"
          required
        />
      </label>
      <label className="flex flex-col">
        Ticket prices
        <input
          type="number"
          value={ticketPrices}
          onChange={(e) => setTicketPrices(e.target.value)}
          className="mt-1 p-2 border rounded"
          required
        />
      </label>
      <label className="flex flex-col">
        Venue
        <input
          type="text"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          className="mt-1 p-2 border rounded"
          required
        />
      </label>
      <label className="flex flex-col">
        Organizer
        <input
          type="text"
          value={organizer}
          onChange={(e) => setOrganizer(e.target.value)}
          className="mt-1 p-2 border rounded"
          required
        />
      </label>
      <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">
        Edit event
      </button>
    </form>
  );
};

export default EditEvent;
