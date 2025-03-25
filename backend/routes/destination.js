const express = require("express");
const router = express.Router();
const {
    getAllDestinations,
    getDestinationById,
    addDestination,
    updateDestination,
    deleteDestination
} = require("../models/destination");

// Get all destinations
router.get("/", async (req, res) => {
    try {
        const destinations = await getAllDestinations();
        res.json(destinations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single destination by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const destination = await getDestinationById(id);
        if (!destination) {
            return res.status(404).json({ message: "Destination not found" });
        }
        res.json(destination);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a new destination
router.post("/", async (req, res) => {
    try {
        const destination = req.body;
        if (!destination.name || !destination.location) {
            return res.status(400).json({ message: "Name and location are required" });
        }
        const result = await addDestination(destination);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a destination
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const destination = req.body;
        const result = await updateDestination(id, destination);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a destination
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteDestination(id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
