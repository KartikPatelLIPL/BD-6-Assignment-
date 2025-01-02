const express = require('express');
const { travelPackages, bookings } = require('./travelData');
const app = express();
const port = 3000;

app.use(express.json())

// Exercise 1: Retrieve All Travel Packages (GET)
app.get('/packages', (req, res) => {
  try {
    res.status(200).json({ packages: travelPackages });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Exercise 2: Retrieve Travel Package by Destination (GET)

app.get('/packages/:destination', (req, res) => {
  let destination = req.params.destination;
  try {
    const bookings = travelPackages.find((i) => i.destination === destination);
    res.status(200).json({ package: bookings });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Exercise 3: Add a New Booking  (POST)

app.post('/bookings', (req, res) => {
  const { packageId, customerName, bookingDate, seats } = req.body;

  if (!packageId || !customerName || !bookingDate || !seats) {
    return res
      .status(400)
      .json({ error: 'Invalid input. All fields are required.' });
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

// Exercise 4: Update Available Slots for a Package(POST)

app.post('/packages/update-seats', (req, res) => {
  const { packageId, seatsBooked} = req.body;

  if (!packageId || !seatsBooked) {
    return res
      .status(400)
      .json({ error: 'Invalid input. All fields are required.' });
  }
  let result = travelPackages.find((i) => i.availableSlots = i.availableSlots - seatsBooked)
  res.status(200).json({ package: result });
});

// ## **Exercise 5: Retrieve All Bookings for a Package (`GET`)**

app.get('/bookings/:packageId', (req, res) => {
  const packageId = parseInt(req.params.packageId);
  console.log(packageId)
  try {
    const result = bookings.find((i) => i.packageId === packageId);
    res.status(200).json({ bookings: result });
  } catch (error) {
    res.status(500).json({ error: error });
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


module.exports = {app}