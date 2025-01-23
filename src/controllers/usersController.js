const User = require('../models/userModel');

exports.addFavourite = async (req, res) => {
    const { cpNo, userId } = req.body;

    try {
        const addFavouriteResult = await User.addFavourite(cpNo, userId);

        res.json({ success: addFavouriteResult });
    } catch (error) {
        res.status(500).json({ error: 'Database query failed', details: error.message });
    }
}