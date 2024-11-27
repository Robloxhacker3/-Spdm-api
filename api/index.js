// File: api/index.js

const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json()); // Parse JSON request bodies

// In-memory database for storing keys
const keys = new Map(); // { key: { userId: "12345", isValid: true, createdAt: timestamp, lootlabsLink: "URL" } }

// Generate a new key with a LootLabs link
app.post("/generate-key", (req, res) => {
    const { userId, lootlabsLink } = req.body;

    if (!userId || !lootlabsLink) {
        return res.status(400).json({ error: "Missing userId or lootlabsLink in request body" });
    }

    // Generate a unique key
    const apiKey = uuidv4();

    // Save the key in the database
    keys.set(apiKey, {
        userId,
        isValid: true,
        createdAt: new Date().toISOString(),
        lootlabsLink,
    });

    res.status(200).json({
        message: "Key generated successfully",
        apiKey,
        lootlabsLinkWithKey: `${lootlabsLink}?key=${apiKey}`, // Append the key to the link
    });
});

// Validate a key
app.get("/validate-key/:key", (req, res) => {
    const { key } = req.params;

    if (!keys.has(key)) {
        return res.status(404).json({ valid: false, error: "Key not found" });
    }

    const keyInfo = keys.get(key);
    if (!keyInfo.isValid) {
        return res.status(400).json({ valid: false, error: "Key is invalid or already used" });
    }

    res.status(200).json({
        valid: true,
        userId: keyInfo.userId,
        lootlabsLink: keyInfo.lootlabsLink,
        createdAt: keyInfo.createdAt,
    });
});

// Invalidate a key after use
app.post("/invalidate-key", (req, res) => {
    const { key } = req.body;

    if (!key || !keys.has(key)) {
        return res.status(404).json({ error: "Key not found" });
    }

    const keyInfo = keys.get(key);

    if (!keyInfo.isValid) {
        return res.status(400).json({ error: "Key is already invalidated" });
    }

    // Invalidate the key
    keys.set(key, { ...keyInfo, isValid: false });

    res.status(200).json({ message: "Key invalidated successfully" });
});

// Default handler for unknown routes
app.use((req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
});

// Export the app for Vercel
module.exports = app;
