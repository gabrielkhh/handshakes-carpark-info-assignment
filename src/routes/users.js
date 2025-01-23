const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

/**
 * @swagger
 * /api/users/favourite:
 *   post:
 *     summary: Saves a carpark as a favourite for the user
 *     description: Saves a carpark as a favourite for the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: number
 *                 example: 69
 *               cpNo:
 *                 type: string
 *                 example: ACM
 *     responses:
 *       201:
 *         description: Favourite saved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: true
 *       500:
 *         description: Internal Server Error. Database query failed.
 */
router.post('/favourite', usersController.addFavourite);

module.exports = router;