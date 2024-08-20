// Setup App
const pool = require('./database')
const express = require('express');
const app = express();

// Setup Middleware
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.json())

// Setup Routes
const customerRoutes = require('./routes/customer')
const fineRoutes = require('./routes/fines')
const itemRoutes = require('./routes/items')
app.use('/api/customers', customerRoutes)
app.use('/api/fines', fineRoutes)
app.use('/api/items', itemRoutes)

// Start
require('dotenv').config({
    path: '../frontend/.env'
})
app.listen(3000, process.env.VITE_SERVER_URL, async () => {
    const initializeQuery = require('./initialState')
    await pool.query(initializeQuery);
    console.log(`Server is running on http://${process.env.VITE_SERVER_URL}:3000`);
});