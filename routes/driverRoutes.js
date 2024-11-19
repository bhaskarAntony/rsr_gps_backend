const express = require('express');
const { loginDriver, getRoutes, startTrip, endTrip, registerDriver, getAllDrivers, tripDetails } = require('../controlls/driverController');
const driver = require('../models/driver');
const Trip = require('../models/Trip');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', loginDriver);
router.post('/register', registerDriver);//tested
// router.get('/', getAllDrivers); //tested

router.get('/verify', protect, async (req, res) => {
  try {
    const user = await driver.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
router.get("/:driverId/routes", async (req, res) => {
    const { driverId } = req.params;
    try {
      const routes = await driver.findById(driverId);
      res.json(routes);
    } catch (error) {
      res.status(400).json({ error: "Invalid Driver ID" });
    }
  });
router.post('/start-trip', startTrip); //tested
router.patch('/end-trip/:tripId', endTrip);//tested
router.get('/trip/details/:tripId', tripDetails);//tested


// Start a Trip
router.post('/start', async (req, res) => {
    const { driverId, route, startLocation, liveLocationLink } = req.body;
    console.log(req.body);
    
  
    try {
      const newTrip = new Trip({ driverId, route, liveLocationLink, startLocation, startTime: new Date() });
      await newTrip.save();

      const driverdata = await driver.findById(driverId);
      driverdata.startedTripId = newTrip._id;
      driverdata.isIntrip = true;
      driverdata.startedRoute = route;
      driverdata.save()
      console.log(driverdata);
      
      res.status(201).json({ message: 'Trip started successfully', trip: newTrip, driver:driverdata});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  router.get('/trip/list/:tripId', async(req, res)=>{
    const {tripId} = req.params;
    console.log(tripId);
    
        try {
           const tripData = await Trip.findById(tripId);
           console.log(tripData);
           
        res.status(200).json({
            data:tripData
        }) 
        } catch (error) {
            res.status(500).json({
                data:'error'
            })
        }
  })
  
  // Update Trip Status
  router.patch('/:tripId/status', async (req, res) => {
    const { tripId } = req.params;
    const { status, endLocation} = req.body;
    console.log(tripId);
    try {
      const driverData = await driver.findById(tripId);
      console.log(driverData);
      
      if (!driverData) return res.status(404).json({ message: 'driver not found' });
  
      const tripData = await Trip.findById(driverData.startedTripId)
      console.log(tripData);
      
      if (status === 'completed'){ 
        tripData.endTime = new Date();
        tripData.endLocation = endLocation;

        const driverdata = await driver.findById(tripId);
        driverdata.startedTripId = '';
        driverdata.isIntrip = false;
        driverdata.startedRoute = '';
        driverdata.myTrips.push(driverData.startedTripId);
        await driverdata.save();

        console.log(driverdata);
    }
        
      tripData.status = status;
  
      await tripData.save();
      res.status(200).json({ message: 'Trip status updated successfully', tripData, driver:driverData });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get All Trips (Admin View)
  router.get('/trips', async (req, res) => {
    try {
      const trips = await Trip.find()
      res.status(200).json(trips);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
