const express = require('express');
const { travelPackages, bookings } = require('./travelData');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/packages', (req, res) => {
  try {
    res.status(200).json({ packages: travelPackages });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error: ' + error.message });
  }
});

app.get('/packages/:destination', (req, res) => {
  let destination = req.params.destination;
  try {
    const package = travelPackages.find((pkg) => pkg.destination === destination);
    if (!package) {
      return res.status(404).json({ error: 'Package not found for destination: ' + destination });
    }
    res.status(200).json({ package });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error: ' + error.message });
  }
});

app.post('/bookings', (req, res) => {
  const { packageId, customerName, bookingDate, seats } = req.body;

  if (!packageId || !customerName || !bookingDate || !seats) {
    return res.status(400).json({ error: 'Invalid input. All fields are required.' });
  }

  const newBooking = {
    bookingId: bookings.length + 1,
    packageId,
    customerName,
    bookingDate,
    seats,
  };

  bookings.push(newBooking);
  res.status(201).json({ booking: newBooking });
});

app.post('/packages/update-seats', (req, res) => {
  const { packageId, seatsBooked } = req.body;

  if (!packageId || !seatsBooked) {
    return res.status(400).json({ error: 'Invalid input. Both packageId and seatsBooked are required.' });
  }

  const package = travelPackages.find((pkg) => pkg.packageId === packageId);

  if (!package) {
    return res.status(404).json({ error: 'Package not found for ID: ' + packageId });
  }

  if (seatsBooked > package.availableSlots) {
    return res.status(400).json({ error: 'Not enough available seats for the package.' });
  }

  package.availableSlots -= seatsBooked;
  res.status(200).json({ package });
});

app.get('/bookings/:packageId', (req, res) => {
  const packageId = parseInt(req.params.packageId);

  try {
    const packageBookings = bookings.filter((booking) => booking.packageId === packageId);

    if (packageBookings.length === 0) {
      return res.status(404).json({ error: 'No bookings found for package ID: ' + packageId });
    }

    res.status(200).json({ bookings: packageBookings });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error: ' + error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = { app };
