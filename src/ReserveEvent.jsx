import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import axios from "axios";
import { useEffect, useState } from "react";

const ReserveEvent = () => {
  const { id } = useParams(); // Get the event ID from the URL
  const [qrCode, setQrCode] = useState(null);
  const [reservationStatus, setReservationStatus] = useState(null);
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    try {
      axios
        .get(`http://localhost:3000/data/${id}`)
        .then((response) => {
          const eventData = response.data.events[0];
          setEventData(eventData);
        })
        .catch((error) => {
          console.error(error);
          setReservationStatus("Failed to get event data.");
        });
    } catch (error) {
      console.error(error);
      setReservationStatus("Failed to get event data.");
    }
  }, [id]);

  const handleReservation = () => {
    const orderId = uuidv4(); // Generate a unique order ID

    if (eventData && eventData.numberofavailabletickets > 0) {
      const updatedNumberOfAvailableTickets =
        eventData.numberofavailabletickets - 1;
      const updatedEventData = {
        ...eventData,
        numberOfAvailableTickets: updatedNumberOfAvailableTickets,
      };
      console.log(eventData);
      console.log(updatedEventData);

      try {
        axios
          .put(`http://localhost:3000/data/${id}`, updatedEventData)
          .then((response) => {
            console.log(response);
            axios
              .post(`http://localhost:3000/reserve/${id}`, {
                orderId,
                status:
                  eventData.ticketPrice > 0
                    ? "Waiting for payment"
                    : "Reservation successful",
              })
              .then((response) => {
                if (response.data.success) {
                  const qrData = {
                    orderId,
                    eventId: id,
                    nonceId: uuidv4(),
                  };

                  QRCode.toDataURL(JSON.stringify(qrData))
                    .then((url) => {
                      setQrCode(url);
                      setReservationStatus("Reservation successful!");
                    })
                    .catch((err) => {
                      console.error(err);
                      setReservationStatus("Failed to generate QR code.");
                    });
                } else {
                  setReservationStatus("Reservation failed.");
                }
              })
              .catch((error) => {
                console.error(error);
                setReservationStatus("Reservation failed.");
              });
          })
          .catch((error) => {
            console.error(error);
            setReservationStatus(
              "Failed to update the number of available tickets."
            );
          });
      } catch (error) {
        console.error(error);
        setReservationStatus(
          "Failed to update the number of available tickets."
        );
      }
    } else {
      setReservationStatus("No more tickets available.");
    }
  };

  return (
    <div className="p-6">
      {reservationStatus}
      {qrCode && <img src={qrCode} alt="QR Code" />}
      <div className="mt-6">
        <h2 className="text-2xl font-bold">
          {eventData?.title || "Loading..."}
        </h2>
        <p className="mt-2">{eventData?.description || "Loading..."}</p>
        <p className="mt-2">
          Date:{" "}
          {eventData?.date
            ? new Date(eventData.date).toLocaleDateString()
            : "Loading..."}
        </p>
        <p className="mt-2">
          Number of available tickets:{" "}
          {eventData?.numberOfAvailableTickets || "Loading..."}
        </p>
        <p className="mt-2">
          Ticket price: {eventData?.ticketPrice || "Loading..."}
        </p>
        <p className="mt-2">Venue: {eventData?.venue || "Loading..."}</p>
        <p className="mt-2">
          Organizer: {eventData?.organizer || "Loading..."}
        </p>
        <button
          onClick={handleReservation}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Confirm Reservation
        </button>
      </div>
    </div>
  );
};

export default ReserveEvent;
