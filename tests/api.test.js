const { app } = require('../index');
const request = require('supertest');

describe(' API Tests', () => {
  test('Test 1: Retrieve All Packages', async () => {
    const response = await request(app).get('/packages');
    expect(response.status).toBe(200);
  });

  test('Test 2: Retrieve Package by Destination', async () => {
    const response = await request(app).get('/packages/Paris');
    expect(response.status).toBe(200);
    expect(response.body.package.destination).toBe('Paris');
  });

  test('Test 3: Add a New Booking', async () => {
    const result = {
        packageId: 5,
        customerName: "test",
        bookingDate: '2024-12-01',
        seats: 3,
    };
    const response = await request(app).post('/bookings').send(result);
    expect(response.status).toBe(201);
    expect(response.body.booking.packageId).toBe(5);
  });

  test('Test 4: Update Available Slots', async () => {
    const slodUpdate = {
        packageId: 5,
        seatsBooked: 2,
    };
    const response = await request(app).post('/packages/update-seats').send(slodUpdate);
    expect(response.status).toBe(200);
  });

  test('Test 5: Retrieve Bookings for a Package', async () => {
    const packageId = 1;
    const response = await request(app).get(`/bookings/${packageId}`);
    
    expect(response.status).toBe(200);
    
    const { bookings } = response.body;
    expect(bookings.packageId).toBe(packageId);
  });
  

});
