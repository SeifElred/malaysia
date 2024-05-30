const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { openDB, getAllPlaces, addPlace, updatePlace, deletePlace, getPlaceById } = require('./database'); // Make sure getPlaceById is imported
const { HTTP_STATUS_CODES } = require('./constants');
const app = express();
const PORT = 3000;

// Configure CORS middleware
app.use(cors({
    origin: 'http://127.0.0.1:3001', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specified HTTP methods
    allowedHeaders: ['Content-Type'], // Allow specified headers
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

openDB(); // Open the database connection

app.get('/places/:id', async (req, res, next) => {
    try {
        const placeId = req.params.id;
        const place = await getPlaceById(placeId); // Fetch place from database by ID
        if (place) {
            res.json(place);
        } else {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ error: 'Place not found' });
        }
    } catch (error) {
        next(error);
    }
});

// Route to retrieve all places
app.get('/places', async (req, res, next) => {
    try {
        const places = await getAllPlaces();
        res.json(places);
    } catch (error) {
        next(error);
    }
});

// Route to add a new place with validation
app.post('/places', validatePlace, async (req, res, next) => {
    try {
        const place = req.body;
        const result = await addPlace(place);
        res.status(HTTP_STATUS_CODES.CREATED).send('ADDED A PLACE SUCCESSFULLY');
    } catch (error) {
        next(error);
    }
});

// Route to update a place
app.put('/places/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const place = req.body;
        const result = await updatePlace(id, place);
        if (result === 0) {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ message: 'Place not found' });
        } else {
            res.status(HTTP_STATUS_CODES.OK).send('UPDATED A PLACE SUCCESSFULLY');
        }
    } catch (error) {
        next(error);
    }
});

// Route to delete a place
app.delete('/places/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await deletePlace(id);
        if (result === 0) {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ message: 'Place not found' });
        } else {
            res.status(HTTP_STATUS_CODES.OK).send('DELETED A PLACE SUCCESSFULLY');
        }
    } catch (error) {
        next(error);
    }
});

// Handle preflight requests for CORS
app.options('*', cors());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
});

// Input validation function for adding a place
function validatePlace(req, res, next) {
    const { name, photos } = req.body;
    if (!name || !photos) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: 'Name and thumbnail image are required' });
    }
    next();
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});