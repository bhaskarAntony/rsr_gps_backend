const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  route: { type: String, required: true },
  liveLocationLink: { type: String, required: true },
  status: { type: String, enum: ['in_progress', 'paused', 'completed'], default: 'in_progress' },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  startLocation:{type:Object},
  endLocation:{type:Object},
});


module.exports = mongoose.model('RSRTrip', tripSchema);
