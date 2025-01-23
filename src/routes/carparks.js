const express = require('express');
const Database = require('better-sqlite3');
const router = express.Router();

// Connect to SQLite database
const db = new Database('./carpark.db', { verbose: console.log });

/**
 * @swagger
 * /api/carparks/find:
 *   post:
 *     summary: Finds carparks based on the search criteria in the request body
 *     description: Finds carparks based on the search criteria in the request body
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isFree:
 *                 type: boolean
 *                 example: true
 *               isOvernight:
 *                 type: boolean
 *                 example: false
 *               maxHeight:
 *                 type: number
 *                 example: 2.1
 *     responses:
 *       201:
 *         description: Carparks found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: johndoe@example.com
 *       400:
 *         description: Invalid input
 */
router.post('/carparks/find', (req, res) => {
    const { isFree, isOvernight, maxHeight } = req.body;

    try {
        let query = `SELECT
            carparks.cp_no,
            carparks.address,
            carparks.x_coord,
            carparks.y_coord,
            carparks.decks,
            carparks.gantry_height,
            carparks.has_basement,
            free_parking.type AS free_parking,
            FROM carparks
            JOIN free_parking ON carparks.free_parking_id = free_parking.id
            WHERE
                (CASE WHEN @isFree = 1 THEN free_parking.type <> 'NO' ELSE 1 END)
                AND
                (CASE WHEN @isOvernight = 1 THEN carparks.night_parking = 1 ELSE 1 END);`;

        // let query = `SELECT * FROM carparks`;

        const stmt = db.prepare(query);
        const carparksResult = stmt.all({
            isFree: isFree ? 1 : 0,
            isOvernight: isOvernight ? 1 : 0,
          });

        res.json({ carparksResult });
    } catch (error) {
        res.status(500).json({ error: 'Database query failed', details: error.message });
    }
});

module.exports = router;