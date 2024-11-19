const driver = require('../models/driver');
const Driver = require('../models/driver');
const Trip = require('../models/Trip');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

// Register a new driver with routes
exports.registerDriver = async (req, res) => {
    const { name, email, phoneNumber, password, routes, cabNo } = req.body;
  
    try {
      // Check if driver already exists
      const existingDriver = await Driver.findOne({ email });
      if (existingDriver) {
        return res.status(400).json({ message: 'Driver with this email already exists' });
      }
  
      // Create a new driver
      const driver = new Driver({
        name,
        email,
        phoneNumber,
        password,
        cabNo,
        routes,
      });
  
      await driver.save();
  
      res.status(201).json({ message: 'Driver registered successfully', driver });
    } catch (error) {
      res.status(500).json({ message: 'Error registering driver', error: error.message });
    }
  };

// Driver login
exports.loginDriver = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  
  try {
    const user = await driver.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({
            message: 'Invalid credentials',
        });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });

    res.json({
        token,
        user: {
            user:user

        },
    });
} catch (error) {
  console.log(error);

    res.status(500).json({
        data:error,
        message: 'Server error',
    });
}
};

// Get assigned routes
exports.getRoutes = async (req, res) => {
  const { driverId } = req.params;
  try {
    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Start a trip
exports.startTrip = async (req, res) => {
  const { driverId, routeName, googleMapLink } = req.body;
  try {
    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });

    const route = driver.routes.find((r) => r.routeName === routeName);
    if (!route) return res.status(404).json({ error: 'Route not found' });

    const trip = await Trip.create({
      driver: driverId,
      routeName,
      startPoint: route.startPoint,
      endPoint: route.endPoint,
      googleMapLink,
      startTime: new Date(),
    });

    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// End a trip
exports.endTrip = async (req, res) => {
  const { tripId } = req.params;
  try {
    const trip = await Driver.findById(tripId);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    trip.status = 'Completed';
    trip.endTime = new Date();
    await trip.save();

    res.json({ message: 'Trip completed', trip });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.tripDetails = async (req, res) => {
    const { tripId } = req.params;
    try {
      const trip = await driver.findById(tripId);
      if (!trip) return res.status(404).json({ error: 'Trip not found' });
  
    
      res.json({ trip });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Fetch all drivers (for admin use)
exports.getAllDrivers = async (req, res) => {
    try {
      const drivers = await Driver.find();
      res.status(200).json(drivers);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching drivers', error: error.message });
    }
  };