import { useEffect, useState } from "react";
import axios from "axios";

const EditEvent = ({ match }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [numberOfTickets, setNumberOfTickets] = useState("");
  const [venue, setVenue] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [time, setTime] = useState("");
  const [ticketPrices, setTicketPrices] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:3000/data/${match.params.id}`)
      .then((response) => {
        const event = response.data.events[0];
        setTitle(event.title);
        setDescription(event.description);
        setDate(new Date(event.date).toISOString().split("T")[0]);
        setTime(event.time);
        setNumberOfTickets(event.numberOfTickets);
        setVenue(event.venue);
        setOrganizer(event.organizer);
        setTicketPrices(event.ticketPrices);
      })
      .catch((error) => {
        console.error("Error fetching event data:", error);
      });
  }, [match.params.id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const dateTime = new Date(`${date}T${time}`);
    const eventData = {
      title,
      description,
      date: dateTime.toISOString(),
      time,
      numberOfTickets,
      ticketPrices,
      venue,
      organizer,
    };

    await axios
      .put(`http://localhost:3000/data/${match.params.id}`, eventData)
      .then((response) => {
        alert("Event updated successfully");
        window.location.href = "/"; // Redirect to the startup page
      })
      .catch((error) => {
        console.error("Error updating event:", error);
        alert("Failed to update event");
      });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4">
      {/* Include the form fields here, similar to create-event.jsx */}
    </form>
  );
};

export default EditEvent;
