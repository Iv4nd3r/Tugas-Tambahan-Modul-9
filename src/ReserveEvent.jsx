import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import axios from "axios";
import { useState, useEffect } from "react";

const ReserveEvent = () => {
  const { id } = useParams(); // Get the event ID from the URL
  const [qrCode, setQrCode] = useState(null);
  const [reservationStatus, setReservationStatus] = useState(null);

  useEffect(() => {
    // Generate a unique order ID
    const orderId = uuidv4();

    // Make a request to the server to reserve the event
    axios
      .post(`http://localhost:3000/reserve/${id}`, { orderId })
      .then((response) => {
        if (response.data.success) {
          // If the reservation was successful, generate a QR code
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
  }, [id]);

  return (
    <div>
      {reservationStatus}
      {qrCode && <img src={qrCode} alt="QR Code" />}
    </div>
  );
};

export default ReserveEvent;
