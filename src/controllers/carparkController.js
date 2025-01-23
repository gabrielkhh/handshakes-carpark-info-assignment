const Carpark = require('../models/carparkModel');

exports.find = async (req, res) => {
    const { isFree, isOvernight, maxHeight } = req.body;

    try {
        const carparksResult = await Carpark.findCarparks(isFree, isOvernight, maxHeight);
        res.json({ carparksResult });
    } catch (error) {
        res.status(500).json({ error: 'Database query failed', details: error.message });
    }
}