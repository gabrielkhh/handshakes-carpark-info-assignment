const Database = require('better-sqlite3');

// Connect to SQLite database
const db = new Database('./carpark.db', { verbose: console.log });

exports.findCarparks = (isFree, isOvernight, height) => {
    let query = `SELECT
    carparks.cp_no,
    carparks.address,
    carparks.x_coord,
    carparks.y_coord,
    carparks.decks,
    carparks.gantry_height,
    carparks.has_basement,
    free_parking.type AS free_parking
    FROM carparks
    JOIN free_parking ON carparks.free_parking_id = free_parking.id
    WHERE
        (CASE WHEN @isFree = 1 THEN free_parking.type <> 'NO' ELSE 1 END)
        AND
        (CASE WHEN @isOvernight = 1 THEN carparks.night_parking = 1 ELSE 1 END)
        AND
        (CASE WHEN @height <> NULL THEN carparks.gantry_height > @height OR carparks.gantry_height = 0.0 ELSE 1 END);`;

    const stmt = db.prepare(query);
    const carparksResult = stmt.all({
        isFree: isFree ? 1 : 0,
        isOvernight: isOvernight ? 1 : 0,
        height: height !== undefined ? height : null
    });

    return carparksResult
}