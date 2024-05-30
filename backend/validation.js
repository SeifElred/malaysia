function validatePlace(req, res, next) {
    const { name, photos } = req.body;
    if (!name || !photos) {
        return res.status(400).json({ error: 'Name and thumbnail image are required' });
    }
    next();
}

function validateUpdate(req, res, next) {
    // Add validation logic for updating a place if needed
    next();
}

module.exports = { validatePlace, validateUpdate };
