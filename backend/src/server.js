import express from "express";
import "./netpieClient.js"; // โหลด NETPIE listener
import { latestSensorData, buffer,alerts,createAlert } from "./netpieClient.js";
import prisma from "./lib/prisma.js";
import cors from "cors";
const app = express();
app.use(cors({
  origin: "http://localhost:3000",   // your Next.js frontend
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/api/sensor/history", (req, res) => {
    return res.json(buffer.slice(-20));
})
app.get("/api/sensor", (req, res) => {
    if (!latestSensorData) {
        return res.status(404).json({ error: "No data yet" });
    }
    res.json(latestSensorData);
});
app.get("/api/alerts", (req, res) => {
    res.json(alerts);
});
app.post("/api/sensor", async (req, res) => {
    const sensor = req.body;
    console.log("🔥 Incoming sensor via endpoint:", sensor);
    if (sensor.distance < 20) {
        console.log("🚨 Distance below threshold!");
        createAlert("ultrasonic", `Object detected at ${sensor.distance} cm`, "danger");
        try {
            await prisma.sensorEvent.create({
                data: {
                    type: "DISTANCE",
                    value: sensor.distance,
                    threshold: 20,
                }
            });
        }
        catch (err) {
            console.log("Error writing ultrasonic to db :", err)
        }
    }
    if (!sensor.tilt) {
        console.log("not stabled");
        createAlert("tilt", `Tilt reading too high: ${sensor.tilt}`, "danger");
        try {
            await prisma.sensorEvent.create({
                data: {
                    type: "TILT",
                    value: sensor.tilt,
                    threshold: 1.0,
                }
            });
        }
        catch (err) {
            console.log("Error writing tilt to db :", err)
        }
    }
    if (sensor.accident) {
        try {
            await prisma.sensorEvent.create({
                data: {
                    type: "ACCIDENT",
                    value: sensor.accident,
                    threshold: 1.0,
                }
            });
        }
        catch (err) {
            console.log("Error writing accident to db :", err)
        }
        console.log("🚑 Accident detected!");
        createAlert("accident", "Accident detected!", "danger");
    }

    res.json({ ok: true, received: sensor });
});


app.listen(8000, () => {
    console.log("Server started on port 8000");
});
