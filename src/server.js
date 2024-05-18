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
    venue,
    organizer,
    nonceId,
  } = req.body;
  try {
    await pool.query(
      "INSERT INTO events (title, description, date, numberOfTickets, venue, organizer, nonceId) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [title, description, date, numberOfTickets, venue, organizer, nonceId]
    );
    res.json({ message: "Event created successfully" });
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

// Update
app.put("/data/:id", async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;
  await pool.query("UPDATE data SET data = $1 WHERE id = $2", [data, id]);
  res.json({ success: true });
});

// Delete
app.delete("/data/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM data WHERE id = $1", [id]);
  res.json({ success: true });
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
