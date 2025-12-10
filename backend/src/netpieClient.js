import mqtt from "mqtt";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();
let latestSensorData = null;
let buffer = [];
let alerts = [];
const createAlert = (type, message, severity = "warning") => {
    alerts.push({
        id: crypto.randomUUID(),
        type,
        message,
        severity,
        timestamp: new Date(),
    });

    if (alerts.length > 30) alerts.shift();
};
const client = mqtt.connect("wss://mqtt.netpie.io/mqtt", {
    clientId: process.env.NETPIE_CLIENT_ID,
    username: process.env.NETPIE_USERNAME,
    password: process.env.NETPIE_SECRET,
    keepalive: 60,
});

client.on("connect", () => {
    console.log("🚀 Connected to NETPIE MQTT");
    client.subscribe("@msg/sensor");
});

// client.on('offline', ()=>{
//     console.log('MQTT disconnected')
// })

client.on('disconnect', ()=>{
    console.log('MQTT was told to disconnect')
})

client.on("message", async (topic, message) => {
    const raw = message.toString().trim();
    

    if (buffer.length > 50) buffer.shift();
    try {
        const obj = {};
        const pairs = raw.split(";").filter(Boolean); // ["U:165.66", "V:1", "R:0"]
        pairs.forEach((pair) => {
            const [key, val] = pair.split(":");
            if (!key || val === undefined) return;
            const parsedNumber = Number(val);
            const parsedValue = Number.isNaN(parsedNumber) ? val : parsedNumber;
            if (key === "U") obj.distance = parsedValue;
            if (key === "V") obj.tilt = parsedValue;
            if (key === "R") obj.accident = parsedValue;
        });
        latestSensorData = obj;
        buffer.push(obj);
        const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";
        const response = await fetch(`${backendUrl}/api/sensor`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(obj),
        });
        if (!response.ok) {
            throw new Error(`Backend responded with ${response.status}`);
        }
        console.log("➡️ Forwarded to backend endpoint");

    } catch (err) {
        console.error("Error processing MQTT data:", err);
    }
});
export { latestSensorData, buffer, alerts, createAlert };
