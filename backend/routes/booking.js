const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const Booking = require('../models/booking');

// ✅ Create a new booking (Authenticated users only)
router.post('/', authenticateUser, async (req, res) => {
    try {
        const { destination_id, start_date, end_date, number_of_people, total_price } = req.body;
        const user_id = req.user?.user_id; // Ensure user exists

        if (!user_id) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        if (!destination_id || !start_date || !end_date || !number_of_people || !total_price) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const bookingId = await Booking.createBooking(user_id, destination_id, start_date, end_date, number_of_people, total_price);
        res.status(201).json({ message: 'Booking created successfully', booking_id: bookingId });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// ✅ Get all bookings for the logged-in user
router.get('/', authenticateUser, async (req, res) => {
    try {
        const user_id = req.user?.user_id;

        if (!user_id) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        const bookings = await Booking.getUserBookings(user_id);
        res.json(bookings);
    } catch (error) {
        console.error('Error retrieving bookings:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// ✅ Update an existing booking (Authenticated users only)
router.put('/:booking_id', authenticateUser, async (req, res) => {
    try {
        const { booking_id } = req.params;
        const { start_date, end_date, number_of_people, total_price } = req.body;

        if (!booking_id) {
            return res.status(400).json({ message: 'Booking ID is required' });
        }

        if (!start_date || !end_date || !number_of_people || !total_price) {
            return res.status(400).json({ message: 'All fields are required for update' });
        }

        const updated = await Booking.updateBooking(booking_id, start_date, end_date, number_of_people, total_price);
        if (!updated) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json({ message: 'Booking updated successfully' });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// ✅ Cancel a booking (Authenticated users only)
router.delete('/:booking_id', authenticateUser, async (req, res) => {
    try {
        const { booking_id } = req.params;

        if (!booking_id) {
            return res.status(400).json({ message: 'Booking ID is required' });
        }

        const canceled = await Booking.cancelBooking(booking_id);
        if (!canceled) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json({ message: 'Booking canceled successfully' });
    } catch (error) {
        console.error('Error canceling booking:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;
