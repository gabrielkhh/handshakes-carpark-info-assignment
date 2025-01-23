const express = require('express');
const router = express.Router();
const carparkController = require('../controllers/carparkController');

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
 *               height:
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
 *                 carparksResult:
 *                   type: array
 *                   items:
 *                      type: object    
 *                      properties:
*                           cp_no:
*                               type: string
*                               example: ACM
*                           address:
*                               type: string
*                               example: BLK 98A ALJUNIED CRESCENT
*                           x_coord:
*                               type: number
*                               example: 33962.531
*                           y_coord:
*                               type: number
*                               example: 33590.169
*                           decks:
*                               type: integer
*                               example: 1
*                           gantry_height:
*                               type: number
*                               example: 2.1
*                           has_basement:
*                               type: integer
*                               example: 0
*                           free_parking:
*                               type: string
*                               example: NO
 *       500:
 *         description: Internal Server Error. Database query failed.
 */
router.post('/find', carparkController.find);

module.exports = router;