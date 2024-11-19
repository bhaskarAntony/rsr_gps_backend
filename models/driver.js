const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define employee schema
const employeesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    startPoint: { type: String, required: true },
    endPoint: { type: String, required: true },
});

// Define driver schema
const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phoneNumber: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  cabNo: { type: String, required: true },
  startedTripId: { type: String },
  isIntrip: { type: Boolean, default: false },
  startedRoute: { type: String },
  myTrips: { type: [String], default: [] },
  routes: [
    {
      routeName: { type: String, required: true },
      employees: [employeesSchema],  // Array of employee objects
    },
  ],
});

driverSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
// Hash password before saving
driverSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Create and export driver model
module.exports = mongoose.model('RSR_Drivers', driverSchema);
