const Database = require('better-sqlite3');

// Connect to SQLite database
const db = new Database('./carpark.db', { verbose: console.log });

exports.addFavourite = (cpNo, userId) => {
    const insertFavourite = db.prepare(`
        INSERT INTO favourites (user_id, cp_no)
        VALUES (?, ?)
        ON CONFLICT (user_id, cp_no) DO NOTHING
    `);
 
    try {
        insertFavourite.run(userId, cpNo);
        return true
    } catch (error) {
        return false
    }
}