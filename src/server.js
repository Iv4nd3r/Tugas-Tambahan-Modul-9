// server.js
import express from "express";
import bodyParser from "body-parser";
import pkg from "pg";
import QRCode from "qrcode";
import JSQR from "jsqr";
import dotenv from "dotenv";
import process from "process";
import cors from "cors";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(bodyParser.json());

const { Pool } = pkg;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    require: true,
  },
});

// Create
app.post("/data", async (req, res) => {
  const {
    title,
    description,
    date,
    numberOfTickets,
    numberOfAvailableTickets,
    ticketPrices,
    venue,
    organizer,
    nonceId,
  } = req.body;
  try {
    await pool.query(
      "INSERT INTO events (title, description, date, numberOfTickets, numberOfAvailableTickets, ticketPrices, venue, organizer, nonceId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      [
        title,
        description,
        date,
        numberOfTickets,
        numberOfAvailableTickets,
        ticketPrices,
        venue,
        organizer,
        nonceId,
      ]
    );
    res.status(200).send("Event created successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating event" });
  }
});

// Read
app.get("/data", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM events");
    res.json({ events: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving events" });
  }
});

// Read specific data
app.get("/data/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM events WHERE id = $1", [
      req.params.id,
    ]);
    res.json({ events: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving events" });
  }
});

// Update
app.put("/data/:id", async (req, res) => {
  const { id } = req.params;
  const eventData = req.body;
  try {
    await pool.query(
      "UPDATE events SET title = $1, description = $2, date = $3, numberOfTickets = $4, numberOfAvailableTickets = $5, ticketPrices = $6, venue = $7, organizer = $8, nonceId = $9 WHERE id = $10",
      [
        eventData.title,
        eventData.description,
        eventData.date,
        eventData.numberOfTickets,
        eventData.numberOfAvailableTickets,
        eventData.ticketPrices,
        eventData.venue,
        eventData.organizer,
        eventData.nonceId,
        id,
      ]
    );
    res.status(200).send("Event updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating event" });
  }
});

// Delete
app.delete("/data/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM events WHERE id = $1", [id]);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting event" });
  }
});

//Create reservation
app.post("/reserve/:id", async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const eventId = req.params.id;

    const query =
      "INSERT INTO reservations (orderId, eventId, status) VALUES ($1, $2, $3)";
    await pool.query(query, [orderId, eventId, status]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// Generate QR code
app.get("/qrcode/:id", async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query("SELECT * FROM events WHERE id = $1", [id]);
  const data = rows[0];

  if (!data) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.setHeader("Content-Type", "image/png");
  res.setHeader("Content-Disposition", "attachment; filename=qr.png");
  const img = await QRCode.toBuffer(JSON.stringify(data));
  res.send(img);
});

// Read QR code
app.post("/readqrcode", async (req, res) => {
  const data = JSQR(req.body.imageData, req.body.width, req.body.height);
  if (data) {
    const parsedData = JSON.parse(data.data);
    const { rows } = await pool.query("SELECT * FROM events WHERE id = $1", [
      parsedData.id,
    ]);
    const eventData = rows[0];

    if (!eventData) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(eventData);
  } else {
    res.json({});
  }
});

async function getPgVersion() {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT version()");
    console.log(result.rows[0]);
  } finally {
    client.release();
  }
  console.log("Successfully Connected into Postgres Database!");
}
getPgVersion();

app.listen(3000, () => console.log("Server started on port 3000"));
