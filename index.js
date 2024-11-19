const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const driverRoutes = require('./routes/driverRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/admin', adminRoutes);
app.use('/api/driver', driverRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
