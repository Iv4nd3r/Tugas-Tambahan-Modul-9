import { useState } from "react";
import { v4 as uuidv4 } from "uuid"; // Import the v4 function from the uuid package
import axios from "axios";

const CreateEvent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [numberOfTickets, setNumberOfTickets] = useState("");
  const [venue, setVenue] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [time, setTime] = useState("");
  const [ticketPrices, setTicketPrices] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const eventData = {
      title,
      description,
      date: `${date}T${time}`,
      time,
      numberOfTickets,
      numberOfAvailableTickets: numberOfTickets, // Initialize the number of available tickets to the total number of tickets
      ticketPrices,
      venue,
      organizer,
    };

    const nonceId = generateNonceId(); // Generate a random NONCE ID
    await axios
      .post("http://localhost:3000/data", {
        ...eventData,
        nonceId,
      })
      .then((response) => {
        alert(response.data);
        window.location.href = "/"; // Redirect to the startup page
      })
      .catch((error) => {
        console.log(error);
        alert("Failed to create event");
      });
  };

  const generateNonceId = () => {
    return uuidv4(); // Use the v4 function to generate a random NONCE ID
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
        Create event
      </button>
    </form>
  );
};

export default CreateEvent;
