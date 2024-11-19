const driver = require('../models/driver');
const Trip = require('../models/Trip');

exports.getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find();
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSingleTrip = async (req, res) => {
  const {id} = req.params;
  try {
    const tripData = await Trip.findById(id);
    console.log(tripData);
    
    const driverData = await driver.findById(tripData.driverId);
    const routesData = driverData.routes.find((item)=>item._id == tripData.route)
    res.json({
      tripData:tripData,
      driverData:driverData,
      routesData:routesData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
